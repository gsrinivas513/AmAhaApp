// src/admin/question-analytics/components/KpiCard.jsx
export default function KpiCard({ label, value, highlight }) {
  return (
    <div
      style={{
        background: "#fff",
        padding: 16,
        borderRadius: 12,
        border: highlight ? "2px solid #f44336" : "1px solid #eee",
      }}
    >
      <div style={{ fontSize: 13, color: "#666" }}>{label}</div>
      <div
        style={{
          fontSize: 26,
          fontWeight: 800,
          marginTop: 6,
          color: highlight ? "#f44336" : "#111",
        }}
      >
        {value}
      </div>
    </div>
  );
}