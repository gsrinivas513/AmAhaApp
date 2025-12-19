import React from "react";

export default function DifficultyCard({
  title,
  desc,
  color,
  icon,
  onClick,
}) {
  return (
    <div
      className="card"
      onClick={onClick}
      style={{
        cursor: "pointer",
        border: `2px solid ${color}22`,
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-6px)";
        e.currentTarget.style.boxShadow =
          "0 16px 40px rgba(0,0,0,0.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow =
          "0 12px 30px rgba(0,0,0,0.06)";
      }}
    >
      <div style={{ fontSize: 36 }}>{icon}</div>
      <h3 style={{ marginTop: 14 }}>{title}</h3>
      <p>{desc}</p>

      <div
        style={{
          marginTop: 16,
          fontWeight: 700,
          color,
        }}
      >
        Start →
      </div>
    </div>
  );
}