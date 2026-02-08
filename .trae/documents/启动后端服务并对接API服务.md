# 启动后端服务并对接API服务计划

## 问题分析
- 前端API基础URL设置为 `http://localhost:8000/api/v1`
- 后端API配置中 `API_V1_STR` 设置为 `/api`
- 这导致路径不匹配，前端会请求 `/api/v1/auth/login`，但后端实际路由是 `/api/auth/login`

## 解决方案

### 步骤1：修复API路径匹配问题
- 修改前端 `src/services/api.js` 文件，将 API 基础URL从 `http://localhost:8000/api/v1` 改为 `http://localhost:8000/api`

### 步骤2：启动后端服务
1. 进入后端目录 `backend`
2. 检查并安装依赖：`pip install -r requirements.txt`
3. 运行启动脚本：`start-backend.bat`（Windows）或 `start.sh`（Linux/Mac）
4. 验证后端服务是否正常运行：访问 `http://localhost:8000/health`

### 步骤3：验证API服务对接
1. 启动前端开发服务器（如果需要）
2. 测试API接口：
   - 访问 `http://localhost:8000/docs` 查看API文档
   - 测试认证接口：`POST /api/auth/register` 和 `POST /api/auth/login`
   - 测试市场数据接口：`GET /api/market`

### 步骤4：故障排除
- 如果后端启动失败，检查端口是否被占用
- 如果API调用失败，检查网络连接和跨域配置
- 如果数据库连接失败，检查 `.env` 文件中的数据库配置

## 预期结果
- 后端服务成功启动并运行在 `http://localhost:8000`
- 前端能够正常调用后端API接口
- 所有API端点能够正常响应请求