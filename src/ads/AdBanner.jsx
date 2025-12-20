// src/ads/AdBanner.jsx
import { ADS_CONFIG } from "./ads.config";
import AdPlaceholder from "./AdPlaceholder";

export default function AdBanner() {
  if (!ADS_CONFIG.enabled) return null;

  return (
    <div style={{ margin: "24px 0" }}>
      {/* Replace with real ad later */}
      <AdPlaceholder height={90} label="Sponsored Banner" />
    </div>
  );
}