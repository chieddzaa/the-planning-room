/**
 * Selah AI API Integration
 * Handles communication with the Selah AI endpoint with structured planning output
 */

/**
 * Detect if message is a greeting
 * @param {string} message - User's message
 * @returns {boolean} True if greeting
 */
export function isGreeting(message) {
  const lower = message.toLowerCase().trim();
  const greetingPatterns = [
    /^(hi|hey|hello|howdy|sup|what's up|wassup|yo)\b/i,
    /^how are you/i,
    /^how's it going/i,
    /^how do you do/i,
    /^good (morning|afternoon|evening)/i,
    /^what's good/i,
    /^(hi|hey|hello)\s*$/i, // Just "hi" or "hey" alone
    /^good (morning|afternoon|evening|day)/i
  ];
  // Check if it's ONLY a greeting (not a greeting + planning request)
  const isOnlyGreeting = greetingPatterns.some(pattern => pattern.test(lower));
  // If it contains planning keywords, it's not just a greeting
  const hasPlanningKeywords = /priorit|align|plan|organize|schedule|focus|help/i.test(lower);
  return isOnlyGreeting && !hasPlanningKeywords;
}

/**
 * Detect if message is a planning request
 * @param {string} message - User's message
 * @returns {boolean} True if planning request
 */
export function isPlanningRequest(message) {
  const lower = message.toLowerCase().trim();
  const planningPatterns = [
    /priorit/i,
    /align/i,
    /plan/i,
    /organize/i,
    /schedule/i,
    /focus/i,
    /what should/i,
    /what first/i,
    /order/i,
    /rebuild/i,
    /energy/i,
    /help me/i
  ];
  return planningPatterns.some(pattern => pattern.test(lower));
}

/**
 * Call Selah AI API with planning context and conversation history
 * @param {string} message - User's message
 * @param {Object} planningContext - Full planning context (yearly, monthly, weekly, daily goals/tasks, aiMode)
 * @param {Array} conversationHistory - Last 20-40 messages for context
 * @param {string} mode - 'greeting' | 'planning' | 'auto'
 * @returns {Promise<Object>} Structured response from API
 */
export async function callSelahAPI(message, planningContext = {}, conversationHistory = [], mode = 'auto') {
  try {
    // Auto-detect mode if not specified
    let detectedMode = mode;
    if (mode === 'auto') {
      if (isGreeting(message)) {
        detectedMode = 'greeting';
      } else if (isPlanningRequest(message)) {
        detectedMode = 'planning';
      } else {
        // If not explicitly greeting or planning, check conversation context
        // If we have recent planning context, default to planning
        detectedMode = 'planning'; // Default to planning mode
      }
    }

    // Determine reasoning effort
    // High for explicit prioritize/align/rebuild requests
    // Medium for planning mode by default
    // Low for greeting mode
    const isPrioritizeRequest = isPlanningRequest(message) && /priorit|align|rebuild/i.test(message);
    const reasoningEffort = isPrioritizeRequest ? 'high' : (detectedMode === 'planning' ? 'medium' : 'low');

    // Prepare conversation history (last 20-40 messages for natural continuity)
    // History format: [{role:"user"|"assistant", content:string}]
    // Already converted in SelahPanel, but ensure format is correct
    const maxHistory = 40;
    const recentHistory = conversationHistory.slice(-maxHistory).map(msg => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content || msg.text || ''
    }));

    // Call Vercel serverless function
    const response = await fetch('/api/selah', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        history: recentHistory, // Format: [{role:"user"|"assistant", content:string}]
        context: {
          ...planningContext, // Always includes yearlyGoals, monthlyGoals, weeklyGoals, dailyTasks
          aiMode: planningContext.aiMode || 'advisor' // Include selected AI mode
        }
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    
    // New API returns simple { reply: string } format
    if (data.reply) {
      // Detect mode from message content
      const detectedMode = isGreeting(message) ? 'greeting' : 'planning';
      
      return {
        mode: detectedMode,
        summary: data.reply,
        topPriorities: [],
        alignmentLinks: [],
        suggestedOrder: [],
        swapsOrDefers: [],
        clarifyingQuestions: [],
        userChoices: []
      };
    }
    
    // Fallback for error responses
    if (data.error) {
      throw new Error(data.error);
    }
    
    // Fallback: treat as planning mode
    return {
      mode: 'planning',
      summary: data.response || data.summary || generateFallbackResponse(message),
      topPriorities: [],
      alignmentLinks: [],
      suggestedOrder: [],
      swapsOrDefers: [],
      clarifyingQuestions: [],
      userChoices: []
    };
  } catch (error) {
    console.error('Selah API error:', error);
    throw error;
  }
}

/**
 * Generate warm, Christian-bestie greeting response
 * Warm, human, 1-3 short messages max, always ends with gentle choice/question
 * Selah replies warmly, then asks what the user wants help with
 */
function generateGreetingResponse() {
  const greetings = [
    "Hey! 💕 So good to see you. What can I help you plan today?",
    "Hi there! Ready to align your day? What's on your heart?",
    "Hello friend! How can I help you prioritize what matters today?",
    "Hey! What would you like to focus on?",
    "Hi! How's your heart today? What do you need help planning?",
    "Hey there! 💕 What's on your mind? I'm here to help you align your day.",
    "Hi! Ready to pause and plan? What can I help you with?",
    "Hey friend! 💕 What would you like to work on together today?"
  ];
  return greetings[Math.floor(Math.random() * greetings.length)];
}

/**
 * Generate fallback response when API is unavailable
 * Faith-aware, alignment-focused, gentle responses
 * @param {string} userMessage - User's message
 * @returns {string} Fallback response
 */
export function generateFallbackResponse(userMessage) {
  const lowerMessage = userMessage.toLowerCase();
  
  // Priority/overwhelm responses
  if (lowerMessage.includes('priorit') || lowerMessage.includes('focus') || lowerMessage.includes('what first')) {
    return "What would make the biggest difference if you did it today?";
  }
  
  if (lowerMessage.includes('overwhelm') || lowerMessage.includes('stress') || lowerMessage.includes('too much')) {
    return "That's a lot to carry. What feels most important right now?";
  }
  
  // Alignment/goals responses
  if (lowerMessage.includes('goal') || lowerMessage.includes('align') || lowerMessage.includes('match')) {
    return "How does this connect to what you want this week or month to feel like?";
  }
  
  // Energy/capacity responses
  if (lowerMessage.includes('tired') || lowerMessage.includes('energy') || lowerMessage.includes('exhaust') || lowerMessage.includes('rebuild')) {
    return "Your energy is valid. Want to protect some space for rest?";
  }
  
  // Help/stuck responses
  if (lowerMessage.includes('help') || lowerMessage.includes('stuck') || lowerMessage.includes('confused')) {
    return "What's one small step that would bring relief?";
  }
  
  // Reset/refresh responses
  if (lowerMessage.includes('reset') || lowerMessage.includes('start over') || lowerMessage.includes('check-in')) {
    return "What would you like this week to feel like?";
  }
  
  // Default gentle, faith-aware response
  return "I'm here. What feels most present for you right now?";
}

