// src/admin/puzzle-editors/WordSearchEditor.jsx
// Editor for word search puzzles using Firestore-safe gridRows
import React, { useState, useEffect, forwardRef } from "react";
import { db } from "../../firebase/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useTheme } from "../../context/ThemeContext";
import AdminEditorToolbar from "../components/AdminEditorToolbar";
import AdminTemplateHint from "../components/AdminTemplateHint";
import { sanitizeTemplateForEditor } from "../utils/templateGuards";

const WordSearchEditor = forwardRef(({ data, onChange }, ref) => {
  const { theme } = useTheme();
  const [gridRows, setGridRows] = useState(Array.isArray(data.gridRows) ? data.gridRows : []);
  const [words, setWords] = useState(Array.isArray(data.words) ? data.words : []);
  const [fetchedTemplates, setFetchedTemplates] = useState([]);
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const [error, setError] = useState("");
  // toolbar manages template selection; local state not needed

  useEffect(() => {
    const loadTemplates = async () => {
      try {
        setLoadingTemplates(true);
        const q = query(collection(db, "puzzleTemplates"), where("typeKey", "==", "wordSearch"));
        const snap = await getDocs(q);
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setFetchedTemplates(list);
      } catch (e) {
        console.error("Failed to load templates", e);
      } finally {
        setLoadingTemplates(false);
      }
    };
    loadTemplates();
  }, []);

  const applyTemplateSchema = (t) => {
    const sanitized = sanitizeTemplateForEditor(t, 'word-search');
    const rows = Array.isArray(sanitized?.gridRows) ? sanitized.gridRows : [];
    const w = Array.isArray(sanitized?.words) ? sanitized.words : [];
    setGridRows(rows);
    setWords(w);
    onChange({ gridRows: rows, words: w });
  };

  const handleApplyTemplateById = (templateId) => {
    const t = fetchedTemplates.find(ft => ft.id === templateId);
    if (t) applyTemplateSchema(t);
  };

  const handleClearAll = () => {
    setGridRows([]);
    setWords([]);
    onChange({ gridRows: [], words: [] });
  };

  const handleGridTextareaChange = (value) => {
    const rows = value
      .split("\n")
      .map((r) => r.trim())
      .filter((r) => r.length > 0);
    setGridRows(rows);
    onChange({ gridRows: rows, words });
  };

  const handleWordsTextareaChange = (value) => {
    const w = value
      .split(/[,\n]/)
      .map((w) => w.trim())
      .filter((w) => w.length > 0);
    setWords(w);
    onChange({ gridRows, words: w });
  };

  useEffect(() => {
    if (gridRows.length > 0) {
      const len = gridRows[0].length;
      const inconsistent = gridRows.some((r) => r.length !== len);
      setError(inconsistent ? "All rows must be the same length" : "");
    } else {
      setError("");
    }
  }, [gridRows]);

  return (
    <div className="editor-panel" style={{ background: theme.surfacePrimary, border: `1px solid ${theme.border}`, borderRadius: 12, padding: 16 }}>
      {/* Firestore Templates */}
      <div style={{ background: theme.surfacePrimary, border: `1px solid ${theme.border}`, borderRadius: 10, padding: 12, marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h4 style={{ margin: 0, color: theme.textPrimary }}>📋 Load Saved Templates</h4>
          <span style={{ fontSize: 12, color: theme.textSecondary }}>{loadingTemplates ? "Loading…" : `${fetchedTemplates.length} available`}</span>
        </div>
        {fetchedTemplates.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 8, marginTop: 8 }}>
            {fetchedTemplates.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => applyTemplateSchema(t)}
                style={{ padding: "8px 12px", border: `1px solid ${theme.accentPrimary}`, borderRadius: 6, background: theme.background, color: theme.accentPrimary, textAlign: "left" }}
                title={t.description}
              >
                🔤 {t.name}
              </button>
            ))}
          </div>
        ) : (
          <div style={{ marginTop: 8, color: theme.textSecondary, fontSize: 12 }}>No templates found. Use Admin → Seed Base Templates.</div>
        )}
      </div>

      <div className="editor-info">
        <h3 style={{ color: theme.textPrimary }}>🔤 Word Search</h3>
        <p style={{ color: theme.textSecondary }}>Enter grid rows (one row per line) and target words.</p>
      </div>

      <div className="editor-controls" style={{ display: "grid", gap: 12 }}>
        <div className="form-group">
          <label>Grid Rows (one per line)</label>
          <textarea
            value={gridRows.join("\n")}
            onChange={(e) => handleGridTextareaChange(e.target.value)}
            rows={8}
            className="form-input"
            placeholder={"ROWONE\nROWTWO\nROWWORD"}
          />
          {error && <div style={{ color: "#dc2626", fontSize: 12 }}>{error}</div>}
        </div>
        <div className="form-group">
          <label>Words (comma or newline separated)</label>
          <textarea
            value={words.join("\n")}
            onChange={(e) => handleWordsTextareaChange(e.target.value)}
            rows={6}
            className="form-input"
            placeholder={"CAT, DOG, BIRD"}
          />
        </div>
        <AdminEditorToolbar
          onClearAll={handleClearAll}
          clearButtonText="Clear All"
          templates={fetchedTemplates}
          loadingTemplates={loadingTemplates}
          onApplyTemplate={handleApplyTemplateById}
          getCurrentData={() => ({ gridRows, words })}
          editorKind="word-search"
        />
      </div>

      <div className="editor-preview" style={{ background: theme.surfaceSecondary, border: `1px solid ${theme.border}`, borderRadius: 10, padding: 12, marginTop: 12 }}>
        <h4>Preview</h4>
        <AdminTemplateHint
          items={[
            'Sets grid rows and target words content',
            'Does not alter difficulty or metadata',
            'Layout/visual settings remain editor-controlled'
          ]}
        />
        {gridRows.length === 0 ? (
          <div className="empty-state" style={{ background: theme.surfaceSecondary, border: `1px dashed ${theme.border}`, borderRadius: 10, padding: 12, color: theme.textSecondary }}>
            <p>No grid yet. Paste rows above.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: 6 }}>
            {gridRows.map((row, idx) => {
              const upperRow = row.toUpperCase();
              let segments = [{ text: upperRow, highlight: false }];
              const targetWords = (words || []).map(w => w.toUpperCase()).filter(Boolean);
              targetWords.forEach(word => {
                const newSegments = [];
                segments.forEach(seg => {
                  if (!seg.highlight) {
                    const parts = seg.text.split(word);
                    parts.forEach((p, i) => {
                      if (p) newSegments.push({ text: p, highlight: false });
                      if (i < parts.length - 1) newSegments.push({ text: word, highlight: true });
                    });
                  } else {
                    newSegments.push(seg);
                  }
                });
                segments = newSegments;
              });
              return (
                <div key={`row-${idx}`} style={{ fontFamily: "monospace", letterSpacing: 2 }}>
                  {segments.map((seg, i) => (
                    <span key={i} style={seg.highlight ? { background: '#fde68a', color: '#1f2937', borderRadius: 3, padding: '0 2px' } : {}}>{seg.text}</span>
                  ))}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
});

WordSearchEditor.displayName = "WordSearchEditor";
export default WordSearchEditor;
