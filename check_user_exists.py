from app.database import get_db
from app.models.user import User

# 检查用户是否存在
def check_user_exists():
    db = next(get_db())
    user = db.query(User).filter(User.email == 'extest@qq.com').first()
    print('用户存在:', user is not None)
    if user:
        print('用户信息:', user.email)
        print('用户ID:', user.id)
    else:
        print('用户信息: None')

if __name__ == '__main__':
    check_user_exists()
