import { useState, useEffect } from 'react';
import { buildKey } from '../utils/storageKeys';

/**
 * Custom hook for theme tint management
 * @param {string} username - The username
 * @returns {Object} - { themeTint, setThemeTint }
 */
export function useThemeTint(username) {
  const [themeTint, setThemeTintState] = useState(() => {
    if (!username) return 'blue';
    try {
      const stored = window.localStorage.getItem(buildKey(username, 'theme'));
      return stored || 'blue';
    } catch (error) {
      console.error('Error reading theme from localStorage:', error);
      return 'blue';
    }
  });

  useEffect(() => {
    if (username) {
      try {
        const stored = window.localStorage.getItem(buildKey(username, 'theme'));
        if (stored) {
          setThemeTintState(stored);
        }
      } catch (error) {
        console.error('Error reading theme from localStorage:', error);
      }
    }
  }, [username]);

  const setThemeTint = (tint) => {
    if (!username) return;
    try {
      window.localStorage.setItem(buildKey(username, 'theme'), tint);
      setThemeTintState(tint);
    } catch (error) {
      console.error('Error setting theme in localStorage:', error);
    }
  };

  return { themeTint, setThemeTint };
}


