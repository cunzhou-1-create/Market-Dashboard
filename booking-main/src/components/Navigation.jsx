import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * 导航组件
 * 应用的底部导航栏，包含市场、AI交易、交易、任务和设置等导航项
 */
const Navigation = () => {
  const navigate = useNavigate();
  const [aiTradeMenuOpen, setAiTradeMenuOpen] = useState(false);

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 px-6 pb-6 pt-3 flex justify-between items-center z-50">
      <button 
        className="flex flex-col items-center gap-1 text-primary"
        onClick={() => navigate('/')}
      >
        <span className="material-symbols-outlined fill-1">dashboard</span>
        <span className="text-[10px] font-bold">Market</span>
      </button>
      <button 
        className="flex flex-col items-center gap-1 text-slate-400"
        onClick={() => navigate('/ai-market')}
      >
        <span className="material-symbols-outlined">analytics</span>
        <span className="text-[10px] font-bold">AI行情</span>
      </button>
      <button 
        className="flex flex-col items-center gap-1 text-slate-400"
        onClick={() => navigate('/trade?tab=simulation')}
      >
        <div className="bg-primary size-10 rounded-full flex items-center justify-center -mt-8 shadow-lg shadow-primary/40 text-white">
          <span className="material-symbols-outlined">swap_horiz</span>
        </div>
        <span className="text-[10px] font-bold">Trade</span>
      </button>
      <button 
        className="flex flex-col items-center gap-1 text-slate-400"
        onClick={() => navigate('/task')}
      >
        <span className="material-symbols-outlined">task_alt</span>
        <span className="text-[10px] font-bold">Task</span>
      </button>
      <button 
        className="flex flex-col items-center gap-1 text-slate-400"
        onClick={() => navigate('/settings')}
      >
        <span className="material-symbols-outlined">settings</span>
        <span className="text-[10px] font-bold">Settings</span>
      </button>
    </nav>
  );
};

export default Navigation;