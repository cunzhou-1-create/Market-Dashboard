import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

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
   * 登录函数
   * @param {string} email - 用户邮箱
   * @param {string} password - 用户密码
   * @returns {Promise<Object>} - 用户信息
   */
  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // 调用真实API登录
      const response = await api.auth.login(email, password);
      
      // 保存token
      localStorage.setItem('token', response.access_token);
      
      // 获取用户信息
      const userInfo = await api.auth.getCurrentUser();
      
      // 保存用户信息
      setUser(userInfo);
      localStorage.setItem('user', JSON.stringify(userInfo));
      
      return userInfo;
    } catch (err) {
      setError(err.message || '登录失败，请检查您的邮箱和密码');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * 注册函数
   * @param {string} email - 用户邮箱
   * @param {string} password - 用户密码
   * @param {string} code - 验证码
   * @returns {Promise<Object>} - 用户信息
   */
  const register = async (email, password, code) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // 调用真实API注册
      const response = await api.auth.register(email, password, code);
      
      // 保存token
      localStorage.setItem('token', response.access_token);
      
      // 获取用户信息
      const userInfo = await api.auth.getCurrentUser();
      
      // 保存用户信息
      setUser(userInfo);
      localStorage.setItem('user', JSON.stringify(userInfo));
      
      return userInfo;
    } catch (err) {
      setError(err.message || '注册失败，请稍后重试');
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
    localStorage.removeItem('token');
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
   * 获取验证码
   * @param {string} email - 用户邮箱
   * @returns {Promise<void>}
   */
  const getVerificationCode = async (email) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await api.auth.resendCode(email);
      return true;
    } catch (err) {
      setError(err.message || '发送验证码失败，请稍后重试');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * 获取用户资料
   * @returns {Promise<Object|null>} - 用户资料
   */
  const getProfile = async () => {
    try {
      const profile = await api.user.getProfile();
      setUser(profile);
      localStorage.setItem('user', JSON.stringify(profile));
      return profile;
    } catch (err) {
      console.error('获取用户资料失败:', err);
      return null;
    }
  };
  
  /**
   * 更新用户资料
   * @param {string} name - 用户名
   * @param {string} avatar - 头像URL
   * @returns {Promise<Object|null>} - 更新后的用户资料
   */
  const updateProfile = async (name, avatar) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const updatedProfile = await api.user.updateProfile(name, avatar);
      setUser(updatedProfile);
      localStorage.setItem('user', JSON.stringify(updatedProfile));
      return updatedProfile;
    } catch (err) {
      setError(err.message || '更新用户资料失败，请稍后重试');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * 上传头像
   * @param {File} file - 头像文件
   * @returns {Promise<Object|null>} - 更新后的用户资料
   */
  const uploadAvatar = async (file) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const updatedProfile = await api.user.uploadAvatar(file);
      setUser(updatedProfile);
      localStorage.setItem('user', JSON.stringify(updatedProfile));
      return updatedProfile;
    } catch (err) {
      setError(err.message || '上传头像失败，请稍后重试');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * 获取用户统计信息
   * @returns {Promise<Object|null>} - 用户统计信息
   */
  const getUserStats = async () => {
    try {
      return await api.user.getStats();
    } catch (err) {
      console.error('获取用户统计信息失败:', err);
      return null;
    }
  };
  
  /**
   * 获取登录历史记录
   * @returns {Promise<Object|null>} - 登录历史记录
   */
  const getLoginHistory = async () => {
    try {
      return await api.user.getLoginHistory();
    } catch (err) {
      console.error('获取登录历史记录失败:', err);
      return null;
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
    updateEmail,
    getVerificationCode,
    getProfile,
    updateProfile,
    uploadAvatar,
    getUserStats,
    getLoginHistory
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