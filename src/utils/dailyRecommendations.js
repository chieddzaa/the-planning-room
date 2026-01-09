/**
 * Daily Planner Recommendations
 * Architecture supports switching between rules-based (default) and server AI (future)
 */

/**
 * Recommendation mode configuration
 * Set to 'rules' for rules-based tips (default)
 * Set to 'ai' for server AI tips (future)
 */
const RECOMMENDATION_MODE = 'rules'; // 'rules' | 'ai'

/**
 * Daily planner data structure
 * @typedef {Object} DailyData
 * @property {Array} tasks - List of tasks
 * @property {Array} top3Today - Top 3 priorities
 * @property {Array} schedule - Time blocks/appointments
 * @property {Object} moodEnergy - { mood: number, energy: number }
 */

/**
 * Rules-based recommendations implementation
 * Generates actionable suggestions based on task data
 * Warm, supportive tone - not preachy or bossy
 * 
 * @param {DailyData} dailyData - Daily planner data
 * @returns {Array<string>} Array of recommendation strings (2-4 items)
 */
function getRulesBasedRecommendations({ tasks = [], top3Today = [], schedule = [], moodEnergy = { mood: 3, energy: 3 } }) {
  const recommendations = [];
  
  // Filter out completed tasks
  const activeTasks = tasks.filter(t => !t.completed && t.text?.trim());
  const taskCount = activeTasks.length;
  
  // Check if top 3 priorities are filled
  const filledPriorities = top3Today.filter(p => p.text?.trim()).length;
  
  // Check for deadlines/appointments
  const tasksWithDeadlines = activeTasks.filter(t => t.dueTime?.trim()).length;
  const hasSchedule = schedule.length > 0;
  
  // Energy level (1-5 scale, 3 is medium)
  const energyLevel = moodEnergy.energy || 3;
  const isLowEnergy = energyLevel <= 2;
  const isHighEnergy = energyLevel >= 4;
  
  // Time of day (optional enhancement)
  const hour = new Date().getHours();
  const isMorning = hour >= 6 && hour < 12;
  const isAfternoon = hour >= 12 && hour < 18;
  const isEvening = hour >= 18 || hour < 6;
  
  // Recommendation 1: Top 3 priorities
  if (taskCount > 0 && filledPriorities === 0) {
    recommendations.push("Pick your top 3 for today.");
  } else if (taskCount > 0 && filledPriorities > 0 && filledPriorities < 3) {
    recommendations.push(`You've got ${filledPriorities} priority set — want to fill the rest?`);
  }
  
  // Recommendation 2: Task count management
  if (taskCount === 0) {
    recommendations.push("Start small — add one task that matters today.");
  } else if (taskCount >= 7) {
    const moveCount = Math.ceil(taskCount * 0.3); // Suggest moving ~30%
    recommendations.push(`You've got ${taskCount} tasks — want to move ${moveCount} to tomorrow?`);
  } else if (taskCount >= 5 && taskCount < 7) {
    recommendations.push(`You've got ${taskCount} tasks — consider picking your top 3 to focus on.`);
  }
  
  // Recommendation 3: Energy-aware suggestions
  if (isLowEnergy && taskCount > 3) {
    recommendations.push("Your energy feels lower today — want to lighten the load?");
  } else if (isLowEnergy && taskCount > 0) {
    recommendations.push("Add one low-energy quick win to build momentum.");
  } else if (isHighEnergy && taskCount > 0 && filledPriorities < 3) {
    recommendations.push("You've got good energy — perfect time to tackle your top priorities.");
  }
  
  // Recommendation 4: Deadlines and time management
  if (tasksWithDeadlines > 0 && !hasSchedule) {
    recommendations.push(`You've got ${tasksWithDeadlines} task${tasksWithDeadlines > 1 ? 's' : ''} with deadlines — want to block time for them?`);
  } else if (hasSchedule && taskCount > schedule.length) {
    recommendations.push("You've got time blocks set — consider scheduling your remaining tasks.");
  }
  
  // Recommendation 5: Time-of-day specific
  if (isMorning && taskCount > 0 && filledPriorities === 0) {
    recommendations.push("Good morning! Start by choosing your top 3 for today.");
  } else if (isAfternoon && taskCount > 3) {
    recommendations.push("Afternoon check-in: how are your priorities feeling?");
  } else if (isEvening && taskCount > 0) {
    const completedCount = tasks.filter(t => t.completed).length;
    if (completedCount === 0) {
      recommendations.push("Evening reflection: what's one thing you want to finish today?");
    }
  }
  
  // Recommendation 6: Balance and momentum
  if (taskCount > 0 && taskCount <= 3 && filledPriorities === taskCount) {
    recommendations.push("Nice focus! You've got a clear plan for today.");
  } else if (taskCount === 1 && !activeTasks[0]?.dueTime) {
    recommendations.push("One task — perfect for a focused day.");
  }
  
  // Return 2-4 recommendations (prioritize most relevant)
  // Remove duplicates and limit to 4
  const unique = [...new Set(recommendations)];
  return unique.slice(0, 4);
}

/**
 * Server AI recommendations implementation (future)
 * Calls server-side AI endpoint for intelligent recommendations
 * 
 * @param {DailyData} dailyData - Daily planner data
 * @returns {Promise<Array<string>>} Array of recommendation strings from AI
 */
async function getServerAIRecommendations({ tasks = [], top3Today = [], schedule = [], moodEnergy = { mood: 3, energy: 3 } }) {
  try {
    // TODO: Implement server AI recommendations
    // Example implementation:
    // const response = await fetch('/api/daily-recommendations', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ tasks, top3Today, schedule, moodEnergy })
    // });
    // const data = await response.json();
    // return data.recommendations || [];
    
    // For now, fallback to rules-based
    console.log('[Recommendations] Server AI not yet implemented, falling back to rules-based');
    return getRulesBasedRecommendations({ tasks, top3Today, schedule, moodEnergy });
  } catch (error) {
    console.error('[Recommendations] Server AI error, falling back to rules-based:', error);
    // Fallback to rules-based on error
    return getRulesBasedRecommendations({ tasks, top3Today, schedule, moodEnergy });
  }
}

/**
 * Main recommendations interface
 * Switches between rules-based and server AI based on configuration
 * 
 * @param {DailyData} dailyData - Daily planner data
 * @returns {Promise<Array<string>>} Array of recommendation strings (2-4 items)
 */
export async function getRecommendations(dailyData) {
  if (RECOMMENDATION_MODE === 'ai') {
    return getServerAIRecommendations(dailyData);
  }
  
  // Default to rules-based (wrap in Promise for consistent async interface)
  return Promise.resolve(getRulesBasedRecommendations(dailyData));
}

/**
 * Synchronous version for immediate use (rules-based only)
 * Use this when you need synchronous recommendations
 * 
 * @param {DailyData} dailyData - Daily planner data
 * @returns {Array<string>} Array of recommendation strings
 */
export function getRecommendationsSync(dailyData) {
  // Only rules-based can be synchronous
  // For AI mode, use async getRecommendations()
  if (RECOMMENDATION_MODE === 'ai') {
    console.warn('[Recommendations] AI mode requires async getRecommendations(), falling back to rules-based');
  }
  
  // Convert async to sync for rules-based (it's already synchronous internally)
  return getRulesBasedRecommendations(dailyData);
}

// Export implementations for testing/debugging
export { getRulesBasedRecommendations, getServerAIRecommendations, RECOMMENDATION_MODE };
