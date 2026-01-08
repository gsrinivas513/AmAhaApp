// src/services/seriesService.js
// Service for managing puzzle series (collections of puzzles)

import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

const SERIES_COLLECTION = 'series';

/**
 * Create a new puzzle series
 */
export const createSeries = async (seriesData) => {
  try {
    const docRef = await addDoc(collection(db, SERIES_COLLECTION), {
      ...seriesData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      puzzleCount: 0,
    });
    return { id: docRef.id, ...seriesData };
  } catch (error) {
    console.error('Error creating series:', error);
    throw error;
  }
};

/**
 * Get a series by ID
 */
export const getSeriesById = async (seriesId) => {
  try {
    const docRef = doc(db, SERIES_COLLECTION, seriesId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error('Error fetching series:', error);
    throw error;
  }
};

/**
 * Get all series
 */
export const getAllSeries = async () => {
  try {
    const q = query(collection(db, SERIES_COLLECTION), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error fetching series:', error);
    throw error;
  }
};

/**
 * Get series by owner/creator
 */
export const getSeriesByOwner = async (userId) => {
  try {
    const q = query(
      collection(db, SERIES_COLLECTION),
      where('owner', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error fetching user series:', error);
    throw error;
  }
};

/**
 * Update series
 */
export const updateSeries = async (seriesId, updates) => {
  try {
    const docRef = doc(db, SERIES_COLLECTION, seriesId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
    return { id: seriesId, ...updates };
  } catch (error) {
    console.error('Error updating series:', error);
    throw error;
  }
};

/**
 * Delete series
 */
export const deleteSeries = async (seriesId) => {
  try {
    await deleteDoc(doc(db, SERIES_COLLECTION, seriesId));
    return true;
  } catch (error) {
    console.error('Error deleting series:', error);
    throw error;
  }
};

/**
 * Add puzzle to series
 */
export const addPuzzleToSeries = async (seriesId, puzzleId) => {
  try {
    const seriesRef = doc(db, SERIES_COLLECTION, seriesId);
    const series = await getSeriesById(seriesId);
    
    // Add to puzzles array if it doesn't already exist
    const puzzles = series.puzzles || [];
    if (!puzzles.includes(puzzleId)) {
      puzzles.push(puzzleId);
      await updateDoc(seriesRef, {
        puzzles,
        puzzleCount: puzzles.length,
        updatedAt: serverTimestamp(),
      });
    }
    return true;
  } catch (error) {
    console.error('Error adding puzzle to series:', error);
    throw error;
  }
};

/**
 * Remove puzzle from series
 */
export const removePuzzleFromSeries = async (seriesId, puzzleId) => {
  try {
    const seriesRef = doc(db, SERIES_COLLECTION, seriesId);
    const series = await getSeriesById(seriesId);
    
    const puzzles = (series.puzzles || []).filter((id) => id !== puzzleId);
    await updateDoc(seriesRef, {
      puzzles,
      puzzleCount: puzzles.length,
      updatedAt: serverTimestamp(),
    });
    return true;
  } catch (error) {
    console.error('Error removing puzzle from series:', error);
    throw error;
  }
};

/**
 * Get all puzzles in a series
 */
export const getSeriesPuzzles = async (seriesId) => {
  try {
    const series = await getSeriesById(seriesId);
    if (!series || !series.puzzles) {
      return [];
    }

    // Fetch all puzzles (from both quizzes and visual_puzzles)
    const allPuzzles = [];
    
    // Get quiz puzzles
    const quizzes = await getDocs(
      query(collection(db, 'quizzes'), where('id', 'in', series.puzzles))
    );
    quizzes.docs.forEach((doc) => {
      allPuzzles.push({ id: doc.id, type: 'quiz', ...doc.data() });
    });

    // Get visual puzzles
    const visualPuzzles = await getDocs(
      query(collection(db, 'visual_puzzles'), where('id', 'in', series.puzzles))
    );
    visualPuzzles.docs.forEach((doc) => {
      allPuzzles.push({ id: doc.id, type: 'visual', ...doc.data() });
    });

    return allPuzzles;
  } catch (error) {
    console.error('Error fetching series puzzles:', error);
    throw error;
  }
};

/**
 * Reorder puzzles in series
 */
export const reorderSeriesPuzzles = async (seriesId, puzzleIds) => {
  try {
    const seriesRef = doc(db, SERIES_COLLECTION, seriesId);
    await updateDoc(seriesRef, {
      puzzles: puzzleIds,
      updatedAt: serverTimestamp(),
    });
    return true;
  } catch (error) {
    console.error('Error reordering puzzles:', error);
    throw error;
  }
};

/**
 * Get published series (public)
 */
export const getPublishedSeries = async () => {
  try {
    const q = query(
      collection(db, SERIES_COLLECTION),
      where('published', '==', true),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error fetching published series:', error);
    throw error;
  }
};
