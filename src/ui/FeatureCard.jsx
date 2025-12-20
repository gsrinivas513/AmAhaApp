import React from "react";

export default function FeatureCard({
  title,
  description,
  gradient,
  onClick,
}) {
  return (
    <div
      onClick={onClick}
      style={{
        background: gradient,
        borderRadius: 22,
        padding: 24,
        boxShadow: "0 10px 26px rgba(0,0,0,0.06)",
        cursor: onClick ? "pointer" : "default",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow =
          "0 16px 36px rgba(0,0,0,0.08)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow =
          "0 10px 26px rgba(0,0,0,0.06)";
      }}
    >
      <h3
        style={{
          fontFamily: "Nunito, sans-serif",
          fontSize: 18,
          fontWeight: 700,
          color: "#111827",
          marginBottom: 8,
        }}
      >
        {title}
      </h3>

      <p
        style={{
          fontSize: 14,
          color: "#4B5563",
          lineHeight: 1.5,
        }}
      >
        {description}
      </p>
    </div>
  );
}