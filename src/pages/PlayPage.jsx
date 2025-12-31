import React, { useState, useEffect } from 'react';
import SiteLayout from '../layouts/SiteLayout';
import { useTheme } from '../context/ThemeContext';
import { useParams } from 'react-router-dom';

export default function PlayPage() {
  const { theme } = useTheme();
  const { type, id } = useParams();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [completed, setCompleted] = useState(false);

  const DEMO_QUESTIONS = [
    {
      id: 1,
      question: 'What is the capital of France?',
      type: 'mcq',
      difficulty: 'Easy',
      points: 10,
      options: ['Paris', 'London', 'Berlin', 'Madrid'],
      correctAnswer: 0,
    },
    {
      id: 2,
      question: 'Which planet is closest to the Sun?',
      type: 'mcq',
      difficulty: 'Easy',
      points: 10,
      options: ['Venus', 'Mercury', 'Earth', 'Mars'],
      correctAnswer: 1,
    },
    {
      id: 3,
      question: 'What is 2 + 2 × 3?',
      type: 'mcq',
      difficulty: 'Medium',
      points: 20,
      options: ['8', '12', '6', '10'],
      correctAnswer: 0,
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setCompleted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const question = DEMO_QUESTIONS[currentQuestion];
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (optionIndex) => {
    setSelectedAnswer(optionIndex);
    setAnswered(true);

    if (optionIndex === question.correctAnswer) {
      setScore(score + question.points);
    }
  };

  const handleNext = () => {
    if (currentQuestion < DEMO_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setAnswered(false);
    } else {
      setCompleted(true);
    }
  };

  if (completed) {
    const totalPoints = DEMO_QUESTIONS.reduce((sum, q) => sum + q.points, 0);
    const percentage = Math.round((score / totalPoints) * 100);

    return (
      <SiteLayout>
        <div style={{
          background: theme.background,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
        }}>
          <div style={{
            textAlign: 'center',
            maxWidth: '600px',
          }}>
            {percentage >= 70 ? (
              <div style={{ fontSize: '80px', marginBottom: '20px' }}>🎉</div>
            ) : percentage >= 50 ? (
              <div style={{ fontSize: '80px', marginBottom: '20px' }}>👏</div>
            ) : (
              <div style={{ fontSize: '80px', marginBottom: '20px' }}>💪</div>
            )}

            <h1 style={{
              color: theme.accentPrimary,
              fontSize: '42px',
              fontWeight: '700',
              marginBottom: '10px',
            }}>
              Quiz Complete!
            </h1>

            <div style={{
              background: theme.surfacePrimary,
              border: `2px solid ${theme.border}`,
              borderRadius: '16px',
              padding: '40px',
              backdropFilter: 'blur(10px)',
              marginBottom: '30px',
            }}>
              <div style={{
                fontSize: '60px',
                color: theme.accentPrimary,
                fontWeight: '700',
                marginBottom: '20px',
              }}>
                {score}/{totalPoints}
              </div>

              <div style={{
                fontSize: '24px',
                color: theme.textSecondary,
                marginBottom: '20px',
              }}>
                {percentage}% Score
              </div>

              <div style={{
                width: '100%',
                height: '12px',
                background: theme.surfaceSecondary,
                borderRadius: '6px',
                overflow: 'hidden',
                marginBottom: '20px',
              }}>
                <div style={{
                  width: `${percentage}%`,
                  height: '100%',
                  background: `linear-gradient(135deg, ${theme.accentPrimary}, ${theme.accentSecondary})`,
                  transition: 'width 0.5s ease',
                }}></div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '16px',
              }}>
                <div style={{
                  padding: '16px',
                  background: theme.surfaceSecondary,
                  borderRadius: '12px',
                  border: `1px solid ${theme.border}`,
                }}>
                  <div style={{
                    fontSize: '12px',
                    color: theme.textSecondary,
                    marginBottom: '8px',
                  }}>
                    Correct
                  </div>
                  <div style={{
                    fontSize: '24px',
                    fontWeight: '700',
                    color: theme.accentPrimary,
                  }}>
                    {Math.ceil((score / totalPoints) * DEMO_QUESTIONS.length)}
                  </div>
                </div>

                <div style={{
                  padding: '16px',
                  background: theme.surfaceSecondary,
                  borderRadius: '12px',
                  border: `1px solid ${theme.border}`,
                }}>
                  <div style={{
                    fontSize: '12px',
                    color: theme.textSecondary,
                    marginBottom: '8px',
                  }}>
                    Time Taken
                  </div>
                  <div style={{
                    fontSize: '24px',
                    fontWeight: '700',
                    color: theme.accentSecondary,
                  }}>
                    {formatTime(300 - timeLeft)}
                  </div>
                </div>
              </div>
            </div>

            <div style={{
              display: 'flex',
              gap: '16px',
              justifyContent: 'center',
            }}>
              <button
                onClick={() => window.history.back()}
                style={{
                  padding: '14px 32px',
                  background: theme.surfaceSecondary,
                  border: `2px solid ${theme.border}`,
                  borderRadius: '12px',
                  color: theme.textPrimary,
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseOver={(e) => {
                  e.target.style.borderColor = theme.accentPrimary;
                }}
                onMouseOut={(e) => {
                  e.target.style.borderColor = theme.border;
                }}
              >
                Back to Home
              </button>
              <button
                style={{
                  padding: '14px 32px',
                  background: `linear-gradient(135deg, ${theme.accentPrimary}, ${theme.accentSecondary})`,
                  color: '#fff',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'scale(1)';
                }}
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <div style={{
        background: theme.background,
        minHeight: '100vh',
        padding: '20px',
      }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
        }}>
          {/* Progress Bar */}
          <div style={{
            background: theme.surfacePrimary,
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '20px',
            border: `1px solid ${theme.border}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <div>
              <div style={{ color: theme.textSecondary, fontSize: '12px' }}>
                Question {currentQuestion + 1} of {DEMO_QUESTIONS.length}
              </div>
              <div style={{
                width: '400px',
                height: '8px',
                background: theme.surfaceSecondary,
                borderRadius: '4px',
                overflow: 'hidden',
                marginTop: '8px',
              }}>
                <div style={{
                  width: `${((currentQuestion + 1) / DEMO_QUESTIONS.length) * 100}%`,
                  height: '100%',
                  background: `linear-gradient(135deg, ${theme.accentPrimary}, ${theme.accentSecondary})`,
                }}></div>
              </div>
            </div>

            <div style={{
              textAlign: 'right',
            }}>
              <div style={{
                fontSize: '28px',
                fontWeight: '700',
                color: timeLeft < 60 ? theme.accentAccent : theme.accentPrimary,
              }}>
                {formatTime(timeLeft)}
              </div>
              <div style={{
                fontSize: '12px',
                color: theme.textSecondary,
              }}>
                Time left
              </div>
            </div>
          </div>

          {/* Question Card */}
          <div style={{
            background: theme.surfacePrimary,
            border: `2px solid ${theme.border}`,
            borderRadius: '16px',
            padding: '40px',
            backdropFilter: 'blur(10px)',
            marginBottom: '20px',
          }}>
            {/* Question */}
            <h2 style={{
              color: theme.textPrimary,
              fontSize: '24px',
              fontWeight: '700',
              marginTop: 0,
              marginBottom: '30px',
              lineHeight: '1.6',
            }}>
              {question.question}
            </h2>

            {/* Options */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}>
              {question.options.map((option, index) => {
                const isSelected = selectedAnswer === index;
                const isCorrect = index === question.correctAnswer;
                const showCorrect = answered && isCorrect;
                const showIncorrect = answered && isSelected && !isCorrect;

                return (
                  <button
                    key={index}
                    onClick={() => !answered && handleAnswer(index)}
                    disabled={answered}
                    style={{
                      padding: '16px 20px',
                      background: showCorrect
                        ? `${theme.accentPrimary}20`
                        : showIncorrect
                        ? `${theme.accentAccent}20`
                        : isSelected
                        ? theme.surfaceSecondary
                        : theme.surfaceSecondary,
                      border: showCorrect
                        ? `2px solid ${theme.accentPrimary}`
                        : showIncorrect
                        ? `2px solid ${theme.accentAccent}`
                        : `2px solid ${theme.border}`,
                      borderRadius: '12px',
                      color: theme.textPrimary,
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: answered ? 'default' : 'pointer',
                      transition: 'all 0.3s ease',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                    }}
                    onMouseOver={(e) => {
                      if (!answered) {
                        e.target.style.borderColor = theme.accentPrimary;
                        e.target.style.background = theme.surfaceSecondary;
                      }
                    }}
                    onMouseOut={(e) => {
                      if (!answered && !isSelected) {
                        e.target.style.borderColor = theme.border;
                      }
                    }}
                  >
                    <span style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: isSelected ? theme.accentPrimary : theme.surfaceSecondary,
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '700',
                      fontSize: '14px',
                      flexShrink: 0,
                    }}>
                      {showCorrect ? '✓' : showIncorrect ? '✗' : String.fromCharCode(65 + index)}
                    </span>
                    {option}
                  </button>
                );
              })}
            </div>

            {/* Hint */}
            {answered && (
              <div style={{
                marginTop: '24px',
                padding: '16px',
                background: `${theme.accentPrimary}15`,
                border: `1px solid ${theme.accentPrimary}40`,
                borderRadius: '12px',
                color: theme.accentPrimary,
                fontSize: '14px',
                fontWeight: '500',
              }}>
                {selectedAnswer === question.correctAnswer ? '✨ Correct! ' : '💡 '} 
                The correct answer is: <strong>{question.options[question.correctAnswer]}</strong>
              </div>
            )}
          </div>

          {/* Score and Next Button */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <div style={{
              color: theme.textSecondary,
              fontSize: '16px',
            }}>
              Current Score: <strong style={{ color: theme.accentPrimary }}>{score} pts</strong>
            </div>
            {answered && (
              <button
                onClick={handleNext}
                style={{
                  padding: '14px 32px',
                  background: `linear-gradient(135deg, ${theme.accentPrimary}, ${theme.accentSecondary})`,
                  color: '#fff',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = `0 8px 20px ${theme.accentPrimary}40`;
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                {currentQuestion === DEMO_QUESTIONS.length - 1 ? 'Finish Quiz' : 'Next Question'} →
              </button>
            )}
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
