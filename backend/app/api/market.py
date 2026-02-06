from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.schemas.market import MarketDataResponse, MarketDataList, TechnicalResponse, WatchlistItem, WatchlistResponse
from app.services.market_service import MarketService
from app.api.auth import get_current_user
from app.models.user import User
from app.models.market import MarketData

router = APIRouter()


# 获取市场数据列表
@router.get("", response_model=MarketDataList)
def get_market_list(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """获取市场数据列表"""
    market_data = MarketService.get_market_data(db, skip, limit)
    total = len(market_data)
    
    return {
        "data": market_data,
        "total": total
    }


# 获取单个币种数据
@router.get("/{symbol}", response_model=MarketDataResponse)
def get_symbol_detail(
    symbol: str,
    db: Session = Depends(get_db)
):
    """获取单个币种数据"""
    market_data = MarketService.get_symbol_data(db, symbol)
    if not market_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="币种不存在"
        )
    
    return market_data


# 获取技术指标
@router.get("/technical/{symbol}", response_model=TechnicalResponse)
def get_technical_indicators(
    symbol: str,
    db: Session = Depends(get_db)
):
    """获取技术指标"""
    # 检查币种是否存在
    market_data = MarketService.get_symbol_data(db, symbol)
    if not market_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="币种不存在"
        )
    
    # 获取技术指标
    indicators = MarketService.get_technical_indicators(symbol)
    
    return {
        "symbol": symbol,
        "indicators": indicators
    }


# 获取观察列表
@router.get("/watchlist/list", response_model=List[WatchlistResponse])
def get_watchlist(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """获取观察列表"""
    watchlist_items = MarketService.get_watchlist(db, current_user.id)
    return watchlist_items


# 添加到观察列表
@router.post("/watchlist/add", response_model=WatchlistResponse)
def add_to_watchlist(
    item: WatchlistItem,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """添加到观察列表"""
    # 检查币种是否存在
    market_data = db.query(MarketData).filter(MarketData.id == item.symbol_id).first()
    if not market_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="币种不存在"
        )
    
    # 添加到观察列表
    watchlist_item = MarketService.add_to_watchlist(db, current_user.id, item.symbol_id)
    if not watchlist_item:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="币种已在观察列表中"
        )
    
    # 构建响应数据
    return {
        "id": watchlist_item.id,
        "user_id": watchlist_item.user_id,
        "symbol_id": watchlist_item.symbol_id,
        "symbol": market_data.symbol,
        "name": market_data.name,
        "price": market_data.price,
        "change": market_data.change,
        "is_positive": market_data.is_positive,
        "created_at": watchlist_item.created_at
    }


# 从观察列表移除
@router.delete("/watchlist/remove/{symbol_id}")
def remove_from_watchlist(
    symbol_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """从观察列表移除"""
    success = MarketService.remove_from_watchlist(db, current_user.id, symbol_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="币种不在观察列表中"
        )
    
    return {"message": "已从观察列表中移除"}