// src/admin/SeriesManagementPage.jsx
// Admin page for managing puzzle series

import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthProvider';
import AdminLayout from './AdminLayout';
import {
  createSeries,
  getAllSeries,
  getSeriesById,
  updateSeries,
  deleteSeries,
  addPuzzleToSeries,
  removePuzzleFromSeries,
  getSeriesPuzzles,
} from '../services/seriesService';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import './styles/series-management.css';

function SeriesManagementPage() {
  const { user } = useAuth();
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSeries, setSelectedSeries] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '📚',
    color: '#FF6633',
    published: false,
  });
  const [availablePuzzles, setAvailablePuzzles] = useState([]);
  const [seriesPuzzles, setSeriesPuzzles] = useState([]);
  const [theme, setTheme] = useState('light');

  // Load theme preference
  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true';
    setTheme(isDark ? 'dark' : 'light');
  }, []);

  // Load all series
  useEffect(() => {
    loadSeries();
  }, []);

  const loadSeries = async () => {
    try {
      setLoading(true);
      const allSeries = await getAllSeries();
      setSeries(allSeries);
    } catch (error) {
      console.error('Error loading series:', error);
      alert('Failed to load series');
    } finally {
      setLoading(false);
    }
  };

  // Load available puzzles (quizzes + visual puzzles)
  const loadAvailablePuzzles = async () => {
    try {
      const puzzles = [];

      // Get quizzes
      const quizzesSnap = await getDocs(collection(db, 'quizzes'));
      quizzesSnap.docs.forEach((doc) => {
        puzzles.push({
          id: doc.id,
          title: doc.data().title,
          type: 'quiz',
          icon: '📝',
        });
      });

      // Get visual puzzles
      const visualSnap = await getDocs(collection(db, 'visual_puzzles'));
      visualSnap.docs.forEach((doc) => {
        puzzles.push({
          id: doc.id,
          title: doc.data().title,
          type: 'visual',
          icon: '🧩',
        });
      });

      setAvailablePuzzles(puzzles);
    } catch (error) {
      console.error('Error loading puzzles:', error);
    }
  };

  // Load series puzzles
  const loadSeriesPuzzles = async (seriesId) => {
    try {
      const puzzles = await getSeriesPuzzles(seriesId);
      setSeriesPuzzles(puzzles);
    } catch (error) {
      console.error('Error loading series puzzles:', error);
    }
  };

  // Handle series selection
  const handleSelectSeries = async (s) => {
    setSelectedSeries(s);
    await loadSeriesPuzzles(s.id);
    await loadAvailablePuzzles();
  };

  // Handle create series
  const handleCreateSeries = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Series name is required');
      return;
    }

    try {
      setLoading(true);
      await createSeries({
        ...formData,
        owner: user?.uid || 'unknown',
        puzzles: [],
      });
      alert('Series created successfully!');
      setFormData({ name: '', description: '', icon: '📚', color: '#FF6633', published: false });
      setShowCreateForm(false);
      await loadSeries();
    } catch (error) {
      console.error('Error creating series:', error);
      alert('Failed to create series');
    } finally {
      setLoading(false);
    }
  };

  // Handle update series
  const handleUpdateSeries = async (e) => {
    e.preventDefault();
    if (!selectedSeries) return;

    try {
      setLoading(true);
      await updateSeries(selectedSeries.id, formData);
      alert('Series updated successfully!');
      setShowEditForm(false);
      await loadSeries();
      setSelectedSeries(null);
    } catch (error) {
      console.error('Error updating series:', error);
      alert('Failed to update series');
    } finally {
      setLoading(false);
    }
  };

  // Handle delete series
  const handleDeleteSeries = async (seriesId) => {
    if (!window.confirm('Are you sure you want to delete this series? This will not delete the puzzles.')) {
      return;
    }

    try {
      setLoading(true);
      await deleteSeries(seriesId);
      alert('Series deleted successfully!');
      await loadSeries();
      setSelectedSeries(null);
    } catch (error) {
      console.error('Error deleting series:', error);
      alert('Failed to delete series');
    } finally {
      setLoading(false);
    }
  };

  // Handle add puzzle to series
  const handleAddPuzzle = async (puzzleId) => {
    if (!selectedSeries) return;

    try {
      await addPuzzleToSeries(selectedSeries.id, puzzleId);
      await loadSeriesPuzzles(selectedSeries.id);
      alert('Puzzle added to series!');
    } catch (error) {
      console.error('Error adding puzzle:', error);
      alert('Failed to add puzzle');
    }
  };

  // Handle remove puzzle from series
  const handleRemovePuzzle = async (puzzleId) => {
    if (!selectedSeries) return;

    try {
      await removePuzzleFromSeries(selectedSeries.id, puzzleId);
      await loadSeriesPuzzles(selectedSeries.id);
      alert('Puzzle removed from series!');
    } catch (error) {
      console.error('Error removing puzzle:', error);
      alert('Failed to remove puzzle');
    }
  };

  const isDark = theme === 'dark';
  const bgColor = isDark ? '#1a1f3a' : '#f5f8ff';
  const cardBg = isDark ? 'rgba(30, 40, 70, 0.6)' : '#ffffff';
  const textColor = isDark ? '#e0e0e0' : '#333';
  const borderColor = isDark ? 'rgba(255, 255, 255, 0.1)' : '#e0e0e0';

  return (
    <AdminLayout>
      <div className="series-management" style={{ color: textColor }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>
            📚 Puzzle Series Management
          </h1>
          <p style={{ color: isDark ? '#aaa' : '#666', fontSize: '14px' }}>
            Organize puzzles into collections, set series-level settings, and manage puzzle availability
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
          {/* Series List */}
          <div style={{
            background: cardBg,
            border: `1px solid ${borderColor}`,
            borderRadius: '12px',
            padding: '20px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold' }}>Series List</h3>
              <button
                onClick={() => {
                  setShowCreateForm(true);
                  setShowEditForm(false);
                  setFormData({ name: '', description: '', icon: '📚', color: '#FF6633', published: false });
                }}
                style={{
                  padding: '8px 16px',
                  background: '#FF6633',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                }}
              >
                + New Series
              </button>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', color: '#999', padding: '20px' }}>Loading...</div>
            ) : (
              <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                {series.length === 0 ? (
                  <div style={{ textAlign: 'center', color: '#999', padding: '20px' }}>
                    No series yet
                  </div>
                ) : (
                  series.map((s) => (
                    <div
                      key={s.id}
                      onClick={() => handleSelectSeries(s)}
                      style={{
                        padding: '12px',
                        marginBottom: '8px',
                        background: selectedSeries?.id === s.id ? '#FF663320' : 'transparent',
                        border: `2px solid ${selectedSeries?.id === s.id ? '#FF6633' : 'transparent'}`,
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseOver={(e) => {
                        if (selectedSeries?.id !== s.id) {
                          e.currentTarget.style.background = isDark ? 'rgba(255,102,51,0.1)' : 'rgba(255,102,51,0.05)';
                        }
                      }}
                      onMouseOut={(e) => {
                        if (selectedSeries?.id !== s.id) {
                          e.currentTarget.style.background = 'transparent';
                        }
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{ fontSize: '18px' }}>{s.icon}</span>
                        <span style={{ fontWeight: 'bold' }}>{s.name}</span>
                        {s.published && (
                          <span style={{
                            fontSize: '10px',
                            padding: '2px 6px',
                            background: '#4ECB71',
                            color: '#fff',
                            borderRadius: '4px',
                            marginLeft: 'auto',
                          }}>
                            Published
                          </span>
                        )}
                      </div>
                      <p style={{ fontSize: '12px', color: isDark ? '#aaa' : '#666', margin: 0 }}>
                        {s.puzzleCount || 0} puzzles
                      </p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Details Panel */}
          <div>
            {showCreateForm && (
              <div style={{
                background: cardBg,
                border: `1px solid ${borderColor}`,
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '24px',
              }}>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '16px' }}>Create New Series</h3>
                <form onSubmit={handleCreateSeries} style={{ display: 'grid', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>
                      Series Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Morning Puzzles"
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: `1px solid ${borderColor}`,
                        borderRadius: '6px',
                        background: isDark ? '#1a2540' : '#f9f9f9',
                        color: textColor,
                        fontSize: '14px',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Describe this series"
                      rows={3}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: `1px solid ${borderColor}`,
                        borderRadius: '6px',
                        background: isDark ? '#1a2540' : '#f9f9f9',
                        color: textColor,
                        fontSize: '14px',
                        fontFamily: 'inherit',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>
                        Icon
                      </label>
                      <input
                        type="text"
                        value={formData.icon}
                        onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          border: `1px solid ${borderColor}`,
                          borderRadius: '6px',
                          background: isDark ? '#1a2540' : '#f9f9f9',
                          color: textColor,
                          fontSize: '14px',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>
                        Color
                      </label>
                      <input
                        type="color"
                        value={formData.color}
                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                        style={{
                          width: '100%',
                          height: '38px',
                          border: `1px solid ${borderColor}`,
                          borderRadius: '6px',
                          cursor: 'pointer',
                        }}
                      />
                    </div>
                  </div>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="checkbox"
                      checked={formData.published}
                      onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    />
                    <span style={{ fontSize: '12px' }}>Publish (visible to public)</span>
                  </label>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="submit"
                      disabled={loading}
                      style={{
                        flex: 1,
                        padding: '10px',
                        background: '#FF6633',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '6px',
                        fontWeight: 'bold',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        opacity: loading ? 0.6 : 1,
                      }}
                    >
                      Create Series
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCreateForm(false)}
                      style={{
                        flex: 1,
                        padding: '10px',
                        background: isDark ? '#2a3550' : '#f0f0f0',
                        color: textColor,
                        border: 'none',
                        borderRadius: '6px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {selectedSeries && !showCreateForm && (
              <div>
                {/* Series Details */}
                {!showEditForm && (
                  <div style={{
                    background: cardBg,
                    border: `1px solid ${borderColor}`,
                    borderRadius: '12px',
                    padding: '20px',
                    marginBottom: '24px',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '32px' }}>{selectedSeries.icon}</span>
                        <div>
                          <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: '0 0 4px 0' }}>
                            {selectedSeries.name}
                          </h2>
                          {selectedSeries.published && (
                            <span style={{
                              fontSize: '12px',
                              padding: '4px 8px',
                              background: '#4ECB71',
                              color: '#fff',
                              borderRadius: '4px',
                              display: 'inline-block',
                            }}>
                              Published
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setShowEditForm(true);
                          setFormData(selectedSeries);
                        }}
                        style={{
                          padding: '8px 16px',
                          background: '#FF6633',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                        }}
                      >
                        Edit
                      </button>
                    </div>

                    {selectedSeries.description && (
                      <p style={{ color: isDark ? '#aaa' : '#666', marginBottom: '16px', fontSize: '14px' }}>
                        {selectedSeries.description}
                      </p>
                    )}

                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr 1fr',
                      gap: '12px',
                      padding: '16px 0',
                      borderTop: `1px solid ${borderColor}`,
                      borderBottom: `1px solid ${borderColor}`,
                      marginBottom: '16px',
                    }}>
                      <div>
                        <p style={{ fontSize: '12px', color: isDark ? '#aaa' : '#666', margin: '0 0 4px 0' }}>
                          Puzzles
                        </p>
                        <p style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>
                          {selectedSeries.puzzleCount || 0}
                        </p>
                      </div>
                      <div>
                        <p style={{ fontSize: '12px', color: isDark ? '#aaa' : '#666', margin: '0 0 4px 0' }}>
                          Created
                        </p>
                        <p style={{ fontSize: '12px', margin: 0 }}>
                          {selectedSeries.createdAt
                            ? new Date(selectedSeries.createdAt.toDate?.() || selectedSeries.createdAt).toLocaleDateString()
                            : 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p style={{ fontSize: '12px', color: isDark ? '#aaa' : '#666', margin: '0 0 4px 0' }}>
                          Updated
                        </p>
                        <p style={{ fontSize: '12px', margin: 0 }}>
                          {selectedSeries.updatedAt
                            ? new Date(selectedSeries.updatedAt.toDate?.() || selectedSeries.updatedAt).toLocaleDateString()
                            : 'N/A'}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteSeries(selectedSeries.id)}
                      style={{
                        padding: '8px 16px',
                        background: '#ff4444',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                      }}
                    >
                      Delete Series
                    </button>
                  </div>
                )}

                {/* Edit Form */}
                {showEditForm && (
                  <div style={{
                    background: cardBg,
                    border: `1px solid ${borderColor}`,
                    borderRadius: '12px',
                    padding: '20px',
                    marginBottom: '24px',
                  }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '16px' }}>Edit Series</h3>
                    <form onSubmit={handleUpdateSeries} style={{ display: 'grid', gap: '12px' }}>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>
                          Series Name
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            border: `1px solid ${borderColor}`,
                            borderRadius: '6px',
                            background: isDark ? '#1a2540' : '#f9f9f9',
                            color: textColor,
                            fontSize: '14px',
                            boxSizing: 'border-box',
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>
                          Description
                        </label>
                        <textarea
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          rows={3}
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            border: `1px solid ${borderColor}`,
                            borderRadius: '6px',
                            background: isDark ? '#1a2540' : '#f9f9f9',
                            color: textColor,
                            fontSize: '14px',
                            fontFamily: 'inherit',
                            boxSizing: 'border-box',
                          }}
                        />
                      </div>

                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <input
                          type="checkbox"
                          checked={formData.published}
                          onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                        />
                        <span style={{ fontSize: '12px' }}>Publish (visible to public)</span>
                      </label>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          type="submit"
                          disabled={loading}
                          style={{
                            flex: 1,
                            padding: '10px',
                            background: '#FF6633',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '6px',
                            fontWeight: 'bold',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            opacity: loading ? 0.6 : 1,
                          }}
                        >
                          Save Changes
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowEditForm(false)}
                          style={{
                            flex: 1,
                            padding: '10px',
                            background: isDark ? '#2a3550' : '#f0f0f0',
                            color: textColor,
                            border: 'none',
                            borderRadius: '6px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Puzzles in Series */}
                {!showEditForm && (
                  <div style={{
                    background: cardBg,
                    border: `1px solid ${borderColor}`,
                    borderRadius: '12px',
                    padding: '20px',
                  }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '16px' }}>
                      Puzzles in Series ({seriesPuzzles.length})
                    </h3>

                    {seriesPuzzles.length === 0 ? (
                      <div style={{ textAlign: 'center', color: '#999', padding: '20px' }}>
                        No puzzles in this series yet
                      </div>
                    ) : (
                      <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '16px' }}>
                        {seriesPuzzles.map((puzzle) => (
                          <div
                            key={puzzle.id}
                            style={{
                              padding: '12px',
                              background: isDark ? '#1a2540' : '#f9f9f9',
                              border: `1px solid ${borderColor}`,
                              borderRadius: '6px',
                              marginBottom: '8px',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}
                          >
                            <div>
                              <p style={{ fontWeight: 'bold', margin: '0 0 4px 0' }}>
                                {puzzle.icon} {puzzle.title}
                              </p>
                              <p style={{ fontSize: '12px', color: isDark ? '#aaa' : '#666', margin: 0 }}>
                                {puzzle.type === 'quiz' ? 'Quiz' : 'Visual Puzzle'}
                              </p>
                            </div>
                            <button
                              onClick={() => handleRemovePuzzle(puzzle.id)}
                              style={{
                                padding: '6px 12px',
                                background: '#ff6b6b',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '4px',
                                fontSize: '12px',
                                cursor: 'pointer',
                              }}
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div style={{ paddingTop: '16px', borderTop: `1px solid ${borderColor}` }}>
                      <h4 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '12px' }}>
                        Add Puzzles
                      </h4>
                      <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                        {availablePuzzles
                          .filter((p) => !seriesPuzzles.some((sp) => sp.id === p.id))
                          .map((puzzle) => (
                            <div
                              key={puzzle.id}
                              style={{
                                padding: '10px',
                                background: isDark ? '#1a2540' : '#f9f9f9',
                                border: `1px solid ${borderColor}`,
                                borderRadius: '6px',
                                marginBottom: '8px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                              }}
                            >
                              <span style={{ fontSize: '12px' }}>
                                {puzzle.icon} {puzzle.title}
                              </span>
                              <button
                                onClick={() => handleAddPuzzle(puzzle.id)}
                                style={{
                                  padding: '4px 12px',
                                  background: '#4ECB71',
                                  color: '#fff',
                                  border: 'none',
                                  borderRadius: '4px',
                                  fontSize: '11px',
                                  cursor: 'pointer',
                                }}
                              >
                                Add
                              </button>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {!selectedSeries && !showCreateForm && (
              <div style={{
                background: cardBg,
                border: `1px solid ${borderColor}`,
                borderRadius: '12px',
                padding: '40px 20px',
                textAlign: 'center',
                color: isDark ? '#aaa' : '#666',
              }}>
                <p style={{ fontSize: '14px', margin: 0 }}>
                  Select a series from the list or create a new one
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default SeriesManagementPage;
