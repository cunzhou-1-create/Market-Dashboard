from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.auth import UserResponse
from app.api.auth import get_current_user
from app.models.user import User

router = APIRouter()


# 获取用户个人资料
@router.get("/profile", response_model=UserResponse)
def get_user_profile(
    current_user: User = Depends(get_current_user)
):
    """获取用户个人资料"""
    return current_user


# 更新用户个人资料
@router.put("/profile", response_model=UserResponse)
def update_user_profile(
    name: str,
    avatar: str = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """更新用户个人资料"""
    # 更新用户信息
    current_user.name = name
    if avatar:
        current_user.avatar = avatar
    
    db.commit()
    db.refresh(current_user)
    
    return current_user


# 获取用户统计信息
@router.get("/stats")
def get_user_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """获取用户统计信息"""
    # 这里可以添加各种统计信息，例如：
    # - 交易次数
    # - 观察列表数量
    # - 价格预警数量
    # - 账户余额等
    
    # 暂时返回模拟数据
    return {
        "total_trades": 12,
        "watchlist_count": 5,
        "alert_count": 3,
        "total_volume": 50000,
        "profit_loss": 2500
    }


# 获取用户历史登录记录
@router.get("/login-history")
def get_login_history(
    current_user: User = Depends(get_current_user)
):
    """获取用户历史登录记录"""
    # 暂时返回模拟数据
    return {
        "last_login": current_user.last_login,
        "login_history": [
            {
                "timestamp": "2024-01-01T10:00:00Z",
                "ip": "192.168.1.1",
                "device": "Desktop"
            },
            {
                "timestamp": "2023-12-31T18:30:00Z",
                "ip": "192.168.1.1",
                "device": "Mobile"
            }
        ]
    }