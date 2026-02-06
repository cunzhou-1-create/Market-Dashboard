import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useSettings } from '../context/SettingsContext';
import Navigation from './Navigation';
import LanguageSelector from './LanguageSelector';
import CommonHeader from './CommonHeader';
import { useTranslation } from '../hooks/useTranslation';

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
        
        {/* Section: Account Management */}
        <h3 className="text-slate-900 dark:text-white text-sm font-bold uppercase tracking-wider px-4 pb-2 pt-4">{t('accountManagement')}</h3>
        <div className="bg-white dark:bg-[#1c2630] mx-4 rounded-xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
          {/* ListItem: Switch Account */}
          <div className="flex items-center gap-4 px-4 min-h-[72px] py-2 justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-all duration-200">
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
          <div className="flex items-center gap-4 px-4 min-h-14 justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-all duration-200">
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
          <ApiKeyInput 
            label={t('qwenApiKey')}
            value="sk-qwen-78x9234892347239487"
            isConnected={true}
            showKey={showQwenApiKey}
            onToggleShow={() => setShowQwenApiKey(!showQwenApiKey)}
          />
          
          {/* 添加其他接口按钮 */}
          <div 
            className="flex items-center justify-between mt-2 py-2 px-1 cursor-pointer transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-800/50 rounded-lg"
            onClick={() => setShowOtherApis(!showOtherApis)}
          >
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('addOtherApis')}</span>
            <span className="material-symbols-outlined text-slate-400 transition-all duration-200 transform">
              {showOtherApis ? "expand_less" : "expand_more"}
            </span>
          </div>
          
          {/* 其他LLM接口输入框 */}
          {showOtherApis && (
            <div className="flex flex-col gap-4 pt-2 border-t border-slate-200 dark:border-slate-800 animate-fade-in">
              {/* OpenAI API Key */}
              <ApiKeyInput 
                label={t('openaiApiKey')}
                value="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                isConnected={false}
                showKey={showOpenAiApiKey}
                onToggleShow={() => setShowOpenAiApiKey(!showOpenAiApiKey)}
              />
              
              {/* Anthropic API Key */}
              <ApiKeyInput 
                label={t('anthropicApiKey')}
                value="sk-ant-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                isConnected={false}
                showKey={showAnthropicApiKey}
                onToggleShow={() => setShowAnthropicApiKey(!showAnthropicApiKey)}
              />
            </div>
          )}
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
      
      {/* Language Selector Modal */}
      <LanguageSelector 
        isOpen={isLanguageSelectorOpen}
        onClose={() => setIsLanguageSelectorOpen(false)}
      />
    </div>
  );
};

export default Settings;