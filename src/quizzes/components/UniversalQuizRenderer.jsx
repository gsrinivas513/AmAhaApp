/**
 * Universal Quiz Renderer Component
 * Dynamically renders any quiz type based on quizType
 */

import React, { useState, useRef, useEffect } from "react";
import { getQuizPlugin, QUIZ_TYPES } from "../registry/quizTypeRegistry";
import { evaluateQuizAnswer } from "../engine/evaluationEngine";
import "./UniversalQuizRenderer.css";

/**
 * MCQ Renderer
 */
const MCQRenderer = ({ question, onAnswer, theme }) => {
  const [selected, setSelected] = useState(null);

  const handleSelect = (key) => {
    setSelected(key);
    onAnswer({ selectedOption: key }, true);
  };

  return (
    <div className="quiz-input-container mcq-renderer">
      <div className="quiz-question">
        {question.question?.text && (
          <h3 style={{ color: theme?.textPrimary }}>{question.question.text}</h3>
        )}
        {question.question?.media && question.question.media.length > 0 && (
          <div className="quiz-media">
            {question.question.media.map((media, idx) => (
              <div key={idx} className="media-item">
                {media.type === "image" && (
                  <img src={media.url} alt={media.alt} style={{ maxWidth: "100%" }} />
                )}
                {media.type === "video" && (
                  <video controls style={{ maxWidth: "100%" }}>
                    <source src={media.url} />
                  </video>
                )}
                {media.type === "audio" && <audio controls src={media.url} />}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="options-container">
        {question.answer?.options?.map((option) => (
          <div
            key={option.key}
            className={`option-box ${selected === option.key ? "selected" : ""}`}
            onClick={() => handleSelect(option.key)}
            style={{
              backgroundColor:
                selected === option.key
                  ? theme?.accentPrimary + "20"
                  : theme?.cardBg,
              borderColor:
                selected === option.key
                  ? theme?.accentPrimary
                  : theme?.border,
            }}
          >
            <span className="option-key">{option.key}</span>
            <span className="option-text">{option.text}</span>
            {option.media && (
              <div className="option-media">
                {option.media.type === "image" && (
                  <img src={option.media.url} alt={option.text} />
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Multi-Select Renderer
 */
const MultiSelectRenderer = ({ question, onAnswer, theme }) => {
  const [selected, setSelected] = useState([]);

  const handleToggle = (key) => {
    const newSelected = selected.includes(key)
      ? selected.filter((s) => s !== key)
      : [...selected, key];
    setSelected(newSelected);
    onAnswer({ selectedOptions: newSelected }, newSelected.length > 0);
  };

  return (
    <div className="quiz-input-container multi-select-renderer">
      <div className="quiz-question">
        {question.question?.text && (
          <h3 style={{ color: theme?.textPrimary }}>{question.question.text}</h3>
        )}
      </div>

      <div className="options-container">
        {question.answer?.options?.map((option) => (
          <div
            key={option.key}
            className={`option-box checkbox ${
              selected.includes(option.key) ? "selected" : ""
            }`}
            onClick={() => handleToggle(option.key)}
            style={{
              backgroundColor: selected.includes(option.key)
                ? theme?.accentPrimary + "20"
                : theme?.cardBg,
              borderColor: selected.includes(option.key)
                ? theme?.accentPrimary
                : theme?.border,
            }}
          >
            <input
              type="checkbox"
              checked={selected.includes(option.key)}
              onChange={() => {}}
            />
            <span className="option-text">{option.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * True/False Renderer
 */
const TrueFalseRenderer = ({ question, onAnswer, theme }) => {
  const [selected, setSelected] = useState(null);

  const handleSelect = (value) => {
    setSelected(value);
    onAnswer({ answer: value }, true);
  };

  return (
    <div className="quiz-input-container true-false-renderer">
      <div className="quiz-question">
        {question.question?.text && (
          <h3 style={{ color: theme?.textPrimary }}>{question.question.text}</h3>
        )}
      </div>

      <div className="options-container true-false">
        <div
          className={`option-box ${selected === true ? "selected" : ""}`}
          onClick={() => handleSelect(true)}
          style={{
            backgroundColor:
              selected === true ? theme?.successColor + "20" : theme?.cardBg,
            borderColor: selected === true ? theme?.successColor : theme?.border,
          }}
        >
          <span className="option-text">True</span>
        </div>
        <div
          className={`option-box ${selected === false ? "selected" : ""}`}
          onClick={() => handleSelect(false)}
          style={{
            backgroundColor:
              selected === false ? theme?.errorColor + "20" : theme?.cardBg,
            borderColor: selected === false ? theme?.errorColor : theme?.border,
          }}
        >
          <span className="option-text">False</span>
        </div>
      </div>
    </div>
  );
};

/**
 * Fill in the Blank Renderer
 */
const FillBlankRenderer = ({ question, onAnswer, theme }) => {
  const [input, setInput] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setInput(value);
    onAnswer({ text: value }, value.trim().length > 0);
  };

  return (
    <div className="quiz-input-container fill-blank-renderer">
      <div className="quiz-question">
        {question.question?.text && (
          <h3 style={{ color: theme?.textPrimary }}>{question.question.text}</h3>
        )}
      </div>

      <input
        type="text"
        className="fill-blank-input"
        placeholder="Type your answer here..."
        value={input}
        onChange={handleChange}
        style={{
          borderColor: theme?.accentPrimary,
          color: theme?.textPrimary,
        }}
      />

      {question.hint && (
        <p style={{ color: theme?.textSecondary, marginTop: "10px" }}>
          💡 Hint: {question.hint}
        </p>
      )}
    </div>
  );
};

/**
 * Matching Renderer
 */
const MatchingRenderer = ({ question, onAnswer, theme }) => {
  const [pairs, setPairs] = useState([]);
  const [selectedLeft, setSelectedLeft] = useState(null);

  const handleLeftClick = (id) => {
    setSelectedLeft(selectedLeft === id ? null : id);
  };

  const handleRightClick = (rightId) => {
    if (!selectedLeft) return;

    const newPairs = pairs.filter((p) => p.left !== selectedLeft);
    newPairs.push({ left: selectedLeft, right: rightId });
    setPairs(newPairs);
    setSelectedLeft(null);
    onAnswer({ pairs: newPairs }, newPairs.length > 0);
  };

  return (
    <div className="quiz-input-container matching-renderer">
      <div className="matching-container">
        <div className="matching-column">
          <h4 style={{ color: theme?.textPrimary }}>Items</h4>
          {question.answer?.leftItems?.map((item) => (
            <div
              key={item.id}
              className={`matching-item ${
                selectedLeft === item.id ? "selected" : ""
              }`}
              onClick={() => handleLeftClick(item.id)}
              style={{
                backgroundColor:
                  selectedLeft === item.id
                    ? theme?.accentPrimary + "20"
                    : theme?.cardBg,
                borderColor:
                  selectedLeft === item.id
                    ? theme?.accentPrimary
                    : theme?.border,
              }}
            >
              {item.text}
            </div>
          ))}
        </div>

        <div className="matching-column">
          <h4 style={{ color: theme?.textPrimary }}>Matches</h4>
          {question.answer?.rightItems?.map((item) => (
            <div
              key={item.id}
              className="matching-item clickable"
              onClick={() => handleRightClick(item.id)}
              style={{
                backgroundColor: theme?.cardBg,
                borderColor: theme?.border,
              }}
            >
              {item.text}
            </div>
          ))}
        </div>
      </div>

      {pairs.length > 0 && (
        <div className="pairs-summary">
          <h5>Matched Pairs:</h5>
          {pairs.map((pair, idx) => (
            <p key={idx}>
              {question.answer.leftItems.find((i) => i.id === pair.left)?.text} →{" "}
              {question.answer.rightItems.find((i) => i.id === pair.right)?.text}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * Ordering/Drag Renderer
 */
const OrderingRenderer = ({ question, onAnswer, theme }) => {
  const [sequence, setSequence] = useState(
    question.answer?.items?.map((item) => item.id) || []
  );
  const [draggedItem, setDraggedItem] = useState(null);

  const handleDragStart = (item) => {
    setDraggedItem(item);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (targetId) => {
    if (!draggedItem) return;

    const draggedIdx = sequence.indexOf(draggedItem);
    const targetIdx = sequence.indexOf(targetId);

    const newSequence = [...sequence];
    [newSequence[draggedIdx], newSequence[targetIdx]] = [
      newSequence[targetIdx],
      newSequence[draggedIdx],
    ];

    setSequence(newSequence);
    setDraggedItem(null);
    onAnswer({ sequence: newSequence }, true);
  };

  return (
    <div className="quiz-input-container ordering-renderer">
      <div className="quiz-question">
        {question.question?.text && (
          <h3 style={{ color: theme?.textPrimary }}>{question.question.text}</h3>
        )}
      </div>

      <div className="ordering-list">
        {sequence.map((itemId) => {
          const item = question.answer.items.find((i) => i.id === itemId);
          return (
            <div
              key={itemId}
              className="ordering-item"
              draggable
              onDragStart={() => handleDragStart(itemId)}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(itemId)}
              style={{
                backgroundColor: theme?.cardBg,
                borderColor: theme?.border,
                opacity: draggedItem === itemId ? 0.5 : 1,
              }}
            >
              <span className="drag-handle">⋮⋮</span>
              <span>{item?.text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/**
 * Image Based Renderer (Simplified)
 */
const ImageBasedRenderer = ({ question, onAnswer, theme }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startCoords, setStartCoords] = useState(null);

  const handleMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    setStartCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setIsDrawing(true);
  };

  const handleMouseUp = (e) => {
    if (!isDrawing || !startCoords) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const endCoords = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    const region = {
      x: Math.min(startCoords.x, endCoords.x),
      y: Math.min(startCoords.y, endCoords.y),
      width: Math.abs(endCoords.x - startCoords.x),
      height: Math.abs(endCoords.y - startCoords.y),
    };

    setIsDrawing(false);
    onAnswer({ region }, true);
  };

  return (
    <div className="quiz-input-container image-based-renderer">
      <div className="quiz-question">
        {question.question?.text && (
          <h3 style={{ color: theme?.textPrimary }}>{question.question.text}</h3>
        )}
      </div>

      {question.question?.media?.[0]?.type === "image" && (
        <div className="image-container">
          <img
            ref={canvasRef}
            src={question.question.media[0].url}
            alt="Question"
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={(e) => {
              if (isDrawing) {
                // Draw selection box (visual feedback)
              }
            }}
            style={{
              maxWidth: "100%",
              cursor: "crosshair",
            }}
          />
        </div>
      )}

      <p style={{ color: theme?.textSecondary, marginTop: "10px" }}>
        Click and drag to select the region
      </p>
    </div>
  );
};

/**
 * Coding Renderer (Simplified)
 */
const CodingRenderer = ({ question, onAnswer, theme }) => {
  const [code, setCode] = useState(question.answer?.template || "");

  const handleChange = (e) => {
    const value = e.target.value;
    setCode(value);
    onAnswer({ code: value, language: question.answer?.language }, value.trim().length > 0);
  };

  return (
    <div className="quiz-input-container coding-renderer">
      <div className="quiz-question">
        {question.question?.text && (
          <h3 style={{ color: theme?.textPrimary }}>{question.question.text}</h3>
        )}
      </div>

      <div className="code-editor">
        <textarea
          className="code-input"
          value={code}
          onChange={handleChange}
          placeholder="Write your code here..."
          style={{
            backgroundColor: "#1e1e1e",
            color: "#d4d4d4",
            fontFamily: "Courier New, monospace",
            fontSize: "14px",
          }}
        />
      </div>

      {question.answer?.testCases && (
        <div className="test-cases">
          <h5 style={{ color: theme?.textPrimary }}>Test Cases:</h5>
          {question.answer.testCases.map((tc, idx) => (
            <p key={idx} style={{ color: theme?.textSecondary }}>
              Input: {JSON.stringify(tc.input)} → Expected: {tc.expectedOutput}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * Universal Quiz Renderer
 * Main component that routes to specific renderers
 */
export const UniversalQuizRenderer = ({
  question,
  theme = {},
  onAnswerChange,
  onSubmit,
}) => {
  const [userAnswer, setUserAnswer] = useState(null);
  const [evaluation, setEvaluation] = useState(null);
  const [showEvaluation, setShowEvaluation] = useState(false);

  const plugin = getQuizPlugin(question.quizType);

  if (!plugin) {
    return (
      <div className="quiz-error">
        <p>Unknown quiz type: {question.quizType}</p>
      </div>
    );
  }

  const handleAnswer = (answer, isValid) => {
    setUserAnswer(answer);
    onAnswerChange && onAnswerChange(answer, isValid);
  };

  const handleSubmit = () => {
    const result = evaluateQuizAnswer(question, userAnswer);
    setEvaluation(result);
    setShowEvaluation(true);
    onSubmit && onSubmit(result);
  };

  const renderContent = () => {
    switch (question.quizType) {
      case QUIZ_TYPES.MCQ:
      case QUIZ_TYPES.AUDIO_BASED:
        return <MCQRenderer question={question} onAnswer={handleAnswer} theme={theme} />;

      case QUIZ_TYPES.MULTI_SELECT:
        return <MultiSelectRenderer question={question} onAnswer={handleAnswer} theme={theme} />;

      case QUIZ_TYPES.TRUE_FALSE:
        return <TrueFalseRenderer question={question} onAnswer={handleAnswer} theme={theme} />;

      case QUIZ_TYPES.FILL_BLANK:
        return <FillBlankRenderer question={question} onAnswer={handleAnswer} theme={theme} />;

      case QUIZ_TYPES.MATCHING:
        return <MatchingRenderer question={question} onAnswer={handleAnswer} theme={theme} />;

      case QUIZ_TYPES.ORDERING:
      case QUIZ_TYPES.PUZZLE:
        return <OrderingRenderer question={question} onAnswer={handleAnswer} theme={theme} />;

      case QUIZ_TYPES.IMAGE_BASED:
        return <ImageBasedRenderer question={question} onAnswer={handleAnswer} theme={theme} />;

      case QUIZ_TYPES.CODING:
        return <CodingRenderer question={question} onAnswer={handleAnswer} theme={theme} />;

      case QUIZ_TYPES.DRAG_DROP:
        return <OrderingRenderer question={question} onAnswer={handleAnswer} theme={theme} />;

      default:
        return <div>Unsupported quiz type</div>;
    }
  };

  return (
    <div className="universal-quiz-renderer">
      <div className="quiz-header">
        <div className="quiz-meta">
          <span className="quiz-type-badge" style={{ backgroundColor: theme?.accentPrimary }}>
            {plugin.label}
          </span>
          <span className="quiz-points">Points: {question.points || 10}</span>
        </div>
      </div>

      <div className="quiz-content">{renderContent()}</div>

      {!showEvaluation && (
        <div className="quiz-actions">
          <button
            className="btn-submit"
            onClick={handleSubmit}
            disabled={!userAnswer}
            style={{
              backgroundColor: userAnswer ? theme?.accentPrimary : "#ccc",
            }}
          >
            Submit Answer
          </button>
        </div>
      )}

      {showEvaluation && evaluation && (
        <div
          className={`evaluation-result ${
            evaluation.isCorrect ? "correct" : "incorrect"
          }`}
          style={{
            backgroundColor: evaluation.isCorrect
              ? theme?.successColor + "10"
              : theme?.errorColor + "10",
            borderColor: evaluation.isCorrect
              ? theme?.successColor
              : theme?.errorColor,
          }}
        >
          <h4 style={{
            color: evaluation.isCorrect ? theme?.successColor : theme?.errorColor,
          }}>
            {evaluation.isCorrect ? "✓ Correct!" : "✗ Incorrect"}
          </h4>
          <p style={{ color: theme?.textSecondary }}>
            Score: {evaluation.score}% ({evaluation.earnedPoints}/{evaluation.maxPoints} points)
          </p>
          <p style={{ color: theme?.textSecondary }}>{evaluation.feedback}</p>

          {question.explanation && (
            <div className="explanation">
              <h5 style={{ color: theme?.textPrimary }}>Explanation:</h5>
              <p style={{ color: theme?.textSecondary }}>{question.explanation}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UniversalQuizRenderer;
