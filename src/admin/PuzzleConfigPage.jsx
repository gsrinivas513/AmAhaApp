// src/admin/PuzzleConfigPage.jsx
import React, { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

/**
 * Puzzle Config Admin (v1)
 * - Toggles only
 * - Firestore-backed
 * - Controls: enable, daily puzzle, hints
 */

export default function PuzzleConfigPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [config, setConfig] = useState({
    enabled: false,
    dailyPuzzleEnabled: false,
    showHints: false,
  });

  /* ---------------- LOAD CONFIG ---------------- */
  useEffect(() => {
    async function load() {
      try {
        const ref = doc(db, "puzzleConfig", "global");
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setConfig({
            ...config,
            ...snap.data(),
          });
        }
      } catch (err) {
        console.error("Failed to load puzzle config", err);
      } finally {
        setLoading(false);
      }
    }

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------------- SAVE ---------------- */
  async function save() {
    setSaving(true);
    try {
      await updateDoc(doc(db, "puzzleConfig", "global"), {
        ...config,
        updatedAt: Date.now(),
      });
    } catch (err) {
      console.error("Failed to save puzzle config", err);
    } finally {
      setSaving(false);
    }
  }

  /* ---------------- RENDER ---------------- */
  return (
    <AdminLayout>
      <h2>🧩 Puzzle Configuration</h2>
      <p style={{ color: "#666", marginBottom: 24 }}>
        Control puzzle features without restarting the app.
      </p>

      {loading ? (
        <div>Loading puzzle config…</div>
      ) : (
        <div style={{ maxWidth: 520 }}>
          <Toggle
            label="Enable Puzzles"
            desc="Master switch for all puzzle features"
            value={config.enabled}
            onChange={(v) =>
              setConfig({ ...config, enabled: v })
            }
          />

          <Toggle
            label="Daily Puzzle"
            desc="Show one puzzle per day"
            value={config.dailyPuzzleEnabled}
            disabled={!config.enabled}
            onChange={(v) =>
              setConfig({ ...config, dailyPuzzleEnabled: v })
            }
          />

          <Toggle
            label="Show Hints"
            desc="Allow hints inside puzzles"
            value={config.showHints}
            disabled={!config.enabled}
            onChange={(v) =>
              setConfig({ ...config, showHints: v })
            }
          />

          <button
            onClick={save}
            disabled={saving}
            style={{
              marginTop: 28,
              padding: "12px 20px",
              borderRadius: 10,
              border: "none",
              background: "#6C63FF",
              color: "#fff",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      )}
    </AdminLayout>
  );
}

/* ---------------- TOGGLE ---------------- */

function Toggle({ label, desc, value, onChange, disabled }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "14px 16px",
        background: "#fff",
        borderRadius: 12,
        marginBottom: 14,
        opacity: disabled ? 0.5 : 1,
        boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
      }}
    >
      <div>
        <div style={{ fontWeight: 700 }}>{label}</div>
        <div style={{ fontSize: 13, color: "#666" }}>{desc}</div>
      </div>

      <input
        type="checkbox"
        checked={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        style={{ transform: "scale(1.4)" }}
      />
    </div>
  );
}