import React from 'react';
import { UserProvider, useUser } from './UserContext';
import { MarketProvider, useMarket } from './MarketContext';
import { SettingsProvider, useSettings } from './SettingsContext';
import { TaskProvider, useTask } from './TaskContext';

/**
 * 应用上下文提供者组件
 * 整合所有专用上下文，提供统一的接口
 * @param {Object} props - 组件属性
 * @param {React.ReactNode} props.children - 子组件
 */
export const AppProvider = ({ children }) => {
  return (
    <UserProvider>
      <MarketProvider>
        <SettingsProvider>
          <TaskProvider>
            {children}
          </TaskProvider>
        </SettingsProvider>
      </MarketProvider>
    </UserProvider>
  );
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

  // 整合所有上下文值，确保向后兼容性
  return {
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