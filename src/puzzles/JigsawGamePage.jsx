import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import JigsawPixiGame from './JigsawPixiGame';

export default function JigsawGamePage({ puzzle }) {
  const { theme } = useTheme();
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [startTime] = useState(Date.now());
  const [moves, setMoves] = useState(0);

  const elapsed = Math.floor((Date.now() - startTime) / 1000);

  if (!puzzle?.data?.imageUrl) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: theme.background,
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px', animation: 'spin 2s linear infinite' }}>🧩</div>
          <p style={{ color: theme.textPrimary, fontSize: '18px' }}>Loading puzzle...</p>
        </div>
      </div>
    );
  }

  const cols = puzzle.data.selectedVariant?.cols || 4;
  const rows = puzzle.data.selectedVariant?.rows || 4;

  return (
    <div style={{
      display: 'flex',
      background: '#f6f6f6',
      fontFamily: 'Arial, sans-serif',
      minHeight: '100vh',
      overflow: 'hidden',
    }}>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        #pixi-container canvas {
          display: block;
        }
      `}</style>

      {/* MAIN PUZZLE AREA - PIXI Game */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f6f6f6',
        }}>
          <JigsawPixiGame
            puzzle={puzzle}
            onProgress={setProgress}
          />
        </div>
      </div>

      {/* RIGHT SIDEBAR */}
      <div style={{
        width: '280px',
        background: '#fff',
        borderLeft: '1px solid #ddd',
        display: 'flex',
        flexDirection: 'column',
        padding: '20px',
        gap: '20px',
        overflowY: 'auto',
      }}>
        {/* Progress Section */}
        <div>
          <div style={{
            fontSize: '16px',
            fontWeight: '600',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            ✓ Progress
          </div>

          {/* Progress bar */}
          <div style={{
            width: '100%',
            height: '8px',
            background: '#ddd',
            borderRadius: '4px',
            overflow: 'hidden',
            marginBottom: '12px',
          }}>
            <div style={{
              height: '100%',
              width: `${engine.progress}%`,
              background: 'linear-gradient(90deg, #FF6B6B, #4ECDC4)',
              transition: 'width 0.3s ease',
            }} />
          </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
              <div style={{ background: '#f5f5f5', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ color: '#FF6B6B', fontSize: '18px', fontWeight: '700', marginBottom: '4px' }}>
                  {String(Math.floor(elapsed / 60)).padStart(2, '0')}:{String(elapsed % 60).padStart(2, '0')}
                </div>
                <div style={{ fontSize: '11px', color: '#666' }}>Time</div>
              </div>

              <div style={{ background: '#f5f5f5', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ color: '#4ECDC4', fontSize: '18px', fontWeight: '700', marginBottom: '4px' }}>
                  {moves}
                </div>
                <div style={{ fontSize: '11px', color: '#666' }}>Moves</div>
              </div>

              <div style={{ background: '#f5f5f5', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ color: '#45B7D1', fontSize: '18px', fontWeight: '700', marginBottom: '4px' }}>
                  {Math.floor(progress)}/100
                </div>
                <div style={{ fontSize: '11px', color: '#666' }}>Pieces</div>
              </div>
            </div>
        </div>

        {/* Hints */}
        <div>
          <div style={{
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            ? Hints
            <span style={{
              background: '#FF9500',
              color: '#fff',
              padding: '2px 8px',
              borderRadius: '4px',
              fontSize: '11px',
              fontWeight: '700',
            }}>
              100 🌟
            </span>
          </div>
        </div>

        {/* Controls */}
        <div>
          <div style={{
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '12px',
          }}>
            Controls
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              onClick={() => setIsPaused(!isPaused)}
              style={{
                padding: '12px',
                background: '#4ECDC4',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              {isPaused ? '▶ Resume' : '⏸ Pause'}
            </button>

            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '12px',
                background: '#ddd',
                color: '#333',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              🔄 Restart
            </button>
          </div>
        </div>

        {/* Completion */}
        {progress === 100 && (
          <div style={{
            padding: '16px',
            background: 'linear-gradient(135deg, #FF6B6B, #4ECDC4)',
            borderRadius: '12px',
            color: '#fff',
            textAlign: 'center',
            marginTop: 'auto',
          }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>🎉</div>
            <div style={{ fontWeight: '600', marginBottom: '8px' }}>Puzzle Complete!</div>
            <div style={{ fontSize: '12px', opacity: 0.9 }}>
              {elapsed}s • {moves} moves
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
