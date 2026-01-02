import React, { useState, useMemo } from "react";
import { useTheme } from "../../context/ThemeContext";
import ImageUpload from "../../components/ImageUpload";

/**
 * JigsawEditor
 * Admin inline editor for configuring jigsaw puzzles.
 * Supports:
 * - Image URL input
 * - Base grid rows/cols (piece count = rows*cols)
 * - Variants list (each variant rows/cols with label)
 * - Visual preview grid overlay on image
 *
 * Props:
 * - data: { imageUrl, rows, cols, variants: [{ label, rows, cols }] }
 * - onChange: (nextData) => void
 */
export default function JigsawEditor({ data = {}, onChange = () => {} }) {
  const { theme } = useTheme();
  const [local, setLocal] = useState(() => ({
    imageUrl: data.imageUrl || "",
    rows: data.rows || 3,
    cols: data.cols || 4,
    variants: data.variants || [
      { label: "Easy", rows: 3, cols: 4 }, // 12 pieces
      { label: "Medium", rows: 4, cols: 6 }, // 24 pieces
      { label: "Hard", rows: 6, cols: 8 }, // 48 pieces
    ],
  }));

  const pieceCount = useMemo(() => (local.rows * local.cols), [local.rows, local.cols]);

  const handleField = (field, value) => {
    const next = { ...local, [field]: value };
    setLocal(next);
    onChange(next);
  };

  const handleVariantChange = (idx, key, value) => {
    const variants = local.variants.map((v, i) => (i === idx ? { ...v, [key]: value } : v));
    const next = { ...local, variants };
    setLocal(next);
    onChange(next);
  };

  const addVariant = () => {
    const variants = [...local.variants, { label: `Variant ${local.variants.length + 1}`, rows: 4, cols: 4 }];
    const next = { ...local, variants };
    setLocal(next);
    onChange(next);
  };

  const removeVariant = (idx) => {
    const variants = local.variants.filter((_, i) => i !== idx);
    const next = { ...local, variants };
    setLocal(next);
    onChange(next);
  };

  return (
    <div style={{
      background: theme.background,
      border: `2px solid ${theme.border}`,
      borderRadius: 12,
      padding: 16,
    }}>
      <div style={{ marginBottom: 12 }}>
        <h3 style={{ margin: 0, color: theme.textPrimary }}>🧩 Jigsaw Configuration</h3>
        <p style={{ margin: '6px 0 0', color: theme.textSecondary }}>
          Provide an image and configure rows/cols. Variants let players choose different piece counts.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: 6, color: theme.textPrimary }}>Puzzle Image</label>
          <ImageUpload
            value={local.imageUrl}
            onChange={(result) => handleField('imageUrl', typeof result === 'string' ? result : (result?.url || ''))}
            label="Upload Image"
            folder="puzzles/jigsaw"
          />

          <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: 6, color: theme.textPrimary }}>Rows</label>
              <input
                type="number"
                min={2}
                max={20}
                value={local.rows}
                onChange={(e) => handleField('rows', Math.max(2, Math.min(20, Number(e.target.value) || 2)))}
                style={{ width: 90, padding: '10px 12px', borderRadius: 8, border: `2px solid ${theme.border}`, background: theme.surfacePrimary, color: theme.textPrimary }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: 6, color: theme.textPrimary }}>Cols</label>
              <input
                type="number"
                min={2}
                max={20}
                value={local.cols}
                onChange={(e) => handleField('cols', Math.max(2, Math.min(20, Number(e.target.value) || 2)))}
                style={{ width: 90, padding: '10px 12px', borderRadius: 8, border: `2px solid ${theme.border}`, background: theme.surfacePrimary, color: theme.textPrimary }}
              />
            </div>
            <div style={{ alignSelf: 'flex-end', color: theme.textSecondary, fontWeight: 600 }}>
              Pieces: {pieceCount}
            </div>
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: 6, color: theme.textPrimary }}>Preview</label>
          <div style={{
            position: 'relative',
            width: '100%',
            paddingTop: '60%',
            borderRadius: 8,
            overflow: 'hidden',
            border: `2px solid ${theme.border}`,
            background: theme.surfaceSecondary,
          }}>
            {local.imageUrl && (
              <img src={local.imageUrl} alt="Jigsaw" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
            )}
            {/* Grid overlay */}
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
              {/* Vertical lines */}
              {[...Array(local.cols - 1)].map((_, i) => (
                <div key={`v-${i}`} style={{
                  position: 'absolute', top: 0, bottom: 0,
                  left: `${((i + 1) / local.cols) * 100}%`,
                  width: 1,
                  background: theme.border,
                  opacity: 0.7,
                }} />
              ))}
              {/* Horizontal lines */}
              {[...Array(local.rows - 1)].map((_, i) => (
                <div key={`h-${i}`} style={{
                  position: 'absolute', left: 0, right: 0,
                  top: `${((i + 1) / local.rows) * 100}%`,
                  height: 1,
                  background: theme.border,
                  opacity: 0.7,
                }} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <label style={{ display: 'block', fontWeight: 600, marginBottom: 6, color: theme.textPrimary }}>Variants</label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 8 }}>
          {local.variants.map((v, idx) => (
            <React.Fragment key={idx}>
              <input
                type="text"
                value={v.label}
                onChange={(e) => handleVariantChange(idx, 'label', e.target.value)}
                placeholder={`Variant ${idx + 1}`}
                style={{ padding: '10px 12px', borderRadius: 8, border: `2px solid ${theme.border}`, background: theme.surfacePrimary, color: theme.textPrimary }}
              />
              <input
                type="number"
                min={2}
                max={20}
                value={v.rows}
                onChange={(e) => handleVariantChange(idx, 'rows', Math.max(2, Math.min(20, Number(e.target.value) || 2)))}
                style={{ padding: '10px 12px', borderRadius: 8, border: `2px solid ${theme.border}`, background: theme.surfacePrimary, color: theme.textPrimary }}
              />
              <input
                type="number"
                min={2}
                max={20}
                value={v.cols}
                onChange={(e) => handleVariantChange(idx, 'cols', Math.max(2, Math.min(20, Number(e.target.value) || 2)))}
                style={{ padding: '10px 12px', borderRadius: 8, border: `2px solid ${theme.border}`, background: theme.surfacePrimary, color: theme.textPrimary }}
              />
              <button
                type="button"
                onClick={() => removeVariant(idx)}
                style={{ padding: '10px 12px', borderRadius: 8, border: `2px solid ${theme.border}`, background: theme.surfaceSecondary, color: theme.textPrimary, cursor: 'pointer' }}
              >
                Remove
              </button>
            </React.Fragment>
          ))}
        </div>
        <div style={{ marginTop: 8 }}>
          <button
            type="button"
            onClick={addVariant}
            style={{ padding: '10px 12px', borderRadius: 8, border: `2px solid ${theme.border}`, background: theme.surfaceSecondary, color: theme.textPrimary, cursor: 'pointer', fontWeight: 600 }}
          >
            + Add Variant
          </button>
        </div>
      </div>
    </div>
  );
}
