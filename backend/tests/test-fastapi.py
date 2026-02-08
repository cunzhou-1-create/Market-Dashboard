#!/usr/bin/env python3
"""
测试FastAPI服务启动
"""

from fastapi import FastAPI
import uvicorn

# 创建FastAPI应用
app = FastAPI(title="Test API")

# 根路径
@app.get("/")
def read_root():
    return {"message": "Test API is running"}

# 健康检查
@app.get("/health")
def health_check():
    return {"status": "healthy"}

# 直接启动服务
if __name__ == "__main__":
    print("启动测试服务...")
    print("服务将在 http://localhost:8000 上运行")
    uvicorn.run("test-fastapi:app", host="0.0.0.0", port=8000, reload=True)
