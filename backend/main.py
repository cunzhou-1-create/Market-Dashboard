from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
from app.api import auth, market, user, alerts, trade, settings, upload
from app.config import settings as app_settings
from app.database import engine, Base

# 创建数据库表
Base.metadata.create_all(bind=engine)

# 创建上传目录
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(os.path.join(UPLOAD_DIR, "images"), exist_ok=True)

# 创建FastAPI应用
app = FastAPI(
    title=app_settings.PROJECT_NAME,
    openapi_url=f"{app_settings.API_V1_STR}/openapi.json"
)

# 配置CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 在生产环境中应该设置具体的域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 根路径
@app.get("/")
def read_root():
    return {"message": "Welcome to Crypto Booking API"}

# 健康检查
@app.get("/health")
def health_check():
    return {"status": "healthy"}

# 注册路由
app.include_router(auth.router, prefix=f"{app_settings.API_V1_STR}/auth", tags=["auth"])
app.include_router(market.router, prefix=f"{app_settings.API_V1_STR}/market", tags=["market"])
app.include_router(user.router, prefix=f"{app_settings.API_V1_STR}/user", tags=["user"])
app.include_router(alerts.router, prefix=f"{app_settings.API_V1_STR}/alerts", tags=["alerts"])
app.include_router(trade.router, prefix=f"{app_settings.API_V1_STR}/trade", tags=["trade"])
app.include_router(settings.router, prefix=f"{app_settings.API_V1_STR}/settings", tags=["settings"])
app.include_router(upload.router, prefix=f"{app_settings.API_V1_STR}/upload", tags=["upload"])

# 配置静态文件服务
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# 配置前端静态文件服务（作为兜底路由）
FRONTEND_DIR = "dist"
if os.path.exists(FRONTEND_DIR):
    app.mount("/", StaticFiles(directory=FRONTEND_DIR, html=True), name="frontend")

# 启动AI交易调度器
from app.services import start_ai_trade_scheduler

print("启动AI交易调度器...")
start_ai_trade_scheduler()