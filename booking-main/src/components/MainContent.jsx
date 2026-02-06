import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

/**
 * 主内容组件
 * 包含多个功能模块，通过菜单栏切换
 */
const MainContent = () => {
  const navigate = useNavigate();
  // 添加默认值处理，确保即使useApp返回undefined也能正常运行
  const appContext = useApp() || {};
  const { 
    marketData = []
  } = appContext;
  
  // 选中的菜单状态
  const [selectedMenu, setSelectedMenu] = useState('real-time');
  
  /**
   * 处理币对点击
   * 导航到详情页面
   * @param {string} symbol - 币对符号
   */
  const handleSymbolClick = (symbol) => {
    navigate('/detail', { state: { symbol } });
  };
  
  return (
    <main className="max-w-md mx-auto">
      {/* 菜单栏 */}
      <div className="px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">市场监控</h2>
        </div>
        
        {/* 菜单选项卡 */}
        <div className="flex overflow-x-auto hide-scrollbar gap-2 mb-6">
          <button 
            className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors ${
              selectedMenu === 'real-time' 
                ? 'bg-primary text-white' 
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
            onClick={() => setSelectedMenu('real-time')}
          >
            实时行情监控
          </button>
          <button 
            className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors ${
              selectedMenu === 'technical' 
                ? 'bg-primary text-white' 
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
            onClick={() => setSelectedMenu('technical')}
          >
            技术指标预警
          </button>
        </div>
      </div>
      
      {/* 根据选中的菜单显示不同内容 */}
      {selectedMenu === 'real-time' && (
        <>
          {/* Real-time Market Monitoring */}
          <div className="px-4 py-4">
            <h3 className="text-lg font-bold tracking-tight pb-4">实时行情监控</h3>
            
            {/* BTC & ETH Section */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {/* BTC Card */}
              {marketData.find(item => item.symbol === 'BTC/USDT') && (
                <div className="bg-slate-100 dark:bg-[#1c2630] rounded-xl p-4 border border-transparent dark:border-slate-800">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <div className="size-8 rounded-full bg-orange-500/20 text-orange-500 flex items-center justify-center">
                        <span className="font-bold text-sm">BTC</span>
                      </div>
                      <span className="font-bold text-sm">Bitcoin</span>
                    </div>
                    <span className={`text-xs font-bold ${marketData.find(item => item.symbol === 'BTC/USDT').isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {marketData.find(item => item.symbol === 'BTC/USDT').isPositive ? '+' : ''}{marketData.find(item => item.symbol === 'BTC/USDT').change}%
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black">${marketData.find(item => item.symbol === 'BTC/USDT').price.toLocaleString()}</span>
                    <span className="text-xs text-slate-500">USDT</span>
                  </div>
                  <div className="mt-2 text-xs text-slate-500">24h 涨跌幅</div>
                </div>
              )}
              
              {/* ETH Card */}
              {marketData.find(item => item.symbol === 'ETH/USDT') && (
                <div className="bg-slate-100 dark:bg-[#1c2630] rounded-xl p-4 border border-transparent dark:border-slate-800">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <div className="size-8 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center">
                        <span className="font-bold text-sm">ETH</span>
                      </div>
                      <span className="font-bold text-sm">Ethereum</span>
                    </div>
                    <span className={`text-xs font-bold ${marketData.find(item => item.symbol === 'ETH/USDT').isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {marketData.find(item => item.symbol === 'ETH/USDT').isPositive ? '+' : ''}{marketData.find(item => item.symbol === 'ETH/USDT').change}%
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black">${marketData.find(item => item.symbol === 'ETH/USDT').price.toLocaleString()}</span>
                    <span className="text-xs text-slate-500">USDT</span>
                  </div>
                  <div className="mt-2 text-xs text-slate-500">24h 涨跌幅</div>
                </div>
              )}
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
              <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {marketData.filter(item => item.symbol !== 'BTC/USDT' && item.symbol !== 'ETH/USDT').map((item, index) => (
                  <div 
                    key={item.id} 
                    className={`flex justify-between items-center py-2 ${index < marketData.filter(item => item.symbol !== 'BTC/USDT' && item.symbol !== 'ETH/USDT').length - 1 ? 'border-b border-slate-200 dark:border-slate-800' : ''}`}
                  >
                    <div className="w-1/3 flex items-center gap-2">
                      <div className="size-6 rounded-full bg-purple-500/20 text-purple-500 flex items-center justify-center">
                        <span className="font-bold text-xs">{item.symbol.split('/')[0]}</span>
                      </div>
                      <span className="text-sm font-medium">{item.name}</span>
                    </div>
                    <div className="w-1/3 text-right font-medium">${item.price.toLocaleString()}</div>
                    <div className={`w-1/3 text-right font-bold ${item.isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {item.isPositive ? '+' : ''}{item.change}%
                    </div>
                  </div>
                ))}
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
          

        </>
      )}
      
      {/* 技术指标预警 Section - 只在选中技术指标预警菜单时显示 */}
      {selectedMenu === 'technical' && (
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
        )}
      </main>
  );
};

export default MainContent;