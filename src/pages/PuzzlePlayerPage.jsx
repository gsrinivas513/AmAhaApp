import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import SiteLayout from '../layouts/SiteLayout';
import { useTheme } from '../context/ThemeContext';
import OrderingPuzzle from '../puzzles/OrderingPuzzle';
import MatchingPuzzle from '../puzzles/MatchingPuzzle';
import DragPuzzle from '../puzzles/DragPuzzle';
import JigsawPuzzle from '../puzzles/renderers/JigsawPuzzle';
import PuzzleHeader from '../puzzles/components/PuzzleHeader';

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
  const [puzzle, setPuzzle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState('easy');

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
        setLoading(false);
      } catch (error) {
        console.error('❌ [PuzzlePlayerPage] Error loading puzzle:', error);
        setError('Failed to load puzzle');
        setLoading(false);
      }
    };

    loadPuzzle();
  }, [id]);

  if (loading) {
    return (
      <SiteLayout>
        <style>{styles}</style>
        <div style={{
          background: theme.background,
          minHeight: '100vh',
          padding: '40px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px', animation: 'spin 2s linear infinite' }}>
              🧩
            </div>
            <p style={{
              color: theme.textPrimary,
              fontSize: '20px',
              fontWeight: '600',
            }}>
              Loading puzzle...
            </p>
          </div>
        </div>
      </SiteLayout>
    );
  }

  if (error || !puzzle) {
    return (
      <SiteLayout>
        <div style={{
          background: theme.background,
          minHeight: '100vh',
          padding: '40px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{ textAlign: 'center', maxWidth: '600px' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>❌</div>
            <p style={{
              color: theme.textPrimary,
              fontSize: '20px',
              fontWeight: '600',
              marginBottom: '16px',
            }}>
              {error || 'Puzzle not found'}
            </p>
            <button
              onClick={() => navigate('/puzzles')}
              style={{
                padding: '12px 32px',
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
                e.target.style.transform = 'translateY(0)';
              }}
            >
              Back to Puzzles
            </button>
          </div>
        </div>
      </SiteLayout>
    );
  }

  // Render puzzle content based on type
  const renderPuzzleContent = () => {
    switch (puzzle.type?.toLowerCase()) {
      case 'jigsaw':
        const jigsawData = {
          data: {
            imageUrl: puzzle.imageUrl,
            variants: puzzle.variants || [
              { name: 'Easy (3×4)', cols: 3, rows: 4 },
              { name: 'Medium (4×5)', cols: 4, rows: 5 },
              { name: 'Hard (6×6)', cols: 6, rows: 6 },
            ],
          },
          imageUrl: puzzle.imageUrl,
          variants: puzzle.variants,
        };
        return <JigsawPuzzle puzzle={jigsawData} />;

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
              Puzzle type "<strong>{puzzle.type}</strong>" is not yet implemented.
            </p>
          </div>
        );
    }
  };

  return (
    <SiteLayout>
      <style>{styles}</style>
      <div style={{
        background: theme.background,
        minHeight: '100vh',
        padding: '12px 12px 32px 12px',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Header - with breadcrumbs */}
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          width: '100%',
          marginBottom: '24px',
        }}>
          <PuzzleHeader puzzle={puzzle} onNavigate={(target) => {
            if (target === 'home') navigate('/');
            else if (target === 'puzzles') navigate('/puzzles');
          }} />
        </div>

        {/* Main content area with two-column layout */}
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          width: '100%',
          display: 'grid',
          gridTemplateColumns: '1fr 280px',
          gap: '24px',
          flex: 1,
        }}>
          {/* Left: Puzzle Game Area */}
          <div style={{
            background: theme.surfacePrimary,
            borderRadius: '12px',
            padding: '24px',
            minHeight: '600px',
            border: `1px solid ${theme.border}`,
          }}>
            {renderPuzzleContent()}
          </div>

          {/* Right: Sidebar */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}>
            {/* Change Variant / Difficulty Card */}
            <div style={{
              background: theme.surfacePrimary,
              border: `1px solid ${theme.border}`,
              borderRadius: '12px',
              padding: '16px',
            }}>
              <h3 style={{
                fontSize: '14px',
                fontWeight: '700',
                color: theme.textPrimary,
                margin: '0 0 12px 0',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}>
                🎮 Difficulty
              </h3>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}>
                {['easy', 'medium', 'hard'].map((difficulty) => {
                  const isActive = selectedDifficulty === difficulty;
                  const diffColors = {
                    easy: { bg: '#bbf7d0', text: '#047857', border: '#6ee7b7' },
                    medium: { bg: '#fef3c7', text: '#92400e', border: '#fcd34d' },
                    hard: { bg: '#fecaca', text: '#991b1b', border: '#fca5a5' },
                  };
                  const colors = diffColors[difficulty] || diffColors.medium;
                  const emojis = {
                    easy: '🟢',
                    medium: '🟡',
                    hard: '🔴',
                  };

                  return (
                    <button
                      key={difficulty}
                      onClick={() => setSelectedDifficulty(difficulty)}
                      style={{
                        padding: '12px 16px',
                        borderRadius: '8px',
                        border: isActive ? `2px solid ${colors.text}` : `1px solid ${theme.border}`,
                        background: isActive ? colors.bg : theme.surfaceSecondary,
                        color: colors.text,
                        fontSize: '14px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        textTransform: 'capitalize',
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.target.style.borderColor = colors.text;
                          e.target.style.background = `${colors.text}15`;
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.target.style.borderColor = theme.border;
                          e.target.style.background = theme.surfaceSecondary;
                        }
                      }}
                    >
                      {emojis[difficulty]} {difficulty}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Puzzle Info Card */}
            <div style={{
              background: theme.surfacePrimary,
              border: `1px solid ${theme.border}`,
              borderRadius: '12px',
              padding: '16px',
            }}>
              <h3 style={{
                fontSize: '14px',
                fontWeight: '700',
                color: theme.textPrimary,
                margin: '0 0 12px 0',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}>
                📋 Info
              </h3>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}>
                {puzzle.ageGroup && (
                  <div>
                    <p style={{
                      fontSize: '12px',
                      color: theme.textSecondary,
                      margin: '0 0 4px 0',
                      fontWeight: '600',
                    }}>
                      Age Group
                    </p>
                    <p style={{
                      fontSize: '14px',
                      color: theme.textPrimary,
                      margin: '0',
                      fontWeight: '600',
                    }}>
                      {puzzle.ageGroup}
                    </p>
                  </div>
                )}

                {puzzle.type && (
                  <div>
                    <p style={{
                      fontSize: '12px',
                      color: theme.textSecondary,
                      margin: '0 0 4px 0',
                      fontWeight: '600',
                    }}>
                      Type
                    </p>
                    <p style={{
                      fontSize: '14px',
                      color: theme.textPrimary,
                      margin: '0',
                      fontWeight: '600',
                    }}>
                      {puzzle.type.charAt(0).toUpperCase() + puzzle.type.slice(1)}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Leaderboards Preview */}
            <div style={{
              background: theme.surfacePrimary,
              border: `1px solid ${theme.border}`,
              borderRadius: '12px',
              padding: '16px',
            }}>
              <h3 style={{
                fontSize: '14px',
                fontWeight: '700',
                color: theme.textPrimary,
                margin: '0 0 8px 0',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}>
                🏆 Leaderboards
              </h3>
              <p style={{
                fontSize: '12px',
                color: theme.textSecondary,
                margin: '0',
                lineHeight: '1.5',
              }}>
                Coming soon
              </p>
            </div>

            {/* Reviews Preview */}
            <div style={{
              background: theme.surfacePrimary,
              border: `1px solid ${theme.border}`,
              borderRadius: '12px',
              padding: '16px',
            }}>
              <h3 style={{
                fontSize: '14px',
                fontWeight: '700',
                color: theme.textPrimary,
                margin: '0 0 8px 0',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}>
                ⭐ Reviews
              </h3>
              <p style={{
                fontSize: '12px',
                color: theme.textSecondary,
                margin: '0',
                lineHeight: '1.5',
              }}>
                Coming soon
              </p>
            </div>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
