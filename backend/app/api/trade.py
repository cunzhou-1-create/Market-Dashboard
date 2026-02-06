from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Dict
from app.database import get_db
from app.schemas.trade import (
    TradeRecordCreate, TradeRecordResponse, TradeHistoryResponse, 
    AccountInfo, ApiKeyCreate, ApiKeyResponse, AITradeSignalResponse
)
from app.services.trade_service import TradeService
from app.services.ai_service import AIService
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