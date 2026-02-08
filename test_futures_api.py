import requests
import json

# 测试期货市场数据API
url = 'http://localhost:8000/api/market/futures'

print(f"测试API: {url}")
print("=" * 60)

try:
    response = requests.get(url, timeout=30)
    response.raise_for_status()  # 检查HTTP错误
    
    data = response.json()
    print(f"状态码: {response.status_code}")
    print(f"返回数据类型: {type(data)}")
    
    # 保存完整响应到文件
    with open('futures_api_response.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print("\n完整响应已保存到 futures_api_response.json 文件")
    
    if isinstance(data, dict) and 'data' in data:
        futures_data = data['data']
        print(f"\n期货数据数量: {len(futures_data)}")
        print("\n前5个数据示例:")
        for i, item in enumerate(futures_data[:5]):
            print(f"\n{i+1}. 符号: {item.get('symbol')}")
            print(f"   名称: {item.get('name')}")
            print(f"   价格: {item.get('price')}")
            print(f"   24h涨跌幅: {item.get('change')}%")
            print(f"   成交量: {item.get('volume')}")
            print(f"   成交额: {item.get('quoteVolume')}")
    else:
        print("返回数据格式不符合预期")
        print(data)
        
except requests.exceptions.RequestException as e:
    print(f"请求失败: {e}")
except Exception as e:
    print(f"处理响应失败: {e}")
