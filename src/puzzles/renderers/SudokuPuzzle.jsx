// src/puzzles/renderers/SudokuPuzzle.jsx
// Sudoku puzzle renderer with configurable grid sizes (4x4, 6x6, 9x9)
import React, { useState, useEffect } from 'react';
import { savePuzzleProgress } from '../../quiz/services/visualPuzzleService';
import '../../styles/puzzle-renderers.css';

function SudokuPuzzle({ puzzle, onComplete }) {
  const [grid, setGrid] = useState([]);
  const [solution, setSolution] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [selectedCell, setSelectedCell] = useState(null);
  const [solved, setSolved] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [errors, setErrors] = useState(new Set());
  const [size, setSize] = useState(9); // 4, 6, or 9
  const [boxSize, setBoxSize] = useState(3); // 2 for 4x4, 2-3 for 6x6, 3 for 9x9
  const [timeLeft, setTimeLeft] = useState(null);
  const [timerActive, setTimerActive] = useState(true);

  // Timer effect
  useEffect(() => {
    if (puzzle?.data?.timeLimit) {
      setTimeLeft(puzzle.data.timeLimit);
    }
  }, [puzzle]);

  useEffect(() => {
    if (!timerActive || !timeLeft || solved) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setTimerActive(false);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timerActive, timeLeft, solved]);

  // Initialize sudoku
  useEffect(() => {
    if (puzzle?.data?.grid) {
      const puzzleGrid = puzzle.data.grid;
      setGrid(puzzleGrid);
      setSolution(puzzle.data.solution || []);

      // Detect grid size
      const detectedSize = puzzleGrid.length;
      setSize(detectedSize);
      setBoxSize(Math.sqrt(detectedSize));

      // Initialize user answers from puzzle grid
      const answers = {};
      puzzleGrid.forEach((row, i) => {
        row.forEach((cell, j) => {
          if (cell !== 0 && cell !== null) {
            answers[`${i}-${j}`] = cell;
          }
        });
      });
      setUserAnswers(answers);
    }
  }, [puzzle]);

  // Handle cell input
  const handleCellInput = (row, col, value) => {
    if (grid[row]?.[col] !== 0 && grid[row]?.[col] !== null) {
      return; // Can't change pre-filled cells
    }

    const cellKey = `${row}-${col}`;
    const numValue = value === '' ? null : parseInt(value);

    if (numValue && (numValue < 1 || numValue > size)) {
      return; // Invalid number
    }

    const newAnswers = { ...userAnswers };
    if (numValue !== null) {
      newAnswers[cellKey] = numValue;
    } else {
      delete newAnswers[cellKey];
    }

    setUserAnswers(newAnswers);
    validateCell(row, col, numValue);
  };

  // Validate cell against sudoku rules
  const validateCell = (row, col, value) => {
    if (!value) return true;

    const newErrors = new Set(errors);

    // Check row
    for (let i = 0; i < size; i++) {
      if (i !== col) {
        const cellKey = `${row}-${i}`;
        const otherValue = userAnswers[cellKey];
        if (otherValue === value) {
          newErrors.add(cellKey);
          newErrors.add(`${row}-${col}`);
        } else {
          newErrors.delete(cellKey);
        }
      }
    }

    // Check column
    for (let i = 0; i < size; i++) {
      if (i !== row) {
        const cellKey = `${i}-${col}`;
        const otherValue = userAnswers[cellKey];
        if (otherValue === value) {
          newErrors.add(cellKey);
          newErrors.add(`${row}-${col}`);
        } else {
          newErrors.delete(cellKey);
        }
      }
    }

    // Check box
    const boxRow = Math.floor(row / boxSize) * boxSize;
    const boxCol = Math.floor(col / boxSize) * boxSize;
    for (let i = boxRow; i < boxRow + boxSize; i++) {
      for (let j = boxCol; j < boxCol + boxSize; j++) {
        if (i !== row || j !== col) {
          const cellKey = `${i}-${j}`;
          const otherValue = userAnswers[cellKey];
          if (otherValue === value) {
            newErrors.add(cellKey);
            newErrors.add(`${row}-${col}`);
          } else {
            newErrors.delete(cellKey);
          }
        }
      }
    }

    setErrors(newErrors);
    return newErrors.size === 0;
  };

  // Check if puzzle is solved
  const checkSolution = () => {
    if (!solution || solution.length === 0) return false;

    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        const cellKey = `${i}-${j}`;
        const userValue = userAnswers[cellKey];
        const correctValue = solution[i]?.[j];

        if (userValue !== correctValue) {
          return false;
        }
      }
    }

    return errors.size === 0;
  };

  // Handle submit
  const handleSubmit = () => {
    setAttempts(attempts + 1);

    if (checkSolution()) {
      setSolved(true);
      setShowCelebration(true);
      setTimerActive(false);

      savePuzzleProgress(puzzle.id, {
        completed: true,
        attempts,
        score: Math.max(0, 100 - attempts * 5),
        time: puzzle.data.timeLimit ? puzzle.data.timeLimit - timeLeft : null,
      });

      setTimeout(() => {
        onComplete();
      }, 2000);
    } else {
      alert('Some cells are incorrect. Please review and try again!');
    }
  };

  // Handle time up
  const handleTimeUp = () => {
    alert('Time is up! Your progress has been saved.');
    onComplete();
  };

  // Format time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (grid.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <p style={{ color: '#ff6633', fontSize: '18px', fontWeight: 'bold' }}>
          Loading sudoku puzzle...
        </p>
      </div>
    );
  }

  return (
    <div style={{
      padding: '20px',
      maxWidth: '900px',
      margin: '0 auto',
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#333', fontSize: '24px', fontWeight: 'bold' }}>
          {puzzle.title || `${size}x${size} Sudoku`}
        </h1>
        {puzzle.description && (
          <p style={{ color: '#666', marginTop: '8px' }}>
            {puzzle.description}
          </p>
        )}

        {/* Timer and Stats */}
        <div style={{
          marginTop: '16px',
          display: 'flex',
          justifyContent: 'center',
          gap: '24px',
          fontSize: '14px',
        }}>
          {timeLeft !== null && (
            <div style={{
              padding: '8px 16px',
              background: timeLeft < 60 ? '#ffe0e0' : '#f0f0f0',
              borderRadius: '6px',
              color: timeLeft < 60 ? '#e74c3c' : '#666',
              fontWeight: 'bold',
            }}>
              ⏱️ {formatTime(timeLeft)}
            </div>
          )}
          <div style={{
            padding: '8px 16px',
            background: '#f0f0f0',
            borderRadius: '6px',
            color: '#666',
          }}>
            Attempts: {attempts}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div style={{
        display: 'inline-block',
        border: '3px solid #333',
        backgroundColor: '#fff',
        marginBottom: '30px',
      }}>
        {grid.map((row, rowIdx) => (
          <div
            key={rowIdx}
            style={{
              display: 'flex',
              borderBottom: ((rowIdx + 1) % boxSize === 0 && rowIdx !== size - 1)
                ? '3px solid #333'
                : '1px solid #ccc',
            }}
          >
            {row.map((cell, colIdx) => {
              const cellKey = `${rowIdx}-${colIdx}`;
              const userValue = userAnswers[cellKey] || '';
              const isSelected = selectedCell === cellKey;
              const isPrefilled = cell !== 0 && cell !== null;
              const hasError = errors.has(cellKey);

              return (
                <input
                  key={cellKey}
                  type="text"
                  maxLength="1"
                  value={userValue}
                  onChange={(e) => handleCellInput(rowIdx, colIdx, e.target.value)}
                  onClick={() => !isPrefilled && setSelectedCell(cellKey)}
                  disabled={solved || isPrefilled}
                  style={{
                    width: '50px',
                    height: '50px',
                    border: isSelected ? '2px solid #ff6633' : '1px solid #ccc',
                    borderRight: ((colIdx + 1) % boxSize === 0 && colIdx !== size - 1)
                      ? '3px solid #333'
                      : '1px solid #ccc',
                    textAlign: 'center',
                    fontWeight: 'bold',
                    fontSize: '18px',
                    backgroundColor: isPrefilled ? '#f0f0f0' : hasError ? '#ffcccc' : isSelected ? '#fff9e6' : '#fff',
                    color: isPrefilled ? '#666' : hasError ? '#d32f2f' : '#333',
                    cursor: isPrefilled ? 'default' : 'pointer',
                    padding: 0,
                  }}
                  readOnly={isPrefilled}
                />
              );
            })}
          </div>
        ))}
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
          🎉 Congratulations! You completed the sudoku!
        </div>
      )}
    </div>
  );
}

export default SudokuPuzzle;
