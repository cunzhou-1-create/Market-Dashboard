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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // 存储之前的token，用于检测变化
  const previousTokenRef = React.useRef(localStorage.getItem('token'));

  /**
   * 添加到观察列表
   * @param {string} symbolId - 交易对ID
   * @returns {Promise<boolean>} - 是否添加成功
   */
  const addToWatchlist = async (symbolId) => {
    setIsLoading(true);
    setError(null);
    
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
      setError(error.message || '添加到观察列表失败');
      console.error('添加到观察列表失败:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 从观察列表移除
   * @param {string} symbolId - 交易对ID
   * @returns {Promise<boolean>} - 是否移除成功
   */
  const removeFromWatchlist = async (symbolId) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // 调用真实API从观察列表移除
      await api.market.removeFromWatchlist(symbolId);
      
      // 更新本地状态
      const newWatchlist = watchlist.filter(id => id !== symbolId);
      setWatchlist(newWatchlist);
      localStorage.setItem('watchlist', JSON.stringify(newWatchlist));
      
      return true;
    } catch (error) {
      setError(error.message || '从观察列表移除失败');
      console.error('从观察列表移除失败:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 获取市场数据
   * @returns {Promise<Array>} - 市场数据
   */
  const fetchMarketData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // 根据市场类型选择API调用
      const apiCall = marketType === 'spot' ? api.market.getSpotMarketData() : api.market.getFuturesMarketList();
      const response = await apiCall;
      
      // 确保数据格式正确
      const data = Array.isArray(response) ? response : (response.data || []);
      
      // 处理数据格式，确保每个项目都有必要的字段
      const processedData = data.map(item => ({
        id: item.id || item.symbol,
        symbol: item.symbol,
        name: item.name,
        price: parseFloat(item.price) || 0,
        change: parseFloat(item.change) || 0,
        isPositive: parseFloat(item.change) >= 0,
        volume: parseFloat(item.volume) || 0,
        quoteVolume: parseFloat(item.quoteVolume || item.quote_volume) || 0,
        highPrice: parseFloat(item.highPrice || item.high_price) || 0,
        lowPrice: parseFloat(item.lowPrice || item.low_price) || 0,
        openPrice: parseFloat(item.openPrice || item.open_price) || 0,
        closePrice: parseFloat(item.closePrice || item.close_price || item.lastPrice) || 0,
        marketCap: parseFloat(item.marketCap) || 0
      }));
      
      setMarketData(processedData);
      
      // 根据市场类型更新对应的数据
      if (marketType === 'spot') {
        setSpotData(processedData);
      } else {
        setFuturesData(processedData);
      }
      
      return processedData;
    } catch (error) {
      setError(error.message || '获取市场数据失败');
      console.error('获取市场数据失败:', error);
      // 发生错误时返回当前数据
      return marketData;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 获取价格预警列表
   * @returns {Promise<Array>} - 价格预警列表
   */
  const fetchPriceAlerts = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // 调用真实API获取价格预警列表
      const alerts = await api.alerts.getAlerts();
      // 确保数据格式正确
      const formattedAlerts = Array.isArray(alerts) ? alerts.map(alert => ({
        ...alert,
        isActive: alert.is_active !== undefined ? alert.is_active : alert.isActive
      })) : [];
      setPriceAlerts(formattedAlerts);
      return formattedAlerts;
    } catch (error) {
      setError(error.message || '获取价格预警列表失败');
      console.error('获取价格预警列表失败:', error);
      // 发生错误时返回当前数据
      return priceAlerts;
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * 创建价格预警
   * @param {Object} alertData - 价格预警数据
   * @returns {Promise<Object|null>} - 创建的价格预警
   */
  const createPriceAlert = async (alertData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // 调用真实API创建价格预警
      const alert = await api.alerts.createAlert(alertData);
      
      // 格式化返回的数据
      const formattedAlert = {
        ...alert,
        isActive: alert.is_active !== undefined ? alert.is_active : alert.isActive
      };
      
      // 更新本地状态
      setPriceAlerts(prev => [...prev, formattedAlert]);
      return formattedAlert;
    } catch (error) {
      setError(error.message || '创建价格预警失败');
      console.error('创建价格预警失败:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * 更新价格预警
   * @param {number} alertId - 价格预警ID
   * @param {Object} alertData - 价格预警数据
   * @returns {Promise<Object|null>} - 更新后的价格预警
   */
  const updatePriceAlert = async (alertId, alertData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // 调用真实API更新价格预警
      const alert = await api.alerts.updateAlert(alertId, alertData);
      
      // 格式化返回的数据
      const formattedAlert = {
        ...alert,
        isActive: alert.is_active !== undefined ? alert.is_active : alert.isActive
      };
      
      // 更新本地状态
      setPriceAlerts(prev => prev.map(item => 
        item.id === alertId ? formattedAlert : item
      ));
      return formattedAlert;
    } catch (error) {
      setError(error.message || '更新价格预警失败');
      console.error('更新价格预警失败:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * 删除价格预警
   * @param {number} alertId - 价格预警ID
   * @returns {Promise<boolean>} - 是否删除成功
   */
  const deletePriceAlert = async (alertId) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // 调用真实API删除价格预警
      await api.alerts.deleteAlert(alertId);
      
      // 更新本地状态
      setPriceAlerts(prev => prev.filter(item => item.id !== alertId));
      return true;
    } catch (error) {
      setError(error.message || '删除价格预警失败');
      console.error('删除价格预警失败:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * 切换价格预警状态
   * @param {number} alertId - 价格预警ID
   * @returns {Promise<boolean|null>} - 切换后的状态
   */
  const togglePriceAlert = async (alertId) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // 调用真实API切换价格预警状态
      const response = await api.alerts.toggleAlert(alertId);
      const isActive = response.is_active !== undefined ? response.is_active : response.isActive;
      
      // 更新本地状态，确保字段名一致
      setPriceAlerts(prev => prev.map(item => 
        item.id === alertId ? { ...item, is_active: isActive, isActive: isActive } : item
      ));
      return isActive;
    } catch (error) {
      setError(error.message || '切换价格预警状态失败');
      console.error('切换价格预警状态失败:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 从本地存储加载数据
   * 应用启动时执行一次，并且当token变化时重新执行
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

    // 初始化数据
    const initializeData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // 获取市场数据
        await fetchMarketData();
        
        // 获取价格预警列表
        await fetchPriceAlerts();
      } catch (error) {
        // 只有当没有token时才显示错误信息
        const token = localStorage.getItem('token');
        if (!token) {
          setError(error.message || '初始化数据失败');
        }
        console.error('初始化数据失败:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    // 执行初始化
    initializeData();
  }, []);
  
  // 定期检查token变化并重新获取数据
  useEffect(() => {
    const checkTokenAndFetchData = () => {
      const currentToken = localStorage.getItem('token');
      if (currentToken !== previousTokenRef.current) {
        previousTokenRef.current = currentToken;
        // 当token变化时，重新获取市场数据
        fetchMarketData();
        fetchPriceAlerts();
      }
    };
    
    // 每1秒检查一次token变化
    const intervalId = setInterval(checkTokenAndFetchData, 1000);
    
    // 清理函数
    return () => {
      clearInterval(intervalId);
    };
  }, []);
  
  // 当市场类型变化时，重新获取市场数据
  useEffect(() => {
    fetchMarketData();
  }, [marketType]);
  
  // 当市场类型变化时，更新市场数据
  useEffect(() => {
    setMarketData(marketType === 'spot' ? spotData : futuresData);
  }, [marketType, spotData, futuresData]);
  
  // 监听本地存储中的token变化，当token变化时重新获取市场数据
  useEffect(() => {
    // 定义一个函数来检查token变化
    const checkTokenChange = () => {
      const currentToken = localStorage.getItem('token');
      if (currentToken !== previousTokenRef.current) {
        previousTokenRef.current = currentToken;
        // 当token变化时，重新获取市场数据
        fetchMarketData();
        fetchPriceAlerts();
      }
    };
    
    // 监听storage事件
    window.addEventListener('storage', checkTokenChange);
    
    // 清理函数
    return () => {
      window.removeEventListener('storage', checkTokenChange);
    };
  }, []);
  
  // 上下文值，包含所有状态和方法
  const contextValue = {
    marketData,
    watchlist,
    priceAlerts,
    marketType,
    setMarketType,
    spotData,
    futuresData,
    isLoading,
    error,
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