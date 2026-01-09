import React from 'react';
import RealityCheckStamp from './RealityCheckStamp';

/**
 * Modern glassmorphic widget card with playful floating animation
 * @param {Object} props
 * @param {string} props.title - Card title
 * @param {"blue" | "green" | "orange" | "gray"} props.accent - Accent color for header (legacy, now uses theme)
 * @param {React.ReactNode} props.children - Card content
 * @param {React.ReactNode} props.actions - Optional action buttons/controls for header
 * @param {string} props.className - Additional classes
 */
export default function WidgetCard({
  title,
  accent = 'gray',
  children,
  actions,
  className = '',
}) {
  // Legacy accent support for backwards compatibility, but now uses CSS variables
  const accentGradients = {
    blue: 'from-blue-400/80 to-blue-600/80',
    green: 'from-green-400/80 to-green-600/80',
    orange: 'from-orange-400/80 to-orange-600/80',
    gray: 'from-gray-400/60 to-gray-500/60',
  };

  const accentBorders = {
    blue: 'border-blue-400/30',
    green: 'border-green-400/30',
    orange: 'border-orange-400/30',
    gray: 'border-gray-400/30',
  };

  return (
    <div 
      className={`overflow-hidden widget-card-float widget-card-container group relative ${className}`}
      style={{
        animationDelay: `${Math.random() * 2}s`,
        willChange: 'transform',
        borderRadius: 'var(--rc-radius)',
        boxShadow: 'var(--rc-shadow)'
      }}
    >
      {/* Reality Check Stamp - bottom-right corner */}
      <RealityCheckStamp variant="compact" size="sm" position="bottom-right" />
      {/* Modern glass header with Reality Check tokens */}
      <div
        className="widget-card-header backdrop-blur-md border-b px-4 py-2.5 flex items-center justify-between transition-all duration-300 group-hover:shadow-lg"
        style={{ 
          borderBottomWidth: '1px',
          boxShadow: 'var(--rc-shadow), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
          background: `linear-gradient(135deg, var(--rc-accent), var(--rc-accent-2))`,
          borderColor: `var(--rc-accent)`,
          borderTopLeftRadius: 'var(--rc-radius)',
          borderTopRightRadius: 'var(--rc-radius)'
        }}
      >
        <h3 className="text-sm font-medium text-white/95 flex items-center gap-2 drop-shadow-sm transition-all duration-300 group-hover:scale-[1.02]">
          {title}
        </h3>
        {actions && (
          <div className="flex items-center gap-2 transition-all duration-300 group-hover:scale-105">
            {actions}
          </div>
        )}
      </div>
      
      {/* Glassmorphism body with Reality Check tokens */}
      <div 
        className="glass-card p-5"
        style={{
          transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
          background: 'var(--rc-glass)',
          borderBottomLeftRadius: 'var(--rc-radius)',
          borderBottomRightRadius: 'var(--rc-radius)'
        }}
      >
        {children}
      </div>
    </div>
  );
}
