import React, { useEffect, useState } from "react";
import AdminLayout from "../AdminLayout";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

import UIConfigToggle from "./UIConfigToggle";
import UIConfigSlider from "./UIConfigSlider";

export default function QuizUIConfigPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [config, setConfig] = useState({
    microAnimations: {
      enabled: true,
      optionHoverScale: 1.03,
      optionSelectScale: 1.05,
      buttonPressScale: 0.97,
      transitionMs: 200,
      correctPulse: true,
      wrongShake: true,
    },
  });

  /* ---------- LOAD CONFIG ---------- */
  useEffect(() => {
    async function load() {
      const ref = doc(db, "ui_config", "quiz_ui");
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setConfig(snap.data());
      }
      setLoading(false);
    }
    load();
  }, []);

  /* ---------- SAVE CONFIG ---------- */
  const save = async () => {
    setSaving(true);
    await setDoc(doc(db, "ui_config", "quiz_ui"), config, {
      merge: true,
    });
    setSaving(false);
    alert("Quiz UI config saved");
  };

  if (loading) {
    return (
      <AdminLayout>
        <div>Loading UI config…</div>
      </AdminLayout>
    );
  }

  const m = config.microAnimations;

  return (
    <AdminLayout>
      <h2 style={{ marginBottom: 16 }}>🎬 Quiz UI Animations</h2>

      <div style={{ maxWidth: 520 }}>
        <UIConfigToggle
          label="Enable micro animations"
          value={m.enabled}
          onChange={(v) =>
            setConfig({
              ...config,
              microAnimations: { ...m, enabled: v },
            })
          }
        />

        <UIConfigToggle
          label="Correct answer pulse"
          value={m.correctPulse}
          onChange={(v) =>
            setConfig({
              ...config,
              microAnimations: { ...m, correctPulse: v },
            })
          }
        />

        <UIConfigToggle
          label="Wrong answer shake"
          value={m.wrongShake}
          onChange={(v) =>
            setConfig({
              ...config,
              microAnimations: { ...m, wrongShake: v },
            })
          }
        />

        <UIConfigSlider
          label="Hover scale"
          min={1}
          max={1.1}
          step={0.01}
          value={m.optionHoverScale}
          onChange={(v) =>
            setConfig({
              ...config,
              microAnimations: { ...m, optionHoverScale: v },
            })
          }
        />

        <UIConfigSlider
          label="Select scale"
          min={1}
          max={1.15}
          step={0.01}
          value={m.optionSelectScale}
          onChange={(v) =>
            setConfig({
              ...config,
              microAnimations: { ...m, optionSelectScale: v },
            })
          }
        />

        <UIConfigSlider
          label="Transition duration (ms)"
          min={50}
          max={500}
          step={10}
          value={m.transitionMs}
          onChange={(v) =>
            setConfig({
              ...config,
              microAnimations: { ...m, transitionMs: v },
            })
          }
        />

        <button
          onClick={save}
          disabled={saving}
          style={{
            marginTop: 20,
            padding: "12px 20px",
            borderRadius: 12,
            border: "none",
            background: "#6C63FF",
            color: "#fff",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
      </div>
    </AdminLayout>
  );
}