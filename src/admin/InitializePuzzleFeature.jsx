import React, { useState } from 'react';
import { db } from '../firebase/firebaseConfig';
import { setDoc, doc } from 'firebase/firestore';

const InitializePuzzleFeature = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [logs, setLogs] = useState([]);

  const addLog = (text) => {
    setLogs(prev => [...prev, text]);
    console.log(text);
  };

  const handleResetPuzzles = async () => {
    if (!window.confirm('Are you sure? This will delete all sample puzzles. You can then re-initialize to get fresh copies.')) {
      return;
    }
    
    setLoading(true);
    setMessage('');
    setError('');
    setLogs([]);

    try {
      addLog("🗑️ Deleting all sample puzzles...");
      
      const { collection, getDocs, deleteDoc } = await import('firebase/firestore');
      const puzzlesSnap = await getDocs(collection(db, 'puzzles'));
      
      let count = 0;
      for (const puzzleDoc of puzzlesSnap.docs) {
        await deleteDoc(puzzleDoc.ref);
        count++;
        addLog(`  ✅ Deleted: ${puzzleDoc.id}`);
      }
      
      setMessage(`✅ Deleted ${count} puzzles! Now click "Initialize Now" to create fresh sample puzzles.`);
    } catch (err) {
      console.error("❌ Delete error:", err);
      setError(`❌ Error: ${err.message}`);
      addLog(`❌ ERROR: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleInitialize = async () => {
    setLoading(true);
    setMessage('');
    setError('');
    setLogs([]);

    try {
      addLog("🚀 Starting puzzle feature initialization...");

      // Step 1: Create Puzzle Feature (matching quiz feature structure)
      addLog("1️⃣ Creating Puzzle Feature...");
      await setDoc(doc(db, 'features', 'Puzzles'), {
        name: 'puzzles',           // internal name (lowercase)
        label: 'Puzzles',          // display label
        featureName: 'Puzzles',    // for compatibility
        featureType: 'puzzle',     // type identifier
        icon: '🧩',
        enabled: true,
        status: 'enabled',
        createdAt: new Date(),
        description: 'Visual and traditional puzzle games'
      });
      addLog("  ✅ Puzzle feature created");

      // Step 2: Create Categories (matching quiz category structure exactly)
      addLog("2️⃣ Creating Categories...");
      
      const categories = [
        {
          id: 'visual-puzzles',
          data: {
            name: 'visual-puzzles',           // internal name
            label: 'Visual Puzzles',          // display label
            categoryName: 'Visual Puzzles',   // for compatibility
            icon: '🎨',
            color: '#8B5CF6',                 // purple
            imageUrl: '',
            cloudinaryId: '',
            description: 'Interactive visual puzzle games',
            featureId: 'Puzzles',             // links to feature
            featureName: 'Puzzles',
            featureType: 'puzzle',
            defaultUiMode: 'playful',         // UI style
            uiMode: 'puzzle',                 // This is what shows as "Mode: puzzle"
            isPublished: true,
            published: true,
            quizCount: 0,
            puzzleCount: 0,
            createdAt: new Date().toISOString()
          }
        },
        {
          id: 'traditional-puzzles',
          data: {
            name: 'traditional-puzzles',
            label: 'Traditional Puzzles',
            categoryName: 'Traditional Puzzles',
            icon: '📝',
            color: '#10B981',                 // green
            imageUrl: '',
            cloudinaryId: '',
            description: 'Word matching, ordering, and drag-drop games',
            featureId: 'Puzzles',
            featureName: 'Puzzles',
            featureType: 'puzzle',
            defaultUiMode: 'playful',
            uiMode: 'puzzle',                 // This shows as "Mode: puzzle"
            isPublished: true,
            published: true,
            quizCount: 0,
            puzzleCount: 0,
            createdAt: new Date().toISOString()
          }
        }
      ];

      for (const cat of categories) {
        await setDoc(doc(db, 'categories', cat.id), cat.data);
        addLog(`  ✅ Created: ${cat.data.label} (Mode: ${cat.data.uiMode})`);
      }

      // Step 3: Create Visual Puzzle Types (Topics)
      addLog("3️⃣ Creating Visual Puzzle Types...");
      const visualTypes = [
        { id: 'picture-word', name: 'Picture Word', icon: '🖼️' },
        { id: 'spot-difference', name: 'Spot Difference', icon: '🔍' },
        { id: 'find-pairs', name: 'Find Pairs', icon: '🃏' },
        { id: 'picture-shadow', name: 'Picture Shadow', icon: '👤' },
        { id: 'matching-pairs', name: 'Matching Pairs', icon: '🎴' }
      ];

      for (const type of visualTypes) {
        await setDoc(doc(db, 'topics', type.id), {
          name: type.id,                      // internal name
          label: type.name,                   // display label
          topicName: type.name,               // for compatibility
          icon: type.icon,
          imageUrl: '',
          cloudinaryId: '',
          description: `${type.name} puzzle type`,
          categoryId: 'visual-puzzles',       // links to category
          categoryName: 'Visual Puzzles',
          sortOrder: visualTypes.indexOf(type),
          isPublished: true,
          quizCount: 0,
          puzzleCount: 0,
          createdAt: new Date().toISOString()
        });
        addLog(`  ✅ Created: ${type.name}`);
      }

      // Step 4: Create Traditional Puzzle Types
      addLog("4️⃣ Creating Traditional Puzzle Types...");
      const traditionalTypes = [
        { id: 'ordering', name: 'Ordering', icon: '🔢' },
        { id: 'drag-drop', name: 'Drag & Drop', icon: '✋' }
      ];

      for (const type of traditionalTypes) {
        await setDoc(doc(db, 'topics', type.id), {
          name: type.id,
          label: type.name,
          topicName: type.name,
          icon: type.icon,
          imageUrl: '',
          cloudinaryId: '',
          description: `${type.name} puzzle type`,
          categoryId: 'traditional-puzzles',
          categoryName: 'Traditional Puzzles',
          sortOrder: traditionalTypes.indexOf(type),
          isPublished: true,
          quizCount: 0,
          puzzleCount: 0,
          createdAt: new Date().toISOString()
        });
        addLog(`  ✅ Created: ${type.name}`);
      }

      // Step 5: Create Sample Puzzles (actual puzzle content!)
      addLog("5️⃣ Creating Sample Puzzles...");
      
      const samplePuzzles = [
        {
          id: 'sample-picture-word-1',
          title: 'Animal Names',
          description: 'Identify these animal names from pictures',
          type: 'picture-word',
          category: 'visual-puzzles',
          topic: 'picture-word',
          difficulty: 'easy',
          imageUrl: 'https://images.unsplash.com/photo-1474511320723-9a56873571b7?w=400',
          correctAnswer: 'elephant',
          hints: ['It has a trunk', 'It is very large'],
          isPublished: true,
          puzzleCount: 0,
          createdAt: new Date().toISOString()
        },
        {
          id: 'sample-picture-word-2',
          title: 'Fruit Names',
          description: 'What fruit is this?',
          type: 'picture-word',
          category: 'visual-puzzles',
          topic: 'picture-word',
          difficulty: 'easy',
          imageUrl: 'https://images.unsplash.com/photo-1568702846914-96b305d2uj9b?w=400',
          correctAnswer: 'apple',
          hints: ['It is red', 'Keeps the doctor away'],
          isPublished: true,
          puzzleCount: 0,
          createdAt: new Date().toISOString()
        },
        {
          id: 'sample-matching-pairs-1',
          title: 'Match the Animals',
          description: 'Find matching pairs of animals',
          type: 'matching-pairs',
          category: 'visual-puzzles',
          topic: 'matching-pairs',
          difficulty: 'medium',
          pairs: [
            { id: 1, image: '🐶', match: '🐶' },
            { id: 2, image: '🐱', match: '🐱' },
            { id: 3, image: '🐰', match: '🐰' },
            { id: 4, image: '🐻', match: '🐻' }
          ],
          isPublished: true,
          createdAt: new Date().toISOString()
        },
        {
          id: 'sample-ordering-1',
          title: 'Number Sequence',
          description: 'Arrange these numbers in order',
          type: 'ordering',
          category: 'traditional-puzzles',
          topic: 'ordering',
          difficulty: 'easy',
          items: ['3', '1', '4', '2', '5'],
          correctOrder: ['1', '2', '3', '4', '5'],
          isPublished: true,
          createdAt: new Date().toISOString()
        },
        {
          id: 'sample-ordering-2',
          title: 'Days of the Week',
          description: 'Put the days in correct order',
          type: 'ordering',
          category: 'traditional-puzzles',
          topic: 'ordering',
          difficulty: 'medium',
          items: ['Wednesday', 'Monday', 'Friday', 'Tuesday', 'Thursday'],
          correctOrder: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          isPublished: true,
          createdAt: new Date().toISOString()
        },
        {
          id: 'sample-drag-drop-1',
          title: 'Sort by Color',
          description: 'Drag items to their color groups',
          type: 'drag-drop',
          category: 'traditional-puzzles',
          topic: 'drag-drop',
          difficulty: 'easy',
          items: [
            { id: 1, text: 'Apple', correctZone: 'Red' },
            { id: 2, text: 'Banana', correctZone: 'Yellow' },
            { id: 3, text: 'Orange', correctZone: 'Orange' },
            { id: 4, text: 'Lime', correctZone: 'Green' }
          ],
          dropZones: ['Red', 'Yellow', 'Orange', 'Green'],
          isPublished: true,
          createdAt: new Date().toISOString()
        }
      ];

      for (const puzzle of samplePuzzles) {
        await setDoc(doc(db, 'puzzles', puzzle.id), puzzle);
        addLog(`  ✅ Created puzzle: ${puzzle.title}`);
      }

      addLog("✅ ALL DONE! Created " + samplePuzzles.length + " sample puzzles!");
      setMessage('✅ Puzzle feature initialized with ' + samplePuzzles.length + ' sample puzzles! Now refresh the page (F5) to see them.');
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
      
      <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
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

        <button
          onClick={handleResetPuzzles}
          disabled={loading}
          style={{
            padding: '10px 20px',
            backgroundColor: loading ? '#ccc' : '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
        >
          {loading ? '⏳ Resetting...' : '🗑️ Reset All Puzzles'}
        </button>
      </div>

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
