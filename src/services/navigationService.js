/**
 * navigationService.js
 * Handles all Firestore queries for top navigation menu
 * Caches features and lazily loads categories per feature
 * Falls back to hardcoded features if none exist in Firestore
 */

import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

// Simple in-memory cache
const cache = {
  features: null,
  categories: {}, // key: featureId, value: array of categories
  config: null,
};

// Default features matching AmAha_Menu.md design
const DEFAULT_FEATURES = [
  {
    id: "quizzes",
    name: "Quizzes",
    icon: "🧠",
    order: 1,
    isPublished: true,
    showInMenu: true,
    description: "Learn by playing fun quizzes",
    route: "/quiz"
  },
  {
    id: "puzzles",
    name: "Puzzles",
    icon: "🧩",
    order: 2,
    isPublished: true,
    showInMenu: true,
    description: "Think • Match • Solve",
    route: "/puzzle"
  },
  {
    id: "games",
    name: "Games",
    icon: "🎮",
    order: 3,
    isPublished: true,
    showInMenu: true,
    description: "Play and learn",
    route: "/games"
  },
  {
    id: "stories",
    name: "Stories",
    icon: "📖",
    order: 4,
    isPublished: true,
    showInMenu: true,
    description: "Interactive stories",
    route: "/stories"
  },
];

/**
 * Fetch all published features from Firestore
 * Cached to avoid repeated queries
 * Falls back to default features if none exist
 * @returns {Promise<Array>} Array of feature objects
 */
export async function fetchPublishedFeatures() {
  // Return cached features if available
  if (cache.features !== null) {
    return cache.features;
  }

  try {
    // Query without orderBy to avoid composite index requirement
    // Sorting is done in JavaScript instead
    const q = query(
      collection(db, "features"),
      where("isPublished", "==", true)
    );
    const snapshot = await getDocs(q);
    const features = snapshot.docs
      .map((doc) => ({
        id: doc.id,
        order: doc.data().order || 999,
        ...doc.data(),
      }))
      // Sort by order field
      .sort((a, b) => (a.order || 999) - (b.order || 999));

    // Use default features if none found in Firestore
    const featuresToCache = features.length > 0 ? features : DEFAULT_FEATURES;
    cache.features = featuresToCache;
    return featuresToCache;
  } catch (error) {
    console.warn("Error fetching features from Firestore, using defaults:", error);
    // Use default features on error
    cache.features = DEFAULT_FEATURES;
    return DEFAULT_FEATURES;
  }
}

/**
 * Fetch categories for a specific feature
 * For all features (quizzes, puzzles, etc), fetches from categories collection
 * Filters by featureId and isPublished status
 * Cached per feature to minimize Firestore reads
 * @param {string} featureId - The feature ID
 * @returns {Promise<Array>} Array of category objects
 */
export async function fetchCategoriesByFeature(featureId) {
  // Return cached categories if available
  if (cache.categories[featureId]) {
    return cache.categories[featureId];
  }

  try {
    let categories = [];

    // Fetch categories from the categories collection for this feature
    // Note: We use only two where clauses (no orderBy) to avoid requiring a composite index
    // Sorting is done in JavaScript instead
    const q = query(
      collection(db, "categories"),
      where("featureId", "==", featureId),
      where("isPublished", "==", true)
    );
    const snapshot = await getDocs(q);
    categories = snapshot.docs
      .map((doc) => ({
        id: doc.id,
        key: doc.id,
        title: doc.data().label || doc.data().name || doc.id,
        name: doc.data().name || doc.id,
        label: doc.data().label || doc.data().name || doc.id,
        description: doc.data().description,
        icon: doc.data().icon,
        featureId: doc.data().featureId,
        order: doc.data().order || 999, // Default order for sorting
        ...doc.data(),
      }))
      // Sort by order field
      .sort((a, b) => (a.order || 999) - (b.order || 999));

    // Cache the result
    cache.categories[featureId] = categories;
    return categories;
  } catch (error) {
    console.warn(
      `Error fetching categories for feature ${featureId}:`,
      error
    );
    // Return empty array on error (CategoriesPanel will handle it gracefully)
    return [];
  }
}

/**
 * Fetch topics for a specific category
 * @param {string} categoryId - The category ID
 * @returns {Promise<Array>} Array of topic objects
 */
export async function fetchTopicsByCategory(categoryId) {
  try {
    const q = query(
      collection(db, "topics"),
      where("categoryId", "==", categoryId),
      where("isPublished", "==", true),
      orderBy("order", "asc"),
      limit(10) // Limit for mega menu display
    );
    const snapshot = await getDocs(q);
    const topics = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return topics;
  } catch (error) {
    console.error(
      `Error fetching topics for category ${categoryId}:`,
      error
    );
    return [];
  }
}

/**
 * Fetch navigation UI config from Firestore
 * Controls mega menu behavior, topics display, etc.
 * @returns {Promise<Object>} Config object with defaults
 */
export async function fetchNavigationConfig() {
  // Return cached config if available
  if (cache.config !== null) {
    return cache.config;
  }

  const defaultConfig = {
    showMegaMenu: true,
    showTopics: false,
    maxCategoriesPerRow: 4,
    animationDuration: 250,
  };

  try {
    const docRef = collection(db, "ui_navigation_config");
    const snapshot = await getDocs(docRef);

    if (snapshot.empty) {
      cache.config = defaultConfig;
      return defaultConfig;
    }

    const config = {
      ...defaultConfig,
      ...snapshot.docs[0].data(),
    };

    cache.config = config;
    return config;
  } catch (error) {
    console.error("Error fetching navigation config:", error);
    return defaultConfig;
  }
}

/**
 * Clear cache (useful for testing or refresh)
 */
export function clearNavigationCache() {
  cache.features = null;
  cache.categories = {};
  cache.config = null;
}

/**
 * Clear cache for a specific feature (e.g., after editing)
 * @param {string} featureId - The feature ID to clear
 */
export function clearFeatureCacheEntry(featureId) {
  if (cache.categories[featureId]) {
    delete cache.categories[featureId];
  }
}
