import sys
import os

print("Python路径:")
print(sys.executable)
print("\nPython版本:")
print(sys.version)
print("\nPython搜索路径:")
for path in sys.path:
    print(path)

# 尝试导入fastapi
print("\n尝试导入fastapi:")
try:
    import fastapi
    print(f"成功导入fastapi，版本: {fastapi.__version__}")
except ImportError as e:
    print(f"导入失败: {e}")

# 尝试导入uvicorn
print("\n尝试导入uvicorn:")
try:
    import uvicorn
    print(f"成功导入uvicorn，版本: {uvicorn.__version__}")
except ImportError as e:
    print(f"导入失败: {e}")
