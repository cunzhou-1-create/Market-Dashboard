import requests
import json

# API基础URL
API_BASE_URL = 'http://localhost:8000/api'

# 测试邮箱
test_email = 'test@example.com'
test_password = 'password123'

print("=== 测试注册流程 ===")

# 1. 发送验证码
print("\n1. 发送验证码...")
resend_code_url = f"{API_BASE_URL}/auth/resend-code"
resend_data = {'email': test_email}

response = requests.post(resend_code_url, json=resend_data)
print(f"发送验证码状态码: {response.status_code}")
print(f"发送验证码响应: {response.json()}")

# 2. 等待用户输入验证码
print("\n请查看后端日志获取验证码，然后输入:")
verification_code = input("验证码: ")

# 3. 注册用户
print("\n3. 注册用户...")
register_url = f"{API_BASE_URL}/auth/register"
register_data = {
    'email': test_email,
    'password': test_password,
    'code': verification_code
}

response = requests.post(register_url, json=register_data)
print(f"注册状态码: {response.status_code}")
print(f"注册响应: {response.json()}")

# 4. 登录用户
print("\n4. 登录用户...")
login_url = f"{API_BASE_URL}/auth/login"
login_data = {
    'email': test_email,
    'password': test_password
}

response = requests.post(login_url, json=login_data)
print(f"登录状态码: {response.status_code}")
print(f"登录响应: {response.json()}")

if response.status_code == 200:
    token = response.json().get('access_token')
    print(f"\n获取到的token: {token}")
    
    # 5. 获取当前用户信息
    print("\n5. 获取当前用户信息...")
    me_url = f"{API_BASE_URL}/auth/me"
    headers = {'Authorization': f'Bearer {token}'}
    
    response = requests.get(me_url, headers=headers)
    print(f"获取用户信息状态码: {response.status_code}")
    print(f"用户信息: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")

print("\n=== 测试完成 ===")
