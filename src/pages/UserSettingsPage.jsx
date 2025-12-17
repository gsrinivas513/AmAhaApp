import React, { useEffect, useState } from "react";
import SiteLayout from "../layouts/SiteLayout";
import { useAuth } from "../components/AuthProvider";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

const MODES = [
  { value: "auto", label: "Follow Category (Recommended)" },
  { value: "playful", label: "Playful & Fun" },
  { value: "calm", label: "Calm & Premium" },
  { value: "competitive", label: "Energetic & Competitive" },
];

export default function UserSettingsPage() {
  const { user } = useAuth();
  const [mode, setMode] = useState("auto");
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (!user) return;
    (async () => {
      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists()) {
        setMode(snap.data()?.preferences?.uiMode || "auto");
      }
    })();
  }, [user]);

  async function save() {
    if (!user) return;
    setStatus("");
    try {
      await setDoc(
        doc(db, "users", user.uid),
        { preferences: { uiMode: mode } },
        { merge: true }
      );
      setStatus("✅ Preference saved");
    } catch {
      setStatus("❌ Failed to save preference");
    }
  }

  if (!user) {
    return (
      <SiteLayout>
        <div style={{ padding: 40 }}>
          Please sign in to customize your experience.
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <h2>Appearance Settings</h2>

      <div style={{ maxWidth: 420, background: "#fff", padding: 20, borderRadius: 12 }}>
        <label style={{ fontWeight: 600 }}>Choose your UI Mode</label>

        <select
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          style={{ width: "100%", padding: 10, marginTop: 10, borderRadius: 8 }}
        >
          {MODES.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>

        <button
          onClick={save}
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
          Save
        </button>

        {status && <div style={{ marginTop: 12 }}>{status}</div>}
      </div>
    </SiteLayout>
  );
}