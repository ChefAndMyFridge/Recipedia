# app/core/config.py
from typing import List, Optional
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    APP_NAME: str = "FastAPI Server"
    DEBUG: bool = False
    ALLOWED_ORIGINS: List[str]
    YOUTUBE_API_KEY: str
    OPENAI_API_KEY: str

    # 할루시네이션 줄이기 위한 파라미터 최적화
    # Query OpenAI 설정
    QUERY_OPENAI_MODEL: str = "gpt-4o-mini"
    QUERY_OPENAI_MAX_TOKENS: int = 100  # 간결한 응답을 위한 적절한 값
    QUERY_OPENAI_TEMPERATURE: float = 0.2  # 재료 목록에 더 충실하도록 낮은 값 설정
    QUERY_OPENAI_TOP_P: float = 0.85      # 상위 확률 토큰 제한
    QUERY_OPENAI_FREQUENCY_PENALTY: float = 0.2  # 중복 방지

    # Summary OpenAI 설정
    SUMMARY_OPENAI_MODEL: str = "gpt-4o"
    SUMMARY_OPENAI_MAX_TOKENS: int = 5000  # 간결한 응답을 위한 적절한 값
    SUMMARY_OPENAI_TEMPERATURE: float = 0.1  # 레시피 요약에 대해서 일관적인 답을 받도록 낮은 값 설정정
    SUMMARY_OPENAI_TOP_P: float = 0.80      # 상위 확률 토큰 제한
    SUMMARY_OPENAI_FREQUENCY_PENALTY: float = 0.1  # 중복 방지
    SUMMARY_OPENAI_STREAM: bool = False  # 스트리밍 사용 여부

    # YouTube 설정
    YOUTUBE_MAX_RESULTS: int = 5

    # 생성할 음식 이름 개수
    NUM_DISHES_TO_GENERATE: int = 3

    class Config:
        env_file = ".env"


settings = Settings()
