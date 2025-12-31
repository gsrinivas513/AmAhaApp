/**
 * AdminStatusFilter.jsx
 * Filter controls for admin pages to filter by status, visibility, and featured status
 */

import React, { useState } from 'react';

export default function AdminStatusFilter({
  onStatusChange = () => {},
  onVisibilityChange = () => {},
  onFeaturedChange = () => {},
  onClearFilters = () => {},
}) {
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedVisibility, setSelectedVisibility] = useState('all');
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
    onStatusChange(status);
  };

  const handleVisibilityChange = (visibility) => {
    setSelectedVisibility(visibility);
    onVisibilityChange(visibility);
  };

  const handleFeaturedChange = (value) => {
    setShowFeaturedOnly(value);
    onFeaturedChange(value);
  };

  const handleClear = () => {
    setSelectedStatus('all');
    setSelectedVisibility('all');
    setShowFeaturedOnly(false);
    onClearFilters();
  };

  const hasActiveFilter =
    selectedStatus !== 'all' ||
    selectedVisibility !== 'all' ||
    showFeaturedOnly;

  return (
    <div className="p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg border border-slate-200 mb-6">
      <div className="flex flex-col gap-4">
        <div className="text-sm font-semibold text-slate-700 flex items-center gap-2">
          🔍 Filter Items
          {hasActiveFilter && (
            <button
              onClick={handleClear}
              className="text-xs bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
            >
              Clear All
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Status Filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2">
              Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="all">All</option>
              <option value="published">✅ Published</option>
              <option value="draft">✏️ Draft</option>
              <option value="comingSoon">⏱️ Coming Soon</option>
              <option value="archived">📦 Archived</option>
            </select>
          </div>

          {/* Visibility Filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2">
              Visibility
            </label>
            <select
              value={selectedVisibility}
              onChange={(e) => handleVisibilityChange(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="all">All</option>
              <option value="public">🌐 Public</option>
              <option value="private">🔒 Private</option>
              <option value="comingSoon">🔜 Coming Soon</option>
            </select>
          </div>

          {/* Featured Filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2">
              Featured
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => handleFeaturedChange(false)}
                className={`flex-1 px-3 py-2 text-sm rounded-lg border transition ${
                  !showFeaturedOnly
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-white text-slate-600 border-slate-300 hover:border-blue-500'
                }`}
              >
                All
              </button>
              <button
                onClick={() => handleFeaturedChange(true)}
                className={`flex-1 px-3 py-2 text-sm rounded-lg border transition ${
                  showFeaturedOnly
                    ? 'bg-purple-500 text-white border-purple-500'
                    : 'bg-white text-slate-600 border-slate-300 hover:border-purple-500'
                }`}
              >
                ⭐ Featured
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="flex items-end">
            {hasActiveFilter && (
              <div className="text-xs text-blue-600 bg-blue-50 px-3 py-2 rounded-lg w-full">
                ℹ️ Showing filtered results
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
