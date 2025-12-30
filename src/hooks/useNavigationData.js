/**
 * useNavigationData.js
 * Custom hook to manage navigation menu data
 * Handles fetching features, categories, and caching
 */

import { useState, useEffect, useCallback } from "react";
import {
  fetchPublishedFeatures,
  fetchCategoriesByFeature,
  fetchNavigationConfig,
} from "../services/navigationService";

/**
 * Hook to fetch and manage navigation data
 * @returns {Object} Navigation data and utilities
 */
export function useNavigationData() {
  const [features, setFeatures] = useState([]);
  const [categoriesByFeature, setCategoriesByFeature] = useState({});
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch features and config on mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [featuresData, configData] = await Promise.all([
          fetchPublishedFeatures(),
          fetchNavigationConfig(),
        ]);

        setFeatures(featuresData);
        setConfig(configData);
      } catch (err) {
        console.error("Error loading navigation data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  /**
   * Load categories for a specific feature (lazy load on hover/click)
   * @param {string} featureId - The feature ID
   * @param {Object} featureData - Optional feature data object
   */
  const loadFeatureCategories = useCallback(
    async (featureId, featureData = null) => {
      // Skip if already loaded
      if (categoriesByFeature[featureId]?.length > 0) {
        return categoriesByFeature[featureId];
      }

      try {
        const categories = await fetchCategoriesByFeature(featureId, featureData);
        setCategoriesByFeature((prev) => ({
          ...prev,
          [featureId]: categories,
        }));
        return categories;
      } catch (err) {
        console.error(`Error loading categories for feature ${featureId}:`, err);
        return [];
      }
    },
    [categoriesByFeature]
  );

  return {
    features,
    categoriesByFeature,
    config,
    loading,
    error,
    loadFeatureCategories,
  };
}
