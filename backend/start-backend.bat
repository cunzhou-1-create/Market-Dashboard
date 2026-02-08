@echo off

REM 安装依赖
echo 正在安装依赖...
python -m pip install -r requirements.txt

REM 启动应用
echo 正在启动后端服务...
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000