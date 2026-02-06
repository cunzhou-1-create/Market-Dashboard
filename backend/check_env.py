import sys
import os

print("Python路径:")
print(sys.executable)
print("\nPython版本:")
print(sys.version)
print("\nPython搜索路径:")
for path in sys.path:
    print(path)
print("\n已安装的包:")
try:
    import pip
    installed_packages = pip.get_installed_distributions()
    for package in installed_packages:
        print(f"{package.key}=={package.version}")
except Exception as e:
    print(f"无法获取已安装的包: {e}")
