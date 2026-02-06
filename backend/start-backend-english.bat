@echo off

REM Set Python path
set PYTHON_PATH=C:\Users\lenovo\AppData\Local\Microsoft\WindowsApps\python.exe

REM Install dependencies
echo Installing dependencies...
%PYTHON_PATH% -m pip install -r requirements.txt

REM Start application
echo Starting backend service...
%PYTHON_PATH% -m uvicorn main:app --reload --host 0.0.0.0 --port 8000