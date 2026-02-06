import { useApp } from '../context/AppContext';
import { en } from '../i18n/en';
import { zh } from '../i18n/zh';

/**
 * 翻译钩子
 * 用于在组件中获取翻译文本
 */
export const useTranslation = () => {
  const { language } = useApp();

  // 翻译映射
  const translations = {
    en,
    zh
  };

  /**
   * 获取翻译文本
   * @param {string} key - 翻译键
   * @param {string} defaultValue - 默认值（当翻译不存在时使用）
   * @returns {string} - 翻译后的文本
   */
  const t = (key, defaultValue = key) => {
    const currentTranslations = translations[language] || en;
    return currentTranslations[key] || en[key] || defaultValue;
  };

  return {
    t,
    language
  };
};