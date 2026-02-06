from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """应用配置类"""
    # 数据库配置
    DATABASE_URL: str
    
    # 安全配置
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # 邮件配置
    EMAIL_HOST: Optional[str] = None
    EMAIL_PORT: Optional[int] = None
    EMAIL_USERNAME: Optional[str] = None
    EMAIL_PASSWORD: Optional[str] = None
    EMAIL_FROM: Optional[str] = None
    
    # API配置
    API_V1_STR: str = "/api"
    PROJECT_NAME: str = "Crypto Booking API"
    
    # 加密货币API配置
    BINANCE_API_KEY: Optional[str] = None
    BINANCE_API_SECRET: Optional[str] = None
    
    # 千问API配置
    QWEN_API_KEY: Optional[str] = None
    QWEN_API_URL: str = "https://ark.cn-beijing.volces.com/api/v3/chat/completions"
    
    # AI交易配置
    AI_TRADE_ENABLED: bool = False
    AI_TRADE_INTERVAL: int = 30  # 交易信号获取间隔（分钟）
    
    class Config:
        env_file = ".env"
        case_sensitive = True


# 创建配置实例
settings = Settings()