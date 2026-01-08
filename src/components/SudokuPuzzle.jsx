import React, { useState, useEffect, useRef } from 'react';
import {
  generateSudokuGrid,
  generateSudokuHints,
  validateSudokuCell,
  isSudokuSolved,
  PUZZLE_CONFIGS,
} from '../services/puzzleAdvancedService';
import '../styles/sudoku-puzzle.css';

const SudokuPuzzle = ({ difficulty = 'medium', onComplete }) => {
  const [grid, setGrid] = useState([]);
  const [solvedGrid, setSolvedGrid] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null);
  const [hints, setHints] = useState([]);
  const [usedHints, setUsedHints] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [hintContent, setHintContent] = useState(null);
  const [timer, setTimer] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const timerInterval = useRef(null);

  const timeLimit = PUZZLE_CONFIGS.sudoku.timeLimit[difficulty];
  const maxHints = PUZZLE_CONFIGS.sudoku.difficultySettings[difficulty].maxRetries;

  // Initialize puzzle
  useEffect(() => {
    const { grid: newGrid, solvedGrid: solved } = generateSudokuGrid(difficulty);
    setGrid(newGrid);
    setSolvedGrid(solved);
    const hintList = generateSudokuHints(newGrid, solved);
    setHints(hintList);

    // Start timer
    timerInterval.current = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timerInterval.current);
  }, [difficulty]);

  // Handle cell click
  const handleCellClick = (row, col) => {
    if (grid[row]?.[col] && !grid[row][col].editable) return;
    setSelectedCell({ row, col });
  };

  // Handle number input
  const handleNumberInput = (num) => {
    if (!selectedCell) return;

    const { row, col } = selectedCell;
    const newGrid = grid.map((r) => [...r]);
    newGrid[row][col].value = num === 0 ? 0 : num;

    // Validate move
    if (num !== 0) {
      const validation = validateSudokuCell(newGrid, row, col, num);
      if (!validation.valid) {
        setMistakes(mistakes + 1);
        // Flash error
        newGrid[row][col].conflict = true;
        setTimeout(() => {
          setGrid(grid.map((r) => [...r]));
        }, 500);
      }
    }

    setGrid(newGrid);

    // Auto-advance to next cell
    const nextCol = col + 1 >= 9 ? 0 : col + 1;
    const nextRow = col + 1 >= 9 ? row + 1 : row;
    if (nextRow < 9) {
      setSelectedCell({ row: nextRow, col: nextCol });
    }
  };

  // Request hint
  const requestHint = () => {
    if (usedHints >= maxHints) {
      alert(`No more hints available! (Max: ${maxHints})`);
      return;
    }

    const logicalHint = hints.find((h) => h.type === 'logical_hint');
    if (logicalHint) {
      const { row, col, value } = logicalHint;
      const newGrid = grid.map((r) => [...r]);
      newGrid[row][col].value = value;
      setGrid(newGrid);
      setUsedHints(usedHints + 1);
      setHintContent(`Cell [${row + 1},${col + 1}] = ${value}`);
      setShowHint(true);
      setTimeout(() => setShowHint(false), 3000);
    }
  };

  // Clear cell
  const handleClear = () => {
    if (!selectedCell) return;
    const { row, col } = selectedCell;
    if (grid[row][col].editable) {
      const newGrid = grid.map((r) => [...r]);
      newGrid[row][col].value = 0;
      setGrid(newGrid);
    }
  };

  // Check completion
  const checkCompletion = () => {
    if (isSudokuSolved(grid)) {
      const finalScore = Math.max(
        0,
        100 - Math.floor(timer / 10) - mistakes * 5 - usedHints * 3
      );
      setScore(finalScore);
      setIsCompleted(true);
      if (onComplete) onComplete({ score: finalScore, timeSpent: timer, puzzleId: 'sudoku' });
    } else {
      alert('Puzzle not completely solved or has errors.');
    }
  };

  // Reset puzzle
  const resetPuzzle = () => {
    const { grid: newGrid } = generateSudokuGrid(difficulty);
    setGrid(newGrid);
    setSelectedCell(null);
    setMistakes(0);
    setUsedHints(0);
    setScore(0);
    setIsCompleted(false);
    setTimer(0);
  };

  const timeRemaining = Math.max(0, timeLimit - timer);
  const timeColor = timeRemaining < 60 ? '#ff6b6b' : timeRemaining < 300 ? '#ffa500' : '#4CAF50';

  return (
    <div className="sudoku-puzzle-container">
      <div className="sudoku-header">
        <h2>Sudoku Puzzle - {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}</h2>
        <div className="sudoku-stats">
          <span className="timer" style={{ color: timeColor }}>
            ⏱ {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
          </span>
          <span className="mistakes">❌ Mistakes: {mistakes}</span>
          <span className="hints">💡 Hints: {usedHints}/{maxHints}</span>
          {isCompleted && <span className="completion-score">✓ Score: {score}</span>}
        </div>
      </div>

      <div className="sudoku-content">
        {/* Grid */}
        <div className="sudoku-grid">
          {grid.map((row, i) =>
            row.map((cell, j) => (
              <button
                key={`${i}-${j}`}
                className={`sudoku-cell ${cell.conflict ? 'conflict' : ''} ${
                  selectedCell?.row === i && selectedCell?.col === j ? 'selected' : ''
                } ${!cell.editable ? 'given' : ''}`}
                onClick={() => handleCellClick(i, j)}
              >
                {cell.value || ''}
              </button>
            ))
          )}
        </div>

        {/* Number pad */}
        <div className="sudoku-controls">
          <div className="number-pad">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                className="number-btn"
                onClick={() => handleNumberInput(num)}
                disabled={!selectedCell}
              >
                {num}
              </button>
            ))}
            <button
              className="number-btn delete-btn"
              onClick={handleClear}
              disabled={!selectedCell}
            >
              Delete
            </button>
          </div>

          <div className="puzzle-buttons">
            <button onClick={requestHint} className="hint-btn" disabled={usedHints >= maxHints}>
              💡 Hint ({usedHints}/{maxHints})
            </button>
            <button onClick={checkCompletion} className="submit-btn" disabled={isCompleted}>
              {isCompleted ? '✓ Completed!' : 'Check'}
            </button>
            <button onClick={resetPuzzle} className="reset-btn">
              Reset
            </button>
          </div>
        </div>

        {/* Hint notification */}
        {showHint && <div className="hint-notification">{hintContent}</div>}
      </div>
    </div>
  );
};

export default SudokuPuzzle;
