@echo off

REM 测试Python执行并将输出重定向到文件
python --version > test-output.txt 2>&1
python -c "print('Hello, World!')" >> test-output.txt 2>&1
python -c "import sys; print('Python路径:', sys.executable)" >> test-output.txt 2>&1

REM 显示输出文件内容
echo 输出文件内容:
type test-output.txt

REM 暂停
echo 按任意键继续...
pause
