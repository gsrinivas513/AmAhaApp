// src/ads/AdPlaceholder.jsx
export default function AdPlaceholder({ height = 90, label = "Ad" }) {
  return (
    <div
      style={{
        height,
        background: "#f1f5f9",
        borderRadius: 12,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#94a3b8",
        fontSize: 14,
      }}
    >
      {label}
    </div>
  );
}