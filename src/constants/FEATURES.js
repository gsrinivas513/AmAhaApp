/**
 * FEATURES.js - Single Source of Truth for All Feature Definitions
 * 
 * This file defines all features in the AmAha platform with consistent IDs,
 * routes, and metadata. All files should reference features from this constant.
 * 
 * Usage:
 * import { FEATURES, getFeatureById, isFeature } from '@/constants/FEATURES';
 * 
 * // Check if a feature ID is valid
 * if (FEATURES.QUIZZES.id === featureId) { ... }
 * 
 * // Get feature by ID
 * const feature = getFeatureById(featureId);
 * 
 * // Check if a string is a valid feature ID
 * if (isFeature("quizzes")) { ... }
 */

/**
 * Feature Definitions - ALL FEATURES MUST BE DEFINED HERE
 * Every feature must have:
 * - id: unique lowercase identifier (used everywhere)
 * - name: display name
 * - label: alternative name used in some places
 * - icon: emoji icon
 * - type: feature type (quiz | puzzle | story | game)
 * - order: display order
 * - description: feature description
 * - baseRoute: main route for this feature
 * - routes: all route patterns for this feature
 */
export const FEATURES = {
  QUIZZES: {
    id: "quizzes",
    name: "Quizzes",
    label: "Quizzes",
    icon: "🧠",
    imageUrl: "", // Add quiz feature image URL from Cloudinary
    cloudinaryId: "", // Add cloudinary public ID if available
    type: "quiz",
    order: 1,
    description: "Test your knowledge with interactive quizzes",
    baseRoute: "/quiz",
    routes: {
      home: "/quiz",
      category: "/quiz/:categoryName",
      topic: "/quiz/:categoryName/:topicName",
      levels: "/quiz/:categoryName/:topicName/:subtopicName/:difficulty",
      play: "/quiz/:categoryName/:topicName/:subtopicName/:difficulty/:level"
    },
    color: "#3B82F6",
    featureName: "Quizzes"
  },

  PUZZLES: {
    id: "puzzles",
    name: "Puzzles",
    label: "Puzzles",
    icon: "🧩",
    imageUrl: "", // Add puzzle feature image URL from Cloudinary
    cloudinaryId: "", // Add cloudinary public ID if available
    type: "puzzle",
    order: 2,
    description: "Solve fun and challenging puzzles",
    baseRoute: "/puzzle",
    routes: {
      home: "/puzzle",
      category: "/puzzle/:categoryName",
      topic: "/puzzle/:categoryName/:topicName",
      play: "/puzzle/:categoryName/:topicName/:puzzleId"
    },
    color: "#8B5CF6",
    featureName: "Puzzles"
  },

  STORIES: {
    id: "stories",
    name: "Stories",
    label: "Stories",
    icon: "📖",
    imageUrl: "", // Add stories feature image URL from Cloudinary
    cloudinaryId: "", // Add cloudinary public ID if available
    type: "story",
    order: 4,
    description: "Learn through interactive stories and adventures",
    baseRoute: "/stories",
    routes: {
      home: "/stories",
      initialize: "/stories/initialize",
      category: "/stories/category/:categoryName",
      topic: "/stories/category/:categoryName/topic/:topicName",
      subtopic: "/stories/category/:categoryName/topic/:topicName/subtopic/:subtopicName",
      detail: "/story/:storyId",
      detailAlt: "/stories/:storyId"
    },
    color: "#EC4899",
    featureName: "Stories"
  },

  GAMES: {
    id: "games",
    name: "Games",
    label: "Games",
    icon: "🎮",
    imageUrl: "", // Add games feature image URL from Cloudinary
    cloudinaryId: "", // Add cloudinary public ID if available
    type: "game",
    order: 3,
    description: "Play educational games",
    baseRoute: "/games",
    routes: {
      home: "/games"
    },
    color: "#F59E0B",
    featureName: "Games"
  },

  ARTS: {
    id: "arts",
    name: "Arts",
    label: "Arts",
    icon: "🎨",
    imageUrl: "", // Add arts feature image URL from Cloudinary
    cloudinaryId: "", // Add cloudinary public ID if available
    type: "art",
    order: 5,
    description: "Explore art techniques and creative expression",
    baseRoute: "/arts",
    routes: {
      home: "/arts",
      category: "/arts/:categoryName",
      detail: "/arts/:categoryName/:artId"
    },
    color: "#EC4899",
    featureName: "Arts"
  },

  DOCUMENTS: {
    id: "documents",
    name: "Documents",
    label: "Documents",
    icon: "📄",
    imageUrl: "", // Add documents feature image URL from Cloudinary
    cloudinaryId: "", // Add cloudinary public ID if available
    type: "document",
    order: 6,
    description: "Browse and learn from educational documents",
    baseRoute: "/documents",
    routes: {
      home: "/documents",
      category: "/documents/:categoryName",
      detail: "/documents/:categoryName/:documentId"
    },
    color: "#3B82F6",
    featureName: "Documents"
  },

  STUDIES: {
    id: "studies",
    name: "Studies",
    label: "Studies",
    icon: "📚",
    imageUrl: "", // Add studies feature image URL from Cloudinary
    cloudinaryId: "", // Add cloudinary public ID if available
    type: "study",
    order: 7,
    description: "Study materials and learning guides",
    baseRoute: "/studies",
    routes: {
      home: "/studies",
      category: "/studies/:categoryName",
      detail: "/studies/:categoryName/:studyId"
    },
    color: "#10B981",
    featureName: "Studies"
  },

  WORKSHEETS: {
    id: "worksheets",
    name: "Worksheets",
    label: "Worksheets",
    icon: "📋",
    imageUrl: "", // Add worksheets feature image URL from Cloudinary
    cloudinaryId: "", // Add cloudinary public ID if available
    type: "worksheet",
    order: 8,
    description: "Practice with interactive worksheets",
    baseRoute: "/worksheets",
    routes: {
      home: "/worksheets",
      category: "/worksheets/:categoryName",
      detail: "/worksheets/:categoryName/:worksheetId"
    },
    color: "#F59E0B",
    featureName: "Worksheets"
  }
};

