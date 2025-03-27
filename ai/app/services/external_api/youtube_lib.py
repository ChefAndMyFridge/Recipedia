import asyncio
import re
from youtubesearchpython import CustomSearch
from app.core.config import settings
from googleapiclient.discovery import build
import logging

logger = logging.getLogger(__name__)


async def search_youtube_recipe(dish: str, max_results=None) -> list:
    """
    입력: 요리 이름, 최대 결과 수(선택)
    반환: 유튜브 동영상 정보 목록
    기능: 유튜브 레시피를 비동기적으로 검색
    """
    if max_results is None:
        max_results = settings.YOUTUBE_MAX_RESULTS

    # youtubesearchpython은 비동기를 지원하지 않으므로 실행자에서 실행
    loop = asyncio.get_running_loop()
    result = await loop.run_in_executor(None, lambda: _sync_search_youtube_recipe(dish, max_results))
    return result


def _sync_search_youtube_recipe(dish: str, max_results) -> list:
    """
    입력: 요리 이름, 최대 결과 수
    반환: 유튜브 동영상 정보 목록
    기능: youtubesearchpython을 사용한 동기식 YouTube 검색 수행
    """
    query = f"{dish} 레시피"

    # VideosSearch 객체 생성 및 검색 수행 (필터링 추가 : 4-20분 자막 포함)
    videos_search = CustomSearch(query, 'EgYQARgDKAE', limit=max_results)
    search_response = videos_search.result()

    if not search_response or 'result' not in search_response:
        return []

    # 비디오 ID 추출
    video_ids = []
    video_info = {}

    for item in search_response['result']:
        # URL에서 비디오 ID 추출
        video_url = item["link"]
        video_id = video_url.split("v=")[-1].split("&")[0]
        video_ids.append(video_id)

        # 기본 정보 저장 - 검색에서 얻을 수 있는 정보만 저장
        video_info[video_id] = {
            "title": item["title"],
            "url": item["link"],
            "channel_title": item["channel"]["name"],
            "duration": item.get("duration", "")
        }

    ########################################################################
    # YouTube Data API를 사용하여 상세 통계 정보(조회수, 좋아요 수) 가져오기
    youtube = build("youtube", "v3", developerKey=settings.YOUTUBE_API_KEY)

    # 모든 비디오에 기본 통계값 설정
    for video_id in video_ids:
        if video_id in video_info:
            video_info[video_id]["view_count"] = 0  # 기본값
            video_info[video_id]["like_count"] = 0  # 기본값

    # API를 통한 통계 정보 추가 시도
    try:
        if video_ids:
            videos_request = youtube.videos().list(
                part="snippet,statistics",
                id=",".join(video_ids)
            )
            videos_response = videos_request.execute()

            # 통계 정보 업데이트
            for item in videos_response.get("items", []):
                video_id = item["id"]
                if video_id in video_info:
                    snippet = item.get("snippet", {})
                    stats = item.get("statistics", {})

                    video_info[video_id]["title"] = snippet.get(
                        "title", video_info[video_id]["title"])  # API에서 갸져온거로 제목 덮어쓰기
                    video_info[video_id]["description"] = snippet.get(
                        "description", "")  # API에서  설명 가져오기쓰기
                    video_info[video_id]["view_count"] = int(
                        stats.get("viewCount", 0))
                    video_info[video_id]["like_count"] = int(
                        stats.get("likeCount", 0))
    except Exception as e:
        print(f"⚠️ YouTube API 호출 중 오류 발생: {e}")

    # 최종 결과 구성
    results = [video_info[video_id]
               for video_id in video_ids if video_id in video_info]
    return results


async def get_youtube_videos(dish):
    """
    입력: 요리 이름
    반환: 유튜브 동영상 정보 목록
    기능: 요리 이름으로 유튜브 비디오를 검색하여 결과 반환
    """
    videos = await search_youtube_recipe(dish)
    return videos
