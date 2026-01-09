import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from './useAuth';

/**
 * Custom hook for state that syncs with Supabase when authenticated, falls back to localStorage
 * @param {string} storageKey - The localStorage key (also used as page identifier)
 * @param {any} initialValue - The initial value
 * @param {Function} onSavingChange - Callback when saving state changes
 * @param {number} debounceMs - Debounce delay in milliseconds
 * @returns {[any, function, boolean, function]} - [value, setValue, isSaving, flushSave]
 */
export function useSyncedState(storageKey, initialValue, onSavingChange = null, debounceMs = 400) {
  const { user, isAuthenticated, isSupabaseConfigured } = useAuth();
  const [storedValue, setStoredValue] = useState(() => {
    // Initial load from localStorage immediately (don't wait for auth check)
    try {
      const item = window.localStorage.getItem(storageKey);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${storageKey}":`, error);
      return initialValue;
    }
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Start false, set true during async load
  const timeoutRef = useRef(null);
  const isInitialMount = useRef(true);
  const lastSyncedRef = useRef(null);

  // Extract page and field from storageKey (e.g., "planning-room:username:yearly.theme" -> "yearly", "theme")
  const getPageAndField = useCallback((key) => {
    const parts = key.split(':');
    if (parts.length >= 3) {
      const fullSection = parts.slice(2).join(':'); // "yearly.theme" or "yearly.goals"
      const [page, ...fieldParts] = fullSection.split('.');
      // fieldParts might be ["theme"] or ["goals"] - join them back
      const field = fieldParts.length > 0 ? fieldParts.join('.') : fullSection;
      return { page, field };
    }
    // Fallback: try to extract from key directly
    const match = key.match(/(?:yearly|monthly|weekly|daily)\.(.+)$/);
    if (match) {
      return { page: key.match(/(yearly|monthly|weekly|daily)/)?.[1] || 'unknown', field: match[1] };
    }
    return { page: 'unknown', field: key };
  }, []);

  // Load data on mount or when auth state changes
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      try {
        if (isAuthenticated && isSupabaseConfigured && supabase) {
          // Load from Supabase
          const { page, field } = getPageAndField(storageKey);
          const today = new Date().toISOString().split('T')[0];
          
          const { data, error } = await supabase
            .from('planner_entries')
            .select('data')
            .eq('user_id', user.id)
            .eq('date', today)
            .eq('page', page)
            .maybeSingle();

          if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
            console.error('Error loading from Supabase:', error);
            // Fall back to localStorage
            const localItem = window.localStorage.getItem(storageKey);
            setStoredValue(localItem ? JSON.parse(localItem) : initialValue);
          } else if (data?.data?.[field]) {
            // Load from Supabase data
            setStoredValue(data.data[field]);
            lastSyncedRef.current = JSON.stringify(data.data[field]);
          } else {
            // No Supabase data, try localStorage
            const localItem = window.localStorage.getItem(storageKey);
            const localValue = localItem ? JSON.parse(localItem) : initialValue;
            setStoredValue(localValue);
            
            // If we have local data and are authenticated, we might want to sync it
            // But don't auto-sync here - let user explicitly trigger sync
          }
        } else {
          // Not authenticated, load from localStorage
          const item = window.localStorage.getItem(storageKey);
          setStoredValue(item ? JSON.parse(item) : initialValue);
        }
      } catch (error) {
        console.error(`Error loading data for key "${storageKey}":`, error);
        // Fallback to localStorage
        try {
          const item = window.localStorage.getItem(storageKey);
          setStoredValue(item ? JSON.parse(item) : initialValue);
        } catch (e) {
          setStoredValue(initialValue);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [storageKey, isAuthenticated, user?.id, isSupabaseConfigured, getPageAndField, initialValue]);

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

  // Save function - syncs to both Supabase (if authenticated) and localStorage
  const saveToStorage = useCallback(async (valueToStore) => {
    // Always save to localStorage as backup
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error saving to localStorage for key "${storageKey}":`, error);
    }

    // If authenticated, also save to Supabase
    if (isAuthenticated && isSupabaseConfigured && supabase && user) {
      try {
        const { page, field } = getPageAndField(storageKey);
        const today = new Date().toISOString().split('T')[0];

        // Get existing entry data to merge with (avoid overwriting other fields)
        const { data: existing } = await supabase
          .from('planner_entries')
          .select('data')
          .eq('user_id', user.id)
          .eq('date', today)
          .eq('page', page)
          .maybeSingle();

        // Merge existing data with new field value
        const existingData = existing?.data || {};
        const updatedData = { 
          ...existingData, 
          [field]: valueToStore // Update or add this field
        };

        const { error } = await supabase
          .from('planner_entries')
          .upsert({
            user_id: user.id,
            date: today,
            page: page,
            data: updatedData,
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'user_id,date,page',
          });

        if (error) {
          console.error('Error saving to Supabase:', error);
        } else {
          lastSyncedRef.current = JSON.stringify(valueToStore);
        }
      } catch (error) {
        console.error('Error syncing to Supabase:', error);
      }
    }
  }, [storageKey, isAuthenticated, user, isSupabaseConfigured, getPageAndField]);

  // Debounced save function
  const debouncedSave = useCallback((valueToStore) => {
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set saving state
    setIsSaving(true);

    // Set new timeout
    timeoutRef.current = setTimeout(async () => {
      await saveToStorage(valueToStore);
      setIsSaving(false);
    }, debounceMs);
  }, [saveToStorage, debounceMs]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Setter function
  const setValue = useCallback((value) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      debouncedSave(valueToStore);
    } catch (error) {
      console.error(`Error updating value for key "${storageKey}":`, error);
    }
  }, [storedValue, debouncedSave, storageKey]);

  // Force immediate save (flush debounced saves)
  const flushSave = useCallback(async () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsSaving(true);
    await saveToStorage(storedValue);
    setIsSaving(false);
  }, [storageKey, storedValue, saveToStorage]);

  // Return same signature as useLocalStorageState for drop-in compatibility
  // isLoading is available but not needed by existing components
  return [storedValue, setValue, isSaving, flushSave];
}

