import React, { useState, useEffect, useRef } from 'react';

/**
 * 验证码输入组件
 * 支持获取验证码、倒计时、动画效果
 */
const VerificationCodeInput = () => {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const timerRef = useRef(null);

  // 处理验证码输入
  const handleCodeChange = (e) => {
    const value = e.target.value;
    // 只允许输入数字
    if (/^\d*$/.test(value)) {
      setCode(value);
    }
  };

  // 处理获取验证码
  const handleGetCode = () => {
    if (countdown > 0 || isLoading) return;

    setIsLoading(true);
    
    // 模拟API请求
    setTimeout(() => {
      setIsLoading(false);
      setCountdown(60);
    }, 1000);
  };

  // 处理倒计时
  useEffect(() => {
    if (countdown > 0) {
      timerRef.current = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [countdown]);

  return (
    <div className="w-full max-w-md">
      <div className={`flex space-x-2 transition-all duration-300 ${isFocused ? 'scale-[1.01]' : ''}`}>
        <div className="flex-1 relative">
          <input 
            type="text" 
            id="code" 
            name="code" 
            placeholder="请输入验证码" 
            value={code}
            onChange={handleCodeChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 transition-all duration-300 focus:border-primary/50 placeholder-slate-400 dark:placeholder-slate-500"
          />
          {/* 输入指示器 */}
          {isFocused && (
            <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary/30 animate-pulse" />
          )}
        </div>
        <button 
          type="button" 
          onClick={handleGetCode}
          disabled={countdown > 0 || isLoading}
          className={`px-4 py-3 rounded-lg transition-all duration-300 whitespace-nowrap font-medium flex items-center justify-center gap-2
            ${countdown > 0 || isLoading 
              ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
              : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 hover:shadow-sm'
            }`}
        >
          {isLoading ? (
            <>
              <div className="size-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              <span>发送中...</span>
            </>
          ) : countdown > 0 ? (
            <span>{countdown}秒后重试</span>
          ) : (
            <span>获取验证码</span>
          )}
        </button>
      </div>
      
      {/* 验证码输入提示 */}
      <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
        <span className="material-symbols-outlined text-[12px]">info</span>
        <span>验证码将发送到您的注册邮箱或手机号</span>
      </div>
    </div>
  );
};

export default VerificationCodeInput;