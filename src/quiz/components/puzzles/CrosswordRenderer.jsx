import React, { useState, useEffect } from 'react';

/**
 * CrosswordRenderer - Interactive Crossword Puzzle Player
 * Displays a crossword grid with clues and handles user input
 */
export default function CrosswordRenderer({
  question,
  onAnswer,
  answered,
  selectedAnswer,
  showFeedback,
  theme,
}) {
  const [gridState, setGridState] = useState({});
  const [selectedCell, setSelectedCell] = useState(null);
  const [selectedDirection, setSelectedDirection] = useState('across');

  // Initialize grid state on mount
  useEffect(() => {
    if (!answered && !selectedAnswer) {
      initializeGridState();
    } else if (selectedAnswer) {
      setGridState(selectedAnswer.filled_grid || {});
    }
  }, []);

  const initializeGridState = () => {
    const state = {};
    if (question.data?.grid) {
      question.data.grid.forEach((row, r) => {
        row.forEach((cell, c) => {
          if (cell !== null) {
            state[`${r}-${c}`] = '';
          }
        });
      });
    }
    setGridState(state);
  };

  const handleCellInput = (row, col, value) => {
    if (answered) return;

    const key = `${row}-${col}`;
    const upperValue = value.toUpperCase().slice(-1);

    if (/^[A-Z]?$/.test(upperValue)) {
      setGridState({
        ...gridState,
        [key]: upperValue,
      });
      setSelectedCell({ row, col });
      setSelectedDirection('across');
    }
  };

  const handleCellClick = (row, col) => {
    setSelectedCell({ row, col });
    // Toggle between across and down
    setSelectedDirection(
      selectedCell?.row === row && selectedCell?.col === col && selectedDirection === 'across'
        ? 'down'
        : 'across'
    );
  };

  const handleSubmit = () => {
    if (answered) return;

    const filledGrid = [];
    let userAnswers = {};

    // Build filled grid and user answers
    if (question.data?.grid) {
      question.data.grid.forEach((row, r) => {
        const filledRow = [];
        row.forEach((cell, c) => {
          const key = `${r}-${c}`;
          const userValue = gridState[key] || '';
          filledRow.push(userValue);

          // Track user answers with positions
          if (cell !== null) {
            userAnswers[`${r}-${c}`] = userValue;
          }
        });
        filledGrid.push(filledRow);
      });
    }

    onAnswer({
      filled_grid: filledGrid,
      user_answers: userAnswers,
    });
  };

  const handleClear = () => {
    initializeGridState();
  };

  // Get grid dimensions
  const gridSize = question.data?.gridSize || { rows: 9, cols: 9 };
  const grid = question.data?.grid || [];
  const cluesAcross = question.data?.clues?.across || [];
  const cluesDown = question.data?.clues?.down || [];

  const cellSize = 36;
  const gapSize = 1;

  return (
    <div
      style={{
        padding: '20px',
        maxWidth: '1000px',
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
        {question.text || 'Crossword Puzzle'}
      </h3>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '30px',
          marginBottom: '20px',
        }}
      >
        {/* Grid */}
        <div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${gridSize.cols}, ${cellSize}px)`,
              gap: `${gapSize}px`,
              padding: '10px',
              background: theme?.surfaceSecondary || '#f5f5f5',
              borderRadius: '8px',
              width: 'fit-content',
            }}
          >
            {grid.map((row, r) =>
              row.map((cell, c) => {
                const key = `${r}-${c}`;
                const isActive = cell !== null;
                const isSelected =
                  selectedCell?.row === r && selectedCell?.col === c;
                const value = gridState[key] || '';

                return (
                  <input
                    key={key}
                    type="text"
                    maxLength="1"
                    value={value}
                    onChange={(e) => handleCellInput(r, c, e.target.value)}
                    onClick={() => handleCellClick(r, c)}
                    disabled={!isActive || answered}
                    style={{
                      width: `${cellSize}px`,
                      height: `${cellSize}px`,
                      padding: '0',
                      textAlign: 'center',
                      fontSize: '16px',
                      fontWeight: '600',
                      border: isSelected
                        ? `2px solid ${theme?.accentPrimary || '#007AFF'}`
                        : `1px solid ${theme?.border || '#ddd'}`,
                      background: isActive
                        ? theme?.surfacePrimary || '#fff'
                        : theme?.textSecondary || '#666',
                      color: isActive
                        ? theme?.textPrimary || '#333'
                        : 'transparent',
                      borderRadius: '4px',
                      cursor: isActive && !answered ? 'text' : 'default',
                      transition: 'all 0.2s ease',
                    }}
                  />
                );
              })
            )}
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

        {/* Clues */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px',
            maxHeight: '500px',
            overflowY: 'auto',
          }}
        >
          {/* Across Clues */}
          <div>
            <h4
              style={{
                color: theme?.textPrimary || '#333',
                marginBottom: '10px',
                fontSize: '14px',
                fontWeight: '700',
                textTransform: 'uppercase',
              }}
            >
              Across
            </h4>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              {cluesAcross.map((clue, idx) => (
                <div
                  key={`across-${idx}`}
                  onClick={() => {
                    setSelectedDirection('across');
                    // Find cell with this clue number
                    if (clue.number) {
                      grid.forEach((row, r) => {
                        row.forEach((cell, c) => {
                          if (cell === parseInt(clue.number)) {
                            setSelectedCell({ row: r, col: c });
                          }
                        });
                      });
                    }
                  }}
                  style={{
                    padding: '8px',
                    background: answered
                      ? '#f5f5f5'
                      : selectedDirection === 'across' &&
                        selectedCell?.row === clue.row
                      ? `${theme?.accentPrimary || '#007AFF'}20`
                      : theme?.surfaceSecondary || '#f9f9f9',
                    borderLeft: `3px solid ${
                      answered
                        ? '#999'
                        : selectedDirection === 'across' &&
                          selectedCell?.row === clue.row
                        ? theme?.accentPrimary || '#007AFF'
                        : 'transparent'
                    }`,
                    borderRadius: '4px',
                    cursor: answered ? 'default' : 'pointer',
                    transition: 'all 0.2s ease',
                    fontSize: '13px',
                  }}
                >
                  <strong>{clue.number}</strong>. {clue.text}
                </div>
              ))}
            </div>
          </div>

          {/* Down Clues */}
          <div>
            <h4
              style={{
                color: theme?.textPrimary || '#333',
                marginBottom: '10px',
                fontSize: '14px',
                fontWeight: '700',
                textTransform: 'uppercase',
              }}
            >
              Down
            </h4>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              {cluesDown.map((clue, idx) => (
                <div
                  key={`down-${idx}`}
                  onClick={() => {
                    setSelectedDirection('down');
                    // Find cell with this clue number
                    if (clue.number) {
                      grid.forEach((row, r) => {
                        row.forEach((cell, c) => {
                          if (cell === parseInt(clue.number)) {
                            setSelectedCell({ row: r, col: c });
                          }
                        });
                      });
                    }
                  }}
                  style={{
                    padding: '8px',
                    background: answered
                      ? '#f5f5f5'
                      : selectedDirection === 'down' &&
                        selectedCell?.col === clue.col
                      ? `${theme?.accentPrimary || '#007AFF'}20`
                      : theme?.surfaceSecondary || '#f9f9f9',
                    borderLeft: `3px solid ${
                      answered
                        ? '#999'
                        : selectedDirection === 'down' &&
                          selectedCell?.col === clue.col
                        ? theme?.accentPrimary || '#007AFF'
                        : 'transparent'
                    }`,
                    borderRadius: '4px',
                    cursor: answered ? 'default' : 'pointer',
                    transition: 'all 0.2s ease',
                    fontSize: '13px',
                  }}
                >
                  <strong>{clue.number}</strong>. {clue.text}
                </div>
              ))}
            </div>
          </div>
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
          ✓ Crossword submitted! Your answer has been recorded.
        </div>
      )}
    </div>
  );
}
