# food_generator.py
from app.utils.prompts.youtube_prompts import get_chef_prompt, CHEF_SYSTEM_MESSAGE
from app.services.LLM.generator import generate_from_prompt
from app.services.LLM.processor import parse_bullet_list
from app.core.config import settings


def generate_dish_names(ingredients=None, main_ingredient=None, num_dishes=None) -> list:
    """여러 개의 요리 이름을 생성하는 함수"""
    # 기본값 설정
    ingredients = ingredients
    main_ingredient = main_ingredient
    num_dishes = num_dishes or settings.NUM_DISHES_TO_GENERATE

    # 프롬프트 생성
    user_prompt = get_chef_prompt(ingredients, main_ingredient, num_dishes)

    # 생성 API 호출
    content = generate_from_prompt(CHEF_SYSTEM_MESSAGE, user_prompt)

    # 파서를 사용하여 음식 이름 추출
    dish_names = parse_bullet_list(content)

    return dish_names


if __name__ == "__main__":
    dishes = generate_dish_names()
    print("생성된 음식 이름 목록:")
    for i, dish in enumerate(dishes, 1):
        print(f"{i}. {dish}")
