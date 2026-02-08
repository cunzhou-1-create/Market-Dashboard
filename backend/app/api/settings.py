from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.api.auth import get_current_user
from app.models.user import User
from app.utils.notification import telegram_bot, webhook_sender
from app.utils.email import send_email

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
    settings_data: dict,
    current_user: User = Depends(get_current_user)
):
    """更新用户设置"""
    # 这里更新模拟的设置数据
    # 生产环境中应该更新数据库或缓存中的设置
    updated_settings = settings_data
    
    # 过滤掉None值
    updated_settings = {k: v for k, v in updated_settings.items() if v is not None}
    
    return {
        "message": "设置已更新",
        "settings": updated_settings
    }


# 更新邮件通知类型
@router.put("/email-notifications")
def update_email_notifications(
    notification_data: dict,
    current_user: User = Depends(get_current_user)
):
    """更新邮件通知类型"""
    # 这里更新模拟的邮件通知类型
    # 生产环境中应该更新数据库或缓存中的设置
    updated_notifications = notification_data
    
    # 过滤掉None值
    updated_notifications = {k: v for k, v in updated_notifications.items() if v is not None}
    
    return {
        "message": "邮件通知类型已更新",
        "notifications": updated_notifications
    }


# 获取通知渠道配置
@router.get("/notification-channels")
def get_notification_channels(
    current_user: User = Depends(get_current_user)
):
    """获取通知渠道配置"""
    # 这里返回模拟的通知渠道配置数据
    # 生产环境中应该从数据库或缓存中获取
    return {
        "channels": {
            "email": {
                "enabled": True,
                "email": current_user.email,
                "required": True
            },
            "telegram": {
                "enabled": False,
                "chat_id": "",
                "required": False
            },
            "webhook": {
                "enabled": False,
                "url": "",
                "required": False
            }
        }
    }


# 更新通知渠道配置
@router.put("/notification-channels")
def update_notification_channels(
    channels_data: dict,
    current_user: User = Depends(get_current_user)
):
    """更新通知渠道配置"""
    # 这里更新模拟的通知渠道配置数据
    # 生产环境中应该更新数据库或缓存中的设置
    updated_channels = channels_data.get("channels", {})
    
    # 确保邮件渠道始终启用
    if "email" in updated_channels:
        updated_channels["email"]["enabled"] = True
    
    return {
        "message": "通知渠道配置已更新",
        "channels": updated_channels
    }


# 测试Telegram通知
@router.post("/notification-channels/telegram/test")
def test_telegram_notification(
    test_data: dict,
    current_user: User = Depends(get_current_user)
):
    """测试Telegram通知"""
    chat_id = test_data.get("chat_id")
    
    if not chat_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="缺少Telegram Chat ID"
        )
    
    # 发送测试消息
    success = telegram_bot.send_message(
        chat_id=chat_id,
        text="这是一条测试消息，验证您的Telegram通知设置是否正常。"
    )
    
    return {
        "success": success,
        "message": "测试消息发送成功" if success else "测试消息发送失败"
    }


# 测试Webhook通知
@router.post("/notification-channels/webhook/test")
def test_webhook_notification(
    test_data: dict,
    current_user: User = Depends(get_current_user)
):
    """测试Webhook通知"""
    webhook_url = test_data.get("url")
    
    if not webhook_url:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="缺少Webhook URL"
        )
    
    # 发送测试Webhook
    test_data = {
        "type": "test",
        "message": "这是一条测试消息，验证您的Webhook设置是否正常。",
        "timestamp": "2024-01-01T00:00:00Z"
    }
    
    success = webhook_sender.send_webhook(webhook_url, test_data)
    
    return {
        "success": success,
        "message": "测试Webhook发送成功" if success else "测试Webhook发送失败"
    }


# 测试邮件通知
@router.post("/notification-channels/email/test")
def test_email_notification(
    test_data: dict,
    current_user: User = Depends(get_current_user)
):
    """测试邮件通知"""
    # 发送测试邮件
    try:
        send_email(
            to_email=current_user.email,
            subject="测试邮件通知",
            body="这是一条测试消息，验证您的邮件通知设置是否正常。"
        )
        return {
            "success": True,
            "message": "测试邮件发送成功"
        }
    except Exception as e:
        return {
            "success": False,
            "message": f"测试邮件发送失败: {str(e)}"
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
    api_key_data: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """添加API密钥"""
    from app.schemas.trade import ApiKeyCreate
    from app.services.trade_service import TradeService
    
    provider = api_key_data.get('provider', '')
    api_key = api_key_data.get('apiKey', '')
    
    if not provider or not api_key:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="缺少必要的API密钥信息"
        )
    
    api_key_obj = ApiKeyCreate(provider=provider, api_key=api_key)
    created_api_key = TradeService.add_api_key(db, current_user.id, api_key_obj)
    return created_api_key


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


# 验证API密钥
@router.post("/api-keys/verify")
def verify_api_key(
    api_key_data: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """验证API密钥"""
    from app.services.trade_service import TradeService
    
    provider = api_key_data.get('provider', '')
    api_key = api_key_data.get('apiKey', '')
    
    if not provider or not api_key:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="缺少必要的API密钥信息"
        )
    
    is_valid = TradeService.verify_api_key(provider, api_key)
    
    return {
        "valid": is_valid,
        "provider": provider,
        "message": "API密钥验证成功" if is_valid else "API密钥验证失败"
    }