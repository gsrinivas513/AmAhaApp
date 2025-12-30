/**
 * RegenerateOrderingPuzzlesPage.jsx
 * Admin page to regenerate Ordering puzzles (Size and Numbers)
 */

import React, { useState } from 'react';
import { collection, getDocs, deleteDoc, doc, addDoc, query, where } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import AdminLayout from './AdminLayout';

export default function RegenerateOrderingPuzzlesPage() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [success, setSuccess] = useState(false);

  const regenerateSizePuzzle = async () => {
    setLoading(true);
    setStatus('');
    setSuccess(false);

    try {
      // Step 1: Delete existing Size puzzles
      setStatus('🗑️ Deleting old Size puzzles...');
      const q = query(collection(db, 'puzzles'), where('subtopicId', '==', 'ordering-size'));
      const querySnapshot = await getDocs(q);
      for (const docSnap of querySnapshot.docs) {
        await deleteDoc(doc(db, 'puzzles', docSnap.id));
        console.log('Deleted puzzle:', docSnap.id);
      }
      setStatus(`✅ Deleted ${querySnapshot.docs.length} old Size puzzles`);

      // Step 2: Create new Size puzzle with 8 items
      setStatus('📝 Creating new Size puzzle with 8 items...');
      const items = [
        { id: "size-1", label: "Tiny", image: "https://via.placeholder.com/40/FF6B6B/ffffff?text=Tiny", order: 1, size: 40 },
        { id: "size-2", label: "Small", image: "https://via.placeholder.com/60/FF6B6B/ffffff?text=Small", order: 2, size: 60 },
        { id: "size-3", label: "Medium", image: "https://via.placeholder.com/80/FF6B6B/ffffff?text=Medium", order: 3, size: 80 },
        { id: "size-4", label: "Large", image: "https://via.placeholder.com/100/FF6B6B/ffffff?text=Large", order: 4, size: 100 },
        { id: "size-5", label: "Extra Large", image: "https://via.placeholder.com/120/FF6B6B/ffffff?text=XL", order: 5, size: 120 },
        { id: "size-6", label: "2X Large", image: "https://via.placeholder.com/140/FF6B6B/ffffff?text=2XL", order: 6, size: 140 },
        { id: "size-7", label: "3X Large", image: "https://via.placeholder.com/160/FF6B6B/ffffff?text=3XL", order: 7, size: 160 },
        { id: "size-8", label: "4X Large", image: "https://via.placeholder.com/180/FF6B6B/ffffff?text=4XL", order: 8, size: 180 }
      ];

      const puzzleData = {
        title: "Order by Size - Small to Large",
        description: "Drag items from smallest to largest size",
        type: "ordering",
        category: "Logic Puzzles",
        categoryId: "logic-puzzles",
        topic: "Ordering",
        topicId: "ordering",
        subtopic: "Size Sequencing",
        subtopicId: "ordering-size",
        difficulty: "easy",
        ageGroup: "6-8",
        featureId: "puzzles",
        isPublished: true,
        data: {
          type: "size",
          displayType: "sizes",
          items: items,
          correctOrder: [1, 2, 3, 4, 5, 6, 7, 8],
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        xpReward: 10,
        timeLimit: null,
        hints: 2,
      };

      const newDoc = await addDoc(collection(db, 'puzzles'), puzzleData);
      setStatus(`✅ Successfully created new Size puzzle (ID: ${newDoc.id}) with 8 items!`);
      setSuccess(true);
    } catch (error) {
      console.error('❌ Error:', error);
      setStatus(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="admin-page" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
        <h2>🔄 Regenerate Ordering Puzzles</h2>
        <p style={{ color: '#666', marginTop: '0.5rem' }}>
          Delete old ordering puzzles and create fresh ones with updated data
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
          <h3 style={{ marginTop: 0 }}>📐 Size Sequencing Puzzle</h3>
          <p style={{ color: '#666', marginBottom: '1rem' }}>
            Creates a new Size puzzle with 8 items (Tiny → Small → Medium → Large → Extra Large → 2X → 3X → 4X Large)
          </p>

          <button
            onClick={regenerateSizePuzzle}
            disabled={loading}
            style={{
              padding: '0.75rem 1.5rem',
              fontSize: '1rem',
              backgroundColor: loading ? '#ccc' : '#FF6B6B',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: '600',
            }}
          >
            {loading ? '⏳ Regenerating...' : '🔄 Regenerate Size Puzzle'}
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
                fontWeight: success ? '600' : '400',
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
          <h3>ℹ️ What This Does:</h3>
          <ul style={{ lineHeight: '1.8' }}>
            <li>🗑️ Deletes all existing Size Sequencing puzzles</li>
            <li>✨ Creates a fresh Size puzzle with 8 items</li>
            <li>📏 Each item has a different size for visual ordering</li>
            <li>🎮 Supports both Ascending and Descending modes</li>
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
          <h3>📋 Item Sizes:</h3>
          <div style={{ fontFamily: 'monospace', fontSize: '0.9rem', lineHeight: '2' }}>
            <div>1️⃣ Tiny: 40px</div>
            <div>2️⃣ Small: 60px</div>
            <div>3️⃣ Medium: 80px</div>
            <div>4️⃣ Large: 100px</div>
            <div>5️⃣ Extra Large: 120px</div>
            <div>6️⃣ 2X Large: 140px</div>
            <div>7️⃣ 3X Large: 160px</div>
            <div>8️⃣ 4X Large: 180px</div>
          </div>
        </div>

        {success && (
          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <a
              href="/puzzle/logic-puzzles/Ordering/Size"
              style={{
                display: 'inline-block',
                padding: '0.75rem 1.5rem',
                backgroundColor: '#4CAF50',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '4px',
                fontWeight: '600',
              }}
            >
              ➜ Go to Size Puzzle
            </a>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
