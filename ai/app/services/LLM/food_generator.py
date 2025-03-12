# food_generator.py
import re
import openai
from app.utils.prompts.youtube_prompts import get_chef_prompt, CHEF_SYSTEM_MESSAGE
from app.core.config import settings

# OpenAI API 키 설정
openai.api_key = settings.OPENAI_API_KEY

def _generate_from_prompt(system_message: str, user_prompt: str) -> str:
    """
    프롬프트를 받아 OpenAI API를 통해 응답을 생성하는 함수
    """
    response = openai.chat.completions.create(
        model=settings.QUERY_OPENAI_MODEL,
        messages=[
            {"role": "system", "content": system_message},
            {"role": "user", "content": user_prompt}
        ],
        max_tokens=settings.QUERY_OPENAI_MAX_TOKENS,
        temperature=settings.QUERY_OPENAI_TEMPERATURE,
        top_p=settings.QUERY_OPENAI_TOP_P,
        frequency_penalty=settings.QUERY_OPENAI_FREQUENCY_PENALTY
    )
    return response.choices[0].message.content.strip()

def _parse_dish_names(content: str) -> list:
    """
    불릿 포인트로 구분된 리스트를 파싱하고,
    '(양식)' 등 괄호 내용을 제거합니다.
    """
    items = []
    for line in content.split('\n'):
        line = line.strip()
        # 불릿('- ') 제거
        if line.startswith('- '):
            line = line[2:]
        # 괄호 내용 제거
        line = re.sub(r'\(.*?\)', '', line).strip()
        if line:
            items.append(line)
    return items

def generate_dish_names(ingredients=None, main_ingredient=None, num_dishes=None) -> list:
    """여러 개의 요리 이름을 생성하는 함수"""
    # 기본값 설정
    ingredients = ingredients
    main_ingredient = main_ingredient
    num_dishes = num_dishes or settings.NUM_DISHES_TO_GENERATE

    # 프롬프트 생성
    user_prompt = get_chef_prompt(ingredients, main_ingredient, num_dishes)

    # 생성 API 호출
    content = _generate_from_prompt(CHEF_SYSTEM_MESSAGE, user_prompt)

    # 파서를 사용하여 음식 이름 추출
    dish_names = _parse_dish_names(content)

    return dish_names


if __name__ == "__main__":
    # 테스트 코드
    test_dishes = generate_dish_names(
        ingredients=["새우", "오징어", "양파", "마늘", "고추", "파", "식용유"],
        main_ingredient=["새우", "오징어"]
    )
    print("생성된 음식 이름 목록:")
    for i, dish in enumerate(test_dishes, 1):
        print(f"{i}. {dish}")
