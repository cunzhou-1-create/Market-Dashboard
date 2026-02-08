import requests
import json

# 测试验证邮箱
def test_verify_email():
    url = "http://localhost:8000/api/auth/verify-email"
    headers = {"Content-Type": "application/json"}
    data = {
        "email": "test@example.com",
        "code": "295834"  # 使用用户提供的验证码
    }
    
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
        "code": "295834",  # 使用用户提供的验证码
        "name": "Test User"
    }
    
    print("测试注册...")
    response = requests.post(url, headers=headers, data=json.dumps(data))
    print(f"状态码: {response.status_code}")
    print(f"响应内容: {response.json()}")
    print()
    return response.status_code

if __name__ == "__main__":
    # 测试验证邮箱
    verify_status = test_verify_email()
    
    # 测试注册
    if verify_status == 200:
        test_register()
