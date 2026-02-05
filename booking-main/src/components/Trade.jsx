import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Navigation from './Navigation';

/**
 * 交易组件
 * 实现AI交易员和模拟交易功能
 */
const Trade = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('aiTraders');

  // 从URL参数中读取tab值并设置activeTab
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tabParam = searchParams.get('tab');
    if (tabParam && ['aiTraders', 'simulation'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [location.search]);

  // 模拟AI交易员数据
  const aiTraders = [
    {
      id: 1,
      name: 'Alpha Trader',
      strategy: '趋势跟踪',
      profit: '+24.5%',
      trades: 128,
      status: 'active',
      avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20trader%20avatar%20male%20business%20style&image_size=square'
    },
    {
      id: 2,
      name: 'Beta Bot',
      strategy: '均值回归',
      profit: '+18.2%',
      trades: 96,
      status: 'active',
      avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20trader%20avatar%20female%20business%20style&image_size=square'
    },
    {
      id: 3,
      name: 'Gamma AI',
      strategy: '高频交易',
      profit: '+31.7%',
      trades: 256,
      status: 'active',
      avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20trader%20avatar%20male%20tech%20style&image_size=square'
    },
    {
      id: 4,
      name: 'Delta Strategist',
      strategy: '套利策略',
      profit: '+12.8%',
      trades: 64,
      status: 'active',
      avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20trader%20avatar%20female%20tech%20style&image_size=square'
    }
  ];

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
    balance: '10,000.00'
  });

  // 用户创建模拟交易表单状态
  const [newTrade, setNewTrade] = useState({
    symbol: 'BTC/USDT',
    type: 'buy',
    amount: '',
    price: ''
  });

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white min-h-screen pb-24">
      <Header />
      
      <div className="container mx-auto px-4 pt-6">
        {/* 页面标题 */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">交易</h1>
        </div>

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
        </div>

        {/* AI交易员列表 */}
        {activeTab === 'aiTraders' && (
          <div className="space-y-4">
            {aiTraders.map((trader) => (
              <div key={trader.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4">
                <div className="flex items-center gap-4">
                  <img 
                    src={trader.avatar} 
                    alt={trader.name} 
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold text-lg">{trader.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${trader.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-slate-100 text-slate-800 dark:bg-slate-700/50 dark:text-slate-400'}`}>
                        {trader.status === 'active' ? '运行中' : '已停止'}
                      </span>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">策略: {trader.strategy}</p>
                    <div className="flex gap-4 mt-2">
                      <div>
                        <p className="text-slate-500 dark:text-slate-400 text-xs">收益率</p>
                        <p className="font-bold text-green-600 dark:text-green-400">{trader.profit}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 dark:text-slate-400 text-xs">交易次数</p>
                        <p className="font-bold">{trader.trades}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
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
                <button className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-lg transition-colors">
                  执行交易
                </button>
              </div>
            </div>

            {/* 交易历史记录 */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="font-semibold mb-4">交易历史</h3>
              <div className="space-y-4">
                {simulationData.userTrades.map((trade, index) => (
                  <div key={trade.id} className={`${index < simulationData.userTrades.length - 1 ? 'border-b border-slate-200 dark:border-slate-700 pb-4' : ''}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold">{trade.symbol}</h4>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${trade.type === 'buy' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>
                          {trade.type === 'buy' ? '买入' : '卖出'}
                        </span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${trade.status === 'completed' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-slate-100 text-slate-800 dark:bg-slate-700/50 dark:text-slate-400'}`}>
                        {trade.status === 'completed' ? '已完成' : '处理中'}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mt-2">
                      <div>
                        <p className="text-slate-500 dark:text-slate-400 text-xs">交易价格</p>
                        <p className="font-bold">{trade.price} USDT</p>
                      </div>
                      <div>
                        <p className="text-slate-500 dark:text-slate-400 text-xs">交易数量</p>
                        <p className="font-bold">{trade.amount}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 dark:text-slate-400 text-xs">交易总额</p>
                        <p className="font-bold">{trade.total} USDT</p>
                      </div>
                    </div>
                    <p className="mt-2 text-slate-400 dark:text-slate-500 text-xs">
                      交易时间: {trade.timestamp}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <Navigation />
    </div>
  );
};

export default Trade;