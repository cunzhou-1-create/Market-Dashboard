from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.api.auth import get_current_user
from app.models.user import User

router = APIRouter()


# 获取用户设置
@router.get("")
def get_user_settings(
    current_user: User = Depends(get_current_user)
):
    """获取用户设置"""
    # 这里返回模拟的设置数据
    # 生产环境中应该从数据库或缓存中获取
    return {
        "dark_mode": True,
        "email_alerts": True,
        "email_notification_types": {
            "price_alert": True,
            "technical_alert": False,
            "on_chain_event": False,
            "ai_report": False
        },
        "language": "en"
    }


# 更新用户设置
@router.put("")
def update_user_settings(
    dark_mode: bool = None,
    email_alerts: bool = None,
    language: str = None,
    current_user: User = Depends(get_current_user)
):
    """更新用户设置"""
    # 这里更新模拟的设置数据
    # 生产环境中应该更新数据库或缓存中的设置
    updated_settings = {
        "dark_mode": dark_mode,
        "email_alerts": email_alerts,
        "language": language
    }
    
    # 过滤掉None值
    updated_settings = {k: v for k, v in updated_settings.items() if v is not None}
    
    return {
        "message": "设置已更新",
        "settings": updated_settings
    }


# 更新邮件通知类型
@router.put("/email-notifications")
def update_email_notifications(
    price_alert: bool = None,
    technical_alert: bool = None,
    on_chain_event: bool = None,
    ai_report: bool = None,
    current_user: User = Depends(get_current_user)
):
    """更新邮件通知类型"""
    # 这里更新模拟的邮件通知类型
    # 生产环境中应该更新数据库或缓存中的设置
    updated_notifications = {
        "price_alert": price_alert,
        "technical_alert": technical_alert,
        "on_chain_event": on_chain_event,
        "ai_report": ai_report
    }
    
    # 过滤掉None值
    updated_notifications = {k: v for k, v in updated_notifications.items() if v is not None}
    
    return {
        "message": "邮件通知类型已更新",
        "notifications": updated_notifications
    }


# 获取API密钥列表（与交易接口中的重复，这里作为设置的一部分也提供）
@router.get("/api-keys")
def get_api_keys(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """获取API密钥列表"""
    from app.services.trade_service import TradeService
    api_keys = TradeService.get_user_api_keys(db, current_user.id)
    return api_keys


# 添加API密钥（与交易接口中的重复，这里作为设置的一部分也提供）
@router.post("/api-keys")
def add_api_key(
    provider: str,
    api_key: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """添加API密钥"""
    from app.schemas.trade import ApiKeyCreate
    from app.services.trade_service import TradeService
    
    api_key_data = ApiKeyCreate(provider=provider, api_key=api_key)
    api_key = TradeService.add_api_key(db, current_user.id, api_key_data)
    return api_key


# 删除API密钥（与交易接口中的重复，这里作为设置的一部分也提供）
@router.delete("/api-keys/{api_key_id}")
def delete_api_key(
    api_key_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """删除API密钥"""
    from app.services.trade_service import TradeService
    success = TradeService.delete_api_key(db, api_key_id, current_user.id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="API密钥不存在"
        )
    
    return {"message": "API密钥已删除"}