import React from 'react';

/**
 * Modern glassmorphic button component
 * @param {Object} props
 * @param {React.ReactNode} props.children - Button content
 * @param {string} props.variant - Button variant: 'default' | 'primary' | 'success' | 'warning'
 * @param {string} props.size - Button size: 'sm' | 'md' | 'lg'
 * @param {string} props.themeTint - Theme tint: 'blue' | 'green' | 'orange' (for primary variant)
 * @param {Function} props.onClick - Click handler
 * @param {boolean} props.disabled - Disabled state
 * @param {string} props.className - Additional classes
 */
export default function Button({
  children,
  variant = 'default',
  size = 'md',
  themeTint = 'blue',
  onClick,
  disabled = false,
  className = '',
  ...props
}) {
  const baseClasses = 'font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const variantClasses = {
    default: 'text-gray-800 bg-white/60 backdrop-blur-md border border-gray-200/50 hover:bg-white/80 hover:border-gray-300/50 hover:shadow-md',
    primary: 'button-primary text-white',
    success: 'bg-gradient-to-r from-green-500 to-green-600 text-white border-green-400/30 hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl',
    warning: 'bg-gradient-to-r from-orange-500 to-orange-600 text-white border-orange-400/30 hover:from-orange-600 hover:to-orange-700 shadow-lg hover:shadow-xl',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className} hover:scale-105 active:scale-95`}
      style={{
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        borderRadius: 'var(--rc-radius)',
        boxShadow: variant === 'default' 
          ? 'var(--rc-shadow), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
          : undefined,
        ...(variant === 'primary' ? {
          background: `linear-gradient(180deg, var(--rc-accent), var(--rc-accent-2))`,
          borderColor: `var(--rc-accent)`,
          boxShadow: `var(--rc-shadow), inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 2px 0 rgba(0, 0, 0, 0.05)`
        } : {})
      }}
      {...props}
    >
      {children}
    </button>
  );
}
