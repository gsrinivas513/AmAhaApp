// src/ads/ads.config.js
export const ADS_CONFIG = {
  enabled: true,

  placements: {
    homeNative: true,
    categoryBanner: true,
    levelBanner: true,
    quizFinishNative: true,
    rewardedRetry: false, // enable later
  },

  provider: "adsense", // future: admob, custom
};