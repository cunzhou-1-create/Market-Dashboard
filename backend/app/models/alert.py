from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime
from sqlalchemy.sql import func
from app.database import Base


class PriceAlert(Base):
    """价格预警模型"""
    __tablename__ = "price_alerts"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False, index=True)
    symbol_id = Column(Integer, nullable=False, index=True)
    condition = Column(String(20), nullable=False)  # 'price_gt' 或 'price_lt'
    threshold = Column(Float, nullable=False)
    frequency = Column(String(50), nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())