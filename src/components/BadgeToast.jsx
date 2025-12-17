// src/components/BadgeToast.jsx
import React, { useEffect } from "react";

export default function BadgeToast({ badge, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  if (!badge) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 30,
        right: 30,
        background: "#111",
        color: "#fff",
        padding: "16px 20px",
        borderRadius: 14,
        boxShadow: "0 12px 30px rgba(0,0,0,0.3)",
        display: "flex",
        alignItems: "center",
        gap: 14,
        zIndex: 9999,
        animation: "slideUpFade 0.4s ease",
      }}
    >
      <div style={{ fontSize: 28 }}>{badge.icon}</div>
      <div>
        <div style={{ fontWeight: 800, fontSize: 15 }}>
          Badge Unlocked!
        </div>
        <div style={{ fontSize: 14, opacity: 0.85 }}>
          {badge.label}
        </div>
      </div>
    </div>
  );
}