import React, { useState } from 'react';

/**
 * MatchingQuestion - Match pairs question type
 */
export default function MatchingQuestion({
  question,
  onAnswer,
  answered,
  selectedAnswer,
  showFeedback,
  theme,
}) {
  const pairs = question.pairs || [];
  const [matches, setMatches] = useState(selectedAnswer || {});
  const [selectedLeft, setSelectedLeft] = useState(null);

  // Randomize right side on mount
  const rightSideItems = question.randomizeRightSide
    ? pairs.slice().sort(() => Math.random() - 0.5)
    : pairs;

  const handleMatchClick = (leftId, rightId) => {
    if (answered) return;
    const newMatches = { ...matches };
    newMatches[leftId] = rightId;
    setMatches(newMatches);
  };

  const handleSubmit = () => {
    if (!answered) {
      // Check if all pairs are matched
      const allMatched = pairs.every((pair) => matches[pair.id]);
      if (allMatched) {
        onAnswer(matches);
      }
    }
  };

  const areAllMatched = pairs.every((pair) => matches[pair.id]);
  const checkAnswer = (leftId, rightId) => {
    const pair = pairs.find((p) => p.id === leftId);
    return pair && pair.id === rightId;
  };

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

      {/* Matching Container */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        gap: '20px',
        marginBottom: '20px',
      }}>
        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {pairs.map((pair) => (
            <button
              key={`left-${pair.id}`}
              onClick={() => setSelectedLeft(selectedLeft === pair.id ? null : pair.id)}
              style={{
                padding: '12px 16px',
                textAlign: 'left',
                background: selectedLeft === pair.id
                  ? `linear-gradient(135deg, ${theme.accentPrimary}20, ${theme.accentSecondary}10)`
                  : theme.surfacePrimary,
                border: `2px solid ${selectedLeft === pair.id ? theme.accentPrimary : theme.border}`,
                borderRadius: '8px',
                color: theme.textPrimary,
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {pair.left}
            </button>
          ))}
        </div>

        {/* Connection indicator */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-around',
          alignItems: 'center',
          color: theme.textSecondary,
        }}>
          {pairs.map((pair) => (
            <div key={`arrow-${pair.id}`} style={{ fontSize: '20px' }}>
              {matches[pair.id] ? '→' : '○'}
            </div>
          ))}
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {rightSideItems.map((pair) => (
            <button
              key={`right-${pair.id}`}
              onClick={() => selectedLeft && handleMatchClick(selectedLeft, pair.id)}
              disabled={answered}
              style={{
                padding: '12px 16px',
                textAlign: 'left',
                background: answered
                  ? pairs.some((p) => p.id === selectedLeft && matches[p.id] === pair.id && checkAnswer(p.id, pair.id))
                    ? '#4ECB7115'
                    : theme.surfacePrimary
                  : theme.surfacePrimary,
                border: `2px solid ${theme.border}`,
                borderRadius: '8px',
                color: theme.textPrimary,
                fontSize: '14px',
                fontWeight: '500',
                cursor: answered ? 'default' : 'pointer',
                transition: 'all 0.2s ease',
                opacity: !answered && selectedLeft && !matches[selectedLeft] ? 1 : 0.7,
              }}
              onMouseOver={(e) => {
                if (!answered && selectedLeft && !matches[selectedLeft]) {
                  e.currentTarget.style.background = `${theme.accentPrimary}15`;
                  e.currentTarget.style.borderColor = theme.accentPrimary;
                }
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = theme.surfacePrimary;
                e.currentTarget.style.borderColor = theme.border;
              }}
            >
              {pair.right}
            </button>
          ))}
        </div>
      </div>

      {/* Status and button */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px',
      }}>
        <span style={{
          fontSize: '14px',
          color: theme.textSecondary,
        }}>
          Matched: {Object.keys(matches).length} / {pairs.length}
        </span>
        {!answered && (
          <button
            onClick={handleSubmit}
            disabled={!areAllMatched}
            style={{
              padding: '8px 20px',
              background: areAllMatched
                ? `linear-gradient(135deg, ${theme.accentPrimary}, ${theme.accentSecondary})`
                : `${theme.border}50`,
              color: areAllMatched ? '#fff' : theme.textSecondary,
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: areAllMatched ? 'pointer' : 'default',
              transition: 'all 0.3s ease',
            }}
          >
            Submit
          </button>
        )}
      </div>

      {/* Feedback */}
      {answered && showFeedback && (
        <div style={{
          padding: '12px 16px',
          background: '#4ECB7110',
          border: '1px solid #4ECB71',
          borderRadius: '8px',
          color: '#4ECB71',
          textAlign: 'center',
          fontWeight: '600',
        }}>
          ✓ All pairs matched!
        </div>
      )}
    </div>
  );
}
