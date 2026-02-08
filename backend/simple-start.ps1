# 切换到脚本所在目录
Set-Location -Path $PSScriptRoot

# 测试Python执行
Write-Host "测试Python执行..."
python --version

# 安装依赖
Write-Host "安装依赖..."
python -m pip install -r requirements.txt

# 启动后端服务
Write-Host "启动后端服务..."
python main.py
