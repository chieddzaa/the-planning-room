import { buildKey } from './storageKeys';

/**
 * Gather all planning context for Selah AI
 * @param {string} username - The username
 * @param {string} aiMode - Selected AI mode: 'observer' | 'advisor' | 'co-pilot' (default: 'advisor')
 * @returns {Object} Planning context object
 */
export function gatherPlanningContext(username, aiMode = 'advisor') {
  if (!username) {
    return getEmptyContext();
  }

  try {
    // Yearly Goals
    const yearlyGoalsRaw = JSON.parse(
      window.localStorage.getItem(buildKey(username, 'yearly.goals')) || '[]'
    );
    const yearlyGoals = yearlyGoalsRaw
      .filter(g => g && g.text && g.text.trim())
      .map((goal, index) => ({
        id: goal.id || index,
        title: goal.text.trim(),
        priorityRank: index + 1, // Based on order
        category: determineCategory(goal.text) // Infer from text
      }));

    // Monthly Goals
    const monthlyGoalsRaw = JSON.parse(
      window.localStorage.getItem(buildKey(username, 'monthly.goals')) || '[]'
    );
    const monthlyGoals = monthlyGoalsRaw
      .filter(g => g && g.text && g.text.trim())
      .map((goal, index) => ({
        id: goal.id || index,
        title: goal.text.trim(),
        linkedYearlyGoalId: null, // TODO: Add linking in UI
        priorityRank: index + 1
      }));

    // Weekly Goals (from priorities)
    const weeklyPrioritiesRaw = JSON.parse(
      window.localStorage.getItem(buildKey(username, 'weekly.priorities')) || '[]'
    );
    const weeklyGoals = weeklyPrioritiesRaw
      .filter(p => p && p.text && p.text.trim())
      .map((priority, index) => ({
        id: priority.id || index,
        title: priority.text.trim(),
        linkedMonthlyGoalId: null, // TODO: Add linking in UI
        priorityRank: index + 1
      }));

    // Daily Tasks
    const dailyTasksRaw = JSON.parse(
      window.localStorage.getItem(buildKey(username, 'daily.tasks')) || '[]'
    );
    const dailyTasks = dailyTasksRaw
      .filter(t => t && t.text && t.text.trim())
      .map((task, index) => ({
        id: task.id || Date.now() + index,
        title: task.text.trim(),
        linkedWeeklyGoalId: null, // TODO: Add linking in UI
        due: task.dueTime || null,
        importance: task.completed ? 'low' : 'medium', // Infer from completion
        energy: mapEnergyLevel(task) // Infer from task content or use default
      }));

    // User Energy Today (from mood/energy slider)
    const moodEnergyRaw = JSON.parse(
      window.localStorage.getItem(buildKey(username, 'daily.moodEnergy')) || '{"mood":3,"energy":3}'
    );
    const userEnergyToday = mapEnergyToLevel(moodEnergyRaw.energy || 3);

    return {
      date: new Date().toISOString().split('T')[0],
      userEnergyToday,
      yearlyGoals,
      monthlyGoals,
      weeklyGoals,
      dailyTasks,
      aiMode: aiMode || 'advisor' // Include selected AI mode
    };
  } catch (error) {
    console.error('Error gathering planning context:', error);
    return getEmptyContext();
  }
}

/**
 * Get empty context structure
 */
function getEmptyContext() {
  return {
    date: new Date().toISOString().split('T')[0],
    userEnergyToday: 'med',
    yearlyGoals: [],
    monthlyGoals: [],
    weeklyGoals: [],
    dailyTasks: [],
    aiMode: 'advisor'
  };
}

/**
 * Determine category from goal text
 */
function determineCategory(text) {
  const lower = text.toLowerCase();
  if (lower.includes('faith') || lower.includes('pray') || lower.includes('bible') || lower.includes('church')) {
    return 'faith';
  }
  if (lower.includes('health') || lower.includes('exercise') || lower.includes('workout') || lower.includes('diet')) {
    return 'health';
  }
  if (lower.includes('career') || lower.includes('work') || lower.includes('job') || lower.includes('business')) {
    return 'career';
  }
  if (lower.includes('money') || lower.includes('finance') || lower.includes('save') || lower.includes('budget')) {
    return 'money';
  }
  if (lower.includes('relationship') || lower.includes('family') || lower.includes('friend') || lower.includes('marriage')) {
    return 'relationships';
  }
  return 'other';
}

/**
 * Map energy slider value to level
 */
function mapEnergyToLevel(energyValue) {
  if (energyValue <= 2) return 'low';
  if (energyValue >= 4) return 'high';
  return 'med';
}

/**
 * Map task to energy level
 * Infers from task text or uses default 'med'
 * Tasks with words like "rest", "relax", "chill" -> low energy
 * Tasks with words like "workout", "exercise", "meeting" -> high energy
 */
function mapEnergyLevel(task) {
  if (!task || !task.text) return 'med';
  
  const lowerText = task.text.toLowerCase();
  
  // Low energy indicators
  if (/rest|relax|chill|nap|sleep|meditate|pray|read|watch/i.test(lowerText)) {
    return 'low';
  }
  
  // High energy indicators
  if (/workout|exercise|run|gym|meeting|presentation|deadline|urgent|important/i.test(lowerText)) {
    return 'high';
  }
  
  // Default to medium
  return 'med';
}

