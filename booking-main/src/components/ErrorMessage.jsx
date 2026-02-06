import React from 'react';

/**
 * 错误信息组件
 * 用于统一显示错误信息
 * 
 * @param {Object} props - 组件属性
 * @param {string} props.message - 错误信息
 * @param {boolean} props.show - 是否显示错误信息
 * @param {Function} props.onClose - 关闭错误信息的回调函数
 */
const ErrorMessage = ({ message, show, onClose }) => {
  if (!show || !message) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md">
      <div className="bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 p-4 rounded-lg shadow-lg flex items-start space-x-3 transform transition-all duration-300 animate-fade-in">
        <span className="material-symbols-outlined text-red-500 dark:text-red-400 mt-0.5">
          error
        </span>
        <div className="flex-1">
          <p className="text-sm font-medium">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors"
        >
          <span className="material-symbols-outlined">
            close
          </span>
        </button>
      </div>
    </div>
  );
};

export default ErrorMessage;