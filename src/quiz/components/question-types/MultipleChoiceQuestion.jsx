import React from 'react';

/**
 * MultipleChoiceQuestion - Standard multiple choice question
 */
export default function MultipleChoiceQuestion({
  question,
  onAnswer,
  answered,
  selectedAnswer,
  showFeedback,
  theme,
}) {
  const options = question.options || question.answer?.options || [];

  return (
    <div style={{ display: 'grid', gap: '12px', marginBottom: '24px' }}>
      {options.map((option, index) => {
        const isCorrect = index === question.correctAnswer || option.isCorrect;
        const isSelected = selectedAnswer === index;

        return (
          <button
            key={index}
            onClick={() => !answered && onAnswer(index)}
            disabled={answered}
            style={{
              padding: '16px 20px',
              textAlign: 'left',
              background: answered
                ? isCorrect
                  ? '#4ECB7115'
                  : isSelected
                  ? '#FF6B6B15'
                  : theme.surfacePrimary
                : isSelected
                ? `linear-gradient(135deg, ${theme.accentPrimary}15, ${theme.accentSecondary}10)`
                : theme.surfacePrimary,
              border: `2px solid ${
                answered
                  ? isCorrect
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
                ? isCorrect
                  ? '#4ECB71'
                  : isSelected
                  ? '#FF6B6B'
                  : theme.textPrimary
                : theme.textPrimary,
              fontSize: '15px',
              fontWeight: '600',
              cursor: answered ? 'default' : 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: isSelected && !answered ? `0 4px 12px ${theme.accentPrimary}20` : 'none',
              display: 'flex',
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
            {/* Letter indicator */}
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: answered
                ? isCorrect
                  ? 'linear-gradient(135deg, #4ECB71, #34A853)'
                  : isSelected
                  ? 'linear-gradient(135deg, #FF6B6B, #EF4444)'
                  : `linear-gradient(135deg, ${theme.accentPrimary}30, ${theme.accentSecondary}30)`
                : `linear-gradient(135deg, ${theme.accentPrimary}, ${theme.accentSecondary})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '16px',
              fontWeight: '700',
              flexShrink: 0,
            }}>
              {String.fromCharCode(65 + index)}
            </div>

            {/* Option text */}
            <span style={{ flex: 1 }}>
              {option.text || option}
            </span>

            {/* Feedback icon */}
            {answered && (
              <span style={{ fontSize: '18px', marginLeft: 'auto' }}>
                {isCorrect ? '✓' : isSelected ? '✗' : ''}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
