import React, { useState } from 'react';
import SearchFilterBar from '../components/SearchFilterBar';
import { TableColumnHeader, generateFilterOptions } from '../components/TableColumnHeader';
import { sortData } from '../utils/tableUtils';
import StatusBadge from '../../components/badges/StatusBadge';
import VisibilityBadge from '../../components/badges/VisibilityBadge';
import FeaturedBadge from '../../components/badges/FeaturedBadge';
import PaginationControls from '../components/PaginationControls';
import AdminPuzzleBuilder from '../AdminPuzzleBuilder';

// Import other components and utilities from parent as needed
export default function PuzzlesTab({
  theme,
  puzzles,
  filteredPuzzles,
  setFilteredPuzzles,
  showAddPuzzleForm,
  setShowAddPuzzleForm,
  AUDIENCES,
  DIFFICULTIES,
  PUZZLE_TYPES,
  setEditingPuzzle,
  setViewingPuzzle,
  handleDeletePuzzle,
  handleAddPuzzle,
  puzzleFormData,
  setPuzzleFormData,
  statusFilter,
  setStatusFilter,
  visibilityFilter,
  setVisibilityFilter,
  featuredFilter,
  setFeaturedFilter,
  // Quick Create state
  quickCreateType,
  setQuickCreateType,
  quickCreateData,
  setQuickCreateData,
  showQuickDetails,
  setShowQuickDetails,
  selectedQuickTemplateId,
  setSelectedQuickTemplateId,
  quickTemplates,
  quickTemplatesLoading,
  showQuickPreview,
  setShowQuickPreview,
  sanitizeTemplateForEditor,
  AdminTemplatePreviewModal,
  resetQuickCreate,
  qcTitle,
  setQcTitle,
  qcDifficulty,
  setQcDifficulty,
  qcAgeGroup,
  setQcAgeGroup,
  qcDescription,
  setQcDescription,
  qcCategoryId,
  setQcCategoryId,
  qcCategoryName,
  setQcCategoryName,
  qcTopicId,
  setQcTopicId,
  qcTopicName,
  setQcTopicName,
  qcSubtopicId,
  setQcSubtopicId,
  qcSubtopicName,
  setQcSubtopicName,
  qcIsPublished,
  setQcIsPublished,
  qcXpReward,
  setQcXpReward,
  categoriesList,
  topicsList,
  subtopicsList,
  cnVisualType,
  setCnVisualType,
  cnSelectedTemplateId,
  setCnSelectedTemplateId,
  cnShowInputForm,
  setCnShowInputForm,
  cnTemplateInputs,
  setCnTemplateInputs,
  cnExecutionResult,
  setCnExecutionResult,
  cnExecutionError,
  setCnExecutionError,
  cnExecutionLoading,
  setCnExecutionLoading,
  cnTemplates,
  cnTemplatesLoading,
  TemplateInputForm,
  runTemplate,
  createVisualPuzzle,
  loadTopicsForCategory,
  loadSubtopicsForTopic,
  seedBasePuzzleTemplates,
  navigate,
  db,
  collection,
  addDoc,
  serverTimestamp,
  formatDate,
  formatFullDateTime,
  setShowTemplateModal,
  showUniversalPuzzleBuilder,
  setShowUniversalPuzzleBuilder,
  editingPuzzleData,
  setEditingPuzzleData,
}) {
  const ITEMS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: 'title', direction: 'asc' });

  // Apply column-level sorting and filtering
  const sortedAndFilteredPuzzles = sortData(filteredPuzzles, sortConfig);

  // Calculate pagination
  const totalPages = Math.ceil(sortedAndFilteredPuzzles.length / ITEMS_PER_PAGE);
  const paginatedPuzzles = sortedAndFilteredPuzzles.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset to first page when filters change
  const handleFilterChange = (filtered) => {
    setCurrentPage(1);
    setFilteredPuzzles(filtered);
  };

  return (
    <div>
      {/* Header & Action Buttons */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ color: theme.textPrimary, fontSize: '24px', fontWeight: '700', margin: '0 0 8px 0' }}>
            🧩 Manage Puzzles
          </h2>
          <p style={{ color: theme.textSecondary, margin: '0', fontSize: '14px' }}>
            Create and manage various puzzle types and complexity levels
          </p>
        </div>

        {/* Organized Action Buttons - Grid Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
          <button 
            onClick={() => setShowUniversalPuzzleBuilder(!showUniversalPuzzleBuilder)} 
            style={{ 
              padding: '12px 20px', 
              background: `linear-gradient(135deg, #667eea, #764ba2)`, 
              color: '#fff', 
              border: 'none', 
              borderRadius: '8px', 
              fontSize: '14px', 
              fontWeight: '600', 
              cursor: 'pointer', 
              transition: 'all 0.3s ease' 
            }} 
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'} 
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            ➕ Add New Puzzle
          </button>
          <button 
            onClick={() => setShowTemplateModal(true)} 
            style={{ 
              padding: '12px 20px', 
              background: `linear-gradient(135deg, #764ba2, #667eea)`, 
              color: '#fff', 
              border: 'none', 
              borderRadius: '8px', 
              fontSize: '14px', 
              fontWeight: '600', 
              cursor: 'pointer', 
              transition: 'all 0.3s ease' 
            }} 
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'} 
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            title="Browse and manage puzzle templates"
          >
            📋 Puzzle Templates
          </button>
          <button 
            onClick={() => navigate('/admin/puzzle-duplicates')} 
            style={{ 
              padding: '12px 20px', 
              background: `linear-gradient(135deg, #FF6B6B, #FF8E72)`, 
              color: '#fff', 
              border: 'none', 
              borderRadius: '8px', 
              fontSize: '14px', 
              fontWeight: '600', 
              cursor: 'pointer', 
              transition: 'all 0.3s ease' 
            }} 
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'} 
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            🔍 Find Duplicates
          </button>
          <button 
            onClick={seedBasePuzzleTemplates} 
            style={{ 
              padding: '12px 20px', 
              background: `linear-gradient(135deg, #27AE60, #229954)`, 
              color: '#fff', 
              border: 'none', 
              borderRadius: '8px', 
              fontSize: '14px', 
              fontWeight: '600', 
              cursor: 'pointer', 
              transition: 'all 0.3s ease' 
            }} 
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'} 
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            title="Create missing generic templates for all puzzle types"
          >
            🌱 Seed Base Templates
          </button>
        </div>
      </div>

      {/* Puzzle Builder Modal */}
      {showUniversalPuzzleBuilder && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '20px', overflowY: 'auto' }}>
          <div style={{ background: theme.surfacePrimary, border: `2px solid ${theme.accentPrimary}`, borderRadius: '16px', padding: '20px', boxShadow: `0 8px 24px ${theme.accentPrimary}40`, width: '100%', maxWidth: '900px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '16px', borderBottom: `2px solid ${theme.border}`, position: 'sticky', top: 0, background: theme.surfacePrimary, zIndex: 1 }}>
              <h3 style={{ color: theme.textPrimary, fontSize: '18px', fontWeight: '700', margin: 0 }}>🧩 {editingPuzzleData ? '✏️ Edit' : '➕ Create'} Puzzle</h3>
              <button onClick={() => { setShowUniversalPuzzleBuilder(false); setEditingPuzzleData(null); }} style={{ background: 'transparent', border: 'none', color: theme.textSecondary, fontSize: '24px', cursor: 'pointer', padding: '0' }}>✕</button>
            </div>
            <AdminPuzzleBuilder 
              theme={theme} 
              initialData={editingPuzzleData} 
              onSave={(puzzleData) => { 
                setEditingPuzzleData(null); 
                setShowUniversalPuzzleBuilder(false);
              }} 
              onClose={() => { setShowUniversalPuzzleBuilder(false); setEditingPuzzleData(null); }}
              TemplateInputForm={TemplateInputForm}
              runTemplate={runTemplate}
            />
          </div>
        </div>
      )}

      <div style={{ background: theme.surfacePrimary, border: `2px solid ${theme.border}`, borderRadius: '12px', padding: '0', overflow: 'hidden' }}>
        {/* Unified Filters Section - All search & filter controls in ONE place */}
        <div style={{ padding: '20px', borderBottom: `2px solid ${theme.border}` }}>
          {/* Search Bar with ALL filters integrated */}
          <SearchFilterBar 
            items={puzzles}
            onFilter={handleFilterChange}
            searchPlaceholder="Search puzzles by title, category, or ID..."
            categories={PUZZLE_TYPES}
            difficulties={DIFFICULTIES}
            showCategory={true}
            showDifficulty={true}
            showStatus={true}
            visibilityFilter={visibilityFilter}
            onVisibilityChange={setVisibilityFilter}
            featuredFilter={featuredFilter}
            onFeaturedChange={setFeaturedFilter}
            onClearFilters={() => {
              setVisibilityFilter('all');
              setFeaturedFilter(false);
            }}
          />
        </div>

        {/* Puzzle Table & Pagination - All in one container */}
        {filteredPuzzles.length > 0 ? (
          <div>
            {/* Table Header with Sortable Columns */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1.5fr', gap: '16px', padding: '14px 20px', background: `${theme.accentPrimary}15`, borderBottom: `2px solid ${theme.border}`, fontWeight: '700', color: theme.accentPrimary, fontSize: '13px', position: 'sticky', top: 0 }}>
              <TableColumnHeader
                label="Title"
                sortKey="title"
                currentSort={sortConfig}
                onSort={setSortConfig}
                filterOptions={generateFilterOptions(filteredPuzzles, 'title')}
                showFilter={false}
              />
              <div style={{ textAlign: 'center' }}>
                <TableColumnHeader
                  label="Type"
                  sortKey="type"
                  currentSort={sortConfig}
                  onSort={setSortConfig}
                  filterOptions={generateFilterOptions(filteredPuzzles, 'type')}
                  showFilter={true}
                />
              </div>
              <div style={{ textAlign: 'center' }}>
                <TableColumnHeader
                  label="Difficulty"
                  sortKey="difficulty"
                  currentSort={sortConfig}
                  onSort={setSortConfig}
                  filterOptions={generateFilterOptions(filteredPuzzles, 'difficulty')}
                  showFilter={true}
                />
              </div>
              <div style={{ textAlign: 'center' }}>
                <TableColumnHeader
                  label="Audience"
                  sortKey="audience"
                  currentSort={sortConfig}
                  onSort={setSortConfig}
                  filterOptions={generateFilterOptions(filteredPuzzles, 'audience')}
                  showFilter={true}
                />
              </div>
              <div style={{ textAlign: 'center' }}>Status</div>
              <div style={{ textAlign: 'right' }}>Actions</div>
            </div>

            {/* Table Rows */}
            {paginatedPuzzles.map((puzzle, idx) => (
              <div key={puzzle.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1.5fr', gap: '16px', padding: '12px 20px', borderBottom: `1px solid ${theme.border}`, alignItems: 'center' }}>
                {/* Title */}
                <div>
                  <h3 style={{ color: theme.textPrimary, fontSize: '14px', fontWeight: '600', margin: '0 0 2px 0' }}>🧩 {puzzle.title}</h3>
                  <p style={{ color: theme.textSecondary, fontSize: '12px', margin: '0' }}>Pieces: {Array.isArray(puzzle.pieces) ? puzzle.pieces.length : typeof puzzle.pieces === 'number' ? puzzle.pieces : 0}</p>
                </div>

                {/* Type */}
                <div style={{ textAlign: 'center', color: theme.textPrimary, fontSize: '13px', fontWeight: '600' }}>
                  {puzzle.type}
                </div>

                {/* Difficulty */}
                <div style={{ textAlign: 'center', color: theme.textPrimary, fontSize: '13px', fontWeight: '500' }}>
                  ⭐ {puzzle.difficulty || '-'}
                </div>

                {/* Audience */}
                <div style={{ textAlign: 'center', color: theme.textSecondary, fontSize: '13px' }}>
                  👥 {puzzle.audience}
                </div>

                {/* Status & Visibility */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center' }}>
                  {puzzle.status && <StatusBadge status={puzzle.status} />}
                  {puzzle.visibility && <VisibilityBadge visibility={puzzle.visibility} />}
                  {puzzle.featured && <FeaturedBadge featured={puzzle.featured} />}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                  <button onClick={() => { setEditingPuzzleData(puzzle); setShowUniversalPuzzleBuilder(true); }} style={{ padding: '6px 10px', background: `${theme.accentPrimary}25`, color: theme.accentPrimary, border: `1px solid ${theme.accentPrimary}`, borderRadius: '4px', fontSize: '11px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap' }} title="Edit puzzle">✏️</button>
                  <button onClick={() => setViewingPuzzle(puzzle)} style={{ padding: '6px 10px', background: '#667eea25', color: '#667eea', border: '1px solid #667eea', borderRadius: '4px', fontSize: '11px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap' }} title="View puzzle">👁️</button>
                  <button onClick={() => handleDeletePuzzle(puzzle.id)} style={{ padding: '6px 10px', background: '#FF6B6B25', color: '#FF6B6B', border: '1px solid #FF6B6B', borderRadius: '4px', fontSize: '11px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap' }} title="Delete puzzle">🗑️</button>
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
                  ({(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, sortedAndFilteredPuzzles.length)} of {sortedAndFilteredPuzzles.length})
                </span>
              </div>
            )}
          </div>
        ) : (
          <div style={{ padding: '40px', textAlign: 'center', color: theme.textSecondary }}>
            <p>{puzzles.length > 0 ? 'No puzzles match your filters. Try adjusting your search or filters.' : 'No puzzles created yet. Click "➕ Add New Puzzle" to get started!'}</p>
          </div>
        )}
      </div>
    </div>
  );
}
