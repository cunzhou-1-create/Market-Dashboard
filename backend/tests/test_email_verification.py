import requests
import json

# 测试发送验证码
def test_send_code():
    url = "http://localhost:8000/api/auth/send-code"
    headers = {"Content-Type": "application/json"}
    data = {"email": "test@example.com"}
    
    print("测试发送验证码...")
    response = requests.post(url, headers=headers, data=json.dumps(data))
    print(f"状态码: {response.status_code}")
    print(f"响应内容: {response.json()}")
    print()
    return response.status_code

# 测试验证邮箱
def test_verify_email(email, code):
    url = "http://localhost:8000/api/auth/verify-email"
    headers = {"Content-Type": "application/json"}
    data = {"email": email, "code": code}
    
    print("测试验证邮箱...")
    response = requests.post(url, headers=headers, data=json.dumps(data))
    print(f"状态码: {response.status_code}")
    print(f"响应内容: {response.json()}")
    print()
    return response.status_code

# 测试注册
def test_register():
    url = "http://localhost:8000/api/auth/register"
    headers = {"Content-Type": "application/json"}
    data = {
        "email": "test@example.com",
        "password": "password123",
        "code": "123456",  # 这里需要使用实际收到的验证码
        "name": "Test User"
    }
    
    print("测试注册...")
    response = requests.post(url, headers=headers, data=json.dumps(data))
    print(f"状态码: {response.status_code}")
    print(f"响应内容: {response.json()}")
    print()
    return response.status_code

if __name__ == "__main__":
    # 先测试发送验证码
    send_code_status = test_send_code()
    
    # 如果发送验证码成功，等待用户输入收到的验证码
    if send_code_status == 200:
        code = input("请输入收到的验证码: ")
        if code:
            # 测试验证邮箱
            test_verify_email("test@example.com", code)
            
            # 测试注册
            test_register()
