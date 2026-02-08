import sqlite3
import os

# 检查数据库文件是否存在
db_path = 'backend/test.db'
if os.path.exists(db_path):
    print(f"数据库文件存在: {db_path}")
else:
    print(f"数据库文件不存在: {db_path}")

# 尝试连接数据库
try:
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # 检查用户表是否存在
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='users';")
    result = cursor.fetchone()
    
    if result:
        print("用户表存在")
        
        # 检查表结构
        cursor.execute("PRAGMA table_info(users);")
        columns = cursor.fetchall()
        print("用户表结构:")
        for column in columns:
            print(f"- {column[1]} ({column[2]})")
        
        # 检查现有用户
        cursor.execute("SELECT COUNT(*) FROM users;")
        count = cursor.fetchone()[0]
        print(f"现有用户数量: {count}")
    else:
        print("用户表不存在")
    
    conn.close()
except Exception as e:
    print(f"数据库操作失败: {e}")
