from typing import List, Dict, Optional
from sqlalchemy.orm import Session
from app.models.alert import PriceAlert
from app.models.market import MarketData
from app.models.user import User
from app.schemas.alert import PriceAlertCreate, PriceAlertUpdate
from app.utils.crypto import check_price_alert_condition, get_symbol_data
from app.utils.email import send_price_alert_email


class AlertService:
    """价格预警服务类"""
    
    @staticmethod
    def create_alert(db: Session, user_id: int, alert_data: PriceAlertCreate) -> Optional[PriceAlert]:
        """创建价格预警"""
        # 检查币种是否存在
        market_data = db.query(MarketData).filter(MarketData.id == alert_data.symbol_id).first()
        if not market_data:
            return None
        
        # 创建价格预警
        new_alert = PriceAlert(
            user_id=user_id,
            symbol_id=alert_data.symbol_id,
            condition=alert_data.condition,
            threshold=alert_data.threshold,
            frequency=alert_data.frequency,
            is_active=True
        )
        
        db.add(new_alert)
        db.commit()
        db.refresh(new_alert)
        
        return new_alert
    
    @staticmethod
    def update_alert(db: Session, alert_id: int, user_id: int, alert_data: PriceAlertUpdate) -> Optional[PriceAlert]:
        """更新价格预警"""
        # 查找价格预警
        alert = db.query(PriceAlert).filter(
            PriceAlert.id == alert_id,
            PriceAlert.user_id == user_id
        ).first()
        
        if not alert:
            return None
        
        # 更新价格预警
        if alert_data.condition is not None:
            alert.condition = alert_data.condition
        if alert_data.threshold is not None:
            alert.threshold = alert_data.threshold
        if alert_data.frequency is not None:
            alert.frequency = alert_data.frequency
        if alert_data.is_active is not None:
            alert.is_active = alert_data.is_active
        
        db.commit()
        db.refresh(alert)
        
        return alert
    
    @staticmethod
    def delete_alert(db: Session, alert_id: int, user_id: int) -> bool:
        """删除价格预警"""
        # 查找价格预警
        alert = db.query(PriceAlert).filter(
            PriceAlert.id == alert_id,
            PriceAlert.user_id == user_id
        ).first()
        
        if not alert:
            return False
        
        db.delete(alert)
        db.commit()
        
        return True
    
    @staticmethod
    def toggle_alert(db: Session, alert_id: int, user_id: int) -> Optional[PriceAlert]:
        """切换价格预警状态"""
        # 查找价格预警
        alert = db.query(PriceAlert).filter(
            PriceAlert.id == alert_id,
            PriceAlert.user_id == user_id
        ).first()
        
        if not alert:
            return None
        
        # 切换状态
        alert.is_active = not alert.is_active
        
        db.commit()
        db.refresh(alert)
        
        return alert
    
    @staticmethod
    def get_user_alerts(db: Session, user_id: int) -> List[Dict]:
        """获取用户的价格预警列表"""
        # 使用JOIN一次性获取价格预警和对应的市场数据
        from sqlalchemy import join
        
        alerts_with_market = db.query(PriceAlert, MarketData).join(
            MarketData, PriceAlert.symbol_id == MarketData.id
        ).filter(PriceAlert.user_id == user_id).all()
        
        # 构建响应数据
        result = []
        for alert, market_data in alerts_with_market:
            result.append({
                "id": alert.id,
                "user_id": alert.user_id,
                "symbol_id": alert.symbol_id,
                "symbol": market_data.symbol,
                "name": market_data.name,
                "condition": alert.condition,
                "threshold": alert.threshold,
                "frequency": alert.frequency,
                "is_active": alert.is_active,
                "created_at": alert.created_at,
                "updated_at": alert.updated_at
            })
        
        return result
    
    @staticmethod
    def check_alerts(db: Session) -> None:
        """检查所有价格预警"""
        # 获取所有激活的价格预警
        active_alerts = db.query(PriceAlert).filter(PriceAlert.is_active == True).all()
        
        for alert in active_alerts:
            # 获取对应的市场数据
            market_data = db.query(MarketData).filter(MarketData.id == alert.symbol_id).first()
            if not market_data:
                continue
            
            # 检查价格预警条件
            if check_price_alert_condition(
                market_data.price,
                alert.condition,
                alert.threshold
            ):
                # 获取用户信息
                user = db.query(User).filter(User.id == alert.user_id).first()
                if user:
                    # 发送价格预警邮件
                    send_price_alert_email(
                        user.email,
                        market_data.symbol,
                        market_data.name,
                        alert.condition,
                        alert.threshold,
                        market_data.price
                    )
                    
                    # 可以在这里添加其他通知方式，例如短信、推送通知等