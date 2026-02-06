import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

/**
 * 头部组件
 * 包含用户头像、通知按钮和搜索框等功能
 */
const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useUser();
  
  const handleAuthClick = () => {
    navigate('/auth');
  };
  
  const handleLogout = () => {
    logout();
  };
  
  return (
    <header className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="flex items-center p-4 pb-2 justify-between">
        {/* 用户头像/登录按钮 */}
        {user ? (
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center overflow-hidden rounded-full border border-slate-700">
              <div 
                className="bg-center bg-no-repeat aspect-square bg-cover size-full" 
                data-alt="User profile avatar" 
                style={{ 
                  backgroundImage: `url(${user.avatar})` 
                }}
              />
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{user.role}</p>
            </div>
            <button 
              onClick={handleLogout}
              className="ml-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
            >
              退出
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button 
              onClick={handleAuthClick}
              className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              登录/注册
            </button>
          </div>
        )}
        
        {/* 通知按钮 */}
        <div className="flex items-center gap-2">
          <button className="flex size-10 cursor-pointer items-center justify-center rounded-lg bg-transparent hover:bg-slate-800 transition-colors">
            <span className="material-symbols-outlined text-2xl">notifications</span>
          </button>
        </div>
      </div>
      
      {/* 搜索框 */}
      <div className="px-4 py-2">
        <label className="flex flex-col min-w-40 h-10 w-full">
          <div className="flex w-full flex-1 items-stretch rounded-lg h-full overflow-hidden">
            <div className="text-slate-400 flex border-none bg-slate-100 dark:bg-[#1c2630] items-center justify-center pl-4">
              <span className="material-symbols-outlined text-xl">search</span>
            </div>
            <input 
              className="form-input flex w-full min-w-0 flex-1 border-none bg-slate-100 dark:bg-[#1c2630] focus:outline-0 focus:ring-0 h-full placeholder:text-slate-400 px-3 text-sm font-normal" 
              placeholder="Search pairs (e.g. BTC/USDT)" 
              defaultValue="" 
            />
          </div>
        </label>
      </div>
    </header>
  );
};

export default Header;