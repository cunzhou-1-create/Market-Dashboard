# 设置执行策略
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process -Force

# 切换到脚本所在目录
Set-Location -Path $PSScriptRoot

# 清空日志文件
$logFile = "start-log.txt"
if (Test-Path $logFile) {
    Remove-Item $logFile -Force
}

# 写入日志的函数
function Write-Log {
    param (
        [string]$Message
    )
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logEntry = "[$timestamp] $Message"
    Write-Host $logEntry
    Add-Content -Path $logFile -Value $logEntry
}

# 测试Python执行
Write-Log "测试Python执行..."
try {
    $pythonVersion = & python --version 2>&1
    Write-Log "Python版本: $pythonVersion"
} catch {
    Write-Log "Python执行失败: $($_.Exception.Message)"
    exit 1
}

# 安装依赖
Write-Log "安装依赖..."
try {
    $installResult = & python -m pip install -r requirements.txt 2>&1
    Write-Log "依赖安装完成"
} catch {
    Write-Log "依赖安装失败: $($_.Exception.Message)"
    exit 1
}

# 启动后端服务
Write-Log "启动后端服务..."
try {
    # 使用Start-Process启动服务，这样可以在后台运行
    $process = Start-Process -FilePath "python" -ArgumentList "main.py" -NoNewWindow -PassThru
    Write-Log "服务启动中，PID: $($process.Id)"
    
    # 等待服务启动
    Start-Sleep -Seconds 5
    
    # 检查服务是否在运行
    if (Get-Process -Id $process.Id -ErrorAction SilentlyContinue) {
        Write-Log "服务启动成功，正在运行"
        # 停止服务（仅用于测试）
        $process.Kill()
        Write-Log "服务已停止（测试模式）"
    } else {
        Write-Log "服务启动失败，进程已退出"
    }
} catch {
    Write-Log "服务启动失败: $($_.Exception.Message)"
    exit 1
}

Write-Log "启动过程完成"

# 显示日志内容
Write-Host "\n启动日志内容:"
Get-Content $logFile

# 等待用户输入
Write-Host "\n按任意键继续..."
$null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')
