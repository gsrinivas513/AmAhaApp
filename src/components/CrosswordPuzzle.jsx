import React, { useState, useEffect, useRef } from 'react';
import {
  generateCrosswordGrid,
  generateCrosswordHints,
  validateCrosswordAnswer,
  PUZZLE_CONFIGS,
} from '../services/puzzleAdvancedService';
import '../styles/crossword-puzzle.css';

const CrosswordPuzzle = ({ puzzleId = 'demo-crossword', difficulty = 'medium', size = 'Medium', onComplete }) => {
  const [grid, setGrid] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [selectedCell, setSelectedCell] = useState(null);
  const [selectedDirection, setSelectedDirection] = useState('across');
  const [showHints, setShowHints] = useState({});
  const [hints, setHints] = useState({});
  const [timer, setTimer] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const timerInterval = useRef(null);

  const sizeConfig = PUZZLE_CONFIGS.crossword.sizes.find((s) => s.name === size);
  const timeLimit = PUZZLE_CONFIGS.crossword.timeLimit[difficulty];

  // Initialize puzzle
  useEffect(() => {
    const newGrid = generateCrosswordGrid(sizeConfig.rows, sizeConfig.cols, difficulty);
    setGrid(newGrid);
    generateAllHints(newGrid);

    // Start timer
    timerInterval.current = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timerInterval.current);
  }, [difficulty, sizeConfig]);

  // Generate hints for all clues
  const generateAllHints = (crosswordGrid) => {
    const allHints = {};
    const acrossClues = {};
    const downClues = {};

    // Extract clues from grid
    for (let i = 0; i < crosswordGrid.length; i++) {
      for (let j = 0; j < crosswordGrid[i].length; j++) {
        const cell = crosswordGrid[i][j];
        if (cell && cell.number) {
          // Across clue
          if (j === 0 || !crosswordGrid[i][j - 1] || crosswordGrid[i][j - 1].type === 'black') {
            const word = getWordFromGrid(crosswordGrid, i, j, 'across');
            if (word) {
              const key = `${cell.number}-across`;
              acrossClues[key] = word;
              allHints[key] = generateCrosswordHints(word, `Clue ${cell.number} Across`);
            }
          }

          // Down clue
          if (i === 0 || !crosswordGrid[i - 1] || crosswordGrid[i - 1][j].type === 'black') {
            const word = getWordFromGrid(crosswordGrid, i, j, 'down');
            if (word) {
              const key = `${cell.number}-down`;
              downClues[key] = word;
              allHints[key] = generateCrosswordHints(word, `Clue ${cell.number} Down`);
            }
          }
        }
      }
    }

    setHints(allHints);
  };

  // Get word from grid
  const getWordFromGrid = (gridData, row, col, direction) => {
    let word = '';
    let r = row;
    let c = col;

    while (r < gridData.length && c < gridData[r].length) {
      const cell = gridData[r][c];
      if (!cell || cell.type === 'black') break;
      word += (cell.answer || '').toUpperCase();

      if (direction === 'across') c++;
      else if (direction === 'down') r++;
    }

    return word.length > 1 ? word : null;
  };

  // Handle cell click
  const handleCellClick = (row, col) => {
    if (!grid[row] || !grid[row][col] || grid[row][col].type === 'black') return;

    const cell = grid[row][col];
    if (selectedCell?.row === row && selectedCell?.col === col) {
      setSelectedDirection(selectedDirection === 'across' ? 'down' : 'across');
    } else {
      setSelectedCell({ row, col });
      setSelectedDirection('across');
    }
  };

  // Handle input change
  const handleInputChange = (row, col, value) => {
    const letter = value.toUpperCase().charAt(0);
    const newAnswers = { ...userAnswers };
    newAnswers[`${row}-${col}`] = letter;
    setUserAnswers(newAnswers);

    // Auto-advance to next cell
    if (letter && selectedDirection === 'across') {
      const nextCol = col + 1;
      if (nextCol < sizeConfig.cols && grid[row][nextCol]?.type === 'white') {
        setSelectedCell({ row, col: nextCol });
      }
    } else if (letter && selectedDirection === 'down') {
      const nextRow = row + 1;
      if (nextRow < sizeConfig.rows && grid[nextRow]?.[col]?.type === 'white') {
        setSelectedCell({ row: nextRow, col });
      }
    }
  };

  // Request hint
  const requestHint = (clueKey) => {
    const clueHints = hints[clueKey];
    if (!clueHints) return;

    const currentHintIndex = (showHints[clueKey] || -1) + 1;
    if (currentHintIndex < clueHints.length) {
      setShowHints({ ...showHints, [clueKey]: currentHintIndex });
    }
  };

  // Check completion
  const checkCompletion = () => {
    let completed = true;
    let correctAnswers = 0;

    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        const cell = grid[i][j];
        if (cell && cell.type === 'white') {
          const userAnswer = userAnswers[`${i}-${j}`] || '';
          const correctAnswer = cell.answer || '';

          if (!validateCrosswordAnswer(userAnswer, correctAnswer)) {
            completed = false;
          } else {
            correctAnswers++;
          }
        }
      }
    }

    if (completed) {
      const finalScore = Math.max(0, 100 - Math.floor(timer / 10));
      setScore(finalScore);
      setIsCompleted(true);
      if (onComplete) onComplete({ score: finalScore, timeSpent: timer, puzzleId });
    } else {
      alert('Some answers are incorrect. Keep trying!');
    }
  };

  // Get hints for current cell
  const getHintsForCell = (row, col) => {
    const cell = grid[row]?.[col];
    if (!cell || !cell.number) return null;

    const direction = selectedDirection;
    const key = `${cell.number}-${direction}`;
    return hints[key];
  };

  // Get selected word
  const getSelectedWord = () => {
    if (!selectedCell) return null;

    const { row, col } = selectedCell;
    const cell = grid[row]?.[col];
    if (!cell || !cell.number) return null;

    const direction = selectedDirection;
    const cells = [];
    let r = row;
    let c = col;

    while (r < grid.length && c < grid[r].length) {
      const currentCell = grid[r][c];
      if (!currentCell || currentCell.type === 'black') break;
      cells.push({ row: r, col: c, number: currentCell.number });

      if (direction === 'across') c++;
      else if (direction === 'down') r++;
    }

    return { direction, cells };
  };

  const timeRemaining = Math.max(0, timeLimit - timer);
  const selectedWord = getSelectedWord();
  const timeColor = timeRemaining < 60 ? '#ff6b6b' : timeRemaining < 300 ? '#ffa500' : '#4CAF50';

  return (
    <div className="crossword-puzzle-container">
      <div className="crossword-header">
        <h2>Crossword Puzzle - {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}</h2>
        <div className="crossword-stats">
          <span className="timer" style={{ color: timeColor }}>
            ⏱ {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
          </span>
          {isCompleted && <span className="completion-score">✓ Score: {score}</span>}
        </div>
      </div>

      <div className="crossword-content">
        {/* Grid */}
        <div className="crossword-grid-container">
          <div
            className="crossword-grid"
            style={{
              gridTemplateColumns: `repeat(${sizeConfig.cols}, 35px)`,
              gridTemplateRows: `repeat(${sizeConfig.rows}, 35px)`,
            }}
          >
            {grid.map((row, i) =>
              row.map((cell, j) => (
                <div
                  key={`${i}-${j}`}
                  className={`crossword-cell ${cell?.type} ${
                    selectedCell?.row === i && selectedCell?.col === j ? 'selected' : ''
                  } ${selectedWord?.cells.some((c) => c.row === i && c.col === j) ? 'highlighted' : ''}`}
                  onClick={() => handleCellClick(i, j)}
                >
                  {cell?.type === 'white' && (
                    <>
                      {cell?.number && <span className="cell-number">{cell.number}</span>}
                      <input
                        type="text"
                        maxLength="1"
                        value={userAnswers[`${i}-${j}`] || ''}
                        onChange={(e) => handleInputChange(i, j, e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        onFocus={() => handleCellClick(i, j)}
                      />
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Clues and Hints */}
        <div className="crossword-clues-panel">
          <div className="clues-section">
            <h3>Across</h3>
            <div className="clues-list">
              {Object.keys(hints)
                .filter((key) => key.endsWith('-across'))
                .map((clueKey) => (
                  <div key={clueKey} className="clue-item">
                    <span className="clue-number">{clueKey.split('-')[0]}.</span>
                    <span className="clue-text">{clueKey}</span>
                    <button className="hint-btn" onClick={() => requestHint(clueKey)}>
                      💡 Hint
                    </button>
                    {showHints[clueKey] !== undefined && hints[clueKey][showHints[clueKey]] && (
                      <div className="hint-content">{hints[clueKey][showHints[clueKey]].content}</div>
                    )}
                  </div>
                ))}
            </div>
          </div>

          <div className="clues-section">
            <h3>Down</h3>
            <div className="clues-list">
              {Object.keys(hints)
                .filter((key) => key.endsWith('-down'))
                .map((clueKey) => (
                  <div key={clueKey} className="clue-item">
                    <span className="clue-number">{clueKey.split('-')[0]}.</span>
                    <span className="clue-text">{clueKey}</span>
                    <button className="hint-btn" onClick={() => requestHint(clueKey)}>
                      💡 Hint
                    </button>
                    {showHints[clueKey] !== undefined && hints[clueKey][showHints[clueKey]] && (
                      <div className="hint-content">{hints[clueKey][showHints[clueKey]].content}</div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      <div className="crossword-controls">
        <button onClick={checkCompletion} className="submit-btn" disabled={isCompleted}>
          {isCompleted ? '✓ Completed!' : 'Check Answer'}
        </button>
        <button
          onClick={() => {
            setUserAnswers({});
            setScore(0);
            setIsCompleted(false);
          }}
          className="reset-btn"
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default CrosswordPuzzle;
