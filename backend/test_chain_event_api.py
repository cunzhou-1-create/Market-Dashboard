import requests
import json

# 测试创建链上事件提醒
def test_create_chain_event_alert():
    url = "http://localhost:8000/api/tasks/chain-event-alerts"
    headers = {"Content-Type": "application/json"}
    data = {
        "title": "大额ETH转账提醒",
        "description": "当ETH转账金额超过10000时提醒",
        "event_type": "large_transfer",
        "threshold": "10000",
        "chain": "ethereum",
        "notification_channels": {
            "email": True,
            "telegram": False,
            "webhook": False
        },
        "telegram_chat_id": "",
        "webhook_url": ""
    }
    
    try:
        response = requests.post(url, headers=headers, json=data, timeout=10)
        response.raise_for_status()
        print("创建链上事件提醒成功!")
        print("响应内容:")
        print(json.dumps(response.json(), indent=2, ensure_ascii=False))
        return True
    except Exception as e:
        print(f"创建链上事件提醒失败: {e}")
        return False

# 测试获取链上事件提醒列表
def test_get_chain_event_alerts():
    url = "http://localhost:8000/api/tasks/chain-event-alerts"
    
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        print("获取链上事件提醒列表成功!")
        print("响应内容:")
        print(json.dumps(response.json(), indent=2, ensure_ascii=False))
        return True
    except Exception as e:
        print(f"获取链上事件提醒列表失败: {e}")
        return False

if __name__ == "__main__":
    print("测试链上事件提醒API...")
    print("=" * 50)
    test_create_chain_event_alert()
    print("=" * 50)
    test_get_chain_event_alerts()
