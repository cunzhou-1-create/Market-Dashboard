import sys
import os
from dotenv import load_dotenv

# 添加backend目录到Python路径
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

# 加载.env文件
load_dotenv(os.path.join(os.path.dirname(__file__), 'backend', '.env'))

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models.user import User

# 检查数据库中的用户信息
def check_users():
    print("检查数据库中的用户信息...")
    
    # 创建数据库引擎
    engine = create_engine('sqlite:///backend/test.db')
    
    # 创建会话
    Session = sessionmaker(bind=engine)
    session = Session()
    
    try:
        # 查询所有用户
        users = session.query(User).all()
        
        print(f"数据库中共有 {len(users)} 个用户")
        
        # 打印每个用户的信息
        for i, user in enumerate(users, 1):
            print(f"\n用户 {i}:")
            print(f"ID: {user.id}")
            print(f"邮箱: {user.email}")
            print(f"用户名: {user.name}")
            print(f"角色: {user.role}")
            print(f"等级: {user.tier}")
            print(f"是否活跃: {user.is_active}")
            print(f"最后登录时间: {user.last_login}")
            print(f"创建时间: {user.created_at}")
            print(f"更新时间: {user.updated_at}")
            
    except Exception as e:
        print(f"查询数据库失败: {str(e)}")
    finally:
        # 关闭会话
        session.close()

if __name__ == "__main__":
    check_users()
