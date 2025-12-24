import React, { useState } from 'react';
import { db } from '../firebase/firebaseConfig';
import { collection, setDoc, doc, getDoc } from 'firebase/firestore';

const InitializePuzzleFeature = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [logs, setLogs] = useState([]);

  const addLog = (text) => {
    setLogs(prev => [...prev, text]);
    console.log(text);
  };

  const handleInitialize = async () => {
    setLoading(true);
    setMessage('');
    setError('');
    setLogs([]);

    try {
      addLog("🚀 Starting puzzle feature initialization...");

      // Step 1: Create Puzzle Feature
      addLog("1️⃣ Creating Puzzle Feature...");
      await setDoc(doc(db, 'features', 'Puzzles'), {
        featureName: 'Puzzles',
        featureType: 'puzzle',
        status: 'enabled',
        createdAt: new Date(),
        description: 'Visual and traditional puzzle games'
      }, { merge: true });
      addLog("  ✅ Puzzle feature created");

      addLog("  ✅ Puzzle feature created");

      // Step 2: Create Categories
      addLog("2️⃣ Creating Categories...");
      const categories = [
        {
          id: 'visual-puzzles',
          data: {
            categoryName: 'Visual Puzzles',
            featureName: 'Puzzles',
            featureType: 'puzzle',
            description: 'Interactive visual puzzle games'
          }
        },
        {
          id: 'traditional-puzzles',
          data: {
            categoryName: 'Traditional Puzzles',
            featureName: 'Puzzles',
            featureType: 'puzzle',
            description: 'Word matching, ordering, and drag-drop games'
          }
        }
      ];

      for (const cat of categories) {
        await setDoc(doc(db, 'categories', cat.id), cat.data, { merge: true });
        addLog(`  ✅ Created: ${cat.data.categoryName}`);
      }

      for (const cat of categories) {
        await setDoc(doc(db, 'categories', cat.id), cat.data, { merge: true });
        addLog(`  ✅ Created: ${cat.data.categoryName}`);
      }

      // Step 3: Create Visual Puzzle Types (Topics)
      addLog("3️⃣ Creating Visual Puzzle Types...");
      const visualTypes = [
        { id: 'picture-word', name: 'Picture Word', category: 'Visual Puzzles' },
        { id: 'spot-difference', name: 'Spot Difference', category: 'Visual Puzzles' },
        { id: 'find-pairs', name: 'Find Pairs', category: 'Visual Puzzles' },
        { id: 'picture-shadow', name: 'Picture Shadow', category: 'Visual Puzzles' },
        { id: 'matching-pairs', name: 'Matching Pairs', category: 'Visual Puzzles' }
      ];

      for (const type of visualTypes) {
        await setDoc(doc(db, 'topics', type.id), {
          topicName: type.name,
          categoryName: type.category,
          description: `${type.name} puzzle type`
        }, { merge: true });
        addLog(`  ✅ Created: ${type.name}`);
      }

      // Step 4: Create Traditional Puzzle Types
      addLog("4️⃣ Creating Traditional Puzzle Types...");
      const traditionalTypes = [
        { id: 'ordering', name: 'Ordering', category: 'Traditional Puzzles' },
        { id: 'drag-drop', name: 'Drag & Drop', category: 'Traditional Puzzles' }
      ];

      for (const type of traditionalTypes) {
        await setDoc(doc(db, 'topics', type.id), {
          topicName: type.name,
          categoryName: type.category,
          description: `${type.name} puzzle type`
        }, { merge: true });
        addLog(`  ✅ Created: ${type.name}`);
      }

      addLog("✅ ALL DONE!");
      setMessage('✅ Puzzle feature initialized! Now refresh the page (F5) to see changes.');
    } catch (err) {
      console.error("❌ Setup error:", err);
      setError(`❌ Error: ${err.message}`);
      addLog(`❌ ERROR: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      padding: '20px',
      margin: '20px',
      border: '2px solid #4CAF50',
      borderRadius: '8px',
      backgroundColor: '#f9f9f9'
    }}>
      <h3>🎮 Initialize Puzzle Feature</h3>
      <p>This will create the puzzle feature, categories, and puzzle types in the database.</p>
      
      <button
        onClick={handleInitialize}
        disabled={loading}
        style={{
          padding: '10px 20px',
          backgroundColor: loading ? '#ccc' : '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontSize: '14px',
          fontWeight: 'bold'
        }}
      >
        {loading ? '⏳ Initializing...' : '🚀 Initialize Now'}
      </button>

      {/* Live logs */}
      {logs.length > 0 && (
        <div style={{
          marginTop: '15px',
          padding: '10px',
          backgroundColor: '#f0f0f0',
          borderRadius: '4px',
          maxHeight: '200px',
          overflowY: 'auto',
          fontFamily: 'monospace',
          fontSize: '12px'
        }}>
          {logs.map((log, i) => (
            <div key={i} style={{ marginBottom: '4px' }}>{log}</div>
          ))}
        </div>
      )}

      {message && (
        <div style={{
          marginTop: '15px',
          padding: '10px',
          backgroundColor: '#d4edda',
          color: '#155724',
          borderRadius: '4px',
          border: '1px solid #c3e6cb',
          fontWeight: 'bold'
        }}>
          {message}
          <div style={{ marginTop: '10px', fontSize: '12px' }}>
            📌 <strong>Important:</strong> Press F5 or Cmd+R to refresh the page!
          </div>
        </div>
      )}

      {error && (
        <div style={{
          marginTop: '15px',
          padding: '10px',
          backgroundColor: '#f8d7da',
          color: '#721c24',
          borderRadius: '4px',
          border: '1px solid #f5c6cb'
        }}>
          {error}
        </div>
      )}
    </div>
  );
};

export default InitializePuzzleFeature;
