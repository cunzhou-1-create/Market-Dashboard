# 设置执行策略
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process -Force

# 切换到脚本所在目录
Set-Location -Path $PSScriptRoot

# 显示当前状态
Write-Host "Current directory: $PWD"
Write-Host "Starting backend server..."

# 定义Python路径
$pythonExe = "C:\Users\cunzhou\AppData\Local\Microsoft\WindowsApps\python.exe"

# 测试Python
Write-Host "Testing Python..."
& $pythonExe --version
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Cannot execute Python" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit $LASTEXITCODE
}

# 安装依赖
Write-Host "Installing dependencies..."
& $pythonExe -m pip install -r requirements.txt
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Failed to install dependencies" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit $LASTEXITCODE
}

# 启动服务
Write-Host "Starting backend service on http://localhost:8000"
Write-Host "Press Ctrl+C to stop the server"
& $pythonExe -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
