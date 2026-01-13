import React, { useState } from 'react';
import SearchFilterBar from '../components/SearchFilterBar';
import StatusBadge from '../../components/badges/StatusBadge';
import VisibilityBadge from '../../components/badges/VisibilityBadge';
import FeaturedBadge from '../../components/badges/FeaturedBadge';
import PaginationControls from '../components/PaginationControls';

const ITEMS_PER_PAGE = 10;

export default function StoriesTab({
  theme,
  stories,
  filteredStories,
  setFilteredStories,
  showAddStoryForm,
  setShowAddStoryForm,
  storyFormData,
  setStoryFormData,
  STORY_CATEGORIES,
  AUDIENCES,
  statusFilter,
  setStatusFilter,
  visibilityFilter,
  setVisibilityFilter,
  featuredFilter,
  setFeaturedFilter,
  setEditingStory,
  setViewingStory,
  handleDeleteStory,
  handleAddStory,
  setShowCreateTemplateModal,
}) {
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate pagination
  const totalPages = Math.ceil(filteredStories.length / ITEMS_PER_PAGE);
  const paginatedStories = filteredStories.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset to first page when filters change
  const handleFilterChange = (filtered) => {
    setCurrentPage(1);
    setFilteredStories(filtered);
  };

  return (
    <div>
      {/* Header & Action Buttons */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ color: theme.textPrimary, fontSize: '24px', fontWeight: '700', margin: '0 0 8px 0' }}>
            📖 Manage Stories
          </h2>
          <p style={{ color: theme.textSecondary, margin: '0', fontSize: '14px' }}>
            Create and manage stories with chapter management
          </p>
        </div>

        {/* Organized Action Buttons - Grid Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
          <button
            onClick={() => setShowAddStoryForm(!showAddStoryForm)}
            style={{
              padding: '12px 20px',
              background: `linear-gradient(135deg, #f093fb, #f5576c)`,
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            ➕ Add New Story
          </button>
        </div>
      </div>

      {showAddStoryForm && (
        <div style={{
          marginBottom: '30px',
          background: theme.surfacePrimary,
          border: `2px solid ${theme.border}`,
          borderRadius: '16px',
          padding: '24px',
        }}>
          <h3 style={{
            color: theme.textPrimary,
            fontSize: '18px',
            fontWeight: '700',
            marginBottom: '20px',
          }}>
            Create New Story
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '12px',
            marginBottom: '24px',
          }}>
            <input
              type="text"
              placeholder="Story Title"
              value={storyFormData.title}
              onChange={(e) => setStoryFormData({ ...storyFormData, title: e.target.value })}
              style={{
                padding: '10px 12px',
                background: theme.background,
                border: `2px solid ${theme.border}`,
                borderRadius: '6px',
                color: theme.textPrimary,
                fontSize: '13px',
                fontFamily: 'inherit',
              }}
            />
            <select
              value={storyFormData.category}
              onChange={(e) => setStoryFormData({ ...storyFormData, category: e.target.value })}
              style={{
                padding: '10px 12px',
                background: theme.background,
                border: `2px solid ${theme.border}`,
                borderRadius: '6px',
                color: theme.textPrimary,
                fontSize: '13px',
                fontFamily: 'inherit',
              }}
            >
              <option value="">Category</option>
              {STORY_CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <select
              value={storyFormData.audience}
              onChange={(e) => setStoryFormData({ ...storyFormData, audience: e.target.value })}
              style={{
                padding: '10px 12px',
                background: theme.background,
                border: `2px solid ${theme.border}`,
                borderRadius: '6px',
                color: theme.textPrimary,
                fontSize: '13px',
                fontFamily: 'inherit',
              }}
            >
              <option value="">Audience</option>
              {AUDIENCES.map(aud => (
                <option key={aud} value={aud}>{aud}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handleAddStory}
              style={{
                padding: '10px 20px',
                background: `linear-gradient(135deg, #f093fb, #f5576c)`,
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              Save
            </button>
            <button
              onClick={() => {
                setShowAddStoryForm(false);
                setStoryFormData({ title: '', category: '', audience: '', chapters: '', selectedTemplate: '' });
              }}
              style={{
                padding: '10px 20px',
                background: 'transparent',
                color: theme.textPrimary,
                border: `2px solid ${theme.border}`,
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div style={{ background: theme.surfacePrimary, border: `2px solid ${theme.border}`, borderRadius: '12px', padding: '0', overflow: 'hidden' }}>
        {/* Unified Filters Section - All search & filter controls in ONE place */}
        <div style={{ padding: '20px', borderBottom: `2px solid ${theme.border}` }}>
          {/* Search Bar with ALL filters integrated */}
          <SearchFilterBar 
            items={stories} 
            onFilter={handleFilterChange}
            searchPlaceholder="Search stories by title..."
            categories={STORY_CATEGORIES}
            difficulties={[]}
            showCategory={true}
            showDifficulty={false}
            showStatus={true}
            visibilityFilter={visibilityFilter}
            onVisibilityChange={setVisibilityFilter}
            featuredFilter={featuredFilter}
            onFeaturedChange={setFeaturedFilter}
            onClearFilters={() => {
              setStatusFilter('all');
              setVisibilityFilter('all');
              setFeaturedFilter(false);
            }}
          />
        </div>

        {/* Stories Table & Pagination - All in one container */}
        {filteredStories.length > 0 ? (
          <div>
            {/* Table Header */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1.5fr', gap: '16px', padding: '14px 20px', background: `${theme.accentPrimary}15`, borderBottom: `2px solid ${theme.border}`, fontWeight: '700', color: theme.accentPrimary, fontSize: '13px', position: 'sticky', top: 0 }}>
              <div>Title</div>
              <div style={{ textAlign: 'center' }}>Chapters</div>
              <div style={{ textAlign: 'center' }}>Category</div>
              <div style={{ textAlign: 'center' }}>Audience</div>
              <div style={{ textAlign: 'center' }}>Status</div>
              <div style={{ textAlign: 'right' }}>Actions</div>
            </div>

            {/* Table Rows */}
            {paginatedStories.map((story, idx) => (
              <div key={story.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1.5fr', gap: '16px', padding: '12px 20px', borderBottom: `1px solid ${theme.border}`, alignItems: 'center' }}>
                {/* Title */}
                <div>
                  <h3 style={{ color: theme.textPrimary, fontSize: '14px', fontWeight: '600', margin: '0 0 2px 0' }}>📖 {story.title}</h3>
                  <p style={{ color: theme.textSecondary, fontSize: '12px', margin: '0' }}>ID: {story.id}</p>
                </div>

                {/* Chapters */}
                <div style={{ textAlign: 'center', color: theme.textPrimary, fontSize: '13px', fontWeight: '600' }}>
                  📚 {Array.isArray(story.chapters) ? story.chapters.length : typeof story.chapters === 'number' ? story.chapters : 0}
                </div>

                {/* Category */}
                <div style={{ textAlign: 'center', color: theme.textSecondary, fontSize: '13px' }}>
                  {story.category || '-'}
                </div>

                {/* Audience */}
                <div style={{ textAlign: 'center', color: theme.textSecondary, fontSize: '13px' }}>
                  👥 {story.audience}
                </div>

                {/* Status & Visibility */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center' }}>
                  {story.status && <StatusBadge status={story.status} />}
                  {story.visibility && <VisibilityBadge visibility={story.visibility} />}
                  {story.featured && <FeaturedBadge featured={story.featured} />}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                  <button onClick={() => setEditingStory(story)} style={{ padding: '6px 10px', background: `${theme.accentPrimary}25`, color: theme.accentPrimary, border: `1px solid ${theme.accentPrimary}`, borderRadius: '4px', fontSize: '11px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap' }} title="Edit story">✏️</button>
                  <button onClick={() => setViewingStory(story)} style={{ padding: '6px 10px', background: '#667eea25', color: '#667eea', border: '1px solid #667eea', borderRadius: '4px', fontSize: '11px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap' }} title="View story">👁️</button>
                  <button onClick={() => handleDeleteStory(story.id)} style={{ padding: '6px 10px', background: '#FF6B6B25', color: '#FF6B6B', border: '1px solid #FF6B6B', borderRadius: '4px', fontSize: '11px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap' }} title="Delete story">🗑️</button>
                </div>
              </div>
            ))}

            {/* Pagination - Integrated at bottom */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', padding: '16px 20px', background: `${theme.accentPrimary}08`, borderTop: `2px solid ${theme.border}`, flexWrap: 'wrap' }}>
                <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} style={{ padding: '8px 12px', background: currentPage === 1 ? theme.border : theme.accentPrimary, color: '#fff', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', opacity: currentPage === 1 ? 0.5 : 1 }}>
                  ⬅️ First
                </button>
                <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} style={{ padding: '8px 12px', background: currentPage === 1 ? theme.border : theme.accentPrimary, color: '#fff', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', opacity: currentPage === 1 ? 0.5 : 1 }}>
                  ← Prev
                </button>

                <span style={{ color: theme.textSecondary, fontSize: '13px', fontWeight: '600' }}>
                  Page <span style={{ color: theme.accentPrimary, fontWeight: '700' }}>{currentPage}</span> / <span style={{ color: theme.accentPrimary, fontWeight: '700' }}>{totalPages}</span>
                </span>

                <button onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} style={{ padding: '8px 12px', background: currentPage === totalPages ? theme.border : theme.accentPrimary, color: '#fff', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', opacity: currentPage === totalPages ? 0.5 : 1 }}>
                  Next →
                </button>
                <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} style={{ padding: '8px 12px', background: currentPage === totalPages ? theme.border : theme.accentPrimary, color: '#fff', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', opacity: currentPage === totalPages ? 0.5 : 1 }}>
                  Last ➡️
                </button>

                <span style={{ color: theme.textSecondary, fontSize: '12px', marginLeft: '12px' }}>
                  ({(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filteredStories.length)} of {filteredStories.length})
                </span>
              </div>
            )}
          </div>
        ) : (
          <div style={{ padding: '40px', textAlign: 'center', color: theme.textSecondary }}>
            <p>{stories.length > 0 ? 'No stories match your filters. Try adjusting your search or filters.' : 'No stories created yet. Click "➕ Add New Story" to get started!'}</p>
          </div>
        )}
      </div>
    </div>
  );
}
