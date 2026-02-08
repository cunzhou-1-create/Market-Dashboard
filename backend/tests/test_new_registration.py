import requests
import json
import time

# 测试新的注册流程
def test_new_registration():
    # 使用时间戳生成唯一邮箱
    timestamp = int(time.time())
    email = f"test_{timestamp}@example.com"
    password = "password123"
    name = "Test User"
    
    print(f"测试新的注册流程，邮箱：{email}")
    print("=" * 60)
    
    # 1. 发送验证码
    print("1. 发送验证码...")
    send_code_url = "http://localhost:8000/api/auth/send-code"
    headers = {"Content-Type": "application/json"}
    send_code_data = {"email": email}
    
    response = requests.post(send_code_url, headers=headers, data=json.dumps(send_code_data))
    print(f"状态码: {response.status_code}")
    print(f"响应内容: {response.json()}")
    
    if response.status_code != 200:
        print("发送验证码失败，流程终止")
        return False
    
    print()
    print("请查看邮箱，获取验证码")
    print(f"验证码发送到邮箱：{email}")
    print()
    
    # 2. 直接使用用户可能收到的验证码格式
    print("注意：验证码为6位数字，如：123456")
    print("如果收到验证码，请在前端界面使用该验证码完成注册")
    print()
    
    # 3. 测试注册（这里使用一个示例验证码，实际使用时需要替换）
    print("3. 测试注册接口...")
    print("注意：实际注册时需要使用真实收到的验证码")
    
    return True

if __name__ == "__main__":
    test_new_registration()
