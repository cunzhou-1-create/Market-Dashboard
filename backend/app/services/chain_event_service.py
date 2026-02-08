import asyncio
import logging
from typing import Dict, List, Optional
from datetime import datetime
from app.utils.email import send_chain_event_alert_email
from app.utils.notification import get_telegram_bot, get_webhook_sender

# 配置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class ChainEventMonitor:
    """链上事件监控服务
    
    负责监听链上事件，包括大额转账和交易所净流入突增
    """
    
    def __init__(self):
        """初始化链上事件监控服务"""
        self.active_alerts = []
        self.monitoring_tasks = []
        self.is_running = False
    
    def add_alert(self, alert: Dict):
        """添加链上事件提醒
        
        Args:
            alert: 链上事件提醒配置
        """
        self.active_alerts.append(alert)
        logger.info(f"Added chain event alert: {alert['title']}")
    
    def remove_alert(self, alert_id: int):
        """移除链上事件提醒
        
        Args:
            alert_id: 链上事件提醒ID
        """
        self.active_alerts = [alert for alert in self.active_alerts if alert.get('id') != alert_id]
        logger.info(f"Removed chain event alert: {alert_id}")
    
    def update_alert(self, alert_id: int, alert_data: Dict):
        """更新链上事件提醒
        
        Args:
            alert_id: 链上事件提醒ID
            alert_data: 更新后的提醒数据
        """
        for i, alert in enumerate(self.active_alerts):
            if alert.get('id') == alert_id:
                self.active_alerts[i] = {**alert, **alert_data}
                logger.info(f"Updated chain event alert: {alert_id}")
                break
    
    async def start_monitoring(self):
        """开始监控链上事件"""
        if self.is_running:
            logger.warning("Chain event monitoring is already running")
            return
        
        self.is_running = True
        logger.info("Starting chain event monitoring")
        
        # 创建监控任务
        self.monitoring_tasks.append(asyncio.create_task(self._monitor_large_transfers()))
        self.monitoring_tasks.append(asyncio.create_task(self._monitor_exchange_inflows()))
    
    async def stop_monitoring(self):
        """停止监控链上事件"""
        if not self.is_running:
            logger.warning("Chain event monitoring is not running")
            return
        
        self.is_running = False
        logger.info("Stopping chain event monitoring")
        
        # 取消所有监控任务
        for task in self.monitoring_tasks:
            task.cancel()
        
        # 等待所有任务完成
        try:
            await asyncio.gather(*self.monitoring_tasks, return_exceptions=True)
        except Exception as e:
            logger.error(f"Error stopping monitoring tasks: {e}")
        
        self.monitoring_tasks = []
    
    async def _monitor_large_transfers(self):
        """监控大额转账"""
        while self.is_running:
            try:
                # 模拟监控大额转账
                # 实际项目中应该调用区块链API获取最新的转账数据
                logger.info("Monitoring large transfers...")
                
                # 模拟检测到大额转账
                # 实际项目中应该根据真实数据进行判断
                for alert in self.active_alerts:
                    if alert.get('status') == 'active' and alert.get('event_type') == 'large_transfer':
                        # 模拟检测到符合条件的转账
                        threshold = float(alert.get('threshold', '10000'))
                        chain = alert.get('chain', 'ethereum')
                        
                        # 模拟转账数据
                        mock_transfer = {
                            'hash': '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
                            'from_address': '0x1234567890123456789012345678901234567890',
                            'to_address': '0x0987654321098765432109876543210987654321',
                            'value': str(threshold + 1000),  # 超过阈值
                            'chain': chain,
                            'timestamp': datetime.utcnow().isoformat()
                        }
                        
                        # 检查是否超过阈值
                        if float(mock_transfer['value']) > threshold:
                            logger.info(f"Detected large transfer: {mock_transfer['value']} {chain.upper()}")
                            # 发送通知
                            await self._send_notification(alert, mock_transfer)
            except Exception as e:
                logger.error(f"Error monitoring large transfers: {e}")
            
            # 每10秒检查一次
            await asyncio.sleep(10)
    
    async def _monitor_exchange_inflows(self):
        """监控交易所净流入"""
        while self.is_running:
            try:
                # 模拟监控交易所净流入
                # 实际项目中应该调用交易所API或区块链API获取净流入数据
                logger.info("Monitoring exchange inflows...")
                
                # 模拟检测到交易所净流入突增
                # 实际项目中应该根据真实数据进行判断
                for alert in self.active_alerts:
                    if alert.get('status') == 'active' and alert.get('event_type') == 'exchange_inflow':
                        # 模拟检测到符合条件的净流入
                        threshold = float(alert.get('threshold', '10000'))
                        chain = alert.get('chain', 'ethereum')
                        
                        # 模拟净流入数据
                        mock_inflow = {
                            'exchange': 'Binance',
                            'asset': chain.upper(),
                            'inflow': str(threshold + 5000),  # 超过阈值
                            'timestamp': datetime.utcnow().isoformat()
                        }
                        
                        # 检查是否超过阈值
                        if float(mock_inflow['inflow']) > threshold:
                            logger.info(f"Detected exchange inflow spike: {mock_inflow['inflow']} {mock_inflow['asset']} to {mock_inflow['exchange']}")
                            # 发送通知
                            await self._send_notification(alert, mock_inflow)
            except Exception as e:
                logger.error(f"Error monitoring exchange inflows: {e}")
            
            # 每15秒检查一次
            await asyncio.sleep(15)
    
    async def _send_notification(self, alert: Dict, event_data: Dict):
        """发送通知
        
        Args:
            alert: 链上事件提醒配置
            event_data: 事件数据
        """
        notification_channels = alert.get('notification_channels', {
            'email': True,
            'telegram': False,
            'webhook': False
        })
        
        # 邮件通知
        if notification_channels.get('email'):
            await self._send_email_notification(alert, event_data)
        
        # Telegram通知
        if notification_channels.get('telegram') and alert.get('telegram_chat_id'):
            await self._send_telegram_notification(alert, event_data)
        
        # Webhook通知
        if notification_channels.get('webhook') and alert.get('webhook_url'):
            await self._send_webhook_notification(alert, event_data)
    
    async def _send_email_notification(self, alert: Dict, event_data: Dict):
        """发送邮件通知
        
        Args:
            alert: 链上事件提醒配置
            event_data: 事件数据
        """
        # 使用email.py工具发送邮件
        email = alert.get('email', '')  # 实际项目中应该从用户信息中获取邮箱
        if email:
            success = send_chain_event_alert_email(
                email=email,
                alert_title=alert.get('title', ''),
                event_type=alert.get('event_type', 'large_transfer'),
                chain=alert.get('chain', 'ethereum'),
                event_data=event_data
            )
            if success:
                logger.info(f"Email notification sent successfully for alert: {alert['title']}")
            else:
                logger.error(f"Failed to send email notification for alert: {alert['title']}")
        else:
            logger.warning(f"No email address found for alert: {alert['title']}")
    
    async def _send_telegram_notification(self, alert: Dict, event_data: Dict):
        """发送Telegram通知
        
        Args:
            alert: 链上事件提醒配置
            event_data: 事件数据
        """
        # 使用Telegram Bot发送通知
        telegram_bot = get_telegram_bot()
        chat_id = alert.get('telegram_chat_id', '')
        if chat_id:
            success = telegram_bot.send_chain_event_alert(
                chat_id=chat_id,
                alert_title=alert.get('title', ''),
                event_type=alert.get('event_type', 'large_transfer'),
                chain=alert.get('chain', 'ethereum'),
                event_data=event_data
            )
            if success:
                logger.info(f"Telegram notification sent successfully for alert: {alert['title']}")
            else:
                logger.error(f"Failed to send Telegram notification for alert: {alert['title']}")
    
    async def _send_webhook_notification(self, alert: Dict, event_data: Dict):
        """发送Webhook通知
        
        Args:
            alert: 链上事件提醒配置
            event_data: 事件数据
        """
        # 使用Webhook发送通知
        webhook_sender = get_webhook_sender()
        webhook_url = alert.get('webhook_url', '')
        if webhook_url:
            success = webhook_sender.send_chain_event_alert(
                url=webhook_url,
                alert_title=alert.get('title', ''),
                event_type=alert.get('event_type', 'large_transfer'),
                chain=alert.get('chain', 'ethereum'),
                event_data=event_data
            )
            if success:
                logger.info(f"Webhook notification sent successfully for alert: {alert['title']}")
            else:
                logger.error(f"Failed to send Webhook notification for alert: {alert['title']}")


# 创建全局链上事件监控实例
chain_event_monitor = ChainEventMonitor()


def get_chain_event_monitor() -> ChainEventMonitor:
    """获取链上事件监控实例
    
    Returns:
        ChainEventMonitor: 链上事件监控实例
    """
    return chain_event_monitor
