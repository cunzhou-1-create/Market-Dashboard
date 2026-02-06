import React, { createContext, useState, useContext, useEffect } from 'react';

/**
 * 设置上下文
 * 处理设置相关的状态和逻辑
 */
const SettingsContext = createContext();

/**
 * 设置上下文提供者组件
 * @param {Object} props - 组件属性
 * @param {React.ReactNode} props.children - 子组件
 */
export const SettingsProvider = ({ children }) => {
  // 设置状态
  const [darkMode, setDarkMode] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [emailNotificationTypes, setEmailNotificationTypes] = useState({
    priceAlert: true,
    technicalAlert: false,
    onChainEvent: false,
    aiReport: false
  });
  const [language, setLanguage] = useState('en');

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
   * 更新邮件通知类型
   * @param {Object} types - 邮件通知类型对象
   */
  const updateEmailNotificationTypes = (types) => {
    setEmailNotificationTypes(types);
    localStorage.setItem('emailNotificationTypes', JSON.stringify(types));
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
   * 从本地存储加载设置
   * 应用启动时执行一次
   */
  useEffect(() => {
    // 加载深色模式设置
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode) {
      const mode = JSON.parse(savedDarkMode);
      setDarkMode(mode);
      if (mode) {
        document.documentElement.classList.add('dark');
      }
    } else {
      // 默认启用深色模式
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
    
    // 加载邮件预警设置
    const savedEmailAlerts = localStorage.getItem('emailAlerts');
    if (savedEmailAlerts) {
      setEmailAlerts(JSON.parse(savedEmailAlerts));
    }
    
    // 加载邮件通知类型设置
    const savedEmailNotificationTypes = localStorage.getItem('emailNotificationTypes');
    if (savedEmailNotificationTypes) {
      setEmailNotificationTypes(JSON.parse(savedEmailNotificationTypes));
    }
    
    // 加载语言设置
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      setLanguage(JSON.parse(savedLanguage));
    }
  }, []);
  
  // 上下文值，包含所有状态和方法
  const contextValue = {
    darkMode,
    emailAlerts,
    emailNotificationTypes,
    language,
    toggleDarkMode,
    toggleEmailAlerts,
    updateEmailNotificationTypes,
    updateLanguage
  };
  
  return (
    <SettingsContext.Provider value={contextValue}>
      {children}
    </SettingsContext.Provider>
  );
};

/**
 * 自定义Hook，用于访问设置上下文
 * @returns {Object} - 设置上下文值
 * @throws {Error} - 如果在SettingsProvider之外使用
 */
export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};