# app/core/config.py
from typing import List, Optional
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "FastAPI Server"
    DEBUG: bool = False
    ALLOWED_ORIGINS: List[str]
    YOUTUBE_API_KEY: str
    OPENAI_API_KEY: str

    # OpenAI 설정 - 할루시네이션 줄이기 위한 파라미터 최적화
    OPENAI_MODEL: str = "gpt-4o-mini"
    OPENAI_MAX_TOKENS: int = 100  # 간결한 응답을 위한 적절한 값
    OPENAI_TEMPERATURE: float = 0.3  # 재료 목록에 더 충실하도록 낮은 값 설정
    OPENAI_TOP_P: float = 0.85      # 상위 확률 토큰 제한
    OPENAI_FREQUENCY_PENALTY: float = 0.2  # 중복 방지

    # YouTube 설정
    YOUTUBE_MAX_RESULTS: int = 3

    # 기본 재료 목록
    DEFAULT_INGREDIENTS: List[str] = ["소고기", "계란", "파", "마늘", "양파"]

    # 기본 주재료
    DEFAULT_MAIN_INGREDIENT: Optional[str] = None

    # 생성할 음식 이름 개수
    NUM_DISHES_TO_GENERATE: int = 6

    # 영상 검증 설정
    VIDEO_VALIDATION_ENABLED: bool = True  # 영상 제목 검증 활성화 여부
    VIDEO_RELEVANCE_THRESHOLD: float = 0.7  # 최소 관련성 점수 (0.0 ~ 1.0)
    VIDEO_VALIDATION_MODEL: str = "gpt-4o-mini"  # 검증에 사용할 모델
    VIDEO_VALIDATION_TEMPERATURE: float = 0.1  # 더 일관된 평가를 위한 낮은 온도값

    class Config:
        env_file = ".env"

settings = Settings()
