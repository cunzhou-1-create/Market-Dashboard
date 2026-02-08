import sqlite3
import datetime

def query_login_data():
    """查询用户登录数据"""
    # 连接到SQLite数据库
    conn = sqlite3.connect('test.db')
    cursor = conn.cursor()
    
    try:
        # 查询users表中的所有记录，包括登录相关信息
        cursor.execute('''
            SELECT id, email, name, last_login, joined_at, role, tier, is_active 
            FROM users 
            ORDER BY last_login DESC
        ''')
        
        users = cursor.fetchall()
        
        print("=== 用户登录数据 ===")
        print(f"总用户数: {len(users)}")
        print("-" * 80)
        
        if users:
            for user in users:
                id, email, name, last_login, joined_at, role, tier, is_active = user
                
                # 格式化时间
                last_login_str = "从未登录" if last_login is None else last_login
                joined_at_str = joined_at
                
                print(f"ID: {id}")
                print(f"邮箱: {email}")
                print(f"姓名: {name}")
                print(f"最后登录时间: {last_login_str}")
                print(f"注册时间: {joined_at_str}")
                print(f"角色: {role}")
                print(f"等级: {tier}")
                print(f"状态: {'活跃' if is_active else '非活跃'}")
                print("-" * 80)
        else:
            print("数据库中没有用户记录")
            
    except Exception as e:
        print(f"查询失败: {str(e)}")
    finally:
        # 关闭数据库连接
        conn.close()

if __name__ == "__main__":
    query_login_data()
