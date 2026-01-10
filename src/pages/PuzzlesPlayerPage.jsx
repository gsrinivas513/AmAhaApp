import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import SiteLayout from '../layouts/SiteLayout';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../components/AuthProvider';
import QuestionRenderer from '../quiz/components/QuestionRenderer';
import { audioFeedback } from '../quiz/utils/audioFeedback';
import { evaluatePuzzle } from '../quiz/services/puzzleEvaluator';
import '../styles/quiz-player.css';

export default function PuzzlesPlayerPage() {
  const { puzzleId } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { user } = useAuth();

  const [puzzle, setPuzzle] = useState(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [puzzleStarted, setPuzzleStarted] = useState(false);
  const [puzzleCompleted, setPuzzleCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes default
  const [elapsedTime, setElapsedTime] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [evaluation, setEvaluation] = useState(null);

  // Load puzzle from Firestore
  useEffect(() => {
    const loadPuzzle = async () => {
      try {
        audioFeedback.initialize();
        
        const puzzleRef = doc(db, 'puzzles', puzzleId);
        const puzzleSnap = await getDoc(puzzleRef);

        if (!puzzleSnap.exists()) {
          alert('Puzzle not found!');
          navigate('/puzzles');
          return;
        }

        setPuzzle({
          id: puzzleSnap.id,
          ...puzzleSnap.data()
        });
      } catch (error) {
        console.error('Error loading puzzle:', error);
        navigate('/puzzles');
      } finally {
        setLoading(false);
      }
    };

    loadPuzzle();
  }, [puzzleId, navigate]);

  // Timer effect
  useEffect(() => {
    if (!puzzleStarted || puzzleCompleted) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setPuzzleCompleted(true);
          handlePuzzleTimeout();
          return 0;
        }
        return prev - 1;
      });

      setElapsedTime(Date.now() - startTime);
    }, 1000);

    return () => clearInterval(timer);
  }, [puzzleStarted, puzzleCompleted, startTime]);

  const handleStartPuzzle = () => {
    setPuzzleStarted(true);
    setStartTime(Date.now());
  };

  const handleAnswerSelect = (answerData) => {
    if (answered) return;

    setSelectedAnswer(answerData);
    setAnswered(true);

    const puzzleData = puzzle.data || puzzle;
    let isCorrect = false;
    let earnedScore = 0;

    try {
      // Route to appropriate evaluator based on puzzle type
      if (puzzleData.type === 'CROSSWORD' || puzzleData.type === 'crossword') {
        const result = evaluatePuzzle(puzzleData.type, answerData, puzzleData);
        isCorrect = result.isCorrect;
        earnedScore = result.score || 0;
        setEvaluation(result);
      } else if (puzzleData.type === 'WORD_SEARCH' || puzzleData.type === 'word-search') {
        const result = evaluatePuzzle(puzzleData.type, answerData, puzzleData);
        isCorrect = result.isCorrect;
        earnedScore = result.score || 0;
        setEvaluation(result);
      } else if (puzzleData.type === 'SUDOKU' || puzzleData.type === 'sudoku') {
        const result = evaluatePuzzle(puzzleData.type, answerData, puzzleData);
        isCorrect = result.isCorrect;
        earnedScore = result.score || 0;
        setEvaluation(result);
      }

      // Play audio feedback
      if (isCorrect) {
        audioFeedback.playCorrectSound();
      } else {
        audioFeedback.playWrongSound();
      }

      setScore(earnedScore);
    } catch (error) {
      console.error('Error evaluating puzzle:', error);
      audioFeedback.playWrongSound();
    }
  };

  const handlePuzzleTimeout = async () => {
    if (!user) return;
    
    try {
      await addDoc(collection(db, 'puzzleScores'), {
        puzzleId,
        userId: user.uid,
        userEmail: user.email,
        score: score,
        completed: false,
        timedOut: true,
        elapsedTime: elapsedTime,
        timestamp: new Date(),
        puzzleType: puzzle?.data?.type || puzzle?.type
      });
    } catch (error) {
      console.error('Error saving timeout result:', error);
    }
  };

  const handleCompletePuzzle = async () => {
    setPuzzleCompleted(true);

    if (user) {
      try {
        await addDoc(collection(db, 'puzzleScores'), {
          puzzleId,
          userId: user.uid,
          userEmail: user.email,
          score: score,
          completed: score > 0,
          timedOut: false,
          elapsedTime: elapsedTime,
          timestamp: new Date(),
          puzzleType: puzzle?.data?.type || puzzle?.type,
          evaluation: evaluation
        });
      } catch (error) {
        console.error('Error saving puzzle result:', error);
      }
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (loading) {
    return (
      <SiteLayout>
        <div className={`loader-container ${theme}`}>
          <div className="spinner"></div>
          <p>Loading puzzle...</p>
        </div>
      </SiteLayout>
    );
  }

  if (!puzzle) {
    return (
      <SiteLayout>
        <div className="error-container">
          <p>Puzzle not found.</p>
        </div>
      </SiteLayout>
    );
  }

  const puzzleData = puzzle.data || puzzle;
  const maxScore = puzzleData.maxScore || (puzzleData.type === 'SUDOKU' ? 30 : puzzleData.type === 'CROSSWORD' ? 25 : 15);

  return (
    <SiteLayout>
      <div className={`puzzle-player-container ${theme}`}>
        {!puzzleStarted ? (
          // Start Screen
          <div className="puzzle-intro-screen">
            <div className="puzzle-intro-content">
              <h1>{puzzleData.title || 'Puzzle Challenge'}</h1>
              <div className="puzzle-info">
                <div className="info-item">
                  <span className="label">Type:</span>
                  <span className="value">
                    {puzzleData.type === 'CROSSWORD' ? 'Crossword' :
                     puzzleData.type === 'WORD_SEARCH' ? 'Word Search' :
                     puzzleData.type === 'SUDOKU' ? 'Sudoku' : puzzleData.type}
                  </span>
                </div>
                <div className="info-item">
                  <span className="label">Max Points:</span>
                  <span className="value">{maxScore}</span>
                </div>
                <div className="info-item">
                  <span className="label">Time Limit:</span>
                  <span className="value">10 minutes</span>
                </div>
              </div>
              {puzzleData.description && (
                <p className="puzzle-description">{puzzleData.description}</p>
              )}
              <button 
                className="btn btn-primary btn-large"
                onClick={handleStartPuzzle}
              >
                Start Puzzle
              </button>
            </div>
          </div>
        ) : puzzleCompleted ? (
          // Completion Screen
          <div className="puzzle-complete-screen">
            <div className="completion-content">
              <h1>Puzzle Complete!</h1>
              <div className="score-display">
                <p className="score-value">{score}/{maxScore}</p>
                <p className="score-label">Points</p>
              </div>
              {evaluation && (
                <div className="evaluation-feedback">
                  <p className="feedback-message">{evaluation.feedback}</p>
                  <div className="feedback-details">
                    {evaluation.percentage !== undefined && (
                      <div className="detail-item">
                        <span>Accuracy: {evaluation.percentage}%</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
              <div className="completion-actions">
                <button 
                  className="btn btn-primary"
                  onClick={() => navigate('/puzzles')}
                >
                  Back to Puzzles
                </button>
              </div>
            </div>
          </div>
        ) : (
          // Active Puzzle Screen
          <div className="puzzle-active-screen">
            <div className="puzzle-header">
              <h2>{puzzleData.title || 'Puzzle'}</h2>
              <div className="puzzle-stats">
                <div className="stat time-remaining">
                  <span className="label">Time:</span>
                  <span className="value">{formatTime(timeLeft)}</span>
                </div>
                <div className="stat score-display">
                  <span className="label">Score:</span>
                  <span className="value">{score}/{maxScore}</span>
                </div>
              </div>
            </div>

            <div className="puzzle-content">
              <QuestionRenderer
                question={{
                  ...puzzleData,
                  type: puzzleData.type
                }}
                onAnswer={handleAnswerSelect}
                answered={answered}
                selectedAnswer={selectedAnswer}
                showFeedback={answered}
                theme={theme}
              />
            </div>

            {answered && !puzzleCompleted && (
              <div className="puzzle-actions">
                <button
                  className="btn btn-primary btn-large"
                  onClick={handleCompletePuzzle}
                >
                  Submit & Complete
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
