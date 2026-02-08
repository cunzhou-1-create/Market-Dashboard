from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Dict
from pydantic import BaseModel, Field, validator
from app.database import get_db
from app.api.auth import get_current_user
from app.models.user import User
from app.services.chain_event_service import get_chain_event_monitor

router = APIRouter()

# 链上事件提醒数据模型
class ChainEventAlertBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=100, description="提醒标题")
    description: str = Field(..., min_length=1, max_length=500, description="提醒描述")
    event_type: str = Field(..., description="事件类型")
    threshold: str = Field(..., description="阈值")
    chain: str = Field(..., description="区块链")
    notification_channels: Dict[str, bool] = Field(..., description="通知渠道")
    telegram_chat_id: str = Field(default="", description="Telegram Chat ID")
    webhook_url: str = Field(default="", description="Webhook URL")
    
    @validator('event_type')
    def validate_event_type(cls, v):
        valid_event_types = ['large_transfer', 'exchange_inflow']
        if v not in valid_event_types:
            raise ValueError(f"事件类型必须是以下之一: {', '.join(valid_event_types)}")
        return v
    
    @validator('chain')
    def validate_chain(cls, v):
        valid_chains = ['ethereum', 'bitcoin', 'binance_smart_chain']
        if v not in valid_chains:
            raise ValueError(f"区块链必须是以下之一: {', '.join(valid_chains)}")
        return v
    
    @validator('notification_channels')
    def validate_notification_channels(cls, v):
        required_channels = ['email', 'telegram', 'webhook']
        for channel in required_channels:
            if channel not in v:
                raise ValueError(f"通知渠道必须包含 {channel}")
        if not v.get('email'):
            raise ValueError("邮件通知必须开启")
        return v
    
    @validator('telegram_chat_id')
    def validate_telegram_chat_id(cls, v, values):
        if values.get('notification_channels', {}).get('telegram') and not v:
            raise ValueError("当启用Telegram通知时，必须提供Telegram Chat ID")
        return v
    
    @validator('webhook_url')
    def validate_webhook_url(cls, v, values):
        if values.get('notification_channels', {}).get('webhook') and not v:
            raise ValueError("当启用Webhook通知时，必须提供Webhook URL")
        return v

class ChainEventAlertCreate(ChainEventAlertBase):
    pass

class ChainEventAlertUpdate(BaseModel):
    title: str = Field(None, min_length=1, max_length=100, description="提醒标题")
    description: str = Field(None, min_length=1, max_length=500, description="提醒描述")
    event_type: str = Field(None, description="事件类型")
    threshold: str = Field(None, description="阈值")
    chain: str = Field(None, description="区块链")
    notification_channels: Dict[str, bool] = Field(None, description="通知渠道")
    telegram_chat_id: str = Field(default="", description="Telegram Chat ID")
    webhook_url: str = Field(default="", description="Webhook URL")
    status: str = Field(None, description="状态")
    
    @validator('event_type')
    def validate_event_type(cls, v):
        if v is not None:
            valid_event_types = ['large_transfer', 'exchange_inflow']
            if v not in valid_event_types:
                raise ValueError(f"事件类型必须是以下之一: {', '.join(valid_event_types)}")
        return v
    
    @validator('chain')
    def validate_chain(cls, v):
        if v is not None:
            valid_chains = ['ethereum', 'bitcoin', 'binance_smart_chain']
            if v not in valid_chains:
                raise ValueError(f"区块链必须是以下之一: {', '.join(valid_chains)}")
        return v
    
    @validator('notification_channels')
    def validate_notification_channels(cls, v):
        if v is not None:
            required_channels = ['email', 'telegram', 'webhook']
            for channel in required_channels:
                if channel not in v:
                    raise ValueError(f"通知渠道必须包含 {channel}")
            if not v.get('email'):
                raise ValueError("邮件通知必须开启")
        return v


