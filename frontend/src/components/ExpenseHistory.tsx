import React, { useState, useEffect, useMemo } from 'react';
import type { ViewPeriod, Language, Expense } from '../types';
import { t, getDateDisplay, getMonthDisplay, getYearDisplay } from '../utils/translations';
import { api } from '../services/api';

interface ExpenseHistoryProps {
  language: Language;
  refreshTrigger?: number;
  isDarkMode?: boolean;
}

export const ExpenseHistory: React.FC<ExpenseHistoryProps> = ({
  language,
  refreshTrigger = 0,
  isDarkMode = false,
}) => {
  const [viewPeriod, setViewPeriod] = useState<ViewPeriod>('day');
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [allExpenses, setAllExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await api.getAllExpenses();
      setAllExpenses(data || []);
    } catch (err) {
      console.error('Failed to fetch expenses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refreshTrigger]);

  const groups = useMemo(() => {
    const grouped: Record<string, { total: number; items: Expense[] }> = {};
    
    allExpenses.forEach((exp) => {
      let key = '';
      if (viewPeriod === 'day') {
        key = exp.date.split('T')[0];
      } else if (viewPeriod === 'month') {
        key = exp.date.substring(0, 7); // YYYY-MM
      } else if (viewPeriod === 'year') {
        key = exp.date.substring(0, 4); // YYYY
      }

      if (!grouped[key]) {
        grouped[key] = { total: 0, items: [] };
      }
      grouped[key].total += exp.amount;
      grouped[key].items.push(exp);
    });

    return Object.entries(grouped).sort((a, b) => b[0].localeCompare(a[0]));
  }, [allExpenses, viewPeriod]);

  const formatGroupKey = (key: string) => {
    if (viewPeriod === 'day') {
      return getDateDisplay(key, language);
    }
    if (viewPeriod === 'month') {
      return getMonthDisplay(key, language);
    }
    if (viewPeriod === 'year') {
      return getYearDisplay(key, language);
    }
    return key;
  };

  const getCategoryEmoji = (category: string) => {
    const emojis = { food: '🍽️', supplies: '🛒', other: '📦' };
    return emojis[category as keyof typeof emojis] || '📌';
  };

  const getCategoryLabel = (category: string) => {
    if (category === 'food') return t('food', language);
    if (category === 'supplies') return t('supplies', language);
    return t('other', language);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm(language === 'th' ? 'คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้?' : 'Are you sure you want to delete this item?')) {
      return;
    }
    try {
      await api.deleteExpense(id);
      fetchData();
    } catch (err) {
      console.error('Failed to delete:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-bounce">💳</div>
          <p className={`text-sm font-semibold ${isDarkMode ? 'text-indigo-400' : 'text-sky-600'}`}>Loading...</p>
        </div>
      </div>
    );
  }

  const renderGroupList = () => (
    <div className="space-y-4">
      {groups.length === 0 ? (
        <div className="text-center py-10">
          <div className="text-4xl mb-4">🎉</div>
          <p className={`font-bold text-lg ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`}>{t('noExpenses', language)}</p>
        </div>
      ) : (
        groups.map(([key, data]) => (
          <button
            key={key}
            onClick={() => setSelectedGroup(key)}
            className={`w-full flex items-center justify-between p-5 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border group ${
              isDarkMode 
                ? 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800 hover:border-indigo-500/50' 
                : 'bg-white/60 border-gray-100 hover:bg-white'
            }`}
          >
            <div className="flex flex-col items-start text-left">
              <span className={`text-xl font-bold transition-colors ${isDarkMode ? 'text-slate-200 group-hover:text-indigo-400' : 'text-gray-800 group-hover:text-indigo-600'}`}>{formatGroupKey(key)}</span>
              <span className={`text-xs font-bold uppercase tracking-tight ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`}>{data.items.length} {t('entries', language)}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className={`text-2xl font-black transition-colors ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>฿ {data.total.toLocaleString()}</span>
              <span className={`text-xl transition-all ${isDarkMode ? 'text-slate-600 group-hover:text-indigo-400' : 'text-gray-300 group-hover:text-indigo-600'}`}>→</span>
            </div>
          </button>
        ))
      )}
    </div>
  );

  const renderCategoryGauge = (byCategory: Record<string, number>, total: number, count: number) => {
    const categories: { key: string; color: string; emoji: string }[] = [
      { key: 'food', color: '#6366f1', emoji: '🍽️' },
      { key: 'supplies', color: '#10b981', emoji: '🛒' },
      { key: 'other', color: '#f43f5e', emoji: '📦' },
    ];

    let currentAngle = -180;
    const radius = 65;
    const strokeWidth = 20;
    const center = 85;

    return (
      <div className={`rounded-2xl p-6 border flex flex-col xl:flex-row items-center gap-10 transition-colors duration-500 ${
        isDarkMode ? 'bg-slate-800/40 border-slate-700/50' : 'bg-white/40 border-gray-100'
      }`}>
        <div className="relative w-48 h-32">
          <svg viewBox="0 0 170 100" className="w-full h-full drop-shadow-md">
            <path
              d="M 20 85 A 65 65 0 0 1 150 85"
              fill="none"
              stroke={isDarkMode ? "#1e293b" : "#f1f5f9"}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            {categories.map((cat) => {
              const amount = byCategory[cat.key] || 0;
              if (amount === 0 || total === 0) return null;
              const percentage = amount / total;
              const angleSize = percentage * 180;
              const startAngle = currentAngle;
              const endAngle = currentAngle + angleSize;
              currentAngle = endAngle;
              const startRad = (startAngle * Math.PI) / 180;
              const endRad = (endAngle * Math.PI) / 180;
              const x1 = center + radius * Math.cos(startRad);
              const y1 = center + radius * Math.sin(startRad);
              const x2 = center + radius * Math.cos(endRad);
              const y2 = center + radius * Math.sin(endRad);
              return (
                <path
                  key={cat.key}
                  d={`M ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2}`}
                  fill="none"
                  stroke={cat.color}
                  strokeWidth={strokeWidth}
                  strokeLinecap="butt"
                  className="transition-all duration-1000 ease-out"
                />
              );
            })}
          </svg>
          <div className="absolute bottom-2 left-0 right-0 text-center">
            <p className={`text-2xl font-black leading-none transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>฿ {total.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
            <p className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`}>({count} {t('entries', language)})</p>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-1 gap-2 w-full">
          {categories.map((cat) => {
            const amount = byCategory[cat.key] || 0;
            const percentage = total > 0 ? (amount / total) * 100 : 0;
            return (
              <div key={cat.key} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }}></div>
                  <span className={`font-bold text-sm transition-colors duration-500 ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>{getCategoryLabel(cat.key)}</span>
                </div>
                <div className="text-right">
                  <span className={`font-black text-sm transition-colors duration-500 ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>฿ {amount.toLocaleString()}</span>
                  <span className={`text-[10px] ml-2 font-bold ${isDarkMode ? 'text-slate-600' : 'text-gray-400'}`}>{percentage.toFixed(0)}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderDetails = () => {
    if (!selectedGroup) return null;
    const groupData = groups.find(([k]) => k === selectedGroup)?.[1];
    if (!groupData) return null;

    const byCategory = groupData.items.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
      return acc;
    }, {} as Record<string, number>);

    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSelectedGroup(null)}
            className={`flex items-center gap-2 font-bold text-lg transition-colors ${isDarkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-800'}`}
          >
            ← {t('back' as any, language)}
          </button>
          <h3 className={`text-xl font-bold transition-colors ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>{formatGroupKey(selectedGroup)}</h3>
        </div>

        {Object.keys(byCategory).length > 0 && renderCategoryGauge(byCategory, groupData.total, groupData.items.length)}

        <div className="space-y-3">
          {groupData.items.map((expense) => (
            <div key={expense.id} className={`flex items-center justify-between p-5 rounded-2xl border shadow-sm transition-all group ${
              isDarkMode 
                ? 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800 hover:border-indigo-500/30' 
                : 'bg-white/60 border-gray-100 hover:bg-white'
            }`}>
              <div className="flex items-center gap-5">
                <span className="text-3xl">{getCategoryEmoji(expense.category)}</span>
                <div>
                  <p className={`font-bold text-lg transition-colors ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>{expense.description}</p>
                  <p className={`text-xs font-bold uppercase tracking-wide ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`}>{getCategoryLabel(expense.category)}</p>
                </div>
              </div>
              <div className="flex items-center gap-5">
                <span className={`font-black text-xl transition-colors ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>฿ {expense.amount.toLocaleString()}</span>
                <button
                  onClick={() => handleDelete(expense.id)}
                  className={`p-2 rounded-xl transition-all text-lg ${isDarkMode ? 'text-slate-600 hover:text-red-400 hover:bg-red-400/10' : 'text-gray-300 hover:text-red-600 hover:bg-red-50'}`}
                >✕</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={`rounded-3xl shadow-2xl p-10 border backdrop-blur-md w-full transition-all duration-500 ${
      isDarkMode 
        ? 'bg-slate-900/90 border-slate-700 shadow-indigo-500/10' 
        : 'bg-white/80 border-sky-100'
    }`}>
      <div className="mb-8">
        <h2 className={`text-4xl font-black mb-2 font-poppins tracking-tighter italic transition-colors duration-500 ${isDarkMode ? 'text-white' : 'bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent'}`}>
          {t('history', language)}
        </h2>
        <div className={`h-1.5 w-20 rounded-full transition-colors duration-500 ${isDarkMode ? 'bg-indigo-500' : 'bg-gradient-to-r from-sky-400 to-indigo-400'}`}></div>
      </div>

      <div className={`flex gap-2 mb-8 p-1.5 rounded-2xl transition-colors duration-500 ${isDarkMode ? 'bg-slate-800/50' : 'bg-gray-100/50'}`}>
        {(['day', 'month', 'year'] as ViewPeriod[]).map((p) => (
          <button
            key={p}
            onClick={() => {
              setViewPeriod(p);
              setSelectedGroup(null);
            }}
            className={`flex-1 py-3 rounded-xl font-bold transition-all duration-300 text-xs uppercase tracking-wider ${
              viewPeriod === p
                ? isDarkMode ? 'bg-slate-700 text-indigo-400 shadow-lg' : 'bg-white text-indigo-600 shadow-sm'
                : isDarkMode ? 'text-slate-500 hover:text-slate-300' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {t(p as any, language)}
          </button>
        ))}
      </div>

      <div className="max-h-[550px] overflow-y-auto pr-2 custom-scrollbar">
        {selectedGroup ? renderDetails() : renderGroupList()}
      </div>
    </div>
  );
};
