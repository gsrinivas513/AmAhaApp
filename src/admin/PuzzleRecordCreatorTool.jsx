import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { db } from '../firebase/firebaseConfig';
import { collection, getDocs, query, where, setDoc, doc, serverTimestamp } from "firebase/firestore";

function PuzzleRecordCreatorTool() {
  const [missingPuzzles, setMissingPuzzles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [selectedPuzzle, setSelectedPuzzle] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    difficulty: 'medium',
    ageGroup: '4-5',
    data: { pieces: 12 }
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [allPuzzles, setAllPuzzles] = useState([]);
  const [showAllPuzzles, setShowAllPuzzles] = useState(false);

  useEffect(() => {
    findMissingPuzzles();
  }, []);

  const findMissingPuzzles = async () => {
    try {
      setLoading(true);
      setError('');

      // Get all topics
      const topicsSnap = await getDocs(collection(db, 'topics'));
      const allTopics = topicsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Get all subtopics
      const subtopicsSnap = await getDocs(collection(db, 'subtopics'));
      const allSubtopics = subtopicsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Get all existing puzzles
      const puzzlesSnap = await getDocs(collection(db, 'puzzles'));
      const allPuzzlesData = puzzlesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAllPuzzles(allPuzzlesData);

      // Find subtopics that DON'T have any puzzles referencing them
      // AND that belong to PUZZLE features (not QUIZ features)
      const missing = [];
      
      for (const subtopic of allSubtopics) {
        const topic = allTopics.find(t => t.id === subtopic.topicId);
        
        // Skip if this belongs to a non-puzzle feature
        if (topic?.featureId !== 'puzzles') {
          continue;
        }
        
        // Check if this subtopic has any puzzles that reference it via subtopicId
        const hasPuzzles = allPuzzlesData.some(puzzle => puzzle.subtopicId === subtopic.id);
        
        if (!hasPuzzles) {
          missing.push({
            id: subtopic.id,
            name: subtopic.name || subtopic.label,
            label: subtopic.label,
            topicId: subtopic.topicId,
            topicName: topic?.name || topic?.label || 'Unknown',
            difficulty: subtopic.difficulty || 'medium',
            ageGroup: subtopic.ageGroup || '4-5',
            description: subtopic.description || '',
            type: subtopic.type || 'traditional'
          });
        }
      }

      console.log('🔍 Found missing puzzle records:', missing);
      console.log('📊 All puzzles in database:', allPuzzlesData);
      console.log('📊 Total puzzle subtopics:', allSubtopics.filter(s => {
        const topic = allTopics.find(t => t.id === s.topicId);
        return topic?.featureId === 'puzzles';
      }).length);
      setMissingPuzzles(missing);
    } catch (err) {
      console.error('Error finding missing puzzles:', err);
      setError('Failed to scan for missing puzzles: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPuzzle = (puzzle) => {
    setSelectedPuzzle(puzzle);
    setFormData({
      title: puzzle.label || puzzle.name,
      description: puzzle.description || '',
      imageUrl: puzzle.imageUrl || '',
      difficulty: puzzle.difficulty || 'medium',
      ageGroup: puzzle.ageGroup || '4-5',
      data: { pieces: 12 }
    });
    setError('');
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('data.')) {
      const dataField = name.replace('data.', '');
      setFormData(prev => ({
        ...prev,
        data: { ...prev.data, [dataField]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCreatePuzzle = async (e) => {
    e.preventDefault();
    
    if (!selectedPuzzle || !formData.title) {
      setError('Please fill in all required fields');
      return;
    }

    setCreating(true);
    try {
      // Create the puzzle record with a specific document ID
      const puzzleData = {
        id: selectedPuzzle.id,
        title: formData.title,
        name: formData.title,
        description: formData.description,
        imageUrl: formData.imageUrl,
        difficulty: formData.difficulty,
        ageGroup: formData.ageGroup,
        topicId: selectedPuzzle.topicId,
        subtopicId: selectedPuzzle.id,  // This puzzle is for this subtopic
        type: selectedPuzzle.type || 'jigsaw',
        featureId: 'puzzles',
        puzzleType: selectedPuzzle.type || 'jigsaw',
        isPublished: true,
        rating: 4.5,
        data: formData.data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      // Use setDoc with doc reference to create with specific ID
      await setDoc(doc(db, 'puzzles', selectedPuzzle.id), puzzleData);

      setSuccess(`✅ Created puzzle: ${formData.title}`);
      setSelectedPuzzle(null);
      setFormData({
        title: '',
        description: '',
        imageUrl: '',
        difficulty: 'medium',
        ageGroup: '4-5',
        data: { pieces: 12 }
      });

      // Refresh the list
      setTimeout(() => {
        findMissingPuzzles();
        setSuccess('');
      }, 2000);
    } catch (err) {
      console.error('Error creating puzzle:', err);
      setError('Failed to create puzzle: ' + err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleRepairJigsawRecords = async () => {
    setCreating(true);
    try {
      const jigsawIds = ['easy-jigsaw', 'medium-jigsaw', 'hard-jigsaw'];
      let repaired = 0;

      for (const puzzleId of jigsawIds) {
        const puzzleRef = doc(db, 'puzzles', puzzleId);
        const puzzleSnap = await getDocs(
          query(collection(db, 'puzzles'), where('id', '==', puzzleId))
        );

        if (!puzzleSnap.empty) {
          // Update with the missing fields
          const puzzleDoc = puzzleSnap.docs[0];
          const currentData = puzzleDoc.data();

          await setDoc(puzzleRef, {
            ...currentData,
            subtopicId: puzzleId,  // Add the missing subtopicId
            puzzleType: 'jigsaw',   // Fix puzzle type from 'traditional' to 'jigsaw'
            type: 'jigsaw'          // Also update type field
          });
          repaired++;
          console.log(`✅ Repaired ${puzzleId} - added subtopicId and fixed puzzleType to 'jigsaw'`);
        }
      }

      setSuccess(`✅ Repaired ${repaired} Jigsaw records - added subtopicId and fixed puzzleType`);
      setTimeout(() => {
        findMissingPuzzles();
        setSuccess('');
      }, 2000);
    } catch (err) {
      console.error('Error repairing records:', err);
      setError('Failed to repair records: ' + err.message);
    } finally {
      setCreating(false);
    }
  };

  return (
    <AdminLayout>
      <div style={{ padding: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>
          🔧 Puzzle Record Creator Tool
        </h1>
        <p style={{ color: '#64748b', marginBottom: 24 }}>
          Create puzzle records for subtopics that don't have actual puzzle data yet.
        </p>

        {error && (
          <div style={{
            background: '#fee2e2',
            color: '#dc2626',
            padding: '12px 16px',
            borderRadius: '6px',
            marginBottom: 16,
            border: '1px solid #fca5a5'
          }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{
            background: '#dcfce7',
            color: '#166534',
            padding: '12px 16px',
            borderRadius: '6px',
            marginBottom: 16,
            border: '1px solid #86efac'
          }}>
            {success}
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <p>Scanning for missing puzzles...</p>
          </div>
        ) : missingPuzzles.length === 0 ? (
          <div style={{
            background: '#f0fdf4',
            border: '1px solid #bbf7d0',
            padding: 24,
            borderRadius: 8,
            textAlign: 'center'
          }}>
            <p style={{ fontSize: 18, fontWeight: 600, color: '#166534' }}>
              ✅ All puzzle records exist!
            </p>
            <p style={{ color: '#64748b', marginTop: 8 }}>
              No missing puzzle records found.
            </p>
          </div>
        ) : (
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>
              Found {missingPuzzles.length} Missing Puzzle Records
            </h2>

            {selectedPuzzle ? (
              // Form for creating puzzle
              <div style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: 8,
                padding: 24,
                marginBottom: 24
              }}>
                <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>
                  Creating: {selectedPuzzle.label || selectedPuzzle.name}
                </h3>

                <form onSubmit={handleCreatePuzzle}>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', fontWeight: 500, marginBottom: 4 }}>
                      Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleFormChange}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: '1px solid #cbd5e1',
                        borderRadius: 4,
                        fontFamily: 'inherit'
                      }}
                      required
                    />
                  </div>

                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', fontWeight: 500, marginBottom: 4 }}>
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleFormChange}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: '1px solid #cbd5e1',
                        borderRadius: 4,
                        fontFamily: 'inherit',
                        minHeight: 80
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', fontWeight: 500, marginBottom: 4 }}>
                      Image URL
                    </label>
                    <input
                      type="url"
                      name="imageUrl"
                      value={formData.imageUrl}
                      onChange={handleFormChange}
                      placeholder="https://example.com/image.jpg"
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: '1px solid #cbd5e1',
                        borderRadius: 4,
                        fontFamily: 'inherit'
                      }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                    <div>
                      <label style={{ display: 'block', fontWeight: 500, marginBottom: 4 }}>
                        Difficulty
                      </label>
                      <select
                        name="difficulty"
                        value={formData.difficulty}
                        onChange={handleFormChange}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          border: '1px solid #cbd5e1',
                          borderRadius: 4,
                          fontFamily: 'inherit'
                        }}
                      >
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontWeight: 500, marginBottom: 4 }}>
                        Age Group
                      </label>
                      <select
                        name="ageGroup"
                        value={formData.ageGroup}
                        onChange={handleFormChange}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          border: '1px solid #cbd5e1',
                          borderRadius: 4,
                          fontFamily: 'inherit'
                        }}
                      >
                        <option value="3-5">3-5 years</option>
                        <option value="4-5">4-5 years</option>
                        <option value="5-6">5-6 years</option>
                        <option value="6-7">6-7 years</option>
                        <option value="7-8">7-8 years</option>
                        <option value="8-9">8-9 years</option>
                      </select>
                    </div>
                  </div>

                  {selectedPuzzle.type === 'jigsaw' && (
                    <div style={{ marginBottom: 16 }}>
                      <label style={{ display: 'block', fontWeight: 500, marginBottom: 4 }}>
                        Number of Pieces
                      </label>
                      <input
                        type="number"
                        name="data.pieces"
                        value={formData.data.pieces}
                        onChange={handleFormChange}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          border: '1px solid #cbd5e1',
                          borderRadius: 4,
                          fontFamily: 'inherit'
                        }}
                      />
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: 12 }}>
                    <button
                      type="submit"
                      disabled={creating}
                      style={{
                        padding: '10px 20px',
                        background: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: 4,
                        fontWeight: 600,
                        cursor: creating ? 'not-allowed' : 'pointer',
                        opacity: creating ? 0.6 : 1
                      }}
                    >
                      {creating ? 'Creating...' : '✅ Create Puzzle Record'}
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedPuzzle(null)}
                      style={{
                        padding: '10px 20px',
                        background: '#e2e8f0',
                        color: '#334155',
                        border: 'none',
                        borderRadius: 4,
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              // List of missing puzzles
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: 16
              }}>
                {missingPuzzles.map((puzzle) => (
                  <div
                    key={puzzle.id}
                    style={{
                      border: '1px solid #e2e8f0',
                      borderRadius: 8,
                      padding: 16,
                      background: '#f8fafc'
                    }}
                  >
                    <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
                      {puzzle.label || puzzle.name}
                    </h4>
                    <p style={{ color: '#64748b', fontSize: 12, marginBottom: 4 }}>
                      <strong>Topic:</strong> {puzzle.topicName}
                    </p>
                    <p style={{ color: '#64748b', fontSize: 12, marginBottom: 4 }}>
                      <strong>ID:</strong> {puzzle.id}
                    </p>
                    <p style={{ color: '#64748b', fontSize: 12, marginBottom: 12 }}>
                      <strong>Difficulty:</strong> {puzzle.difficulty}
                    </p>
                    <button
                      onClick={() => handleSelectPuzzle(puzzle)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        background: '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: 4,
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      Create Record
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Debug Section: Show all puzzles in database */}
        <div style={{
          marginTop: 40,
          padding: 20,
          background: '#f0f4f8',
          borderRadius: 8,
          border: '1px solid #cbd5e1'
        }}>
          <button
            onClick={() => setShowAllPuzzles(!showAllPuzzles)}
            style={{
              padding: '8px 16px',
              background: '#6366f1',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              fontWeight: 600,
              cursor: 'pointer',
              marginBottom: 16,
              marginRight: 8
            }}
          >
            {showAllPuzzles ? '🔽 Hide All Puzzles in Database' : '▶️ Show All Puzzles in Database'}
          </button>

          <button
            onClick={handleRepairJigsawRecords}
            disabled={creating}
            style={{
              padding: '8px 16px',
              background: '#f59e0b',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              fontWeight: 600,
              cursor: creating ? 'not-allowed' : 'pointer',
              opacity: creating ? 0.6 : 1,
              marginBottom: 16
            }}
          >
            {creating ? '⏳ Repairing...' : '🔧 Repair Jigsaw Records (Add subtopicId)'}
          </button>

          {showAllPuzzles && (
            <div style={{ marginTop: 16 }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>
                All Puzzles ({allPuzzles.length} total)
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: 12,
                maxHeight: '400px',
                overflowY: 'auto'
              }}>
                {allPuzzles.map((puzzle) => (
                  <div
                    key={puzzle.id}
                    style={{
                      padding: 12,
                      background: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: 4,
                      fontSize: 12,
                      fontFamily: 'monospace'
                    }}
                  >
                    <div style={{ fontWeight: 600, marginBottom: 4, wordBreak: 'break-all' }}>
                      📋 {puzzle.id}
                    </div>
                    <div style={{ color: '#64748b', marginBottom: 2 }}>
                      Title: {puzzle.title || puzzle.name || 'N/A'}
                    </div>
                    <div style={{ color: '#64748b', marginBottom: 2 }}>
                      SubtopicId: {puzzle.subtopicId || 'N/A'}
                    </div>
                    <div style={{ color: '#64748b', marginBottom: 2 }}>
                      Type: {puzzle.type || puzzle.puzzleType || 'N/A'}
                    </div>
                    <div style={{ color: '#64748b' }}>
                      Difficulty: {puzzle.difficulty || 'N/A'}
                    </div>
                  </div>
                ))}
              </div>
              {allPuzzles.length === 0 && (
                <div style={{ color: '#64748b', fontStyle: 'italic' }}>
                  No puzzles found in database
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

export default PuzzleRecordCreatorTool;
