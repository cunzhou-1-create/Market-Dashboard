import requests
import json

# 测试异常情况
def test_error_cases():
    print("测试异常情况开始...")
    
    # 测试1: 邮箱格式错误
    print("\n1. 测试邮箱格式错误...")
    register_url = "http://localhost:8000/api/auth/register"
    wrong_email_data = {
        "email": "invalid-email",
        "password": "123456",
        "code": "123456"
    }
    
    try:
        response = requests.post(register_url, json=wrong_email_data)
        print(f"响应状态码: {response.status_code}")
        print(f"响应内容: {response.json()}")
    except Exception as e:
        print(f"测试失败: {str(e)}")
    
    # 测试2: 密码长度不足
    print("\n2. 测试密码长度不足...")
    short_password_data = {
        "email": "test2@example.com",
        "password": "123",
        "code": "123456"
    }
    
    try:
        response = requests.post(register_url, json=short_password_data)
        print(f"响应状态码: {response.status_code}")
        print(f"响应内容: {response.json()}")
    except Exception as e:
        print(f"测试失败: {str(e)}")
    
    # 测试3: 验证码错误
    print("\n3. 测试验证码错误...")
    # 先发送验证码
    send_code_url = "http://localhost:8000/api/auth/resend-code"
    send_code_data = {"email": "test3@example.com"}
    
    try:
        send_response = requests.post(send_code_url, json=send_code_data)
        print(f"发送验证码响应: {send_response.status_code}")
        
        # 然后使用错误的验证码注册
        wrong_code_data = {
            "email": "test3@example.com",
            "password": "123456",
            "code": "654321"
        }
        
        response = requests.post(register_url, json=wrong_code_data)
        print(f"响应状态码: {response.status_code}")
        print(f"响应内容: {response.json()}")
    except Exception as e:
        print(f"测试失败: {str(e)}")
    
    # 测试4: 邮箱已存在
    print("\n4. 测试邮箱已存在...")
    existing_email_data = {
        "email": "test@example.com",
        "password": "123456",
        "code": "123456"
    }
    
    try:
        response = requests.post(register_url, json=existing_email_data)
        print(f"响应状态码: {response.status_code}")
        print(f"响应内容: {response.json()}")
    except Exception as e:
        print(f"测试失败: {str(e)}")
    
    # 测试5: 登录时邮箱或密码错误
    print("\n5. 测试登录时邮箱或密码错误...")
    login_url = "http://localhost:8000/api/auth/login"
    wrong_login_data = {
        "email": "test@example.com",
        "password": "wrongpassword"
    }
    
    try:
        response = requests.post(login_url, json=wrong_login_data)
        print(f"响应状态码: {response.status_code}")
        print(f"响应内容: {response.json()}")
    except Exception as e:
        print(f"测试失败: {str(e)}")
    
    print("\n异常情况测试完成！")

if __name__ == "__main__":
    test_error_cases()
