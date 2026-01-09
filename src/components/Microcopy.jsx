import React from 'react';

/**
 * Reality Check Microcopy - Subtle branded messages
 * @param {Object} props
 * @param {string} props.message - The microcopy message to display
 * @param {string} props.className - Additional classes
 */
export default function Microcopy({ message, className = '' }) {
  return (
    <p 
      className={`text-xs font-light italic ${className}`}
      style={{
        color: 'var(--rc-muted)',
        opacity: 0.6
      }}
    >
      {message}
    </p>
  );
}

