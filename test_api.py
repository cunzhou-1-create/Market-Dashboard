import requests

# 测试市场数据API
try:
    response = requests.get('http://localhost:8000/api/market?skip=0&limit=100')
    print(f"市场数据API状态码: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print(f"返回数据条数: {len(data.get('items', []))}")
        print(f"总数据条数: {data.get('total', 0)}")
        if data.get('items'):
            print("第一条数据:")
            print(data['items'][0])
    else:
        print(f"错误信息: {response.text}")
except Exception as e:
    print(f"请求失败: {e}")

print("\n" + "="*50 + "\n")

# 测试健康检查API
try:
    response = requests.get('http://localhost:8000/health')
    print(f"健康检查API状态码: {response.status_code}")
    print(f"健康检查API响应: {response.text}")
except Exception as e:
    print(f"请求失败: {e}")
