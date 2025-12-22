// src/quiz/services/subcategoryService.js
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

/**
 * Get a category by ID
 */
export async function getCategory(categoryId) {
  try {
    const docSnap = await getDoc(doc(db, "categories", categoryId));
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      };
    }
    return null;
  } catch (error) {
    console.error("Error getting category:", error);
    throw error;
  }
}

/**
 * Get all published subcategories for a category
 */
export async function getSubcategoriesByCategory(categoryId) {
  try {
    const snap = await getDocs(
      query(
        collection(db, "subtopics"),
        where("categoryId", "==", categoryId),
        where("isPublished", "==", true)
      )
    );

    return snap.docs.map(docSnap => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));
  } catch (error) {
    console.error("Error getting subcategories:", error);
    throw error;
  }
}

/**
 * Get a specific subcategory
 */
export async function getSubcategory(subcategoryId) {
  try {
    const docSnap = await getDoc(doc(db, "subtopics", subcategoryId));
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      };
    }
    return null;
  } catch (error) {
    console.error("Error getting subcategory:", error);
    throw error;
  }
}

/**
 * Check if subcategories exist for a category
 */
export async function hasSubcategories(categoryId) {
  try {
    const snap = await getDocs(
      query(
        collection(db, "subtopics"),
        where("categoryId", "==", categoryId),
        where("isPublished", "==", true)
      )
    );
    return snap.size > 0;
  } catch (error) {
    console.error("Error checking subcategories:", error);
    return false;
  }
}
