import requests
import json

# 测试获取用户个人资料
def test_get_profile(token):
    url = "http://localhost:8000/api/user/profile"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {token}"
    }
    
    response = requests.get(url, headers=headers)
    print(f"Get profile response status: {response.status_code}")
    print(f"Get profile response data: {response.json()}")

# 测试更新用户个人资料
def test_update_profile(token):
    url = "http://localhost:8000/api/user/profile"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {token}"
    }
    data = {"name": "Test User", "avatar": "https://example.com/avatar.jpg"}
    
    response = requests.put(url, headers=headers, json=data)
    print(f"Update profile response status: {response.status_code}")
    print(f"Update profile response data: {response.json()}")

# 测试获取用户统计信息
def test_get_stats(token):
    url = "http://localhost:8000/api/user/stats"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {token}"
    }
    
    response = requests.get(url, headers=headers)
    print(f"Get stats response status: {response.status_code}")
    print(f"Get stats response data: {response.json()}")

# 测试获取登录历史记录
def test_get_login_history(token):
    url = "http://localhost:8000/api/user/login-history"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {token}"
    }
    
    response = requests.get(url, headers=headers)
    print(f"Get login history response status: {response.status_code}")
    print(f"Get login history response data: {response.json()}")

# 测试上传头像
def test_upload_avatar(token):
    url = "http://localhost:8000/api/user/profile/avatar"
    headers = {
        "Authorization": f"Bearer {token}"
    }
    files = {"file": ("test.jpg", b"test content", "image/jpeg")}
    
    response = requests.post(url, headers=headers, files=files)
    print(f"Upload avatar response status: {response.status_code}")
    print(f"Upload avatar response data: {response.json()}")

# 主函数
if __name__ == "__main__":
    print("Testing user management API endpoints...")
    print("=" * 50)
    
    # 首先测试登录，获取token
    login_url = "http://localhost:8000/api/auth/login"
    login_headers = {"Content-Type": "application/json"}
    login_data = {"email": "test@example.com", "password": "password123"}
    
    login_response = requests.post(login_url, headers=login_headers, json=login_data)
    print(f"Login response status: {login_response.status_code}")
    print(f"Login response data: {login_response.json()}")
    
    if login_response.status_code == 200:
        token = login_response.json().get("access_token")
        print("=" * 50)
        
        # 测试获取用户个人资料
        test_get_profile(token)
        print("=" * 50)
        
        # 测试更新用户个人资料
        test_update_profile(token)
        print("=" * 50)
        
        # 测试获取用户统计信息
        test_get_stats(token)
        print("=" * 50)
        
        # 测试获取登录历史记录
        test_get_login_history(token)
        print("=" * 50)
        
        # 测试上传头像
        test_upload_avatar(token)
        print("=" * 50)
    else:
        print("Login failed, cannot test user management APIs")
    
    print("User management API testing completed.")
