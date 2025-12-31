/**
 * StatusBadgeIcon.jsx
 * Shows the status of an item as an icon only with tooltip
 */

import React from 'react';

export default function StatusBadgeIcon({ status }) {
  const statusConfig = {
    published: {
      icon: '✅',
      label: 'Published',
    },
    draft: {
      icon: '✏️',
      label: 'Draft',
    },
    comingSoon: {
      icon: '⏱️',
      label: 'Coming Soon',
    },
    archived: {
      icon: '📦',
      label: 'Archived',
    },
  };

  const config = statusConfig[status] || statusConfig.draft;

  return (
    <span title={config.label} style={{ fontSize: '16px', cursor: 'pointer' }}>
      {config.icon}
    </span>
  );
}
