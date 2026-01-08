import React, { useState } from 'react';
import { PUZZLE_TYPES, DIFFICULTY_LEVELS, PUZZLE_CONFIGS, validateCustomization } from '../services/puzzleAdvancedService';
import '../styles/puzzle-customizer.css';

const PuzzleCustomizer = ({ onPuzzleCreate, defaultType = 'crossword' }) => {
  const [puzzleType, setPuzzleType] = useState(defaultType);
  const [difficulty, setDifficulty] = useState('medium');
  const [customSettings, setCustomSettings] = useState({});
  const [theme, setTheme] = useState('default');
  const [timeLimit, setTimeLimit] = useState('auto');
  const [validation, setValidation] = useState({ valid: true, errors: [] });

  const config = PUZZLE_CONFIGS[puzzleType];

  // Handle puzzle type change
  const handleTypeChange = (type) => {
    setPuzzleType(type);
    setCustomSettings({});
  };

  // Handle difficulty change
  const handleDifficultyChange = (diff) => {
    setDifficulty(diff);
  };

  // Handle size selection (for crossword and word search)
  const handleSizeChange = (size) => {
    setCustomSettings({ ...customSettings, size });
  };

  // Validate and create puzzle
  const handleCreatePuzzle = () => {
    const customization = {
      type: puzzleType,
      difficulty,
      theme,
      timeLimit,
      ...customSettings,
    };

    const validationResult = validateCustomization(puzzleType, customization);
    setValidation(validationResult);

    if (validationResult.valid) {
      if (onPuzzleCreate) {
        onPuzzleCreate(customization);
      }
    }
  };

  const themes = [
    { name: 'default', label: 'Default', color: '#ffffff' },
    { name: 'dark', label: 'Dark', color: '#1e1e1e' },
    { name: 'blue', label: 'Blue', color: '#e3f2fd' },
    { name: 'highContrast', label: 'High Contrast', color: '#000000' },
  ];

  return (
    <div className="puzzle-customizer">
      <div className="customizer-header">
        <h2>🎮 Create Custom Puzzle</h2>
      </div>

      <div className="customizer-content">
        {/* Puzzle Type Selection */}
        <section className="customizer-section">
          <h3>Puzzle Type</h3>
          <div className="puzzle-type-grid">
            {Object.values(PUZZLE_TYPES).map((type) => (
              <button
                key={type}
                className={`type-btn ${puzzleType === type ? 'active' : ''}`}
                onClick={() => handleTypeChange(type)}
              >
                {type === 'crossword' && '📝'}
                {type === 'sudoku' && '🔢'}
                {type === 'word-search' && '🔍'}
                <span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Difficulty Selection */}
        <section className="customizer-section">
          <h3>Difficulty Level</h3>
          <div className="difficulty-grid">
            {['easy', 'medium', 'hard', 'expert'].map((diff) => (
              <button
                key={diff}
                className={`difficulty-btn ${difficulty === diff ? 'active' : ''}`}
                onClick={() => handleDifficultyChange(diff)}
              >
                {diff.charAt(0).toUpperCase() + diff.slice(1)}
              </button>
            ))}
          </div>
          <p className="difficulty-desc">
            {difficulty === 'easy' && '🟢 Perfect for beginners. More clues and longer time limits.'}
            {difficulty === 'medium' && '🟡 Balanced challenge. Standard gameplay experience.'}
            {difficulty === 'hard' && '🔴 Challenging. Fewer clues and shorter time.'}
            {difficulty === 'expert' && '🔴🔴 Extreme difficulty. Master level challenge.'}
          </p>
        </section>

        {/* Size Selection (Crossword & Word Search) */}
        {['crossword', 'word-search'].includes(puzzleType) && (
          <section className="customizer-section">
            <h3>Grid Size</h3>
            <div className="size-grid">
              {config.sizes.map((size) => (
                <button
                  key={size.name}
                  className={`size-btn ${customSettings.size === size.name ? 'active' : ''}`}
                  onClick={() => handleSizeChange(size.name)}
                >
                  <span>{size.name}</span>
                  <small>
                    {size.rows}×{size.cols}
                  </small>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Theme Selection */}
        <section className="customizer-section">
          <h3>Theme</h3>
          <div className="theme-grid">
            {themes.map((t) => (
              <button
                key={t.name}
                className={`theme-btn ${theme === t.name ? 'active' : ''}`}
                onClick={() => setTheme(t.name)}
                style={{ backgroundColor: t.color }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </section>

        {/* Time Limit */}
        <section className="customizer-section">
          <h3>Time Limit</h3>
          <div className="time-grid">
            <button
              className={`time-btn ${timeLimit === 'auto' ? 'active' : ''}`}
              onClick={() => setTimeLimit('auto')}
            >
              Auto (Based on Difficulty)
            </button>
            <button
              className={`time-btn ${timeLimit === 'unlimited' ? 'active' : ''}`}
              onClick={() => setTimeLimit('unlimited')}
            >
              Unlimited ∞
            </button>
            <button
              className={`time-btn ${timeLimit === 'custom' ? 'active' : ''}`}
              onClick={() => setTimeLimit('custom')}
            >
              Custom
            </button>
          </div>
        </section>

        {/* Validation Errors */}
        {!validation.valid && (
          <section className="validation-errors">
            <h4>⚠️ Validation Errors:</h4>
            <ul>
              {validation.errors.map((error, idx) => (
                <li key={idx}>{error}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Summary */}
        <section className="customizer-summary">
          <h3>Summary</h3>
          <div className="summary-box">
            <p>
              <strong>Puzzle Type:</strong> {puzzleType.toUpperCase()}
            </p>
            <p>
              <strong>Difficulty:</strong> {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </p>
            {customSettings.size && (
              <p>
                <strong>Size:</strong> {customSettings.size}
              </p>
            )}
            <p>
              <strong>Theme:</strong> {theme.charAt(0).toUpperCase() + theme.slice(1)}
            </p>
            <p>
              <strong>Time Limit:</strong> {timeLimit === 'auto' ? 'Automatic' : timeLimit === 'unlimited' ? 'Unlimited' : 'Custom'}
            </p>
          </div>
        </section>

        {/* Create Button */}
        <button className="create-puzzle-btn" onClick={handleCreatePuzzle}>
          🎮 Create Puzzle
        </button>
      </div>
    </div>
  );
};

export default PuzzleCustomizer;
