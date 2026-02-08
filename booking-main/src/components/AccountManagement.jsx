import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useSettings } from '../context/SettingsContext';
import Navigation from './Navigation';
import CommonHeader from './CommonHeader';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import { useTranslation } from '../hooks/useTranslation';
import api from '../services/api';

/**
 * 账户管理页面组件
 * 实现账户列表展示、添加新账户和切换账户功能
 */
const AccountManagement = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { darkMode } = useSettings();
  const { t } = useTranslation();
  
  // 状态管理
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [showAddAccountModal, setShowAddAccountModal] = useState(false);
  const [newAccount, setNewAccount] = useState({
    name: '',
    platform: 'binance',
    apiKey: '',
    secretKey: ''
  });
  // Secret Key显示状态管理
  const [showSecretKey, setShowSecretKey] = useState(false);

  /**
   * 获取账户列表
   */
  const fetchAccounts = async () => {
    try {
      setLoading(true);
      setError(null);
      setMessage(null);
      // 这里应该调用实际的API获取账户列表
      // 暂时使用模拟数据
      const mockAccounts = [
        {
          id: 1,
          name: 'Main Binance Account',
          platform: 'binance',
          isActive: true,
          isConnected: true
        },
        {
          id: 2,
          name: 'Test Binance Account',
          platform: 'binance',
          isActive: false,
          isConnected: true
        }
      ];
      setAccounts(mockAccounts);
    } catch (err) {
      setError(err.message || '获取账户列表失败');
      console.error('Error fetching accounts:', err);
    } finally {
      setLoading(false);
    }
  };

  // 初始加载
  useEffect(() => {
    fetchAccounts();
  }, []);

  /**
   * 处理切换账户
   */
  const handleSwitchAccount = (accountId) => {
    try {
      // 这里应该调用实际的API切换账户
      setAccounts(accounts.map(account => ({
        ...account,
        isActive: account.id === accountId
      })));
      setMessage('账户切换成功');
      // 3秒后清除消息
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setError(err.message || '切换账户失败');
    }
  };

  /**
   * 处理添加新账户
   */
  const handleAddAccount = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      setMessage(null);
      // 这里应该调用实际的API添加账户
      // 暂时模拟添加账户
      const newAccountData = {
        id: accounts.length + 1,
        name: newAccount.name,
        platform: newAccount.platform,
        isActive: false,
        isConnected: true
      };
      setAccounts([...accounts, newAccountData]);
      setShowAddAccountModal(false);
      setNewAccount({
        name: '',
        platform: 'binance',
        apiKey: '',
        secretKey: ''
      });
      setMessage('账户添加成功');
      // 3秒后清除消息
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setError(err.message || '添加账户失败');
      console.error('Error adding account:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 处理删除账户
   */
  const handleDeleteAccount = async (accountId) => {
    if (window.confirm(t('confirmDeleteAccount'))) {
      try {
        setLoading(true);
        setError(null);
        setMessage(null);
        // 这里应该调用实际的API删除账户
        setAccounts(accounts.filter(account => account.id !== accountId));
        setMessage('账户删除成功');
        // 3秒后清除消息
        setTimeout(() => setMessage(null), 3000);
      } catch (err) {
        setError(err.message || '删除账户失败');
        console.error('Error deleting account:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="relative flex min-h-screen w-full flex-col max-w-[480px] mx-auto bg-background-light dark:bg-background-dark">
        <CommonHeader title={t('accountManagement')} showBackButton={true} />
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
        <CommonHeader title={t('accountManagement')} showBackButton={true} />
        <main className="flex-1 p-4">
          <ErrorMessage message={error} onClose={() => setError(null)} />
        </main>
        <Navigation />
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col max-w-[480px] mx-auto bg-background-light dark:bg-background-dark">
      {/* 头部 */}
      <CommonHeader title={t('accountManagement')} showBackButton={true} />
      
      {/* 主要内容 */}
      <main className="flex-1">
        {/* 消息提示 */}
        {(message || error) && (
          <div className="px-4 py-2">
            {message && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 px-4 py-2 rounded-lg mb-2 animate-fade-in">
                <p className="text-sm font-medium">{message}</p>
              </div>
            )}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-2 rounded-lg mb-2 animate-fade-in">
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}
          </div>
        )}
        
        {/* 账户列表 */}
        <div className="px-4">
          <h3 className="text-slate-900 dark:text-white text-sm font-bold uppercase tracking-wider pb-2 pt-4">{t('accounts')}</h3>
          <div className="bg-white dark:bg-[#1c2630] rounded-xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 animate-fade-in">
            {accounts.length > 0 ? (
              accounts.map((account) => (
                <div 
                  key={account.id} 
                  className={`flex items-center gap-4 px-4 min-h-[72px] py-2 justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-200 ${account.isActive ? 'bg-slate-50 dark:bg-slate-800/30' : ''}`}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div 
                      className="bg-center bg-no-repeat aspect-square bg-cover rounded-lg h-10 w-10 transition-transform duration-200 hover:scale-105"
                      style={{ 
                        backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDsACUCh86CFmbpUsyEmxuA2DYSiolfbw0r6kzm230hzyvXI_YbJBfuQ6OdEjz_Asu7Sv5BTD5wpCQeXdySf8ioCdyp0Uhug8RxeNg2TBNcmO93JvjJE4a0svQ9u90qPkjFD9DgPYIy7Qbt1bjjBncFzBzA_Q0RhkF0kZ-m4AgOVApwaMQzmPqq6p4sgNcv6t1eldYyWtMDZG9NTvHkg4DJlzPKFLuaWmcBehm8cFXw9TTSeAuR-IJ5xsT79oxhiqAhuEew9CbJk0fe")' 
                      }}
                    >
                    </div>
                    <div className="flex flex-col justify-center flex-1">
                      <p className="text-slate-900 dark:text-white text-base font-medium leading-normal line-clamp-1">{account.name}</p>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-normal leading-normal ${account.isConnected ? 'text-emerald-500' : 'text-slate-500 dark:text-[#92adc9]'}`}>
                          {account.isConnected ? t('connected') : t('disconnected')}
                        </span>
                        {account.isActive && (
                          <span className="text-xs font-medium px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                            {t('active')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!account.isActive && (
                      <button
                        onClick={() => handleSwitchAccount(account.id)}
                        className="text-primary hover:text-primary/80 transition-colors"
                      >
                        <span className="material-symbols-outlined">check_circle</span>
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteAccount(account.id)}
                      className="text-slate-400 hover:text-rose-500 transition-colors"
                    >
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-slate-500 dark:text-slate-400">
                <span className="material-symbols-outlined text-4xl mb-4">account_circle</span>
                <p className="text-sm">{t('noAccounts')}</p>
                <p className="text-xs mt-1">{t('addFirstAccount')}</p>
              </div>
            )}
          </div>
        </div>
        
        {/* 添加新账户按钮 */}
        <div className="px-4 mt-6">
          <button
            onClick={() => setShowAddAccountModal(true)}
            className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30"
          >
            <span className="material-symbols-outlined">person_add</span>
            <span>{t('addNewAccount')}</span>
          </button>
        </div>
      </main>
      
      {/* 底部导航 */}
      <Navigation />
      
      {/* 添加账户模态框 */}
      {showAddAccountModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white dark:bg-[#1c2630] rounded-xl w-[90%] max-w-[400px] p-5 animate-slide-up">
            <h4 className="text-slate-900 dark:text-white text-lg font-bold mb-4">{t('addNewAccount')}</h4>
            <form onSubmit={handleAddAccount} className="space-y-4">
              <div>
                <label className="block text-slate-500 dark:text-[#92adc9] text-xs font-semibold mb-1">{t('accountName')}</label>
                <input
                  type="text"
                  value={newAccount.name}
                  onChange={(e) => setNewAccount({ ...newAccount, name: e.target.value })}
                  required
                  className="w-full bg-slate-50 dark:bg-background-dark border-none rounded-lg text-slate-900 dark:text-white text-sm py-3 px-4 focus:ring-2 focus:ring-primary transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-slate-500 dark:text-[#92adc9] text-xs font-semibold mb-1">{t('platform')}</label>
                <select
                  value={newAccount.platform}
                  onChange={(e) => setNewAccount({ ...newAccount, platform: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-background-dark border-none rounded-lg text-slate-900 dark:text-white text-sm py-3 px-4 focus:ring-2 focus:ring-primary transition-all duration-200"
                >
                  <option value="binance">Binance</option>
                  <option value="okx">OKX</option>
                  <option value="bybit">Bybit</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-500 dark:text-[#92adc9] text-xs font-semibold mb-1">API Key</label>
                <input
                  type="text"
                  value={newAccount.apiKey}
                  onChange={(e) => setNewAccount({ ...newAccount, apiKey: e.target.value })}
                  required
                  className="w-full bg-slate-50 dark:bg-background-dark border-none rounded-lg text-slate-900 dark:text-white text-sm py-3 px-4 focus:ring-2 focus:ring-primary transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-slate-500 dark:text-[#92adc9] text-xs font-semibold mb-1">Secret Key</label>
                <div className="relative">
                  <input
                    type={showSecretKey ? 'text' : 'password'}
                    value={newAccount.secretKey}
                    onChange={(e) => setNewAccount({ ...newAccount, secretKey: e.target.value })}
                    required
                    className="w-full bg-slate-50 dark:bg-background-dark border-none rounded-lg text-slate-900 dark:text-white text-sm py-3 px-4 focus:ring-2 focus:ring-primary pr-12 transition-all duration-200"
                  />
                  <div 
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer transition-all duration-200 hover:text-slate-600 dark:hover:text-white hover:scale-110"
                    onClick={() => setShowSecretKey(!showSecretKey)}
                  >
                    <span className="material-symbols-outlined text-[20px]">{showSecretKey ? 'visibility_off' : 'visibility'}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddAccountModal(false)}
                  className="flex-1 py-3 px-4 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 font-medium transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 bg-primary hover:bg-primary/90 text-white font-medium rounded-xl transition-all duration-200"
                >
                  {t('save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountManagement;