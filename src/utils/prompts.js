/**
 * Planner Prompts - Mode-aware labels and prompts
 * Adapts language based on Personal/Work mode
 */

export const prompts = {
  personal: {
    daily: {
      schedule: {
        title: 'Schedule',
        addButton: '+ Add Time Block',
        emptyState: 'No time blocks yet',
        placeholder: 'Activity...'
      },
      top3: {
        title: 'Top 3 Today',
        placeholder: (index) => `Priority ${index + 1}...`
      },
      tasks: {
        title: 'Tasks',
        placeholder: 'Task description...',
        dueTimePlaceholder: 'Due time (optional)'
      },
      notes: {
        title: 'Notes',
        placeholder: 'Daily notes, thoughts, reminders...'
      },
      moodEnergy: {
        moodLabel: 'How do I feel today?',
        energyLabel: 'Energy level'
      }
    },
    weekly: {
      focus: {
        title: 'Weekly Focus',
        placeholder: "What's your focus for this week?"
      },
      priorities: {
        title: 'Top Priorities',
        placeholder: (index) => `Priority ${index + 1}...`
      },
      plan: {
        title: 'Weekly Plan'
      },
      review: {
        title: 'Weekly Review',
        workedLabel: 'What worked',
        didntWorkLabel: "What didn't work"
      }
    },
    monthly: {
      goals: {
        title: 'Month Goals',
        placeholder: (index) => `Goal ${index + 1}...`
      },
      habits: {
        title: 'Habits'
      },
      keyDates: {
        title: 'Key Dates',
        addButton: '+ Add Date'
      },
      reflection: {
        title: 'Reflections',
        winsLabel: 'Wins',
        lessonLabel: 'Lesson learned',
        changeLabel: 'What to change'
      }
    },
    yearly: {
      theme: {
        title: 'year theme',
        question: 'what matters this year?',
        placeholder: 'growth, balance, adventure...'
      },
      scripture: {
        label: 'a word or quote to carry with you',
        placeholder: 'something that inspires you...'
      },
      goals: {
        title: 'top 10 goals',
        placeholder: 'what do you want to achieve?'
      },
      lifeAreas: {
        title: 'life areas'
      },
      milestones: {
        title: 'milestones',
        addButton: '+ add milestone'
      },
      visionNotes: {
        title: 'vision notes',
        placeholder: "let's plan gently... what do you want to achieve? how do you want to grow? what legacy do you want to build?"
      }
    }
  },
  work: {
    daily: {
      schedule: {
        title: 'Meetings & Commitments',
        addButton: '+ Add Meeting',
        emptyState: 'No meetings scheduled',
        placeholder: 'Meeting / Commitment...'
      },
      top3: {
        title: 'Key Deliverables',
        placeholder: (index) => `Deliverable ${index + 1}...`
      },
      tasks: {
        title: 'Action Items',
        placeholder: 'Action item description...',
        dueTimePlaceholder: 'Due time'
      },
      notes: {
        title: 'Performance Notes',
        placeholder: 'Notes, observations, follow-ups...'
      },
      moodEnergy: {
        moodLabel: 'Available Capacity',
        energyLabel: 'Energy Level'
      }
    },
    weekly: {
      focus: {
        title: 'Weekly Objectives',
        placeholder: "What objectives are you focused on this week?"
      },
      priorities: {
        title: 'Key Deliverables',
        placeholder: (index) => `Deliverable ${index + 1}...`
      },
      plan: {
        title: 'Weekly Plan'
      },
      review: {
        title: 'Weekly Review',
        workedLabel: 'What worked well',
        didntWorkLabel: 'What to adjust'
      }
    },
    monthly: {
      goals: {
        title: 'Month Objectives',
        placeholder: (index) => `Objective ${index + 1}...`
      },
      habits: {
        title: 'Operational Consistency'
      },
      keyDates: {
        title: 'Key Dates',
        addButton: '+ Add Date'
      },
      reflection: {
        title: 'Performance Notes',
        winsLabel: 'Achievements',
        lessonLabel: 'Key Learnings',
        changeLabel: 'Improvements Needed'
      }
    },
    yearly: {
      theme: {
        title: 'year theme',
        question: 'what matters this year?',
        placeholder: 'growth, balance, adventure...'
      },
      scripture: {
        label: 'a word or quote to carry with you',
        placeholder: 'something that inspires you...'
      },
      goals: {
        title: 'top 10 goals',
        placeholder: 'what do you want to achieve?'
      },
      lifeAreas: {
        title: 'life areas'
      },
      milestones: {
        title: 'milestones',
        addButton: '+ add milestone'
      },
      visionNotes: {
        title: 'vision notes',
        placeholder: "let's plan gently... what do you want to achieve? how do you want to grow? what legacy do you want to build?"
      }
    }
  }
};

/**
 * Get prompts for a specific mode and page
 * @param {string} mode - 'personal' | 'work'
 * @param {string} page - 'daily' | 'weekly' | 'monthly' | 'yearly'
 * @returns {Object} - Prompt object for that page
 */
export function getPrompts(mode, page) {
  const modePrompts = prompts[mode] || prompts.personal;
  return modePrompts[page] || {};
}

