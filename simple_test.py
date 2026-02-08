import requests

# 简单测试脚本
def main():
    # 登录
    login_url = "http://localhost:8000/api/auth/login"
    login_data = {"email": "test@example.com", "password": "123456"}
    
    try:
        login_resp = requests.post(login_url, json=login_data)
        if login_resp.status_code != 200:
            print(f"Login failed: {login_resp.status_code}")
            return
        
        token = login_resp.json().get("access_token")
        print(f"Token: {token}")
        
        # 测试me端点
        me_url = "http://localhost:8000/api/auth/me"
        headers = {"Authorization": f"Bearer {token}"}
        
        me_resp = requests.get(me_url, headers=headers)
        print(f"Me endpoint status: {me_resp.status_code}")
        print(f"Me endpoint content: {me_resp.text}")
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()
