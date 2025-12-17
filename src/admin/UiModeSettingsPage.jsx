import React, { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

const MODES = [
  { value: "playful", label: "Playful & Fun" },
  { value: "calm", label: "Calm & Premium" },
  { value: "competitive", label: "Energetic & Competitive" },
];

export default function UiModeSettingsPage() {
  const [mode, setMode] = useState("playful");
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    (async () => {
      const snap = await getDoc(doc(db, "settings", "ui"));
      if (snap.exists()) {
        setMode(snap.data().defaultMode || "playful");
      }
    })();
  }, []);

  async function save() {
    setSaving(true);
    setStatus("");
    try {
      await setDoc(
        doc(db, "settings", "ui"),
        { defaultMode: mode },
        { merge: true }
      );
      setStatus("✅ Global UI mode updated");
    } catch (e) {
      setStatus("❌ Failed to save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminLayout>
      <h2>Global UI Mode</h2>

      <div
        style={{
          background: "#fff",
          padding: 20,
          borderRadius: 12,
          maxWidth: 420,
        }}
      >
        <label style={{ fontWeight: 600 }}>Default App UI Mode</label>

        <select
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          style={{
            width: "100%",
            padding: 10,
            marginTop: 10,
            borderRadius: 8,
          }}
        >
          {MODES.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>

        <button
          onClick={save}
          disabled={saving}
          style={{
            marginTop: 16,
            padding: "10px 14px",
            borderRadius: 8,
            background: "#6C63FF",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          {saving ? "Saving..." : "Save"}
        </button>

        {status && <div style={{ marginTop: 12 }}>{status}</div>}
      </div>
    </AdminLayout>
  );
}