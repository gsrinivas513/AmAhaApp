import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { db } from '../../firebase/firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';

export default function QuizEditModal({ quiz, isOpen, onClose, onSave }) {
  const { theme } = useTheme();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (quiz) {
      setFormData({
        title: quiz.title || '',
        category: quiz.category || '',
        audience: quiz.audience || '',
        difficulty: quiz.difficulty || '',
        questions: quiz.questions ? (Array.isArray(quiz.questions) ? quiz.questions.length : quiz.questions) : 0,
      });
    }
  }, [quiz, isOpen]);

  const CATEGORIES = ['Science', 'Math', 'History', 'Geography', 'Literature', 'Technology'];
  const AUDIENCES = ['All Users', 'Kids 5-12', 'Students 13-18', 'Professionals', 'Programmers'];
  const DIFFICULTIES = ['Easy', 'Medium', 'Hard', 'Expert'];

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Title is required');
      return false;
    }
    if (!formData.category) {
      setError('Category is required');
      return false;
    }
    if (!formData.audience) {
      setError('Audience is required');
      return false;
    }
    setError('');
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const updateData = {
        title: formData.title,
        category: formData.category,
        audience: formData.audience,
        difficulty: formData.difficulty,
      };

      await updateDoc(doc(db, 'quizzes', quiz.id), updateData);
      setSuccess(true);
      setTimeout(() => {
        onSave(updateData);
        onClose();
      }, 1000);
    } catch (err) {
      setError('Error saving quiz: ' + err.message);
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
          maxWidth: '500px',
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
            ✏️ Edit Quiz
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
            ✓ Quiz saved successfully!
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
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
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
              <option value="">Select Category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
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
              background: 'linear-gradient(135deg, #4ECDC4, #FFE66D)',
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
