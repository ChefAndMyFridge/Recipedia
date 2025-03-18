import asyncio
import re
from youtubesearchpython import CustomSearch
from app.core.config import settings


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

    results = []
    for item in search_response['result']:
        video_data = {
            "title": item["title"],
            "url": item["link"],
            "channel_title": item["channel"]["name"],
        }

        # 동영상 길이 처리
        duration = item.get("duration", "")
        video_data["duration"] = duration
        
        # 통계 정보 추가
        view_count_text = item.get('viewCount', {}).get('text', '0').replace(',', '').replace(' views', '')
        
        try:
            # 조회수 추출 ('123K views'에서 숫자 부분만 추출)
            view_count = view_count_text
            if 'K' in view_count:
                view_count = float(view_count.replace('K', '')) * 1000
            elif 'M' in view_count:
                view_count = float(view_count.replace('M', '')) * 1000000
            else:
                view_count = float(view_count) if view_count else 0
                
            video_data["view_count"] = int(view_count)
        except:
            video_data["view_count"] = 0
        
        # 좋아요 수는 기본 API에서 제공되지 않음
        video_data["like_count"] = 0

        results.append(video_data)

    return results


def _parse_duration(duration):
    """
    입력: 문자열 형식의 시간 (예: "5:30")
    반환: 분:초 형식의 영상 길이 문자열
    기능: 시간 형식을 일관된 형태로 변환
    """
    try:
        # 시간:분:초 형식 처리
        parts = duration.split(':')
        
        if len(parts) == 3:  # 시:분:초 형식
            hours, minutes, seconds = map(int, parts)
            if hours > 0:
                return "1시간 이상"
            return f"{minutes}:{seconds:02d}"
        
        elif len(parts) == 2:  # 분:초 형식
            minutes, seconds = map(int, parts)
            return f"{minutes}:{seconds:02d}"
        
        else:  # 그 외 형식
            return duration
            
    except:
        # 파싱에 실패한 경우 원래 값 반환
        return duration or "알 수 없음"


async def get_youtube_videos(dish):
    """
    입력: 요리 이름
    반환: 유튜브 동영상 정보 목록
    기능: 요리 이름으로 유튜브 비디오를 검색하여 결과 반환
    """
    videos = await search_youtube_recipe(dish)
    return videos
