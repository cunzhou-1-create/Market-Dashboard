import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Navigation from './Navigation';
import api from '../services/api';

/**
 * 交易组件
 * 实现AI交易员和模拟交易功能
 */
const Trade = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('aiTraders');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  // 从URL参数中读取tab值并设置activeTab
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tabParam = searchParams.get('tab');
    if (tabParam && ['aiTraders', 'simulation'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [location.search]);

  // AI交易员数据状态
  const [aiTraders, setAiTraders] = useState([
    {
      id: 1,
      name: 'Alpha Trader',
      strategy: '趋势跟踪',
      profit: '+24.5%',
      trades: 128,
      status: 'active',
      avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20trader%20avatar%20male%20business%20style&image_size=square',
      chartData: [100, 105, 110, 108, 115, 120, 124.5]
    },
    {
      id: 2,
      name: 'Beta Bot',
      strategy: '均值回归',
      profit: '+18.2%',
      trades: 96,
      status: 'active',
      avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20trader%20avatar%20female%20business%20style&image_size=square',
      chartData: [100, 102, 105, 103, 108, 115, 118.2]
    },
    {
      id: 3,
      name: 'Gamma AI',
      strategy: '高频交易',
      profit: '+31.7%',
      trades: 256,
      status: 'active',
      avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20trader%20avatar%20male%20tech%20style&image_size=square',
      chartData: [100, 108, 115, 120, 125, 128, 131.7]
    },
    {
      id: 4,
      name: 'Delta Strategist',
      strategy: '套利策略',
      profit: '+12.8%',
      trades: 64,
      status: 'active',
      avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20trader%20avatar%20female%20tech%20style&image_size=square',
      chartData: [100, 101, 103, 105, 108, 110, 112.8]
    }
  ]);

  // AI交易信号和调度器状态
  const [aiSchedulerStatus, setAiSchedulerStatus] = useState(null);
  const [aiTradeSignals, setAiTradeSignals] = useState([]);

  // 加载AI交易员数据
  const loadAiTraders = async () => {
    try {
      // 这里可以添加从API获取AI交易员数据的逻辑
      // 暂时使用模拟数据
      console.log('加载AI交易员数据');
    } catch (error) {
      console.error('加载AI交易员数据失败:', error);
    }
  };

  // 加载AI交易调度器状态
  const loadAiSchedulerStatus = async () => {
    try {
      const status = await api.trade.getAiSchedulerStatus();
      setAiSchedulerStatus(status);
    } catch (error) {
      setError('加载AI交易调度器状态失败: ' + (error.message || '未知错误'));
      console.error('加载AI交易调度器状态失败:', error);
    }
  };

  // 加载AI交易信号
  const loadAiTradeSignals = async () => {
    try {
      const signals = await api.trade.getAiTradeSignals();
      setAiTradeSignals(signals);
    } catch (error) {
      setError('加载AI交易信号失败: ' + (error.message || '未知错误'));
      console.error('加载AI交易信号失败:', error);
    }
  };

  // 启动AI交易调度器
  const startAiScheduler = async () => {
    try {
      setIsLoading(true);
      await api.trade.startAiScheduler();
      setMessage('AI交易调度器已启动');
      await loadAiSchedulerStatus();
    } catch (error) {
      setError('启动AI交易调度器失败: ' + (error.message || '未知错误'));
    } finally {
      setIsLoading(false);
    }
  };

  // 停止AI交易调度器
  const stopAiScheduler = async () => {
    try {
      setIsLoading(true);
      await api.trade.stopAiScheduler();
      setMessage('AI交易调度器已停止');
      await loadAiSchedulerStatus();
    } catch (error) {
      setError('停止AI交易调度器失败: ' + (error.message || '未知错误'));
    } finally {
      setIsLoading(false);
    }
  };

  // 手动触发AI交易
  const triggerAiTrade = async () => {
    try {
      setIsLoading(true);
      const result = await api.trade.triggerAiTrade();
      setMessage('AI交易已触发: ' + (result.message || '成功'));
      await loadTradeHistory();
      await loadAiTradeSignals();
    } catch (error) {
      setError('触发AI交易失败: ' + (error.message || '未知错误'));
    } finally {
      setIsLoading(false);
    }
  };

  // 模拟交易相关状态
  const [simulationData, setSimulationData] = useState({
    traders: [
      {
        id: 1,
        name: 'Alpha Trader',
        lastTrade: '买入 BTC/USDT',
        price: '42,500.00',
        timestamp: '2024-01-20 15:30:45',
        status: 'active'
      },
      {
        id: 2,
        name: 'Beta Bot',
        lastTrade: '卖出 ETH/USDT',
        price: '2,850.50',
        timestamp: '2024-01-20 15:29:30',
        status: 'active'
      },
      {
        id: 3,
        name: 'Gamma AI',
        lastTrade: '买入 SOL/USDT',
        price: '98.75',
        timestamp: '2024-01-20 15:28:15',
        status: 'active'
      }
    ],
    userTrades: [
      {
        id: 1,
        symbol: 'BTC/USDT',
        type: 'buy',
        price: '42,300.00',
        amount: '0.01',
        total: '423.00',
        timestamp: '2024-01-20 15:25:00',
        status: 'completed'
      },
      {
        id: 2,
        symbol: 'ETH/USDT',
        type: 'sell',
        price: '2,900.00',
        amount: '0.5',
        total: '1,450.00',
        timestamp: '2024-01-20 15:20:00',
        status: 'completed'
      }
    ],
    balance: '10,000.00',
    chartData: [10000, 9800, 10200, 10500, 10300, 10800, 11000]
  });

  // 用户创建模拟交易表单状态
  const [newTrade, setNewTrade] = useState({
    symbol: 'BTC/USDT',
    type: 'buy',
    amount: '',
    price: ''
  });

  // 时间范围选择状态
  const [timeRange, setTimeRange] = useState('7d'); // 7d, 30d, 90d, 1y

  // 模拟交易员管理相关状态
  const [simulatedTraders, setSimulatedTraders] = useState([]);
  const [isTradersLoading, setIsTradersLoading] = useState(false);
  const [isCreatingTrader, setIsCreatingTrader] = useState(false);
  const [isEditingTrader, setIsEditingTrader] = useState(false);
  const [editingTraderId, setEditingTraderId] = useState(null);
  const [newSimulatedTrader, setNewSimulatedTrader] = useState({
    name: '',
    strategy: '',
    symbol: 'BTC/USDT',
    refresh_interval: 30,
    initial_balance: 10000.0,
    settings: {}
  });

  // 模拟交易设置相关状态
  const [simulationSettings, setSimulationSettings] = useState({
    global_enabled: true,
    open_signal_notification: true,
    close_signal_notification: true,
    default_refresh_interval: 30
  });
  const [isSettingsLoading, setIsSettingsLoading] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // 模拟交易报告相关状态
  const [simulationReports, setSimulationReports] = useState([]);
  const [isReportsLoading, setIsReportsLoading] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedTraderId, setSelectedTraderId] = useState(null);
  const [reportPeriod, setReportPeriod] = useState('7d');

  // 加载交易记录
  const loadTradeHistory = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // 调用真实API获取交易记录
      const trades = await api.trade.getTradeHistory();
      if (trades && Array.isArray(trades)) {
        setSimulationData(prev => ({
          ...prev,
          userTrades: trades
        }));
      }
    } catch (err) {
      setError('加载交易记录失败: ' + (err.message || '未知错误'));
      console.error('加载交易记录失败:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // 加载模拟交易员列表
  const loadSimulatedTraders = async () => {
    setIsTradersLoading(true);
    setError(null);
    
    try {
      const traders = await api.trade.getSimulatedTraders();
      if (traders && Array.isArray(traders)) {
        setSimulatedTraders(traders);
      }
    } catch (err) {
      setError('加载模拟交易员列表失败: ' + (err.message || '未知错误'));
      console.error('加载模拟交易员列表失败:', err);
    } finally {
      setIsTradersLoading(false);
    }
  };

  // 创建模拟交易员
  const createSimulatedTrader = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setMessage(null);
    
    try {
      // 验证表单
      if (!newSimulatedTrader.name) {
        throw new Error('请填写交易员名称');
      }
      if (!newSimulatedTrader.strategy) {
        throw new Error('请填写交易策略');
      }
      if (!newSimulatedTrader.symbol) {
        throw new Error('请选择交易币对');
      }
      if (newSimulatedTrader.refresh_interval <= 0) {
        throw new Error('刷新频率必须大于0');
      }
      if (newSimulatedTrader.initial_balance <= 0) {
        throw new Error('初始资金必须大于0');
      }
      
      // 调用API创建模拟交易员
      const result = await api.trade.createSimulatedTrader(newSimulatedTrader);
      
      if (result) {
        setMessage('模拟交易员创建成功');
        // 重置表单
        setNewSimulatedTrader({
          name: '',
          strategy: '',
          symbol: 'BTC/USDT',
          refresh_interval: 30,
          initial_balance: 10000.0,
          settings: {}
        });
        // 重新加载模拟交易员列表
        await loadSimulatedTraders();
        // 关闭创建模态框
        setIsCreatingTrader(false);
      }
    } catch (err) {
      setError('创建模拟交易员失败: ' + (err.message || '未知错误'));
      console.error('创建模拟交易员失败:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // 运行模拟交易员
  const runSimulatedTrader = async (traderId) => {
    setIsLoading(true);
    setError(null);
    setMessage(null);
    
    try {
      const result = await api.trade.runTrader(traderId);
      
      if (result.success) {
        setMessage(`模拟交易员运行成功: ${result.message}`);
        // 重新加载模拟交易员列表
        await loadSimulatedTraders();
      } else {
        setError(`运行模拟交易员失败: ${result.message}`);
      }
    } catch (err) {
      setError('运行模拟交易员失败: ' + (err.message || '未知错误'));
      console.error('运行模拟交易员失败:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // 删除模拟交易员
  const deleteSimulatedTrader = async (traderId) => {
    if (!window.confirm('确定要删除这个模拟交易员吗？')) {
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setMessage(null);
    
    try {
      const result = await api.trade.deleteSimulatedTrader(traderId);
      
      if (result) {
        setMessage('模拟交易员删除成功');
        // 重新加载模拟交易员列表
        await loadSimulatedTraders();
      }
    } catch (err) {
      setError('删除模拟交易员失败: ' + (err.message || '未知错误'));
      console.error('删除模拟交易员失败:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // 加载模拟交易设置
  const loadSimulationSettings = async () => {
    setIsSettingsLoading(true);
    setError(null);
    
    try {
      const settings = await api.trade.getSimulationSettings();
      if (settings) {
        setSimulationSettings(settings);
      }
    } catch (err) {
      setError('加载模拟交易设置失败: ' + (err.message || '未知错误'));
      console.error('加载模拟交易设置失败:', err);
    } finally {
      setIsSettingsLoading(false);
    }
  };

  // 更新模拟交易设置
  const updateSimulationSettings = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setMessage(null);
    
    try {
      const result = await api.trade.updateSimulationSettings(simulationSettings);
      
      if (result) {
        setMessage('模拟交易设置更新成功');
        // 关闭设置模态框
        setIsSettingsModalOpen(false);
      }
    } catch (err) {
      setError('更新模拟交易设置失败: ' + (err.message || '未知错误'));
      console.error('更新模拟交易设置失败:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // 加载模拟交易报告
  const loadSimulationReports = async (traderId = null) => {
    setIsReportsLoading(true);
    setError(null);
    
    try {
      const reports = await api.trade.getSimulationReports(traderId);
      if (reports && Array.isArray(reports)) {
        setSimulationReports(reports);
      }
    } catch (err) {
      setError('加载模拟交易报告失败: ' + (err.message || '未知错误'));
      console.error('加载模拟交易报告失败:', err);
    } finally {
      setIsReportsLoading(false);
    }
  };

  // 生成模拟交易报告
  const generateSimulationReport = async (traderId, period) => {
    setIsLoading(true);
    setError(null);
    setMessage(null);
    
    try {
      const report = await api.trade.generateReport(traderId, period);
      
      if (report) {
        setMessage('模拟交易报告生成成功');
        // 重新加载报告列表
        await loadSimulationReports(traderId);
        // 打开报告详情模态框
        setSelectedReport(report);
        setIsReportModalOpen(true);
      }
    } catch (err) {
      setError('生成模拟交易报告失败: ' + (err.message || '未知错误'));
      console.error('生成模拟交易报告失败:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // 查看报告详情
  const viewReportDetails = (report) => {
    setSelectedReport(report);
    setIsReportModalOpen(true);
  };

  // 执行模拟交易
  const executeTrade = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setMessage(null);
    
    try {
      // 验证表单
      if (!newTrade.amount) {
        throw new Error('请填写交易数量');
      }
      if (!newTrade.price) {
        throw new Error('请填写交易价格');
      }
      
      const amount = parseFloat(newTrade.amount);
      const price = parseFloat(newTrade.price);
      
      if (isNaN(amount) || amount <= 0) {
        throw new Error('交易数量必须是正数');
      }
      if (isNaN(price) || price <= 0) {
        throw new Error('交易价格必须是正数');
      }
      
      // 计算交易总额
      const total = amount * price;
      
      // 检查余额是否足够
      const currentBalance = parseFloat(simulationData.balance.replace(/,/g, ''));
      if (total > currentBalance) {
        throw new Error('余额不足');
      }
      
      // 调用真实API执行交易
      const tradeData = {
        symbol: newTrade.symbol,
        side: newTrade.type,
        price: price,
        quantity: amount,
        total: total
      };
      
      const result = await api.trade.executeTrade(tradeData);
      
      if (result) {
        setMessage('交易执行成功');
        // 重置表单
        setNewTrade({
          symbol: 'BTC/USDT',
          type: 'buy',
          amount: '',
          price: ''
        });
        // 重新加载交易记录和账户信息
        await loadTradeHistory();
        await loadAccountInfo();
      }
    } catch (err) {
      setError('执行交易失败: ' + (err.message || '未知错误'));
      console.error('执行交易失败:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // 加载账户信息
  const loadAccountInfo = async () => {
    try {
      const accountInfo = await api.trade.getAccountInfo();
      setSimulationData(prev => ({
        ...prev,
        balance: accountInfo.balance.toFixed(2)
      }));
    } catch (error) {
      console.error('加载账户信息失败:', error);
    }
  };

  // 组件挂载时加载数据
  useEffect(() => {
    const loadInitialData = async () => {
      await loadTradeHistory();
      await loadAccountInfo();
      await loadAiSchedulerStatus();
      await loadAiTradeSignals();
      await loadAiTraders();
      await loadSimulatedTraders();
      await loadSimulationSettings();
    };

    loadInitialData();
  }, []);

  // 定时刷新数据
  useEffect(() => {
    // 每30秒刷新一次数据
    const interval = setInterval(async () => {
      try {
        await loadTradeHistory();
        await loadAccountInfo();
        await loadAiSchedulerStatus();
        await loadAiTradeSignals();
      } catch (error) {
        console.error('定时刷新数据失败:', error);
      }
    }, 30000);

    // 清理定时器
    return () => clearInterval(interval);
  }, []);

  // 图表组件
  const Chart = ({ data }) => {
    const maxValue = Math.max(...data);
    const minValue = Math.min(...data);
    const range = maxValue - minValue;
    const width = '100%';
    const height = 80;
    const padding = 5;

    return (
      <div className="w-full">
        <svg width={width} height={height} className="mt-2">
          <defs>
            <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(34, 197, 94, 0.3)" />
              <stop offset="100%" stopColor="rgba(34, 197, 94, 0.05)" />
            </linearGradient>
          </defs>
          <path
            d={data.map((value, index) => {
              const x = padding + (index / (data.length - 1)) * (window.innerWidth > 768 ? 200 : window.innerWidth - 40);
              const y = padding + (height - 2 * padding) - ((value - minValue) / range) * (height - 2 * padding);
              return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
            }).join(' ')}
            fill="none"
            stroke="#22c55e"
            strokeWidth={2}
          />
          <path
            d={`${data.map((value, index) => {
              const x = padding + (index / (data.length - 1)) * (window.innerWidth > 768 ? 200 : window.innerWidth - 40);
              const y = padding + (height - 2 * padding) - ((value - minValue) / range) * (height - 2 * padding);
              return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
            }).join(' ')} L ${window.innerWidth > 768 ? 200 - padding : window.innerWidth - 40 - padding} ${height - padding} L ${padding} ${height - padding} Z`}
            fill="url(#chartGradient)"
          />
        </svg>
      </div>
    );
  };

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white min-h-screen pb-24">
      <Header />
      
      <div className="container mx-auto px-4 pt-6">
        {/* 页面标题 */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">交易</h1>
        </div>
        
        {/* 错误提示 */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 p-3 rounded-lg mb-6 text-sm animate-fade-in">
            {error}
          </div>
        )}
        
        {/* 成功提示 */}
        {message && (
          <div className="bg-green-50 dark:bg-green-900/20 text-green-500 dark:text-green-400 p-3 rounded-lg mb-6 text-sm animate-fade-in">
            {message}
          </div>
        )}

        {/* 标签切换 */}
        <div className="flex gap-2 mb-6">
          <button
            className={`flex-1 py-3 rounded-lg font-semibold transition-colors ${activeTab === 'aiTraders' ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
            onClick={() => setActiveTab('aiTraders')}
          >
            AI交易员
          </button>
          <button
            className={`flex-1 py-3 rounded-lg font-semibold transition-colors ${activeTab === 'simulation' ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
            onClick={() => setActiveTab('simulation')}
          >
            模拟交易
          </button>
          <button
            className={`flex-1 py-3 rounded-lg font-semibold transition-colors ${activeTab === 'simulatedTraders' ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
            onClick={() => setActiveTab('simulatedTraders')}
          >
            模拟交易员管理
          </button>
        </div>

        {/* AI交易员列表 */}
        {activeTab === 'aiTraders' && (
          <div className="space-y-6">
            {/* AI交易调度器控制 */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="font-semibold mb-4">AI交易调度器</h3>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">状态</p>
                  <p className={`font-bold ${aiSchedulerStatus?.running ? 'text-green-600 dark:text-green-400' : 'text-slate-600 dark:text-slate-400'}`}>
                    {aiSchedulerStatus?.running ? '运行中' : '已停止'}
                  </p>
                  {aiSchedulerStatus && (
                    <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">
                      频率: {aiSchedulerStatus.interval}分钟
                    </p>
                  )}
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                  <button 
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
                    onClick={startAiScheduler}
                  >
                    启动
                  </button>
                  <button 
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
                    onClick={stopAiScheduler}
                  >
                    停止
                  </button>
                  <button 
                    className="px-4 py-2 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg transition-colors"
                    onClick={triggerAiTrade}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></span>
                        触发中...
                      </div>
                    ) : (
                      '手动触发'
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* AI交易信号列表 */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="font-semibold mb-4">AI交易信号</h3>
              <div className="space-y-4">
                {aiTradeSignals.length > 0 ? (
                  aiTradeSignals.map((signal, index) => (
                    <div key={signal.id} className={`${index < aiTradeSignals.length - 1 ? 'border-b border-slate-200 dark:border-slate-700 pb-4' : ''}`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold">{signal.symbol}</h4>
                          <p className={`text-sm font-medium ${signal.side === 'buy' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            {signal.side === 'buy' ? '买入' : '卖出'}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${signal.is_executed ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-slate-100 text-slate-800 dark:bg-slate-700/50 dark:text-slate-400'}`}>
                          {signal.is_executed ? '已执行' : '未执行'}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mt-2">
                        <div>
                          <p className="text-slate-500 dark:text-slate-400 text-xs">价格</p>
                          <p className="font-bold">${signal.price}</p>
                        </div>
                        <div>
                          <p className="text-slate-500 dark:text-slate-400 text-xs">数量</p>
                          <p className="font-bold">{signal.quantity}</p>
                        </div>
                      </div>
                      <p className="text-slate-400 dark:text-slate-500 text-xs mt-2">
                        生成时间: {new Date(signal.created_at).toLocaleString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <p className="text-slate-500 dark:text-slate-400">暂无AI交易信号</p>
                  </div>
                )}
              </div>
            </div>

            {/* AI交易员列表 */}
            <div className="space-y-4">
              <h3 className="font-semibold">AI交易员</h3>
              {aiTraders.length > 0 ? (
                aiTraders.map((trader) => (
                  <div key={trader.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                      <img 
                        src={trader.avatar} 
                        alt={trader.name} 
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1 w-full">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                          <h3 className="font-bold text-lg">{trader.name}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${trader.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-slate-100 text-slate-800 dark:bg-slate-700/50 dark:text-slate-400'}`}>
                            {trader.status === 'active' ? '运行中' : '已停止'}
                          </span>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">策略: {trader.strategy}</p>
                        <div className="flex flex-wrap gap-4 mt-2">
                          <div>
                            <p className="text-slate-500 dark:text-slate-400 text-xs">收益率</p>
                            <p className="font-bold text-green-600 dark:text-green-400">{trader.profit}</p>
                          </div>
                          <div>
                            <p className="text-slate-500 dark:text-slate-400 text-xs">交易次数</p>
                            <p className="font-bold">{trader.trades}</p>
                          </div>
                        </div>
                        <div className="mt-2">
                          <p className="text-slate-500 dark:text-slate-400 text-xs">账户走势</p>
                          <Chart data={trader.chartData} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-8 text-center">
                  <p className="text-slate-500 dark:text-slate-400">暂无AI交易员数据</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 模拟交易 */}
        {activeTab === 'simulation' && (
          <div className="space-y-6">
            {/* 标题和余额 */}
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">模拟交易</h2>
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 px-4 py-3">
                <p className="text-slate-500 dark:text-slate-400 text-sm">可用余额</p>
                <p className="font-bold text-lg">{simulationData.balance} USDT</p>
              </div>
            </div>

            {/* 账户走势图表 */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">账户走势</h3>
                <div className="flex gap-2">
                  {['7d', '30d', '90d', '1y'].map((range) => (
                    <button
                      key={range}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${timeRange === range ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                      onClick={() => setTimeRange(range)}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                <div className="flex-1 w-full">
                  <Chart data={simulationData.chartData} />
                </div>
                <div className="flex flex-col gap-2 w-full md:w-auto">
                  <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg">
                    <p className="text-slate-500 dark:text-slate-400 text-xs">总收益</p>
                    <p className="font-bold text-green-600 dark:text-green-400">+10.0%</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg">
                    <p className="text-slate-500 dark:text-slate-400 text-xs">当前余额</p>
                    <p className="font-bold">{simulationData.balance} USDT</p>
                  </div>
                </div>
              </div>
            </div>

            {/* AI交易员实时交易状态 */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="font-semibold mb-4">AI交易员实时交易</h3>
              <div className="space-y-4">
                {simulationData.traders.map((trader, index) => (
                  <div key={trader.id} className={`${index < simulationData.traders.length - 1 ? 'border-b border-slate-200 dark:border-slate-700 pb-4' : ''}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold">{trader.name}</h4>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">{trader.lastTrade}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${trader.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-slate-100 text-slate-800 dark:bg-slate-700/50 dark:text-slate-400'}`}>
                        {trader.status === 'active' ? '运行中' : '已停止'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <div>
                        <p className="text-slate-500 dark:text-slate-400 text-xs">交易价格</p>
                        <p className="font-bold">{trader.price} USDT</p>
                      </div>
                      <p className="text-slate-400 dark:text-slate-500 text-xs">
                        交易时间: {trader.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 用户创建模拟交易 */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="font-semibold mb-4">创建模拟交易</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">交易对</label>
                    <select 
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                      value={newTrade.symbol}
                      onChange={(e) => setNewTrade({...newTrade, symbol: e.target.value})}
                    >
                      <option value="BTC/USDT">BTC/USDT</option>
                      <option value="ETH/USDT">ETH/USDT</option>
                      <option value="SOL/USDT">SOL/USDT</option>
                      <option value="ADA/USDT">ADA/USDT</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">交易类型</label>
                    <select 
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                      value={newTrade.type}
                      onChange={(e) => setNewTrade({...newTrade, type: e.target.value})}
                    >
                      <option value="buy">买入</option>
                      <option value="sell">卖出</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">交易数量</label>
                    <input 
                      type="number" 
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                      placeholder="输入交易数量"
                      value={newTrade.amount}
                      onChange={(e) => setNewTrade({...newTrade, amount: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">交易价格</label>
                    <input 
                      type="number" 
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                      placeholder="输入交易价格"
                      value={newTrade.price}
                      onChange={(e) => setNewTrade({...newTrade, price: e.target.value})}
                    />
                  </div>
                </div>
                <button 
                  className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                  onClick={executeTrade}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <span className="inline-block animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></span>
                      处理中...
                    </div>
                  ) : (
                    '执行交易'
                  )}
                </button>
              </div>
            </div>

            {/* 交易历史记录 */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="font-semibold mb-4">交易历史</h3>
              <div className="space-y-4">
                {simulationData.userTrades.length > 0 ? (
                  simulationData.userTrades.map((trade, index) => (
                    <div key={trade.id} className={`${index < simulationData.userTrades.length - 1 ? 'border-b border-slate-200 dark:border-slate-700 pb-4' : ''} p-4 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors`}>
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                        <div className="flex items-center gap-3">
                          <h4 className="font-bold">{trade.symbol}</h4>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${trade.type === 'buy' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>
                            {trade.type === 'buy' ? '买入' : '卖出'}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${trade.status === 'completed' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-slate-100 text-slate-800 dark:bg-slate-700/50 dark:text-slate-400'}`}>
                            {trade.status === 'completed' ? '已完成' : '处理中'}
                          </span>
                          <p className="text-slate-400 dark:text-slate-500 text-xs">
                            {trade.timestamp}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
                        <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg">
                          <p className="text-slate-500 dark:text-slate-400 text-xs">交易价格</p>
                          <p className="font-bold">{trade.price} USDT</p>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg">
                          <p className="text-slate-500 dark:text-slate-400 text-xs">交易数量</p>
                          <p className="font-bold">{trade.amount}</p>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg">
                          <p className="text-slate-500 dark:text-slate-400 text-xs">交易总额</p>
                          <p className="font-bold">{trade.total} USDT</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-8 text-center">
                    <p className="text-slate-500 dark:text-slate-400">暂无交易记录</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 模拟交易员管理 */}
        {activeTab === 'simulatedTraders' && (
          <div className="space-y-6">
            {/* 标题和操作按钮 */}
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">模拟交易员管理</h2>
              <div className="flex gap-2">
                <button
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                  onClick={() => setIsSettingsModalOpen(true)}
                >
                  模拟交易设置
                </button>
                <button
                  className="px-4 py-2 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg transition-colors"
                  onClick={() => setIsCreatingTrader(true)}
                >
                  创建模拟交易员
                </button>
              </div>
            </div>

            {/* 模拟交易员列表 */}
            <div className="space-y-4">
              {isTradersLoading ? (
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-8 text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mr-2"></div>
                  <p className="text-slate-500 dark:text-slate-400">加载中...</p>
                </div>
              ) : simulatedTraders.length > 0 ? (
                simulatedTraders.map((trader) => (
                  <div key={trader.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-bold text-lg">{trader.name}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${trader.is_active ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-slate-100 text-slate-800 dark:bg-slate-700/50 dark:text-slate-400'}`}>
                            {trader.is_active ? '运行中' : '已停止'}
                          </span>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">策略: {trader.strategy}</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                          <div>
                            <p className="text-slate-500 dark:text-slate-400 text-xs">交易币对</p>
                            <p className="font-bold">{trader.symbol}</p>
                          </div>
                          <div>
                            <p className="text-slate-500 dark:text-slate-400 text-xs">刷新频率</p>
                            <p className="font-bold">{trader.refresh_interval}分钟</p>
                          </div>
                          <div>
                            <p className="text-slate-500 dark:text-slate-400 text-xs">初始资金</p>
                            <p className="font-bold">{trader.initial_balance} USDT</p>
                          </div>
                          <div>
                            <p className="text-slate-500 dark:text-slate-400 text-xs">当前资金</p>
                            <p className="font-bold">{trader.current_balance.toFixed(2)} USDT</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
                          onClick={() => runSimulatedTrader(trader.id)}
                        >
                          运行
                        </button>
                        <button
                          className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                          onClick={() => {
                            setEditingTraderId(trader.id);
                            setIsEditingTrader(true);
                          }}
                        >
                          编辑
                        </button>
                        <button
                          className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
                          onClick={() => deleteSimulatedTrader(trader.id)}
                        >
                          删除
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-8 text-center">
                  <p className="text-slate-500 dark:text-slate-400">暂无模拟交易员，请创建一个新的模拟交易员</p>
                </div>
              )}
            </div>

            {/* 创建模拟交易员表单 */}
            {isCreatingTrader && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 w-full max-w-md p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-lg">创建模拟交易员</h3>
                    <button
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                      onClick={() => setIsCreatingTrader(false)}
                    >
                      ×
                    </button>
                  </div>
                  <form onSubmit={createSimulatedTrader} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">交易员名称</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                        placeholder="输入交易员名称"
                        value={newSimulatedTrader.name}
                        onChange={(e) => setNewSimulatedTrader({...newSimulatedTrader, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">交易策略</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                        placeholder="输入交易策略"
                        value={newSimulatedTrader.strategy}
                        onChange={(e) => setNewSimulatedTrader({...newSimulatedTrader, strategy: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">交易币对</label>
                      <select
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                        value={newSimulatedTrader.symbol}
                        onChange={(e) => setNewSimulatedTrader({...newSimulatedTrader, symbol: e.target.value})}
                      >
                        <option value="BTC/USDT">BTC/USDT</option>
                        <option value="ETH/USDT">ETH/USDT</option>
                        <option value="SOL/USDT">SOL/USDT</option>
                        <option value="ADA/USDT">ADA/USDT</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">刷新频率 (分钟)</label>
                        <input
                          type="number"
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                          placeholder="30"
                          value={newSimulatedTrader.refresh_interval}
                          onChange={(e) => setNewSimulatedTrader({...newSimulatedTrader, refresh_interval: parseInt(e.target.value) || 0})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">初始资金 (USDT)</label>
                        <input
                          type="number"
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                          placeholder="10000"
                          value={newSimulatedTrader.initial_balance}
                          onChange={(e) => setNewSimulatedTrader({...newSimulatedTrader, initial_balance: parseFloat(e.target.value) || 0})}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="flex-1 px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-900 dark:text-white font-semibold rounded-lg transition-colors"
                        onClick={() => setIsCreatingTrader(false)}
                      >
                        取消
                      </button>
                      <button
                        type="submit"
                        className="flex-1 px-4 py-2 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <div className="flex items-center justify-center">
                            <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></span>
                            创建中...
                          </div>
                        ) : (
                          '创建'
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* 模拟交易设置模态框 */}
            {isSettingsModalOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 w-full max-w-md p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-lg">模拟交易设置</h3>
                    <button
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                      onClick={() => setIsSettingsModalOpen(false)}
                    >
                      ×
                    </button>
                  </div>
                  <form onSubmit={updateSimulationSettings} className="space-y-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
                        checked={simulationSettings.global_enabled}
                        onChange={(e) => setSimulationSettings({...simulationSettings, global_enabled: e.target.checked})}
                      />
                      <label className="text-sm font-medium">全局模拟交易开关</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
                        checked={simulationSettings.open_signal_notification}
                        onChange={(e) => setSimulationSettings({...simulationSettings, open_signal_notification: e.target.checked})}
                      />
                      <label className="text-sm font-medium">开仓信号通知开关</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
                        checked={simulationSettings.close_signal_notification}
                        onChange={(e) => setSimulationSettings({...simulationSettings, close_signal_notification: e.target.checked})}
                      />
                      <label className="text-sm font-medium">平仓信号通知开关</label>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">默认刷新频率 (分钟)</label>
                      <input
                        type="number"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                        placeholder="30"
                        value={simulationSettings.default_refresh_interval}
                        onChange={(e) => setSimulationSettings({...simulationSettings, default_refresh_interval: parseInt(e.target.value) || 0})}
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="flex-1 px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-900 dark:text-white font-semibold rounded-lg transition-colors"
                        onClick={() => setIsSettingsModalOpen(false)}
                      >
                        取消
                      </button>
                      <button
                        type="submit"
                        className="flex-1 px-4 py-2 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <div className="flex items-center justify-center">
                            <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></span>
                            保存中...
                          </div>
                        ) : (
                          '保存设置'
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* 模拟交易报告 */}
            <div className="mt-8">
              <h3 className="font-semibold text-lg mb-4">模拟交易报告</h3>
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
                  <div className="flex gap-2">
                    <select
                      className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                      value={selectedTraderId || ''}
                      onChange={(e) => {
                        const traderId = e.target.value ? parseInt(e.target.value) : null;
                        setSelectedTraderId(traderId);
                        loadSimulationReports(traderId);
                      }}
                    >
                      <option value="">所有交易员</option>
                      {simulatedTraders.map((trader) => (
                        <option key={trader.id} value={trader.id}>
                          {trader.name}
                        </option>
                      ))}
                    </select>
                    <select
                      className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                      value={reportPeriod}
                      onChange={(e) => setReportPeriod(e.target.value)}
                    >
                      <option value="7d">7天</option>
                      <option value="30d">30天</option>
                      <option value="90d">90天</option>
                    </select>
                  </div>
                  <button
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
                    onClick={() => {
                      if (selectedTraderId) {
                        generateSimulationReport(selectedTraderId, reportPeriod);
                      } else {
                        alert('请选择一个交易员生成报告');
                      }
                    }}
                  >
                    生成报告
                  </button>
                </div>
                
                {/* 报告列表 */}
                <div className="space-y-4">
                  {isReportsLoading ? (
                    <div className="text-center py-4">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mr-2"></div>
                      <p className="text-slate-500 dark:text-slate-400">加载中...</p>
                    </div>
                  ) : simulationReports.length > 0 ? (
                    simulationReports.map((report) => (
                      <div key={report.id} className="p-4 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer"
                        onClick={() => viewReportDetails(report)}>
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                          <div>
                            <h4 className="font-bold">{report.period} 报告</h4>
                            <p className="text-slate-500 dark:text-slate-400 text-sm">
                              交易员: {simulatedTraders.find(t => t.id === report.simulated_trader_id)?.name || '未知'}
                            </p>
                          </div>
                          <div className="flex flex-wrap items-center gap-3">
                            <div className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 px-3 py-1 rounded-full text-xs font-semibold">
                              总收益: {report.total_profit.toFixed(2)} USDT
                            </div>
                            <p className="text-slate-400 dark:text-slate-500 text-xs">
                              {new Date(report.created_at).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                          <div>
                            <p className="text-slate-500 dark:text-slate-400 text-xs">期初资金</p>
                            <p className="font-bold">{report.start_balance.toFixed(2)} USDT</p>
                          </div>
                          <div>
                            <p className="text-slate-500 dark:text-slate-400 text-xs">期末资金</p>
                            <p className="font-bold">{report.end_balance.toFixed(2)} USDT</p>
                          </div>
                          <div>
                            <p className="text-slate-500 dark:text-slate-400 text-xs">交易次数</p>
                            <p className="font-bold">{report.total_trades}</p>
                          </div>
                          <div>
                            <p className="text-slate-500 dark:text-slate-400 text-xs">胜率</p>
                            <p className="font-bold">{report.win_rate.toFixed(2)}%</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-slate-500 dark:text-slate-400">暂无模拟交易报告</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 报告详情模态框 */}
            {isReportModalOpen && selectedReport && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-lg">模拟交易报告详情</h3>
                    <button
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                      onClick={() => setIsReportModalOpen(false)}
                    >
                      ×
                    </button>
                  </div>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-slate-100 dark:bg-slate-700/50 p-3 rounded-lg">
                        <p className="text-slate-500 dark:text-slate-400 text-xs">报告周期</p>
                        <p className="font-bold">{selectedReport.period}</p>
                      </div>
                      <div className="bg-slate-100 dark:bg-slate-700/50 p-3 rounded-lg">
                        <p className="text-slate-500 dark:text-slate-400 text-xs">交易员</p>
                        <p className="font-bold">{simulatedTraders.find(t => t.id === selectedReport.simulated_trader_id)?.name || '未知'}</p>
                      </div>
                      <div className="bg-slate-100 dark:bg-slate-700/50 p-3 rounded-lg">
                        <p className="text-slate-500 dark:text-slate-400 text-xs">生成时间</p>
                        <p className="font-bold">{new Date(selectedReport.created_at).toLocaleString()}</p>
                      </div>
                      <div className="bg-slate-100 dark:bg-slate-700/50 p-3 rounded-lg">
                        <p className="text-slate-500 dark:text-slate-400 text-xs">最大回撤</p>
                        <p className="font-bold">{selectedReport.max_drawdown.toFixed(2)}%</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 p-3 rounded-lg">
                        <p className="text-xs">期初资金</p>
                        <p className="font-bold">{selectedReport.start_balance.toFixed(2)} USDT</p>
                      </div>
                      <div className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 p-3 rounded-lg">
                        <p className="text-xs">期末资金</p>
                        <p className="font-bold">{selectedReport.end_balance.toFixed(2)} USDT</p>
                      </div>
                      <div className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 p-3 rounded-lg">
                        <p className="text-xs">总收益</p>
                        <p className="font-bold">{selectedReport.total_profit.toFixed(2)} USDT</p>
                      </div>
                      <div className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 p-3 rounded-lg">
                        <p className="text-xs">交易次数</p>
                        <p className="font-bold">{selectedReport.total_trades}</p>
                      </div>
                    </div>
                    
                    {selectedReport.report_data?.balance_curve && (
                      <div className="bg-slate-100 dark:bg-slate-700/50 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">资金变动曲线</h4>
                        <Chart data={selectedReport.report_data.balance_curve.map(item => item.balance)} />
                      </div>
                    )}
                    
                    {selectedReport.report_data?.trades && selectedReport.report_data.trades.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-3">交易记录</h4>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                          {selectedReport.report_data.trades.map((trade, index) => (
                            <div key={index} className="p-3 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h5 className="font-bold">{trade.symbol}</h5>
                                  <p className="text-sm">
                                    {trade.side === 'buy' ? '买入' : '卖出'} • {trade.price} USDT • {trade.quantity} 币
                                  </p>
                                </div>
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${trade.side === 'buy' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>
                                  {trade.side === 'buy' ? '买入' : '卖出'}
                                </span>
                              </div>
                              <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">
                                {new Date(trade.timestamp).toLocaleString()}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <Navigation />
    </div>
  );
};

export default Trade;