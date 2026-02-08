import requests
import json

# 测试API连接
def test_api_connection():
    print("测试API连接...")
    
    # 测试resend-code接口
    url = "http://localhost:8000/api/auth/resend-code"
    data = {"email": "test@qq.com"}
    
    try:
        response = requests.post(
            url,
            json=data,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        print(f"状态码: {response.status_code}")
        print(f"响应内容: {response.text}")
    except Exception as e:
        print(f"请求失败: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_api_connection()
