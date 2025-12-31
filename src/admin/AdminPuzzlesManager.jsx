import React, { useState } from 'react';
import SiteLayout from '../layouts/SiteLayout';
import { useTheme } from '../context/ThemeContext';

export default function AdminPuzzlesManager() {
  const { theme } = useTheme();
  const [puzzles, setPuzzles] = useState([
    {
      id: 1,
      title: 'Classic Jigsaw Challenge',
      type: 'Jigsaw',
      audience: 'All Users',
      pieces: 500,
      difficulty: 'Medium',
      status: 'Published',
      createdDate: '2024-01-15',
      plays: 342,
    },
    {
      id: 2,
      title: 'Expert Sudoku Grid',
      type: 'Sudoku',
      audience: 'Professionals',
      pieces: 81,
      difficulty: 'Hard',
      status: 'Published',
      createdDate: '2024-01-14',
      plays: 198,
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    audience: '',
    pieces: '',
    difficulty: '',
  });

  const PUZZLE_TYPES = ['Jigsaw', 'Sudoku', 'Crossword', 'Logic', 'Matching', 'Pattern'];
  const AUDIENCES = ['All Users', 'Kids 5-12', 'Students 13-18', 'Professionals', 'Programmers'];
  const DIFFICULTIES = ['Easy', 'Medium', 'Hard', 'Expert'];

  const handleAddPuzzle = () => {
    if (formData.title && formData.type && formData.audience) {
      const newPuzzle = {
        id: Date.now(),
        ...formData,
        pieces: parseInt(formData.pieces) || 0,
        status: 'Draft',
        createdDate: new Date().toISOString().split('T')[0],
        plays: 0,
      };
      setPuzzles([newPuzzle, ...puzzles]);
      setFormData({ title: '', type: '', audience: '', pieces: '', difficulty: '' });
      setShowAddForm(false);
    }
  };

  const handleDelete = (id) => {
    setPuzzles(puzzles.filter(p => p.id !== id));
  };

  const getPuzzleIcon = (type) => {
    const icons = {
      'Jigsaw': '🧩',
      'Sudoku': '🔢',
      'Crossword': '◼️',
      'Logic': '🧠',
      'Matching': '🎯',
      'Pattern': '🎨',
    };
    return icons[type] || '🧩';
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
                🧩 Manage Puzzles
              </h1>
              <p style={{
                color: theme.textSecondary,
                margin: '0',
              }}>
                Create, edit, and manage puzzle content
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
              ➕ Add New Puzzle
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
                Create New Puzzle
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
                    Puzzle Title
                  </label>
                  <input
                    type="text"
                    placeholder="Enter puzzle title"
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
                    Puzzle Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
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
                    <option value="">Select type</option>
                    {PUZZLE_TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
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
                    Number of Pieces
                  </label>
                  <input
                    type="number"
                    placeholder="500"
                    value={formData.pieces}
                    onChange={(e) => setFormData({ ...formData, pieces: e.target.value })}
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
                  onClick={handleAddPuzzle}
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
                  Save Puzzle
                </button>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setFormData({ title: '', type: '', audience: '', pieces: '', difficulty: '' });
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

          {/* Puzzles List */}
          <div style={{
            display: 'grid',
            gap: '16px',
          }}>
            {puzzles.map(puzzle => (
              <div
                key={puzzle.id}
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
                    {getPuzzleIcon(puzzle.type)}
                  </div>
                  <div>
                    <h3 style={{
                      color: theme.textPrimary,
                      fontSize: '16px',
                      fontWeight: '700',
                      margin: '0 0 8px 0',
                    }}>
                      {puzzle.title}
                    </h3>
                    <div style={{
                      display: 'flex',
                      gap: '16px',
                      flexWrap: 'wrap',
                      fontSize: '13px',
                      color: theme.textSecondary,
                    }}>
                      <span>🧩 {puzzle.pieces} pieces</span>
                      <span>👥 {puzzle.audience}</span>
                      <span>📊 {puzzle.plays} plays</span>
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
                    {puzzle.type}
                  </span>
                  <span style={{
                    padding: '6px 12px',
                    background: puzzle.status === 'Published' ? '#4ECDC425' : '#FFE66D25',
                    color: puzzle.status === 'Published' ? '#4ECDC4' : '#FFE66D',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '600',
                  }}>
                    {puzzle.status}
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
                    onClick={() => handleDelete(puzzle.id)}
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
