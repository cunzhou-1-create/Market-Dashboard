from typing import List, Dict, Optional
from sqlalchemy.orm import Session
from app.models.market import MarketData, Watchlist
from app.utils.crypto import get_market_data, get_futures_data, get_symbol_data, calculate_technical_indicators, get_klines_data


class MarketService:
    """市场数据服务类"""
    
    @staticmethod
    def get_market_data(db: Session, skip: int = 0, limit: int = 100) -> List[MarketData]:
        """获取市场数据列表"""
        try:
            # 先从数据库获取
            market_data = db.query(MarketData).offset(skip).limit(limit).all()
            
            # 如果数据库中没有数据，从API获取并存储
            if not market_data:
                MarketService.update_market_data(db)
                market_data = db.query(MarketData).offset(skip).limit(limit).all()
            
            return market_data
        except Exception as e:
            print(f"获取市场数据失败: {e}")
            # 如果数据库查询失败，直接从API获取数据并返回
            try:
                api_data = get_market_data()
                # 转换为MarketData对象
                market_data = []
                for item in api_data:
                    try:
                        market_item = MarketData(
                            id=item['symbol'],
                            symbol=item['symbol'],
                            name=item['name'],
                            price=item['price'],
                            change=item['change'],
                            is_positive=item['is_positive']
                        )
                        # 尝试设置新字段
                        try:
                            market_item.volume = item.get('volume', 0.0)
                            market_item.quote_volume = item.get('quote_volume', 0.0)
                            market_item.high_price = item.get('high_price', 0.0)
                            market_item.low_price = item.get('low_price', 0.0)
                            market_item.open_price = item.get('open_price', 0.0)
                            market_item.close_price = item.get('close_price', 0.0)
                        except AttributeError:
                            pass
                        market_data.append(market_item)
                    except Exception:
                        pass
                return market_data[:limit]
            except Exception as api_error:
                print(f"从API获取市场数据失败: {api_error}")
                return []
    
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
        try:
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
                    # 尝试更新新字段，如果它们存在
                    try:
                        existing_data.volume = item.get('volume', 0.0)
                        existing_data.quote_volume = item.get('quote_volume', 0.0)
                        existing_data.high_price = item.get('high_price', 0.0)
                        existing_data.low_price = item.get('low_price', 0.0)
                        existing_data.open_price = item.get('open_price', 0.0)
                        existing_data.close_price = item.get('close_price', 0.0)
                    except AttributeError:
                        # 如果字段不存在，跳过
                        pass
                else:
                    # 创建新数据
                    try:
                        new_data = MarketData(
                            symbol=item['symbol'],
                            name=item['name'],
                            price=item['price'],
                            change=item['change'],
                            is_positive=item['is_positive'],
                            volume=item.get('volume', 0.0),
                            quote_volume=item.get('quote_volume', 0.0),
                            high_price=item.get('high_price', 0.0),
                            low_price=item.get('low_price', 0.0),
                            open_price=item.get('open_price', 0.0),
                            close_price=item.get('close_price', 0.0)
                        )
                    except TypeError:
                        # 如果字段不存在，创建不包含新字段的对象
                        new_data = MarketData(
                            symbol=item['symbol'],
                            name=item['name'],
                            price=item['price'],
                            change=item['change'],
                            is_positive=item['is_positive']
                        )
                    db.add(new_data)
            
            db.commit()
        except Exception as e:
            print(f"更新市场数据失败: {e}")
            db.rollback()
    
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
        # 使用JOIN一次性获取观察列表和对应的市场数据
        from sqlalchemy import join
        
        watchlist_with_market = db.query(Watchlist, MarketData).join(
            MarketData, Watchlist.symbol_id == MarketData.id
        ).filter(Watchlist.user_id == user_id).all()
        
        # 构建响应数据
        result = []
        for watchlist_item, market_data in watchlist_with_market:
            result.append({
                "id": watchlist_item.id,
                "user_id": watchlist_item.user_id,
                "symbol_id": watchlist_item.symbol_id,
                "symbol": market_data.symbol,
                "name": market_data.name,
                "price": market_data.price,
                "change": market_data.change,
                "is_positive": market_data.is_positive,
                "volume": market_data.volume,
                "quote_volume": market_data.quote_volume,
                "high_price": market_data.high_price,
                "low_price": market_data.low_price,
                "open_price": market_data.open_price,
                "close_price": market_data.close_price,
                "created_at": watchlist_item.created_at
            })
        
        return result
    
    @staticmethod
    def get_futures_data(db: Session, skip: int = 0, limit: int = 100) -> List[Dict]:
        """获取期货市场数据列表"""
        # 直接从API获取期货数据，因为期货数据更新频繁，不需要存储到数据库
        futures_data = get_futures_data()
        
        # 应用分页
        paginated_data = futures_data[skip:skip + limit]
        
        return paginated_data
    
    @staticmethod
    def get_klines_data(symbol: str, interval: str = '30m', limit: int = 100) -> List[Dict]:
        """获取K线数据"""
        return get_klines_data(symbol, interval, limit)