// src/quiz/components/LockedLevelCard.jsx
import React from "react";

export default function LockedLevelCard({ reason }) {
  return (
    <div
      title={reason}
      style={{
        marginTop: 12,
        padding: "10px 8px",
        background: "#f2f2f2",
        borderRadius: 8,
        fontSize: 13,
        color: "#666",
        cursor: "not-allowed",
      }}
    >
      🔒 {reason}
    </div>
  );
}