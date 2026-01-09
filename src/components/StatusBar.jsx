import React from 'react';

export default function StatusBar({ onExport, onReset, isSaving = false }) {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="bg-white/40 backdrop-blur-lg border-t border-gray-200/50 px-3 sm:px-4 py-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-gray-700 shadow-sm">
      <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
        {isSaving ? (
          <div className="flex items-center gap-1.5 text-orange-500 transition-all duration-300">
            <span className="text-sm animate-pulse">●</span>
            <span className="font-medium text-[10px] sm:text-xs">saving gently...</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-green-500 transition-all duration-300">
            <span className="text-sm">✓</span>
            <span className="font-medium text-[10px] sm:text-xs">all saved</span>
          </div>
        )}
        <span className="text-gray-600 font-light text-[10px] sm:text-xs hidden sm:inline">{currentDate.toLowerCase()}</span>
      </div>
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <button
          onClick={onExport}
          className="button-windows text-[10px] sm:text-xs px-3 py-2 sm:py-1 flex-1 sm:flex-none transition-all duration-300 hover:scale-105 touch-manipulation"
          style={{ minHeight: '44px' }}
        >
          export
        </button>
        <button
          type="button"
          onClick={onReset}
          className="button-windows text-[10px] sm:text-xs px-3 py-2 sm:py-1 flex-1 sm:flex-none transition-all duration-300 hover:scale-105 touch-manipulation"
          style={{ minHeight: '44px' }}
        >
          reset
        </button>
      </div>
    </div>
  );
}
