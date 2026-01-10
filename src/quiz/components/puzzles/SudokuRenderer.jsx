import React, { useState, useEffect } from 'react';

/**
 * SudokuRenderer - Interactive Sudoku Puzzle Player
 * Displays a 9x9 sudoku grid with input handling and real-time validation
 */
export default function SudokuRenderer({
  question,
  onAnswer,
  answered,
  selectedAnswer,
  showFeedback,
  theme,
}) {
  const [grid, setGrid] = useState(Array(81).fill(0));
  const [selectedCell, setSelectedCell] = useState(null);
  const [conflicts, setConflicts] = useState(new Set());

  // Initialize grid from question data
  useEffect(() => {
    if (selectedAnswer?.filled_grid) {
      setGrid(selectedAnswer.filled_grid);
    } else if (question.data?.puzzle) {
      setGrid([...question.data.puzzle]);
    }
  }, []);

  // Check for sudoku conflicts
  const findConflicts = (currentGrid) => {
    const newConflicts = new Set();

    for (let i = 0; i < 81; i++) {
      const val = currentGrid[i];
      if (val === 0) continue;

      const row = Math.floor(i / 9);
      const col = i % 9;

      // Check row
      for (let c = 0; c < 9; c++) {
        if (c !== col) {
          const idx = row * 9 + c;
          if (currentGrid[idx] === val) {
            newConflicts.add(i);
            newConflicts.add(idx);
          }
        }
      }

      // Check column
      for (let r = 0; r < 9; r++) {
        if (r !== row) {
          const idx = r * 9 + col;
          if (currentGrid[idx] === val) {
            newConflicts.add(i);
            newConflicts.add(idx);
          }
        }
      }

      // Check 3x3 box
      const boxRow = Math.floor(row / 3) * 3;
      const boxCol = Math.floor(col / 3) * 3;
      for (let r = boxRow; r < boxRow + 3; r++) {
        for (let c = boxCol; c < boxCol + 3; c++) {
          if (r !== row || c !== col) {
            const idx = r * 9 + c;
            if (currentGrid[idx] === val) {
              newConflicts.add(i);
              newConflicts.add(idx);
            }
          }
        }
      }
    }

    setConflicts(newConflicts);
  };

  const handleCellChange = (index, value) => {
    if (answered) return;

    const num = parseInt(value) || 0;
    if (num < 0 || num > 9) return;

    // Don't allow changing given numbers
    const givenNumbers = question.data?.puzzle || [];
    if (givenNumbers[index] !== 0) return;

    const newGrid = [...grid];
    newGrid[index] = num;
    setGrid(newGrid);
    findConflicts(newGrid);
  };

  const handleCellClick = (index) => {
    setSelectedCell(index);
  };

  const handleCellKeyDown = (e, index) => {
    if (answered) return;

    const key = e.key;
    if (/^[1-9]$/.test(key)) {
      handleCellChange(index, key);
      // Move to next empty cell
      const nextEmpty = grid.findIndex((v, i) => i > index && v === 0 && question.data?.puzzle[i] === 0);
      if (nextEmpty !== -1) {
        setSelectedCell(nextEmpty);
      }
    } else if (key === '0' || key === 'Backspace' || key === 'Delete') {
      handleCellChange(index, '0');
    } else if (key === 'ArrowRight') {
      e.preventDefault();
      setSelectedCell((index + 1) % 81);
    } else if (key === 'ArrowLeft') {
      e.preventDefault();
      setSelectedCell((index - 1 + 81) % 81);
    } else if (key === 'ArrowDown') {
      e.preventDefault();
      setSelectedCell((index + 9) % 81);
    } else if (key === 'ArrowUp') {
      e.preventDefault();
      setSelectedCell((index - 9 + 81) % 81);
    }
  };

  const handleSubmit = () => {
    if (answered) return;

    // Check if grid is complete
    if (grid.includes(0)) {
      alert('Please fill all cells before submitting.');
      return;
    }

    // Final conflict check
    const conflictCheck = new Set();
    findConflicts(grid);

    if (conflicts.size > 0) {
      alert('Please fix the conflicts in your grid.');
      return;
    }

    onAnswer({
      filled_grid: grid,
      is_complete: !grid.includes(0),
      has_errors: conflicts.size > 0,
    });
  };

  const handleClear = () => {
    const cleared = question.data?.puzzle?.map((v) => (v !== 0 ? v : 0)) || Array(81).fill(0);
    setGrid(cleared);
    setConflicts(new Set());
  };

  const givenNumbers = question.data?.puzzle || [];
  const cellSize = 48;
  const borderSize = 2;

  return (
    <div
      style={{
        padding: '20px',
        maxWidth: '800px',
        margin: '0 auto',
      }}
    >
      <h3
        style={{
          color: theme?.textPrimary || '#333',
          marginBottom: '20px',
          textAlign: 'center',
        }}
      >
        {question.text || 'Sudoku Puzzle'}
      </h3>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'auto 1fr',
          gap: '30px',
          marginBottom: '20px',
          alignItems: 'start',
        }}
      >
        {/* Sudoku Grid */}
        <div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(9, ${cellSize}px)`,
              gap: '0',
              border: `${borderSize}px solid ${theme?.textPrimary || '#333'}`,
              backgroundColor: theme?.surfaceSecondary || '#f5f5f5',
              width: 'fit-content',
            }}
          >
            {grid.map((value, index) => {
              const row = Math.floor(index / 9);
              const col = index % 9;
              const isGiven = givenNumbers[index] !== 0;
              const isSelected = selectedCell === index;
              const isConflict = conflicts.has(index);
              const boxRow = Math.floor(row / 3);
              const boxCol = Math.floor(col / 3);

              // Determine borders for 3x3 boxes
              const borderRight = (col + 1) % 3 === 0 ? borderSize : 1;
              const borderBottom = (row + 1) % 3 === 0 ? borderSize : 1;

              return (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  value={value === 0 ? '' : value}
                  onChange={(e) => handleCellChange(index, e.target.value)}
                  onClick={() => handleCellClick(index)}
                  onKeyDown={(e) => handleCellKeyDown(e, index)}
                  disabled={isGiven || answered}
                  style={{
                    width: `${cellSize}px`,
                    height: `${cellSize}px`,
                    padding: '0',
                    textAlign: 'center',
                    fontSize: '18px',
                    fontWeight: isGiven ? '700' : '600',
                    border: 'none',
                    borderRight: `${borderRight}px solid ${theme?.border || '#999'}`,
                    borderBottom: `${borderBottom}px solid ${theme?.border || '#999'}`,
                    background: isConflict
                      ? '#FF6B6B30'
                      : isSelected
                      ? `${theme?.accentPrimary || '#007AFF'}20`
                      : isGiven
                      ? theme?.surfaceSecondary || '#f0f0f0'
                      : theme?.surfacePrimary || '#fff',
                    color: isGiven
                      ? theme?.textPrimary || '#333'
                      : theme?.accentPrimary || '#007AFF',
                    cursor: isGiven || answered ? 'default' : 'pointer',
                    outline: isSelected ? `3px solid ${theme?.accentPrimary || '#007AFF'}` : 'none',
                    outlineOffset: '-3px',
                  }}
                />
              );
            })}
          </div>

          {/* Controls */}
          {!answered && (
            <div
              style={{
                display: 'flex',
                gap: '10px',
                marginTop: '15px',
                justifyContent: 'center',
              }}
            >
              <button
                onClick={handleClear}
                style={{
                  padding: '10px 20px',
                  background: theme?.surfaceSecondary || '#f0f0f0',
                  color: theme?.textPrimary || '#333',
                  border: `1px solid ${theme?.border || '#ddd'}`,
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'all 0.2s ease',
                }}
                onMouseOver={(e) => {
                  e.target.style.background = theme?.border || '#e0e0e0';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = theme?.surfaceSecondary || '#f0f0f0';
                }}
              >
                Clear
              </button>
              <button
                onClick={handleSubmit}
                style={{
                  padding: '10px 24px',
                  background: `linear-gradient(135deg, ${theme?.accentPrimary || '#007AFF'}, ${
                    theme?.accentSecondary || '#0051D5'
                  })`,
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'all 0.2s ease',
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = `0 6px 20px ${theme?.accentPrimary || '#007AFF'}40`;
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                Submit Answer
              </button>
            </div>
          )}
        </div>

        {/* Info & Instructions */}
        <div>
          <div
            style={{
              padding: '15px',
              background: theme?.surfaceSecondary || '#f9f9f9',
              borderRadius: '8px',
              marginBottom: '15px',
            }}
          >
            <h4
              style={{
                color: theme?.textPrimary || '#333',
                margin: '0 0 10px 0',
                fontSize: '14px',
                fontWeight: '700',
              }}
            >
              Difficulty: {question.data?.difficulty || 'Medium'}
            </h4>
            <p
              style={{
                color: theme?.textSecondary || '#666',
                margin: '0',
                fontSize: '13px',
                lineHeight: '1.5',
              }}
            >
              Fill the grid so that each row, column, and 3x3 box contains the digits 1-9.
            </p>
          </div>

          <div
            style={{
              padding: '12px',
              background: `${theme?.accentPrimary || '#007AFF'}10`,
              border: `1px solid ${theme?.accentPrimary || '#007AFF'}30`,
              borderRadius: '6px',
              fontSize: '13px',
              color: theme?.textSecondary || '#666',
              lineHeight: '1.5',
            }}
          >
            <strong>Tips:</strong>
            <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px' }}>
              <li>Light cells are editable, dark cells are given</li>
              <li>Red cells indicate conflicts</li>
              <li>Use arrow keys to navigate</li>
              <li>Press 1-9 to fill, 0 to clear</li>
            </ul>
          </div>

          {conflicts.size > 0 && !answered && (
            <div
              style={{
                marginTop: '15px',
                padding: '12px',
                background: '#FF6B6B10',
                border: '1px solid #FF6B6B',
                borderRadius: '6px',
                color: '#FF6B6B',
                fontSize: '13px',
                fontWeight: '600',
              }}
            >
              ⚠️ Fix {conflicts.size} conflict{conflicts.size !== 1 ? 's' : ''} before submitting
            </div>
          )}
        </div>
      </div>

      {/* Feedback */}
      {answered && showFeedback && (
        <div
          style={{
            marginTop: '20px',
            padding: '15px',
            background: '#4ECB7110',
            border: '1px solid #4ECB71',
            borderRadius: '8px',
            color: '#4ECB71',
            textAlign: 'center',
            fontWeight: '600',
          }}
        >
          ✓ Sudoku submitted! Your puzzle has been recorded.
        </div>
      )}
    </div>
  );
}
