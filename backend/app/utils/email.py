import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.config import settings
import random
import string


# 生成验证码
def generate_verification_code(length: int = 6) -> str:
    """生成验证码"""
    return ''.join(random.choices(string.digits, k=length))


# 发送验证邮件
def send_verification_email(email: str, code: str) -> bool:
    """发送验证邮件"""
    if not all([settings.EMAIL_HOST, settings.EMAIL_PORT, settings.EMAIL_USERNAME, settings.EMAIL_PASSWORD]):
        # 邮件配置不完整，返回False
        return False
    
    try:
        # 创建邮件
        msg = MIMEMultipart()
        msg['From'] = settings.EMAIL_FROM
        msg['To'] = email
        msg['Subject'] = '邮箱验证 - Crypto Booking'
        
        # 邮件内容
        body = f"""
        <html>
        <body>
            <h2>邮箱验证</h2>
            <p>您的验证码是：<strong>{code}</strong></p>
            <p>此验证码有效期为10分钟，请尽快使用。</p>
            <p>如果您没有请求此验证码，请忽略此邮件。</p>
        </body>
        </html>
        """
        
        msg.attach(MIMEText(body, 'html'))
        
        # 发送邮件
        with smtplib.SMTP(settings.EMAIL_HOST, settings.EMAIL_PORT) as server:
            server.starttls()
            server.login(settings.EMAIL_USERNAME, settings.EMAIL_PASSWORD)
            server.send_message(msg)
        
        return True
    except Exception as e:
        print(f"发送邮件失败: {e}")
        return False


# 发送价格预警邮件
def send_price_alert_email(email: str, symbol: str, name: str, condition: str, threshold: float, current_price: float) -> bool:
    """发送价格预警邮件"""
    if not all([settings.EMAIL_HOST, settings.EMAIL_PORT, settings.EMAIL_USERNAME, settings.EMAIL_PASSWORD]):
        # 邮件配置不完整，返回False
        return False
    
    try:
        # 创建邮件
        msg = MIMEMultipart()
        msg['From'] = settings.EMAIL_FROM
        msg['To'] = email
        msg['Subject'] = f'价格预警 - {symbol}'
        
        # 邮件内容
        condition_text = '大于' if condition == 'price_gt' else '小于'
        body = f"""
        <html>
        <body>
            <h2>价格预警</h2>
            <p>您关注的 <strong>{name} ({symbol})</strong> 价格已达到预警条件：</p>
            <p>预警条件：价格 {condition_text} {threshold}</p>
            <p>当前价格：{current_price}</p>
            <p>请登录您的账户查看详情。</p>
        </body>
        </html>
        """
        
        msg.attach(MIMEText(body, 'html'))
        
        # 发送邮件
        with smtplib.SMTP(settings.EMAIL_HOST, settings.EMAIL_PORT) as server:
            server.starttls()
            server.login(settings.EMAIL_USERNAME, settings.EMAIL_PASSWORD)
            server.send_message(msg)
        
        return True
    except Exception as e:
        print(f"发送价格预警邮件失败: {e}")
        return False