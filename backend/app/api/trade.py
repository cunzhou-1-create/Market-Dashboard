from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Dict, Optional
from app.database import get_db
from app.schemas.trade import (
    TradeRecordCreate, TradeRecordResponse, TradeHistoryResponse, 
    AccountInfo, ApiKeyCreate, ApiKeyResponse, AITradeSignalResponse,
    SimulatedTraderCreate, SimulatedTraderUpdate, SimulatedTraderResponse,
    SimulationSettingUpdate, SimulationSettingResponse, SimulationReportResponse
)
from app.services.trade_service import TradeService
from app.services.ai_service import AIService
from app.services.simulation_service import SimulationService
from app.services.scheduler_service import get_ai_trade_scheduler_status, start_ai_trade_scheduler, stop_ai_trade_scheduler
from app.api.auth import get_current_user
from app.models.user import User
from app.models.trade import AITradeSignal

router = APIRouter()


# 获取交易记录列表
@router.get("/history", response_model=TradeHistoryResponse)
def get_trade_history(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """获取交易记录列表"""
    trades = TradeService.get_user_trades(db, current_user.id, skip, limit)
    total = len(trades)
    
    return {
        "data": trades,
        "total": total
    }


# 创建交易记录
@router.post("/create", response_model=TradeRecordResponse)
def create_trade(
    trade_data: TradeRecordCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """创建交易记录"""
    trade = TradeService.create_trade(db, current_user.id, trade_data)
    return trade


# 获取账户信息
@router.get("/account", response_model=AccountInfo)
def get_account_info(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """获取账户信息"""
    account_info = TradeService.get_account_info(db, current_user.id)
    return account_info


# 获取API密钥列表
@router.get("/api-keys", response_model=List[ApiKeyResponse])
def get_api_keys(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """获取API密钥列表"""
    api_keys = TradeService.get_user_api_keys(db, current_user.id)
    return api_keys


# 添加API密钥
@router.post("/api-keys", response_model=ApiKeyResponse)
def add_api_key(
    api_key_data: ApiKeyCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """添加API密钥"""
    api_key = TradeService.add_api_key(db, current_user.id, api_key_data)
    return api_key


# 删除API密钥
@router.delete("/api-keys/{api_key_id}")
def delete_api_key(
    api_key_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """删除API密钥"""
    success = TradeService.delete_api_key(db, api_key_id, current_user.id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="API密钥不存在"
        )
    
    return {"message": "API密钥已删除"}


# 获取AI交易信号列表
@router.get("/ai/signals", response_model=List[AITradeSignalResponse])
def get_ai_trade_signals(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """获取AI交易信号列表"""
    signals = db.query(AITradeSignal).order_by(
        AITradeSignal.created_at.desc()
    ).offset(skip).limit(limit).all()
    
    return signals


# 获取AI交易调度器状态
@router.get("/ai/scheduler/status", response_model=Dict)
def get_scheduler_status(
    current_user: User = Depends(get_current_user)
):
    """获取AI交易调度器状态"""
    status = get_ai_trade_scheduler_status()
    return status


# 启动AI交易调度器
@router.post("/ai/scheduler/start")
def start_scheduler(
    current_user: User = Depends(get_current_user)
):
    """启动AI交易调度器"""
    start_ai_trade_scheduler()
    return {"message": "AI交易调度器已启动"}


# 停止AI交易调度器
@router.post("/ai/scheduler/stop")
def stop_scheduler(
    current_user: User = Depends(get_current_user)
):
    """停止AI交易调度器"""
    stop_ai_trade_scheduler()
    return {"message": "AI交易调度器已停止"}


# 获取市场分析
@router.get("/ai/market-analysis", response_model=Dict)
def get_market_analysis(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """获取AI市场分析"""
    ai_service = AIService()
    analysis = ai_service.analyze_market(db)
    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="获取市场分析失败"
        )
    
    return analysis


# 手动触发AI交易
@router.post("/ai/trigger")
def trigger_ai_trade(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """手动触发AI交易"""
    ai_service = AIService()
    signal = ai_service.generate_trade_signal(db)
    
    if signal:
        result = ai_service.execute_trade_signal(db, current_user.id, signal)
        return result
    else:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="生成交易信号失败"
        )


# 模拟交易员管理接口

# 创建模拟交易员
@router.post("/simulated-traders", response_model=SimulatedTraderResponse)
def create_simulated_trader(
    trader_data: SimulatedTraderCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """创建模拟交易员"""
    trader = TradeService.create_simulated_trader(db, current_user.id, trader_data)
    return trader


# 获取模拟交易员列表
@router.get("/simulated-traders", response_model=List[SimulatedTraderResponse])
def get_simulated_traders(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """获取模拟交易员列表"""
    traders = TradeService.get_simulated_traders(db, current_user.id)
    return traders


# 获取单个模拟交易员
@router.get("/simulated-traders/{trader_id}", response_model=SimulatedTraderResponse)
def get_simulated_trader(
    trader_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """获取单个模拟交易员"""
    trader = TradeService.get_simulated_trader(db, trader_id, current_user.id)
    if not trader:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="模拟交易员不存在"
        )
    return trader


# 更新模拟交易员
@router.put("/simulated-traders/{trader_id}", response_model=SimulatedTraderResponse)
def update_simulated_trader(
    trader_id: int,
    trader_data: SimulatedTraderUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """更新模拟交易员"""
    trader = TradeService.update_simulated_trader(db, trader_id, current_user.id, trader_data)
    if not trader:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="模拟交易员不存在"
        )
    return trader


# 删除模拟交易员
@router.delete("/simulated-traders/{trader_id}")
def delete_simulated_trader(
    trader_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """删除模拟交易员"""
    success = TradeService.delete_simulated_trader(db, trader_id, current_user.id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="模拟交易员不存在"
        )
    return {"message": "模拟交易员已删除"}


# 模拟交易设置接口

# 获取模拟交易设置
@router.get("/simulation-settings", response_model=SimulationSettingResponse)
def get_simulation_settings(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """获取模拟交易设置"""
    settings = TradeService.get_simulation_settings(db, current_user.id)
    return settings


# 更新模拟交易设置
@router.put("/simulation-settings", response_model=SimulationSettingResponse)
def update_simulation_settings(
    settings_data: SimulationSettingUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """更新模拟交易设置"""
    settings = TradeService.update_simulation_settings(db, current_user.id, settings_data)
    return settings


# 模拟交易执行接口

# 手动执行模拟交易
@router.post("/simulate-trade")
def simulate_trade(
    trader_id: int,
    signal: Dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """手动执行模拟交易"""
    result = SimulationService.execute_simulation_trade(db, current_user.id, trader_id, signal)
    return result


# 运行单个模拟交易员
@router.post("/run-trader/{trader_id}")
def run_trader(
    trader_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """运行单个模拟交易员"""
    result = SimulationService.run_simulation_trader(db, current_user.id, trader_id)
    return result


# 运行所有模拟交易员
@router.post("/run-all-traders")
def run_all_traders(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """运行所有模拟交易员"""
    results = SimulationService.run_all_simulation_traders(db, current_user.id)
    return {"results": results}


# 模拟交易报告接口

# 获取模拟交易报告
@router.get("/simulation-reports", response_model=List[SimulationReportResponse])
def get_simulation_reports(
    trader_id: Optional[int] = Query(None),
    limit: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """获取模拟交易报告"""
    reports = SimulationService.get_simulation_reports(db, current_user.id, trader_id, limit)
    return reports


# 生成模拟交易报告
@router.post("/generate-report/{trader_id}", response_model=SimulationReportResponse)
def generate_report(
    trader_id: int,
    period: str = Query("7d", regex="^(7d|30d|90d)$"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """生成模拟交易报告"""
    report = SimulationService.generate_simulation_report(db, current_user.id, trader_id, period)
    if not report:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="生成报告失败"
        )
    return report


# 扩展现有接口

# 获取账户信息（支持指定模拟交易员）
@router.get("/account/{trader_id}", response_model=AccountInfo)
def get_trader_account_info(
    trader_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """获取指定模拟交易员的账户信息"""
    account_info = TradeService.get_account_info(db, current_user.id, trader_id)
    return account_info