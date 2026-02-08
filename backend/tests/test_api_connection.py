import http.client
import json

# 测试注册API
def test_register_api():
    print("=== 测试注册API连接 ===")
    
    # 创建连接
    conn = http.client.HTTPConnection("localhost", 8000)
    
    # 准备请求数据
    url = "/api/auth/register"
    headers = {"Content-Type": "application/json"}
    data = {
        "email": "test@example.com",
        "password": "password123",
        "code": "123456"
    }
    
    try:
        # 发送请求
        conn.request("POST", url, json.dumps(data), headers)
        
        # 获取响应
        response = conn.getresponse()
        
        print(f"状态码: {response.status}")
        print(f"响应: {response.read().decode()}")
        
    except Exception as e:
        print(f"连接失败: {e}")
    finally:
        conn.close()

# 测试健康检查API
def test_health_api():
    print("\n=== 测试健康检查API ===")
    
    # 创建连接
    conn = http.client.HTTPConnection("localhost", 8000)
    
    try:
        # 发送请求
        conn.request("GET", "/health")
        
        # 获取响应
        response = conn.getresponse()
        
        print(f"状态码: {response.status}")
        print(f"响应: {response.read().decode()}")
        
    except Exception as e:
        print(f"连接失败: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    test_health_api()
    test_register_api()
