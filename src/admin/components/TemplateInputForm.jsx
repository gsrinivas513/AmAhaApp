import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import ImageUpload from '../../components/ImageUpload';

/**
 * TemplateInputForm
 * Generic component that renders input fields based on template schema
 * and collects admin input needed to execute the template.
 * 
 * For Jigsaw: Collects image + defines variants (Easy/Medium/Hard with different piece counts)
 */
export default function TemplateInputForm({ template, typeKey, onInputsReady, onLoading }) {
  const { theme } = useTheme();
  const [inputs, setInputs] = useState({});
  const [variants, setVariants] = useState([
    { label: 'Easy', rows: 3, cols: 4 },
    { label: 'Medium', rows: 4, cols: 6 },
    { label: 'Hard', rows: 6, cols: 8 },
  ]);
  const [error, setError] = useState('');

  if (!template || !template.schema) {
    return (
      <div style={{ padding: 12, color: theme.textSecondary }}>
        No template schema found.
      </div>
    );
  }

  const schema = template.schema || {};

  const handleInputChange = (key, value) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };

  const handleImageUpload = (key, result) => {
    const url = typeof result === 'string' ? result : (result?.url || '');
    setInputs(prev => ({ ...prev, [key]: url }));
  };

  const handleVariantChange = (idx, key, value) => {
    const newVariants = [...variants];
    newVariants[idx] = { ...newVariants[idx], [key]: value };
    setVariants(newVariants);
  };

  const addVariant = () => {
    setVariants([...variants, { label: `Variant ${variants.length + 1}`, rows: 4, cols: 4 }]);
  };

  const removeVariant = (idx) => {
    if (variants.length > 1) {
      setVariants(variants.filter((_, i) => i !== idx));
    }
  };

  const handleSubmit = () => {
    setError('');

    // Validate required inputs based on type
    if (typeKey === 'jigsaw') {
      if (!inputs.imageUrl?.trim()) {
        setError('Image is required');
        return;
      }
      if (variants.length === 0) {
        setError('At least one variant is required');
        return;
      }
      for (let v of variants) {
        if (!v.label?.trim()) {
          setError('All variants must have a label');
          return;
        }
        if (!v.rows || v.rows < 2 || !v.cols || v.cols < 2) {
          setError('All variants must have rows and cols >= 2');
          return;
        }
      }
    }

    // Pass inputs and variants to parent for execution
    onInputsReady({ ...inputs, variants });
  };

  // Render form based on type
  if (typeKey === 'jigsaw') {
    return (
      <div style={{
        background: theme.surfaceSecondary,
        border: `2px solid ${theme.border}`,
        borderRadius: 12,
        padding: 16,
        marginTop: 12,
      }}>
        <h4 style={{ margin: '0 0 12px 0', color: theme.textPrimary }}>📋 Template Inputs</h4>
        <p style={{ margin: '0 0 16px 0', color: theme.textSecondary, fontSize: 13 }}>
          Provide the puzzle image and define difficulty variants (Easy/Medium/Hard).
        </p>

        {/* Image Upload */}
        <div style={{ gridColumn: '1 / -1', marginBottom: 16 }}>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: 8, color: theme.textPrimary }}>
            Puzzle Image *
          </label>
          <ImageUpload
            value={inputs.imageUrl || ''}
            onChange={(result) => handleImageUpload('imageUrl', result)}
            label="Upload Image"
            folder="puzzles/jigsaw"
          />
        </div>

        {/* Variants Definition */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h5 style={{ margin: 0, color: theme.textPrimary }}>🎮 Difficulty Variants</h5>
            <button
              type="button"
              onClick={addVariant}
              style={{
                padding: '6px 12px',
                borderRadius: 6,
                border: `1px solid ${theme.border}`,
                background: theme.surfacePrimary,
                color: theme.textPrimary,
                cursor: 'pointer',
                fontSize: 12,
              }}
            >
              + Add Variant
            </button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '150px 1fr 1fr 1fr auto',
            gap: 12,
            alignItems: 'start',
            marginBottom: 12,
          }}>
            <div style={{ fontWeight: 600, color: theme.textSecondary, fontSize: 12 }}>Label</div>
            <div style={{ fontWeight: 600, color: theme.textSecondary, fontSize: 12 }}>Rows</div>
            <div style={{ fontWeight: 600, color: theme.textSecondary, fontSize: 12 }}>Cols</div>
            <div style={{ fontWeight: 600, color: theme.textSecondary, fontSize: 12 }}>Pieces</div>
            <div />

            {variants.map((v, idx) => (
              <React.Fragment key={idx}>
                <input
                  type="text"
                  value={v.label}
                  onChange={(e) => handleVariantChange(idx, 'label', e.target.value)}
                  placeholder="Variant name"
                  style={{
                    padding: '8px 10px',
                    borderRadius: 6,
                    border: `1px solid ${theme.border}`,
                    background: theme.surfacePrimary,
                    color: theme.textPrimary,
                    fontSize: 13,
                  }}
                />
                <input
                  type="number"
                  min={2}
                  max={20}
                  value={v.rows}
                  onChange={(e) => handleVariantChange(idx, 'rows', Math.max(2, Math.min(20, Number(e.target.value) || 2)))}
                  style={{
                    padding: '8px 10px',
                    borderRadius: 6,
                    border: `1px solid ${theme.border}`,
                    background: theme.surfacePrimary,
                    color: theme.textPrimary,
                    fontSize: 13,
                  }}
                />
                <input
                  type="number"
                  min={2}
                  max={20}
                  value={v.cols}
                  onChange={(e) => handleVariantChange(idx, 'cols', Math.max(2, Math.min(20, Number(e.target.value) || 2)))}
                  style={{
                    padding: '8px 10px',
                    borderRadius: 6,
                    border: `1px solid ${theme.border}`,
                    background: theme.surfacePrimary,
                    color: theme.textPrimary,
                    fontSize: 13,
                  }}
                />
                <div style={{
                  padding: '8px 10px',
                  borderRadius: 6,
                  border: `1px solid ${theme.border}`,
                  background: theme.surfaceSecondary,
                  color: theme.textPrimary,
                  fontWeight: 600,
                  fontSize: 13,
                }}>
                  {v.rows * v.cols}
                </div>
                <button
                  type="button"
                  onClick={() => removeVariant(idx)}
                  disabled={variants.length === 1}
                  style={{
                    padding: '6px 10px',
                    borderRadius: 6,
                    border: `1px solid ${theme.border}`,
                    background: variants.length === 1 ? theme.surfaceSecondary : '#fee2e2',
                    color: variants.length === 1 ? theme.textSecondary : '#991b1b',
                    cursor: variants.length === 1 ? 'not-allowed' : 'pointer',
                    fontWeight: 600,
                    fontSize: 12,
                  }}
                >
                  ✕
                </button>
              </React.Fragment>
            ))}
          </div>
        </div>

        {error && (
          <div style={{ marginBottom: 16, padding: 10, background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 8, color: '#991b1b' }}>
            ⚠️ {error}
          </div>
        )}

        <button
          onClick={handleSubmit}
          style={{
            padding: '12px 16px',
            borderRadius: 8,
            border: `2px solid ${theme.border}`,
            background: theme.primary,
            color: theme.onPrimary,
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          ✓ Execute Template
        </button>
      </div>
    );
  }

  // Fallback for other types (not yet implemented)
  return (
    <div style={{ padding: 12, color: theme.textSecondary }}>
      Input form for {typeKey} coming soon.
    </div>
  );
}
