/**
 * homePageSectionService.js
 * Service to manage Homepage FeatureTiles section configuration
 * Allows admin to control order and visibility of sections
 */

import { db } from "../firebase/firebaseConfig";
import { collection, getDocs, setDoc, doc, updateDoc } from "firebase/firestore";

const CONFIG_COLLECTION = "ui_homepage_config";
const SECTIONS_DOC = "featureTiles";

export const DEFAULT_SECTIONS = [
  { id: "quizzes", label: "Quizzes", visible: true, order: 1 },
  { id: "puzzles", label: "Puzzles", visible: true, order: 2 },
  { id: "stories", label: "Featured Stories", visible: true, order: 3 },
  { id: "games", label: "Games", visible: true, order: 4 },
  { id: "latestAdded", label: "Latest Added", visible: true, order: 5 },
  { id: "allCategories", label: "All Categories", visible: true, order: 6 },
  { id: "allTopics", label: "All Topics", visible: true, order: 7 },
];

/**
 * Get FeatureTiles section configuration from Firestore
 */
export const getFeatureTilesConfig = async () => {
  try {
    const docRef = doc(db, CONFIG_COLLECTION, SECTIONS_DOC);
    const snapshot = await getDocs(collection(db, CONFIG_COLLECTION));
    
    if (!snapshot.empty) {
      const configData = snapshot.docs.find(doc => doc.id === SECTIONS_DOC);
      if (configData) {
        return configData.data().sections || DEFAULT_SECTIONS;
      }
    }
    
    return DEFAULT_SECTIONS;
  } catch (error) {
    console.error("Error fetching FeatureTiles config:", error);
    return DEFAULT_SECTIONS;
  }
};

/**
 * Save FeatureTiles section configuration to Firestore
 */
export const saveFeatureTilesConfig = async (sections) => {
  try {
    const configRef = collection(db, CONFIG_COLLECTION);
    const docRef = doc(configRef, SECTIONS_DOC);
    
    await setDoc(docRef, {
      sections: sections,
      lastUpdated: new Date().toISOString(),
    }, { merge: true });
    
    return true;
  } catch (error) {
    console.error("Error saving FeatureTiles config:", error);
    throw error;
  }
};

/**
 * Update section visibility
 */
export const updateSectionVisibility = async (sections, sectionId, visible) => {
  const updated = sections.map(s =>
    s.id === sectionId ? { ...s, visible } : s
  );
  return saveFeatureTilesConfig(updated);
};

/**
 * Update section order
 */
export const updateSectionOrder = async (sections, sectionId, newOrder) => {
  const updated = sections.map(s =>
    s.id === sectionId ? { ...s, order: newOrder } : s
  );
  return saveFeatureTilesConfig(updated);
};

/**
 * Get sorted and filtered sections based on configuration
 */
export const getSortedVisibleSections = (sections) => {
  return sections
    .filter(s => s.visible)
    .sort((a, b) => a.order - b.order);
};
