import sqlite3
import os

# 连接数据库
db_path = 'test.db'
try:
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # 检查用户表是否存在
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='users';")
    result = cursor.fetchone()
    
    if result:
        print("用户表存在")
        
        # 查询所有用户
        cursor.execute("SELECT id, email, name, created_at FROM users;")
        users = cursor.fetchall()
        
        print(f"\n现有用户数量: {len(users)}")
        if users:
            print("\n用户列表:")
            for user in users:
                print(f"ID: {user[0]}, Email: {user[1]}, Name: {user[2]}, Created: {user[3]}")
        else:
            print("\n用户表为空")
    else:
        print("用户表不存在")
    
    conn.close()
except Exception as e:
    print(f"数据库操作失败: {e}")
