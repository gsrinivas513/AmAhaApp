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

// ============== VALIDATION ==============

const VALID_PUZZLE_TYPES = ['find-pair', 'picture-word', 'spot-difference', 'picture-shadow', 'ordering'];

/**
 * Validate puzzle data before saving
 * @throws {Error} If validation fails
 */
export const validatePuzzleData = (puzzleData) => {
  const errors = [];

  // Required fields
  if (!puzzleData.title || puzzleData.title.trim() === '') {
    errors.push("Title is required");
  }
  
  if (!puzzleData.type || !VALID_PUZZLE_TYPES.includes(puzzleData.type)) {
    errors.push(`Puzzle type is required and must be one of: ${VALID_PUZZLE_TYPES.join(', ')}`);
  }

  if (!puzzleData.categoryId) {
    errors.push("Category is required");
  }

  if (!puzzleData.topicId) {
    errors.push("Topic is required");
  }

  if (!puzzleData.subtopicId) {
    errors.push("Subtopic is required");
  }

  if (!puzzleData.difficulty) {
    errors.push("Difficulty is required");
  }

  // Data content validation
  if (!puzzleData.data || Object.keys(puzzleData.data).length === 0) {
    errors.push("Puzzle content/data is required - please configure the puzzle");
  }

  // Throw error if any validation failed
  if (errors.length > 0) {
    throw new Error(`Validation failed:\n${errors.map((e, i) => `${i + 1}. ${e}`).join('\n')}`);
  }

  return true;
};

// ============== PUZZLE OPERATIONS ==============

/**
 * Create a new visual puzzle
 */
export const createVisualPuzzle = async (puzzleData) => {
  try {
    // Validate before creating
    console.log("📝 Validating puzzle data...", puzzleData);
    validatePuzzleData(puzzleData);
    console.log("✅ Validation passed");
    
    const docRef = await addDoc(collection(db, "puzzles"), {
      ...puzzleData,
      isPublished: puzzleData.isPublished || false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      xpReward: puzzleData.xpReward || 10,
    });
    console.log("✅ Puzzle created with ID:", docRef.id);
    return { id: docRef.id, ...puzzleData };
  } catch (error) {
    console.error("❌ Error creating puzzle:", error);
    throw error;
  }
};

/**
 * Update an existing puzzle
 */
export const updateVisualPuzzle = async (puzzleId, updates) => {
  try {
    console.log("📝 updateVisualPuzzle called with:", { puzzleId, updates });
    
    // Validate before updating
    validatePuzzleData(updates);
    console.log("✅ Validation passed - Type:", updates.type);
    
    const puzzleRef = doc(db, "puzzles", puzzleId);
    await updateDoc(puzzleRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
    
    console.log("✅ Puzzle updated successfully in Firestore");
    return { id: puzzleId, ...updates };
  } catch (error) {
    console.error("❌ Error updating puzzle:", error);
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
 * Get puzzles by subtopic with multiple fallback strategies
 */
export const getVisualPuzzlesBySubtopic = async (subtopicId) => {
  try {
    console.log("🔍 getVisualPuzzlesBySubtopic called with subtopicId:", subtopicId);
    
    // Strategy 1: Try with composite index (multiple where + orderBy)
    try {
      console.log("  📊 Strategy 1: Trying composite index query...");
      const q = query(
        collection(db, "puzzles"),
        where("subtopicId", "==", subtopicId),
        where("isPublished", "==", true),
        orderBy("createdAt", "asc")
      );
      const querySnapshot = await getDocs(q);
      console.log("✅ Strategy 1 succeeded, found:", querySnapshot.docs.length, "puzzles");
      if (querySnapshot.docs.length > 0) {
        return querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      }
      // If composite index works but no results, fall through to other strategies
      console.log("  ℹ️ Strategy 1 returned 0 results, trying other strategies...");
    } catch (indexError) {
      console.warn("⚠️ Strategy 1 failed:", indexError.message);
    }
    
    // Strategy 2: Query by subtopicId without isPublished filter, sort in memory
    try {
      console.log("  📊 Strategy 2: Querying by subtopicId only...");
      const q = query(
        collection(db, "puzzles"),
        where("subtopicId", "==", subtopicId)
      );
      const querySnapshot = await getDocs(q);
      console.log("  📦 Strategy 2 found:", querySnapshot.docs.length, "puzzles with subtopicId");
      
      if (querySnapshot.docs.length > 0) {
        const results = querySnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter(puzzle => {
            // Include puzzle if isPublished is not explicitly false
            // This allows puzzles with missing isPublished field to be included
            const shouldInclude = puzzle.isPublished !== false;
            if (!shouldInclude) {
              console.log("  🚫 Filtering out puzzle (isPublished=false):", puzzle.id, puzzle.title);
            }
            return shouldInclude;
          })
          .sort((a, b) => (a.createdAt?.toMillis?.() || 0) - (b.createdAt?.toMillis?.() || 0));
        
        console.log("✅ Strategy 2 succeeded, returning:", results.length, "puzzles after filtering");
        return results;
      }
      console.log("  ℹ️ Strategy 2 returned 0 results, trying other strategies...");
    } catch (error) {
      console.warn("⚠️ Strategy 2 failed:", error.message);
    }
    
    // Strategy 3: Get all puzzles and filter client-side (only for debugging/fallback)
    try {
      console.log("  📊 Strategy 3: Client-side filtering of all puzzles...");
      const allPuzzlesSnap = await getDocs(collection(db, "puzzles"));
      console.log("  📦 Strategy 3 found:", allPuzzlesSnap.docs.length, "total puzzles");
      
      const results = allPuzzlesSnap.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter(puzzle => puzzle.subtopicId === subtopicId && puzzle.isPublished !== false)
        .sort((a, b) => (a.createdAt?.toMillis?.() || 0) - (b.createdAt?.toMillis?.() || 0));
      
      if (results.length > 0) {
        console.log("✅ Strategy 3 succeeded, returning:", results.length, "puzzles");
        return results;
      }
      console.log("❌ Strategy 3 also returned 0 results");
      
      // Log diagnostics
      const allWithSubtopicId = allPuzzlesSnap.docs.filter(doc => doc.data().subtopicId === subtopicId);
      console.log("  📋 Puzzles with matching subtopicId:", allWithSubtopicId.length);
      if (allWithSubtopicId.length > 0) {
        console.log("  📋 Sample puzzles:", allWithSubtopicId.slice(0, 3).map(d => ({ id: d.id, ...d.data() })));
      }
    } catch (error) {
      console.error("⚠️ Strategy 3 failed:", error.message);
    }
    
    console.error("❌ All strategies failed to find puzzles for subtopicId:", subtopicId);
    return [];
  } catch (error) {
    console.error("❌ Critical error fetching puzzles by subtopic:", error);
    return [];
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
