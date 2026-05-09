import React, { useState, useEffect, useMemo } from 'react';
import type { Schedule, Language } from '../types';
import { t } from '../utils/translations';
import { api } from '../services/api';

interface ScheduleViewProps {
  language: Language;
  isDarkMode: boolean;
}

export const ScheduleView: React.FC<ScheduleViewProps> = ({ language, isDarkMode }) => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Form state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [dayOfWeek, setDayOfWeek] = useState(6); // Default to Sunday (6)
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [startHour, setStartHour] = useState(8);
  const [endHour, setEndHour] = useState(9);

  const days = [
    { id: 6, label: t('sunday', language), color: 'bg-red-50 text-red-700 border-red-200' },
    { id: 0, label: t('monday', language), color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
    { id: 1, label: t('tuesday', language), color: 'bg-pink-50 text-pink-700 border-pink-200' },
    { id: 2, label: t('wednesday', language), color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { id: 3, label: t('thursday', language), color: 'bg-orange-50 text-orange-700 border-orange-200' },
    { id: 4, label: t('friday', language), color: 'bg-sky-50 text-sky-700 border-sky-200' },
    { id: 5, label: t('saturday', language), color: 'bg-purple-50 text-purple-700 border-purple-200' },
  ];

  const fetchSchedules = async () => {
    try {
      const data = await api.getSchedules();
      setSchedules(data || []);
    } catch (err) {
      console.error('Failed to fetch schedules:', err);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!title) {
      setError(language === 'th' ? 'กรุณากรอกชื่อกิจกรรม' : 'Please enter activity title');
      return;
    }

    try {
      const data = { day_of_week: dayOfWeek, title, note, start_hour: startHour, end_hour: endHour };
      if (editingId) {
        await api.updateSchedule(editingId, data);
        setSuccess(language === 'th' ? 'แก้ไขสำเร็จ!' : 'Updated successfully!');
      } else {
        await api.createSchedule(data);
        setSuccess(language === 'th' ? 'เพิ่มกิจกรรมสำเร็จ!' : 'Added successfully!');
      }
      
      setTitle('');
      setNote('');
      setEditingId(null);
      fetchSchedules();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message.includes('overlap') ? t('overlapError', language) : (language === 'th' ? 'เกิดข้อผิดพลาด' : 'An error occurred'));
    }
  };

  const handleEdit = (s: Schedule) => {
    setEditingId(s.id);
    setDayOfWeek(s.day_of_week);
    setTitle(s.title);
    setNote(s.note);
    setStartHour(s.start_hour);
    setEndHour(s.end_hour);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm(language === 'th' ? 'ลบกิจกรรมนี้?' : 'Delete this activity?')) return;
    try {
      await api.deleteSchedule(id);
      fetchSchedules();
    } catch (err) {
      console.error('Failed to delete:', err);
    }
  };

  const timelineHours = useMemo(() => {
    if (schedules.length === 0) return [];
    const min = Math.min(...schedules.map(s => s.start_hour));
    const max = Math.max(...schedules.map(s => s.end_hour));
    const hours = [];
    for (let h = min; h < max; h++) hours.push(h);
    return hours;
  }, [schedules]);

  return (
    <div className={`flex-1 p-8 transition-colors duration-500 ${isDarkMode ? 'bg-slate-950/50' : 'bg-gray-50/50'}`}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className={`text-4xl font-black mb-2 font-poppins tracking-tighter italic transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            {t('schedule', language)}
          </h2>
          <div className={`h-1.5 w-20 rounded-full transition-colors duration-500 ${isDarkMode ? 'bg-indigo-500' : 'bg-indigo-600'}`}></div>
        </div>

        {/* Schedule Table */}
        {schedules.length > 0 && (
          <div className={`rounded-2xl shadow-xl border overflow-hidden mb-10 transition-all duration-500 ${
            isDarkMode ? 'bg-slate-900/90 border-slate-700 shadow-indigo-500/5' : 'bg-white border-gray-200 shadow-sm'
          }`}>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className={`p-3 border-b border-r font-black text-xs w-28 uppercase tracking-widest transition-colors duration-500 ${
                      isDarkMode ? 'bg-slate-800/50 text-slate-500 border-slate-700' : 'bg-gray-50 text-gray-500 border-gray-200'
                    }`}>Day/Time</th>
                    {timelineHours.map(h => (
                      <th key={h} className={`p-3 border-b border-r font-black text-xs min-w-[120px] transition-colors duration-500 ${
                        isDarkMode ? 'bg-slate-800/50 text-slate-500 border-slate-700' : 'bg-gray-50 text-gray-500 border-gray-200'
                      }`}>
                        {h}:00-{h+1}:00
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {days.map(day => (
                    <tr key={day.id}>
                      <td className={`p-3 border-b border-r font-black whitespace-nowrap text-sm uppercase tracking-wide transition-colors duration-500 ${
                        isDarkMode ? 'text-slate-400 bg-slate-800/20 border-slate-700' : 'text-gray-700 bg-gray-50/30 border-gray-200'
                      }`}>{day.label}</td>
                      {timelineHours.map(h => {
                        const activity = schedules.find(s => s.day_of_week === day.id && h >= s.start_hour && h < s.end_hour);
                        if (!activity) return <td key={h} className={`border-b border-r transition-colors duration-500 ${isDarkMode ? 'border-slate-700' : 'border-gray-200'}`}></td>;
                        
                        const isStart = activity.start_hour === h;
                        const span = activity.end_hour - activity.start_hour;
                        
                        if (isStart) {
                          return (
                            <td 
                              key={h} 
                              colSpan={span} 
                              className={`p-1 border-b border-r align-top transition-colors duration-500 ${isDarkMode ? 'border-slate-700' : 'border-gray-200'}`}
                            >
                              <div className={`h-full min-h-[70px] rounded-xl p-3 border shadow-md transition-all duration-300 hover:scale-[1.01] ${
                                isDarkMode ? 'brightness-90 contrast-125' : ''
                              } ${day.color}`}>
                                <p className="font-black text-sm leading-tight mb-1 uppercase tracking-tight">{activity.title}</p>
                                {activity.note && <p className="text-xs opacity-90 font-bold leading-tight">{activity.note}</p>}
                              </div>
                            </td>
                          );
                        }
                        return null; 
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Form */}
          <div className={`lg:col-span-2 rounded-3xl shadow-2xl p-10 border h-fit sticky top-8 transition-all duration-500 ${
            isDarkMode ? 'bg-slate-900/90 border-slate-700 shadow-indigo-500/10' : 'bg-white border-gray-200 shadow-xl'
          }`}>
            <h3 className={`text-2xl font-black mb-8 flex items-center gap-3 transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              <span>{editingId ? '📝' : '✨'}</span>
              {editingId ? t('editActivity', language) : t('addActivity', language)}
            </h3>
            {error && <div className={`mb-8 p-5 border-l-4 rounded-2xl text-base font-black italic transition-colors duration-500 ${isDarkMode ? 'bg-red-950/30 border-red-500 text-red-400' : 'bg-red-50 border-red-100 text-red-700'}`}>⚠️ {error}</div>}
            {success && <div className={`mb-8 p-5 border-l-4 rounded-2xl text-base font-black transition-colors duration-500 ${isDarkMode ? 'bg-emerald-950/30 border-emerald-500 text-emerald-400' : 'bg-emerald-50 border-emerald-100 text-emerald-700'}`}>✅ {success}</div>}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className={`block text-sm font-black uppercase mb-3 tracking-widest transition-colors duration-500 ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`}>{t('day', language)}</label>
                <div className="grid grid-cols-4 gap-2">
                  {days.map(d => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setDayOfWeek(d.id)}
                      className={`py-4 rounded-xl text-xs font-black border transition-all duration-300 ${
                        dayOfWeek === d.id 
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xl scale-105' 
                          : isDarkMode 
                            ? 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700' 
                            : 'bg-white text-gray-500 border-gray-100 hover:bg-gray-50'
                      }`}
                    >
                      {language === 'th' ? d.label.replace('วัน', '') : d.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className={`block text-sm font-black uppercase mb-3 tracking-widest transition-colors duration-500 ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`}>{t('title', language)}</label>
                <input 
                  type="text" 
                  value={title} 
                  onChange={e => setTitle(e.target.value)} 
                  className={`w-full px-5 py-4 rounded-2xl border-2 outline-none focus:ring-2 transition-all duration-300 font-black text-lg ${
                    isDarkMode 
                      ? 'bg-slate-800 border-slate-700 text-white focus:border-indigo-500 focus:ring-indigo-500/20' 
                      : 'bg-white border-gray-50 focus:border-indigo-500 focus:ring-indigo-100'
                  }`} 
                />
              </div>
              <div>
                <label className={`block text-sm font-black uppercase mb-3 tracking-widest transition-colors duration-500 ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`}>{t('note', language)}</label>
                <textarea 
                  value={note} 
                  onChange={e => setNote(e.target.value)} 
                  className={`w-full px-5 py-4 rounded-2xl border-2 outline-none focus:ring-2 transition-all duration-300 h-28 resize-none font-bold text-base ${
                    isDarkMode 
                      ? 'bg-slate-800 border-slate-700 text-white focus:border-indigo-500 focus:ring-indigo-500/20' 
                      : 'bg-white border-gray-50 focus:border-indigo-500 focus:ring-indigo-100'
                  }`} 
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className={`block text-sm font-black uppercase mb-3 tracking-widest transition-colors duration-500 ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`}>{t('startTime', language)}</label>
                  <select 
                    value={startHour} 
                    onChange={e => setStartHour(parseInt(e.target.value))} 
                    className={`w-full px-5 py-4 rounded-2xl border-2 outline-none focus:ring-2 transition-all duration-300 font-black text-lg ${
                      isDarkMode 
                        ? 'bg-slate-800 border-slate-700 text-white focus:border-indigo-500 focus:ring-indigo-500/20' 
                        : 'bg-white border-gray-50 focus:border-indigo-500 focus:ring-indigo-100'
                    }`}
                  >
                    {Array.from({ length: 24 }).map((_, i) => <option key={i} value={i}>{String(i).padStart(2, '0')}:00</option>)}
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-black uppercase mb-3 tracking-widest transition-colors duration-500 ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`}>{t('endTime', language)}</label>
                  <select 
                    value={endHour} 
                    onChange={e => setEndHour(parseInt(e.target.value))} 
                    className={`w-full px-5 py-4 rounded-2xl border-2 outline-none focus:ring-2 transition-all duration-300 font-black text-lg ${
                      isDarkMode 
                        ? 'bg-slate-800 border-slate-700 text-white focus:border-indigo-500 focus:ring-indigo-500/20' 
                        : 'bg-white border-gray-50 focus:border-indigo-500 focus:ring-indigo-100'
                    }`}
                  >
                    {Array.from({ length: 24 }).map((_, i) => <option key={i+1} value={i+1}>{String(i+1).padStart(2, '0')}:00</option>)}
                  </select>
                </div>
              </div>
              <button 
                type="submit" 
                className={`w-full py-5 text-white font-black text-xl rounded-2xl shadow-2xl transition-all duration-300 active:scale-95 uppercase tracking-widest ${
                  isDarkMode 
                    ? 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/20' 
                    : 'bg-indigo-600 shadow-indigo-100 hover:bg-indigo-700'
                }`}
              >
                {editingId ? t('save', language) : t('addActivity', language)}
              </button>
              {editingId && <button type="button" onClick={() => { setEditingId(null); setTitle(''); setNote(''); }} className={`w-full py-3 font-bold transition-all ${isDarkMode ? 'text-slate-500 hover:text-slate-300' : 'text-gray-400 hover:text-gray-600'}`}>{t('cancel', language)}</button>}
            </form>
          </div>

          {/* List */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className={`text-xl font-black flex items-center gap-2 transition-colors duration-500 ${isDarkMode ? 'text-slate-300' : 'text-gray-800'}`}>
              <span>📋</span> {language === 'th' ? 'รายการกิจกรรม' : 'Activities List'}
            </h3>
            {schedules.length === 0 ? (
              <div className={`rounded-3xl p-10 text-center border border-dashed transition-all duration-500 ${isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-white border-gray-300'}`}>
                <p className="text-gray-400 font-bold">{language === 'th' ? 'ไม่มีกิจกรรม' : 'No activities'}</p>
              </div>
            ) : (
              schedules.map(s => {
                const dayObj = days.find(d => d.id === s.day_of_week) || days[0];
                return (
                  <div key={s.id} className={`rounded-2xl p-6 border shadow-sm flex items-center justify-between group transition-all duration-300 ${
                    isDarkMode 
                      ? 'bg-slate-900/90 border-slate-700 hover:border-indigo-500/50' 
                      : 'bg-white border-gray-100 hover:border-indigo-200'
                  }`}>
                    <div className="flex items-center gap-6">
                      <div className={`px-4 h-12 rounded-xl flex items-center justify-center font-black text-[10px] border whitespace-nowrap ${dayObj.color} ${isDarkMode ? 'brightness-90 contrast-125' : ''}`}>
                        {dayObj.label}
                      </div>
                      <div>
                        <h4 className={`font-black text-lg transition-colors duration-500 ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>{s.title}</h4>
                        <p className="text-xs font-bold text-gray-500">{String(s.start_hour).padStart(2, '0')}:00 - {String(s.end_hour).padStart(2, '0')}:00</p>
                        {s.note && <p className={`text-xs mt-1 transition-colors duration-500 ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>{s.note}</p>}
                      </div>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <button onClick={() => handleEdit(s)} className={`p-3 rounded-xl transition-all ${isDarkMode ? 'bg-slate-800 text-indigo-400 hover:bg-indigo-600 hover:text-white' : 'bg-gray-50 text-indigo-600 hover:bg-indigo-600 hover:text-white'}`}>✏️</button>
                      <button onClick={() => handleDelete(s.id)} className={`p-3 rounded-xl transition-all ${isDarkMode ? 'bg-slate-800 text-rose-400 hover:bg-rose-600 hover:text-white' : 'bg-gray-50 text-rose-600 hover:bg-rose-600 hover:text-white'}`}>🗑️</button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
