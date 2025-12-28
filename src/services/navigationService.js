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
import { DEFAULT_FEATURES } from "../constants/FEATURES";

// Simple in-memory cache
const cache = {
  features: null,
  categories: {}, // key: featureId, value: array of categories
  config: null,
};

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
    // Try to query only published features first (more efficient)
    let snapshot;
    try {
      const q = query(
        collection(db, "features"),
        where("isPublished", "==", true),
        orderBy("order", "asc"),
        limit(20)
      );
      snapshot = await getDocs(q);
    } catch (err) {
      // If the index doesn't exist, fall back to fetching all and filtering
      console.debug("Published features query failed, using fallback", err.message);
      snapshot = await getDocs(collection(db, "features"));
    }

    const features = snapshot.docs
      .filter((doc) => {
        const data = doc.data();
        // Include if isPublished is true, enabled is true, or status is 'enabled'
        return data.isPublished !== false && (data.enabled !== false || data.status === "enabled");
      })
      .map((doc) => {
        const data = doc.data();
        // Normalize feature ID to lowercase for consistency
        const normalizedId = (data.id || doc.id || "").toLowerCase().trim();
        return {
          id: normalizedId,
          featureId: normalizedId,
          order: data.order || 999,
          ...data,
          // Ensure name is also lowercase
          name: (data.name || "").toLowerCase().trim(),
        };
      })
      // Sort by order field
      .sort((a, b) => (a.order || 999) - (b.order || 999));

    console.log("[navigationService] Fetched features:", features);
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
 * For stories, fetches from storyCategories collection
 * Filters by featureId and isPublished status
 * Cached per feature to minimize Firestore reads
 * @param {string} featureId - The feature ID
 * @param {Object} feature - Optional feature object with featureType
 * @returns {Promise<Array>} Array of category objects
 */
