import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * 共用头部组件
 * 包含返回按钮和标题等功能
 * @param {Object} props - 组件属性
 * @param {string} props.title - 头部标题
 * @param {boolean} props.showBackButton - 是否显示返回按钮
 */
const CommonHeader = ({ title, showBackButton = true }) => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <div className="sticky top-0 z-50 flex items-center bg-background-light dark:bg-background-dark p-4 pb-2 justify-between border-b border-slate-200 dark:border-slate-800">
      {showBackButton && (
        <div 
          className="text-primary flex size-10 shrink-0 items-center justify-center cursor-pointer"
          onClick={handleBackClick}
        >
          <span className="material-symbols-outlined">arrow_back_ios</span>
        </div>
      )}
      <h2 className={`text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 ${showBackButton ? 'text-center pr-10' : ''}`}>
        {title}
      </h2>
      {!showBackButton && (
        <div className="flex size-10 shrink-0 items-center justify-center"></div>
      )}
    </div>
  );
};

export default CommonHeader;