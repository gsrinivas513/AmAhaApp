import React from 'react';

/**
 * MultiSelectQuestion - Select all correct answers (multiple selection)
 */
export default function MultiSelectQuestion({
  question,
  onAnswer,
  answered,
  selectedAnswer,
  showFeedback,
  theme,
}) {
  const options = question.options || [];
  const [selected, setSelected] = React.useState(selectedAnswer || []);

  const handleSelect = (index) => {
    if (answered) return;
    const newSelected = selected.includes(index)
      ? selected.filter((i) => i !== index)
      : [...selected, index];
    setSelected(newSelected);
  };

  const handleSubmit = () => {
    if (!answered && selected.length > 0) {
      onAnswer(selected);
    }
  };

  return (
    <div style={{ display: 'grid', gap: '20px', marginBottom: '24px' }}>
      {/* Options Container */}
      <div style={{ display: 'grid', gap: '12px' }}>
      {options.map((option, index) => {
        const isSelected = selected.includes(index);
        const isCorrect = option.isCorrect;

        return (
          <button
            key={index}
            onClick={() => handleSelect(index)}
            disabled={answered}
            style={{
              padding: '16px 20px',
              textAlign: 'left',
              background: answered
                ? isCorrect
                  ? '#4ECB7115'
                  : isSelected && !isCorrect
                  ? '#FF6B6B15'
                  : theme.surfacePrimary
                : isSelected
                ? `linear-gradient(135deg, ${theme.accentPrimary}15, ${theme.accentSecondary}10)`
                : theme.surfacePrimary,
              border: `2px solid ${
                answered
                  ? isCorrect
                    ? '#4ECB71'
                    : isSelected && !isCorrect
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
                  : isSelected && !isCorrect
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
            {/* Checkbox */}
            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '6px',
              border: `2px solid ${
                answered
                  ? isCorrect
                    ? '#4ECB71'
                    : isSelected && !isCorrect
                    ? '#FF6B6B'
                    : theme.border
                  : isSelected
                  ? theme.accentPrimary
                  : theme.border
              }`,
              background: answered
                ? isCorrect
                  ? '#4ECB71'
                  : isSelected && !isCorrect
                  ? '#FF6B6B'
                  : 'transparent'
                : isSelected
                ? `linear-gradient(135deg, ${theme.accentPrimary}, ${theme.accentSecondary})`
                : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '14px',
              fontWeight: '700',
              flexShrink: 0,
            }}>
              {isSelected && '✓'}
            </div>

            {/* Option text */}
            <span style={{ flex: 1 }}>
              {option.text || option}
            </span>

            {/* Feedback icon */}
            {answered && (
              <span style={{ fontSize: '18px', marginLeft: 'auto' }}>
                {isCorrect && !isSelected && '✓'}
                {isCorrect && isSelected && '✓'}
                {!isCorrect && isSelected && '✗'}
              </span>
            )}
          </button>
        );
      })}

      {/* Submit button */}
      {!answered && (
        <button
          onClick={handleSubmit}
          disabled={selected.length === 0}
          style={{
            marginTop: '8px',
            padding: '12px',
            width: '100%',
            background: selected.length > 0
              ? `linear-gradient(135deg, ${theme.accentPrimary}, ${theme.accentSecondary})`
              : `${theme.border}50`,
            color: selected.length > 0 ? '#fff' : theme.textSecondary,
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: selected.length > 0 ? 'pointer' : 'default',
            transition: 'all 0.3s ease',
          }}
        >
          Submit ({selected.length} selected)
        </button>
      )}
      </div>
    </div>
  );
}
