from typing import Optional
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.auth import UserCreate, UserLogin
from app.utils.security import verify_password, get_password_hash, create_access_token
from app.utils.email import generate_verification_code, send_verification_email

# 存储验证码的临时字典（生产环境中应该使用Redis等缓存）
verification_codes = {}


class AuthService:
    """认证服务类"""
    
    @staticmethod
    def register(db: Session, user_data: UserCreate) -> Optional[User]:
        """用户注册"""
        # 检查邮箱是否已存在
        existing_user = db.query(User).filter(User.email == user_data.email).first()
        if existing_user:
            return None
        
        # 验证验证码
        if not AuthService.verify_code(user_data.email, user_data.code):
            return None
        
        # 创建新用户
        hashed_password = get_password_hash(user_data.password)
        new_user = User(
            email=user_data.email,
            password_hash=hashed_password,
            name=user_data.name or user_data.email.split('@')[0],
            avatar=f"https://ui-avatars.com/api/?name={user_data.email.split('@')[0]}&background=random",
            role="Trader",
            tier="Basic Tier",
            last_login=datetime.utcnow(),
            is_active=True
        )
        
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        return new_user
    
    @staticmethod
    def login(db: Session, user_data: UserLogin) -> Optional[User]:
        """用户登录"""
        # 查找用户
        user = db.query(User).filter(User.email == user_data.email).first()
        if not user:
            return None
        
        # 验证密码
        if not verify_password(user_data.password, user.password_hash):
            return None
        
        # 更新最后登录时间
        user.last_login = datetime.utcnow()
        db.commit()
        db.refresh(user)
        
        return user
    
    @staticmethod
    def get_user_by_id(db: Session, user_id: int) -> Optional[User]:
        """根据ID获取用户"""
        return db.query(User).filter(User.id == user_id).first()
    
    @staticmethod
    def get_user_by_email(db: Session, email: str) -> Optional[User]:
        """根据邮箱获取用户"""
        return db.query(User).filter(User.email == email).first()
    
    @staticmethod
    def send_verification_code(email: str) -> bool:
        """发送验证码"""
        # 生成验证码
        code = generate_verification_code()
        
        # 存储验证码（有效期10分钟）
        verification_codes[email] = {
            "code": code,
            "expires_at": datetime.utcnow() + timedelta(minutes=10)
        }
        
        # 发送邮件
        return send_verification_email(email, code)
    
    @staticmethod
    def verify_code(email: str, code: str) -> bool:
        """验证验证码"""
        if email not in verification_codes:
            return False
        
        code_data = verification_codes[email]
        if datetime.utcnow() > code_data["expires_at"]:
            # 验证码已过期
            del verification_codes[email]
            return False
        
        if code_data["code"] != code:
            return False
        
        # 验证码验证成功，删除验证码
        del verification_codes[email]
        return True
    
    @staticmethod
    def create_token(user: User) -> str:
        """创建访问令牌"""
        access_token_expires = timedelta(minutes=30)
        access_token = create_access_token(
            data={"sub": str(user.id)},
            expires_delta=access_token_expires
        )
        return access_token