/**
 * SizeOrderingPuzzleSetupPage.jsx
 * Admin page to set up or update the Size ordering puzzle with different sizes
 */

import React, { useState } from 'react';
import { collection, getDocs, updateDoc, doc, addDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import AdminLayout from './AdminLayout';

export default function SizeOrderingPuzzleSetupPage() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [success, setSuccess] = useState(false);
  const [numItems, setNumItems] = useState(8);

  const setupSizePuzzle = async () => {
    setLoading(true);
    setStatus('');
    setSuccess(false);

    try {
      // Step 1: Generate items with different sizes
      setStatus(`Generating ${numItems} size cards...`);
      const items = [];
      const sizeLabels = ['Tiny', 'Small', 'Medium', 'Large', 'Extra Large', '2X Large', '3X Large', '4X Large', '5X Large', '6X Large'];
      const baseSizes = [40, 60, 80, 100, 120, 140, 160, 180, 200, 220];

      for (let i = 0; i < numItems; i++) {
        const sizeLabel = sizeLabels[i] || `Size ${i + 1}`;
        const sizePixels = baseSizes[i] || (40 + i * 20);
        
        items.push({
          id: `size-${i}`,
          label: sizeLabel,
          size: sizePixels,
          image: `https://via.placeholder.com/${sizePixels}/${sizePixels}/FF6B6B/ffffff?text=${sizeLabel}`,
          order: i + 1,
        });
      }

      // Step 2: Shuffle items for display (but keep track of correct order)
      const shuffledItems = [...items].sort(() => Math.random() - 0.5);

      // Step 3: Generate correct order (1 to numItems)
      const correctOrder = Array.from({ length: numItems }, (_, idx) => idx + 1);

      // Step 4: Find existing puzzle or create new one
      setStatus('Searching for existing Size puzzle...');
      const puzzlesSnap = await getDocs(collection(db, 'puzzles'));
      let existingPuzzle = null;
      let puzzleId = null;

      for (const puzzleDoc of puzzlesSnap.docs) {
        const data = puzzleDoc.data();
        if (data.subtopicId === 'ordering-size' && data.type === 'ordering') {
          existingPuzzle = puzzleDoc;
          puzzleId = puzzleDoc.id;
          break;
        }
      }

      const puzzleData = {
        title: `Size Sequencing (${numItems} items)`,
        description: `Arrange items from smallest to largest size`,
        type: 'ordering',
        category: 'Logic Puzzles',
        categoryId: 'logic-puzzles',
        topic: 'Ordering',
        topicId: 'ordering',
        subtopic: 'Size Sequencing',
        subtopicId: 'ordering-size',
        difficulty: 'easy',
        ageGroup: '6-8',
        featureId: 'puzzles',
        isPublished: true,
        data: {
          items: shuffledItems,
          correctOrder,
          type: 'size', // Distinguish from numbers
          displayType: 'sizes', // Show sizes as visual differences
        },
        updatedAt: new Date(),
      };

      if (existingPuzzle) {
        setStatus(`Updating existing puzzle (ID: ${puzzleId})...`);
        await updateDoc(doc(db, 'puzzles', puzzleId), puzzleData);
        setStatus(`✅ Successfully updated Size puzzle with ${numItems} items!`);
      } else {
        setStatus('Creating new Size puzzle...');
        const newDoc = await addDoc(collection(db, 'puzzles'), {
          ...puzzleData,
          createdAt: new Date(),
        });
        puzzleId = newDoc.id;
        setStatus(`✅ Successfully created Size puzzle (ID: ${puzzleId})`);
      }

      setSuccess(true);
      setTimeout(() => setLoading(false), 2000);
    } catch (error) {
      console.error('❌ Error setting up puzzle:', error);
      setStatus(`❌ Error: ${error.message}`);
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="admin-page" style={{ padding: '2rem' }}>
        <h2>📐 Size Ordering Puzzle Setup</h2>
        <p style={{ color: '#666', marginTop: '0.5rem' }}>
          Configure and create the Size Sequencing puzzle where users arrange objects by size
        </p>

        <div
          style={{
            marginTop: '2rem',
            padding: '1.5rem',
            border: '1px solid #ddd',
            borderRadius: '8px',
            backgroundColor: '#f9f9f9',
          }}
        >
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
              Number of Items in Puzzle:
            </label>
            <input
              type="number"
              min="2"
              max="10"
              value={numItems}
              onChange={(e) => setNumItems(Math.max(2, parseInt(e.target.value) || 5))}
              style={{
                padding: '0.5rem',
                fontSize: '1rem',
                borderRadius: '4px',
                border: '1px solid #ccc',
                width: '100px',
              }}
            />
            <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.5rem' }}>
              Create puzzle with {numItems} different-sized items
            </p>
          </div>

          <button
            onClick={setupSizePuzzle}
            disabled={loading}
            style={{
              padding: '0.75rem 1.5rem',
              fontSize: '1rem',
              backgroundColor: loading ? '#ccc' : '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: '600',
            }}
          >
            {loading ? '⏳ Setting up...' : '✅ Setup Size Puzzle'}
          </button>

          {status && (
            <div
              style={{
                marginTop: '1.5rem',
                padding: '1rem',
                backgroundColor: success ? '#e8f5e9' : '#fff3cd',
                border: `1px solid ${success ? '#4CAF50' : '#ff9800'}`,
                borderRadius: '4px',
                color: success ? '#2e7d32' : '#856404',
              }}
            >
              {status}
            </div>
          )}
        </div>

        <div
          style={{
            marginTop: '2rem',
            padding: '1.5rem',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            backgroundColor: '#f0f7ff',
          }}
        >
          <h3>📋 How This Works:</h3>
          <ul style={{ lineHeight: '1.8' }}>
            <li>
              <strong>Items:</strong> Creates {numItems} items with different sizes (Tiny, Small, Medium, Large, etc.)
            </li>
            <li>
              <strong>Visual Representation:</strong> Each item is shown as a colored square with size proportional to its order
            </li>
            <li>
              <strong>User Task:</strong> Arrange items from smallest to largest by dragging
            </li>
            <li>
              <strong>Correct Order:</strong> 1 (Tiny) → 2 (Small) → ... → {numItems} (Largest)
            </li>
            <li>
              <strong>User visits:</strong> http://localhost:3000/puzzle/logic-puzzles/Ordering/Size
            </li>
          </ul>
        </div>

        <div
          style={{
            marginTop: '2rem',
            padding: '1.5rem',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            backgroundColor: '#fff9e6',
          }}
        >
          <h3>⚙️ Configuration:</h3>
          <ul style={{ lineHeight: '1.8' }}>
            <li>
              <strong>Puzzle Type:</strong> ordering (drag and drop sequencing)
            </li>
            <li>
              <strong>Subtopic:</strong> ordering-size
            </li>
            <li>
              <strong>Display Type:</strong> Visual size differences (not numbers)
            </li>
            <li>
              <strong>Difficulty:</strong> Easy (suitable for ages 6-8)
            </li>
            <li>
              <strong>Update Method:</strong> Automatically updates existing Size puzzle or creates new one
            </li>
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
}
