from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.schemas.auth import UserCreate, UserLogin, UserResponse, Token, EmailVerify, ResendCode
from app.services.auth_service import AuthService
from app.utils.security import verify_token

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


# 获取当前用户
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """获取当前用户"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    payload = verify_token(token)
    if payload is None:
        raise credentials_exception
    
    user_id = payload.get("sub")
    if user_id is None:
        raise credentials_exception
    
    user = AuthService.get_user_by_id(db, int(user_id))
    if user is None:
        raise credentials_exception
    
    return user


# 注册
@router.post("/register", response_model=Token)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """用户注册"""
    print(f"接收到注册请求，邮箱：{user_data.email}")
    print(f"注册数据：{user_data}")
    
    user = AuthService.register(db, user_data)
    print(f"AuthService.register返回值：{user}")
    
    if not user:
        print(f"注册失败，抛出HTTPException")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="邮箱已存在或验证码无效"
        )
    
    print(f"注册成功，创建token")
    access_token = AuthService.create_token(user)
    print(f"token创建成功：{access_token}")
    
    return {"access_token": access_token, "token_type": "bearer"}


# 登录
@router.post("/login", response_model=Token)
def login(user_data: UserLogin, db: Session = Depends(get_db)):
    """用户登录"""
    user = AuthService.login(db, user_data)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="邮箱或密码错误",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = AuthService.create_token(user)
    return {"access_token": access_token, "token_type": "bearer"}


# 使用OAuth2密码流登录
@router.post("/login/oauth2", response_model=Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """使用OAuth2密码流登录"""
    user_data = UserLogin(email=form_data.username, password=form_data.password)
    user = AuthService.login(db, user_data)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="邮箱或密码错误",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = AuthService.create_token(user)
    return {"access_token": access_token, "token_type": "bearer"}


# 登出
@router.post("/logout")
def logout(current_user: dict = Depends(get_current_user)):
    """用户登出"""
    # JWT是无状态的，登出只需要客户端删除令牌即可
    return {"message": "登出成功"}


# 刷新令牌
@router.post("/refresh", response_model=Token)
def refresh_token(current_user: dict = Depends(get_current_user)):
    """刷新令牌"""
    access_token = AuthService.create_token(current_user)
    return {"access_token": access_token, "token_type": "bearer"}


# 验证邮箱
@router.post("/verify-email")
def verify_email(verify_data: EmailVerify):
    """验证邮箱"""
    if AuthService.verify_code(verify_data.email, verify_data.code):
        return {"message": "邮箱验证成功"}
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="验证码无效或已过期"
        )


# 发送验证码
@router.post("/send-code")
def send_code(resend_data: ResendCode):
    """发送验证码
    
    用于初始发送验证码
    """
    success = AuthService.send_verification_code(resend_data.email)
    if success:
        return {"message": "验证码已发送"}
    else:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="发送验证码失败，请检查邮箱配置"
        )


# 重发验证码
@router.post("/resend-code")
def resend_code(resend_data: ResendCode):
    """重发验证码
    
    用于重新发送验证码
    """
    success = AuthService.send_verification_code(resend_data.email)
    if success:
        return {"message": "验证码已发送"}
    else:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="发送验证码失败，请检查邮箱配置"
        )


# 获取当前用户信息
@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    """获取当前用户信息"""
    return current_user