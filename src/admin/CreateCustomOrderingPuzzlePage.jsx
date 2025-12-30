/**
 * CreateCustomOrderingPuzzlePage.jsx
 * Admin page to create custom ordering/sequencing puzzles
 * Supports: Size, Days of Week, Months of Year, Custom Lists
 */

import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import AdminLayout from './AdminLayout';

const PUZZLE_TEMPLATES = {
  size: {
    label: '📏 Size Sequencing',
    description: 'Arrange items from smallest to largest',
    items: [
      { id: 'size-1', label: 'Tiny', order: 1, size: 40 },
      { id: 'size-2', label: 'Small', order: 2, size: 60 },
      { id: 'size-3', label: 'Medium', order: 3, size: 80 },
      { id: 'size-4', label: 'Large', order: 4, size: 100 },
      { id: 'size-5', label: 'Extra Large', order: 5, size: 120 },
      { id: 'size-6', label: '2X Large', order: 6, size: 140 },
      { id: 'size-7', label: '3X Large', order: 7, size: 160 },
      { id: 'size-8', label: '4X Large', order: 8, size: 180 },
    ]
  },
  daysOfWeek: {
    label: '📅 Days of Week',
    description: 'Arrange days from Monday to Sunday',
    items: [
      { id: 'day-1', label: 'Monday', order: 1 },
      { id: 'day-2', label: 'Tuesday', order: 2 },
      { id: 'day-3', label: 'Wednesday', order: 3 },
      { id: 'day-4', label: 'Thursday', order: 4 },
      { id: 'day-5', label: 'Friday', order: 5 },
      { id: 'day-6', label: 'Saturday', order: 6 },
      { id: 'day-7', label: 'Sunday', order: 7 },
    ]
  },
  monthsOfYear: {
    label: '🗓️ Months of Year',
    description: 'Arrange months from January to December',
    items: [
      { id: 'month-1', label: 'January', order: 1 },
      { id: 'month-2', label: 'February', order: 2 },
      { id: 'month-3', label: 'March', order: 3 },
      { id: 'month-4', label: 'April', order: 4 },
      { id: 'month-5', label: 'May', order: 5 },
      { id: 'month-6', label: 'June', order: 6 },
      { id: 'month-7', label: 'July', order: 7 },
      { id: 'month-8', label: 'August', order: 8 },
      { id: 'month-9', label: 'September', order: 9 },
      { id: 'month-10', label: 'October', order: 10 },
      { id: 'month-11', label: 'November', order: 11 },
      { id: 'month-12', label: 'December', order: 12 },
    ]
  },
  seasons: {
    label: '🌸 Seasons',
    description: 'Arrange seasons in order',
    items: [
      { id: 'season-1', label: 'Spring', order: 1 },
      { id: 'season-2', label: 'Summer', order: 2 },
      { id: 'season-3', label: 'Fall', order: 3 },
      { id: 'season-4', label: 'Winter', order: 4 },
    ]
  },
  alphabet: {
    label: '🔤 Alphabet (A-Z)',
    description: 'Arrange letters in alphabetical order',
    items: Array.from({ length: 26 }, (_, i) => ({
      id: `letter-${i + 1}`,
      label: String.fromCharCode(65 + i),
      order: i + 1
    }))
  }
};

