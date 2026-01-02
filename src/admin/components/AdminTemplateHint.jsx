// src/admin/components/AdminTemplateHint.jsx
import React from "react";
import { useTheme } from "../../context/ThemeContext";

export default function AdminTemplateHint({ title = "What templates affect", items = [] }) {
  const { theme } = useTheme();
  return (
    <div style={{
      background: theme.surfaceSecondary,
      border: `1px solid ${theme.border}`,
      borderRadius: 10,
      padding: 12,
      margin: "8px 0 12px",
    }}>
      <div style={{ fontWeight: 700, color: theme.textPrimary, marginBottom: 6 }}>{title}</div>
      <div style={{ color: theme.textSecondary, fontSize: 13 }}>
        <div style={{ marginBottom: 6 }}>Templates only pre-fill content. Configuration stays in the editor.</div>
        {items.length > 0 && (
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {items.map((it, i) => (
              <li key={i} style={{ margin: "2px 0" }}>{it}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
