import axios from 'axios';

// API基础URL
const API_BASE_URL = 'http://localhost:8000/api';

// 创建axios实例
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 请求超时时间
});

// 请求拦截器 - 添加认证token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 添加token刷新逻辑
let isRefreshing = false;
let refreshSubscribers = [];

// 响应拦截器 - 统一处理错误和token刷新
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // 处理401错误（token过期）
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // 正在刷新token，将请求加入队列
        return new Promise((resolve) => {
          refreshSubscribers.push((token) => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            resolve(apiClient(originalRequest));
          });
        });
      }
      
      originalRequest._retry = true;
      isRefreshing = true;
      
      try {
        // 调用刷新token接口
        const response = await apiClient.post('/auth/refresh');
        const newToken = response.access_token;
        
        // 存储新token
        localStorage.setItem('token', newToken);
        
        // 更新请求头
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        
        // 执行队列中的请求
        refreshSubscribers.forEach((callback) => callback(newToken));
        refreshSubscribers = [];
        
        // 重试原始请求
        return apiClient(originalRequest);
      } catch (refreshError) {
        // 刷新token失败，跳转到登录页
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        if (window.location.pathname !== '/auth') {
          window.location.href = '/auth';
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    
    // 统一错误处理
    let errorMessage = '请求失败，请稍后重试';
    
    if (error.response) {
      // 服务器返回错误状态码
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          errorMessage = data.detail || '请求参数错误';
          break;
        case 401:
          errorMessage = '认证失败，请重新登录';
          // 清除token，跳转到登录页
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          // 跳转到登录页
          if (window.location.pathname !== '/auth') {
            window.location.href = '/auth';
          }
          break;
        case 403:
          errorMessage = '权限不足';
          break;
        case 404:
          errorMessage = '请求的资源不存在';
          break;
        case 500:
          errorMessage = '服务器内部错误';
          break;
        default:
          errorMessage = data.detail || `请求失败，状态码: ${status}`;
      }
    } else if (error.request) {
      // 请求已发送但没有收到响应
      errorMessage = '网络错误，请检查网络连接';
    }
    
    console.error('API Error:', errorMessage);
    return Promise.reject(new Error(errorMessage));
  }
);

// 认证相关API
const authAPI = {
  // 登录
  login: (email, password) => {
    return apiClient.post('/auth/login', { email, password });
  },
  
  // 注册
  register: (email, password, code) => {
    return apiClient.post('/auth/register', { email, password, code });
  },
  
  // 验证邮箱
  verifyEmail: (email, code) => {
    return apiClient.post('/auth/verify-email', { email, code });
  },
  
  // 重发验证码
  resendCode: (email) => {
    return apiClient.post('/auth/resend-code', { email });
  },
  
  // 获取当前用户信息
  getCurrentUser: () => {
    return apiClient.get('/auth/me');
  },
  
  // 刷新token
  refreshToken: () => {
    return apiClient.post('/auth/refresh');
  },
};

// 市场数据相关API
const marketAPI = {
  // 获取市场数据列表
  getMarketList: (skip = 0, limit = 100) => {
    return apiClient.get('/market', { params: { skip, limit } });
  },
  
  // 获取现货市场数据
  getSpotMarketData: (skip = 0, limit = 100) => {
    return apiClient.get('/market', { params: { skip, limit } });
  },
  
  // 获取单个币种数据
  getSymbolDetail: (symbol) => {
    return apiClient.get('/market/symbol', { params: { symbol } });
  },
  
  // 获取技术指标
  getTechnicalIndicators: (symbol) => {
    return apiClient.get('/market/technical', { params: { symbol } });
  },
  
  // 获取观察列表
  getWatchlist: () => {
    return apiClient.get('/market/watchlist/list');
  },
  
  // 添加到观察列表
  addToWatchlist: (symbolId) => {
    return apiClient.post('/market/watchlist/add', { symbol_id: symbolId });
  },
  
  // 从观察列表移除
  removeFromWatchlist: (symbolId) => {
    return apiClient.delete(`/market/watchlist/remove/${symbolId}`);
  },
  
  // 获取期货市场数据列表
  getFuturesMarketList: (skip = 0, limit = 100) => {
    return apiClient.get('/market/futures', { params: { skip, limit } });
  },
  
  // 保存AI订阅设置
  saveAiSubscriptionSettings: (settingsData) => {
    return apiClient.post('/market/ai-subscription/settings', settingsData);
  },
  
  // 获取K线数据
  getKlinesData: (symbol, interval = '30m', limit = 100) => {
    return apiClient.get('/market/klines', { params: { symbol, interval, limit } });
  },
};

