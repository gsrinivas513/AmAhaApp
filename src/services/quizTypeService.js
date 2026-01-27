import { db } from '../firebase/firebaseConfig';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { QUIZ_TYPE_PLUGINS } from '../quizzes/registry/quizTypeRegistry';

const COLLECTION_NAME = 'quiz_types';

/**
 * Initialize default quiz types in Firestore from registry
 */
export const initializeDefaultTypes = async () => {
  try {
    const typesRef = collection(db, COLLECTION_NAME);
    const snapshot = await getDocs(typesRef);

    // If types already exist, don't reinitialize
    if (snapshot.size > 0) {
      return snapshot.docs.map((doc) => doc.data());
    }

    // Create default types from registry
    const defaultTypes = Object.values(QUIZ_TYPE_PLUGINS).map((plugin) => ({
      id: plugin.id,
      label: plugin.label,
      description: plugin.description,
      category: plugin.category,
      complexity: plugin.complexity,
      inputType: plugin.inputType,
      evaluationType: plugin.evaluationType,
      supportsMedia: plugin.supportsMedia,
      defaultPoints: plugin.defaultPoints,
      template: plugin.template,
      isActive: true,
      isSystem: true, // Mark as system default
      createdBy: 'system',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      metadata: {
        usageCount: 0,
        icon: getIconForType(plugin.id),
        color: getColorForType(plugin.id),
      },
    }));

    const created = [];
    for (const typeData of defaultTypes) {
      const docRef = await addDoc(typesRef, typeData);
      created.push({ id: docRef.id, ...typeData });
    }

    return created;
  } catch (error) {
    console.error('Error initializing default types:', error);
    throw error;
  }
};

/**
 * Get all quiz types - with fallback to registry if Firestore unavailable
 */
export const getAllQuizTypes = async (onlyActive = true) => {
  try {
    const typesRef = collection(db, COLLECTION_NAME);
    let q = onlyActive
      ? query(typesRef, where('isActive', '==', true), orderBy('category'), orderBy('label'))
      : query(typesRef, orderBy('category'), orderBy('label'));

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      docId: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.warn('Firestore unavailable, falling back to registry:', error);
    // Fallback to registry
    const fallbackTypes = Object.values(QUIZ_TYPE_PLUGINS).map((plugin) => ({
      docId: plugin.id,
      id: plugin.id,
      label: plugin.label,
      description: plugin.description,
      category: plugin.category,
      complexity: plugin.complexity,
      inputType: plugin.inputType,
      evaluationType: plugin.evaluationType,
      supportsMedia: plugin.supportsMedia,
      defaultPoints: plugin.defaultPoints,
      template: plugin.template,
      isActive: true,
      isSystem: true,
      metadata: {
        usageCount: 0,
        icon: getIconForType(plugin.id),
        color: getColorForType(plugin.id),
      },
    }));
    return fallbackTypes;
  }
};

/**
 * Get quiz types by category
 */
