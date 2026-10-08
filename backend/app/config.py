import os

class Settings:
    PROJECT_NAME: str = "Scam Shield AI"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "super-secret-scam-shield-ai-key-2026-production-secure")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./scam_shield.db")
    UPLOAD_DIR: str = os.getenv("UPLOAD_DIR", os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads"))

settings = Settings()
