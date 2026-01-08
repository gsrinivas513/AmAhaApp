import React, { useState, useEffect, useRef } from 'react';
import {
  generateWordSearchGrid,
  generateWordSearchHints,
  validateWordSearchCompletion,
  PUZZLE_CONFIGS,
} from '../services/puzzleAdvancedService';
import '../styles/word-search-puzzle.css';

const WordSearchPuzzle = ({ difficulty = 'medium', words = [], onComplete }) => {
  const [grid, setGrid] = useState([]);
  const [placedWords, setPlacedWords] = useState([]);
  const [foundWords, setFoundWords] = useState(new Set());
  const [selectedCells, setSelectedCells] = useState([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [hints, setHints] = useState([]);
  const [usedHints, setUsedHints] = useState(0);
  const [highlightedWord, setHighlightedWord] = useState(null);
  const [timer, setTimer] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const timerInterval = useRef(null);

  const config = PUZZLE_CONFIGS['word-search'];
  const sizeConfig = config.sizes[difficulty === 'easy' ? 0 : difficulty === 'medium' ? 1 : 2];
  const timeLimit = config.timeLimit[difficulty];
  const defaultWords = ['PUZZLE', 'SEARCH', 'WORD', 'FIND', 'GAME', 'BRAIN', 'CHALLENGE', 'HIDDEN'];
  const wordList = words.length > 0 ? words : defaultWords;

  // Initialize puzzle
  useEffect(() => {
    const { grid: newGrid, words: placed } = generateWordSearchGrid(
      wordList,
      sizeConfig.rows,
      sizeConfig.cols,
      difficulty
    );
    setGrid(newGrid);
    setPlacedWords(placed);
    const hintList = generateWordSearchHints(placed);
    setHints(hintList);

    // Start timer
    timerInterval.current = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timerInterval.current);
  }, [difficulty, sizeConfig.rows, sizeConfig.cols, wordList]);

  // Handle cell mouse down
  const handleCellMouseDown = (row, col) => {
    setIsSelecting(true);
    setSelectedCells([{ row, col }]);
  };

  // Handle cell mouse enter
  const handleCellMouseEnter = (row, col) => {
    if (!isSelecting) return;

    const last = selectedCells[selectedCells.length - 1];
    const rowDiff = row - last.row;
    const colDiff = col - last.col;

    // Check if valid direction (horizontal, vertical, or diagonal)
    if (
      (Math.abs(rowDiff) <= 1 && Math.abs(colDiff) <= 1) &&
      (rowDiff !== 0 || colDiff !== 0)
    ) {
      // Check if already selected
      const exists = selectedCells.some((c) => c.row === row && c.col === col);
      if (!exists) {
        setSelectedCells([...selectedCells, { row, col }]);
      }
    }
  };

  // Handle mouse up - check if word found
  const handleMouseUp = () => {
    setIsSelecting(false);

    if (selectedCells.length < 3) {
      setSelectedCells([]);
      return;
    }

    // Build selected word
    const selectedWord = selectedCells
      .map((c) => grid[c.row]?.[c.col]?.letter || '')
      .join('');

    // Check against placed words
    const foundWordIndex = placedWords.findIndex(
      (w) =>
        selectedWord === w.word ||
        selectedWord === w.word.split('').reverse().join('')
    );

    if (foundWordIndex !== -1) {
      const newFound = new Set(foundWords);
      newFound.add(foundWordIndex);
      setFoundWords(newFound);

      // Check completion
      if (newFound.size === placedWords.length) {
        const finalScore = Math.max(0, 100 - Math.floor(timer / 10));
        setScore(finalScore);
        setIsCompleted(true);
        if (onComplete) onComplete({ score: finalScore, timeSpent: timer, puzzleId: 'word-search' });
      }

      setSelectedCells([]);
    } else {
      // Word not found
      setTimeout(() => setSelectedCells([]), 300);
    }
  };

  // Request hint
  const requestHint = () => {
    const availableHints = hints.filter(
      (h) => h.type === 'word_highlight' && !foundWords.has(h.wordIdx)
    );

    if (availableHints.length === 0) {
      alert('No more hints available!');
      return;
    }

    const hint = availableHints[0];
    setHighlightedWord(hint.wordIdx);
    setUsedHints(usedHints + 1);
    setTimeout(() => setHighlightedWord(null), 3000);
  };

  // Check if cell is selected
  const isCellSelected = (row, col) => {
    return selectedCells.some((c) => c.row === row && c.col === col);
  };

  // Check if cell contains found word
  const isCellInFoundWord = (row, col) => {
    for (const wordIdx of foundWords) {
      const word = placedWords[wordIdx];
      const isInWord = word.startRow <= row &&
        row < word.startRow + (word.direction === 'horizontal' ? 1 : word.word.length) &&
        word.startCol <= col &&
        col < word.startCol + (word.direction === 'horizontal' ? word.word.length : 1);
      if (isInWord) return true;
    }
    return false;
  };

  // Check if cell is in highlighted word
  const isInHighlightedWord = (row, col) => {
    if (highlightedWord === null) return false;
    const word = placedWords[highlightedWord];
    return word.startRow <= row &&
      row < word.startRow + (word.direction === 'horizontal' ? 1 : word.word.length) &&
      word.startCol <= col &&
      col < word.startCol + (word.direction === 'horizontal' ? word.word.length : 1);
  };

  const timeRemaining = Math.max(0, timeLimit - timer);
  const timeColor = timeRemaining < 60 ? '#ff6b6b' : timeRemaining < 300 ? '#ffa500' : '#4CAF50';

  return (
    <div className="word-search-container">
      <div className="word-search-header">
        <h2>Word Search - {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}</h2>
        <div className="word-search-stats">
          <span className="timer" style={{ color: timeColor }}>
            ⏱ {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
          </span>
          <span className="progress">Found: {foundWords.size}/{placedWords.length}</span>
          {isCompleted && <span className="completion-score">✓ Score: {score}</span>}
        </div>
      </div>

      <div className="word-search-content">
        {/* Grid */}
        <div
          className="word-search-grid"
          style={{
            gridTemplateColumns: `repeat(${sizeConfig.cols}, 40px)`,
            gridTemplateRows: `repeat(${sizeConfig.rows}, 40px)`,
          }}
          onMouseUp={handleMouseUp}
          onMouseLeave={() => setIsSelecting(false)}
        >
          {grid.map((row, i) =>
            row.map((cell, j) => (
              <div
                key={`${i}-${j}`}
                className={`word-search-cell ${isCellSelected(i, j) ? 'selected' : ''} ${
                  isCellInFoundWord(i, j) ? 'found' : ''
                } ${isInHighlightedWord(i, j) ? 'highlighted' : ''}`}
                onMouseDown={() => handleCellMouseDown(i, j)}
                onMouseEnter={() => handleCellMouseEnter(i, j)}
              >
                {cell?.letter || ''}
              </div>
            ))
          )}
        </div>

        {/* Word list and controls */}
        <div className="word-search-sidebar">
          <div className="word-list">
            <h3>Find These Words:</h3>
            <ul>
              {placedWords.map((word, idx) => (
                <li key={idx} className={foundWords.has(idx) ? 'found' : ''}>
                  <span className="word-item">{word.word}</span>
                  {foundWords.has(idx) && <span className="found-mark">✓</span>}
                </li>
              ))}
            </ul>
          </div>

          <div className="word-search-controls">
            <button
              onClick={requestHint}
              className="hint-btn"
              disabled={foundWords.size === placedWords.length}
            >
              💡 Hint
            </button>
            <button
              onClick={() => {
                setFoundWords(new Set());
                setSelectedCells([]);
                setTimer(0);
                setScore(0);
                setIsCompleted(false);
                setUsedHints(0);
              }}
              className="reset-btn"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {isCompleted && (
        <div className="completion-modal">
          <div className="modal-content">
            <h3>🎉 Congratulations!</h3>
            <p>You found all {placedWords.length} words!</p>
            <p>Score: {score}</p>
            <p>Time: {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default WordSearchPuzzle;
