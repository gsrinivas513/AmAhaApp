// src/puzzles/renderers/CrosswordPuzzle.jsx
// Crossword puzzle renderer with grid, clues, and interactive solving
import React, { useState, useEffect } from 'react';
import { savePuzzleProgress } from '../../quiz/services/visualPuzzleService';
import '../../styles/puzzle-renderers.css';

function CrosswordPuzzle({ puzzle, onComplete }) {
  const [grid, setGrid] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [selectedCell, setSelectedCell] = useState(null);
  const [direction, setDirection] = useState('across'); // 'across' or 'down'
  const [solved, setSolved] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [hints, setHints] = useState(null);

  // Initialize crossword from puzzle data
  useEffect(() => {
    if (puzzle?.data?.grid) {
      setGrid(puzzle.data.grid);
      // Initialize hints structure
      if (puzzle.data.clues) {
        setHints(puzzle.data.clues);
      }
    }
  }, [puzzle]);

  // Handle cell input
  const handleCellInput = (row, col, value) => {
    const cellKey = `${row}-${col}`;
    const newAnswers = { ...userAnswers };
    newAnswers[cellKey] = (value || '').toUpperCase().slice(0, 1);
    setUserAnswers(newAnswers);
  };

  // Check if puzzle is solved
  const checkSolution = () => {
    if (!puzzle?.data?.answers) {
      console.error('No answers provided in puzzle');
      return false;
    }

    let correct = true;
    Object.entries(puzzle.data.answers).forEach(([cellKey, correctValue]) => {
      const userValue = userAnswers[cellKey] || '';
      if (userValue.toUpperCase() !== correctValue.toUpperCase()) {
        correct = false;
      }
    });

    return correct;
  };

  // Handle submit
  const handleSubmit = () => {
    setAttempts(attempts + 1);
    
    if (checkSolution()) {
      setSolved(true);
      setShowCelebration(true);
      
      savePuzzleProgress(puzzle.id, {
        completed: true,
        attempts,
        score: Math.max(0, 100 - attempts * 10),
      });

      setTimeout(() => {
        onComplete();
      }, 2000);
    } else {
      // Flash feedback - show which cells are wrong
      alert('Some answers are incorrect. Try again!');
    }
  };

  // Handle reset
  const handleReset = () => {
    setUserAnswers({});
    setAttempts(0);
    setSolved(false);
  };

  // Handle hint
  const handleHint = (cellKey) => {
    if (puzzle?.data?.answers?.[cellKey]) {
      handleCellInput(...cellKey.split('-').map(Number), puzzle.data.answers[cellKey]);
    }
  };

  // Get across and down clues
  const getClues = () => {
    const across = [];
    const down = [];

    if (!hints) return { across, down };

    Object.entries(hints).forEach(([key, clue]) => {
      if (clue.direction === 'across') {
        across.push({ number: clue.number, text: clue.text, cells: clue.cells });
      } else if (clue.direction === 'down') {
        down.push({ number: clue.number, text: clue.text, cells: clue.cells });
      }
    });

    return { across, down };
  };

  const { across, down } = getClues();

  if (!grid || grid.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <p style={{ color: '#ff6633', fontSize: '18px', fontWeight: 'bold' }}>
          Loading crossword puzzle...
        </p>
      </div>
    );
  }

  return (
    <div style={{
      padding: '20px',
      maxWidth: '1200px',
      margin: '0 auto',
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#333', fontSize: '24px', fontWeight: 'bold' }}>
          {puzzle.title || 'Crossword Puzzle'}
        </h1>
        {puzzle.description && (
          <p style={{ color: '#666', marginTop: '8px' }}>
            {puzzle.description}
          </p>
        )}
        {attempts > 0 && (
          <div style={{
            marginTop: '12px',
            padding: '8px 16px',
            background: '#f0f0f0',
            borderRadius: '6px',
            color: '#666',
            fontSize: '14px',
          }}>
            Attempts: {attempts}
          </div>
        )}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '30px',
        marginBottom: '30px',
      }}>
        {/* Grid Section */}
        <div>
          <h3 style={{ color: '#333', marginBottom: '16px', fontWeight: 'bold' }}>
            Grid
          </h3>
          <div style={{
            display: 'inline-block',
            border: '2px solid #333',
            backgroundColor: '#fff',
          }}>
            {grid.map((row, rowIdx) => (
              <div key={rowIdx} style={{ display: 'flex' }}>
                {row.map((cell, colIdx) => {
                  const cellKey = `${rowIdx}-${colIdx}`;
                  const isBlack = cell === null || cell === '#' || cell === 'BLACK';
                  const userValue = userAnswers[cellKey] || '';
                  const isSelected = selectedCell === cellKey;
                  const isCorrect = solved || (puzzle?.data?.answers?.[cellKey] === userValue.toUpperCase());

                  return (
                    <input
                      key={cellKey}
                      type="text"
                      maxLength="1"
                      value={userValue}
                      onChange={(e) => handleCellInput(rowIdx, colIdx, e.target.value)}
                      onClick={() => setSelectedCell(cellKey)}
                      disabled={solved}
                      style={{
                        width: '40px',
                        height: '40px',
                        border: isSelected ? '2px solid #ff6633' : '1px solid #ccc',
                        textAlign: 'center',
                        fontWeight: 'bold',
                        fontSize: '16px',
                        backgroundColor: isBlack ? '#333' : isCorrect && userValue ? '#c0ffc0' : '#fff',
                        color: '#333',
                        cursor: solved ? 'default' : 'pointer',
                        padding: 0,
                      }}
                      readOnly={isBlack}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Clues Section */}
        <div>
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ color: '#333', marginBottom: '12px', fontWeight: 'bold' }}>
              Across
            </h3>
            <div style={{
              maxHeight: '300px',
              overflowY: 'auto',
              paddingRight: '10px',
            }}>
              {across.map((clue, idx) => (
                <div
                  key={idx}
                  style={{
                    marginBottom: '12px',
                    paddingBottom: '12px',
                    borderBottom: '1px solid #eee',
                    fontSize: '14px',
                  }}
                >
                  <strong style={{ color: '#ff6633' }}>
                    {clue.number}.
                  </strong>
                  <span style={{ marginLeft: '8px', color: '#333' }}>
                    {clue.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 style={{ color: '#333', marginBottom: '12px', fontWeight: 'bold' }}>
              Down
            </h3>
            <div style={{
              maxHeight: '300px',
              overflowY: 'auto',
              paddingRight: '10px',
            }}>
              {down.map((clue, idx) => (
                <div
                  key={idx}
                  style={{
                    marginBottom: '12px',
                    paddingBottom: '12px',
                    borderBottom: '1px solid #eee',
                    fontSize: '14px',
                  }}
                >
                  <strong style={{ color: '#ff6633' }}>
                    {clue.number}.
                  </strong>
                  <span style={{ marginLeft: '8px', color: '#333' }}>
                    {clue.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div style={{
        display: 'flex',
        gap: '12px',
        justifyContent: 'center',
        marginBottom: '20px',
      }}>
        <button
          onClick={handleSubmit}
          disabled={solved}
          style={{
            padding: '12px 28px',
            background: solved ? '#ccc' : '#FF6633',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: solved ? 'default' : 'pointer',
            transition: 'all 0.3s ease',
          }}
          onMouseOver={(e) => {
            if (!solved) {
              e.currentTarget.style.background = '#E85A23';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }
          }}
          onMouseOut={(e) => {
            if (!solved) {
              e.currentTarget.style.background = '#FF6633';
              e.currentTarget.style.transform = 'translateY(0)';
            }
          }}
        >
          {solved ? '✓ Completed!' : 'Submit'}
        </button>

        <button
          onClick={handleReset}
          style={{
            padding: '12px 28px',
            background: '#f0f0f0',
            color: '#333',
            border: '1px solid #ddd',
            borderRadius: '6px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = '#e0e0e0';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = '#f0f0f0';
          }}
        >
          Reset
        </button>
      </div>

      {/* Celebration */}
      {showCelebration && (
        <div style={{
          textAlign: 'center',
          padding: '20px',
          background: '#c0ffc0',
          border: '2px solid #4ECB71',
          borderRadius: '8px',
          color: '#4ECB71',
          fontSize: '18px',
          fontWeight: 'bold',
          animation: 'pulse 0.5s ease-in-out',
        }}>
          🎉 Congratulations! You solved the crossword!
        </div>
      )}
    </div>
  );
}

export default CrosswordPuzzle;
