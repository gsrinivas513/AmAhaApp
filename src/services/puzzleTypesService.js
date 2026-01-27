/**
 * Comprehensive Puzzle Types Service
 * Manages ALL puzzle types from both quiz registry and puzzle game system
 */

import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { QUIZ_TYPE_PLUGINS } from '../quizzes/registry/quizTypeRegistry';

/**
 * ALL PUZZLE TYPES - Combined from both systems
 * 
 * Category 1: Quiz Registry Puzzle Types (4)
 * - PUZZLE (Generic puzzle assembly)
 * - CROSSWORD (Crossword puzzle)
 * - WORD_SEARCH (Word search puzzle)
 * - SUDOKU (Sudoku puzzle)
 * 
 * Category 2: Game Puzzle Types (6)
 * - find-pair (Memory matching game)
 * - ordering (Sequence ordering game)
 * - picture-shadow (Match images with shadows)
 * - picture-word (Match pictures with words)
 * - spot-difference (Find differences between images)
 * - jigsaw (Jigsaw puzzle assembly)
 * 
 * Note: word-search is only included once from quiz registry (WORD_SEARCH)
 * to avoid duplication
 */

// Quiz Registry Puzzle Types
const QUIZ_PUZZLE_TYPES = {
  PUZZLE: 'PUZZLE',
  CROSSWORD: 'CROSSWORD',
  WORD_SEARCH: 'WORD_SEARCH',
  SUDOKU: 'SUDOKU',
};

// Game Puzzle Types
const GAME_PUZZLE_TYPES = {
  FIND_PAIR: 'find-pair',
  ORDERING: 'ordering',
  PICTURE_SHADOW: 'picture-shadow',
  PICTURE_WORD: 'picture-word',
  SPOT_DIFFERENCE: 'spot-difference',
  JIGSAW: 'jigsaw',
  // Note: word-search is already covered by WORD_SEARCH from quiz registry
};

/**
 * Comprehensive list of ALL puzzle types
 */
export const ALL_PUZZLE_TYPES = [
  // Quiz Registry Types
  {
    id: 'PUZZLE',
    label: 'Puzzle Assembly',
    description: 'Arrange puzzle pieces in order',
    category: 'advanced',
    complexity: 'complex',
    inputType: 'drag_reorder',
    evaluationType: 'sequence',
    defaultPoints: 20,
    system: 'quiz',
    isActive: true,
    isSystem: true,
    metadata: {
      icon: '🧩',
      color: '#FF6B6B',
    },
  },
  {
    id: 'CROSSWORD',
    label: 'Crossword Puzzle',
    description: 'Fill grid with words using clues (horizontal and vertical)',
    category: 'advanced',
    complexity: 'complex',
    inputType: 'text_grid',
    evaluationType: 'grid_match',
    defaultPoints: 25,
    system: 'quiz',
    isActive: true,
    isSystem: true,
    metadata: {
      icon: '📝',
      color: '#4ECDC4',
    },
  },
  {
    id: 'WORD_SEARCH',
    label: 'Word Search',
    description: 'Find hidden words in a letter grid',
    category: 'intermediate',
    complexity: 'medium',
    inputType: 'word_selection',
    evaluationType: 'word_match',
    defaultPoints: 15,
    system: 'quiz',
    isActive: true,
    isSystem: true,
    metadata: {
      icon: '🔤',
      color: '#95E1D3',
    },
  },
  {
    id: 'SUDOKU',
    label: 'Sudoku Puzzle',
    description: 'Fill 9x9 grid with numbers 1-9 (each row, column, and 3x3 box unique)',
    category: 'advanced',
    complexity: 'complex',
    inputType: 'number_grid',
    evaluationType: 'sudoku_rules',
    defaultPoints: 30,
    system: 'quiz',
    isActive: true,
    isSystem: true,
    metadata: {
      icon: '🔢',
      color: '#FFD93D',
    },
  },

  // Game Puzzle Types
  {
    id: 'find-pair',
    label: 'Find Pairs',
    description: 'Memory game with matching image pairs. Requires: 8+ images (4+ pairs)',
    category: 'intermediate',
    complexity: 'medium',
    inputType: 'pair_matching',
    evaluationType: 'exact',
    defaultPoints: 10,
    system: 'puzzle-game',
    isActive: true,
    isSystem: true,
    metadata: {
      icon: '🔍',
      color: '#A8D8EA',
    },
  },
  {
    id: 'ordering',
    label: 'Sequence Ordering',
    description: 'Arrange items in correct order',
    category: 'intermediate',
    complexity: 'medium',
    inputType: 'drag_reorder',
    evaluationType: 'sequence',
    defaultPoints: 15,
    system: 'puzzle-game',
    isActive: true,
    isSystem: true,
    metadata: {
      icon: '🔢',
      color: '#AA96DA',
    },
  },
  {
    id: 'picture-shadow',
    label: 'Picture Shadow',
    description: 'Match images with their shadows. Requires: Original and shadow images',
    category: 'intermediate',
    complexity: 'medium',
    inputType: 'pair_matching',
    evaluationType: 'exact',
    defaultPoints: 12,
    system: 'puzzle-game',
    isActive: true,
    isSystem: true,
    metadata: {
      icon: '🌙',
      color: '#FCBAD3',
    },
  },
  {
    id: 'picture-word',
    label: 'Picture Word Matching',
    description: 'Match pictures with corresponding words. Requires: Image-word pairs',
    category: 'intermediate',
    complexity: 'medium',
    inputType: 'pair_matching',
    evaluationType: 'exact',
    defaultPoints: 10,
    system: 'puzzle-game',
    isActive: true,
    isSystem: true,
    metadata: {
      icon: '🖼️',
      color: '#A0C4FF',
    },
  },
  {
    id: 'spot-difference',
    label: 'Spot Difference',
    description: 'Find differences between two images. Requires: Original and modified images',
    category: 'advanced',
    complexity: 'complex',
    inputType: 'image_click',
    evaluationType: 'coordinate_match',
    defaultPoints: 15,
    system: 'puzzle-game',
    isActive: true,
    isSystem: true,
    metadata: {
      icon: '🔎',
      color: '#FFFACD',
    },
  },
  {
    id: 'jigsaw',
    label: 'Jigsaw Puzzle',
    description: 'Assemble jigsaw puzzle pieces into complete image',
    category: 'advanced',
    complexity: 'complex',
    inputType: 'drag_reorder',
    evaluationType: 'sequence',
    defaultPoints: 20,
    system: 'puzzle-game',
    isActive: true,
    isSystem: true,
    metadata: {
      icon: '🧩',
      color: '#FFB6C1',
    },
  },
];

