import requests

# 测试API连通性
def test_api_connection():
    url = "http://localhost:8000/api/tasks"
    
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        print("API连通性测试成功!")
        print(f"响应状态码: {response.status_code}")
        return True
    except Exception as e:
        print(f"API连通性测试失败: {e}")
        return False

if __name__ == "__main__":
    print("测试API连通性...")
    test_api_connection()
