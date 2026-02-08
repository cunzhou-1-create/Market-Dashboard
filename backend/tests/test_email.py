import requests
import json

# 测试发送验证码
def test_send_code():
    url = "http://localhost:8000/api/auth/send-code"
    headers = {"Content-Type": "application/json"}
    data = {"email": "test@example.com"}
    
    response = requests.post(url, headers=headers, data=json.dumps(data))
    print("发送验证码响应:")
    print(f"状态码: {response.status_code}")
    print(f"响应内容: {response.json()}")
    print()

if __name__ == "__main__":
    test_send_code()
