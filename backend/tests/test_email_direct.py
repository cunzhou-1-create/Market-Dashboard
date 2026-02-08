from app.services.auth_service import AuthService
from app.utils.email import send_verification_email, generate_verification_code
from app.config import settings

# 直接测试发送验证码
def test_direct_send_code():
    email = "test@example.com"
    
    print("直接测试发送验证码...")
    print(f"测试邮箱: {email}")
    print(f"邮箱配置:")
    print(f"  HOST: {settings.EMAIL_HOST}")
    print(f"  PORT: {settings.EMAIL_PORT}")
    print(f"  USERNAME: {settings.EMAIL_USERNAME}")
    print(f"  PASSWORD: {'***' if settings.EMAIL_PASSWORD else 'None'}")
    print(f"  FROM: {settings.EMAIL_FROM}")
    
    # 生成验证码
    code = generate_verification_code()
    print(f"生成的验证码: {code}")
    
    # 直接调用发送邮件函数
    print("\n直接调用send_verification_email函数...")
    success = send_verification_email(email, code)
    print(f"邮件发送结果: {success}")
    
    # 测试AuthService的发送验证码方法
    print("\n测试AuthService.send_verification_code方法...")
    auth_success = AuthService.send_verification_code(email)
    print(f"AuthService发送结果: {auth_success}")

if __name__ == "__main__":
    test_direct_send_code()