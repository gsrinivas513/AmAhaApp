export default function UIConfigToggle({ label, value, onChange }) {
  return (
    <label
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 14,
        cursor: "pointer",
      }}
    >
      <span>{label}</span>
      <input
        type="checkbox"
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
      />
    </label>
  );
}