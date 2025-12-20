// src/admin/puzzles/PuzzlesDashboardPage.jsx
import React from "react";
import AdminLayout from "../AdminLayout";

export default function PuzzlesDashboardPage() {
  return (
    <AdminLayout>
      <h2>🧩 Puzzles Dashboard</h2>

      <p style={{ marginTop: 12, color: "#666" }}>
        Puzzle analytics, configuration, and controls will appear here.
      </p>

      <div
        style={{
          marginTop: 24,
          padding: 20,
          borderRadius: 12,
          background: "#f9fafc",
          border: "1px dashed #ddd",
        }}
      >
        🚧 Coming soon — Puzzle feature v1
      </div>
    </AdminLayout>
  );
}