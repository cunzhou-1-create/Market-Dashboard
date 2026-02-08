import requests
import json

# 测试发送验证码
def test_send_code():
    url = "http://localhost:8000/api/auth/send-code"
    headers = {"Content-Type": "application/json"}
    data = {"email": "test@example.com"}
    
    print("测试发送验证码...")
    print(f"URL: {url}")
    print(f"Headers: {headers}")
    print(f"Data: {data}")
    
    try:
        response = requests.post(url, headers=headers, data=json.dumps(data), timeout=10)
        print(f"响应状态码: {response.status_code}")
        print(f"响应内容: {response.text}")
        
        if response.status_code == 200:
            print("发送验证码成功!")
        else:
            print("发送验证码失败!")
            
    except Exception as e:
        print(f"发送验证码时发生错误: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_send_code()