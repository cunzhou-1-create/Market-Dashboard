#!/usr/bin/env python3
"""
启动后端服务并将所有输出写入日志文件
"""

import os
import sys
import subprocess
import time

# 定义日志文件路径
LOG_FILE = "start-log.txt"

# 清除旧的日志文件
if os.path.exists(LOG_FILE):
    os.remove(LOG_FILE)

# 写入日志的函数
def write_log(message):
    """将消息写入日志文件"""
    with open(LOG_FILE, 'a', encoding='utf-8') as f:
        timestamp = time.strftime("%Y-%m-%d %H:%M:%S")
        f.write(f"[{timestamp}] {message}\n")
    print(message)

# 测试Python环境
def test_python():
    """测试Python环境"""
    write_log("测试Python环境...")
    write_log(f"Python版本: {sys.version}")
    write_log(f"Python路径: {sys.executable}")
    write_log(f"当前目录: {os.getcwd()}")
    
    # 测试依赖
    write_log("\n测试依赖安装情况:")
    dependencies = [
        'fastapi',
        'uvicorn',
        'sqlalchemy',
        'python-dotenv',
        'passlib',
        'python-jose',
        'python-multipart'
    ]
    
    for dep in dependencies:
        try:
            __import__(dep.replace('-', '_'))
            write_log(f"✓ {dep} 已安装")
        except ImportError:
            write_log(f"✗ {dep} 未安装")

# 安装依赖
def install_dependencies():
    """安装依赖"""
    write_log("\n安装依赖...")
    try:
        result = subprocess.run(
            [sys.executable, '-m', 'pip', 'install', '-r', 'requirements.txt'],
            capture_output=True,
            text=True,
            timeout=60
        )
        write_log(f"依赖安装退出码: {result.returncode}")
        if result.stdout:
            write_log(f"依赖安装输出: {result.stdout[:500]}...")
        if result.stderr:
            write_log(f"依赖安装错误: {result.stderr[:500]}...")
        return result.returncode == 0
    except Exception as e:
        write_log(f"依赖安装失败: {e}")
        return False

# 启动服务
def start_service():
    """启动后端服务"""
    write_log("\n启动后端服务...")
    write_log("服务将在 http://localhost:8000 上运行")
    
    try:
        # 使用subprocess启动服务
        process = subprocess.Popen(
            [sys.executable, '-m', 'uvicorn', 'main:app', '--reload', '--host', '0.0.0.0', '--port', '8000'],
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True
        )
        
        # 读取并记录服务输出
        write_log("服务启动中，等待输出...")
        
        # 等待几秒钟，看看服务是否成功启动
        start_time = time.time()
        while time.time() - start_time < 10:
            if process.poll() is not None:
                write_log(f"服务意外退出，退出码: {process.returncode}")
                break
            
            # 读取输出
            try:
                line = process.stdout.readline()
                if line:
                    write_log(f"服务输出: {line.strip()}")
                    # 检查是否成功启动
                    if "Uvicorn running on" in line:
                        write_log("✓ 服务成功启动！")
                        break
            except Exception as e:
                write_log(f"读取服务输出失败: {e}")
                break
            
            time.sleep(0.5)
        
        # 如果服务仍在运行，记录PID
        if process.poll() is None:
            write_log(f"服务正在运行，PID: {process.pid}")
            write_log("按Ctrl+C停止服务")
            # 等待用户输入
            try:
                input()
            except KeyboardInterrupt:
                pass
            # 停止服务
            process.terminate()
            process.wait(timeout=5)
            write_log("服务已停止")
        
    except Exception as e:
        write_log(f"服务启动失败: {e}")

# 主函数
def main():
    """主函数"""
    write_log("开始启动后端服务...")
    
    # 测试Python环境
    test_python()
    
    # 安装依赖
    if not install_dependencies():
        write_log("依赖安装失败，无法启动服务")
        return
    
    # 启动服务
    start_service()
    
    write_log("启动过程完成")

if __name__ == "__main__":
    main()
