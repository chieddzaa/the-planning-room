import { useState, useEffect } from 'react';
import { buildKey } from '../utils/storageKeys';

/**
 * Custom hook for global theme management (pink/ai-lab)
 * @param {string} username - The username
 * @returns {Object} - { theme, setTheme }
 */
export function useTheme(username) {
  const [theme, setThemeState] = useState(() => {
    if (!username) return 'ai-lab';
    try {
      const stored = window.localStorage.getItem(buildKey(username, 'theme'));
      return stored || 'ai-lab';
    } catch (error) {
      console.error('Error reading theme from localStorage:', error);
      return 'ai-lab';
    }
  });

  useEffect(() => {
    if (username) {
      try {
        const stored = window.localStorage.getItem(buildKey(username, 'theme'));
        if (stored) {
          setThemeState(stored);
        } else {
          setThemeState('ai-lab'); // default
        }
      } catch (error) {
        console.error('Error reading theme from localStorage:', error);
      }
    } else {
      setThemeState('ai-lab'); // default when no user
    }
  }, [username]);

  const setTheme = (newTheme) => {
    if (!username) return;
    try {
      window.localStorage.setItem(buildKey(username, 'theme'), newTheme);
      setThemeState(newTheme);
      // Update data attribute on body
      document.body.setAttribute('data-theme', newTheme);
    } catch (error) {
      console.error('Error setting theme in localStorage:', error);
    }
  };

  // Update body data-theme when theme changes
  useEffect(() => {
    if (username && theme) {
      document.body.setAttribute('data-theme', theme);
    }
  }, [theme, username]);

  return { theme, setTheme };
}

