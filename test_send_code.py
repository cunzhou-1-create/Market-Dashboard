import requests

# API URL
url = 'http://localhost:8000/api/auth/resend-code'

# 请求数据
data = {'email': 'test@example.com'}

# 发送请求
try:
    response = requests.post(url, json=data)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")
    print("\n请查看后端日志获取生成的验证码")
except Exception as e:
    print(f"Error: {e}")
