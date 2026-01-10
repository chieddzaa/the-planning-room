import { supabase } from '../lib/supabaseClient';
import { buildKey } from './storageKeys';

/**
 * Migrate guest/localStorage data to Supabase for authenticated user
 * @param {string} userId - The authenticated user's ID
 * @param {string} username - The username (for building storage keys)
 * @returns {Promise<{success: boolean, migrated: number, errors: string[]}>}
 */
export async function migrateGuestData(userId, username) {
  if (!supabase || !userId || !username) {
    return { success: false, migrated: 0, errors: ['Invalid parameters'] };
  }

  const errors = [];
  let migrated = 0;
  const today = new Date().toISOString().split('T')[0];

  // Pages to migrate
  const pages = ['yearly', 'monthly', 'weekly', 'daily'];

  try {
    for (const page of pages) {
      // Get all localStorage keys for this username and page
      const keys = Object.keys(localStorage).filter(key => 
        key.startsWith(`planning-room:${username}:${page}`)
      );

      // Build data object for this page
      const pageData = {};
      
      for (const key of keys) {
        try {
          const field = key.split(':').slice(2).join(':'); // Extract field name
          const fieldName = field.includes('.') ? field.split('.').slice(1).join('.') : field;
          const value = JSON.parse(localStorage.getItem(key));
          pageData[fieldName] = value;
        } catch (error) {
          console.error(`Error reading localStorage key ${key}:`, error);
          errors.push(`Failed to read ${key}`);
        }
      }

      // Only upsert if we have data
      if (Object.keys(pageData).length > 0) {
        // Get existing entry
        const { data: existing } = await supabase
          .from('planner_entries')
          .select('data')
          .eq('user_id', userId)
          .eq('date', today)
          .eq('page', page)
          .maybeSingle();

        // Merge with existing data (existing takes precedence to avoid overwriting)
        const mergedData = existing?.data ? { ...pageData, ...existing.data } : pageData;

        const { error } = await supabase
          .from('planner_entries')
          .upsert({
            user_id: userId,
            date: today,
            page: page,
            data: mergedData,
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'user_id,date,page',
          });

        if (error) {
          console.error(`Error migrating ${page} data:`, error);
          errors.push(`Failed to migrate ${page}: ${error.message}`);
        } else {
          migrated += Object.keys(pageData).length;
        }
      }
    }

    return {
      success: errors.length === 0,
      migrated,
      errors
    };
  } catch (error) {
    console.error('Error during migration:', error);
    return {
      success: false,
      migrated,
      errors: [...errors, error.message]
    };
  }
}


