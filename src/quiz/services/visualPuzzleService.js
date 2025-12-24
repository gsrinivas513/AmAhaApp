// src/quiz/services/visualPuzzleService.js
// Service for visual puzzle operations
import {
  db,
} from "../../firebase/firebaseConfig";
import {
  collection,
  addDoc,
  setDoc,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  updateDoc,
  deleteDoc,
  limit,
  Timestamp,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

// ============== PUZZLE OPERATIONS ==============

/**
 * Create a new visual puzzle
 */
export const createVisualPuzzle = async (puzzleData) => {
  try {
    const docRef = await addDoc(collection(db, "puzzles"), {
      ...puzzleData,
      isPublished: puzzleData.isPublished || false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      xpReward: puzzleData.xpReward || 10,
    });
    return { id: docRef.id, ...puzzleData };
  } catch (error) {
    console.error("Error creating puzzle:", error);
    throw error;
  }
};

/**
 * Update an existing puzzle
 */
export const updateVisualPuzzle = async (puzzleId, updates) => {
  try {
    const puzzleRef = doc(db, "puzzles", puzzleId);
    await updateDoc(puzzleRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
    return { id: puzzleId, ...updates };
  } catch (error) {
    console.error("Error updating puzzle:", error);
    throw error;
  }
};

/**
 * Get puzzle by ID
 */
export const getVisualPuzzleById = async (puzzleId) => {
  try {
    const docRef = doc(db, "puzzles", puzzleId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error("Error fetching puzzle:", error);
    throw error;
  }
};

/**
 * Get puzzles by subtopic
 */
export const getVisualPuzzlesBySubtopic = async (subtopicId) => {
  try {
    const q = query(
      collection(db, "puzzles"),
      where("subtopicId", "==", subtopicId),
      where("isPublished", "==", true),
      orderBy("createdAt", "asc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching puzzles by subtopic:", error);
    throw error;
  }
};

/**
 * Get puzzles by type
 */
export const getVisualPuzzlesByType = async (type) => {
  try {
    const q = query(
      collection(db, "puzzles"),
      where("type", "==", type),
      where("isPublished", "==", true),
      orderBy("createdAt", "asc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching puzzles by type:", error);
    throw error;
  }
};

/**
 * Get all puzzles (admin)
 */
export const getAllVisualPuzzles = async () => {
  try {
    const q = query(collection(db, "puzzles"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching all puzzles:", error);
    throw error;
  }
};

/**
 * Delete puzzle
 */
export const deleteVisualPuzzle = async (puzzleId) => {
  try {
    await deleteDoc(doc(db, "puzzles", puzzleId));
  } catch (error) {
    console.error("Error deleting puzzle:", error);
    throw error;
  }
};

// ============== PROGRESS OPERATIONS ==============

const auth = getAuth();

/**
 * Save puzzle progress for logged-in user
 */
export const savePuzzleProgress = async (puzzleId, progressData) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      // For guest users, use localStorage
      saveGuestPuzzleProgress(puzzleId, progressData);
      return;
    }

    const progressRef = doc(
      db,
      "puzzleProgress",
      user.uid,
      "puzzles",
      puzzleId
    );
    await setDoc(
      progressRef,
      {
        ...progressData,
        lastAttemptAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (error) {
    console.error("Error saving puzzle progress:", error);
    throw error;
  }
};

/**
 * Get puzzle progress for logged-in user
 */
export const getPuzzleProgress = async (puzzleId) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      // For guest users, use localStorage
      return getGuestPuzzleProgress(puzzleId);
    }

    const progressRef = doc(
      db,
      "puzzleProgress",
      user.uid,
      "puzzles",
      puzzleId
    );
    const docSnap = await getDoc(progressRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (error) {
    console.error("Error fetching puzzle progress:", error);
    throw error;
  }
};

/**
 * Get all puzzle progress for user
 */
export const getAllPuzzleProgress = async () => {
  try {
    const user = auth.currentUser;
    if (!user) {
      return getAllGuestPuzzleProgress();
    }

    const q = query(
      collection(db, "puzzleProgress", user.uid, "puzzles"),
      where("completed", "==", true)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      puzzleId: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching all puzzle progress:", error);
    throw error;
  }
};

// ============== GUEST PROGRESS (localStorage) ==============

const PUZZLE_PROGRESS_KEY = "amaha_puzzle_progress";

/**
 * Save guest puzzle progress to localStorage
 */
export const saveGuestPuzzleProgress = (puzzleId, progressData) => {
  try {
    const allProgress = JSON.parse(
      localStorage.getItem(PUZZLE_PROGRESS_KEY) || "{}"
    );
    allProgress[puzzleId] = {
      ...progressData,
      lastAttemptAt: new Date().toISOString(),
    };
    localStorage.setItem(PUZZLE_PROGRESS_KEY, JSON.stringify(allProgress));
  } catch (error) {
    console.error("Error saving guest puzzle progress:", error);
  }
};

/**
 * Get guest puzzle progress from localStorage
 */
export const getGuestPuzzleProgress = (puzzleId) => {
  try {
    const allProgress = JSON.parse(
      localStorage.getItem(PUZZLE_PROGRESS_KEY) || "{}"
    );
    return allProgress[puzzleId] || null;
  } catch (error) {
    console.error("Error getting guest puzzle progress:", error);
    return null;
  }
};

/**
 * Get all guest puzzle progress
 */
export const getAllGuestPuzzleProgress = () => {
  try {
    const allProgress = JSON.parse(
      localStorage.getItem(PUZZLE_PROGRESS_KEY) || "{}"
    );
    return Object.entries(allProgress)
      .filter(([_, data]) => data.completed)
      .map(([puzzleId, data]) => ({
        puzzleId,
        ...data,
      }));
  } catch (error) {
    console.error("Error getting all guest puzzle progress:", error);
    return [];
  }
};

/**
 * Clear all guest puzzle progress
 */
export const clearGuestPuzzleProgress = () => {
  try {
    localStorage.removeItem(PUZZLE_PROGRESS_KEY);
  } catch (error) {
    console.error("Error clearing guest puzzle progress:", error);
  }
};

// ============== PUZZLE TYPE CONSTANTS ==============

export const VISUAL_PUZZLE_TYPES = [
  {
    value: "picture-word",
    label: "Match Picture with Word",
    description: "Drag or click to match pictures with words",
    icon: "🖼️",
  },
  {
    value: "spot-difference",
    label: "Spot the Difference",
    description: "Find the differences between two images",
    icon: "👁️",
  },
  {
    value: "find-pair",
    label: "Find Matching Pair",
    description: "Memory game - find matching picture pairs",
    icon: "🧩",
  },
  {
    value: "picture-shadow",
    label: "Match Picture with Shadow",
    description: "Match pictures with their shadows",
    icon: "🌑",
  },
  {
    value: "ordering",
    label: "Order/Sequence",
    description: "Arrange items in correct order",
    icon: "🔢",
  },
];

export const DIFFICULTY_LEVELS = ["easy", "medium", "hard"];
export const AGE_GROUPS = ["3-5", "6-8", "9-12"];
