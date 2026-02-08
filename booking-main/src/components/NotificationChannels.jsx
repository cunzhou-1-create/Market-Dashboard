import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from './Navigation';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import api from '../services/api';
import { useUser } from '../context/UserContext';

/**
 * 通知渠道管理组件
 * 管理邮件、Telegram、Webhook等通知渠道
 */
const NotificationChannels = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [channels, setChannels] = useState({
    email: {
      enabled: true,
      email: '',
      required: true
    },
    telegram: {
      enabled: false,
      chat_id: '',
      required: false
    },
    webhook: {
      enabled: false,
      url: '',
      required: false
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [testing, setTesting] = useState(null);
  const [testResult, setTestResult] = useState(null);

  // 获取通知渠道配置
  const fetchNotificationChannels = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await api.settings.getNotificationChannels();
      setChannels(data.channels);
    } catch (err) {
      const errorMessage = err.message || '获取通知渠道配置失败';
      setError(errorMessage);
      console.error('Error fetching notification channels:', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // 初始加载数据
  useEffect(() => {
    fetchNotificationChannels();
  }, []);

  // 处理更新通知渠道配置
  const handleUpdateChannels = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      setSuccessMessage(null);
      
      await api.settings.updateNotificationChannels({ channels });
      setSuccessMessage('通知渠道配置已更新');
      
      // 3秒后清除成功消息
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      const errorMessage = err.message || '更新通知渠道配置失败';
      setError(errorMessage);
      console.error('Error updating notification channels:', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // 处理测试Telegram通知
  const handleTestTelegram = async () => {
    if (!channels.telegram.chat_id) {
      setError('请输入Telegram Chat ID');
      return;
    }
    
    try {
      setTesting('telegram');
      setError(null);
      setTestResult(null);
      
      const result = await api.settings.testTelegramNotification({ chat_id: channels.telegram.chat_id });
      setTestResult({
        channel: 'telegram',
        success: result.success,
        message: result.message
      });
    } catch (err) {
      const errorMessage = err.message || '测试Telegram通知失败';
      setError(errorMessage);
      console.error('Error testing Telegram notification:', errorMessage);
    } finally {
      setTesting(null);
    }
  };

  // 处理测试Webhook通知
  const handleTestWebhook = async () => {
    if (!channels.webhook.url) {
      setError('请输入Webhook URL');
      return;
    }
    
    try {
      setTesting('webhook');
      setError(null);
      setTestResult(null);
      
      const result = await api.settings.testWebhookNotification({ url: channels.webhook.url });
      setTestResult({
        channel: 'webhook',
        success: result.success,
        message: result.message
      });
    } catch (err) {
      const errorMessage = err.message || '测试Webhook通知失败';
      setError(errorMessage);
      console.error('Error testing Webhook notification:', errorMessage);
    } finally {
      setTesting(null);
    }
  };

  // 处理测试邮件通知
  const handleTestEmail = async () => {
    try {
      setTesting('email');
      setError(null);
      setTestResult(null);
      
      const result = await api.settings.testEmailNotification({});
      setTestResult({
        channel: 'email',
        success: result.success,
        message: result.message
      });
    } catch (err) {
      const errorMessage = err.message || '测试邮件通知失败';
      setError(errorMessage);
      console.error('Error testing email notification:', errorMessage);
    } finally {
      setTesting(null);
    }
  };

  // 检查登录状态
  if (!user) {
    return (
      <div className="relative flex min-h-screen w-full flex-col max-w-[480px] mx-auto bg-background-light dark:bg-background-dark text-slate-900 dark:text-white overflow-x-hidden">
        <header className="sticky top-0 z-10 flex flex-col gap-2 bg-background-light dark:bg-background-dark p-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center h-12 justify-between">
            <div className="flex size-12 shrink-0 items-center justify-start">
              <span className="material-symbols-outlined text-slate-700 dark:text-white text-3xl">notifications</span>
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
            <h1 className="text-slate-900 dark:text-white tracking-tight text-[32px] font-bold leading-tight">通知渠道</h1>
          </div>
        </header>
        <main className="flex-1 flex flex-col items-center justify-center p-8">
          <span className="material-symbols-outlined text-6xl text-slate-400 mb-6">lock</span>
          <h2 className="text-xl font-bold mb-2">需要登录</h2>
          <p className="text-slate-500 dark:text-slate-400 text-center mb-8">请先登录以查看和管理通知渠道</p>
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
          <h1 className="text-2xl font-bold">通知渠道</h1>
        </header>
        <main className="flex-1 flex items-center justify-center">
          <LoadingSpinner />
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
            <span className="material-symbols-outlined text-slate-700 dark:text-white text-3xl">notifications</span>
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
          <h1 className="text-slate-900 dark:text-white tracking-tight text-[32px] font-bold leading-tight">通知渠道</h1>
          <p className="text-slate-500 dark:text-[#92adc9] text-sm">管理您的通知接收方式</p>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-1 flex flex-col max-w-[480px] mx-auto w-full pb-24">
        {/* 操作栏 */}
        <div className="p-4 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">通知渠道管理</h3>
          </div>
        </div>

        {/* 通知渠道配置表单 */}
        <div className="flex-1 p-4">
          {error && (
            <ErrorMessage message={error} onClose={() => setError(null)} />
          )}
          
          {successMessage && (
            <div className="mb-4 p-3 bg-emerald-500/10 text-emerald-500 rounded-lg text-sm">
              {successMessage}
            </div>
          )}
          
          {testResult && (
            <div className={`mb-4 p-3 ${testResult.success ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'} rounded-lg text-sm`}>
              {testResult.message}
            </div>
          )}
          
          <form onSubmit={handleUpdateChannels} className="space-y-6">
            {/* 邮件渠道 */}
            <div className="bg-white/50 dark:bg-slate-800/50 rounded-xl p-4 border border-transparent dark:border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-blue-500">mail</span>
                  <h4 className="font-semibold text-sm">邮件通知</h4>
                  <span className="text-xs px-2 py-0.5 bg-blue-500/10 text-blue-500 rounded-full">必选</span>
                </div>
                <input
                  type="checkbox"
                  checked={channels.email.enabled}
                  onChange={(e) => setChannels({
                    ...channels,
                    email: {
                      ...channels.email,
                      enabled: true // 邮件始终启用
                    }
                  })}
                  className="mr-2"
                  disabled
                />
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">邮箱地址</label>
                  <input
                    type="email"
                    value={channels.email.email || user.email}
                    onChange={(e) => setChannels({
                      ...channels,
                      email: {
                        ...channels.email,
                        email: e.target.value
                      }
                    })}
                    className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    placeholder="输入邮箱地址"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleTestEmail}
                  disabled={testing === 'email'}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                >
                  {testing === 'email' ? (
                    <>
                      <span className="material-symbols-outlined text-xs animate-spin">sync</span>
                      测试中...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-xs">send</span>
                      发送测试邮件
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Telegram渠道 */}
            <div className="bg-white/50 dark:bg-slate-800/50 rounded-xl p-4 border border-transparent dark:border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-purple-500">telegram</span>
                  <h4 className="font-semibold text-sm">Telegram通知</h4>
                  <span className="text-xs px-2 py-0.5 bg-purple-500/10 text-purple-500 rounded-full">高优先级</span>
                </div>
                <input
                  type="checkbox"
                  checked={channels.telegram.enabled}
                  onChange={(e) => setChannels({
                    ...channels,
                    telegram: {
                      ...channels.telegram,
                      enabled: e.target.checked
                    }
                  })}
                  className="mr-2"
                />
              </div>
              {channels.telegram.enabled && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Telegram Chat ID</label>
                    <input
                      type="text"
                      value={channels.telegram.chat_id}
                      onChange={(e) => setChannels({
                        ...channels,
                        telegram: {
                          ...channels.telegram,
                          chat_id: e.target.value
                        }
                      })}
                      className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                      placeholder="输入Telegram Chat ID"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleTestTelegram}
                    disabled={testing === 'telegram' || !channels.telegram.chat_id}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm"
                  >
                    {testing === 'telegram' ? (
                      <>
                        <span className="material-symbols-outlined text-xs animate-spin">sync</span>
                        测试中...
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-xs">send</span>
                        发送测试消息
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Webhook渠道 */}
            <div className="bg-white/50 dark:bg-slate-800/50 rounded-xl p-4 border border-transparent dark:border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-green-500">code</span>
                  <h4 className="font-semibold text-sm">Webhook通知</h4>
                  <span className="text-xs px-2 py-0.5 bg-green-500/10 text-green-500 rounded-full">开发者</span>
                </div>
                <input
                  type="checkbox"
                  checked={channels.webhook.enabled}
                  onChange={(e) => setChannels({
                    ...channels,
                    webhook: {
                      ...channels.webhook,
                      enabled: e.target.checked
                    }
                  })}
                  className="mr-2"
                />
              </div>
              {channels.webhook.enabled && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Webhook URL</label>
                    <input
                      type="url"
                      value={channels.webhook.url}
                      onChange={(e) => setChannels({
                        ...channels,
                        webhook: {
                          ...channels.webhook,
                          url: e.target.value
                        }
                      })}
                      className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                      placeholder="输入Webhook URL"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleTestWebhook}
                    disabled={testing === 'webhook' || !channels.webhook.url}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                  >
                    {testing === 'webhook' ? (
                      <>
                        <span className="material-symbols-outlined text-xs animate-spin">sync</span>
                        测试中...
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-xs">send</span>
                        发送测试Webhook
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* 保存按钮 */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                {loading ? (
                  <>
                    <span className="material-symbols-outlined text-xs animate-spin">sync</span>
                    保存中...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-xs">save</span>
                    保存配置
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* Navigation Bar */}
      <Navigation />
    </div>
  );
};

export default NotificationChannels;