import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Navigation from './Navigation';
import { useApp } from '../context/AppContext';

/**
 * AI行情订阅组件
 * 单独的AI行情订阅页面，包含自定义提示词设置和AI评估结果
 */
const AiMarket = () => {
  const navigate = useNavigate();
  const { user, emailAlerts } = useApp();
  
  // AI行情订阅状态
  const [isSubscriptionEnabled, setIsSubscriptionEnabled] = useState(true);
  const [prompt, setPrompt] = useState('分析BTC/USDT的4小时K线图，考虑MACD和RSI指标，评估短期趋势并给出多空信号');
  const [frequency, setFrequency] = useState('1h');
  const [symbol, setSymbol] = useState('BTC/USDT');
  
  // 价格预警状态
  const [priceAlerts, setPriceAlerts] = useState([
    { id: 1, symbol: 'BTC', condition: '>', price: 70000, isEnabled: true },
    { id: 2, symbol: 'SOL', condition: '<', price: 150, isEnabled: true }
  ]);
  const [newAlert, setNewAlert] = useState({
    symbol: 'BTC',
    condition: '>',
    price: 70000
  });
  
  // 提示消息状态
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('success'); // success, error, info
  
  // 检查是否已绑定邮件
  const hasEmail = user?.email && user.email.trim() !== '';
  
  // 显示提示消息
  const showMessage = (text, type = 'success') => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => {
      setMessage(null);
    }, 3000);
  };
  
  // 处理添加预警
  const handleAddAlert = () => {
    if (!hasEmail) {
      // 引导用户去设置页面绑定邮件
      showMessage('请先在设置页面绑定邮箱', 'error');
      setTimeout(() => {
        navigate('/settings');
      }, 1000);
      return;
    }
    
    if (!emailAlerts) {
      // 提示用户开启邮件提醒
      showMessage('请先在设置页面开启邮件提醒功能', 'error');
      setTimeout(() => {
        navigate('/settings');
      }, 1000);
      return;
    }
    
    // 添加新预警
    const newId = priceAlerts.length > 0 ? Math.max(...priceAlerts.map(a => a.id)) + 1 : 1;
    const alertToAdd = {
      id: newId,
      ...newAlert,
      isEnabled: true
    };
    
    setPriceAlerts([...priceAlerts, alertToAdd]);
    
    // 重置表单
    setNewAlert({
      symbol: 'BTC',
      condition: '>',
      price: 70000
    });
    
    // 显示成功提示
    showMessage('价格预警添加成功');
  };
  
  // 处理删除预警
  const handleDeleteAlert = (id) => {
    setPriceAlerts(prev => prev.filter(alert => alert.id !== id));
    // 显示成功提示
    showMessage('价格预警删除成功');
  };
  
  // 模拟AI评估结果数据
  const aiSignals = [
    {
      id: 1,
      symbol: 'BTC/USDT',
      signal: 'bullish',
      signalText: '多头',
      analysis: '基于MACD金叉和RSI超卖反弹，短期趋势看涨，建议回调买入。',
      timestamp: '2024-01-20 14:30:00',
      timeframe: '4小时'
    },
    {
      id: 2,
      symbol: 'ETH/USDT',
      signal: 'bullish',
      signalText: '多头',
      analysis: '跟随BTC走势，突破阻力位，成交量放大，短期有望继续上涨。',
      timestamp: '2024-01-20 14:30:00',
      timeframe: '4小时'
    },
    {
      id: 3,
      symbol: 'SOL/USDT',
      signal: 'neutral',
      signalText: '中性',
      analysis: '横盘整理，等待方向突破，建议观望为主。',
      timestamp: '2024-01-20 14:30:00',
      timeframe: '4小时'
    },
    {
      id: 4,
      symbol: 'ADA/USDT',
      signal: 'bullish',
      signalText: '多头',
      analysis: '底部形态形成，量价配合良好，有望开启反弹行情。',
      timestamp: '2024-01-20 14:30:00',
      timeframe: '4小时'
    }
  ];
  
  // 计算信号统计
  const bullishCount = aiSignals.filter(signal => signal.signal === 'bullish').length;
  const neutralCount = aiSignals.filter(signal => signal.signal === 'neutral').length;
  const bearishCount = aiSignals.filter(signal => signal.signal === 'bearish').length;

  // 处理预警开关切换
  const handleAlertToggle = (id) => {
    setPriceAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, isEnabled: !alert.isEnabled } : alert
    ));
  };

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white min-h-screen pb-24">
      <Header />
      
      <div className="container mx-auto px-4 pt-6">
        {/* 提示消息 */}
        {message && (
          <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 animate-fade-in ${messageType === 'success' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 border border-green-200 dark:border-green-800' : messageType === 'error' ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 border border-red-200 dark:border-red-800' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 border border-blue-200 dark:border-blue-800'}`}>
            <span className="material-symbols-outlined">{messageType === 'success' ? 'check_circle' : messageType === 'error' ? 'error' : 'info'}</span>
            <p className="flex-1">{message}</p>
            <button 
              className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              onClick={() => setMessage(null)}
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        )}
        
        {/* 页面标题 */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">AI行情订阅</h1>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer"
              checked={isSubscriptionEnabled}
              onChange={() => setIsSubscriptionEnabled(!isSubscriptionEnabled)}
            />
          </label>
        </div>

        <div className="space-y-6">
          {/* 标题和设置按钮 */}
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">AI行情订阅</h2>
            <button 
              className="bg-primary hover:bg-primary/90 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors"
            >
              <span className="material-symbols-outlined">settings</span>
              订阅设置
            </button>
          </div>
          
          {/* 提示词设置 */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
            <h3 className="font-semibold mb-4">自定义提示词</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">提示词内容</label>
                <textarea 
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white h-32"
                  placeholder="输入AI评估的提示词，例如：分析BTC/USDT的4小时K线图，考虑MACD和RSI指标，评估短期趋势并给出多空信号"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">评估频率</label>
                <select 
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                >
                  <option value="5min">每5分钟</option>
                  <option value="15min">每15分钟</option>
                  <option value="30min">每30分钟</option>
                  <option value="1h">每1小时</option>
                  <option value="4h">每4小时</option>
                  <option value="1d">每天</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">交易对</label>
                <select 
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value)}
                >
                  <option value="BTC/USDT">BTC/USDT</option>
                  <option value="ETH/USDT">ETH/USDT</option>
                  <option value="SOL/USDT">SOL/USDT</option>
                  <option value="ADA/USDT">ADA/USDT</option>
                </select>
              </div>
              <button className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-lg transition-colors">
                保存设置
              </button>
            </div>
          </div>
          
          {/* 价格预警 */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
            <h3 className="font-semibold mb-4">价格预警</h3>
            <div className="space-y-4">
              {/* 邮件绑定状态提示 */}
              {!hasEmail && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 flex items-center gap-3 animate-fade-in">
                  <span className="material-symbols-outlined text-yellow-500">mail</span>
                  <div className="flex-1">
                    <p className="font-medium text-yellow-800 dark:text-yellow-400">📧 需要绑定邮件</p>
                    <p className="text-sm text-yellow-600 dark:text-yellow-500">价格预警提醒将通过邮件发送，请先绑定邮件地址</p>
                    <button 
                      className="mt-2 text-sm font-semibold text-primary hover:underline transition-all duration-200 hover:scale-105"
                      onClick={() => navigate('/settings')}
                    >
                      立即去绑定邮件 →
                    </button>
                  </div>
                </div>
              )}
              
              {hasEmail && !emailAlerts && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 flex items-center gap-3 animate-fade-in">
                  <span className="material-symbols-outlined text-blue-500">notifications</span>
                  <div className="flex-1">
                    <p className="font-medium text-blue-800 dark:text-blue-400">🔔 邮件提醒未开启</p>
                    <p className="text-sm text-blue-600 dark:text-blue-500">请开启邮件提醒功能以接收价格预警通知</p>
                    <button 
                      className="mt-2 text-sm font-semibold text-primary hover:underline transition-all duration-200 hover:scale-105"
                      onClick={() => navigate('/settings')}
                    >
                      立即去开启提醒 →
                    </button>
                  </div>
                </div>
              )}
              
              {hasEmail && emailAlerts && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-center gap-3 animate-fade-in">
                  <span className="material-symbols-outlined text-green-500">check_circle</span>
                  <div className="flex-1">
                    <p className="font-medium text-green-800 dark:text-green-400">✅ 邮件提醒已开启</p>
                    <p className="text-sm text-green-600 dark:text-green-500">价格预警将通过邮件发送到您的邮箱: {user.email}</p>
                  </div>
                </div>
              )}
              
              {/* 预警设置表单 */}
              <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4">
                <h4 className="text-sm font-medium mb-3">添加价格预警</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <select 
                    className={`px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white ${(!hasEmail || !emailAlerts) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    value={newAlert.symbol}
                    onChange={(e) => (!hasEmail || !emailAlerts) ? null : setNewAlert({...newAlert, symbol: e.target.value})}
                    disabled={!hasEmail || !emailAlerts}
                  >
                    <option value="BTC">BTC</option>
                    <option value="ETH">ETH</option>
                    <option value="SOL">SOL</option>
                    <option value="ADA">ADA</option>
                  </select>
                  <select 
                    className={`px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white ${(!hasEmail || !emailAlerts) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    value={newAlert.condition}
                    onChange={(e) => (!hasEmail || !emailAlerts) ? null : setNewAlert({...newAlert, condition: e.target.value})}
                    disabled={!hasEmail || !emailAlerts}
                  >
                    <option value=">">大于</option>
                    <option value="<">小于</option>
                  </select>
                  <input 
                    type="number" 
                    className={`px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white ${(!hasEmail || !emailAlerts) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    placeholder="价格"
                    value={newAlert.price}
                    onChange={(e) => (!hasEmail || !emailAlerts) ? null : setNewAlert({...newAlert, price: parseFloat(e.target.value) || 0})}
                    disabled={!hasEmail || !emailAlerts}
                  />
                </div>
                <button 
                  className={`mt-3 w-full font-semibold py-2 rounded-lg transition-colors ${(hasEmail && emailAlerts) ? 'bg-primary hover:bg-primary/90 text-white' : 'bg-slate-300 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed'}`}
                  onClick={handleAddAlert}
                  disabled={!hasEmail || !emailAlerts}
                >
                  {hasEmail && emailAlerts ? '添加预警' : (!hasEmail ? '请先绑定邮件' : '请先开启邮件提醒')}
                </button>
              </div>
              
              {/* 预警列表 */}
              <div>
                <h4 className="text-sm font-medium mb-3">预警列表</h4>
                {priceAlerts.length === 0 ? (
                  <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                    <span className="material-symbols-outlined text-4xl mb-2">notifications_off</span>
                    <p>暂无价格预警</p>
                    <p className="text-sm">添加预警以接收价格变动通知</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {priceAlerts.map((alert) => (
                      <div 
                        key={alert.id} 
                        className="flex justify-between items-center bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                            {alert.symbol.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium">{alert.symbol}</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                              当 {alert.symbol} {alert.condition} ${alert.price.toLocaleString()}
                            </p>
                            {(!hasEmail || !emailAlerts) && (
                              <p className="text-xs text-yellow-500 dark:text-yellow-400 mt-1">
                                {!hasEmail ? '需要绑定邮件才能启用' : '需要开启邮件提醒才能启用'}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="sr-only peer"
                              checked={alert.isEnabled && emailAlerts && hasEmail}
                              onChange={() => {
                                if (!hasEmail) {
                                  alert('请先在设置页面绑定邮箱');
                                  navigate('/settings');
                                  return;
                                }
                                if (!emailAlerts) {
                                  alert('请先在设置页面开启邮件提醒功能');
                                  navigate('/settings');
                                  return;
                                }
                                handleAlertToggle(alert.id);
                              }}
                              disabled={!hasEmail || !emailAlerts}
                            />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-primary peer-disabled:opacity-50 peer-disabled:cursor-not-allowed"></div>
                          </label>
                          <button 
                            className="text-slate-400 hover:text-red-500 transition-colors"
                            onClick={() => handleDeleteAlert(alert.id)}
                          >
                            <span className="material-symbols-outlined">delete</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* AI评估结果 */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
            <h3 className="font-semibold mb-4">AI评估结果</h3>
            <div className="space-y-6">
              {/* 信号概览 */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 text-center">
                  <p className="text-slate-500 dark:text-slate-400 text-sm">多头信号</p>
                  <p className="font-bold text-green-600 dark:text-green-400 text-2xl">{bullishCount}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center">
                  <p className="text-slate-500 dark:text-slate-400 text-sm">中性信号</p>
                  <p className="font-bold text-slate-600 dark:text-slate-300 text-2xl">{neutralCount}</p>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 text-center">
                  <p className="text-slate-500 dark:text-slate-400 text-sm">空头信号</p>
                  <p className="font-bold text-red-600 dark:text-red-400 text-2xl">{bearishCount}</p>
                </div>
              </div>
              
              {/* 详细信号列表 */}
              <div className="space-y-4">
                {aiSignals.map((signal, index) => (
                  <div 
                    key={signal.id} 
                    className={`${index < aiSignals.length - 1 ? 'border-b border-slate-200 dark:border-slate-700 pb-4' : ''}`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold">{signal.symbol}</h4>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">{signal.timeframe}K线分析</p>
                      </div>
                      <span className={`
                        px-3 py-1 rounded-full text-xs font-semibold 
                        ${signal.signal === 'bullish' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : ''}
                        ${signal.signal === 'neutral' ? 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300' : ''}
                        ${signal.signal === 'bearish' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' : ''}
                      `}>
                        {signal.signalText}
                      </span>
                    </div>
                    <p className="mt-2 text-slate-600 dark:text-slate-300">
                      {signal.analysis}
                    </p>
                    <p className="mt-2 text-slate-400 dark:text-slate-500 text-xs">
                      评估时间: {signal.timestamp}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Navigation />
    </div>
  );
};

export default AiMarket;