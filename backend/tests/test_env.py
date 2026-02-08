#!/usr/bin/env python3
"""
测试Python环境和依赖
"""

import sys
import os

print(f"Python版本: {sys.version}")
print(f"Python路径: {sys.executable}")
print(f"当前目录: {os.getcwd()}")

# 测试依赖
print("\n测试依赖安装情况:")
try:
    import fastapi
    print(f"✓ fastapi: {fastapi.__version__}")
except ImportError:
    print("✗ fastapi 未安装")

try:
    import uvicorn
    print(f"✓ uvicorn: {uvicorn.__version__}")
except ImportError:
    print("✗ uvicorn 未安装")

try:
    import sqlalchemy
    print(f"✓ sqlalchemy: {sqlalchemy.__version__}")
except ImportError:
    print("✗ sqlalchemy 未安装")

try:
    import dotenv
    print(f"✓ python-dotenv: {dotenv.__version__}")
except ImportError:
    print("✗ python-dotenv 未安装")

print("\n测试main.py文件是否存在:")
if os.path.exists("main.py"):
    print("✓ main.py 文件存在")
else:
    print("✗ main.py 文件不存在")

print("\n测试.env文件是否存在:")
if os.path.exists(".env"):
    print("✓ .env 文件存在")
else:
    print("✗ .env 文件不存在")
