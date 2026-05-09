import React, { useState } from 'react';
import type { ExpenseCategory, Language } from '../types';
import { t } from '../utils/translations';
import { api } from '../services/api';

interface ExpenseFormProps {
  onAddExpense: () => void;
  language: Language;
  showHistory: boolean;
  onToggleHistory: () => void;
  isDarkMode: boolean;
}

export const ExpenseForm: React.FC<ExpenseFormProps> = ({
  onAddExpense,
  language,
  showHistory,
  onToggleHistory,
  isDarkMode,
}) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('food');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setShowSuccess(false);

    if (!description || !amount) {
      setError(language === 'th' ? 'กรุณากรอกข้อมูลให้ครบถ้วน' : 'Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      await api.createExpense(description, parseFloat(amount), category, date);
      setDescription('');
      setAmount('');
      setCategory('food');
      setDate(new Date().toISOString().split('T')[0]);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      onAddExpense();
    } catch (err) {
      setError(language === 'th' ? 'เกิดข้อผิดพลาด' : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`rounded-3xl shadow-2xl p-10 w-full border backdrop-blur-lg relative group transition-all duration-500 ${
      isDarkMode 
        ? 'bg-slate-900/90 border-slate-700 shadow-indigo-500/10' 
        : 'bg-white/95 border-sky-100 shadow-xl'
    }`}>
      <button
        onClick={onToggleHistory}
        className={`absolute top-6 right-6 p-3 rounded-2xl transition-all duration-300 shadow-sm border flex items-center justify-center group/btn ${
          showHistory 
            ? 'bg-rose-500/10 text-rose-500 border-rose-500/20 hover:bg-rose-600 hover:text-white' 
            : isDarkMode 
              ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20 hover:bg-indigo-600 hover:text-white'
              : 'bg-indigo-50 text-indigo-600 border-indigo-100 hover:bg-indigo-600 hover:text-white'
        }`}
        title={showHistory ? (language === 'th' ? 'ปิดประวัติ' : 'Close History') : t('history', language)}
      >
        <span className="text-xl transition-transform duration-500" style={{ transform: showHistory ? 'rotate(180deg)' : 'rotate(0)' }}>
          {showHistory ? '✕' : '📊'}
        </span>
      </button>

      <div className="mb-8">
        <h2 className={`text-4xl font-black mb-2 font-poppins tracking-tighter italic transition-colors duration-500 ${isDarkMode ? 'text-white' : 'bg-gradient-to-r from-sky-600 to-cyan-600 bg-clip-text text-transparent'}`}>
          {t('addExpense', language)}
        </h2>
        <div className={`h-1.5 w-20 rounded-full transition-colors duration-500 ${isDarkMode ? 'bg-indigo-500' : 'bg-gradient-to-r from-sky-400 to-cyan-400'}`}></div>
      </div>

      {error && (
        <div className={`mb-6 p-4 border-l-4 rounded-lg font-bold text-base transition-colors duration-500 ${isDarkMode ? 'bg-red-950/30 border-red-500 text-red-400' : 'bg-red-50 border-red-500 text-red-700'}`}>
          ⚠️ {error}
        </div>
      )}

      {showSuccess && (
        <div className={`mb-6 p-4 border-l-4 rounded-lg font-bold text-base animate-bounce transition-colors duration-500 ${isDarkMode ? 'bg-emerald-950/30 border-emerald-500 text-emerald-400' : 'bg-emerald-50 border-emerald-500 text-emerald-700'}`}>
          ✅ {language === 'th' ? 'บันทึกสำเร็จแล้ว!' : 'Saved successfully!'}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className={`block text-base font-bold mb-3 flex items-center gap-2 transition-colors duration-500 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
            <span className="text-xl">📝</span>
            {t('description', language)}
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={language === 'th' ? 'เช่น กาแฟเช้า' : 'e.g., Coffee'}
            className={`w-full px-4 py-3 rounded-xl border-2 outline-none focus:ring-2 transition-all duration-300 font-bold text-lg ${
              isDarkMode 
                ? 'bg-slate-800 border-slate-700 text-white focus:border-indigo-500 focus:ring-indigo-500/20 placeholder:text-slate-600' 
                : 'bg-white border-gray-100 focus:border-indigo-500 focus:ring-indigo-100 placeholder:text-gray-300'
            }`}
          />
        </div>

        <div>
          <label className={`block text-base font-bold mb-3 flex items-center gap-2 transition-colors duration-500 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
            <span className="text-xl">💰</span>
            {t('amount', language)} ({t('thb', language)})
          </label>
          <div className="relative">
            <span className={`absolute left-4 top-3 text-2xl transition-colors duration-500 ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`}>฿</span>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className={`w-full px-4 py-3 rounded-xl border-2 outline-none focus:ring-2 transition-all duration-300 font-bold text-lg pl-10 ${
                isDarkMode 
                  ? 'bg-slate-800 border-slate-700 text-white focus:border-indigo-500 focus:ring-indigo-500/20 placeholder:text-slate-600' 
                  : 'bg-white border-gray-100 focus:border-indigo-500 focus:ring-indigo-100 placeholder:text-gray-300'
              }`}
            />
          </div>
        </div>

        <div>
          <label className={`block text-base font-bold mb-3 flex items-center gap-2 transition-colors duration-500 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
            <span className="text-xl">🏷️</span>
            {t('category', language)}
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
            className={`w-full px-4 py-3 rounded-xl border-2 outline-none focus:ring-2 transition-all duration-300 font-bold text-lg cursor-pointer ${
              isDarkMode 
                ? 'bg-slate-800 border-slate-700 text-white focus:border-indigo-500 focus:ring-indigo-500/20' 
                : 'bg-white border-gray-100 focus:border-indigo-500 focus:ring-indigo-100'
            }`}
          >
            <option value="food">🍽️ {t('food', language)}</option>
            <option value="supplies">🛒 {t('supplies', language)}</option>
            <option value="other">📦 {t('other', language)}</option>
          </select>
        </div>

        <div>
          <label className={`block text-base font-bold mb-3 flex items-center gap-2 transition-colors duration-500 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
            <span className="text-xl">📅</span>
            {t('date', language)}
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border-2 outline-none focus:ring-2 transition-all duration-300 font-bold text-lg ${
              isDarkMode 
                ? 'bg-slate-800 border-slate-700 text-white focus:border-indigo-500 focus:ring-indigo-500/20 color-scheme-dark' 
                : 'bg-white border-gray-100 focus:border-indigo-500 focus:ring-indigo-100'
            }`}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full mt-8 py-5 text-xl flex items-center justify-center gap-2 px-6 text-white font-black rounded-xl transition-all duration-300 shadow-md hover:shadow-lg active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed ${
            isDarkMode 
              ? 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/20' 
              : 'bg-gradient-to-r from-indigo-600 to-indigo-500'
          }`}
        >
          <span>{loading ? '⏳' : '✨'}</span>
          {loading ? '...' : t('save', language)}
        </button>
      </form>
    </div>
  );
};
