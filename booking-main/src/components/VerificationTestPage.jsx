import React from 'react';
import VerificationCodeInput from './VerificationCodeInput';

/**
 * 验证码输入组件测试页面
 */
const VerificationTestPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-100 dark:border-slate-700 animate-slide-up">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">验证码验证</h1>
          <p className="text-slate-500 dark:text-slate-400">请输入收到的验证码以完成验证</p>
        </div>
        
        <div className="space-y-6">
          {/* 验证码输入组件 */}
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              验证码
            </label>
            <VerificationCodeInput />
          </div>
          
          {/* 提交按钮 */}
          <div>
            <button className="w-full py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 dark:focus:ring-offset-slate-800">
              验证并提交
            </button>
          </div>
          
          {/* 其他选项 */}
          <div className="text-center text-sm text-slate-500 dark:text-slate-400">
            <p>遇到问题？ <a href="#" className="text-primary hover:underline">联系客服</a></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationTestPage;