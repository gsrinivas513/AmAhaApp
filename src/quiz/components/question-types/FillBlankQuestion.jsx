import React, { useState } from 'react';

/**
 * FillBlankQuestion - Fill in the blank question type
 */
export default function FillBlankQuestion({
  question,
  onAnswer,
  answered,
  selectedAnswer,
  showFeedback,
  theme,
}) {
  const [inputValue, setInputValue] = useState(selectedAnswer || '');

  // Check if answer is correct (case-insensitive by default)
  const checkAnswer = (value) => {
    const userAnswer = value.trim().toLowerCase();
    const correctAnswer = question.answer.toLowerCase();
    const caseSensitive = question.caseSensitive || false;

    if (caseSensitive) {
      return value.trim() === question.answer;
    }

    // Check exact match
    if (userAnswer === correctAnswer) return true;

    // Check variations if provided
    if (question.acceptVariations) {
      return question.acceptVariations.some(
        (variation) => userAnswer === variation.toLowerCase()
      );
    }

    return false;
  };

  const isCorrect = checkAnswer(inputValue);
  const handleSubmit = () => {
    if (!answered && inputValue.trim()) {
      onAnswer(inputValue, isCorrect);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !answered && inputValue.trim()) {
      handleSubmit();
    }
  };

  return (
    <div style={{ marginBottom: '24px' }}>
      {/* Question text with blank */}
      <p style={{
        color: theme.textPrimary,
        fontSize: '16px',
        lineHeight: '1.8',
        marginBottom: '24px',
        textAlign: 'center',
      }}>
        {question.text.replace(
          '____',
          answered ? (
            <span style={{
              background: isCorrect ? '#4ECB7130' : '#FF6B6B30',
              color: isCorrect ? '#4ECB71' : '#FF6B6B',
              padding: '4px 8px',
              borderRadius: '4px',
              fontWeight: '700',
              marginLeft: '4px',
              marginRight: '4px',
            }}>
              {inputValue}
            </span>
          ) : (
            <span style={{
              borderBottom: `2px solid ${theme.accentPrimary}`,
              minWidth: '120px',
              display: 'inline-block',
            }} />
          )
        )}
      </p>

      {/* Input field (if not answered) */}
      {!answered && (
        <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your answer here..."
            disabled={answered}
            style={{
              flex: 1,
              padding: '12px 16px',
              fontSize: '16px',
              border: `2px solid ${theme.border}`,
              borderRadius: '8px',
              color: theme.textPrimary,
              background: theme.surfacePrimary,
              transition: 'all 0.2s ease',
              outline: 'none',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = theme.accentPrimary;
              e.currentTarget.style.boxShadow = `0 0 0 3px ${theme.accentPrimary}20`;
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = theme.border;
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
          <button
            onClick={handleSubmit}
            disabled={!inputValue.trim()}
            style={{
              padding: '12px 24px',
              background: inputValue.trim()
                ? `linear-gradient(135deg, ${theme.accentPrimary}, ${theme.accentSecondary})`
                : `${theme.border}50`,
              color: inputValue.trim() ? '#fff' : theme.textSecondary,
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: inputValue.trim() ? 'pointer' : 'default',
              transition: 'all 0.3s ease',
            }}
            onMouseOver={(e) => {
              if (inputValue.trim()) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = `0 6px 20px ${theme.accentPrimary}30`;
              }
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Submit
          </button>
        </div>
      )}

      {/* Feedback (if answered) */}
      {answered && showFeedback && (
        <div style={{
          marginTop: '16px',
          padding: '12px 16px',
          background: isCorrect ? '#4ECB7110' : '#FF6B6B10',
          border: `1px solid ${isCorrect ? '#4ECB71' : '#FF6B6B'}`,
          borderRadius: '8px',
          color: isCorrect ? '#4ECB71' : '#FF6B6B',
          textAlign: 'center',
          fontWeight: '600',
        }}>
          {isCorrect ? '✓ Correct!' : `✗ The correct answer is: ${question.answer}`}
        </div>
      )}

      {/* Hints */}
      {!answered && question.hints && question.hints.length > 0 && (
        <div style={{
          marginTop: '16px',
          padding: '12px',
          background: `${theme.accentPrimary}10`,
          border: `1px dashed ${theme.accentPrimary}30`,
          borderRadius: '8px',
          fontSize: '14px',
          color: theme.textSecondary,
        }}>
          <strong>💡 Hint:</strong> {question.hints[0]}
        </div>
      )}
    </div>
  );
}
