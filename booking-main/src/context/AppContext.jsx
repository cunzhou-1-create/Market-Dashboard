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
  
  // 邮件预警状态
  const [emailAlerts, setEmailAlerts] = useState(true);
  
  // 语言状态
  const [language, setLanguage] = useState('en');
  
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
   * @param {string} email - 用户邮箱
   * @param {string} password - 用户密码
   * @param {string} code - 验证码
   * @returns {Promise<Object>} - 用户信息
   */
  const register = async (email, password, code) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // 模拟API请求
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 模拟用户数据
      const mockUser = {
        id: 1,
        email: email,
        name: email.split('@')[0],
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
   * 切换邮件预警
   * 更新状态和本地存储
   */
  const toggleEmailAlerts = () => {
    const newState = !emailAlerts;
    setEmailAlerts(newState);
    localStorage.setItem('emailAlerts', JSON.stringify(newState));
  };
  
  /**
   * 设置语言
   * 更新状态和本地存储
   * @param {string} lang - 语言代码 ('en' 或 'zh')
   */
  const updateLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('language', JSON.stringify(lang));
  };
  
  /**
   * 从本地存储加载用户和设置
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
    
    const savedEmailAlerts = localStorage.getItem('emailAlerts');
    if (savedEmailAlerts) {
      setEmailAlerts(JSON.parse(savedEmailAlerts));
    }
    
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      setLanguage(JSON.parse(savedLanguage));
    }
  }, []);
  
  /**
   * 模拟市场数据
   * 应用启动时执行一次，设置初始市场数据、观察列表和任务
   */
  useEffect(() => {
    // 模拟市场数据 - 包含BTC、ETH和前100个主流山寨币
    const mockMarketData = [
      // BTC和ETH
      { id: 'BTC-USDT', symbol: 'BTC/USDT', name: 'Bitcoin', price: 64231, change: 2.4, isPositive: true },
      { id: 'ETH-USDT', symbol: 'ETH/USDT', name: 'Ethereum', price: 3452, change: -1.2, isPositive: false },
      // 前100个主流山寨币
      { id: 'SOL-USDT', symbol: 'SOL/USDT', name: 'Solana', price: 142.12, change: 5.8, isPositive: true },
      { id: 'ARB-USDT', symbol: 'ARB/USDT', name: 'Arbitrum', price: 1.12, change: 12.4, isPositive: true },
      { id: 'LINK-USDT', symbol: 'LINK/USDT', name: 'Chainlink', price: 18.45, change: 8.1, isPositive: true },
      { id: 'PEPE-USDT', symbol: 'PEPE/USDT', name: 'Pepe', price: 0.000008, change: 7.4, isPositive: true },
      { id: 'OP-USDT', symbol: 'OP/USDT', name: 'Optimism', price: 2.41, change: 6.9, isPositive: true },
      { id: 'BNB-USDT', symbol: 'BNB/USDT', name: 'Binance Coin', price: 352.45, change: 3.2, isPositive: true },
      { id: 'ADA-USDT', symbol: 'ADA/USDT', name: 'Cardano', price: 0.52, change: -0.8, isPositive: false },
      { id: 'DOT-USDT', symbol: 'DOT/USDT', name: 'Polkadot', price: 6.23, change: 4.5, isPositive: true },
      { id: 'DOGE-USDT', symbol: 'DOGE/USDT', name: 'Dogecoin', price: 0.12, change: 2.1, isPositive: true },
      { id: 'SHIB-USDT', symbol: 'SHIB/USDT', name: 'Shiba Inu', price: 0.000009, change: 5.3, isPositive: true },
      { id: 'AVAX-USDT', symbol: 'AVAX/USDT', name: 'Avalanche', price: 32.45, change: -1.5, isPositive: false },
      { id: 'TRX-USDT', symbol: 'TRX/USDT', name: 'Tron', price: 0.11, change: 0.5, isPositive: true },
      { id: 'MATIC-USDT', symbol: 'MATIC/USDT', name: 'Polygon', price: 0.98, change: 3.7, isPositive: true },
      { id: 'ATOM-USDT', symbol: 'ATOM/USDT', name: 'Cosmos', price: 12.34, change: -2.3, isPositive: false },
      { id: 'LTC-USDT', symbol: 'LTC/USDT', name: 'Litecoin', price: 89.45, change: 1.8, isPositive: true },
      { id: 'XLM-USDT', symbol: 'XLM/USDT', name: 'Stellar', price: 0.13, change: 0.9, isPositive: true },
      { id: 'XMR-USDT', symbol: 'XMR/USDT', name: 'Monero', price: 156.78, change: 2.7, isPositive: true },
      { id: 'BCH-USDT', symbol: 'BCH/USDT', name: 'Bitcoin Cash', price: 298.45, change: -0.6, isPositive: false },
      { id: 'ETC-USDT', symbol: 'ETC/USDT', name: 'Ethereum Classic', price: 15.67, change: 4.2, isPositive: true },
      { id: 'FIL-USDT', symbol: 'FIL/USDT', name: 'Filecoin', price: 4.56, change: -3.1, isPositive: false },
      { id: 'SAND-USDT', symbol: 'SAND/USDT', name: 'The Sandbox', price: 0.45, change: 6.7, isPositive: true },
      { id: 'MANA-USDT', symbol: 'MANA/USDT', name: 'Decentraland', price: 0.32, change: 5.4, isPositive: true },
      { id: 'AXS-USDT', symbol: 'AXS-USDT', name: 'Axie Infinity', price: 7.89, change: -2.8, isPositive: false }
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
   * 预留API：获取市场数据
   * @returns {Promise<Array>} - 市场数据
   */
  const fetchMarketData = async () => {
    // 预留API调用位置
    // 后续实现：调用真实API获取市场数据
    // 暂时返回模拟数据
    return marketData;
  };
  
  /**
   * 预留API：获取用户信息
   * @returns {Promise<Object>} - 用户信息
   */
  const fetchUserInfo = async () => {
    // 预留API调用位置
    // 后续实现：调用真实API获取用户信息
    // 暂时返回模拟数据
    return user;
  };
  
  /**
   * 预留API：获取任务列表
   * @returns {Promise<Array>} - 任务列表
   */
  const fetchTasks = async () => {
    // 预留API调用位置
    // 后续实现：调用真实API获取任务列表
    // 暂时返回模拟数据
    return tasks;
  };
  
  /**
   * 预留API：获取价格预警列表
   * @returns {Promise<Array>} - 价格预警列表
   */
  const fetchPriceAlerts = async () => {
    // 预留API调用位置
    // 后续实现：调用真实API获取价格预警列表
    // 暂时返回模拟数据
    return priceAlerts;
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
    emailAlerts,
    language,
    login,
    register,
    logout,
    toggleDarkMode,
    toggleEmailAlerts,
    updateLanguage,
    addToWatchlist,
    removeFromWatchlist,
    // 预留API函数
    fetchMarketData,
    fetchUserInfo,
    fetchTasks,
    fetchPriceAlerts
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