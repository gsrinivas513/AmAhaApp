import React from "react";

export default function FeatureCard({ title, desc, emoji }) {
  return (
    <div className="card">
      <div style={{ fontSize: 32 }}>{emoji}</div>
      <h3>{title}</h3>
      <p>{desc}</p>
    </div>
  );
}