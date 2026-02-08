import os

# 检查数据库文件是否存在
db_path = 'backend/test.db'
if os.path.exists(db_path):
    print(f"数据库文件存在: {db_path}")
    print(f"文件大小: {os.path.getsize(db_path)} 字节")
else:
    print(f"数据库文件不存在: {db_path}")

# 检查backend目录是否存在
backend_dir = 'backend'
if os.path.exists(backend_dir):
    print(f"backend目录存在")
    # 列出backend目录中的文件
    files = os.listdir(backend_dir)
    print("backend目录中的文件:")
    for file in files:
        if file.endswith('.db'):
            print(f"- {file} (数据库文件)")
        else:
            print(f"- {file}")
else:
    print(f"backend目录不存在")
