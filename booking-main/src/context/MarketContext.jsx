import React, { createContext, useState, useContext, useEffect } from 'react';

/**
 * 市场数据上下文
 * 处理市场数据相关的状态和逻辑
 */
const MarketContext = createContext();

/**
 * 市场数据上下文提供者组件
 * @param {Object} props - 组件属性
 * @param {React.ReactNode} props.children - 子组件
 */
export const MarketProvider = ({ children }) => {
  // 市场数据状态
  const [marketData, setMarketData] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [priceAlerts, setPriceAlerts] = useState([]);

  /**
   * 添加到观察列表
   * @param {string} symbolId - 交易对ID
   */
  const addToWatchlist = (symbolId) => {
    if (!watchlist.includes(symbolId)) {
      const newWatchlist = [...watchlist, symbolId];
      setWatchlist(newWatchlist);
      localStorage.setItem('watchlist', JSON.stringify(newWatchlist));
    }
  };

  /**
   * 从观察列表移除
   * @param {string} symbolId - 交易对ID
   */
  const removeFromWatchlist = (symbolId) => {
    const newWatchlist = watchlist.filter(id => id !== symbolId);
    setWatchlist(newWatchlist);
    localStorage.setItem('watchlist', JSON.stringify(newWatchlist));
  };

  /**
   * 预留API：获取市场数据
   * @returns {Promise<Array>} - 市场数据
   */
  const fetchMarketData = async () => {
    // 预留API调用位置
    // 后续实现：调用真实API获取市场数据
    // 暂时返回模拟数据
    return marketData;
  };

  /**
   * 预留API：获取价格预警列表
   * @returns {Promise<Array>} - 价格预警列表
   */
  const fetchPriceAlerts = async () => {
    // 预留API调用位置
    // 后续实现：调用真实API获取价格预警列表
    // 暂时返回模拟数据
    return priceAlerts;
  };

  /**
   * 从本地存储加载数据
   * 应用启动时执行一次
   */
  useEffect(() => {
    // 加载观察列表
    const savedWatchlist = localStorage.getItem('watchlist');
    if (savedWatchlist) {
      setWatchlist(JSON.parse(savedWatchlist));
    } else {
      // 默认为空数组
      setWatchlist([]);
    }

    // 模拟市场数据 - 包含BTC、ETH和前100个主流山寨币
    const mockMarketData = [
      // BTC和ETH
      { id: 'BTC-USDT', symbol: 'BTC/USDT', name: 'Bitcoin', price: 64231, change: 2.4, isPositive: true },
      { id: 'ETH-USDT', symbol: 'ETH/USDT', name: 'Ethereum', price: 3452, change: -1.2, isPositive: false },
      // 前100个主流山寨币
      { id: 'SOL-USDT', symbol: 'SOL/USDT', name: 'Solana', price: 142.12, change: 5.8, isPositive: true },
      { id: 'ARB-USDT', symbol: 'ARB/USDT', name: 'Arbitrum', price: 1.12, change: 12.4, isPositive: true },
      { id: 'LINK-USDT', symbol: 'LINK/USDT', name: 'Chainlink', price: 18.45, change: 8.1, isPositive: true },
      { id: 'PEPE-USDT', symbol: 'PEPE/USDT', name: 'Pepe', price: 0.000008, change: 7.4, isPositive: true },
      { id: 'OP-USDT', symbol: 'OP/USDT', name: 'Optimism', price: 2.41, change: 6.9, isPositive: true },
      { id: 'BNB-USDT', symbol: 'BNB/USDT', name: 'Binance Coin', price: 352.45, change: 3.2, isPositive: true },
      { id: 'ADA-USDT', symbol: 'ADA/USDT', name: 'Cardano', price: 0.52, change: -0.8, isPositive: false },
      { id: 'DOT-USDT', symbol: 'DOT/USDT', name: 'Polkadot', price: 6.23, change: 4.5, isPositive: true },
      { id: 'DOGE-USDT', symbol: 'DOGE/USDT', name: 'Dogecoin', price: 0.12, change: 2.1, isPositive: true },
      { id: 'SHIB-USDT', symbol: 'SHIB/USDT', name: 'Shiba Inu', price: 0.000009, change: 5.3, isPositive: true },
      { id: 'AVAX-USDT', symbol: 'AVAX/USDT', name: 'Avalanche', price: 32.45, change: -1.5, isPositive: false },
      { id: 'TRX-USDT', symbol: 'TRX/USDT', name: 'Tron', price: 0.11, change: 0.5, isPositive: true },
      { id: 'MATIC-USDT', symbol: 'MATIC/USDT', name: 'Polygon', price: 0.98, change: 3.7, isPositive: true },
      { id: 'ATOM-USDT', symbol: 'ATOM/USDT', name: 'Cosmos', price: 12.34, change: -2.3, isPositive: false },
      { id: 'LTC-USDT', symbol: 'LTC/USDT', name: 'Litecoin', price: 89.45, change: 1.8, isPositive: true },
      { id: 'XLM-USDT', symbol: 'XLM/USDT', name: 'Stellar', price: 0.13, change: 0.9, isPositive: true },
      { id: 'XMR-USDT', symbol: 'XMR/USDT', name: 'Monero', price: 156.78, change: 2.7, isPositive: true },
      { id: 'BCH-USDT', symbol: 'BCH/USDT', name: 'Bitcoin Cash', price: 298.45, change: -0.6, isPositive: false },
      { id: 'ETC-USDT', symbol: 'ETC/USDT', name: 'Ethereum Classic', price: 15.67, change: 4.2, isPositive: true },
      { id: 'FIL-USDT', symbol: 'FIL/USDT', name: 'Filecoin', price: 4.56, change: -3.1, isPositive: false },
      { id: 'SAND-USDT', symbol: 'SAND/USDT', name: 'The Sandbox', price: 0.45, change: 6.7, isPositive: true },
      { id: 'MANA-USDT', symbol: 'MANA/USDT', name: 'Decentraland', price: 0.32, change: 5.4, isPositive: true },
      { id: 'AXS-USDT', symbol: 'AXS-USDT', name: 'Axie Infinity', price: 7.89, change: -2.8, isPositive: false }
    ];
    
    setMarketData(mockMarketData);
    
    // 模拟价格预警任务
    const mockPriceAlerts = [
      {
        id: 1,
        symbol: 'BTC/USDT',
        name: 'Bitcoin',
        condition: '价格大于',
        threshold: 70000,
        frequency: '每15分钟',
        isActive: true
      },
      {
        id: 2,
        symbol: 'SOL/USDT',
        name: 'Solana',
        condition: '价格小于',
        threshold: 150,
        frequency: '每5分钟',
        isActive: true
      },
      {
        id: 3,
        symbol: 'ETH/USDT',
        name: 'Ethereum',
        condition: '价格大于',
        threshold: 4000,
        frequency: '每30分钟',
        isActive: false
      }
    ];
    
    setPriceAlerts(mockPriceAlerts);
  }, []);
  
  // 上下文值，包含所有状态和方法
  const contextValue = {
    marketData,
    watchlist,
    priceAlerts,
    addToWatchlist,
    removeFromWatchlist,
    fetchMarketData,
    fetchPriceAlerts
  };
  
  return (
    <MarketContext.Provider value={contextValue}>
      {children}
    </MarketContext.Provider>
  );
};

/**
 * 自定义Hook，用于访问市场数据上下文
 * @returns {Object} - 市场数据上下文值
 * @throws {Error} - 如果在MarketProvider之外使用
 */
export const useMarket = () => {
  const context = useContext(MarketContext);
  if (!context) {
    throw new Error('useMarket must be used within a MarketProvider');
  }
  return context;
};