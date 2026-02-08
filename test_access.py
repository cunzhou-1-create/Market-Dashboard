import requests
import json

# 测试登录成功后用户是否能正常访问系统
def test_access():
    print("测试登录成功后用户是否能正常访问系统...")
    
    # 1. 登录获取token
    print("\n1. 登录获取token...")
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
    
    # 2. 测试获取市场数据
    print("\n2. 测试获取市场数据...")
    market_url = "http://localhost:8000/api/market"
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        market_response = requests.get(market_url, headers=headers)
        print(f"获取市场数据响应状态码: {market_response.status_code}")
        
        if market_response.status_code == 200:
            data = market_response.json()
            print(f"获取到的市场数据数量: {len(data)}")
            if data:
                print(f"第一个市场数据: {data[0]}")
        else:
            print(f"获取市场数据失败: {market_response.json()}")
            
    except Exception as e:
        print(f"获取市场数据失败: {str(e)}")
    
    # 3. 测试获取用户信息
    print("\n3. 测试获取用户信息...")
    user_url = "http://localhost:8000/api/auth/me"
    
    try:
        user_response = requests.get(user_url, headers=headers)
        print(f"获取用户信息响应状态码: {user_response.status_code}")
        
        if user_response.status_code == 200:
            user_data = user_response.json()
            print(f"用户信息: {user_data}")
        else:
            print(f"获取用户信息失败: {user_response.json()}")
            
    except Exception as e:
        print(f"获取用户信息失败: {str(e)}")
    
    # 4. 测试获取用户个人资料
    print("\n4. 测试获取用户个人资料...")
    profile_url = "http://localhost:8000/api/user/profile"
    
    try:
        profile_response = requests.get(profile_url, headers=headers)
        print(f"获取用户个人资料响应状态码: {profile_response.status_code}")
        
        if profile_response.status_code == 200:
            profile_data = profile_response.json()
            print(f"用户个人资料: {profile_data}")
        else:
            print(f"获取用户个人资料失败: {profile_response.json()}")
            
    except Exception as e:
        print(f"获取用户个人资料失败: {str(e)}")
    
    print("\n测试完成！")
    return True

if __name__ == "__main__":
    test_access()
