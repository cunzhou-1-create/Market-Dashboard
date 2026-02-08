import requests
import json
from typing import Dict, Optional
from app.config import settings


class TelegramBot:
    """Telegram Bot工具类
    
    用于发送Telegram通知
    """
    
    def __init__(self, token: Optional[str] = None):
        """初始化Telegram Bot
        
        Args:
            token: Telegram Bot token，如果为None则使用配置文件中的TOKEN
        """
        self.token = token or getattr(settings, 'TELEGRAM_BOT_TOKEN', '')
        self.api_url = f"https://api.telegram.org/bot{self.token}/"
    
    def send_message(self, chat_id: str, text: str, parse_mode: Optional[str] = 'Markdown') -> bool:
        """发送Telegram消息
        
        Args:
            chat_id: 聊天ID
            text: 消息内容
            parse_mode: 解析模式，可选值：Markdown, HTML
        
        Returns:
            bool: 消息发送是否成功
        """
        if not self.token:
            print("Telegram Bot token未配置")
            return False
        
        try:
            url = self.api_url + "sendMessage"
            data = {
                "chat_id": chat_id,
                "text": text,
                "parse_mode": parse_mode
            }
            response = requests.post(url, json=data, timeout=10)
            response.raise_for_status()
            return True
        except Exception as e:
            print(f"发送Telegram消息失败: {e}")
            return False
    
    def send_chain_event_alert(self, chat_id: str, alert_title: str, event_type: str, chain: str, event_data: dict) -> bool:
        """发送链上事件提醒到Telegram
        
        Args:
            chat_id: 聊天ID
            alert_title: 链上事件提醒标题
            event_type: 事件类型
            chain: 区块链
            event_data: 事件数据
        
        Returns:
            bool: 消息发送是否成功
        """
        # 根据事件类型生成消息内容
        if event_type == 'large_transfer':
            # 大额转账事件
            value = event_data.get('value', '0')
            from_address = event_data.get('from_address', '')
            to_address = event_data.get('to_address', '')
            tx_hash = event_data.get('hash', '')
            
            text = f"*链上事件提醒*\n\n*提醒标题*: {alert_title}\n*事件类型*: 大额转账\n*区块链*: {chain.upper()}\n*转账金额*: {value} {chain.upper()}\n*发送地址*: {from_address}\n*接收地址*: {to_address}\n*交易哈希*: {tx_hash}\n"
        elif event_type == 'exchange_inflow':
            # 交易所净流入事件
            exchange = event_data.get('exchange', '')
            inflow = event_data.get('inflow', '0')
            asset = event_data.get('asset', '')
            
            text = f"""*链上事件提醒*\n\n*提醒标题*: {alert_title}\n*事件类型*: 交易所净流入突增\n*区块链*: {chain.upper()}\n*交易所*: {exchange}\n*净流入金额*: {inflow} {asset}\n"""
        else:
            # 其他事件类型
            text = f"""*链上事件提醒*\n\n*提醒标题*: {alert_title}\n*事件类型*: {event_type}\n*区块链*: {chain.upper()}\n*事件数据*: {event_data}\n"""
        
        return self.send_message(chat_id, text)


class WebhookSender:
    """Webhook发送工具类
    
    用于发送Webhook回调
    """
    
    def send_webhook(self, url: str, data: dict, headers: Optional[Dict[str, str]] = None) -> bool:
        """发送Webhook回调
        
        Args:
            url: Webhook URL
            data: 发送的数据
            headers: 自定义HTTP头
        
        Returns:
            bool: Webhook发送是否成功
        """
        if not url:
            print("Webhook URL未配置")
            return False
        
        try:
            default_headers = {
                "Content-Type": "application/json"
            }
            if headers:
                default_headers.update(headers)
            
            response = requests.post(url, json=data, headers=default_headers, timeout=10)
            response.raise_for_status()
            return True
        except Exception as e:
            print(f"发送Webhook失败: {e}")
            return False
    
    def send_chain_event_alert(self, url: str, alert_title: str, event_type: str, chain: str, event_data: dict) -> bool:
        """发送链上事件提醒Webhook
        
        Args:
            url: Webhook URL
            alert_title: 链上事件提醒标题
            event_type: 事件类型
            chain: 区块链
            event_data: 事件数据
        
        Returns:
            bool: Webhook发送是否成功
        """
        data = {
            "type": "chain_event_alert",
            "alert_title": alert_title,
            "event_type": event_type,
            "chain": chain,
            "event_data": event_data,
            "timestamp": event_data.get('timestamp')
        }
        
        return self.send_webhook(url, data)


# 创建全局实例
telegram_bot = TelegramBot()
webhook_sender = WebhookSender()


def get_telegram_bot() -> TelegramBot:
    """获取Telegram Bot实例
    
    Returns:
        TelegramBot: Telegram Bot实例
    """
    return telegram_bot


def get_webhook_sender() -> WebhookSender:
    """获取Webhook发送实例
    
    Returns:
        WebhookSender: Webhook发送实例
    """
    return webhook_sender
