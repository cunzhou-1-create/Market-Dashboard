@echo off

REM 直接使用系统默认的Python
python --version
if %errorlevel% neq 0 (
    echo Python not found
    pause
    exit /b %errorlevel%
)

REM 安装依赖
python -m pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo Failed to install dependencies
    pause
    exit /b %errorlevel%
)

REM 启动服务
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
