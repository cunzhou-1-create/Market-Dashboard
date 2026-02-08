import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useSettings } from '../context/SettingsContext';
import Navigation from './Navigation';
import LanguageSelector from './LanguageSelector';
import CommonHeader from './CommonHeader';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import { useTranslation } from '../hooks/useTranslation';
import api from '../services/api';

/**
 * API Key输入组件
 * 可重用的API Key输入框，包含显示/隐藏功能和连接状态指示器
 */
const ApiKeyInput = ({ label, value, isConnected, showKey, onToggleShow }) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-2">
      <label className="text-slate-500 dark:text-[#92adc9] text-xs font-semibold">{label}</label>
      <div className="relative">
        <input 
          className="w-full bg-slate-50 dark:bg-background-dark border-none rounded-lg text-slate-900 dark:text-white text-sm py-3 px-4 focus:ring-2 focus:ring-primary pr-12 transition-all duration-200" 
          type={showKey ? "text" : "password"} 
          defaultValue={value} 
        />
        <div 
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer transition-all duration-200 hover:text-slate-600 dark:hover:text-white hover:scale-110"
          onClick={onToggleShow}
        >
          <span className="material-symbols-outlined text-[20px]">{showKey ? "visibility_off" : "visibility"}</span>
        </div>
      </div>
      <div className="flex items-center gap-1.5 mt-1">
            <div className={`size-2 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></div>
            <span className={`text-[10px] ${isConnected ? 'text-emerald-500' : 'text-slate-400'} font-bold uppercase tracking-tight`}>
              {isConnected ? t('connected') : t('disconnected')}
            </span>
          </div>
    </div>
  );
};

/**
 * 设置组件
 * 包含账户管理、AI集成、通知设置和偏好设置等功能
 */
const Settings = () => {
  const navigate = useNavigate();
  const { user, logout, updateEmail } = useUser();
  const { darkMode, toggleDarkMode, emailAlerts, toggleEmailAlerts, language } = useSettings();
  const { t } = useTranslation();
  
  // API Key显示模式状态管理
  const [showQwenApiKey, setShowQwenApiKey] = useState(false);
  // 其他接口展开状态管理
  const [showOtherApis, setShowOtherApis] = useState(false);
  // 其他LLM接口显示模式状态管理
  const [showOpenAiApiKey, setShowOpenAiApiKey] = useState(false);
  const [showAnthropicApiKey, setShowAnthropicApiKey] = useState(false);
  // 语言选择器模态框状态管理
  const [isLanguageSelectorOpen, setIsLanguageSelectorOpen] = useState(false);
  // 邮箱状态管理
  const [email, setEmail] = useState(user?.email || '');
  
  // API密钥和设置状态
  const [apiKeys, setApiKeys] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [showAddApiKeyModal, setShowAddApiKeyModal] = useState(false);
  const [newApiKey, setNewApiKey] = useState({
    provider: '',
    apiKey: ''
  });
  // API密钥显示状态管理
  const [apiKeyVisibility, setApiKeyVisibility] = useState({});

  // 处理API密钥显示/隐藏切换
  const handleToggleApiKeyVisibility = (apiKeyId) => {
    setApiKeyVisibility(prev => ({
      ...prev,
      [apiKeyId]: !prev[apiKeyId]
    }));
  };

  /**
   * 获取用户设置和API密钥
   */
  const fetchSettingsAndApiKeys = async () => {
    try {
      setLoading(true);
      setError(null);
      setMessage(null);
      
      // 并行获取设置和API密钥
      const [settingsData, apiKeysData] = await Promise.all([
        api.settings.getSettings(),
        api.settings.getApiKeys()
      ]);
      
      setSettings(settingsData);
      setApiKeys(Array.isArray(apiKeysData) ? apiKeysData : []);
    } catch (err) {
      setError(err.message || '获取设置失败');
      console.error('Error fetching settings:', err);
    } finally {
      setLoading(false);
    }
  };

  // 初始加载
  useEffect(() => {
    fetchSettingsAndApiKeys();
  }, []);

  /**
   * 处理退出登录
   * 清除用户状态并导航到登录页面
   */
  const handleSignOut = () => {
    logout();
    navigate('/auth');
  };

  /**
   * 处理更新用户设置
   */
  const handleUpdateSettings = async (updateData) => {
    try {
      setIsLoading(true);
      setError(null);
      await api.settings.updateSettings(updateData);
      setMessage('设置更新成功');
      await fetchSettingsAndApiKeys(); // 刷新设置
    } catch (err) {
      setError(err.message || '更新设置失败');
      console.error('Error updating settings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 处理更新邮件通知设置
   */
  const handleUpdateEmailNotifications = async (notificationSettings) => {
    try {
      setIsLoading(true);
      setError(null);
      await api.settings.updateEmailNotifications(notificationSettings);
      setMessage('邮件通知设置更新成功');
      await fetchSettingsAndApiKeys(); // 刷新设置
    } catch (err) {
      setError(err.message || '更新邮件通知设置失败');
      console.error('Error updating email notifications:', err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 处理添加API密钥
   */
  const handleAddApiKey = async (e) => {
    e.preventDefault();
    try {
      // 显示模态框加载状态
      setLoading(true);
      setError(null);
      setMessage(null);
      
      // 添加API密钥
      const response = await api.settings.addApiKey(newApiKey);
      
      // 关闭模态框
      setShowAddApiKeyModal(false);
      setNewApiKey({ provider: '', apiKey: '' });
      
      // 刷新API密钥列表
      await fetchSettingsAndApiKeys();
      
      // 显示成功消息
      setMessage('API密钥添加成功！' + (response.is_connected ? ' 密钥已激活。' : ' 密钥未激活，请检查。'));
      
      // 3秒后自动清除成功消息
      setTimeout(() => {
        setMessage(null);
      }, 3000);
    } catch (err) {
      // 显示错误消息
      setError(err.message || '添加API密钥失败');
      
      // 5秒后自动清除错误消息
      setTimeout(() => {
        setError(null);
      }, 5000);
    } finally {
      // 隐藏加载状态
      setLoading(false);
    }
  };

  /**
   * 处理删除API密钥
   */
  const handleDeleteApiKey = async (apiKeyId) => {
    if (window.confirm('确定要删除这个API密钥吗？')) {
      try {
        setLoading(true);
        await api.settings.deleteApiKey(apiKeyId);
        fetchSettingsAndApiKeys(); // 刷新API密钥
      } catch (err) {
        setError(err.message || '删除API密钥失败');
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="relative flex min-h-screen w-full flex-col max-w-[480px] mx-auto bg-background-light dark:bg-background-dark">
        <CommonHeader title={t('accountSettings')} showBackButton={true} />
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
        <CommonHeader title={t('accountSettings')} showBackButton={true} />
        <main className="flex-1 p-4">
          <ErrorMessage message={error} onClose={() => setError(null)} />
        </main>
        <Navigation />
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col max-w-[480px] mx-auto bg-background-light dark:bg-background-dark text-slate-900 dark:text-white shadow-2xl">
      {/* TopAppBar */}
      <CommonHeader title={t('accountSettings')} showBackButton={true} />
      
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
                <p className="text-slate-500 dark:text-[#92adc9] text-xs font-normal leading-normal">{t('activeSince')} {user?.joinedAt}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Message and Error Display */}
        {(message || error) && (
          <div className="px-4 py-2">
            {message && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg mb-2">
                <p className="text-sm font-medium">{message}</p>
              </div>
            )}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg mb-2">
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}
          </div>
        )}
        
        {/* Section: Account Management */}
        <h3 className="text-slate-900 dark:text-white text-sm font-bold uppercase tracking-wider px-4 pb-2 pt-4">{t('accountManagement')}</h3>
        <div className="bg-white dark:bg-[#1c2630] mx-4 rounded-xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
          {/* ListItem: Switch Account */}
          <div 
            className="flex items-center gap-4 px-4 min-h-[72px] py-2 justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-all duration-200"
            onClick={() => navigate('/account-management')}
          >
            <div className="flex items-center gap-4">
              <div 
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-lg h-10 w-10 transition-transform duration-200 hover:scale-105" 
                data-alt="Binance logo icon" 
                style={{ 
                  backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDsACUCh86CFmbpUsyEmxuA2DYSiolfbw0r6kzm230hzyvXI_YbJBfuQ6OdEjz_Asu7Sv5BTD5wpCQeXdySf8ioCdyp0Uhug8RxeNg2TBNcmO93JvjJE4a0svQ9u90qPkjFD9DgPYIy7Qbt1bjjBncFzBzA_Q0RhkF0kZ-m4AgOVApwaMQzmPqq6p4sgNcv6t1eldYyWtMDZG9NTvHkg4DJlzPKFLuaWmcBehm8cFXw9TTSeAuR-IJ5xsT79oxhiqAhuEew9CbJk0fe")' 
                }}
              >
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-slate-900 dark:text-white text-base font-medium leading-normal line-clamp-1">{t('switchAccount')}</p>
                <p className="text-slate-500 dark:text-[#92adc9] text-xs font-normal leading-normal line-clamp-2">{t('activeMainAccount')}</p>
              </div>
            </div>
            <div className="shrink-0 transition-transform duration-200 hover:translate-x-1">
              <span className="material-symbols-outlined text-slate-400">chevron_right</span>
            </div>
          </div>
          
          {/* ListItem: Add New */}
          <div 
            className="flex items-center gap-4 px-4 min-h-14 justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-all duration-200"
            onClick={() => navigate('/account-management')}
          >
            <div className="flex items-center gap-4">
              <div className="text-primary flex items-center justify-center rounded-lg bg-primary/10 shrink-0 size-10 transition-transform duration-200 hover:scale-105">
                <span className="material-symbols-outlined">person_add</span>
              </div>
              <p className="text-slate-900 dark:text-white text-base font-normal leading-normal flex-1 truncate">{t('addNewAccount')}</p>
            </div>
            <div className="shrink-0 transition-transform duration-200 hover:scale-110">
              <span className="material-symbols-outlined text-slate-400">add</span>
            </div>
          </div>
        </div>
        
        {/* Section: AI & Integrations */}
        <h3 className="text-slate-900 dark:text-white text-sm font-bold uppercase tracking-wider px-4 pb-2 pt-6">{t('aiIntegrations')}</h3>
        <div className="bg-white dark:bg-[#1c2630] mx-4 rounded-xl overflow-hidden p-4 flex flex-col gap-4">
          {/* API密钥列表 */}
          {apiKeys.length > 0 ? (
            <div className="space-y-4">
              {apiKeys.map((apiKey) => (
                <div key={apiKey.id} className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-slate-500 dark:text-[#92adc9] text-xs font-semibold">
                      {apiKey.provider}
                    </label>
                    <button
                      onClick={() => handleDeleteApiKey(apiKey.id)}
                      className="text-slate-400 hover:text-rose-500 transition-colors"
                    >
                      <span className="material-symbols-outlined text-xs">delete</span>
                    </button>
                  </div>
                  <ApiKeyInput 
                    label="" 
                    value={apiKey.api_key}
                    isConnected={true}
                    showKey={apiKeyVisibility[apiKey.id]}
                    onToggleShow={() => handleToggleApiKeyVisibility(apiKey.id)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-6 text-slate-500 dark:text-slate-400">
              <span className="material-symbols-outlined block mx-auto mb-2">api</span>
              <p className="text-sm">暂无API密钥</p>
            </div>
          )}
          
          {/* 添加API密钥按钮 */}
          <button
            onClick={() => setShowAddApiKeyModal(true)}
            className="flex items-center justify-center gap-2 mt-2 py-3 px-4 bg-slate-100 dark:bg-slate-800/50 rounded-lg transition-all duration-200 hover:bg-slate-200 dark:hover:bg-slate-700/50"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">添加API密钥</span>
          </button>
        </div>
        
        {/* Section: Notifications */}
        <h3 className="text-slate-900 dark:text-white text-sm font-bold uppercase tracking-wider px-4 pb-2 pt-6">{t('notifications')}</h3>
        <div className="bg-white dark:bg-[#1c2630] mx-4 rounded-xl overflow-hidden p-4 flex flex-col gap-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex flex-col">
              <p className="text-slate-900 dark:text-white text-base font-medium">{t('emailAlerts')}</p>
              <p className="text-slate-500 dark:text-[#92adc9] text-xs">接收价格预警邮件</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer transition-transform duration-200 hover:scale-105">
              <input 
                checked={emailAlerts} 
                onChange={toggleEmailAlerts}
                className="sr-only peer" 
                type="checkbox" 
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all duration-300 peer-checked:bg-primary"></div>
            </label>
          </div>
          <input 
            className="w-full bg-slate-50 dark:bg-background-dark border-none rounded-lg text-slate-900 dark:text-white text-sm py-3 px-4 focus:ring-2 focus:ring-primary transition-all duration-200" 
            placeholder={t('email')} 
            type="email" 
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              updateEmail(e.target.value);
            }}
          />
          {emailAlerts && (
            <div className="flex flex-col gap-2 pt-2">
              <span className="text-xs text-slate-500 dark:text-[#92adc9]">通知类型</span>
              <div className="flex items-center gap-2 bg-slate-50 dark:bg-background-dark p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    className="rounded" 
                    checked={true}
                    readOnly
                  />
                  <span className="text-sm">价格预警</span>
                </div>
                <div className="ml-auto text-xs text-slate-400">
                  默认开启
                </div>
              </div>
              <div className="text-right">
                <button className="text-sm text-primary hover:underline">
                  高级设置
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Section: Preferences */}
        <h3 className="text-slate-900 dark:text-white text-sm font-bold uppercase tracking-wider px-4 pb-2 pt-6">{t('preferences')}</h3>
        <div className="bg-white dark:bg-[#1c2630] mx-4 rounded-xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
          {/* Theme Selection */}
          <div className="flex items-center gap-4 px-4 min-h-14 justify-between">
            <div className="flex items-center gap-4">
              <div className="text-slate-500 dark:text-white flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0 size-10 transition-transform duration-200 hover:scale-105">
                <span className="material-symbols-outlined">dark_mode</span>
              </div>
              <p className="text-slate-900 dark:text-white text-base font-normal">{t('theme')}</p>
            </div>
            <div className="flex bg-slate-100 dark:bg-background-dark p-1 rounded-lg">
              <button 
                className={`px-3 py-1 text-xs font-bold rounded-md ${darkMode ? 'bg-white dark:bg-slate-800 shadow-sm text-primary' : 'text-slate-500 dark:text-[#92adc9]'} transition-all duration-200 hover:opacity-90`}
                onClick={toggleDarkMode}
              >
                {t('dark')}
              </button>
              <button 
                className={`px-3 py-1 text-xs font-bold rounded-md ${!darkMode ? 'bg-white dark:bg-slate-800 shadow-sm text-primary' : 'text-slate-500 dark:text-[#92adc9]'} transition-all duration-200 hover:opacity-90`}
                onClick={toggleDarkMode}
              >
                {t('light')}
              </button>
            </div>
          </div>
          
          {/* Language */}
          <div 
            className="flex items-center gap-4 px-4 min-h-14 justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-all duration-200"
            onClick={() => setIsLanguageSelectorOpen(true)}
          >
            <div className="flex items-center gap-4">
              <div className="text-slate-500 dark:text-white flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0 size-10 transition-transform duration-200 hover:scale-105">
                <span className="material-symbols-outlined">language</span>
              </div>
              <p className="text-slate-900 dark:text-white text-base font-normal">{t('language')}</p>
            </div>
            <div className="flex items-center gap-2 transition-transform duration-200 hover:translate-x-1">
              <span className="text-sm text-slate-500 dark:text-[#92adc9]">{language === 'en' ? t('english') : t('chinese')}</span>
              <span className="material-symbols-outlined text-slate-400">chevron_right</span>
            </div>
          </div>
        </div>
        
        {/* Section: Subscription Management */}
        <h3 className="text-slate-900 dark:text-white text-sm font-bold uppercase tracking-wider px-4 pb-2 pt-6">{t('subscriptionManagement')}</h3>
        <div className="bg-white dark:bg-[#1c2630] mx-4 rounded-xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
          {/* Free Trial */}
          <div className="flex items-center gap-4 px-4 min-h-14 justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-all duration-200">
            <div className="flex items-center gap-4">
              <div className="text-emerald-500 flex items-center justify-center rounded-lg bg-emerald-500/10 shrink-0 size-10 transition-transform duration-200 hover:scale-105">
                <span className="material-symbols-outlined">event_available</span>
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-slate-900 dark:text-white text-base font-medium">{t('freeTrial')}</p>
                <p className="text-emerald-500 text-xs">{t('threeDayTrial')}</p>
              </div>
            </div>
            <div className="shrink-0">
              <button className="bg-emerald-500 text-white text-sm font-bold py-2 px-4 rounded-lg transition-all duration-200 hover:bg-emerald-600 hover:scale-105 hover:shadow-lg">{t('startTrial')}</button>
            </div>
          </div>
          
          {/* Monthly Subscription */}
          <div className="flex items-center gap-4 px-4 min-h-14 justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-all duration-200">
            <div className="flex items-center gap-4">
              <div className="text-primary flex items-center justify-center rounded-lg bg-primary/10 shrink-0 size-10 transition-transform duration-200 hover:scale-105">
                <span className="material-symbols-outlined">analytics</span>
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-slate-900 dark:text-white text-base font-medium">{t('monthlySubscription')}</p>
                <p className="text-slate-500 dark:text-[#92adc9] text-xs">{t('paymentMethod')}</p>
              </div>
            </div>
            <div className="shrink-0 transition-transform duration-200 hover:translate-x-1">
              <span className="material-symbols-outlined text-slate-400">chevron_right</span>
            </div>
          </div>
          
          {/* Subscription Status */}
          <div className="flex items-center gap-4 px-4 min-h-14 justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-all duration-200">
            <div className="flex items-center gap-4">
              <div className="text-slate-500 dark:text-white flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0 size-10 transition-transform duration-200 hover:scale-105">
                <span className="material-symbols-outlined">receipt_long</span>
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-slate-900 dark:text-white text-base font-medium">{t('subscriptionManagement')}</p>
                <p className="text-slate-500 dark:text-[#92adc9] text-xs">未订阅 • {t('freeTrial')}</p>
              </div>
            </div>
            <div className="shrink-0 transition-transform duration-200 hover:translate-x-1">
              <span className="material-symbols-outlined text-slate-400">chevron_right</span>
            </div>
          </div>
        </div>
        
        {/* Danger Zone */}
           <div className="mt-8 px-4 flex flex-col gap-3">
             <button 
               className="w-full py-4 bg-white dark:bg-slate-800/30 text-slate-600 dark:text-slate-400 font-bold rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-200 hover:shadow-md"
               onClick={handleSignOut}
             >
               {t('signOut')}
             </button>
           </div>
        
        {/* Footer Info */}
        <div className="mt-8 flex flex-col items-center gap-1 opacity-50">
          <p className="text-[10px] text-slate-500 dark:text-[#92adc9] uppercase tracking-[0.2em] font-bold">{t('qwenAiMarketHub')}</p>
          <p className="text-[10px] text-slate-500 dark:text-[#92adc9]">{t('version')}</p>
        </div>
      </div>
      
      {/* Navigation Bar */}
      <Navigation />
      
      {/* 添加API密钥模态框 */}
      {showAddApiKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 w-full max-w-md">
            <h3 className="font-bold text-lg mb-4">添加API密钥</h3>
            <form onSubmit={handleAddApiKey} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">服务提供商</label>
                <select
                  value={newApiKey.provider}
                  onChange={(e) => setNewApiKey({ ...newApiKey, provider: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">选择提供商</option>
                  <option value="qwen">Qwen AI</option>
                  <option value="openai">OpenAI</option>
                  <option value="anthropic">Anthropic</option>
                  <option value="binance">Binance</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">API密钥</label>
                <input
                  type="text"
                  value={newApiKey.apiKey}
                  onChange={(e) => setNewApiKey({ ...newApiKey, apiKey: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="输入API密钥"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddApiKeyModal(false)}
                  className="flex-1 px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  添加
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Language Selector Modal */}
      <LanguageSelector 
        isOpen={isLanguageSelectorOpen}
        onClose={() => setIsLanguageSelectorOpen(false)}
      />
    </div>
  );
};

export default Settings;