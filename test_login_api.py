import requests
import json

# 测试登录API
def test_login_api():
    print("测试登录API...")
    
    # 登录URL
    login_url = "http://localhost:8000/api/auth/login"
    
    # 登录数据
    login_data = {
        "email": "extest@qq.com",
        "password": "Asd@123"
    }
    
    print(f"登录数据: {json.dumps(login_data, indent=2)}")
    
    try:
        # 发送登录请求
        response = requests.post(
            login_url,
            json=login_data,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        print(f"响应状态码: {response.status_code}")
        print(f"响应内容: {response.text}")
        
        # 尝试解析响应JSON
        try:
            response_json = response.json()
            print(f"响应JSON: {json.dumps(response_json, indent=2)}")
        except json.JSONDecodeError:
            print("响应不是有效的JSON格式")
            
    except Exception as e:
        print(f"请求失败: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_login_api()
