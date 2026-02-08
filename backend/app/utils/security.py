from datetime import datetime, timedelta
from typing import Optional, Union
from jose import JWTError, jwt
from app.config import settings
import hashlib

# 密码加密上下文 - 使用简单的哈希函数，避免bcrypt的密码长度限制


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """验证密码"""
    return get_password_hash(plain_password) == hashed_password


def get_password_hash(password: str) -> str:
    """获取密码哈希值"""
    return hashlib.sha256(password.encode()).hexdigest()


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """创建访问令牌"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt


def verify_token(token: str) -> Optional[dict]:
    """验证令牌"""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except JWTError:
        return None


def hash_api_key(api_key: str) -> str:
    """哈希API密钥"""
    return hashlib.sha256(api_key.encode()).hexdigest()


def verify_api_key(plain_api_key: str, hashed_api_key: str) -> bool:
    """验证API密钥"""
    return hash_api_key(plain_api_key) == hashed_api_key
