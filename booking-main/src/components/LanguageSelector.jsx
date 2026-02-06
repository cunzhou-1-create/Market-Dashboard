import React from 'react';
import { useApp } from '../context/AppContext';

/**
 * 语言选择器组件
 * 显示语言选项并处理语言切换
 */
const LanguageSelector = ({ isOpen, onClose }) => {
  const { language, updateLanguage } = useApp();

  // 处理语言选择
  const handleLanguageSelect = (lang) => {
    updateLanguage(lang);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-[#1c2630] rounded-xl shadow-2xl w-full max-w-md border border-slate-200 dark:border-slate-800 transform transition-all duration-300 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
          <h3 className="text-slate-900 dark:text-white text-lg font-bold">语言设置</h3>
          <button 
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            onClick={onClose}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Language Options */}
        <div className="p-4">
          {/* English Option */}
          <div 
            className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 ${language === 'en' ? 'bg-primary/10 border border-primary/20' : 'hover:bg-slate-100 dark:hover:bg-slate-800/50 border border-transparent'}`}
            onClick={() => handleLanguageSelect('en')}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <span className="text-sm font-bold">EN</span>
              </div>
              <span className="text-slate-900 dark:text-white text-base">English</span>
            </div>
            {language === 'en' && (
              <div className="text-primary">
                <span className="material-symbols-outlined">check</span>
              </div>
            )}
          </div>

          {/* Chinese Option */}
          <div 
            className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 mt-2 ${language === 'zh' ? 'bg-primary/10 border border-primary/20' : 'hover:bg-slate-100 dark:hover:bg-slate-800/50 border border-transparent'}`}
            onClick={() => handleLanguageSelect('zh')}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <span className="text-sm font-bold">中文</span>
              </div>
              <span className="text-slate-900 dark:text-white text-base">中文</span>
            </div>
            {language === 'zh' && (
              <div className="text-primary">
                <span className="material-symbols-outlined">check</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30 rounded-b-xl">
          <p className="text-xs text-slate-500 dark:text-[#92adc9] text-center">
            选择您偏好的语言
          </p>
        </div>
      </div>
    </div>
  );
};

export default LanguageSelector;