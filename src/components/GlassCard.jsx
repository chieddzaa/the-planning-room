import React from 'react';
import RealityCheckStamp from './RealityCheckStamp';

export default function GlassCard({ title, children, className = '', accent = 'blue' }) {
  const accentColors = {
    blue: 'border-l-windows-blue',
    green: 'border-l-windows-green',
    orange: 'border-l-windows-orange',
  };

  return (
    <div 
      className={`glass-card window-border p-4 ${accentColors[accent]} border-l-4 relative ${className}`}
      style={{
        borderRadius: 'var(--rc-radius)',
        background: 'var(--rc-glass)',
        boxShadow: 'var(--rc-shadow)',
        color: 'var(--rc-text)'
      }}
    >
      {/* Reality Check Stamp - bottom-right corner */}
      <RealityCheckStamp variant="compact" size="sm" position="bottom-right" />
      {title && (
        <h3 
          className="text-lg font-semibold mb-3 pb-2 border-b"
          style={{
            color: 'var(--rc-text)',
            borderColor: 'var(--rc-muted)'
          }}
        >
          {title}
        </h3>
      )}
      <div style={{ color: 'var(--rc-muted)' }}>
        {children}
      </div>
    </div>
  );
}


