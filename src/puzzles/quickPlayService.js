// src/puzzles/quickPlayService.js
// Service for quick play functionality - get random puzzles by category/type/subtopic
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

/**
 * Get random puzzle by category name
 * @param {string} categoryName - Category name (e.g., "Logic Puzzles")
 * @returns {Promise<Object|null>} Random puzzle object or null
 */
export const getRandomPuzzleByCategory = async (categoryName) => {
  try {
    const decodedCategory = decodeURIComponent(categoryName);
    const puzzlesRef = collection(db, "puzzles");
    const q = query(
      puzzlesRef,
      where("categoryName", "==", decodedCategory),
      where("isPublished", "==", true)
    );
    
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    
    const puzzles = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return puzzles[Math.floor(Math.random() * puzzles.length)];
  } catch (error) {
    console.error("Error getting random puzzle by category:", error);
    return null;
  }
};

/**
 * Get random puzzle by topic (type)
 * @param {string} categoryName - Category name
 * @param {string} topicName - Topic/type name (e.g., "Find Pairs")
 * @returns {Promise<Object|null>} Random puzzle object or null
 */
export const getRandomPuzzleByTopic = async (categoryName, topicName) => {
  try {
    const decodedCategory = decodeURIComponent(categoryName);
    const decodedTopic = decodeURIComponent(topicName);
    
    const puzzlesRef = collection(db, "puzzles");
    const q = query(
      puzzlesRef,
      where("categoryName", "==", decodedCategory),
      where("topicName", "==", decodedTopic),
      where("isPublished", "==", true)
    );
    
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    
    const puzzles = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return puzzles[Math.floor(Math.random() * puzzles.length)];
  } catch (error) {
    console.error("Error getting random puzzle by topic:", error);
    return null;
  }
};

/**
 * Get random puzzle by subtopic
 * @param {string} categoryName - Category name
 * @param {string} topicName - Topic/type name
 * @param {string} subtopicName - Subtopic name (e.g., "Colors")
 * @returns {Promise<Object|null>} Random puzzle object or null
 */
export const getRandomPuzzleBySubtopic = async (categoryName, topicName, subtopicName) => {
  try {
    const decodedCategory = decodeURIComponent(categoryName);
    const decodedTopic = decodeURIComponent(topicName);
    const decodedSubtopic = decodeURIComponent(subtopicName);
    
    const puzzlesRef = collection(db, "puzzles");
    const q = query(
      puzzlesRef,
      where("categoryName", "==", decodedCategory),
      where("topicName", "==", decodedTopic),
      where("subtopicName", "==", decodedSubtopic),
      where("isPublished", "==", true)
    );
    
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    
    const puzzles = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return puzzles[Math.floor(Math.random() * puzzles.length)];
  } catch (error) {
    console.error("Error getting random puzzle by subtopic:", error);
    return null;
  }
};
