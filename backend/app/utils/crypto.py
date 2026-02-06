from typing import Dict, List, Optional
import ccxt
from app.config import settings


# 模拟市场数据
MOCK_MARKET_DATA = [
    {"symbol": "BTC/USDT", "name": "Bitcoin", "price": 64231.5, "change": 2.4, "is_positive": True},
    {"symbol": "ETH/USDT", "name": "Ethereum", "price": 3452.2, "change": -1.2, "is_positive": False},
    {"symbol": "SOL/USDT", "name": "Solana", "price": 142.12, "change": 5.8, "is_positive": True},
    {"symbol": "ARB/USDT", "name": "Arbitrum", "price": 1.12, "change": 12.4, "is_positive": True},
    {"symbol": "LINK/USDT", "name": "Chainlink", "price": 18.45, "change": 8.1, "is_positive": True},
    {"symbol": "PEPE/USDT", "name": "Pepe", "price": 0.000008, "change": 7.4, "is_positive": True},
    {"symbol": "OP/USDT", "name": "Optimism", "price": 2.41, "change": 6.9, "is_positive": True},
    {"symbol": "BNB/USDT", "name": "Binance Coin", "price": 352.45, "change": 3.2, "is_positive": True},
    {"symbol": "ADA/USDT", "name": "Cardano", "price": 0.52, "change": -0.8, "is_positive": False},
    {"symbol": "DOT/USDT", "name": "Polkadot", "price": 6.23, "change": 4.5, "is_positive": True},
    {"symbol": "DOGE/USDT", "name": "Dogecoin", "price": 0.12, "change": 2.1, "is_positive": True},
    {"symbol": "SHIB/USDT", "name": "Shiba Inu", "price": 0.000009, "change": 5.3, "is_positive": True},
    {"symbol": "AVAX/USDT", "name": "Avalanche", "price": 32.45, "change": -1.5, "is_positive": False},
    {"symbol": "TRX/USDT", "name": "Tron", "price": 0.11, "change": 0.5, "is_positive": True},
    {"symbol": "MATIC/USDT", "name": "Polygon", "price": 0.98, "change": 3.7, "is_positive": True},
    {"symbol": "ATOM/USDT", "name": "Cosmos", "price": 12.34, "change": -2.3, "is_positive": False},
    {"symbol": "LTC/USDT", "name": "Litecoin", "price": 89.45, "change": 1.8, "is_positive": True},
    {"symbol": "XLM/USDT", "name": "Stellar", "price": 0.13, "change": 0.9, "is_positive": True},
    {"symbol": "XMR/USDT", "name": "Monero", "price": 156.78, "change": 2.7, "is_positive": True},
    {"symbol": "BCH/USDT", "name": "Bitcoin Cash", "price": 298.45, "change": -0.6, "is_positive": False},
    {"symbol": "ETC/USDT", "name": "Ethereum Classic", "price": 15.67, "change": 4.2, "is_positive": True},
    {"symbol": "FIL/USDT", "name": "Filecoin", "price": 4.56, "change": -3.1, "is_positive": False},
    {"symbol": "SAND/USDT", "name": "The Sandbox", "price": 0.45, "change": 6.7, "is_positive": True},
    {"symbol": "MANA/USDT", "name": "Decentraland", "price": 0.32, "change": 5.4, "is_positive": True},
    {"symbol": "AXS/USDT", "name": "Axie Infinity", "price": 7.89, "change": -2.8, "is_positive": False}
]


# 获取市场数据
def get_market_data() -> List[Dict]:
    """获取市场数据"""
    # 尝试使用CCXT获取真实数据
    if settings.BINANCE_API_KEY and settings.BINANCE_API_SECRET:
        try:
            exchange = ccxt.binance({
                'apiKey': settings.BINANCE_API_KEY,
                'secret': settings.BINANCE_API_SECRET,
                'enableRateLimit': True,
            })
            
            symbols = ['BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'ARB/USDT', 'LINK/USDT']
            tickers = exchange.fetch_tickers(symbols)
            
            market_data = []
            for symbol, ticker in tickers.items():
                if 'last' in ticker and 'percentage' in ticker:
                    market_data.append({
                        "symbol": symbol,
                        "name": symbol.split('/')[0],
                        "price": ticker['last'],
                        "change": ticker['percentage'],
                        "is_positive": ticker['percentage'] >= 0
                    })
            
            if market_data:
                return market_data
        except Exception as e:
            print(f"获取市场数据失败: {e}")
    
    # 返回模拟数据
    return MOCK_MARKET_DATA


# 获取单个币种数据
def get_symbol_data(symbol: str) -> Optional[Dict]:
    """获取单个币种数据"""
    market_data = get_market_data()
    for item in market_data:
        if item['symbol'] == symbol:
            return item
    return None


# 计算技术指标
def calculate_technical_indicators(symbol: str) -> Dict:
    """计算技术指标"""
    # 模拟技术指标数据
    return {
        "rsi": 65.4,
        "macd": {
            "macd": 0.02,
            "signal": 0.01,
            "histogram": 0.01
        },
        "ema": {
            "ema20": 3450.0,
            "ema50": 3400.0,
            "ema100": 3350.0
        },
        "bollinger": {
            "upper": 3500.0,
            "middle": 3450.0,
            "lower": 3400.0
        }
    }


# 检查价格预警条件
def check_price_alert_condition(current_price: float, condition: str, threshold: float) -> bool:
    """检查价格预警条件"""
    if condition == 'price_gt':
        return current_price > threshold
    elif condition == 'price_lt':
        return current_price < threshold
    return False