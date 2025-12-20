import React from 'react';

/**
 * Card Component for content containers
 * Supports elevated and outlined variants
 * 
 * Usage:
 * <Card variant="elevated">Card content</Card>
 */
export function Card({
  variant = 'elevated',
  children,
  className = '',
  onClick,
  hover = false,
  ...props
}) {
  const variantStyles = {
    elevated: 'bg-white shadow-md',
    outlined: 'bg-white border-2 border-gray-200',
  };

  const hoverStyle = hover ? 'hover:shadow-lg hover:-translate-y-1 cursor-pointer transition-all duration-200' : '';

  return (
    <div
      className={`
        rounded-xl p-6
        ${variantStyles[variant]}
        ${hoverStyle}
        ${className}
      `}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;
