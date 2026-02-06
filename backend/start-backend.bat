@echo off

REM 设置Python路径
set PYTHON_PATH=C:\Users\lenovo\AppData\Local\Microsoft\WindowsApps\python.exe

REM 安装依赖
echo 正在安装依赖...
%PYTHON_PATH% -m pip install -r requirements.txt

REM 启动应用
echo 正在启动后端服务...
%PYTHON_PATH% -m uvicorn main:app --reload --host 0.0.0.0 --port 8000