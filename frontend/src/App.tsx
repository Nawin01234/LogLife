import { useState } from 'react';
import type { Language } from './types';
import { Sidebar } from './components/Sidebar';
import { ExpenseForm } from './components/ExpenseForm';
import { ExpenseHistory } from './components/ExpenseHistory';
import { ScheduleView } from './components/ScheduleView';
import './index.css';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'finance' | 'schedule'>('finance');
  const [showHistory, setShowHistory] = useState(false);
  const [language, setLanguage] = useState<Language>('th');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleAddExpense = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const renderPage = () => {
    if (currentPage === 'schedule') {
      return <ScheduleView language={language} isDarkMode={isDarkMode} />;
    }

    return (
      <div className="min-h-screen flex items-center justify-center p-4 overflow-x-hidden">
        <div 
          className={`flex items-start justify-center w-full max-w-[1400px] mx-auto transition-all duration-[1000ms] ${showHistory ? 'gap-6' : 'gap-0'}`}
          style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
        >
          {/* Form Container */}
          <div 
            className={`flex-shrink-0 transition-all duration-[1000ms] ${showHistory ? 'w-[380px]' : 'w-[420px]'}`}
            style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
          >
            <ExpenseForm 
              onAddExpense={handleAddExpense} 
              language={language} 
              showHistory={showHistory}
              onToggleHistory={() => setShowHistory(!showHistory)} 
              isDarkMode={isDarkMode}
            />
          </div>

          {/* History Container */}
          <div 
            className={`transition-all duration-[1000ms] overflow-hidden ${showHistory ? 'flex-1 opacity-100' : 'w-0 opacity-0 pointer-events-none'}`}
            style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
          >
            <div className="min-w-[650px] pr-2">
              {showHistory && (
                <ExpenseHistory language={language} refreshTrigger={refreshTrigger} isDarkMode={isDarkMode} />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`flex h-screen overflow-hidden ${isDarkMode ? 'dark bg-slate-950' : 'bg-gray-50'}`}>
      <Sidebar
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        language={language}
        onLanguageChange={setLanguage}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
      />

      <div className={`flex-1 overflow-auto transition-colors duration-500 ${isDarkMode ? 'bg-slate-950 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950' : 'bg-gradient-to-br from-sky-50 via-cyan-50 to-teal-50'}`}>
        {renderPage()}
      </div>
    </div>
  );
}
