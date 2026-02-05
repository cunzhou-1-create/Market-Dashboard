import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

/**
 * 主内容组件
 * 包含观察列表、市场数据、价格预警等功能模块
 */
const MainContent = () => {
  const navigate = useNavigate();
  const { marketData, watchlist, addToWatchlist, removeFromWatchlist, priceAlerts, togglePriceAlertActive, addPriceAlert } = useApp();
  
  // 搜索查询状态
  const [searchQuery, setSearchQuery] = useState('');
  // 观察列表编辑状态
  const [editWatchlist, setEditWatchlist] = useState(false);
  // AI行情订阅状态
  const [aiSubscriptionActive, setAiSubscriptionActive] = useState(true);
  // 邮件通知状态
  const [emailNotificationActive, setEmailNotificationActive] = useState(true);
  // Telegram通知状态
  const [telegramNotificationActive, setTelegramNotificationActive] = useState(true);
  // Webhook通知状态
  const [webhookNotificationActive, setWebhookNotificationActive] = useState(false);
  
  // 邮件通知类型状态
  const [emailNotificationTypes, setEmailNotificationTypes] = useState({
    priceAlert: true,
    technicalAlert: true,
    chainEvent: true,
    aiReport: true
  });
  
  // Telegram通知类型状态
  const [telegramNotificationTypes, setTelegramNotificationTypes] = useState({
    priceAlert: true,
    technicalAlert: true,
    chainEvent: true,
    aiReport: false
  });
  
  // Webhook通知类型状态
  const [webhookNotificationTypes, setWebhookNotificationTypes] = useState({
    priceAlert: false,
    technicalAlert: false,
    chainEvent: false,
    aiReport: false
  });
  
  // 处理邮件通知类型变化
  const handleEmailNotificationTypeChange = (type) => {
    setEmailNotificationTypes(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };
  
  // 处理Telegram通知类型变化
  const handleTelegramNotificationTypeChange = (type) => {
    setTelegramNotificationTypes(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };
  
  // 处理Webhook通知类型变化
  const handleWebhookNotificationTypeChange = (type) => {
    setWebhookNotificationTypes(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };
  
  /**
   * 处理搜索输入变化
   * @param {Object} e - 事件对象
   */
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  
  /**
   * 过滤市场数据
   * 根据搜索查询过滤币对
   */
  const filteredMarkets = marketData.filter(item => 
    item.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  /**
   * 获取涨幅最大的币对
   * 按涨跌幅排序，取前4个
   */
  const topGainers = [...marketData]
    .sort((a, b) => b.change - a.change)
    .slice(0, 4);
  
  /**
   * 处理币对点击
   * 导航到详情页面
   * @param {string} symbol - 币对符号
   */
  const handleSymbolClick = (symbol) => {
    navigate('/detail', { state: { symbol } });
  };
  
  /**
   * 切换观察列表编辑模式
   */
  const toggleEditWatchlist = () => {
    setEditWatchlist(prev => !prev);
  };
  
  /**
   * 从观察列表移除币对
   * @param {Object} e - 事件对象
   * @param {string} symbolId - 币对ID
   */
  const handleRemoveFromWatchlist = (e, symbolId) => {
    e.stopPropagation();
    removeFromWatchlist(symbolId);
  };
  
  /**
   * 获取观察列表中的币对数据
   */
  const watchlistItems = marketData.filter(item => watchlist.includes(item.id));
  
  return (
    <main className="max-w-md mx-auto">
      {/* Qwen AI Insight Action Panel */}
      <div className="p-4">
        <div className="flex flex-col items-start justify-between gap-4 rounded-xl border border-primary/30 bg-primary/10 p-4">
          <div className="flex gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary text-white">
              <span className="material-symbols-outlined">psychology</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <p className="text-sm font-bold leading-tight">Qwen AI Market Insight</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-normal leading-normal">
                Sentiment is <span className="text-emerald-500 font-bold uppercase">Bullish</span>. High volume detected in Layer 2 tokens over the last 4h.
              </p>
            </div>
          </div>
          <button 
            className="w-full flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-4 bg-primary text-white text-xs font-semibold leading-normal"
            onClick={() => navigate('/detail')}
          >
            <span>View Deep Analysis</span>
          </button>
        </div>
      </div>
      
      {/* Search Bar */}
      <div className="px-4 py-2">
        <div className="flex w-full flex-1 items-stretch rounded-lg h-10 overflow-hidden">
          <div className="text-slate-400 flex border-none bg-slate-100 dark:bg-[#1c2630] items-center justify-center pl-4">
            <span className="material-symbols-outlined text-xl">search</span>
          </div>
          <input 
            className="form-input flex w-full min-w-0 flex-1 border-none bg-slate-100 dark:bg-[#1c2630] focus:outline-0 focus:ring-0 h-full placeholder:text-slate-400 px-3 text-sm font-normal" 
            placeholder="Search pairs (e.g. BTC/USDT)" 
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
      </div>
      
      {/* Watchlist Section */}
      <div className="flex items-center justify-between px-4 pt-2">
        <h3 className="text-lg font-bold tracking-tight">Watchlist</h3>
        <button 
          className="text-xs font-semibold text-primary"
          onClick={toggleEditWatchlist}
        >
          {editWatchlist ? 'Done' : 'Edit'}
        </button>
      </div>
      
      {watchlistItems.length > 0 ? (
        <div className="flex overflow-x-auto hide-scrollbar gap-4 px-4 py-4">
          {watchlistItems.map(item => (
            <div 
              key={item.id}
              className="flex min-w-[160px] flex-col gap-2 p-4 rounded-xl bg-slate-100 dark:bg-[#1c2630] border border-transparent dark:border-slate-800 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleSymbolClick(item.symbol)}
            >
              <div className="flex justify-between items-start">
                <p className="text-xs font-semibold opacity-70 uppercase">{item.symbol}</p>
                {editWatchlist && (
                  <button 
                    className="text-slate-400 hover:text-red-500 transition-colors"
                    onClick={(e) => handleRemoveFromWatchlist(e, item.id)}
                  >
                    <span className="material-symbols-outlined text-xs">close</span>
                  </button>
                )}
              </div>
              <div className="flex justify-between items-start">
                <p className="text-lg font-bold leading-tight tracking-tighter">${item.price.toLocaleString()}</p>
                <span className={`text-[10px] font-bold ${item.isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {item.isPositive ? '+' : ''}{item.change}%
                </span>
              </div>
              <div className="h-12 w-full mt-1">
                <svg 
                  className={`w-full h-full ${item.isPositive ? 'stroke-emerald-500 fill-emerald-500/10' : 'stroke-rose-500 fill-rose-500/10'}`} 
                  viewBox="0 0 100 40"
                >
                  {item.isPositive ? (
                    <>
                      <path d="M0 35 Q 20 10, 40 25 T 80 15 T 100 5 L 100 40 L 0 40 Z" fillOpacity="0.1" strokeWidth="2"></path>
                      <path d="M0 35 Q 20 10, 40 25 T 80 15 T 100 5" fill="none" strokeWidth="2"></path>
                    </>
                  ) : (
                    <>
                      <path d="M0 5 Q 20 25, 40 15 T 80 30 T 100 35 L 100 40 L 0 40 Z" fillOpacity="0.1" strokeWidth="2"></path>
                      <path d="M0 5 Q 20 25, 40 15 T 80 30 T 100 35" fill="none" strokeWidth="2"></path>
                    </>
                  )}
                </svg>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="px-4 py-8 text-center">
          <p className="text-slate-500 dark:text-slate-400">
            {searchQuery ? 'No results found' : 'Your watchlist is empty'}
          </p>
          {!searchQuery && (
            <button 
              className="mt-4 text-primary font-semibold hover:underline"
              onClick={() => setEditWatchlist(true)}
            >
              Add tokens to watchlist
            </button>
          )}
        </div>
      )}
      
      {/* Top Gainers Section */}
      <div className="px-4 py-2">
        <h3 className="text-lg font-bold tracking-tight pb-2">Top Gainers</h3>
        <div className="flex flex-col gap-1">
          {topGainers.map((item, index) => (
            <div 
              key={item.id}
              className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800/50 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              onClick={() => handleSymbolClick(item.symbol)}
            >
              <div className="flex items-center gap-3">
                <div className={`size-10 rounded-full ${index === 0 ? 'bg-orange-500/20 text-orange-500' : index === 1 ? 'bg-blue-500/20 text-blue-500' : index === 2 ? 'bg-yellow-500/20 text-yellow-600' : 'bg-purple-500/20 text-purple-500'} flex items-center justify-center`}>
                  <span className="font-bold text-xs">{item.symbol.split('/')[0]}</span>
                </div>
                <div>
                  <p className="font-bold text-sm">{item.symbol.split('/')[0]}</p>
                  <p className="text-xs text-slate-500">{item.symbol}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-sm">${item.price.toLocaleString()}</p>
                <p className="text-xs font-bold text-emerald-500">+{item.change}%</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Real-time Market Monitoring */}
      <div className="px-4 py-4">
        <h3 className="text-lg font-bold tracking-tight pb-4">实时行情监控</h3>
        
        {/* BTC & ETH Section */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* BTC Card */}
          <div className="bg-slate-100 dark:bg-[#1c2630] rounded-xl p-4 border border-transparent dark:border-slate-800">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-full bg-orange-500/20 text-orange-500 flex items-center justify-center">
                  <span className="font-bold text-sm">BTC</span>
                </div>
                <span className="font-bold text-sm">Bitcoin</span>
              </div>
              <span className="text-xs font-bold text-emerald-500">+2.4%</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black">$64,231</span>
              <span className="text-xs text-slate-500">USDT</span>
            </div>
            <div className="mt-2 text-xs text-slate-500">24h 涨跌幅</div>
          </div>
          
          {/* ETH Card */}
          <div className="bg-slate-100 dark:bg-[#1c2630] rounded-xl p-4 border border-transparent dark:border-slate-800">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center">
                  <span className="font-bold text-sm">ETH</span>
                </div>
                <span className="font-bold text-sm">Ethereum</span>
              </div>
              <span className="text-xs font-bold text-rose-500">-1.2%</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black">$3,452</span>
              <span className="text-xs text-slate-500">USDT</span>
            </div>
            <div className="mt-2 text-xs text-slate-500">24h 涨跌幅</div>
          </div>
        </div>
        
        {/* Top 100 Altcoins Section */}
        <div className="bg-slate-100 dark:bg-[#1c2630] rounded-xl p-4 border border-transparent dark:border-slate-800">
          <h4 className="font-bold text-sm mb-3">主流山寨币 (前100)</h4>
          
          {/* Table Header */}
          <div className="flex justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
            <div className="w-1/3">币种</div>
            <div className="w-1/3 text-right">价格</div>
            <div className="w-1/3 text-right">24h 涨跌幅</div>
          </div>
          
          {/* Table Rows */}
          <div className="space-y-3">
            {/* SOL */}
            <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-800">
              <div className="w-1/3 flex items-center gap-2">
                <div className="size-6 rounded-full bg-purple-500/20 text-purple-500 flex items-center justify-center">
                  <span className="font-bold text-xs">SOL</span>
                </div>
                <span className="text-sm font-medium">Solana</span>
              </div>
              <div className="w-1/3 text-right font-medium">$142.12</div>
              <div className="w-1/3 text-right font-bold text-emerald-500">+5.8%</div>
            </div>
            
            {/* ARB */}
            <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-800">
              <div className="w-1/3 flex items-center gap-2">
                <div className="size-6 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center">
                  <span className="font-bold text-xs">ARB</span>
                </div>
                <span className="text-sm font-medium">Arbitrum</span>
              </div>
              <div className="w-1/3 text-right font-medium">$1.12</div>
              <div className="w-1/3 text-right font-bold text-emerald-500">+12.4%</div>
            </div>
            
            {/* LINK */}
            <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-800">
              <div className="w-1/3 flex items-center gap-2">
                <div className="size-6 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center">
                  <span className="font-bold text-xs">LINK</span>
                </div>
                <span className="text-sm font-medium">Chainlink</span>
              </div>
              <div className="w-1/3 text-right font-medium">$18.45</div>
              <div className="w-1/3 text-right font-bold text-emerald-500">+8.1%</div>
            </div>
            
            {/* PEPE */}
            <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-800">
              <div className="w-1/3 flex items-center gap-2">
                <div className="size-6 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center">
                  <span className="font-bold text-xs">PEPE</span>
                </div>
                <span className="text-sm font-medium">Pepe</span>
              </div>
              <div className="w-1/3 text-right font-medium">$0.000008</div>
              <div className="w-1/3 text-right font-bold text-emerald-500">+7.4%</div>
            </div>
            
            {/* OP */}
            <div className="flex justify-between items-center py-2">
              <div className="w-1/3 flex items-center gap-2">
                <div className="size-6 rounded-full bg-purple-500/20 text-purple-500 flex items-center justify-center">
                  <span className="font-bold text-xs">OP</span>
                </div>
                <span className="text-sm font-medium">Optimism</span>
              </div>
              <div className="w-1/3 text-right font-medium">$2.41</div>
              <div className="w-1/3 text-right font-bold text-emerald-500">+6.9%</div>
            </div>
          </div>
          
          {/* View All Button */}
          <button className="w-full mt-4 py-2 text-center text-xs font-semibold text-primary border border-primary/30 rounded-lg hover:bg-primary/10 transition-colors">
            查看全部 100 种山寨币
          </button>
        </div>
      </div>
      
      {/* Volume Chart Preview */}
      <div className="px-4 py-4">
        <h3 className="text-lg font-bold tracking-tight pb-4">Market Volume (24h)</h3>
        <div className="w-full bg-slate-100 dark:bg-[#1c2630] rounded-xl p-4">
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-2xl font-black">$42.8B</span>
            <span className="text-xs text-slate-500 font-medium">Total Volume</span>
          </div>
          <div className="flex items-end gap-1.5 h-24">
            <div className="flex-1 bg-primary/20 rounded-t h-[40%]"></div>
            <div className="flex-1 bg-primary/40 rounded-t h-[60%]"></div>
            <div className="flex-1 bg-primary/60 rounded-t h-[80%]"></div>
            <div className="flex-1 bg-primary rounded-t h-[100%]"></div>
            <div className="flex-1 bg-primary/80 rounded-t h-[70%]"></div>
            <div className="flex-1 bg-primary/50 rounded-t h-[45%]"></div>
            <div className="flex-1 bg-primary/30 rounded-t h-[30%]"></div>
            <div className="flex-1 bg-primary/40 rounded-t h-[55%]"></div>
            <div className="flex-1 bg-primary/70 rounded-t h-[85%]"></div>
            <div className="flex-1 bg-primary/90 rounded-t h-[95%]"></div>
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-[10px] text-slate-500 font-bold">00:00</span>
            <span className="text-[10px] text-slate-500 font-bold">12:00</span>
            <span className="text-[10px] text-slate-500 font-bold">23:59</span>
          </div>
        </div>
      </div>
      
      {/* Price Alert Section */}
      <div className="px-4 py-4">
        <h3 className="text-lg font-bold tracking-tight pb-4">自定义价格预警</h3>
        <div className="bg-slate-100 dark:bg-[#1c2630] rounded-xl p-4 border border-transparent dark:border-slate-800">
          <div className="space-y-4">
            {priceAlerts.map(alert => (
              <div key={alert.id} className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`size-8 rounded-full ${alert.symbol.includes('BTC') ? 'bg-orange-500/20 text-orange-500' : alert.symbol.includes('SOL') ? 'bg-purple-500/20 text-purple-500' : 'bg-blue-500/20 text-blue-500'} flex items-center justify-center`}>
                      <span className="font-bold text-sm">{alert.symbol.split('/')[0]}</span>
                    </div>
                    <span className="font-bold text-sm">{alert.name}</span>
                  </div>
                  <div className="relative inline-block w-10 mr-2 align-middle select-none">
                    <input 
                      type="checkbox" 
                      name={`toggle-${alert.id}`} 
                      id={`alert-toggle-${alert.id}`} 
                      className="sr-only" 
                      checked={alert.isActive} 
                      onChange={() => togglePriceAlertActive(alert.id)}
                    />
                    <label 
                      htmlFor={`alert-toggle-${alert.id}`} 
                      className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-300 ease-in-out ${alert.isActive ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-700'}`}
                    ></label>
                    <span className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ease-in-out transform ${alert.isActive ? 'translate-x-4 scale-100' : 'translate-x-0 scale-90'}`}></span>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 w-24">预警条件:</span>
                    <select className="flex-1 bg-slate-200 dark:bg-slate-700 border-0 rounded-lg px-3 py-2 text-sm" defaultValue={alert.condition}>
                      <option>价格大于</option>
                      <option>价格小于</option>
                      <option>价格等于</option>
                    </select>
                    <input type="text" className="w-24 bg-slate-200 dark:bg-slate-700 border-0 rounded-lg px-3 py-2 text-sm text-right" defaultValue={alert.threshold} />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 w-24">预警频率:</span>
                    <select className="flex-1 bg-slate-200 dark:bg-slate-700 border-0 rounded-lg px-3 py-2 text-sm" defaultValue={alert.frequency}>
                      <option>每1分钟</option>
                      <option>每5分钟</option>
                      <option>每15分钟</option>
                      <option>每30分钟</option>
                      <option>每小时</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Add New Alert Button */}
            <button 
              className="w-full py-3 text-center text-sm font-semibold text-primary border border-primary/30 rounded-lg hover:bg-primary/10 transition-colors"
              onClick={() => addPriceAlert({
                symbol: 'ETH/USDT',
                name: 'Ethereum',
                condition: '价格大于',
                threshold: 3500,
                frequency: '每10分钟'
              })}
            >
              添加新的价格预警
            </button>
            
            {/* Alert Status */}
            <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">notifications_active</span>
                <span className="text-sm font-medium">预警状态</span>
              </div>
              <span className={`text-xs font-semibold ${priceAlerts.filter(a => a.isActive).length > 0 ? 'text-emerald-500' : 'text-slate-500'}`}>
                {priceAlerts.filter(a => a.isActive).length > 0 ? `已启用 (${priceAlerts.filter(a => a.isActive).length}个预警)` : '未启用'}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* 技术指标预警 Section */}
      <div className="px-4 py-4">
        <h3 className="text-lg font-bold tracking-tight pb-4">技术指标预警</h3>
        <div className="bg-slate-100 dark:bg-[#1c2630] rounded-xl p-4 border border-transparent dark:border-slate-800">
          <div className="space-y-4">
            {/* RSI超买预警 */}
            <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-bold text-sm">RSI 超买预警</p>
                  <p className="text-xs text-slate-500">RSI &gt; 70</p>
                </div>
                <span className="text-xs font-semibold text-rose-500">已触发 (3个币种)</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs bg-rose-500/20 text-rose-500 px-3 py-1 rounded-full">BTC/USDT</span>
                <span className="text-xs bg-rose-500/20 text-rose-500 px-3 py-1 rounded-full">ETH/USDT</span>
                <span className="text-xs bg-rose-500/20 text-rose-500 px-3 py-1 rounded-full">SOL/USDT</span>
              </div>
            </div>
            
            {/* MACD金叉预警 */}
            <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-bold text-sm">MACD 金叉预警</p>
                  <p className="text-xs text-slate-500">MACD线穿过信号线向上</p>
                </div>
                <span className="text-xs font-semibold text-emerald-500">已触发 (2个币种)</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs bg-emerald-500/20 text-emerald-500 px-3 py-1 rounded-full">BTC/USDT</span>
                <span className="text-xs bg-emerald-500/20 text-emerald-500 px-3 py-1 rounded-full">LINK/USDT</span>
              </div>
            </div>
            
            {/* EMA20上穿EMA50预警 */}
            <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-bold text-sm">EMA 金叉预警</p>
                  <p className="text-xs text-slate-500">EMA20 上穿 EMA50</p>
                </div>
                <span className="text-xs font-semibold text-emerald-500">已触发 (1个币种)</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs bg-emerald-500/20 text-emerald-500 px-3 py-1 rounded-full">SOL/USDT</span>
              </div>
            </div>
            
            {/* 预警设置按钮 */}
            <button className="w-full py-3 text-center text-sm font-semibold text-primary border border-primary/30 rounded-lg hover:bg-primary/10 transition-colors">
              管理技术指标预警
            </button>
            
            {/* 预警状态 */}
            <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">trending_up</span>
                <span className="text-sm font-medium">技术指标预警状态</span>
              </div>
              <span className="text-xs font-semibold text-emerald-500">已启用 (3个指标)</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* 链上事件提醒 Section */}
      <div className="px-4 py-4">
        <h3 className="text-lg font-bold tracking-tight pb-4">链上事件提醒</h3>
        <div className="bg-slate-100 dark:bg-[#1c2630] rounded-xl p-4 border border-transparent dark:border-slate-800">
          <div className="space-y-4">
            {/* 大额转账提醒 */}
            <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="size-8 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center">
                    <span className="material-symbols-outlined text-sm">account_balance_wallet</span>
                  </div>
                  <span className="font-bold text-sm">大额转账提醒</span>
                </div>
                <span className="text-xs font-semibold text-rose-500">高风险</span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-blue-500/10 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">12,500 ETH 转账</p>
                    <p className="text-xs text-slate-500 mt-1">从 0x...abc 到 0x...def · 5分钟前</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm">$42.1M</p>
                    <p className="text-xs text-slate-500">当前价值</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-500/10 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">150 BTC 转账</p>
                    <p className="text-xs text-slate-500 mt-1">从 0x...ghi 到 0x...jkl · 10分钟前</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm">$9.6M</p>
                    <p className="text-xs text-slate-500">当前价值</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 交易所净流入突增提醒 */}
            <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="size-8 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
                    <span className="material-symbols-outlined text-sm">trending_up</span>
                  </div>
                  <span className="font-bold text-sm">交易所净流入突增</span>
                </div>
                <span className="text-xs font-semibold text-emerald-500">重要</span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-emerald-500/10 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">Binance ETH 净流入</p>
                    <p className="text-xs text-slate-500 mt-1">+5,200 ETH (24h) · 30分钟前</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm text-emerald-500">+230%</p>
                    <p className="text-xs text-slate-500">较昨日</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-emerald-500/10 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">Coinbase BTC 净流入</p>
                    <p className="text-xs text-slate-500 mt-1">+280 BTC (24h) · 1小时前</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm text-emerald-500">+185%</p>
                    <p className="text-xs text-slate-500">较昨日</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 事件提醒设置 */}
            <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
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
      </div>
      
      {/* 模拟交易 Section */}
      <div className="px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold tracking-tight">模拟交易</h3>
          <button className="text-xs font-semibold text-primary border border-primary/30 rounded-lg px-3 py-1 hover:bg-primary/10 transition-colors">
            创建模拟交易
          </button>
        </div>
        
        {/* AI交易员实时交易 */}
        <div className="bg-slate-100 dark:bg-[#1c2630] rounded-xl p-4 border border-transparent dark:border-slate-800 mb-4">
          <h4 className="font-bold text-sm mb-3">AI交易员实盘模拟交易</h4>
          
          {/* 交易员列表 */}
          <div className="space-y-3">
            {/* 交易员1 */}
            <div className="flex items-center justify-between p-3 bg-white/50 dark:bg-slate-800/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center">
                  <span className="font-bold text-sm">AI-1</span>
                </div>
                <div>
                  <p className="font-bold text-sm">Alpha Trader</p>
                  <p className="text-xs text-slate-500">比特币趋势策略</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-sm text-emerald-500">+24.5%</p>
                <p className="text-xs text-slate-500">7天收益率</p>
              </div>
            </div>
            
            {/* 交易员2 */}
            <div className="flex items-center justify-between p-3 bg-white/50 dark:bg-slate-800/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center">
                  <span className="font-bold text-sm">AI-2</span>
                </div>
                <div>
                  <p className="font-bold text-sm">Beta Arbitrage</p>
                  <p className="text-xs text-slate-500">跨交易所套利</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-sm text-emerald-500">+12.8%</p>
                <p className="text-xs text-slate-500">7天收益率</p>
              </div>
            </div>
            
            {/* 交易员3 */}
            <div className="flex items-center justify-between p-3 bg-white/50 dark:bg-slate-800/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-purple-500/20 text-purple-500 flex items-center justify-center">
                  <span className="font-bold text-sm">AI-3</span>
                </div>
                <div>
                  <p className="font-bold text-sm">Gamma Scalper</p>
                  <p className="text-xs text-slate-500">高频波动交易</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-sm text-rose-500">-3.2%</p>
                <p className="text-xs text-slate-500">7天收益率</p>
              </div>
            </div>
          </div>
          
          {/* 查看全部按钮 */}
          <button className="w-full mt-4 py-2 text-center text-xs font-semibold text-primary border border-primary/30 rounded-lg hover:bg-primary/10 transition-colors">
            查看全部AI交易员
          </button>
        </div>
        
        {/* 实时交易记录 */}
        <div className="bg-slate-100 dark:bg-[#1c2630] rounded-xl p-4 border border-transparent dark:border-slate-800">
          <h4 className="font-bold text-sm mb-3">实时交易记录</h4>
          
          {/* 交易记录列表 */}
          <div className="space-y-3">
            {/* 交易1 */}
            <div className="flex items-center justify-between p-3 bg-white/50 dark:bg-slate-800/50 rounded-lg">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold bg-emerald-500/20 text-emerald-500 px-2 py-0.5 rounded">买入</span>
                  <span className="text-sm font-medium">BTC/USDT</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">Alpha Trader · 2分钟前</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-sm">$64,231</p>
                <p className="text-xs text-slate-500">0.05 BTC</p>
              </div>
            </div>
            
            {/* 交易2 */}
            <div className="flex items-center justify-between p-3 bg-white/50 dark:bg-slate-800/50 rounded-lg">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold bg-rose-500/20 text-rose-500 px-2 py-0.5 rounded">卖出</span>
                  <span className="text-sm font-medium">ETH/USDT</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">Beta Arbitrage · 5分钟前</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-sm">$3,452</p>
                <p className="text-xs text-slate-500">1.2 ETH</p>
              </div>
            </div>
            
            {/* 交易3 */}
            <div className="flex items-center justify-between p-3 bg-white/50 dark:bg-slate-800/50 rounded-lg">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold bg-emerald-500/20 text-emerald-500 px-2 py-0.5 rounded">买入</span>
                  <span className="text-sm font-medium">SOL/USDT</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">Gamma Scalper · 10分钟前</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-sm">$142.12</p>
                <p className="text-xs text-slate-500">5 SOL</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* AI行情订阅 Section */}
      <div className="px-4 py-4">
        <h3 className="text-lg font-bold tracking-tight pb-4">AI行情订阅</h3>
        <div className="bg-slate-100 dark:bg-[#1c2630] rounded-xl p-4 border border-transparent dark:border-slate-800">
          <div className="space-y-4">
            {/* 自定义提示词设置 */}
            <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-bold text-sm">自定义提示词</p>
                  <p className="text-xs text-slate-500">设置AI分析的提示词内容</p>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <textarea 
                  className="flex w-full min-w-0 flex-1 border-none bg-slate-200 dark:bg-slate-700 focus:outline-0 focus:ring-0 h-32 placeholder:text-slate-400 px-3 py-3 text-sm font-normal rounded-lg resize-none"
                  placeholder="请输入自定义提示词，例如：分析比特币最近24小时的价格走势，关注成交量变化和技术指标，判断多空信号..."
                ></textarea>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">提示词长度：0/500</span>
                  <button className="text-xs font-semibold text-primary border border-primary/30 rounded-lg px-3 py-1 hover:bg-primary/10 transition-colors">
                    保存提示词
                  </button>
                </div>
              </div>
            </div>
            
            {/* 分析频率设置 */}
            <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-bold text-sm">分析频率</p>
                  <p className="text-xs text-slate-500">设置AI评估的执行频率</p>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 w-24">评估频率:</span>
                  <select className="flex-1 bg-slate-200 dark:bg-slate-700 border-0 rounded-lg px-3 py-2 text-sm">
                    <option>每5分钟</option>
                    <option>每15分钟</option>
                    <option>每30分钟</option>
                    <option>每小时</option>
                    <option>每4小时</option>
                    <option>每8小时</option>
                    <option>每12小时</option>
                    <option>每天</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 w-24">分析币种:</span>
                  <select className="flex-1 bg-slate-200 dark:bg-slate-700 border-0 rounded-lg px-3 py-2 text-sm">
                    <option>全部币种</option>
                    <option>BTC/USDT</option>
                    <option>ETH/USDT</option>
                    <option>SOL/USDT</option>
                    <option>ARB/USDT</option>
                    <option>LINK/USDT</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 w-24">分析深度:</span>
                  <select className="flex-1 bg-slate-200 dark:bg-slate-700 border-0 rounded-lg px-3 py-2 text-sm">
                    <option>基础分析</option>
                    <option>标准分析</option>
                    <option>深度分析</option>
                    <option>全面分析</option>
                  </select>
                </div>
              </div>
            </div>
            
            {/* AI评估结果 */}
            <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-bold text-sm">AI评估结果</p>
                  <p className="text-xs text-slate-500">多空信号分析</p>
                </div>
                <span className="text-xs font-semibold text-slate-500">上次更新: 2分钟前</span>
              </div>
              <div className="space-y-3">
                {/* BTC信号 */}
                <div className="flex items-center justify-between p-3 bg-emerald-500/10 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-full bg-orange-500/20 text-orange-500 flex items-center justify-center">
                      <span className="font-bold text-sm">BTC</span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">Bitcoin</p>
                      <p className="text-xs text-slate-500 mt-1">BTC/USDT</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm text-emerald-500">多头信号</p>
                    <p className="text-xs text-slate-500">置信度: 85%</p>
                  </div>
                </div>
                
                {/* ETH信号 */}
                <div className="flex items-center justify-between p-3 bg-rose-500/10 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center">
                      <span className="font-bold text-sm">ETH</span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">Ethereum</p>
                      <p className="text-xs text-slate-500 mt-1">ETH/USDT</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm text-rose-500">空头信号</p>
                    <p className="text-xs text-slate-500">置信度: 72%</p>
                  </div>
                </div>
                
                {/* SOL信号 */}
                <div className="flex items-center justify-between p-3 bg-emerald-500/10 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-full bg-purple-500/20 text-purple-500 flex items-center justify-center">
                      <span className="font-bold text-sm">SOL</span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">Solana</p>
                      <p className="text-xs text-slate-500 mt-1">SOL/USDT</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm text-emerald-500">多头信号</p>
                    <p className="text-xs text-slate-500">置信度: 90%</p>
                  </div>
                </div>
              </div>
              <button className="w-full mt-4 py-2 text-center text-xs font-semibold text-primary border border-primary/30 rounded-lg hover:bg-primary/10 transition-colors">
                查看详细分析报告
              </button>
            </div>
            
            {/* 订阅状态 */}
            <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">psychology</span>
                <span className="text-sm font-medium">AI行情订阅状态</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-semibold ${aiSubscriptionActive ? 'text-emerald-500' : 'text-slate-500'}`}>
                  {aiSubscriptionActive ? '已启用' : '已禁用'}
                </span>
                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                  <input 
                    type="checkbox" 
                    name="toggle" 
                    id="ai-subscription-toggle" 
                    className="sr-only" 
                    checked={aiSubscriptionActive}
                    onChange={() => setAiSubscriptionActive(!aiSubscriptionActive)}
                  />
                  <label 
                    htmlFor="ai-subscription-toggle" 
                    className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-300 ease-in-out ${aiSubscriptionActive ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-700'}`}
                  ></label>
                  <span className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ease-in-out transform ${aiSubscriptionActive ? 'translate-x-4 scale-100' : 'translate-x-0 scale-90'}`}></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 通知渠道 Section */}
      <div className="px-4 py-4">
        <h3 className="text-lg font-bold tracking-tight pb-4">通知渠道</h3>
        <div className="bg-slate-100 dark:bg-[#1c2630] rounded-xl p-4 border border-transparent dark:border-slate-800">
          <div className="space-y-4">
            {/* 邮件通知设置 */}
            <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="size-8 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center">
                    <span className="material-symbols-outlined text-sm">mail</span>
                  </div>
                  <div>
                    <p className="font-bold text-sm">邮件通知</p>
                    <p className="text-xs text-slate-500">接收价格预警和行情分析邮件</p>
                  </div>
                </div>
                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                  <input 
                    type="checkbox" 
                    name="toggle" 
                    id="email-notification-toggle" 
                    className="sr-only" 
                    checked={emailNotificationActive}
                    onChange={() => setEmailNotificationActive(!emailNotificationActive)}
                  />
                  <label 
                    htmlFor="email-notification-toggle" 
                    className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-300 ease-in-out ${emailNotificationActive ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-700'}`}
                  ></label>
                  <span className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ease-in-out transform ${emailNotificationActive ? 'translate-x-4 scale-100' : 'translate-x-0 scale-90'}`}></span>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                  <span className="text-xs text-slate-500">邮箱地址</span>
                  <input type="email" className="flex-1 bg-slate-200 dark:bg-slate-700 border-0 rounded-lg px-3 py-2 text-sm" placeholder="请输入您的邮箱地址" defaultValue="user@example.com" />
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-xs text-slate-500">通知频率</span>
                  <select className="flex-1 bg-slate-200 dark:bg-slate-700 border-0 rounded-lg px-3 py-2 text-sm">
                    <option>实时通知</option>
                    <option>每小时汇总</option>
                    <option>每天汇总</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-xs text-slate-500">通知类型</span>
                  <div className="flex flex-wrap gap-2">
                    <label className="flex items-center gap-2 bg-slate-200 dark:bg-slate-700 px-3 py-1.5 rounded-lg text-sm">
                      <input 
                        type="checkbox" 
                        className="rounded" 
                        checked={emailNotificationTypes.priceAlert}
                        onChange={() => handleEmailNotificationTypeChange('priceAlert')}
                      />
                      价格预警
                    </label>
                    <label className="flex items-center gap-2 bg-slate-200 dark:bg-slate-700 px-3 py-1.5 rounded-lg text-sm">
                      <input 
                        type="checkbox" 
                        className="rounded" 
                        checked={emailNotificationTypes.technicalAlert}
                        onChange={() => handleEmailNotificationTypeChange('technicalAlert')}
                      />
                      技术指标预警
                    </label>
                    <label className="flex items-center gap-2 bg-slate-200 dark:bg-slate-700 px-3 py-1.5 rounded-lg text-sm">
                      <input 
                        type="checkbox" 
                        className="rounded" 
                        checked={emailNotificationTypes.chainEvent}
                        onChange={() => handleEmailNotificationTypeChange('chainEvent')}
                      />
                      链上事件
                    </label>
                    <label className="flex items-center gap-2 bg-slate-200 dark:bg-slate-700 px-3 py-1.5 rounded-lg text-sm">
                      <input 
                        type="checkbox" 
                        className="rounded" 
                        checked={emailNotificationTypes.aiReport}
                        onChange={() => handleEmailNotificationTypeChange('aiReport')}
                      />
                      AI分析报告
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Telegram Bot通知设置 */}
            <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <div className="size-8 rounded-full bg-[#0088CC] flex items-center justify-center">
                      <span className="text-white font-bold text-sm">Tg</span>
                    </div>
                    <div>
                      <p className="font-bold text-sm">Telegram Bot</p>
                      <p className="text-xs text-slate-500">接收实时行情和预警通知</p>
                    </div>
                  </div>
                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                  <input 
                    type="checkbox" 
                    name="toggle" 
                    id="telegram-notification-toggle" 
                    className="sr-only" 
                    checked={telegramNotificationActive}
                    onChange={() => setTelegramNotificationActive(!telegramNotificationActive)}
                  />
                  <label 
                    htmlFor="telegram-notification-toggle" 
                    className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-300 ease-in-out ${telegramNotificationActive ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-700'}`}
                  ></label>
                  <span className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ease-in-out transform ${telegramNotificationActive ? 'translate-x-4 scale-100' : 'translate-x-0 scale-90'}`}></span>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                  <span className="text-xs text-slate-500">Bot Token</span>
                  <input type="text" className="flex-1 bg-slate-200 dark:bg-slate-700 border-0 rounded-lg px-3 py-2 text-sm" placeholder="请输入Telegram Bot Token" defaultValue="123456:ABCdefGHIjklMNOpqrSTUvwxYZ" />
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-xs text-slate-500">Chat ID</span>
                  <input type="text" className="flex-1 bg-slate-200 dark:bg-slate-700 border-0 rounded-lg px-3 py-2 text-sm" placeholder="请输入Chat ID" defaultValue="123456789" />
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-xs text-slate-500">通知类型</span>
                  <div className="flex flex-wrap gap-2">
                    <label className="flex items-center gap-2 bg-slate-200 dark:bg-slate-700 px-3 py-1.5 rounded-lg text-sm">
                      <input 
                        type="checkbox" 
                        className="rounded" 
                        checked={telegramNotificationTypes.priceAlert}
                        onChange={() => handleTelegramNotificationTypeChange('priceAlert')}
                      />
                      价格预警
                    </label>
                    <label className="flex items-center gap-2 bg-slate-200 dark:bg-slate-700 px-3 py-1.5 rounded-lg text-sm">
                      <input 
                        type="checkbox" 
                        className="rounded" 
                        checked={telegramNotificationTypes.technicalAlert}
                        onChange={() => handleTelegramNotificationTypeChange('technicalAlert')}
                      />
                      技术指标预警
                    </label>
                    <label className="flex items-center gap-2 bg-slate-200 dark:bg-slate-700 px-3 py-1.5 rounded-lg text-sm">
                      <input 
                        type="checkbox" 
                        className="rounded" 
                        checked={telegramNotificationTypes.chainEvent}
                        onChange={() => handleTelegramNotificationTypeChange('chainEvent')}
                      />
                      链上事件
                    </label>
                    <label className="flex items-center gap-2 bg-slate-200 dark:bg-slate-700 px-3 py-1.5 rounded-lg text-sm">
                      <input 
                        type="checkbox" 
                        className="rounded" 
                        checked={telegramNotificationTypes.aiReport}
                        onChange={() => handleTelegramNotificationTypeChange('aiReport')}
                      />
                      AI分析报告
                    </label>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="w-full py-2 text-center text-xs font-semibold text-primary border border-primary/30 rounded-lg hover:bg-primary/10 transition-colors">
                    测试Telegram通知
                  </button>
                </div>
              </div>
            </div>
            
            {/* Webhook通知设置 */}
            <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="size-8 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center">
                    <span className="material-symbols-outlined text-sm">code</span>
                  </div>
                  <div>
                    <p className="font-bold text-sm">Webhook</p>
                    <p className="text-xs text-slate-500">给开发者的HTTP回调通知</p>
                  </div>
                </div>
                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                  <input 
                    type="checkbox" 
                    name="toggle" 
                    id="webhook-notification-toggle" 
                    className="sr-only" 
                    checked={webhookNotificationActive}
                    onChange={() => setWebhookNotificationActive(!webhookNotificationActive)}
                  />
                  <label 
                    htmlFor="webhook-notification-toggle" 
                    className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-300 ease-in-out ${webhookNotificationActive ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-700'}`}
                  ></label>
                  <span className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ease-in-out transform ${webhookNotificationActive ? 'translate-x-4 scale-100' : 'translate-x-0 scale-90'}`}></span>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                  <span className="text-xs text-slate-500">Webhook URL</span>
                  <input type="text" className="flex-1 bg-slate-200 dark:bg-slate-700 border-0 rounded-lg px-3 py-2 text-sm" placeholder="请输入Webhook URL" />
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-xs text-slate-500">HTTP Method</span>
                  <select className="flex-1 bg-slate-200 dark:bg-slate-700 border-0 rounded-lg px-3 py-2 text-sm">
                    <option>POST</option>
                    <option>GET</option>
                    <option>PUT</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-xs text-slate-500">Secret Key (可选)</span>
                  <input type="text" className="flex-1 bg-slate-200 dark:bg-slate-700 border-0 rounded-lg px-3 py-2 text-sm" placeholder="请输入Secret Key" />
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-xs text-slate-500">通知类型</span>
                  <div className="flex flex-wrap gap-2">
                    <label className="flex items-center gap-2 bg-slate-200 dark:bg-slate-700 px-3 py-1.5 rounded-lg text-sm">
                      <input 
                        type="checkbox" 
                        className="rounded" 
                        checked={webhookNotificationTypes.priceAlert}
                        onChange={() => handleWebhookNotificationTypeChange('priceAlert')}
                      />
                      价格预警
                    </label>
                    <label className="flex items-center gap-2 bg-slate-200 dark:bg-slate-700 px-3 py-1.5 rounded-lg text-sm">
                      <input 
                        type="checkbox" 
                        className="rounded" 
                        checked={webhookNotificationTypes.technicalAlert}
                        onChange={() => handleWebhookNotificationTypeChange('technicalAlert')}
                      />
                      技术指标预警
                    </label>
                    <label className="flex items-center gap-2 bg-slate-200 dark:bg-slate-700 px-3 py-1.5 rounded-lg text-sm">
                      <input 
                        type="checkbox" 
                        className="rounded" 
                        checked={webhookNotificationTypes.chainEvent}
                        onChange={() => handleWebhookNotificationTypeChange('chainEvent')}
                      />
                      链上事件
                    </label>
                    <label className="flex items-center gap-2 bg-slate-200 dark:bg-slate-700 px-3 py-1.5 rounded-lg text-sm">
                      <input 
                        type="checkbox" 
                        className="rounded" 
                        checked={webhookNotificationTypes.aiReport}
                        onChange={() => handleWebhookNotificationTypeChange('aiReport')}
                      />
                      AI分析报告
                    </label>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="w-full py-2 text-center text-xs font-semibold text-primary border border-primary/30 rounded-lg hover:bg-primary/10 transition-colors">
                    测试Webhook
                  </button>
                </div>
              </div>
            </div>
            
            {/* 通知状态 */}
            <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">notifications_active</span>
                <span className="text-sm font-medium">通知渠道状态</span>
              </div>
              <span className={`text-xs font-semibold ${emailNotificationActive || telegramNotificationActive || webhookNotificationActive ? 'text-emerald-500' : 'text-slate-500'}`}>
                {emailNotificationActive || telegramNotificationActive || webhookNotificationActive ? 
                  `已启用 (${[emailNotificationActive, telegramNotificationActive, webhookNotificationActive].filter(Boolean).length}个渠道)` : 
                  '未启用'
                }
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* 订阅管理 Section */}
      <div className="px-4 py-4">
        <h3 className="text-lg font-bold tracking-tight pb-4">订阅管理</h3>
        <div className="bg-slate-100 dark:bg-[#1c2630] rounded-xl p-4 border border-transparent dark:border-slate-800">
          <div className="space-y-4">
            {/* 订阅状态 */}
            <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-bold text-sm">当前订阅状态</p>
                  <p className="text-xs text-slate-500">免费试用期</p>
                </div>
                <span className="text-xs font-semibold text-emerald-500">剩余 3 天</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mb-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '100%' }}></div>
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>开始: 2024-01-01</span>
                <span>结束: 2024-01-04</span>
              </div>
            </div>
            
            {/* 订阅计划 */}
            <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-bold text-sm">订阅计划</p>
                  <p className="text-xs text-slate-500">选择适合您的订阅方案</p>
                </div>
              </div>
              <div className="space-y-3">
                {/* 月付计划 */}
                <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg border border-primary/30">
                  <div>
                    <p className="font-bold text-sm">月付计划</p>
                    <p className="text-xs text-slate-500 mt-1">包含所有高级功能</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">10 USDT</p>
                    <p className="text-xs text-slate-500">每月</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 支付方式 */}
            <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-bold text-sm">支付方式</p>
                  <p className="text-xs text-slate-500">支持 USDT-ERC20 和 TRC20</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-slate-200 dark:bg-slate-700 rounded-lg">
                  <input type="radio" id="erc20" name="payment-method" className="w-4 h-4 text-primary" defaultChecked />
                  <label htmlFor="erc20" className="flex-1 text-sm font-medium">USDT-ERC20</label>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-200 dark:bg-slate-700 rounded-lg">
                  <input type="radio" id="trc20" name="payment-method" className="w-4 h-4 text-primary" />
                  <label htmlFor="trc20" className="flex-1 text-sm font-medium">USDT-TRC20</label>
                </div>
              </div>
            </div>
            
            {/* 支付地址 */}
            <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-bold text-sm">支付地址</p>
                  <p className="text-xs text-slate-500">请使用选择的网络进行支付</p>
                </div>
                <button className="text-xs font-semibold text-primary border border-primary/30 rounded-lg px-3 py-1 hover:bg-primary/10 transition-colors">
                  复制地址
                </button>
              </div>
              <div className="p-3 bg-slate-200 dark:bg-slate-700 rounded-lg text-xs font-mono">
                0x1234567890abcdef1234567890abcdef12345678
              </div>
              <div className="mt-3 text-xs text-slate-500">
                <p>• 请在24小时内完成支付</p>
                <p>• 支付金额: 10 USDT</p>
                <p>• 网络: ERC20</p>
              </div>
            </div>
            
            {/* 订阅操作 */}
            <div className="space-y-3">
              <button className="w-full py-3 text-center text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors">
                立即续费
              </button>
              <button className="w-full py-3 text-center text-sm font-semibold text-primary border border-primary/30 rounded-lg hover:bg-primary/10 transition-colors">
                查看订阅历史
              </button>
              <button className="w-full py-3 text-center text-sm font-semibold text-slate-500 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                取消订阅
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default MainContent;