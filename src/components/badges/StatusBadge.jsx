/**
 * StatusBadge.jsx
 * Shows the status of an item (published, draft, coming soon, archived)
 */

import React from 'react';

export default function StatusBadge({ status, className = '' }) {
  const statusConfig = {
    published: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      label: '✅ Published',
    },
    draft: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      label: '✏️ Draft',
    },
    comingSoon: {
      bg: 'bg-blue-100',
      text: 'text-blue-800',
      label: '⏱️ Coming Soon',
    },
    archived: {
      bg: 'bg-gray-100',
      text: 'text-gray-800',
      label: '📦 Archived',
    },
  };

  const config = statusConfig[status] || statusConfig.draft;

  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full ${config.bg} ${config.text} ${className}`}
    >
      {config.label}
    </span>
  );
}
