from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth, market, user, alerts, trade, settings
from app.config import settings as app_settings
from app.database import engine, Base

# 创建数据库表
Base.metadata.create_all(bind=engine)

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

# 注册路由
app.include_router(auth.router, prefix=f"{app_settings.API_V1_STR}/auth", tags=["auth"])
app.include_router(market.router, prefix=f"{app_settings.API_V1_STR}/market", tags=["market"])
app.include_router(user.router, prefix=f"{app_settings.API_V1_STR}/user", tags=["user"])
app.include_router(alerts.router, prefix=f"{app_settings.API_V1_STR}/alerts", tags=["alerts"])
app.include_router(trade.router, prefix=f"{app_settings.API_V1_STR}/trade", tags=["trade"])
app.include_router(settings.router, prefix=f"{app_settings.API_V1_STR}/settings", tags=["settings"])

# 根路径
@app.get("/")
def read_root():
    return {"message": "Welcome to Crypto Booking API"}

# 健康检查
@app.get("/health")
def health_check():
    return {"status": "healthy"}