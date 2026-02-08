import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from './Navigation';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import api from '../services/api';
import { useUser } from '../context/UserContext';

/**
 * 链上事件提醒管理组件
 * 管理链上事件提醒，包括大额转账和交易所净流入突增提醒
 */
const Task = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [chainEvents, setChainEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showChainEventModal, setShowChainEventModal] = useState(false);
  const [newChainEvent, setNewChainEvent] = useState({
    title: '',
    description: '',
    eventType: 'large_transfer',
    threshold: '10000',
    chain: 'ethereum',
    notificationChannels: {
      email: true,
      telegram: false,
      webhook: false
    },
    telegramChatId: '',
    webhookUrl: ''
  });

  // 获取链上事件提醒数据
  const fetchChainEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const eventsData = await api.tasks.getChainEventAlerts(0, 50);
      setChainEvents(Array.isArray(eventsData) ? eventsData : []);
    } catch (err) {
      const errorMessage = err.message || '获取链上事件提醒失败';
      setError(errorMessage);
      console.error('Error fetching chain events:', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // 初始加载数据
  useEffect(() => {
    fetchChainEvents();
  }, []);

  // 处理创建链上事件提醒
  const handleCreateChainEvent = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      await api.tasks.createChainEventAlert({
        title: newChainEvent.title,
        description: newChainEvent.description,
        event_type: newChainEvent.eventType,
        threshold: newChainEvent.threshold,
        chain: newChainEvent.chain,
        notification_channels: newChainEvent.notificationChannels,
        telegram_chat_id: newChainEvent.telegramChatId,
        webhook_url: newChainEvent.webhookUrl
      });
      setShowChainEventModal(false);
      setNewChainEvent({
        title: '',
        description: '',
        eventType: 'large_transfer',
        threshold: '10000',
        chain: 'ethereum',
        notificationChannels: {
          email: true,
          telegram: false,
          webhook: false
        },
        telegramChatId: '',
        webhookUrl: ''
      });
      fetchChainEvents(); // 刷新链上事件提醒列表
    } catch (err) {
      const errorMessage = err.message || '创建链上事件提醒失败';
      setError(errorMessage);
      console.error('Error creating chain event alert:', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // 处理删除链上事件提醒
  const handleDeleteChainEvent = async (eventId) => {
    if (window.confirm('确定要删除这个链上事件提醒吗？')) {
      try {
        setLoading(true);
        setError(null);
        await api.tasks.deleteChainEventAlert(eventId);
        fetchChainEvents(); // 刷新链上事件提醒列表
      } catch (err) {
        const errorMessage = err.message || '删除链上事件提醒失败';
        setError(errorMessage);
        console.error('Error deleting chain event alert:', errorMessage);
      } finally {
        setLoading(false);
      }
    }
  };

  // 处理切换链上事件提醒状态
  const handleToggleChainEventStatus = async (eventId) => {
    try {
      setLoading(true);
      setError(null);
      await api.tasks.toggleChainEventAlert(eventId);
      fetchChainEvents(); // 刷新链上事件提醒列表
    } catch (err) {
      const errorMessage = err.message || '切换链上事件提醒状态失败';
      setError(errorMessage);
      console.error('Error toggling chain event alert:', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // 获取事件类型对应的文本
  const getEventTypeText = (eventType) => {
    switch (eventType) {
      case 'large_transfer':
        return '大额转账';
      case 'exchange_inflow':
        return '交易所净流入突增';
      default:
        return eventType;
    }
  };

  // 获取区块链对应的文本
  const getChainText = (chain) => {
    switch (chain) {
      case 'ethereum':
        return 'Ethereum';
      case 'bitcoin':
        return 'Bitcoin';
      case 'binance_smart_chain':
        return 'Binance Smart Chain';
      default:
        return chain;
    }
  };

  // 获取状态对应的样式
  const getStatusStyle = (status) => {
    switch (status) {
      case 'active':
        return { text: '活跃', color: 'text-emerald-500', bg: 'bg-emerald-500/10' };
      case 'paused':
        return { text: '已暂停', color: 'text-amber-500', bg: 'bg-amber-500/10' };
      default:
        return { text: status, color: 'text-slate-500', bg: 'bg-slate-200 dark:bg-slate-700' };
    }
  };

  // 检查登录状态
  if (!user) {
    return (
      <div className="relative flex min-h-screen w-full flex-col max-w-[480px] mx-auto bg-background-light dark:bg-background-dark text-slate-900 dark:text-white overflow-x-hidden">
        <header className="sticky top-0 z-10 flex flex-col gap-2 bg-background-light dark:bg-background-dark p-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center h-12 justify-between">
            <div className="flex size-12 shrink-0 items-center justify-start">
              <span className="material-symbols-outlined text-slate-700 dark:text-white text-3xl">sync_alt</span>
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
            <h1 className="text-slate-900 dark:text-white tracking-tight text-[32px] font-bold leading-tight">链上事件提醒</h1>
          </div>
        </header>
        <main className="flex-1 flex flex-col items-center justify-center p-8">
          <span className="material-symbols-outlined text-6xl text-slate-400 mb-6">lock</span>
          <h2 className="text-xl font-bold mb-2">需要登录</h2>
          <p className="text-slate-500 dark:text-slate-400 text-center mb-8">请先登录以查看和管理链上事件提醒</p>
          <button
            onClick={() => navigate('/auth')}
            className="px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
          >
            去登录
          </button>
        </main>
        <Navigation />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="relative flex min-h-screen w-full flex-col max-w-[480px] mx-auto bg-background-light dark:bg-background-dark">
        <header className="p-4 border-b border-slate-200 dark:border-slate-800">
          <h1 className="text-2xl font-bold">链上事件提醒</h1>
        </header>
        <main className="flex-1 flex items-center justify-center">
          <LoadingSpinner />
        </main>
        <Navigation />
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative flex min-h-screen w-full flex-col max-w-[480px] mx-auto bg-background-light dark:bg-background-dark">
        <header className="p-4 border-b border-slate-200 dark:border-slate-800">
          <h1 className="text-2xl font-bold">链上事件提醒</h1>
        </header>
        <main className="flex-1 p-4">
          <ErrorMessage message={error} onClose={() => setError(null)} />
        </main>
        <Navigation />
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col max-w-[480px] mx-auto bg-background-light dark:bg-background-dark text-slate-900 dark:text-white overflow-x-hidden">
      {/* TopAppBar */}
      <header className="sticky top-0 z-10 flex flex-col gap-2 bg-background-light dark:bg-background-dark p-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center h-12 justify-between">
          <div className="flex size-12 shrink-0 items-center justify-start">
            <span className="material-symbols-outlined text-slate-700 dark:text-white text-3xl">sync_alt</span>
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
          <h1 className="text-slate-900 dark:text-white tracking-tight text-[32px] font-bold leading-tight">链上事件提醒</h1>
          <p className="text-slate-500 dark:text-[#92adc9] text-sm">{chainEvents.length} 个提醒</p>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-1 flex flex-col max-w-[480px] mx-auto w-full pb-24">
        {/* 操作栏 */}
        <div className="p-4 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">链上事件提醒管理</h3>
            <div className="flex gap-2">
              <button
                onClick={() => navigate('/notification-channels')}
                className="flex items-center gap-1 text-xs px-3 py-1.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
              >
                <span className="material-symbols-outlined text-xs">notifications</span>
                通知渠道
              </button>
              <button
                onClick={() => setShowChainEventModal(true)}
                className="flex items-center gap-1 text-xs px-3 py-1.5 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
              >
                <span className="material-symbols-outlined text-xs">add</span>
                创建提醒
              </button>
            </div>
          </div>
        </div>

        {/* 链上事件提醒列表 */}
        <div className="flex-1 p-4">
          {chainEvents.length > 0 ? (
            <div className="space-y-3">
              {chainEvents.map((event) => {
                const statusStyle = getStatusStyle(event.status);
                return (
                  <div key={event.id} className="bg-white/50 dark:bg-slate-800/50 rounded-xl p-4 border border-transparent dark:border-slate-800">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-sm flex-1">{event.title}</h4>
                      <button
                        onClick={() => handleDeleteChainEvent(event.id)}
                        className="ml-2 text-slate-400 hover:text-rose-500 transition-colors"
                      >
                        <span className="material-symbols-outlined text-xs">delete</span>
                      </button>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">{event.description}</p>
                    <div className="space-y-2 mb-3">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500 dark:text-slate-400">事件类型:</span>
                        <span>{getEventTypeText(event.event_type)}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500 dark:text-slate-400">阈值:</span>
                        <span>{event.threshold}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500 dark:text-slate-400">区块链:</span>
                        <span>{getChainText(event.chain)}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500 dark:text-slate-400">通知渠道:</span>
                        <div className="flex gap-1">
                          {event.notification_channels?.email && (
                            <span className="text-xs px-1.5 py-0.5 rounded-full bg-blue-500/10 text-blue-500">邮件</span>
                          )}
                          {event.notification_channels?.telegram && (
                            <span className="text-xs px-1.5 py-0.5 rounded-full bg-purple-500/10 text-purple-500">Telegram</span>
                          )}
                          {event.notification_channels?.webhook && (
                            <span className="text-xs px-1.5 py-0.5 rounded-full bg-green-500/10 text-green-500">Webhook</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${statusStyle.color} ${statusStyle.bg}`}>
                        {statusStyle.text}
                      </span>
                      <button
                        onClick={() => handleToggleChainEventStatus(event.id)}
                        className={`text-xs px-3 py-1 rounded-full ${event.status === 'active' ? 'bg-amber-500 text-white' : 'bg-emerald-500 text-white'} hover:opacity-90 transition-colors`}
                      >
                        {event.status === 'active' ? '暂停' : '启用'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center p-8 text-slate-500 dark:text-slate-400">
              <span className="material-symbols-outlined block mx-auto mb-3 text-4xl">event_busy</span>
              <p className="text-sm">暂无链上事件提醒</p>
              <button
                onClick={() => setShowChainEventModal(true)}
                className="mt-4 text-xs px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
              >
                创建第一个提醒
              </button>
            </div>
          )}
        </div>
      </main>

      {/* 创建链上事件提醒模态框 */}
      {showChainEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 w-full max-w-md">
            <h3 className="font-bold text-lg mb-4">创建链上事件提醒</h3>
            <form onSubmit={handleCreateChainEvent} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">提醒标题</label>
                <input
                  type="text"
                  value={newChainEvent.title}
                  onChange={(e) => setNewChainEvent({ ...newChainEvent, title: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="输入提醒标题"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">描述</label>
                <textarea
                  value={newChainEvent.description}
                  onChange={(e) => setNewChainEvent({ ...newChainEvent, description: e.target.value })}
                  required
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="输入提醒描述"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">事件类型</label>
                <select
                  value={newChainEvent.eventType}
                  onChange={(e) => setNewChainEvent({ ...newChainEvent, eventType: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="large_transfer">大额转账</option>
                  <option value="exchange_inflow">交易所净流入突增</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">阈值</label>
                <input
                  type="number"
                  value={newChainEvent.threshold}
                  onChange={(e) => setNewChainEvent({ ...newChainEvent, threshold: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="输入阈值，例如 10000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">区块链</label>
                <select
                  value={newChainEvent.chain}
                  onChange={(e) => setNewChainEvent({ ...newChainEvent, chain: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="ethereum">Ethereum</option>
                  <option value="bitcoin">Bitcoin</option>
                  <option value="binance_smart_chain">Binance Smart Chain</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">通知渠道</label>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newChainEvent.notificationChannels.email}
                      onChange={(e) => setNewChainEvent({ 
                        ...newChainEvent, 
                        notificationChannels: { 
                          ...newChainEvent.notificationChannels, 
                          email: e.target.checked 
                        } 
                      })}
                      className="mr-2"
                      disabled
                    />
                    <label>邮件 (必选)</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newChainEvent.notificationChannels.telegram}
                      onChange={(e) => setNewChainEvent({ 
                        ...newChainEvent, 
                        notificationChannels: { 
                          ...newChainEvent.notificationChannels, 
                          telegram: e.target.checked 
                        } 
                      })}
                      className="mr-2"
                    />
                    <label>Telegram (高优先级)</label>
                  </div>
                  {newChainEvent.notificationChannels.telegram && (
                    <div className="ml-6 mt-1">
                      <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Telegram Chat ID</label>
                      <input
                        type="text"
                        value={newChainEvent.telegramChatId}
                        onChange={(e) => setNewChainEvent({ ...newChainEvent, telegramChatId: e.target.value })}
                        className="w-full px-3 py-1.5 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                        placeholder="输入Telegram Chat ID"
                      />
                    </div>
                  )}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newChainEvent.notificationChannels.webhook}
                      onChange={(e) => setNewChainEvent({ 
                        ...newChainEvent, 
                        notificationChannels: { 
                          ...newChainEvent.notificationChannels, 
                          webhook: e.target.checked 
                        } 
                      })}
                      className="mr-2"
                    />
                    <label>Webhook (给开发者)</label>
                  </div>
                  {newChainEvent.notificationChannels.webhook && (
                    <div className="ml-6 mt-1">
                      <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Webhook URL</label>
                      <input
                        type="url"
                        value={newChainEvent.webhookUrl}
                        onChange={(e) => setNewChainEvent({ ...newChainEvent, webhookUrl: e.target.value })}
                        className="w-full px-3 py-1.5 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                        placeholder="输入Webhook URL"
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowChainEventModal(false)}
                  className="flex-1 px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  创建
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Navigation Bar */}
      <Navigation />
    </div>
  );
};

export default Task;