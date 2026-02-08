import requests
import json

# 测试注册功能
def test_registration():
    print("测试注册功能开始...")
    
    # 1. 发送验证码
    print("1. 发送验证码...")
    send_code_url = "http://localhost:8000/api/auth/resend-code"
    send_code_data = {"email": "test@example.com"}
    
    try:
        send_code_response = requests.post(send_code_url, json=send_code_data)
        print(f"发送验证码响应: {send_code_response.status_code}")
        print(f"发送验证码响应内容: {send_code_response.json()}")
    except Exception as e:
        print(f"发送验证码失败: {str(e)}")
        return False
    
    # 2. 注册
    print("\n2. 执行注册...")
    register_url = "http://localhost:8000/api/auth/register"
    register_data = {
        "email": "test@example.com",
        "password": "123456",
        "code": "123456"
    }
    
    try:
        register_response = requests.post(register_url, json=register_data)
        print(f"注册响应: {register_response.status_code}")
        print(f"注册响应内容: {register_response.json()}")
        
        if register_response.status_code == 200:
            print("\n注册成功！")
            # 保存token
            token = register_response.json().get("access_token")
            print(f"获取到的token: {token}")
            return token
        else:
            print("\n注册失败！")
            return False
    except Exception as e:
        print(f"注册失败: {str(e)}")
        return False

# 测试登录功能
def test_login(token):
    print("\n测试登录功能开始...")
    
    login_url = "http://localhost:8000/api/auth/login"
    login_data = {
        "email": "test@example.com",
        "password": "123456"
    }
    
    try:
        login_response = requests.post(login_url, json=login_data)
        print(f"登录响应: {login_response.status_code}")
        print(f"登录响应内容: {login_response.json()}")
        
        if login_response.status_code == 200:
            print("\n登录成功！")
            return True
        else:
            print("\n登录失败！")
            return False
    except Exception as e:
        print(f"登录失败: {str(e)}")
        return False

# 测试获取当前用户信息
def test_get_current_user(token):
    print("\n测试获取当前用户信息...")
    
    user_url = "http://localhost:8000/api/auth/me"
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        user_response = requests.get(user_url, headers=headers)
        print(f"获取用户信息响应: {user_response.status_code}")
        print(f"获取用户信息响应内容: {user_response.json()}")
        
        if user_response.status_code == 200:
            print("\n获取用户信息成功！")
            return True
        else:
            print("\n获取用户信息失败！")
            return False
    except Exception as e:
        print(f"获取用户信息失败: {str(e)}")
        return False

if __name__ == "__main__":
    # 执行注册测试
    token = test_registration()
    
    if token:
        # 执行登录测试
        login_success = test_login(token)
        
        if login_success:
            # 执行获取用户信息测试
            test_get_current_user(token)
    
    print("\n测试完成！")
