import requests
import json

# 测试获取价格预警列表
def test_get_alerts(token):
    url = "http://localhost:8000/api/alerts"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {token}"
    }
    
    response = requests.get(url, headers=headers)
    print(f"Get alerts response status: {response.status_code}")
    print(f"Get alerts response data: {response.json()}")

# 测试创建价格预警
def test_create_alert(token):
    url = "http://localhost:8000/api/alerts"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {token}"
    }
    data = {
        "symbol_id": 1,
        "condition": "price_gt",
        "threshold": 70000,
        "frequency": "15min"
    }
    
    response = requests.post(url, headers=headers, json=data)
    print(f"Create alert response status: {response.status_code}")
    print(f"Create alert response data: {response.json()}")

# 测试更新价格预警
def test_update_alert(token, alert_id):
    url = f"http://localhost:8000/api/alerts/{alert_id}"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {token}"
    }
    data = {
        "condition": "price_gt",
        "threshold": 75000,
        "frequency": "30min",
        "is_active": True
    }
    
    response = requests.put(url, headers=headers, json=data)
    print(f"Update alert response status: {response.status_code}")
    print(f"Update alert response data: {response.json()}")

# 测试切换价格预警状态
def test_toggle_alert(token, alert_id):
    url = f"http://localhost:8000/api/alerts/{alert_id}/toggle"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {token}"
    }
    
    response = requests.put(url, headers=headers)
    print(f"Toggle alert response status: {response.status_code}")
    print(f"Toggle alert response data: {response.json()}")

# 测试删除价格预警
def test_delete_alert(token, alert_id):
    url = f"http://localhost:8000/api/alerts/{alert_id}"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {token}"
    }
    
    response = requests.delete(url, headers=headers)
    print(f"Delete alert response status: {response.status_code}")
    print(f"Delete alert response data: {response.json()}")

# 主函数
if __name__ == "__main__":
    print("Testing price alerts API endpoints...")
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
        
        # 测试获取价格预警列表
        test_get_alerts(token)
        print("=" * 50)
        
        # 测试创建价格预警
        test_create_alert(token)
        print("=" * 50)
        
        # 假设创建成功，获取alert_id
        # 这里简化处理，实际应该从创建响应中获取
        # alert_id = 1
        # 
        # # 测试更新价格预警
        # test_update_alert(token, alert_id)
        # print("=" * 50)
        # 
        # # 测试切换价格预警状态
        # test_toggle_alert(token, alert_id)
        # print("=" * 50)
        # 
        # # 测试删除价格预警
        # test_delete_alert(token, alert_id)
        # print("=" * 50)
    else:
        print("Login failed, cannot test price alerts APIs")
    
    print("Price alerts API testing completed.")
