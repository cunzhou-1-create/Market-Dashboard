from typing import Dict, List, Optional
import ccxt
import requests
import time
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


# 缓存变量
_cached_market_data = []
_last_fetch_time = 0
CACHE_DURATION = 60  # 缓存60秒


# 获取市场数据
def get_market_data() -> List[Dict]:
    """获取市场数据"""
    global _cached_market_data, _last_fetch_time
    
    # 检查缓存是否有效
    current_time = time.time()
    if _cached_market_data and current_time - _last_fetch_time < CACHE_DURATION:
        return _cached_market_data
    
    # 尝试从Binance Spot API获取数据
    try:
        response = requests.get('https://api.binance.com/api/v3/ticker/24hr', timeout=10)
        response.raise_for_status()
        
        # 处理API响应
        tickers = response.json()
        market_data = []
        
        # 过滤掉非USDT交易对，只处理主流交易对
        for ticker in tickers:
            symbol = ticker['symbol']
            # 只处理USDT交易对
            if symbol.endswith('USDT'):
                # 转换符号格式为 BTC/USDT
                formatted_symbol = f"{symbol[:-4]}/USDT"
                
                # 计算涨跌幅
                price_change_percent = float(ticker['priceChangePercent'])
                
                market_data.append({
                    "symbol": formatted_symbol,
                    "name": symbol[:-4],  # 简化名称
                    "price": float(ticker['lastPrice']),
                    "change": price_change_percent,
                    "is_positive": price_change_percent >= 0,
                    "volume": float(ticker['volume']),
                    "quote_volume": float(ticker['quoteVolume']),
                    "high_price": float(ticker['highPrice']),
                    "low_price": float(ticker['lowPrice']),
                    "open_price": float(ticker['openPrice']),
                    "close_price": float(ticker['lastPrice'])
                })
        
        # 限制返回数据量，只返回前100个
        market_data = market_data[:100]
        
        if market_data:
            # 更新缓存
            _cached_market_data = market_data
            _last_fetch_time = current_time
            return market_data
    except Exception as e:
        print(f"从Binance API获取市场数据失败: {e}")
    
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
                        "is_positive": ticker['percentage'] >= 0,
                        "volume": ticker.get('baseVolume', 0),
                        "quote_volume": ticker.get('quoteVolume', 0),
                        "high_price": ticker.get('high', 0),
                        "low_price": ticker.get('low', 0),
                        "open_price": ticker.get('open', 0),
                        "close_price": ticker.get('last', 0)
                    })
            
            if market_data:
                # 更新缓存
                _cached_market_data = market_data
                _last_fetch_time = current_time
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


# 获取期货市场数据
def get_futures_data() -> List[Dict]:
    """获取Binance COIN-M永续合约24小时统计数据"""
    global _cached_market_data, _last_fetch_time
    
    # 检查缓存是否有效
    current_time = time.time()
    if _cached_market_data and current_time - _last_fetch_time < CACHE_DURATION:
        return _cached_market_data
    
    # 尝试从Binance COIN-M合约API获取数据
    try:
        response = requests.get('https://dapi.binance.com/dapi/v1/ticker/24hr', timeout=10)
        response.raise_for_status()
        
        # 处理API响应
        tickers = response.json()
        futures_data = []
        
        # 过滤并处理COIN-M合约数据
        for ticker in tickers:
            symbol = ticker['symbol']
            # 只处理COIN-M永续合约（以_PERP结尾）
            if symbol.endswith('_PERP'):
                # 转换符号格式为 BTC/USDT
                base_asset = symbol.replace('_PERP', '')
                if base_asset.endswith('USD'):
                    base = base_asset[:-3]
                    formatted_symbol = f"{base}/USD"
                else:
                    formatted_symbol = symbol
                
                # 计算涨跌幅
                price_change_percent = float(ticker['priceChangePercent'])
                
                futures_data.append({
                    "symbol": formatted_symbol,
                    "name": base_asset[:-3],  # 简化名称
                    "price": float(ticker['lastPrice']),
                    "change": price_change_percent,
                    "is_positive": price_change_percent >= 0,
                    "volume": float(ticker['volume']),  # 合约张数
                    "quoteVolume": float(ticker['quoteVolume']),  # 以标的币计价的成交额
                    "lastPrice": float(ticker['lastPrice']),
                    "highPrice": float(ticker['highPrice']),
                    "lowPrice": float(ticker['lowPrice']),
                    "openPrice": float(ticker['openPrice']),
                    "closePrice": float(ticker['lastPrice'])
                })
        
        # 限制返回数据量，只返回前100个
        futures_data = futures_data[:100]
        
        if futures_data:
            # 更新缓存
            _cached_market_data = futures_data
            _last_fetch_time = current_time
            return futures_data
    except Exception as e:
        print(f"从Binance COIN-M API获取数据失败: {e}")
    
    # 返回模拟COIN-M合约数据
    return [
        {"symbol": "BTC/USD", "name": "Bitcoin", "price": 48200, "change": 2.4, "is_positive": True, "volume": 12500, "quoteVolume": 1250000, "lastPrice": 48200, "highPrice": 49100, "lowPrice": 47300},
        {"symbol": "ETH/USD", "name": "Ethereum", "price": 2650, "change": -1.2, "is_positive": False, "volume": 250000, "quoteVolume": 2500000, "lastPrice": 2650, "highPrice": 2700, "lowPrice": 2600},
        {"symbol": "SOL/USD", "name": "Solana", "price": 105, "change": 5.8, "is_positive": True, "volume": 1500000, "quoteVolume": 1500000, "lastPrice": 105, "highPrice": 108, "lowPrice": 100},
        {"symbol": "ARB/USD", "name": "Arbitrum", "price": 1.05, "change": 12.4, "is_positive": True, "volume": 50000000, "quoteVolume": 50000000, "lastPrice": 1.05, "highPrice": 1.08, "lowPrice": 0.95},
        {"symbol": "LINK/USD", "name": "Chainlink", "price": 15.2, "change": 8.1, "is_positive": True, "volume": 5000000, "quoteVolume": 5000000, "lastPrice": 15.2, "highPrice": 15.8, "lowPrice": 14.0}
    ]