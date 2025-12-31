import React, { useContext, useState } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import { db } from '../../firebase/firebaseConfig';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

const QuestionsManager = ({ quiz, isOpen, onClose, onSave }) => {
  const { theme } = useContext(ThemeContext);
  const [questions, setQuestions] = useState(quiz?.questions || []);
  const [newQuestion, setNewQuestion] = useState({
    text: '',
    options: ['', '', '', ''],
    correctAnswerIndex: 0,
    explanation: '',
  });
  const [editingIndex, setEditingIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen || !quiz) return null;

  const handleAddQuestion = async () => {
    setError('');
    setSuccess('');

    if (!newQuestion.text.trim()) {
      setError('Question text is required');
      return;
    }

    if (newQuestion.options.some(opt => !opt.trim())) {
      setError('All options must be filled');
      return;
    }

    try {
      setLoading(true);
      const questionData = {
        ...newQuestion,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };

      const updatedQuestions = [...questions, questionData];
      setQuestions(updatedQuestions);

      // Update Firestore
      await updateDoc(doc(db, 'quizzes', quiz.id), {
        questions: arrayUnion(questionData),
      });

      setSuccess('Question added successfully!');
      setNewQuestion({
        text: '',
        options: ['', '', '', ''],
        correctAnswerIndex: 0,
        explanation: '',
      });

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Error adding question: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuestion = async (index) => {
    try {
      setLoading(true);
      const questionToDelete = questions[index];
      const updatedQuestions = questions.filter((_, i) => i !== index);
      setQuestions(updatedQuestions);

      // Update Firestore
      await updateDoc(doc(db, 'quizzes', quiz.id), {
        questions: arrayRemove(questionToDelete),
      });

      setSuccess('Question deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Error deleting question: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...newQuestion.options];
    updatedOptions[index] = value;
    setNewQuestion({ ...newQuestion, options: updatedOptions });
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        backdropFilter: 'blur(4px)',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: theme.surfacePrimary,
          borderRadius: '16px',
          padding: '32px',
          maxWidth: '800px',
          width: '90%',
          maxHeight: '90vh',
          overflowY: 'auto',
          border: `2px solid ${theme.border}`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          paddingBottom: '16px',
          borderBottom: `2px solid ${theme.border}`,
        }}>
          <h2 style={{
            color: theme.textPrimary,
            fontSize: '20px',
            fontWeight: '700',
            margin: 0,
          }}>
            ❓ Manage Questions
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: theme.textSecondary,
              fontSize: '24px',
              cursor: 'pointer',
              padding: '0',
            }}
          >
            ✕
          </button>
        </div>

        {/* Quiz Info */}
        <div style={{
          background: theme.background,
          padding: '12px',
          borderRadius: '8px',
          marginBottom: '20px',
          border: `1px solid ${theme.border}`,
        }}>
          <p style={{
            color: theme.textSecondary,
            fontSize: '11px',
            fontWeight: '600',
            margin: '0 0 4px 0',
            textTransform: 'uppercase',
          }}>
            Quiz
          </p>
          <p style={{
            color: theme.textPrimary,
            fontSize: '14px',
            fontWeight: '600',
            margin: '0',
          }}>
            {quiz.title}
          </p>
        </div>

        {/* Error & Success Messages */}
        {error && (
          <div style={{
            background: '#FF6B6B25',
            border: '2px solid #FF6B6B',
            color: '#FF6B6B',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '16px',
            fontSize: '13px',
            fontWeight: '600',
          }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{
            background: '#51CF6625',
            border: '2px solid #51CF66',
            color: '#51CF66',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '16px',
            fontSize: '13px',
            fontWeight: '600',
          }}>
            {success}
          </div>
        )}

        {/* Current Questions List */}
        {questions.length > 0 && (
          <div style={{
            marginBottom: '24px',
            paddingBottom: '20px',
            borderBottom: `2px solid ${theme.border}`,
          }}>
            <h3 style={{
              color: theme.textPrimary,
              fontSize: '14px',
              fontWeight: '600',
              margin: '0 0 12px 0',
            }}>
              Current Questions ({questions.length})
            </h3>
            <div style={{
              display: 'grid',
              gap: '12px',
            }}>
              {questions.map((q, idx) => (
                <div
                  key={q.id || idx}
                  style={{
                    background: theme.background,
                    padding: '12px',
                    borderRadius: '8px',
                    border: `1px solid ${theme.border}`,
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'start',
                    gap: '12px',
                  }}>
                    <div style={{ flex: 1 }}>
                      <p style={{
                        color: theme.textPrimary,
                        fontSize: '12px',
                        fontWeight: '600',
                        margin: '0 0 6px 0',
                      }}>
                        Q{idx + 1}: {q.text}
                      </p>
                      <div style={{
                        fontSize: '11px',
                        color: theme.textSecondary,
                        display: 'grid',
                        gap: '2px',
                      }}>
                        {q.options?.map((opt, optIdx) => (
                          <div key={optIdx}>
                            <span style={{
                              display: 'inline-block',
                              padding: '2px 6px',
                              background: optIdx === q.correctAnswerIndex ? '#51CF6625' : 'transparent',
                              borderRadius: '3px',
                              color: optIdx === q.correctAnswerIndex ? '#51CF66' : theme.textSecondary,
                              fontWeight: optIdx === q.correctAnswerIndex ? '600' : '400',
                            }}>
                              {String.fromCharCode(65 + optIdx)}: {opt}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteQuestion(idx)}
                      disabled={loading}
                      style={{
                        padding: '6px 12px',
                        background: '#FF6B6B25',
                        color: '#FF6B6B',
                        border: '1px solid #FF6B6B',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: '600',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        opacity: loading ? 0.5 : 1,
                      }}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add New Question Form */}
        <div style={{
          background: theme.background,
          padding: '16px',
          borderRadius: '8px',
          border: `2px solid ${theme.border}`,
        }}>
          <h3 style={{
            color: theme.textPrimary,
            fontSize: '14px',
            fontWeight: '600',
            margin: '0 0 16px 0',
          }}>
            ➕ Add New Question
          </h3>

          {/* Question Text */}
          <div style={{ marginBottom: '12px' }}>
            <label style={{
              display: 'block',
              color: theme.textSecondary,
              fontSize: '11px',
              fontWeight: '600',
              marginBottom: '6px',
              textTransform: 'uppercase',
            }}>
              Question Text
            </label>
            <textarea
              value={newQuestion.text}
              onChange={(e) => setNewQuestion({ ...newQuestion, text: e.target.value })}
              placeholder="Enter question text..."
              style={{
                width: '100%',
                padding: '10px 12px',
                background: theme.surfacePrimary,
                border: `2px solid ${theme.border}`,
                borderRadius: '6px',
                color: theme.textPrimary,
                fontSize: '13px',
                fontFamily: 'inherit',
                minHeight: '60px',
                boxSizing: 'border-box',
                resize: 'vertical',
              }}
            />
          </div>

          {/* Options */}
          <div style={{ marginBottom: '12px' }}>
            <label style={{
              display: 'block',
              color: theme.textSecondary,
              fontSize: '11px',
              fontWeight: '600',
              marginBottom: '8px',
              textTransform: 'uppercase',
            }}>
              Answer Options
            </label>
            <div style={{
              display: 'grid',
              gap: '8px',
            }}>
              {newQuestion.options.map((opt, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span style={{
                    minWidth: '30px',
                    color: theme.textSecondary,
                    fontWeight: '600',
                    fontSize: '12px',
                  }}>
                    {String.fromCharCode(65 + idx)}:
                  </span>
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) => handleOptionChange(idx, e.target.value)}
                    placeholder={`Option ${idx + 1}`}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      background: theme.surfacePrimary,
                      border: `1px solid ${newQuestion.correctAnswerIndex === idx ? theme.accentPrimary : theme.border}`,
                      borderRadius: '4px',
                      color: theme.textPrimary,
                      fontSize: '12px',
                      fontFamily: 'inherit',
                    }}
                  />
                  <button
                    onClick={() => setNewQuestion({ ...newQuestion, correctAnswerIndex: idx })}
                    style={{
                      padding: '6px 12px',
                      background: newQuestion.correctAnswerIndex === idx ? '#51CF6625' : theme.background,
                      color: newQuestion.correctAnswerIndex === idx ? '#51CF66' : theme.textSecondary,
                      border: `2px solid ${newQuestion.correctAnswerIndex === idx ? '#51CF66' : theme.border}`,
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: '600',
                      cursor: 'pointer',
                    }}
                  >
                    {newQuestion.correctAnswerIndex === idx ? '✓ Correct' : 'Set Correct'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Explanation */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              color: theme.textSecondary,
              fontSize: '11px',
              fontWeight: '600',
              marginBottom: '6px',
              textTransform: 'uppercase',
            }}>
              Explanation (Optional)
            </label>
            <textarea
              value={newQuestion.explanation}
              onChange={(e) => setNewQuestion({ ...newQuestion, explanation: e.target.value })}
              placeholder="Provide explanation for the correct answer..."
              style={{
                width: '100%',
                padding: '10px 12px',
                background: theme.surfacePrimary,
                border: `2px solid ${theme.border}`,
                borderRadius: '6px',
                color: theme.textPrimary,
                fontSize: '13px',
                fontFamily: 'inherit',
                minHeight: '50px',
                boxSizing: 'border-box',
                resize: 'vertical',
              }}
            />
          </div>

          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            gap: '8px',
          }}>
            <button
              onClick={handleAddQuestion}
              disabled={loading}
              style={{
                flex: 1,
                padding: '12px 20px',
                background: `linear-gradient(135deg, ${theme.accentPrimary}, ${theme.accentSecondary || theme.accentPrimary})`,
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1,
              }}
            >
              {loading ? '⏳ Adding...' : '➕ Add Question'}
            </button>
            <button
              onClick={onClose}
              disabled={loading}
              style={{
                flex: 1,
                padding: '12px 20px',
                background: 'transparent',
                color: theme.textPrimary,
                border: `2px solid ${theme.border}`,
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.5 : 1,
              }}
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionsManager;
