from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.schemas.alert import PriceAlertCreate, PriceAlertUpdate, PriceAlertResponse, PriceAlertToggle
from app.services.alert_service import AlertService
from app.api.auth import get_current_user
from app.models.user import User

router = APIRouter()


# 获取价格预警列表
@router.get("", response_model=List[PriceAlertResponse])
def get_alerts(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """获取价格预警列表"""
    alerts = AlertService.get_user_alerts(db, current_user.id)
    return alerts


# 创建价格预警
@router.post("", response_model=PriceAlertResponse)
def create_alert(
    alert_data: PriceAlertCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """创建价格预警"""
    alert = AlertService.create_alert(db, current_user.id, alert_data)
    if not alert:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="币种不存在"
        )
    
    # 获取对应的市场数据
    from app.models.market import MarketData
    market_data = db.query(MarketData).filter(MarketData.id == alert.symbol_id).first()
    
    return {
        "id": alert.id,
        "user_id": alert.user_id,
        "symbol_id": alert.symbol_id,
        "symbol": market_data.symbol,
        "name": market_data.name,
        "condition": alert.condition,
        "threshold": alert.threshold,
        "frequency": alert.frequency,
        "is_active": alert.is_active,
        "created_at": alert.created_at,
        "updated_at": alert.updated_at
    }


# 更新价格预警
@router.put("/{alert_id}", response_model=PriceAlertResponse)
def update_alert(
    alert_id: int,
    alert_data: PriceAlertUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """更新价格预警"""
    alert = AlertService.update_alert(db, alert_id, current_user.id, alert_data)
    if not alert:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="价格预警不存在"
        )
    
    # 获取对应的市场数据
    from app.models.market import MarketData
    market_data = db.query(MarketData).filter(MarketData.id == alert.symbol_id).first()
    
    return {
        "id": alert.id,
        "user_id": alert.user_id,
        "symbol_id": alert.symbol_id,
        "symbol": market_data.symbol,
        "name": market_data.name,
        "condition": alert.condition,
        "threshold": alert.threshold,
        "frequency": alert.frequency,
        "is_active": alert.is_active,
        "created_at": alert.created_at,
        "updated_at": alert.updated_at
    }


# 删除价格预警
@router.delete("/{alert_id}")
def delete_alert(
    alert_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """删除价格预警"""
    success = AlertService.delete_alert(db, alert_id, current_user.id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="价格预警不存在"
        )
    
    return {"message": "价格预警已删除"}


# 切换价格预警状态
@router.put("/{alert_id}/toggle", response_model=PriceAlertToggle)
def toggle_alert(
    alert_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """切换价格预警状态"""
    alert = AlertService.toggle_alert(db, alert_id, current_user.id)
    if not alert:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="价格预警不存在"
        )
    
    return {
        "is_active": alert.is_active
    }


# 检查价格预警（内部使用，可通过定时任务调用）
@router.post("/check")
def check_alerts(
    db: Session = Depends(get_db)
):
    """检查价格预警"""
    AlertService.check_alerts(db)
    return {"message": "价格预警检查完成"}