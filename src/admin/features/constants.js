// src/admin/features/constants.js

export const UI_MODES = [
  { value: "playful", label: "🎨 Playful & Fun", description: "Colorful, animated, energetic" },
  { value: "calm", label: "🌿 Calm & Premium", description: "Clean, minimalist, sophisticated" },
  { value: "competitive", label: "⚡ Energetic & Competitive", description: "Bold, dynamic, intense" },
];

export const INITIAL_FEATURE_FORM = {
  name: "",
  label: "",
  description: "",
  icon: "✨",
  enabled: true,
  featureType: "quiz",
};

export const INITIAL_CATEGORY_FORM = {
  name: "",
  label: "",
  icon: "📚",
  color: "#0284c7",
  imageUrl: "",
  cloudinaryId: "",
  imageCrop: "cover",
  imageZoom: 1,
  imageOffsetX: 0,
  imageOffsetY: 0,
  description: "",
  featureId: "",
  defaultUiMode: "playful",
};

export const INITIAL_TOPIC_FORM = {
  name: "",
  label: "",
  icon: "📚",
  imageUrl: "",
  cloudinaryId: "",
  imageCrop: "cover",
  imageZoom: 1,
  imageOffsetX: 0,
  imageOffsetY: 0,
  description: "",
  sortOrder: 0,
  categoryId: "",
  isPublished: true,
};

export const INITIAL_SUBTOPIC_FORM = {
  name: "",
  label: "",
  icon: "📖",
  imageUrl: "",
  cloudinaryId: "",
  imageCrop: "cover",
  imageZoom: 1,
  imageOffsetX: 0,
  imageOffsetY: 0,
  description: "",
  categoryId: "",
  topicId: "",
  featureId: "",
  color: "#0284c7",
};