# 获取任务列表
@router.get("", response_model=List[Dict])
def get_tasks(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    status_filter: str = Query(None, description="任务状态筛选，例如 pending, in_progress, completed"),
    priority: str = Query(None, description="任务优先级筛选，例如 low, medium, high"),
    db: Session = Depends(get_db)
):
    """获取任务列表
    
    - **skip**: 跳过的记录数
    - **limit**: 返回的记录数
    - **status_filter**: 可选的任务状态筛选
    - **priority**: 可选的任务优先级筛选
    """
    # 模拟任务数据
    # 实际项目中应该从数据库获取
    mock_tasks = [
        {
            "id": 1,
            "title": "完成API密钥设置",
            "description": "在设置页面添加并验证交易所API密钥",
            "status": "pending",
            "priority": "high",
            "due_date": "2024-01-15T23:59:59Z",
            "created_at": "2024-01-01T10:00:00Z",
            "updated_at": "2024-01-01T10:00:00Z",
            "category": "account_setup"
        },
        {
            "id": 2,
            "title": "设置价格预警",
            "description": "为BTC/USDT设置价格预警，当价格突破45000美元时提醒",
            "status": "in_progress",
            "priority": "medium",
            "due_date": "2024-01-10T23:59:59Z",
            "created_at": "2024-01-01T11:00:00Z",
            "updated_at": "2024-01-02T14:30:00Z",
            "category": "market_alert"
        },
        {
            "id": 3,
            "title": "查看AI交易信号",
            "description": "检查最新的AI交易信号并评估交易机会",
            "status": "completed",
            "priority": "low",
            "due_date": "2024-01-05T23:59:59Z",
            "created_at": "2024-01-01T12:00:00Z",
            "updated_at": "2024-01-03T09:15:00Z",
            "category": "ai_trading"
        },
        {
            "id": 4,
            "title": "更新个人资料",
            "description": "完善个人资料信息并上传头像",
            "status": "pending",
            "priority": "medium",
            "due_date": "2024-01-20T23:59:59Z",
            "created_at": "2024-01-01T13:00:00Z",
            "updated_at": "2024-01-01T13:00:00Z",
            "category": "profile"
        }
    ]
    
    # 应用筛选条件
    filtered_tasks = mock_tasks
    if status_filter:
        filtered_tasks = [task for task in filtered_tasks if task.get('status') == status_filter]
    if priority:
        filtered_tasks = [task for task in filtered_tasks if task.get('priority') == priority]
    
    # 应用分页
    paginated_tasks = filtered_tasks[skip:skip+limit]
    
    return paginated_tasks


# 获取任务统计
@router.get("/stats/summary", response_model=Dict)
def get_task_stats(
    db: Session = Depends(get_db)
):
    """获取任务统计摘要
    """
    # 模拟任务统计数据
    mock_stats = {
        "total_tasks": 4,
        "tasks_by_status": {
            "pending": 2,
            "in_progress": 1,
            "completed": 1
        },
        "tasks_by_priority": {
            "low": 1,
            "medium": 2,
            "high": 1
        },
        "tasks_by_category": {
            "account_setup": 1,
            "market_alert": 1,
            "ai_trading": 1,
            "profile": 1
        },
        "overdue_tasks": 0,
        "completed_tasks_percentage": 25,
        "next_due_task": {
            "id": 3,
            "title": "查看AI交易信号",
            "due_date": "2024-01-05T23:59:59Z"
        }
    }
    
    return mock_stats


