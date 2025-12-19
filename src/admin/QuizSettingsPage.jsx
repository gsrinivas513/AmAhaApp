import React, { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import { db } from "../firebase/firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function QuizSettingsPage() {
  const [settings, setSettings] = useState({
    questionsPerLevel: 3,
    levelsPerDifficulty: 10,
    resumeEnabled: true,
  });

  useEffect(() => {
    async function load() {
      const ref = doc(db, "settings", "features", "quiz");
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setSettings({
          questionsPerLevel: snap.data().global?.questionsPerLevel ?? 3,
          levelsPerDifficulty: snap.data().global?.levelsPerDifficulty ?? 10,
          resumeEnabled: snap.data().global?.resumeEnabled ?? true,
        });
      }
    }
    load();
  }, []);

  const save = async () => {
    await setDoc(
      doc(db, "settings", "features", "quiz"),
      {
        global: settings,
      },
      { merge: true }
    );

    alert("Quiz settings saved");
  };

  return (
    <AdminLayout>
      <h2>Quiz Settings</h2>

      <label>Questions per Level</label>
      <input
        type="number"
        value={settings.questionsPerLevel}
        onChange={(e) =>
          setSettings({ ...settings, questionsPerLevel: +e.target.value })
        }
      />

      <label>Levels per Difficulty</label>
      <input
        type="number"
        value={settings.levelsPerDifficulty}
        onChange={(e) =>
          setSettings({ ...settings, levelsPerDifficulty: +e.target.value })
        }
      />

      <label>
        <input
          type="checkbox"
          checked={settings.resumeEnabled}
          onChange={(e) =>
            setSettings({ ...settings, resumeEnabled: e.target.checked })
          }
        />
        Resume Enabled
      </label>

      <button onClick={save}>Save Settings</button>
    </AdminLayout>
  );
}