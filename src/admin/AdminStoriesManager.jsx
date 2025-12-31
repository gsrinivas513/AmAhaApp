import React, { useState } from 'react';
import SiteLayout from '../layouts/SiteLayout';
import { useTheme } from '../context/ThemeContext';

export default function AdminStoriesManager() {
  const { theme } = useTheme();
  const [stories, setStories] = useState([
    {
      id: 1,
      title: 'The Lost Kingdom',
      category: 'Adventure',
      audience: 'Students 13-18',
      chapters: 12,
      status: 'Published',
      createdDate: '2024-01-15',
      reads: 523,
    },
    {
      id: 2,
      title: 'Mystery at Midnight',
      category: 'Mystery',
      audience: 'All Users',
      chapters: 8,
      status: 'Draft',
      createdDate: '2024-01-14',
      reads: 0,
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    audience: '',
    chapters: '',
  });

  const CATEGORIES = ['Adventure', 'Mystery', 'Science', 'Fantasy', 'History', 'Educational'];
  const AUDIENCES = ['All Users', 'Kids 5-12', 'Students 13-18', 'Professionals', 'Programmers'];

  const handleAddStory = () => {
    if (formData.title && formData.category && formData.audience) {
      const newStory = {
        id: Date.now(),
        ...formData,
        chapters: parseInt(formData.chapters) || 0,
        status: 'Draft',
        createdDate: new Date().toISOString().split('T')[0],
        reads: 0,
      };
      setStories([newStory, ...stories]);
      setFormData({ title: '', category: '', audience: '', chapters: '' });
      setShowAddForm(false);
    }
  };

  const handleDelete = (id) => {
    setStories(stories.filter(s => s.id !== id));
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Adventure': '⛵',
      'Mystery': '🔍',
      'Science': '🔬',
      'Fantasy': '✨',
      'History': '📜',
      'Educational': '📚',
    };
    return icons[category] || '📖';
  };

  return (
    <SiteLayout>
      <div style={{
        background: theme.background,
        minHeight: '100vh',
        padding: '40px 20px',
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
        }}>
          {/* Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '40px',
            flexWrap: 'wrap',
            gap: '16px',
          }}>
            <div>
              <h1 style={{
                color: theme.textPrimary,
                fontSize: '32px',
                fontWeight: '800',
                margin: '0 0 8px 0',
              }}>
                📖 Manage Stories
              </h1>
              <p style={{
                color: theme.textSecondary,
                margin: '0',
              }}>
                Create, edit, and publish stories with chapter management
              </p>
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              style={{
                padding: '12px 32px',
                background: `linear-gradient(135deg, ${theme.accentPrimary}, ${theme.accentSecondary})`,
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              ➕ Create New Story
            </button>
          </div>

          {/* Add Form */}
          {showAddForm && (
            <div style={{
              background: theme.surfacePrimary,
              border: `2px solid ${theme.border}`,
              borderRadius: '16px',
              padding: '32px',
              marginBottom: '40px',
            }}>
              <h2 style={{
                color: theme.textPrimary,
                fontSize: '20px',
                fontWeight: '700',
                marginBottom: '24px',
              }}>
                Create New Story
              </h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '16px',
                marginBottom: '24px',
              }}>
                <div>
                  <label style={{
                    color: theme.textSecondary,
                    fontSize: '13px',
                    fontWeight: '600',
                    display: 'block',
                    marginBottom: '8px',
                  }}>
                    Story Title
                  </label>
                  <input
                    type="text"
                    placeholder="Enter story title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: theme.background,
                      border: `2px solid ${theme.border}`,
                      borderRadius: '8px',
                      color: theme.textPrimary,
                      fontSize: '14px',
                      fontFamily: 'inherit',
                    }}
                  />
                </div>
                <div>
                  <label style={{
                    color: theme.textSecondary,
                    fontSize: '13px',
                    fontWeight: '600',
                    display: 'block',
                    marginBottom: '8px',
                  }}>
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: theme.background,
                      border: `2px solid ${theme.border}`,
                      borderRadius: '8px',
                      color: theme.textPrimary,
                      fontSize: '14px',
                      fontFamily: 'inherit',
                    }}
                  >
                    <option value="">Select category</option>
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{
                    color: theme.textSecondary,
                    fontSize: '13px',
                    fontWeight: '600',
                    display: 'block',
                    marginBottom: '8px',
                  }}>
                    Audience
                  </label>
                  <select
                    value={formData.audience}
                    onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: theme.background,
                      border: `2px solid ${theme.border}`,
                      borderRadius: '8px',
                      color: theme.textPrimary,
                      fontSize: '14px',
                      fontFamily: 'inherit',
                    }}
                  >
                    <option value="">Select audience</option>
                    {AUDIENCES.map(aud => (
                      <option key={aud} value={aud}>{aud}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{
                    color: theme.textSecondary,
                    fontSize: '13px',
                    fontWeight: '600',
                    display: 'block',
                    marginBottom: '8px',
                  }}>
                    Number of Chapters
                  </label>
                  <input
                    type="number"
                    placeholder="5"
                    value={formData.chapters}
                    onChange={(e) => setFormData({ ...formData, chapters: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: theme.background,
                      border: `2px solid ${theme.border}`,
                      borderRadius: '8px',
                      color: theme.textPrimary,
                      fontSize: '14px',
                      fontFamily: 'inherit',
                    }}
                  />
                </div>
              </div>
              <div style={{
                display: 'flex',
                gap: '12px',
              }}>
                <button
                  onClick={handleAddStory}
                  style={{
                    padding: '12px 32px',
                    background: `linear-gradient(135deg, ${theme.accentPrimary}, ${theme.accentSecondary})`,
                    color: '#fff',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '15px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  Create Story
                </button>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setFormData({ title: '', category: '', audience: '', chapters: '' });
                  }}
                  style={{
                    padding: '12px 32px',
                    background: 'transparent',
                    color: theme.textPrimary,
                    border: `2px solid ${theme.border}`,
                    borderRadius: '10px',
                    fontSize: '15px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Stories List */}
          <div style={{
            display: 'grid',
            gap: '16px',
          }}>
            {stories.map(story => (
              <div
                key={story.id}
                style={{
                  background: theme.surfacePrimary,
                  border: `2px solid ${theme.border}`,
                  borderRadius: '12px',
                  padding: '20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '16px',
                }}
              >
                <div style={{
                  display: 'flex',
                  gap: '16px',
                  alignItems: 'center',
                  flex: 1,
                  minWidth: '200px',
                }}>
                  <div style={{
                    fontSize: '32px',
                  }}>
                    {getCategoryIcon(story.category)}
                  </div>
                  <div>
                    <h3 style={{
                      color: theme.textPrimary,
                      fontSize: '16px',
                      fontWeight: '700',
                      margin: '0 0 8px 0',
                    }}>
                      {story.title}
                    </h3>
                    <div style={{
                      display: 'flex',
                      gap: '16px',
                      flexWrap: 'wrap',
                      fontSize: '13px',
                      color: theme.textSecondary,
                    }}>
                      <span>📖 {story.chapters} chapters</span>
                      <span>👥 {story.audience}</span>
                      <span>📊 {story.reads} reads</span>
                    </div>
                  </div>
                </div>
                <div style={{
                  display: 'flex',
                  gap: '8px',
                  flexWrap: 'wrap',
                }}>
                  <span style={{
                    padding: '6px 12px',
                    background: `${theme.accentPrimary}25`,
                    color: theme.accentPrimary,
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '600',
                  }}>
                    {story.category}
                  </span>
                  <span style={{
                    padding: '6px 12px',
                    background: story.status === 'Published' ? '#4ECDC425' : '#FFE66D25',
                    color: story.status === 'Published' ? '#4ECDC4' : '#FFE66D',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '600',
                  }}>
                    {story.status}
                  </span>
                </div>
                <div style={{
                  display: 'flex',
                  gap: '8px',
                }}>
                  <button
                    style={{
                      padding: '8px 16px',
                      background: 'transparent',
                      color: theme.accentPrimary,
                      border: `2px solid ${theme.accentPrimary}`,
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer',
                    }}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(story.id)}
                    style={{
                      padding: '8px 16px',
                      background: '#FF6B6B25',
                      color: '#FF6B6B',
                      border: '2px solid #FF6B6B',
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer',
                    }}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
