/**
 * Build a scoped localStorage key for a user's planning data
 * @param {string} username - The username
 * @param {string} section - The section (e.g., "yearly.theme", "monthly.goals")
 * @returns {string} - The full key: "planning-room:${username}:${section}"
 */
export function buildKey(username, section) {
  if (!username) {
    throw new Error('Username is required to build storage key');
  }
  return `planning-room:${username}:${section}`;
}


