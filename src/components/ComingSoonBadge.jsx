/**
 * ComingSoonBadge.jsx
 * Component to display "Coming Soon" indicator for items with comingSoon visibility
 */

import React from 'react';

export default function ComingSoonBadge({ visibility, className = '' }) {
  if (visibility !== 'comingSoon') {
    return null;
  }

  return (
    <div className={`inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 rounded-full text-yellow-700 text-xs font-medium ${className}`}>
      <span>⏱️</span>
      <span>Coming Soon</span>
    </div>
  );
}

/**
 * Usage in components:
 * 
 * <div className="relative">
 *   <StoryCard story={story} />
 *   <ComingSoonBadge visibility={story.visibility} className="absolute top-2 right-2" />
 * </div>
 * 
 * Or for inline display:
 * <ComingSoonBadge visibility={item.visibility} />
 */
