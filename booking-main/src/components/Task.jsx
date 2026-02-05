import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Navigation from './Navigation';

/**
 * 任务管理组件
 * 包含任务列表、添加任务的模态框等功能
 */
const Task = () => {
  const navigate = useNavigate();
  const { tasks, addTask, toggleTaskActive } = useApp();
  
  // 模态框状态
  const [showModal, setShowModal] = useState(false);
  
  // 表单状态
  const [formData, setFormData] = useState({
    symbol: 'BTC/USDT',
    prompt: 'Bullish Breakout',
    klinePeriods: ['1h'],
    indicators: ['RSI'],
    frequency: '15m',
    notificationType: 'signal'
  });
  
  // 币对选项
  const symbolOptions = ['BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'ARB/USDT', 'LINK/USDT', 'PEPE/USDT', 'OP/USDT', 'BNB/USDT'];
  
  // 提示词选项
  const promptOptions = ['Bullish Breakout', 'Bearish Breakdown', 'RSI Overbought', 'RSI Oversold', 'MACD Crossover', 'Volume Spike', 'Bollinger Band Squeeze'];
  
  // K线周期选项
  const klinePeriodOptions = ['1m', '5m', '15m', '30m', '1h', '4h', '1d', '1w'];
  
  // 指标选项
  const indicatorOptions = ['MA', 'RSI', 'MACD', 'KDJ', 'BOLL', 'VOL', 'OBV', 'PSY'];
  
  // 频率选项
  const frequencyOptions = ['5m', '15m', '30m', '1h', '4h', '1d'];
  
  /**
   * 切换模态框显示/隐藏
   */
  const toggleModal = () => {
    setShowModal(!showModal);
  };
  
  /**
   * 处理表单输入变化
   * @param {Object} e - 事件对象
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  /**
   * 处理多选框变化
   * @param {Object} e - 事件对象
   * @param {string} type - 字段类型
   */
  const handleMultiSelectChange = (e, type) => {
    const { value, checked } = e.target;
    setFormData(prev => {
      if (checked) {
        return {
          ...prev,
          [type]: [...prev[type], value]
        };
      } else {
        return {
          ...prev,
          [type]: prev[type].filter(item => item !== value)
        };
      }
    });
  };
  
  /**
   * 处理表单提交
   * @param {Object} e - 事件对象
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 创建新任务
    const newTask = {
      symbol: formData.symbol,
      condition: `${formData.prompt} (${formData.klinePeriods.join(', ')} periods with ${formData.indicators.join(', ')})`,
      frequency: `Every ${formData.frequency}`,
      type: 'AI Subscription',
      aiEnabled: true,
      sentiment: 75
    };
    
    addTask(newTask);
    toggleModal();
    
    // 重置表单
    setFormData({
      symbol: 'BTC/USDT',
      prompt: 'Bullish Breakout',
      klinePeriods: ['1h'],
      indicators: ['RSI'],
      frequency: '15m',
      notificationType: 'signal'
    });
  };
  
  return (
    <div className="relative flex min-h-screen w-full flex-col max-w-[480px] mx-auto bg-background-light dark:bg-background-dark text-slate-900 dark:text-white overflow-x-hidden">
      {/* TopAppBar */}
      <header className="sticky top-0 z-10 flex flex-col gap-2 bg-background-light dark:bg-background-dark p-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center h-12 justify-between">
          <div className="flex size-12 shrink-0 items-center justify-start">
            <span className="material-symbols-outlined text-slate-700 dark:text-white text-3xl">account_circle</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-500/10 text-green-500 text-[10px] font-bold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5"></span> Binance Live
            </span>
          </div>
          <div className="flex w-12 items-center justify-end">
            <button 
              className="flex size-12 cursor-pointer items-center justify-center rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              onClick={() => navigate('/settings')}
            >
              <span className="material-symbols-outlined text-slate-700 dark:text-white text-2xl">settings</span>
            </button>
          </div>
        </div>
        <div className="mt-2">
          <h1 className="text-slate-900 dark:text-white tracking-tight text-[32px] font-bold leading-tight">Tasks</h1>
          <p className="text-slate-500 dark:text-[#92adc9] text-sm">Active AI monitoring bots</p>
        </div>
      </header>
      
      {/* Task List Content */}
      <main className="flex-1 flex flex-col p-4 gap-4 pb-24">
        {tasks.map(task => (
          <div 
            key={task.id}
            className={`flex flex-col gap-4 bg-white dark:bg-[#1a2632] p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm ${!task.isActive ? 'opacity-60' : ''}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`text-white flex items-center justify-center rounded-lg ${task.type.includes('AI') ? 'bg-primary' : 'bg-[#f7931a]'} shrink-0 size-12`}>
                  <span className="material-symbols-outlined text-2xl">{task.type.includes('AI') ? 'robot_2' : 'currency_bitcoin'}</span>
                </div>
                <div className="flex flex-col justify-center">
                  <div className="flex items-center gap-2">
                    <p className="text-slate-900 dark:text-white text-base font-bold leading-tight">{task.symbol}</p>
                    {task.aiEnabled && (
                      <span className="bg-primary/20 text-primary text-[10px] px-1.5 py-0.5 rounded font-bold">QWEN AI</span>
                    )}
                  </div>
                  <p className="text-slate-500 dark:text-[#92adc9] text-xs font-medium">{task.exchange || task.type}</p>
                </div>
              </div>
              <div className="shrink-0">
                <label className="relative flex h-[31px] w-[51px] cursor-pointer items-center rounded-full border-none bg-slate-200 dark:bg-[#233648] p-0.5 transition-colors">
                  <input 
                    checked={task.isActive} 
                    className="sr-only peer" 
                    type="checkbox" 
                    onChange={() => toggleTaskActive(task.id)}
                  />
                  <div className="peer-checked:translate-x-5 peer-checked:bg-white h-full w-[27px] rounded-full bg-white shadow-md transition-transform"></div>
                  <div className="absolute inset-0 rounded-full peer-checked:bg-primary -z-10 transition-colors"></div>
                </label>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-1">
              <div className="flex flex-col gap-1 p-3 rounded-lg bg-slate-50 dark:bg-background-dark">
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Condition</p>
                <p className="text-slate-700 dark:text-white text-sm font-medium">{task.condition}</p>
              </div>
              <div className="flex flex-col gap-1 p-3 rounded-lg bg-slate-50 dark:bg-background-dark">
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Frequency</p>
                <p className="text-slate-700 dark:text-white text-sm font-medium">{task.frequency}</p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
              {task.sentiment ? (
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-green-500 text-sm">trending_up</span>
                  <p className="text-slate-400 dark:text-[#92adc9] text-[11px]">Current Sentiment: <span className="text-green-500 font-bold">{task.sentiment}% Strong Buy</span></p>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-sm">schedule</span>
                  <p className="text-slate-400 dark:text-[#92adc9] text-[11px]">Last checked: {task.lastChecked}</p>
                </div>
              )}
              <p className="text-slate-400 dark:text-[#92adc9] text-[11px]">{task.lastChecked}</p>
            </div>
          </div>
        ))}
      </main>
      
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-20">
        <button 
          className="flex size-14 items-center justify-center rounded-full bg-primary text-white shadow-xl shadow-primary/30 active:scale-95 transition-transform"
          onClick={toggleModal}
        >
          <span className="material-symbols-outlined text-3xl">add</span>
        </button>
      </div>
      
      {/* Navigation Bar */}
      <Navigation />
      
      {/* Create Subscription Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-background-dark rounded-2xl w-full max-w-md mx-4 overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Create New Subscription</h2>
              <button 
                className="text-slate-500 hover:text-slate-700 dark:hover:text-white transition-colors"
                onClick={toggleModal}
              >
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>
            </div>
            
            {/* Modal Content */}
            <form onSubmit={handleSubmit} className="p-4">
              {/* Symbol Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Select Symbol</label>
                <select 
                  name="symbol"
                  value={formData.symbol}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-slate-900 dark:text-white"
                >
                  {symbolOptions.map(symbol => (
                    <option key={symbol} value={symbol}>{symbol}</option>
                  ))}
                </select>
              </div>
              
              {/* Prompt Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Select Prompt</label>
                <select 
                  name="prompt"
                  value={formData.prompt}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-slate-900 dark:text-white"
                >
                  {promptOptions.map(prompt => (
                    <option key={prompt} value={prompt}>{prompt}</option>
                  ))}
                </select>
              </div>
              
              {/* K-line Period Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">K-line Periods (Multi-select)</label>
                <div className="grid grid-cols-4 gap-2">
                  {klinePeriodOptions.map(period => (
                    <label key={period} className="flex items-center gap-2 p-2 bg-slate-100 dark:bg-slate-800 rounded-lg cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                      <input 
                        type="checkbox"
                        value={period}
                        checked={formData.klinePeriods.includes(period)}
                        onChange={(e) => handleMultiSelectChange(e, 'klinePeriods')}
                        className="w-4 h-4 text-primary focus:ring-primary border-slate-300 dark:border-slate-600 rounded"
                      />
                      <span className="text-sm text-slate-900 dark:text-white">{period}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Indicator Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Indicators (Multi-select)</label>
                <div className="grid grid-cols-4 gap-2">
                  {indicatorOptions.map(indicator => (
                    <label key={indicator} className="flex items-center gap-2 p-2 bg-slate-100 dark:bg-slate-800 rounded-lg cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                      <input 
                        type="checkbox"
                        value={indicator}
                        checked={formData.indicators.includes(indicator)}
                        onChange={(e) => handleMultiSelectChange(e, 'indicators')}
                        className="w-4 h-4 text-primary focus:ring-primary border-slate-300 dark:border-slate-600 rounded"
                      />
                      <span className="text-sm text-slate-900 dark:text-white">{indicator}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Frequency Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Frequency</label>
                <select 
                  name="frequency"
                  value={formData.frequency}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-slate-900 dark:text-white"
                >
                  {frequencyOptions.map(freq => (
                    <option key={freq} value={freq}>Every {freq}</option>
                  ))}
                </select>
              </div>
              
              {/* Notification Type */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Notification Type</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 p-3 bg-slate-100 dark:bg-slate-800 rounded-lg cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex-1">
                    <input 
                      type="radio"
                      name="notificationType"
                      value="signal"
                      checked={formData.notificationType === 'signal'}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-primary focus:ring-primary border-slate-300 dark:border-slate-600 rounded-full"
                    />
                    <span className="text-sm text-slate-900 dark:text-white">Signal Only</span>
                  </label>
                  <label className="flex items-center gap-2 p-3 bg-slate-100 dark:bg-slate-800 rounded-lg cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex-1">
                    <input 
                      type="radio"
                      name="notificationType"
                      value="periodic"
                      checked={formData.notificationType === 'periodic'}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-primary focus:ring-primary border-slate-300 dark:border-slate-600 rounded-full"
                    />
                    <span className="text-sm text-slate-900 dark:text-white">Periodic Report</span>
                  </label>
                </div>
              </div>
              
              {/* Submit Button */}
              <button 
                type="submit"
                className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary/90 transition-colors"
              >
                Create Subscription
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Task;