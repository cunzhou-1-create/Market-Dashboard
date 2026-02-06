import axios from 'axios';

// API基础URL
const API_BASE_URL = 'http://localhost:8000/api/v1';

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

// 响应拦截器 - 统一处理错误
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
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
          // 这里可以添加跳转到登录页的逻辑
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
  
  // 获取单个币种数据
  getSymbolDetail: (symbol) => {
    return apiClient.get(`/market/${symbol}`);
  },
  
  // 获取技术指标
  getTechnicalIndicators: (symbol) => {
    return apiClient.get(`/market/technical/${symbol}`);
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

// 导出所有API
const api = {
  auth: authAPI,
  market: marketAPI,
  user: userAPI,
  alerts: alertsAPI,
};

export default api;