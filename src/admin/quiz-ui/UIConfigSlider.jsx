export default function UIConfigSlider({
  label,
  min,
  max,
  step,
  value,
  onChange,
}) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 13, marginBottom: 6 }}>
        {label}: <b>{value}</b>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ width: "100%" }}
      />
    </div>
  );
}