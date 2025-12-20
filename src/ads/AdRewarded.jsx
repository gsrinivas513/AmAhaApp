// src/ads/AdRewarded.jsx
import { ADS_CONFIG } from "./ads.config";

export default function AdRewarded({ onReward }) {
  if (!ADS_CONFIG.placements.rewardedRetry) return null;

  return (
    <button
      onClick={onReward}
      style={{
        padding: "12px 18px",
        background: "#22c55e",
        color: "#fff",
        borderRadius: 10,
        border: "none",
        fontWeight: 700,
        cursor: "pointer",
      }}
    >
      🎥 Watch Ad → Retry Instantly
    </button>
  );
}