/**
 * FeaturedBadge.jsx
 * Shows if an item is featured or not
 */

import React from 'react';

export default function FeaturedBadge({ featured, className = '' }) {
  if (!featured) {
    return null;
  }

  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800 ${className}`}
    >
      <span>⭐</span>
      <span>Featured</span>
    </span>
  );
}
