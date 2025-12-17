// src/admin/AdminQuizRulesPage.jsx
import React, { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import AdminLayout from "./AdminLayout";

export default function AdminQuizRulesPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [enableNegative, setEnableNegative] = useState(false);
  const [negativeValue, setNegativeValue] = useState(1);
  const [status, setStatus] = useState("");

  const settingsRef = doc(db, "settings", "quizRules");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const snap = await getDoc(settingsRef);
        if (!mounted) return;
        if (snap.exists()) {
          const data = snap.data();
          setEnableNegative(!!data.enableNegative);
          // ensure numeric and fallback to 1
          setNegativeValue(typeof data.negativeValue === "number" ? data.negativeValue : parseFloat(data.negativeValue || 1) || 1);
        } else {
          // defaults
          setEnableNegative(false);
          setNegativeValue(1);
        }
      } catch (err) {
        console.error("Failed to load quiz rules:", err);
        setStatus("Failed to load settings: " + (err.message || err));
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  async function saveSettings() {
    setSaving(true);
    setStatus("");
    try {
      const payload = {
        enableNegative: !!enableNegative,
        negativeValue: Number(negativeValue) || 0,
      };
      await setDoc(settingsRef, payload, { merge: true });
      setStatus("Settings saved successfully.");
    } catch (err) {
      console.error("Failed to save settings:", err);
      setStatus("Failed to save: " + (err.message || err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminLayout>
      <div style={{ padding: 20 }}>
        <h2>⚙️ Quiz Rules</h2>

        <p style={{ color: "#444" }}>
          Configure global quiz rules. Enabling negative marking will deduct the configured penalty
          for each **wrong** answer when a user selects an option that is incorrect.
        </p>

        {loading ? (
          <div>Loading settings…</div>
        ) : (
          <div style={{ maxWidth: 700, background: "#fff", padding: 16, borderRadius: 8, boxShadow: "0 6px 18px rgba(0,0,0,0.04)" }}>
            <label style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <input type="checkbox" checked={enableNegative} onChange={(e) => setEnableNegative(e.target.checked)} />
              <strong>Enable negative marking</strong>
            </label>

            <div style={{ marginTop: 12 }}>
              <label style={{ display: "block", fontSize: 14, color: "#333" }}>Penalty per wrong answer</label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={negativeValue}
                onChange={(e) => setNegativeValue(e.target.value)}
                style={{ padding: "8px 10px", borderRadius: 6, border: "1px solid #ddd", width: 160, marginTop: 6 }}
              />
              <div style={{ marginTop: 8, color: "#666", fontSize: 13 }}>
                Current value will be deducted from the user's score for each <em>wrong</em> answer.
              </div>
            </div>

            <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
              <button
                onClick={saveSettings}
                disabled={saving}
                style={{ padding: "8px 14px", background: "#6C63FF", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer" }}
              >
                {saving ? "Saving..." : "Save Settings"}
              </button>

              <button
                onClick={() => {
                  // reset to defaults in UI (not saved)
                  setEnableNegative(false);
                  setNegativeValue(1);
                }}
                style={{ padding: "8px 14px", background: "#f4f6fb", border: "1px solid #ddd", borderRadius: 8 }}
              >
                Reset
              </button>
            </div>

            {status && (
              <div style={{ marginTop: 12, color: status.startsWith("Failed") ? "#c62828" : "#2e7d32" }}>
                {status}
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}