# 创建链上事件提醒
@router.post("/chain-event-alerts", response_model=Dict)
def create_chain_event_alert(
    alert_data: ChainEventAlertCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """创建链上事件提醒
    
    - **alert_data**: 链上事件提醒数据
    """
    # 模拟创建链上事件提醒
    # 实际项目中应该保存到数据库
    title = alert_data.title
    description = alert_data.description
    event_type = alert_data.event_type
    threshold = alert_data.threshold
    chain = alert_data.chain
    notification_channels = alert_data.notification_channels
    telegram_chat_id = alert_data.telegram_chat_id
    webhook_url = alert_data.webhook_url
    
    # 将提醒添加到监控服务
    chain_event_monitor = get_chain_event_monitor()
    alert_dict = {
        "id": 1,  # 实际项目中应该从数据库获取
        "title": title,
        "description": description,
        "event_type": event_type,
        "threshold": threshold,
        "chain": chain,
        "notification_channels": notification_channels,
        "telegram_chat_id": telegram_chat_id,
        "webhook_url": webhook_url,
        "status": "active",
        "user_id": current_user.id,
        "email": current_user.email  # 从用户对象获取邮箱
    }
    chain_event_monitor.add_alert(alert_dict)
    
    mock_created_alert = {
        "id": 1,
        "title": title,
        "description": description,
        "event_type": event_type,
        "threshold": threshold,
        "chain": chain,
        "notification_channels": notification_channels,
        "telegram_chat_id": telegram_chat_id,
        "webhook_url": webhook_url,
        "status": "active",
        "created_at": "2024-01-01T10:00:00Z",
        "updated_at": "2024-01-01T10:00:00Z",
        "user_id": current_user.id
    }
    
    return mock_created_alert


# 获取链上事件提醒列表
@router.get("/chain-event-alerts", response_model=List[Dict])
def get_chain_event_alerts(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    status: str = Query(None, description="提醒状态筛选，例如 active, paused"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """获取链上事件提醒列表
    
    - **skip**: 跳过的记录数
    - **limit**: 返回的记录数
    - **status**: 可选的提醒状态筛选
    """
    # 模拟链上事件提醒数据
    # 实际项目中应该从数据库获取
    mock_alerts = [
        {
            "id": 1,
            "title": "大额ETH转账提醒",
            "description": "当ETH转账金额超过10000时提醒",
            "event_type": "large_transfer",
            "threshold": "10000",
            "chain": "ethereum",
            "notification_channels": {
                "email": True,
                "telegram": False,
                "webhook": False
            },
            "status": "active",
            "created_at": "2024-01-01T10:00:00Z",
            "updated_at": "2024-01-01T10:00:00Z",
            "user_id": current_user.id
        },
        {
            "id": 2,
            "title": "交易所BTC净流入提醒",
            "description": "当交易所BTC净流入超过5000时提醒",
            "event_type": "exchange_inflow",
            "threshold": "5000",
            "chain": "bitcoin",
            "notification_channels": {
                "email": True,
                "telegram": True,
                "webhook": False
            },
            "telegram_chat_id": "123456789",
            "status": "active",
            "created_at": "2024-01-01T11:00:00Z",
            "updated_at": "2024-01-01T11:00:00Z",
            "user_id": current_user.id
        }
    ]
    
    # 应用筛选条件
    filtered_alerts = mock_alerts
    if status:
        filtered_alerts = [alert for alert in filtered_alerts if alert.get('status') == status]
    
    # 应用分页
    paginated_alerts = filtered_alerts[skip:skip+limit]
    
    return paginated_alerts


# 更新链上事件提醒
@router.put("/chain-event-alerts/{alert_id}", response_model=Dict)
def update_chain_event_alert(
    alert_id: int,
    alert_data: ChainEventAlertUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """更新链上事件提醒
    
    - **alert_id**: 链上事件提醒ID
    - **alert_data**: 链上事件提醒数据
    """
    # 模拟更新链上事件提醒
    # 实际项目中应该更新数据库中的提醒
    updated_fields = alert_data.dict(exclude_unset=True)
    
    # 更新监控服务中的提醒
    chain_event_monitor = get_chain_event_monitor()
    chain_event_monitor.update_alert(alert_id, updated_fields)
    
    mock_updated_alert = {
        "id": alert_id,
        "title": alert_data.title or "大额ETH转账提醒",
        "description": alert_data.description or "当ETH转账金额超过10000时提醒",
        "event_type": alert_data.event_type or "large_transfer",
        "threshold": alert_data.threshold or "10000",
        "chain": alert_data.chain or "ethereum",
        "notification_channels": alert_data.notification_channels or {
            'email': True,
            'telegram': False,
            'webhook': False
        },
        "telegram_chat_id": alert_data.telegram_chat_id,
        "webhook_url": alert_data.webhook_url,
        "status": alert_data.status or "active",
        "created_at": "2024-01-01T10:00:00Z",
        "updated_at": "2024-01-01T12:00:00Z",
        "user_id": current_user.id,
        "updated_fields": updated_fields,
        "message": "链上事件提醒更新成功"
    }
    
    return mock_updated_alert


# 删除链上事件提醒
@router.delete("/chain-event-alerts/{alert_id}", response_model=Dict)
def delete_chain_event_alert(
    alert_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """删除链上事件提醒
    
    - **alert_id**: 链上事件提醒ID
    """
    # 从监控服务中移除提醒
    chain_event_monitor = get_chain_event_monitor()
    chain_event_monitor.remove_alert(alert_id)
    
    # 模拟删除链上事件提醒
    # 实际项目中应该从数据库删除提醒
    return {
        "id": alert_id,
        "message": "链上事件提醒删除成功"
    }


# 切换链上事件提醒状态
@router.put("/chain-event-alerts/{alert_id}/toggle", response_model=Dict)
def toggle_chain_event_alert(
    alert_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """切换链上事件提醒状态
    
    - **alert_id**: 链上事件提醒ID
    """
    # 模拟切换链上事件提醒状态
    # 实际项目中应该更新数据库中的状态
    mock_toggled_alert = {
        "id": alert_id,
        "status": "paused",  # 假设从active切换到paused
        "message": "链上事件提醒状态切换成功"
    }
    
    # 更新监控服务中的提醒状态
    chain_event_monitor = get_chain_event_monitor()
    chain_event_monitor.update_alert(alert_id, {"status": "paused"})
    
    return mock_toggled_alert


# 获取任务详情
@router.get("/{task_id}", response_model=Dict)
def get_task_detail(
    task_id: int,
    db: Session = Depends(get_db)
):
    """获取任务详情
    
    - **task_id**: 任务ID
    """
    # 模拟任务详情数据
    mock_task_detail = {
        "id": task_id,
        "title": "完成API密钥设置",
        "description": "在设置页面添加并验证交易所API密钥",
        "status": "pending",
        "priority": "high",
        "due_date": "2024-01-15T23:59:59Z",
        "created_at": "2024-01-01T10:00:00Z",
        "updated_at": "2024-01-01T10:00:00Z",
        "category": "account_setup",
        "subtasks": [
            {
                "id": 1,
                "title": "选择交易所",
                "status": "completed",
                "completed_at": "2024-01-02T10:30:00Z"
            },
            {
                "id": 2,
                "title": "生成API密钥",
                "status": "pending",
                "completed_at": None
            },
            {
                "id": 3,
                "title": "输入API密钥",
                "status": "pending",
                "completed_at": None
            },
            {
                "id": 4,
                "title": "验证API连接",
                "status": "pending",
                "completed_at": None
            }
        ],
        "notes": "请确保API密钥具有交易权限，但不要设置提款权限以保证安全。",
        "progress": 25
    }
    
    return mock_task_detail


# 创建任务
@router.post("")
def create_task(
    task_data: dict,
    db: Session = Depends(get_db)
):
    """创建新任务
    
    - **task_data**: 任务数据对象
    """
    # 模拟创建任务
    # 实际项目中应该保存到数据库
    title = task_data.get('title', '')
    description = task_data.get('description', '')
    priority = task_data.get('priority', 'medium')
    due_date = task_data.get('due_date')
    category = task_data.get('category', 'general')
    
    mock_created_task = {
        "id": 5,
        "title": title,
        "description": description,
        "status": "pending",
        "priority": priority,
        "due_date": due_date,
        "created_at": "2024-01-04T10:00:00Z",
        "updated_at": "2024-01-04T10:00:00Z",
        "category": category,
        "message": "任务创建成功"
    }
    
    return mock_created_task


# 更新任务
@router.put("/{task_id}", response_model=Dict)
def update_task(
    task_id: int,
    task_data: dict,
    db: Session = Depends(get_db)
):
    """更新任务
    
    - **task_id**: 任务ID
    - **task_data**: 任务数据对象 (可选字段)
    """
    # 模拟更新任务
    # 实际项目中应该更新数据库中的任务
    updated_fields = task_data
    
    mock_updated_task = {
        "id": task_id,
        "title": task_data.get('title', "完成API密钥设置"),
        "description": task_data.get('description', "在设置页面添加并验证交易所API密钥"),
        "status": task_data.get('status', "pending"),
        "priority": task_data.get('priority', "high"),
        "due_date": task_data.get('due_date', "2024-01-15T23:59:59Z"),
        "created_at": "2024-01-01T10:00:00Z",
        "updated_at": "2024-01-04T11:00:00Z",
        "category": task_data.get('category', "account_setup"),
        "updated_fields": updated_fields,
        "message": "任务更新成功"
    }
    
    return mock_updated_task


# 删除任务
@router.delete("/{task_id}", response_model=Dict)
def delete_task(
    task_id: int,
    db: Session = Depends(get_db)
):
    """删除任务
    
    - **task_id**: 任务ID
    """
    # 模拟删除任务
    # 实际项目中应该从数据库删除任务
    return {
        "id": task_id,
        "message": "任务删除成功"
    }
