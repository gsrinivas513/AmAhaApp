import React from "react";
import AdCard from "./AdCard";
import LoginGate from "../auth/LoginGate";
import { useAdUnlock } from "./AdUnlockProvider";

export default function AdUnlockGate({ title, message }) {
  const { unlockWithAd } = useAdUnlock();

  return (
    <div
      style={{
        background: "#fff",
        padding: 24,
        borderRadius: 16,
        boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
        textAlign: "center",
      }}
    >
      <h3>{title}</h3>
      <p style={{ color: "#555", marginBottom: 20 }}>{message}</p>

      {/* 🎥 WATCH AD */}
      <div onClick={unlockWithAd}>
        <AdCard slot="rewarded_unlock" />
      </div>

      {/* 🔐 LOGIN OPTION */}
      <div style={{ marginTop: 20 }}>
        <LoginGate
          title="Save progress permanently"
          message="Sign in to unlock everything without ads."
        />
      </div>
    </div>
  );
}