from typing import Optional
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.auth import UserCreate, UserLogin
from app.utils.security import create_access_token
from app.utils.email import send_verification_email, generate_verification_code
import hashlib

# 存储验证码的临时字典（生产环境中应该使用Redis等缓存）
verification_codes = {}


class AuthService:
    """认证服务类"""
    
    @staticmethod
    def simple_password_hash(password: str) -> str:
        """简单的密码哈希函数，避免bcrypt的密码长度限制"""
        return hashlib.sha256(password.encode()).hexdigest()
    
    @staticmethod
    def simple_verify_password(plain_password: str, hashed_password: str) -> bool:
        """简单的密码验证函数"""
        return AuthService.simple_password_hash(plain_password) == hashed_password
    
    @staticmethod
    def register(db: Session, user_data: UserCreate) -> Optional[User]:
        """用户注册"""
        try:
            print(f"开始注册用户，邮箱：{user_data.email}")
            print(f"用户数据：{user_data}")
            
            # 检查邮箱是否已存在
            existing_user = db.query(User).filter(User.email == user_data.email).first()
            if existing_user:
                print(f"注册失败：邮箱 {user_data.email} 已存在")
                return None
            
            # 验证验证码
            print(f"验证验证码，邮箱：{user_data.email}，验证码：{user_data.code}")
            if not AuthService.verify_code(user_data.email, user_data.code):
                print(f"注册失败：验证码无效")
                return None
            
            # 创建新用户
            print(f"创建新用户，邮箱：{user_data.email}")
            try:
                # 使用简单的密码哈希函数，避免bcrypt的密码长度限制
                hashed_password = AuthService.simple_password_hash(user_data.password)
                print(f"密码哈希生成成功")
            except Exception as e:
                print(f"密码哈希生成失败：{str(e)}")
                import traceback
                traceback.print_exc()
                return None
            
            try:
                # 获取用户名
                username = user_data.name or user_data.email.split('@')[0]
                print(f"用户名为：{username}")
                
                new_user = User(
                    email=user_data.email,
                    password_hash=hashed_password,
                    name=username,
                    avatar=f"https://ui-avatars.com/api/?name={username}&background=random",
                    role="Trader",
                    tier="Basic Tier",
                    last_login=datetime.utcnow(),
                    is_active=True
                )
                print(f"新用户对象创建成功")
            except Exception as e:
                print(f"创建用户对象失败：{str(e)}")
                import traceback
                traceback.print_exc()
                return None
            
            try:
                db.add(new_user)
                print(f"用户添加到数据库")
            except Exception as e:
                print(f"添加用户到数据库失败：{str(e)}")
                import traceback
                traceback.print_exc()
                return None
            
            try:
                db.commit()
                print(f"数据库提交成功")
            except Exception as e:
                print(f"数据库提交失败：{str(e)}")
                import traceback
                traceback.print_exc()
                db.rollback()
                return None
            
            try:
                db.refresh(new_user)
                print(f"用户刷新成功")
            except Exception as e:
                print(f"刷新用户失败：{str(e)}")
                import traceback
                traceback.print_exc()
                return None
            
            print(f"注册成功：用户 {user_data.email} 创建成功")
            print(f"新用户ID：{new_user.id}")
            return new_user
        except Exception as e:
            print(f"注册过程中发生错误：{str(e)}")
            import traceback
            traceback.print_exc()
            return None
    
    @staticmethod
    def login(db: Session, user_data: UserLogin) -> Optional[User]:
        """用户登录"""
        # 查找用户
        user = db.query(User).filter(User.email == user_data.email).first()
        if not user:
            return None
        
        # 验证密码
        if not AuthService.simple_verify_password(user_data.password, user.password_hash):
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
        try:
            # 生成随机六位数字验证码
            code = generate_verification_code()
            
            # 存储验证码（有效期10分钟）
            expires_at = datetime.utcnow() + timedelta(minutes=10)
            verification_codes[email] = {
                "code": code,
                "expires_at": expires_at
            }
            
            print(f"生成验证码：{code} 对于邮箱：{email}")
            print(f"验证码有效期至：{expires_at}")
            print(f"当前存储的验证码数量：{len(verification_codes)}")
            
            # 发送邮件
            print(f"准备发送验证码到邮箱：{email}")
            success = send_verification_email(email, code)
            if success:
                print(f"验证码发送成功，邮箱：{email}")
            else:
                print(f"验证码发送失败，邮箱：{email}")
            
        except Exception as e:
            print(f"发送验证码过程中发生错误：{str(e)}")
            import traceback
            traceback.print_exc()
        
        # 即使邮件发送失败，也返回True，因为我们已经生成了验证码并存储了它
        return True
    
    @staticmethod
    def verify_code(email: str, code: str) -> bool:
        """验证验证码"""
        print(f"验证验证码，邮箱：{email}，输入的验证码：{code}")
        print(f"当前存储的验证码数量：{len(verification_codes)}")
        print(f"存储的验证码邮箱列表：{list(verification_codes.keys())}")
        
        if email not in verification_codes:
            print(f"验证码验证失败：邮箱 {email} 不存在于存储的验证码中")
            return False
        
        code_data = verification_codes[email]
        print(f"存储的验证码：{code_data['code']}")
        print(f"验证码有效期至：{code_data['expires_at']}")
        print(f"当前时间：{datetime.utcnow()}")
        
        if datetime.utcnow() > code_data["expires_at"]:
            # 验证码已过期
            print(f"验证码验证失败：验证码已过期")
            del verification_codes[email]
            return False
        
        if code_data["code"] != code:
            print(f"验证码验证失败：验证码不匹配")
            return False
        
        # 验证码验证成功，删除验证码
        print(f"验证码验证成功：邮箱 {email}")
        del verification_codes[email]
        print(f"验证成功后存储的验证码数量：{len(verification_codes)}")
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