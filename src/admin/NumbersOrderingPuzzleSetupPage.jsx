/**
 * NumbersOrderingPuzzleSetupPage.jsx
 * Admin page to set up or update the Numbers ordering puzzle with configurable ranges
 */

import React, { useState } from 'react';
import { collection, getDocs, updateDoc, doc, addDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import AdminLayout from './AdminLayout';

export default function NumbersOrderingPuzzleSetupPage() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [maxRange, setMaxRange] = useState(50);
  const [success, setSuccess] = useState(false);

  const setupNumbersPuzzle = async () => {
    setLoading(true);
    setStatus('');
    setSuccess(false);

    try {
      // Step 1: Generate items for numbers
      setStatus(`Generating ${maxRange} number cards...`);
      const items = [];
      for (let i = 1; i <= maxRange; i++) {
        items.push({
          id: `num-${i}`,
          label: `${i}`,
          number: i,
          image: `https://via.placeholder.com/80/0000FF/ffffff?text=${i}`,
          order: i,
        });
      }

      // Step 2: Generate ranges (groups of 10)
      setStatus('Creating number ranges (10 per range)...');
      const numberRanges = [];
      for (let i = 1; i <= maxRange; i += 10) {
        const start = i;
        const end = Math.min(i + 9, maxRange);
        numberRanges.push({
          label: `${start}-${end}`,
          min: start,
          max: end,
        });
      }

      // Step 3: Generate correct order
      const correctOrder = Array.from({ length: maxRange }, (_, idx) => idx + 1);

      // Step 4: Find existing puzzle or create new one
      setStatus('Searching for existing Numbers puzzle...');
      const puzzlesSnap = await getDocs(collection(db, 'puzzles'));
      let existingPuzzle = null;
      let puzzleId = null;

      for (const puzzleDoc of puzzlesSnap.docs) {
        const data = puzzleDoc.data();
        if (data.subtopicId === 'ordering-numbers' && data.type === 'ordering') {
          existingPuzzle = puzzleDoc;
          puzzleId = puzzleDoc.id;
          break;
        }
      }

      const puzzleData = {
        title: `Number Sequence 1-${maxRange}`,
        description: `Arrange numbers in correct order - choose a range from the available options (10 numbers per range)`,
        type: 'ordering',
        category: 'Logic Puzzles',
        categoryId: 'logic-puzzles',
        topic: 'Ordering',
        topicId: 'ordering',
        subtopic: 'Number Sequences',
        subtopicId: 'ordering-numbers',
        difficulty: 'medium',
        ageGroup: '6-8',
        featureId: 'puzzles',
        isPublished: true,
        data: {
          maxRange,
          numberRanges,
          items,
          correctOrder,
        },
        updatedAt: new Date(),
      };

      if (existingPuzzle) {
        setStatus(`Updating existing puzzle (ID: ${puzzleId})...`);
        await updateDoc(doc(db, 'puzzles', puzzleId), puzzleData);
        setStatus(`✅ Successfully updated puzzle with ${maxRange} numbers!`);
      } else {
        setStatus('Creating new Numbers puzzle...');
        const newDoc = await addDoc(collection(db, 'puzzles'), {
          ...puzzleData,
          createdAt: new Date(),
        });
        puzzleId = newDoc.id;
        setStatus(`✅ Successfully created new puzzle! ID: ${puzzleId}`);
      }

      setSuccess(true);
    } catch (error) {
      console.error('Error:', error);
      setStatus(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h2>🔢 Numbers Ordering Puzzle Setup</h2>
        <p>Configure and set up the Numbers puzzle with custom ranges</p>

        <div style={{
          backgroundColor: '#f5f5f5',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '20px',
        }}>
          <h3>Configuration</h3>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              Maximum Number Range:
            </label>
            <input
              type="number"
              min="10"
              step="10"
              max="100"
              value={maxRange}
              onChange={(e) => setMaxRange(Math.max(10, parseInt(e.target.value) || 10))}
              disabled={loading}
              style={{
                padding: '8px',
                fontSize: '16px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                width: '150px',
              }}
            />
            <p style={{ margin: '8px 0 0 0', fontSize: '0.9rem', color: '#666' }}>
              Will create ranges of 10 numbers each (e.g., 1-10, 11-20, 21-30...)
            </p>
          </div>

          <div style={{
            backgroundColor: '#e3f2fd',
            padding: '15px',
            borderRadius: '4px',
            marginBottom: '20px',
            borderLeft: '4px solid #2196F3',
          }}>
            <h4 style={{ margin: '0 0 10px 0' }}>📊 Preview</h4>
            <p style={{ margin: '0' }}>
              Will create <strong>{maxRange}</strong> number cards across{' '}
              <strong>{Math.ceil(maxRange / 10)}</strong> selectable ranges:
            </p>
            <ul style={{ margin: '10px 0 0 0', paddingLeft: '20px' }}>
              {Array.from({ length: Math.ceil(maxRange / 10) }, (_, i) => {
                const start = i * 10 + 1;
                const end = Math.min((i + 1) * 10, maxRange);
                return (
                  <li key={i}>
                    Range {i + 1}: <strong>{start}-{end}</strong> (10 cards)
                  </li>
                );
              })}
            </ul>
          </div>

          <button
            onClick={setupNumbersPuzzle}
            disabled={loading}
            style={{
              padding: '12px 24px',
              fontSize: '16px',
              fontWeight: 'bold',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
              marginRight: '10px',
            }}
          >
            {loading ? '⏳ Setting up...' : '✅ Set Up Puzzle'}
          </button>
        </div>

        {status && (
          <div style={{
            padding: '15px',
            borderRadius: '4px',
            marginBottom: '20px',
            backgroundColor: success ? '#c8e6c9' : '#ffcccc',
            border: `2px solid ${success ? '#4CAF50' : '#f44336'}`,
            color: success ? '#2e7d32' : '#c62828',
          }}>
            {status}
          </div>
        )}

        <div style={{
          backgroundColor: '#fff3e0',
          padding: '20px',
          borderRadius: '8px',
          borderLeft: '4px solid #ff9800',
        }}>
          <h3>📖 How It Works</h3>
          <ol style={{ lineHeight: '1.8' }}>
            <li><strong>User visits:</strong> http://localhost:3000/puzzle/logic-puzzles/Ordering/Numbers</li>
            <li><strong>They see:</strong> Buttons for each range (1-10, 11-20, 21-30, etc.)</li>
            <li><strong>They click:</strong> A range button (e.g., "1-10")</li>
            <li><strong>They get:</strong> 10 jumbled number cards to arrange in order</li>
            <li><strong>They drag:</strong> Cards from right to left in the correct sequence</li>
            <li><strong>They complete:</strong> The puzzle when all 10 cards are in correct order</li>
          </ol>
        </div>

        <div style={{
          backgroundColor: '#f3e5f5',
          padding: '20px',
          borderRadius: '8px',
          marginTop: '20px',
          borderLeft: '4px solid #9c27b0',
        }}>
          <h3>✨ Features</h3>
          <ul style={{ lineHeight: '1.8' }}>
            <li>✅ Shows exactly 10 cards per range</li>
            <li>✅ User can switch between any range at any time</li>
            <li>✅ Cards are shuffled/jumbled for each range</li>
            <li>✅ Progress tracker shows current progress (X/10)</li>
            <li>✅ Reset button to restart the current range</li>
            <li>✅ Works for any configured maximum range</li>
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
}
