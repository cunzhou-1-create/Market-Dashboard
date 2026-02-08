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
    print(f"开始发送验证码到邮箱：{email}")
    print(f"邮件配置：")
    print(f"  HOST: {settings.EMAIL_HOST}")
    print(f"  PORT: {settings.EMAIL_PORT}")
    print(f"  USERNAME: {settings.EMAIL_USERNAME}")
    print(f"  PASSWORD: {'***' if settings.EMAIL_PASSWORD else 'None'}")
    print(f"  FROM: {settings.EMAIL_FROM}")
    
    if not all([settings.EMAIL_HOST, settings.EMAIL_PORT, settings.EMAIL_USERNAME, settings.EMAIL_PASSWORD]):
        # 邮件配置不完整，返回False
        print("邮件发送失败：邮箱配置不完整，请检查.env文件中的邮件配置")
        return False
    
    try:
        # 创建邮件
        msg = MIMEMultipart()
        msg['From'] = settings.EMAIL_FROM or settings.EMAIL_USERNAME
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
            <p>---</p>
            <p>此邮件由 Crypto Booking 系统自动发送，请勿直接回复。</p>
        </body>
        </html>
        """
        
        msg.attach(MIMEText(body, 'html', 'utf-8'))
        
        # 发送邮件
        print(f"连接到SMTP服务器：{settings.EMAIL_HOST}:{settings.EMAIL_PORT}")
        with smtplib.SMTP_SSL(settings.EMAIL_HOST, settings.EMAIL_PORT, timeout=15) as server:
            server.set_debuglevel(1)  # 开启调试信息
            print(f"尝试登录邮箱：{settings.EMAIL_USERNAME}")
            server.login(settings.EMAIL_USERNAME, settings.EMAIL_PASSWORD)
            print("邮箱登录成功")
            print("发送邮件...")
            server.send_message(msg)
            print("邮件发送成功")
        
        print(f"验证码已成功发送到邮箱：{email}")
        return True
    except smtplib.SMTPAuthenticationError as e:
        print(f"邮件发送失败：SMTP认证失败，请检查邮箱用户名和密码是否正确")
        print(f"错误信息：{str(e)}")
        return False
    except smtplib.SMTPConnectError as e:
        print(f"邮件发送失败：无法连接到SMTP服务器 {settings.EMAIL_HOST}:{settings.EMAIL_PORT}")
        print(f"错误信息：{str(e)}")
        return False
    except smtplib.SMTPException as e:
        print(f"邮件发送失败：SMTP错误")
        print(f"错误信息：{str(e)}")
        return False
    except Exception as e:
        print(f"邮件发送失败: {str(e)}")
        import traceback
        traceback.print_exc()
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


# 发送链上事件提醒邮件
def send_chain_event_alert_email(email: str, alert_title: str, event_type: str, chain: str, event_data: dict) -> bool:
    """发送链上事件提醒邮件
    
    Args:
        email: 接收邮件的邮箱地址
        alert_title: 链上事件提醒标题
        event_type: 事件类型
        chain: 区块链
        event_data: 事件数据
    
    Returns:
        bool: 邮件发送是否成功
    """
    if not all([settings.EMAIL_HOST, settings.EMAIL_PORT, settings.EMAIL_USERNAME, settings.EMAIL_PASSWORD]):
        # 邮件配置不完整，返回False
        return False
    
    try:
        # 创建邮件
        msg = MIMEMultipart()
        msg['From'] = settings.EMAIL_FROM
        msg['To'] = email
        msg['Subject'] = f'链上事件提醒 - {alert_title}'
        
        # 根据事件类型生成邮件内容
        if event_type == 'large_transfer':
            # 大额转账事件
            value = event_data.get('value', '0')
            from_address = event_data.get('from_address', '')
            to_address = event_data.get('to_address', '')
            tx_hash = event_data.get('hash', '')
            
            body = f"""
            <html>
            <body>
                <h2>链上事件提醒</h2>
                <p>您关注的 <strong>{alert_title}</strong> 事件已触发：</p>
                <p>事件类型：大额转账</p>
                <p>区块链：{chain.upper()}</p>
                <p>转账金额：{value} {chain.upper()}</p>
                <p>发送地址：{from_address}</p>
                <p>接收地址：{to_address}</p>
                <p>交易哈希：{tx_hash}</p>
                <p>请登录您的账户查看详情。</p>
            </body>
            </html>
            """
        elif event_type == 'exchange_inflow':
            # 交易所净流入事件
            exchange = event_data.get('exchange', '')
            inflow = event_data.get('inflow', '0')
            asset = event_data.get('asset', '')
            
            body = f"""
            <html>
            <body>
                <h2>链上事件提醒</h2>
                <p>您关注的 <strong>{alert_title}</strong> 事件已触发：</p>
                <p>事件类型：交易所净流入突增</p>
                <p>区块链：{chain.upper()}</p>
                <p>交易所：{exchange}</p>
                <p>净流入金额：{inflow} {asset}</p>
                <p>请登录您的账户查看详情。</p>
            </body>
            </html>
            """
        else:
            # 其他事件类型
            body = f"""
            <html>
            <body>
                <h2>链上事件提醒</h2>
                <p>您关注的 <strong>{alert_title}</strong> 事件已触发：</p>
                <p>事件类型：{event_type}</p>
                <p>区块链：{chain.upper()}</p>
                <p>事件数据：{event_data}</p>
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
        print(f"发送链上事件提醒邮件失败: {e}")
        return False


# 发送通用邮件
def send_email(to_email: str, subject: str, body: str) -> bool:
    """发送通用邮件
    
    Args:
        to_email: 接收邮件的邮箱地址
        subject: 邮件主题
        body: 邮件内容
    
    Returns:
        bool: 邮件发送是否成功
    """
    if not all([settings.EMAIL_HOST, settings.EMAIL_PORT, settings.EMAIL_USERNAME, settings.EMAIL_PASSWORD]):
        # 邮件配置不完整，返回False
        return False
    
    try:
        # 创建邮件
        msg = MIMEMultipart()
        msg['From'] = settings.EMAIL_FROM or settings.EMAIL_USERNAME
        msg['To'] = to_email
        msg['Subject'] = subject
        
        # 邮件内容
        email_body = f"""
        <html>
        <body>
            {body}
        </body>
        </html>
        """
        
        msg.attach(MIMEText(email_body, 'html', 'utf-8'))
        
        # 发送邮件
        with smtplib.SMTP_SSL(settings.EMAIL_HOST, settings.EMAIL_PORT, timeout=10) as server:
            server.login(settings.EMAIL_USERNAME, settings.EMAIL_PASSWORD)
            server.send_message(msg)
        
        return True
    except Exception as e:
        print(f"发送邮件失败: {e}")
        return False