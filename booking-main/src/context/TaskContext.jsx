import React, { createContext, useState, useContext, useEffect } from 'react';

/**
 * 任务上下文
 * 处理任务相关的状态和逻辑，包括链上事件提醒
 */
const TaskContext = createContext();

/**
 * 任务上下文提供者组件
 * @param {Object} props - 组件属性
 * @param {React.ReactNode} props.children - 子组件
 */
export const TaskProvider = ({ children }) => {
  // 任务状态
  const [tasks, setTasks] = useState([]);
  const [chainEventAlerts, setChainEventAlerts] = useState([]);
  const [loading, setLoading] = useState(false);

  /**
   * 获取任务列表
   * @returns {Promise<Array>} - 任务列表
   */
  const fetchTasks = async () => {
    // 预留API调用位置
    // 后续实现：调用真实API获取任务列表
    // 暂时返回模拟数据
    return tasks;
  };

  /**
   * 获取链上事件提醒列表
   * @returns {Promise<Array>} - 链上事件提醒列表
   */
  const fetchChainEventAlerts = async () => {
    try {
      setLoading(true);
      // 预留API调用位置
      // 后续实现：调用真实API获取链上事件提醒列表
      // 暂时返回模拟数据
      return chainEventAlerts;
    } finally {
      setLoading(false);
    }
  };

  /**
   * 创建链上事件提醒
   * @param {Object} alertData - 链上事件提醒数据
   * @returns {Promise<Object>} - 创建的链上事件提醒
   */
  const createChainEventAlert = async (alertData) => {
    try {
      setLoading(true);
      // 预留API调用位置
      // 后续实现：调用真实API创建链上事件提醒
      // 暂时模拟创建
      const newAlert = {
        id: Date.now(),
        ...alertData,
        status: 'active',
        createdAt: new Date().toISOString()
      };
      const updatedAlerts = [...chainEventAlerts, newAlert];
      setChainEventAlerts(updatedAlerts);
      localStorage.setItem('chainEventAlerts', JSON.stringify(updatedAlerts));
      return newAlert;
    } finally {
      setLoading(false);
    }
  };

  /**
   * 更新链上事件提醒状态
   * @param {number} alertId - 链上事件提醒ID
   * @param {string} newStatus - 新状态
   * @returns {Promise<Object>} - 更新后的链上事件提醒
   */
  const updateChainEventAlertStatus = async (alertId, newStatus) => {
    try {
      setLoading(true);
      // 预留API调用位置
      // 后续实现：调用真实API更新链上事件提醒状态
      // 暂时模拟更新
      const updatedAlerts = chainEventAlerts.map(alert => 
        alert.id === alertId ? { ...alert, status: newStatus } : alert
      );
      setChainEventAlerts(updatedAlerts);
      localStorage.setItem('chainEventAlerts', JSON.stringify(updatedAlerts));
      return updatedAlerts.find(alert => alert.id === alertId);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 删除链上事件提醒
   * @param {number} alertId - 链上事件提醒ID
   * @returns {Promise<boolean>} - 删除是否成功
   */
  const deleteChainEventAlert = async (alertId) => {
    try {
      setLoading(true);
      // 预留API调用位置
      // 后续实现：调用真实API删除链上事件提醒
      // 暂时模拟删除
      const updatedAlerts = chainEventAlerts.filter(alert => alert.id !== alertId);
      setChainEventAlerts(updatedAlerts);
      localStorage.setItem('chainEventAlerts', JSON.stringify(updatedAlerts));
      return true;
    } finally {
      setLoading(false);
    }
  };

  /**
   * 从本地存储加载数据
   * 应用启动时执行一次
   */
  useEffect(() => {
    // 加载任务列表
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    } else {
      // 模拟订阅任务 - 包含各种状态的任务
      const mockTasks = [
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
      ];
      
      setTasks(mockTasks);
      localStorage.setItem('tasks', JSON.stringify(mockTasks));
    }

    // 加载链上事件提醒
    const savedChainEventAlerts = localStorage.getItem('chainEventAlerts');
    if (savedChainEventAlerts) {
      setChainEventAlerts(JSON.parse(savedChainEventAlerts));
    } else {
      // 模拟链上事件提醒数据
      const mockChainEventAlerts = [
        {
          id: 1,
          title: '大额ETH转账提醒',
          description: '当ETH转账金额超过10000时提醒',
          eventType: 'large_transfer',
          threshold: '10000',
          chain: 'ethereum',
          notificationChannels: {
            email: true,
            telegram: false,
            webhook: false
          },
          status: 'active',
          createdAt: new Date().toISOString()
        },
        {
          id: 2,
          title: '交易所BTC净流入提醒',
          description: '当交易所BTC净流入超过5000时提醒',
          eventType: 'exchange_inflow',
          threshold: '5000',
          chain: 'bitcoin',
          notificationChannels: {
            email: true,
            telegram: true,
            webhook: false
          },
          telegramChatId: '123456789',
          status: 'active',
          createdAt: new Date().toISOString()
        }
      ];
      
      setChainEventAlerts(mockChainEventAlerts);
      localStorage.setItem('chainEventAlerts', JSON.stringify(mockChainEventAlerts));
    }
  }, []);
  
  // 上下文值，包含所有状态和方法
  const contextValue = {
    tasks,
    chainEventAlerts,
    loading,
    fetchTasks,
    fetchChainEventAlerts,
    createChainEventAlert,
    updateChainEventAlertStatus,
    deleteChainEventAlert
  };
  
  return (
    <TaskContext.Provider value={contextValue}>
      {children}
    </TaskContext.Provider>
  );
};

/**
 * 自定义Hook，用于访问任务上下文
 * @returns {Object} - 任务上下文值
 * @throws {Error} - 如果在TaskProvider之外使用
 */
export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};