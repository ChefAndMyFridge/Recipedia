import asyncio
import openai
from googleapiclient.discovery import build
from app.core.config import settings
from app.utils.prompts.youtube_prompts import RECIPE_VALIDATOR_SYSTEM_MESSAGE, get_recipe_validation_prompt

async def search_youtube_recipe(dish: str, max_results=None) -> list:
    """유튜브 레시피를 비동기적으로 검색합니다."""
    if max_results is None:
        max_results = settings.YOUTUBE_MAX_RESULTS

    # YouTube API는 비동기를 지원하지 않으므로 실행자에서 실행
    loop = asyncio.get_running_loop()
    result = await loop.run_in_executor(None, lambda: _sync_search_youtube_recipe(dish, max_results))
    return result

def _sync_search_youtube_recipe(dish: str, max_results) -> list:
    """동기식 YouTube API 호출 함수"""
    youtube = build("youtube", "v3", developerKey=settings.YOUTUBE_API_KEY)
    query = f"{dish} 레시피"
    
    request = youtube.search().list(
        part="snippet",
        q=query,
        maxResults=max_results,
        type="video"
    )
    response = request.execute()

    results = []
    for item in response.get("items", []):
        video_id = item["id"]["videoId"]
        video_title = item["snippet"]["title"]
        video_url = f"https://www.youtube.com/watch?v={video_id}"
        results.append({"title": video_title, "url": video_url})

    return results

async def validate_recipe_video(dish_name: str, video_title: str) -> float:
    """영상 제목의 관련성을 비동기적으로 검증합니다."""
    try:
        user_prompt = get_recipe_validation_prompt(dish_name, video_title)

        # OpenAI API 호출을 비동기로 변환
        loop = asyncio.get_running_loop()
        response = await loop.run_in_executor(
            None,
            lambda: openai.chat.completions.create(
                model=settings.VIDEO_VALIDATION_MODEL,
                messages=[
                    {"role": "system", "content": RECIPE_VALIDATOR_SYSTEM_MESSAGE},
                    {"role": "user", "content": user_prompt}
                ],
                max_tokens=20,
                temperature=settings.VIDEO_VALIDATION_TEMPERATURE
            )
        )

        score_str = response.choices[0].message.content.strip()
        
        try:
            score = float(score_str)
            return max(0.0, min(1.0, score))
        except ValueError:
            print(f"경고: 점수 변환 실패. 원본 응답: '{score_str}'. 기본값 0.5 사용.")
            return 0.5

    except Exception as e:
        print(f"영상 검증 중 오류 발생: {e}")
        return 0.5

async def get_youtube_videos(dish):
    """요리 이름으로 유튜브 비디오를 비동기적으로 검색하고 검증합니다."""
    videos = await search_youtube_recipe(dish)
    
    if settings.VIDEO_VALIDATION_ENABLED and videos:
        # 모든 비디오에 대해 동시에 검증 수행
        validation_tasks = []
        for video in videos:
            task = validate_recipe_video(dish, video["title"])
            validation_tasks.append(task)
        
        # 모든 검증 작업 동시 실행
        scores = await asyncio.gather(*validation_tasks)
        
        # 점수를 비디오에 적용
        for i, score in enumerate(scores):
            videos[i]["relevance_score"] = score
        
        # 관련성 점수에 따라 정렬
        videos.sort(key=lambda x: x["relevance_score"], reverse=True)
    
    return videos