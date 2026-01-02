// src/admin/components/AdminTemplatePreviewModal.jsx
import React, { useEffect, useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { sanitizeTemplateForEditor } from "../utils/templateGuards";
import { runTemplate } from "../utils/templateExecutor";

export default function AdminTemplatePreviewModal({ open, onClose, template, editorKind, currentData }) {
  const { theme } = useTheme();
  const safeTemplate = template || {};
  const { name, description, typeKey, schema = {} } = safeTemplate;

  // Parameters for template execution (for types that need input)
  const [params, setParams] = useState(() => ({
    imageUrl: '',
    rows: schema.rows || 3,
    cols: schema.cols || 4,
  }));
  const [exec, setExec] = useState({ running: false, error: '', result: null });

  useEffect(() => {
    setParams((p) => ({ ...p, rows: schema.rows || p.rows || 3, cols: schema.cols || p.cols || 4 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schema.rows, schema.cols, typeKey]);

  const summary = [];
  if (Array.isArray(schema.pairs)) {
    summary.push(`${schema.pairs.length} pair(s)`);
  }
  if (Array.isArray(schema.items)) {
    summary.push(`${schema.items.length} item(s)`);
  }
  if (Array.isArray(schema.gridRows)) {
    const width = schema.gridRows[0]?.length || 0;
    summary.push(`${schema.gridRows.length} rows × ${width} cols`);
  }
  if (Array.isArray(schema.words)) {
    summary.push(`${schema.words.length} word(s)`);
  }
  if (Array.isArray(schema.differencePoints)) {
    summary.push(`${schema.differencePoints.length} difference point(s)`);
  }

  const listSample = (arr, max = 6) => (arr || []).slice(0, max);

  const sanitized = sanitizeTemplateForEditor(template, editorKind);

  const renderDiffs = () => {
    const diffs = [];
    switch (editorKind) {
      case 'picture-word': {
        const curr = (currentData?.pairs || []).length;
        const next = (sanitized?.pairs || []).length;
        diffs.push(`Pairs: ${curr} → ${next}`);
        break;
      }
      case 'picture-shadow': {
        const curr = (currentData?.pairs || []).length;
        const next = (sanitized?.pairs || []).length;
        diffs.push(`Pairs: ${curr} → ${next}`);
        break;
      }
      case 'find-pair': {
        const currPairs = Math.floor((currentData?.cards || []).length / 2);
        const next = (sanitized?.pairs || []).length;
        diffs.push(`Pairs: ${currPairs} → ${next}`);
        break;
      }
      case 'word-search': {
        const currRows = (currentData?.gridRows || []).length;
        const nextRows = (sanitized?.gridRows || []).length;
        const currWords = (currentData?.words || []).length;
        const nextWords = (sanitized?.words || []).length;
        diffs.push(`Grid rows: ${currRows} → ${nextRows}`);
        diffs.push(`Words: ${currWords} → ${nextWords}`);
        break;
      }
      case 'spot-difference': {
        const currPts = (currentData?.differences || []).length;
        const nextPts = (sanitized?.differencePoints || []).length;
        diffs.push(`Difference points: ${currPts} → ${nextPts}`);
        const currImg = (currentData?.imageA ? 1 : 0) + (currentData?.imageB ? 1 : 0);
        const nextImg = (sanitized?.baseImageUrl ? 1 : 0) + (sanitized?.alteredImageUrl ? 1 : 0);
        diffs.push(`Images present: ${currImg}/2 → ${nextImg}/2`);
        break;
      }
      case 'ordering': {
        const curr = (currentData?.items || []).length;
        const next = (sanitized?.items || []).length;
        diffs.push(`Items: ${curr} → ${next}`);
        break;
      }
      default:
        break;
    }
    if (diffs.length === 0) return null;
    return (
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontWeight: 700, marginBottom: 6 }}>Changes</div>
        <ul style={{ margin: 0, paddingLeft: 16 }}>
          {diffs.map((d, i) => (<li key={i}>{d}</li>))}
        </ul>
      </div>
    );
  };

  if (!open || !template) {
    return null;
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div style={{ width: 'min(640px, 92vw)', background: theme.surfacePrimary, color: theme.textPrimary, border: `2px solid ${theme.border}`, borderRadius: 12, boxShadow: '0 12px 32px rgba(0,0,0,0.25)' }}>
        <div style={{ padding: 16, borderBottom: `1px solid ${theme.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: 18 }}>{name || 'Template'}</div>
            <div style={{ fontSize: 12, color: theme.textSecondary }}>{typeKey}</div>
          </div>
          <button onClick={onClose} style={{ border: `1px solid ${theme.border}`, background: theme.surfaceSecondary, color: theme.textPrimary, borderRadius: 8, padding: '6px 10px', cursor: 'pointer' }}>Close</button>
        </div>

        <div style={{ padding: 16 }}>
          {description && <div style={{ marginBottom: 8, color: theme.textSecondary }}>{description}</div>}

          {summary.length > 0 && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>Summary</div>
              <ul style={{ margin: 0, paddingLeft: 16 }}>
                {summary.map((s, i) => (<li key={i}>{s}</li>))}
              </ul>
            </div>
          )}

          {renderDiffs()}

          {Array.isArray(schema.items) && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>Items (sample)</div>
              <ul style={{ margin: 0, paddingLeft: 16 }}>
                {listSample(schema.items).map((it, i) => (
                  <li key={i}>{typeof it === 'string' ? it : (it?.label || JSON.stringify(it))}</li>
                ))}
              </ul>
            </div>
          )}

          {Array.isArray(schema.pairs) && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>Pairs (sample)</div>
              <ul style={{ margin: 0, paddingLeft: 16 }}>
                {listSample(schema.pairs).map((p, i) => (
                  <li key={i}>{p?.left || p?.leftImageUrl ? `${p.left || ''} ${p.leftImageUrl ? '(img)' : ''}` : ''} {p?.right || p?.rightImageUrl ? `↔ ${p.right || ''} ${p.rightImageUrl ? '(img)' : ''}` : ''}</li>
                ))}
              </ul>
            </div>
          )}

          {Array.isArray(schema.words) && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>Words (sample)</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {listSample(schema.words).map((w, i) => (
                  <span key={i} style={{ border: `1px solid ${theme.border}`, borderRadius: 999, padding: '4px 8px', background: theme.surfaceSecondary }}>{w}</span>
                ))}
              </div>
            </div>
          )}

          {Array.isArray(schema.gridRows) && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>Grid (first 4 rows)</div>
              <pre style={{ margin: 0, overflow: 'auto', background: theme.background, border: `1px solid ${theme.border}`, borderRadius: 8, padding: 8 }}>{listSample(schema.gridRows, 4).join('\n')}</pre>
            </div>
          )}

          {Array.isArray(schema.differencePoints) && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>Difference Points (sample)</div>
              <ul style={{ margin: 0, paddingLeft: 16 }}>
                {listSample(schema.differencePoints).map((p, i) => (
                  <li key={i}>x: {Math.round(p.x || 0)}%, y: {Math.round(p.y || 0)}%</li>
                ))}
              </ul>
            </div>
          )}

          {/* Jigsaw execution preview */}
          {typeKey === 'jigsaw' && (
            <div style={{ marginTop: 16, borderTop: `1px solid ${theme.border}`, paddingTop: 12 }}>
              <div style={{ fontWeight: 700, marginBottom: 8 }}>Run Template</div>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: 8, alignItems: 'center' }}>
                <input
                  type="text"
                  placeholder="Image URL"
                  value={params.imageUrl}
                  onChange={(e) => setParams({ ...params, imageUrl: e.target.value })}
                  style={{ padding: '10px 12px', borderRadius: 8, border: `2px solid ${theme.border}`, background: theme.surfacePrimary, color: theme.textPrimary }}
                />
                <input
                  type="number"
                  min={2}
                  max={20}
                  value={params.rows}
                  onChange={(e) => setParams({ ...params, rows: Math.max(2, Math.min(20, Number(e.target.value) || 2)) })}
                  style={{ padding: '10px 12px', borderRadius: 8, border: `2px solid ${theme.border}`, background: theme.surfacePrimary, color: theme.textPrimary }}
                />
                <input
                  type="number"
                  min={2}
                  max={20}
                  value={params.cols}
                  onChange={(e) => setParams({ ...params, cols: Math.max(2, Math.min(20, Number(e.target.value) || 2)) })}
                  style={{ padding: '10px 12px', borderRadius: 8, border: `2px solid ${theme.border}`, background: theme.surfacePrimary, color: theme.textPrimary }}
                />
                <button
                  type="button"
                  onClick={async () => {
                    setExec({ running: true, error: '', result: null });
                    const res = await runTemplate(typeKey, schema, params);
                    setExec({ running: false, error: res.ok ? '' : (res.error || 'Error'), result: res.result });
                  }}
                  style={{ padding: '10px 12px', borderRadius: 8, border: `2px solid ${theme.border}`, background: theme.surfaceSecondary, color: theme.textPrimary, cursor: 'pointer', fontWeight: 600 }}
                >
                  {exec.running ? 'Running…' : 'Run'}
                </button>
              </div>
              {exec.error && (
                <div style={{ marginTop: 8, color: '#FF6B6B' }}>⚠️ {exec.error}</div>
              )}
              {exec.result && (
                <div style={{ marginTop: 12 }}>
                  <div style={{ color: theme.textSecondary }}>Pieces preview (showing up to 12):</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 6 }}>
                    {(exec.result.pieces || []).map((url, i) => (
                      <img key={i} src={url} alt={`piece-${i}`} style={{ width: '100%', aspectRatio: '1 / 1', objectFit: 'cover', borderRadius: 6, border: `1px solid ${theme.border}` }} />
                    ))}
                  </div>
                  <div style={{ marginTop: 8, color: theme.textSecondary }}>Rows: {exec.result.rows} • Cols: {exec.result.cols}</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
