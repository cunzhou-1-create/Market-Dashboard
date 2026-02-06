from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.sql import func
from app.database import Base


class TradeRecord(Base):
    """交易记录模型"""
    __tablename__ = "trade_records"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False, index=True)
    symbol = Column(String(50), nullable=False, index=True)
    side = Column(String(10), nullable=False)  # 'buy' 或 'sell'
    price = Column(Float, nullable=False)
    quantity = Column(Float, nullable=False)
    total = Column(Float, nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())


class ApiKey(Base):
    """API密钥模型"""
    __tablename__ = "api_keys"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False, index=True)
    provider = Column(String(50), nullable=False)  # 'binance', 'openai', 'anthropic' 等
    api_key_hash = Column(String(255), nullable=False)
    is_connected = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())