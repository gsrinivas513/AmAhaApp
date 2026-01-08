import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, getDocs, query, where, addDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import SiteLayout from '../layouts/SiteLayout';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../components/AuthProvider';
import QuestionRenderer from '../quiz/components/QuestionRenderer';
import { audioFeedback } from '../quiz/utils/audioFeedback';

export default function QuizPlayerPage() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { user } = useAuth();
  
  // Get difficulty from URL query parameter
  const searchParams = new URLSearchParams(window.location.search);
  const difficultyParam = searchParams.get('difficulty');

  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quizStarted, setQuizStarted] = useState(!!difficultyParam);
  const [isPaused, setIsPaused] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizTimedOut, setQuizTimedOut] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);
  const [leaderboardByDifficulty, setLeaderboardByDifficulty] = useState({});
  const [reviews, setReviews] = useState([]);
  const [userReview, setUserReview] = useState({ rating: 5, comment: '' });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());
  const [selectedDifficulty, setSelectedDifficulty] = useState(difficultyParam || 'Easy');

  // Helper function to get questions based on variant or fallback to all questions
  const getVariantQuestions = () => {
    if (quiz?.levelVariants && quiz.levelVariants[selectedDifficulty]) {
      return quiz.levelVariants[selectedDifficulty].questions || quiz.questions || [];
    }
    // Fallback: if no levelVariants, return all questions (for backward compatibility)
    return quiz?.questions || [];
  };

  // Get current question from variant or all questions
  const currentQuestionData = getVariantQuestions()[currentQuestion];

  // Load quiz and initialize audio
  useEffect(() => {
    const loadQuiz = async () => {
      try {
        // Initialize audio feedback system
        audioFeedback.initialize();
        
        const quizRef = doc(db, 'quizzes', quizId);
        const quizSnap = await getDoc(quizRef);

        if (!quizSnap.exists()) {
          alert('Quiz not found!');
          navigate('/quiz');
          return;
        }

        setQuiz(quizSnap.data());
        loadLeaderboardByDifficulty(quizId);
        loadReviews(quizId);
        
        // Auto-start if difficulty param is provided
        if (difficultyParam) {
          setQuizStarted(true);
        }
      } catch (error) {
        console.error('Error loading quiz:', error);
        navigate('/quiz');
      } finally {
        setLoading(false);
      }
    };

    loadQuiz();
  }, [quizId, navigate, difficultyParam]);

  const loadLeaderboardByDifficulty = async (id) => {
    try {
      const scoresRef = collection(db, 'quizScores');
      const q = query(scoresRef, where('quizId', '==', id));
      const snapshot = await getDocs(q);
      
      const allScores = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
      }));

      const byDifficulty = {};
      allScores.forEach(score => {
        const diff = score.difficulty || 'Easy';
        if (!byDifficulty[diff]) byDifficulty[diff] = [];
        byDifficulty[diff].push(score);
      });

      // Deduplicate: keep only the best score per user per difficulty
      Object.keys(byDifficulty).forEach(diff => {
        const userBestScores = {};
        byDifficulty[diff].forEach(score => {
          const userId = score.userId;
          if (!userBestScores[userId] || score.score > userBestScores[userId].score || 
              (score.score === userBestScores[userId].score && score.timeSpent < userBestScores[userId].timeSpent)) {
            userBestScores[userId] = score;
          }
        });
        
        // Convert back to array and sort
        byDifficulty[diff] = Object.values(userBestScores).sort((a, b) => {
          if (b.score !== a.score) return b.score - a.score;
          return a.timeSpent - b.timeSpent;
        });
      });

      setLeaderboardByDifficulty(byDifficulty);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    }
  };

  const loadReviews = async (id) => {
    try {
      const reviewsRef = collection(db, 'quizReviews');
      const q = query(reviewsRef, where('quizId', '==', id));
      const snapshot = await getDocs(q);
      
      const reviewsData = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
      })).sort((a, b) => b.rating - a.rating).slice(0, 10);
      
      setReviews(reviewsData);
    } catch (error) {
      console.error('Error loading reviews:', error);
    }
  };

  // Timer effect
  useEffect(() => {
    if (!quizStarted || quizCompleted || quizTimedOut || isPaused) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setQuizTimedOut(true);
          return 0;
        }
        return prev - 1;
      });
      
      if (startTime) {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [quizStarted, quizCompleted, quizTimedOut, isPaused, timeLeft, startTime]);

  const handleAnswerSelect = (answerData) => {
    if (answered) return;

    // Handle both simple index (backward compat) and complex answer objects
    const optionIndex = typeof answerData === 'number' ? answerData : answerData?.index;
    
    setSelectedAnswer(answerData);
    setAnswered(true);

    const variantQuestions = getVariantQuestions();
    const question = variantQuestions[currentQuestion];
    
    let isCorrect = false;
    
    // Check answer based on question type
    if (question.type === 'true-false' || question.type === 'multiple-choice') {
      isCorrect = optionIndex === question.correctAnswer;
    } else if (question.type === 'fill-blank') {
      const userAnswer = typeof answerData === 'string' ? answerData : answerData?.answer;
      // Handle both 'correctAnswers' (array) and 'answer' (string or array) formats
      let correctAnswersArray = [];
      if (Array.isArray(question.correctAnswers)) {
        correctAnswersArray = question.correctAnswers;
      } else if (Array.isArray(question.answer)) {
        correctAnswersArray = question.answer;
      } else if (question.answer) {
        correctAnswersArray = [question.answer];
      } else if (question.correctAnswers) {
        correctAnswersArray = [question.correctAnswers];
      }
      isCorrect = correctAnswersArray.some(ans => 
        ans && userAnswer && ans.toLowerCase().trim() === userAnswer.toLowerCase().trim()
      );
    } else if (question.type === 'matching') {
      isCorrect = JSON.stringify(answerData?.pairs) === JSON.stringify(question.correctPairs);
    } else if (question.type === 'ordering') {
      isCorrect = JSON.stringify(answerData?.order) === JSON.stringify(question.correctOrder);
    } else if (question.type === 'image-select') {
      isCorrect = JSON.stringify(answerData?.selected) === JSON.stringify(question.correctImages);
    } else if (question.type === 'multi-select') {
      isCorrect = JSON.stringify(answerData?.selected?.sort()) === JSON.stringify(question.correctAnswers?.sort());
    } else if (question.type === 'drag-drop') {
      isCorrect = JSON.stringify(answerData?.placements) === JSON.stringify(question.correctPlacements);
    }
    
    // Play audio feedback
    if (isCorrect) {
      audioFeedback.playCorrectSound();
      setScore(score + 1);
    } else {
      audioFeedback.playWrongSound();
    }
  };

  const handleNextQuestion = () => {
    const variantQuestions = getVariantQuestions();
    if (currentQuestion < variantQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setAnswered(false);
      setSelectedAnswer(null);
    } else {
      handleQuizComplete();
    }
  };

  const handleStartQuiz = () => {
    setQuizStarted(true);
    setStartTime(Date.now());
    
    if (quiz.avgTime) {
      const minutes = parseInt(quiz.avgTime);
      setTimeLeft(minutes * 60);
    } else {
      setTimeLeft(3600);
    }
  };

  const handleQuizComplete = async () => {
    setQuizCompleted(true);
    const finalScore = score;
    const finalTime = elapsedTime;
    
    // Play completion sound
    audioFeedback.playCompletionSound();

    if (user) {
      try {
        await addDoc(collection(db, 'quizScores'), {
          quizId: quizId,
          userId: user.uid,
          userName: user.displayName || user.email,
          userEmail: user.email,
          score: finalScore,
          totalQuestions: quiz?.questions?.length || 0,
          timeSpent: finalTime,
          createdAt: new Date().toISOString(),
          difficulty: selectedDifficulty,
        });
        
        loadLeaderboardByDifficulty(quizId);
      } catch (error) {
        console.error('Error saving score:', error);
      }
    }
  };

  const handleSubmitReview = async () => {
    if (!userReview.comment.trim()) {
      alert('Please write a review comment');
      return;
    }

    try {
      const reviewData = {
        quizId: quizId,
        userId: user?.uid || 'anonymous',
        userName: user?.displayName || 'Anonymous',
        rating: userReview.rating,
        comment: userReview.comment,
        createdAt: new Date().toISOString(),
      };

      await addDoc(collection(db, 'quizReviews'), reviewData);
      
      alert('✅ Review submitted successfully!');
      setUserReview({ rating: 5, comment: '' });
      setShowReviewForm(false);
      
      loadReviews(quizId);
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Error submitting review');
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTimeWithMilliseconds = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const milliseconds = Math.floor((seconds % 1) * 1000);
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
  };

  if (loading) {
    return (
      <SiteLayout>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          color: theme.textPrimary,
          fontSize: '18px',
        }}>
          Loading quiz...
        </div>
      </SiteLayout>
    );
  }

  if (!quiz) {
    return (
      <SiteLayout>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          color: theme.textSecondary,
        }}>
          Quiz not found. <a href="/quiz" style={{ color: theme.accentPrimary }}>Go back to quizzes</a>
        </div>
      </SiteLayout>
    );
  }

  // Playing quiz - show question
  if (quizStarted && !quizCompleted && !quizTimedOut) {
    const variantQuestions = getVariantQuestions();
    
    // Safety check: ensure we have questions and current question data
    if (!variantQuestions || variantQuestions.length === 0 || !currentQuestionData) {
      return (
        <SiteLayout>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            color: theme.textSecondary,
          }}>
            Loading quiz questions...
          </div>
        </SiteLayout>
      );
    }

    return (
      <SiteLayout>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 20px' }}>
          {/* Breadcrumb Navigation */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '32px',
            color: theme.textSecondary,
            fontSize: '14px',
          }}>
            <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: theme.accentPrimary, cursor: 'pointer' }}>Home</button>
            <span>›</span>
            <button onClick={() => navigate('/quiz')} style={{ background: 'none', border: 'none', color: theme.accentPrimary, cursor: 'pointer' }}>Quizzes</button>
            <span>›</span>
            <span style={{ color: theme.textPrimary }}>{quiz.title}</span>
          </div>

          {/* Title */}
          <div style={{
            marginBottom: '24px',
          }}>
            <h1 style={{
              color: theme.textPrimary,
              fontSize: '48px',
              fontWeight: '700',
              marginBottom: '8px',
              margin: '0 0 8px 0',
            }}>
              {quiz.title}
            </h1>
            <p style={{
              color: theme.textSecondary,
              fontSize: '18px',
              marginBottom: '0',
              margin: '0',
            }}>
            </p>
          </div>

          {/* TWO COLUMN LAYOUT: Quiz Playing (LEFT) + Variant Cards (RIGHT) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 280px',
            gap: '40px',
            marginBottom: '48px',
          }}>
            {/* LEFT: Quiz Playing Area */}
            <div>
              {/* Progress Bar + Timer */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                marginBottom: '24px',
              }}>
                <div style={{
                  flex: 1,
                  background: theme.border,
                  height: '6px',
                  borderRadius: '4px',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    background: `linear-gradient(90deg, ${theme.accentPrimary}, ${theme.accentSecondary})`,
                    height: '100%',
                    width: `${((currentQuestion + 1) / getVariantQuestions().length) * 100}%`,
                    transition: 'width 0.3s ease',
                }} />
                </div>
                <div style={{
                  background: timeLeft < 60 ? 'linear-gradient(135deg, #FF6B6B, #EF4444)' : `linear-gradient(135deg, ${theme.accentPrimary}, ${theme.accentSecondary})`,
                  padding: '8px 16px',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: '700',
                  whiteSpace: 'nowrap',
                  boxShadow: timeLeft < 60 ? '0 4px 12px rgba(255, 107, 107, 0.3)' : `0 4px 12px ${theme.accentPrimary}20`,
                }}>
                  ⏱️ {formatTime(timeLeft || 0)}
                </div>
                <button onClick={() => setIsPaused(!isPaused)} style={{
                  background: isPaused ? `linear-gradient(135deg, #4ADE80, #22C55E)` : `linear-gradient(135deg, ${theme.accentPrimary}, ${theme.accentSecondary})`,
                  color: '#fff',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  boxShadow: `0 4px 12px ${theme.accentPrimary}20`,
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}>
                  {isPaused ? '▶️ Resume' : '⏸️ Pause'}
                </button>
              </div>

              {/* Question Card */}
              <div style={{
                background: theme.surfacePrimary,
                border: `2px solid ${theme.accentPrimary}30`,
                borderRadius: '16px',
                padding: '32px',
                marginBottom: '24px',
                boxShadow: `0 12px 32px ${theme.accentPrimary}15`,
                transition: 'all 0.3s ease',
              }}>
                {/* Use QuestionRenderer for all question types */}
                <QuestionRenderer
                  question={currentQuestionData}
                  questionNumber={currentQuestion + 1}
                  totalQuestions={getVariantQuestions().length}
                  onAnswer={handleAnswerSelect}
                  answered={answered}
                  selectedAnswer={selectedAnswer}
                  showFeedback={answered}
                  theme={theme}
                  difficulty={selectedDifficulty}
                />

                {answered && (
                  <div style={{ textAlign: 'center', marginTop: '24px' }}>
                    <button
                      onClick={handleNextQuestion}
                      style={{
                        padding: '12px 32px',
                        background: `linear-gradient(135deg, ${theme.accentPrimary}, ${theme.accentSecondary})`,
                        color: '#fff',
                        border: 'none',
                        borderRadius: '10px',
                        fontSize: '14px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {currentQuestion === (quiz?.questions?.length || 0) - 1 ? 'See Results' : 'Next Question →'}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT: Variant Cards */}
            <div>
              <h2 style={{
                color: theme.textPrimary,
                fontSize: '16px',
                fontWeight: '700',
                marginBottom: '8px',
                margin: '0 0 8px 0',
              }}>
                Change Variant
              </h2>
              <p style={{
                color: theme.textSecondary,
                fontSize: '13px',
                marginBottom: '20px',
                margin: '0 0 20px 0',
              }}>
                Select the difficulty level
              </p>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr',
                gap: '10px',
                marginBottom: '24px',
              }}>
                {['Easy', 'Medium', 'Hard', 'Expert'].map(difficulty => (
                  <button
                    key={difficulty}
                    onClick={() => {
                      setSelectedDifficulty(difficulty);
                      setCurrentQuestion(0);
                      setScore(0);
                      setAnswered(false);
                      setSelectedAnswer(null);
                      setQuizCompleted(false);
                      setTimeLeft(300);
                      setStartTime(Date.now());
                    }}
                    style={{
                      padding: '14px 12px',
                      background: selectedDifficulty === difficulty ? `linear-gradient(135deg, ${theme.accentPrimary}30, ${theme.accentSecondary}20)` : theme.surfacePrimary,
                      color: theme.textPrimary,
                      border: `2px solid ${selectedDifficulty === difficulty ? theme.accentPrimary : theme.border}`,
                      borderRadius: '12px',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      textAlign: 'center',
                    }}
                    onMouseOver={(e) => {
                      if (selectedDifficulty !== difficulty) {
                        e.currentTarget.style.borderColor = theme.accentPrimary;
                        e.currentTarget.style.background = theme.accentPrimary + '10';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (selectedDifficulty !== difficulty) {
                        e.currentTarget.style.borderColor = theme.border;
                        e.currentTarget.style.background = theme.surfacePrimary;
                      }
                    }}
                  >
                    {difficulty} ({quiz?.levelVariants?.[difficulty]?.questionCount || quiz?.questions?.length || 0}Q)
                  </button>
                ))}
              </div>

              {/* Pro Tip Section */}
              <div style={{
                background: `linear-gradient(135deg, ${theme.accentPrimary}10, ${theme.accentSecondary}05)`,
                border: `1px solid ${theme.accentPrimary}30`,
                borderRadius: '12px',
                padding: '16px',
              }}>
                <h3 style={{
                  color: theme.accentPrimary,
                  fontSize: '13px',
                  fontWeight: '700',
                  marginBottom: '8px',
                  margin: '0 0 8px 0',
                }}>
                  💡 Pro Tip
                </h3>
                <p style={{
                  color: theme.textSecondary,
                  fontSize: '12px',
                  lineHeight: '1.5',
                  marginBottom: '0',
                  margin: '0',
                }}>
                  Start with fewer pieces if you're new to puzzles. You can always try harder variants later!
                </p>
              </div>
            </div>
          </div>

          {/* LEADERBOARDS AND REVIEWS - SINGLE COLUMN (PLAYING STATE) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '40px',
          }}>
            {/* Leaderboards */}
            <div>
              <h2 style={{
                color: theme.textPrimary,
                fontSize: '28px',
                fontWeight: '700',
                marginBottom: '8px',
              }}>
                🏆 Leaderboards
              </h2>
              <p style={{
                color: theme.textSecondary,
                fontSize: '16px',
                marginBottom: '32px',
              }}>
                See how you compare to others
              </p>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '24px',
              }}>
                {['Easy', 'Medium', 'Hard', 'Expert'].map(difficulty => (
                  <div key={difficulty} style={{ marginBottom: '0' }}>
                    <h3 style={{
                      color: theme.textPrimary,
                      fontSize: '13px',
                      fontWeight: '600',
                      marginBottom: '12px',
                      paddingBottom: '8px',
                      borderBottom: `1px solid ${theme.border}`,
                    }}>
                      {difficulty}
                    </h3>

                    {leaderboardByDifficulty[difficulty] && leaderboardByDifficulty[difficulty].length > 0 ? (
                      <div style={{
                        display: 'grid',
                        gap: '6px',
                      }}>
                        {leaderboardByDifficulty[difficulty].slice(0, 3).map((entry, index) => (
                          <div
                            key={entry.id}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '8px',
                              background: index === 0 ? `${theme.accentPrimary}15` : theme.background,
                              border: `1px solid ${theme.border}`,
                              borderRadius: '4px',
                              fontSize: '11px',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1 }}>
                              <div style={{
                                width: '20px',
                                height: '20px',
                                borderRadius: '50%',
                                background: theme.accentPrimary,
                                color: '#fff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: '700',
                                fontSize: '10px',
                                minWidth: '20px',
                              }}>
                                {index + 1}
                              </div>
                              <div style={{
                                color: theme.textPrimary,
                                fontWeight: '600',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                fontSize: '10px',
                              }}>
                                {entry.userName}
                              </div>
                            </div>
                            <div style={{
                              color: theme.accentPrimary,
                              fontWeight: '700',
                              fontSize: '10px',
                            }}>
                              {formatTimeWithMilliseconds(entry.timeSpent)}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{
                        color: theme.textSecondary,
                        fontSize: '10px',
                        textAlign: 'center',
                        padding: '8px 0',
                      }}>
                        No scores
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div>
              <h2 style={{
                color: theme.textPrimary,
                fontSize: '28px',
                fontWeight: '700',
                marginBottom: '8px',
              }}>
                ⭐ Reviews
              </h2>
              <p style={{
                color: theme.textSecondary,
                fontSize: '16px',
                marginBottom: '32px',
              }}>
                What players are saying about this puzzle
              </p>

              <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                <button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  style={{
                    padding: '10px 20px',
                    background: theme.accentPrimary,
                    color: '#fff',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  {showReviewForm ? 'Cancel' : '✍️ Write Review'}
                </button>
              </div>

              {/* Review Form */}
              {showReviewForm && (
                <div style={{
                  background: theme.background,
                  border: `2px solid ${theme.border}`,
                  borderRadius: '12px',
                  padding: '20px',
                  marginBottom: '24px',
                }}>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', color: theme.textPrimary, fontWeight: '600' }}>
                      Rating
                    </label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {[1, 2, 3, 4, 5].map(r => (
                        <button
                          key={r}
                          onClick={() => setUserReview({ ...userReview, rating: r })}
                          style={{
                            fontSize: '28px',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            opacity: userReview.rating >= r ? 1 : 0.3,
                          }}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', color: theme.textPrimary, fontWeight: '600' }}>
                      Comment
                    </label>
                    <textarea
                      value={userReview.comment}
                      onChange={(e) => setUserReview({ ...userReview, comment: e.currentTarget.value })}
                      placeholder="Share your thoughts about this quiz..."
                      style={{
                        width: '100%',
                        padding: '12px',
                        background: theme.surfacePrimary,
                        border: `1px solid ${theme.border}`,
                        borderRadius: '12px',
                        color: theme.textPrimary,
                        fontSize: '14px',
                        minHeight: '100px',
                        fontFamily: 'inherit',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  <button
                    onClick={handleSubmitReview}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: theme.accentPrimary,
                      color: '#fff',
                      border: 'none',
                      borderRadius: '12px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                    }}
                  >
                    Submit Review
                  </button>
                </div>
              )}

              {/* Reviews List */}
              {reviews.length > 0 ? (
                <div style={{ display: 'grid', gap: '12px' }}>
                  {reviews.map((review) => (
                    <div
                      key={review.id}
                      style={{
                        background: theme.background,
                        border: `1px solid ${theme.border}`,
                        borderRadius: '12px',
                        padding: '16px',
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'start',
                        marginBottom: '8px',
                      }}>
                        <div>
                          <div style={{ color: theme.textPrimary, fontWeight: '600', fontSize: '13px' }}>
                            {review.userName}
                          </div>
                          <div style={{ color: theme.textSecondary, fontSize: '11px' }}>
                            {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                          </div>
                        </div>
                        <div style={{ color: theme.textSecondary, fontSize: '11px' }}>
                          {new Date(review.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <p style={{
                        color: theme.textPrimary,
                        fontSize: '13px',
                        margin: '0',
                        lineHeight: '1.5',
                      }}>
                        {review.comment}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ color: theme.textSecondary, textAlign: 'center', padding: '32px 0' }}>
                  No reviews yet. Be the first to review!
                </div>
              )}
            </div>
          </div>
        </div>
      </SiteLayout>
    );
  }

  // Quiz timed out screen - keep same layout as playing state
  if (quizStarted && quizTimedOut && !quizCompleted) {
    return (
      <SiteLayout>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 20px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '32px',
            color: theme.textSecondary,
            fontSize: '14px',
          }}>
            <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: theme.accentPrimary, cursor: 'pointer' }}>Home</button>
            <span>›</span>
            <button onClick={() => navigate('/quiz')} style={{ background: 'none', border: 'none', color: theme.accentPrimary, cursor: 'pointer' }}>Quizzes</button>
            <span>›</span>
            <span style={{ color: theme.textPrimary }}>{quiz.title}</span>
          </div>

          {/* Title */}
          <div style={{
            marginBottom: '24px',
          }}>
            <h1 style={{
              color: theme.textPrimary,
              fontSize: '48px',
              fontWeight: '700',
              marginBottom: '8px',
              margin: '0 0 8px 0',
            }}>
              {quiz.title}
            </h1>
            <p style={{
              color: '#FF6B6B',
              fontSize: '18px',
              marginBottom: '0',
              margin: '0',
            }}>
              Time's up! You answered {currentQuestion} of {quiz?.questions?.length || 0} questions.
            </p>
          </div>

          {/* Progress Bar + Timer */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '24px',
          }}>
            <div style={{
              flex: 1,
              background: theme.border,
              height: '6px',
              borderRadius: '4px',
              overflow: 'hidden',
            }}>
              <div style={{
                background: `linear-gradient(90deg, #FF6B6B, #EF4444)`,
                height: '100%',
                width: `${((currentQuestion) / quiz?.questions?.length || 0) * 100}%`,
                transition: 'width 0.3s ease',
              }} />
            </div>
            <div style={{
              background: 'linear-gradient(135deg, #FF6B6B, #EF4444)',
              padding: '8px 16px',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '14px',
              fontWeight: '700',
              whiteSpace: 'nowrap',
              boxShadow: '0 4px 12px rgba(255, 107, 107, 0.3)',
            }}>
              ⏱️ 0:00
            </div>
          </div>

          {/* TWO COLUMN LAYOUT: Message (LEFT) + Variant Cards (RIGHT) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 280px',
            gap: '40px',
            marginBottom: '48px',
          }}>
            <div>
              <div style={{
                background: theme.surfacePrimary,
                border: `2px solid #FF6B6B30`,
                borderRadius: '16px',
                padding: '32px',
                marginBottom: '24px',
                boxShadow: `0 12px 32px #FF6B6B15`,
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px', textAlign: 'center' }}>
                  ⏱️
                </div>
                <h2 style={{
                  color: theme.textPrimary,
                  fontSize: '24px',
                  fontWeight: '700',
                  marginBottom: '16px',
                  textAlign: 'center',
                }}>
                  Time's Up!
                </h2>
                <p style={{
                  color: theme.textSecondary,
                  fontSize: '15px',
                  lineHeight: '1.6',
                  marginBottom: '24px',
                  textAlign: 'center',
                }}>
                  You answered {currentQuestion} out of {quiz?.questions?.length || 0} questions and scored {score} correct. Try again with a different difficulty level!
                </p>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => navigate('/quiz')}
                    style={{
                      padding: '12px 32px',
                      background: theme.accentPrimary,
                      color: '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = `0 8px 16px ${theme.accentPrimary}30`;
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    Back to Quizzes
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT: Variant Cards (Same as Playing State) */}
            <div>
              <h2 style={{
                color: theme.textPrimary,
                fontSize: '16px',
                fontWeight: '700',
                marginBottom: '8px',
                margin: '0 0 8px 0',
              }}>
                Change Variant
              </h2>
              <p style={{
                color: theme.textSecondary,
                fontSize: '13px',
                marginBottom: '20px',
                margin: '0 0 20px 0',
              }}>
                Select the difficulty level
              </p>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr',
                gap: '10px',
                marginBottom: '24px',
              }}>
                {['Easy', 'Medium', 'Hard', 'Expert'].map(difficulty => (
                  <button
                    key={difficulty}
                    onClick={() => {
                      setSelectedDifficulty(difficulty);
                      setCurrentQuestion(0);
                      setScore(0);
                      setAnswered(false);
                      setSelectedAnswer(null);
                      setQuizCompleted(false);
                      setQuizTimedOut(false);
                      setTimeLeft(300);
                      setStartTime(Date.now());
                      setQuizStarted(true);
                    }}
                    style={{
                      padding: '14px 12px',
                      background: selectedDifficulty === difficulty ? `linear-gradient(135deg, ${theme.accentPrimary}30, ${theme.accentSecondary}20)` : theme.surfacePrimary,
                      color: theme.textPrimary,
                      border: `2px solid ${selectedDifficulty === difficulty ? theme.accentPrimary : theme.border}`,
                      borderRadius: '12px',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      textAlign: 'center',
                    }}
                    onMouseOver={(e) => {
                      if (selectedDifficulty !== difficulty) {
                        e.currentTarget.style.borderColor = theme.accentPrimary;
                        e.currentTarget.style.background = theme.accentPrimary + '10';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (selectedDifficulty !== difficulty) {
                        e.currentTarget.style.borderColor = theme.border;
                        e.currentTarget.style.background = theme.surfacePrimary;
                      }
                    }}
                  >
                    {difficulty} ({quiz?.levelVariants?.[difficulty]?.questionCount || quiz?.questions?.length || 0}Q)
                  </button>
                ))}
              </div>

              {/* Pro Tip Section */}
              <div style={{
                background: `linear-gradient(135deg, ${theme.accentPrimary}10, ${theme.accentSecondary}05)`,
                border: `1px solid ${theme.accentPrimary}30`,
                borderRadius: '12px',
                padding: '16px',
              }}>
                <h3 style={{
                  color: theme.accentPrimary,
                  fontSize: '13px',
                  fontWeight: '700',
                  marginBottom: '8px',
                  margin: '0 0 8px 0',
                }}>
                  💡 Pro Tip
                </h3>
                <p style={{
                  color: theme.textSecondary,
                  fontSize: '12px',
                  lineHeight: '1.5',
                  marginBottom: '0',
                  margin: '0',
                }}>
                  Start with fewer pieces if you're new to puzzles. You can always try harder variants later!
                </p>
              </div>
            </div>
          </div>

          {/* LEADERBOARDS AND REVIEWS - SINGLE COLUMN */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '40px',
          }}>
            {/* Leaderboards */}
            <div>
              <h2 style={{
                color: theme.textPrimary,
                fontSize: '28px',
                fontWeight: '700',
                marginBottom: '8px',
              }}>
                🏆 Leaderboards
              </h2>
              <p style={{
                color: theme.textSecondary,
                fontSize: '16px',
                marginBottom: '32px',
              }}>
                See how you compare to others
              </p>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '24px',
              }}>
                {['Easy', 'Medium', 'Hard', 'Expert'].map(difficulty => (
                  <div key={difficulty} style={{ marginBottom: '0' }}>
                    <h3 style={{
                      color: theme.textPrimary,
                      fontSize: '13px',
                      fontWeight: '600',
                      marginBottom: '12px',
                      paddingBottom: '8px',
                      borderBottom: `1px solid ${theme.border}`,
                    }}>
                      {difficulty}
                    </h3>

                    {leaderboardByDifficulty[difficulty] && leaderboardByDifficulty[difficulty].length > 0 ? (
                      <div style={{
                        display: 'grid',
                        gap: '6px',
                      }}>
                        {leaderboardByDifficulty[difficulty].slice(0, 3).map((entry, index) => (
                          <div
                            key={entry.id}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '8px 12px',
                              background: theme.surfacePrimary,
                              borderRadius: '8px',
                              border: `1px solid ${theme.border}`,
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{
                                color: theme.textSecondary,
                                fontSize: '12px',
                                fontWeight: '600',
                                minWidth: '20px',
                              }}>
                                #{index + 1}
                              </span>
                              <span style={{
                                color: theme.textPrimary,
                                fontSize: '12px',
                                fontWeight: '500',
                              }}>
                                {entry.userName}
                              </span>
                            </div>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                            }}>
                              <span style={{
                                color: theme.accentPrimary,
                                fontSize: '12px',
                                fontWeight: '700',
                              }}>
                                {entry.score}/{entry.totalQuestions}
                              </span>
                              <span style={{
                                color: theme.textSecondary,
                                fontSize: '11px',
                              }}>
                                {formatTimeWithMilliseconds(entry.timeSpent)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{ color: theme.textSecondary, fontSize: '12px', textAlign: 'center' }}>
                        No scores yet
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div>
              <h2 style={{
                color: theme.textPrimary,
                fontSize: '28px',
                fontWeight: '700',
                marginBottom: '8px',
              }}>
                ⭐ Reviews
              </h2>
              <p style={{
                color: theme.textSecondary,
                fontSize: '16px',
                marginBottom: '32px',
              }}>
                See what others think
              </p>

              {reviews && reviews.length > 0 ? (
                <div style={{
                  display: 'grid',
                  gap: '16px',
                }}>
                  {reviews.map(review => (
                    <div
                      key={review.id}
                      style={{
                        background: theme.surfacePrimary,
                        border: `1px solid ${theme.border}`,
                        borderRadius: '12px',
                        padding: '16px',
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'start',
                        marginBottom: '12px',
                      }}>
                        <div>
                          <p style={{
                            color: theme.textPrimary,
                            fontSize: '13px',
                            fontWeight: '600',
                            margin: '0',
                          }}>
                            {review.userName}
                          </p>
                          <p style={{
                            color: theme.textSecondary,
                            fontSize: '12px',
                            margin: '0',
                          }}>
                            {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span style={{
                          color: '#FFB800',
                          fontSize: '12px',
                        }}>
                          {'⭐'.repeat(review.rating)}
                        </span>
                      </div>
                      <p style={{
                        color: theme.textPrimary,
                        fontSize: '13px',
                        margin: '0',
                        lineHeight: '1.5',
                      }}>
                        {review.comment}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ color: theme.textSecondary, textAlign: 'center', padding: '32px 0' }}>
                  No reviews yet. Be the first to review!
                </div>
              )}
            </div>
          </div>
        </div>
      </SiteLayout>
    );
  }

  // Results screen - same layout as playing
  if (quizCompleted) {
    const percentage = Math.round((score / quiz?.questions?.length || 0) * 100);
    const passed = percentage >= 70;

    return (
      <SiteLayout>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 20px' }}>
          {/* Breadcrumb Navigation */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '32px',
            color: theme.textSecondary,
            fontSize: '14px',
          }}>
            <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: theme.accentPrimary, cursor: 'pointer' }}>Home</button>
            <span>›</span>
            <button onClick={() => navigate('/quiz')} style={{ background: 'none', border: 'none', color: theme.accentPrimary, cursor: 'pointer' }}>Quizzes</button>
            <span>›</span>
            <span style={{ color: theme.textPrimary }}>{quiz.title}</span>
          </div>

          {/* Title and Score Summary */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '40px',
          }}>
            <div>
              <h1 style={{
                color: theme.textPrimary,
                fontSize: '48px',
                fontWeight: '700',
                marginBottom: '8px',
                margin: '0 0 8px 0',
              }}>
                {quiz.title}
              </h1>
              <p style={{
                color: theme.textSecondary,
                fontSize: '18px',
                marginBottom: '0',
                margin: '0',
              }}>
                Quiz Completed!
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '56px', fontWeight: '700', color: passed ? '#4ECB71' : '#FFB627', marginBottom: '8px' }}>
                {score}/{quiz?.questions?.length || 0}
              </div>
              <div style={{ fontSize: '16px', color: theme.textSecondary, fontWeight: '600' }}>
                {percentage}%
              </div>
            </div>
          </div>

          {/* TWO COLUMN LAYOUT: Results (LEFT) + Variant Cards (RIGHT) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 280px',
            gap: '40px',
            marginBottom: '48px',
          }}>
            {/* LEFT: Results Summary */}
            <div>
              <div style={{
                background: theme.surfacePrimary,
                border: `2px solid ${theme.border}`,
                borderRadius: '16px',
                padding: '40px',
                textAlign: 'center',
                marginBottom: '24px',
              }}>
                <div style={{ fontSize: '60px', marginBottom: '16px' }}>
                  {passed ? '🎉' : '📚'}
                </div>
                <h2 style={{
                  color: theme.textPrimary,
                  fontSize: '28px',
                  fontWeight: '700',
                  marginBottom: '24px',
                }}>
                  {passed ? 'Excellent Performance!' : 'Quiz Completed'}
                </h2>
                <p style={{
                  color: theme.textSecondary,
                  fontSize: '16px',
                  lineHeight: '1.6',
                  marginBottom: '32px',
                }}>
                  {passed
                    ? `You've scored ${percentage}% on this quiz. Great job!`
                    : `You've completed the quiz with ${percentage}%. Keep practicing to improve!`}
                </p>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => navigate('/quiz')}
                    style={{
                      padding: '12px 32px',
                      background: theme.accentPrimary,
                      color: '#fff',
                      border: 'none',
                      borderRadius: '12px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Back to Quizzes
                  </button>
                  <button
                    onClick={() => {
                      setCurrentQuestion(0);
                      setScore(0);
                      setAnswered(false);
                      setSelectedAnswer(null);
                      setQuizCompleted(false);
                      setQuizStarted(false);
                      setElapsedTime(0);
                      setStartTime(null);
                      setTimeLeft(null);
                    }}
                    style={{
                      padding: '12px 32px',
                      background: theme.accentSecondary,
                      color: '#fff',
                      border: 'none',
                      borderRadius: '12px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Retake Quiz
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT: Variant Cards */}
            <div>
              <h2 style={{
                color: theme.textPrimary,
                fontSize: '16px',
                fontWeight: '700',
                marginBottom: '20px',
                margin: '0 0 20px 0',
              }}>
                Try Another
              </h2>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '10px',
              }}>
                {['Easy', 'Medium', 'Hard', 'Expert'].map(difficulty => (
                  <button
                    key={difficulty}
                    onClick={() => {
                      setSelectedDifficulty(difficulty);
                      setCurrentQuestion(0);
                      setScore(0);
                      setAnswered(false);
                      setSelectedAnswer(null);
                      setQuizCompleted(false);
                      setQuizStarted(true);
                      setTimeLeft(300);
                      setStartTime(Date.now());
                    }}
                    style={{
                      padding: '14px 12px',
                      background: selectedDifficulty === difficulty ? `linear-gradient(135deg, ${theme.accentPrimary}30, ${theme.accentSecondary}20)` : theme.surfacePrimary,
                      color: theme.textPrimary,
                      border: `2px solid ${selectedDifficulty === difficulty ? theme.accentPrimary : theme.border}`,
                      borderRadius: '12px',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      textAlign: 'center',
                    }}
                    onMouseOver={(e) => {
                      if (selectedDifficulty !== difficulty) {
                        e.currentTarget.style.borderColor = theme.accentPrimary;
                        e.currentTarget.style.background = theme.accentPrimary + '10';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (selectedDifficulty !== difficulty) {
                        e.currentTarget.style.borderColor = theme.border;
                        e.currentTarget.style.background = theme.surfacePrimary;
                      }
                    }}
                  >
                    <div style={{ fontWeight: '700', marginBottom: '2px' }}>
                      {difficulty}
                    </div>
                    <div style={{ fontSize: '11px', opacity: 0.7 }}>
                      {quiz?.levelVariants?.[difficulty]?.questionCount || quiz?.questions?.length || 0}Q
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* LEADERBOARDS AND REVIEWS - SINGLE COLUMN (COMPLETED STATE) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '40px',
          }}>
            {/* Leaderboards */}
            <div>
              <h2 style={{
                color: theme.textPrimary,
                fontSize: '28px',
                fontWeight: '700',
                marginBottom: '8px',
              }}>
                🏆 Leaderboards
              </h2>
              <p style={{
                color: theme.textSecondary,
                fontSize: '16px',
                marginBottom: '32px',
              }}>
                See how you compare to others
              </p>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '24px',
              }}>
                {['Easy', 'Medium', 'Hard', 'Expert'].map(difficulty => (
                  <div key={difficulty} style={{ marginBottom: '0' }}>
                    <h3 style={{
                      color: theme.textPrimary,
                      fontSize: '13px',
                      fontWeight: '600',
                      marginBottom: '12px',
                      paddingBottom: '8px',
                      borderBottom: `1px solid ${theme.border}`,
                    }}>
                      {difficulty}
                    </h3>

                    {leaderboardByDifficulty[difficulty] && leaderboardByDifficulty[difficulty].length > 0 ? (
                      <div style={{
                        display: 'grid',
                        gap: '6px',
                      }}>
                        {leaderboardByDifficulty[difficulty].slice(0, 3).map((entry, index) => (
                          <div
                            key={entry.id}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '8px',
                              background: index === 0 ? `${theme.accentPrimary}15` : theme.background,
                              border: `1px solid ${theme.border}`,
                              borderRadius: '4px',
                              fontSize: '11px',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1 }}>
                              <div style={{
                                width: '20px',
                                height: '20px',
                                borderRadius: '50%',
                                background: theme.accentPrimary,
                                color: '#fff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: '700',
                                fontSize: '10px',
                                minWidth: '20px',
                              }}>
                                {index + 1}
                              </div>
                              <div style={{
                                color: theme.textPrimary,
                                fontWeight: '600',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                fontSize: '10px',
                              }}>
                                {entry.userName}
                              </div>
                            </div>
                            <div style={{
                              color: theme.accentPrimary,
                              fontWeight: '700',
                              fontSize: '10px',
                            }}>
                              {formatTimeWithMilliseconds(entry.timeSpent)}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{
                        color: theme.textSecondary,
                        fontSize: '10px',
                        textAlign: 'center',
                        padding: '8px 0',
                      }}>
                        No scores
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div>
              <h2 style={{
                color: theme.textPrimary,
                fontSize: '28px',
                fontWeight: '700',
                marginBottom: '8px',
              }}>
                ⭐ Reviews
              </h2>
              <p style={{
                color: theme.textSecondary,
                fontSize: '16px',
                marginBottom: '32px',
              }}>
                What players are saying about this puzzle
              </p>

              <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                <button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  style={{
                    padding: '10px 20px',
                    background: theme.accentPrimary,
                    color: '#fff',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  {showReviewForm ? 'Cancel' : '✍️ Write Review'}
                </button>
              </div>

              {/* Review Form */}
              {showReviewForm && (
                <div style={{
                  background: theme.background,
                  border: `2px solid ${theme.border}`,
                  borderRadius: '12px',
                  padding: '20px',
                  marginBottom: '24px',
                }}>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', color: theme.textPrimary, fontWeight: '600' }}>
                      Rating
                    </label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {[1, 2, 3, 4, 5].map(r => (
                        <button
                          key={r}
                          onClick={() => setUserReview({ ...userReview, rating: r })}
                          style={{
                            fontSize: '28px',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            opacity: userReview.rating >= r ? 1 : 0.3,
                          }}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', color: theme.textPrimary, fontWeight: '600' }}>
                      Comment
                    </label>
                    <textarea
                      value={userReview.comment}
                      onChange={(e) => setUserReview({ ...userReview, comment: e.currentTarget.value })}
                      placeholder="Share your thoughts about this quiz..."
                      style={{
                        width: '100%',
                        padding: '12px',
                        background: theme.surfacePrimary,
                        border: `1px solid ${theme.border}`,
                        borderRadius: '12px',
                        color: theme.textPrimary,
                        fontSize: '14px',
                        minHeight: '100px',
                        fontFamily: 'inherit',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  <button
                    onClick={handleSubmitReview}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: theme.accentPrimary,
                      color: '#fff',
                      border: 'none',
                      borderRadius: '12px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                    }}
                  >
                    Submit Review
                  </button>
                </div>
              )}

              {/* Reviews List */}
              {reviews.length > 0 ? (
                <div style={{ display: 'grid', gap: '12px' }}>
                  {reviews.map((review) => (
                    <div
                      key={review.id}
                      style={{
                        background: theme.background,
                        border: `1px solid ${theme.border}`,
                        borderRadius: '12px',
                        padding: '16px',
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'start',
                        marginBottom: '8px',
                      }}>
                        <div>
                          <div style={{ color: theme.textPrimary, fontWeight: '600', fontSize: '13px' }}>
                            {review.userName}
                          </div>
                          <div style={{ color: theme.textSecondary, fontSize: '11px' }}>
                            {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                          </div>
                        </div>
                        <div style={{ color: theme.textSecondary, fontSize: '11px' }}>
                          {new Date(review.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <p style={{
                        color: theme.textPrimary,
                        fontSize: '13px',
                        margin: '0',
                        lineHeight: '1.5',
                      }}>
                        {review.comment}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ color: theme.textSecondary, textAlign: 'center', padding: '32px 0' }}>
                  No reviews yet. Be the first to review!
                </div>
              )}
            </div>
          </div>
        </div>
      </SiteLayout>
    );
  }

  // Initial screen - Choose difficulty and show quiz info
  return (
    <SiteLayout>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 20px', background: `linear-gradient(135deg, ${theme.background}20, ${theme.accentPrimary}05)` }}>
        {/* Breadcrumb Navigation */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '32px',
          color: theme.textSecondary,
          fontSize: '14px',
          fontWeight: '500',
        }}>
          <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: theme.accentPrimary, cursor: 'pointer' }}>Home</button>
          <span>›</span>
          <button onClick={() => navigate('/quiz')} style={{ background: 'none', border: 'none', color: theme.accentPrimary, cursor: 'pointer' }}>Quizzes</button>
          <span>›</span>
          <span style={{ color: theme.textPrimary }}>{quiz.title}</span>
        </div>

        {/* Title and Subtitle */}
        <h1 style={{
          color: theme.textPrimary,
          fontSize: '48px',
          fontWeight: '800',
          marginBottom: '8px',
          margin: '0 0 8px 0',
          background: `linear-gradient(135deg, ${theme.accentPrimary}, ${theme.accentSecondary})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          {quiz.title}
        </h1>
        <p style={{
          color: theme.textSecondary,
          fontSize: '18px',
          marginBottom: '48px',
        }}>
          Choose a variant and start playing
        </p>

        {/* TWO COLUMN LAYOUT: Quiz Info (LEFT) + Variant Cards (RIGHT) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 280px',
          gap: '40px',
          marginBottom: '48px',
        }}>
          {/* LEFT: Quiz Description */}
          <div>
            <p style={{
              color: theme.textSecondary,
              fontSize: '15px',
              lineHeight: '1.8',
              margin: '0 0 32px 0',
            }}>
              {quiz.description}
            </p>

            {/* Quiz Image */}
            {quiz.imageUrl && (
              <img
                src={quiz.imageUrl}
                alt={quiz.title}
                style={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: '12px',
                  border: `2px solid ${theme.border}`,
                  marginBottom: '32px',
                }}
              />
            )}
          </div>

          {/* RIGHT: Variant Cards */}
          <div>
            <h2 style={{
              color: theme.textPrimary,
              fontSize: '16px',
              fontWeight: '700',
              marginBottom: '20px',
              margin: '0 0 20px 0',
            }}>
              Choose Difficulty & Start
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: '10px',
            }}>
              {['Easy', 'Medium', 'Hard', 'Expert'].map(difficulty => {
                const variantCount = quiz?.levelVariants?.[difficulty]?.questionCount || quiz?.questions?.length || 0;
                return (
                  <button
                    key={difficulty}
                    onClick={() => {
                      setSelectedDifficulty(difficulty);
                      setCurrentQuestion(0);
                      setScore(0);
                      setAnswered(false);
                      setSelectedAnswer(null);
                      setQuizCompleted(false);
                      setTimeLeft(300);
                      setStartTime(Date.now());
                      setIsPaused(false);
                      setQuizStarted(true);
                    }}
                    style={{
                      padding: '16px 12px',
                      background: `linear-gradient(135deg, ${theme.accentPrimary}, ${theme.accentSecondary})`,
                      color: '#fff',
                      border: `2px solid ${theme.accentPrimary}`,
                      borderRadius: '12px',
                      fontSize: '14px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      textAlign: 'center',
                      boxShadow: `0 6px 20px ${theme.accentPrimary}30`,
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = `0 8px 24px ${theme.accentPrimary}50`;
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = `0 6px 20px ${theme.accentPrimary}30`;
                    }}
                  >
                    🚀 START {difficulty} ({variantCount}Q)
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* LEADERBOARDS AND REVIEWS - SINGLE COLUMN */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '40px',
        }}>
          {/* Leaderboards */}
          <div>
            <h2 style={{
              color: theme.textPrimary,
              fontSize: '28px',
              fontWeight: '800',
              marginBottom: '8px',
              background: `linear-gradient(135deg, ${theme.accentPrimary}, ${theme.accentSecondary})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              🏆 Leaderboards
            </h2>
            <p style={{
              color: theme.textSecondary,
              fontSize: '16px',
              marginBottom: '32px',
            }}>
              See how you compare to others
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '24px',
            }}>
              {['Easy', 'Medium', 'Hard', 'Expert'].map(difficulty => (
                <div key={difficulty} style={{ marginBottom: '0' }}>
                  <h3 style={{
                    color: theme.textPrimary,
                    fontSize: '13px',
                    fontWeight: '600',
                    marginBottom: '12px',
                    paddingBottom: '8px',
                    borderBottom: `1px solid ${theme.border}`,
                  }}>
                    {difficulty}
                  </h3>

                  {leaderboardByDifficulty[difficulty] && leaderboardByDifficulty[difficulty].length > 0 ? (
                    <div style={{
                      display: 'grid',
                      gap: '6px',
                    }}>
                      {leaderboardByDifficulty[difficulty].slice(0, 3).map((entry, index) => (
                        <div
                          key={entry.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '8px',
                            background: index === 0 ? `${theme.accentPrimary}15` : theme.background,
                            border: `1px solid ${theme.border}`,
                            borderRadius: '4px',
                            fontSize: '11px',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1 }}>
                            <div style={{
                              width: '20px',
                              height: '20px',
                              borderRadius: '50%',
                              background: theme.accentPrimary,
                              color: '#fff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: '700',
                              fontSize: '10px',
                              minWidth: '20px',
                            }}>
                              {index + 1}
                            </div>
                            <div style={{
                              color: theme.textPrimary,
                              fontWeight: '600',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              fontSize: '10px',
                            }}>
                              {entry.userName}
                            </div>
                          </div>
                          <div style={{
                            color: theme.accentPrimary,
                            fontWeight: '700',
                            fontSize: '10px',
                          }}>
                            {formatTimeWithMilliseconds(entry.timeSpent)}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{
                      color: theme.textSecondary,
                      fontSize: '10px',
                      textAlign: 'center',
                      padding: '8px 0',
                    }}>
                      No scores
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Reviews */}
          <div>
            <h2 style={{
              color: theme.textPrimary,
              fontSize: '28px',
              fontWeight: '800',
              marginBottom: '8px',
              background: `linear-gradient(135deg, ${theme.accentPrimary}, ${theme.accentSecondary})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              ⭐ Reviews
            </h2>
            <p style={{
              color: theme.textSecondary,
              fontSize: '16px',
              marginBottom: '32px',
            }}>
              What players are saying about this puzzle
            </p>

            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                style={{
                  padding: '10px 20px',
                  background: `linear-gradient(135deg, ${theme.accentPrimary}, ${theme.accentSecondary})`,
                  color: '#fff',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  boxShadow: `0 8px 20px ${theme.accentPrimary}30`,
                  transition: 'all 0.3s ease',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = `0 12px 28px ${theme.accentPrimary}40`;
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = `0 8px 20px ${theme.accentPrimary}30`;
                }}
              >
                {showReviewForm ? 'Cancel' : '✍️ Write Review'}
              </button>
            </div>

            {/* Review Form */}
            {showReviewForm && (
              <div style={{
                background: `linear-gradient(135deg, ${theme.background}, ${theme.accentPrimary}05)`,
                border: `2px solid ${theme.accentPrimary}30`,
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '24px',
                boxShadow: `0 8px 24px ${theme.accentPrimary}10`,
              }}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: theme.textPrimary, fontWeight: '600' }}>
                    Rating
                  </label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {[1, 2, 3, 4, 5].map(r => (
                      <button
                        key={r}
                        onClick={() => setUserReview({ ...userReview, rating: r })}
                        style={{
                          fontSize: '28px',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          opacity: userReview.rating >= r ? 1 : 0.3,
                        }}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: theme.textPrimary, fontWeight: '600' }}>
                    Comment
                  </label>
                  <textarea
                    value={userReview.comment}
                    onChange={(e) => setUserReview({ ...userReview, comment: e.currentTarget.value })}
                    placeholder="Share your thoughts about this quiz..."
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: theme.surfacePrimary,
                      border: `1px solid ${theme.border}`,
                      borderRadius: '12px',
                      color: theme.textPrimary,
                      fontSize: '14px',
                      minHeight: '100px',
                      fontFamily: 'inherit',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <button
                  onClick={handleSubmitReview}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: `linear-gradient(135deg, ${theme.accentPrimary}, ${theme.accentSecondary})`,
                    color: '#fff',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    boxShadow: `0 8px 20px ${theme.accentPrimary}30`,
                    transition: 'all 0.3s ease',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = `0 12px 28px ${theme.accentPrimary}40`;
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = `0 8px 20px ${theme.accentPrimary}30`;
                  }}
                >
                  Submit Review
                </button>
              </div>
            )}

            {/* Reviews List */}
            {reviews.length > 0 ? (
              <div style={{ display: 'grid', gap: '12px' }}>
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    style={{
                      background: theme.background,
                      border: `1px solid ${theme.accentPrimary}20`,
                      borderRadius: '12px',
                      padding: '16px',
                      boxShadow: `0 4px 12px ${theme.accentPrimary}08`,
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = `0 8px 20px ${theme.accentPrimary}12`;
                      e.currentTarget.style.borderColor = `${theme.accentPrimary}30`;
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = `0 4px 12px ${theme.accentPrimary}08`;
                      e.currentTarget.style.borderColor = `${theme.accentPrimary}20`;
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'start',
                      marginBottom: '8px',
                    }}>
                      <div>
                        <div style={{ color: theme.textPrimary, fontWeight: '600', fontSize: '13px' }}>
                          {review.userName}
                        </div>
                        <div style={{ color: theme.textSecondary, fontSize: '11px' }}>
                          {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                        </div>
                      </div>
                      <div style={{ color: theme.textSecondary, fontSize: '11px' }}>
                        {new Date(review.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <p style={{
                      color: theme.textPrimary,
                      fontSize: '13px',
                      margin: '0',
                      lineHeight: '1.5',
                    }}>
                      {review.comment}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ color: theme.textSecondary, textAlign: 'center', padding: '32px 0' }}>
                No reviews yet. Be the first to review!
              </div>
            )}
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
