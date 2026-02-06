import React from 'react';

/**
 * 加载状态组件
 * 用于在API调用过程中显示加载状态
 * 
 * @param {Object} props - 组件属性
 * @param {boolean} props.show - 是否显示加载状态
 * @param {string} props.message - 加载提示信息
 * @param {string} props.size - 加载图标大小，可选值：'sm'、'md'、'lg'
 */
const LoadingSpinner = ({ show, message = '加载中...', size = 'md' }) => {
  if (!show) return null;

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-card-dark rounded-xl shadow-xl p-6 flex flex-col items-center space-y-4 transform transition-all duration-300 animate-fade-in">
        <div className="relative">
          <div className={`inline-block animate-spin rounded-full border-2 border-primary border-t-transparent ${sizeClasses[size]}`}></div>
        </div>
        <p className="text-slate-700 dark:text-slate-300 font-medium">{message}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;