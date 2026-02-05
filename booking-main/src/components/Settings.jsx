import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Navigation from './Navigation';

/**
 * 设置组件
 * 包含账户管理、AI集成、通知设置和偏好设置等功能
 */
const Settings = () => {
  const navigate = useNavigate();
  const { user, darkMode, toggleDarkMode, logout } = useApp();

  /**
   * 处理退出登录
   * 清除用户状态并导航到登录页面
   */
  const handleSignOut = () => {
    logout();
    navigate('/auth');
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col max-w-[480px] mx-auto bg-background-light dark:bg-background-dark text-slate-900 dark:text-white shadow-2xl">
      {/* TopAppBar */}
      <div className="sticky top-0 z-50 flex items-center bg-background-light dark:bg-background-dark p-4 pb-2 justify-between border-b border-slate-200 dark:border-slate-800">
        <div 
          className="text-primary flex size-10 shrink-0 items-center justify-center cursor-pointer"
          onClick={() => navigate(-1)}
        >
          <span className="material-symbols-outlined">arrow_back_ios</span>
        </div>
        <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-10">Account Settings</h2>
      </div>
      
      <div className="flex flex-col gap-2 pb-24">
        {/* ProfileHeader */}
        <div className="flex p-4 @container">
          <div className="flex w-full flex-col gap-4 @[520px]:flex-row @[520px]:justify-between @[520px]:items-center">
            <div className="flex gap-4 items-center">
              <div 
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-20 w-20 ring-2 ring-primary ring-offset-2 ring-offset-background-light dark:ring-offset-background-dark" 
                data-alt="Professional trader profile picture with crypto background" 
                style={{ 
                  backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAI7QIhKDl8UhoAu1TAjOF7iWnRXswHVPtLwigESWBcYczFPuKUG-3CBUjr5MCKRmro7a_P7yy_MyGTCtPqxpqseqlo29WsRK2p0i5s2-j0Gk0pi9ErT6wy41Or56-uPxRcS4Kg41K61O67CoFmk1e39T8kRfddXKyOzbL9GoczDd1MjOQkOgEkbkfXyBlK8LvEQdkz1MpTgRlG21oJahnq379yuq3ciYxnKuhyZBn4322XynnRAK0oE8lURGxayczZAbq4pxgWW8AX")' 
                }}
              >
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-slate-900 dark:text-white text-[20px] font-bold leading-tight">{user?.name}</p>
                <p className="text-primary text-sm font-semibold leading-normal">{user?.role} • {user?.tier}</p>
                <p className="text-slate-500 dark:text-[#92adc9] text-xs font-normal leading-normal">Active since {user?.joinedAt}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Section: Account Management */}
        <h3 className="text-slate-900 dark:text-white text-sm font-bold uppercase tracking-wider px-4 pb-2 pt-4">Account Management</h3>
        <div className="bg-white dark:bg-[#1c2630] mx-4 rounded-xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
          {/* ListItem: Switch Account */}
          <div className="flex items-center gap-4 px-4 min-h-[72px] py-2 justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer">
            <div className="flex items-center gap-4">
              <div 
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-lg h-10 w-10" 
                data-alt="Binance logo icon" 
                style={{ 
                  backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDsACUCh86CFmbpUsyEmxuA2DYSiolfbw0r6kzm230hzyvXI_YbJBfuQ6OdEjz_Asu7Sv5BTD5wpCQeXdySf8ioCdyp0Uhug8RxeNg2TBNcmO93JvjJE4a0svQ9u90qPkjFD9DgPYIy7Qbt1bjjBncFzBzA_Q0RhkF0kZ-m4AgOVApwaMQzmPqq6p4sgNcv6t1eldYyWtMDZG9NTvHkg4DJlzPKFLuaWmcBehm8cFXw9TTSeAuR-IJ5xsT79oxhiqAhuEew9CbJk0fe")' 
                }}
              >
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-slate-900 dark:text-white text-base font-medium leading-normal line-clamp-1">Switch Account</p>
                <p className="text-slate-500 dark:text-[#92adc9] text-xs font-normal leading-normal line-clamp-2">Active: Main Binance Account</p>
              </div>
            </div>
            <div className="shrink-0">
              <span className="material-symbols-outlined text-slate-400">chevron_right</span>
            </div>
          </div>
          
          {/* ListItem: Add New */}
          <div className="flex items-center gap-4 px-4 min-h-14 justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="text-primary flex items-center justify-center rounded-lg bg-primary/10 shrink-0 size-10">
                <span className="material-symbols-outlined">person_add</span>
              </div>
              <p className="text-slate-900 dark:text-white text-base font-normal leading-normal flex-1 truncate">Add New Account</p>
            </div>
            <div className="shrink-0">
              <span className="material-symbols-outlined text-slate-400">add</span>
            </div>
          </div>
        </div>
        
        {/* Section: AI & Integrations */}
        <h3 className="text-slate-900 dark:text-white text-sm font-bold uppercase tracking-wider px-4 pb-2 pt-6">AI &amp; Integrations</h3>
        <div className="bg-white dark:bg-[#1c2630] mx-4 rounded-xl overflow-hidden p-4 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-slate-500 dark:text-[#92adc9] text-xs font-semibold">Qwen LLM API Key</label>
            <div className="relative">
              <input 
                className="w-full bg-slate-50 dark:bg-background-dark border-none rounded-lg text-slate-900 dark:text-white text-sm py-3 px-4 focus:ring-2 focus:ring-primary pr-12" 
                type="password" 
                defaultValue="sk-qwen-78x9234892347239487" 
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer">
                <span className="material-symbols-outlined text-[20px]">visibility</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              <div className="size-2 rounded-full bg-emerald-500"></div>
              <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-tight">Connected</span>
            </div>
          </div>
        </div>
        
        {/* Section: Notifications */}
        <h3 className="text-slate-900 dark:text-white text-sm font-bold uppercase tracking-wider px-4 pb-2 pt-6">Notifications</h3>
        <div className="bg-white dark:bg-[#1c2630] mx-4 rounded-xl overflow-hidden p-4 flex flex-col gap-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex flex-col">
              <p className="text-slate-900 dark:text-white text-base font-medium">Email Alerts</p>
              <p className="text-slate-500 dark:text-[#92adc9] text-xs">Market signals &amp; trade updates</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input checked className="sr-only peer" type="checkbox" />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
          <input 
            className="w-full bg-slate-50 dark:bg-background-dark border-none rounded-lg text-slate-900 dark:text-white text-sm py-3 px-4 focus:ring-2 focus:ring-primary" 
            placeholder="alex.t@trading.com" 
            type="email" 
            defaultValue={user?.email}
          />
        </div>
        
        {/* Section: Preferences */}
        <h3 className="text-slate-900 dark:text-white text-sm font-bold uppercase tracking-wider px-4 pb-2 pt-6">Preferences</h3>
        <div className="bg-white dark:bg-[#1c2630] mx-4 rounded-xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
          {/* Theme Selection */}
          <div className="flex items-center gap-4 px-4 min-h-14 justify-between">
            <div className="flex items-center gap-4">
              <div className="text-slate-500 dark:text-white flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0 size-10">
                <span className="material-symbols-outlined">dark_mode</span>
              </div>
              <p className="text-slate-900 dark:text-white text-base font-normal">Theme</p>
            </div>
            <div className="flex bg-slate-100 dark:bg-background-dark p-1 rounded-lg">
              <button 
                className={`px-3 py-1 text-xs font-bold rounded-md ${darkMode ? 'bg-white dark:bg-slate-800 shadow-sm text-primary' : 'text-slate-500 dark:text-[#92adc9]'}`}
                onClick={toggleDarkMode}
              >
                Dark
              </button>
              <button 
                className={`px-3 py-1 text-xs font-bold rounded-md ${!darkMode ? 'bg-white dark:bg-slate-800 shadow-sm text-primary' : 'text-slate-500 dark:text-[#92adc9]'}`}
                onClick={toggleDarkMode}
              >
                Light
              </button>
            </div>
          </div>
          
          {/* Language */}
          <div className="flex items-center gap-4 px-4 min-h-14 justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="text-slate-500 dark:text-white flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0 size-10">
                <span className="material-symbols-outlined">language</span>
              </div>
              <p className="text-slate-900 dark:text-white text-base font-normal">Language</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500 dark:text-[#92adc9]">English</span>
              <span className="material-symbols-outlined text-slate-400">chevron_right</span>
            </div>
          </div>
        </div>
        
        {/* Danger Zone */}
        <div className="mt-8 px-4 flex flex-col gap-3">
          <button 
            className="w-full py-4 bg-white dark:bg-slate-800/30 text-slate-600 dark:text-slate-400 font-bold rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            onClick={handleSignOut}
          >
            Sign Out
          </button>
          <button className="w-full py-2 text-rose-500 text-sm font-medium hover:text-rose-600 transition-colors">
            Delete Account
          </button>
        </div>
        
        {/* Footer Info */}
        <div className="mt-8 flex flex-col items-center gap-1 opacity-50">
          <p className="text-[10px] text-slate-500 dark:text-[#92adc9] uppercase tracking-[0.2em] font-bold">Qwen AI Market Hub</p>
          <p className="text-[10px] text-slate-500 dark:text-[#92adc9]">Version 2.4.1 (Stable Build)</p>
        </div>
      </div>
      
      {/* Navigation Bar */}
      <Navigation />
    </div>
  );
};

export default Settings;