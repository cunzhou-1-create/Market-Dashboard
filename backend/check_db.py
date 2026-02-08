import os

# 检查数据库文件是否存在
db_path = 'test.db'
if os.path.exists(db_path):
    print(f"数据库文件存在: {db_path}")
    print(f"文件大小: {os.path.getsize(db_path)} 字节")
else:
    print(f"数据库文件不存在: {db_path}")

# 列出当前目录中的文件
print("当前目录中的文件:")
files = os.listdir('.')
for file in files:
    if file.endswith('.db'):
        print(f"- {file} (数据库文件)")
    else:
        print(f"- {file}")
