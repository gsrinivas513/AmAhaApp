import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, getDocs, query, where, addDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import SiteLayout from '../layouts/SiteLayout';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../components/AuthProvider';
import OrderingPuzzle from '../puzzles/OrderingPuzzle';
import MatchingPuzzle from '../puzzles/MatchingPuzzle';
import DragPuzzle from '../puzzles/DragPuzzle';
import JigsawPuzzle from '../puzzles/renderers/JigsawPuzzle';
import FindPairPuzzle from '../puzzles/renderers/FindPairPuzzle';
import PictureShadowPuzzle from '../puzzles/renderers/PictureShadowPuzzle';
import PictureWordPuzzle from '../puzzles/renderers/PictureWordPuzzle';
import SpotDifferencePuzzle from '../puzzles/renderers/SpotDifferencePuzzle';
import WordSearchPuzzle from '../puzzles/renderers/WordSearchPuzzle';
import CrosswordPuzzle from '../puzzles/renderers/CrosswordPuzzle';
import SudokuPuzzle from '../puzzles/renderers/SudokuPuzzle';

const styles = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

export default function PuzzlePlayerPage() {
  const { theme } = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [puzzle, setPuzzle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState('easy');
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [leaderboardByDifficulty, setLeaderboardByDifficulty] = useState({});
  const [reviews, setReviews] = useState([]);
  const [userReview, setUserReview] = useState({ rating: 5, comment: '' });
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    const loadPuzzle = async () => {
      try {
        console.log('📂 [PuzzlePlayerPage] Loading puzzle:', id);
        setLoading(true);

        const puzzleRef = doc(db, 'puzzles', id);
        const puzzleSnap = await getDoc(puzzleRef);

        if (!puzzleSnap.exists()) {
          console.error('❌ [PuzzlePlayerPage] Puzzle not found:', id);
          setError('Puzzle not found');
          setLoading(false);
          return;
        }

        const puzzleData = {
          id: puzzleSnap.id,
          ...puzzleSnap.data(),
        };

        console.log('✅ [PuzzlePlayerPage] Puzzle loaded:', puzzleData);
        console.log('📋 [PuzzlePlayerPage] Puzzle type:', puzzleData.type);
        
        // Set initial difficulty from puzzle data
        if (puzzleData.difficulty) {
          setSelectedDifficulty(puzzleData.difficulty.toLowerCase());
        }
        
        setPuzzle(puzzleData);
        
        // Load leaderboards and reviews
        await loadLeaderboardByDifficulty(id);
        await loadReviews(id);
        
        setLoading(false);
      } catch (error) {
        console.error('❌ [PuzzlePlayerPage] Error loading puzzle:', error);
        setError('Failed to load puzzle');
        setLoading(false);
      }
    };

    loadPuzzle();
  }, [id]);

  const loadLeaderboardByDifficulty = async (puzzleId) => {
    try {
      const scoresRef = collection(db, 'puzzleScores');
      const q = query(scoresRef, where('puzzleId', '==', puzzleId));
      const snapshot = await getDocs(q);
      
      const allScores = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
      }));

      const byDifficulty = {};
      allScores.forEach(score => {
        const diff = score.difficulty || 'easy';
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

  const loadReviews = async (puzzleId) => {
    try {
      const reviewsRef = collection(db, 'puzzleReviews');
      const q = query(reviewsRef, where('puzzleId', '==', puzzleId));
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

  const handleSubmitReview = async () => {
    if (!userReview.comment.trim()) {
      alert('Please write a review comment');
      return;
    }

    try {
      const reviewData = {
        puzzleId: id,
        userId: user?.uid || 'anonymous',
        userName: user?.displayName || 'Anonymous',
        rating: userReview.rating,
        comment: userReview.comment,
        createdAt: new Date().toISOString(),
      };

      await addDoc(collection(db, 'puzzleReviews'), reviewData);
      
      alert('✅ Review submitted successfully!');
      setUserReview({ rating: 5, comment: '' });
      setShowReviewForm(false);
      
      await loadReviews(id);
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Error submitting review');
    }
  };

  // Render puzzle content based on type
  const renderPuzzleContent = () => {
    const puzzleType = puzzle.type?.toLowerCase();
    
    switch (puzzleType) {
      case 'jigsaw':
        const variants = puzzle.variants || [
          { label: 'Easy (3×4)', rows: 3, cols: 4 },
          { label: 'Medium (4×5)', rows: 4, cols: 5 },
          { label: 'Hard (6×6)', rows: 6, cols: 6 },
        ];
        
        const jigsawData = {
          data: {
            imageUrl: puzzle.imageUrl,
            variants,
            selectedVariant: variants[selectedVariantIdx] || variants[0],
            allVariants: variants,
            rows: puzzle.rows || 3,
            cols: puzzle.cols || 4,
          },
          imageUrl: puzzle.imageUrl,
          variants,
        };
        return <JigsawPuzzle puzzle={jigsawData} selectedVariantId={selectedVariantIdx} onVariantChange={setSelectedVariantIdx} />;

      case 'find-pair':
        return <FindPairPuzzle puzzle={puzzle} onComplete={() => {}} isInline={true} />;

      case 'picture-shadow':
        return <PictureShadowPuzzle puzzle={puzzle} onComplete={() => {}} isInline={true} />;

      case 'picture-word':
        return <PictureWordPuzzle puzzle={puzzle} onComplete={() => {}} isInline={true} />;

      case 'spot-difference':
        return <SpotDifferencePuzzle puzzle={puzzle} onComplete={() => {}} isInline={true} />;

      case 'word-search':
        return <WordSearchPuzzle puzzle={puzzle} onComplete={() => {}} isInline={true} />;

      case 'crossword':
        return <CrosswordPuzzle puzzle={puzzle} onComplete={() => {}} isInline={true} />;

      case 'sudoku':
        return <SudokuPuzzle puzzle={puzzle} onComplete={() => {}} isInline={true} />;

      case 'ordering':
        return <OrderingPuzzle puzzle={puzzle} onComplete={() => {}} isInline={true} />;

      case 'matching':
        return <MatchingPuzzle puzzle={puzzle} onComplete={() => {}} isInline={true} />;

      case 'drag':
        return <DragPuzzle puzzle={puzzle} onComplete={() => {}} isInline={true} />;

      default:
        return (
          <div style={{
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1))',
            border: '2px solid rgba(59, 130, 246, 0.2)',
            borderRadius: '16px',
            padding: '32px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚀</div>
            <h2 style={{
              color: '#111827',
              fontSize: '24px',
              fontWeight: '700',
              margin: '0 0 12px 0',
            }}>
              Coming Soon
            </h2>
            <p style={{
              color: '#6b7280',
              fontSize: '16px',
              lineHeight: '1.6',
              margin: '0',
            }}>
              Puzzle type "<strong>{puzzleType}</strong>" is not yet implemented.
            </p>
          </div>
        );
    }
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
          Loading puzzle...
        </div>
      </SiteLayout>
    );
  }

  if (!puzzle) {
    return (
      <SiteLayout>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          color: theme.textSecondary,
        }}>
          {error || 'Puzzle not found.'} <a href="/puzzles" style={{ color: theme.accentPrimary, marginLeft: '8px' }}>Go back to puzzles</a>
        </div>
      </SiteLayout>
    );
  }

  // Main puzzle playing view
  return (
    <SiteLayout>
      <style>{styles}</style>
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
          <button onClick={() => navigate('/puzzles')} style={{ background: 'none', border: 'none', color: theme.accentPrimary, cursor: 'pointer' }}>Puzzles</button>
          <span>›</span>
          <span style={{ color: theme.textPrimary }}>{puzzle.title}</span>
        </div>

        {/* Title and Subtitle */}
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
            {puzzle.title}
          </h1>
          <p style={{
            color: theme.textSecondary,
            fontSize: '18px',
            marginBottom: '0',
            margin: '0',
          }}>
            {puzzle.description || 'Solve this puzzle and test your skills'}
          </p>
        </div>

        {/* TWO COLUMN LAYOUT: Puzzle (LEFT) + Sidebar (RIGHT) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 280px',
          gap: '40px',
          marginBottom: '48px',
        }}>
          {/* LEFT: Puzzle Playing Area */}
          <div>
            {/* Puzzle Canvas Card */}
            <div style={{
              background: theme.surfacePrimary,
              border: `2px solid ${theme.accentPrimary}30`,
              borderRadius: '16px',
              padding: '32px',
              marginBottom: '24px',
              boxShadow: `0 12px 32px ${theme.accentPrimary}15`,
              transition: 'all 0.3s ease',
              minHeight: '600px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {renderPuzzleContent()}
            </div>
          </div>

          {/* RIGHT: Sidebar */}
          <div>
            <h2 style={{
              color: theme.textPrimary,
              fontSize: '16px',
              fontWeight: '700',
              marginBottom: '8px',
              margin: '0 0 8px 0',
            }}>
              Change Difficulty
            </h2>
            <p style={{
              color: theme.textSecondary,
              fontSize: '13px',
              marginBottom: '20px',
              margin: '0 0 20px 0',
            }}>
              Select your difficulty
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: '10px',
              marginBottom: '24px',
            }}>
              {['easy', 'medium', 'hard'].map((difficulty, idx) => (
                <button
                  key={difficulty}
                  onClick={() => {
                    setSelectedVariantIdx(idx);
                  }}
                  style={{
                    padding: '14px 12px',
                    background: selectedVariantIdx === idx ? `linear-gradient(135deg, ${theme.accentPrimary}30, ${theme.accentSecondary}20)` : theme.surfacePrimary,
                    color: theme.textPrimary,
                    border: `2px solid ${selectedVariantIdx === idx ? theme.accentPrimary : theme.border}`,
                    borderRadius: '12px',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    textAlign: 'center',
                    textTransform: 'capitalize',
                  }}
                  onMouseOver={(e) => {
                    if (selectedVariantIdx !== idx) {
                      e.currentTarget.style.borderColor = theme.accentPrimary;
                      e.currentTarget.style.background = theme.accentPrimary + '10';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (selectedVariantIdx !== idx) {
                      e.currentTarget.style.borderColor = theme.border;
                      e.currentTarget.style.background = theme.surfacePrimary;
                    }
                  }}
                >
                  {difficulty === 'easy' && '🟢'} {difficulty === 'medium' && '🟡'} {difficulty === 'hard' && '🔴'} {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
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
                Start with an easier difficulty to practice. You can always challenge yourself with harder variants!
              </p>
            </div>
          </div>
        </div>

        {/* LEADERBOARDS AND REVIEWS - FULL WIDTH BELOW */}
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
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '24px',
            }}>
              {['easy', 'medium', 'hard'].map(difficulty => (
                <div key={difficulty} style={{ marginBottom: '0' }}>
                  <h3 style={{
                    color: theme.textPrimary,
                    fontSize: '13px',
                    fontWeight: '600',
                    marginBottom: '12px',
                    paddingBottom: '8px',
                    borderBottom: `1px solid ${theme.border}`,
                    textTransform: 'capitalize',
                  }}>
                    {difficulty === 'easy' && '🟢'} {difficulty === 'medium' && '🟡'} {difficulty === 'hard' && '🔴'} {difficulty}
                  </h3>

                  {leaderboardByDifficulty[difficulty] && leaderboardByDifficulty[difficulty].length > 0 ? (
                    <div style={{
                      display: 'grid',
                      gap: '6px',
                    }}>
                      {leaderboardByDifficulty[difficulty].slice(0, 5).map((entry, index) => (
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
                            {entry.score ? `${entry.score}pts` : '—'}
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
                  transition: 'all 0.3s ease',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = `0 8px 16px ${theme.accentPrimary}40`;
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
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
                          transition: 'all 0.2s ease',
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.transform = 'scale(1.2)';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.transform = 'scale(1)';
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
                    placeholder="Share your thoughts about this puzzle..."
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
                      resize: 'vertical',
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
                    transition: 'all 0.3s ease',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = `0 8px 16px ${theme.accentPrimary}40`;
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
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
