import schedule
import time
import threading
from typing import Optional, Dict
from sqlalchemy.orm import Session
from app.config import settings
from app.services.ai_service import AIService
from app.database import SessionLocal


class SchedulerService:
    """定时任务服务类，用于执行AI交易相关的定时任务"""
    
    def __init__(self):
        """初始化定时任务服务"""
        self.scheduler = schedule
        self.running = False
        self.thread = None
    
    def get_db(self) -> Session:
        """获取数据库会话"""
        db = SessionLocal()
        try:
            return db
        except Exception as e:
            print(f"获取数据库会话失败: {str(e)}")
            db.close()
            raise
    
    def execute_ai_trade_task(self):
        """执行AI交易任务"""
        print("执行AI交易任务...")
        db = None
        try:
            db = self.get_db()
            
            # 生成交易信号
            ai_service = AIService()
            signal = ai_service.generate_trade_signal(db)
            
            if signal:
                print(f"获取到交易信号: {signal}")
                
                # 执行交易（使用默认用户ID 1）
                result = ai_service.execute_trade_signal(db, 1, signal)
                print(f"交易执行结果: {result}")
            else:
                print("未获取到有效的交易信号")
                
        except Exception as e:
            print(f"执行AI交易任务失败: {str(e)}")
        finally:
            if db:
                db.close()
    
    def start_scheduler(self):
        """启动定时任务调度器"""
        if self.running:
            print("定时任务调度器已经在运行")
            return
        
        # 设置定时任务
        interval = settings.AI_TRADE_INTERVAL
        self.scheduler.every(interval).minutes.do(self.execute_ai_trade_task)
        
        print(f"定时任务调度器已启动，交易信号获取间隔: {interval}分钟")
        
        # 立即执行一次任务
        self.execute_ai_trade_task()
        
        # 启动调度器线程
        self.running = True
        self.thread = threading.Thread(target=self._run_scheduler, daemon=True)
        self.thread.start()
    
    def _run_scheduler(self):
        """运行调度器的线程函数"""
        while self.running:
            self.scheduler.run_pending()
            time.sleep(1)
    
    def stop_scheduler(self):
        """停止定时任务调度器"""
        if not self.running:
            print("定时任务调度器未运行")
            return
        
        self.running = False
        if self.thread:
            self.thread.join(timeout=5)
        
        # 清除所有任务
        self.scheduler.clear()
        print("定时任务调度器已停止")
    
    def get_scheduler_status(self) -> Dict:
        """获取调度器状态"""
        return {
            "running": self.running,
            "interval": settings.AI_TRADE_INTERVAL,
            "enabled": settings.AI_TRADE_ENABLED
        }


# 创建全局调度器实例
global_scheduler = SchedulerService()


def start_ai_trade_scheduler():
    """启动AI交易调度器"""
    if settings.AI_TRADE_ENABLED:
        global_scheduler.start_scheduler()
    else:
        print("AI交易功能未启用")


def stop_ai_trade_scheduler():
    """停止AI交易调度器"""
    global_scheduler.stop_scheduler()


def get_ai_trade_scheduler_status():
    """获取AI交易调度器状态"""
    return global_scheduler.get_scheduler_status()
