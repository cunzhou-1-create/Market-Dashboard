from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
import os
import uuid
from datetime import datetime
from app.database import get_db
from app.schemas.auth import UserResponse
from app.api.auth import get_current_user
from app.models.user import User

router = APIRouter()

# 允许的图片文件类型
ALLOWED_EXTENSIONS = {"jpg", "jpeg", "png", "gif", "webp"}

# 检查文件类型是否允许
def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

# 生成唯一文件名
def generate_unique_filename(filename):
    ext = filename.rsplit(".", 1)[1].lower()
    unique_id = uuid.uuid4().hex
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    return f"{timestamp}_{unique_id}.{ext}"


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


# 通过文件上传更新用户头像
@router.post("/profile/avatar", response_model=UserResponse)
def update_user_avatar(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """通过文件上传更新用户头像
    
    - **file**: 要上传的头像图片文件
    - 支持的格式: jpg, jpeg, png, gif, webp
    - 文件大小限制: 5MB
    """
    # 检查文件类型
    if not allowed_file(file.filename):
        raise HTTPException(
            status_code=400,
            detail="只允许上传图片文件 (jpg, jpeg, png, gif, webp)"
        )
    
    # 检查文件大小 (限制为5MB)
    contents = file.file.read()
    if len(contents) > 5 * 1024 * 1024:
        raise HTTPException(
            status_code=400,
            detail="文件大小不能超过5MB"
        )
    
    # 重置文件指针
    file.file.seek(0)
    
    # 生成唯一文件名
    unique_filename = generate_unique_filename(file.filename)
    
    # 确保上传目录存在
    upload_dir = os.path.join("uploads", "images")
    os.makedirs(upload_dir, exist_ok=True)
    
    # 保存文件
    file_path = os.path.join(upload_dir, unique_filename)
    with open(file_path, "wb") as buffer:
        buffer.write(contents)
    
    # 生成文件URL
    file_url = f"/uploads/images/{unique_filename}"
    
    # 更新用户头像
    current_user.avatar = file_url
    
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