/**
 * Helper: Deduplicate puzzle types by ID
 */
const deduplicateTypes = (types) => {
  const seen = new Set();
  return types.filter((type) => {
    if (seen.has(type.id)) {
      console.warn(`Duplicate puzzle type detected: ${type.id}, removing duplicate`);
      return false;
    }
    seen.add(type.id);
    return true;
  });
};

/**
 * Get all puzzle types from both systems
 */
export const getAllPuzzleTypes = async (onlyActive = true) => {
  try {
    // Try to fetch from Firestore
    const typesRef = collection(db, 'puzzleTypes');
    const q = query(
      typesRef,
      ...(onlyActive ? [where('isActive', '==', true)] : [])
    );
    const snapshot = await getDocs(q);
    let firestoreTypes = snapshot.docs.map((doc) => ({
      docId: doc.id,
      ...doc.data(),
    }));

    // Deduplicate Firestore types by ID
    firestoreTypes = deduplicateTypes(firestoreTypes);

    // Merge Firestore types with hardcoded defaults to preserve all metadata
    let mergedTypes;
    if (firestoreTypes.length > 0) {
      console.log('📡 Loaded puzzle types from Firestore:', firestoreTypes);
      
      // Create a map of hardcoded types by ID for easy lookup
      const hardcodedMap = {};
      ALL_PUZZLE_TYPES.forEach(t => {
        hardcodedMap[t.id] = t;
      });
      
      // Merge Firestore types with hardcoded defaults
      mergedTypes = firestoreTypes.map(firestoreType => {
        const hardcodedDefaults = hardcodedMap[firestoreType.id] || {};
        // Firestore data takes precedence for custom overrides, but hardcoded defaults fill gaps
        return {
          ...hardcodedDefaults,  // Start with hardcoded defaults (includes icon, inputType, etc.)
          ...firestoreType,       // Override with Firestore data
        };
      });
      
      console.log('✅ Merged Firestore types with hardcoded defaults:', mergedTypes);
      return deduplicateTypes(mergedTypes);
    }

    // Fallback to hardcoded types
    console.warn('No puzzle types in Firestore, using hardcoded defaults');
    const defaultTypes = onlyActive ? ALL_PUZZLE_TYPES.filter((t) => t.isActive) : ALL_PUZZLE_TYPES;
    const dedupedTypes = deduplicateTypes(defaultTypes);
    console.log('✅ Loaded puzzle types from hardcoded defaults:', dedupedTypes);
    return dedupedTypes;
  } catch (error) {
    console.warn('Error fetching puzzle types from Firestore, using defaults:', error);
    // Graceful fallback to hardcoded types
    const defaultTypes = onlyActive ? ALL_PUZZLE_TYPES.filter((t) => t.isActive) : ALL_PUZZLE_TYPES;
    const dedupedTypes = deduplicateTypes(defaultTypes);
    console.log('✅ Loaded puzzle types from fallback:', dedupedTypes);
    return dedupedTypes;
  }
};

