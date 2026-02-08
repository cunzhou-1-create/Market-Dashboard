#!/usr/bin/env python3

# 测试 Python 环境和必要的模块

print("测试 Python 环境...")

# 测试 Python 版本
import sys
print(f"Python 版本: {sys.version}")

# 测试必要的模块
required_modules = [
    "fastapi",
    "uvicorn",
    "sqlalchemy",
    "python_jose",
    "python_dotenv",
    "passlib",
    "pandas",
    "numpy",
    "ccxt",
    "requests",
    "schedule"
]

print("\n测试必要的模块...")
for module in required_modules:
    try:
        __import__(module)
        print(f"✓ {module} 模块已安装")
    except ImportError:
        print(f"✗ {module} 模块未安装")

print("\n环境测试完成！")
