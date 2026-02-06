from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


class MarketDataBase(BaseModel):
    """市场数据基础模型"""
    symbol: str
    name: str
    price: float
    change: float
    is_positive: bool


class MarketDataCreate(MarketDataBase):
    """市场数据创建模型"""
    pass


class MarketDataResponse(MarketDataBase):
    """市场数据响应模型"""
    id: int
    last_updated: datetime
    
    class Config:
        from_attributes = True


class MarketDataList(BaseModel):
    """市场数据列表响应模型"""
    data: List[MarketDataResponse]
    total: int


class WatchlistItem(BaseModel):
    """观察列表项模型"""
    symbol_id: int


class WatchlistResponse(BaseModel):
    """观察列表响应模型"""
    id: int
    user_id: int
    symbol_id: int
    symbol: str
    name: str
    price: float
    change: float
    is_positive: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


class TechnicalIndicator(BaseModel):
    """技术指标模型"""
    rsi: float
    macd: dict
    ema: dict
    bollinger: dict


class TechnicalResponse(BaseModel):
    """技术指标响应模型"""
    symbol: str
    indicators: TechnicalIndicator