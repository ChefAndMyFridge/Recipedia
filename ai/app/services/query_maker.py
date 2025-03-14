import time
import asyncio
from typing import List, Dict, Optional, Any, Union
from app.services.LLM.food_generator import generate_dish_names
from app.services.external_api.youtube_api import get_youtube_videos
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)


class QueryMaker:
    def __init__(self, ingredients: List[str] = None, main_ingredients: List[str] = None) -> None:
        """
        QueryMaker 클래스 초기화

        Args:
            ingredients: 사용할 재료 목록
            main_ingredients: 주재료 목록
        """
        self.ingredients: List[str] = ingredients or []
        self.main_ingredients: List[str] = main_ingredients or []

        self.dishes: List[str] = []
        self.all_videos: Dict[str, List[Dict[str, Any]]] = {}
        self.openai_time: float = 0  # OpenAI API 호출 시간
        self.youtube_time: float = 0  # YouTube API 호출 시간
        self.execution_time: float = 0  # 전체 실행 시간

    async def generate_dishes(self) -> List[str]:
        """
        입력: 없음
        반환: 생성된 음식 이름 목록
        기능: OpenAI API를 사용해 재료에 맞는 요리 이름 생성
        """
        # generate_dish_names가 동기 함수이면 비동기로 변환 필요
        loop = asyncio.get_running_loop()
        logger.info("요리 이름 생성 시작")
        self.dishes = await loop.run_in_executor(None,
                                                 lambda: generate_dish_names(self.ingredients, self.main_ingredients))
        logger.info(f"요리 이름 생성 완료: {len(self.dishes)}개 생성됨")
        return self.dishes

    async def search_recipes(self) -> Dict[str, List[Dict[str, Any]]]:
        """
        입력: 없음
        반환: {요리이름 : 동영상 목록} 형태의 딕셔너리
        기능: YouTube API를 사용해 요리 이름에 맞는 레시피 동영상 검색
        """
        self.all_videos = {}
        logger.info(f"{len(self.dishes)}개 요리에 대한 레시피 검색 시작")

        # 각 요리별로 비동기 작업 생성
        tasks = []
        for dish in self.dishes:
            task = self.search_recipe_with_timeout(dish)
            tasks.append(task)

        # 모든 작업을 동시에 실행
        try:
            results = await asyncio.gather(*tasks, return_exceptions=True)

            # 결과를 딕셔너리에 저장
            for dish, result in zip(self.dishes, results):
                if isinstance(result, Exception):
                    logger.warning(f"⚠️ {dish} 검색 중 오류: {result}")
                    self.all_videos[dish] = []
                else:
                    self.all_videos[dish] = result
                    logger.info(f"{dish}: {len(result)}개의 동영상 찾음")
        except Exception as e:
            logger.error(f"⚠️ 레시피 검색 중 오류 발생: {e}")
        return self.all_videos

    async def search_recipe_with_timeout(self, dish: str) -> List[Dict[str, Any]]:
        """
        입력: 요리 이름
        반환: 검색된 동영상 목록
        기능: 각 요청에 타임아웃 설정
        """
        try:
            logger.debug(f"{dish} 레시피 검색 시작")
            result = await asyncio.wait_for(get_youtube_videos(dish), timeout=10.0)
            logger.debug(f"{dish} 레시피 검색 완료")
            return result
        except asyncio.TimeoutError:
            logger.warning(f"⚠️ {dish} 검색 타임아웃")
            return []
        except Exception as e:
            logger.error(f"⚠️ {dish} 검색 중 예외 발생: {e}")
            return []

    async def run(self) -> Dict[str, Any]:
        """
        입력: 없음
        반환: 딕셔너리 (요리이름, 동영상, 실행시간 정보)
        기능: 전체 과정 실행(요리 이름 생성, 유튜브 레시피 검색)
        """
        start_time = time.time()
        logger.info("QueryMaker 실행 시작")

        # 1단계: 음식 이름 생성
        openai_start = time.time()
        await self.generate_dishes()
        openai_end = time.time()
        self.openai_time = openai_end - openai_start
        logger.info(f"음식 이름 생성 완료: {self.openai_time:.2f}초 소요")

        # 2단계: YouTube 레시피 검색
        youtube_start = time.time()
        await self.search_recipes()
        youtube_end = time.time()
        self.youtube_time = youtube_end - youtube_start
        logger.info(f"레시피 검색 완료: {self.youtube_time:.2f}초 소요")

        end_time = time.time()
        self.execution_time = end_time - start_time
        logger.info(f"전체 처리 완료: {self.execution_time:.2f}초 소요")

        # 통합된 출력 함수 호출
        self.print_results()

        return {
            'dishes': self.dishes,
            'videos': self.all_videos,
        }

    def print_results(self, include_ingredients=True, include_dishes=True,
                      include_recipes=True, include_time=True, include_api_times=True) -> None:
        """
        결과를 통합적으로 출력하는 함수

        Args:
            include_ingredients (bool): 재료 정보 출력 여부
            include_dishes (bool): 생성된 요리 이름 출력 여부
            include_recipes (bool): 검색된 레시피 출력 여부
            include_time (bool): 실행 시간 출력 여부
            include_api_times (bool): API 호출 시간 비교 출력 여부
        """
        # 1. 재료 정보 출력
        if include_ingredients:
            print(f"\n냉장고 재료: {', '.join(self.ingredients)}")

            if self.main_ingredients:
                print(f"주재료: {', '.join(self.main_ingredients)}")
            else:
                print("주재료: 지정되지 않음")

        # 2. 생성된 음식 목록 출력
        if include_dishes:
            print("\n생성된 음식 이름 목록:")
            for i, dish in enumerate(self.dishes, 1):
                print(f"{i}. {dish}")

            if hasattr(self, 'openai_time'):
                print(f"\n🕒 음식 이름 생성 시간 (OpenAI API): {self.openai_time:.2f}초")

        # 3. 검색된 레시피 정보 출력
        if include_recipes and hasattr(self, 'all_videos'):
            print("\n각 요리별 추천 레시피 동영상:")

            for i, dish in enumerate(self.dishes, 1):
                if dish in self.all_videos and self.all_videos[dish]:
                    first_video = self.all_videos[dish][0]
                    print(f"{i}. {dish}: {first_video['title']}")
                    print(f"   URL: {first_video['url']}")

                    # 추가 정보 표시
                    if 'description' in first_video:
                        desc = first_video['description'][:100] + "..." if len(
                            first_video['description']) > 100 else first_video['description']
                        print(f"   설명: {desc}")

                    if 'channel_title' in first_video:
                        print(f"   채널: {first_video['channel_title']}")

                    if 'view_count' in first_video:
                        print(f"   조회수: {first_video['view_count']}")
                else:
                    print(f"{i}. {dish}: 검색 결과 없음")

            # 추가 정보
            total_videos = sum(len(videos)
                               for videos in self.all_videos.values())
            print(
                f"\n총 {len(self.dishes)}개 요리에 대해 {total_videos}개의 레시피 동영상을 찾았습니다.")
            print("각 요리별로 첫 번째 동영상만 표시되었습니다.")

            if hasattr(self, 'youtube_time'):
                print(f"\n🕒 레시피 검색 시간 (YouTube API): {self.youtube_time:.2f}초")

        # 4. 실행 시간 출력
        if include_time and hasattr(self, 'execution_time'):
            print(f"\n실행 시간: {self.execution_time:.2f}초")

        # 5. API 시간 비교 출력
        if include_api_times and hasattr(self, 'execution_time'):
            print("\n===== API 호출 시간 비교 =====")
            print(
                f"OpenAI API 호출: {self.openai_time:.2f}초 ({self.openai_time/self.execution_time*100:.1f}%)")
            if hasattr(self, 'youtube_time'):
                print(
                    f"YouTube API 호출: {self.youtube_time:.2f}초 ({self.youtube_time/self.execution_time*100:.1f}%)")
                print(f"기타 처리 시간: {(self.execution_time - self.openai_time - self.youtube_time):.2f}초 ({(self.execution_time - self.openai_time - self.youtube_time)/self.execution_time*100:.1f}%)")
            else:
                print(
                    f"기타 처리 시간: {(self.execution_time - self.openai_time):.2f}초 ({(self.execution_time - self.openai_time)/self.execution_time*100:.1f}%)")


