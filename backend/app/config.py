"""Application configuration settings"""

from pydantic_settings import BaseSettings
from typing import List
import os


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""
    
    # App Info
    APP_NAME: str = "BlueMind Ocean Restoration API"
    DEBUG: bool = os.getenv("DEBUG", "False").lower() == "true"
    API_VERSION: str = "v1"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "dev-secret-key-change-in-production-please")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./bluemind.db")
    
    # CORS
    ALLOWED_ORIGINS: List[str] = [
        origin.strip() 
        for origin in os.getenv(
            "ALLOWED_ORIGINS", 
            "http://localhost:3000,http://localhost:3001,http://127.0.0.1:3000"
        ).split(",")
    ]
    
    # AI/ML Settings
    ENABLE_AI_PREDICTIONS: bool = os.getenv("ENABLE_AI_PREDICTIONS", "True").lower() == "true"
    MODEL_UPDATE_INTERVAL: int = int(os.getenv("MODEL_UPDATE_INTERVAL", "300"))
    
    # IoT Sensors
    SENSOR_UPDATE_INTERVAL: int = int(os.getenv("SENSOR_UPDATE_INTERVAL", "5"))
    ENABLE_SENSOR_SIMULATION: bool = os.getenv("ENABLE_SENSOR_SIMULATION", "True").lower() == "true"
    
    # Server
    PORT: int = int(os.getenv("PORT", "8000"))
    HOST: str = os.getenv("HOST", "0.0.0.0")
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
