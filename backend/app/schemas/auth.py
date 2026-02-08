from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime


class UserBase(BaseModel):
    """用户基础模型"""
    email: EmailStr
    name: Optional[str] = None


class UserCreate(UserBase):
    """用户创建模型"""
    password: str = Field(..., min_length=6)
    code: str


class UserLogin(BaseModel):
    """用户登录模型"""
    email: EmailStr
    password: str


class UserResponse(UserBase):
    """用户响应模型"""
    id: int
    avatar: Optional[str] = None
    role: str
    tier: str
    joined_at: datetime
    
    class Config:
        from_attributes = True


class Token(BaseModel):
    """令牌模型"""
    access_token: str
    token_type: str


class TokenData(BaseModel):
    """令牌数据模型"""
    user_id: Optional[int] = None


class EmailVerify(BaseModel):
    """邮箱验证模型"""
    email: EmailStr
    code: str


class ResendCode(BaseModel):
    """重发验证码模型"""
    email: EmailStr