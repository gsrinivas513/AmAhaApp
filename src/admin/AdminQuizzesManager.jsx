import React, { useState } from 'react';
import SiteLayout from '../layouts/SiteLayout';
import { useTheme } from '../context/ThemeContext';

export default function AdminQuizzesManager() {
  const { theme } = useTheme();
  const [quizzes, setQuizzes] = useState([
    {
      id: 1,
      title: 'Science Basics Quiz',
      category: 'Science',
      audience: 'Kids 5-12',
      questions: 15,
      difficulty: 'Easy',
      status: 'Published',
      createdDate: '2024-01-15',
      plays: 234,
    },
    {
      id: 2,
      title: 'Math Algebra Challenge',
      category: 'Math',
      audience: 'Students 13-18',
      questions: 20,
      difficulty: 'Medium',
      status: 'Published',
      createdDate: '2024-01-14',
      plays: 567,
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    audience: '',
    questions: '',
    difficulty: '',
  });

  const CATEGORIES = ['Science', 'Math', 'History', 'Geography', 'Literature', 'Technology'];
  const AUDIENCES = ['All Users', 'Kids 5-12', 'Students 13-18', 'Professionals', 'Programmers'];
  const DIFFICULTIES = ['Easy', 'Medium', 'Hard', 'Expert'];

  const handleAddQuiz = () => {
    if (formData.title && formData.category && formData.audience) {
      const newQuiz = {
        id: Date.now(),
        ...formData,
        questions: parseInt(formData.questions) || 0,
        status: 'Draft',
        createdDate: new Date().toISOString().split('T')[0],
        plays: 0,
      };
      setQuizzes([newQuiz, ...quizzes]);
      setFormData({ title: '', category: '', audience: '', questions: '', difficulty: '' });
      setShowAddForm(false);
    }
  };

  const handleDelete = (id) => {
    setQuizzes(quizzes.filter(q => q.id !== id));
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
                ❓ Manage Quizzes
              </h1>
              <p style={{
                color: theme.textSecondary,
                margin: '0',
              }}>
                Create, edit, and manage quiz content
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
              ➕ Add New Quiz
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
                Create New Quiz
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
                    Quiz Title
                  </label>
                  <input
                    type="text"
                    placeholder="Enter quiz title"
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
                    Number of Questions
                  </label>
                  <input
                    type="number"
                    placeholder="10"
                    value={formData.questions}
                    onChange={(e) => setFormData({ ...formData, questions: e.target.value })}
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
                    Difficulty Level
                  </label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
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
                    <option value="">Select difficulty</option>
                    {DIFFICULTIES.map(diff => (
                      <option key={diff} value={diff}>{diff}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div style={{
                display: 'flex',
                gap: '12px',
              }}>
                <button
                  onClick={handleAddQuiz}
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
                  Save Quiz
                </button>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setFormData({ title: '', category: '', audience: '', questions: '', difficulty: '' });
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

          {/* Quizzes List */}
          <div style={{
            display: 'grid',
            gap: '16px',
          }}>
            {quizzes.map(quiz => (
              <div
                key={quiz.id}
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
                  flex: 1,
                  minWidth: '200px',
                }}>
                  <h3 style={{
                    color: theme.textPrimary,
                    fontSize: '16px',
                    fontWeight: '700',
                    margin: '0 0 8px 0',
                  }}>
                    {quiz.title}
                  </h3>
                  <div style={{
                    display: 'flex',
                    gap: '16px',
                    flexWrap: 'wrap',
                    fontSize: '13px',
                    color: theme.textSecondary,
                  }}>
                    <span>📚 {quiz.questions} questions</span>
                    <span>👥 {quiz.audience}</span>
                    <span>📊 {quiz.plays} plays</span>
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
                    {quiz.category}
                  </span>
                  <span style={{
                    padding: '6px 12px',
                    background: quiz.status === 'Published' ? '#4ECDC425' : '#FFE66D25',
                    color: quiz.status === 'Published' ? '#4ECDC4' : '#FFE66D',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '600',
                  }}>
                    {quiz.status}
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
                    onClick={() => handleDelete(quiz.id)}
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