/**
 * Get puzzle types by system (quiz or puzzle-game)
 */
export const getPuzzleTypesBySystem = async (system = 'all', onlyActive = true) => {
  const allTypes = await getAllPuzzleTypes(onlyActive);

  if (system === 'all') {
    return allTypes;
  }

  return allTypes.filter((t) => t.system === system);
};

/**
 * Get puzzle types by category
 */
export const getPuzzleTypesByCategory = async (category, onlyActive = true) => {
  const allTypes = await getAllPuzzleTypes(onlyActive);
  return allTypes.filter((t) => t.category === category);
};

/**
 * Create a new custom puzzle type
 */
export const createPuzzleType = async (typeData, userId = null) => {
  try {
    const typesRef = collection(db, 'puzzleTypes');
    const newType = {
      ...typeData,
      isActive: true,
      isSystem: false,
      isCustom: true,
      createdBy: userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const docRef = await addDoc(typesRef, newType);
    return { docId: docRef.id, ...newType };
  } catch (error) {
    console.error('Error creating puzzle type:', error);
    throw error;
  }
};

/**
 * Update a puzzle type
 */
export const updatePuzzleType = async (docId, updates, userId = null) => {
  try {
    const typeRef = doc(db, 'puzzleTypes', docId);
    const updateData = {
      ...updates,
      updatedAt: new Date().toISOString(),
      updatedBy: userId,
    };

    await updateDoc(typeRef, updateData);
    return { docId, ...updateData };
  } catch (error) {
    console.error('Error updating puzzle type:', error);
    throw error;
  }
};

/**
 * Deactivate a puzzle type (soft delete)
 */
export const deactivatePuzzleType = async (docId, userId = null) => {
  return updatePuzzleType(docId, { isActive: false }, userId);
};

/**
 * Delete a puzzle type (hard delete)
 */
export const deletePuzzleType = async (docId) => {
  try {
    const typeRef = doc(db, 'puzzleTypes', docId);
    await deleteDoc(typeRef);
    return true;
  } catch (error) {
    console.error('Error deleting puzzle type:', error);
    throw error;
  }
};

/**
 * Get puzzle type statistics
 */
export const getPuzzleTypeStatistics = async () => {
  try {
    const allTypes = await getAllPuzzleTypes(false);

    return {
      total: allTypes.length,
      active: allTypes.filter((t) => t.isActive).length,
      inactive: allTypes.filter((t) => !t.isActive).length,
      bySystem: {
        quiz: allTypes.filter((t) => t.system === 'quiz').length,
        puzzleGame: allTypes.filter((t) => t.system === 'puzzle-game').length,
      },
      byCategory: {
        quizRegistry: allTypes.filter((t) => t.category === 'quiz-registry').length,
        gamePuzzle: allTypes.filter((t) => t.category === 'game-puzzle').length,
      },
      customTypes: allTypes.filter((t) => t.isCustom).length,
      systemTypes: allTypes.filter((t) => t.isSystem).length,
    };
  } catch (error) {
    console.error('Error calculating puzzle type statistics:', error);
    throw error;
  }
};

/**
 * Initialize default puzzle types in Firestore
 */
export const initializeDefaultPuzzleTypes = async () => {
  try {
    const typesRef = collection(db, 'puzzleTypes');

    // Check if types already exist
    const snapshot = await getDocs(typesRef);
    if (snapshot.size > 0) {
      console.log('Puzzle types already initialized');
      return;
    }

    // Add all default types
    for (const type of ALL_PUZZLE_TYPES) {
      await addDoc(typesRef, type);
    }

    console.log('Successfully initialized default puzzle types');
  } catch (error) {
    console.error('Error initializing default puzzle types:', error);
    throw error;
  }
};

/**
 * Get a specific puzzle type by ID
 */
export const getPuzzleTypeById = async (typeId) => {
  try {
    const allTypes = await getAllPuzzleTypes(false);
    return allTypes.find((t) => t.id === typeId);
  } catch (error) {
    console.error('Error getting puzzle type:', error);
    throw error;
  }
};

/**
 * Check if a type ID is a valid puzzle type
 */
export const isValidPuzzleType = (typeId) => {
  return ALL_PUZZLE_TYPES.some((t) => t.id === typeId);
};

/**
 * Get combined metadata for all puzzle types
 */
export const getPuzzleTypesMetadata = async () => {
  const types = await getAllPuzzleTypes(false);
  return types.map((type) => ({
    id: type.id,
    label: type.label,
    description: type.description,
    category: type.category,
    system: type.system,
    isActive: type.isActive,
    isSystem: type.isSystem,
  }));
};
