import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import SiteLayout from '../layouts/SiteLayout';
import { useTheme } from '../context/ThemeContext';
import OrderingPuzzle from '../puzzles/OrderingPuzzle';

// Add spinning animation
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

  useEffect(() => {
    const loadPuzzle = async () => {
      try {
        console.log('📂 [PuzzlePlayerPage] Loading puzzle:', id);
        setLoading(true);

        // Load puzzle from Firestore
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
          <div style={{
            textAlign: 'center',
          }}>
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
          <div style={{
            textAlign: 'center',
            maxWidth: '600px',
          }}>
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
              onClick={() => navigate('/puzzle')}
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

  // Render type-specific puzzle player
  const renderPuzzlePlayer = () => {
    switch (puzzle.type?.toLowerCase()) {
      case 'ordering':
        return (
          <OrderingPuzzle 
            puzzle={puzzle} 
            isInline={true}
            onComplete={() => {
              console.log('✅ [PuzzlePlayerPage] Puzzle completed!');
              navigate('/puzzle');
            }}
          />
        );
      
      default:
        return (
          <div style={{
            maxWidth: '1000px',
            margin: '0 auto',
          }}>
            {/* Breadcrumb */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '32px',
              color: theme.textSecondary,
              fontSize: '14px',
            }}>
              <button
                onClick={() => navigate('/puzzle')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: theme.accentPrimary,
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
              >
                Puzzles
              </button>
              <span>›</span>
              <span style={{ color: theme.textPrimary }}>{puzzle.title}</span>
            </div>

            {/* Header */}
            <div style={{
              marginBottom: '40px',
            }}>
              <h1 style={{
                color: theme.textPrimary,
                fontSize: '48px',
                fontWeight: '700',
                margin: '0 0 8px 0',
              }}>
                {puzzle.title}
              </h1>
              <p style={{
                color: theme.textSecondary,
                fontSize: '16px',
                margin: '0',
              }}>
                {puzzle.description}
              </p>
            </div>

            {/* Puzzle Info */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '16px',
              marginBottom: '40px',
            }}>
              <div style={{
                background: theme.surfacePrimary,
                border: `1px solid ${theme.border}`,
                borderRadius: '12px',
                padding: '16px',
              }}>
                <p style={{
                  color: theme.textSecondary,
                  fontSize: '12px',
                  fontWeight: '600',
                  margin: '0 0 8px 0',
                }}>
                  Type
                </p>
                <p style={{
                  color: theme.textPrimary,
                  fontSize: '18px',
                  fontWeight: '700',
                  margin: '0',
                }}>
                  {puzzle.type || 'Unknown'}
                </p>
              </div>

              <div style={{
                background: theme.surfacePrimary,
                border: `1px solid ${theme.border}`,
                borderRadius: '12px',
                padding: '16px',
              }}>
                <p style={{
                  color: theme.textSecondary,
                  fontSize: '12px',
                  fontWeight: '600',
                  margin: '0 0 8px 0',
                }}>
                  Difficulty
                </p>
                <p style={{
                  color: theme.textPrimary,
                  fontSize: '18px',
                  fontWeight: '700',
                  margin: '0',
                }}>
                  {puzzle.difficulty || 'Unknown'}
                </p>
              </div>

              {puzzle.ageGroup && (
                <div style={{
                  background: theme.surfacePrimary,
                  border: `1px solid ${theme.border}`,
                  borderRadius: '12px',
                  padding: '16px',
                }}>
                  <p style={{
                    color: theme.textSecondary,
                    fontSize: '12px',
                    fontWeight: '600',
                    margin: '0 0 8px 0',
                  }}>
                    Age Group
                  </p>
                  <p style={{
                    color: theme.textPrimary,
                    fontSize: '18px',
                    fontWeight: '700',
                    margin: '0',
                  }}>
                    {puzzle.ageGroup}
                  </p>
                </div>
              )}
            </div>

            {/* Coming Soon Notice */}
            <div style={{
              background: `linear-gradient(135deg, ${theme.accentPrimary}20, ${theme.accentSecondary}20)`,
              border: `2px solid ${theme.accentPrimary}30`,
              borderRadius: '16px',
              padding: '32px',
              marginBottom: '40px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚀</div>
              <h2 style={{
                color: theme.textPrimary,
                fontSize: '24px',
                fontWeight: '700',
                margin: '0 0 12px 0',
              }}>
                Coming Soon
              </h2>
              <p style={{
                color: theme.textSecondary,
                fontSize: '16px',
                lineHeight: '1.6',
                margin: '0',
              }}>
                Puzzle type "<strong>{puzzle.type}</strong>" player is not yet implemented. 
                Check back soon!
              </p>
            </div>

            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}>
              <button
                onClick={() => navigate('/puzzle')}
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
                ← Back to Puzzles
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <SiteLayout>
      <div style={{
        background: theme.background,
        minHeight: '100vh',
        padding: '40px 20px',
      }}>
        {renderPuzzlePlayer()}
      </div>
    </SiteLayout>
  );
}
