import requests

# 测试通知渠道API接口
url = "http://localhost:8000/api/settings/notification-channels"
headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer test-token"
}

try:
    response = requests.get(url, headers=headers)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")
except Exception as e:
    print(f"Error: {e}")

print("\n测试完成!")