import React, { useState, useEffect, useRef } from 'react';
import { callSelahAPI, generateFallbackResponse } from '../utils/selahAPI';
import { gatherPlanningContext } from '../utils/gatherPlanningContext';
import { useUser } from '../hooks/useUser';
import RealityCheckStamp from './RealityCheckStamp';
import Microcopy from './Microcopy';

/**
 * Selah Panel - iMessage-style side chat drawer with intelligent planning
 * Opens when user clicks "Ask Selah" button
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the panel is open
 * @param {Function} props.onClose - Callback to close the panel
 * @param {string} props.theme - Current theme ('pink' or 'ai-lab')
 */
export default function SelahPanel({ isOpen, onClose, theme = 'ai-lab' }) {
  const { username } = useUser();
  
  // Determine if this is a pink theme
  const isPinkTheme = theme === 'pink' || theme === 'rose-quartz';
  
  // Theme-aware bubble colors using Reality Check tokens
  // Using CSS variables directly with opacity via color-mix for better browser support
  const getBubbleStyle = (sender) => {
    const isUser = sender === 'user';
    return {
      background: isUser 
        ? `color-mix(in srgb, var(--rc-accent) 15%, transparent)`
        : isPinkTheme 
          ? 'rgba(253, 242, 248, 0.7)' 
          : 'rgba(239, 246, 255, 0.7)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      border: `1px solid color-mix(in srgb, var(--rc-accent) ${isUser ? '25%' : '20%'}, transparent)`,
      boxShadow: `var(--rc-shadow), 0 1px 2px rgba(0, 0, 0, 0.05)`,
      borderRadius: `var(--rc-radius)`,
      color: 'var(--rc-text)'
    };
  };
  const [messages, setMessages] = useState([]);
  const [hasShownIntro, setHasShownIntro] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // First-open intro messages
  const introMessages = [
    { id: 1, text: "Hi, I'm Selah 🕊️", sender: 'selah', timestamp: new Date() },
    { id: 2, text: "Selah means pause, breathe, reflect.", sender: 'selah', timestamp: new Date() },
    { id: 3, text: "I help you plan with alignment — daily actions matching weekly, monthly, and yearly goals.", sender: 'selah', timestamp: new Date() },
    { id: 4, text: "Ask away.", sender: 'selah', timestamp: new Date() }
  ];

  // Quick action chips
  const quickActions = [
    "Help me prioritize today",
    "Align my tasks to goals",
    "Rebuild my day by energy",
    "Weekly reset check-in"
  ];

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Show intro messages on first open
  useEffect(() => {
    if (isOpen && !hasShownIntro) {
      // Show intro messages with slight delay between each
      const timeouts = [];
      introMessages.forEach((msg, index) => {
        const timeout = setTimeout(() => {
          setMessages(prev => [...prev, { ...msg, id: Date.now() + index }]);
        }, index * 600); // 600ms delay between messages
        timeouts.push(timeout);
      });
      setHasShownIntro(true);
      
      return () => {
        timeouts.forEach(timeout => clearTimeout(timeout));
      };
    }
  }, [isOpen, hasShownIntro]);

  // Prevent body scroll when panel is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Focus input when opened (after intro messages)
      setTimeout(() => inputRef.current?.focus(), 3000);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessageText = inputValue.trim();
    
    // Check if this is a prioritize/align request
    const isPrioritizeRequest = /priorit|align|rebuild|energy|order/i.test(userMessageText);
    
    // Add user message
    const userMessage = {
      id: Date.now(),
      text: userMessageText,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Gather full planning context
      const planningContext = gatherPlanningContext(username);
      
      // Call AI API with context
      const data = await callSelahAPI(userMessageText, planningContext, isPrioritizeRequest);
      
      // Handle structured response
      if (data.summary) {
        // Add summary message
        const summaryMessage = {
          id: Date.now() + 1,
          text: data.summary,
          sender: 'selah',
          timestamp: new Date(),
          structuredData: data // Store full structured data
        };
        setMessages(prev => [...prev, summaryMessage]);
        
        // If there are top priorities, add them as a structured message
        if (data.topPriorities && data.topPriorities.length > 0) {
          const prioritiesMessage = {
            id: Date.now() + 2,
            text: formatPriorities(data.topPriorities),
            sender: 'selah',
            timestamp: new Date(),
            structuredData: data
          };
          setMessages(prev => [...prev, prioritiesMessage]);
        }
        
        // Add clarifying questions if any
        if (data.clarifyingQuestions && data.clarifyingQuestions.length > 0) {
          const questionsMessage = {
            id: Date.now() + 3,
            text: `Questions: ${data.clarifyingQuestions.join(' ')}`,
            sender: 'selah',
            timestamp: new Date()
          };
          setMessages(prev => [...prev, questionsMessage]);
        }
        
        // Add user choices if any
        if (data.userChoices && data.userChoices.length > 0) {
          const choicesMessage = {
            id: Date.now() + 4,
            text: formatUserChoices(data.userChoices),
            sender: 'selah',
            timestamp: new Date(),
            structuredData: data
          };
          setMessages(prev => [...prev, choicesMessage]);
        }
      } else {
        // Fallback: simple text response
        const fallbackResponse = {
          id: Date.now() + 1,
          text: data.response || "I'm here. What feels most present for you right now?",
          sender: 'selah',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, fallbackResponse]);
      }
    } catch (error) {
      console.error('Error calling Selah API:', error);
      // Fallback to local response
      const fallbackResponse = {
        id: Date.now() + 1,
        text: generateFallbackResponse(userMessageText),
        sender: 'selah',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, fallbackResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatPriorities = (priorities) => {
    if (!priorities || priorities.length === 0) return '';
    
    let text = 'Top priorities:\n';
    priorities.forEach((p, i) => {
      text += `${i + 1}. ${p.title}`;
      if (p.why) text += ` — ${p.why}`;
      if (p.alignment) {
        const aligns = [];
        if (p.alignment.weekly) aligns.push('weekly');
        if (p.alignment.monthly) aligns.push('monthly');
        if (p.alignment.yearly) aligns.push('yearly');
        if (aligns.length > 0) text += ` (aligns: ${aligns.join(', ')})`;
      }
      text += '\n';
    });
    return text.trim();
  };

  const formatUserChoices = (choices) => {
    if (!choices || choices.length === 0) return '';
    return `Options: ${choices.join(' / ')}`;
  };

  const handleQuickAction = (action) => {
    setInputValue(action);
    // Auto-send after a brief moment
    setTimeout(() => {
      const form = inputRef.current?.form;
      if (form) {
        form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      }
    }, 100);
  };


  return (
    <>
      {/* Backdrop - Very subtle dim/blur */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/5 backdrop-blur-[2px] z-[9998] transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden="true"
      />

      {/* Chat Drawer */}
      <div
        className={`fixed inset-y-0 right-0 w-full sm:w-[400px] bg-white/95 backdrop-blur-xl shadow-2xl z-[9999] transform transition-transform duration-300 ease-out overflow-hidden flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{
          maxWidth: '420px', // Ensure max width on larger screens
          boxShadow: '-4px 0 24px rgba(0, 0, 0, 0.08)',
          borderLeft: '1px solid rgba(0, 0, 0, 0.05)'
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="selah-panel-title"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="px-4 py-3.5 flex items-center justify-between border-b relative"
          style={{
            background: 'var(--rc-glass)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderColor: 'var(--rc-muted)',
            borderBottomWidth: '1px',
            borderBottomOpacity: 0.2
          }}
        >
          <div className="flex items-center gap-3 flex-1">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0"
              style={{
                background: 'linear-gradient(135deg, var(--rc-accent), var(--rc-accent-2))',
                boxShadow: 'var(--rc-shadow)'
              }}
            >
              s
            </div>
            <div className="flex flex-col min-w-0">
              <h2 id="selah-panel-title" className="text-base font-semibold text-gray-800 leading-tight">
                Selah
              </h2>
              <p 
                className="text-[10px] font-light text-gray-500 leading-tight mt-0.5"
                style={{
                  color: 'var(--rc-muted)',
                  opacity: 0.7
                }}
              >
                by Reality Check
              </p>
            </div>
          </div>
          {/* Reality Check Stamp - subtle watermark */}
          <div className="absolute top-3 right-12" style={{ opacity: 0.1 }}>
            <RealityCheckStamp variant="compact" size="sm" />
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors p-1.5 rounded-lg hover:bg-gray-100/50 flex-shrink-0 z-10"
            style={{
              borderRadius: 'var(--rc-radius)'
            }}
            aria-label="Close panel"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 5L5 15M5 5l10 10"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3" style={{ background: 'var(--bg1)' }}>
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[75%] px-4 py-2.5 ${
                  message.sender === 'user'
                    ? 'rounded-tr-sm' // iMessage style: user messages have small top-right corner
                    : 'rounded-tl-sm' // Selah messages have small top-left corner
                }`}
                style={{
                  ...getBubbleStyle(message.sender),
                  borderRadius: message.sender === 'user'
                    ? `var(--rc-radius) var(--rc-radius) var(--rc-radius) 4px`
                    : `var(--rc-radius) var(--rc-radius) 4px var(--rc-radius)`
                }}
              >
                <p className="text-sm font-light leading-relaxed whitespace-pre-wrap">
                  {message.text}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        {messages.length > 0 && (
          <div 
            className="px-4 py-2 border-t overflow-x-auto"
            style={{
              borderColor: 'var(--rc-muted)',
              opacity: 0.3
            }}
          >
            <div className="flex gap-2">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickAction(action)}
                  className="px-3 py-1.5 text-xs font-light rounded-full hover:bg-white/80 transition-all whitespace-nowrap"
                  style={{
                    color: 'var(--rc-muted)',
                    background: 'var(--rc-glass)',
                    border: `1px solid color-mix(in srgb, var(--rc-accent) 20%, transparent)`,
                    borderRadius: 'var(--rc-radius)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    boxShadow: 'var(--rc-shadow)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--rc-accent)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'color-mix(in srgb, var(--rc-accent) 20%, transparent)';
                  }}
                >
                  {action}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div
          className="px-4 py-3 border-t"
          style={{
            background: 'var(--rc-glass)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderColor: 'var(--rc-muted)',
            opacity: 0.5
          }}
        >
          <form onSubmit={handleSend} className="flex items-end gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Pause here. Ask Selah…"
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 text-sm rounded-full focus:outline-none transition-all disabled:opacity-50"
              style={{
                background: 'var(--rc-glass)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: `1px solid color-mix(in srgb, var(--rc-accent) 20%, transparent)`,
                borderRadius: 'var(--rc-radius)',
                color: 'var(--rc-text)',
                boxShadow: 'var(--rc-shadow)'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--rc-accent)';
                e.currentTarget.style.boxShadow = 'var(--rc-shadow), 0 0 0 3px color-mix(in srgb, var(--rc-accent) 20%, transparent)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'color-mix(in srgb, var(--rc-accent) 20%, transparent)';
                e.currentTarget.style.boxShadow = 'var(--rc-shadow)';
              }}
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="w-9 h-9 rounded-full flex items-center justify-center text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: inputValue.trim() && !isLoading
                  ? 'linear-gradient(135deg, var(--accent), var(--accent2))'
                  : '#d1d5db'
              }}
              aria-label="Send message"
            >
              {isLoading ? (
                <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18 2L9 11M18 2l-7 7M18 2l-8 16-2-8-8-2 16-8z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

