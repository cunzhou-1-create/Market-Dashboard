import http.client

# 测试健康检查端点
conn = http.client.HTTPConnection("localhost", 8000)
conn.request("GET", "/health")
response = conn.getresponse()
print(f"健康检查状态码: {response.status}")
print(f"健康检查响应: {response.read().decode()}")
conn.close()

print("\n=== 测试完成 ===")
