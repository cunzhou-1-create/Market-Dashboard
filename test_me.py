import requests

# 测试/api/auth/me端点
def test_me():
    print("Testing /api/auth/me endpoint...")
    
    # 登录获取token
    login_url = "http://localhost:8000/api/auth/login"
    login_data = {"email": "test@example.com", "password": "123456"}
    
    try:
        login_resp = requests.post(login_url, json=login_data)
        if login_resp.status_code != 200:
            print(f"Login failed: {login_resp.status_code}")
            print(f"Login content: {login_resp.text}")
            return
        
        token = login_resp.json().get("access_token")
        print(f"Token obtained: {token}")
        
        # 测试me端点
        me_url = "http://localhost:8000/api/auth/me"
        headers = {"Authorization": f"Bearer {token}"}
        
        me_resp = requests.get(me_url, headers=headers)
        print(f"Me endpoint status: {me_resp.status_code}")
        print(f"Me endpoint content: {me_resp.text}")
        
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_me()