export async function fetchCategoriesByFeature(featureId, feature = null) {
  // Normalize featureId for consistent caching
  const normalizedFeatureId = (featureId || "").toLowerCase().trim();
  
  // Return cached categories if available (use normalized ID for cache key)
  if (cache.categories[normalizedFeatureId]) {
    console.log(`[navigationService] ✅ Returning cached categories for ${normalizedFeatureId}`);
    return cache.categories[normalizedFeatureId];
  }

  try {
    let categories = [];
    console.log(`[navigationService] 🔍 Fetching categories for feature: "${featureId}" (normalized: "${normalizedFeatureId}")`);

    // Special handling for Stories - use storyCategories collection
    if (normalizedFeatureId === "stories") {
      try {
        const storySnapshot = await getDocs(
          query(
            collection(db, "storyCategories"),
            where("isPublished", "==", true),
            orderBy("order", "asc"),
            limit(100)
          )
        );
        categories = storySnapshot.docs.map((doc) => ({
          id: doc.id,
          key: doc.id,
          title: doc.data().label || doc.data().name || doc.id,
          name: doc.data().name || doc.id,
          label: doc.data().label || doc.data().name || doc.id,
          description: doc.data().description,
          icon: doc.data().icon,
          order: doc.data().order || 999,
          ...doc.data(),
        }));

        if (categories.length > 0) {
          console.log(`[navigationService] ✅ Loaded ${categories.length} story categories`);
          cache.categories[normalizedFeatureId] = categories;
          return categories;
        }
      } catch (err) {
        console.debug(`Story categories query failed, trying fallback:`, err.message);
        // Fallback for stories
        const allSnapshot = await getDocs(collection(db, "storyCategories"));
        categories = allSnapshot.docs
          .filter((doc) => doc.data().isPublished !== false)
          .map((doc) => ({
            id: doc.id,
            key: doc.id,
            title: doc.data().label || doc.data().name || doc.id,
            name: doc.data().name || doc.id,
            label: doc.data().label || doc.data().name || doc.id,
            description: doc.data().description,
            icon: doc.data().icon,
            order: doc.data().order || 999,
            ...doc.data(),
          }))
          .sort((a, b) => (a.order || 999) - (b.order || 999));

        if (categories.length > 0) {
          console.log(`[navigationService] ✅ Loaded ${categories.length} story categories (fallback)`);
          cache.categories[normalizedFeatureId] = categories;
          return categories;
        }
      }
    }

    // For non-stories, try the optimized query approach
    // First, try querying by uiMode (for puzzles, quizzes, etc.)
    const singularForm = normalizedFeatureId.endsWith('s') ? normalizedFeatureId.slice(0, -1) : normalizedFeatureId;
    try {
      const q_uiMode = query(
        collection(db, "categories"),
        where("uiMode", "==", singularForm),
        where("isPublished", "==", true),
        orderBy("order", "asc"),
        limit(100)
      );
      const snapshot_uiMode = await getDocs(q_uiMode);
      if (snapshot_uiMode.docs.length > 0) {
        categories = snapshot_uiMode.docs.map((doc) => ({
          id: doc.id,
          key: doc.id,
          title: doc.data().label || doc.data().name || doc.id,
          name: doc.data().name || doc.id,
          label: doc.data().label || doc.data().name || doc.id,
          description: doc.data().description,
          icon: doc.data().icon,
          featureId: doc.data().featureId,
          order: doc.data().order || 999,
          ...doc.data(),
        }));
        console.log(`[navigationService] ✅ Loaded ${categories.length} categories for feature ${normalizedFeatureId} (uiMode: "${singularForm}" query)`);
        cache.categories[normalizedFeatureId] = categories;
        return categories;
      }
    } catch (err) {
      console.debug(`[navigationService] ⚠️  uiMode query failed for ${singularForm}:`, err.message);
    }

    // Next, try querying by featureId
    try {
      const q1 = query(
        collection(db, "categories"),
        where("featureId", "==", normalizedFeatureId),
        where("isPublished", "==", true),
        orderBy("order", "asc"),
        limit(100)
      );
      const snapshot1 = await getDocs(q1);
      categories = snapshot1.docs.map((doc) => ({
        id: doc.id,
        key: doc.id,
        title: doc.data().label || doc.data().name || doc.id,
        name: doc.data().name || doc.id,
        label: doc.data().label || doc.data().name || doc.id,
        description: doc.data().description,
        icon: doc.data().icon,
        featureId: doc.data().featureId,
        order: doc.data().order || 999,
        ...doc.data(),
      }));

      if (categories.length > 0) {
        console.log(`[navigationService] ✅ Loaded ${categories.length} categories for feature ${normalizedFeatureId} (featureId query)`);
        cache.categories[normalizedFeatureId] = categories;
        return categories;
      }
    } catch (err) {
      // This query might fail if index doesn't exist, fall back to client-side filtering
      console.debug(`[navigationService] ⚠️  featureId query failed for ${normalizedFeatureId}:`, err.message);
    }

    // Fallback: Fetch all published categories and filter in JavaScript
    // This is slower but handles missing indexes gracefully
    const allSnapshot = await getDocs(
      query(
        collection(db, "categories"),
        where("isPublished", "==", true)
      )
    );

    categories = allSnapshot.docs
      .filter((doc) => {
        const data = doc.data();
        
        // Match by various field conventions:
        // 1. featureId field (direct match with normalized comparison)
        const matchesFeatureId = (data.featureId || "").toLowerCase().trim() === normalizedFeatureId;
        
        // 2. featureType or type field (if we know the feature type)
        const featureType = feature?.featureType || feature?.type;
        const matchesFeatureType = featureType && (
          (data.featureType || "").toLowerCase() === featureType.toLowerCase() ||
          (data.type || "").toLowerCase() === featureType.toLowerCase()
        );
        
        // 3. uiMode field (used by puzzle categories)
        const matchesUiMode = data.uiMode === normalizedFeatureId || 
                              data.uiMode === normalizedFeatureId.slice(0, -1); // "puzzles" -> "puzzle"
        
        // 4. featureName or name field (as last resort)
        const matchesName = (data.featureName || "").toLowerCase() === normalizedFeatureId ||
                           (data.name || "").toLowerCase() === normalizedFeatureId;
        
        return matchesFeatureId || matchesFeatureType || matchesUiMode || matchesName;
      })
      .map((doc) => ({
        id: doc.id,
        key: doc.id,
        title: doc.data().label || doc.data().name || doc.id,
        name: doc.data().name || doc.id,
        label: doc.data().label || doc.data().name || doc.id,
        description: doc.data().description,
        icon: doc.data().icon,
        featureId: doc.data().featureId,
        order: doc.data().order || 999,
        ...doc.data(),
      }))
      // Sort by order field
      .sort((a, b) => (a.order || 999) - (b.order || 999));

    if (categories.length > 0) {
      console.log(`[navigationService] ✅ Loaded ${categories.length} categories for feature ${normalizedFeatureId} (fallback)`);
    } else {
      console.warn(`[navigationService] ❌ NO categories found for feature "${featureId}" (normalized: "${normalizedFeatureId}")`);
    }

    // Cache the result using normalized ID
    cache.categories[normalizedFeatureId] = categories;
    return categories;
  } catch (error) {
    console.error(
      `[navigationService] ❌ Error fetching categories for feature "${featureId}" (normalized: "${(featureId || "").toLowerCase().trim()}"):`,
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
