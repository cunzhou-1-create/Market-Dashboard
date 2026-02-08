import requests
import json

# 测试验证邮箱和注册
def test_verification_with_user_code():
    email = "test_1770442640@example.com"  # 使用之前生成的邮箱
    code = ""  # 等待用户输入验证码
    password = "password123"
    name = "Test User"
    
    print(f"测试验证邮箱和注册，邮箱：{email}")
    print("=" * 60)
    
    # 1. 等待用户输入验证码
    code = input("请输入收到的验证码: ")
    if not code:
        print("验证码不能为空，流程终止")
        return False
    
    print()
    
    # 2. 验证邮箱
    print("1. 验证邮箱...")
    verify_url = "http://localhost:8000/api/auth/verify-email"
    headers = {"Content-Type": "application/json"}
    verify_data = {"email": email, "code": code}
    
    response = requests.post(verify_url, headers=headers, data=json.dumps(verify_data))
    print(f"状态码: {response.status_code}")
    print(f"响应内容: {response.json()}")
    
    if response.status_code == 200:
        print("验证邮箱成功")
    else:
        print("验证邮箱失败")
    
    print()
    
    # 3. 注册
    print("2. 注册...")
    register_url = "http://localhost:8000/api/auth/register"
    register_data = {
        "email": email,
        "password": password,
        "code": code,
        "name": name
    }
    
    response = requests.post(register_url, headers=headers, data=json.dumps(register_data))
    print(f"状态码: {response.status_code}")
    print(f"响应内容: {response.json()}")
    
    if response.status_code == 200:
        print("注册成功！")
        return True
    else:
        print("注册失败")
        return False

if __name__ == "__main__":
    test_verification_with_user_code()
