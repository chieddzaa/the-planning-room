import React from 'react';

export default function Sidebar({ activeTab, onTabChange, themeTint = 'blue' }) {
  const tabs = [
    { id: 'yearly', label: 'yearly', icon: '📆' },
    { id: 'monthly', label: 'monthly', icon: '📅' },
    { id: 'weekly', label: 'weekly', icon: '📋' },
    { id: 'daily', label: 'daily', icon: '✓' },
  ];

  // Map themeTint to accent colors, but active tab uses theme variables
  const themeColors = {
    blue: 'bg-blue-500/80',
    green: 'bg-green-500/80',
    orange: 'bg-orange-500/80',
  };

  const activeBg = themeColors[themeTint] || themeColors.blue;

  return (
    <div 
      className="bg-white/40 backdrop-blur-lg border-r border-gray-200/50 w-48 flex flex-col shadow-md animate-slide-in"
      style={{
        boxShadow: '2px 0 10px rgba(0, 0, 0, 0.05), inset -1px 0 0 rgba(255, 255, 255, 0.2)',
        borderTopLeftRadius: 'var(--border-radius-lg)',
        borderBottomLeftRadius: 'var(--border-radius-lg)'
      }}
    >
      <div className="p-4 border-b border-gray-200/50">
        <h2 className="text-sm font-semibold text-gray-800/90 tracking-wide">views</h2>
      </div>
      <div className="flex-1 py-3 space-y-1">
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`w-full px-4 py-2.5 text-left text-sm flex items-center gap-3 transition-all duration-200 group relative overflow-hidden
              ${activeTab === tab.id
                ? 'text-white shadow-lg scale-[1.02] translate-x-1'
                : 'text-gray-700 hover:bg-white/60 active:bg-white/80 hover:scale-[1.01]'
              }`}
            style={{
              animationDelay: `${0.1 + index * 0.05}s`,
              background: activeTab === tab.id 
                ? `linear-gradient(135deg, var(--accent), var(--accent2))`
                : 'transparent',
              boxShadow: activeTab === tab.id 
                ? '0 4px 12px var(--glow), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
                : 'none',
              borderRadius: 'var(--border-radius-sm)'
            }}
          >
            <span className="text-base w-5 flex items-center justify-center transition-transform duration-200 group-hover:scale-110">{tab.icon}</span>
            <span className="font-medium tracking-wide">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
