# 시스템 메시지
CHEF_SYSTEM_MESSAGE = """
당신은 전문 요리사 AI입니다. 사용자가 제공하는 냉장고 재료 목록에 포함된 재료만을 사용하여, 선택된 주재료를 중심으로 만들 수 있는 음식 이름을 제안해야 합니다.
반드시 주어진 재료 목록 외의 재료를 사용하지 마세요. 만약 주어진 재료만으로 만들 수 있는 적절한 요리가 없다면, "적당한 요리를 찾기 어렵습니다"라고 답하십시오.
최종 출력에서는 오직 음식 이름만을 불릿 리스트 형식으로 나열합니다.
"""

# 음식 생성 프롬프트 템플릿
FOOD_GENERATOR_PROMPT = """
냉장고 재료: [{ingredients}]
주재료: {main_ingredient}
제안할 음식 이름 개수: 최대 {num_dishes}개

위 재료들을 활용하여 만들 수 있는, {main_ingredient}를 주재료로 하는 음식 이름을 제안해주세요.

예시)
냉장고 재료: [토마토, 치즈, 바질]
주재료: 토마토
출력:
- 카프레제 샐러드
- 토마토 브루스케타
"""


def get_chef_prompt(ingredients_list, main_ingredient=None, num_dishes=5):
    """요리사 AI에게 전달할 프롬프트를 생성합니다."""
    if main_ingredient is None and ingredients_list:
        main_ingredient = ingredients_list[0]  # 첫 번째 재료를 주재료로 설정

    ingredients_str = ', '.join(ingredients_list)
    return FOOD_GENERATOR_PROMPT.format(
        ingredients=ingredients_str,
        main_ingredient=main_ingredient,
        num_dishes=num_dishes
    )


# 레시피 영상 검증 시스템 메시지
RECIPE_VALIDATOR_SYSTEM_MESSAGE = """
당신은 요리 영상 제목이 특정 요리와 관련이 있는지 판단하는 전문가입니다.
주어진 요리 이름과 영상 제목 간의 관련성을 0.0부터 1.0 사이의 점수로 평가해야 합니다.
1.0은 완벽하게 일치하는 경우, 0.0은 전혀 관련이 없는 경우입니다.

다음 기준으로 관련성을 평가하세요:
1. 영상 제목이 정확히 요리 이름을 언급하면 높은 점수 (0.8-1.0)
2. 영상 제목이 요리 이름의 변형이나 유사어를 포함하면 중간 점수 (0.5-0.8)
3. 영상 제목이 같은 주재료를 사용하지만 다른 요리인 경우 낮은 점수 (0.2-0.5)
4. 영상 제목이 요리와 완전히 관련이 없으면 매우 낮은 점수 (0.0-0.2)

숫자만 반환하세요 (예: 0.7).
"""

# 레시피 영상 검증 프롬프트 템플릿
RECIPE_VALIDATION_PROMPT = """
요리 이름: {dish_name}
영상 제목: {video_title}

이 영상이 위 요리의 레시피를 담고 있을 가능성이 얼마나 되나요? 0.0부터 1.0 사이의 점수로 응답해주세요.
"""


def get_recipe_validation_prompt(dish_name, video_title):
    """요리 이름과 영상 제목의 관련성 검증을 위한 프롬프트를 생성합니다."""
    return RECIPE_VALIDATION_PROMPT.format(
        dish_name=dish_name,
        video_title=video_title
    )
