from typing import List, Dict, Optional
from sqlalchemy.orm import Session
from app.models.trade import TradeRecord, ApiKey, SimulatedTrader, SimulationSetting
from app.models.user import User
from app.schemas.trade import TradeRecordCreate, ApiKeyCreate, SimulatedTraderCreate, SimulatedTraderUpdate, SimulationSettingUpdate
from app.utils.security import hash_api_key, verify_api_key
import requests


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
    def verify_api_key(provider: str, api_key: str) -> bool:
        """验证API密钥"""
        try:
            if provider == 'qwen':
                # 验证千问API密钥
                url = "https://ark.cn-beijing.volces.com/api/v3/chat/completions"
                headers = {
                    "Content-Type": "application/json",
                    "Authorization": f"Bearer {api_key}"
                }
                payload = {
                    "model": "qwen-turbo",
                    "messages": [
                        {
                            "role": "system",
                            "content": "你是一个验证助手，只需要返回'OK'"
                        },
                        {
                            "role": "user",
                            "content": "验证API密钥"
                        }
                    ],
                    "temperature": 0.1,
                    "max_tokens": 10
                }
                response = requests.post(url, headers=headers, json=payload, timeout=5)
                return response.status_code == 200
            elif provider == 'openai':
                # 验证OpenAI API密钥
                url = "https://api.openai.com/v1/models"
                headers = {
                    "Authorization": f"Bearer {api_key}"
                }
                response = requests.get(url, headers=headers, timeout=5)
                return response.status_code == 200
            elif provider == 'anthropic':
                # 验证Anthropic API密钥
                url = "https://api.anthropic.com/v1/models"
                headers = {
                    "Authorization": f"Bearer {api_key}",
                    "Content-Type": "application/json"
                }
                response = requests.get(url, headers=headers, timeout=5)
                return response.status_code == 200
            elif provider == 'binance':
                # 验证Binance API密钥
                # 这里简化处理，实际应该使用Binance API进行验证
                return len(api_key) > 20
            else:
                # 默认验证：检查API密钥长度
                return len(api_key) > 0
        except Exception as e:
            print(f"验证API密钥失败: {str(e)}")
            return False
    
    @staticmethod
    def add_api_key(db: Session, user_id: int, api_key_data: ApiKeyCreate) -> ApiKey:
        """添加API密钥"""
        # 验证API密钥
        is_valid = TradeService.verify_api_key(api_key_data.provider, api_key_data.api_key)
        
        # 哈希API密钥
        hashed_api_key = hash_api_key(api_key_data.api_key)
        
        # 创建API密钥记录
        new_api_key = ApiKey(
            user_id=user_id,
            provider=api_key_data.provider,
            api_key_hash=hashed_api_key,
            is_connected=is_valid  # 根据验证结果设置连接状态
        )
        
        db.add(new_api_key)
        db.commit()
        db.refresh(new_api_key)
        
        return new_api_key
    
    @staticmethod
    def update_api_key_connection_status(db: Session, api_key_id: int, user_id: int, is_connected: bool) -> bool:
        """更新API密钥连接状态"""
        api_key = db.query(ApiKey).filter(
            ApiKey.id == api_key_id,
            ApiKey.user_id == user_id
        ).first()
        
        if not api_key:
            return False
        
        api_key.is_connected = is_connected
        db.commit()
        db.refresh(api_key)
        
        return True
    
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
    
    @staticmethod
    def create_simulated_trader(db: Session, user_id: int, trader_data: SimulatedTraderCreate) -> SimulatedTrader:
        """创建模拟交易员"""
        # 创建模拟交易员
        new_trader = SimulatedTrader(
            user_id=user_id,
            name=trader_data.name,
            strategy=trader_data.strategy,
            symbol=trader_data.symbol,
            refresh_interval=trader_data.refresh_interval,
            initial_balance=trader_data.initial_balance,
            current_balance=trader_data.initial_balance,  # 初始当前余额等于初始资金
            settings=trader_data.settings
        )
        
        db.add(new_trader)
        db.commit()
        db.refresh(new_trader)
        
        return new_trader
    
    @staticmethod
    def update_simulated_trader(db: Session, trader_id: int, user_id: int, trader_data: SimulatedTraderUpdate) -> Optional[SimulatedTrader]:
        """更新模拟交易员"""
        # 获取模拟交易员
        trader = db.query(SimulatedTrader).filter(
            SimulatedTrader.id == trader_id,
            SimulatedTrader.user_id == user_id
        ).first()
        
        if not trader:
            return None
        
        # 更新字段
        if trader_data.name is not None:
            trader.name = trader_data.name
        if trader_data.strategy is not None:
            trader.strategy = trader_data.strategy
        if trader_data.symbol is not None:
            trader.symbol = trader_data.symbol
        if trader_data.refresh_interval is not None:
            trader.refresh_interval = trader_data.refresh_interval
        if trader_data.is_active is not None:
            trader.is_active = trader_data.is_active
        if trader_data.settings is not None:
            trader.settings = trader_data.settings
        
        db.commit()
        db.refresh(trader)
        
        return trader
    
    @staticmethod
    def delete_simulated_trader(db: Session, trader_id: int, user_id: int) -> bool:
        """删除模拟交易员"""
        # 获取模拟交易员
        trader = db.query(SimulatedTrader).filter(
            SimulatedTrader.id == trader_id,
            SimulatedTrader.user_id == user_id
        ).first()
        
        if not trader:
            return False
        
        db.delete(trader)
        db.commit()
        
        return True
    
    @staticmethod
    def get_simulated_traders(db: Session, user_id: int) -> List[SimulatedTrader]:
        """获取用户的模拟交易员列表"""
        traders = db.query(SimulatedTrader).filter(
            SimulatedTrader.user_id == user_id
        ).all()
        
        return traders
    
    @staticmethod
    def get_simulated_trader(db: Session, trader_id: int, user_id: int) -> Optional[SimulatedTrader]:
        """获取单个模拟交易员"""
        trader = db.query(SimulatedTrader).filter(
            SimulatedTrader.id == trader_id,
            SimulatedTrader.user_id == user_id
        ).first()
        
        return trader
    
    @staticmethod
    def get_simulation_settings(db: Session, user_id: int) -> SimulationSetting:
        """获取用户的模拟交易设置"""
        # 查询用户的模拟交易设置
        settings = db.query(SimulationSetting).filter(
            SimulationSetting.user_id == user_id
        ).first()
        
        # 如果不存在，创建默认设置
        if not settings:
            settings = SimulationSetting(
                user_id=user_id
            )
            db.add(settings)
            db.commit()
            db.refresh(settings)
        
        return settings
    
    @staticmethod
    def update_simulation_settings(db: Session, user_id: int, settings_data: SimulationSettingUpdate) -> SimulationSetting:
        """更新用户的模拟交易设置"""
        # 获取用户的模拟交易设置
        settings = db.query(SimulationSetting).filter(
            SimulationSetting.user_id == user_id
        ).first()
        
        # 如果不存在，创建新设置
        if not settings:
            settings = SimulationSetting(
                user_id=user_id
            )
            db.add(settings)
        
        # 更新字段
        settings.global_enabled = settings_data.global_enabled
        settings.open_signal_notification = settings_data.open_signal_notification
        settings.close_signal_notification = settings_data.close_signal_notification
        settings.default_refresh_interval = settings_data.default_refresh_interval
        
        db.commit()
        db.refresh(settings)
        
        return settings
    
    @staticmethod
    def get_account_info(db: Session, user_id: int, simulated_trader_id: Optional[int] = None) -> Dict:
        """获取账户信息，支持指定模拟交易员"""
        # 构建查询条件
        query = db.query(TradeRecord).filter(TradeRecord.user_id == user_id)
        
        # 如果指定了模拟交易员，添加过滤条件
        if simulated_trader_id:
            query = query.filter(TradeRecord.simulated_trader_id == simulated_trader_id)
        
        # 获取交易记录
        trades = query.all()
        
        # 计算账户余额和持仓
        total_balance = 10000.0  # 初始余额
        available_balance = 10000.0
        positions = {}
        
        # 如果指定了模拟交易员，使用交易员的初始资金
        if simulated_trader_id:
            trader = db.query(SimulatedTrader).filter(
                SimulatedTrader.id == simulated_trader_id,
                SimulatedTrader.user_id == user_id
            ).first()
            if trader:
                total_balance = trader.initial_balance
                available_balance = trader.initial_balance
        
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