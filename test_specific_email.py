import requests
import json

# 测试指定的测试邮箱注册功能
def test_specific_email():
    print("测试指定的测试邮箱注册功能...")
    
    # 使用指定的测试邮箱
    test_email = "extest@qq.com"
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
        
        if register_response.status_code == 200:
            print("\n✓ 注册成功！")
        else:
            print("\n✗ 注册失败")
    except Exception as e:
        print(f"注册失败: {e}")
        import traceback
        traceback.print_exc()
    
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
            print("\n测试完成：指定的测试邮箱注册和登录功能均正常工作")
        else:
            print("\n✗ 登录失败")
    except Exception as e:
        print(f"登录失败: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_specific_email()
