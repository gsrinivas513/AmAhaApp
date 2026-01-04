import React, { useState } from 'react';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

export default function JigsawPuzzleFixture() {
  const [status, setStatus] = useState('');
  const [puzzleId, setPuzzleId] = useState('');

  const createTestPuzzle = async () => {
    try {
      setStatus('Creating test puzzle...');

      // Use the SVG test image from JigsawTest
      const testImageUrl = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImdyYWQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNGRjZCNkI7c3RvcC1vcGFjaXR5OjEiIC8+PHN0b3Agb2Zmc2V0PSI1MCUiIHN0eWxlPSJzdG9wLWNvbG9yOiM0RUNEQzQ7c3RvcC1vcGFjaXR5OjEiIC8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojNDVCN0QxO3N0b3Atb3BhY2l0eToxIiAvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSI2MDAiIGhlaWdodD0iNDAwIiBmaWxsPSJ1cmwoI2dyYWQpIi8+PGNpcmNsZSBjeD0iMTUwIiBjeT0iMTAwIiByPSI1MCIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjMpIi8+PGNpcmNsZSBjeD0iNDUwIiBjeT0iMzAwIiByPSI2MCIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjMpIi8+PGNpcmNsZSBjeD0iMzAwIiBjeT0iMjAwIiByPSI0MCIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjIpIi8+PHRleHQgeD0iMzAwIiB5PSIyMDAiIGZvbnQtc2l6ZT0iNDgiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+SklHU0FXPC90ZXh0Pjwvc3ZnPg==';

      const jigsawPuzzle = {
        type: 'jigsaw',
        title: 'Test Jigsaw Puzzle',
        description: 'A test jigsaw puzzle for verifying the implementation',
        category: 'test',
        difficulty: 'easy',
        imageUrl: testImageUrl,
        variants: [
          { name: '3x4', rows: 3, cols: 4 },
          { name: '4x6', rows: 4, cols: 6 },
        ],
        status: 'published',
        visibility: 'public',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const docRef = await addDoc(collection(db, 'puzzles'), jigsawPuzzle);
      setPuzzleId(docRef.id);
      setStatus(`✅ Puzzle created! ID: ${docRef.id}`);
    } catch (error) {
      setStatus(`❌ Error: ${error.message}`);
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Jigsaw Puzzle Test Fixture</h1>
      <p>Create a test jigsaw puzzle in Firestore to test real data loading</p>
      
      <button
        onClick={createTestPuzzle}
        style={{
          padding: '12px 24px',
          background: '#6366f1',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: '600',
          cursor: 'pointer',
          marginBottom: '20px',
        }}
      >
        Create Test Puzzle
      </button>

      {status && (
        <div style={{
          padding: '16px',
          background: '#f0f0f0',
          borderRadius: '8px',
          marginBottom: '20px',
          fontFamily: 'monospace',
          whiteSpace: 'pre-wrap',
        }}>
          {status}
        </div>
      )}

      {puzzleId && (
        <div style={{
          padding: '16px',
          background: '#e8f5e9',
          borderRadius: '8px',
          marginTop: '20px',
        }}>
          <p style={{ marginBottom: '12px' }}>Test the puzzle:</p>
          <a
            href={`/play/puzzle/${puzzleId}`}
            style={{
              display: 'inline-block',
              padding: '10px 16px',
              background: '#4caf50',
              color: '#fff',
              textDecoration: 'none',
              borderRadius: '6px',
              fontWeight: '600',
            }}
          >
            Open Puzzle ({puzzleId})
          </a>
        </div>
      )}
    </div>
  );
}
