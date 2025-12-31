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
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);

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

      // Group by difficulty
      const byDifficulty = {};
      allScores.forEach(score => {
        const diff = score.difficulty || 'Easy';
        if (!byDifficulty[diff]) byDifficulty[diff] = [];
        byDifficulty[diff].push(score);
      });

      // Sort each difficulty group
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
      })).sort((a, b) => b.rating - a.rating).slice(0, 5);
      
      setReviews(reviewsData);
    } catch (error) {
      console.error('Error loading reviews:', error);
    }
  };

  // Timer effect
  useEffect(() => {
    if (!quiz || quizCompleted || timeLeft === null) return;

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
  }, [quiz, quizCompleted, timeLeft, startTime]);

  const handleAnswerSelect = (optionIndex) => {
    if (answered) return;

    setSelectedAnswer(optionIndex);
    setAnswered(true);

    // Check if correct
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
      setShowHint(false);
    } else {
      handleQuizComplete();
    }
  };

  const handleQuizComplete = async () => {
    setQuizCompleted(true);
    const finalScore = score;
    const finalTime = elapsedTime;
    
    console.log(`🎉 Quiz completed! Score: ${finalScore}/${quiz.questions.length}, Time: ${finalTime}s`);

    // Save score to leaderboard
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
          difficulty: quiz.difficulty,
        });
        
        // Reload leaderboard
        loadLeaderboard(quizId);
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
      
      // Reload reviews
      loadReviews(quizId);
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Error submitting review');
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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

  if (quizCompleted) {
    const percentage = Math.round((score / quiz.questions.length) * 100);
    const passed = percentage >= 70;
    const avgRating = reviews.length > 0 
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : 0;

    return (
      <SiteLayout>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
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
                Time: {formatTime(elapsedTime)} | Hints Used: {hintsUsed}
              </span>
            </div>

            <p style={{
              color: theme.textSecondary,
              fontSize: '14px',
              marginBottom: '32px',
              lineHeight: '1.6',
              maxWidth: '500px',
              margin: '0 auto 32px',
            }}>
              {passed
                ? 'Excellent work! You have a strong understanding of the material.'
                : 'Good effort! Review the questions and try again to improve your score.'}
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
                  setHintsUsed(0);
                  setShowHint(false);
                  setStartTime(Date.now());
                  if (quiz.avgTime) {
                    const minutes = parseInt(quiz.avgTime);
                    setTimeLeft(minutes * 60);
                  }
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

          {/* Leaderboard Section */}
          <div style={{
            background: theme.surfacePrimary,
            borderRadius: '16px',
            border: `2px solid ${theme.border}`,
            padding: '32px',
            marginBottom: '40px',
          }}>
            <h3 style={{
              color: theme.textPrimary,
              fontSize: '22px',
              fontWeight: '700',
              marginBottom: '24px',
            }}>
              🏆 Leaderboard - Top Scores
            </h3>

            {leaderboard.length > 0 ? (
              <div style={{
                display: 'grid',
                gap: '12px',
              }}>
                {leaderboard.map((entry, index) => (
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
                        <div style={{ color: theme.textSecondary, fontSize: '12px' }}>
                          {entry.difficulty}
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
              <div style={{ color: theme.textSecondary, textAlign: 'center', padding: '32px' }}>
                Be the first to complete this quiz!
              </div>
            )}
          </div>

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
                <h3 style={{
                  color: theme.textPrimary,
                  fontSize: '22px',
                  fontWeight: '700',
                  margin: '0',
                }}>
                  ⭐ Reviews
                </h3>
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

  const question = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  // Variant levels
  const VARIANTS = ['Easy', 'Medium', 'Hard', 'Expert'];

  return (
    <SiteLayout>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px' }}>
        {/* Top Navigation */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px',
          paddingBottom: '16px',
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
              padding: '8px 0',
            }}
          >
            ← Back to Quizzes
          </button>
          <h1 style={{
            color: theme.textPrimary,
            fontSize: '28px',
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

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '32px' }}>
          {/* Main Quiz Section */}
          <div>
            {/* Description Section */}
            {showDescription && (
              <div style={{
                background: theme.surfacePrimary,
                border: `2px solid ${theme.border}`,
                borderRadius: '16px',
                padding: '24px',
                marginBottom: '32px',
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'start',
                  marginBottom: '16px',
                }}>
                  <h3 style={{
                    color: theme.textPrimary,
                    fontSize: '18px',
                    fontWeight: '700',
                    margin: '0',
                  }}>
                    📖 {quiz.title}
                  </h3>
                  <button
                    onClick={() => setShowDescription(false)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: theme.textSecondary,
                      fontSize: '20px',
                      cursor: 'pointer',
                    }}
                  >
                    ✕
                  </button>
                </div>
                <p style={{
                  color: theme.textSecondary,
                  fontSize: '14px',
                  lineHeight: '1.6',
                  margin: '0',
                }}>
                  {quiz.description}
                </p>
              </div>
            )}

            {/* Choose Variant Section */}
            <div style={{
              background: theme.surfacePrimary,
              border: `2px solid ${theme.border}`,
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '32px',
            }}>
              <h3 style={{
                color: theme.textPrimary,
                fontSize: '16px',
                fontWeight: '700',
                marginBottom: '16px',
                margin: '0 0 16px 0',
              }}>
                Choose Difficulty
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '12px',
                marginBottom: '20px',
              }}>
                {VARIANTS.map((variant) => (
                  <button
                    key={variant}
                    onClick={() => setSelectedVariant(variant)}
                    style={{
                      padding: '12px 16px',
                      background: selectedVariant === variant 
                        ? `linear-gradient(135deg, ${theme.accentPrimary}, ${theme.accentSecondary})`
                        : theme.border,
                      color: selectedVariant === variant ? '#fff' : theme.textPrimary,
                      border: `2px solid ${selectedVariant === variant ? theme.accentPrimary : theme.border}`,
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseOver={(e) => {
                      if (selectedVariant !== variant) {
                        e.currentTarget.style.borderColor = theme.accentPrimary;
                      }
                    }}
                    onMouseOut={(e) => {
                      if (selectedVariant !== variant) {
                        e.currentTarget.style.borderColor = theme.border;
                      }
                    }}
                  >
                    {variant}
                    <br />
                    <span style={{ fontSize: '11px', opacity: 0.8 }}>({quiz.questions.length}Q)</span>
                  </button>
                ))}
              </div>

              {/* Pro Tips Section */}
              <div style={{
                background: `${theme.accentSecondary}10`,
                border: `2px solid ${theme.accentSecondary}`,
                borderRadius: '12px',
                padding: '16px',
              }}>
                <button
                  onClick={() => setShowHint(!showHint)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'none',
                    border: 'none',
                    color: theme.accentSecondary,
                    fontSize: '14px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                >
                  💡 {showHint ? 'Hide Pro Tips' : 'Show Pro Tips'}
                </button>

                {showHint && (
                  <div style={{
                    marginTop: '12px',
                    paddingTop: '12px',
                    borderTop: `1px solid ${theme.accentSecondary}50`,
                    color: theme.accentSecondary,
                    fontSize: '13px',
                    lineHeight: '1.6',
                  }}>
                    <p style={{ margin: '0 0 8px 0' }}>
                      <strong>Pro Tips for Better Scores:</strong>
                    </p>
                    <ul style={{ margin: '0', paddingLeft: '20px' }}>
                      <li>Read each question carefully</li>
                      <li>Eliminate obviously wrong options</li>
                      <li>Trust your first instinct</li>
                      <li>Take your time - no rush!</li>
                    </ul>
                  </div>
                )}
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
              padding: '32px',
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
                  padding: '4px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: '600',
                }}>
                  {quiz.difficulty}
                </span>
              </div>

              <h2 style={{
                color: theme.textPrimary,
                fontSize: '20px',
                fontWeight: '600',
                marginBottom: '24px',
                lineHeight: '1.6',
              }}>
                {question.text}
              </h2>

              {/* Options */}
              <div style={{
                display: 'grid',
                gap: '12px',
              }}>
                {question.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={answered}
                    style={{
                      padding: '16px 20px',
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
                      fontSize: '15px',
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '24px',
                        height: '24px',
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
                        fontSize: '12px',
                        fontWeight: '600',
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
                  padding: '16px',
                  marginTop: '24px',
                  color: selectedAnswer === question.correctAnswer ? '#4ECB71' : '#FF6B6B',
                }}>
                  <div style={{ fontWeight: '600', marginBottom: '8px' }}>
                    {selectedAnswer === question.correctAnswer ? '✓ Correct!' : '✗ Incorrect'}
                  </div>
                  <div style={{ fontSize: '14px', color: theme.textSecondary }}>
                    {question.explanation}
                  </div>
                </div>
              )}

              {/* Next Button */}
              {answered && (
                <div style={{ marginTop: '24px', textAlign: 'center' }}>
                  <button
                    onClick={handleNextQuestion}
                    style={{
                      padding: '12px 32px',
                      background: `linear-gradient(135deg, ${theme.accentPrimary}, ${theme.accentSecondary})`,
                      color: '#fff',
                      border: 'none',
                      borderRadius: '10px',
                      fontSize: '15px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    {currentQuestion === quiz.questions.length - 1 ? 'Finish Quiz' : 'Next Question →'}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Leaderboard */}
          <div>
            <div style={{
              background: theme.surfacePrimary,
              border: `2px solid ${theme.border}`,
              borderRadius: '16px',
              padding: '24px',
              position: 'sticky',
              top: '20px',
            }}>
              <h3 style={{
                color: theme.textPrimary,
                fontSize: '16px',
                fontWeight: '700',
                marginBottom: '20px',
                margin: '0 0 20px 0',
              }}>
                🏆 Top Scores
              </h3>

              {leaderboard.length > 0 ? (
                <div style={{
                  display: 'grid',
                  gap: '12px',
                }}>
                  {leaderboard.slice(0, 5).map((entry, index) => (
                    <div
                      key={entry.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px',
                        background: index === 0 ? `${theme.accentPrimary}15` : theme.background,
                        borderRadius: '8px',
                        border: `1px solid ${theme.border}`,
                      }}
                    >
                      <div style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: theme.accentPrimary,
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: '700',
                        fontSize: '12px',
                        minWidth: '28px',
                      }}>
                        {index === 0 ? '👑' : index + 1}
                      </div>
                      <div style={{ flex: 1, minWidth: '0' }}>
                        <div style={{
                          color: theme.textPrimary,
                          fontSize: '13px',
                          fontWeight: '600',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}>
                          {entry.userName}
                        </div>
                        <div style={{
                          color: theme.textSecondary,
                          fontSize: '11px',
                        }}>
                          {entry.score}/{quiz.questions.length}
                        </div>
                      </div>
                      <div style={{
                        color: theme.accentPrimary,
                        fontSize: '12px',
                        fontWeight: '700',
                        textAlign: 'right',
                      }}>
                        {formatTime(entry.timeSpent)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{
                  color: theme.textSecondary,
                  fontSize: '13px',
                  textAlign: 'center',
                  padding: '20px 0',
                }}>
                  No scores yet.<br />Be first to play!
                </div>
              )}

              <button
                onClick={() => {
                  // Scroll to leaderboard results
                  const element = document.getElementById('leaderboard-full');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
                style={{
                  width: '100%',
                  marginTop: '16px',
                  padding: '10px',
                  background: theme.border,
                  border: `1px solid ${theme.border}`,
                  borderRadius: '8px',
                  color: theme.textSecondary,
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                View All Scores →
              </button>
            </div>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
