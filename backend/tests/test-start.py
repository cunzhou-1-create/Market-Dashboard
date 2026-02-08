#!/usr/bin/env python3
"""
测试后端服务启动
"""

import sys
import os
import subprocess

# 清空日志文件
log_file = "start-log.txt"
with open(log_file, 'w', encoding='utf-8') as f:
    f.write("# 后端服务启动测试日志\n\n")

# 写入日志的函数
def write_log(message):
    """将消息写入日志文件"""
    with open(log_file, 'a', encoding='utf-8') as f:
        f.write(f"{message}\n")
    print(message)

# 测试系统信息
write_log(f"Python版本: {sys.version}")
write_log(f"Python路径: {sys.executable}")
write_log(f"当前目录: {os.getcwd()}")
write_log(f"系统路径: {os.environ.get('PATH', '')}")

# 测试文件存在性
write_log("\n测试文件存在性:")
files_to_check = [
    'main.py',
    'requirements.txt',
    '.env',
    'app/__init__.py',
    'app/config.py'
]

for file_path in files_to_check:
    if os.path.exists(file_path):
        write_log(f"✓ {file_path} 存在")
    else:
        write_log(f"✗ {file_path} 不存在")

# 测试依赖安装
write_log("\n测试依赖安装:")
try:
    result = subprocess.run(
        [sys.executable, '-m', 'pip', 'install', '-r', 'requirements.txt'],
        capture_output=True,
        text=True,
        timeout=60
    )
    write_log(f"依赖安装退出码: {result.returncode}")
    if result.stdout:
        write_log("依赖安装输出:")
        write_log(result.stdout[:1000])
    if result.stderr:
        write_log("依赖安装错误:")
        write_log(result.stderr[:1000])
except Exception as e:
    write_log(f"依赖安装异常: {e}")

# 测试模块导入
write_log("\n测试模块导入:")
try:
    import fastapi
    write_log(f"✓ fastapi 导入成功: {fastapi.__version__}")
except ImportError as e:
    write_log(f"✗ fastapi 导入失败: {e}")

try:
    import uvicorn
    write_log(f"✓ uvicorn 导入成功: {uvicorn.__version__}")
except ImportError as e:
    write_log(f"✗ uvicorn 导入失败: {e}")

try:
    from app.config import settings
    write_log(f"✓ 项目配置导入成功: {settings.PROJECT_NAME}")
except ImportError as e:
    write_log(f"✗ 项目配置导入失败: {e}")

# 测试启动服务
write_log("\n测试启动服务:")
try:
    # 使用subprocess启动服务
    process = subprocess.Popen(
        [sys.executable, 'main.py'],
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True
    )
    
    # 读取输出
    output = []
    for i in range(20):  # 读取20行输出
        line = process.stdout.readline()
        if not line:
            break
        output.append(line.strip())
    
    write_log("服务启动输出:")
    for line in output:
        write_log(line)
    
    # 检查进程状态
    if process.poll() is None:
        write_log("服务正在运行")
        process.terminate()
        process.wait(timeout=5)
    else:
        write_log(f"服务已退出，退出码: {process.returncode}")
        
    # 读取剩余输出
    remaining_output = process.stdout.read()
    if remaining_output:
        write_log("剩余输出:")
        write_log(remaining_output[:1000])
        
except Exception as e:
    write_log(f"服务启动异常: {e}")

write_log("\n测试完成!")
print(f"测试完成，详细日志已保存到 {log_file}")
