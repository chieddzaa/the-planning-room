import React, { useState, useCallback, useEffect, useRef } from 'react';
import TitleBar from './components/TitleBar';
import Sidebar from './components/Sidebar';
import StatusBar from './components/StatusBar';
import BackgroundFX from './components/BackgroundFX';
import AskAIButton from './components/AskAIButton';
import SelahPanel from './components/SelahPanel';
import Login from './pages/Login';
import Yearly from './pages/Yearly';
import Monthly from './pages/Monthly';
import Weekly from './pages/Weekly';
import Daily from './pages/Daily';
import { exportPageData } from './utils/exportData';
import { useUser } from './hooks/useUser';
import { useThemeTint } from './hooks/useThemeTint';
import { useTheme } from './hooks/useTheme';

function App() {
  const { username, setUsername, logout } = useUser();
  const { themeTint, setThemeTint } = useThemeTint(username);
  const { theme, setTheme } = useTheme(username);
  const [activeTab, setActiveTab] = useState('yearly');
  const [isSaving, setIsSaving] = useState(false);
  const [displayTab, setDisplayTab] = useState('yearly');
  const [selahOpen, setSelahOpen] = useState(false);
  
  // Refs for page components to access reset functions
  const yearlyRef = useRef(null);
  const monthlyRef = useRef(null);
  const weeklyRef = useRef(null);
  const dailyRef = useRef(null);

  // Apply theme to body on mount and when theme changes
  useEffect(() => {
    if (username && theme) {
      document.body.setAttribute('data-theme', theme);
    } else {
      document.body.setAttribute('data-theme', 'ai-lab');
    }
  }, [theme, username]);

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

  const handleAskSelah = () => {
    setSelahOpen(true);
  };

  const handleCloseSelah = () => {
    setSelahOpen(false);
  };

  const renderContent = () => {
    switch (displayTab) {
      case 'yearly':
        return <Yearly ref={yearlyRef} username={username} onSavingChange={handleSavingChange} />;
      case 'monthly':
        return <Monthly ref={monthlyRef} username={username} onSavingChange={handleSavingChange} />;
      case 'weekly':
        return <Weekly ref={weeklyRef} username={username} onSavingChange={handleSavingChange} />;
      case 'daily':
        return <Daily ref={dailyRef} username={username} onSavingChange={handleSavingChange} />;
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
          onLogout={handleLogout}
          activeTab={activeTab}
        />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar 
            activeTab={activeTab} 
            onTabChange={handleTabChange}
            themeTint={themeTint}
          />
          <main className="flex-1 overflow-y-auto p-6 relative">
            {/* Theme-based Background FX - Full effects after login */}
            <BackgroundFX theme={theme} page={displayTab} isLoginPage={false} />
            
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
        
        {/* Floating Ask Selah Button - Only show when logged in */}
        <AskAIButton onAsk={handleAskSelah} position="bottom-right" />
        
        {/* Selah Panel - Modal/Drawer */}
        <SelahPanel isOpen={selahOpen} onClose={handleCloseSelah} theme={theme} />
      </div>
    </div>
  );
}

export default App;
