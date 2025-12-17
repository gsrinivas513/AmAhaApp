// src/pages/HomePage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import "../pages/HomePage.css";
import "../mobile.css";
import { gradientFromColor } from "../theme";

export default function HomePage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ⭐ ADDED: Fix for content under navbar
  const pageStyle = {
    paddingTop: "90px", // ← ensures NOTHING goes under the navbar (70px navbar + spacing)
  };

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        const q = query(collection(db, "categories"), orderBy("label"));
        const snap = await getDocs(q);
        if (!mounted) return;

        const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

        const normalized = docs.map((c) => ({
          id: c.id,
          label: c.label || c.id,
          icon: c.icon || "❓",
          color: c.color || "#6C63FF",
          description: c.description || "",
        }));

        setCategories(normalized);
        setError(null);
      } catch (err) {
        if (!mounted) return;
        setError(err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => (mounted = false);
  }, []);

  return (
    <div className="home-root" style={pageStyle}>
      <div className="home-header">
        <h1>Choose a Quiz</h1>
        <p className="muted">Pick a category to start — fun, quick and learning.</p>
      </div>

      {loading && (
        <div className="cards-grid mobile-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card card-skeleton mobile-card" />
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="error-box">Error loading categories: {error}</div>
      )}

      {!loading && !error && (
        <div className="cards-grid mobile-grid">
          {categories.map((c) => (
            <div
              key={c.id}
              className="card card-gradient mobile-card"
              style={{ background: gradientFromColor(c.color) }}
              onClick={() => navigate(`/quiz/${c.id}`)}
            >
              <div className="card-icon mobile-card-icon">{c.icon}</div>
              <div className="card-title mobile-card-title">{c.label}</div>
              {c.description && <div className="card-desc">{c.description}</div>}
              <div className="card-footer">
                <span className="cta">Start</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}