import React, { createContext, useState, useContext, useEffect } from 'react';

/**
 * 创建应用上下文
 * 用于在整个应用中共享状态和方法
 */
const AppContext = createContext();

/**
 * 提供上下文的组件
 * 管理应用的全局状态和核心功能
 */
export const AppProvider = ({ children }) => {
  // 用户状态
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // 市场数据状态
  const [marketData, setMarketData] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  
  // 订阅任务状态
  const [tasks, setTasks] = useState([]);
  
  // 价格预警任务状态
  const [priceAlerts, setPriceAlerts] = useState([]);
  
  // 深色模式状态
  const [darkMode, setDarkMode] = useState(true);
  
  /**
   * 模拟登录函数
   * @param {string} email - 用户邮箱
   * @param {string} password - 用户密码
   * @returns {Promise<Object>} - 用户信息
   */
  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // 模拟API请求
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 模拟用户数据
      const mockUser = {
        id: 1,
        email: email,
        name: 'Alex Thompson',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAI7QIhKDl8UhoAu1TAjOF7iWnRXswHVPtLwigESWBcYczFPuKUG-3CBUjr5MCKRmro7a_P7yy_MyGTCtPqxpqseqlo29WsRK2p0i5s2-j0Gk0pi9ErT6wy41Or56-uPxRcS4Kg41K61O67CoFmk1e39T8kRfddXKyOzbL9GoczDd1MjOQkOgEkbkfXyBlK8LvEQdkz1MpTgRlG21oJahnq379yuq3ciYxnKuhyZBn4322XynnRAK0oE8lURGxayczZAbq4pxgWW8AX',
        role: 'Pro Trader',
        tier: 'AI Tier',
        joinedAt: 'Oct 2023'
      };
      
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      return mockUser;
    } catch (err) {
      setError('登录失败，请检查您的邮箱和密码');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * 模拟注册函数
   * @param {string} name - 用户姓名
   * @param {string} email - 用户邮箱
   * @param {string} password - 用户密码
   * @returns {Promise<Object>} - 用户信息
   */
  const register = async (name, email, password) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // 模拟API请求
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 模拟用户数据
      const mockUser = {
        id: 1,
        email: email,
        name: name,
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAI7QIhKDl8UhoAu1TAjOF7iWnRXswHVPtLwigESWBcYczFPuKUG-3CBUjr5MCKRmro7a_P7yy_MyGTCtPqxpqseqlo29WsRK2p0i5s2-j0Gk0pi9ErT6wy41Or56-uPxRcS4Kg41K61O67CoFmk1e39T8kRfddXKyOzbL9GoczDd1MjOQkOgEkbkfXyBlK8LvEQdkz1MpTgRlG21oJahnq379yuq3ciYxnKuhyZBn4322XynnRAK0oE8lURGxayczZAbq4pxgWW8AX',
        role: 'Trader',
        tier: 'Basic Tier',
        joinedAt: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      };
      
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      return mockUser;
    } catch (err) {
      setError('注册失败，请稍后重试');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * 退出登录
   * 清除用户状态和本地存储
   */
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };
  
  /**
   * 切换深色模式
   * 更新状态、本地存储和HTML类名
   */
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', JSON.stringify(newMode));
    
    // 更新HTML类名
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };
  
  /**
   * 从本地存储加载用户和深色模式设置
   * 应用启动时执行一次
   */
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode) {
      const mode = JSON.parse(savedDarkMode);
      setDarkMode(mode);
      if (mode) {
        document.documentElement.classList.add('dark');
      }
    }
  }, []);
  
  /**
   * 模拟市场数据
   * 应用启动时执行一次，设置初始市场数据、观察列表和任务
   */
  useEffect(() => {
    // 模拟市场数据
    const mockMarketData = [
      { id: 'BTC-USDT', symbol: 'BTC/USDT', price: 64231, change: 2.4, isPositive: true },
      { id: 'ETH-USDT', symbol: 'ETH/USDT', price: 3452, change: -1.2, isPositive: false },
      { id: 'SOL-USDT', symbol: 'SOL/USDT', price: 142.12, change: 5.8, isPositive: true },
      { id: 'ARB-USDT', symbol: 'ARB/USDT', price: 1.12, change: 12.4, isPositive: true },
      { id: 'LINK-USDT', symbol: 'LINK/USDT', price: 18.45, change: 8.1, isPositive: true },
      { id: 'PEPE-USDT', symbol: 'PEPE/USDT', price: 0.000008, change: 7.4, isPositive: true },
      { id: 'OP-USDT', symbol: 'OP/USDT', price: 2.41, change: 6.9, isPositive: true },
    ];
    
    setMarketData(mockMarketData);
    
    // 模拟观察列表
    setWatchlist(['BTC-USDT', 'ETH-USDT', 'SOL-USDT']);
    
    // 模拟订阅任务 - 包含各种状态的任务
    setTasks([
      {
        id: 1,
        symbol: 'BTC/USDT',
        condition: 'Price > $60,000',
        frequency: 'Every 15 mins',
        lastChecked: '30s ago',
        isActive: true,
        type: 'Price Monitor',
        exchange: 'Binance Global'
      },
      {
        id: 2,
        symbol: 'SOL/USDT',
        condition: 'Bullish Breakout',
        frequency: 'Every 5 mins',
        lastChecked: '2 mins ago',
        isActive: true,
        type: 'AI Sentiment Analysis',
        aiEnabled: true,
        sentiment: 84
      },
      {
        id: 3,
        symbol: 'ETH/USDT',
        condition: 'Spike > 5%',
        frequency: 'Hourly',
        lastChecked: 'Task paused by user',
        isActive: false,
        type: 'Volatility Bot'
      },
      {
        id: 4,
        symbol: 'BNB/USDT',
        condition: 'RSI < 30',
        frequency: 'Every 30 mins',
        lastChecked: '10 mins ago',
        isActive: true,
        type: 'RSI Monitor'
      },
      {
        id: 5,
        symbol: 'ARB/USDT',
        condition: 'MACD Crossover',
        frequency: 'Every 1h',
        lastChecked: '5 mins ago',
        isActive: false,
        type: 'Technical Analysis',
        aiEnabled: true,
        sentiment: 65
      },
      {
        id: 6,
        symbol: 'LINK/USDT',
        condition: 'Volume Spike',
        frequency: 'Every 15 mins',
        lastChecked: '1 min ago',
        isActive: true,
        type: 'Volume Monitor'
      }
    ]);
    
    // 模拟价格预警任务
    setPriceAlerts([
      {
        id: 1,
        symbol: 'BTC/USDT',
        name: 'Bitcoin',
        condition: '价格大于',
        threshold: 70000,
        frequency: '每15分钟',
        isActive: true
      },
      {
        id: 2,
        symbol: 'SOL/USDT',
        name: 'Solana',
        condition: '价格小于',
        threshold: 150,
        frequency: '每5分钟',
        isActive: true
      },
      {
        id: 3,
        symbol: 'ETH/USDT',
        name: 'Ethereum',
        condition: '价格大于',
        threshold: 4000,
        frequency: '每30分钟',
        isActive: false
      }
    ]);
  }, []);
  
  /**
   * 添加到观察列表
   * @param {string} symbolId - 交易对ID
   */
  const addToWatchlist = (symbolId) => {
    if (!watchlist.includes(symbolId)) {
      setWatchlist([...watchlist, symbolId]);
    }
  };
  
  /**
   * 从观察列表移除
   * @param {string} symbolId - 交易对ID
   */
  const removeFromWatchlist = (symbolId) => {
    setWatchlist(watchlist.filter(id => id !== symbolId));
  };
  
  /**
   * 添加订阅任务
   * @param {Object} task - 任务信息
   */
  const addTask = (task) => {
    const newTask = {
      id: Date.now(),
      ...task,
      lastChecked: 'Just now',
      isActive: true
    };
    setTasks([newTask, ...tasks]);
  };
  
  /**
   * 更新订阅任务
   * @param {number} taskId - 任务ID
   * @param {Object} updates - 更新的任务信息
   */
  const updateTask = (taskId, updates) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, ...updates } : task
    ));
  };
  
  /**
   * 删除订阅任务
   * @param {number} taskId - 任务ID
   */
  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };
  
  /**
   * 切换任务激活状态
   * @param {number} taskId - 任务ID
   */
  const toggleTaskActive = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, isActive: !task.isActive } : task
    ));
  };
  
  /**
   * 添加价格预警任务
   * @param {Object} alert - 预警任务信息
   */
  const addPriceAlert = (alert) => {
    const newAlert = {
      id: Date.now(),
      ...alert,
      isActive: true
    };
    setPriceAlerts([newAlert, ...priceAlerts]);
  };
  
  /**
   * 更新价格预警任务
   * @param {number} alertId - 预警任务ID
   * @param {Object} updates - 更新的预警任务信息
   */
  const updatePriceAlert = (alertId, updates) => {
    setPriceAlerts(priceAlerts.map(alert => 
      alert.id === alertId ? { ...alert, ...updates } : alert
    ));
  };
  
  /**
   * 删除价格预警任务
   * @param {number} alertId - 预警任务ID
   */
  const deletePriceAlert = (alertId) => {
    setPriceAlerts(priceAlerts.filter(alert => alert.id !== alertId));
  };
  
  /**
   * 切换价格预警任务激活状态
   * @param {number} alertId - 预警任务ID
   */
  const togglePriceAlertActive = (alertId) => {
    setPriceAlerts(priceAlerts.map(alert => 
      alert.id === alertId ? { ...alert, isActive: !alert.isActive } : alert
    ));
  };
  
  // 上下文值，包含所有状态和方法
  const contextValue = {
    user,
    isLoading,
    error,
    marketData,
    watchlist,
    tasks,
    priceAlerts,
    darkMode,
    login,
    register,
    logout,
    toggleDarkMode,
    addToWatchlist,
    removeFromWatchlist,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskActive,
    addPriceAlert,
    updatePriceAlert,
    deletePriceAlert,
    togglePriceAlertActive
  };
  
  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

/**
 * 自定义Hook，用于访问上下文
 * @returns {Object} - 上下文值
 * @throws {Error} - 如果在AppProvider之外使用
 */
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};