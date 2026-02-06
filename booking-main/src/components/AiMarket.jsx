import React, { useState } from 'react';
import Header from './Header';
import Navigation from './Navigation';

/**
 * AI行情订阅组件
 * 单独的AI行情订阅页面，包含自定义提示词设置和AI评估结果
 */
const AiMarket = () => {
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
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-primary"></div>
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
              {/* 预警设置表单 */}
              <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4">
                <h4 className="text-sm font-medium mb-3">添加价格预警</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <select 
                    className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                    value={newAlert.symbol}
                    onChange={(e) => setNewAlert({...newAlert, symbol: e.target.value})}
                  >
                    <option value="BTC">BTC</option>
                    <option value="ETH">ETH</option>
                    <option value="SOL">SOL</option>
                    <option value="ADA">ADA</option>
                  </select>
                  <select 
                    className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                    value={newAlert.condition}
                    onChange={(e) => setNewAlert({...newAlert, condition: e.target.value})}
                  >
                    <option value=">">大于</option>
                    <option value="<">小于</option>
                  </select>
                  <input 
                    type="number" 
                    className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                    placeholder="价格"
                    value={newAlert.price}
                    onChange={(e) => setNewAlert({...newAlert, price: parseFloat(e.target.value) || 0})}
                  />
                </div>
                <button 
                  className="mt-3 w-full bg-primary hover:bg-primary/90 text-white font-semibold py-2 rounded-lg transition-colors"
                >
                  添加预警
                </button>
              </div>
              
              {/* 预警列表 */}
              <div>
                <h4 className="text-sm font-medium mb-3">预警列表</h4>
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
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer"
                            checked={alert.isEnabled}
                            onChange={() => handleAlertToggle(alert.id)}
                          />
                          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-primary"></div>
                        </label>
                        <button className="text-slate-400 hover:text-red-500 transition-colors">
                          <span className="material-symbols-outlined">delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
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