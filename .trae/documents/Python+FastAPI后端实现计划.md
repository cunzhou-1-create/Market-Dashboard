# Python+FastAPI后端实现计划

## 项目结构设计

```
backend/
├── app/
│   ├── api/
│   │   ├── __init__.py
│   │   ├── auth.py         # 认证相关接口
│   │   ├── market.py       # 市场数据接口
│   │   ├── user.py         # 用户相关接口
│   │   ├── settings.py     # 设置相关接口
│   │   ├── alerts.py       # 价格预警接口
│   │   └── trade.py        # 交易相关接口
│   ├── models/
│   │   ├── __init__.py
│   │   ├── user.py         # 用户模型
│   │   ├── market.py       # 市场数据模型
│   │   ├── alert.py        # 价格预警模型
│   │   └── trade.py        # 交易模型
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── auth.py         # 认证相关DTO
│   │   ├── user.py         # 用户相关DTO
│   │   ├── market.py       # 市场数据DTO
│   │   ├── alert.py        # 价格预警DTO
│   │   └── trade.py        # 交易相关DTO
│   ├── services/
│   │   ├── __init__.py
│   │   ├── auth_service.py # 认证服务
│   │   ├── market_service.py # 市场数据服务
│   │   ├── alert_service.py # 价格预警服务
│   │   └── trade_service.py # 交易服务
│   ├── utils/
│   │   ├── __init__.py
│   │   ├── security.py     # 安全工具
│   │   ├── email.py        # 邮件工具
│   │   └── crypto.py       # 加密货币相关工具
│   ├── config.py           # 配置文件
│   └── database.py         # 数据库连接
├── main.py                 # 应用入口
├── requirements.txt        # 依赖管理
└── .env.example            # 环境变量示例
```

## 数据库设计

### 1. 用户表 (`users`)
- `id`: INTEGER PRIMARY KEY
- `email`: VARCHAR(255) UNIQUE NOT NULL
- `password_hash`: VARCHAR(255) NOT NULL
- `name`: VARCHAR(255)
- `avatar`: VARCHAR(255)
- `role`: VARCHAR(50) DEFAULT 'Trader'
- `tier`: VARCHAR(50) DEFAULT 'Basic Tier'
- `joined_at`: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
- `last_login`: TIMESTAMP
- `is_active`: BOOLEAN DEFAULT TRUE

### 2. 市场数据表 (`market_data`)
- `id`: INTEGER PRIMARY KEY
- `symbol`: VARCHAR(50) UNIQUE NOT NULL
- `name`: VARCHAR(255) NOT NULL
- `price`: DECIMAL(20, 8) NOT NULL
- `change`: DECIMAL(10, 2) NOT NULL
- `is_positive`: BOOLEAN NOT NULL
- `last_updated`: TIMESTAMP DEFAULT CURRENT_TIMESTAMP

### 3. 观察列表 (`watchlist`)
- `id`: INTEGER PRIMARY KEY
- `user_id`: INTEGER REFERENCES users(id)
- `symbol_id`: INTEGER REFERENCES market_data(id)
- `created_at`: TIMESTAMP DEFAULT CURRENT_TIMESTAMP

### 4. 价格预警表 (`price_alerts`)
- `id`: INTEGER PRIMARY KEY
- `user_id`: INTEGER REFERENCES users(id)
- `symbol_id`: INTEGER REFERENCES market_data(id)
- `condition`: VARCHAR(20) NOT NULL
- `threshold`: DECIMAL(20, 8) NOT NULL
- `frequency`: VARCHAR(50) NOT NULL
- `is_active`: BOOLEAN DEFAULT TRUE
- `created_at`: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
- `updated_at`: TIMESTAMP

### 5. 交易记录表 (`trade_records`)
- `id`: INTEGER PRIMARY KEY
- `user_id`: INTEGER REFERENCES users(id)
- `symbol`: VARCHAR(50) NOT NULL
- `side`: VARCHAR(10) NOT NULL
- `price`: DECIMAL(20, 8) NOT NULL
- `quantity`: DECIMAL(20, 8) NOT NULL
- `total`: DECIMAL(20, 8) NOT NULL
- `timestamp`: TIMESTAMP DEFAULT CURRENT_TIMESTAMP

