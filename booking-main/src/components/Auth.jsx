import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    code: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  
  const { login, register, isLoading, error, user } = useUser();
  const navigate = useNavigate();
  
  // 如果用户已登录，重定向到首页
  React.useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);
  
  // 表单验证
  const validateForm = () => {
    const errors = {};
    
    if (!formData.email.trim()) {
      errors.email = '邮箱不能为空';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = '请输入有效的邮箱地址';
    }
    
    if (!formData.password.trim()) {
      errors.password = '密码不能为空';
    } else if (formData.password.length < 6) {
      errors.password = '密码长度不能少于6个字符';
    }
    
    if (!isLogin && !formData.code.trim()) {
      errors.code = '验证码不能为空';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // 处理表单输入变化
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // 清除对应字段的错误
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  // 处理表单提交
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        if (isLogin) {
          await login(formData.email, formData.password);
        } else {
          await register(formData.email, formData.password, formData.code);
        }
      } catch (err) {
        // 错误已在AppContext中处理
      }
    }
  };
  
  // 切换登录/注册模式
  const toggleAuthMode = () => {
    setIsLogin(prev => !prev);
    setFormErrors({});
    // 重置表单数据
    setFormData(prev => ({
      ...prev,
      code: ''
    }));
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark p-4">
      <div className="w-full max-w-md bg-white dark:bg-card-dark rounded-xl shadow-lg p-8 border border-slate-200 dark:border-slate-800 transform transition-all duration-300 hover:shadow-xl">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center transform transition-all duration-300 hover:scale-110">
            <span className="material-symbols-outlined text-white text-3xl">currency_bitcoin</span>
          </div>
        </div>
        
        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-slate-900 dark:text-white mb-6 transition-all duration-300">
          {isLogin ? '登录' : '注册'}
        </h2>
        
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 p-3 rounded-lg mb-6 text-sm transform transition-all duration-300 animate-fade-in">
            {error}
          </div>
        )}
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div className="transform transition-all duration-300">
            <label 
              htmlFor="email" 
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
            >
              邮箱
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="请输入您的邮箱"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 transition-all duration-300 focus:border-primary/50 ${
                formErrors.email ? 'border-red-500' : ''
              }`}
            />
            {formErrors.email && (
              <p className="text-red-500 text-xs mt-1 animate-fade-in">{formErrors.email}</p>
            )}
          </div>
          
          {/* Verification Code Field (Only for Register) */}
          {!isLogin && (
            <div className="transform transition-all duration-300 animate-slide-in">
              <label 
                htmlFor="code" 
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
              >
                验证码
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  id="code"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  placeholder="请输入验证码"
                  className={`flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 transition-all duration-300 focus:border-primary/50 ${
                    formErrors.code ? 'border-red-500' : ''
                  }`}
                />
                <button
                  type="button"
                  className="px-4 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-all duration-300 whitespace-nowrap"
                >
                  获取验证码
                </button>
              </div>
              {formErrors.code && (
                <p className="text-red-500 text-xs mt-1 animate-fade-in">{formErrors.code}</p>
              )}
            </div>
          )}
          
          {/* Password Field */}
          <div className="transform transition-all duration-300">
            <label 
              htmlFor="password" 
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
            >
              密码
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="请输入您的密码"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 transition-all duration-300 focus:border-primary/50 ${
                  formErrors.password ? 'border-red-500' : ''
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
              >
                <span className="material-symbols-outlined">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
            {formErrors.password && (
              <p className="text-red-500 text-xs mt-1 animate-fade-in">{formErrors.password}</p>
            )}
          </div>
          
          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed transform hover:translate-y-[-2px]"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <span className="inline-block animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></span>
                处理中...
              </div>
            ) : (
              isLogin ? '登录' : '注册'
            )}
          </button>
        </form>
        
        {/* Toggle Login/Register */}
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {isLogin ? '还没有账号？' : '已经有账号？'}
            <button
              onClick={toggleAuthMode}
              className="ml-2 text-primary font-medium hover:underline transition-all duration-300 hover:text-primary/80"
            >
              {isLogin ? '注册' : '登录'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;