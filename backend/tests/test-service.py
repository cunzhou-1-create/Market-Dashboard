import requests
import time

def test_service():
    print("测试后端服务是否运行...")
    
    # 尝试访问服务的根路径
    url = "http://localhost:8000/"
    
    try:
        response = requests.get(url, timeout=5)
        print(f"服务响应状态码: {response.status_code}")
        print(f"服务响应内容: {response.text}")
        print("服务正在运行！")
        return True
    except requests.exceptions.ConnectionError:
        print("无法连接到服务，服务可能未运行")
        return False
    except Exception as e:
        print(f"测试过程中出错: {e}")
        return False

if __name__ == "__main__":
    test_service()