export default function CreateCustomOrderingPuzzlePage() {
  const [selectedTemplate, setSelectedTemplate] = useState('size');
  const [puzzleTitle, setPuzzleTitle] = useState('Order by Size - Small to Large');
  const [puzzleDescription, setPuzzleDescription] = useState('Drag items from smallest to largest size');
  const [items, setItems] = useState(PUZZLE_TEMPLATES.size.items);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [success, setSuccess] = useState(false);

  const handleTemplateChange = (templateKey) => {
    const template = PUZZLE_TEMPLATES[templateKey];
    setSelectedTemplate(templateKey);
    setItems([...template.items]);
    setPuzzleTitle(`Order by ${template.label}`);
    setPuzzleDescription(template.description);
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const addItem = () => {
    const newItem = {
      id: `item-${items.length + 1}`,
      label: `Item ${items.length + 1}`,
      order: items.length + 1
    };
    setItems([...items, newItem]);
  };

  const removeItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    // Recalculate order numbers
    newItems.forEach((item, i) => {
      item.order = i + 1;
    });
    setItems(newItems);
  };

  const createPuzzle = async () => {
    if (!puzzleTitle.trim()) {
      setStatus('❌ Please enter a puzzle title');
      return;
    }

    if (items.length < 2) {
      setStatus('❌ Puzzle must have at least 2 items');
      return;
    }

    setLoading(true);
    setStatus('');
    setSuccess(false);

    try {
      setStatus('📝 Creating puzzle...');

      const puzzleData = {
        title: puzzleTitle,
        description: puzzleDescription,
        type: 'ordering',
        category: 'Logic Puzzles',
        categoryId: 'logic-puzzles',
        topic: 'Ordering',
        topicId: 'ordering',
        subtopic: `Custom - ${puzzleTitle}`,
        subtopicId: `ordering-custom-${Date.now()}`,
        difficulty: 'easy',
        ageGroup: '6-8',
        featureId: 'puzzles',
        isPublished: true,
        data: {
          type: selectedTemplate === 'size' ? 'size' : 'custom',
          displayType: selectedTemplate,
          items: items,
          correctOrder: items.map(item => item.order),
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        xpReward: 10,
        timeLimit: null,
        hints: 2,
      };

      const newDoc = await addDoc(collection(db, 'puzzles'), puzzleData);
      setStatus(`✅ Successfully created puzzle "${puzzleTitle}" (ID: ${newDoc.id})`);
      setSuccess(true);

      // Reset form
      setTimeout(() => {
        setPuzzleTitle('');
        setPuzzleDescription('');
        setItems([]);
        setStatus('');
      }, 2000);
    } catch (error) {
      console.error('❌ Error:', error);
      setStatus(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="admin-page" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <h2>🎯 Create Custom Ordering Puzzle</h2>
        <p style={{ color: '#666', marginTop: '0.5rem' }}>
          Choose a template or create a custom ordering/sequencing puzzle
        </p>

        {/* Template Selection */}
        <div style={{ marginTop: '2rem', marginBottom: '2rem' }}>
          <h3>Select Template:</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
            {Object.entries(PUZZLE_TEMPLATES).map(([key, template]) => (
              <button
                key={key}
                onClick={() => handleTemplateChange(key)}
                style={{
                  padding: '1rem',
                  border: selectedTemplate === key ? '3px solid #667eea' : '2px solid #ddd',
                  borderRadius: '8px',
                  backgroundColor: selectedTemplate === key ? '#f0f4ff' : '#fff',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.3s',
                  fontWeight: selectedTemplate === key ? '600' : '400',
                }}
              >
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                  {template.label.split(' ')[0]}
                </div>
                <div style={{ fontSize: '0.9rem', color: '#666' }}>
                  {template.label.split(' ').slice(1).join(' ')}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Puzzle Details */}
        <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
          <h3>Puzzle Details:</h3>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Title:
            </label>
            <input
              type="text"
              value={puzzleTitle}
              onChange={(e) => setPuzzleTitle(e.target.value)}
              placeholder="Enter puzzle title"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '1rem',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Description:
            </label>
            <textarea
              value={puzzleDescription}
              onChange={(e) => setPuzzleDescription(e.target.value)}
              placeholder="Enter puzzle description"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '1rem',
                minHeight: '80px',
                boxSizing: 'border-box',
              }}
            />
          </div>
        </div>

        {/* Items Editor */}
        <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: '#fff9e6', borderRadius: '8px' }}>
          <h3>Items ({items.length}):</h3>
          <div style={{ marginBottom: '1rem' }}>
            {items.map((item, index) => (
              <div
                key={index}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '60px 1fr 60px',
                  gap: '0.5rem',
                  marginBottom: '0.75rem',
                  alignItems: 'center',
                }}
              >
                <div style={{ fontWeight: '600', color: '#667eea', textAlign: 'center' }}>
                  #{item.order}
                </div>
                <input
                  type="text"
                  value={item.label}
                  onChange={(e) => handleItemChange(index, 'label', e.target.value)}
                  placeholder="Item label"
                  style={{
                    padding: '0.5rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '0.95rem',
                  }}
                />
                <button
                  onClick={() => removeItem(index)}
                  disabled={items.length <= 2}
                  style={{
                    padding: '0.5rem',
                    backgroundColor: '#ff6b6b',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: items.length <= 2 ? 'not-allowed' : 'pointer',
                    opacity: items.length <= 2 ? '0.5' : '1',
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={addItem}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: '600',
            }}
          >
            + Add Item
          </button>
        </div>

        {/* Create Button */}
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <button
            onClick={createPuzzle}
            disabled={loading}
            style={{
              padding: '0.75rem 2rem',
              fontSize: '1rem',
              backgroundColor: loading ? '#ccc' : '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: '600',
            }}
          >
            {loading ? '⏳ Creating...' : '🚀 Create Puzzle'}
          </button>
        </div>

        {/* Status Message */}
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
              textAlign: 'center',
            }}
          >
            {status}
          </div>
        )}

        {/* Info Box */}
        <div
          style={{
            marginTop: '2rem',
            padding: '1.5rem',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            backgroundColor: '#f0f7ff',
          }}
        >
          <h3>ℹ️ Available Templates:</h3>
          <ul style={{ lineHeight: '2' }}>
            <li>📏 <strong>Size Sequencing</strong> - Arrange items from smallest to largest</li>
            <li>📅 <strong>Days of Week</strong> - Monday through Sunday (7 items)</li>
            <li>🗓️ <strong>Months of Year</strong> - January through December (12 items)</li>
            <li>🌸 <strong>Seasons</strong> - Spring, Summer, Fall, Winter (4 items)</li>
            <li>🔤 <strong>Alphabet</strong> - Letters A-Z (26 items)</li>
          </ul>
          <p style={{ marginTop: '1rem', color: '#666', fontSize: '0.95rem' }}>
            You can also modify any template to create custom content!
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
