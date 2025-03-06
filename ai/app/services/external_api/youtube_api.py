import asyncio
import openai
from googleapiclient.discovery import build
from app.core.config import settings
from app.utils.prompts.youtube_prompts import RECIPE_VALIDATOR_SYSTEM_MESSAGE, get_recipe_validation_prompt
from datetime import timedelta

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
    
    # 1단계: 검색 API를 사용하여 비디오 ID 가져오기
    search_request = youtube.search().list(
        part="snippet",
        q=query,
        maxResults=max_results,
        type="video"
    )
    search_response = search_request.execute()
    
    # 검색 결과에서 비디오 ID 추출
    video_ids = [item["id"]["videoId"] for item in search_response.get("items", [])]
    
    if not video_ids:
        return []
    
    # 2단계: 비디오 세부 정보 가져오기
    videos_request = youtube.videos().list(
        part="snippet,contentDetails,statistics",
        id=",".join(video_ids)
    )
    videos_response = videos_request.execute()
    
    results = []
    for item in videos_response.get("items", []):
        video_id = item["id"]
        video_data = {
            "title": item["snippet"]["title"],
            "url": f"https://www.youtube.com/watch?v={video_id}",
            "description": item["snippet"]["description"],
            "channel_title": item["snippet"]["channelTitle"],
            "published_at": item["snippet"]["publishedAt"]
        }
        
        # 동영상 길이 처리 (ISO 8601 형식을 사람이 읽기 쉬운 형식으로 변환)
        duration_iso = item["contentDetails"]["duration"]
        # PT1H30M15S 형식을 파싱하여 시:분:초 형태로 변환
        duration = _parse_duration(duration_iso)
        video_data["duration"] = duration
        
        # 통계 정보 추가
        if "statistics" in item:
            stats = item["statistics"]
            video_data["view_count"] = int(stats.get("viewCount", 0))
            video_data["like_count"] = int(stats.get("likeCount", 0)) if "likeCount" in stats else 0
            video_data["comment_count"] = int(stats.get("commentCount", 0)) if "commentCount" in stats else 0
        
        results.append(video_data)
    
    return results

def _parse_duration(duration_iso):
    """ISO 8601 형식의 지속 시간을 읽기 쉬운 형식으로 변환합니다."""
    # PT1H30M15S -> 1:30:15
    import re
    
    try:
        # 시간, 분, 초 추출을 위한 정규식 패턴
        hours_pattern = re.compile(r'(\d+)H')
        minutes_pattern = re.compile(r'(\d+)M')
        seconds_pattern = re.compile(r'(\d+)S')
        
        # 시간, 분, 초 추출
        hours_match = hours_pattern.search(duration_iso)
        minutes_match = minutes_pattern.search(duration_iso)
        seconds_match = seconds_pattern.search(duration_iso)
        
        hours = int(hours_match.group(1)) if hours_match else 0
        minutes = int(minutes_match.group(1)) if minutes_match else 0
        seconds = int(seconds_match.group(1)) if seconds_match else 0
        
        # 1시간 넘는 영상 예외처리
        if hours > 0:
            return "1시간 이상"
        
        # 분:초 형식으로 반환
        return f"{minutes}:{seconds:02d}"
    except:
        # 파싱에 실패한 경우 원래 값 반환
        return "알 수 없음"

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