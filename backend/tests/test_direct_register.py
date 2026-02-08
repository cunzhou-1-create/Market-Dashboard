from app.database import get_db
from app.schemas.auth import UserCreate
from app.services.auth_service import AuthService

# 直接测试AuthService.register方法
def test_direct_register():
    print("直接测试AuthService.register方法...")
    
    # 获取数据库会话
    db = next(get_db())
    
    # 创建用户数据
    user_data = UserCreate(
        email="extest@qq.com",
        password="Asd@123",
        code="123456"
    )
    
    print(f"用户数据：{user_data}")
    
    # 直接调用AuthService.register方法
    user = AuthService.register(db, user_data)
    
    print(f"AuthService.register返回值：{user}")
    
    if user:
        print(f"注册成功！用户ID：{user.id}")
        print(f"用户邮箱：{user.email}")
        print(f"用户名称：{user.name}")
    else:
        print("注册失败！")

if __name__ == "__main__":
    test_direct_register()
