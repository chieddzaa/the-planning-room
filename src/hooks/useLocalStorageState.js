import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook for localStorage persistence with debounced saving
 * @param {string} key - The localStorage key
 * @param {any} initialValue - The initial value if key doesn't exist
 * @param {Function} onSavingChange - Callback when saving state changes (isSaving: boolean)
 * @param {number} debounceMs - Debounce delay in milliseconds (default: 400)
 * @returns {[any, function, boolean, function]} - [value, setValue, isSaving, flushSave]
 */
export function useLocalStorageState(key, initialValue, onSavingChange = null, debounceMs = 400) {
  // State to store our value
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Track saving state
  const [isSaving, setIsSaving] = useState(false);
  const timeoutRef = useRef(null);
  const isInitialMount = useRef(true);

  // Notify parent of saving state changes
  useEffect(() => {
    if (onSavingChange && !isInitialMount.current) {
      onSavingChange(isSaving);
    }
  }, [isSaving, onSavingChange]);

  // Skip the initial mount notification
  useEffect(() => {
    isInitialMount.current = false;
  }, []);

  // Debounced save function
  const saveToStorage = useCallback((valueToStore) => {
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set saving state
    setIsSaving(true);

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      try {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
        setIsSaving(false);
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
        setIsSaving(false);
      }
    }, debounceMs);
  }, [key, debounceMs]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Return a wrapped version of useState's setter function that
  // persists the new value to localStorage with debouncing.
  const setValue = useCallback((value) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      saveToStorage(valueToStore);
    } catch (error) {
      console.error(`Error updating value for localStorage key "${key}":`, error);
    }
  }, [storedValue, saveToStorage, key]);

  // Force immediate save (flush debounced saves)
  const flushSave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
      setIsSaving(false);
    } catch (error) {
      console.error(`Error flushing save for localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue, isSaving, flushSave];
}


