// src/puzzles/PuzzleDetailPage.jsx
// Shows puzzle details and difficulty variant selector
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { db } from "../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import SiteLayout from "../layouts/SiteLayout";

export default function PuzzleDetailPage() {
  const { puzzleId } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [puzzle, setPuzzle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPuzzle = async () => {
      try {
        setLoading(true);
        const docRef = doc(db, 'puzzles', puzzleId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPuzzle({ id: docSnap.id, ...docSnap.data() });
        } else {
          setError('Puzzle not found');
        }
      } catch (err) {
        console.error('Error loading puzzle:', err);
        setError('Failed to load puzzle');
      } finally {
        setLoading(false);
      }
    };

    if (puzzleId) {
      loadPuzzle();
    }
  }, [puzzleId]);

  const handleVariantSelect = (variant) => {
    // Navigate to game page with selected variant
    navigate(
      `/puzzles/play/${puzzleId}?variant=${encodeURIComponent(variant.label)}`
    );
  };

  if (loading) {
    return (
      <SiteLayout>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '50vh',
          color: theme.textSecondary 
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>⏳</div>
            <p>Loading puzzle...</p>
          </div>
        </div>
      </SiteLayout>
    );
  }

  if (error) {
    return (
      <SiteLayout>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '50vh' 
        }}>
          <div style={{
            background: theme.surfaceSecondary,
            border: `2px solid ${theme.border}`,
            borderRadius: 12,
            padding: 24,
            textAlign: 'center',
            maxWidth: 400
          }}>
            <h2 style={{ margin: '0 0 12px 0', color: theme.textPrimary }}>❌ Error</h2>
            <p style={{ margin: '0 0 16px 0', color: theme.textSecondary }}>{error}</p>
            <button
              onClick={() => navigate(-1)}
              style={{
                padding: '10px 16px',
                borderRadius: 8,
                border: `2px solid ${theme.border}`,
                background: theme.primary,
                color: theme.onPrimary,
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              ← Go Back
            </button>
          </div>
        </div>
      </SiteLayout>
    );
  }

  if (!puzzle) {
    return (
      <SiteLayout>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '50vh' 
        }}>
          <div style={{
            background: theme.surfaceSecondary,
            border: `2px solid ${theme.border}`,
            borderRadius: 12,
            padding: 24,
            textAlign: 'center',
            maxWidth: 400
          }}>
            <h2 style={{ margin: '0 0 12px 0', color: theme.textPrimary }}>🤔 Not Found</h2>
            <p style={{ margin: '0 0 16px 0', color: theme.textSecondary }}>We couldn't find this puzzle.</p>
            <button
              onClick={() => navigate(-1)}
              style={{
                padding: '10px 16px',
                borderRadius: 8,
                border: `2px solid ${theme.border}`,
                background: theme.primary,
                color: theme.onPrimary,
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              ← Go Back
            </button>
          </div>
        </div>
      </SiteLayout>
    );
  }

  // Calculate difficulty from variants if available
  const getDifficultyBadge = (variant) => {
    const label = variant.label?.toLowerCase() || '';
    if (label.includes('easy')) return { color: '#10b981', label: '🟢 Easy' };
    if (label.includes('medium') || label.includes('intermediate')) return { color: '#f59e0b', label: '🟡 Medium' };
    if (label.includes('hard') || label.includes('expert')) return { color: '#ef4444', label: '🔴 Hard' };
    return { color: theme.textSecondary, label: variant.label };
  };

  // For Jigsaw puzzles with variants
  const hasVariants = puzzle.variants && Array.isArray(puzzle.variants) && puzzle.variants.length > 0;
  const displayVariants = hasVariants ? puzzle.variants : [];

  return (
    <SiteLayout>
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '24px 16px' }}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              marginBottom: 16,
              padding: '8px 12px',
              borderRadius: 6,
              border: `1px solid ${theme.border}`,
              background: theme.surfaceSecondary,
              color: theme.textPrimary,
              cursor: 'pointer',
              fontSize: 13
            }}
          >
            ← Back
          </button>

          <h1 style={{ margin: '0 0 8px 0', color: theme.textPrimary, fontSize: 32 }}>
            {puzzle.title || 'Untitled Puzzle'}
          </h1>

          {puzzle.description && (
            <p style={{ margin: '0 0 16px 0', color: theme.textSecondary, fontSize: 15 }}>
              {puzzle.description}
            </p>
          )}

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {puzzle.difficulty && (
              <span style={{
                padding: '6px 12px',
                borderRadius: 6,
                background: theme.surfaceSecondary,
                color: theme.textPrimary,
                fontSize: 13,
                fontWeight: 600
              }}>
                Difficulty: {puzzle.difficulty}
              </span>
            )}
            {puzzle.xpReward && (
              <span style={{
                padding: '6px 12px',
                borderRadius: 6,
                background: theme.surfaceSecondary,
                color: theme.textPrimary,
                fontSize: 13,
                fontWeight: 600
              }}>
                🎯 {puzzle.xpReward} XP
              </span>
            )}
          </div>
        </div>

        {/* Puzzle Image Preview (for Jigsaw) */}
        {puzzle.type === 'jigsaw' && puzzle.imageUrl && (
          <div style={{
            marginBottom: 32,
            borderRadius: 12,
            overflow: 'hidden',
            border: `2px solid ${theme.border}`,
            background: theme.surfaceSecondary
          }}>
            <img
              src={puzzle.imageUrl}
              alt={puzzle.title}
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: 300,
                objectFit: 'cover',
                display: 'block'
              }}
            />
          </div>
        )}

        {/* Variants Selector */}
        {displayVariants.length > 0 && (
          <div>
            <h2 style={{ margin: '0 0 16px 0', color: theme.textPrimary, fontSize: 20 }}>
              🎮 Choose Difficulty
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: 16
            }}>
              {displayVariants.map((variant, idx) => {
                const difficulty = getDifficultyBadge(variant);
                const pieceCount = variant.rows && variant.cols 
                  ? variant.rows * variant.cols 
                  : null;

                return (
                  <button
                    key={idx}
                    onClick={() => handleVariantSelect(variant)}
                    style={{
                      padding: 20,
                      borderRadius: 12,
                      border: `2px solid ${theme.border}`,
                      background: theme.surfaceSecondary,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      textAlign: 'left',
                      ':hover': {
                        borderColor: theme.primary,
                        background: theme.primary
                      }
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.borderColor = theme.primary;
                      e.target.style.background = theme.primary;
                      e.target.style.color = theme.onPrimary;
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.borderColor = theme.border;
                      e.target.style.background = theme.surfaceSecondary;
                      e.target.style.color = theme.textPrimary;
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'start',
                      marginBottom: 12
                    }}>
                      <div>
                        <h3 style={{ margin: '0 0 4px 0', fontSize: 18, fontWeight: 700, color: 'inherit' }}>
                          {variant.label}
                        </h3>
                        <span style={{
                          display: 'inline-block',
                          padding: '4px 8px',
                          borderRadius: 4,
                          background: difficulty.color,
                          color: '#fff',
                          fontSize: 11,
                          fontWeight: 600
                        }}>
                          {difficulty.label}
                        </span>
                      </div>
                    </div>

                    <div style={{
                      fontSize: 13,
                      color: 'inherit',
                      opacity: 0.8
                    }}>
                      {pieceCount && (
                        <>
                          <p style={{ margin: '0 0 4px 0' }}>
                            🧩 {pieceCount} pieces
                          </p>
                          <p style={{ margin: 0 }}>
                            Grid: {variant.rows} × {variant.cols}
                          </p>
                        </>
                      )}
                    </div>

                    <div style={{
                      marginTop: 12,
                      paddingTop: 12,
                      borderTop: `1px solid ${difficulty.color}30`,
                      fontSize: 12,
                      fontWeight: 600,
                      color: 'inherit'
                    }}>
                      Play Now →
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* No variants message */}
        {displayVariants.length === 0 && (
          <div style={{
            background: theme.surfaceSecondary,
            border: `2px solid ${theme.border}`,
            borderRadius: 12,
            padding: 24,
            textAlign: 'center'
          }}>
            <button
              onClick={() => navigate(`/puzzles/play/${puzzleId}`)}
              style={{
                padding: '12px 24px',
                borderRadius: 8,
                border: `2px solid ${theme.border}`,
                background: theme.primary,
                color: theme.onPrimary,
                fontWeight: 700,
                fontSize: 16,
                cursor: 'pointer'
              }}
            >
              ▶️ Play Puzzle
            </button>
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
