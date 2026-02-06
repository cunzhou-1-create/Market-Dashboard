from typing import List, Dict, Optional
from sqlalchemy.orm import Session
from app.models.trade import TradeRecord, ApiKey
from app.models.user import User
from app.schemas.trade import TradeRecordCreate, ApiKeyCreate
from app.utils.security import hash_api_key, verify_api_key


class TradeService:
    """交易服务类"""
    
    @staticmethod
    def create_trade(db: Session, user_id: int, trade_data: TradeRecordCreate) -> TradeRecord:
        """创建交易记录"""
        # 计算交易总额
        total = trade_data.price * trade_data.quantity
        
        # 创建交易记录
        new_trade = TradeRecord(
            user_id=user_id,
            symbol=trade_data.symbol,
            side=trade_data.side,
            price=trade_data.price,
            quantity=trade_data.quantity,
            total=total,
            is_ai_trade=trade_data.is_ai_trade,
            ai_signal_id=trade_data.ai_signal_id
        )
        
        db.add(new_trade)
        db.commit()
        db.refresh(new_trade)
        
        return new_trade
    
    @staticmethod
    def get_user_trades(db: Session, user_id: int, skip: int = 0, limit: int = 100) -> List[TradeRecord]:
        """获取用户的交易记录"""
        trades = db.query(TradeRecord).filter(
            TradeRecord.user_id == user_id
        ).order_by(
            TradeRecord.timestamp.desc()
        ).offset(skip).limit(limit).all()
        
        return trades
    
    @staticmethod
    def get_account_info(db: Session, user_id: int) -> Dict:
        """获取账户信息"""
        # 获取用户的交易记录
        trades = db.query(TradeRecord).filter(TradeRecord.user_id == user_id).all()
        
        # 计算账户余额和持仓
        total_balance = 10000.0  # 初始余额
        available_balance = 10000.0
        positions = {}
        
        for trade in trades:
            if trade.side == 'buy':
                # 买入，减少可用余额
                available_balance -= trade.total
                # 更新持仓
                if trade.symbol in positions:
                    positions[trade.symbol]['quantity'] += trade.quantity
                    positions[trade.symbol]['avg_price'] = (
                        positions[trade.symbol]['avg_price'] * positions[trade.symbol]['quantity'] + 
                        trade.price * trade.quantity
                    ) / (positions[trade.symbol]['quantity'] + trade.quantity)
                else:
                    positions[trade.symbol] = {
                        'quantity': trade.quantity,
                        'avg_price': trade.price
                    }
            else:
                # 卖出，增加可用余额
                available_balance += trade.total
                # 更新持仓
                if trade.symbol in positions:
                    positions[trade.symbol]['quantity'] -= trade.quantity
                    if positions[trade.symbol]['quantity'] <= 0:
                        del positions[trade.symbol]
        
        # 计算总余额（可用余额 + 持仓价值）
        # 这里使用模拟的当前价格
        symbol_prices = {
            'BTC/USDT': 64231.5,
            'ETH/USDT': 3452.2,
            'SOL/USDT': 142.12,
            'ARB/USDT': 1.12,
            'LINK/USDT': 18.45
        }
        
        for symbol, position in positions.items():
            current_price = symbol_prices.get(symbol, position['avg_price'])
            position_value = position['quantity'] * current_price
            total_balance += position_value
        
        return {
            "total_balance": total_balance,
            "available_balance": available_balance,
            "positions": positions
        }
    
    @staticmethod
    def add_api_key(db: Session, user_id: int, api_key_data: ApiKeyCreate) -> ApiKey:
        """添加API密钥"""
        # 哈希API密钥
        hashed_api_key = hash_api_key(api_key_data.api_key)
        
        # 创建API密钥记录
        new_api_key = ApiKey(
            user_id=user_id,
            provider=api_key_data.provider,
            api_key_hash=hashed_api_key,
            is_connected=False  # 默认为未连接状态
        )
        
        db.add(new_api_key)
        db.commit()
        db.refresh(new_api_key)
        
        return new_api_key
    
    @staticmethod
    def get_user_api_keys(db: Session, user_id: int) -> List[ApiKey]:
        """获取用户的API密钥列表"""
        api_keys = db.query(ApiKey).filter(ApiKey.user_id == user_id).all()
        return api_keys
    
    @staticmethod
    def delete_api_key(db: Session, api_key_id: int, user_id: int) -> bool:
        """删除API密钥"""
        api_key = db.query(ApiKey).filter(
            ApiKey.id == api_key_id,
            ApiKey.user_id == user_id
        ).first()
        
        if not api_key:
            return False
        
        db.delete(api_key)
        db.commit()
        
        return True