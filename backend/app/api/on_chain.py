from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Dict
from app.database import get_db
from app.api.auth import get_current_user
from app.models.user import User

router = APIRouter()


# 获取链上事件列表
@router.get("", response_model=List[Dict])
def get_on_chain_events(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    chain: str = Query(None, description="区块链名称，例如 ethereum, bitcoin"),
    event_type: str = Query(None, description="事件类型，例如 transaction, block, token_transfer"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """获取链上事件列表
    
    - **skip**: 跳过的记录数
    - **limit**: 返回的记录数
    - **chain**: 可选的区块链筛选
    - **event_type**: 可选的事件类型筛选
    """
    # 模拟链上事件数据
    # 实际项目中应该从数据库或外部API获取
    mock_events = [
        {
            "id": 1,
            "chain": "ethereum",
            "event_type": "transaction",
            "hash": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
            "from_address": "0x1234567890123456789012345678901234567890",
            "to_address": "0x0987654321098765432109876543210987654321",
            "value": "1.23 ETH",
            "timestamp": "2024-01-01T10:00:00Z",
            "block_number": 12345678,
            "status": "confirmed"
        },
        {
            "id": 2,
            "chain": "bitcoin",
            "event_type": "block",
            "hash": "blockhash1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
            "miner": "miner123",
            "height": 700000,
            "timestamp": "2024-01-01T10:05:00Z",
            "difficulty": "30.5T",
            "transaction_count": 1500
        },
        {
            "id": 3,
            "chain": "ethereum",
            "event_type": "token_transfer",
            "hash": "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
            "token_address": "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2",
            "from_address": "0x1234567890123456789012345678901234567890",
            "to_address": "0x0987654321098765432109876543210987654321",
            "value": "1000 MKR",
            "timestamp": "2024-01-01T10:10:00Z",
            "block_number": 12345679
        }
    ]
    
    # 应用筛选条件
    filtered_events = mock_events
    if chain:
        filtered_events = [event for event in filtered_events if event.get('chain') == chain]
    if event_type:
        filtered_events = [event for event in filtered_events if event.get('event_type') == event_type]
    
    # 应用分页
    paginated_events = filtered_events[skip:skip+limit]
    
    return paginated_events


# 获取链上事件详情
@router.get("/{event_id}", response_model=Dict)
def get_on_chain_event_detail(
    event_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """获取链上事件详情
    
    - **event_id**: 事件ID
    """
    # 模拟链上事件详情数据
    mock_event_detail = {
        "id": event_id,
        "chain": "ethereum",
        "event_type": "transaction",
        "hash": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
        "from_address": "0x1234567890123456789012345678901234567890",
        "to_address": "0x0987654321098765432109876543210987654321",
        "value": "1.23 ETH",
        "gas": "21000",
        "gas_price": "20 gwei",
        "gas_used": "21000",
        "nonce": 123,
        "timestamp": "2024-01-01T10:00:00Z",
        "block_number": 12345678,
        "block_hash": "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
        "status": "confirmed",
        "input_data": "0x",
        "logs": [
            {
                "address": "0x1234567890123456789012345678901234567890",
                "topics": ["0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890"],
                "data": "0x"
            }
        ]
    }
    
    return mock_event_detail


# 获取支持的区块链列表
@router.get("/chains/list", response_model=List[Dict])
def get_supported_chains(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """获取支持的区块链列表
    """
    # 模拟支持的区块链数据
    mock_chains = [
        {
            "name": "ethereum",
            "display_name": "Ethereum",
            "symbol": "ETH",
            "status": "active",
            "block_height": 12345678,
            "explorer_url": "https://etherscan.io"
        },
        {
            "name": "bitcoin",
            "display_name": "Bitcoin",
            "symbol": "BTC",
            "status": "active",
            "block_height": 700000,
            "explorer_url": "https://blockchain.com"
        },
        {
            "name": "binance_smart_chain",
            "display_name": "Binance Smart Chain",
            "symbol": "BNB",
            "status": "active",
            "block_height": 23456789,
            "explorer_url": "https://bscscan.com"
        }
    ]
    
    return mock_chains


# 获取链上事件统计
@router.get("/stats/summary", response_model=Dict)
def get_on_chain_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """获取链上事件统计摘要
    """
    # 模拟链上事件统计数据
    mock_stats = {
        "total_events": 12345,
        "events_by_chain": {
            "ethereum": 8765,
            "bitcoin": 2345,
            "binance_smart_chain": 1235
        },
        "events_by_type": {
            "transaction": 9876,
            "block": 1234,
            "token_transfer": 1235
        },
        "latest_event": {
            "id": 12345,
            "chain": "ethereum",
            "event_type": "transaction",
            "hash": "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
            "timestamp": "2024-01-01T10:30:00Z"
        }
    }
    
    return mock_stats
