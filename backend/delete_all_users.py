import sqlite3

def delete_all_users():
    """删除所有用户信息"""
    # 连接到SQLite数据库
    conn = sqlite3.connect('test.db')
    cursor = conn.cursor()
    
    try:
        # 先查询当前用户数量
        cursor.execute('SELECT COUNT(*) FROM users')
        current_count = cursor.fetchone()[0]
        
        print(f"当前用户数量: {current_count}")
        
        if current_count > 0:
            # 删除所有用户记录
            cursor.execute('DELETE FROM users')
            conn.commit()
            
            # 验证删除结果
            cursor.execute('SELECT COUNT(*) FROM users')
            new_count = cursor.fetchone()[0]
            
            print(f"删除前用户数量: {current_count}")
            print(f"删除后用户数量: {new_count}")
            print(f"成功删除 {current_count} 个用户")
        else:
            print("数据库中没有用户记录，无需删除")
            
    except Exception as e:
        print(f"删除失败: {str(e)}")
        conn.rollback()
    finally:
        # 关闭数据库连接
        conn.close()

if __name__ == "__main__":
    delete_all_users()
