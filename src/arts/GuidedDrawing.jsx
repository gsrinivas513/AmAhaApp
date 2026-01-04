import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import artLessons from './data/artLessons.json';

const GuidedDrawing = () => {
  const { theme } = useTheme();
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);

  const handleSelectLesson = (lesson) => {
    setSelectedLesson(lesson);
    setCurrentStep(0);
  };

  const handleNextStep = () => {
    if (selectedLesson && currentStep < selectedLesson.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleBackToList = () => {
    setSelectedLesson(null);
    setCurrentStep(0);
  };

  if (!selectedLesson) {
    return (
      <div style={{
        minHeight: '100vh',
        background: theme.background,
        padding: '20px',
      }}>
        <div style={{
          maxWidth: '1000px',
          margin: '0 auto',
        }}>
          {/* Header */}
          <h1 style={{
            color: theme.textPrimary,
            fontSize: '32px',
            fontWeight: '700',
            marginBottom: '30px',
            textAlign: 'center',
          }}>
            📚 Learn to Draw
          </h1>

          {/* Lessons Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '20px',
          }}>
            {artLessons.map(lesson => (
              <button
                key={lesson.id}
                onClick={() => handleSelectLesson(lesson)}
                style={{
                  padding: '20px',
                  background: theme.surfacePrimary,
                  border: `3px solid #A78BFA`,
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textAlign: 'center',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                }}
              >
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>
                  {lesson.icon}
                </div>
                <h3 style={{
                  color: theme.textPrimary,
                  fontSize: '18px',
                  fontWeight: '700',
                  margin: '0 0 8px 0',
                }}>
                  {lesson.title}
                </h3>
                <p style={{
                  color: theme.textSecondary,
                  fontSize: '12px',
                  margin: '0',
                }}>
                  {lesson.level} • {lesson.steps.length} steps
                </p>
              </button>
            ))}
          </div>

          {/* Back Button */}
          <div style={{ marginTop: '40px', textAlign: 'center' }}>
            <button
              onClick={() => window.history.back()}
              style={{
                padding: '12px 24px',
                background: 'transparent',
                border: `2px solid ${theme.border}`,
                borderRadius: '8px',
                color: theme.textPrimary,
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              ← Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const lesson = selectedLesson;
  const step = lesson.steps[currentStep];
  const progress = Math.round(((currentStep + 1) / lesson.steps.length) * 100);

  return (
    <div style={{
      minHeight: '100vh',
      background: theme.background,
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
      }}>
        <h2 style={{
          color: theme.textPrimary,
          fontSize: '28px',
          fontWeight: '700',
          margin: '0',
        }}>
          {lesson.icon} {lesson.title}
        </h2>
        <button
          onClick={handleBackToList}
          style={{
            padding: '10px 16px',
            background: theme.background,
            border: `2px solid ${theme.border}`,
            borderRadius: '8px',
            color: theme.textPrimary,
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          ← Back
        </button>
      </div>

      {/* Content */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px',
        flex: 1,
        marginBottom: '20px',
      }}>
        {/* Reference Image */}
        <div style={{
          background: theme.surfacePrimary,
          border: `2px solid ${theme.border}`,
          borderRadius: '12px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <img
            src={step.image}
            alt={`Step ${currentStep + 1}`}
            style={{
              maxWidth: '100%',
              maxHeight: '400px',
              borderRadius: '8px',
            }}
            onError={(e) => {
              e.target.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22300%22%3E%3Crect fill=%22%23f0f0f0%22 width=%22300%22 height=%22300%22/%3E%3C/svg%3E';
            }}
          />
        </div>

        {/* Instructions */}
        <div style={{
          background: theme.surfacePrimary,
          border: `2px solid ${theme.border}`,
          borderRadius: '12px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}>
          <div style={{
            marginBottom: '20px',
          }}>
            <p style={{
              color: theme.textSecondary,
              fontSize: '12px',
              fontWeight: '600',
              textTransform: 'uppercase',
              margin: '0 0 8px 0',
            }}>
              Step {currentStep + 1} of {lesson.steps.length}
            </p>
            <div style={{
              width: '100%',
              height: '8px',
              background: theme.background,
              borderRadius: '4px',
              overflow: 'hidden',
            }}>
              <div style={{
                width: `${progress}%`,
                height: '100%',
                background: '#A78BFA',
                transition: 'width 0.3s ease',
              }} />
            </div>
          </div>

          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px',
          }}>
            <p style={{
              color: theme.textPrimary,
              fontSize: '20px',
              fontWeight: '700',
              lineHeight: '1.6',
              margin: '0',
              textAlign: 'center',
            }}>
              {step.instruction}
            </p>
          </div>

          {step.tip && (
            <div style={{
              background: '#A78BFA25',
              border: `2px solid #A78BFA`,
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '20px',
            }}>
              <p style={{
                color: theme.textPrimary,
                fontSize: '13px',
                margin: '0',
              }}>
                💡 {step.tip}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div style={{
        display: 'flex',
        gap: '12px',
        justifyContent: 'center',
      }}>
        <button
          onClick={handlePrevStep}
          disabled={currentStep === 0}
          style={{
            padding: '12px 24px',
            background: currentStep === 0 ? theme.border : theme.background,
            border: `2px solid ${theme.border}`,
            borderRadius: '8px',
            color: currentStep === 0 ? theme.textSecondary : theme.textPrimary,
            fontSize: '14px',
            fontWeight: '600',
            cursor: currentStep === 0 ? 'not-allowed' : 'pointer',
            opacity: currentStep === 0 ? 0.5 : 1,
          }}
        >
          ← Previous
        </button>

        {currentStep === lesson.steps.length - 1 ? (
          <button
            onClick={() => {
              alert('🎉 Great job! You completed the lesson!');
              handleBackToList();
            }}
            style={{
              padding: '12px 24px',
              background: '#81C995',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            ✅ Complete
          </button>
        ) : (
          <button
            onClick={handleNextStep}
            style={{
              padding: '12px 24px',
              background: '#A78BFA',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            Next →
          </button>
        )}
      </div>
    </div>
  );
};

export default GuidedDrawing;
