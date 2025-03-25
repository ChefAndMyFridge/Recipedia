import asyncio
import aiohttp
from typing import List, Dict, Any, Optional, Set
from collections import defaultdict

from app.services.query_maker import QueryMaker
from test.utils.recipe_crawler import RecipeCrawler
from test.utils.ingredients_regularizer import IngredientsRegularizer


class RecipeValidator:
    """
    음식 추천 및 레시피 검증을 수행하는 클래스
    1. QueryMaker로 음식 이름 생성
    2. RecipeCrawler로 레시피 및 재료 정보 수집
    3. IngredientsRegularizer로 재료명 정규화
    4. 필수 재료 식별 및 유효성 검증
    """
    # 클래스 상수 정의
    MAX_RECIPES_PER_DISH = 30       # 요리당 크롤링할 최대 레시피 수
    REGULARIZATION_MODE = "aggressive"  # 재료 정규화 모드
    ESSENTIAL_THRESHOLD_RATIO = 0.5  # 필수 재료 식별 기준 (N/2)

    def __init__(self, 
                 ingredients: List[str],
                 main_ingredients: Optional[List[str]] = None,
                 preferred_ingredients: Optional[List[str]] = None,
                 disliked_ingredients: Optional[List[str]] = None):
        """
        RecipeValidator 초기화
        
        Args:
            ingredients: 사용 가능한 재료 목록
            main_ingredients: 주재료 목록
            preferred_ingredients: 선호 재료 목록
            disliked_ingredients: 비선호 재료 목록
        """
        self.ingredients = ingredients
        self.main_ingredients = main_ingredients or []
        self.preferred_ingredients = preferred_ingredients or []
        self.disliked_ingredients = disliked_ingredients or []
        
        # 결과 저장용 변수들
        self.generated_dishes = []
        self.recipe_data = {}
        self.normalized_ingredients = {}
        self.essential_ingredients = {}
        self.validation_results = {}
        
    
    async def generate_dishes(self) -> List[str]:
        """QueryMaker를 사용하여 음식 이름 생성"""
        print("1단계: 음식 이름 생성 중...")
        
        query_maker = QueryMaker(
            ingredients=self.ingredients,
            main_ingredients=self.main_ingredients,
            preferred_ingredients=self.preferred_ingredients,
            disliked_ingredients=self.disliked_ingredients
        )
        
        result = await query_maker.run()
        self.generated_dishes = result['dishes']
        
        print(f"생성된 음식 이름: {', '.join(self.generated_dishes)}")
        return self.generated_dishes
    
    async def crawl_recipes(self, max_recipes_per_dish: int = None) -> Dict[str, Any]:
        """각 음식에 대해 레시피 및 재료 정보 크롤링"""
        
        if max_recipes_per_dish is None:
            max_recipes_per_dish = self.MAX_RECIPES_PER_DISH

        print("2단계: 레시피 및 재료 정보 크롤링 중...")
        
        self.recipe_data = {}
        async with aiohttp.ClientSession() as session:
            for dish in self.generated_dishes:
                print(f"'{dish}' 레시피 크롤링 중...")
                
                # RecipeCrawler는 단일 요리 이름에 대한 검색 및 크롤링을 수행
                crawler = RecipeCrawler(max_recipes_per_search=max_recipes_per_dish)
                ingredients, recipe_count, ingredient_counter = await crawler.process_recipe(session, dish)
                
                if recipe_count > 0:
                    self.recipe_data[dish] = {
                        'ingredients': ingredients,
                        'recipe_count': recipe_count,
                        'ingredient_counter': dict(ingredient_counter)
                    }
                    print(f"  - {recipe_count}개 레시피 발견, {len(ingredient_counter)}개 고유 재료")
                else:
                    print(f"  - 레시피를 찾을 수 없음")
        
        return self.recipe_data
    
    async def normalize_ingredients(self) -> Dict[str, Any]:
        """각 음식에 대한 재료 정보 정규화"""
        print("3단계: 재료명 정규화 중...")
        
        self.normalized_ingredients = {}
        
        for dish, data in self.recipe_data.items():
            print(f"'{dish}' 재료 정규화 중...")
            
            # 레시피 통계 정보 구성
            temp_data = {
                'summary': {
                    'total_requests': data['recipe_count'],
                    'total_success': data['recipe_count'],
                    'success_rate': '100.0%',
                    'unique_ingredients': len(data['ingredient_counter'])
                },
                'recipe_stats': {
                    dish: {
                        'requested': data['recipe_count'],
                        'received': data['recipe_count'],
                        'success_rate': '100.0%',
                        'ingredients': data['ingredient_counter']
                    }
                }
            }
            
            # 정규화 처리
            regularizer = IngredientsRegularizer(mode=self.REGULARIZATION_MODE)
            norm_data = await regularizer.normalize_data(temp_data)
            
            self.normalized_ingredients[dish] = norm_data
            print(f"  - {len(norm_data['normalized_stats'])}개 정규화된 재료")
        
        return self.normalized_ingredients
    
    def identify_essential_ingredients(self) -> Dict[str, Dict[str, int]]:
        """각 음식에 대해 필수 재료 식별 (N/2 이상 등장)"""
        print("4단계: 필수 재료 식별 중...")
        
        self.essential_ingredients = {}
        
        for dish, data in self.normalized_ingredients.items():
            if dish not in self.recipe_data:
                continue
                
            dish_data = self.recipe_data[dish]
            recipe_count = dish_data['recipe_count']
            threshold = recipe_count * self.ESSENTIAL_THRESHOLD_RATIO  # 상수 사용
            
            essential = {}
            for ingredient, count in data['normalized_stats'].items():
                if count >= threshold:
                    essential[ingredient] = count
            
            self.essential_ingredients[dish] = essential
            print(f"'{dish}' 필수 재료: {', '.join(essential.keys())}")
        
        return self.essential_ingredients
    
    async def normalize_user_ingredients(self) -> Dict[str, str]:
        """사용자 입력 재료 정규화"""
        print("5단계: 사용자 입력 재료 정규화 중...")
        
        # 정규화기 초기화
        regularizer = IngredientsRegularizer(mode=self.REGULARIZATION_MODE)
        
        # 모든 사용자 재료 정규화
        all_user_ingredients = self.ingredients + self.main_ingredients
        normalized_map = await regularizer.batch_normalize_with_openai(all_user_ingredients)
        
        # 정규화 결과 출력
        for original, normalized in normalized_map.items():
            if original != normalized:
                print(f"  - '{original}' → '{normalized}'")
        
        return normalized_map
    
    async def validate_ingredients(self) -> Dict[str, Dict[str, Any]]:
        """각 음식에 대해 필수 재료 포함 여부 검증 (백분율 기반)"""
        print("6단계: 재료 유효성 검증 중...")
        
        self.validation_results = {}
        
        # 사용자 입력 재료 정규화
        normalized_map = await self.normalize_user_ingredients()
        
        # 정규화된 사용자 재료 집합
        normalized_ingredients = set(normalized_map[i] for i in self.ingredients)
        normalized_main_ingredients = set(normalized_map[i] for i in self.main_ingredients) if self.main_ingredients else set()
        
        # 각 요리별 검증
        for dish, essential_ingrs in self.essential_ingredients.items():
            essential_set = set(essential_ingrs.keys())
            
            # 필수 재료 충족률 계산 (%)
            total_essential = len(essential_set)
            matched_essential = len(essential_set.intersection(normalized_ingredients))
            essential_score = (matched_essential / total_essential * 100) if total_essential > 0 else 100
            
            # 주재료 사용률 계산 (%)
            if normalized_main_ingredients:
                main_in_essential_count = len(normalized_main_ingredients.intersection(essential_set))
                main_score = (main_in_essential_count / len(normalized_main_ingredients) * 100)
            else:
                main_score = 100  # 주재료가 없으면 100% 점수
            
            # 종합 점수 (가중치 적용 가능)
            essential_weight = 0.7  # 필수재료 가중치
            main_weight = 0.3      # 주재료 가중치
            total_score = (essential_score * essential_weight) + (main_score * main_weight)
            
            # 기존 O/X 결과 (호환성 유지)
            all_essential_included = essential_set.issubset(normalized_ingredients)
            main_in_essential = bool(normalized_main_ingredients & essential_set) if normalized_main_ingredients else True
            
            # 검증 결과 저장
            self.validation_results[dish] = {
                # 기존 필드
                'all_essential_included': all_essential_included,
                'main_in_essential': main_in_essential,
                'is_valid': all_essential_included and main_in_essential,
                'missing_ingredients': list(essential_set - normalized_ingredients),
                'essential_ingredients': list(essential_ingrs.keys()),
                'essential_count': {k: v for k, v in essential_ingrs.items()},
                'normalized_user_ingredients': list(normalized_ingredients),
                
                # 새로운 점수 필드
                'essential_score': round(essential_score, 1),
                'main_score': round(main_score, 1),
                'total_score': round(total_score, 1),
                'matched_essential': matched_essential,
                'total_essential': total_essential
            }
            
            # 결과 출력
            print(f"'{dish}' 검증 결과:")
            print(f"  - 필수 재료 충족률: {self.validation_results[dish]['essential_score']}% ({matched_essential}/{total_essential})")
            print(f"  - 주재료 사용률: {self.validation_results[dish]['main_score']}%")
            print(f"  - 종합 점수: {self.validation_results[dish]['total_score']}%")
            if not all_essential_included:
                print(f"  - 부족한 재료: {', '.join(self.validation_results[dish]['missing_ingredients'])}")
        
        return self.validation_results
    
    async def run(self) -> Dict[str, Any]:
        """전체 프로세스 실행"""
        print("===== 레시피 검증 프로세스 시작 =====")
        
        # 1. 음식 이름 생성
        await self.generate_dishes()
        
        if not self.generated_dishes:
            return {'success': False, 'error': '음식 이름을 생성할 수 없습니다.'}
        
        # 2. 레시피 크롤링
        await self.crawl_recipes(max_recipes_per_dish=self.MAX_RECIPES_PER_DISH)
        
        if not self.recipe_data:
            return {'success': False, 'error': '레시피를 찾을 수 없습니다.'}
        
        # 3-6. 나머지 단계 실행
        await self.normalize_ingredients()
        self.identify_essential_ingredients()
        await self.validate_ingredients()
        
        # 결과 요약
        valid_dishes = [dish for dish, result in self.validation_results.items() 
                       if result['is_valid']]
        
        print("\n===== 검증 결과 요약 =====")
        print(f"생성된 총 요리 수: {len(self.generated_dishes)}")
        print(f"레시피 발견된 요리 수: {len(self.recipe_data)}")
        print(f"유효한 요리 수: {len(valid_dishes)}")
        
        if valid_dishes:
            print("\n유효한 요리 목록:")
            for dish in valid_dishes:
                print(f"- {dish}")
                essential = self.validation_results[dish]['essential_ingredients']
                print(f"  필수 재료: {', '.join(essential)}")
        
        return {
            'success': True,
            'generated_dishes': self.generated_dishes,
            'valid_dishes': valid_dishes,
            'validation_results': self.validation_results,
            'essential_ingredients': self.essential_ingredients
        }


# 사용 예시
async def main():
    # 테스트 데이터
    ingredients = ["김치", "두부", "파", "쌀", "고추장", "된장", "간장", "마늘", "양파", "참기름"]
    main_ingredients = ["김치", "두부"]
    
    validator = RecipeValidator(ingredients, main_ingredients)
    results = await validator.run()
    
    # 유효한 요리만 사용
    if results['success'] and results['valid_dishes']:
        print("\n추천 요리:")
        for dish in results['valid_dishes']:
            essential = results['validation_results'][dish]['essential_ingredients']
            print(f"- {dish} (필수 재료: {', '.join(essential)})")
    else:
        print("유효한 요리를 찾을 수 없습니다.")


if __name__ == "__main__":
    asyncio.run(main())