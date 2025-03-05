# youtube_search.py
import openai
import concurrent.futures
from googleapiclient.discovery import build
from app.core.config import settings
from app.utils.prompts.youtube_prompts import RECIPE_VALIDATOR_SYSTEM_MESSAGE, get_recipe_validation_prompt


def search_youtube_recipe(dish: str, max_results=None) -> list:
    # 기본값 사용
    if max_results is None:
        max_results = settings.YOUTUBE_MAX_RESULTS

    # YouTube API 클라이언트 초기화
    youtube = build("youtube", "v3", developerKey=settings.YOUTUBE_API_KEY)

    # 검색어 구성
    query = f"{dish} 레시피"

    # API 검색 요청
    request = youtube.search().list(
        part="snippet",
        q=query,
        maxResults=max_results,
        type="video"
    )
    response = request.execute()

    # 결과 추출
    results = []
    for item in response.get("items", []):
        video_id = item["id"]["videoId"]
        video_title = item["snippet"]["title"]
        video_url = f"https://www.youtube.com/watch?v={video_id}"
        results.append({"title": video_title, "url": video_url})

    return results


def validate_recipe_video(dish_name: str, video_title: str) -> float:
    """영상 제목이 요리 이름과 얼마나 관련이 있는지 검증하고 관련성 점수를 반환합니다."""

    # OpenAI API 호출
    try:
        user_prompt = get_recipe_validation_prompt(dish_name, video_title)

        response = openai.chat.completions.create(
            model=settings.VIDEO_VALIDATION_MODEL,
            messages=[
                {"role": "system", "content": RECIPE_VALIDATOR_SYSTEM_MESSAGE},
                {"role": "user", "content": user_prompt}
            ],
            max_tokens=20,  # 숫자만 필요하므로 짧게 설정
            temperature=settings.VIDEO_VALIDATION_TEMPERATURE
        )

        # 응답에서 점수 추출
        score_str = response.choices[0].message.content.strip()

        # 문자열에서 숫자만 추출
        try:
            score = float(score_str)
            # 범위 확인
            score = max(0.0, min(1.0, score))
            return score
        except ValueError:
            print(f"경고: 점수 변환 실패. 원본 응답: '{score_str}'. 기본값 0.5 사용.")
            return 0.5

    except Exception as e:
        print(f"영상 검증 중 오류 발생: {e}")
        return 0.5  # 오류 발생 시 중간 점수 반환


def get_youtube_videos(dish):
    """
    요리 이름으로 유튜브 비디오를 검색하고, 설정에 따라 검증을 수행합니다.
    병렬 처리를 통해 여러 영상을 동시에 검증합니다.
    """
    # 기본 검색 수행
    videos = search_youtube_recipe(dish)
    
    # 검증 설정이 활성화된 경우에만 검증 수행
    if settings.VIDEO_VALIDATION_ENABLED and videos:
        # 병렬 검증 처리
        with concurrent.futures.ThreadPoolExecutor(max_workers=len(videos)) as executor:
            # 각 비디오에 대한 검증 작업 제출
            future_to_video = {executor.submit(validate_recipe_video, dish, video["title"]): video 
                               for video in videos}
            
            # 결과 수집
            for future in concurrent.futures.as_completed(future_to_video):
                video = future_to_video[future]
                try:
                    score = future.result()
                    video["relevance_score"] = score
                except Exception as e:
                    print(f"영상 '{video['title']}' 검증 중 오류: {e}")
                    video["relevance_score"] = 0.5  # 오류 시 중간값 부여
        
        # 관련성 점수에 따라 결과 정렬
        videos.sort(key=lambda x: x["relevance_score"], reverse=True)
    
    return videos