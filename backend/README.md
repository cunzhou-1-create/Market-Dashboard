# Crypto Booking Backend

使用 Python + FastAPI 实现的加密货币交易平台后端服务。

## 功能特性

- **用户认证**：注册、登录、邮箱验证、JWT令牌管理
- **市场数据**：实时行情、技术指标、观察列表
- **价格预警**：自定义价格预警、邮件通知
- **交易功能**：交易记录、账户信息、API密钥管理
- **设置管理**：用户偏好设置、邮件通知类型

## 技术栈

- Python 3.8+
- FastAPI
- SQLAlchemy
- SQLite / PostgreSQL
- JWT
- CCXT (加密货币交易库)

## 项目结构

```
backend/
├── app/
│   ├── api/            # API接口
│   ├── models/         # 数据库模型
│   ├── schemas/        # 数据验证和序列化
│   ├── services/       # 业务逻辑
│   ├── utils/          # 工具函数
│   ├── config.py       # 配置文件
│   └── database.py     # 数据库连接
├── main.py             # 应用入口
├── requirements.txt    # 依赖管理
├── .env                # 环境变量
└── start.sh            # 启动脚本
```

## 安装和运行

### 1. 克隆项目

```bash
git clone <repository-url>
cd backend
```

### 2. 安装依赖

```bash
pip install -r requirements.txt
```

### 3. 配置环境变量

复制 `.env.example` 文件为 `.env` 并填写相应的配置：

```bash
cp .env.example .env
```

### 4. 运行应用

```bash
# 使用启动脚本
./start.sh

# 或直接运行
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 5. 访问API文档

应用启动后，可以访问以下地址查看API文档：

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## API接口

### 认证接口
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/logout` - 用户登出
- `POST /api/auth/refresh` - 刷新令牌
- `POST /api/auth/verify-email` - 验证邮箱
- `POST /api/auth/resend-code` - 重发验证码

### 市场数据接口
- `GET /api/market` - 获取市场数据列表
- `GET /api/market/{symbol}` - 获取单个币种详情
- `GET /api/market/technical/{symbol}` - 获取技术指标
- `GET /api/market/watchlist/list` - 获取观察列表
- `POST /api/market/watchlist/add` - 添加到观察列表
- `DELETE /api/market/watchlist/remove/{symbol_id}` - 从观察列表移除

### 用户接口
- `GET /api/user/profile` - 获取用户个人资料
- `PUT /api/user/profile` - 更新用户个人资料
- `GET /api/user/stats` - 获取用户统计信息
- `GET /api/user/login-history` - 获取用户登录历史

### 价格预警接口
- `GET /api/alerts` - 获取价格预警列表
- `POST /api/alerts` - 创建价格预警
- `PUT /api/alerts/{alert_id}` - 更新价格预警
- `DELETE /api/alerts/{alert_id}` - 删除价格预警
- `PUT /api/alerts/{alert_id}/toggle` - 切换预警状态

### 交易接口
- `GET /api/trade/history` - 获取交易记录
- `POST /api/trade/create` - 创建交易记录
- `GET /api/trade/account` - 获取账户信息
- `GET /api/trade/api-keys` - 获取API密钥列表
- `POST /api/trade/api-keys` - 添加API密钥
- `DELETE /api/trade/api-keys/{api_key_id}` - 删除API密钥

### 设置接口
- `GET /api/settings` - 获取用户设置
- `PUT /api/settings` - 更新用户设置
- `PUT /api/settings/email-notifications` - 更新邮件通知类型
- `GET /api/settings/api-keys` - 获取API密钥列表
- `POST /api/settings/api-keys` - 添加API密钥
- `DELETE /api/settings/api-keys/{api_key_id}` - 删除API密钥

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

## 部署

### 开发环境

使用 `start.sh` 脚本启动开发服务器：

```bash
./start.sh
```

### 生产环境

1. 使用 Gunicorn + Uvicorn 作为WSGI服务器
2. 配置 Nginx 作为反向代理
3. 使用 PostgreSQL 作为数据库
4. 配置 HTTPS

## 许可证

MIT License
