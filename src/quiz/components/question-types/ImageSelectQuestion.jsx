import React from 'react';

/**
 * ImageSelectQuestion - Select image(s) to answer question
 */
export default function ImageSelectQuestion({
  question,
  onAnswer,
  answered,
  selectedAnswer,
  showFeedback,
  theme,
  disableHints = false,
  contestMode = false,
}) {
  // Handle both 'options' and 'images' property names
  const rawOptions = question.options || question.images || [];
  
  // Transform to standard format with imageUrl
  const options = rawOptions.map((option, idx) => ({
    imageUrl: option.imageUrl || option.url,
    label: option.label || `Option ${idx + 1}`,
    isCorrect: option.isCorrect,
  }));
  
  const multiSelect = question.multiSelect || false;
  const [selected, setSelected] = React.useState(selectedAnswer || (multiSelect ? [] : null));

  const handleSelect = (index) => {
    if (answered) return;
    if (multiSelect) {
      const newSelected = selected.includes(index)
        ? selected.filter((i) => i !== index)
        : [...selected, index];
      setSelected(newSelected);
    } else {
      setSelected(index);
    }
  };

  const handleSubmit = () => {
    if (!answered) {
      onAnswer(selected);
    }
  };

  return (
    <div style={{ marginBottom: '24px' }}>
      {/* Images grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '20px',
      }}>
        {options.map((option, index) => {
          const isSelected = multiSelect ? selected.includes(index) : selected === index;
          const isCorrect = option.isCorrect;

          return (
            <button
              key={index}
              onClick={() => handleSelect(index)}
              disabled={answered}
              style={{
                padding: 0,
                background: 'transparent',
                border: `3px solid ${
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
                cursor: answered ? 'default' : 'pointer',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                boxShadow: isSelected && !answered ? `0 4px 12px ${theme.accentPrimary}20` : 'none',
              }}
              onMouseOver={(e) => {
                if (!answered) {
                  e.currentTarget.style.boxShadow = `0 4px 12px ${theme.accentPrimary}15`;
                }
              }}
              onMouseOut={(e) => {
                if (!answered && !isSelected) {
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
            >
              {/* Image */}
              <div style={{ position: 'relative', width: '100%', paddingBottom: '100%' }}>
                <img
                  src={option.imageUrl}
                  alt={option.label || `Option ${index + 1}`}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    opacity: answered && !isCorrect && !isSelected ? 0.5 : 1,
                  }}
                />

                {/* Overlay feedback */}
                {answered && (
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: isCorrect
                      ? 'rgba(78, 203, 113, 0.1)'
                      : isSelected
                      ? 'rgba(255, 107, 107, 0.1)'
                      : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '32px',
                  }}>
                    {isCorrect && '✓'}
                    {isSelected && !isCorrect && '✗'}
                  </div>
                )}
              </div>

              {/* Label */}
              {option.label && (
                <div style={{
                  padding: '12px',
                  textAlign: 'center',
                  background: theme.surfacePrimary,
                  fontWeight: '600',
                  fontSize: '14px',
                  color: theme.textPrimary,
                }}>
                  {option.label}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Submit button */}
      {!answered && (
        <button
          onClick={handleSubmit}
          disabled={multiSelect ? selected.length === 0 : selected === null}
          style={{
            width: '100%',
            padding: '12px',
            background: multiSelect
              ? selected.length > 0
                ? `linear-gradient(135deg, ${theme.accentPrimary}, ${theme.accentSecondary})`
                : `${theme.border}50`
              : selected !== null
              ? `linear-gradient(135deg, ${theme.accentPrimary}, ${theme.accentSecondary})`
              : `${theme.border}50`,
            color: multiSelect ? (selected.length > 0 ? '#fff' : theme.textSecondary) : selected !== null ? '#fff' : theme.textSecondary,
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: multiSelect ? (selected.length > 0 ? 'pointer' : 'default') : selected !== null ? 'pointer' : 'default',
            transition: 'all 0.3s ease',
          }}
        >
          Submit
        </button>
      )}
    </div>
  );
}
