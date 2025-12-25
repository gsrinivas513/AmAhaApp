/**
 * navigationService.js
 * Handles all Firestore queries for top navigation menu
 * Caches features and lazily loads categories per feature
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

/**
 * Fetch all published features from Firestore
 * Cached to avoid repeated queries
 * @returns {Promise<Array>} Array of feature objects
 */
export async function fetchPublishedFeatures() {
  // Return cached features if available
  if (cache.features !== null) {
    return cache.features;
  }

  try {
    const q = query(
      collection(db, "features"),
      where("isPublished", "==", true),
      orderBy("order", "asc")
    );
    const snapshot = await getDocs(q);
    const features = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Cache the result
    cache.features = features;
    return features;
  } catch (error) {
    console.error("Error fetching features:", error);
    return [];
  }
}

/**
 * Fetch categories for a specific feature
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
    const q = query(
      collection(db, "categories"),
      where("featureId", "==", featureId),
      where("isPublished", "==", true),
      orderBy("order", "asc")
    );
    const snapshot = await getDocs(q);
    const categories = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Cache the result
    cache.categories[featureId] = categories;
    return categories;
  } catch (error) {
    console.error(
      `Error fetching categories for feature ${featureId}:`,
      error
    );
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
