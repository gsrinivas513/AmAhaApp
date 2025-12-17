// src/quiz/DifficultySelectionPage.jsx
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../admin/AdminLayout"; // swap for site layout if needed

export default function DifficultySelectionPage() {
  const { category } = useParams();
  const navigate = useNavigate();

  if (!category) return <AdminLayout><div style={{ padding: 16 }}>Category is required in URL</div></AdminLayout>;

  const difficulties = [
    { id: "basic", label: "Basic" },
    { id: "intermediate", label: "Intermediate" },
    { id: "advanced", label: "Advanced" },
  ];

  return (
    <AdminLayout>
      <div style={{ padding: 16 }}>
        <h2 style={{ marginTop: 0 }}>Choose Difficulty — {category}</h2>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {difficulties.map((d) => (
            <div key={d.id} style={{ minWidth: 180, background: "#fff", padding: 12, borderRadius: 8, boxShadow: "0 0 0 1px #eee inset" }}>
              <div style={{ fontSize: 18, fontWeight: 700 }}>{d.label}</div>
              <div style={{ marginTop: 8, color: "#666" }}>{d.id === "basic" ? "Easy questions" : d.id === "intermediate" ? "Medium questions" : "Hard questions"}</div>
              <div style={{ marginTop: 12 }}>
                <button
                  onClick={() => navigate(`/quiz/${category}/${d.id}`)}
                  style={{ padding: "8px 12px", background: "#6C63FF", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer" }}
                >
                  Select {d.label}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}