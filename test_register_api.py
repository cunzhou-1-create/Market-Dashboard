import requests
import json

# 测试注册API
def test_register_api():
    print("测试注册API...")
    
    # 注册URL
    register_url = "http://localhost:8000/api/auth/register"
    
    # 注册数据
    register_data = {
        "email": "extest@qq.com",
        "password": "Asd@123",
        "code": "123456"
    }
    
    print(f"注册数据: {json.dumps(register_data, indent=2)}")
    
    try:
        # 发送注册请求
        response = requests.post(
            register_url,
            json=register_data,
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
    test_register_api()
