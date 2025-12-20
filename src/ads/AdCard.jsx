export default function AdCard({ slot }) {
  return (
    <div
      style={{
        marginTop: 20,
        padding: 16,
        borderRadius: 14,
        background: "#f9fafc",
        border: "1px dashed #ddd",
        textAlign: "center",
        fontSize: 14,
        color: "#555",
      }}
    >
      <div style={{ fontSize: 12, marginBottom: 6 }}>Sponsored</div>

      {/* Replace this block later with Google AdSense */}
      <div style={{ fontWeight: 600 }}>
        📘 Learn faster with daily practice
      </div>

      <div style={{ fontSize: 13, marginTop: 4 }}>
        Try premium learning tools →
      </div>
    </div>
  );
}