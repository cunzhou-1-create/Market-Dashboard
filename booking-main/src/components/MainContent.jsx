import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMarket } from '../context/MarketContext';
import api from '../services/api';

/**
 * 主内容组件
 * 包含多个功能模块，通过菜单栏切换
 */
const MainContent = () => {
  const navigate = useNavigate();
  const { marketData, marketType, setMarketType, isLoading, error } = useMarket();
  
  // 选中的菜单状态
  const [selectedMenu, setSelectedMenu] = useState('real-time');
  
  // 24小时涨跌幅图表数据
  const [chartData, setChartData] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [chartError, setChartError] = useState(null);
  
  // 缓存市场数据计算结果
  const btcData = useMemo(() => marketData.find(item => item.symbol === 'BTC/USDT'), [marketData]);
  const ethData = useMemo(() => marketData.find(item => item.symbol === 'ETH/USDT'), [marketData]);
  const altcoinsData = useMemo(() => marketData.filter(item => item.symbol !== 'BTC/USDT' && item.symbol !== 'ETH/USDT'), [marketData]);
  
  /**
   * 处理币对点击
   * 导航到详情页面
   * @param {string} symbol - 币对符号
   */
  const handleSymbolClick = (symbol) => {
    navigate('/detail', { state: { symbol } });
  };
  
  /**
   * 获取24小时涨跌幅图表数据
   */
  const fetchChartData = async () => {
    try {
      setChartError(null);
      // 获取BTC/USDT的1小时K线数据，最近24小时
      const klinesData = await api.market.getKlinesData('BTC/USDT', '1h', 24);
      
      // 计算每小时的涨跌幅
      const hourlyChanges = klinesData.map((kline, index) => {
        if (index === 0) {
          return 0; // 第一个数据点涨跌幅为0
        }
        const previousClose = klinesData[index - 1].close;
        const currentClose = kline.close;
        const changePercent = ((currentClose - previousClose) / previousClose) * 100;
        return changePercent;
      });
      
      setChartData(hourlyChanges);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('获取图表数据失败:', error);
      setChartError('获取图表数据失败，请稍后重试');
      // 使用模拟数据作为 fallback
      setChartData([3.0, 5.0, 7.0, -4.0, -6.0, -3.0, 2.0, 4.0, 6.0, 8.0, 10.0, 7.0, -2.0, -4.0, -6.0, -3.0, 5.0, 7.0, 4.0, -2.0, 3.0, 5.0, 7.0, 9.0]);
      setLastUpdated(new Date());
    }
  };
  
  // 组件挂载时获取数据，每30秒刷新一次
  useEffect(() => {
    fetchChartData();
    const interval = setInterval(fetchChartData, 30000);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <main className="max-w-md mx-auto">
      {/* 错误提示 */}
      {error && (
        <div className="px-4 py-3 m-4 bg-rose-500/10 text-rose-500 rounded-lg text-sm font-medium">
          {error}
        </div>
      )}
      
      {/* 加载状态 */}
      {isLoading && (
        <div className="px-4 py-8 m-4 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-3 text-sm font-medium">加载中...</span>
        </div>
      )}
      {/* 菜单栏 */}
      <div className="px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">市场监控</h2>
          
          {/* 期货/现货切换按钮组 */}
          <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
            <button 
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                marketType === 'spot' 
                  ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' 
                  : 'text-slate-600 dark:text-slate-300 hover:text-primary'
              }`}
              onClick={() => setMarketType('spot')}
            >
              现货
            </button>
            <button 
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                marketType === 'futures' 
                  ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' 
                  : 'text-slate-600 dark:text-slate-300 hover:text-primary'
              }`}
              onClick={() => setMarketType('futures')}
            >
              期货
            </button>
          </div>
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
              {btcData && (
                <div className="bg-slate-100 dark:bg-[#1c2630] rounded-xl p-4 border border-transparent dark:border-slate-800">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <div className="size-8 rounded-full bg-orange-500/20 text-orange-500 flex items-center justify-center">
                        <span className="font-bold text-sm">BTC</span>
                      </div>
                      <span className="font-bold text-sm">Bitcoin</span>
                    </div>
                    <span className={`text-xs font-bold ${btcData.isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {btcData.isPositive ? '+' : ''}{btcData.change}%
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black">${btcData.price.toLocaleString()}</span>
                    <span className="text-xs text-slate-500">USDT</span>
                  </div>
                  <div className="mt-2 text-xs text-slate-500">24h 涨跌幅</div>
                </div>
              )}
              
              {/* ETH Card */}
              {ethData && (
                <div className="bg-slate-100 dark:bg-[#1c2630] rounded-xl p-4 border border-transparent dark:border-slate-800">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <div className="size-8 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center">
                        <span className="font-bold text-sm">ETH</span>
                      </div>
                      <span className="font-bold text-sm">Ethereum</span>
                    </div>
                    <span className={`text-xs font-bold ${ethData.isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {ethData.isPositive ? '+' : ''}{ethData.change}%
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black">${ethData.price.toLocaleString()}</span>
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
                {altcoinsData.map((item, index) => (
                  <div 
                    key={item.id} 
                    className={`flex justify-between items-center py-2 ${index < altcoinsData.length - 1 ? 'border-b border-slate-200 dark:border-slate-800' : ''}`}
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
          
          {/* 24小时涨跌幅图表 */}
          <div className="px-4 py-4">
            <h3 className="text-lg font-bold tracking-tight pb-4">24小时涨跌幅</h3>
            <div className="w-full bg-slate-100 dark:bg-[#1c2630] rounded-xl p-4">
              {chartError && (
                <div className="text-sm text-rose-500 mb-4">{chartError}</div>
              )}
              
              {/* 24h 总涨跌幅 */}
              <div className="flex items-baseline gap-2 mb-4">
                {chartData.length > 0 ? (
                  <>
                    <span className={`text-2xl font-black ${chartData[chartData.length - 1] >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {chartData[chartData.length - 1] >= 0 ? '+' : ''}{chartData[chartData.length - 1].toFixed(2)}%
                    </span>
                    <span className="text-xs text-slate-500 font-medium">24h 总涨跌幅</span>
                  </>
                ) : (
                  <span className="text-2xl font-black">加载中...</span>
                )}
              </div>
              
              {/* 动态折线图 */}
              {chartData.length > 0 && (
                <div className="h-40 relative mb-4">
                  <svg width="100%" height="100%" viewBox="0 0 400 160" className="w-full h-full">
                    {/* 计算图表数据范围 */}
                    {(() => {
                      const min = Math.min(...chartData) * 1.2;
                      const max = Math.max(...chartData) * 1.2;
                      const range = max - min || 1;
                      
                      // 生成路径数据
                      const pathData = chartData.map((value, index) => {
                        const x = (index / (chartData.length - 1)) * 380 + 10;
                        const y = 150 - ((value - min) / range) * 140;
                        return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
                      }).join(' ');
                      
                      // 生成数据点
                      const dataPoints = chartData.map((value, index) => {
                        const x = (index / (chartData.length - 1)) * 380 + 10;
                        const y = 150 - ((value - min) / range) * 140;
                        return (
                          <circle
                            key={index}
                            cx={x}
                            cy={y}
                            r="3"
                            fill={value >= 0 ? '#10b981' : '#ef4444'}
                            className="transition-all hover:r-4"
                          />
                        );
                      });
                      
                      return (
                        <>
                          {/* 网格线 */}
                          <line x1="10" y1="10" x2="390" y2="10" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="2,2" />
                          <line x1="10" y1="80" x2="390" y2="80" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="2,2" />
                          <line x1="10" y1="150" x2="390" y2="150" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="2,2" />
                          
                          {/* 数据线 */}
                          <path
                            d={pathData}
                            stroke={chartData[chartData.length - 1] >= 0 ? '#10b981' : '#ef4444'}
                            strokeWidth="2"
                            fill="none"
                          />
                          
                          {/* 数据点 */}
                          {dataPoints}
                          
                          {/* 区域填充 */}
                          <path
                            d={`${pathData} L 390 150 L 10 150 Z`}
                            fill={chartData[chartData.length - 1] >= 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'}
                          />
                        </>
                      );
                    })()}
                  </svg>
                </div>
              )}
              
              {/* 时间轴 */}
              <div className="flex justify-between mt-2">
                <span className="text-[10px] text-slate-500 font-bold">00:00</span>
                <span className="text-[10px] text-slate-500 font-bold">06:00</span>
                <span className="text-[10px] text-slate-500 font-bold">12:00</span>
                <span className="text-[10px] text-slate-500 font-bold">18:00</span>
                <span className="text-[10px] text-slate-500 font-bold">23:59</span>
              </div>
              
              {/* 最后更新时间 */}
              {lastUpdated && (
                <div className="mt-3 text-right">
                  <span className="text-xs text-slate-500">
                    更新时间: {lastUpdated.getFullYear()}{lastUpdated.getMonth() + 1}{lastUpdated.getDate()}
                  </span>
                </div>
              )}
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