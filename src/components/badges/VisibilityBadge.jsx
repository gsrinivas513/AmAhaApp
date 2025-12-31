/**
 * VisibilityBadge.jsx
 * Shows the visibility of an item (public, private, coming soon)
 */

import React from 'react';

export default function VisibilityBadge({ visibility, className = '' }) {
  const visibilityConfig = {
    public: {
      bg: 'bg-cyan-100',
      text: 'text-cyan-800',
      icon: '🌐',
      label: 'Public',
    },
    private: {
      bg: 'bg-red-100',
      text: 'text-red-800',
      icon: '🔒',
      label: 'Private',
    },
    comingSoon: {
      bg: 'bg-orange-100',
      text: 'text-orange-800',
      icon: '🔜',
      label: 'Coming Soon',
    },
  };

  const config = visibilityConfig[visibility] || visibilityConfig.public;

  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full ${config.bg} ${config.text} ${className}`}
    >
      <span>{config.icon}</span>
      <span>{config.label}</span>
    </span>
  );
}
