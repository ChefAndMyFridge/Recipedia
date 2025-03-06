import time
import asyncio
import concurrent.futures
from app.services.LLM.food_generator import generate_dish_names
from app.services.external_api.youtube_api import get_youtube_videos
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

class QueryMaker:
    def __init__(self, ingredients=None, main_ingredients=None):
        """
        QueryMaker 클래스 초기화
        
        Args:
            ingredients (list): 사용할 재료 목록
            main_ingredients (list): 주재료 목록. 기본값은 None
        """
        self.ingredients = ingredients or []
        
        # main_ingredients가 None이거나 빈 값이면 빈 리스트로, 문자열이면 단일 항목 리스트로 변환
        if main_ingredients is None:
            self.main_ingredients = []
        elif isinstance(main_ingredients, str):
            self.main_ingredients = [main_ingredients]
        else:
            self.main_ingredients = main_ingredients
            
        self.dishes = []
        self.all_videos = {}
        self.execution_time = 0
    
    async def generate_dishes(self):
        """음식 이름을 생성하고 저장합니다."""
        # generate_dish_names가 동기 함수이면 비동기로 변환 필요
        loop = asyncio.get_running_loop()
        self.dishes = await loop.run_in_executor(None, 
                                                lambda: generate_dish_names(self.ingredients, self.main_ingredients))
        return self.dishes
    
    async def search_recipes(self):
        """생성된 음식에 대한 YouTube 레시피를 비동기 방식으로 검색합니다."""
        self.all_videos = {}
        
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
                    print(f"⚠️ {dish} 검색 중 오류: {result}")
                    self.all_videos[dish] = []
                else:
                    self.all_videos[dish] = result
        except Exception as e:
            print(f"⚠️ 레시피 검색 중 오류 발생: {e}")
            
        return self.all_videos

    async def search_recipe_with_timeout(self, dish):
        """각 요청에 타임아웃 설정"""
        try:
            result = await asyncio.wait_for(get_youtube_videos(dish), timeout=10.0)
        except asyncio.TimeoutError:
            print(f"⚠️ {dish} 검색 타임아웃")
            result = []
        return result
    
    def print_ingredients(self):
        """재료 정보를 출력합니다."""
        print(f"\n냉장고 재료: {', '.join(self.ingredients)}")
        
        if self.main_ingredients:
            print(f"주재료: {', '.join(self.main_ingredients)}")
        else:
            print("주재료: 지정되지 않음")
    
    def print_dishes(self):
        """생성된 음식 목록을 출력합니다."""
        print("\n생성된 음식 이름 목록:")
        for i, dish in enumerate(self.dishes, 1):
            print(f"{i}. {dish}")
    
    def print_recipes(self):
        """검색된 레시피 정보를 출력합니다."""
        print("\n각 요리별 추천 레시피 동영상:")
        if settings.VIDEO_VALIDATION_ENABLED:
            print("(영상 관련성 검증이 활성화되었습니다)")
        
        for i, dish in enumerate(self.dishes, 1):
            if dish in self.all_videos and self.all_videos[dish]:
                first_video = self.all_videos[dish][0]
                print(f"{i}. {dish}: {first_video['title']}")
                print(f"   URL: {first_video['url']}")
                
                # 검증 결과가 있으면 표시
                if settings.VIDEO_VALIDATION_ENABLED and 'relevance_score' in first_video:
                    print(f"   관련성 점수: {first_video['relevance_score']:.2f}")
                
                # 추가 정보 표시
                if 'description' in first_video:
                    desc = first_video['description'][:100] + "..." if len(first_video['description']) > 100 else first_video['description']
                    print(f"   설명: {desc}")
                    
                if 'channel_title' in first_video:
                    print(f"   채널: {first_video['channel_title']}")
                    
                if 'view_count' in first_video:
                    print(f"   조회수: {first_video['view_count']}")
            else:
                print(f"{i}. {dish}: 검색 결과 없음")

        # 추가 정보
        total_videos = sum(len(videos) for videos in self.all_videos.values())
        print(f"\n총 {len(self.dishes)}개 요리에 대해 {total_videos}개의 레시피 동영상을 찾았습니다.")
        print("각 요리별로 첫 번째 동영상만 표시되었습니다.")
    
    def print_execution_time(self):
        """실행 시간을 출력합니다."""
        print(f"\n실행 시간: {self.execution_time:.2f}초")
    
    def get_best_recipe(self, dish_index=0):
        """
        특정 요리의 최고 레시피를 반환합니다.
        
        Args:
            dish_index (int): 요리 인덱스 (0부터 시작)
            
        Returns:
            dict: 레시피 정보 또는 결과가 없을 경우 None
        """
        if not self.dishes or dish_index >= len(self.dishes):
            return None
        
        dish = self.dishes[dish_index]
        if dish in self.all_videos and self.all_videos[dish]:
            return self.all_videos[dish][0]
        return None
    
    async def run(self):
        """전체 레시피 생성 및 검색 과정을 실행합니다."""
        start_time = time.time()
        
        # 1단계: 음식 이름 생성
        await self.generate_dishes()
        
        # 정보 출력
        self.print_ingredients()
        self.print_dishes()
        
        # 2단계: YouTube 레시피 검색
        await self.search_recipes()
        
        # 결과 표시
        self.print_recipes()
        
        end_time = time.time()
        self.execution_time = end_time - start_time
        
        self.print_execution_time()
        
        return {
            'dishes': self.dishes,
            'videos': self.all_videos,
            'execution_time': self.execution_time
        }


##########################################################
# 로컬 테스트 실행 용
if __name__ == "__main__":
    async def main():
        recipe_maker = QueryMaker(["소고기", "계란", "파", "마늘", "양파"], "계란")
        result = await recipe_maker.run()
        # print("\n최종 결과:")
        # print(result)
    asyncio.run(main())