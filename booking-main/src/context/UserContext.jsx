import React, { createContext, useState, useContext, useEffect } from 'react';

/**
 * 用户上下文
 * 处理用户相关的状态和逻辑
 */
const UserContext = createContext();

/**
 * 用户上下文提供者组件
 * @param {Object} props - 组件属性
 * @param {React.ReactNode} props.children - 子组件
 */
export const UserProvider = ({ children }) => {
  // 用户状态
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

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
   * 更新用户邮箱
   * @param {string} email - 用户邮箱
   */
  const updateEmail = (email) => {
    if (user) {
      const updatedUser = { ...user, email };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };
  
  /**
   * 从本地存储加载用户数据
   * 应用启动时执行一次
   */
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);
  
  // 上下文值，包含所有状态和方法
  const contextValue = {
    user,
    isLoading,
    error,
    login,
    register,
    logout,
    updateEmail
  };
  
  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};

/**
 * 自定义Hook，用于访问用户上下文
 * @returns {Object} - 用户上下文值
 * @throws {Error} - 如果在UserProvider之外使用
 */
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};