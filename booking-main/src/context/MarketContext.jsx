import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

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
  const [marketType, setMarketType] = useState('spot'); // 'spot' 现货, 'futures' 期货
  const [spotData, setSpotData] = useState([]);
  const [futuresData, setFuturesData] = useState([]);

  /**
   * 添加到观察列表
   * @param {string} symbolId - 交易对ID
   * @returns {Promise<boolean>} - 是否添加成功
   */
  const addToWatchlist = async (symbolId) => {
    try {
      // 调用真实API添加到观察列表
      await api.market.addToWatchlist(symbolId);
      
      // 更新本地状态
      if (!watchlist.includes(symbolId)) {
        const newWatchlist = [...watchlist, symbolId];
        setWatchlist(newWatchlist);
        localStorage.setItem('watchlist', JSON.stringify(newWatchlist));
      }
      
      return true;
    } catch (error) {
      console.error('添加到观察列表失败:', error);
      return false;
    }
  };

  /**
   * 从观察列表移除
   * @param {string} symbolId - 交易对ID
   * @returns {Promise<boolean>} - 是否移除成功
   */
  const removeFromWatchlist = async (symbolId) => {
    try {
      // 调用真实API从观察列表移除
      await api.market.removeFromWatchlist(symbolId);
      
      // 更新本地状态
      const newWatchlist = watchlist.filter(id => id !== symbolId);
      setWatchlist(newWatchlist);
      localStorage.setItem('watchlist', JSON.stringify(newWatchlist));
      
      return true;
    } catch (error) {
      console.error('从观察列表移除失败:', error);
      return false;
    }
  };

  /**
   * 获取市场数据
   * @returns {Promise<Array>} - 市场数据
   */
  const fetchMarketData = async () => {
    try {
      // 调用真实API获取市场数据
      const response = await api.market.getMarketList();
      const data = response.data || [];
      setMarketData(data);
      return data;
    } catch (error) {
      console.error('获取市场数据失败:', error);
      // 发生错误时返回当前数据
      return marketData;
    }
  };

  /**
   * 获取价格预警列表
   * @returns {Promise<Array>} - 价格预警列表
   */
  const fetchPriceAlerts = async () => {
    try {
      // 调用真实API获取价格预警列表
      const alerts = await api.alerts.getAlerts();
      setPriceAlerts(alerts);
      return alerts;
    } catch (error) {
      console.error('获取价格预警列表失败:', error);
      // 发生错误时返回当前数据
      return priceAlerts;
    }
  };
  
  /**
   * 创建价格预警
   * @param {Object} alertData - 价格预警数据
   * @returns {Promise<Object|null>} - 创建的价格预警
   */
  const createPriceAlert = async (alertData) => {
    try {
      // 调用真实API创建价格预警
      const alert = await api.alerts.createAlert(alertData);
      
      // 更新本地状态
      setPriceAlerts(prev => [...prev, alert]);
      return alert;
    } catch (error) {
      console.error('创建价格预警失败:', error);
      return null;
    }
  };
  
  /**
   * 更新价格预警
   * @param {number} alertId - 价格预警ID
   * @param {Object} alertData - 价格预警数据
   * @returns {Promise<Object|null>} - 更新后的价格预警
   */
  const updatePriceAlert = async (alertId, alertData) => {
    try {
      // 调用真实API更新价格预警
      const alert = await api.alerts.updateAlert(alertId, alertData);
      
      // 更新本地状态
      setPriceAlerts(prev => prev.map(item => 
        item.id === alertId ? alert : item
      ));
      return alert;
    } catch (error) {
      console.error('更新价格预警失败:', error);
      return null;
    }
  };
  
  /**
   * 删除价格预警
   * @param {number} alertId - 价格预警ID
   * @returns {Promise<boolean>} - 是否删除成功
   */
  const deletePriceAlert = async (alertId) => {
    try {
      // 调用真实API删除价格预警
      await api.alerts.deleteAlert(alertId);
      
      // 更新本地状态
      setPriceAlerts(prev => prev.filter(item => item.id !== alertId));
      return true;
    } catch (error) {
      console.error('删除价格预警失败:', error);
      return false;
    }
  };
  
  /**
   * 切换价格预警状态
   * @param {number} alertId - 价格预警ID
   * @returns {Promise<boolean|null>} - 切换后的状态
   */
  const togglePriceAlert = async (alertId) => {
    try {
      // 调用真实API切换价格预警状态
      const response = await api.alerts.toggleAlert(alertId);
      const { is_active } = response;
      
      // 更新本地状态
      setPriceAlerts(prev => prev.map(item => 
        item.id === alertId ? { ...item, is_active } : item
      ));
      return is_active;
    } catch (error) {
      console.error('切换价格预警状态失败:', error);
      return null;
    }
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

    // 模拟现货数据 - 包含BTC、ETH和前100个主流山寨币
    const mockSpotData = [
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
    
    // 模拟期货数据 - 包含主要期货合约
    const mockFuturesData = [
      // BTC和ETH期货
      { id: 'BTC-USDT-F', symbol: 'BTC/USDT', name: 'Bitcoin Futures', price: 64350, change: 2.6, isPositive: true },
      { id: 'ETH-USDT-F', symbol: 'ETH/USDT', name: 'Ethereum Futures', price: 3465, change: -1.0, isPositive: false },
      // 其他主流币期货
      { id: 'SOL-USDT-F', symbol: 'SOL/USDT', name: 'Solana Futures', price: 143.25, change: 6.1, isPositive: true },
      { id: 'BNB-USDT-F', symbol: 'BNB/USDT', name: 'Binance Coin Futures', price: 353.75, change: 3.4, isPositive: true },
      { id: 'ADA-USDT-F', symbol: 'ADA/USDT', name: 'Cardano Futures', price: 0.53, change: -0.6, isPositive: false },
      { id: 'DOT-USDT-F', symbol: 'DOT/USDT', name: 'Polkadot Futures', price: 6.28, change: 4.8, isPositive: true },
      { id: 'DOGE-USDT-F', symbol: 'DOGE/USDT', name: 'Dogecoin Futures', price: 0.12, change: 2.3, isPositive: true },
      { id: 'AVAX-USDT-F', symbol: 'AVAX/USDT', name: 'Avalanche Futures', price: 32.58, change: -1.3, isPositive: false },
      { id: 'MATIC-USDT-F', symbol: 'MATIC/USDT', name: 'Polygon Futures', price: 0.99, change: 3.9, isPositive: true },
      { id: 'LTC-USDT-F', symbol: 'LTC/USDT', name: 'Litecoin Futures', price: 89.75, change: 2.0, isPositive: true }
    ];
    
    setSpotData(mockSpotData);
    setFuturesData(mockFuturesData);
    setMarketData(marketType === 'spot' ? mockSpotData : mockFuturesData);
    
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
  
  // 当市场类型变化时，更新市场数据
  useEffect(() => {
    setMarketData(marketType === 'spot' ? spotData : futuresData);
  }, [marketType, spotData, futuresData]);
  
  // 上下文值，包含所有状态和方法
  const contextValue = {
    marketData,
    watchlist,
    priceAlerts,
    marketType,
    setMarketType,
    spotData,
    futuresData,
    addToWatchlist,
    removeFromWatchlist,
    fetchMarketData,
    fetchPriceAlerts,
    createPriceAlert,
    updatePriceAlert,
    deletePriceAlert,
    togglePriceAlert
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