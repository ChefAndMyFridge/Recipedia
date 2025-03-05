import time
import asyncio
import concurrent.futures
from app.services.LLM.food_generator import generate_dish_names
from app.services.external_api.youtube_api import get_youtube_videos
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

class RecipeMaker:
    def __init__(self, ingredients=None, main_ingredient=None):
        """
        RecipeMaker 클래스 초기화
        
        Args:
            ingredients (list): 사용할 재료 목록. 기본값은 app_config에서 가져옴
            main_ingredient (str): 주재료. 기본값은 app_config에서 가져옴
        """
        self.ingredients = ingredients or settings.DEFAULT_INGREDIENTS
        self.main_ingredient = main_ingredient or settings.DEFAULT_MAIN_INGREDIENT
        self.dishes = []
        self.all_videos = {}
        self.execution_time = 0
    
    async def generate_dishes(self):
        """음식 이름을 생성하고 저장합니다."""
        self.dishes = generate_dish_names(self.ingredients, self.main_ingredient)
        return self.dishes
    
    async def search_recipes(self):
        """생성된 음식에 대한 YouTube 레시피를 검색합니다."""
        self.all_videos = {}
        
        # 병렬 처리 적용
        with concurrent.futures.ThreadPoolExecutor(max_workers=settings.NUM_DISHES_TO_GENERATE) as executor:
            future_to_dish = {executor.submit(get_youtube_videos, dish): dish for dish in self.dishes}
            for future in concurrent.futures.as_completed(future_to_dish):
                dish = future_to_dish[future]
                try:
                    videos = future.result()
                    self.all_videos[dish] = videos
                except Exception as e:
                    print(f"⚠️ {dish} 검색 중 오류 발생: {e}")
                    self.all_videos[dish] = []
        
        return self.all_videos
    
    def print_ingredients(self):
        """재료 정보를 출력합니다."""
        print(f"\n냉장고 재료: {', '.join(self.ingredients)}")
        print(f"주재료: {self.main_ingredient}")
    
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
        recipe_maker = RecipeMaker()
        result = await recipe_maker.run()
        print("\n최종 결과:")
        print(result)
    asyncio.run(main())