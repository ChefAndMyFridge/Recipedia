# app/services/LLM/food_generator.py
import re
import openai
from app.utils.prompts.youtube_prompts import get_chef_prompt, CHEF_SYSTEM_MESSAGE
from app.core.config import settings

# OpenAI API 키 설정
openai.api_key = settings.OPENAI_API_KEY


def _generate_from_prompt(system_message: str, user_prompt: str) -> str:
    """
    입력:
        - system_message: OpenAI에 전달할 시스템 메시지
        - user_prompt: OpenAI에 전달할 사용자 프롬프트
    반환:
        - str: OpenAI로부터 반환된 텍스트 응답
    기능:
        - system_message, user_prompt를 사용해 OpenAI API(chat.completions)를 호출하고,
          생성된 메시지의 content를 문자열로 반환한다.
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
    입력:
        - content: OpenAI로부터 반환된 문자열
    반환:
        - list: 추출된 음식 이름 리스트
    기능:
        - 불릿 포인트('- ') 및 괄호 내 문자 등을 제거한 뒤 줄 단위로 음식 이름을 수집한다.
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
    """
    입력:
        - ingredients: 재료 목록 (기본값 None)
        - main_ingredient: 주재료 (기본값 None)
        - num_dishes: 생성할 요리 이름 개수 (기본값 None)
    반환:
        - list: 생성된 요리 이름 문자열의 리스트
    기능:
        - 재료와 주재료 정보를 바탕으로 프롬프트를 생성하고,
          OpenAI API에 전송해 받은 결과를 파싱해 음식 이름을 추출한다.
    """
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
