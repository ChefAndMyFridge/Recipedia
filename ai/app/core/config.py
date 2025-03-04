# app/core/config.py
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "FastAPI Server"
    DEBUG: bool = False
    DATABASE_URL: str
    ALLOWED_ORIGINS: list[str]
    YOUTUBE_API_KEY: str
    OPENAI_API_KEY: str

    class Config:
        env_file = ".env"

settings = Settings()
