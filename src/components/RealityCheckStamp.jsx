import React from 'react';

/**
 * Reality Check Stamp - A subtle watermark mark
 * @param {Object} props
 * @param {string} props.variant - 'full' | 'compact' - Shows "Reality Check" or "RC"
 * @param {string} props.size - 'sm' | 'md' | 'lg' - Size of the stamp
 * @param {string} props.position - 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' - Position for absolute positioning
 * @param {string} props.className - Additional classes
 */
export default function RealityCheckStamp({ 
  variant = 'compact', 
  size = 'sm',
  position,
  className = '' 
}) {
  const sizeClasses = {
    sm: {
      container: 'w-12 h-12',
      text: 'text-[6px]',
      stroke: '1'
    },
    md: {
      container: 'w-16 h-16',
      text: 'text-[8px]',
      stroke: '1.5'
    },
    lg: {
      container: 'w-20 h-20',
      text: 'text-[10px]',
      stroke: '2'
    }
  };

  const positionClasses = {
    'top-left': 'top-2 left-2',
    'top-right': 'top-2 right-2',
    'bottom-left': 'bottom-2 left-2',
    'bottom-right': 'bottom-2 right-2'
  };

  const currentSize = sizeClasses[size];
  const positionClass = position ? positionClasses[position] : '';

  return (
    <div 
      className={`reality-check-stamp ${currentSize.container} ${positionClass} ${className}`}
      style={{
        opacity: 0.12,
        pointerEvents: 'none',
        position: position ? 'absolute' : 'relative',
        zIndex: 0
      }}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        style={{
          filter: 'drop-shadow(0 1px 1px rgba(0, 0, 0, 0.05))'
        }}
      >
        {/* Outer circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="var(--rc-accent)"
          strokeWidth={currentSize.stroke}
          style={{
            opacity: 0.35
          }}
        />
        
        {/* Inner decorative circle */}
        <circle
          cx="50"
          cy="50"
          r="38"
          fill="none"
          stroke="var(--rc-accent)"
          strokeWidth={currentSize.stroke * 0.6}
          style={{
            opacity: 0.2
          }}
        />
        
        {/* Text */}
        {variant === 'full' ? (
          <text
            x="50"
            y="50"
            textAnchor="middle"
            dominantBaseline="middle"
            className={currentSize.text}
            fill="var(--rc-accent)"
            style={{
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fontWeight: 600,
              letterSpacing: '0.05em',
              opacity: 0.4
            }}
          >
            <tspan x="50" dy="-4">REALITY</tspan>
            <tspan x="50" dy="6">CHECK</tspan>
          </text>
        ) : (
          <text
            x="50"
            y="50"
            textAnchor="middle"
            dominantBaseline="middle"
            className={currentSize.text}
            fill="var(--rc-accent)"
            style={{
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fontWeight: 700,
              letterSpacing: '0.1em',
              opacity: 0.4
            }}
          >
            RC
          </text>
        )}
      </svg>
    </div>
  );
}

