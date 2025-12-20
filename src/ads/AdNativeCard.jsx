// src/ads/AdNativeCard.jsx
import { ADS_CONFIG } from "./ads.config";

export default function AdNativeCard() {
  if (!ADS_CONFIG.enabled) return null;

  return (
    <div
      className="card"
      style={{
        margin: "24px 0",
        border: "1px solid #e5e7eb",
      }}
    >
      <div style={{ fontSize: 12, color: "#6b7280" }}>
        Sponsored
      </div>

      <h3 style={{ marginTop: 8 }}>
        Learn Faster with Smart Practice
      </h3>

      <p>
        Improve memory and focus with daily micro-learning.
      </p>

      <button
        style={{
          marginTop: 12,
          padding: "10px 16px",
          borderRadius: 10,
          background: "#6C63FF",
          color: "#fff",
          border: "none",
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        Explore →
      </button>
    </div>
  );
}