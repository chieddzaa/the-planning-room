import { buildKey } from './storageKeys';

/**
 * Export all localStorage data for a specific page
 * @param {string} username - The username
 * @param {string} page - The page name (yearly, monthly, weekly, daily)
 * @returns {Object} - Object containing all data for the page
 */
export function getPageData(username, page) {
  const prefix = `planning-room:${username}:${page}.`;
  const data = {};

  // Get all localStorage keys
  for (let i = 0; i < window.localStorage.length; i++) {
    const key = window.localStorage.key(i);
    if (key && key.startsWith(prefix)) {
      try {
        const value = JSON.parse(window.localStorage.getItem(key));
        // Remove the prefix to get the field name
        const fieldName = key.replace(prefix, '');
        data[fieldName] = value;
      } catch (error) {
        console.error(`Error parsing localStorage key "${key}":`, error);
        // If parsing fails, store as string
        data[key.replace(prefix, '')] = window.localStorage.getItem(key);
      }
    }
  }

  return data;
}

/**
 * Export page data as JSON file download
 * @param {string} username - The username
 * @param {string} page - The page name (yearly, monthly, weekly, daily)
 */
export function exportPageData(username, page) {
  const data = getPageData(username, page);
  
  // Create metadata
  const exportData = {
    username,
    page,
    exportedAt: new Date().toISOString(),
    version: '1.0',
    data
  };

  // Convert to JSON string
  const jsonString = JSON.stringify(exportData, null, 2);

  // Create filename with date
  const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const filename = `planning-room-${username}-${page}-${date}.json`;

  // Create blob and download
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

