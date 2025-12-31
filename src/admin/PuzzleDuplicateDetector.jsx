/**
 * Puzzle Duplicate Detector & Cleaner
 * Identifies duplicate puzzles by title and helps remove them
 */

import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { db } from '../firebase/firebaseConfig';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

export default function PuzzleDuplicateDetector() {
  const { theme } = useTheme();
  const [puzzles, setPuzzles] = useState([]);
  const [duplicates, setDuplicates] = useState({});
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedForDelete, setSelectedForDelete] = useState([]);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  useEffect(() => {
    loadPuzzles();
  }, []);

  const loadPuzzles = async () => {
    try {
      setLoading(true);
      const puzzlesSnapshot = await getDocs(collection(db, 'puzzles'));
      const puzzlesData = puzzlesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPuzzles(puzzlesData);
      findDuplicates(puzzlesData);
    } catch (error) {
      console.error('Error loading puzzles:', error);
      setMessage('Error loading puzzles');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const findDuplicates = (puzzlesList) => {
    const titleMap = {};
    const dupsMap = {};

    // Group puzzles by title
    puzzlesList.forEach(puzzle => {
      const title = puzzle.title || 'Untitled';
      if (!titleMap[title]) {
        titleMap[title] = [];
      }
      titleMap[title].push(puzzle);
    });

    // Find titles with more than one puzzle
    Object.entries(titleMap).forEach(([title, puzzleGroup]) => {
      if (puzzleGroup.length > 1) {
        dupsMap[title] = puzzleGroup;
      }
    });

    setDuplicates(dupsMap);
  };

  const toggleSelectForDelete = (puzzleId) => {
    setSelectedForDelete(prev =>
      prev.includes(puzzleId)
        ? prev.filter(id => id !== puzzleId)
        : [...prev, puzzleId]
    );
  };

  const deletePuzzles = async () => {
    if (selectedForDelete.length === 0) {
      setMessage('Please select puzzles to delete');
      setMessageType('warning');
      return;
    }

    if (!window.confirm(`Are you sure you want to delete ${selectedForDelete.length} puzzle(s)? This action cannot be undone.`)) {
      return;
    }

    try {
      setDeleting(true);
      for (const puzzleId of selectedForDelete) {
        await deleteDoc(doc(db, 'puzzles', puzzleId));
      }
      setMessage(`Successfully deleted ${selectedForDelete.length} duplicate puzzle(s)`);
      setMessageType('success');
      setSelectedForDelete([]);
      await loadPuzzles();
    } catch (error) {
      console.error('Error deleting puzzles:', error);
      setMessage('Error deleting puzzles: ' + error.message);
      setMessageType('error');
    } finally {
      setDeleting(false);
    }
  };

  const selectKeepNewest = (title) => {
    const group = duplicates[title];
    if (!group || group.length === 0) return;

    // Sort by creation date (newest first)
    const sorted = [...group].sort((a, b) => {
      const dateA = a.createdAt instanceof Date ? a.createdAt : a.createdAt?.toDate?.() || new Date(0);
      const dateB = b.createdAt instanceof Date ? b.createdAt : b.createdAt?.toDate?.() || new Date(0);
      return new Date(dateB) - new Date(dateA);
    });

    // Mark all except the newest for deletion
    const idsToDelete = sorted.slice(1).map(p => p.id);
    setSelectedForDelete(prev => {
      const newSet = new Set(prev);
      idsToDelete.forEach(id => newSet.add(id));
      return Array.from(newSet);
    });
  };

  const selectKeepOldest = (title) => {
    const group = duplicates[title];
    if (!group || group.length === 0) return;

    // Sort by creation date (oldest first)
    const sorted = [...group].sort((a, b) => {
      const dateA = a.createdAt instanceof Date ? a.createdAt : a.createdAt?.toDate?.() || new Date(0);
      const dateB = b.createdAt instanceof Date ? b.createdAt : b.createdAt?.toDate?.() || new Date(0);
      return new Date(dateA) - new Date(dateB);
    });

    // Mark all except the oldest for deletion
    const idsToDelete = sorted.slice(1).map(p => p.id);
    setSelectedForDelete(prev => {
      const newSet = new Set(prev);
      idsToDelete.forEach(id => newSet.add(id));
      return Array.from(newSet);
    });
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    try {
      const date = timestamp instanceof Date ? timestamp : timestamp.toDate?.() || new Date(timestamp);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return 'N/A';
    }
  };

  const duplicateCount = Object.values(duplicates).reduce((sum, group) => sum + group.length - 1, 0);

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '24px',
      background: theme.background,
      minHeight: '100vh',
    }}>
      {/* Header */}
      <div style={{
        marginBottom: '24px',
      }}>
        <h1 style={{
          color: theme.textPrimary,
          fontSize: '28px',
          fontWeight: '700',
          margin: '0 0 8px 0',
        }}>
          🔍 Puzzle Duplicate Detector
        </h1>
        <p style={{
          color: theme.textSecondary,
          margin: '0',
        }}>
          Find and remove duplicate puzzles from your database
        </p>
      </div>

      {/* Message */}
      {message && (
        <div style={{
          padding: '12px 16px',
          borderRadius: '8px',
          marginBottom: '20px',
          background: messageType === 'success' ? '#d4edda' :
                     messageType === 'error' ? '#f8d7da' :
                     messageType === 'warning' ? '#fff3cd' : '#d1ecf1',
          color: messageType === 'success' ? '#155724' :
                messageType === 'error' ? '#721c24' :
                messageType === 'warning' ? '#856404' : '#0c5460',
          border: `1px solid ${messageType === 'success' ? '#c3e6cb' :
                             messageType === 'error' ? '#f5c6cb' :
                             messageType === 'warning' ? '#ffeaa7' : '#b8daff'}`,
        }}>
          {message}
        </div>
      )}

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '12px',
        marginBottom: '24px',
      }}>
        <div style={{
          background: theme.surfacePrimary,
          border: `2px solid ${theme.border}`,
          borderRadius: '8px',
          padding: '16px',
        }}>
          <div style={{ color: theme.textSecondary, fontSize: '12px', fontWeight: '600' }}>Total Puzzles</div>
          <div style={{ color: theme.textPrimary, fontSize: '24px', fontWeight: '700' }}>{puzzles.length}</div>
        </div>
        <div style={{
          background: theme.surfacePrimary,
          border: `2px solid #FF6B6B`,
          borderRadius: '8px',
          padding: '16px',
        }}>
          <div style={{ color: theme.textSecondary, fontSize: '12px', fontWeight: '600' }}>Duplicate Titles</div>
          <div style={{ color: '#FF6B6B', fontSize: '24px', fontWeight: '700' }}>{Object.keys(duplicates).length}</div>
        </div>
        <div style={{
          background: theme.surfacePrimary,
          border: `2px solid #FFA500`,
          borderRadius: '8px',
          padding: '16px',
        }}>
          <div style={{ color: theme.textSecondary, fontSize: '12px', fontWeight: '600' }}>Duplicate Copies</div>
          <div style={{ color: '#FFA500', fontSize: '24px', fontWeight: '700' }}>{duplicateCount}</div>
        </div>
        <div style={{
          background: theme.surfacePrimary,
          border: `2px solid ${selectedForDelete.length > 0 ? theme.accentPrimary : theme.border}`,
          borderRadius: '8px',
          padding: '16px',
        }}>
          <div style={{ color: theme.textSecondary, fontSize: '12px', fontWeight: '600' }}>Selected for Delete</div>
          <div style={{ color: selectedForDelete.length > 0 ? '#FF6B6B' : theme.textSecondary, fontSize: '24px', fontWeight: '700' }}>{selectedForDelete.length}</div>
        </div>
      </div>

      {/* Action Buttons */}
      {Object.keys(duplicates).length > 0 && (
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '24px',
          flexWrap: 'wrap',
        }}>
          <button
            onClick={() => {
              setSelectedForDelete([]);
              setMessage('Selection cleared');
              setMessageType('');
            }}
            style={{
              padding: '10px 16px',
              background: 'transparent',
              color: theme.textSecondary,
              border: `1px solid ${theme.border}`,
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            Clear Selection
          </button>
          <button
            onClick={deletePuzzles}
            disabled={selectedForDelete.length === 0 || deleting}
            style={{
              padding: '10px 16px',
              background: '#FF6B6B',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: deleting || selectedForDelete.length === 0 ? 'not-allowed' : 'pointer',
              opacity: deleting || selectedForDelete.length === 0 ? 0.6 : 1,
            }}
          >
            {deleting ? '⏳ Deleting...' : `🗑️ Delete ${selectedForDelete.length} Puzzle(s)`}
          </button>
        </div>
      )}

      {/* Duplicates List */}
      {loading ? (
        <div style={{ textAlign: 'center', color: theme.textSecondary, padding: '40px' }}>
          ⏳ Loading puzzles...
        </div>
      ) : Object.keys(duplicates).length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          background: theme.surfacePrimary,
          borderRadius: '8px',
          color: theme.textSecondary,
        }}>
          ✅ No duplicate puzzles found! Your database is clean.
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '20px' }}>
          {Object.entries(duplicates).map(([title, puzzleGroup]) => (
            <div
              key={title}
              style={{
                background: theme.surfacePrimary,
                border: `2px solid ${theme.border}`,
                borderRadius: '12px',
                padding: '16px',
                overflow: 'hidden',
              }}
            >
              {/* Title Section */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
                paddingBottom: '12px',
                borderBottom: `1px solid ${theme.border}`,
              }}>
                <h3 style={{
                  color: theme.textPrimary,
                  fontSize: '16px',
                  fontWeight: '700',
                  margin: '0',
                }}>
                  🧩 {title}
                </h3>
                <div style={{
                  display: 'flex',
                  gap: '8px',
                }}>
                  <span style={{
                    background: '#FF6B6B25',
                    color: '#FF6B6B',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '600',
                  }}>
                    {puzzleGroup.length} copies
                  </span>
                </div>
              </div>

              {/* Quick Actions */}
              <div style={{
                display: 'flex',
                gap: '8px',
                marginBottom: '12px',
              }}>
                <button
                  onClick={() => selectKeepNewest(title)}
                  style={{
                    padding: '6px 12px',
                    background: '#667eea25',
                    color: '#667eea',
                    border: '1px solid #667eea',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  Keep Newest
                </button>
                <button
                  onClick={() => selectKeepOldest(title)}
                  style={{
                    padding: '6px 12px',
                    background: '#764ba225',
                    color: '#764ba2',
                    border: '1px solid #764ba2',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  Keep Oldest
                </button>
              </div>

              {/* Puzzles List */}
              <div style={{ display: 'grid', gap: '8px' }}>
                {puzzleGroup
                  .sort((a, b) => {
                    const dateA = a.createdAt instanceof Date ? a.createdAt : a.createdAt?.toDate?.() || new Date(0);
                    const dateB = b.createdAt instanceof Date ? b.createdAt : b.createdAt?.toDate?.() || new Date(0);
                    return new Date(dateB) - new Date(dateA);
                  })
                  .map((puzzle, index) => (
                    <div
                      key={puzzle.id}
                      style={{
                        background: theme.background,
                        border: `1px solid ${selectedForDelete.includes(puzzle.id) ? '#FF6B6B' : theme.border}`,
                        borderRadius: '8px',
                        padding: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedForDelete.includes(puzzle.id)}
                        onChange={() => toggleSelectForDelete(puzzle.id)}
                        style={{
                          width: '18px',
                          height: '18px',
                          cursor: 'pointer',
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{
                          color: theme.textPrimary,
                          fontSize: '12px',
                          fontWeight: '600',
                        }}>
                          {index === 0 && '⭐ '} ID: {puzzle.id}
                        </div>
                        <div style={{
                          color: theme.textSecondary,
                          fontSize: '11px',
                          marginTop: '2px',
                        }}>
                          Created: {formatDate(puzzle.createdAt)}
                          {puzzle.updatedAt && ` • Updated: ${formatDate(puzzle.updatedAt)}`}
                        </div>
                        {puzzle.category && (
                          <div style={{
                            color: theme.textSecondary,
                            fontSize: '11px',
                            marginTop: '2px',
                          }}>
                            Category: {puzzle.category}
                          </div>
                        )}
                      </div>
                      {index === 0 && (
                        <span style={{
                          background: '#2ecc7125',
                          color: '#2ecc71',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '10px',
                          fontWeight: '600',
                        }}>
                          Newest
                        </span>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
