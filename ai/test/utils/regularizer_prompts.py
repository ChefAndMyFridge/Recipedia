from typing import List, Dict, Union, Optional

# 시스템 프롬프트
INGREDIENT_SYSTEM_PROMPT = """당신은 요리 재료를 정규화하는 전문가입니다. 
다양한 형태로 표현된 재료명을 가장 기본적인 형태로 변환해주세요.
양 표현, 상태 표현, 크기 표현 등을 제거하고 핵심 재료만 남겨주세요.
예시:
- '감자 2개' → '감자'
- '다진 마늘' → '마늘'
- '소고기(양지)' → '소고기'
- '참기름 약간' → '참기름'
- '대파 2뿌리' → '파'
- '쪽파' → '파'
- '국간장 1큰술' → '간장'
명확한 동의어 관계는 동일 재료로 간주하세요 (예: 대파/쪽파 → 파).
그러나 고추와 청양고추처럼 종류가 다른 재료는 구분해주세요."""

# 단일 재료 정규화 프롬프트
INGREDIENT_USER_PROMPT = """다음 재료명을 기본형으로 정규화해주세요:
'{ingredient}'

정규화된 재료명만 응답하세요. 설명 없이 오직 정규화된 재료명만 제공해주세요."""

# 배치 처리 프롬프트
BATCH_INGREDIENT_USER_PROMPT = """다음 재료명 목록을 각각 기본형으로 정규화해주세요:
{ingredients}

응답은 반드시 순수 JSON 형식으로만 제공해주세요. 마크다운 코드 블록(```)이나 설명 없이 순수 JSON만 응답해야 합니다.
키는 원래 재료명이고 값은 정규화된 재료명입니다.

예시 응답 형식:
{{
  "감자 2개": "감자",
  "다진 마늘": "마늘"
}}"""

# 보수적 정규화 (종류 구분을 더 세밀하게)
CONSERVATIVE_SYSTEM_PROMPT = """당신은 요리 재료를 정규화하는 전문가입니다.
다양한 형태로 표현된 재료명에서 양과 상태 표현은 제거하되, 재료의 종류와 특성은 최대한 유지해주세요.
예시:
- '감자 2개' → '감자'
- '다진 마늘' → '마늘'
- '소고기(양지)' → '소고기'
- '참기름 약간' → '참기름'
- '대파 2뿌리' → '대파'  (대파와 쪽파는 구분)
- '청양고추 2개' → '청양고추'  (고추 종류 구분)
- '국간장 1큰술' → '국간장'  (간장 종류 구분)
양이나 상태 표현은 제거하되, 재료의 종류나 특성을 나타내는 용어는 보존하세요."""

# 공격적 정규화 (더 많은 통합)
AGGRESSIVE_SYSTEM_PROMPT = """당신은 요리 재료를 정규화하는 전문가입니다.
다양한 형태로 표현된 재료명을 가장 단순하고 기본적인 형태로 통합해주세요.
비슷한 종류의 재료는 모두 하나의 대표 재료명으로 통합하세요.
예시:
- '감자 2개', '감자(큰것)' → '감자'
- '다진 마늘', '마늘 슬라이스', '통마늘' → '마늘'
- '소고기(양지)', '소고기(등심)', '한우 앞다리살' → '소고기'
- '간장', '진간장', '국간장', '양조간장' → '간장'
- '대파', '쪽파', '실파', '파(소)' → '파'
- '청양고추', '홍고추', '풋고추' → '고추'
가능한 가장 상위 카테고리의 재료명으로 단순화하되, 완전히 다른 재료는 구분하세요."""

def get_ingredient_prompt(ingredient: str, mode: str = "normal") -> Dict[str, str]:
    """
    단일 재료에 대한 프롬프트 메시지 생성
    
    Args:
        ingredient (str): 정규화할 재료명
        mode (str): 정규화 모드 ('normal', 'conservative', 'aggressive')
        
    Returns:
        List[Dict[str, str]]: 프롬프트 메시지 목록
    """
    system_prompt = INGREDIENT_SYSTEM_PROMPT
    
    if mode == "conservative":
        system_prompt = CONSERVATIVE_SYSTEM_PROMPT
    elif mode == "aggressive":
        system_prompt = AGGRESSIVE_SYSTEM_PROMPT
    
    return [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": INGREDIENT_USER_PROMPT.format(ingredient=ingredient)}
    ]

def get_batch_ingredient_prompt(
    ingredients: List[str], 
    mode: str = "normal"
) -> List[Dict[str, str]]:
    """
    여러 재료에 대한 배치 처리 프롬프트 메시지 생성
    
    Args:
        ingredients (List[str]): 정규화할 재료명 목록
        mode (str): 정규화 모드 ('normal', 'conservative', 'aggressive')
        
    Returns:
        List[Dict[str, str]]: 프롬프트 메시지 목록
    """
    system_prompt = INGREDIENT_SYSTEM_PROMPT
    
    if mode == "conservative":
        system_prompt = CONSERVATIVE_SYSTEM_PROMPT
    elif mode == "aggressive":
        system_prompt = AGGRESSIVE_SYSTEM_PROMPT
    
    ingredients_str = "\n".join([f"- {ingr}" for ingr in ingredients])
    
    return [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": BATCH_INGREDIENT_USER_PROMPT.format(ingredients=ingredients_str)}
    ]