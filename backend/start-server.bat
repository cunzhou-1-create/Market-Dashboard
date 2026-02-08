@echo off

REM 设置完整的Python路径
set PYTHON_EXE=C:\Users\cunzhou\AppData\Local\Microsoft\WindowsApps\python.exe

REM 切换到脚本所在目录
cd /d "%~dp0"

REM 显示当前状态
echo 当前目录: %cd%
echo Python路径: %PYTHON_EXE%

REM 测试Python是否可执行
echo 测试Python执行...
%PYTHON_EXE% --version
if %errorlevel% neq 0 (
    echo 错误: 无法执行Python
    pause
    exit /b %errorlevel%
)

REM 安装依赖
echo 安装依赖...
%PYTHON_EXE% -m pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo 错误: 依赖安装失败
    pause
    exit /b %errorlevel%
)

REM 启动后端服务
echo 启动后端服务...
echo 服务将在 http://localhost:8000 上运行
%PYTHON_EXE% -m uvicorn main:app --reload --host 0.0.0.0 --port 8000

REM 检查服务启动状态
if %errorlevel% neq 0 (
    echo 错误: 服务启动失败
    pause
    exit /b %errorlevel%
)
