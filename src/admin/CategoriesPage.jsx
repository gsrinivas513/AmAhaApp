import React, { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

const MODES = [
  { value: "playful", label: "Playful & Fun" },
  { value: "calm", label: "Calm & Premium" },
  { value: "competitive", label: "Energetic & Competitive" },
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [status, setStatus] = useState("");

  useEffect(() => {
    (async () => {
      const snap = await getDocs(collection(db, "categories"));
      setCategories(
        snap.docs.map((d) => ({ id: d.id, ...d.data() }))
      );
    })();
  }, []);

  async function updateMode(catId, mode) {
    setStatus("");
    try {
      await updateDoc(doc(db, "categories", catId), {
        defaultUiMode: mode,
      });
      setCategories((c) =>
        c.map((x) => (x.id === catId ? { ...x, defaultUiMode: mode } : x))
      );
      setStatus("✅ Category UI mode updated");
    } catch {
      setStatus("❌ Failed to update category");
    }
  }

  return (
    <AdminLayout>
      <h2>Categories</h2>

      <div style={{ background: "#fff", padding: 20, borderRadius: 12 }}>
        {categories.map((c) => (
          <div
            key={c.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              marginBottom: 14,
            }}
          >
            <div style={{ flex: 1, fontWeight: 600 }}>
              {c.label || c.id}
            </div>

            <select
              value={c.defaultUiMode || "playful"}
              onChange={(e) => updateMode(c.id, e.target.value)}
              style={{ padding: 8, borderRadius: 6 }}
            >
              {MODES.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>
        ))}

        {status && <div style={{ marginTop: 12 }}>{status}</div>}
      </div>
    </AdminLayout>
  );
}