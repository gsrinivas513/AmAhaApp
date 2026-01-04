import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';

export default function PuzzleHeader({ puzzle, onNavigate }) {
  const navigate = useNavigate();
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBreadcrumbs = async () => {
      try {
        // Get category name from puzzle if available
        const puzzleName = puzzle?.name || 'Puzzle';
        const categoryName = puzzle?.category || 'Puzzles';
        
        setBreadcrumbs([
          { label: 'Home', path: '/' },
          { label: categoryName, path: '/puzzles' },
          { label: puzzleName, path: null },
        ]);
      } catch (error) {
        console.error('Error loading breadcrumbs:', error);
      } finally {
        setLoading(false);
      }
    };

    if (puzzle) {
      loadBreadcrumbs();
    }
  }, [puzzle]);

  const handleBreadcrumbClick = (path) => {
    if (path) {
      navigate(path);
    }
  };

  return (
    <div style={{ marginBottom: 24, flexShrink: 0 }}>
      {/* Breadcrumb Navigation */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginBottom: 16,
        flexWrap: 'wrap',
      }}>
        {breadcrumbs.map((crumb, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {idx > 0 && (
              <span style={{ color: '#9CA3AF', fontSize: 16, fontWeight: 500 }}>
                ›
              </span>
            )}
            {crumb.path ? (
              <button
                onClick={() => handleBreadcrumbClick(crumb.path)}
                style={{
                  color: '#2563EB',
                  fontWeight: 500,
                  fontSize: 14,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textDecoration: 'none',
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={(e) => e.target.style.color = '#1D4ED8'}
                onMouseLeave={(e) => e.target.style.color = '#2563EB'}
              >
                {crumb.label}
              </button>
            ) : (
              <span style={{ color: '#6B7280', fontWeight: 500, fontSize: 14 }}>
                {crumb.label}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Puzzle Title */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{
          fontSize: 28,
          fontWeight: 800,
          margin: 0,
          marginBottom: 8,
          color: '#1F2937',
        }}>
          {puzzle?.name || 'Puzzle'}
        </h1>
        {puzzle?.description && (
          <p style={{
            fontSize: 14,
            color: '#6B7280',
            margin: 0,
            lineHeight: 1.5,
          }}>
            {puzzle.description}
          </p>
        )}
      </div>

      {/* Divider */}
      <div style={{
        height: 1,
        background: '#E5E7EB',
        marginBottom: 24,
      }} />
    </div>
  );
}
