import React, { useState, useEffect } from 'react';
import api from '../services/api';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

/**
 * 链上事件提醒组件
 * 显示大额转账和交易所资金流动等链上事件
 */
const ChainEvents = () => {
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState(null);
  const [chains, setChains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeChain, setActiveChain] = useState(null);
  const [activeEventType, setActiveEventType] = useState(null);

  // 获取链上事件数据
  const fetchChainEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // 并行获取数据
      const [eventsData, statsData, chainsData] = await Promise.all([
        api.onChain.getEvents(0, 10, activeChain, activeEventType),
        api.onChain.getStats(),
        api.onChain.getSupportedChains()
      ]);
      
      setEvents(eventsData);
      setStats(statsData);
      setChains(chainsData);
    } catch (err) {
      setError(err.message || '获取链上事件失败');
      console.error('Error fetching chain events:', err);
    } finally {
      setLoading(false);
    }
  };

  // 初始加载和筛选条件变化时获取数据
  useEffect(() => {
    fetchChainEvents();
  }, [activeChain, activeEventType]);

  // 处理链选择
  const handleChainChange = (chain) => {
    setActiveChain(chain === activeChain ? null : chain);
  };

  // 处理事件类型选择
  const handleEventTypeChange = (eventType) => {
    setActiveEventType(eventType === activeEventType ? null : eventType);
  };

  // 格式化地址（显示前6位和后4位）
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // 格式化时间
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} onClose={() => setError(null)} />;
  }

  return (
    <div className="space-y-4">
      <div className="bg-slate-100 dark:bg-[#1c2630] rounded-xl p-4 border border-transparent dark:border-slate-800">
        {/* 筛选器 */}
        <div className="mb-4 space-y-2">
          <h3 className="font-semibold text-sm">链上事件筛选</h3>
          <div className="flex flex-wrap gap-2">
            {chains.map((chain) => (
              <button
                key={chain.name}
                onClick={() => handleChainChange(chain.name)}
                className={`text-xs px-3 py-1 rounded-full ${activeChain === chain.name 
                  ? 'bg-primary text-white' 
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'}
                `}
              >
                {chain.display_name}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {['transaction', 'block', 'token_transfer'].map((type) => (
              <button
                key={type}
                onClick={() => handleEventTypeChange(type)}
                className={`text-xs px-3 py-1 rounded-full ${activeEventType === type 
                  ? 'bg-primary text-white' 
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'}
                `}
              >
                {type.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* 链上事件统计 */}
        {stats && (
          <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-4 mb-4">
            <h3 className="font-semibold text-sm mb-3">链上事件统计</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-slate-100 dark:bg-slate-700/50 rounded-lg p-3">
                <p className="text-xs text-slate-500 dark:text-slate-400">总事件数</p>
                <p className="font-bold text-sm">{stats.total_events}</p>
              </div>
              <div className="bg-slate-100 dark:bg-slate-700/50 rounded-lg p-3">
                <p className="text-xs text-slate-500 dark:text-slate-400">以太坊事件</p>
                <p className="font-bold text-sm">{stats.events_by_chain?.ethereum || 0}</p>
              </div>
              <div className="bg-slate-100 dark:bg-slate-700/50 rounded-lg p-3">
                <p className="text-xs text-slate-500 dark:text-slate-400">比特币事件</p>
                <p className="font-bold text-sm">{stats.events_by_chain?.bitcoin || 0}</p>
              </div>
              <div className="bg-slate-100 dark:bg-slate-700/50 rounded-lg p-3">
                <p className="text-xs text-slate-500 dark:text-slate-400">交易事件</p>
                <p className="font-bold text-sm">{stats.events_by_type?.transaction || 0}</p>
              </div>
            </div>
          </div>
        )}

        {/* 链上事件列表 */}
        <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-4">
          <h3 className="font-semibold text-sm mb-3">最近链上事件</h3>
          {events.length > 0 ? (
            <div className="space-y-3">
              {events.map((event) => (
                <div key={event.id} className="flex items-start justify-between p-3 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="size-6 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center">
                        <span className="material-symbols-outlined text-xs">account_balance_wallet</span>
                      </div>
                      <p className="font-medium text-sm">
                        {event.chain === 'ethereum' ? 'ETH' : event.chain === 'bitcoin' ? 'BTC' : event.chain} {event.event_type}
                      </p>
                    </div>
                    {event.event_type === 'transaction' && (
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        从 {formatAddress(event.from_address)} 到 {formatAddress(event.to_address)}
                      </p>
                    )}
                    {event.event_type === 'block' && (
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        区块 #{event.height} · 矿工: {event.miner}
                      </p>
                    )}
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {formatTime(event.timestamp)}
                    </p>
                  </div>
                  <div className="text-right">
                    {event.value && (
                      <p className="font-bold text-sm">{event.value}</p>
                    )}
                    {event.status && (
                      <p className={`text-xs font-semibold mt-1 ${
                        event.status === 'confirmed' ? 'text-emerald-500' : 'text-amber-500'
                      }`}>
                        {event.status}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-6 text-slate-500 dark:text-slate-400">
              <span className="material-symbols-outlined block mx-auto mb-2">event_busy</span>
              <p className="text-sm">暂无链上事件</p>
            </div>
          )}
        </div>

        {/* 事件提醒设置 */}
        <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg mt-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">notifications_active</span>
            <span className="text-sm font-medium">事件提醒设置</span>
          </div>
          <button className="text-xs font-semibold text-primary border border-primary/30 rounded-lg px-3 py-1 hover:bg-primary/10 transition-colors">
            管理提醒
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChainEvents;