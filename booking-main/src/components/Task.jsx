import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from './Navigation';
import ChainEvents from './ChainEvents';
import NotificationSettings from './NotificationSettings';

/**
 * 任务管理组件
 * 包含链上事件提醒和通知渠道设置功能
 */
const Task = () => {
  const navigate = useNavigate();
  
  // 标签页状态
  const [activeTab, setActiveTab] = useState('events');
  
  return (
    <div className="relative flex min-h-screen w-full flex-col max-w-[480px] mx-auto bg-background-light dark:bg-background-dark text-slate-900 dark:text-white overflow-x-hidden">
      {/* TopAppBar */}
      <header className="sticky top-0 z-10 flex flex-col gap-2 bg-background-light dark:bg-background-dark p-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center h-12 justify-between">
          <div className="flex size-12 shrink-0 items-center justify-start">
            <span className="material-symbols-outlined text-slate-700 dark:text-white text-3xl">account_circle</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-500/10 text-green-500 text-[10px] font-bold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5"></span> Binance Live
            </span>
          </div>
          <div className="flex w-12 items-center justify-end">
            <button 
              className="flex size-12 cursor-pointer items-center justify-center rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              onClick={() => navigate('/settings')}
            >
              <span className="material-symbols-outlined text-slate-700 dark:text-white text-2xl">settings</span>
            </button>
          </div>
        </div>
        <div className="mt-2">
          <h1 className="text-slate-900 dark:text-white tracking-tight text-[32px] font-bold leading-tight">Tasks</h1>
          <p className="text-slate-500 dark:text-[#92adc9] text-sm">Active AI monitoring bots</p>
        </div>
      </header>
      
      {/* Main Content with Tabs */}
      <main className="flex-1 flex flex-col max-w-[480px] mx-auto w-full pb-24">
        {/* Tab Navigation */}
        <div className="sticky top-[76px] z-10 bg-background-light dark:bg-background-dark border-b border-slate-200 dark:border-slate-800 px-4">
          <div className="flex space-x-1">
            <button
              className={`flex-1 py-3 px-2 text-center text-sm font-medium transition-colors ${activeTab === 'events' ? 'text-primary border-b-2 border-primary' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}
              onClick={() => setActiveTab('events')}
              aria-label="链上事件"
            >
              链上事件
            </button>
            <button
              className={`flex-1 py-3 px-2 text-center text-sm font-medium transition-colors ${activeTab === 'notifications' ? 'text-primary border-b-2 border-primary' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}
              onClick={() => setActiveTab('notifications')}
              aria-label="通知设置"
            >
              通知设置
            </button>
          </div>
        </div>
        
        {/* Tab Content */}
        <div className="flex-1 p-4">
          {/* Events Tab */}
          {activeTab === 'events' && (
            <ChainEvents />
          )}
          
          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <NotificationSettings />
          )}
        </div>
      </main>
      
      {/* Navigation Bar */}
      <Navigation />
    </div>
  );
};

export default Task;