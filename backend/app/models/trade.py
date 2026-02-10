from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, JSON
from sqlalchemy.sql import func
from app.database import Base


class TradeRecord(Base):
    """交易记录模型"""
    __tablename__ = "trade_records"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False, index=True)
    simulated_trader_id = Column(Integer, nullable=True, index=True)  # 关联的模拟交易员ID
    symbol = Column(String(50), nullable=False, index=True)
    side = Column(String(10), nullable=False)  # 'buy' 或 'sell'
    price = Column(Float, nullable=False)
    quantity = Column(Float, nullable=False)
    total = Column(Float, nullable=False)
    is_ai_trade = Column(Boolean, default=False)  # 是否为AI生成的交易
    ai_signal_id = Column(Integer, nullable=True)  # AI信号ID
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


class AITradeSignal(Base):
    """AI交易信号模型"""
    __tablename__ = "ai_trade_signals"
    
    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String(50), nullable=False, index=True)
    side = Column(String(10), nullable=False)  # 'buy' 或 'sell'
    price = Column(Float, nullable=False)
    quantity = Column(Float, nullable=False)
    signal_data = Column(String(500), nullable=True)  # 原始信号数据
    is_executed = Column(Boolean, default=False)  # 是否已执行
    executed_trade_id = Column(Integer, nullable=True)  # 关联的交易记录ID
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    executed_at = Column(DateTime(timezone=True), nullable=True)


class SimulatedTrader(Base):
    """模拟交易员模型"""
    __tablename__ = "simulated_traders"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False, index=True)
    name = Column(String(100), nullable=False)  # 交易员名称
    strategy = Column(String(100), nullable=False)  # 策略名称
    symbol = Column(String(50), nullable=False)  # 交易币对
    refresh_interval = Column(Integer, default=30)  # 刷新频率（分钟）
    initial_balance = Column(Float, default=10000.0)  # 初始资金
    current_balance = Column(Float, default=10000.0)  # 当前资金
    is_active = Column(Boolean, default=True)  # 是否激活
    settings = Column(JSON, nullable=True)  # 其他设置
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class SimulationSetting(Base):
    """模拟交易设置模型"""
    __tablename__ = "simulation_settings"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False, index=True)
    global_enabled = Column(Boolean, default=True)  # 全局模拟交易开关
    open_signal_notification = Column(Boolean, default=True)  # 开仓信号通知开关
    close_signal_notification = Column(Boolean, default=True)  # 平仓信号通知开关
    default_refresh_interval = Column(Integer, default=30)  # 默认刷新频率（分钟）
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class SimulationReport(Base):
    """模拟交易报告模型"""
    __tablename__ = "simulation_reports"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False, index=True)
    simulated_trader_id = Column(Integer, nullable=False, index=True)  # 关联的模拟交易员ID
    period = Column(String(20), nullable=False)  # 报告周期
    start_balance = Column(Float, nullable=False)  # 期初资金
    end_balance = Column(Float, nullable=False)  # 期末资金
    total_profit = Column(Float, nullable=False)  # 总盈亏
    total_trades = Column(Integer, nullable=False)  # 总交易次数
    win_rate = Column(Float, nullable=False)  # 胜率
    max_drawdown = Column(Float, nullable=False)  # 最大回撤
    report_data = Column(JSON, nullable=True)  # 详细报告数据
    created_at = Column(DateTime(timezone=True), server_default=func.now())