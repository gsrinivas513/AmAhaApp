import React, { useState } from 'react';
import { Modal, Button, Input } from '../../components/ui';
import { addPuzzle } from '../../quiz/services/puzzleService';
import { db } from '../../firebase/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

function AddPuzzleModal({ 
  isOpen, 
  onClose, 
  category, 
  categoryName, 
  topic, 
  topicName,
  onSuccess 
}) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    type: 'picture-word',
    difficulty: 'easy',
    imageUrl: '',
    correctAnswer: '',
    items: [],
    pairs: [],
    isPublished: false,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Reset form when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setForm({
        title: '',
        description: '',
        type: 'picture-word',
        difficulty: 'easy',
        imageUrl: '',
        correctAnswer: '',
        items: [],
        pairs: [],
        isPublished: false,
      });
      setError('');
    }
  }, [isOpen]);

  const handleSave = async () => {
    if (!form.title.trim()) {
      setError('Title is required');
      return;
    }

    setSaving(true);
    setError('');

    try {
      // Create puzzle object with category and topic info
      const puzzleData = {
        title: form.title.trim(),
        description: form.description.trim(),
        type: form.type,
        difficulty: form.difficulty,
        imageUrl: form.imageUrl.trim(),
        correctAnswer: form.correctAnswer.trim(),
        category: category,
        categoryName: categoryName,
        topic: topic,
        topicName: topicName,
        isPublished: form.isPublished,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Add type-specific fields
      if (form.type === 'picture-word' && form.correctAnswer) {
        puzzleData.correctAnswer = form.correctAnswer.trim();
      }
      
      if (form.items && form.items.length > 0) {
        puzzleData.items = form.items;
      }
      
      if (form.pairs && form.pairs.length > 0) {
        puzzleData.pairs = form.pairs;
      }

      // Save to Firestore
      const docRef = await addPuzzle(puzzleData);
      
      if (onSuccess) {
        onSuccess();
      }
      
      // Close modal
      onClose();
    } catch (err) {
      console.error('Error saving puzzle:', err);
      setError(err.message || 'Failed to save puzzle');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal 
      title="➕ Add New Puzzle" 
      onClose={onClose}
    >
      <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Category and Topic (Read-only display) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={{ fontWeight: 600, fontSize: 12, color: '#64748b' }}>Category</label>
              <div style={{ padding: '8px 12px', background: '#f1f5f9', borderRadius: 6, fontSize: 13 }}>
                {categoryName || 'N/A'}
              </div>
            </div>
            <div>
              <label style={{ fontWeight: 600, fontSize: 12, color: '#64748b' }}>Puzzle Type</label>
              <div style={{ padding: '8px 12px', background: '#f1f5f9', borderRadius: 6, fontSize: 13 }}>
                {topicName || 'N/A'}
              </div>
            </div>
          </div>

          {/* Title */}
          <Input
            label="Title"
            value={form.title}
            onChange={(e) => setForm({...form, title: e.target.value})}
            placeholder="Enter puzzle title"
          />

          {/* Description */}
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 14 }}>
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({...form, description: e.target.value})}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #e2e8f0',
                borderRadius: 6,
                minHeight: 80,
                fontSize: 14,
                fontFamily: 'inherit',
                resize: 'vertical'
              }}
              placeholder="Enter puzzle description"
            />
          </div>

          {/* Type and Difficulty */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 14 }}>Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({...form, type: e.target.value})}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #e2e8f0',
                  borderRadius: 6,
                  fontSize: 14,
                  fontFamily: 'inherit'
                }}
              >
                <option value="picture-word">Picture Word</option>
                <option value="spot-difference">Spot Difference</option>
                <option value="find-pairs">Find Pairs</option>
                <option value="picture-shadow">Picture Shadow</option>
                <option value="matching-pairs">Matching Pairs</option>
                <option value="ordering">Ordering</option>
                <option value="drag-drop">Drag & Drop</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 14 }}>Difficulty</label>
              <select
                value={form.difficulty}
                onChange={(e) => setForm({...form, difficulty: e.target.value})}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #e2e8f0',
                  borderRadius: 6,
                  fontSize: 14,
                  fontFamily: 'inherit'
                }}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>

          {/* Image URL */}
          <Input
            label="Image URL"
            value={form.imageUrl}
            onChange={(e) => setForm({...form, imageUrl: e.target.value})}
            placeholder="https://..."
          />

          {/* Image Preview */}
          {form.imageUrl && (
            <div>
              <img 
                src={form.imageUrl} 
                alt="Preview" 
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: 150, 
                  borderRadius: 8,
                  border: '1px solid #e2e8f0'
                }}
                onError={() => setError('Invalid image URL')}
              />
            </div>
          )}

          {/* Correct Answer (for picture-word type) */}
          <Input
            label="Correct Answer (for picture-word type)"
            value={form.correctAnswer}
            onChange={(e) => setForm({...form, correctAnswer: e.target.value})}
            placeholder="Enter the correct answer"
          />

          {/* Published Status */}
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 14 }}>Status</label>
            <select
              value={form.isPublished ? 'true' : 'false'}
              onChange={(e) => setForm({...form, isPublished: e.target.value === 'true'})}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #e2e8f0',
                borderRadius: 6,
                fontSize: 14,
                fontFamily: 'inherit'
              }}
            >
              <option value="false">Draft (Not Published)</option>
              <option value="true">Published</option>
            </select>
          </div>

          {/* Error Message */}
          {error && (
            <div style={{
              padding: '12px',
              background: '#fee2e2',
              border: '1px solid #fca5a5',
              borderRadius: 6,
              color: '#991b1b',
              fontSize: 13
            }}>
              ⚠️ {error}
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <Button 
              onClick={handleSave} 
              disabled={saving}
              style={{ flex: 1, background: '#10b981' }}
            >
              {saving ? '⏳ Creating...' : '➕ Create Puzzle'}
            </Button>
            <Button 
              onClick={onClose} 
              style={{ flex: 1, background: '#94a3b8' }}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default AddPuzzleModal;
