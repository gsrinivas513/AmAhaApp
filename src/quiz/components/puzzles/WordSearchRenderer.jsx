import React, { useState, useEffect } from 'react';

/**
 * WordSearchRenderer - Interactive Word Search Puzzle Player
 * Displays a letter grid with word list and handles word selection/highlighting
 */
export default function WordSearchRenderer({
  question,
  onAnswer,
  answered,
  selectedAnswer,
  showFeedback,
  theme,
}) {
  const [foundWords, setFoundWords] = useState(new Set());
  const [selectedCells, setSelectedCells] = useState(new Set());
  const [wordPositions, setWordPositions] = useState({});
  const [dragStart, setDragStart] = useState(null);
  const [dragEnd, setDragEnd] = useState(null);

  // Initialize from selected answer
  useEffect(() => {
    if (selectedAnswer?.found_words) {
      setFoundWords(new Set(selectedAnswer.found_words));
      setWordPositions(selectedAnswer.word_positions || {});
    }
  }, [selectedAnswer]);

  const grid = question.data?.grid || [];
  const words = question.data?.words || [];
  const gridSize = question.data?.gridSize || { rows: 10, cols: 10 };

  const cellSize = 40;
  const gapSize = 1;

  // Handle cell selection via mouse drag
  const handleCellMouseDown = (row, col) => {
    if (answered) return;
    setDragStart({ row, col });
    setDragEnd({ row, col });
    setSelectedCells(new Set([`${row}-${col}`]));
  };

  const handleCellMouseEnter = (row, col) => {
    if (!dragStart || answered) return;

    const newSelected = new Set();
    const startRow = dragStart.row;
    const startCol = dragStart.col;

    // Determine direction (horizontal, vertical, or diagonal)
    const rowDiff = row - startRow;
    const colDiff = col - startCol;

    const rowStep = rowDiff === 0 ? 0 : rowDiff > 0 ? 1 : -1;
    const colStep = colDiff === 0 ? 0 : colDiff > 0 ? 1 : -1;

    let r = startRow;
    let c = startCol;
    while (
      (rowStep === 0 || (rowStep > 0 ? r <= row : r >= row)) &&
      (colStep === 0 || (colStep > 0 ? c <= col : c >= col))
    ) {
      newSelected.add(`${r}-${c}`);
      r += rowStep;
      c += colStep;
    }

    setSelectedCells(newSelected);
    setDragEnd({ row, col });
  };

  const handleCellMouseUp = () => {
    if (!dragStart || !dragEnd || answered) return;

    // Check if selected cells form a valid word
    const selectedString = Array.from(selectedCells)
      .map((key) => {
        const [r, c] = key.split('-').map(Number);
        return grid[r]?.[c] || '';
      })
      .join('');

    // Check both directions (forward and backward)
    const foundWord = words.find(
      (w) =>
        w.toUpperCase() === selectedString ||
        w.toUpperCase() === selectedString.split('').reverse().join('')
    );

    if (foundWord) {
      const newFound = new Set(foundWords);
      newFound.add(foundWord.toUpperCase());
      setFoundWords(newFound);

      const newPositions = { ...wordPositions };
      newPositions[foundWord.toUpperCase()] = Array.from(selectedCells);
      setWordPositions(newPositions);
    }

    setSelectedCells(new Set());
    setDragStart(null);
    setDragEnd(null);
  };

  const handleRemoveWord = (word) => {
    if (answered) return;
    const newFound = new Set(foundWords);
    newFound.delete(word);
    setFoundWords(newFound);

    const newPositions = { ...wordPositions };
    delete newPositions[word];
    setWordPositions(newPositions);
  };

  const handleSubmit = () => {
    if (answered) return;

    onAnswer({
      found_words: Array.from(foundWords),
      word_positions: wordPositions,
    });
  };

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
        {question.text || 'Word Search Puzzle'}
      </h3>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'auto 1fr',
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
              userSelect: 'none',
            }}
            onMouseLeave={handleCellMouseUp}
          >
            {grid.map((row, r) =>
              row.map((letter, c) => {
                const cellKey = `${r}-${c}`;
                const isSelected = selectedCells.has(cellKey);
                const isInFoundWord = Object.values(wordPositions).some(
                  (positions) =>
                    positions.some((pos) => pos === cellKey)
                );

                return (
                  <div
                    key={cellKey}
                    onMouseDown={() => handleCellMouseDown(r, c)}
                    onMouseEnter={() => handleCellMouseEnter(r, c)}
                    onMouseUp={handleCellMouseUp}
                    style={{
                      width: `${cellSize}px`,
                      height: `${cellSize}px`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '16px',
                      fontWeight: '600',
                      border: isSelected
                        ? `2px solid ${theme?.accentPrimary || '#007AFF'}`
                        : `1px solid ${theme?.border || '#ddd'}`,
                      background: isSelected
                        ? `${theme?.accentPrimary || '#007AFF'}30`
                        : isInFoundWord
                        ? `#4ECB7130`
                        : theme?.surfacePrimary || '#fff',
                      color: theme?.textPrimary || '#333',
                      borderRadius: '4px',
                      cursor: answered ? 'default' : 'cell',
                      transition: 'all 0.1s ease',
                      userSelect: 'none',
                    }}
                  >
                    {letter}
                  </div>
                );
              })
            )}
          </div>

          {/* Submit Button */}
          {!answered && (
            <button
              onClick={handleSubmit}
              style={{
                marginTop: '15px',
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
                width: '100%',
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
          )}
        </div>

        {/* Word List */}
        <div>
          <h4
            style={{
              color: theme?.textPrimary || '#333',
              marginBottom: '15px',
              fontSize: '14px',
              fontWeight: '700',
              textTransform: 'uppercase',
            }}
          >
            Words to Find ({foundWords.size}/{words.length})
          </h4>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            {words.map((word, idx) => {
              const isFound = foundWords.has(word.toUpperCase());

              return (
                <div
                  key={idx}
                  style={{
                    padding: '12px',
                    background: isFound
                      ? '#4ECB7120'
                      : theme?.surfaceSecondary || '#f9f9f9',
                    border: `1px solid ${
                      isFound ? '#4ECB71' : theme?.border || '#ddd'
                    }`,
                    borderRadius: '6px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <span
                    style={{
                      color: isFound ? '#4ECB71' : theme?.textPrimary || '#333',
                      fontWeight: isFound ? '700' : '500',
                      textDecoration: isFound ? 'line-through' : 'none',
                      fontSize: '14px',
                    }}
                  >
                    {word.toUpperCase()}
                  </span>
                  {isFound && (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <span style={{ color: '#4ECB71', fontWeight: '700' }}>
                        ✓
                      </span>
                      {!answered && (
                        <button
                          onClick={() => handleRemoveWord(word.toUpperCase())}
                          style={{
                            padding: '4px 8px',
                            background: 'transparent',
                            color: '#FF6B6B',
                            border: '1px solid #FF6B6B',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: '600',
                            transition: 'all 0.2s ease',
                          }}
                          onMouseOver={(e) => {
                            e.target.style.background = '#FF6B6B20';
                          }}
                          onMouseOut={(e) => {
                            e.target.style.background = 'transparent';
                          }}
                        >
                          Undo
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Instructions */}
          <div
            style={{
              marginTop: '20px',
              padding: '12px',
              background: `${theme?.accentPrimary || '#007AFF'}10`,
              border: `1px solid ${theme?.accentPrimary || '#007AFF'}30`,
              borderRadius: '6px',
              fontSize: '13px',
              color: theme?.textSecondary || '#666',
              lineHeight: '1.5',
            }}
          >
            <strong>How to play:</strong>
            <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px' }}>
              <li>Click and drag to select words (horizontal, vertical, diagonal)</li>
              <li>Found words appear in the list and are highlighted</li>
              <li>Click Undo to remove a word if needed</li>
              <li>Submit when all words are found</li>
            </ul>
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
          ✓ Word search submitted! You found {foundWords.size} out of {words.length} words.
        </div>
      )}
    </div>
  );
}
