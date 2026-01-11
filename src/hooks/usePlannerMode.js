import { useState, useEffect } from 'react';

/**
 * Custom hook for planner mode (Personal/Work)
 * @returns {Object} - { mode, setMode }
 */
export function usePlannerMode() {
  const [mode, setModeState] = useState(() => {
    try {
      return window.localStorage.getItem('planning-room.mode') || 'personal';
    } catch (error) {
      console.error('Error reading mode from localStorage:', error);
      return 'personal';
    }
  });

  const setMode = (newMode) => {
    if (newMode !== 'personal' && newMode !== 'work') {
      console.warn('Invalid mode. Must be "personal" or "work"');
      return;
    }
    try {
      window.localStorage.setItem('planning-room.mode', newMode);
      setModeState(newMode);
    } catch (error) {
      console.error('Error setting mode in localStorage:', error);
    }
  };

  return { mode, setMode };
}

