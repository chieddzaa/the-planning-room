import React from 'react';

/**
 * Windows-style badge component
 * @param {Object} props
 * @param {React.ReactNode} props.children - Badge content
 * @param {string} props.variant - Badge variant: 'blue' | 'green' | 'orange' | 'gray'
 * @param {string} props.size - Badge size: 'sm' | 'md'
 * @param {string} props.className - Additional classes
 */
export default function Badge({
  children,
  variant = 'gray',
  size = 'md',
  className = '',
  ...props
}) {
  const baseClasses = 'inline-flex items-center justify-center font-medium border';
  
  const sizeClasses = {
    sm: 'px-1.5 py-0.5 text-xs',
    md: 'px-2 py-0.5 text-xs',
  };

  const variantClasses = {
    blue: 'bg-blue-100 text-windows-blue border-blue-300',
    green: 'bg-green-100 text-windows-green border-green-300',
    orange: 'bg-orange-100 text-windows-orange border-orange-300',
    gray: 'bg-gray-100 text-gray-700 border-gray-300',
  };

  return (
    <span
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}


