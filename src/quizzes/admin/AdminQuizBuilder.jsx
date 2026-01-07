/**
 * Admin Quiz Builder Component
 * Universal UI for creating quizzes of any type
 * Only quizType changes the form fields
 */

import React, { useState, useEffect } from "react";
import {
  getQuizPlugin,
  getAllQuizTypes,
  getQuizTypeMetadata,
} from "../registry/quizTypeRegistry";
import AudienceSelector, { AUDIENCES } from "../../components/AudienceSelector";
import { db } from "../../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import "./AdminQuizBuilder.css";

/**
 * Step 1: Quiz Metadata Form
 */
const QuizMetadataStep = ({ quiz, onUpdate, theme }) => {
  const handleChange = (field, value) => {
    onUpdate({ ...quiz, [field]: value });
  };

  const handleMetadataChange = (field, value) => {
    onUpdate({
      ...quiz,
      metadata: { ...quiz.metadata, [field]: value },
    });
  };

  return (
    <div className="form-step metadata-step">
      <h3 style={{ color: theme?.textPrimary }}>Quiz Details</h3>

      <div className="form-group">
        <label htmlFor="title">Quiz Title *</label>
        <input
          id="title"
          type="text"
          placeholder="Enter quiz title"
          value={quiz.title || ""}
          onChange={(e) => handleChange("title", e.target.value)}
          required
          style={{
            borderColor: theme?.border,
            color: theme?.textPrimary,
            backgroundColor: theme?.cardBg,
          }}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <AudienceSelector
            value={quiz.audience || 'all'}
            onChange={(value) => handleChange("audience", value)}
            label="Audience"
            isRequired={true}
            inline={false}
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category *</label>
          <select
            id="category"
            value={quiz.category || ""}
            onChange={(e) => handleChange("category", e.target.value)}
            required
            style={{
              borderColor: theme?.border,
              color: theme?.textPrimary,
              backgroundColor: theme?.cardBg,
            }}
          >
            <option value="">Select category</option>
            <option value="science">Science</option>
            <option value="math">Mathematics</option>
            <option value="history">History</option>
            <option value="geography">Geography</option>
            <option value="literature">Literature</option>
            <option value="technology">Technology</option>
            <option value="language">Language</option>
            <option value="programming">Programming</option>
            <option value="biology">Biology</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="level">Level *</label>
          <select
            id="level"
            value={quiz.level || ""}
            onChange={(e) => handleChange("level", e.target.value)}
            required
            style={{
              borderColor: theme?.border,
              color: theme?.textPrimary,
              backgroundColor: theme?.cardBg,
            }}
          >
            <option value="">Select level</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
            <option value="Expert">Expert</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="quizType">Quiz Type *</label>
          <select
            id="quizType"
            value={quiz.quizType || ""}
            onChange={(e) => handleChange("quizType", e.target.value)}
            required
            style={{
              borderColor: theme?.border,
              color: theme?.textPrimary,
              backgroundColor: theme?.cardBg,
            }}
          >
            <option value="">Select quiz type</option>
            {getAllQuizTypes().map((type) => {
              const plugin = getQuizPlugin(type);
              return (
                <option key={type} value={type}>
                  {plugin.label}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          placeholder="Brief description of the quiz"
          value={quiz.description || ""}
          onChange={(e) => handleChange("description", e.target.value)}
          rows={3}
          style={{
            borderColor: theme?.border,
            color: theme?.textPrimary,
            backgroundColor: theme?.cardBg,
          }}
        />
      </div>

      <div className="settings-row">
        <h4 style={{ color: theme?.textPrimary }}>Quiz Settings</h4>

        <div className="form-group">
          <label htmlFor="timeLimit">Time Limit (seconds)</label>
          <input
            id="timeLimit"
            type="number"
            min="60"
            max="3600"
            value={quiz.metadata?.timeLimit || 1800}
            onChange={(e) =>
              handleMetadataChange("timeLimit", parseInt(e.target.value))
            }
            style={{
              borderColor: theme?.border,
              color: theme?.textPrimary,
              backgroundColor: theme?.cardBg,
            }}
          />
        </div>

        <div className="form-group">
          <label htmlFor="passingScore">Passing Score (%)</label>
          <input
            id="passingScore"
            type="number"
            min="0"
            max="100"
            value={quiz.metadata?.passingScore || 60}
            onChange={(e) =>
              handleMetadataChange("passingScore", parseInt(e.target.value))
            }
            style={{
              borderColor: theme?.border,
              color: theme?.textPrimary,
              backgroundColor: theme?.cardBg,
            }}
          />
        </div>

        <div className="form-group">
          <label htmlFor="attempts">Allowed Attempts</label>
          <input
            id="attempts"
            type="number"
            min="1"
            max="10"
            value={quiz.metadata?.attempts || 3}
            onChange={(e) =>
              handleMetadataChange("attempts", parseInt(e.target.value))
            }
            style={{
              borderColor: theme?.border,
              color: theme?.textPrimary,
              backgroundColor: theme?.cardBg,
            }}
          />
        </div>
      </div>

      <div className="checkbox-group">
        <label>
          <input
            type="checkbox"
            checked={quiz.metadata?.shuffle || false}
            onChange={(e) => handleMetadataChange("shuffle", e.target.checked)}
          />
          Shuffle questions
        </label>

        <label>
          <input
            type="checkbox"
            checked={quiz.metadata?.partialScoring || false}
            onChange={(e) =>
              handleMetadataChange("partialScoring", e.target.checked)
            }
          />
          Allow partial scoring
        </label>

        <label>
          <input
            type="checkbox"
            checked={quiz.metadata?.showExplanation !== false}
            onChange={(e) =>
              handleMetadataChange("showExplanation", e.target.checked)
            }
          />
          Show explanations
        </label>
      </div>
    </div>
  );
};

/**
 * Step 2: Question Editor
 */
const QuestionEditorStep = ({ quiz, onUpdate, theme }) => {
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  // Update selected question when quiz.questions changes
  React.useEffect(() => {
    if (quiz.questions && quiz.questions.length > 0) {
      // If no question selected, select the first one
      if (!selectedQuestion || !quiz.questions.find(q => q.id === selectedQuestion)) {
        setSelectedQuestion(quiz.questions[0].id);
      }
    } else {
      setSelectedQuestion(null);
    }
  }, [quiz.questions]);

  const [showAddNew, setShowAddNew] = useState(!quiz.questions || quiz.questions.length === 0);

  const currentQuestion = quiz.questions?.find((q) => q.id === selectedQuestion);

  const addQuestion = () => {
    const newQuestion = {
      id: `q_${Date.now()}`,
      sequence: (quiz.questions?.length || 0) + 1,
      points: 10,
      quizType: quiz.quizType,
      contentType: "text",
      question: { text: "", media: [] },
      answer: {},
      hint: "",
      explanation: "",
    };

    const updatedQuiz = {
      ...quiz,
      questions: [...(quiz.questions || []), newQuestion],
    };

    onUpdate(updatedQuiz);
    setShowAddNew(false);
  };

  const updateQuestion = (updates) => {
    const updatedQuestions = quiz.questions.map((q) =>
      q.id === selectedQuestion ? { ...q, ...updates } : q
    );

    onUpdate({ ...quiz, questions: updatedQuestions });
  };

  const deleteQuestion = (questionId) => {
    const updatedQuestions = quiz.questions.filter((q) => q.id !== questionId);
    onUpdate({
      ...quiz,
      questions: updatedQuestions,
      metadata: {
        ...quiz.metadata,
        totalQuestions: updatedQuestions.length,
      },
    });
    if (selectedQuestion === questionId) {
      setSelectedQuestion(updatedQuestions[0]?.id || null);
    }
  };

  return (
    <div className="form-step question-editor-step">
      <h3 style={{ color: theme?.textPrimary }}>Questions</h3>

      <div className="question-editor-content">
        <div className="question-list">
        {quiz.questions?.map((q, idx) => (
          <div
            key={q.id}
            className={`question-tab ${selectedQuestion === q.id ? "active" : ""}`}
            onClick={() => setSelectedQuestion(q.id)}
            style={{
              backgroundColor:
                selectedQuestion === q.id
                  ? theme?.accentPrimary + "20"
                  : "transparent",
              borderColor:
                selectedQuestion === q.id ? theme?.accentPrimary : theme?.border,
            }}
          >
            <span>Question {idx + 1}</span>
            <button
              className="btn-delete"
              onClick={(e) => {
                e.stopPropagation();
                deleteQuestion(q.id);
              }}
            >
              ✕
            </button>
          </div>
        ))}

        {showAddNew ? (
          <div className="add-question-form">
            <button
              className="btn-add"
              onClick={addQuestion}
              style={{ backgroundColor: theme?.accentPrimary, color: "white" }}
            >
              + Add Question
            </button>
          </div>
        ) : (
          <button
            className="btn-add-new"
            onClick={() => setShowAddNew(true)}
            style={{ borderColor: theme?.accentPrimary }}
          >
            + New
          </button>
        )}
      </div>

      {currentQuestion && (
        <div className="question-editor">
          {/* Flexible Content Items Section - Text, Images, Videos, Audio in any order */}
          <div className="content-items-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h4 style={{ color: theme?.textPrimary, margin: 0 }}>📝 Question Content (Add in any order)</h4>
              <button
                type="button"
                className="btn-add-content"
                onClick={() => {
                  const contentItems = currentQuestion.question?.contentItems || [];
                  updateQuestion({
                    question: {
                      ...currentQuestion.question,
                      contentItems: [
                        ...contentItems,
                        { id: `content_${Date.now()}`, type: 'text', value: '', url: '' }
                      ]
                    }
                  });
                }}
                style={{
                  backgroundColor: theme?.accentPrimary,
                  color: 'white',
                  border: 'none',
                  padding: '8px 14px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 600
                }}
              >
                + Add Content
              </button>
            </div>

            {/* Content Items List */}
            <div className="content-items-list">
              {currentQuestion.question?.contentItems?.length > 0 ? (
                currentQuestion.question.contentItems.map((item, idx) => (
                  <div key={item.id} className="content-item" style={{ marginBottom: '16px', padding: '14px', backgroundColor: theme?.cardBg, borderRadius: '4px', border: `1px solid ${theme?.border}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span style={{ fontWeight: 600, color: theme?.textPrimary, fontSize: '14px' }}>
                        {item.type === 'text' && '📄 Text'} 
                        {item.type === 'image' && '🖼️ Image'}
                        {item.type === 'video' && '🎬 Video'}
                        {item.type === 'audio' && '🎵 Audio'}
                        {' '} - Item {idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const updatedItems = currentQuestion.question.contentItems.filter(c => c.id !== item.id);
                          updateQuestion({
                            question: {
                              ...currentQuestion.question,
                              contentItems: updatedItems
                            }
                          });
                        }}
                        style={{
                          backgroundColor: '#ff4444',
                          color: 'white',
                          border: 'none',
                          padding: '4px 10px',
                          borderRadius: '3px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: 600
                        }}
                      >
                        ✕ Remove
                      </button>
                    </div>

                    {/* Type Selector */}
                    <div className="form-group" style={{ marginBottom: '12px' }}>
                      <label htmlFor={`content_type_${item.id}`} style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 500 }}>Type</label>
                      <select
                        id={`content_type_${item.id}`}
                        value={item.type}
                        onChange={(e) => {
                          const updatedItems = currentQuestion.question.contentItems.map(c =>
                            c.id === item.id ? { ...c, type: e.target.value, value: '', url: '' } : c
                          );
                          updateQuestion({
                            question: {
                              ...currentQuestion.question,
                              contentItems: updatedItems
                            }
                          });
                        }}
                        style={{
                          borderColor: theme?.border,
                          color: theme?.textPrimary,
                          backgroundColor: theme?.cardBg,
                          width: '100%',
                          padding: '10px',
                          fontSize: '13px'
                        }}
                      >
                        <option value="text">📄 Text</option>
                        <option value="image">🖼️ Image</option>
                        <option value="video">🎬 Video</option>
                        <option value="audio">🎵 Audio</option>
                      </select>
                    </div>

                    {/* Text Content */}
                    {item.type === 'text' && (
                      <div className="form-group">
                        <label htmlFor={`content_text_${item.id}`} style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 500 }}>Text Content</label>
                        <textarea
                          id={`content_text_${item.id}`}
                          placeholder="Enter text content for this question"
                          value={item.value || ''}
                          onChange={(e) => {
                            const updatedItems = currentQuestion.question.contentItems.map(c =>
                              c.id === item.id ? { ...c, value: e.target.value } : c
                            );
                            updateQuestion({
                              question: {
                                ...currentQuestion.question,
                                contentItems: updatedItems
                              }
                            });
                          }}
                          rows={5}
                          style={{
                            borderColor: theme?.border,
                            color: theme?.textPrimary,
                            backgroundColor: theme?.cardBg,
                            width: '100%',
                            padding: '10px',
                            boxSizing: 'border-box',
                            fontSize: '13px'
                          }}
                        />
                        <small style={{ color: theme?.textSecondary, marginTop: '6px', display: 'block', fontSize: '12px' }}>
                          💡 Add question text, instructions, or descriptions here
                        </small>
                      </div>
                    )}

                    {/* Image URL */}
                    {item.type === 'image' && (
                      <div className="form-group">
                        <label htmlFor={`content_url_${item.id}`} style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 500 }}>Image URL</label>
                        <input
                          id={`content_url_${item.id}`}
                          type="text"
                          placeholder="https://example.com/image.jpg"
                          value={item.url || ''}
                          onChange={(e) => {
                            const updatedItems = currentQuestion.question.contentItems.map(c =>
                              c.id === item.id ? { ...c, url: e.target.value } : c
                            );
                            updateQuestion({
                              question: {
                                ...currentQuestion.question,
                                contentItems: updatedItems
                              }
                            });
                          }}
                          style={{
                            borderColor: theme?.border,
                            color: theme?.textPrimary,
                            backgroundColor: theme?.cardBg,
                            width: '100%',
                            padding: '10px',
                            boxSizing: 'border-box',
                            fontSize: '13px'
                          }}
                        />
                        <small style={{ color: theme?.textSecondary, marginTop: '6px', display: 'block', fontSize: '12px' }}>
                          💡 PNG, JPG, WebP - Recommended: 1000x600px+
                        </small>
                      </div>
                    )}

                    {/* Video URL */}
                    {item.type === 'video' && (
                      <div className="form-group">
                        <label htmlFor={`content_url_${item.id}`} style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 500 }}>Video URL</label>
                        <input
                          id={`content_url_${item.id}`}
                          type="text"
                          placeholder="https://youtube.com/watch?v=..."
                          value={item.url || ''}
                          onChange={(e) => {
                            const updatedItems = currentQuestion.question.contentItems.map(c =>
                              c.id === item.id ? { ...c, url: e.target.value } : c
                            );
                            updateQuestion({
                              question: {
                                ...currentQuestion.question,
                                contentItems: updatedItems
                              }
                            });
                          }}
                          style={{
                            borderColor: theme?.border,
                            color: theme?.textPrimary,
                            backgroundColor: theme?.cardBg,
                            width: '100%',
                            padding: '10px',
                            boxSizing: 'border-box',
                            fontSize: '13px'
                          }}
                        />
                        <small style={{ color: theme?.textSecondary, marginTop: '6px', display: 'block', fontSize: '12px' }}>
                          💡 YouTube, Vimeo, or direct MP4 links
                        </small>
                      </div>
                    )}

                    {/* Audio URL */}
                    {item.type === 'audio' && (
                      <div className="form-group">
                        <label htmlFor={`content_url_${item.id}`} style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 500 }}>Audio URL</label>
                        <input
                          id={`content_url_${item.id}`}
                          type="text"
                          placeholder="https://example.com/audio.mp3"
                          value={item.url || ''}
                          onChange={(e) => {
                            const updatedItems = currentQuestion.question.contentItems.map(c =>
                              c.id === item.id ? { ...c, url: e.target.value } : c
                            );
                            updateQuestion({
                              question: {
                                ...currentQuestion.question,
                                contentItems: updatedItems
                              }
                            });
                          }}
                          style={{
                            borderColor: theme?.border,
                            color: theme?.textPrimary,
                            backgroundColor: theme?.cardBg,
                            width: '100%',
                            padding: '10px',
                            boxSizing: 'border-box',
                            fontSize: '13px'
                          }}
                        />
                        <small style={{ color: theme?.textSecondary, marginTop: '6px', display: 'block', fontSize: '12px' }}>
                          💡 MP3, WAV, or streaming URLs
                        </small>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div style={{ padding: '16px', textAlign: 'center', color: theme?.textSecondary, fontSize: '13px', backgroundColor: `${theme?.border}20`, borderRadius: '4px' }}>
                  📭 No content items yet. Click "Add Content" to start building your question!
                </div>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="q_points">Points</label>
              <input
                id="q_points"
                type="number"
                min="1"
                max="100"
                value={currentQuestion.points || 10}
                onChange={(e) =>
                  updateQuestion({ points: parseInt(e.target.value) })
                }
                style={{
                  borderColor: theme?.border,
                  color: theme?.textPrimary,
                  backgroundColor: theme?.cardBg,
                }}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="q_hint">Hint (Optional)</label>
            <input
              id="q_hint"
              type="text"
              placeholder="Provide a helpful hint"
              value={currentQuestion.hint || ""}
              onChange={(e) => updateQuestion({ hint: e.target.value })}
              style={{
                borderColor: theme?.border,
                color: theme?.textPrimary,
                backgroundColor: theme?.cardBg,
              }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="q_explanation">Explanation (Optional)</label>
            <textarea
              id="q_explanation"
              placeholder="Explain the correct answer"
              value={currentQuestion.explanation || ""}
              onChange={(e) => updateQuestion({ explanation: e.target.value })}
              rows={5}
              style={{
                borderColor: theme?.border,
                color: theme?.textPrimary,
                backgroundColor: theme?.cardBg,
              }}
            />
          </div>

          <div className="answer-section">
            <h5 style={{ color: theme?.textPrimary }}>Answer Configuration</h5>
            <QuizTypeAnswerForm
              question={currentQuestion}
              onUpdate={updateQuestion}
              theme={theme}
            />
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

/**
 * Dynamic Answer Form Based on Quiz Type
 */
const QuizTypeAnswerForm = ({ question, onUpdate, theme }) => {
  const plugin = getQuizPlugin(question.quizType);

  if (!plugin) return <div>Unknown quiz type</div>;

  const renderAnswerFields = () => {
    switch (question.quizType) {
      case "MCQ":
      case "AUDIO_BASED":
        return (
          <div>
            <div className="form-group">
              <label htmlFor="correct_option" style={{ fontWeight: 700 }}>Define Options First</label>
            </div>

            <div className="options-list">
              {["A", "B", "C", "D"].map((key) => (
                <div key={key} className="form-group">
                  <label htmlFor={`opt_${key}`}>Option {key} *</label>
                  <input
                    id={`opt_${key}`}
                    type="text"
                    placeholder={`Enter option ${key}`}
                    defaultValue={
                      question.answer?.options?.find((o) => o.key === key)
                        ?.text || ""
                    }
                    onChange={(e) => {
                      const options = question.answer?.options || [];
                      const updated = options.map((o) =>
                        o.key === key ? { ...o, text: e.target.value } : o
                      );
                      if (!updated.find((o) => o.key === key)) {
                        updated.push({ key, text: e.target.value, media: null });
                      }
                      onUpdate({ answer: { ...question.answer, options: updated } });
                    }}
                    style={{
                      borderColor: theme?.border,
                      color: theme?.textPrimary,
                      backgroundColor: theme?.cardBg,
                    }}
                  />
                </div>
              ))}
            </div>

            <div className="form-group">
              <label htmlFor="correct_option">Then Select Correct Option *</label>
              <select
                id="correct_option"
                value={question.answer?.correctOption || ""}
                onChange={(e) =>
                  onUpdate({
                    answer: {
                      ...question.answer,
                      correctOption: e.target.value,
                    },
                  })
                }
                style={{
                  borderColor: theme?.border,
                  color: theme?.textPrimary,
                  backgroundColor: theme?.cardBg,
                }}
              >
                <option value="">Select correct option</option>
                <option value="A">Option A</option>
                <option value="B">Option B</option>
                <option value="C">Option C</option>
                <option value="D">Option D</option>
              </select>
            </div>
          </div>
        );

      case "MULTI_SELECT":
        return (
          <div>
            <div className="form-group">
              <label htmlFor="correct_options" style={{ fontWeight: 700 }}>Define Options First</label>
            </div>

            <div className="options-list">
              {["A", "B", "C", "D"].map((key) => (
                <div key={key} className="form-group">
                  <label htmlFor={`opt_${key}`}>Option {key} *</label>
                  <input
                    id={`opt_${key}`}
                    type="text"
                    placeholder={`Enter option ${key}`}
                    defaultValue={
                      question.answer?.options?.find((o) => o.key === key)
                        ?.text || ""
                    }
                    onChange={(e) => {
                      const options = question.answer?.options || [];
                      const updated = options.map((o) =>
                        o.key === key ? { ...o, text: e.target.value } : o
                      );
                      if (!updated.find((o) => o.key === key)) {
                        updated.push({ key, text: e.target.value, media: null });
                      }
                      onUpdate({ answer: { ...question.answer, options: updated } });
                    }}
                    style={{
                      borderColor: theme?.border,
                      color: theme?.textPrimary,
                      backgroundColor: theme?.cardBg,
                    }}
                  />
                </div>
              ))}
            </div>

            <div className="form-group">
              <label htmlFor="correct_options">Select Correct Options (Multiple) *</label>
              <div className="checkbox-group">
                {["A", "B", "C", "D"].map((key) => (
                  <label key={key}>
                    <input
                      type="checkbox"
                      checked={question.answer?.correctOptions?.includes(key) || false}
                      onChange={(e) => {
                        const correctOptions = question.answer?.correctOptions || [];
                        if (e.target.checked) {
                          if (!correctOptions.includes(key)) {
                            correctOptions.push(key);
                          }
                        } else {
                          correctOptions.splice(correctOptions.indexOf(key), 1);
                        }
                        onUpdate({
                          answer: {
                            ...question.answer,
                            correctOptions: correctOptions,
                          },
                        });
                      }}
                    />
                    Option {key}
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case "TRUE_FALSE":
        return (
          <div className="form-group">
            <label htmlFor="correct_answer">Correct Answer *</label>
            <select
              id="correct_answer"
              value={question.answer?.correctAnswer ? "true" : "false"}
              onChange={(e) =>
                onUpdate({
                  answer: {
                    ...question.answer,
                    correctAnswer: e.target.value === "true",
                  },
                })
              }
              style={{
                borderColor: theme?.border,
                color: theme?.textPrimary,
                backgroundColor: theme?.cardBg,
              }}
            >
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
          </div>
        );

      case "FILL_BLANK":
        return (
          <div>
            <div className="form-group">
              <label htmlFor="correct_answers">
                Correct Answers (comma-separated) *
              </label>
              <textarea
                id="correct_answers"
                placeholder="Enter acceptable answers separated by commas"
                defaultValue={
                  question.answer?.correctAnswers?.join(", ") || ""
                }
                onChange={(e) =>
                  onUpdate({
                    answer: {
                      ...question.answer,
                      correctAnswers: e.target.value.split(",").map((a) => a.trim()),
                    },
                  })
                }
                rows={3}
                style={{
                  borderColor: theme?.border,
                  color: theme?.textPrimary,
                  backgroundColor: theme?.cardBg,
                }}
              />
            </div>

            <div className="checkbox-group">
              <label>
                <input
                  type="checkbox"
                  defaultChecked={question.answer?.caseSensitive !== false}
                  onChange={(e) =>
                    onUpdate({
                      answer: {
                        ...question.answer,
                        caseSensitive: e.target.checked,
                      },
                    })
                  }
                />
                Case sensitive
              </label>

              <label>
                <input
                  type="checkbox"
                  defaultChecked={question.answer?.fuzzyMatch !== false}
                  onChange={(e) =>
                    onUpdate({
                      answer: {
                        ...question.answer,
                        fuzzyMatch: e.target.checked,
                      },
                    })
                  }
                />
                Allow fuzzy matching
              </label>
            </div>
          </div>
        );

      case "MATCHING":
        return (
          <div>
            <div className="form-group">
              <label htmlFor="left_items">Left Column Items (comma-separated) *</label>
              <textarea
                id="left_items"
                placeholder="Enter left items separated by commas"
                defaultValue={question.answer?.leftItems?.join(", ") || ""}
                onChange={(e) =>
                  onUpdate({
                    answer: {
                      ...question.answer,
                      leftItems: e.target.value.split(",").map((a) => a.trim()),
                    },
                  })
                }
                rows={3}
                style={{
                  borderColor: theme?.border,
                  color: theme?.textPrimary,
                  backgroundColor: theme?.cardBg,
                }}
              />
            </div>

            <div className="form-group">
              <label htmlFor="right_items">Right Column Items (comma-separated, same order as correct pairs) *</label>
              <textarea
                id="right_items"
                placeholder="Enter right items separated by commas"
                defaultValue={question.answer?.rightItems?.join(", ") || ""}
                onChange={(e) =>
                  onUpdate({
                    answer: {
                      ...question.answer,
                      rightItems: e.target.value.split(",").map((a) => a.trim()),
                    },
                  })
                }
                rows={3}
                style={{
                  borderColor: theme?.border,
                  color: theme?.textPrimary,
                  backgroundColor: theme?.cardBg,
                }}
              />
            </div>
          </div>
        );

      case "ORDERING":
      case "PUZZLE":
        return (
          <div>
            <div className="form-group">
              <label htmlFor="items">Items to Order (comma-separated) *</label>
              <textarea
                id="items"
                placeholder="Enter items in correct order, separated by commas"
                defaultValue={question.answer?.items?.join(", ") || question.answer?.pieces?.join(", ") || ""}
                onChange={(e) => {
                  const items = e.target.value.split(",").map((a) => a.trim());
                  const field = question.quizType === "PUZZLE" ? "pieces" : "items";
                  onUpdate({
                    answer: {
                      ...question.answer,
                      [field]: items,
                      correctSequence: items.map((_, i) => i),
                    },
                  });
                }}
                rows={3}
                style={{
                  borderColor: theme?.border,
                  color: theme?.textPrimary,
                  backgroundColor: theme?.cardBg,
                }}
              />
            </div>
          </div>
        );

      case "DRAG_DROP":
        return (
          <div>
            <div className="form-group">
              <label htmlFor="categories">Categories (comma-separated) *</label>
              <textarea
                id="categories"
                placeholder="Enter categories separated by commas"
                defaultValue={question.answer?.categories?.join(", ") || ""}
                onChange={(e) =>
                  onUpdate({
                    answer: {
                      ...question.answer,
                      categories: e.target.value.split(",").map((a) => a.trim()),
                    },
                  })
                }
                rows={2}
                style={{
                  borderColor: theme?.border,
                  color: theme?.textPrimary,
                  backgroundColor: theme?.cardBg,
                }}
              />
            </div>

            <div className="form-group">
              <label htmlFor="items">Available Items (format: item:category, each on new line) *</label>
              <textarea
                id="items"
                placeholder="Example:&#10;apple:fruit&#10;carrot:vegetable"
                defaultValue={question.answer?.availableItems?.map(i => `${i.text}:${i.category}`).join("\n") || ""}
                onChange={(e) => {
                  const availableItems = e.target.value
                    .split("\n")
                    .filter(line => line.trim())
                    .map(line => {
                      const [text, category] = line.split(":").map(s => s.trim());
                      return { text, category };
                    });
                  onUpdate({
                    answer: {
                      ...question.answer,
                      availableItems,
                    },
                  });
                }}
                rows={4}
                style={{
                  borderColor: theme?.border,
                  color: theme?.textPrimary,
                  backgroundColor: theme?.cardBg,
                }}
              />
            </div>
          </div>
        );

      case "CODING":
        return (
          <div>
            <div className="form-group">
              <label htmlFor="language">Programming Language *</label>
              <select
                id="language"
                value={question.answer?.language || "javascript"}
                onChange={(e) =>
                  onUpdate({
                    answer: {
                      ...question.answer,
                      language: e.target.value,
                    },
                  })
                }
                style={{
                  borderColor: theme?.border,
                  color: theme?.textPrimary,
                  backgroundColor: theme?.cardBg,
                }}
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
                <option value="csharp">C#</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="template">Code Template</label>
              <textarea
                id="template"
                placeholder="Enter template code (optional)"
                defaultValue={question.answer?.template || ""}
                onChange={(e) =>
                  onUpdate({
                    answer: {
                      ...question.answer,
                      template: e.target.value,
                    },
                  })
                }
                rows={4}
                style={{
                  borderColor: theme?.border,
                  color: theme?.textPrimary,
                  backgroundColor: theme?.cardBg,
                }}
              />
            </div>

            <div className="form-group">
              <label htmlFor="test_cases">Test Cases (format: input|output, each on new line) *</label>
              <textarea
                id="test_cases"
                placeholder="Example:&#10;5|120&#10;4|24"
                defaultValue={question.answer?.testCases?.map(tc => `${tc.input}|${tc.output}`).join("\n") || ""}
                onChange={(e) => {
                  const testCases = e.target.value
                    .split("\n")
                    .filter(line => line.trim())
                    .map(line => {
                      const [input, output] = line.split("|").map(s => s.trim());
                      return { input, output };
                    });
                  onUpdate({
                    answer: {
                      ...question.answer,
                      testCases,
                    },
                  });
                }}
                rows={4}
                style={{
                  borderColor: theme?.border,
                  color: theme?.textPrimary,
                  backgroundColor: theme?.cardBg,
                }}
              />
            </div>
          </div>
        );

      case "IMAGE_BASED":
        return (
          <div>
            <div className="form-group">
              <label htmlFor="region_x">Region X (pixel) *</label>
              <input
                id="region_x"
                type="number"
                value={question.answer?.region?.coordinates?.x || 0}
                onChange={(e) =>
                  onUpdate({
                    answer: {
                      ...question.answer,
                      region: {
                        ...question.answer?.region,
                        coordinates: {
                          ...question.answer?.region?.coordinates,
                          x: parseInt(e.target.value),
                        },
                      },
                    },
                  })
                }
                style={{
                  borderColor: theme?.border,
                  color: theme?.textPrimary,
                  backgroundColor: theme?.cardBg,
                }}
              />
            </div>

            <div className="form-group">
              <label htmlFor="region_y">Region Y (pixel) *</label>
              <input
                id="region_y"
                type="number"
                value={question.answer?.region?.coordinates?.y || 0}
                onChange={(e) =>
                  onUpdate({
                    answer: {
                      ...question.answer,
                      region: {
                        ...question.answer?.region,
                        coordinates: {
                          ...question.answer?.region?.coordinates,
                          y: parseInt(e.target.value),
                        },
                      },
                    },
                  })
                }
                style={{
                  borderColor: theme?.border,
                  color: theme?.textPrimary,
                  backgroundColor: theme?.cardBg,
                }}
              />
            </div>

            <div className="form-group">
              <label htmlFor="region_width">Region Width (pixel) *</label>
              <input
                id="region_width"
                type="number"
                value={question.answer?.region?.coordinates?.width || 100}
                onChange={(e) =>
                  onUpdate({
                    answer: {
                      ...question.answer,
                      region: {
                        ...question.answer?.region,
                        coordinates: {
                          ...question.answer?.region?.coordinates,
                          width: parseInt(e.target.value),
                        },
                      },
                    },
                  })
                }
                style={{
                  borderColor: theme?.border,
                  color: theme?.textPrimary,
                  backgroundColor: theme?.cardBg,
                }}
              />
            </div>

            <div className="form-group">
              <label htmlFor="region_height">Region Height (pixel) *</label>
              <input
                id="region_height"
                type="number"
                value={question.answer?.region?.coordinates?.height || 100}
                onChange={(e) =>
                  onUpdate({
                    answer: {
                      ...question.answer,
                      region: {
                        ...question.answer?.region,
                        coordinates: {
                          ...question.answer?.region?.coordinates,
                          height: parseInt(e.target.value),
                        },
                      },
                    },
                  })
                }
                style={{
                  borderColor: theme?.border,
                  color: theme?.textPrimary,
                  backgroundColor: theme?.cardBg,
                }}
              />
            </div>

            <div className="form-group">
              <label htmlFor="tolerance">Tolerance (pixel) *</label>
              <input
                id="tolerance"
                type="number"
                value={question.answer?.region?.tolerance || 10}
                onChange={(e) =>
                  onUpdate({
                    answer: {
                      ...question.answer,
                      region: {
                        ...question.answer?.region,
                        tolerance: parseInt(e.target.value),
                      },
                    },
                  })
                }
                style={{
                  borderColor: theme?.border,
                  color: theme?.textPrimary,
                  backgroundColor: theme?.cardBg,
                }}
              />
            </div>
          </div>
        );

      default:
        return (
          <div style={{ color: theme?.textSecondary }}>
            <p>Answer configuration for {plugin.label} coming soon...</p>
            <p>You can still save and answers will be configured manually.</p>
          </div>
        );
    }
  };

  return <div className="answer-form">{renderAnswerFields()}</div>;
};

/**
 * Step 3: Difficulty Assignment for Variants
 */
const DifficultyAssignmentStep = ({ quiz, onUpdate, theme }) => {
  const difficulties = ['Easy', 'Medium', 'Hard', 'Expert'];
  const requiredCounts = { Easy: 5, Medium: 3, Hard: 4, Expert: 5 };

  // Count questions by difficulty
  const getCounts = () => {
    const counts = { Easy: 0, Medium: 0, Hard: 0, Expert: 0 };
    quiz.questions?.forEach(q => {
      if (counts.hasOwnProperty(q.difficulty || 'Easy')) {
        counts[q.difficulty] += 1;
      }
    });
    return counts;
  };

  const counts = getCounts();
  const totalQuestions = quiz.questions?.length || 0;
  const isValid = 
    counts.Easy === requiredCounts.Easy &&
    counts.Medium === requiredCounts.Medium &&
    counts.Hard === requiredCounts.Hard &&
    counts.Expert === requiredCounts.Expert;

  const updateQuestionDifficulty = (questionId, difficulty) => {
    const updatedQuestions = quiz.questions.map(q =>
      q.id === questionId ? { ...q, difficulty } : q
    );
    onUpdate({ ...quiz, questions: updatedQuestions });
  };

  return (
    <div className="form-step difficulty-step">
      <h3 style={{ color: theme?.textPrimary }}>Assign Difficulty Levels</h3>
      
      <p style={{ color: theme?.textSecondary, marginBottom: '20px' }}>
        Organize your {totalQuestions} questions into difficulty levels to create quiz variants.
      </p>

      {/* Distribution Guide */}
      <div style={{
        background: theme?.surfaceSecondary,
        padding: '16px',
        borderRadius: '8px',
        marginBottom: '24px',
        border: `1px solid ${theme?.border}`,
      }}>
        <p style={{ color: theme?.textSecondary, marginBottom: '12px', fontSize: '13px', fontWeight: '600' }}>
          Required Distribution:
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
          {difficulties.map(difficulty => {
            const isValid = counts[difficulty] === requiredCounts[difficulty];
            const color = isValid ? '#4ECB71' : (counts[difficulty] > requiredCounts[difficulty] ? '#FF6B6B' : theme?.textSecondary);
            
            return (
              <div key={difficulty} style={{
                padding: '12px',
                background: theme?.surfacePrimary,
                borderRadius: '6px',
                textAlign: 'center',
                border: `2px solid ${color}20`,
                borderTopColor: color,
              }}>
                <div style={{ color: theme?.textPrimary, fontWeight: '600', marginBottom: '4px' }}>
                  {difficulty}
                </div>
                <div style={{ color, fontSize: '18px', fontWeight: '700' }}>
                  {counts[difficulty]}/{requiredCounts[difficulty]}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Question List */}
      <div style={{ marginBottom: '24px' }}>
        <p style={{ color: theme?.textPrimary, marginBottom: '12px', fontWeight: '600' }}>
          Click on a question to assign its difficulty:
        </p>
        <div style={{
          display: 'grid',
          gap: '12px',
          maxHeight: '500px',
          overflowY: 'auto',
        }}>
          {quiz.questions?.map((question, index) => {
            const difficulty = question.difficulty || 'Easy';
            const isOverLimit = counts[difficulty] > requiredCounts[difficulty];
            
            return (
              <div key={question.id} style={{
                padding: '12px',
                background: theme?.cardBg || theme?.surfacePrimary,
                border: `1px solid ${theme?.border}`,
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}>
                <div style={{
                  flex: 1,
                  minWidth: 0,
                }}>
                  <div style={{
                    color: theme?.textPrimary,
                    fontSize: '14px',
                    fontWeight: '500',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    Q{index + 1}: {question.question?.text || question.question?.contentItems?.[0]?.value || 'Untitled'}
                  </div>
                </div>

                <select
                  value={difficulty}
                  onChange={(e) => updateQuestionDifficulty(question.id, e.target.value)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '4px',
                    border: `2px solid ${isOverLimit ? '#FF6B6B' : theme?.border}`,
                    background: theme?.cardBg || theme?.surfacePrimary,
                    color: theme?.textPrimary,
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  {difficulties.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            );
          })}
        </div>
      </div>

      {/* Validation Message */}
      {isValid && (
        <div style={{
          padding: '12px',
          background: '#4ECB7115',
          border: '2px solid #4ECB71',
          borderRadius: '8px',
          color: '#4ECB71',
          fontWeight: '600',
          textAlign: 'center',
        }}>
          ✓ Perfect! All difficulties assigned correctly. Ready to save.
        </div>
      )}
      {!isValid && totalQuestions > 0 && (
        <div style={{
          padding: '12px',
          background: '#FF6B6B15',
          border: '2px solid #FF6B6B',
          borderRadius: '8px',
          color: '#FF6B6B',
          fontWeight: '600',
          textAlign: 'center',
        }}>
          ⚠️ Please assign all questions to the correct difficulty levels.
        </div>
      )}
    </div>
  );
};

/**
 * Main Admin Quiz Builder Component
 */
export const AdminQuizBuilder = ({ initialQuiz = null, initialData = null, theme = {}, onSave, onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loadingFullData, setLoadingFullData] = useState(false);
  const [quiz, setQuiz] = useState(
    initialQuiz || {
      id: `quiz_${Date.now()}`,
      title: "",
      description: "",
      category: "",
      level: "Beginner",
      quizType: "MCQ",
      metadata: {
        timeLimit: 1800,
        totalPoints: 100,
        passingScore: 60,
        shuffle: true,
        attempts: 3,
        partialScoring: false,
        showExplanation: true,
      },
      questions: [],
      rules: {
        allowSkip: true,
        allowReview: false,
        randomizeOptions: true,
      },
    }
  );

  const [saveStatus, setSaveStatus] = useState("");

  // Load full quiz data when in edit mode
  useEffect(() => {
    if (initialData && initialData.id) {
      setLoadingFullData(true);
      console.log('📥 Loading full quiz data for editing:', initialData.id);
      
      const loadFullQuizData = async () => {
        try {
          const quizRef = doc(db, 'quizzes', initialData.id);
          const quizSnap = await getDoc(quizRef);
          
          if (quizSnap.exists()) {
            const fullData = quizSnap.data();
            console.log('✅ Full quiz data loaded:', fullData);
            setQuiz({
              id: initialData.id,
              title: fullData.title || "",
              description: fullData.description || "",
              category: fullData.category || "",
              level: fullData.difficulty || "Beginner",
              quizType: fullData.quizType || "MCQ",
              audience: fullData.audience || "all",
              metadata: {
                timeLimit: fullData.metadata?.timeLimit || 1800,
                totalPoints: fullData.metadata?.totalPoints || 100,
                passingScore: fullData.metadata?.passingScore || 60,
                shuffle: fullData.metadata?.shuffle !== false,
                attempts: fullData.metadata?.attempts || 3,
                partialScoring: fullData.metadata?.partialScoring || false,
                showExplanation: fullData.metadata?.showExplanation !== false,
              },
              // Flatten questions from levelVariants if they exist
              questions: fullData.levelVariants ? 
                Object.entries(fullData.levelVariants).flatMap(([difficulty, variant]) =>
                  variant.questions?.map(q => ({ ...q, difficulty })) || []
                ) :
                (fullData.questions || []),
              rules: fullData.rules || {
                allowSkip: true,
                allowReview: false,
                randomizeOptions: true,
              },
            });
          } else {
            console.warn('⚠️ Quiz not found in Firestore');
          }
        } catch (error) {
          console.error('❌ Error loading full quiz data:', error);
        } finally {
          setLoadingFullData(false);
        }
      };

      loadFullQuizData();
    }
  }, [initialData]);

  const handleSave = () => {
    // Validate quiz
    if (!quiz.title || !quiz.category || !quiz.level || !quiz.quizType) {
      setSaveStatus("error: Please fill in all required fields");
      return;
    }

    if (!quiz.questions || quiz.questions.length === 0) {
      setSaveStatus("error: Please add at least one question");
      return;
    }

    // Validate difficulty distribution
    const counts = { Easy: 0, Medium: 0, Hard: 0, Expert: 0 };
    quiz.questions.forEach(q => {
      const diff = q.difficulty || 'Easy';
      if (counts.hasOwnProperty(diff)) counts[diff] += 1;
    });

    const requiredCounts = { Easy: 5, Medium: 3, Hard: 4, Expert: 5 };
    const isValidDistribution = 
      counts.Easy === requiredCounts.Easy &&
      counts.Medium === requiredCounts.Medium &&
      counts.Hard === requiredCounts.Hard &&
      counts.Expert === requiredCounts.Expert;

    if (!isValidDistribution) {
      setSaveStatus("error: Please assign all questions to the correct difficulty distribution");
      return;
    }

    // Create levelVariants structure
    const levelVariants = {};
    ['Easy', 'Medium', 'Hard', 'Expert'].forEach(difficulty => {
      const variantQuestions = quiz.questions.filter(q => (q.difficulty || 'Easy') === difficulty);
      levelVariants[difficulty] = {
        difficulty,
        questionCount: variantQuestions.length,
        questions: variantQuestions,
      };
    });

    // Update metadata
    const updatedQuiz = {
      ...quiz,
      levelVariants,
      metadata: {
        ...quiz.metadata,
        totalQuestions: quiz.questions.length,
      },
    };

    setSaveStatus("Saving...");
    setTimeout(() => {
      onSave && onSave(updatedQuiz);
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus(""), 3000);
    }, 500);
  };

  const totalSteps = 3;
  const canGoNext = () => {
    if (currentStep === 1) {
      return quiz.title && quiz.category && quiz.level && quiz.quizType;
    }
    if (currentStep === 2) {
      return quiz.questions && quiz.questions.length === 17;
    }
    if (currentStep === 3) {
      // Check if all difficulties are properly assigned
      const counts = { Easy: 0, Medium: 0, Hard: 0, Expert: 0 };
      quiz.questions?.forEach(q => {
        const diff = q.difficulty || 'Easy';
        if (counts.hasOwnProperty(diff)) counts[diff] += 1;
      });
      return counts.Easy === 5 && counts.Medium === 3 && counts.Hard === 4 && counts.Expert === 5;
    }
    return false;
  };

  return (
    <div className="admin-quiz-builder" style={{ color: theme?.textPrimary }}>
      {/* Loading Indicator */}
      {loadingFullData && (
        <div style={{
          textAlign: 'center',
          padding: '20px',
          background: 'rgba(75, 192, 192, 0.1)',
          borderRadius: '8px',
          marginBottom: '20px',
        }}>
          <p style={{ color: theme?.textSecondary }}>
            📥 Loading full quiz data from Firebase...
          </p>
        </div>
      )}

      {/* Header */}
      <div className="builder-header">
        <div className="quiz-title-preview">
          <h1>{quiz.title || "Untitled Quiz"}</h1>
          <p style={{ color: theme?.textSecondary }}>
            {initialData ? '✏️ Editing' : '✨ Creating'} • {getQuizPlugin(quiz.quizType)?.label || "Select Type"} •{" "}
            {quiz.level}
          </p>
        </div>

        <div className="builder-actions">
          <button
            className="btn-save"
            onClick={handleSave}
            disabled={loadingFullData}
            style={{ backgroundColor: theme?.accentPrimary, opacity: loadingFullData ? 0.6 : 1 }}
          >
            {initialData ? '💾 Update Quiz' : '💾 Save Quiz'}
          </button>
          {saveStatus && (
            <span
              className={`status-message ${
                saveStatus.includes("error") ? "error" : "success"
              }`}
            >
              {saveStatus}
            </span>
          )}
          {onClose && (
            <button
              onClick={onClose}
              style={{
                padding: '10px 20px',
                background: 'transparent',
                color: theme?.textSecondary,
                border: `1px solid ${theme?.border}`,
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              ✕ Close
            </button>
          )}
        </div>
      </div>

      {/* Step Indicator */}
      <div className="step-indicator">
        {["Details", "Questions", "Variants"].map((label, idx) => (
          <div
            key={idx}
            className={`step ${currentStep === idx + 1 ? "active" : ""}`}
            onClick={() => setCurrentStep(idx + 1)}
            style={{
              backgroundColor:
                currentStep === idx + 1 ? theme?.accentPrimary : theme?.border,
            }}
          >
            <span className="step-number">{idx + 1}</span>
            <span className="step-label">{label}</span>
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="builder-content">
        {currentStep === 1 && (
          <QuizMetadataStep quiz={quiz} onUpdate={setQuiz} theme={theme} />
        )}

        {currentStep === 2 && quiz.quizType && (
          <QuestionEditorStep quiz={quiz} onUpdate={setQuiz} theme={theme} />
        )}

        {currentStep === 2 && !quiz.quizType && (
          <div className="form-step">
            <p style={{ color: theme?.textSecondary }}>
              Please select a quiz type first.
            </p>
          </div>
        )}

        {currentStep === 3 && (
          <DifficultyAssignmentStep quiz={quiz} onUpdate={setQuiz} theme={theme} />
        )}
      </div>

      {/* Navigation */}
      <div className="builder-navigation">
        <button
          className="btn-prev"
          onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
          disabled={currentStep === 1}
          style={{ backgroundColor: theme?.border }}
        >
          ← Previous
        </button>

        {currentStep < totalSteps ? (
          <button
            className="btn-next"
            onClick={() => setCurrentStep(Math.min(totalSteps, currentStep + 1))}
            disabled={!canGoNext()}
            style={{
              backgroundColor: canGoNext() ? theme?.accentPrimary : theme?.border,
            }}
          >
            Next →
          </button>
        ) : (
          <button
            className="btn-save"
            onClick={handleSave}
            disabled={!canGoNext()}
            style={{
              backgroundColor: canGoNext() ? theme?.accentPrimary : theme?.border,
              color: '#fff',
              padding: '10px 24px',
              borderRadius: '6px',
              fontWeight: '600',
              cursor: canGoNext() ? 'pointer' : 'not-allowed',
            }}
          >
            {saveStatus === "Saving..." ? "Saving..." : saveStatus === "saved" ? "✓ Saved!" : "💾 Save Quiz"}
          </button>
        )}
      </div>
    </div>
  );
};

export default AdminQuizBuilder;
