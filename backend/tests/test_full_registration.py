import requests
import json
import time

# 测试完整的注册流程
def test_full_registration():
    email = f"test_{int(time.time())}@example.com"  # 使用时间戳生成唯一邮箱
    password = "password123"
    name = "Test User"
    
    print(f"测试完整注册流程，邮箱：{email}")
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
    
    # 2. 等待用户输入验证码
    code = input("请输入收到的验证码: ")
    if not code:
        print("验证码不能为空，流程终止")
        return False
    
    print()
    
    # 3. 验证邮箱
    print("2. 验证邮箱...")
    verify_url = "http://localhost:8000/api/auth/verify-email"
    verify_data = {"email": email, "code": code}
    
    response = requests.post(verify_url, headers=headers, data=json.dumps(verify_data))
    print(f"状态码: {response.status_code}")
    print(f"响应内容: {response.json()}")
    
    if response.status_code != 200:
        print("验证邮箱失败，流程终止")
        return False
    
    print()
    
    # 4. 注册
    print("3. 注册...")
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
        print("\n注册成功！")
        return True
    else:
        print("\n注册失败")
        return False

if __name__ == "__main__":
    test_full_registration()
