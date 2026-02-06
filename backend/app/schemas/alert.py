from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class PriceAlertBase(BaseModel):
    """价格预警基础模型"""
    symbol_id: int
    condition: str = Field(..., description="条件，如 'price_gt' 或 'price_lt'")
    threshold: float = Field(..., description="价格阈值")
    frequency: str = Field(..., description="预警频率")


class PriceAlertCreate(PriceAlertBase):
    """价格预警创建模型"""
    pass


class PriceAlertUpdate(BaseModel):
    """价格预警更新模型"""
    condition: Optional[str] = None
    threshold: Optional[float] = None
    frequency: Optional[str] = None
    is_active: Optional[bool] = None


class PriceAlertResponse(PriceAlertBase):
    """价格预警响应模型"""
    id: int
    user_id: int
    symbol: str
    name: str
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class PriceAlertToggle(BaseModel):
    """价格预警切换状态模型"""
    is_active: bool