import React from 'react';

/**
 * TrueFalseQuestion - Simple true/false question
 */
export default function TrueFalseQuestion({
  question,
  onAnswer,
  answered,
  selectedAnswer,
  showFeedback,
  theme,
  disableHints = false,
  contestMode = false,
}) {
  // Handle both boolean and index-based correctAnswer formats
  let correctAnswerIndex = 0;
  
  if (typeof question.correctAnswer === 'boolean') {
    // Convert boolean to index: true -> 0, false -> 1
    correctAnswerIndex = question.correctAnswer ? 0 : 1;
  } else if (typeof question.correctAnswer === 'number') {
    // Already an index
    correctAnswerIndex = question.correctAnswer;
  } else if (question.answer?.isCorrect !== undefined) {
    // Handle answer object format
    correctAnswerIndex = question.answer.isCorrect ? 0 : 1;
  }

  const options = [
    { text: 'True', value: 0, isCorrect: correctAnswerIndex === 0 },
    { text: 'False', value: 1, isCorrect: correctAnswerIndex === 1 },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
      {options.map((option, index) => {
        const isSelected = selectedAnswer === index;

        return (
          <button
            key={index}
            onClick={() => !answered && onAnswer(index)}
            disabled={answered}
            style={{
              padding: '32px 24px',
              textAlign: 'center',
              background: answered
                ? option.isCorrect
                  ? '#4ECB7115'
                  : isSelected
                  ? '#FF6B6B15'
                  : theme.surfacePrimary
                : isSelected
                ? `linear-gradient(135deg, ${theme.accentPrimary}15, ${theme.accentSecondary}10)`
                : theme.surfacePrimary,
              border: `2px solid ${
                answered
                  ? option.isCorrect
                    ? '#4ECB71'
                    : isSelected
                    ? '#FF6B6B'
                    : theme.border
                  : isSelected
                  ? theme.accentPrimary
                  : theme.border
              }`,
              borderRadius: '12px',
              color: answered
                ? option.isCorrect
                  ? '#4ECB71'
                  : isSelected
                  ? '#FF6B6B'
                  : theme.textPrimary
                : theme.textPrimary,
              fontSize: '20px',
              fontWeight: '700',
              cursor: answered ? 'default' : 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: isSelected && !answered ? `0 4px 12px ${theme.accentPrimary}20` : 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px',
            }}
            onMouseOver={(e) => {
              if (!answered) {
                e.currentTarget.style.borderColor = theme.accentPrimary;
                e.currentTarget.style.background = `linear-gradient(135deg, ${theme.accentPrimary}10, ${theme.accentSecondary}05)`;
                e.currentTarget.style.boxShadow = `0 4px 12px ${theme.accentPrimary}15`;
              }
            }}
            onMouseOut={(e) => {
              if (!answered && !isSelected) {
                e.currentTarget.style.borderColor = theme.border;
                e.currentTarget.style.background = theme.surfacePrimary;
                e.currentTarget.style.boxShadow = 'none';
              }
            }}
          >
            {/* Icon */}
            <span style={{ fontSize: '32px' }}>
              {option.text === 'True' ? '✓' : '✗'}
            </span>

            {/* Text */}
            <span>{option.text}</span>

            {/* Feedback icon */}
            {answered && (
              <span style={{ fontSize: '20px', marginTop: '4px' }}>
                {option.isCorrect ? '🎉' : isSelected ? '❌' : ''}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
