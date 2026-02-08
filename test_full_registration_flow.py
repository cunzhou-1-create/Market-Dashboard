import requests
import json

# 测试完整的注册流程：发送验证码 -> 注册 -> 登录
def test_full_registration_flow():
    print("测试完整的注册流程...")
    
    # 使用一个新的邮箱
    test_email = "complete@qq.com"
    test_password = "Asd@123"
    test_code = "123456"  # 固定验证码
    
    print(f"测试邮箱: {test_email}")
    print(f"测试密码: {test_password}")
    print(f"测试验证码: {test_code}")
    
    # 1. 发送验证码
    print("\n1. 发送验证码")
    send_code_url = "http://localhost:8000/api/auth/resend-code"
    send_code_data = {"email": test_email}
    
    try:
        send_code_response = requests.post(
            send_code_url,
            json=send_code_data,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        print(f"发送验证码响应状态码: {send_code_response.status_code}")
        print(f"发送验证码响应内容: {send_code_response.text}")
    except Exception as e:
        print(f"发送验证码失败: {e}")
        import traceback
        traceback.print_exc()
        return
    
    # 2. 注册用户
    print("\n2. 注册用户")
    register_url = "http://localhost:8000/api/auth/register"
    register_data = {
        "email": test_email,
        "password": test_password,
        "code": test_code
    }
    
    try:
        register_response = requests.post(
            register_url,
            json=register_data,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        print(f"注册响应状态码: {register_response.status_code}")
        print(f"注册响应内容: {register_response.text}")
        
        if register_response.status_code != 200:
            print("\n注册失败，测试结束")
            return
        
        # 解析注册响应
        register_json = register_response.json()
        access_token = register_json.get("access_token")
        print(f"注册成功！获取到的token: {access_token}")
        
    except Exception as e:
        print(f"注册失败: {e}")
        import traceback
        traceback.print_exc()
        return
    
    # 3. 测试登录
    print("\n3. 测试登录")
    login_url = "http://localhost:8000/api/auth/login"
    login_data = {
        "email": test_email,
        "password": test_password
    }
    
    try:
        login_response = requests.post(
            login_url,
            json=login_data,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        print(f"登录响应状态码: {login_response.status_code}")
        print(f"登录响应内容: {login_response.text}")
        
        if login_response.status_code == 200:
            print("\n✓ 登录成功！")
            print("\n测试完成：完整的注册和登录流程均正常工作")
        else:
            print("\n✗ 登录失败")
    except Exception as e:
        print(f"登录失败: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_full_registration_flow()
