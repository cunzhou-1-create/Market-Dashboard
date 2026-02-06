import React, { createContext, useState, useContext, useEffect } from 'react';

/**
 * 任务上下文
 * 处理任务相关的状态和逻辑
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
   * 从本地存储加载任务
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
  }, []);
  
  // 上下文值，包含所有状态和方法
  const contextValue = {
    tasks,
    fetchTasks
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