/**
 * All features as an array (for iteration)
 */
export const FEATURES_ARRAY = Object.values(FEATURES);

/**
 * Feature type mappings
 */
export const FEATURE_TYPES = {
  QUIZ: "quiz",
  PUZZLE: "puzzle",
  STORY: "story",
  GAME: "game"
};

/**
 * Feature IDs as string constants (to avoid typos)
 */
export const FEATURE_IDS = {
  QUIZZES: FEATURES.QUIZZES.id,
  PUZZLES: FEATURES.PUZZLES.id,
  STORIES: FEATURES.STORIES.id,
  GAMES: FEATURES.GAMES.id,
  ARTS: FEATURES.ARTS.id,
  DOCUMENTS: FEATURES.DOCUMENTS.id,
  STUDIES: FEATURES.STUDIES.id,
  WORKSHEETS: FEATURES.WORKSHEETS.id
};

/**
 * Get feature by ID (case-insensitive)
 * @param {string} featureId - The feature ID
 * @returns {Object|null} - The feature object or null if not found
 */
export function getFeatureById(featureId) {
  if (!featureId) return null;
  const normalizedId = String(featureId).toLowerCase().trim();
  return FEATURES_ARRAY.find(f => f.id === normalizedId) || null;
}

/**
 * Check if a string is a valid feature ID
 * @param {string} featureId - The feature ID to check
 * @returns {boolean} - True if valid feature ID
 */
export function isFeature(featureId) {
  return getFeatureById(featureId) !== null;
}

/**
 * Get feature by type
 * @param {string} featureType - The feature type (quiz, puzzle, story, game)
 * @returns {Object|null} - The feature object or null if not found
 */
export function getFeatureByType(featureType) {
  const normalizedType = String(featureType).toLowerCase().trim();
  return FEATURES_ARRAY.find(f => f.type === normalizedType) || null;
}

/**
 * Check if a value is a valid feature type
 * @param {string} featureType - The feature type to check
 * @returns {boolean} - True if valid feature type
 */
export function isValidFeatureType(featureType) {
  return getFeatureByType(featureType) !== null;
}

/**
 * Get all features as an array
 * Useful for rendering feature lists
 * @returns {Array} - Array of feature objects
 */
export function getAllFeatures() {
  return FEATURES_ARRAY;
}

/**
 * Match feature from various input formats
 * Handles: "quizzes", "Quizzes", "QUIZZES", feature object, etc.
 * @param {string|Object} featureInput - Feature ID string or feature object
 * @returns {Object|null} - The feature object or null
 */
export function matchFeature(featureInput) {
  if (!featureInput) return null;
  
  // If it's already a feature object with an id property
  if (typeof featureInput === 'object' && featureInput.id) {
    return getFeatureById(featureInput.id);
  }
  
  // If it's a string, normalize and lookup
  if (typeof featureInput === 'string') {
    return getFeatureById(featureInput);
  }
  
  return null;
}

/**
 * Default features array (for fallback when Firestore is empty)
 * These should match the FEATURES constant exactly
 */
export const DEFAULT_FEATURES = FEATURES_ARRAY.map(f => ({
  id: f.id,
  name: f.name,
  label: f.label,
  icon: f.icon,
  order: f.order,
  type: f.type,
  description: f.description,
  color: f.color,
  featureType: f.type  // Keep for backwards compatibility
}));

export default FEATURES;
