import requests

# 测试/api/auth/me端点
def test_me_endpoint():
    print("测试/api/auth/me端点...")
    
    # 1. 登录获取token
    login_url = "http://localhost:8000/api/auth/login"
    login_data = {
        "email": "test@example.com",
        "password": "123456"
    }
    
    try:
        login_response = requests.post(login_url, json=login_data)
        print(f"登录响应状态码: {login_response.status_code}")
        
        if login_response.status_code != 200:
            print(f"登录失败: {login_response.json()}")
            return False
        
        token = login_response.json().get("access_token")
        print(f"获取到的token: {token}")
        
    except Exception as e:
        print(f"登录失败: {str(e)}")
        return False
    
    # 2. 测试/api/auth/me端点
    me_url = "http://localhost:8000/api/auth/me"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    try:
        print("\n发送请求到/api/auth/me端点...")
        print(f"请求URL: {me_url}")
        print(f"请求头: {headers}")
        
        me_response = requests.get(me_url, headers=headers, timeout=10)
        
        print(f"\n响应状态码: {me_response.status_code}")
        print(f"响应头: {dict(me_response.headers)}")
        print(f"响应内容: {me_response.text}")
        
        if me_response.status_code == 200:
            print("\n测试成功！/api/auth/me端点返回了正确的响应。")
            return True
        else:
            print("\n测试失败！/api/auth/me端点返回了错误的响应。")
            return False
            
    except Exception as e:
        print(f"\n测试失败: {str(e)}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    test_me_endpoint()
