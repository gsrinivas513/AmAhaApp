import React from 'react';

/**
 * Avatar Component for user profiles
 * 
 * Usage:
 * <Avatar src="url" alt="User" size="md" />
 * <Avatar name="John Doe" size="lg" />
 */
export function Avatar({
  src,
  alt = 'Avatar',
  name,
  size = 'md',
  className = '',
}) {
  const sizeStyles = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-16 h-16 text-lg',
    xl: 'w-24 h-24 text-2xl',
  };

  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : '?';

  const colors = [
    'bg-primary-500',
    'bg-accent-pink',
    'bg-accent-teal',
    'bg-accent-amber',
    'bg-accent-violet',
  ];

  const colorIndex = name ? name.charCodeAt(0) % colors.length : 0;

  return (
    <div
      className={`
        ${sizeStyles[size]}
        rounded-full flex items-center justify-center
        font-bold text-white
        ${src ? '' : colors[colorIndex]}
        ${className}
      `}
    >
      {src ? (
        <img src={src} alt={alt} className="w-full h-full rounded-full object-cover" />
      ) : (
        initials
      )}
    </div>
  );
}

export default Avatar;