export const getQuizTypesByCategory = async (category) => {
  try {
    const typesRef = collection(db, COLLECTION_NAME);
    const q = query(
      typesRef,
      where('category', '==', category),
      where('isActive', '==', true),
      orderBy('label')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      docId: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error(`Error fetching ${category} quiz types:`, error);
    throw error;
  }
};

/**
 * Get single quiz type by ID
 */
export const getQuizTypeById = async (typeId) => {
  try {
    const typesRef = collection(db, COLLECTION_NAME);
    const q = query(typesRef, where('id', '==', typeId));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    return {
      docId: doc.id,
      ...doc.data(),
    };
  } catch (error) {
    console.error(`Error fetching quiz type ${typeId}:`, error);
    throw error;
  }
};

/**
 * Create new quiz type
 */
export const createQuizType = async (typeData, userId) => {
  try {
    const typesRef = collection(db, COLLECTION_NAME);

    const newType = {
      ...typeData,
      isActive: true,
      isSystem: false,
      createdBy: userId,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      metadata: {
        usageCount: 0,
        icon: typeData.metadata?.icon || getIconForType(typeData.id),
        color: typeData.metadata?.color || getColorForType(typeData.id),
        ...typeData.metadata,
      },
    };

    const docRef = await addDoc(typesRef, newType);
    return {
      docId: docRef.id,
      ...newType,
    };
  } catch (error) {
    console.error('Error creating quiz type:', error);
    throw error;
  }
};

/**
 * Update quiz type
 */
export const updateQuizType = async (docId, updates, userId) => {
  try {
    const typeRef = doc(db, COLLECTION_NAME, docId);

    const updateData = {
      ...updates,
      updatedAt: Timestamp.now(),
      updatedBy: userId,
    };

    await updateDoc(typeRef, updateData);

    const updated = await getDoc(typeRef);
    return {
      docId: updated.id,
      ...updated.data(),
    };
  } catch (error) {
    console.error('Error updating quiz type:', error);
    throw error;
  }
};

/**
 * Soft delete quiz type (set isActive to false)
 */
export const deactivateQuizType = async (docId, userId) => {
  try {
    return await updateQuizType(
      docId,
      {
        isActive: false,
        deactivatedBy: userId,
        deactivatedAt: Timestamp.now(),
      },
      userId
    );
  } catch (error) {
    console.error('Error deactivating quiz type:', error);
    throw error;
  }
};

/**
 * Hard delete quiz type
 */
export const deleteQuizType = async (docId) => {
  try {
    const typeRef = doc(db, COLLECTION_NAME, docId);
    await deleteDoc(typeRef);
    return true;
  } catch (error) {
    console.error('Error deleting quiz type:', error);
    throw error;
  }
};

/**
 * Increment usage count for a type
 */
export const incrementTypeUsage = async (typeId) => {
  try {
    const typeData = await getQuizTypeById(typeId);
    if (typeData) {
      await updateQuizType(typeData.docId, {
        'metadata.usageCount': (typeData.metadata?.usageCount || 0) + 1,
      });
    }
  } catch (error) {
    console.error('Error incrementing type usage:', error);
  }
};

/**
 * Get type statistics
 */
export const getTypeStatistics = async () => {
  try {
    const types = await getAllQuizTypes(false);

    const stats = {
      total: types.length,
      active: types.filter((t) => t.isActive).length,
      byCategory: {},
      byComplexity: {},
      mostUsed: [],
    };

    types.forEach((type) => {
      // Category stats
      if (!stats.byCategory[type.category]) {
        stats.byCategory[type.category] = 0;
      }
      stats.byCategory[type.category]++;

      // Complexity stats
      if (!stats.byComplexity[type.complexity]) {
        stats.byComplexity[type.complexity] = 0;
      }
      stats.byComplexity[type.complexity]++;
    });

    // Most used types
    stats.mostUsed = types
      .filter((t) => t.isActive)
      .sort((a, b) => (b.metadata?.usageCount || 0) - (a.metadata?.usageCount || 0))
      .slice(0, 5);

    return stats;
  } catch (error) {
    console.warn('Error fetching type statistics, using defaults:', error);
    // Return default stats from registry
    const types = Object.values(QUIZ_TYPE_PLUGINS);
    const stats = {
      total: types.length,
      active: types.length,
      byCategory: {},
      byComplexity: {},
      mostUsed: [],
    };

    types.forEach((plugin) => {
      if (!stats.byCategory[plugin.category]) {
        stats.byCategory[plugin.category] = 0;
      }
      stats.byCategory[plugin.category]++;

      if (!stats.byComplexity[plugin.complexity]) {
        stats.byComplexity[plugin.complexity] = 0;
      }
      stats.byComplexity[plugin.complexity]++;
    });

    return stats;
  }
};

/**
 * Helper: Get icon for type
 */
const getIconForType = (typeId) => {
  const icons = {
    MCQ: '◉',
    MULTI_SELECT: '☑',
    TRUE_FALSE: '✓✗',
    FILL_BLANK: '___',
    MATCHING: '↔',
    ORDERING: '↑↓',
    DRAG_DROP: '⊡⊙',
    CODING: '< >',
    IMAGE_BASED: '🖼',
    PUZZLE: '🧩',
    AUDIO_BASED: '🔊',
    CROSSWORD: '◻',
    WORD_SEARCH: '🔍',
    SUDOKU: '9',
  };
  return icons[typeId] || '?';
};

/**
 * Helper: Get color for type
 */
const getColorForType = (typeId) => {
  const colors = {
    MCQ: '#007AFF',
    MULTI_SELECT: '#5AC8FA',
    TRUE_FALSE: '#FF3B30',
    FILL_BLANK: '#FF9500',
    MATCHING: '#34C759',
    ORDERING: '#00C7BE',
    DRAG_DROP: '#30B0C0',
    CODING: '#5856D6',
    IMAGE_BASED: '#FF2D55',
    PUZZLE: '#A2845E',
    AUDIO_BASED: '#FFB340',
    CROSSWORD: '#4ECB71',
    WORD_SEARCH: '#50E3C2',
    SUDOKU: '#B8860B',
  };
  return colors[typeId] || '#999';
};