// 用户相关API
const userAPI = {
  // 获取用户个人资料
  getProfile: () => {
    return apiClient.get('/user/profile');
  },
  
  // 更新用户个人资料
  updateProfile: (name, avatar) => {
    return apiClient.put('/user/profile', { name, avatar });
  },
  
  // 上传头像
  uploadAvatar: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post('/user/profile/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  // 获取用户统计信息
  getStats: () => {
    return apiClient.get('/user/stats');
  },
  
  // 获取登录历史
  getLoginHistory: () => {
    return apiClient.get('/user/login-history');
  },
};

// 价格预警相关API
const alertsAPI = {
  // 获取价格预警列表
  getAlerts: () => {
    return apiClient.get('/alerts');
  },
  
  // 创建价格预警
  createAlert: (alertData) => {
    return apiClient.post('/alerts', alertData);
  },
  
  // 更新价格预警
  updateAlert: (alertId, alertData) => {
    return apiClient.put(`/alerts/${alertId}`, alertData);
  },
  
  // 删除价格预警
  deleteAlert: (alertId) => {
    return apiClient.delete(`/alerts/${alertId}`);
  },
  
  // 切换价格预警状态
  toggleAlert: (alertId) => {
    return apiClient.put(`/alerts/${alertId}/toggle`);
  },
};

// 交易相关API
const tradeAPI = {
  // 获取交易历史记录
  getTradeHistory: () => {
    return apiClient.get('/trade/history');
  },
  
  // 执行模拟交易
  executeTrade: (tradeData) => {
    return apiClient.post('/trade/create', tradeData);
  },
  
  // 获取账户信息
  getAccountInfo: () => {
    return apiClient.get('/trade/account');
  },
  
  // 获取指定交易员的账户信息
  getTraderAccountInfo: (traderId) => {
    return apiClient.get(`/trade/account/${traderId}`);
  },
  
  // 获取AI交易信号列表
  getAiTradeSignals: () => {
    return apiClient.get('/trade/ai/signals');
  },
  
  // 获取AI交易调度器状态
  getAiSchedulerStatus: () => {
    return apiClient.get('/trade/ai/scheduler/status');
  },
  
  // 启动AI交易调度器
  startAiScheduler: () => {
    return apiClient.post('/trade/ai/scheduler/start');
  },
  
  // 停止AI交易调度器
  stopAiScheduler: () => {
    return apiClient.post('/trade/ai/scheduler/stop');
  },
  
  // 获取市场分析
  getMarketAnalysis: () => {
    return apiClient.get('/trade/ai/market-analysis');
  },
  
  // 手动触发AI交易
  triggerAiTrade: () => {
    return apiClient.post('/trade/ai/trigger');
  },
  
  // 模拟交易员管理
  createSimulatedTrader: (traderData) => {
    return apiClient.post('/trade/simulated-traders', traderData);
  },
  
  getSimulatedTraders: () => {
    return apiClient.get('/trade/simulated-traders');
  },
  
  getSimulatedTrader: (traderId) => {
    return apiClient.get(`/trade/simulated-traders/${traderId}`);
  },
  
  updateSimulatedTrader: (traderId, traderData) => {
    return apiClient.put(`/trade/simulated-traders/${traderId}`, traderData);
  },
  
  deleteSimulatedTrader: (traderId) => {
    return apiClient.delete(`/trade/simulated-traders/${traderId}`);
  },
  
  // 模拟交易设置
  getSimulationSettings: () => {
    return apiClient.get('/trade/simulation-settings');
  },
  
  updateSimulationSettings: (settingsData) => {
    return apiClient.put('/trade/simulation-settings', settingsData);
  },
  
  // 模拟交易执行
  simulateTrade: (traderId, signal) => {
    return apiClient.post('/trade/simulate-trade', { trader_id: traderId, signal });
  },
  
  runTrader: (traderId) => {
    return apiClient.post(`/trade/run-trader/${traderId}`);
  },
  
  runAllTraders: () => {
    return apiClient.post('/trade/run-all-traders');
  },
  
  // 模拟交易报告
  getSimulationReports: (traderId, limit = 20) => {
    return apiClient.get('/trade/simulation-reports', { params: { trader_id: traderId, limit } });
  },
  
  generateReport: (traderId, period = '7d') => {
    return apiClient.post(`/trade/generate-report/${traderId}`, { period });
  },
};

// 链上事件相关API
const onChainAPI = {
  // 获取链上事件列表
  getEvents: (skip = 0, limit = 100, chain = null, event_type = null) => {
    return apiClient.get('/on-chain', { params: { skip, limit, chain, event_type } });
  },
  
  // 获取链上事件详情
  getEventDetail: (eventId) => {
    return apiClient.get(`/on-chain/${eventId}`);
  },
  
  // 获取支持的区块链列表
  getSupportedChains: () => {
    return apiClient.get('/on-chain/chains/list');
  },
  
  // 获取链上事件统计
  getStats: () => {
    return apiClient.get('/on-chain/stats/summary');
  },
};

// 任务相关API
const tasksAPI = {
  // 获取任务列表
  getTasks: (skip = 0, limit = 100, status = null, priority = null) => {
    return apiClient.get('/tasks', { params: { skip, limit, status_filter: status, priority } });
  },
  
  // 获取任务详情
  getTaskDetail: (taskId) => {
    return apiClient.get(`/tasks/${taskId}`);
  },
  
  // 创建任务
  createTask: (taskData) => {
    return apiClient.post('/tasks', taskData);
  },
  
  // 更新任务
  updateTask: (taskId, taskData) => {
    return apiClient.put(`/tasks/${taskId}`, taskData);
  },
  
  // 删除任务
  deleteTask: (taskId) => {
    return apiClient.delete(`/tasks/${taskId}`);
  },
  
  // 获取任务统计
  getStats: () => {
    return apiClient.get('/tasks/stats/summary');
  },
  
  // 创建链上事件提醒
  createChainEventAlert: (alertData) => {
    return apiClient.post('/tasks/chain-event-alerts', alertData);
  },
  
  // 获取链上事件提醒列表
  getChainEventAlerts: (skip = 0, limit = 100, status = null) => {
    return apiClient.get('/tasks/chain-event-alerts', { params: { skip, limit, status } });
  },
  
  // 更新链上事件提醒
  updateChainEventAlert: (alertId, alertData) => {
    return apiClient.put(`/tasks/chain-event-alerts/${alertId}`, alertData);
  },
  
  // 删除链上事件提醒
  deleteChainEventAlert: (alertId) => {
    return apiClient.delete(`/tasks/chain-event-alerts/${alertId}`);
  },
  
  // 切换链上事件提醒状态
  toggleChainEventAlert: (alertId) => {
    return apiClient.put(`/tasks/chain-event-alerts/${alertId}/toggle`);
  },
};

// 设置相关API
const settingsAPI = {
  // 获取用户设置
  getSettings: () => {
    return apiClient.get('/settings');
  },
  
  // 更新用户设置
  updateSettings: (settingsData) => {
    return apiClient.put('/settings', settingsData);
  },
  
  // 更新邮件通知设置
  updateEmailNotifications: (notificationData) => {
    return apiClient.put('/settings/email-notifications', notificationData);
  },
  
  // 获取通知渠道配置
  getNotificationChannels: () => {
    return apiClient.get('/settings/notification-channels');
  },
  
  // 更新通知渠道配置
  updateNotificationChannels: (channelsData) => {
    return apiClient.put('/settings/notification-channels', channelsData);
  },
  
  // 测试Telegram通知
  testTelegramNotification: (testData) => {
    return apiClient.post('/settings/notification-channels/telegram/test', testData);
  },
  
  // 测试Webhook通知
  testWebhookNotification: (testData) => {
    return apiClient.post('/settings/notification-channels/webhook/test', testData);
  },
  
  // 测试邮件通知
  testEmailNotification: (testData) => {
    return apiClient.post('/settings/notification-channels/email/test', testData);
  },
  
  // 获取API密钥列表
  getApiKeys: () => {
    return apiClient.get('/settings/api-keys');
  },
  
  // 添加API密钥
  addApiKey: (apiKeyData) => {
    return apiClient.post('/settings/api-keys', apiKeyData);
  },
  
  // 删除API密钥
  deleteApiKey: (apiKeyId) => {
    return apiClient.delete(`/settings/api-keys/${apiKeyId}`);
  },
  
  // 验证API密钥
  verifyApiKey: (apiKeyData) => {
    return apiClient.post('/settings/api-keys/verify', apiKeyData);
  },
};

// 导出所有API
const api = {
  auth: authAPI,
  market: marketAPI,
  user: userAPI,
  alerts: alertsAPI,
  trade: tradeAPI,
  onChain: onChainAPI,
  tasks: tasksAPI,
  settings: settingsAPI,
};

export default api;