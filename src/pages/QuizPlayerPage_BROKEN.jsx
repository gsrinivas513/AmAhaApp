import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, getDocs, query, where, addDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import SiteLayout from '../layouts/SiteLayout';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../components/AuthProvider';

export default function QuizPlayerPage() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { user } = useAuth();

  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [leaderboardByDifficulty, setLeaderboardByDifficulty] = useState({});
  const [reviews, setReviews] = useState([]);
  const [userReview, setUserReview] = useState({ rating: 5, comment: '' });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState('Easy');

  // Load quiz
  useEffect(() => {
    const loadQuiz = async () => {
      try {
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
      } catch (error) {
        console.error('Error loading quiz:', error);
        navigate('/quiz');
      } finally {
        setLoading(false);
      }
    };

    loadQuiz();
  }, [quizId, navigate]);

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

      Object.keys(byDifficulty).forEach(diff => {
        byDifficulty[diff].sort((a, b) => {
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
    if (!quizStarted || quizCompleted) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleQuizComplete();
          return 0;
        }
        return prev - 1;
      });
      
      if (startTime) {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [quizStarted, quizCompleted, timeLeft, startTime]);

  const handleAnswerSelect = (optionIndex) => {
    if (answered) return;

    setSelectedAnswer(optionIndex);
    setAnswered(true);

    const question = quiz.questions[currentQuestion];
    if (optionIndex === question.correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < quiz.questions.length - 1) {
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
      setTimeLeft(3600); // 1 hour default
    }
  };

  const handleQuizComplete = async () => {
    setQuizCompleted(true);
    const finalScore = score;
    const finalTime = elapsedTime;

    if (user) {
      try {
        await addDoc(collection(db, 'quizScores'), {
          quizId: quizId,
          userId: user.uid,
          userName: user.displayName || user.email,
          userEmail: user.email,
          score: finalScore,
          totalQuestions: quiz.questions.length,
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
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
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

  // Playing quiz
  if (quizStarted && !quizCompleted) {
    const question = quiz.questions[currentQuestion];
    const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

    return (
      <SiteLayout>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
          {/* Top Navigation Bar */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '40px',
            paddingBottom: '20px',
            borderBottom: `2px solid ${theme.border}`,
          }}>
            <button
              onClick={() => navigate('/quiz')}
              style={{
                background: 'none',
                border: 'none',
                color: theme.accentPrimary,
                fontSize: '14px',
                cursor: 'pointer',
                fontWeight: '600',
              }}
            >
              ← Back
            </button>
            <h1 style={{
              color: theme.textPrimary,
              fontSize: '26px',
              fontWeight: '700',
              margin: '0',
              flex: 1,
              textAlign: 'center',
            }}>
              {quiz.title}
            </h1>
            <div style={{
              fontSize: '24px',
              fontWeight: '700',
              color: timeLeft < 60 ? '#FF6B6B' : theme.accentPrimary,
            }}>
              {formatTime(timeLeft || 0)}
            </div>
          </div>

          {/* Progress Bar */}
          <div style={{
            background: theme.border,
            height: '8px',
            borderRadius: '4px',
            marginBottom: '32px',
            overflow: 'hidden',
          }}>
            <div style={{
              background: `linear-gradient(90deg, ${theme.accentPrimary}, ${theme.accentSecondary})`,
              height: '100%',
              width: `${progress}%`,
              transition: 'width 0.3s ease',
            }} />
          </div>

          {/* Question Card */}
          <div style={{
            background: theme.surfacePrimary,
            border: `2px solid ${theme.border}`,
            borderRadius: '16px',
            padding: '40px',
            marginBottom: '32px',
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px',
              paddingBottom: '16px',
              borderBottom: `1px solid ${theme.border}`,
            }}>
              <span style={{
                color: theme.textSecondary,
                fontSize: '14px',
                fontWeight: '600',
              }}>
                Question {currentQuestion + 1} of {quiz.questions.length}
              </span>
              <span style={{
                background: `${theme.accentPrimary}20`,
                color: theme.accentPrimary,
                padding: '6px 16px',
                borderRadius: '20px',
                fontSize: '13px',
                fontWeight: '600',
              }}>
                {selectedDifficulty}
              </span>
            </div>

            <h2 style={{
              color: theme.textPrimary,
              fontSize: '24px',
              fontWeight: '600',
              marginBottom: '32px',
              lineHeight: '1.6',
            }}>
              {question.text}
            </h2>

            {/* Options */}
            <div style={{
              display: 'grid',
              gap: '16px',
              marginBottom: '32px',
            }}>
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={answered}
                  style={{
                    padding: '20px 24px',
                    textAlign: 'left',
                    background: answered
                      ? index === question.correctAnswer
                        ? '#4ECB7120'
                        : index === selectedAnswer
                        ? '#FF6B6B20'
                        : theme.border
                      : selectedAnswer === index
                      ? theme.accentPrimary + '30'
                      : theme.border,
                    border: `2px solid ${
                      answered
                        ? index === question.correctAnswer
                          ? '#4ECB71'
                          : index === selectedAnswer
                          ? '#FF6B6B'
                          : theme.border
                        : selectedAnswer === index
                        ? theme.accentPrimary
                        : theme.border
                    }`,
                    borderRadius: '12px',
                    color: theme.textPrimary,
                    fontSize: '16px',
                    fontWeight: '500',
                    cursor: answered ? 'default' : 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseOver={(e) => {
                    if (!answered) {
                      e.currentTarget.style.borderColor = theme.accentPrimary;
                      e.currentTarget.style.background = theme.accentPrimary + '10';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!answered && selectedAnswer !== index) {
                      e.currentTarget.style.borderColor = theme.border;
                      e.currentTarget.style.background = theme.border;
                    }
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: answered
                        ? index === question.correctAnswer
                          ? '#4ECB71'
                          : index === selectedAnswer
                          ? '#FF6B6B'
                          : theme.border
                        : selectedAnswer === index
                        ? theme.accentPrimary
                        : theme.border,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontSize: '16px',
                      fontWeight: '600',
                      flexShrink: 0,
                    }}>
                      {answered ? (index === question.correctAnswer ? '✓' : index === selectedAnswer ? '✗' : '') : String.fromCharCode(65 + index)}
                    </div>
                    <span>{option}</span>
                  </div>
                </button>
              ))}
            </div>

            {answered && (
              <div style={{
                background: selectedAnswer === question.correctAnswer ? '#4ECB7115' : '#FF6B6B15',
                border: `2px solid ${selectedAnswer === question.correctAnswer ? '#4ECB71' : '#FF6B6B'}`,
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '24px',
                color: selectedAnswer === question.correctAnswer ? '#4ECB71' : '#FF6B6B',
              }}>
                <div style={{ fontWeight: '700', marginBottom: '8px', fontSize: '16px' }}>
                  {selectedAnswer === question.correctAnswer ? '✓ Correct!' : '✗ Incorrect'}
                </div>
                <div style={{ fontSize: '14px', color: theme.textSecondary, lineHeight: '1.5' }}>
                  {question.explanation}
                </div>
              </div>
            )}

            {/* Next Button */}
            {answered && (
              <div style={{ textAlign: 'center' }}>
                <button
                  onClick={handleNextQuestion}
                  style={{
                    padding: '14px 40px',
                    background: `linear-gradient(135deg, ${theme.accentPrimary}, ${theme.accentSecondary})`,
                    color: '#fff',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '16px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                >
                  {currentQuestion === quiz.questions.length - 1 ? 'See Results' : 'Next Question →'}
                </button>
              </div>
            )}
          </div>
        </div>
      </SiteLayout>
    );
  }

  // Results screen
  if (quizCompleted) {
    const percentage = Math.round((score / quiz.questions.length) * 100);
    const passed = percentage >= 70;
    const avgRating = reviews.length > 0 
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : 0;

    return (
      <SiteLayout>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
          {/* Back Button */}
          <button
            onClick={() => navigate('/quiz')}
            style={{
              background: 'none',
              border: 'none',
              color: theme.accentPrimary,
              fontSize: '14px',
              cursor: 'pointer',
              fontWeight: '600',
              marginBottom: '40px',
            }}
          >
            ← Back to Quizzes
          </button>

          {/* Results Card */}
          <div style={{
            background: theme.surfacePrimary,
            borderRadius: '16px',
            border: `2px solid ${theme.border}`,
            padding: '60px 40px',
            textAlign: 'center',
            marginBottom: '40px',
          }}>
            <div style={{
              fontSize: '80px',
              marginBottom: '24px',
            }}>
              {passed ? '🎉' : '📚'}
            </div>

            <h2 style={{
              color: theme.textPrimary,
              fontSize: '32px',
              fontWeight: '700',
              marginBottom: '16px',
            }}>
              {passed ? 'Excellent!' : 'Quiz Completed'}
            </h2>

            <div style={{
              fontSize: '64px',
              fontWeight: '700',
              color: passed ? '#4ECB71' : '#FFB627',
              marginBottom: '24px',
            }}>
              {score}/{quiz.questions.length}
            </div>

            <div style={{
              fontSize: '20px',
              color: theme.textSecondary,
              marginBottom: '32px',
            }}>
              You scored <strong style={{ color: theme.textPrimary, fontSize: '24px' }}>{percentage}%</strong>
              <br />
              <span style={{ fontSize: '14px', marginTop: '8px', display: 'block' }}>
                Time: {formatTime(elapsedTime)}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => navigate('/quiz')}
                style={{
                  padding: '12px 32px',
                  background: theme.accentPrimary,
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: 'pointer',
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
                  borderRadius: '8px',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                Retake Quiz
              </button>
            </div>
          </div>

          {/* Leaderboards by Difficulty */}
          {Object.keys(leaderboardByDifficulty).length > 0 && (
            <div style={{ marginBottom: '40px' }}>
              <h2 style={{
                color: theme.textPrimary,
                fontSize: '28px',
                fontWeight: '700',
                marginBottom: '24px',
              }}>
                🏆 Leaderboards
              </h2>

              {['Easy', 'Medium', 'Hard', 'Expert'].map(difficulty => (
                <div key={difficulty} style={{ marginBottom: '32px' }}>
                  <h3 style={{
                    color: theme.textPrimary,
                    fontSize: '18px',
                    fontWeight: '600',
                    marginBottom: '16px',
                    paddingBottom: '12px',
                    borderBottom: `2px solid ${theme.border}`,
                  }}>
                    {difficulty}
                  </h3>

                  {leaderboardByDifficulty[difficulty] && leaderboardByDifficulty[difficulty].length > 0 ? (
                    <div style={{
                      display: 'grid',
                      gap: '12px',
                      background: theme.surfacePrimary,
                      borderRadius: '12px',
                      padding: '16px',
                    }}>
                      {leaderboardByDifficulty[difficulty].slice(0, 5).map((entry, index) => (
                        <div
                          key={entry.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '16px',
                            background: index === 0 ? `${theme.accentPrimary}15` : theme.background,
                            border: `1px solid ${theme.border}`,
                            borderRadius: '8px',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                            <div style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              background: theme.accentPrimary,
                              color: '#fff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: '700',
                              fontSize: '14px',
                            }}>
                              {index === 0 ? '👑' : index + 1}
                            </div>
                            <div>
                              <div style={{ color: theme.textPrimary, fontWeight: '600' }}>
                                {entry.userName}
                              </div>
                            </div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ color: theme.textPrimary, fontWeight: '700', fontSize: '16px' }}>
                              {entry.score}/{quiz.questions.length}
                            </div>
                            <div style={{ color: theme.textSecondary, fontSize: '12px' }}>
                              {formatTime(entry.timeSpent)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{
                      color: theme.textSecondary,
                      textAlign: 'center',
                      padding: '32px',
                      background: theme.surfacePrimary,
                      borderRadius: '12px',
                    }}>
                      No scores yet for this difficulty
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Reviews Section */}
          <div style={{
            background: theme.surfacePrimary,
            borderRadius: '16px',
            border: `2px solid ${theme.border}`,
            padding: '32px',
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px',
            }}>
              <div>
                <h2 style={{
                  color: theme.textPrimary,
                  fontSize: '28px',
                  fontWeight: '700',
                  margin: '0',
                }}>
                  ⭐ Reviews
                </h2>
                {avgRating > 0 && (
                  <div style={{
                    color: theme.textSecondary,
                    fontSize: '14px',
                    marginTop: '8px',
                  }}>
                    Average Rating: <strong style={{ color: theme.textPrimary }}>★ {avgRating} / 5</strong>
                  </div>
                )}
              </div>
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                style={{
                  padding: '10px 20px',
                  background: theme.accentPrimary,
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
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
                    onChange={(e) => setUserReview({ ...userReview, comment: e.target.value })}
                    placeholder="Share your thoughts about this quiz..."
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: theme.surfacePrimary,
                      border: `1px solid ${theme.border}`,
                      borderRadius: '8px',
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
                    borderRadius: '8px',
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
                      borderRadius: '8px',
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
                        <div style={{ color: theme.textPrimary, fontWeight: '600' }}>
                          {review.userName}
                        </div>
                        <div style={{ color: theme.textSecondary, fontSize: '12px' }}>
                          {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                        </div>
                      </div>
                      <div style={{ color: theme.textSecondary, fontSize: '12px' }}>
                        {new Date(review.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <p style={{
                      color: theme.textPrimary,
                      fontSize: '14px',
                      margin: '0',
                      lineHeight: '1.5',
                    }}>
                      {review.comment}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ color: theme.textSecondary, textAlign: 'center', padding: '32px' }}>
                No reviews yet. Be the first to review!
              </div>
            )}
          </div>
        </div>
      </SiteLayout>
    );
  }

  // Initial screen - Choose difficulty before starting
  return (
    <SiteLayout>
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px' }}>
        {/* Back Button */}
        <button
          onClick={() => navigate('/quiz')}
          style={{
            background: 'none',
            border: 'none',
            color: theme.accentPrimary,
            fontSize: '14px',
            cursor: 'pointer',
            fontWeight: '600',
            marginBottom: '40px',
          }}
        >
          ← Back to Quizzes
        </button>

        {/* Title */}
        <h1 style={{
          color: theme.textPrimary,
          fontSize: '40px',
          fontWeight: '700',
          textAlign: 'center',
          marginBottom: '16px',
        }}>
          {quiz.title}
        </h1>

        <p style={{
          color: theme.textSecondary,
          textAlign: 'center',
          fontSize: '16px',
          marginBottom: '48px',
        }}>
          Choose a variant and start playing
        </p>

        {/* Quiz Image (if available) */}
        {quiz.imageUrl && (
          <img
            src={quiz.imageUrl}
            alt={quiz.title}
            style={{
              width: '100%',
              maxHeight: '400px',
              objectFit: 'cover',
              borderRadius: '16px',
              marginBottom: '48px',
              border: `2px solid ${theme.border}`,
            }}
          />
        )}

        {/* Choose Variant Section */}
        <div style={{
          background: 'transparent',
          border: 'none',
          borderRadius: '16px',
          padding: '0',
          marginBottom: '48px',
        }}>
          <h2 style={{
            color: theme.textPrimary,
            fontSize: '18px',
            fontWeight: '600',
            marginBottom: '20px',
            margin: '0 0 20px 0',
          }}>
            Choose Variant (number of pieces)
          </h2>

          <div style={{
            display: 'flex',
            gap: '12px',
            marginBottom: '48px',
            flexWrap: 'wrap',
          }}>
            {['Easy', 'Medium', 'Hard', 'Expert'].map(difficulty => (
              <button
                key={difficulty}
                onClick={() => {
                  setSelectedDifficulty(difficulty);
                  handleStartQuiz();
                }}
                style={{
                  padding: '10px 16px',
                  background: selectedDifficulty === difficulty 
                    ? `linear-gradient(135deg, ${theme.accentPrimary}, ${theme.accentSecondary})`
                    : theme.border,
                  color: selectedDifficulty === difficulty ? '#fff' : theme.textPrimary,
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseOver={(e) => {
                  if (selectedDifficulty !== difficulty) {
                    e.currentTarget.style.background = theme.accentPrimary + '15';
                  }
                }}
                onMouseOut={(e) => {
                  if (selectedDifficulty !== difficulty) {
                    e.currentTarget.style.background = theme.border;
                  }
                }}
              >
                {quiz.questions.length}
              </button>
            ))}
          </div>
        </div>

        {/* Description Section */}
        <div style={{
          background: 'transparent',
          border: 'none',
          borderRadius: '16px',
          padding: '0',
          marginBottom: '48px',
        }}>
          <p style={{
            color: theme.textSecondary,
            fontSize: '15px',
            lineHeight: '1.8',
            margin: '0 0 24px 0',
          }}>
            {quiz.description}
          </p>
        </div>

        {/* Leaderboards */}
        <div style={{ marginBottom: '48px' }}>
          <h2 style={{
            color: theme.textPrimary,
            fontSize: '28px',
            fontWeight: '700',
            marginBottom: '24px',
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

          <div>
            {['Easy', 'Medium', 'Hard', 'Expert'].map(difficulty => (
              <div key={difficulty} style={{ marginBottom: '32px' }}>
                <h3 style={{
                  color: theme.textPrimary,
                  fontSize: '18px',
                  fontWeight: '600',
                  marginBottom: '16px',
                  paddingBottom: '12px',
                  borderBottom: `2px solid ${theme.border}`,
                }}>
                  {difficulty}
                </h3>

                {leaderboardByDifficulty[difficulty] && leaderboardByDifficulty[difficulty].length > 0 ? (
                  <div style={{
                    display: 'grid',
                    gap: '12px',
                    background: theme.surfacePrimary,
                    borderRadius: '12px',
                    padding: '16px',
                  }}>
                    {leaderboardByDifficulty[difficulty].slice(0, 5).map((entry, index) => (
                      <div
                        key={entry.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '16px',
                          background: index === 0 ? `${theme.accentPrimary}15` : theme.background,
                          border: `1px solid ${theme.border}`,
                          borderRadius: '8px',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                          <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            background: theme.accentPrimary,
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: '700',
                            fontSize: '14px',
                          }}>
                            {index === 0 ? '👑' : index + 1}
                          </div>
                          <div>
                            <div style={{ color: theme.textPrimary, fontWeight: '600' }}>
                              {entry.userName}
                            </div>
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ color: theme.textPrimary, fontWeight: '700', fontSize: '16px' }}>
                            {entry.score}/{quiz.questions.length}
                          </div>
                          <div style={{ color: theme.textSecondary, fontSize: '12px' }}>
                            {formatTime(entry.timeSpent)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{
                    color: theme.textSecondary,
                    textAlign: 'center',
                    padding: '32px',
                    background: theme.surfacePrimary,
                    borderRadius: '12px',
                  }}>
                    No scores yet for this difficulty
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Reviews Section */}
        <div style={{
          background: theme.surfacePrimary,
          borderRadius: '16px',
          border: `2px solid ${theme.border}`,
          padding: '32px',
        }}>
          <h2 style={{
            color: theme.textPrimary,
            fontSize: '28px',
            fontWeight: '700',
            marginBottom: '8px',
          }}>
            ⭐ Reviews
          </h2>
          {reviews.length > 0 && (
            <div style={{
              color: theme.textSecondary,
              fontSize: '14px',
              marginBottom: '24px',
            }}>
              Average Rating: <strong style={{ color: theme.textPrimary }}>
                ★ {(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)} / 5
              </strong>
            </div>
          )}

          {reviews.length > 0 ? (
            <div style={{ display: 'grid', gap: '12px' }}>
              {reviews.slice(0, 5).map((review) => (
                <div
                  key={review.id}
                  style={{
                    background: theme.background,
                    border: `1px solid ${theme.border}`,
                    borderRadius: '8px',
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
                      <div style={{ color: theme.textPrimary, fontWeight: '600' }}>
                        {review.userName}
                      </div>
                      <div style={{ color: theme.textSecondary, fontSize: '12px' }}>
                        {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                      </div>
                    </div>
                    <div style={{ color: theme.textSecondary, fontSize: '12px' }}>
                      {new Date(review.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <p style={{
                    color: theme.textPrimary,
                    fontSize: '14px',
                    margin: '0',
                    lineHeight: '1.5',
                  }}>
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ color: theme.textSecondary, textAlign: 'center', padding: '32px' }}>
              No reviews yet. Be the first to review!
            </div>
          )}
        </div>
      </div>
    </SiteLayout>
  );
}
