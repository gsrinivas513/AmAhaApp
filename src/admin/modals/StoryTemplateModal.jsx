import React, { useEffect, useState, useCallback } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { db } from '../../firebase/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

// Built-in Story Templates (lightweight, can be extended later)
const BUILT_IN_STORY_TEMPLATES = [
  {
    id: 'kids-3-chapter-adventure',
    title: 'Kids Adventure (3 chapters)',
    description: 'Wholesome 3-part journey with simple language and visuals.',
    targetAudience: 'kids',
    coverColor: '#8b5cf6',
    chapters: [
      { title: 'The Beginning', description: 'Meet the hero and the goal.' },
      { title: 'The Challenge', description: 'Overcome an obstacle with help.' },
      { title: 'Happy Ending', description: 'Celebrate the win and a lesson.' },
    ],
  },
  {
    id: 'general-5-chapter-guide',
    title: 'General Guide (5 chapters)',
    description: 'Structured guide format ideal for learning topics.',
    targetAudience: 'general',
    coverColor: '#10b981',
    chapters: [
      { title: 'Overview', description: 'Scope and goals.' },
      { title: 'Fundamentals', description: 'Core concepts explained.' },
      { title: 'Examples', description: 'Illustrative examples.' },
      { title: 'Practice', description: 'Exercises or reflections.' },
      { title: 'Summary', description: 'Key takeaways and next steps.' },
    ],
  },
  {
    id: 'programmer-4-part-tutorial',
    title: 'Programmer Tutorial (4 chapters)',
    description: 'Hands-on tutorial with steps and checkpoints.',
    targetAudience: 'programmers',
    coverColor: '#2563eb',
    chapters: [
      { title: 'Setup', description: 'Environment and prerequisites.' },
      { title: 'Build', description: 'Implement the feature step-by-step.' },
      { title: 'Test', description: 'Validate with examples and edge cases.' },
      { title: 'Ship', description: 'Polish, deploy, and monitor.' },
    ],
  },
];

export default function StoryTemplateModal({ isOpen, onClose, onApply }) {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [error, setError] = useState('');

  const loadTemplates = useCallback(async () => {
    setLoading(true);
    try {
      const customSnap = await getDocs(collection(db, 'storyTemplates'));
      const custom = customSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      // Normalize custom templates to expected shape when possible
      const normalizedCustom = custom.map(t => ({
        id: t.id,
        title: t.title || t.name || 'Untitled Template',
        description: t.description || '',
        targetAudience: t.targetAudience || 'general',
        coverColor: t.coverColor || '#667eea',
        coverImage: t.coverImage || '',
        chapters: Array.isArray(t.chapters) ? t.chapters : (Array.isArray(t.schema?.chapters) ? t.schema.chapters : []),
      }));
      setTemplates([...BUILT_IN_STORY_TEMPLATES, ...normalizedCustom]);
      setError('');
    } catch (e) {
      setError('Failed to load story templates: ' + e.message);
      setTemplates([...BUILT_IN_STORY_TEMPLATES]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) loadTemplates();
  }, [isOpen, loadTemplates]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1002,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: theme.surfacePrimary,
          border: `2px solid ${theme.border}`,
          borderRadius: 16,
          width: '95%',
          maxWidth: 840,
          maxHeight: '85vh',
          overflowY: 'auto',
          padding: 24,
          boxShadow: '0 20px 80px rgba(0,0,0,0.4)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ margin: 0, color: theme.textPrimary, fontSize: 20, fontWeight: 800 }}>📋 Story Templates</h2>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: theme.textSecondary, fontSize: 24, cursor: 'pointer' }}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {error && (
          <div style={{ background: '#FF6B6B25', color: '#FF6B6B', padding: 12, borderRadius: 8, marginBottom: 12, fontSize: 12, fontWeight: 600 }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: 12, color: theme.textSecondary, fontSize: 13 }}>
          Pick a template to instantly scaffold a story with chapter placeholders. You can edit everything later.
        </div>

        {loading ? (
          <div style={{ color: theme.textSecondary, textAlign: 'center', padding: 20 }}>Loading templates…</div>
        ) : (
          <div style={{ display: 'grid', gap: 12 }}>
            {templates.map((t) => (
              <div
                key={t.id}
                style={{
                  background: theme.background,
                  border: `2px solid ${theme.border}`,
                  borderRadius: 10,
                  padding: 16,
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: 12,
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <div style={{ width: 14, height: 14, borderRadius: 3, background: t.coverColor || '#667eea' }} />
                    <h3 style={{ margin: 0, color: theme.textPrimary, fontSize: 16 }}>{t.title}</h3>
                  </div>
                  <div style={{ color: theme.textSecondary, fontSize: 12, marginBottom: 8 }}>{t.description}</div>
                  {Array.isArray(t.chapters) && t.chapters.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {t.chapters.slice(0, 5).map((c, idx) => (
                        <span key={idx} style={{ background: `${theme.accentPrimary}20`, color: theme.accentPrimary, padding: '3px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600 }}>
                          {c.title || `Chapter ${idx + 1}`}
                        </span>
                      ))}
                      {t.chapters.length > 5 && (
                        <span style={{ color: theme.textSecondary, fontSize: 11, fontWeight: 600 }}>+{t.chapters.length - 5} more</span>
                      )}
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => onApply && onApply(t)}
                    style={{ padding: '8px 12px', background: theme.accentPrimary, color: '#fff', border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                  >
                    ➕ Use Template
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
