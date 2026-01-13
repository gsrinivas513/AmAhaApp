import React, { useState } from 'react';
import AdminQuizBuilder from '../../quizzes/admin/AdminQuizBuilder';
import SearchFilterBar from '../components/SearchFilterBar';
import StatusBadge from '../../components/badges/StatusBadge';
import VisibilityBadge from '../../components/badges/VisibilityBadge';
import FeaturedBadge from '../../components/badges/FeaturedBadge';

const ITEMS_PER_PAGE = 10;

export default function QuizzesTab({
  theme,
  quizzes,
  filteredQuizzes,
  setFilteredQuizzes,
  CATEGORIES,
  AUDIENCES,
  DIFFICULTIES,
  showAddQuizForm,
  setShowAddQuizForm,
  quizFormData,
  setQuizFormData,
  showUniversalQuizBuilder,
  setShowUniversalQuizBuilder,
  editingQuizData,
  setEditingQuizData,
  seedingQuizzes,
  seedProgress,
  seedResults,
  handleSeedQuizzes,
  phase1Progress,
  phase1Results,
  creatingPhase1Quizzes,
  handleCreatePhase1Quizzes,
  deleteProgress,
  deleteResults,
  deletingQuizzes,
  handleDeleteAllQuizzes,
  showBulkImportQuiz,
  setShowBulkImportQuiz,
  bulkImportData,
  setBulkImportData,
  statusFilter,
  setStatusFilter,
  visibilityFilter,
  setVisibilityFilter,
  featuredFilter,
  setFeaturedFilter,
  handleAddQuiz,
  handleSaveUniversalQuiz,
  handleDeleteQuiz,
  handleBulkImportQuiz,
  setViewingQuiz,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredQuizzes.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIdx = startIdx + ITEMS_PER_PAGE;
  const paginatedQuizzes = filteredQuizzes.slice(startIdx, endIdx);
  
  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filteredQuizzes]);

  return (
    <div>
      {/* Header & Action Buttons */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ color: theme.textPrimary, fontSize: '24px', fontWeight: '700', margin: '0 0 8px 0' }}>
            ❓ Manage Quizzes
          </h2>
          <p style={{ color: theme.textSecondary, margin: '0', fontSize: '14px' }}>
            Create, edit, and manage quiz content
          </p>
        </div>

        {/* Organized Action Buttons - Grid Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
          <button onClick={() => setShowUniversalQuizBuilder(!showUniversalQuizBuilder)} style={{ padding: '12px 20px', background: `linear-gradient(135deg, #4ECDC4, #FFE66D)`, color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.3s ease' }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
            🚀 Create New Quiz
          </button>
          <button onClick={() => setShowBulkImportQuiz(true)} style={{ padding: '12px 20px', background: `linear-gradient(135deg, #FF6B6B, #FF8E72)`, color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.3s ease' }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
            📤 Bulk Import
          </button>
          <button onClick={handleSeedQuizzes} disabled={seedingQuizzes} style={{ padding: '12px 20px', background: seedingQuizzes ? '#ccc' : `linear-gradient(135deg, #9B59B6, #8E44AD)`, color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: seedingQuizzes ? 'not-allowed' : 'pointer', transition: 'all 0.3s ease', opacity: seedingQuizzes ? 0.7 : 1 }} onMouseOver={(e) => !seedingQuizzes && (e.currentTarget.style.transform = 'translateY(-2px)')} onMouseOut={(e) => !seedingQuizzes && (e.currentTarget.style.transform = 'translateY(0)')}>
            {seedingQuizzes ? '🌱 Seeding...' : '🌱 Seed Samples'}
          </button>
          <button onClick={handleCreatePhase1Quizzes} disabled={creatingPhase1Quizzes} style={{ padding: '12px 20px', background: creatingPhase1Quizzes ? '#ccc' : `linear-gradient(135deg, #27AE60, #229954)`, color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: creatingPhase1Quizzes ? 'not-allowed' : 'pointer', transition: 'all 0.3s ease', opacity: creatingPhase1Quizzes ? 0.7 : 1 }} onMouseOver={(e) => !creatingPhase1Quizzes && (e.currentTarget.style.transform = 'translateY(-2px)')} onMouseOut={(e) => !creatingPhase1Quizzes && (e.currentTarget.style.transform = 'translateY(0)')}>
            {creatingPhase1Quizzes ? '⏳ Creating...' : '🧪 Phase 1 Tests'}
          </button>
          <button onClick={handleDeleteAllQuizzes} disabled={deletingQuizzes} style={{ padding: '12px 20px', background: deletingQuizzes ? '#ccc' : `linear-gradient(135deg, #E74C3C, #C0392B)`, color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: deletingQuizzes ? 'not-allowed' : 'pointer', transition: 'all 0.3s ease', opacity: deletingQuizzes ? 0.7 : 1 }} onMouseOver={(e) => !deletingQuizzes && (e.currentTarget.style.transform = 'translateY(-2px)')} onMouseOut={(e) => !deletingQuizzes && (e.currentTarget.style.transform = 'translateY(0)')}>
            {deletingQuizzes ? '🗑️ Deleting...' : '🗑️ Delete All'}
          </button>
        </div>
      </div>

      {seedProgress && (
        <div style={{ marginBottom: '30px', background: theme.surfacePrimary, border: `2px solid #9B59B6`, borderRadius: '16px', padding: '20px' }}>
          <h3 style={{ color: '#9B59B6', fontSize: '18px', fontWeight: '700', marginBottom: '15px' }}>🌱 Seeding Progress</h3>
          <p style={{ color: theme.textSecondary, marginBottom: '10px' }}>{seedProgress.current} / {seedProgress.total} - {seedProgress.title}</p>
          <div style={{ width: '100%', height: '8px', background: theme.border, borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${(seedProgress.current / seedProgress.total) * 100}%`, background: seedProgress.status === 'success' ? '#27AE60' : '#E74C3C', transition: 'width 0.3s ease' }} />
          </div>
        </div>
      )}

      {seedResults && (
        <div style={{ marginBottom: '30px', background: theme.surfacePrimary, border: `2px solid ${seedResults.failed > 0 ? '#E74C3C' : '#27AE60'}`, borderRadius: '16px', padding: '20px' }}>
          <h3 style={{ color: seedResults.failed > 0 ? '#E74C3C' : '#27AE60', fontSize: '18px', fontWeight: '700', marginBottom: '15px' }}>{seedResults.failed > 0 ? '❌ Seeding Complete with Errors' : '✅ Seeding Complete'}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
            <div style={{ background: theme.background, padding: '12px', borderRadius: '8px', border: `2px solid #27AE60` }}>
              <p style={{ color: theme.textSecondary, fontSize: '12px', margin: '0 0 5px 0' }}>✅ Created</p>
              <p style={{ color: '#27AE60', fontSize: '24px', fontWeight: '700', margin: '0' }}>{seedResults.success}</p>
            </div>
            <div style={{ background: theme.background, padding: '12px', borderRadius: '8px', border: `2px solid #E74C3C` }}>
              <p style={{ color: theme.textSecondary, fontSize: '12px', margin: '0 0 5px 0' }}>❌ Failed</p>
              <p style={{ color: '#E74C3C', fontSize: '24px', fontWeight: '700', margin: '0' }}>{seedResults.failed}</p>
            </div>
          </div>
          {seedResults.errors && seedResults.errors.length > 0 && (
            <div style={{ background: theme.background, padding: '15px', borderRadius: '8px', maxHeight: '200px', overflowY: 'auto' }}>
              <p style={{ color: theme.textSecondary, fontSize: '12px', fontWeight: '600', margin: '0 0 10px 0' }}>Errors:</p>
              {seedResults.errors.map((err, idx) => (
                <p key={idx} style={{ color: '#E74C3C', fontSize: '12px', margin: '5px 0' }}>• {err.title}: {err.error}</p>
              ))}
            </div>
          )}
        </div>
      )}

      {phase1Progress && (
        <div style={{ marginBottom: '30px', background: theme.surfacePrimary, border: `2px solid #27AE60`, borderRadius: '16px', padding: '20px' }}>
          <h3 style={{ color: '#27AE60', fontSize: '18px', fontWeight: '700', marginBottom: '15px' }}>🧪 Creating Phase 1 Test Quizzes</h3>
          <div style={{ width: '100%', height: '24px', background: theme.background, borderRadius: '12px', overflow: 'hidden', marginBottom: '10px' }}>
            <div style={{ width: `${(phase1Progress.current / phase1Progress.total) * 100}%`, height: '100%', background: `linear-gradient(90deg, #27AE60, #229954)`, transition: 'width 0.3s ease' }}></div>
          </div>
          <p style={{ color: theme.textSecondary, fontSize: '14px', margin: '0' }}>{phase1Progress.message} ({phase1Progress.current}/{phase1Progress.total})</p>
        </div>
      )}

      {phase1Results && (
        <div style={{ marginBottom: '30px', background: theme.surfacePrimary, border: `2px solid ${phase1Results.failed > 0 ? '#E74C3C' : '#27AE60'}`, borderRadius: '16px', padding: '20px' }}>
          <h3 style={{ color: phase1Results.failed > 0 ? '#E74C3C' : '#27AE60', fontSize: '18px', fontWeight: '700', marginBottom: '15px' }}>{phase1Results.failed > 0 ? '❌ Phase 1 Setup Complete with Errors' : '✅ Phase 1 Test Quizzes Created'}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
            <div style={{ background: theme.background, padding: '12px', borderRadius: '8px', border: `2px solid #27AE60` }}>
              <p style={{ color: theme.textSecondary, fontSize: '12px', margin: '0 0 5px 0' }}>✅ Created</p>
              <p style={{ color: '#27AE60', fontSize: '24px', fontWeight: '700', margin: '0' }}>{phase1Results.success}</p>
            </div>
            <div style={{ background: theme.background, padding: '12px', borderRadius: '8px', border: `2px solid #E74C3C` }}>
              <p style={{ color: theme.textSecondary, fontSize: '12px', margin: '0 0 5px 0' }}>❌ Failed</p>
              <p style={{ color: '#E74C3C', fontSize: '24px', fontWeight: '700', margin: '0' }}>{phase1Results.failed}</p>
            </div>
          </div>
          {phase1Results.failed === 0 && (
            <div style={{ background: '#E8F8F5', padding: '15px', borderRadius: '8px', border: '2px solid #27AE60' }}>
              <p style={{ color: '#27AE60', fontSize: '14px', fontWeight: '600', margin: '0 0 10px 0' }}>🎉 All 9 test quizzes created successfully!</p>
              <p style={{ color: '#229954', fontSize: '13px', margin: '5px 0' }}>• Multiple Choice (2 quizzes)</p>
              <p style={{ color: '#229954', fontSize: '13px', margin: '5px 0' }}>• True/False, Fill Blank, Matching, Ordering, Image Select, Multi-Select, Drag & Drop</p>
              <p style={{ color: '#229954', fontSize: '13px', margin: '5px 0' }}>• Plus one quiz with all question types combined</p>
              <p style={{ color: '#229954', fontSize: '13px', margin: '5px 0' }}><strong>→ Ready to test at http://localhost:3001/quizzes</strong></p>
            </div>
          )}
          {phase1Results.errors && phase1Results.errors.length > 0 && (
            <div style={{ background: theme.background, padding: '15px', borderRadius: '8px', maxHeight: '200px', overflowY: 'auto' }}>
              <p style={{ color: theme.textSecondary, fontSize: '12px', fontWeight: '600', margin: '0 0 10px 0' }}>Errors:</p>
              {phase1Results.errors.map((err, idx) => (
                <p key={idx} style={{ color: '#E74C3C', fontSize: '12px', margin: '5px 0' }}>• {err.error || JSON.stringify(err)}</p>
              ))}
            </div>
          )}
        </div>
      )}

      {deleteProgress && (
        <div style={{ marginBottom: '30px', background: theme.surfacePrimary, border: `2px solid #E74C3C`, borderRadius: '16px', padding: '20px' }}>
          <h3 style={{ color: '#E74C3C', fontSize: '18px', fontWeight: '700', marginBottom: '15px' }}>🗑️ Deletion Progress</h3>
          <p style={{ color: theme.textSecondary, marginBottom: '10px' }}>{deleteProgress.current} / {deleteProgress.total} quizzes deleted</p>
          <div style={{ width: '100%', height: '8px', background: theme.border, borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${(deleteProgress.current / deleteProgress.total) * 100}%`, background: '#E74C3C', transition: 'width 0.3s ease' }} />
          </div>
        </div>
      )}

      {deleteResults && (
        <div style={{ marginBottom: '30px', background: theme.surfacePrimary, border: `2px solid ${deleteResults.failed > 0 ? '#E74C3C' : '#27AE60'}`, borderRadius: '16px', padding: '20px' }}>
          <h3 style={{ color: deleteResults.failed > 0 ? '#E74C3C' : '#27AE60', fontSize: '18px', fontWeight: '700', marginBottom: '15px' }}>{deleteResults.failed > 0 ? '❌ Deletion Complete with Errors' : '✅ Deletion Complete'}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
            <div style={{ background: theme.background, padding: '12px', borderRadius: '8px', border: `2px solid #27AE60` }}>
              <p style={{ color: theme.textSecondary, fontSize: '12px', margin: '0 0 5px 0' }}>✅ Deleted</p>
              <p style={{ color: '#27AE60', fontSize: '24px', fontWeight: '700', margin: '0' }}>{deleteResults.success}</p>
            </div>
            <div style={{ background: theme.background, padding: '12px', borderRadius: '8px', border: `2px solid #E74C3C` }}>
              <p style={{ color: theme.textSecondary, fontSize: '12px', margin: '0 0 5px 0' }}>❌ Failed</p>
              <p style={{ color: '#E74C3C', fontSize: '24px', fontWeight: '700', margin: '0' }}>{deleteResults.failed}</p>
            </div>
          </div>
          {deleteResults.errors && deleteResults.errors.length > 0 && (
            <div style={{ background: theme.background, padding: '15px', borderRadius: '8px', maxHeight: '200px', overflowY: 'auto' }}>
              <p style={{ color: theme.textSecondary, fontSize: '12px', fontWeight: '600', margin: '0 0 10px 0' }}>Errors:</p>
              {deleteResults.errors.map((err, idx) => (
                <p key={idx} style={{ color: '#E74C3C', fontSize: '12px', margin: '5px 0' }}>• {err.id || 'Unknown'}: {err.error}</p>
              ))}
            </div>
          )}
        </div>
      )}

      {showAddQuizForm && (
        <div style={{ marginBottom: '30px', background: theme.surfacePrimary, border: `2px solid ${theme.border}`, borderRadius: '16px', padding: '24px' }}>
          <h3 style={{ color: theme.textPrimary, fontSize: '18px', fontWeight: '700', marginBottom: '20px' }}>Create New Quiz</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '16px' }}>
            <input type="text" placeholder="Quiz Title" value={quizFormData.title} onChange={(e) => setQuizFormData({ ...quizFormData, title: e.target.value })} style={{ padding: '10px 12px', background: theme.background, border: `2px solid ${theme.border}`, borderRadius: '6px', color: theme.textPrimary, fontSize: '13px', fontFamily: 'inherit' }} />
            <select value={quizFormData.category} onChange={(e) => setQuizFormData({ ...quizFormData, category: e.target.value })} style={{ padding: '10px 12px', background: theme.background, border: `2px solid ${theme.border}`, borderRadius: '6px', color: theme.textPrimary, fontSize: '13px', fontFamily: 'inherit' }}>
              <option value="">Category</option>
              {CATEGORIES.map(cat => (<option key={cat} value={cat}>{cat}</option>))}
            </select>
            <select value={quizFormData.audience} onChange={(e) => setQuizFormData({ ...quizFormData, audience: e.target.value })} style={{ padding: '10px 12px', background: theme.background, border: `2px solid ${theme.border}`, borderRadius: '6px', color: theme.textPrimary, fontSize: '13px', fontFamily: 'inherit' }}>
              <option value="">Audience</option>
              {AUDIENCES.map(aud => (<option key={aud} value={aud}>{aud}</option>))}
            </select>
            <input type="number" placeholder="Questions" value={quizFormData.questions} onChange={(e) => setQuizFormData({ ...quizFormData, questions: e.target.value })} style={{ padding: '10px 12px', background: theme.background, border: `2px solid ${theme.border}`, borderRadius: '6px', color: theme.textPrimary, fontSize: '13px', fontFamily: 'inherit' }} />
            <select value={quizFormData.difficulty} onChange={(e) => setQuizFormData({ ...quizFormData, difficulty: e.target.value })} style={{ padding: '10px 12px', background: theme.background, border: `2px solid ${theme.border}`, borderRadius: '6px', color: theme.textPrimary, fontSize: '13px', fontFamily: 'inherit' }}>
              <option value="">Difficulty</option>
              {DIFFICULTIES.map(diff => (<option key={diff} value={diff}>{diff}</option>))}
            </select>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={handleAddQuiz} style={{ padding: '10px 20px', background: `linear-gradient(135deg, #4ECDC4, #FFE66D)`, color: '#fff', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>Save</button>
            <button onClick={() => { setShowAddQuizForm(false); setQuizFormData({ title: '', category: '', audience: '', questions: '', difficulty: '' }); }} style={{ padding: '10px 20px', background: 'transparent', color: theme.textPrimary, border: `2px solid ${theme.border}`, borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>Cancel</button>
          </div>
        </div>
      )}

      {showUniversalQuizBuilder && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '20px', overflowY: 'auto' }}>
          <div style={{ background: theme.surfacePrimary, border: `2px solid ${theme.accentPrimary}`, borderRadius: '16px', padding: '20px', boxShadow: `0 8px 24px ${theme.accentPrimary}40`, width: '100%', maxWidth: '1000px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '16px', borderBottom: `2px solid ${theme.border}`, position: 'sticky', top: 0, background: theme.surfacePrimary, zIndex: 1 }}>
              <h3 style={{ color: theme.textPrimary, fontSize: '18px', fontWeight: '700', margin: 0 }}>🚀 Quiz Builder</h3>
              <button onClick={() => { setShowUniversalQuizBuilder(false); setEditingQuizData(null); }} style={{ background: 'transparent', border: 'none', color: theme.textSecondary, fontSize: '24px', cursor: 'pointer', padding: '0' }}>✕</button>
            </div>
            <AdminQuizBuilder theme={theme} initialData={editingQuizData} onSave={(quizData) => { handleSaveUniversalQuiz(quizData); setEditingQuizData(null); }} onClose={() => { setShowUniversalQuizBuilder(false); setEditingQuizData(null); }} />
          </div>
        </div>
      )}

      {showBulkImportQuiz && (
        <div style={{ marginBottom: '20px', background: theme.surfacePrimary, border: `2px solid #FF8E72`, borderRadius: '16px', padding: '20px', boxShadow: `0 8px 24px rgba(255, 139, 114, 0.4)`, width: '100%', boxSizing: 'border-box' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '16px', borderBottom: `2px solid ${theme.border}` }}>
            <h3 style={{ color: theme.textPrimary, fontSize: '18px', fontWeight: '700', margin: 0 }}>📤 Bulk Import Quizzes</h3>
            <button onClick={() => setShowBulkImportQuiz(false)} style={{ background: 'transparent', border: 'none', color: theme.textSecondary, fontSize: '24px', cursor: 'pointer', padding: '0' }}>✕</button>
          </div>
          <div style={{ marginBottom: '16px', padding: '12px', background: theme.backgroundSecondary, borderRadius: '8px' }}>
            <p style={{ color: theme.textSecondary, fontSize: '13px', margin: 0 }}>✨ <strong>Import complete quizzes</strong> with metadata, questions, options, correct answers, images, videos, and explanations!</p>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', color: theme.textSecondary, fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>Paste JSON data with complete quiz structure:</label>
            <textarea value={bulkImportData} onChange={(e) => setBulkImportData(e.target.value)} placeholder="[{...}]" style={{ width: '100%', minHeight: '300px', padding: '12px', background: theme.backgroundSecondary, border: `1px solid ${theme.border}`, borderRadius: '8px', color: theme.textPrimary, fontFamily: 'monospace', fontSize: '12px', resize: 'vertical' }} />
          </div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button onClick={() => { setShowBulkImportQuiz(false); setBulkImportData(''); }} style={{ padding: '10px 24px', background: theme.surfaceSecondary, border: `1px solid ${theme.border}`, borderRadius: '8px', color: theme.textPrimary, fontWeight: '600', cursor: 'pointer', fontSize: '14px' }}>Cancel</button>
            <button onClick={handleBulkImportQuiz} style={{ padding: '10px 24px', background: `linear-gradient(135deg, #FF6B6B, #FF8E72)`, border: 'none', borderRadius: '8px', color: '#fff', fontWeight: '600', cursor: 'pointer', fontSize: '14px' }}>Import Quizzes</button>
          </div>
        </div>
      )}

      {/* UNIFIED QUIZZES SECTION - Everything in one container */}
      <div style={{ background: theme.surfacePrimary, border: `2px solid ${theme.border}`, borderRadius: '12px', padding: '0', overflow: 'hidden' }}>
        {/* Unified Filters Section - All search & filter controls in ONE place */}
        <div style={{ padding: '20px', borderBottom: `2px solid ${theme.border}` }}>
          {/* Search Bar with ALL filters integrated */}
          <SearchFilterBar 
            items={quizzes} 
            onFilter={setFilteredQuizzes} 
            searchPlaceholder="Search quizzes by title, description, or ID..." 
            categories={CATEGORIES} 
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

        {/* Quiz Table & Pagination - All in one container */}
        {filteredQuizzes.length > 0 ? (
          <div>
            {/* Table Header */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1.5fr', gap: '16px', padding: '14px 20px', background: `${theme.accentPrimary}15`, borderBottom: `2px solid ${theme.border}`, fontWeight: '700', color: theme.accentPrimary, fontSize: '13px', position: 'sticky', top: 0 }}>
              <div>Title</div>
              <div style={{ textAlign: 'center' }}>Questions</div>
              <div style={{ textAlign: 'center' }}>Audience</div>
              <div style={{ textAlign: 'center' }}>Difficulty</div>
              <div style={{ textAlign: 'center' }}>Status</div>
              <div style={{ textAlign: 'right' }}>Actions</div>
            </div>

            {/* Table Rows */}
            {paginatedQuizzes.map((quiz, idx) => (
              <div key={quiz.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1.5fr', gap: '16px', padding: '12px 20px', borderBottom: `1px solid ${theme.border}`, alignItems: 'center' }}>
                {/* Title */}
                <div>
                  <h3 style={{ color: theme.textPrimary, fontSize: '14px', fontWeight: '600', margin: '0 0 2px 0' }}>{quiz.title}</h3>
                  <p style={{ color: theme.textSecondary, fontSize: '12px', margin: '0' }}>{quiz.category}</p>
                </div>

                {/* Questions */}
                <div style={{ textAlign: 'center', color: theme.textPrimary, fontSize: '13px', fontWeight: '600' }}>
                  📚 {Array.isArray(quiz.questions) ? quiz.questions.length : typeof quiz.questions === 'number' ? quiz.questions : 0}
                </div>

                {/* Audience */}
                <div style={{ textAlign: 'center', color: theme.textSecondary, fontSize: '13px' }}>
                  👥 {quiz.audience}
                </div>

                {/* Difficulty */}
                <div style={{ textAlign: 'center', color: theme.textPrimary, fontSize: '13px', fontWeight: '500' }}>
                  ⭐ {quiz.difficulty || '-'}
                </div>

                {/* Status & Visibility */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center' }}>
                  {quiz.status && <StatusBadge status={quiz.status} />}
                  {quiz.visibility && <VisibilityBadge visibility={quiz.visibility} />}
                  {quiz.featured && <FeaturedBadge featured={quiz.featured} />}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                  <button onClick={() => { setEditingQuizData(quiz); setShowUniversalQuizBuilder(true); }} style={{ padding: '6px 10px', background: `${theme.accentPrimary}25`, color: theme.accentPrimary, border: `1px solid ${theme.accentPrimary}`, borderRadius: '4px', fontSize: '11px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap' }} title="Edit quiz">✏️</button>
                  <button onClick={() => setViewingQuiz(quiz)} style={{ padding: '6px 10px', background: '#667eea25', color: '#667eea', border: '1px solid #667eea', borderRadius: '4px', fontSize: '11px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap' }} title="View quiz">👁️</button>
                  <button onClick={() => handleDeleteQuiz(quiz.id)} style={{ padding: '6px 10px', background: '#FF6B6B25', color: '#FF6B6B', border: '1px solid #FF6B6B', borderRadius: '4px', fontSize: '11px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap' }} title="Delete quiz">🗑️</button>
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
                  ({startIdx + 1}–{Math.min(endIdx, filteredQuizzes.length)} of {filteredQuizzes.length})
                </span>
              </div>
            )}
          </div>
        ) : (
          <div style={{ padding: '40px', textAlign: 'center', color: theme.textSecondary }}>
            <p>{quizzes.length > 0 ? 'No quizzes match your filters. Try adjusting your search or filters.' : 'No quizzes created yet. Click "🚀 Create New Quiz" to get started!'}</p>
          </div>
        )}
      </div>
    </div>
  );
}
