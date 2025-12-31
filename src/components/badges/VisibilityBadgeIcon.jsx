/**
 * VisibilityBadgeIcon.jsx
 * Shows the visibility of an item as an icon only with tooltip
 */

import React from 'react';

export default function VisibilityBadgeIcon({ visibility }) {
  const visibilityConfig = {
    public: {
      icon: '🌐',
      label: 'Public',
    },
    private: {
      icon: '🔒',
      label: 'Private',
    },
    comingSoon: {
      icon: '🔜',
      label: 'Coming Soon',
    },
  };

  const config = visibilityConfig[visibility] || visibilityConfig.public;

  return (
    <span title={config.label} style={{ fontSize: '16px', cursor: 'pointer' }}>
      {config.icon}
    </span>
  );
}
