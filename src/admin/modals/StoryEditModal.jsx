import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { db } from '../../firebase/firebaseConfig';
import { doc, updateDoc, collection, query, where, getDocs, addDoc, deleteDoc } from 'firebase/firestore';
import StoryReaderPreview from '../components/StoryReaderPreview';
import ChapterContentEditor from '../components/ChapterContentEditor';

const StoryEditModal = ({ story, isOpen, onClose, onSave }) => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('info');
  const [editingChapter, setEditingChapter] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const CATEGORIES = ['Adventure', 'Mystery', 'Science', 'Fantasy', 'History', 'Educational'];
  const AUDIENCES = ['All Users', 'Kids 5-12', 'Students 13-18', 'Professionals', 'Programmers'];

  useEffect(() => {
    if (story && isOpen) {
      setFormData({
        title: story.title || '',
        category: story.category || '',
        audience: story.audience || '',
      });
      loadChapters();
      setActiveTab('info');
      setError('');
      setSuccess(false);
    }
  }, [story, isOpen]);

  const loadChapters = async () => {
    if (!story?.id) return;
    try {
      const q = query(collection(db, 'chapters'), where('storyId', '==', story.id));
      const snapshot = await getDocs(q);
      setChapters(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a, b) => (a.order || 0) - (b.order || 0)));
    } catch (err) {
      console.error('Error loading chapters:', err);
    }
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Title is required');
      return false;
    }
    if (!formData.category) {
      setError('Category is required');
      return false;
    }
    if (!formData.audience) {
      setError('Audience is required');
      return false;
    }
    setError('');
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const updateData = {
        title: formData.title,
        category: formData.category,
        audience: formData.audience,
      };

      await updateDoc(doc(db, 'stories', story.id), updateData);
      setSuccess(true);
      setTimeout(() => {
        onSave(updateData);
      }, 1000);
    } catch (err) {
      setError('Error saving story: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddChapter = async () => {
    try {
      const newChapter = {
        storyId: story.id,
        title: `Chapter ${chapters.length + 1}`,
        description: '',
        order: chapters.length + 1,
        contentBlocks: [],
        createdAt: new Date(),
      };
      const docRef = await addDoc(collection(db, 'chapters'), newChapter);
      await loadChapters();
      setEditingChapter({ id: docRef.id, ...newChapter });
    } catch (err) {
      setError('Error adding chapter: ' + err.message);
    }
  };

  const handleDeleteChapter = async (chapterId) => {
    if (!window.confirm('Delete this chapter? This cannot be undone.')) return;
    try {
      await deleteDoc(doc(db, 'chapters', chapterId));
      await loadChapters();
    } catch (err) {
      setError('Error deleting chapter: ' + err.message);
    }
  };

  const handleSaveChapter = async (chapterData) => {
    try {
      await updateDoc(doc(db, 'chapters', editingChapter.id), chapterData);
      await loadChapters();
      setEditingChapter(null);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      setError('Error saving chapter: ' + err.message);
    }
  };

  if (!isOpen || !formData) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: theme.surfacePrimary,
          border: `2px solid ${theme.border}`,
          borderRadius: '16px',
          width: '95%',
          maxWidth: '900px',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 20px 80px rgba(0, 0, 0, 0.4)',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '24px',
          borderBottom: `2px solid ${theme.border}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <h2 style={{
            color: theme.textPrimary,
            fontSize: '24px',
            fontWeight: '700',
            margin: 0,
          }}>
            📖 Edit Story: {story.title}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: theme.textSecondary,
            }}
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: '0',
          borderBottom: `2px solid ${theme.border}`,
          padding: '0',
        }}>
          <button
            onClick={() => setActiveTab('info')}
            style={{
              flex: 1,
              padding: '12px 16px',
              background: activeTab === 'info' ? theme.accentPrimary : 'transparent',
              color: activeTab === 'info' ? '#fff' : theme.textSecondary,
              border: 'none',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '600',
              transition: 'all 0.2s ease',
            }}
          >
            ℹ️ Story Info
          </button>
          <button
            onClick={() => setActiveTab('chapters')}
            style={{
              flex: 1,
              padding: '12px 16px',
              background: activeTab === 'chapters' ? theme.accentPrimary : 'transparent',
              color: activeTab === 'chapters' ? '#fff' : theme.textSecondary,
              border: 'none',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '600',
              transition: 'all 0.2s ease',
            }}
          >
            📚 Chapters ({chapters.length})
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            style={{
              flex: 1,
              padding: '12px 16px',
              background: activeTab === 'preview' ? theme.accentPrimary : 'transparent',
              color: activeTab === 'preview' ? '#fff' : theme.textSecondary,
              border: 'none',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '600',
              transition: 'all 0.2s ease',
            }}
          >
            👁️ Preview
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: 'auto', padding: '24px' }}>
          {error && (
            <div style={{
              background: '#FF6B6B25',
              color: '#FF6B6B',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '16px',
              fontSize: '13px',
              fontWeight: '600',
            }}>
              {error}
            </div>
          )}

          {success && (
            <div style={{
              background: '#4ECDC425',
              color: '#4ECDC4',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '16px',
              fontSize: '13px',
              fontWeight: '600',
            }}>
              ✅ Changes saved successfully!
            </div>
          )}

          {activeTab === 'info' && (
            <div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  color: theme.textPrimary,
                  fontSize: '12px',
                  fontWeight: '600',
                  display: 'block',
                  marginBottom: '6px',
                }}>
                  Story Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: theme.background,
                    border: `2px solid ${theme.border}`,
                    borderRadius: '6px',
                    color: theme.textPrimary,
                    fontSize: '13px',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <label style={{
                    color: theme.textPrimary,
                    fontSize: '12px',
                    fontWeight: '600',
                    display: 'block',
                    marginBottom: '6px',
                  }}>
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      background: theme.background,
                      border: `2px solid ${theme.border}`,
                      borderRadius: '6px',
                      color: theme.textPrimary,
                      fontSize: '13px',
                      fontFamily: 'inherit',
                      boxSizing: 'border-box',
                    }}
                  >
                    <option value="">Select Category</option>
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{
                    color: theme.textPrimary,
                    fontSize: '12px',
                    fontWeight: '600',
                    display: 'block',
                    marginBottom: '6px',
                  }}>
                    Audience
                  </label>
                  <select
                    value={formData.audience}
                    onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      background: theme.background,
                      border: `2px solid ${theme.border}`,
                      borderRadius: '6px',
                      color: theme.textPrimary,
                      fontSize: '13px',
                      fontFamily: 'inherit',
                      boxSizing: 'border-box',
                    }}
                  >
                    <option value="">Select Audience</option>
                    {AUDIENCES.map(aud => (
                      <option key={aud} value={aud}>{aud}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'chapters' && (
            <div>
              {!editingChapter ? (
                <>
                  <button
                    onClick={handleAddChapter}
                    style={{
                      padding: '10px 16px',
                      background: theme.accentPrimary,
                      color: '#fff',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      marginBottom: '16px',
                    }}
                  >
                    ➕ Add Chapter
                  </button>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {chapters.length === 0 ? (
                      <div style={{
                        color: theme.textSecondary,
                        fontSize: '13px',
                        padding: '20px',
                        textAlign: 'center',
                        background: theme.background,
                        borderRadius: '6px',
                      }}>
                        No chapters yet. Click "Add Chapter" to create one.
                      </div>
                    ) : (
                      chapters.map((chapter) => (
                        <div
                          key={chapter.id}
                          style={{
                            padding: '12px',
                            background: theme.background,
                            border: `1px solid ${theme.border}`,
                            borderRadius: '6px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <div style={{ flex: 1 }}>
                            <div style={{
                              color: theme.textPrimary,
                              fontSize: '13px',
                              fontWeight: '600',
                            }}>
                              Ch. {chapter.order}: {chapter.title}
                            </div>
                            <div style={{
                              color: theme.textSecondary,
                              fontSize: '11px',
                              marginTop: '4px',
                            }}>
                              {chapter.description || 'No description'}
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button
                              onClick={() => setEditingChapter(chapter)}
                              style={{
                                padding: '6px 12px',
                                background: theme.accentPrimary,
                                color: '#fff',
                                border: 'none',
                                borderRadius: '4px',
                                fontSize: '11px',
                                fontWeight: '600',
                                cursor: 'pointer',
                              }}
                            >
                              ✏️ Edit
                            </button>
                            <button
                              onClick={() => handleDeleteChapter(chapter.id)}
                              style={{
                                padding: '6px 12px',
                                background: '#FF6B6B',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '4px',
                                fontSize: '11px',
                                fontWeight: '600',
                                cursor: 'pointer',
                              }}
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </>
              ) : (
                /* Inline Chapter Editor */
                <div>
                  <button
                    onClick={() => setEditingChapter(null)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: theme.accentPrimary,
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      marginBottom: '16px',
                      padding: '0',
                    }}
                  >
                    ← Back to Chapters
                  </button>

                  <div style={{
                    padding: '16px',
                    background: theme.background,
                    border: `2px solid ${theme.border}`,
                    borderRadius: '8px',
                  }}>
                    <h3 style={{
                      color: theme.textPrimary,
                      fontSize: '16px',
                      fontWeight: '700',
                      margin: '0 0 16px 0',
                    }}>
                      ✏️ Edit Chapter
                    </h3>

                    <div style={{ marginBottom: '16px' }}>
                      <label style={{
                        color: theme.textPrimary,
                        fontSize: '12px',
                        fontWeight: '600',
                        display: 'block',
                        marginBottom: '6px',
                      }}>
                        Chapter Title
                      </label>
                      <input
                        type="text"
                        value={editingChapter.title || ''}
                        onChange={(e) => setEditingChapter({ ...editingChapter, title: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          background: theme.surfacePrimary,
                          border: `2px solid ${theme.border}`,
                          borderRadius: '6px',
                          color: theme.textPrimary,
                          fontSize: '13px',
                          fontFamily: 'inherit',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                      <label style={{
                        color: theme.textPrimary,
                        fontSize: '12px',
                        fontWeight: '600',
                        display: 'block',
                        marginBottom: '6px',
                      }}>
                        Description
                      </label>
                      <textarea
                        value={editingChapter.description || ''}
                        onChange={(e) => setEditingChapter({ ...editingChapter, description: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          background: theme.surfacePrimary,
                          border: `2px solid ${theme.border}`,
                          borderRadius: '6px',
                          color: theme.textPrimary,
                          fontSize: '13px',
                          fontFamily: 'inherit',
                          boxSizing: 'border-box',
                          minHeight: '80px',
                          resize: 'vertical',
                        }}
                        placeholder="Chapter description..."
                      />
                    </div>

                    {/* Rich Content Editor */}
                    <div style={{ marginBottom: '16px' }}>
                      <h4 style={{
                        color: theme.textPrimary,
                        fontSize: '13px',
                        fontWeight: '600',
                        marginBottom: '12px',
                        marginTop: '0',
                      }}>
                        📝 Chapter Content
                      </h4>
                      <ChapterContentEditor
                        contentBlocks={editingChapter.contentBlocks || []}
                        onChange={(contentBlocks) => setEditingChapter({ ...editingChapter, contentBlocks })}
                      />
                    </div>

                    <div style={{
                      display: 'flex',
                      gap: '8px',
                      marginTop: '16px',
                    }}>
                      <button
                        onClick={() => handleSaveChapter(editingChapter)}
                        style={{
                          padding: '10px 16px',
                          background: theme.accentPrimary,
                          color: '#fff',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '13px',
                          fontWeight: '600',
                          cursor: 'pointer',
                        }}
                      >
                        💾 Save Chapter
                      </button>
                      <button
                        onClick={() => setEditingChapter(null)}
                        style={{
                          padding: '10px 16px',
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
                </div>
              )}
            </div>
          )}

          {activeTab === 'preview' && (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <StoryReaderPreview
                story={formData}
                chapters={chapters}
                editingChapter={editingChapter}
                onChapterSelect={(chapter) => {
                  // Can handle chapter selection from preview if needed
                }}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 24px',
          borderTop: `2px solid ${theme.border}`,
          display: 'flex',
          gap: '8px',
          justifyContent: 'flex-end',
        }}>
          {activeTab === 'info' && (
            <>
              <button
                onClick={handleSave}
                disabled={loading}
                style={{
                  padding: '10px 24px',
                  background: theme.accentPrimary,
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.6 : 1,
                }}
              >
                {loading ? '💾 Saving...' : '💾 Save Changes'}
              </button>
            </>
          )}
          <button
            onClick={onClose}
            style={{
              padding: '10px 24px',
              background: 'transparent',
              color: theme.textPrimary,
              border: `2px solid ${theme.border}`,
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoryEditModal;
