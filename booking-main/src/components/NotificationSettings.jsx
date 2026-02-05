import React, { useState } from 'react';

/**
 * 通知渠道设置组件
 * 管理邮件和Telegram等通知渠道的配置
 */
const NotificationSettings = () => {
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [telegramEnabled, setTelegramEnabled] = useState(false);
  const [webhookEnabled, setWebhookEnabled] = useState(false);
  
  // 邮件通知类型状态
  const [emailNotificationTypes, setEmailNotificationTypes] = useState({
    priceAlert: true,
    technicalAlert: true,
    onChainEvent: true,
    aiReport: true
  });
  
  // Telegram通知类型状态
  const [telegramNotificationTypes, setTelegramNotificationTypes] = useState({
    priceAlert: true,
    technicalAlert: true,
    onChainEvent: true,
    aiReport: true
  });
  
  // Webhook通知类型状态
  const [webhookNotificationTypes, setWebhookNotificationTypes] = useState({
    priceAlert: true,
    technicalAlert: true,
    onChainEvent: true,
    aiReport: true
  });
  
  // Webhook通知格式状态
  const [webhookFormat, setWebhookFormat] = useState('json');
  
  // 自定义价格预警状态
  const [customPriceAlerts, setCustomPriceAlerts] = useState([
    {
      id: 1,
      symbol: 'BTC',
      operator: '>',
      price: 70000,
      enabled: true
    },
    {
      id: 2,
      symbol: 'SOL',
      operator: '<',
      price: 150,
      enabled: true
    }
  ]);
  
  // 通知类型变更处理函数
  const handleEmailNotificationTypeChange = (type) => {
    setEmailNotificationTypes(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };
  
  const handleTelegramNotificationTypeChange = (type) => {
    setTelegramNotificationTypes(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };
  
  const handleWebhookNotificationTypeChange = (type) => {
    setWebhookNotificationTypes(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };
  
  // 处理自定义价格预警开关
  const handleCustomPriceAlertToggle = (id) => {
    setCustomPriceAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, enabled: !alert.enabled } : alert
    ));
  };

  return (
    <div className="space-y-4">
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
              <div className="relative inline-block align-middle select-none">
                <input 
                  type="checkbox" 
                  name="toggle" 
                  id="email-notification-toggle" 
                  className="peer sr-only" 
                  checked={emailEnabled}
                  onChange={(e) => setEmailEnabled(e.target.checked)}
                />
                <label 
                  htmlFor="email-notification-toggle" 
                  className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all duration-300 peer-checked:bg-primary cursor-pointer"
                ></label>
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
                      checked={emailNotificationTypes.onChainEvent}
                      onChange={() => handleEmailNotificationTypeChange('onChainEvent')}
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
              <div className="relative inline-block align-middle select-none">
                <input 
                  type="checkbox" 
                  name="toggle" 
                  id="telegram-notification-toggle" 
                  className="peer sr-only" 
                  checked={telegramEnabled}
                  onChange={(e) => setTelegramEnabled(e.target.checked)}
                />
                <label 
                  htmlFor="telegram-notification-toggle" 
                  className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all duration-300 peer-checked:bg-primary cursor-pointer"
                ></label>
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
                      checked={telegramNotificationTypes.onChainEvent}
                      onChange={() => handleTelegramNotificationTypeChange('onChainEvent')}
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
                <div className="size-8 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center">
                  <span className="material-symbols-outlined text-sm">code</span>
                </div>
                <div>
                  <p className="font-bold text-sm">Webhook通知</p>
                  <p className="text-xs text-slate-500">（给开发者）接收实时API回调通知</p>
                </div>
              </div>
              <div className="relative inline-block align-middle select-none">
                <input 
                  type="checkbox" 
                  name="toggle" 
                  id="webhook-notification-toggle" 
                  className="peer sr-only" 
                  checked={webhookEnabled}
                  onChange={(e) => setWebhookEnabled(e.target.checked)}
                />
                <label 
                  htmlFor="webhook-notification-toggle" 
                  className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all duration-300 peer-checked:bg-primary cursor-pointer"
                ></label>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-2">
                <span className="text-xs text-slate-500">Webhook URL</span>
                <input type="url" className="flex-1 bg-slate-200 dark:bg-slate-700 border-0 rounded-lg px-3 py-2 text-sm" placeholder="请输入Webhook接收URL" defaultValue="https://your-api-endpoint.com/webhook" />
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-xs text-slate-500">Secret Key</span>
                <input type="text" className="flex-1 bg-slate-200 dark:bg-slate-700 border-0 rounded-lg px-3 py-2 text-sm" placeholder="请输入签名密钥（可选）" defaultValue="your-secret-key" />
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
                      checked={webhookNotificationTypes.onChainEvent}
                      onChange={() => handleWebhookNotificationTypeChange('onChainEvent')}
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
              <div className="flex flex-col gap-2">
                <span className="text-xs text-slate-500">通知格式</span>
                <div className="flex flex-wrap gap-2">
                  <label className="flex items-center gap-2 bg-slate-200 dark:bg-slate-700 px-3 py-1.5 rounded-lg text-sm">
                    <input 
                      type="radio" 
                      name="webhook-format" 
                      className="rounded-full" 
                      checked={webhookFormat === 'json'}
                      onChange={() => setWebhookFormat('json')}
                    />
                    JSON
                  </label>
                  <label className="flex items-center gap-2 bg-slate-200 dark:bg-slate-700 px-3 py-1.5 rounded-lg text-sm">
                    <input 
                      type="radio" 
                      name="webhook-format" 
                      className="rounded-full"
                      checked={webhookFormat === 'form'}
                      onChange={() => setWebhookFormat('form')}
                    />
                    Form Data
                  </label>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="w-full py-2 text-center text-xs font-semibold text-primary border border-primary/30 rounded-lg hover:bg-primary/10 transition-colors">
                  测试Webhook通知
                </button>
              </div>
            </div>
          </div>
          
          {/* 自定义价格预警设置 */}
          <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-full bg-orange-500/20 text-orange-500 flex items-center justify-center">
                  <span className="material-symbols-outlined text-sm">swap_horiz</span>
                </div>
                <div>
                  <p className="font-bold text-sm">自定义价格预警</p>
                  <p className="text-xs text-slate-500">设置特定价格条件的预警通知</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <div className="space-y-3">
                {customPriceAlerts.map(alert => (
                  <div key={alert.id} className="flex items-center justify-between bg-slate-200 dark:bg-slate-700 rounded-lg px-3 py-2">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-sm">{alert.symbol}</span>
                      <span className="text-sm">{alert.operator}</span>
                      <span className="text-sm">${alert.price.toLocaleString()}</span>
                    </div>
                    <div className="relative inline-block align-middle select-none">
                      <input 
                        type="checkbox" 
                        name={`alert-toggle-${alert.id}`} 
                        id={`alert-toggle-${alert.id}`} 
                        className="peer sr-only" 
                        checked={alert.enabled}
                        onChange={() => handleCustomPriceAlertToggle(alert.id)}
                      />
                      <label 
                        htmlFor={`alert-toggle-${alert.id}`} 
                        className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all duration-300 peer-checked:bg-primary cursor-pointer"
                      ></label>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <button className="w-full py-2 text-center text-xs font-semibold text-primary border border-primary/30 rounded-lg hover:bg-primary/10 transition-colors">
                  添加价格预警
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;