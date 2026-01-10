import React, { useState, useEffect } from 'react';
import { db } from '../firebase/firebaseConfig';
import {
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  query,
  where,
  addDoc
} from 'firebase/firestore';
import AdminLayout from './AdminLayout';
import '../styles/admin-puzzle-manager.css';

const PUZZLE_TYPES = {
  CROSSWORD: 'CROSSWORD',
  WORD_SEARCH: 'WORD_SEARCH',
  SUDOKU: 'SUDOKU'
};

const PUZZLE_TYPE_INFO = {
  CROSSWORD: {
    label: 'Crossword',
    maxPoints: 25,
    fields: ['title', 'description', 'gridSize', 'grid', 'clues', 'solution_grid']
  },
  WORD_SEARCH: {
    label: 'Word Search',
    maxPoints: 15,
    fields: ['title', 'description', 'gridSize', 'grid', 'words']
  },
  SUDOKU: {
    label: 'Sudoku',
    maxPoints: 30,
    fields: ['title', 'description', 'difficulty', 'puzzle', 'solution']
  }
};

export default function AdminPuzzleManager() {
  const [puzzles, setPuzzles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedType, setSelectedType] = useState(PUZZLE_TYPES.CROSSWORD);
  
  const [formData, setFormData] = useState({});
  const [filterType, setFilterType] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Load puzzles
  useEffect(() => {
    loadPuzzles();
  }, []);

  const loadPuzzles = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'puzzles'));
      const snapshot = await getDocs(q);
      const puzzleList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPuzzles(puzzleList);
    } catch (error) {
      console.error('Error loading puzzles:', error);
      alert('Failed to load puzzles');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({});
    setEditingId(null);
    setSelectedType(PUZZLE_TYPES.CROSSWORD);
  };

  const handleTypeChange = (type) => {
    setSelectedType(type);
    resetForm();
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFormDataChange = (fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const editPuzzle = async (puzzle) => {
    setSelectedType(puzzle.type);
    setFormData(puzzle);
    setEditingId(puzzle.id);
    setShowForm(true);
  };

  const savePuzzle = async () => {
    if (!formData.title || !formData.title.trim()) {
      alert('Puzzle title is required');
      return;
    }

    // Validate based on puzzle type
    if (selectedType === PUZZLE_TYPES.CROSSWORD) {
      if (!formData.gridSize || !formData.grid || !formData.clues || !formData.solution_grid) {
        alert('All crossword fields are required (gridSize, grid, clues, solution_grid)');
        return;
      }
    } else if (selectedType === PUZZLE_TYPES.WORD_SEARCH) {
      if (!formData.gridSize || !formData.grid || !formData.words) {
        alert('All word search fields are required (gridSize, grid, words)');
        return;
      }
    } else if (selectedType === PUZZLE_TYPES.SUDOKU) {
      if (!formData.difficulty || !formData.puzzle || !formData.solution) {
        alert('All sudoku fields are required (difficulty, puzzle, solution)');
        return;
      }
    }

    setLoading(true);
    try {
      const puzzleData = {
        ...formData,
        type: selectedType,
        maxScore: PUZZLE_TYPE_INFO[selectedType].maxPoints,
        updatedAt: new Date(),
        createdAt: editingId ? formData.createdAt : new Date()
      };

      if (editingId) {
        // Update existing
        await setDoc(doc(db, 'puzzles', editingId), puzzleData);
        alert('Puzzle updated successfully!');
      } else {
        // Create new
        await addDoc(collection(db, 'puzzles'), puzzleData);
        alert('Puzzle created successfully!');
      }

      resetForm();
      setShowForm(false);
      await loadPuzzles();
    } catch (error) {
      console.error('Error saving puzzle:', error);
      alert('Failed to save puzzle');
    } finally {
      setLoading(false);
    }
  };

  const duplicatePuzzle = async (puzzle) => {
    setLoading(true);
    try {
      const newPuzzle = { ...puzzle };
      delete newPuzzle.id;
      newPuzzle.title = `${puzzle.title} (Copy)`;
      newPuzzle.createdAt = new Date();

      await addDoc(collection(db, 'puzzles'), newPuzzle);
      alert('Puzzle duplicated successfully!');
      await loadPuzzles();
    } catch (error) {
      console.error('Error duplicating puzzle:', error);
      alert('Failed to duplicate puzzle');
    } finally {
      setLoading(false);
    }
  };

  const deletePuzzle = async (puzzleId) => {
    if (!window.confirm('Are you sure you want to delete this puzzle?')) {
      return;
    }

    setLoading(true);
    try {
      await deleteDoc(doc(db, 'puzzles', puzzleId));
      alert('Puzzle deleted successfully!');
      await loadPuzzles();
    } catch (error) {
      console.error('Error deleting puzzle:', error);
      alert('Failed to delete puzzle');
    } finally {
      setLoading(false);
    }
  };

  // Filter puzzles
  const filteredPuzzles = puzzles.filter(puzzle => {
    const typeMatch = filterType === 'ALL' || puzzle.type === filterType;
    const searchMatch = puzzle.title?.toLowerCase().includes(searchQuery.toLowerCase());
    return typeMatch && searchMatch;
  });

  return (
    <AdminLayout>
      <div className="puzzle-manager-container">
        <div className="puzzle-manager-header">
          <h1>🧩 Puzzle Manager</h1>
          <button
            className="btn btn-primary btn-lg"
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
          >
            + Create Puzzle
          </button>
        </div>

        {/* Form Section */}
        {showForm && (
          <div className="puzzle-form-section">
            <div className="form-header">
              <h2>{editingId ? 'Edit Puzzle' : 'Create New Puzzle'}</h2>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
              >
                ✕ Close
              </button>
            </div>

            {/* Type Selection */}
            {!editingId && (
              <div className="form-group">
                <label>Puzzle Type</label>
                <div className="type-selector">
                  {Object.entries(PUZZLE_TYPES).map(([key, value]) => (
                    <button
                      key={key}
                      className={`type-btn ${selectedType === value ? 'active' : ''}`}
                      onClick={() => handleTypeChange(value)}
                    >
                      {PUZZLE_TYPE_INFO[value].label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Common Fields */}
            <div className="form-group">
              <label>Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title || ''}
                onChange={handleFormChange}
                placeholder="Puzzle title"
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description || ''}
                onChange={handleFormChange}
                placeholder="Optional description"
                rows="3"
              />
            </div>

            {/* Type-Specific Fields */}
            {selectedType === PUZZLE_TYPES.CROSSWORD && (
              <>
                <div className="form-group">
                  <label>Grid Size *</label>
                  <select
                    name="gridSize"
                    value={formData.gridSize || '9'}
                    onChange={handleFormChange}
                  >
                    <option value="5">5x5</option>
                    <option value="9">9x9</option>
                    <option value="15">15x15</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Grid (JSON) *</label>
                  <textarea
                    name="grid"
                    value={formData.grid || ''}
                    onChange={handleFormChange}
                    placeholder='[["", "", ""],...]'
                    rows="6"
                  />
                  <small>2D array of characters, empty string for blanks</small>
                </div>

                <div className="form-group">
                  <label>Clues (JSON) *</label>
                  <textarea
                    name="clues"
                    value={formData.clues || ''}
                    onChange={handleFormChange}
                    placeholder='{"across": {...}, "down": {...}}'
                    rows="6"
                  />
                  <small>Object with "across" and "down" clue keys</small>
                </div>

                <div className="form-group">
                  <label>Solution Grid (JSON) *</label>
                  <textarea
                    name="solution_grid"
                    value={formData.solution_grid || ''}
                    onChange={handleFormChange}
                    placeholder='[["A", "B", "C"],...]'
                    rows="6"
                  />
                  <small>2D array with solution letters</small>
                </div>
              </>
            )}

            {selectedType === PUZZLE_TYPES.WORD_SEARCH && (
              <>
                <div className="form-group">
                  <label>Grid Size *</label>
                  <select
                    name="gridSize"
                    value={formData.gridSize || '10'}
                    onChange={handleFormChange}
                  >
                    <option value="8">8x8</option>
                    <option value="10">10x10</option>
                    <option value="15">15x15</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Grid (JSON) *</label>
                  <textarea
                    name="grid"
                    value={formData.grid || ''}
                    onChange={handleFormChange}
                    placeholder='[["Q", "U", "I", "Z"],...]'
                    rows="6"
                  />
                  <small>2D array of letters</small>
                </div>

                <div className="form-group">
                  <label>Word List (JSON) *</label>
                  <textarea
                    name="words"
                    value={formData.words || ''}
                    onChange={handleFormChange}
                    placeholder='["QUIZ", "PUZZLE", "WORD"]'
                    rows="4"
                  />
                  <small>Array of words to find (uppercase)</small>
                </div>
              </>
            )}

            {selectedType === PUZZLE_TYPES.SUDOKU && (
              <>
                <div className="form-group">
                  <label>Difficulty *</label>
                  <select
                    name="difficulty"
                    value={formData.difficulty || 'medium'}
                    onChange={handleFormChange}
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Puzzle Grid (JSON) *</label>
                  <textarea
                    name="puzzle"
                    value={formData.puzzle || ''}
                    onChange={handleFormChange}
                    placeholder='[0,1,2,3,...] (81 numbers, 0 for empty)'
                    rows="6"
                  />
                  <small>Array of 81 numbers (0-9), 0 = empty cell</small>
                </div>

                <div className="form-group">
                  <label>Solution (JSON) *</label>
                  <textarea
                    name="solution"
                    value={formData.solution || ''}
                    onChange={handleFormChange}
                    placeholder='[1,2,3,...] (81 numbers)'
                    rows="6"
                  />
                  <small>Array of 81 numbers (1-9), complete solution</small>
                </div>
              </>
            )}

            <div className="form-actions">
              <button
                className="btn btn-success btn-lg"
                onClick={savePuzzle}
                disabled={loading}
              >
                {loading ? 'Saving...' : editingId ? '✓ Update Puzzle' : '+ Create Puzzle'}
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Filter & Search */}
        <div className="puzzle-controls">
          <div className="filter-group">
            <label>Filter by Type:</label>
            <select value={filterType} onChange={e => setFilterType(e.target.value)}>
              <option value="ALL">All Types</option>
              <option value={PUZZLE_TYPES.CROSSWORD}>Crossword</option>
              <option value={PUZZLE_TYPES.WORD_SEARCH}>Word Search</option>
              <option value={PUZZLE_TYPES.SUDOKU}>Sudoku</option>
            </select>
          </div>

          <div className="search-group">
            <input
              type="text"
              placeholder="Search by title..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="count">
            {filteredPuzzles.length} puzzle{filteredPuzzles.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Puzzles List */}
        {loading && <div className="loading">Loading...</div>}

        {!loading && filteredPuzzles.length === 0 && (
          <div className="empty-state">
            <p>No puzzles found</p>
            <button
              className="btn btn-primary"
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
            >
              Create First Puzzle
            </button>
          </div>
        )}

        {!loading && filteredPuzzles.length > 0 && (
          <div className="puzzles-grid">
            {filteredPuzzles.map(puzzle => (
              <div key={puzzle.id} className="puzzle-card">
                <div className="puzzle-card-header">
                  <div className="puzzle-info">
                    <h3>{puzzle.title}</h3>
                    <span className="puzzle-type">
                      {PUZZLE_TYPE_INFO[puzzle.type]?.label || puzzle.type}
                    </span>
                  </div>
                  <span className="puzzle-points">{puzzle.maxScore || 0} pts</span>
                </div>

                {puzzle.description && (
                  <p className="puzzle-description">{puzzle.description}</p>
                )}

                <div className="puzzle-meta">
                  {puzzle.type === PUZZLE_TYPES.CROSSWORD && puzzle.gridSize && (
                    <span>Grid: {puzzle.gridSize}x{puzzle.gridSize}</span>
                  )}
                  {puzzle.type === PUZZLE_TYPES.WORD_SEARCH && puzzle.words && (
                    <span>Words: {Array.isArray(puzzle.words) ? puzzle.words.length : 0}</span>
                  )}
                  {puzzle.type === PUZZLE_TYPES.SUDOKU && puzzle.difficulty && (
                    <span>Difficulty: {puzzle.difficulty}</span>
                  )}
                </div>

                <div className="puzzle-actions">
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => editPuzzle(puzzle)}
                    disabled={loading}
                  >
                    ✎ Edit
                  </button>
                  <button
                    className="btn btn-info btn-sm"
                    onClick={() => duplicatePuzzle(puzzle)}
                    disabled={loading}
                  >
                    ⧉ Duplicate
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deletePuzzle(puzzle.id)}
                    disabled={loading}
                  >
                    🗑 Delete
                  </button>
                </div>

                {puzzle.createdAt && (
                  <small className="puzzle-timestamp">
                    Created: {new Date(puzzle.createdAt.toDate?.() || puzzle.createdAt).toLocaleDateString()}
                  </small>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
