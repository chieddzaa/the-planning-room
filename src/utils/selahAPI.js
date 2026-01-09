/**
 * Selah AI API Integration
 * Handles communication with the Selah AI endpoint with structured planning output
 */

/**
 * Call Selah AI API with planning context
 * @param {string} message - User's message
 * @param {Object} planningContext - Full planning context (yearly, monthly, weekly, daily goals/tasks)
 * @param {boolean} isPrioritizeRequest - Whether this is a prioritize/align request (uses high reasoning)
 * @returns {Promise<Object>} Structured response from API
 */
export async function callSelahAPI(message, planningContext = {}, isPrioritizeRequest = false) {
  try {
    const response = await fetch('/api/selah', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        context: planningContext,
        reasoningEffort: isPrioritizeRequest ? 'high' : 'medium',
        requireStructuredOutput: true
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Validate structured output
    if (data.summary && data.topPriorities) {
      return data;
    } else {
      // Fallback: wrap response in structured format
      return {
        summary: data.response || data.summary || generateFallbackResponse(message),
        topPriorities: [],
        suggestedOrder: [],
        swapsOrDefers: [],
        clarifyingQuestions: [],
        userChoices: []
      };
    }
  } catch (error) {
    console.error('Selah API error:', error);
    throw error;
  }
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

