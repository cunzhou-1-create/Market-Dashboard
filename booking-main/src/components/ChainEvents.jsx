import React from 'react';

/**
 * 链上事件提醒组件
 * 显示大额转账和交易所资金流动等链上事件
 */
const ChainEvents = () => {
  return (
    <div className="space-y-4">
      <div className="bg-slate-100 dark:bg-[#1c2630] rounded-xl p-4 border border-transparent dark:border-slate-800">
        <div className="space-y-4">
          {/* 大额转账提醒 */}
          <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center">
                  <span className="material-symbols-outlined text-sm">account_balance_wallet</span>
                </div>
                <span className="font-bold text-sm">大额转账提醒</span>
              </div>
              <span className="text-xs font-semibold text-rose-500">高风险</span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-500/10 rounded-lg">
                <div>
                  <p className="font-medium text-sm">12,500 ETH 转账</p>
                  <p className="text-xs text-slate-500 mt-1">从 0x...abc 到 0x...def · 5分钟前</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">$42.1M</p>
                  <p className="text-xs text-slate-500">当前价值</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-500/10 rounded-lg">
                <div>
                  <p className="font-medium text-sm">150 BTC 转账</p>
                  <p className="text-xs text-slate-500 mt-1">从 0x...ghi 到 0x...jkl · 10分钟前</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">$9.6M</p>
                  <p className="text-xs text-slate-500">当前价值</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* 交易所净流入突增提醒 */}
          <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
                  <span className="material-symbols-outlined text-sm">trending_up</span>
                </div>
                <span className="font-bold text-sm">交易所净流入突增</span>
              </div>
              <span className="text-xs font-semibold text-emerald-500">重要</span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-emerald-500/10 rounded-lg">
                <div>
                  <p className="font-medium text-sm">Binance ETH 净流入</p>
                  <p className="text-xs text-slate-500 mt-1">+5,200 ETH (24h) · 30分钟前</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm text-emerald-500">+230%</p>
                  <p className="text-xs text-slate-500">较昨日</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-emerald-500/10 rounded-lg">
                <div>
                  <p className="font-medium text-sm">Coinbase BTC 净流入</p>
                  <p className="text-xs text-slate-500 mt-1">+280 BTC (24h) · 1小时前</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm text-emerald-500">+185%</p>
                  <p className="text-xs text-slate-500">较昨日</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* 事件提醒设置 */}
          <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">notifications_active</span>
              <span className="text-sm font-medium">事件提醒设置</span>
            </div>
            <button className="text-xs font-semibold text-primary border border-primary/30 rounded-lg px-3 py-1 hover:bg-primary/10 transition-colors">
              管理提醒
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChainEvents;