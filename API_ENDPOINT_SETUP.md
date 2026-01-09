# Selah AI API Endpoint Setup

## Overview
The Selah chat interface calls `/api/selah` for intelligent, aligned planning responses. This document outlines the expected API structure with structured JSON output.

## Endpoint: POST /api/selah

### Request Body
```json
{
  "message": "string - user's message",
  "context": {
    "date": "YYYY-MM-DD",
    "userEnergyToday": "low|med|high",
    "yearlyGoals": [
      {
        "id": "number or string",
        "title": "string",
        "priorityRank": "number (1-based)",
        "category": "faith|health|career|money|relationships|other"
      }
    ],
    "monthlyGoals": [
      {
        "id": "number or string",
        "title": "string",
        "linkedYearlyGoalId": "number or string or null",
        "priorityRank": "number (1-based)"
      }
    ],
    "weeklyGoals": [
      {
        "id": "number or string",
        "title": "string",
        "linkedMonthlyGoalId": "number or string or null",
        "priorityRank": "number (1-based)"
      }
    ],
    "dailyTasks": [
      {
        "id": "number or string",
        "title": "string",
        "linkedWeeklyGoalId": "number or string or null",
        "due": "HH:MM or null",
        "importance": "low|med|high",
        "energy": "low|med|high"
      }
    ]
  },
  "reasoningEffort": "medium|high",
  "requireStructuredOutput": true
}
```

### Response (Structured JSON Schema)
```json
{
  "summary": "string - 1-2 sentences in Selah's voice",
  "topPriorities": [
    {
      "taskId": "string or number",
      "title": "string",
      "why": "string - brief reason",
      "energy": "low|med|high",
      "alignment": {
        "weekly": "string or null",
        "monthly": "string or null",
        "yearly": "string or null"
      }
    }
  ],
  "suggestedOrder": ["taskId1", "taskId2", "taskId3"],
  "swapsOrDefers": [
    {
      "taskId": "string or number",
      "reason": "string"
    }
  ],
  "clarifyingQuestions": ["string", "string"],
  "userChoices": ["Option 1", "Option 2", "Option 3"]
}
```

## Implementation Notes

### Model & Reasoning
- **Model**: Use GPT-5 / GPT-5.2 or equivalent reasoning-capable model
- **Reasoning Effort**: 
  - `medium` by default
  - `high` when user asks to prioritize/align/rebuild
- **Structured Output**: Always require JSON schema output (never free text)

### Tone & Style
- **Calm**: No rushing, no pressure
- **Faith-aware**: Can reference scripture gently, never preachy
- **Alignment-focused**: Help connect daily actions to weekly/monthly/yearly goals
- **Brief**: 1-2 sentences for summary
- **Human**: Christian-bestie energy, not corporate
- **Never**: "you must/should", never shame
- **Always**: Give optional choices, ask clarifying questions if data is missing

### Response Guidelines
- Use approved language: "notice", "support", "protect your energy", "small step", "alignment", "capacity", "intentional", "reset", "tend"
- Avoid forbidden phrases: "you failed", "you should", "you must", "productivity score", "maximize", "optimize", "hack", "no excuses", "discipline harder"
- Questions over commands
- Gentle, invitational phrasing
- If task is missing goal link, ask short clarifying question instead of guessing

### Example Structured Responses

**User**: "Help me prioritize today"
**Selah Response**:
```json
{
  "summary": "Looking at your goals, these three tasks will move you forward most today.",
  "topPriorities": [
    {
      "taskId": "123",
      "title": "Review monthly goals",
      "why": "Connects to your yearly career goal",
      "energy": "med",
      "alignment": {
        "weekly": "Weekly focus: career growth",
        "monthly": "Monthly goal: professional development",
        "yearly": "Yearly goal: advance in career"
      }
    }
  ],
  "suggestedOrder": ["123", "456", "789"],
  "swapsOrDefers": [
    {
      "taskId": "999",
      "reason": "Low energy task, better for afternoon"
    }
  ],
  "clarifyingQuestions": [],
  "userChoices": ["Keep this order", "Lighten the day", "Time-block it"]
}
```

**User**: "Align my tasks to goals"
**Selah Response**:
```json
{
  "summary": "I notice some tasks aren't linked to goals yet.",
  "topPriorities": [],
  "suggestedOrder": [],
  "swapsOrDefers": [],
  "clarifyingQuestions": [
    "Which weekly goal does 'Review budget' connect to?",
    "Is 'Call mom' part of your relationships focus this month?"
  ],
  "userChoices": ["Link them now", "Skip for now", "Help me think through it"]
}
```

## Fallback
If the API is unavailable, the frontend uses `generateFallbackResponse()` from `src/utils/selahAPI.js` which provides gentle, context-aware responses.

## Next Steps
1. Set up your backend server (Node.js, Python, etc.)
2. Implement the `/api/selah` endpoint
3. Connect to your AI provider (OpenAI, Anthropic, etc.)
4. Configure the AI prompt to match Selah's tone and guidelines
5. Test with the frontend

