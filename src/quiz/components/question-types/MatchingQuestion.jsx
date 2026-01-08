import React, { useState, useRef, useEffect } from 'react';

/**
 * MatchingQuestion - Visual connection matching with validation
 */
export default function MatchingQuestion({
  question,
  onAnswer,
  answered,
  selectedAnswer,
  showFeedback,
  theme,
  disableHints = false,
  contestMode = false,
}) {
  // Parse data - handle both structures
  let leftItems = [];
  let rightItems = [];
  
  if (question.answer?.leftItems && question.answer?.rightItems) {
    leftItems = question.answer.leftItems;
    rightItems = question.answer.rightItems;
  } else if (question.pairs && Array.isArray(question.pairs)) {
    leftItems = question.pairs.map(p => p.left);
    rightItems = question.pairs.map(p => p.right);
  }
  
  const [matches, setMatches] = useState(selectedAnswer || {});
  const [selectedLeftId, setSelectedLeftId] = useState(null);
  const leftRefs = useRef({});
  const rightRefs = useRef({});
  const containerRef = useRef(null);
  const [lines, setLines] = useState([]);

  // Validate if all matches are correct
  const isAnswerCorrect = () => {
    if (Object.keys(matches).length !== leftItems.length) return false;
    
    return leftItems.every((leftItem, leftIndex) => {
      const leftId = `left-${leftIndex}`;
      const rightId = matches[leftId];
      
      if (!rightId) return false;
      
      // Extract index from rightId (format: "right-0", "right-1", etc)
      const rightIndex = parseInt(rightId.split('-')[1]);
      
      // For test data with pairs, check against original pairs array
      if (question.pairs && Array.isArray(question.pairs)) {
        const correctRight = question.pairs[leftIndex]?.right;
        const selectedRight = rightItems[rightIndex];
        return selectedRight === correctRight;
      }
      
      // For admin form: rightItems already in correct order
      return rightIndex === leftIndex;
    });
  };

  // Check if a specific match is correct
  const isMatchCorrect = (leftIndex, rightId) => {
    const rightIndex = parseInt(rightId.split('-')[1]);
    
    if (question.pairs && Array.isArray(question.pairs)) {
      const correctRight = question.pairs[leftIndex]?.right;
      const selectedRight = rightItems[rightIndex];
      return selectedRight === correctRight;
    }
    
    return rightIndex === leftIndex;
  };

  // Update lines when matches change
  useEffect(() => {
    if (!containerRef.current) return;
    
    const newLines = [];
    Object.entries(matches).forEach(([leftId, rightId]) => {
      const leftEl = leftRefs.current[leftId];
      const rightEl = rightRefs.current[rightId];
      
      if (!leftEl || !rightEl) return;
      
      const containerRect = containerRef.current.getBoundingClientRect();
      const leftRect = leftEl.getBoundingClientRect();
      const rightRect = rightEl.getBoundingClientRect();
      
      const x1 = leftRect.right - containerRect.left;
      const y1 = leftRect.top - containerRect.top + leftRect.height / 2;
      const x2 = rightRect.left - containerRect.left;
      const y2 = rightRect.top - containerRect.top + rightRect.height / 2;
      
      // Create bezier curve path
      const controlX = (x1 + x2) / 2;
      const path = `M ${x1} ${y1} Q ${controlX} ${y1} ${controlX} ${(y1 + y2) / 2} T ${x2} ${y2}`;
      
      // Determine line color based on correctness
      const leftIndex = parseInt(leftId.split('-')[1]);
      let lineColor = theme.accentPrimary; // default: orange
      let opacity = 0.6;
      
      if (answered) {
        const isCorrect = isMatchCorrect(leftIndex, rightId);
        lineColor = isCorrect ? '#4ECB71' : '#FF6666'; // green or red
        opacity = 0.8;
      }
      
      newLines.push({
        key: `${leftId}-${rightId}`,
        path,
        color: lineColor,
        opacity,
      });
    });
    
    setLines(newLines);
  }, [matches, answered]);

  const handleSelectLeft = (leftId) => {
    if (answered) return;
    setSelectedLeftId(selectedLeftId === leftId ? null : leftId);
  };

  const handleSelectRight = (rightId) => {
    if (answered || !selectedLeftId) return;
    
    const newMatches = { ...matches };
    newMatches[selectedLeftId] = rightId;
    setMatches(newMatches);
    setSelectedLeftId(null);
  };

  const handleUnmatch = (leftId) => {
    if (answered) return;
    const newMatches = { ...matches };
    delete newMatches[leftId];
    setMatches(newMatches);
  };

  const handleSubmit = () => {
    if (!answered) {
      const allMatched = leftItems.every((_, i) => matches[`left-${i}`]);
      if (allMatched) {
        onAnswer(matches);
      }
    }
  };

  const areAllMatched = leftItems.every((_, i) => matches[`left-${i}`]);
  const allCorrect = isAnswerCorrect();

  return (
    <div style={{ marginBottom: '24px' }}>
      {/* Instruction */}
      {question.instruction && (
        <p style={{
          color: theme.textSecondary,
          fontSize: '14px',
          marginBottom: '16px',
          fontStyle: 'italic',
        }}>
          {question.instruction}
        </p>
      )}

      {/* Instruction hint */}
      {!answered && (
        <p style={{
          color: theme.accentPrimary,
          fontSize: '13px',
          marginBottom: '16px',
          fontWeight: '600',
        }}>
          {selectedLeftId 
            ? '👉 Click an item on the right to create a connection'
            : '👈 Click an item on the left to start'}
        </p>
      )}

      {/* Matching Area */}
      <div 
        ref={containerRef}
        style={{
          position: 'relative',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '80px',
          marginBottom: '20px',
          minHeight: '320px',
          padding: '20px 0',
          overflow: 'visible',
        }}
      >
        {/* SVG for connection lines */}
        <svg
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 1,
          }}
          preserveAspectRatio="none"
        >
          {lines.map(line => (
            <path
              key={line.key}
              d={line.path}
              stroke={line.color}
              strokeWidth="2.5"
              fill="none"
              opacity={line.opacity}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
        </svg>

        {/* LEFT COLUMN */}
        <div style={{ position: 'relative', zIndex: 2 }}>
          <h4 style={{
            fontSize: '11px',
            fontWeight: 'bold',
            color: theme.textSecondary,
            marginBottom: '14px',
            textTransform: 'uppercase',
            letterSpacing: '0.6px',
          }}>
            Items
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {leftItems.map((leftItem, index) => {
              const leftId = `left-${index}`;
              const isSelected = selectedLeftId === leftId;
              const isMatched = !!matches[leftId];

              return (
                <button
                  key={leftId}
                  ref={(ref) => { if (ref) leftRefs.current[leftId] = ref; }}
                  onClick={() => handleSelectLeft(leftId)}
                  disabled={answered}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    background: isSelected
                      ? theme.accentPrimary
                      : isMatched
                      ? `${theme.accentPrimary}08`
                      : theme.surfacePrimary,
                    color: isSelected ? '#fff' : theme.textPrimary,
                    border: `2px solid ${isSelected ? theme.accentPrimary : isMatched ? theme.accentPrimary : theme.border}`,
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: isSelected ? '700' : isMatched ? '600' : '500',
                    cursor: answered ? 'default' : 'grab',
                    transition: 'all 0.15s ease',
                    textAlign: 'left',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span>{leftItem}</span>
                  {isMatched && (
                    <span style={{
                      fontSize: '16px',
                      color: isSelected ? '#fff' : theme.accentPrimary,
                    }}>
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div style={{ position: 'relative', zIndex: 2 }}>
          <h4 style={{
            fontSize: '11px',
            fontWeight: 'bold',
            color: theme.textSecondary,
            marginBottom: '14px',
            textTransform: 'uppercase',
            letterSpacing: '0.6px',
          }}>
            Connections
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {rightItems.map((rightItem, index) => {
              const rightId = `right-${index}`;
              const matchedLeftId = Object.entries(matches).find(([, rId]) => rId === rightId)?.[0];
              const isAlreadyMatched = !!matchedLeftId;
              const canSelect = selectedLeftId && !matches[selectedLeftId];

              return (
                <div key={rightId}>
                  <button
                    ref={(ref) => { if (ref) rightRefs.current[rightId] = ref; }}
                    onClick={() => handleSelectRight(rightId)}
                    disabled={answered || !canSelect}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      background: isAlreadyMatched
                        ? `${theme.accentPrimary}08`
                        : canSelect
                        ? `${theme.accentSecondary}15`
                        : theme.surfacePrimary,
                      color: isAlreadyMatched ? theme.accentPrimary : theme.textPrimary,
                      border: `2px solid ${isAlreadyMatched ? theme.accentPrimary : canSelect ? theme.accentSecondary : theme.border}`,
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: isAlreadyMatched ? '600' : '500',
                      cursor: canSelect && !answered ? 'grab' : 'default',
                      opacity: isAlreadyMatched && matchedLeftId !== selectedLeftId ? 0.7 : 1,
                      transition: 'all 0.15s ease',
                      textAlign: 'left',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span>{rightItem}</span>
                    {isAlreadyMatched && (
                      <span style={{
                        fontSize: '16px',
                        color: theme.accentPrimary,
                      }}>
                        ✓
                      </span>
                    )}
                  </button>
                  {isAlreadyMatched && !answered && (
                    <button
                      onClick={() => handleUnmatch(matchedLeftId)}
                      style={{
                        width: '100%',
                        marginTop: '3px',
                        padding: '3px 10px',
                        background: 'transparent',
                        color: theme.accentPrimary,
                        border: `1px solid ${theme.accentPrimary}50`,
                        borderRadius: '4px',
                        fontSize: '10px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.1s ease',
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background = `${theme.accentPrimary}20`;
                        e.currentTarget.style.borderColor = theme.accentPrimary;
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.borderColor = `${theme.accentPrimary}50`;
                      }}
                    >
                      Disconnect
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Status bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 14px',
        background: `${theme.accentPrimary}06`,
        borderRadius: '6px',
        marginTop: '16px',
      }}>
        <span style={{
          fontSize: '13px',
          color: theme.textSecondary,
          fontWeight: '600',
        }}>
          Connected: {Object.keys(matches).length} / {leftItems.length}
        </span>
        {!answered && (
          <button
            onClick={handleSubmit}
            disabled={!areAllMatched}
            style={{
              padding: '8px 20px',
              background: areAllMatched
                ? `linear-gradient(135deg, ${theme.accentPrimary}, ${theme.accentSecondary})`
                : `${theme.border}40`,
              color: areAllMatched ? '#fff' : theme.textSecondary,
              border: 'none',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: areAllMatched ? 'pointer' : 'default',
              transition: 'all 0.15s ease',
            }}
          >
            Submit
          </button>
        )}
      </div>

      {/* Feedback - ONLY show when answered AND showFeedback */}
      {answered && showFeedback && (
        <div style={{
          marginTop: '14px',
          padding: '12px 14px',
          background: allCorrect ? '#4ECB7110' : '#FF666610',
          border: `1px solid ${allCorrect ? '#4ECB71' : '#FF6666'}`,
          borderRadius: '6px',
          color: allCorrect ? '#4ECB71' : '#FF6666',
          textAlign: 'center',
          fontWeight: '600',
          fontSize: '13px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
        }}>
          <span style={{ fontSize: '16px' }}>
            {allCorrect ? '✓' : '✗'}
          </span>
          {allCorrect 
            ? 'All connections are correct!'
            : 'Some connections are incorrect. Try again!'}
        </div>
      )}
    </div>
  );
}
