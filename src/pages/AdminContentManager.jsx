import React, { useState } from 'react';
import { createPuzzleForAdmin, publishPuzzle } from '../services/phase8Service';
import { useTheme } from '../context/ThemeContext';
import '../styles/admin-content.css';

const AdminContentManager = ({ userId }) => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('create');
  const [puzzleForm, setPuzzleForm] = useState({
    title: '',
    type: 'crossword',
    difficulty: 'medium',
    category: 'general',
    description: '',
    gridSize: '7x7',
    estimatedTime: 300,
    rewards: { xp: 100, coins: 20 },
  });

  const [createdPuzzles, setCreatedPuzzles] = useState([]);
  const [message, setMessage] = useState('');

  const puzzleTypes = [
    { id: 'crossword', name: 'Crossword', icon: '📝' },
    { id: 'sudoku', name: 'Sudoku', icon: '🔢' },
    { id: 'wordsearch', name: 'Word Search', icon: '🔍' },
  ];

  const difficulties = ['easy', 'medium', 'hard', 'expert'];
  const categories = ['general', 'science', 'history', 'literature', 'geography', 'custom'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPuzzleForm({
      ...puzzleForm,
      [name]: value,
    });
  };

  const handleRewardChange = (field, value) => {
    setPuzzleForm({
      ...puzzleForm,
      rewards: {
        ...puzzleForm.rewards,
        [field]: parseInt(value),
      },
    });
  };

  const handleCreatePuzzle = async () => {
    if (!puzzleForm.title.trim()) {
      setMessage('Please enter a puzzle title');
      return;
    }

    const newPuzzle = {
      ...puzzleForm,
      id: `puzzle_${Date.now()}`,
      createdBy: userId,
      createdAt: new Date(),
      published: false,
    };

    const result = await createPuzzleForAdmin(userId, newPuzzle);
    
    if (result.success) {
      setCreatedPuzzles([...createdPuzzles, newPuzzle]);
      setMessage(`✓ Puzzle "${puzzleForm.title}" created successfully!`);
      setPuzzleForm({
        title: '',
        type: 'crossword',
        difficulty: 'medium',
        category: 'general',
        description: '',
        gridSize: '7x7',
        estimatedTime: 300,
        rewards: { xp: 100, coins: 20 },
      });
      setTimeout(() => setMessage(''), 3000);
    } else {
      setMessage(`Error: ${result.error}`);
    }
  };

  const handlePublishPuzzle = async (puzzleId) => {
    const result = await publishPuzzle(puzzleId);
    
    if (result.success) {
      setCreatedPuzzles(
        createdPuzzles.map((p) =>
          p.id === puzzleId ? { ...p, published: true } : p
        )
      );
      setMessage('✓ Puzzle published successfully!');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleDeletePuzzle = (puzzleId) => {
    setCreatedPuzzles(createdPuzzles.filter((p) => p.id !== puzzleId));
    setMessage('✓ Puzzle deleted');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="admin-content-container" style={{ backgroundColor: theme.background, color: theme.textPrimary, transition: 'background-color 0.3s, color 0.3s' }}>
      {/* Header */}
      <div className="admin-header" style={{ borderColor: theme.border }}>
        <h1 style={{ color: theme.textPrimary }}>🛠️ Content Manager</h1>
        <p style={{ color: theme.textSecondary }}>Create, manage, and publish puzzles</p>
      </div>

      {/* Message */}
      {message && <div className="admin-message" style={{ backgroundColor: theme.surfaceSecondary, color: theme.textPrimary, borderColor: theme.border }}>{message}</div>}

      {/* Tabs */}
      <div className="admin-tabs" style={{ borderColor: theme.border }}>
        <button
          className={`tab-button ${activeTab === 'create' ? 'active' : ''}`}
          onClick={() => setActiveTab('create')}
          style={{
            backgroundColor: activeTab === 'create' ? theme.accentPrimary : theme.surfaceSecondary,
            color: activeTab === 'create' ? 'white' : theme.textPrimary,
            borderColor: theme.border
          }}
        >
          ➕ Create Puzzle
        </button>
        <button
          className={`tab-button ${activeTab === 'manage' ? 'active' : ''}`}
          onClick={() => setActiveTab('manage')}
          style={{
            backgroundColor: activeTab === 'manage' ? theme.accentPrimary : theme.surfaceSecondary,
            color: activeTab === 'manage' ? 'white' : theme.textPrimary,
            borderColor: theme.border
          }}
        >
          📋 Manage Puzzles ({createdPuzzles.length})
        </button>
        <button
          className={`tab-button ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
          style={{
            backgroundColor: activeTab === 'analytics' ? theme.accentPrimary : theme.surfaceSecondary,
            color: activeTab === 'analytics' ? 'white' : theme.textPrimary,
            borderColor: theme.border
          }}
        >
          📊 Analytics
        </button>
      </div>

      {/* Create Puzzle Tab */}
      {activeTab === 'create' && (
        <div className="create-tab">
          <div className="form-section" style={{ backgroundColor: theme.surfacePrimary, borderColor: theme.border }}>
            <h2 style={{ color: theme.textPrimary }}>Create New Puzzle</h2>

            {/* Basic Info */}
            <div className="form-group">
              <label style={{ color: theme.textPrimary }}>Puzzle Title</label>
              <input
                type="text"
                name="title"
                value={puzzleForm.title}
                style={{ backgroundColor: theme.background, color: theme.textPrimary, borderColor: theme.border }}
                onChange={handleInputChange}
                placeholder="e.g., 'Famous Scientists'"
                className="form-input"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label style={{ color: theme.textPrimary }}>Puzzle Type</label>
                <select
                  name="type"
                  value={puzzleForm.type}
                  onChange={handleInputChange}
                  className="form-select"
                  style={{ backgroundColor: theme.background, color: theme.textPrimary, borderColor: theme.border }}
                >
                  {puzzleTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.icon} {type.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label style={{ color: theme.textPrimary }}>Difficulty</label>
                <select
                  name="difficulty"
                  value={puzzleForm.difficulty}
                  onChange={handleInputChange}
                  className="form-select"
                  style={{ backgroundColor: theme.background, color: theme.textPrimary, borderColor: theme.border }}
                >
                  {difficulties.map((diff) => (
                    <option key={diff} value={diff}>
                      {diff.charAt(0).toUpperCase() + diff.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label style={{ color: theme.textPrimary }}>Category</label>
                <select
                  name="category"
                  value={puzzleForm.category}
                  onChange={handleInputChange}
                  className="form-select"
                  style={{ backgroundColor: theme.background, color: theme.textPrimary, borderColor: theme.border }}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div className="form-group">
              <label style={{ color: theme.textPrimary }}>Description</label>
              <textarea
                name="description"
                value={puzzleForm.description}
                onChange={handleInputChange}
                placeholder="Describe the puzzle..."
                className="form-textarea"
                rows={4}
                style={{ backgroundColor: theme.background, color: theme.textPrimary, borderColor: theme.border }}
              />
            </div>

            {/* Grid and Timing */}
            <div className="form-row">
              <div className="form-group">
                <label style={{ color: theme.textPrimary }}>Grid Size (Crossword/Sudoku)</label>
                <select
                  name="gridSize"
                  value={puzzleForm.gridSize}
                  onChange={handleInputChange}
                  className="form-select"
                  style={{ backgroundColor: theme.background, color: theme.textPrimary, borderColor: theme.border }}
                >
                  <option value="7x7">7×7</option>
                  <option value="9x9">9×9</option>
                  <option value="11x11">11×11</option>
                  <option value="15x15">15×15</option>
                  <option value="21x21">21×21</option>
                </select>
              </div>

              <div className="form-group">
                <label style={{ color: theme.textPrimary }}>Estimated Time (seconds)</label>
                <input
                  type="number"
                  name="estimatedTime"
                  value={puzzleForm.estimatedTime}
                  onChange={handleInputChange}
                  className="form-input"
                  min="60"
                  step="30"
                  style={{ backgroundColor: theme.background, color: theme.textPrimary, borderColor: theme.border }}
                />
              </div>
            </div>

            {/* Rewards */}
            <div className="form-group">
              <label style={{ color: theme.textPrimary }}>Rewards</label>
              <div className="form-row">
                <div className="form-group">
                  <label style={{ color: theme.textPrimary }}>XP</label>
                  <input
                    type="number"
                    value={puzzleForm.rewards.xp}
                    onChange={(e) => handleRewardChange('xp', e.target.value)}
                    className="form-input"
                    min="0"
                    step="10"
                    style={{ backgroundColor: theme.background, color: theme.textPrimary, borderColor: theme.border }}
                  />
                </div>
                <div className="form-group">
                  <label style={{ color: theme.textPrimary }}>Coins</label>
                  <input
                    type="number"
                    value={puzzleForm.rewards.coins}
                    onChange={(e) => handleRewardChange('coins', e.target.value)}
                    className="form-input"
                    min="0"
                    step="5"
                    style={{ backgroundColor: theme.background, color: theme.textPrimary, borderColor: theme.border }}
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button className="create-btn" onClick={handleCreatePuzzle} style={{ background: theme.gradientAccent, color: 'white' }}>
              ✓ Create Puzzle
            </button>
          </div>

          {/* Preview */}
          <div className="preview-section" style={{ backgroundColor: theme.surfacePrimary, borderColor: theme.border }}>
            <h3 style={{ color: theme.textPrimary }}>Preview</h3>
            <div className="preview-card" style={{ backgroundColor: theme.background, borderColor: theme.border }}>
              <h4 style={{ color: theme.textPrimary }}>{puzzleForm.title || 'Puzzle Title'}</h4>
              <div className="preview-badges">
                <span className="badge" style={{ backgroundColor: theme.surfaceSecondary, color: theme.textPrimary }}>{puzzleTypes.find(t => t.id === puzzleForm.type)?.icon} {puzzleForm.type}</span>
                <span className="badge difficulty" style={{ backgroundColor: theme.surfaceSecondary, color: theme.textPrimary }}>{puzzleForm.difficulty}</span>
                <span className="badge" style={{ backgroundColor: theme.surfaceSecondary, color: theme.textPrimary }}>{puzzleForm.category}</span>
              </div>
              <p className="preview-description" style={{ color: theme.textSecondary }}>{puzzleForm.description || 'No description provided'}</p>
              <div className="preview-info" style={{ color: theme.textSecondary }}>
                <span>Grid: {puzzleForm.gridSize}</span>
                <span>Time: {Math.round(puzzleForm.estimatedTime / 60)}min</span>
              </div>
              <div className="preview-rewards" style={{ color: theme.accentPrimary }}>
                <span>⭐ {puzzleForm.rewards.xp} XP</span>
                <span>💰 {puzzleForm.rewards.coins} Coins</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Manage Puzzles Tab */}
      {activeTab === 'manage' && (
        <div className="manage-tab" style={{ backgroundColor: theme.surfacePrimary, borderColor: theme.border }}>
          <h2 style={{ color: theme.textPrimary }}>Your Puzzles</h2>
          {createdPuzzles.length === 0 ? (
            <div className="empty-state" style={{ backgroundColor: theme.background, borderColor: theme.border }}>
              <p style={{ color: theme.textPrimary }}>No puzzles created yet</p>
              <p style={{ color: theme.textSecondary }}>Start by creating your first puzzle in the Create tab</p>
            </div>
          ) : (
            <div className="puzzles-table">
              {createdPuzzles.map((puzzle) => (
                <div key={puzzle.id} className={`puzzle-row ${puzzle.published ? 'published' : 'draft'}`} style={{ backgroundColor: theme.background, borderColor: theme.border }}>
                  <div className="puzzle-details">
                    <div className="puzzle-title" style={{ color: theme.textPrimary }}>{puzzle.title}</div>
                    <div className="puzzle-meta" style={{ color: theme.textSecondary }}>
                      <span className="type-badge" style={{ backgroundColor: theme.surfaceSecondary, color: theme.textPrimary }}>{puzzleTypes.find(t => t.id === puzzle.type)?.name}</span>
                      <span className="difficulty-badge" style={{ backgroundColor: theme.surfaceSecondary, color: theme.textPrimary }}>{puzzle.difficulty}</span>
                      <span className="category-badge" style={{ backgroundColor: theme.surfaceSecondary, color: theme.textPrimary }}>{puzzle.category}</span>
                    </div>
                  </div>
                  <div className="puzzle-stats" style={{ color: theme.accentPrimary }}>
                    <span>⭐ {puzzle.rewards.xp} XP</span>
                    <span>💰 {puzzle.rewards.coins} Coins</span>
                  </div>
                  <div className="puzzle-status">
                    {puzzle.published ? (
                      <span className="status-badge published" style={{ backgroundColor: theme.accentPrimary, color: 'white' }}>Published ✓</span>
                    ) : (
                      <span className="status-badge draft" style={{ backgroundColor: theme.surfaceSecondary, color: theme.textPrimary }}>Draft</span>
                    )}
                  </div>
                  <div className="puzzle-actions">
                    {!puzzle.published && (
                      <button
                        className="action-btn publish-btn"
                        onClick={() => handlePublishPuzzle(puzzle.id)}
                        style={{ background: theme.gradientAccent, color: 'white' }}
                      >
                        Publish
                      </button>
                    )}
                    <button
                      className="action-btn edit-btn"
                      onClick={() => console.log('Edit puzzle')}
                      style={{ backgroundColor: theme.surfaceSecondary, color: theme.textPrimary }}
                    >
                      Edit
                    </button>
                    <button
                      className="action-btn delete-btn"
                      onClick={() => handleDeletePuzzle(puzzle.id)}
                      style={{ backgroundColor: theme.surfaceSecondary, color: theme.textPrimary }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="analytics-tab" style={{ backgroundColor: theme.surfacePrimary, borderColor: theme.border }}>
          <h2 style={{ color: theme.textPrimary }}>Content Analytics</h2>
          <div className="analytics-grid">
            <div className="analytics-card" style={{ backgroundColor: theme.background, borderColor: theme.border }}>
              <span className="analytics-icon">📝</span>
              <p className="analytics-number" style={{ color: theme.accentPrimary }}>{createdPuzzles.length}</p>
              <p className="analytics-label" style={{ color: theme.textSecondary }}>Total Puzzles</p>
            </div>
            <div className="analytics-card" style={{ backgroundColor: theme.background, borderColor: theme.border }}>
              <span className="analytics-icon">✓</span>
              <p className="analytics-number" style={{ color: theme.accentPrimary }}>{createdPuzzles.filter(p => p.published).length}</p>
              <p className="analytics-label" style={{ color: theme.textSecondary }}>Published</p>
            </div>
            <div className="analytics-card" style={{ backgroundColor: theme.background, borderColor: theme.border }}>
              <span className="analytics-icon">📋</span>
              <p className="analytics-number" style={{ color: theme.accentPrimary }}>{createdPuzzles.filter(p => !p.published).length}</p>
              <p className="analytics-label" style={{ color: theme.textSecondary }}>Drafts</p>
            </div>
            <div className="analytics-card" style={{ backgroundColor: theme.background, borderColor: theme.border }}>
              <span className="analytics-icon">👥</span>
              <p className="analytics-number" style={{ color: theme.accentPrimary }}>0</p>
              <p className="analytics-label" style={{ color: theme.textSecondary }}>Times Played</p>
            </div>
          </div>

          <div className="analytics-details" style={{ backgroundColor: theme.background, borderColor: theme.border }}>
            <h3 style={{ color: theme.textPrimary }}>Puzzle Performance</h3>
            <p className="no-data" style={{ color: theme.textSecondary }}>No analytics data yet. Publish puzzles to see performance metrics.</p>
          </div>
        </div>
      )}

      {/* Admin Tips */}
      <div className="admin-tips" style={{ backgroundColor: theme.surfaceSecondary, borderColor: theme.border }}>
        <h3 style={{ color: theme.textPrimary }}>💡 Content Creation Tips</h3>
        <ul style={{ color: theme.textPrimary }}>
          <li>Create varied difficulty levels to engage all users</li>
          <li>Write clear, descriptive titles for better searchability</li>
          <li>Set appropriate XP and coin rewards based on difficulty</li>
          <li>Publish puzzles to make them available to users</li>
          <li>Monitor analytics to understand user engagement</li>
          <li>Update existing puzzles based on user feedback</li>
        </ul>
      </div>
    </div>
  );
};

export default AdminContentManager;
