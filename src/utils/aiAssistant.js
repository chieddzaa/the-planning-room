/**
 * Selah - AI Guide Utility
 * Core logic for generating gentle, brief, wise responses
 * Creates space for pause, reflection, and intentional action
 * Never rushes, never pressures, never controls
 */

// AI Mode types
export const AI_MODES = {
  OBSERVER: 'observer',
  ADVISOR: 'advisor',
  CO_PILOT: 'co-pilot'
};

// Forbidden words/phrases
const FORBIDDEN_PHRASES = [
  'you failed',
  'you should',
  'you must',
  'productivity score',
  'maximize',
  'optimize',
  'hack',
  'no excuses',
  'discipline harder'
];

// Approved language
const APPROVED_WORDS = [
  'notice',
  'support',
  'protect your energy',
  'small step',
  'alignment',
  'capacity',
  'intentional',
  'reset',
  'tend'
];

/**
 * Generate AI insight for Daily Planning
 */
export function generateDailyInsight(dailyData) {
  const { schedule, top3Today, tasks, moodEnergy } = dailyData;
  
  // Count items
  const scheduleCount = schedule?.length || 0;
  const top3Count = top3Today?.filter(t => t?.text?.trim()).length || 0;
  const taskCount = tasks?.length || 0;
  const totalItems = scheduleCount + top3Count + taskCount;
  
  // Analyze energy/mood
  const energy = moodEnergy?.energy || 3;
  const mood = moodEnergy?.mood || 3;
  
  // Generate insights based on data
  if (totalItems === 0) {
    return {
      message: "Your day is open. What feels most important right now?",
      type: 'question',
      suggestion: null
    };
  }
  
  if (totalItems > 8) {
    return {
      message: "This looks like a full day.",
      type: 'observation',
      suggestion: {
        text: "Would you like help choosing your top three — or keep it as is?",
        actions: ['accept', 'edit', 'ignore']
      }
    };
  }
  
  if (scheduleCount > 5) {
    return {
      message: "You've stacked a lot into one block.",
      type: 'observation',
      suggestion: {
        text: "Want to protect some energy later today?",
        actions: ['accept', 'edit', 'ignore']
      }
    };
  }
  
  if (energy < 3 && totalItems > 5) {
    return {
      message: "Your energy feels lower, but you have a lot planned.",
      type: 'observation',
      suggestion: {
        text: "Want to adjust anything to match your capacity?",
        actions: ['accept', 'edit', 'ignore']
      }
    };
  }
  
  return {
    message: "Your day looks balanced.",
    type: 'observation',
    suggestion: null
  };
}

/**
 * Generate AI response for Weekly Reflection
 */
export function generateWeeklyReflection(weeklyData) {
  const { weeklyReview, priorities } = weeklyData;
  
  if (!weeklyReview?.worked && !weeklyReview?.didntWork) {
    return null; // Don't respond until user has input
  }
  
  const hasWorked = weeklyReview?.worked?.trim();
  const hasDidntWork = weeklyReview?.didntWork?.trim();
  
  if (hasWorked && !hasDidntWork) {
    return {
      message: "You showed up even when it felt heavy.",
      type: 'reflection',
      suggestion: {
        text: "What would you like next week to feel like?",
        actions: ['accept', 'edit', 'ignore']
      }
    };
  }
  
  if (hasDidntWork && hasWorked) {
    return {
      message: "You're noticing what worked and what didn't.",
      type: 'reflection',
      suggestion: {
        text: "Want to adjust anything for next week?",
        actions: ['accept', 'edit', 'ignore']
      }
    };
  }
  
  return {
    message: "Thanks for reflecting.",
    type: 'acknowledgment',
    suggestion: null
  };
}

/**
 * Generate AI insight for Monthly Alignment
 */
export function generateMonthlyInsight(monthlyData) {
  const { monthGoals, reflection } = monthlyData;
  
  const completedGoals = monthGoals?.filter(g => g.completed).length || 0;
  const totalGoals = monthGoals?.filter(g => g.text?.trim()).length || 0;
  
  if (totalGoals === 0) {
    return {
      message: "Your month is open.",
      type: 'observation',
      suggestion: null
    };
  }
  
  if (completedGoals > 0 && totalGoals > 0) {
    const completionRate = completedGoals / totalGoals;
    
    if (completionRate >= 0.6) {
      return {
        message: "You made solid progress this month.",
        type: 'acknowledgment',
        suggestion: null
      };
    }
    
    if (completionRate < 0.4 && totalGoals >= 3) {
      return {
        message: "Your time leaned toward some goals more than others.",
        type: 'observation',
        suggestion: {
          text: "Was that intentional, or do you want to rebalance?",
          actions: ['accept', 'edit', 'ignore']
        }
      };
    }
  }
  
  return {
    message: "Your month is taking shape.",
    type: 'observation',
    suggestion: null
  };
}

/**
 * Generate decision support response
 */
export function generateDecisionSupport(context, options) {
  if (!options || options.length === 0) {
    return {
      message: "What feels most important right now?",
      type: 'question',
      suggestion: null
    };
  }
  
  return {
    message: "If relief is the goal, this task helps most.",
    type: 'suggestion',
    suggestion: {
      text: "Want to start there?",
      actions: ['accept', 'edit', 'ignore']
    }
  };
}

/**
 * Sanitize response to ensure it follows guidelines
 */
export function sanitizeResponse(response) {
  // Check for forbidden phrases
  const lowerResponse = response.toLowerCase();
  for (const phrase of FORBIDDEN_PHRASES) {
    if (lowerResponse.includes(phrase)) {
      return null; // Reject response
    }
  }
  
  // Ensure response is 1-3 sentences
  const sentences = response.split(/[.!?]+/).filter(s => s.trim().length > 0);
  if (sentences.length > 3) {
    return sentences.slice(0, 3).join('. ') + '.';
  }
  
  return response;
}

