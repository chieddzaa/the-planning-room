import { useState, useEffect } from 'react';
import { buildKey } from '../utils/storageKeys';

/**
 * Custom hook for Day/Night mode management
 * @param {string} username - The username
 * @returns {Object} - { mode, setMode, toggleMode }
 */
export function useDayNightMode(username) {
  const [mode, setModeState] = useState(() => {
    if (!username) {
      document.body.setAttribute('data-day-night', 'day');
      return 'day';
    }
    try {
      const stored = window.localStorage.getItem(buildKey(username, 'dayNightMode'));
      const initialMode = stored || 'day';
      document.body.setAttribute('data-day-night', initialMode);
      return initialMode;
    } catch (error) {
      console.error('Error reading day/night mode from localStorage:', error);
      document.body.setAttribute('data-day-night', 'day');
      return 'day';
    }
  });

  useEffect(() => {
    if (username) {
      try {
        const stored = window.localStorage.getItem(buildKey(username, 'dayNightMode'));
        const newMode = stored || 'day';
        setModeState(newMode);
        document.body.setAttribute('data-day-night', newMode);
      } catch (error) {
        console.error('Error reading day/night mode from localStorage:', error);
        setModeState('day');
        document.body.setAttribute('data-day-night', 'day');
      }
    } else {
      setModeState('day'); // default when no user
      document.body.setAttribute('data-day-night', 'day');
    }
  }, [username]);

  const setMode = (newMode) => {
    if (!username) return;
    try {
      window.localStorage.setItem(buildKey(username, 'dayNightMode'), newMode);
      setModeState(newMode);
      // Update data attribute on body
      document.body.setAttribute('data-day-night', newMode);
    } catch (error) {
      console.error('Error setting day/night mode in localStorage:', error);
    }
  };

  const toggleMode = () => {
    const newMode = mode === 'day' ? 'night' : 'day';
    setMode(newMode);
  };

  // Update body data-day-night when mode changes
  useEffect(() => {
    if (username && mode) {
      document.body.setAttribute('data-day-night', mode);
    } else {
      document.body.setAttribute('data-day-night', 'day');
    }
  }, [mode, username]);

  return { mode, setMode, toggleMode };
}

