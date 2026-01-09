import React from 'react';

export default function StatusBar({ onExport, onReset, isSaving = false }) {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="bg-white/40 backdrop-blur-lg border-t border-gray-200/50 px-4 py-2 flex items-center justify-between text-xs text-gray-700 shadow-sm">
      <div className="flex items-center gap-4">
        {isSaving ? (
          <div className="flex items-center gap-1.5 text-orange-500 transition-all duration-300">
            <span className="text-sm animate-pulse">●</span>
            <span className="font-medium">saving gently...</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-green-500 transition-all duration-300">
            <span className="text-sm">✓</span>
            <span className="font-medium">all saved</span>
          </div>
        )}
        <span className="text-gray-600 font-light">{currentDate.toLowerCase()}</span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onExport}
          className="button-windows text-xs px-3 py-1 transition-all duration-300 hover:scale-105"
        >
          export
        </button>
        <button
          type="button"
          onClick={onReset}
          className="button-windows text-xs px-3 py-1 transition-all duration-300 hover:scale-105"
        >
          reset
        </button>
      </div>
    </div>
  );
}
