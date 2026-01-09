import { useState, useEffect } from 'react';

/**
 * Custom hook for user management
 * @returns {Object} - { username, setUsername, logout }
 */
export function useUser() {
  const [username, setUsernameState] = useState(() => {
    try {
      return window.localStorage.getItem('planning-room.user') || null;
    } catch (error) {
      console.error('Error reading user from localStorage:', error);
      return null;
    }
  });

  const setUsername = (newUsername) => {
    try {
      if (newUsername) {
        window.localStorage.setItem('planning-room.user', newUsername);
        setUsernameState(newUsername);
      } else {
        window.localStorage.removeItem('planning-room.user');
        setUsernameState(null);
      }
    } catch (error) {
      console.error('Error setting user in localStorage:', error);
    }
  };

  const logout = () => {
    setUsername(null);
  };

  return { username, setUsername, logout };
}


