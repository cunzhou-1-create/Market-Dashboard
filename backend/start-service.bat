@echo off

REM 切换到脚本所在目录
cd /d "%~dp0"

REM 清空日志文件
type nul > start-log.txt

REM 测试Python执行
echo 测试Python执行... >> start-log.txt
python --version >> start-log.txt 2>&1
if %errorlevel% neq 0 (
    echo Python执行失败 >> start-log.txt
    goto end
)

REM 安装依赖
echo 安装依赖... >> start-log.txt
python -m pip install -r requirements.txt >> start-log.txt 2>&1
if %errorlevel% neq 0 (
    echo 依赖安装失败 >> start-log.txt
    goto end
)

REM 启动后端服务
echo 启动后端服务... >> start-log.txt
python main.py >> start-log.txt 2>&1
if %errorlevel% neq 0 (
    echo 服务启动失败 >> start-log.txt
    goto end
)

echo 服务启动成功 >> start-log.txt

:end
REM 显示日志内容
echo 启动日志内容:
type start-log.txt

REM 暂停
echo 按任意键继续...
pause