##########################################################
# 로컬 테스트 실행 용
if __name__ == "__main__":
    # 테스트 모드 설정: False - 음식 이름 생성만, True - 전체 과정(이름 생성 + 유튜브 검색)
    FULL_TEST_MODE = True  # 테스트 모드 변경을 위한 플래그

    async def test_dish_generation(ingredients: List[str], main_ingredients: Optional[List[str]] = None, title: str = "") -> List[str]:
        """음식 이름 생성만 테스트하는 간소화된 함수"""
        print(f"\n===== {title} =====")
        print(f"냉장고 재료: {', '.join(ingredients)}")
        print(
            f"주재료: {', '.join(main_ingredients) if main_ingredients else '지정되지 않음'}")

        # QueryMaker 생성
        qm = QueryMaker(ingredients, main_ingredients)

        # 음식 이름 생성 시간 측정
        start_time = time.time()
        await qm.generate_dishes()
        end_time = time.time()
        generation_time = end_time - start_time

        # 결과 출력
        print("\n생성된 음식 이름:")
        for i, dish in enumerate(qm.dishes, 1):
            print(f"{i}. {dish}")
        print(f"\n🕒 음식 이름 생성 시간: {generation_time:.2f}초")
        print("-" * 50)

        return qm.dishes

    async def test_full_process(ingredients: List[str], main_ingredients: Optional[List[str]] = None, title: str = "") -> None:
        """전체 과정(음식 이름 생성 + 유튜브 검색)을 테스트하는 함수"""
        print(f"\n===== {title} (전체 과정) =====")

        # QueryMaker 생성
        qm = QueryMaker(ingredients, main_ingredients)

        # 전체 과정 실행
        await qm.run()
        print("-" * 50)

    async def main():
        test_cases = [
            # [재료 리스트, 주재료 리스트, 케이스 제목]
            [["김치", "두부", "대파", "쌀", "고추장", "된장", "간장", "마늘", "양파", "참기름"],
             [], "테스트 케이스 1: 한식 재료 (주재료 없음)"],

            [["소고기", "감자", "양파", "당근", "토마토", "버터", "올리브오일", "로즈마리", "버섯", "화이트와인"],
             ["소고기"], "테스트 케이스 2: 양식 재료 (주재료: 소고기)"],

            [["새우", "오징어", "양파", "마늘", "고추", "파", "식용유", "밀가루", "달걀", "소금"],
             ["새우", "오징어"], "테스트 케이스 3: 해산물 요리 (주재료: 새우, 오징어)"],

            [["닭고기", "코코넛밀크", "레몬그라스", "생강", "칠리", "바질", "카피르라임잎", "피시소스", "쌀", "콩나물"],
             ["닭고기"], "테스트 케이스 4: 아시안 요리 (주재료: 닭고기)"],

            [["닭고기", "감자", "당근", "양파", "간장"],
             ["닭고기", "감자"], "테스트 케이스 5: 기존 테스트 케이스"],

            [["돼지뼈", "감자", "당근", "양파", "고추장", "마늘", "대파"],
             ["돼지뼈", "감자"], "테스트 케이스 6: 돼지뼈와 감자 조합"]
        ]

        if FULL_TEST_MODE:
            # 전체 과정 테스트 (이름 생성 + 유튜브 검색)
            for ingredients, main_ingredients, title in test_cases:
                await test_full_process(ingredients, main_ingredients, title)
        else:
            # 음식 이름 생성만 테스트
            for ingredients, main_ingredients, title in test_cases:
                await test_dish_generation(ingredients, main_ingredients, title)

    asyncio.run(main())
