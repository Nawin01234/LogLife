import React from 'react';
import type { Language } from '../types';
import { t } from '../utils/translations';

interface SidebarProps {
  currentPage: 'finance' | 'schedule';
  onPageChange: (page: 'finance' | 'schedule') => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onPageChange,
  language,
  onLanguageChange,
  isDarkMode,
  onToggleDarkMode,
}) => {
  return (
    <div className={`w-72 shadow-2xl p-8 flex flex-col gap-6 relative overflow-hidden text-white transition-all duration-500 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-r border-slate-700' 
        : 'bg-gradient-to-br from-sky-600 via-sky-500 to-cyan-600'
    }`}>
      {/* Decorative Elements */}
      <div className={`absolute top-0 right-0 w-40 h-40 rounded-full -mr-20 -mt-20 blur-3xl transition-opacity duration-500 ${isDarkMode ? 'bg-indigo-500/10 opacity-50' : 'bg-white/10 opacity-100'}`}></div>
      <div className={`absolute bottom-0 left-0 w-32 h-32 rounded-full -ml-16 -mb-16 blur-3xl transition-opacity duration-500 ${isDarkMode ? 'bg-purple-500/10 opacity-50' : 'bg-cyan-300/10 opacity-100'}`}></div>
      
      {/* Header */}
      <div className="relative z-10">
        <h1 className="text-4xl font-black text-white mb-2 font-poppins tracking-tighter italic">
          {t('appTitle', language)}
        </h1>
        <div className={`h-1 w-16 rounded-full mt-3 transition-colors duration-500 ${isDarkMode ? 'bg-slate-700' : 'bg-gradient-to-r from-white via-cyan-200 to-transparent'}`}></div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-4 relative z-10">
        <button
          onClick={() => onPageChange('finance')}
          className={`w-full px-5 py-5 rounded-2xl font-black flex items-center justify-center gap-4 transition-all duration-300 ${
            currentPage === 'finance'
              ? 'bg-white text-sky-600 shadow-xl scale-105'
              : `text-white hover:bg-white/20 active:scale-95 border ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white/10 border-white/10'}`
          }`}
        >
          <span className="text-2xl">💰</span>
          <span className="text-base uppercase tracking-widest">{language === 'th' ? 'การเงิน' : 'Finance'}</span>
        </button>
        
        <button
          onClick={() => onPageChange('schedule')}
          className={`w-full px-5 py-5 rounded-2xl font-black flex items-center justify-center gap-4 transition-all duration-300 ${
            currentPage === 'schedule'
              ? 'bg-white text-sky-600 shadow-xl scale-105'
              : `text-white hover:bg-white/20 active:scale-95 border ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white/10 border-white/10'}`
          }`}
        >
          <span className="text-2xl">🕒</span>
          <span className="text-base uppercase tracking-widest">{t('schedule', language)}</span>
        </button>
      </nav>

      {/* Theme & Language Selector */}
      <div className={`border-t pt-8 relative z-10 space-y-6 transition-colors duration-500 ${isDarkMode ? 'border-slate-700' : 'border-white/30'}`}>
        <div>
          <p className={`text-base font-bold mb-4 flex items-center gap-3 transition-colors duration-500 ${isDarkMode ? 'text-slate-400' : 'text-sky-100'}`}>
            <span className="text-2xl">{isDarkMode ? '🌙' : '☀️'}</span> {language === 'th' ? 'โหมด' : 'Theme'}
          </p>
          <button
            onClick={onToggleDarkMode}
            className={`w-full py-3 rounded-xl font-bold transition-all duration-500 flex items-center justify-center gap-2 border ${
              isDarkMode 
                ? 'bg-slate-800 text-amber-400 border-slate-600 shadow-inner shadow-black/20' 
                : 'bg-white text-sky-600 border-white shadow-md'
            }`}
          >
            {isDarkMode ? 'Dark Mode' : 'Light Mode'}
          </button>
        </div>

        <div>
          <p className={`text-base font-bold mb-4 flex items-center gap-3 transition-colors duration-500 ${isDarkMode ? 'text-slate-400' : 'text-sky-100'}`}>
            <span className="text-2xl">🌐</span> {t('language', language)}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => onLanguageChange('th')}
              className={`flex-1 px-3 py-2 rounded-lg font-bold transition-all ${
                language === 'th'
                  ? 'bg-white text-sky-600 shadow-md scale-105'
                  : 'bg-white/25 text-white hover:bg-white/35'
              }`}
            >
              ไทย
            </button>
            <button
              onClick={() => onLanguageChange('en')}
              className={`flex-1 px-3 py-2 rounded-lg font-bold transition-all ${
                language === 'en'
                  ? 'bg-white text-sky-600 shadow-md scale-105'
                  : 'bg-white/25 text-white hover:bg-white/35'
              }`}
            >
              EN
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
