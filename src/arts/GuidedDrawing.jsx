import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import artLessons from './data/artLessons.json';

const GuidedDrawing = () => {
  const { theme } = useTheme();
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushSize, setBrushSize] = useState(3);
  const [brushColor, setBrushColor] = useState('#000000');
  const [canvasHistory, setCanvasHistory] = useState([]);

  // Initialize canvas
  useEffect(() => {
    if (selectedLesson && canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = 500;
      canvas.height = 500;

      const context = canvas.getContext('2d');
      context.fillStyle = theme.surfacePrimary;
      context.fillRect(0, 0, canvas.width, canvas.height);
      contextRef.current = context;
      saveCanvasState();
    }
  }, [selectedLesson, theme]);

  const saveCanvasState = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      setCanvasHistory(prev => [...prev, canvas.toDataURL()]);
    }
  };

  const handleSelectLesson = (lesson) => {
    setSelectedLesson(lesson);
    setCurrentStep(0);
    setCanvasHistory([]);
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
    setCanvasHistory([]);
  };

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = contextRef.current;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = brushColor;
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = contextRef.current;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    const ctx = contextRef.current;
    ctx.closePath();
    setIsDrawing(false);
    saveCanvasState();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = theme.surfacePrimary;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    contextRef.current = ctx;
    setCanvasHistory([]);
    saveCanvasState();
  };

  const undoDrawing = () => {
    if (canvasHistory.length > 1) {
      const newHistory = canvasHistory.slice(0, -1);
      setCanvasHistory(newHistory);
      
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.src = newHistory[newHistory.length - 1];
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        contextRef.current = ctx;
      };
    }
  };

  if (!selectedLesson) {
    return (
      <div style={{
        minHeight: '100vh',
        background: theme.background,
        padding: '20px',
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
        }}>
          {/* Header */}
          <h1 style={{
            color: theme.textPrimary,
            fontSize: '32px',
            fontWeight: '700',
            marginBottom: '10px',
            textAlign: 'center',
          }}>
            📚 Learn to Draw
          </h1>
          <p style={{
            color: theme.textSecondary,
            fontSize: '14px',
            textAlign: 'center',
            marginBottom: '40px',
          }}>
            Step-by-step guided drawing lessons for beginners
          </p>

          {/* Lessons Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '20px',
          }}>
            {artLessons.map(lesson => (
              <button
                key={lesson.id}
                onClick={() => handleSelectLesson(lesson)}
                style={{
                  padding: '20px',
                  background: theme.surfacePrimary,
                  border: `3px solid ${theme.accentPrimary}`,
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textAlign: 'center',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = `0 12px 30px ${theme.accentPrimary}30`;
                  e.currentTarget.style.borderColor = theme.accentSecondary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = theme.accentPrimary;
                }}
              >
                <div style={{ fontSize: '56px', marginBottom: '12px' }}>
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
                  fontSize: '13px',
                  margin: '0 0 12px 0',
                }}>
                  {lesson.level} • {lesson.steps.length} steps
                </p>
                <div style={{
                  display: 'inline-block',
                  background: theme.accentPrimary + '20',
                  color: theme.accentPrimary,
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '600',
                }}>
                  Start Learning
                </div>
              </button>
            ))}
          </div>

          {/* Back Button */}
          <div style={{ marginTop: '50px', textAlign: 'center' }}>
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
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = theme.border + '30'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              ← Back to Arts
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
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px',
      }}>
        <h2 style={{
          color: theme.textPrimary,
          fontSize: '26px',
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
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = theme.border + '30'}
          onMouseLeave={(e) => e.currentTarget.style.background = theme.background}
        >
          ← Back
        </button>
      </div>

      {/* Main Content - Canvas + Instructions */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '16px',
        flex: 1,
        marginBottom: '16px',
      }}>
        {/* Left Panel - Drawing Canvas */}
        <div style={{
          background: theme.surfacePrimary,
          border: `2px solid ${theme.border}`,
          borderRadius: '12px',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
        }}>
          {/* Canvas Toolbar */}
          <div style={{
            display: 'flex',
            gap: '10px',
            marginBottom: '12px',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}>
            {/* Brush Size */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <label style={{
                color: theme.textPrimary,
                fontSize: '12px',
                fontWeight: '600',
              }}>
                Size:
              </label>
              <input
                type="range"
                min="1"
                max="20"
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                style={{ width: '80px' }}
              />
              <span style={{
                color: theme.textSecondary,
                fontSize: '12px',
                minWidth: '30px',
              }}>
                {brushSize}px
              </span>
            </div>

            {/* Color Picker */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <label style={{
                color: theme.textPrimary,
                fontSize: '12px',
                fontWeight: '600',
              }}>
                Color:
              </label>
              <input
                type="color"
                value={brushColor}
                onChange={(e) => setBrushColor(e.target.value)}
                style={{
                  width: '40px',
                  height: '40px',
                  border: `2px solid ${theme.border}`,
                  borderRadius: '6px',
                  cursor: 'pointer',
                }}
              />
            </div>

            <div style={{ flex: 1 }} />

            {/* Clear & Undo Buttons */}
            <button
              onClick={undoDrawing}
              disabled={canvasHistory.length <= 1}
              style={{
                padding: '8px 12px',
                background: canvasHistory.length <= 1 ? theme.border : theme.background,
                border: `1px solid ${theme.border}`,
                borderRadius: '6px',
                color: theme.textPrimary,
                fontSize: '12px',
                fontWeight: '600',
                cursor: canvasHistory.length <= 1 ? 'not-allowed' : 'pointer',
                opacity: canvasHistory.length <= 1 ? 0.5 : 1,
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                if (canvasHistory.length > 1) {
                  e.currentTarget.style.background = theme.accentPrimary + '20';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = theme.background;
              }}
            >
              ↩️ Undo
            </button>

            <button
              onClick={clearCanvas}
              style={{
                padding: '8px 12px',
                background: theme.error + '20',
                border: `1px solid ${theme.error}`,
                borderRadius: '6px',
                color: theme.error,
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = theme.error + '30'}
              onMouseLeave={(e) => e.currentTarget.style.background = theme.error + '20'}
            >
              🗑️ Clear
            </button>
          </div>

          {/* Canvas */}
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            style={{
              flex: 1,
              background: theme.surfacePrimary,
              border: `3px solid ${theme.border}`,
              borderRadius: '8px',
              cursor: 'crosshair',
              minHeight: '400px',
              touchAction: 'none',
            }}
          />
        </div>

        {/* Right Panel - Reference + Instructions */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}>
          {/* Reference Image */}
          <div style={{
            background: theme.surfacePrimary,
            border: `2px solid ${theme.border}`,
            borderRadius: '12px',
            padding: '16px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '250px',
          }}>
            <img
              src={step.image}
              alt={`Step ${currentStep + 1}`}
              style={{
                maxWidth: '100%',
                maxHeight: '250px',
                borderRadius: '8px',
                objectFit: 'contain',
              }}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>

          {/* Instructions */}
          <div style={{
            background: theme.surfacePrimary,
            border: `2px solid ${theme.accentPrimary}`,
            borderRadius: '12px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
          }}>
            <p style={{
              color: theme.textSecondary,
              fontSize: '11px',
              fontWeight: '700',
              textTransform: 'uppercase',
              margin: '0 0 8px 0',
              letterSpacing: '0.5px',
            }}>
              📍 Step {currentStep + 1} of {lesson.steps.length}
            </p>

            {/* Progress Bar */}
            <div style={{
              width: '100%',
              height: '6px',
              background: theme.background,
              borderRadius: '3px',
              overflow: 'hidden',
              marginBottom: '16px',
            }}>
              <div style={{
                width: `${progress}%`,
                height: '100%',
                background: theme.accentPrimary,
                transition: 'width 0.4s ease',
                borderRadius: '3px',
              }} />
            </div>

            {/* Main Instruction */}
            <p style={{
              color: theme.textPrimary,
              fontSize: '16px',
              fontWeight: '700',
              lineHeight: '1.6',
              margin: '0 0 12px 0',
            }}>
              {step.instruction}
            </p>

            {/* Tip Box */}
            {step.tip && (
              <div style={{
                background: theme.accentPrimary + '15',
                border: `2px solid ${theme.accentPrimary}`,
                borderRadius: '8px',
                padding: '12px',
                marginTop: 'auto',
              }}>
                <p style={{
                  color: theme.textPrimary,
                  fontSize: '13px',
                  margin: '0',
                  lineHeight: '1.5',
                }}>
                  💡 <strong>Tip:</strong> {step.tip}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div style={{
        display: 'flex',
        gap: '12px',
        justifyContent: 'center',
        paddingTop: '16px',
        borderTop: `1px solid ${theme.border}`,
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
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            if (currentStep > 0) {
              e.currentTarget.style.background = theme.accentPrimary + '20';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = theme.background;
          }}
        >
          ← Previous Step
        </button>

        {currentStep === lesson.steps.length - 1 ? (
          <button
            onClick={() => {
              alert('🎉 Awesome! You completed ' + lesson.title + '!');
              handleBackToList();
            }}
            style={{
              padding: '12px 30px',
              background: theme.success,
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '14px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.3s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = `0 8px 20px ${theme.success}40`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            ✅ Complete Lesson!
          </button>
        ) : (
          <button
            onClick={handleNextStep}
            style={{
              padding: '12px 30px',
              background: theme.accentPrimary,
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '14px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.3s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = `0 8px 20px ${theme.accentPrimary}40`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Next Step →
          </button>
        )}
      </div>
    </div>
  );
};

export default GuidedDrawing;