### 6. API密钥表 (`api_keys`)
- `id`: INTEGER PRIMARY KEY
- `user_id`: INTEGER REFERENCES users(id)
- `provider`: VARCHAR(50) NOT NULL
- `api_key_hash`: VARCHAR(255) NOT NULL
- `is_connected`: BOOLEAN DEFAULT FALSE
- `created_at`: TIMESTAMP DEFAULT CURRENT_TIMESTAMP

## API接口设计

### 1. 认证接口
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/logout` - 用户登出
- `POST /api/auth/refresh` - 刷新令牌
- `POST /api/auth/verify-email` - 验证邮箱
- `POST /api/auth/resend-code` - 重发验证码

### 2. 市场数据接口
- `GET /api/market` - 获取市场数据列表
- `GET /api/market/{symbol}` - 获取单个币种详情
- `GET /api/market/technical/{symbol}` - 获取技术指标

### 3. 用户接口
- `GET /api/user/profile` - 获取用户信息
- `PUT /api/user/profile` - 更新用户信息
- `GET /api/user/watchlist` - 获取观察列表
- `POST /api/user/watchlist` - 添加到观察列表
- `DELETE /api/user/watchlist/{symbol}` - 从观察列表移除

### 4. 价格预警接口
- `GET /api/alerts` - 获取价格预警列表
- `POST /api/alerts` - 创建价格预警
- `PUT /api/alerts/{id}` - 更新价格预警
- `DELETE /api/alerts/{id}` - 删除价格预警
- `PUT /api/alerts/{id}/toggle` - 切换预警状态

### 5. 交易接口
- `GET /api/trade/history` - 获取交易记录
- `GET /api/trade/account` - 获取账户信息

### 6. 设置接口
- `GET /api/settings` - 获取用户设置
- `PUT /api/settings` - 更新用户设置
- `POST /api/settings/api-keys` - 添加API密钥
- `PUT /api/settings/api-keys/{id}` - 更新API密钥
- `DELETE /api/settings/api-keys/{id}` - 删除API密钥

## 业务逻辑实现

### 1. 用户认证
- 使用JWT进行身份验证
- 密码加密存储
- 邮箱验证码验证

### 2. 市场数据
- 模拟实时行情数据
- 技术指标计算
- 数据缓存策略

### 3. 价格预警
- 预警条件检查
- 邮件通知发送
- 预警状态管理

### 4. 交易功能
- 交易记录管理
- 账户余额计算
- 交易历史查询

### 5. 设置管理
- API密钥加密存储
- 用户偏好设置
- 通知设置管理

## 安全性考虑

### 1. 数据安全
- 使用HTTPS加密传输
- 敏感数据加密存储
- 输入验证和清理

### 2. 认证安全
- JWT令牌管理
- 密码强度要求
- 多因素认证支持

### 3. API安全
- 请求频率限制
- 权限控制
- CORS配置

### 4. 防止攻击
- SQL注入防护
- XSS攻击防护
- CSRF攻击防护

## 依赖管理

```
# requirements.txt
fastapi
uvicorn[standard]
sqlalchemy
psycopg2-binary
python-jose[cryptography]
python-multipart
email-validator
python-dotenv
passlib[bcrypt]
aiofiles

# 可选依赖
pandas
numpy
ccxt  # 加密货币交易库
```

## 部署计划

1. 本地开发环境设置
2. 数据库初始化
3. API测试
4. 前端集成
5. 部署到生产环境

## 实现步骤

1. 搭建项目结构
2. 配置数据库连接
3. 实现数据模型
4. 实现认证功能
5. 实现市场数据接口
6. 实现用户相关接口
7. 实现价格预警功能
8. 实现交易相关接口
9. 实现设置管理接口
10. 测试和优化