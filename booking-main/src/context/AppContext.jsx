import React, { useState, createContext, useContext } from 'react';
import { UserProvider, useUser } from './UserContext';
import { MarketProvider, useMarket } from './MarketContext';
import { SettingsProvider, useSettings } from './SettingsContext';
import { TaskProvider, useTask } from './TaskContext';

// 创建全局应用状态上下文
const GlobalAppContext = createContext();

/**
 * 应用上下文提供者组件
 * 整合所有专用上下文，提供统一的接口
 * @param {Object} props - 组件属性
 * @param {React.ReactNode} props.children - 子组件
 */
export const AppProvider = ({ children }) => {
  // 全局状态
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // 显示错误信息
  const showError = (message) => {
    setError(message);
    // 3秒后自动隐藏错误信息
    setTimeout(() => setError(null), 3000);
  };
  
  // 清除错误信息
  const clearError = () => {
    setError(null);
  };
  
  // 全局状态上下文值
  const globalContextValue = {
    isLoading,
    setIsLoading,
    error,
    showError,
    clearError
  };
  
  return (
    <GlobalAppContext.Provider value={globalContextValue}>
      <UserProvider>
        <MarketProvider>
          <SettingsProvider>
            <TaskProvider>
              {children}
            </TaskProvider>
          </SettingsProvider>
        </MarketProvider>
      </UserProvider>
    </GlobalAppContext.Provider>
  );
};

/**
 * 自定义Hook，用于访问全局应用状态上下文
 * @returns {Object} - 全局应用状态上下文值
 */
export const useGlobalApp = () => {
  const context = useContext(GlobalAppContext);
  if (!context) {
    throw new Error('useGlobalApp must be used within an AppProvider');
  }
  return context;
};

/**
 * 自定义Hook，用于访问应用上下文
 * 整合所有专用上下文，确保向后兼容性
 * @returns {Object} - 应用上下文值
 */
export const useApp = () => {
  const userContext = useUser();
  const marketContext = useMarket();
  const settingsContext = useSettings();
  const taskContext = useTask();
  const globalContext = useGlobalApp();

  // 整合所有上下文值，确保向后兼容性
  return {
    // 全局状态相关
    ...globalContext,
    
    // 用户相关
    ...userContext,
    
    // 市场数据相关
    ...marketContext,
    
    // 设置相关
    ...settingsContext,
    
    // 任务相关
    ...taskContext
  };
};