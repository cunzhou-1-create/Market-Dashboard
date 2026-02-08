import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navigation from './Navigation';
import api from '../services/api';

/**
 * 币对详情组件
 * 显示单个币对的详细信息，包括价格、K线图和AI分析
 */
const Detail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // 状态管理
  const [symbol, setSymbol] = useState('BTC/USDT');
  const [symbolData, setSymbolData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 从URL参数中获取币对符号
  useEffect(() => {
    if (location.state?.symbol) {
      setSymbol(location.state.symbol);
    }
  }, [location.state]);
  
  // 获取币对详细信息
  useEffect(() => {
    const fetchSymbolData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await api.market.getSymbolDetail(symbol);
        setSymbolData(data);
      } catch (err) {
        setError(err.message || '获取币对数据失败');
        console.error('Error fetching symbol data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSymbolData();
  }, [symbol]);

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white min-h-screen">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center p-4 justify-between max-w-md mx-auto">
          <div className="flex items-center gap-3">
            <span 
              className="material-symbols-outlined cursor-pointer"
              onClick={() => navigate(-1)}
            >
              arrow_back_ios
            </span>
            <div>
              <h2 className="text-lg font-bold leading-tight">{symbol}</h2>
              {symbolData && (
                <p className={`text-xs font-medium ${symbolData.isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {symbolData.isPositive ? '+' : ''}{symbolData.change}% (24h)
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="material-symbols-outlined text-primary">star</span>
            <span className="material-symbols-outlined">share</span>
          </div>
        </div>
      </div>
      
      <main className="max-w-md mx-auto pb-40">
        {/* Live Price & Key Stats */}
        <div className="px-4 py-4 flex justify-between items-end">
          {loading ? (
            <div className="flex-1">
              <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded mt-2 animate-pulse"></div>
            </div>
          ) : error ? (
            <div className="flex-1 text-rose-500">
              <p>{error}</p>
            </div>
          ) : symbolData ? (
            <div>
              <p className="text-3xl font-bold tracking-tight">${symbolData.price.toLocaleString()}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">≈ {symbolData.price.toLocaleString()} USD</p>
            </div>
          ) : (
            <div>
              <p className="text-3xl font-bold tracking-tight">$0.00</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">≈ 0.00 USD</p>
            </div>
          )}
          <div className="text-right text-xs space-y-1 text-slate-500 dark:text-slate-400">
            {symbolData && (
              <>
                <p>24h High: <span className="text-slate-900 dark:text-white">{symbolData.high?.toLocaleString() || '0.00'}</span></p>
                <p>24h Low: <span className="text-slate-900 dark:text-white">{symbolData.low?.toLocaleString() || '0.00'}</span></p>
              </>
            )}
          </div>
        </div>
        
        {/* Chart Tabs */}
        <div className="px-4">
          <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6">
            <a className="flex flex-col items-center justify-center border-b-2 border-transparent text-slate-500 dark:text-slate-400 pb-2 pt-2 transition-all" href="#">
              <p className="text-xs font-bold">15m</p>
            </a>
            <a className="flex flex-col items-center justify-center border-b-2 border-primary text-primary pb-2 pt-2" href="#">
              <p className="text-xs font-bold">1H</p>
            </a>
            <a className="flex flex-col items-center justify-center border-b-2 border-transparent text-slate-500 dark:text-slate-400 pb-2 pt-2" href="#">
              <p className="text-xs font-bold">4H</p>
            </a>
            <a className="flex flex-col items-center justify-center border-b-2 border-transparent text-slate-500 dark:text-slate-400 pb-2 pt-2" href="#">
              <p className="text-xs font-bold">1D</p>
            </a>
            <a className="flex flex-col items-center justify-center border-b-2 border-transparent text-slate-500 dark:text-slate-400 pb-2 pt-2" href="#">
              <p className="text-xs font-bold">More</p>
            </a>
          </div>
        </div>
        
        {/* Professional K-Line Chart Area */}
        <div className="p-4">
          <div className="w-full aspect-[4/3] bg-slate-100 dark:bg-slate-900 rounded-lg flex flex-col items-center justify-center overflow-hidden border border-slate-200 dark:border-slate-800 relative group" data-alt="Cryptocurrency candlestick chart with moving averages and volume indicators">
            <div className="absolute inset-0 bg-cover bg-center opacity-80" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBUzPDFJi74AHiOyEccjEXPsKEyz3MxNNg2fkRw7BO47A_UKxi47ARSbn7DcuD_wbsV-fiHFJQbvEC6UWYPTTZfA38V_GgWCyD37sgkRGyTFPpsJVuKuzCPLfYSUDu4yrA2pxufzGRVgWz25GUuKSLm6rxS5LL2mfiy_D9bqrWEX5Wt0rCGKx3X_l5MIQdLa6G9omM1GDBNlnyunZ4lZ7N-X9BVJVPksWNmFeW87zopyQgqO5On8lruNZNoMtN2qmzu4FUqVT_1OcY5")' }}></div>
            {/* Chart Overlay UI */}
            <div className="absolute top-2 left-2 flex gap-2">
              <span className="text-[10px] px-1.5 py-0.5 bg-black/40 text-yellow-400 rounded">MA(7): 64120.5</span>
              <span className="text-[10px] px-1.5 py-0.5 bg-black/40 text-pink-400 rounded">MA(25): 63840.2</span>
            </div>
          </div>
        </div>
        
        {/* Qwen AI Insight Section */}
        <div className="px-4 pt-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 p-1.5 rounded-lg">
                <span className="material-symbols-outlined text-primary text-xl">psychology</span>
              </div>
              <h2 className="text-xl font-bold tracking-tight">Qwen AI Insight</h2>
            </div>
            <span className="text-[10px] font-medium bg-primary/20 text-primary px-2 py-1 rounded-full uppercase tracking-wider">Live Analysis</span>
          </div>
          
          {/* Analysis Summary Card */}
          <div className="bg-white dark:bg-[#192633] rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-800 mb-6">
            <div className="flex justify-between items-start mb-4">
              <p className="text-lg font-bold">Market Analysis Summary</p>
              <span className="text-[10px] text-slate-400">2 mins ago</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-4">
              BTC is showing strong bullish divergence on the 1H timeframe. RSI is currently at 62, indicating healthy upward momentum without reaching overbought territory. Strong support established at $62,500. Recommend cautious accumulation.
            </p>
            
            {/* Technical Indicators Grid */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-background-light dark:bg-background-dark p-3 rounded-lg text-center">
                <p className="text-[10px] text-slate-500 uppercase mb-1">RSI (14)</p>
                <p className="font-bold text-success">62.45</p>
              </div>
              <div className="bg-background-light dark:bg-background-dark p-3 rounded-lg text-center">
                <p className="text-[10px] text-slate-500 uppercase mb-1">MACD</p>
                <p className="font-bold text-success">Bullish</p>
              </div>
              <div className="bg-background-light dark:bg-background-dark p-3 rounded-lg text-center">
                <p className="text-[10px] text-slate-500 uppercase mb-1">VOL</p>
                <p className="font-bold text-primary">High</p>
              </div>
            </div>
          </div>
          
          {/* Sentiment Gauge */}
          <div className="bg-white dark:bg-[#192633] rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-6 uppercase tracking-widest text-center">Sentiment Spectrum</h3>
            <div className="relative pt-2 pb-8">
              <div className="h-2 w-full gauge-gradient rounded-full"></div>
              {/* Indicator Pin */}
              <div className="absolute top-0 left-[75%] -ml-3 flex flex-col items-center">
                <div className="w-6 h-6 bg-white dark:bg-slate-900 border-4 border-success rounded-full shadow-lg"></div>
                <div className="h-4 w-0.5 bg-success"></div>
              </div>
            </div>
            <div className="flex justify-between text-xs font-bold mt-2 px-1">
              <span className="text-danger">STRONG SELL</span>
              <span className="text-slate-400">NEUTRAL</span>
              <span className="text-success">STRONG BUY</span>
            </div>
            <div className="mt-8 flex items-center justify-between p-4 bg-success/10 border border-success/20 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-success">verified</span>
                <div>
                  <p className="text-xs text-success font-bold uppercase">Verdict</p>
                  <p className="text-lg font-bold">Strong Buy</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500">Confidence</p>
                <p className="text-lg font-bold">88%</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Disclaimer */}
        <p className="px-6 py-8 text-[10px] text-slate-500 text-center leading-relaxed">
          AI analysis is for informational purposes only. Trading involves risk. Please consult a financial advisor before making investment decisions.
        </p>
      </main>
      
      {/* Bottom Fixed Action Bar */}
      <div className="fixed bottom-24 left-0 right-0 bg-white/90 dark:bg-[#101922]/90 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 p-4 z-40">
        <div className="max-w-md mx-auto flex gap-3">
          <button className="flex-1 flex items-center justify-center gap-2 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold transition-active">
            <span className="material-symbols-outlined text-[20px]">refresh</span>
            Refresh
          </button>
          <button className="flex-[2] h-12 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/30 transition-active">
            Trade BTC/USDT
          </button>
        </div>
      </div>
      
      {/* Navigation Bar */}
      <Navigation />
    </div>
  );
};

export default Detail;