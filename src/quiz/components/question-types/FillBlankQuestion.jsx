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

  // Parse correct answers - handle both array and string formats
  const getCorrectAnswers = () => {
    if (question.correctAnswers && Array.isArray(question.correctAnswers)) {
      return question.correctAnswers;
    } else if (question.answer && Array.isArray(question.answer)) {
      return question.answer;
    } else if (question.answer && typeof question.answer === 'string') {
      return [question.answer];
    } else if (typeof question.answer === 'object' && question.answer?.text) {
      return [question.answer.text];
    }
    return [];
  };

  const correctAnswers = getCorrectAnswers();

  // Check if answer is correct (case-insensitive by default)
  const checkAnswer = (value) => {
    if (correctAnswers.length === 0) return false;
    
    const userAnswer = value.trim().toLowerCase();
    const caseSensitive = question.caseSensitive || false;

    return correctAnswers.some((correct) => {
      if (caseSensitive) {
        return value.trim() === correct;
      }
      return userAnswer === correct.toLowerCase();
    });
  };

  const isCorrect = checkAnswer(inputValue);
  const handleSubmit = () => {
    if (!answered && inputValue.trim()) {
      onAnswer(inputValue);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !answered && inputValue.trim()) {
      handleSubmit();
    }
  };

  return (
    <div style={{ marginBottom: '24px', width: '100%' }}>
      {/* Input field container */}
      <div style={{ 
        display: 'flex', 
        gap: '12px', 
        marginBottom: '12px',
        width: '100%',
        minHeight: '50px',
      }}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => {
            if (!answered) {
              setInputValue(e.target.value);
            }
          }}
          onKeyPress={handleKeyPress}
          placeholder="Type your answer here..."
          disabled={answered}
          autoFocus
          style={{
            flex: 1,
            padding: '14px 18px',
            fontSize: '16px',
            border: '2px solid #FF6633',
            borderRadius: '8px',
            color: '#333',
            backgroundColor: '#ffffff',
            transition: 'all 0.2s ease',
            outline: 'none',
            cursor: 'text',
            fontFamily: 'inherit',
            boxSizing: 'border-box',
            minWidth: '0',
          }}
          onFocus={(e) => {
            e.currentTarget.style.boxShadow = '0 0 0 4px rgba(255, 102, 51, 0.2)';
            e.currentTarget.style.borderColor = '#FF6633';
          }}
          onBlur={(e) => {
            e.currentTarget.style.boxShadow = 'none';
          }}
        />
        <button
          onClick={handleSubmit}
          disabled={!inputValue.trim() || answered}
          style={{
            padding: '14px 28px',
            background: inputValue.trim() && !answered ? '#FF6633' : '#ccc',
            color: inputValue.trim() && !answered ? '#fff' : '#999',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: inputValue.trim() && !answered ? 'pointer' : 'not-allowed',
            transition: 'all 0.3s ease',
            whiteSpace: 'nowrap',
            fontFamily: 'inherit',
            flexShrink: 0,
          }}
          onMouseOver={(e) => {
            if (inputValue.trim() && !answered) {
              e.currentTarget.style.background = '#E85A23';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 102, 51, 0.3)';
            }
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = inputValue.trim() && !answered ? '#FF6633' : '#ccc';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          Submit
        </button>
      </div>

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
          {isCorrect 
            ? '✓ Correct!' 
            : `✗ The correct answer is: ${correctAnswers.join(' or ')}`
          }
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
