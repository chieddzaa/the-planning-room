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
 * Compress and resize image for profile picture
 * @param {File} file - Image file
 * @param {number} maxWidth - Maximum width (default: 800px)
 * @param {number} maxHeight - Maximum height (default: 800px)
 * @param {number} quality - JPEG quality 0-1 (default: 0.85)
 * @returns {Promise<File>} - Compressed image file
 */
export function compressImage(file, maxWidth = 800, maxHeight = 800, quality = 0.85) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Calculate new dimensions
        let width = img.width;
        let height = img.height;
        
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }
        
        // Create canvas and compress
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now()
              });
              resolve(compressedFile);
            } else {
              reject(new Error('Failed to compress image'));
            }
          },
          'image/jpeg',
          quality
        );
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
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

  // Check file size (10MB = 10,485,760 bytes) - iPhone 15 Pro Max photos are typically 2-5MB
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    return { valid: false, error: 'image must be 10MB or smaller' };
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

