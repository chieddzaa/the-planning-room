import { buildKey } from './storageKeys';

/**
 * Convert image file to base64 Data URL
 * @param {File} file - Image file
 * @returns {Promise<string>} - Base64 Data URL
 */
export function imageToDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = (e) => reject(e);
    reader.readAsDataURL(file);
  });
}

/**
 * Validate image file
 * @param {File} file - File to validate
 * @returns {{ valid: boolean, error?: string }} - Validation result
 */
export function validateImageFile(file) {
  // Check file type
  if (!file.type.startsWith('image/')) {
    return { valid: false, error: 'only image files are allowed' };
  }

  // Check file size (1MB = 1,048,576 bytes)
  const maxSize = 1024 * 1024; // 1MB
  if (file.size > maxSize) {
    return { valid: false, error: 'image must be 1MB or smaller' };
  }

  return { valid: true };
}

/**
 * Save profile picture to localStorage
 * @param {string} username - Username
 * @param {string} dataURL - Base64 Data URL
 */
export function saveProfilePicture(username, dataURL) {
  try {
    const key = buildKey(username, 'pfp');
    window.localStorage.setItem(key, dataURL);
  } catch (error) {
    console.error('Error saving profile picture:', error);
    throw new Error('failed to save profile picture');
  }
}

/**
 * Get profile picture from localStorage
 * @param {string} username - Username
 * @returns {string|null} - Base64 Data URL or null if not found
 */
export function getProfilePicture(username) {
  if (!username) return null;
  try {
    const key = buildKey(username, 'pfp');
    return window.localStorage.getItem(key);
  } catch (error) {
    console.error('Error reading profile picture:', error);
    return null;
  }
}

/**
 * Remove profile picture from localStorage
 * @param {string} username - Username
 */
export function removeProfilePicture(username) {
  try {
    const key = buildKey(username, 'pfp');
    window.localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing profile picture:', error);
    throw new Error('failed to remove profile picture');
  }
}

