// src/components/SeriesPicker.jsx
// Component for displaying and browsing puzzle series

import React, { useState, useEffect } from 'react';
import { getPublishedSeries, getSeriesPuzzles } from '../services/seriesService';

function SeriesPicker({ onSelectSeries, onSelectPuzzle }) {
  const [series, setSeries] = useState([]);
  const [selectedSeries, setSelectedSeries] = useState(null);
  const [seriesPuzzles, setSeriesPuzzles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true';
    setTheme(isDark ? 'dark' : 'light');
    loadPublishedSeries();
  }, []);

  const loadPublishedSeries = async () => {
    try {
      setLoading(true);
      const publishedSeries = await getPublishedSeries();
      setSeries(publishedSeries);
    } catch (error) {
      console.error('Error loading series:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSeries = async (s) => {
    setSelectedSeries(s);
    try {
      const puzzles = await getSeriesPuzzles(s.id);
      setSeriesPuzzles(puzzles);
      if (onSelectSeries) {
        onSelectSeries(s);
      }
    } catch (error) {
      console.error('Error loading series puzzles:', error);
    }
  };

  const isDark = theme === 'dark';
  const bgColor = isDark ? 'rgba(30, 40, 70, 0.6)' : 'rgba(255, 255, 255, 0.8)';
  const textColor = isDark ? '#e0e0e0' : '#333';
  const borderColor = isDark ? 'rgba(255, 255, 255, 0.1)' : '#e0e0e0';
  const accentColor = '#FF6633';

  if (loading) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '40px 20px',
        color: isDark ? '#aaa' : '#666',
      }}>
        Loading puzzle series...
      </div>
    );
  }

  if (series.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '40px 20px',
        color: isDark ? '#aaa' : '#666',
      }}>
        No puzzle series available yet
      </div>
    );
  }

  return (
    <div style={{
      background: bgColor,
      borderRadius: '12px',
      padding: '20px',
      color: textColor,
    }}>
      <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px', margin: '0 0 20px 0' }}>
        📚 Puzzle Series
      </h3>

      {!selectedSeries ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '16px',
        }}>
          {series.map((s) => (
            <div
              key={s.id}
              onClick={() => handleSelectSeries(s)}
              style={{
                padding: '16px',
                background: isDark ? '#1a2540' : '#ffffff',
                border: `2px solid ${borderColor}`,
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                overflow: 'hidden',
                position: 'relative',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = accentColor;
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = `0 8px 16px rgba(255, 102, 51, 0.15)`;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = borderColor;
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '12px',
              }}>
                <div style={{
                  fontSize: '32px',
                  width: '50px',
                  height: '50px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: s.color + '20',
                  borderRadius: '8px',
                }}>
                  {s.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: 'bold' }}>
                    {s.name}
                  </h4>
                  <p style={{ margin: 0, fontSize: '12px', color: isDark ? '#aaa' : '#666' }}>
                    {s.puzzleCount || 0} puzzles
                  </p>
                </div>
              </div>

              {s.description && (
                <p style={{
                  margin: '8px 0 12px 0',
                  fontSize: '13px',
                  color: isDark ? '#aaa' : '#666',
                  lineHeight: '1.4',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}>
                  {s.description}
                </p>
              )}

              <div style={{
                padding: '8px 12px',
                background: accentColor + '20',
                borderRadius: '4px',
                textAlign: 'center',
                fontSize: '12px',
                fontWeight: 'bold',
                color: accentColor,
              }}>
                View Series →
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>
          {/* Back to Series List */}
          <button
            onClick={() => {
              setSelectedSeries(null);
              setSeriesPuzzles([]);
            }}
            style={{
              marginBottom: '20px',
              padding: '10px 16px',
              background: isDark ? '#2a3550' : '#f0f0f0',
              color: textColor,
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            ← Back to Series
          </button>

          {/* Series Header */}
          <div style={{
            padding: '16px',
            background: isDark ? '#1a2540' : '#ffffff',
            border: `2px solid ${selectedSeries.color}20`,
            borderRadius: '8px',
            marginBottom: '20px',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '12px',
            }}>
              <div style={{
                fontSize: '40px',
                width: '60px',
                height: '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: selectedSeries.color + '20',
                borderRadius: '8px',
              }}>
                {selectedSeries.icon}
              </div>
              <div>
                <h2 style={{ margin: '0 0 4px 0', fontSize: '20px', fontWeight: 'bold' }}>
                  {selectedSeries.name}
                </h2>
                {selectedSeries.description && (
                  <p style={{ margin: 0, fontSize: '13px', color: isDark ? '#aaa' : '#666' }}>
                    {selectedSeries.description}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Puzzles Grid */}
          <div>
            <h4 style={{
              fontSize: '14px',
              fontWeight: 'bold',
              marginBottom: '12px',
              color: textColor,
            }}>
              Puzzles ({seriesPuzzles.length})
            </h4>

            {seriesPuzzles.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '40px 20px',
                background: isDark ? '#1a2540' : '#f9f9f9',
                borderRadius: '8px',
                color: isDark ? '#aaa' : '#666',
              }}>
                This series has no puzzles yet
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                gap: '12px',
              }}>
                {seriesPuzzles.map((puzzle) => (
                  <div
                    key={puzzle.id}
                    onClick={() => {
                      if (onSelectPuzzle) {
                        onSelectPuzzle(puzzle);
                      }
                    }}
                    style={{
                      padding: '12px',
                      background: isDark ? '#1a2540' : '#ffffff',
                      border: `1px solid ${borderColor}`,
                      borderRadius: '6px',
                      cursor: onSelectPuzzle ? 'pointer' : 'default',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseOver={(e) => {
                      if (onSelectPuzzle) {
                        e.currentTarget.style.borderColor = accentColor;
                        e.currentTarget.style.background = isDark ? '#202540' : '#f9f9f9';
                      }
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.borderColor = borderColor;
                      e.currentTarget.style.background = isDark ? '#1a2540' : '#ffffff';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <span style={{ fontSize: '18px' }}>{puzzle.icon}</span>
                      <span style={{ fontWeight: 'bold', fontSize: '14px', flex: 1 }}>
                        {puzzle.title}
                      </span>
                    </div>
                    <p style={{
                      margin: 0,
                      fontSize: '11px',
                      color: isDark ? '#aaa' : '#666',
                    }}>
                      {puzzle.type === 'quiz' ? '📝 Quiz' : '🧩 Visual Puzzle'}
                    </p>
                    {onSelectPuzzle && (
                      <div style={{
                        marginTop: '8px',
                        padding: '6px',
                        background: accentColor + '20',
                        borderRadius: '4px',
                        textAlign: 'center',
                        fontSize: '11px',
                        fontWeight: 'bold',
                        color: accentColor,
                      }}>
                        Play →
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default SeriesPicker;
