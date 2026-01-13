import React from 'react';

export default function SettingsTab({ theme, dbStats, navigate }) {
  return (
    <div style={{
      background: theme.surfacePrimary,
      border: `2px solid ${theme.border}`,
      borderRadius: '16px',
      padding: '40px',
    }}>
      <h2 style={{
        color: theme.textPrimary,
        fontSize: '24px',
        fontWeight: '700',
        marginBottom: '16px',
      }}>
        ⚙️ Platform Settings & Database Tools
      </h2>
      <p style={{
        color: theme.textSecondary,
        marginBottom: '32px',
      }}>
        Configure system settings and manage database health
      </p>

      {/* Database Statistics */}
      {dbStats && (
        <div style={{
          background: theme.background,
          border: `2px solid ${theme.border}`,
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '32px',
        }}>
          <h3 style={{ color: theme.textPrimary, marginTop: 0 }}>📊 Database Statistics</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: '12px',
          }}>
            <div style={{ textAlign: 'center', padding: '12px' }}>
              <div style={{ color: theme.accentPrimary, fontSize: '24px', fontWeight: '700' }}>
                {dbStats.collections.features}
              </div>
              <div style={{ color: theme.textSecondary, fontSize: '12px' }}>Features</div>
            </div>
            <div style={{ textAlign: 'center', padding: '12px' }}>
              <div style={{ color: theme.accentPrimary, fontSize: '24px', fontWeight: '700' }}>
                {dbStats.collections.categories}
              </div>
              <div style={{ color: theme.textSecondary, fontSize: '12px' }}>Categories</div>
            </div>
            <div style={{ textAlign: 'center', padding: '12px' }}>
              <div style={{ color: theme.accentPrimary, fontSize: '24px', fontWeight: '700' }}>
                {dbStats.collections.topics}
              </div>
              <div style={{ color: theme.textSecondary, fontSize: '12px' }}>Topics</div>
            </div>
            <div style={{ textAlign: 'center', padding: '12px' }}>
              <div style={{ color: theme.accentPrimary, fontSize: '24px', fontWeight: '700' }}>
                {dbStats.collections.subtopics}
              </div>
              <div style={{ color: theme.textSecondary, fontSize: '12px' }}>Subtopics</div>
            </div>
            <div style={{ textAlign: 'center', padding: '12px' }}>
              <div style={{ color: theme.accentPrimary, fontSize: '24px', fontWeight: '700' }}>
                {dbStats.puzzles.valid}/{dbStats.puzzles.total}
              </div>
              <div style={{ color: theme.textSecondary, fontSize: '12px' }}>Puzzles (valid)</div>
            </div>
            <div style={{ textAlign: 'center', padding: '12px' }}>
              <div style={{ color: theme.accentPrimary, fontSize: '24px', fontWeight: '700' }}>
                {dbStats.collections.questions}
              </div>
              <div style={{ color: theme.textSecondary, fontSize: '12px' }}>Questions</div>
            </div>
            <div style={{ textAlign: 'center', padding: '12px' }}>
              <div style={{ color: theme.accentPrimary, fontSize: '24px', fontWeight: '700' }}>
                {dbStats.collections.quizzes}
              </div>
              <div style={{ color: theme.textSecondary, fontSize: '12px' }}>Quizzes</div>
            </div>
            <div style={{ textAlign: 'center', padding: '12px' }}>
              <div style={{ color: theme.accentPrimary, fontSize: '24px', fontWeight: '700' }}>
                {dbStats.collections.stories}
              </div>
              <div style={{ color: theme.textSecondary, fontSize: '12px' }}>Stories</div>
            </div>
            <div style={{ textAlign: 'center', padding: '12px' }}>
              <div style={{ color: theme.accentPrimary, fontSize: '24px', fontWeight: '700' }}>
                {dbStats.totalDocuments}
              </div>
              <div style={{ color: theme.textSecondary, fontSize: '12px' }}>Total Documents</div>
            </div>
          </div>
        </div>
      )}

      {/* Database Tools */}
      <div style={{
        background: theme.background,
        border: `2px solid ${theme.border}`,
        borderRadius: '12px',
        padding: '24px',
        marginBottom: '32px',
      }}>
        <h3 style={{ color: theme.textPrimary, marginTop: 0 }}>🔧 Database Tools & Maintenance</h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '12px',
        }}>
          <button
            onClick={() => navigate('/admin/database-audit')}
            style={{
              padding: '12px 16px',
              background: '#0284c725',
              color: '#0284c7',
              border: '2px solid #0284c7',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '13px',
            }}
          >
            🔍 Run Audit
          </button>
          <button
            onClick={() => navigate('/admin/standardize-features')}
            style={{
              padding: '12px 16px',
              background: '#05966925',
              color: '#059669',
              border: '2px solid #059669',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '13px',
            }}
          >
            ⚡ Standardize Features
          </button>
          <button
            onClick={() => navigate('/admin/fix-feature-mismatch')}
            style={{
              padding: '12px 16px',
              background: '#d9770625',
              color: '#d97706',
              border: '2px solid #d97706',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '13px',
            }}
          >
            🔗 Fix Mismatch
          </button>
          <button
            onClick={() => navigate('/admin/fix-orphaned-puzzles')}
            style={{
              padding: '12px 16px',
              background: '#dc262625',
              color: '#dc2626',
              border: '2px solid #dc2626',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '13px',
            }}
          >
            🗑️ Delete Broken
          </button>
          <button
            onClick={() => navigate('/admin/fix-generic-puzzle-types')}
            style={{
              padding: '12px 16px',
              background: '#933326a25',
              color: '#9333ea',
              border: '2px solid #9333ea',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '13px',
            }}
          >
            🔧 Fix Generic Types
          </button>
          <button
            onClick={() => navigate('/admin/populate-missing-puzzle-data')}
            style={{
              padding: '12px 16px',
              background: '#1e40af25',
              color: '#1e40af',
              border: '2px solid #1e40af',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '13px',
            }}
          >
            📊 Check Data
          </button>
          <button
            onClick={() => navigate('/admin/delete-incomplete-puzzles')}
            style={{
              padding: '12px 16px',
              background: '#dc262625',
              color: '#dc2626',
              border: '2px solid #dc2626',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '13px',
            }}
          >
            🗑️ Delete Incomplete
          </button>
          <button
            onClick={() => navigate('/admin/validate-puzzle-data')}
            style={{
              padding: '12px 16px',
              background: '#0d948825',
              color: '#0d9488',
              border: '2px solid #0d9488',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '13px',
            }}
          >
            ✅ Validate All
          </button>
        </div>
      </div>

      {/* General Settings */}
      <div style={{
        background: theme.background,
        border: `2px solid ${theme.border}`,
        borderRadius: '12px',
        padding: '24px',
      }}>
        <h3 style={{ color: theme.textPrimary, marginTop: 0 }}>⚙️ General Settings</h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '12px',
        }}>
          {['Maintenance Mode', 'Email Notifications', 'Auto Backup', 'Debug Mode'].map((setting) => (
            <div key={setting} style={{
              background: theme.surfacePrimary,
              border: `2px solid ${theme.border}`,
              borderRadius: '8px',
              padding: '12px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <label style={{
                color: theme.textPrimary,
                fontSize: '13px',
                fontWeight: '500',
                cursor: 'pointer',
              }}>
                {setting}
              </label>
              <input
                type="checkbox"
                style={{
                  cursor: 'pointer',
                  width: '18px',
                  height: '18px',
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
