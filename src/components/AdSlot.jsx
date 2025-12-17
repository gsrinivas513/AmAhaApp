import React from "react";
import { useAuth } from "./AuthProvider";

export default function AdSlot({ location = "default" }) {
  const { user } = useAuth();

  // Premium users (future) → no ads
  if (user?.isPremium) return null;

  return (
    <div
      style={{
        marginTop: 20,
        padding: 16,
        borderRadius: 12,
        background: "#f5f6fb",
        border: "1px dashed #c7c9ff",
        textAlign: "center",
        fontSize: 14,
        color: "#555",
      }}
    >
      📢 Sponsored content  
      <div style={{ fontSize: 12, marginTop: 6 }}>
        Ad placement: {location}
      </div>
    </div>
  );
}