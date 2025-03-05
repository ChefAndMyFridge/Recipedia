import openai
from app.core.config import settings

# OpenAI API 키 설정
openai.api_key = settings.OPENAI_API_KEY


def generate_from_prompt(system_message, user_prompt):
    """프롬프트를 받아 OpenAI API를 통해 응답을 생성하는 기본 함수"""
    response = openai.chat.completions.create(
        model=settings.OPENAI_MODEL,
        messages=[
            {"role": "system", "content": system_message},
            {"role": "user", "content": user_prompt}
        ],
        max_tokens=settings.OPENAI_MAX_TOKENS,
        temperature=settings.OPENAI_TEMPERATURE,
        top_p=settings.OPENAI_TOP_P,
        frequency_penalty=settings.OPENAI_FREQUENCY_PENALTY
    )

    return response.choices[0].message.content.strip()
