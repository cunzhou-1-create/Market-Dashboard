from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime


class TradeRecordBase(BaseModel):
    """交易记录基础模型"""
    symbol: str
    side: str = Field(..., description="交易方向，如 'buy' 或 'sell'")
    price: float
    quantity: float
    total: float


class TradeRecordCreate(TradeRecordBase):
    """交易记录创建模型"""
    pass


class TradeRecordResponse(TradeRecordBase):
    """交易记录响应模型"""
    id: int
    user_id: int
    timestamp: datetime
    
    class Config:
        from_attributes = True


class TradeHistoryResponse(BaseModel):
    """交易历史响应模型"""
    data: List[TradeRecordResponse]
    total: int


class AccountInfo(BaseModel):
    """账户信息模型"""
    total_balance: float
    available_balance: float
    positions: List[dict]


class ApiKeyBase(BaseModel):
    """API密钥基础模型"""
    provider: str
    api_key: str


class ApiKeyCreate(ApiKeyBase):
    """API密钥创建模型"""
    pass


class ApiKeyResponse(BaseModel):
    """API密钥响应模型"""
    id: int
    user_id: int
    provider: str
    is_connected: bool
    created_at: datetime
    
    class Config:
        from_attributes = True