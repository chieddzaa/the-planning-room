import React, { useState } from 'react';

/**
 * Floating "Ask Selah" Button
 * User-initiated guidance from Selah
 * 
 * @param {Object} props
 * @param {Function} props.onAsk - Callback when user clicks to ask Selah
 * @param {string} props.position - Position: 'bottom-right' (default) or 'bottom-left'
 */
export default function AskAIButton({ onAsk, position = 'bottom-right' }) {
  const [isHovered, setIsHovered] = useState(false);

  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6'
  };

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onAsk();
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`fixed ${positionClasses[position]} z-[9997] px-4 py-3 rounded-full text-sm font-medium text-white transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105`}
      style={{
        background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
        boxShadow: isHovered 
          ? '0 8px 24px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.1)'
          : '0 4px 12px rgba(0, 0, 0, 0.1)',
        pointerEvents: 'auto', // Ensure button is always clickable
      }}
      aria-label="Ask Selah"
    >
      <span className="flex items-center gap-2">
        <span>ask selah</span>
        <span className="text-xs">💭</span>
      </span>
    </button>
  );
}

