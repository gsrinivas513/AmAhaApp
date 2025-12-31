import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { db } from '../../firebase/firebaseConfig';
import { doc, updateDoc, collection, getDocs } from 'firebase/firestore';

export default function PuzzleEditModal({ puzzle, isOpen, onClose, onSave }) {
  const { theme } = useTheme();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Ordering puzzle specific state
  const [itemType, setItemType] = useState('custom');
  const [maxRange, setMaxRange] = useState('');
  const [items, setItems] = useState([]);
  const [customTemplates, setCustomTemplates] = useState([]);

  const PUZZLE_TYPES = ['Jigsaw', 'Sudoku', 'Crossword', 'Logic', 'Matching', 'Pattern', 'Ordering'];
  const AUDIENCES = ['All Users', 'Kids 5-12', 'Students 13-18', 'Professionals', 'Programmers'];
  const DIFFICULTIES = ['Easy', 'Medium', 'Hard', 'Expert'];
  const ITEM_TYPES = ['custom', 'daysOfWeek', 'monthsOfYear', 'seasons', 'alphabet', 'numbers'];
  const QUICK_TEMPLATES = {
    daysOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    monthsOfYear: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    seasons: ['Spring', 'Summer', 'Fall', 'Winter'],
    alphabet: Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ'),
  };

  // Load custom templates from Firestore
  const loadCustomTemplates = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'puzzleTemplates'));
      const templates = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCustomTemplates(templates);
    } catch (err) {
      console.error('Error loading templates:', err);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadCustomTemplates();
    }
  }, [isOpen]);

  useEffect(() => {
    if (puzzle && isOpen) {
      setFormData({
        title: puzzle.title || '',
        type: puzzle.type || '',
        audience: puzzle.audience || '',
        difficulty: puzzle.difficulty || '',
      });

      // Load ordering-specific data if applicable
      if (puzzle.type === 'Ordering' || puzzle.type === 'ordering') {
        const puzzleData = puzzle.data || {};
        setItemType(puzzleData.itemType || 'custom');
        setMaxRange(puzzleData.maxRange?.toString() || '');
        setItems(puzzleData.items || []);
      }
      setError('');
      setSuccess(false);
    }
  }, [puzzle, isOpen]);

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Title is required');
      return false;
    }
    if (!formData.type) {
      setError('Type is required');
      return false;
    }
    if (!formData.audience) {
      setError('Audience is required');
      return false;
    }
    setError('');
    return true;
  };

  const generateNumberRanges = (max) => {
    const ranges = [];
    for (let i = 1; i <= max; i += 10) {
      const start = i;
      const end = Math.min(i + 9, max);
      ranges.push({
        label: `${start}-${end}`,
        min: start,
        max: end,
      });
    }
    return ranges;
  };

  const handleGenerateNumbers = () => {
    if (!maxRange || maxRange < 1) {
      setError('Please enter a valid maximum number');
      return;
    }
    const max = parseInt(maxRange);
    const newItems = [];
    for (let i = 1; i <= max; i++) {
      newItems.push({
        id: `item-${i}`,
        label: String(i),
        order: i,
        number: i,
      });
    }
    setItems(newItems);
    setError('');
  };

  const handleApplyTemplate = (templateName, customItems = null) => {
    const templateItems = customItems || QUICK_TEMPLATES[templateName];
    const newItems = templateItems.map((label, index) => ({
      id: `item-${index}`,
      label: typeof label === 'string' ? label : label.label || label,
      order: index + 1,
    }));
    setItems(newItems);
    setItemType(templateName);
    setError('');
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const updateData = {
        title: formData.title,
        type: formData.type,
        audience: formData.audience,
        difficulty: formData.difficulty,
      };

      // For ordering puzzles, include puzzle-specific data
      if (formData.type === 'Ordering' || formData.type === 'ordering') {
        const ranges = itemType === 'numbers' ? generateNumberRanges(parseInt(maxRange) || 0) : [];
        updateData.data = {
          itemType,
          maxRange: itemType === 'numbers' ? parseInt(maxRange) : null,
          items,
          numberRanges: ranges,
          levels: ranges,
          correctOrder: items.map((_, i) => i),
        };
      }

      await updateDoc(doc(db, 'puzzles', puzzle.id), updateData);
      setSuccess(true);
      setTimeout(() => {
        onSave(updateData);
        onClose();
      }, 1000);
    } catch (err) {
      setError('Error saving puzzle: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !formData) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: theme.surfacePrimary,
          border: `2px solid ${theme.border}`,
          borderRadius: '16px',
          padding: '32px',
          maxWidth: '600px',
          width: '90%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px',
          }}
        >
          <h2
            style={{
              color: theme.textPrimary,
              fontSize: '24px',
              fontWeight: '700',
              margin: 0,
            }}
          >
            ✏️ Edit Puzzle
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: theme.textSecondary,
            }}
          >
            ✕
          </button>
        </div>

        {error && (
          <div
            style={{
              background: '#FF6B6B25',
              color: '#FF6B6B',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '16px',
              fontSize: '13px',
              fontWeight: '600',
            }}
          >
            {error}
          </div>
        )}

        {success && (
          <div
            style={{
              background: '#4ECDC425',
              color: '#4ECDC4',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '16px',
              fontSize: '13px',
              fontWeight: '600',
            }}
          >
            ✓ Puzzle saved successfully!
          </div>
        )}

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            marginBottom: '24px',
          }}
        >
          <div>
            <label
              style={{
                color: theme.textSecondary,
                fontSize: '12px',
                fontWeight: '600',
                display: 'block',
                marginBottom: '8px',
              }}
            >
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              style={{
                width: '100%',
                padding: '12px',
                background: theme.background,
                border: `2px solid ${theme.border}`,
                borderRadius: '8px',
                color: theme.textPrimary,
                fontSize: '14px',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div>
            <label
              style={{
                color: theme.textSecondary,
                fontSize: '12px',
                fontWeight: '600',
                display: 'block',
                marginBottom: '8px',
              }}
            >
              Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              style={{
                width: '100%',
                padding: '12px',
                background: theme.background,
                border: `2px solid ${theme.border}`,
                borderRadius: '8px',
                color: theme.textPrimary,
                fontSize: '14px',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
              }}
            >
              <option value="">Select Type</option>
              {PUZZLE_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              style={{
                color: theme.textSecondary,
                fontSize: '12px',
                fontWeight: '600',
                display: 'block',
                marginBottom: '8px',
              }}
            >
              Audience
            </label>
            <select
              value={formData.audience}
              onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
              style={{
                width: '100%',
                padding: '12px',
                background: theme.background,
                border: `2px solid ${theme.border}`,
                borderRadius: '8px',
                color: theme.textPrimary,
                fontSize: '14px',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
              }}
            >
              <option value="">Select Audience</option>
              {AUDIENCES.map((aud) => (
                <option key={aud} value={aud}>
                  {aud}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              style={{
                color: theme.textSecondary,
                fontSize: '12px',
                fontWeight: '600',
                display: 'block',
                marginBottom: '8px',
              }}
            >
              Difficulty
            </label>
            <select
              value={formData.difficulty}
              onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
              style={{
                width: '100%',
                padding: '12px',
                background: theme.background,
                border: `2px solid ${theme.border}`,
                borderRadius: '8px',
                color: theme.textPrimary,
                fontSize: '14px',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
              }}
            >
              <option value="">Select Difficulty</option>
              {DIFFICULTIES.map((diff) => (
                <option key={diff} value={diff}>
                  {diff}
                </option>
              ))}
            </select>
          </div>

          {/* Ordering Puzzle Specific Fields */}
          {(formData.type === 'Ordering' || formData.type === 'ordering') && (
            <>
              <div style={{ borderTop: `2px solid ${theme.border}`, paddingTop: '16px', marginTop: '16px' }}>
                <h3 style={{ color: theme.textPrimary, fontSize: '14px', fontWeight: '700', marginBottom: '12px' }}>
                  🔢 Sequence/Ordering Configuration
                </h3>
              </div>

              {/* Quick Templates */}
              <div>
                <label style={{ color: theme.textSecondary, fontSize: '12px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>
                  Quick Templates
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                  {Object.keys(QUICK_TEMPLATES).map(template => (
                    <button
                      key={template}
                      onClick={() => handleApplyTemplate(template)}
                      style={{
                        padding: '8px 12px',
                        background: itemType === template ? theme.accentPrimary : theme.background,
                        color: itemType === template ? '#fff' : theme.textPrimary,
                        border: `2px solid ${itemType === template ? theme.accentPrimary : theme.border}`,
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                    >
                      {template === 'daysOfWeek' ? '📅 Days' : template === 'monthsOfYear' ? '🗓️ Months' : template === 'seasons' ? '🌍 Seasons' : '🔤 Alphabet'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Templates from Firestore */}
              {customTemplates.length > 0 && (
                <div>
                  <label style={{ color: theme.textSecondary, fontSize: '12px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>
                    Custom Templates
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '8px' }}>
                    {customTemplates.map(template => (
                      <button
                        key={template.id}
                        onClick={() => handleApplyTemplate(template.name, template.items)}
                        style={{
                          padding: '8px 12px',
                          background: itemType === template.name ? theme.accentPrimary : theme.background,
                          color: itemType === template.name ? '#fff' : theme.textPrimary,
                          border: `2px solid ${itemType === template.name ? theme.accentPrimary : theme.border}`,
                          borderRadius: '6px',
                          fontSize: '10px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          wordBreak: 'break-word',
                        }}
                        title={template.description}
                      >
                        📝 {template.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Numbers Generator */}
              <div>
                <label style={{ color: theme.textSecondary, fontSize: '12px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>
                  Generate Numbers
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="number"
                    placeholder="Maximum number (e.g., 50)"
                    value={maxRange}
                    onChange={(e) => setMaxRange(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '10px',
                      background: theme.background,
                      border: `2px solid ${theme.border}`,
                      borderRadius: '6px',
                      color: theme.textPrimary,
                      fontSize: '13px',
                      fontFamily: 'inherit',
                      boxSizing: 'border-box',
                    }}
                    min="1"
                  />
                  <button
                    onClick={handleGenerateNumbers}
                    style={{
                      padding: '10px 16px',
                      background: theme.accentPrimary,
                      color: '#fff',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Generate
                  </button>
                </div>
              </div>

              {/* Current Items Display */}
              {items.length > 0 && (
                <div>
                  <label style={{ color: theme.textSecondary, fontSize: '12px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>
                    Items ({items.length})
                  </label>
                  <div style={{
                    background: theme.background,
                    border: `2px solid ${theme.border}`,
                    borderRadius: '6px',
                    padding: '10px',
                    maxHeight: '150px',
                    overflowY: 'auto',
                  }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {items.slice(0, 15).map((item, idx) => (
                        <span
                          key={idx}
                          style={{
                            background: theme.accentPrimary,
                            color: '#fff',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: '600',
                          }}
                        >
                          {item.label}
                        </span>
                      ))}
                      {items.length > 15 && (
                        <span style={{ color: theme.textSecondary, fontSize: '11px', fontWeight: '600' }}>
                          +{items.length - 15} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div
          style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'flex-end',
          }}
        >
          <button
            onClick={onClose}
            disabled={loading}
            style={{
              padding: '12px 24px',
              background: 'transparent',
              color: theme.textPrimary,
              border: `2px solid ${theme.border}`,
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              opacity: loading ? 0.5 : 1,
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            style={{
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? '💾 Saving...' : '💾 Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
