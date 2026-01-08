import React, { useState } from 'react';
import MultipleChoiceQuestion from './question-types/MultipleChoiceQuestion';
import TrueFalseQuestion from './question-types/TrueFalseQuestion';
import FillBlankQuestion from './question-types/FillBlankQuestion';
import MatchingQuestion from './question-types/MatchingQuestion';
import OrderingQuestion from './question-types/OrderingQuestion';
import ImageSelectQuestion from './question-types/ImageSelectQuestion';
import MultiSelectQuestion from './question-types/MultiSelectQuestion';
import DragDropQuestion from './question-types/DragDropQuestion';

/**
 * QuestionRenderer - Renders different question types
 * Supports: multiple-choice, true-false, fill-blank, matching, ordering, 
 *           image-select, multi-select, drag-drop
 */
export default function QuestionRenderer({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
  answered,
  selectedAnswer,
  showFeedback,
  theme,
  difficulty,
  contestMode = false,
  disableHints = false,
  disableCheck = false,
  disableReveal = false,
}) {
  const [showExplanation, setShowExplanation] = useState(false);

  if (!question) return <div style={{ color: theme.textSecondary }}>Loading question...</div>;

  // Determine question type with fallback
  const questionType = question.type || 'multiple-choice';

  // Common header styles
  const headerStyles = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    paddingBottom: '12px',
    borderBottom: `1px solid ${theme.border}`,
  };

  const questionCounterStyles = {
    color: theme.textSecondary,
    fontSize: '13px',
    fontWeight: '600',
  };

  const difficultyBadgeStyles = {
    background: `${theme.accentPrimary}20`,
    color: theme.accentPrimary,
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
  };

  const questionTitleStyles = {
    color: theme.textPrimary,
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '12px',
    lineHeight: '1.6',
  };

  // Image styles if present
  const questionImageContainer = question.imageUrl && {
    marginBottom: '20px',
    borderRadius: '12px',
    overflow: 'hidden',
    maxHeight: '300px',
  };

  const questionImageStyles = {
    width: '100%',
    height: 'auto',
    maxHeight: '300px',
    objectFit: 'cover',
  };

  // Explanation styles
  const explanationStyles = {
    marginTop: '16px',
    padding: '12px',
    background: `${theme.accentPrimary}10`,
    border: `1px solid ${theme.accentPrimary}30`,
    borderRadius: '8px',
    color: theme.textSecondary,
    fontSize: '14px',
    lineHeight: '1.6',
  };

  const explanationTitleStyles = {
    fontWeight: '600',
    color: theme.textPrimary,
    marginBottom: '8px',
  };

  // Render the appropriate question type
  const renderQuestionContent = () => {
    const commonProps = {
      question,
      onAnswer,
      answered,
      selectedAnswer,
      showFeedback,
      theme,
      disableHints,
      contestMode,
    };

    switch (questionType) {
      case 'multiple-choice':
        return <MultipleChoiceQuestion {...commonProps} />;
      case 'true-false':
        return <TrueFalseQuestion {...commonProps} />;
      case 'fill-blank':
        return <FillBlankQuestion {...commonProps} />;
      case 'matching':
        return <MatchingQuestion {...commonProps} />;
      case 'ordering':
        return <OrderingQuestion {...commonProps} />;
      case 'image-select':
        return <ImageSelectQuestion {...commonProps} />;
      case 'multi-select':
        return <MultiSelectQuestion {...commonProps} />;
      case 'drag-drop':
        return <DragDropQuestion {...commonProps} />;
      default:
        return <MultipleChoiceQuestion {...commonProps} />;
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={headerStyles}>
        <span style={questionCounterStyles}>
          Question {questionNumber} of {totalQuestions}
        </span>
        {difficulty && <span style={difficultyBadgeStyles}>{difficulty}</span>}
      </div>

      {/* Question Text */}
      <h2 style={questionTitleStyles}>{question.text || question.question}</h2>

      {/* Question Image */}
      {question.imageUrl && (
        <div style={questionImageContainer}>
          <img src={question.imageUrl} alt="Question" style={questionImageStyles} />
        </div>
      )}

      {/* Question Content (varies by type) */}
      {renderQuestionContent()}

      {/* Explanation (shown after answering) */}
      {answered && showFeedback && question.explanation && showExplanation && !contestMode && (
        <div style={explanationStyles}>
          <div style={explanationTitleStyles}>💡 Explanation:</div>
          <p>{question.explanation.text || question.explanation}</p>
          {question.explanation.imageUrl && (
            <img
              src={question.explanation.imageUrl}
              alt="Explanation"
              style={{ width: '100%', marginTop: '8px', borderRadius: '6px' }}
            />
          )}
        </div>
      )}

      {/* Explanation Toggle for answered questions */}
      {answered && showFeedback && question.explanation && !contestMode && (
        <button
          onClick={() => setShowExplanation(!showExplanation)}
          style={{
            marginTop: '12px',
            background: 'transparent',
            border: `1px solid ${theme.accentPrimary}30`,
            color: theme.accentPrimary,
            padding: '6px 12px',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = `${theme.accentPrimary}10`;
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'transparent';
          }}
        >
          {showExplanation ? '▼ Hide Explanation' : '▶ Show Explanation'}
        </button>
      )}

      {/* Contest Mode Notice */}
      {contestMode && (
        <div style={{
          marginTop: '20px',
          padding: '12px',
          background: 'rgba(255, 102, 51, 0.1)',
          border: '1px solid rgba(255, 102, 51, 0.3)',
          borderRadius: '8px',
          color: '#FF6633',
          fontSize: '13px',
          fontWeight: '600',
          textAlign: 'center',
        }}>
          🏆 This is a contest - Hints and explanations are disabled
        </div>
      )}
    </div>
  );
}
