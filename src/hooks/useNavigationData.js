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
      console.log(`[useNavigationData] loadFeatureCategories called with featureId: ${featureId}`, featureData);
      console.log(`[useNavigationData] Current categoriesByFeature:`, categoriesByFeature);
      
      // Skip if already loaded - check before async to avoid race conditions
      if (categoriesByFeature[featureId]?.length > 0) {
        console.log(`[useNavigationData] Categories already loaded for ${featureId}:`, categoriesByFeature[featureId]);
        return categoriesByFeature[featureId];
      }

      try {
        console.log(`[useNavigationData] Fetching categories from service for ${featureId}...`);
        const categories = await fetchCategoriesByFeature(featureId, featureData);
        console.log(`[useNavigationData] Got ${categories.length} categories from service:`, categories);
        
        setCategoriesByFeature((prev) => {
          const updated = {
            ...prev,
            [featureId]: categories,
          };
          console.log(`[useNavigationData] Updated categoriesByFeature state:`, updated);
          return updated;
        });
        return categories;
      } catch (err) {
        console.error(`[useNavigationData] Error loading categories for feature ${featureId}:`, err);
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
