import React from "react";

export default function RewardToast({ xp, coins }) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 90,
        left: "50%",
        transform: "translateX(-50%)",
        background: "#111827",
        color: "#fff",
        padding: "14px 22px",
        borderRadius: 14,
        fontSize: 15,
        fontWeight: 700,
        display: "flex",
        gap: 16,
        alignItems: "center",
        boxShadow: "0 16px 40px rgba(0,0,0,0.35)",
        animation: "rewardPop 0.45s ease-out",
        zIndex: 9999,
      }}
    >
      <span>⭐ +{xp} XP</span>
      <span>🪙 +{coins} Coins</span>

      <style>
        {`
          @keyframes rewardPop {
            0% { transform: translateX(-50%) scale(0.85); opacity: 0; }
            60% { transform: translateX(-50%) scale(1.08); }
            100% { transform: translateX(-50%) scale(1); opacity: 1; }
          }
        `}
      </style>
    </div>
  );
}