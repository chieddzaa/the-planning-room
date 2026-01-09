/**
 * Selah AI API - Vercel Serverless Function
 * Server-side AI endpoint for intelligent planning conversations
 */

const OpenAI = require('openai').default || require('openai');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Detect if message is a greeting
 */
function isGreeting(message) {
  const lower = message.toLowerCase().trim();
  const greetingPatterns = [
    /^(hi|hey|hello|howdy|sup|what's up|wassup|yo)\b/i,
    /^how are you/i,
    /^how's it going/i,
    /^how do you do/i,
    /^good (morning|afternoon|evening)/i,
    /^what's good/i,
    /^(hi|hey|hello)\s*$/i,
  ];
  const isOnlyGreeting = greetingPatterns.some(pattern => pattern.test(lower));
  const hasPlanningKeywords = /priorit|align|plan|organize|schedule|focus|help/i.test(lower);
  return isOnlyGreeting && !hasPlanningKeywords;
}

/**
 * Build planning context summary for system prompt
 */
function buildContextSummary(context = {}) {
  const parts = [];
  
  if (context.userEnergyToday) {
    parts.push(`User energy today: ${context.userEnergyToday}`);
  }
  
  if (context.yearlyGoals && context.yearlyGoals.length > 0) {
    const goals = context.yearlyGoals.map(g => g.title || g.text || g).join(', ');
    parts.push(`Yearly goals: ${goals}`);
  }
  
  if (context.monthlyGoals && context.monthlyGoals.length > 0) {
    const goals = context.monthlyGoals.map(g => g.title || g.text || g).join(', ');
    parts.push(`Monthly goals: ${goals}`);
  }
  
  if (context.weeklyGoals && context.weeklyGoals.length > 0) {
    const goals = context.weeklyGoals.map(g => g.title || g.text || g).join(', ');
    parts.push(`Weekly goals: ${goals}`);
  }
  
  if (context.dailyTasks && context.dailyTasks.length > 0) {
    const tasks = context.dailyTasks.map(t => {
      const title = t.title || t.text || t;
      const energy = t.energy ? ` (${t.energy} energy)` : '';
      return `${title}${energy}`;
    }).join(', ');
    parts.push(`Daily tasks: ${tasks}`);
  }
  
  return parts.length > 0 ? parts.join('\n') : 'No specific goals or tasks set yet.';
}

/**
 * Build system prompt for Selah
 */
function buildSystemPrompt(context) {
  const contextSummary = buildContextSummary(context);
  
  return `You are Selah, a warm, human AI planning assistant with Christian-bestie energy.

Your identity:
- Name: Selah
- Tone: warm, human, Christian-bestie energy (never preachy)
- Replies are short (1-3 messages max)
- Never use "you must" or "you should"
- Never shame or pressure
- Always offer gentle choices

Behavior rules:
- If the user greets you, respond conversationally like ChatGPT, then ask how you can help
- Otherwise, help with aligned productivity: daily → weekly → monthly → yearly goals
- Be energy-aware when prioritizing tasks

User's planning context:
${contextSummary}

Respond naturally and helpfully. Keep it warm, brief, and aligned.`;
}

/**
 * Vercel serverless function handler
 */
module.exports = async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const { message, history = [], context = {} } = req.body;

    // Validate request
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required and must be a string' });
    }

    // Check for API key
    if (!process.env.OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY is not set');
      return res.status(500).json({ error: 'AI service is not configured' });
    }

    // Detect if greeting
    const isGreetingMode = isGreeting(message);

    // Build system prompt
    const systemPrompt = buildSystemPrompt(context);

    // Build conversation messages
    const messages = [
      { role: 'system', content: systemPrompt },
      ...history.slice(-30), // Last 30 messages for context
      { role: 'user', content: message }
    ];

    // Call OpenAI with reasoning-capable model
    // Using gpt-4o for strong reasoning capabilities
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o', // Strong reasoning-capable model
      messages: messages,
      temperature: 0.7,
      max_tokens: 500, // Keep responses concise (1-3 messages)
    });

    const aiResponse = completion.choices[0]?.message?.content;
    
    if (!aiResponse) {
      throw new Error('No response from AI');
    }

    // Return simple reply format
    return res.status(200).json({
      reply: aiResponse.trim()
    });

  } catch (error) {
    console.error('Selah API error:', error);
    
    // Return 500 with generic error (no secrets exposed)
    return res.status(500).json({ 
      error: 'An error occurred processing your request' 
    });
  }
};
