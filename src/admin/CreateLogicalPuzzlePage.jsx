import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import { db } from '../firebase/firebaseConfig';
import { collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";

const LOGICAL_PUZZLE_TYPES = [
  { value: 'riddle', label: 'Riddle' },
  { value: 'lateral-thinking', label: 'Lateral Thinking' },
  { value: 'logic-grid', label: 'Logic Grid' },
  { value: 'sudoku', label: 'Sudoku' },
  { value: 'puzzle-sequence', label: 'Sequence' },
];

const DIFFICULTY_LEVELS = [
  { value: 'easy', label: 'Easy', color: '#10b981' },
  { value: 'medium', label: 'Medium', color: '#f59e0b' },
  { value: 'hard', label: 'Hard', color: '#ef4444' },
];

const AGE_GROUPS = [
  { value: '6-7', label: '6-7 years' },
  { value: '7-8', label: '7-8 years' },
  { value: '8-9', label: '8-9 years' },
  { value: '9-10', label: '9-10 years' },
  { value: '10+', label: '10+ years' },
];

const defaultPuzzle = {
  title: '',
  description: '',
  question: '',
  answer: '',
  hints: [],
  difficulty: 'medium',
  ageGroup: '7-8',
  type: 'riddle',
  topicId: '',
  data: {},
};

function CreateLogicalPuzzlePage() {
  const [puzzle, setPuzzle] = useState(defaultPuzzle);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [newHint, setNewHint] = useState('');

  React.useEffect(() => {
    loadTopics();
  }, []);

  const loadTopics = async () => {
    try {
      setLoading(true);
      const topicsSnap = await getDocs(collection(db, 'topics'));
      const topicsData = topicsSnap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter(t => t.featureId === 'puzzles'); // Only puzzle topics
      setTopics(topicsData);
    } catch (err) {
      console.error('Error loading topics:', err);
      setError('Failed to load topics');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPuzzle((prev) => ({ ...prev, [name]: value }));
  };

  const addHint = () => {
    if (newHint.trim()) {
      setPuzzle((prev) => ({
        ...prev,
        hints: [...prev.hints, newHint.trim()]
      }));
      setNewHint('');
    }
  };

  const removeHint = (index) => {
    setPuzzle((prev) => ({
      ...prev,
      hints: prev.hints.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!puzzle.title || !puzzle.topicId || !puzzle.type || !puzzle.question) {
      setError('Please fill in all required fields');
      return;
    }

    setSaving(true);
    try {
      await addDoc(collection(db, 'puzzles'), {
        ...puzzle,
        featureId: 'puzzles',
        puzzleType: 'logical',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      
      setSuccess(true);
      setPuzzle(defaultPuzzle);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving puzzle:', err);
      setError('Failed to save puzzle: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div style={{ padding: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>
          🧠 Create Logical Puzzle
        </h1>
        <p style={{ color: '#64748b', marginBottom: 24 }}>
          Create riddles, lateral thinking puzzles, logic grids, and other brain teasers.
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
            ✓ Puzzle created successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ maxWidth: '600px' }}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: 8 }}>
              Puzzle Title *
            </label>
            <input
              type="text"
              name="title"
              value={puzzle.title}
              onChange={handleChange}
              placeholder="e.g., The Mysterious Door"
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                fontSize: 14,
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: 8 }}>
              Puzzle Type *
            </label>
            <select
              name="type"
              value={puzzle.type}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                fontSize: 14,
                boxSizing: 'border-box'
              }}
            >
              {LOGICAL_PUZZLE_TYPES.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: 8 }}>
              Topic *
            </label>
            <select
              name="topicId"
              value={puzzle.topicId}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                fontSize: 14,
                boxSizing: 'border-box'
              }}
            >
              <option value="">Select a topic</option>
              {topics.map(t => (
                <option key={t.id} value={t.id}>{t.name || t.label}</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: 8 }}>
              Question / Puzzle Statement *
            </label>
            <textarea
              name="question"
              value={puzzle.question}
              onChange={handleChange}
              placeholder="Enter the question or puzzle statement..."
              rows="4"
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                fontSize: 14,
                fontFamily: 'inherit',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: 8 }}>
              Answer
            </label>
            <input
              type="text"
              name="answer"
              value={puzzle.answer}
              onChange={handleChange}
              placeholder="The correct answer"
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                fontSize: 14,
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: 8 }}>
              Hints
            </label>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              <input
                type="text"
                value={newHint}
                onChange={(e) => setNewHint(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addHint())}
                placeholder="Add a hint..."
                style={{
                  flex: 1,
                  padding: '10px 12px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  fontSize: 14,
                  boxSizing: 'border-box'
                }}
              />
              <button
                type="button"
                onClick={addHint}
                style={{
                  background: '#6366f1',
                  color: 'white',
                  border: 'none',
                  padding: '10px 16px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: 14
                }}
              >
                Add
              </button>
            </div>
            {puzzle.hints.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {puzzle.hints.map((hint, index) => (
                  <div
                    key={index}
                    style={{
                      background: '#f0fdf4',
                      border: '1px solid #bbf7d0',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <span style={{ fontSize: 14 }}>💡 {hint}</span>
                    <button
                      type="button"
                      onClick={() => removeHint(index)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#dc2626',
                        cursor: 'pointer',
                        fontSize: 16
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: 8 }}>
              Difficulty
            </label>
            <div style={{ display: 'flex', gap: 8 }}>
              {DIFFICULTY_LEVELS.map(level => (
                <label key={level.value} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="difficulty"
                    value={level.value}
                    checked={puzzle.difficulty === level.value}
                    onChange={handleChange}
                  />
                  <span style={{ color: level.color, fontWeight: 600 }}>{level.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: 8 }}>
              Age Group
            </label>
            <select
              name="ageGroup"
              value={puzzle.ageGroup}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                fontSize: 14,
                boxSizing: 'border-box'
              }}
            >
              {AGE_GROUPS.map(ag => (
                <option key={ag.value} value={ag.value}>{ag.label}</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: 8 }}>
              Description
            </label>
            <textarea
              name="description"
              value={puzzle.description}
              onChange={handleChange}
              placeholder="Describe the puzzle..."
              rows="3"
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                fontSize: 14,
                fontFamily: 'inherit',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button
              type="submit"
              disabled={saving}
              style={{
                background: '#10b981',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '6px',
                cursor: saving ? 'not-allowed' : 'pointer',
                fontWeight: 600,
                fontSize: 14,
                opacity: saving ? 0.6 : 1
              }}
            >
              {saving ? 'Creating...' : 'Create Puzzle'}
            </button>
            <button
              type="button"
              onClick={() => setPuzzle(defaultPuzzle)}
              style={{
                background: '#e2e8f0',
                color: '#334155',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: 14
              }}
            >
              Clear
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}

export default CreateLogicalPuzzlePage;
