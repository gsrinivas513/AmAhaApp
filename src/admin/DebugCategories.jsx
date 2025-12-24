// src/admin/DebugCategories.jsx
import React, { useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

export default function DebugCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const snap = await getDocs(collection(db, "categories"));
        const data = snap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCategories(data);
        console.log("All categories:", data);
      } catch (error) {
        console.error("Error loading categories:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  if (loading) return <div className="p-8">Loading categories...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">🔍 Debug: All Categories</h1>
      <p className="text-gray-600 mb-6">Total categories: <b>{categories.length}</b></p>

      <div className="space-y-4">
        {categories.map(cat => (
          <div key={cat.id} className="p-4 border rounded bg-gray-50">
            <p><b>ID:</b> <code className="bg-yellow-100">{cat.id}</code></p>
            <p><b>name field:</b> <code className="bg-yellow-100">{cat.name}</code></p>
            <p><b>label field:</b> <code className="bg-yellow-100">{cat.label}</code></p>
          </div>
        ))}
      </div>
    </div>
  );
}
