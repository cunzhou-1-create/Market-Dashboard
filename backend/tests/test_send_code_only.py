import requests
import json

# 测试发送验证码
def test_send_code_only():
    # 使用时间戳生成唯一邮箱
    import time
    timestamp = int(time.time())
    email = f"test_{timestamp}@example.com"
    
    print(f"测试发送验证码，邮箱：{email}")
    print("=" * 60)
    
    # 发送验证码
    print("发送验证码...")
    send_code_url = "http://localhost:8000/api/auth/send-code"
    headers = {"Content-Type": "application/json"}
    send_code_data = {"email": email}
    
    response = requests.post(send_code_url, headers=headers, data=json.dumps(send_code_data))
    print(f"状态码: {response.status_code}")
    print(f"响应内容: {response.json()}")
    
    if response.status_code == 200:
        print("发送验证码成功")
        print(f"验证码已发送到邮箱：{email}")
    else:
        print("发送验证码失败")
    
    return response.status_code

if __name__ == "__main__":
    test_send_code_only()
