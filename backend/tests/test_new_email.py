import requests
import json
import time

# 测试新的邮箱地址
def test_new_email():
    # 使用时间戳生成唯一邮箱
    timestamp = int(time.time())
    email = f"test_{timestamp}@example.com"
    password = "password123"
    name = "Test User"
    
    print(f"测试新的邮箱地址，邮箱：{email}")
    print("=" * 60)
    
    # 1. 发送验证码
    print("1. 发送验证码...")
    send_code_url = "http://localhost:8000/api/auth/send-code"
    headers = {"Content-Type": "application/json"}
    send_code_data = {"email": email}
    
    response = requests.post(send_code_url, headers=headers, data=json.dumps(send_code_data))
    print(f"状态码: {response.status_code}")
    print(f"响应内容: {response.json()}")
    
    if response.status_code != 200:
        print("发送验证码失败，流程终止")
        return False
    
    print()
    print("验证码已发送，请查看邮箱")
    print(f"邮箱地址：{email}")
    print()
    print("请输入收到的验证码：")
    
    return True

if __name__ == "__main__":
    test_new_email()
