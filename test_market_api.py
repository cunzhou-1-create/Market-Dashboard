import requests
import json

# 测试获取单个币种数据
def test_get_symbol_detail():
    url = "http://localhost:8000/api/market/symbol"
    headers = {"Content-Type": "application/json"}
    params = {"symbol": "BTC/USDT"}
    
    response = requests.get(url, headers=headers, params=params)
    print(f"Get symbol detail response status: {response.status_code}")
    print(f"Get symbol detail response data: {response.json()}")

# 测试获取技术指标
def test_get_technical_indicators():
    url = "http://localhost:8000/api/market/technical"
    headers = {"Content-Type": "application/json"}
    params = {"symbol": "BTC/USDT"}
    
    response = requests.get(url, headers=headers, params=params)
    print(f"Get technical indicators response status: {response.status_code}")
    print(f"Get technical indicators response data: {response.json()}")

# 测试获取观察列表
def test_get_watchlist():
    url = "http://localhost:8000/api/market/watchlist/list"
    headers = {"Content-Type": "application/json"}
    
    response = requests.get(url, headers=headers)
    print(f"Get watchlist response status: {response.status_code}")
    print(f"Get watchlist response data: {response.json()}")

if __name__ == "__main__":
    print("Testing market data API endpoints...")
    print("=" * 50)
    
    # 测试获取单个币种数据
    test_get_symbol_detail()
    print("=" * 50)
    
    # 测试获取技术指标
    test_get_technical_indicators()
    print("=" * 50)
    
    # 测试获取观察列表
    test_get_watchlist()
    print("=" * 50)
    print("Market data API testing completed.")
