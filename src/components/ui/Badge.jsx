import React from 'react';

/**
 * Badge Component for labels and status indicators
 * 
 * Usage:
 * <Badge>Default</Badge>
 * <Badge variant="success">Success</Badge>
 * <Badge size="lg">Large Badge</Badge>
 */
export function Badge({
  variant = 'default',
  size = 'md',
  children,
  className = '',
  ...props
}) {
  const variantStyles = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-primary-100 text-primary-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-amber-100 text-amber-800',
    error: 'bg-red-100 text-red-800',
    accent: 'bg-accent-pink/10 text-accent-pink',
  };

  const sizeStyles = {
    sm: 'px-2 py-1 text-xs font-medium rounded-md',
    md: 'px-3 py-1.5 text-sm font-medium rounded-lg',
    lg: 'px-4 py-2 text-base font-semibold rounded-lg',
  };

  return (
    <span
      className={`
        inline-flex items-center
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
      {...props}
    >
      {children}
    </span>
  );
}

export default Badge;
