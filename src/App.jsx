import React, { useState, useCallback, useEffect, useRef } from 'react';
import TitleBar from './components/TitleBar';
import Sidebar from './components/Sidebar';
import StatusBar from './components/StatusBar';
import BackgroundFX from './components/BackgroundFX';
import DoneModal from './components/DoneModal';
// TODO: Re-add Selah chat later
// import AskAIButton from './components/AskAIButton';
// import SelahPanel from './components/SelahPanel';
import Login from './pages/Login';
import Yearly from './pages/Yearly';
import Monthly from './pages/Monthly';
import Weekly from './pages/Weekly';
import Daily from './pages/Daily';
import { exportPageData } from './utils/exportData';
import { useUser } from './hooks/useUser';
import { useThemeTint } from './hooks/useThemeTint';
import { useTheme } from './hooks/useTheme';
import { useDayNightMode } from './hooks/useDayNightMode';

function App() {
  const { username, setUsername, logout } = useUser();
  const { themeTint, setThemeTint } = useThemeTint(username);
  const { theme, setTheme } = useTheme(username);
  const { mode: dayNightMode, toggleMode: toggleDayNightMode } = useDayNightMode(username);
  const [activeTab, setActiveTab] = useState('yearly');
  const [isSaving, setIsSaving] = useState(false);
  const [displayTab, setDisplayTab] = useState('yearly');
  const [showDoneModal, setShowDoneModal] = useState(false);
  // TODO: Re-add Selah chat later
  // const [selahOpen, setSelahOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Refs for page components to access reset and flushSave functions
  const yearlyRef = useRef(null);
  const monthlyRef = useRef(null);
  const weeklyRef = useRef(null);
  const dailyRef = useRef(null);
  const doneButtonRef = useRef(null);

  // Apply theme and day/night mode to body on mount and when they change
  useEffect(() => {
    if (username && theme) {
      document.body.setAttribute('data-theme', theme);
    } else {
      document.body.setAttribute('data-theme', 'ai-lab');
    }
    
    // Apply day/night mode
    if (username && dayNightMode) {
      document.body.setAttribute('data-day-night', dayNightMode);
    } else {
      document.body.setAttribute('data-day-night', 'day');
    }
  }, [theme, username, dayNightMode]);

  // Handle tab change with smooth transition
  const handleTabChange = useCallback((newTab) => {
    if (newTab === activeTab) return;
    
    // Update active tab immediately for sidebar highlighting
    setActiveTab(newTab);
    
    // Small delay before updating displayed content for smooth transition
    setTimeout(() => {
      setDisplayTab(newTab);
    }, 100);
  }, [activeTab]);

  // Track saving state changes from localStorage hooks
  const handleSavingChange = useCallback((saving) => {
    setIsSaving(saving);
  }, []);

  const handleLogin = (newUsername, newTheme) => {
    setUsername(newUsername);
    // Theme is already saved in Login component, just trigger re-read
    if (newTheme) {
      setTheme(newTheme);
    }
  };

  const handleLogout = () => {
    logout();
    document.body.setAttribute('data-theme', 'ai-lab');
  };

  const handleExport = () => {
    exportPageData(username, displayTab);
  };

  const handleReset = () => {
    // Call reset function on the current active page
    const refs = {
      yearly: yearlyRef,
      monthly: monthlyRef,
      weekly: weeklyRef,
      daily: dailyRef
    };
    
    const currentRef = refs[displayTab];
    if (currentRef?.current?.reset) {
      currentRef.current.reset();
    }
  };

  // Handle Done button click - save state before showing modal
  const handleDone = useCallback(async () => {
    // Save any unsaved changes first
    const refs = {
      yearly: yearlyRef,
      monthly: monthlyRef,
      weekly: weeklyRef,
      daily: dailyRef
    };
    
    const currentRef = refs[displayTab];
    if (currentRef?.current?.flushSave) {
      // Force immediate save of any pending changes
      currentRef.current.flushSave();
      // Small delay to ensure save completes
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Show modal after save completes
    setShowDoneModal(true);
  }, [displayTab]);

  // Callback to receive doneButtonRef from TitleBar (desktop button)
  const handleDoneButtonRef = useCallback((ref) => {
    if (ref) {
      // Store ref for desktop Done button (ref is the ref object itself)
      // Desktop and mobile buttons share the same ref pattern
      // Mobile ref is set directly in JSX, desktop ref comes via callback
    }
  }, []);

  // Handle modal close - return focus to Done button
  const handleCloseDoneModal = useCallback(() => {
    setShowDoneModal(false);
    // Return focus to Done button (works for both desktop and mobile)
    setTimeout(() => {
      if (doneButtonRef.current) {
        doneButtonRef.current.focus();
      }
    }, 100);
  }, []);

  // Handle Go to Dashboard (navigate to yearly/home)
  const handleGoToDashboard = useCallback(() => {
    handleTabChange('yearly');
  }, [handleTabChange]);

  // Handle Plan Tomorrow (navigate to daily)
  const handlePlanTomorrow = useCallback(() => {
    handleTabChange('daily');
  }, [handleTabChange]);

  // Handle Weekly Reset (reset weekly page)
  const handleWeeklyReset = useCallback(() => {
    if (weeklyRef?.current?.reset) {
      weeklyRef.current.reset();
    }
    // Navigate to weekly after reset
    handleTabChange('weekly');
  }, [handleTabChange]);

  // Handle View Progress (navigate to yearly view)
  const handleViewProgress = useCallback(() => {
    handleTabChange('yearly');
  }, [handleTabChange]);

  // TODO: Re-add Selah chat later
  // const handleAskSelah = () => {
  //   setSelahOpen(true);
  // };

  // const handleCloseSelah = () => {
  //   setSelahOpen(false);
  // };

  const renderContent = () => {
    switch (displayTab) {
      case 'yearly':
        return <Yearly ref={yearlyRef} username={username} onSavingChange={handleSavingChange} />;
      case 'monthly':
        return <Monthly ref={monthlyRef} username={username} onSavingChange={handleSavingChange} />;
      case 'weekly':
        return <Weekly ref={weeklyRef} username={username} onSavingChange={handleSavingChange} />;
      case 'daily':
        return <Daily ref={dailyRef} username={username} onSavingChange={handleSavingChange} onNavigateToWeekly={() => handleTabChange('weekly')} />;
      default:
        return <Yearly ref={yearlyRef} username={username} onSavingChange={handleSavingChange} />;
    }
  };

  // Show login page if no username
  if (!username) {
    return <Login onLogin={handleLogin} />;
  }

  // Show main app if logged in
  return (
    <div className="h-screen flex flex-col relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Floating blobs */}
        <div 
          className="decorative-blob absolute top-10 left-10 w-64 h-64"
          style={{
            background: 'linear-gradient(135deg, rgba(0, 120, 212, 0.15), rgba(16, 110, 190, 0.1))',
            animationDelay: '0s',
            animationDuration: '20s'
          }}
        />
        <div 
          className="decorative-blob absolute top-1/3 right-20 w-80 h-80"
          style={{
            background: 'linear-gradient(135deg, rgba(16, 124, 16, 0.12), rgba(0, 120, 212, 0.08))',
            animationDelay: '5s',
            animationDuration: '25s'
          }}
        />
        <div 
          className="decorative-blob absolute bottom-20 left-1/4 w-72 h-72"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 140, 0, 0.1), rgba(16, 124, 16, 0.08))',
            animationDelay: '10s',
            animationDuration: '22s'
          }}
        />
        
        {/* Floating circles */}
        <div 
          className="decorative-circle absolute top-1/2 left-1/3 w-96 h-96"
          style={{
            background: 'radial-gradient(circle, rgba(0, 120, 212, 0.1), transparent 70%)',
            animationDelay: '2s',
            animationDuration: '18s'
          }}
        />
        <div 
          className="decorative-circle absolute bottom-1/4 right-1/4 w-80 h-80"
          style={{
            background: 'radial-gradient(circle, rgba(255, 140, 0, 0.08), transparent 70%)',
            animationDelay: '8s',
            animationDuration: '16s'
          }}
        />
      </div>

      {/* Main app container */}
      <div className="relative z-10 h-screen flex flex-col window-border window-shadow overflow-hidden">
        <TitleBar 
          username={username} 
          themeTint={themeTint}
          onThemeChange={setThemeTint}
          theme={theme}
          onThemeSwitch={setTheme}
          dayNightMode={dayNightMode}
          onToggleDayNight={toggleDayNightMode}
          onLogout={handleLogout}
          activeTab={activeTab}
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          onDone={handleDone}
          onDoneButtonRef={handleDoneButtonRef}
        />
        <div className="flex flex-1 overflow-hidden">
          {/* Desktop Sidebar */}
          <div className="hidden md:block">
            <Sidebar 
              activeTab={activeTab} 
              onTabChange={handleTabChange}
              themeTint={themeTint}
            />
          </div>
          
          {/* Mobile Sidebar Overlay */}
          {sidebarOpen && (
            <>
              <div 
                className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
                onClick={() => setSidebarOpen(false)}
              />
              <div className="fixed inset-y-0 left-0 z-50 md:hidden">
                <Sidebar 
                  activeTab={activeTab} 
                  onTabChange={(tab) => {
                    handleTabChange(tab);
                    setSidebarOpen(false);
                  }}
                  themeTint={themeTint}
                />
              </div>
            </>
          )}
          
          <main className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 relative pb-20 md:pb-6">
            {/* Theme-based Background FX - Full effects after login */}
            <BackgroundFX theme={theme} dayNightMode={dayNightMode} page={displayTab} isLoginPage={false} />
            
            {/* Content with smooth page transition */}
            <div 
              key={displayTab}
              className="relative z-10 max-w-5xl mx-auto page-transition-enter"
            >
              {renderContent()}
            </div>
          </main>
        </div>
        <StatusBar onExport={handleExport} onReset={handleReset} isSaving={isSaving} />
        
        {/* Mobile Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-200/50 z-30 md:hidden">
          <div className="flex items-center justify-around px-2 py-2">
            {[
              { id: 'yearly', label: 'yearly', icon: '📆' },
              { id: 'monthly', label: 'monthly', icon: '📅' },
              { id: 'weekly', label: 'weekly', icon: '📋' },
              { id: 'daily', label: 'daily', icon: '✓' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex flex-col items-center justify-center px-3 py-2 min-w-[60px] rounded-lg transition-all ${
                  activeTab === tab.id
                    ? 'text-white'
                    : 'text-gray-600'
                }`}
                style={{
                  background: activeTab === tab.id 
                    ? `linear-gradient(135deg, var(--accent), var(--accent2))`
                    : 'transparent',
                }}
              >
                <span className="text-lg mb-1">{tab.icon}</span>
                <span className="text-[10px] font-medium">{tab.label}</span>
              </button>
            ))}
            {/* Done Button - Mobile (sticky bottom bar) */}
            <button
              ref={doneButtonRef}
              onClick={handleDone}
                className="px-4 py-2 text-xs font-medium text-white rounded-lg transition-all duration-300 hover:scale-105 active:scale-95 touch-manipulation"
                style={{
                  background: 'linear-gradient(135deg, var(--rc-accent), var(--rc-accent-2))',
                  borderRadius: 'var(--rc-radius)',
                  boxShadow: `
                    var(--rc-shadow),
                    0 0 8px color-mix(in srgb, var(--rc-primary, var(--rc-accent)) 20%, transparent),
                    0 0 16px color-mix(in srgb, var(--rc-glow, var(--rc-accent)) 10%, transparent)
                  `,
                  minWidth: '60px',
                  minHeight: '44px'
                }}
                onFocus={(e) => {
                  e.target.style.boxShadow = `
                    var(--rc-shadow),
                    0 0 0 3px color-mix(in srgb, var(--rc-focus, var(--rc-accent)) 25%, transparent),
                    0 0 12px color-mix(in srgb, var(--rc-primary, var(--rc-accent)) 25%, transparent),
                    0 0 20px color-mix(in srgb, var(--rc-glow, var(--rc-accent)) 15%, transparent)
                  `;
                }}
                onBlur={(e) => {
                  e.target.style.boxShadow = `
                    var(--rc-shadow),
                    0 0 8px color-mix(in srgb, var(--rc-primary, var(--rc-accent)) 20%, transparent),
                    0 0 16px color-mix(in srgb, var(--rc-glow, var(--rc-accent)) 10%, transparent)
                  `;
                }}
                title="Done - lock in your progress"
                aria-label="Done - lock in your progress"
              >
                done
              </button>
          </div>
        </div>
        
        {/* Done Modal */}
        <DoneModal
          isOpen={showDoneModal}
          onClose={handleCloseDoneModal}
          onGoToDashboard={handleGoToDashboard}
          onPlanTomorrow={handlePlanTomorrow}
          onWeeklyReset={handleWeeklyReset}
          onViewProgress={handleViewProgress}
          onReturnFocus={handleCloseDoneModal}
        />
        
        {/* TODO: Re-add Selah chat later */}
        {/* <AskAIButton onAsk={handleAskSelah} position="bottom-right" /> */}
        {/* <SelahPanel isOpen={selahOpen} onClose={handleCloseSelah} theme={theme} /> */}
      </div>
    </div>
  );
}

export default App;
