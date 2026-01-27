import React, { useState, useEffect } from 'react';
import { QUIZ_TYPE_PLUGINS } from '../../quizzes/registry/quizTypeRegistry';

/**
 * AddEditQuizTypeModal - Create or edit quiz types
 */
export const AddEditQuizTypeModal = ({
  isOpen,
  type = null,
  onSave,
  onCancel,
  theme,
}) => {
  const [formData, setFormData] = useState({
    id: '',
    label: '',
    description: '',
    category: 'basic',
    complexity: 'simple',
    inputType: '',
    evaluationType: '',
    supportsMedia: false,
    defaultPoints: 10,
    metadata: {
      icon: '?',
      color: '#007AFF',
    },
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (type) {
      // Ensure metadata exists and has required fields
      const mergedType = {
        id: '',
        label: '',
        description: '',
        category: 'basic',
        complexity: 'simple',
        inputType: '',
        evaluationType: '',
        supportsMedia: false,
        defaultPoints: 10,
        metadata: {
          icon: '?',
          color: '#007AFF',
        },
        ...type,
        // Ensure metadata is merged, not replaced
        metadata: {
          icon: '?',
          color: '#007AFF',
          ...(type.metadata || {}),
        },
      };
      setFormData(mergedType);
    } else {
      resetForm();
    }
    setErrors({});
  }, [type, isOpen]);

  const resetForm = () => {
    setFormData({
      id: '',
      label: '',
      description: '',
      category: 'basic',
      complexity: 'simple',
      inputType: '',
      evaluationType: '',
      supportsMedia: false,
      defaultPoints: 10,
      metadata: {
        icon: '?',
        color: '#007AFF',
      },
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.id.trim()) {
      newErrors.id = 'Type ID is required';
    } else if (!/^[A-Z_]+$/.test(formData.id)) {
      newErrors.id = 'Type ID must be uppercase letters and underscores only';
    }

    if (!formData.label.trim()) {
      newErrors.label = 'Label is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.inputType.trim()) {
      newErrors.inputType = 'Input type is required';
    }

    if (formData.defaultPoints < 1 || formData.defaultPoints > 100) {
      newErrors.defaultPoints = 'Points must be between 1 and 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleMetadataChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        [field]: value,
      },
    }));
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await onSave(formData);
      resetForm();
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const inputTypeOptions = [
    'single_select',
    'multi_select',
    'boolean',
    'text_input',
    'pair_matching',
    'drag_reorder',
    'code_editor',
    'image_click',
    'word_selection',
    'number_grid',
    'text_grid',
  ];

  const evaluationTypeOptions = [
    'exact',
    'fuzzy',
    'partial',
    'sequence',
    'coordinate_match',
    'word_match',
    'grid_match',
    'sudoku_rules',
    'test_cases',
  ];

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={onCancel}
    >
      <div
        style={{
          background: theme?.surfacePrimary || '#fff',
          borderRadius: '12px',
          padding: '24px',
          maxWidth: '600px',
          width: '90%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
          }}
        >
          <h2
            style={{
              color: theme?.textPrimary || '#333',
              fontSize: '18px',
              fontWeight: '700',
              margin: 0,
            }}
          >
            {type?.docId ? 'Edit Quiz Type' : 'Add New Quiz Type'}
          </h2>
          <button
            onClick={onCancel}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: theme?.textSecondary || '#666',
            }}
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <div style={{ display: 'grid', gap: '16px', marginBottom: '20px' }}>
          {/* ID */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: '600',
                color: theme?.textPrimary || '#333',
                marginBottom: '6px',
                textTransform: 'uppercase',
              }}
            >
              Type ID {type?.isSystem && <span style={{ color: '#999' }}>(System)</span>}
            </label>
            <input
              type="text"
              value={formData.id}
              onChange={(e) => handleChange('id', e.target.value)}
              disabled={type?.isSystem}
              placeholder="e.g., MCQ, TRUE_FALSE"
              style={{
                width: '100%',
                padding: '10px 12px',
                border: `1px solid ${errors.id ? '#EF5350' : theme?.border || '#ddd'}`,
                borderRadius: '6px',
                background: theme?.surfaceSecondary || '#f9f9f9',
                color: theme?.textPrimary || '#333',
                fontSize: '14px',
                boxSizing: 'border-box',
              }}
            />
            {errors.id && (
              <div style={{ color: '#EF5350', fontSize: '12px', marginTop: '4px' }}>
                {errors.id}
              </div>
            )}
          </div>

          {/* Label */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: '600',
                color: theme?.textPrimary || '#333',
                marginBottom: '6px',
                textTransform: 'uppercase',
              }}
            >
              Label
            </label>
            <input
              type="text"
              value={formData.label}
              onChange={(e) => handleChange('label', e.target.value)}
              placeholder="e.g., Multiple Choice"
              style={{
                width: '100%',
                padding: '10px 12px',
                border: `1px solid ${errors.label ? '#EF5350' : theme?.border || '#ddd'}`,
                borderRadius: '6px',
                background: theme?.surfaceSecondary || '#f9f9f9',
                color: theme?.textPrimary || '#333',
                fontSize: '14px',
                boxSizing: 'border-box',
              }}
            />
            {errors.label && (
              <div style={{ color: '#EF5350', fontSize: '12px', marginTop: '4px' }}>
                {errors.label}
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: '600',
                color: theme?.textPrimary || '#333',
                marginBottom: '6px',
                textTransform: 'uppercase',
              }}
            >
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Describe this quiz type..."
              style={{
                width: '100%',
                padding: '10px 12px',
                border: `1px solid ${errors.description ? '#EF5350' : theme?.border || '#ddd'}`,
                borderRadius: '6px',
                background: theme?.surfaceSecondary || '#f9f9f9',
                color: theme?.textPrimary || '#333',
                fontSize: '14px',
                boxSizing: 'border-box',
                minHeight: '80px',
                fontFamily: 'inherit',
              }}
            />
            {errors.description && (
              <div style={{ color: '#EF5350', fontSize: '12px', marginTop: '4px' }}>
                {errors.description}
              </div>
            )}
          </div>

          {/* Category and Complexity */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: theme?.textPrimary || '#333',
                  marginBottom: '6px',
                  textTransform: 'uppercase',
                }}
              >
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: `1px solid ${theme?.border || '#ddd'}`,
                  borderRadius: '6px',
                  background: theme?.surfaceSecondary || '#f9f9f9',
                  color: theme?.textPrimary || '#333',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
              >
                <option value="basic">Basic</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: theme?.textPrimary || '#333',
                  marginBottom: '6px',
                  textTransform: 'uppercase',
                }}
              >
                Complexity
              </label>
              <select
                value={formData.complexity}
                onChange={(e) => handleChange('complexity', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: `1px solid ${theme?.border || '#ddd'}`,
                  borderRadius: '6px',
                  background: theme?.surfaceSecondary || '#f9f9f9',
                  color: theme?.textPrimary || '#333',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
              >
                <option value="simple">Simple</option>
                <option value="medium">Medium</option>
                <option value="complex">Complex</option>
              </select>
            </div>
          </div>

          {/* Input Type */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: '600',
                color: theme?.textPrimary || '#333',
                marginBottom: '6px',
                textTransform: 'uppercase',
              }}
            >
              Input Type
            </label>
            <select
              value={formData.inputType}
              onChange={(e) => handleChange('inputType', e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: `1px solid ${errors.inputType ? '#EF5350' : theme?.border || '#ddd'}`,
                borderRadius: '6px',
                background: theme?.surfaceSecondary || '#f9f9f9',
                color: theme?.textPrimary || '#333',
                fontSize: '14px',
                boxSizing: 'border-box',
              }}
            >
              <option value="">Select input type...</option>
              {inputTypeOptions.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {errors.inputType && (
              <div style={{ color: '#EF5350', fontSize: '12px', marginTop: '4px' }}>
                {errors.inputType}
              </div>
            )}
          </div>

          {/* Evaluation Type */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: '600',
                color: theme?.textPrimary || '#333',
                marginBottom: '6px',
                textTransform: 'uppercase',
              }}
            >
              Evaluation Type
            </label>
            <select
              value={formData.evaluationType}
              onChange={(e) => handleChange('evaluationType', e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: `1px solid ${theme?.border || '#ddd'}`,
                borderRadius: '6px',
                background: theme?.surfaceSecondary || '#f9f9f9',
                color: theme?.textPrimary || '#333',
                fontSize: '14px',
                boxSizing: 'border-box',
              }}
            >
              <option value="">Select evaluation type...</option>
              {evaluationTypeOptions.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Default Points */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: '600',
                color: theme?.textPrimary || '#333',
                marginBottom: '6px',
                textTransform: 'uppercase',
              }}
            >
              Default Points (1-100)
            </label>
            <input
              type="number"
              min="1"
              max="100"
              value={formData.defaultPoints}
              onChange={(e) => handleChange('defaultPoints', parseInt(e.target.value))}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: `1px solid ${errors.defaultPoints ? '#EF5350' : theme?.border || '#ddd'}`,
                borderRadius: '6px',
                background: theme?.surfaceSecondary || '#f9f9f9',
                color: theme?.textPrimary || '#333',
                fontSize: '14px',
                boxSizing: 'border-box',
              }}
            />
            {errors.defaultPoints && (
              <div style={{ color: '#EF5350', fontSize: '12px', marginTop: '4px' }}>
                {errors.defaultPoints}
              </div>
            )}
          </div>

          {/* Metadata: Color and Icon */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: theme?.textPrimary || '#333',
                  marginBottom: '6px',
                  textTransform: 'uppercase',
                }}
              >
                Icon
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  value={formData.metadata.icon}
                  onChange={(e) => handleMetadataChange('icon', e.target.value)}
                  maxLength="3"
                  style={{
                    flex: 1,
                    padding: '10px 12px',
                    border: `1px solid ${theme?.border || '#ddd'}`,
                    borderRadius: '6px',
                    background: theme?.surfaceSecondary || '#f9f9f9',
                    color: theme?.textPrimary || '#333',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                  }}
                />
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '6px',
                    background: formData.metadata.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontSize: '20px',
                    fontWeight: 'bold',
                  }}
                >
                  {formData.metadata.icon}
                </div>
              </div>
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: theme?.textPrimary || '#333',
                  marginBottom: '6px',
                  textTransform: 'uppercase',
                }}
              >
                Color
              </label>
              <input
                type="color"
                value={formData.metadata.color}
                onChange={(e) => handleMetadataChange('color', e.target.value)}
                style={{
                  width: '100%',
                  height: '42px',
                  border: `1px solid ${theme?.border || '#ddd'}`,
                  borderRadius: '6px',
                  cursor: 'pointer',
                }}
              />
            </div>
          </div>

          {/* Media Support */}
          <div>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                color: theme?.textPrimary || '#333',
              }}
            >
              <input
                type="checkbox"
                checked={formData.supportsMedia}
                onChange={(e) => handleChange('supportsMedia', e.target.checked)}
                style={{ cursor: 'pointer' }}
              />
              Supports Media (images, audio, video)
            </label>
          </div>

          {/* Error message */}
          {errors.submit && (
            <div
              style={{
                padding: '12px',
                background: '#FFEBEE',
                border: '1px solid #EF5350',
                borderRadius: '6px',
                color: '#C62828',
                fontSize: '12px',
              }}
            >
              {errors.submit}
            </div>
          )}
        </div>

        {/* Actions */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'flex-end',
          }}
        >
          <button
            onClick={onCancel}
            disabled={loading}
            style={{
              padding: '10px 20px',
              background: theme?.surfaceSecondary || '#f9f9f9',
              color: theme?.textPrimary || '#333',
              border: `1px solid ${theme?.border || '#ddd'}`,
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              padding: '10px 24px',
              background: theme?.accentPrimary || '#007AFF',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? 'Saving...' : 'Save Type'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEditQuizTypeModal;
