from typing import List, Dict, Optional
from sqlalchemy.orm import Session
from app.models.market import MarketData, Watchlist
from app.utils.crypto import get_market_data, get_symbol_data, calculate_technical_indicators


class MarketService:
    """市场数据服务类"""
    
    @staticmethod
    def get_market_data(db: Session, skip: int = 0, limit: int = 100) -> List[MarketData]:
        """获取市场数据列表"""
        # 先从数据库获取
        market_data = db.query(MarketData).offset(skip).limit(limit).all()
        
        # 如果数据库中没有数据，从API获取并存储
        if not market_data:
            MarketService.update_market_data(db)
            market_data = db.query(MarketData).offset(skip).limit(limit).all()
        
        return market_data
    
    @staticmethod
    def get_symbol_data(db: Session, symbol: str) -> Optional[MarketData]:
        """获取单个币种数据"""
        # 先从数据库获取
        market_data = db.query(MarketData).filter(MarketData.symbol == symbol).first()
        
        # 如果数据库中没有数据，从API获取并存储
        if not market_data:
            MarketService.update_market_data(db)
            market_data = db.query(MarketData).filter(MarketData.symbol == symbol).first()
        
        return market_data
    
    @staticmethod
    def update_market_data(db: Session) -> None:
        """更新市场数据"""
        # 从API获取市场数据
        api_data = get_market_data()
        
        for item in api_data:
            # 检查数据是否存在
            existing_data = db.query(MarketData).filter(MarketData.symbol == item['symbol']).first()
            
            if existing_data:
                # 更新现有数据
                existing_data.price = item['price']
                existing_data.change = item['change']
                existing_data.is_positive = item['is_positive']
            else:
                # 创建新数据
                new_data = MarketData(
                    symbol=item['symbol'],
                    name=item['name'],
                    price=item['price'],
                    change=item['change'],
                    is_positive=item['is_positive']
                )
                db.add(new_data)
        
        db.commit()
    
    @staticmethod
    def get_technical_indicators(symbol: str) -> Dict:
        """获取技术指标"""
        return calculate_technical_indicators(symbol)
    
    @staticmethod
    def add_to_watchlist(db: Session, user_id: int, symbol_id: int) -> Optional[Watchlist]:
        """添加到观察列表"""
        # 检查是否已在观察列表中
        existing_item = db.query(Watchlist).filter(
            Watchlist.user_id == user_id,
            Watchlist.symbol_id == symbol_id
        ).first()
        
        if existing_item:
            return None
        
        # 创建新的观察列表项
        new_item = Watchlist(
            user_id=user_id,
            symbol_id=symbol_id
        )
        
        db.add(new_item)
        db.commit()
        db.refresh(new_item)
        
        return new_item
    
    @staticmethod
    def remove_from_watchlist(db: Session, user_id: int, symbol_id: int) -> bool:
        """从观察列表移除"""
        item = db.query(Watchlist).filter(
            Watchlist.user_id == user_id,
            Watchlist.symbol_id == symbol_id
        ).first()
        
        if not item:
            return False
        
        db.delete(item)
        db.commit()
        
        return True
    
    @staticmethod
    def get_watchlist(db: Session, user_id: int) -> List[Dict]:
        """获取用户的观察列表"""
        # 查询观察列表
        watchlist_items = db.query(Watchlist).filter(Watchlist.user_id == user_id).all()
        
        # 构建响应数据
        result = []
        for item in watchlist_items:
            # 获取对应的市场数据
            market_data = db.query(MarketData).filter(MarketData.id == item.symbol_id).first()
            if market_data:
                result.append({
                    "id": item.id,
                    "user_id": item.user_id,
                    "symbol_id": item.symbol_id,
                    "symbol": market_data.symbol,
                    "name": market_data.name,
                    "price": market_data.price,
                    "change": market_data.change,
                    "is_positive": market_data.is_positive,
                    "created_at": item.created_at
                })
        
        return result