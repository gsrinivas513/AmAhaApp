import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

/**
 * Count puzzles for a specific topic
 */
export const countPuzzlesForTopic = async (topicId, topicName) => {
  try {
    const puzzlesSnap = await getDocs(collection(db, 'puzzles'));
    const count = puzzlesSnap.docs.filter(doc => {
      const data = doc.data();
      return (
        data.topic === topicId || 
        data.topic === topicName ||
        data.type === topicId ||
        data.type === topicName
      ) && data.isPublished !== false;
    }).length;
    return count;
  } catch (error) {
    console.error('Error counting puzzles for topic:', error);
    return 0;
  }
};

/**
 * Count puzzles for a specific category
 */
export const countPuzzlesForCategory = async (categoryId, categoryName) => {
  try {
    const puzzlesSnap = await getDocs(collection(db, 'puzzles'));
    const count = puzzlesSnap.docs.filter(doc => {
      const data = doc.data();
      return (
        data.category === categoryId ||
        data.category === categoryName
      ) && data.isPublished !== false;
    }).length;
    return count;
  } catch (error) {
    console.error('Error counting puzzles for category:', error);
    return 0;
  }
};

/**
 * Get all puzzles for a category
 */
export const getPuzzlesForCategory = async (categoryId, categoryName) => {
  try {
    const puzzlesSnap = await getDocs(collection(db, 'puzzles'));
    return puzzlesSnap.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(puzzle => {
        return (
          puzzle.category === categoryId ||
          puzzle.category === categoryName
        ) && puzzle.isPublished !== false;
      });
  } catch (error) {
    console.error('Error getting puzzles for category:', error);
    return [];
  }
};

/**
 * Get all puzzles for a topic
 */
export const getPuzzlesForTopic = async (topicId, topicName) => {
  try {
    const puzzlesSnap = await getDocs(collection(db, 'puzzles'));
    return puzzlesSnap.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(puzzle => {
        return (
          puzzle.topic === topicId ||
          puzzle.topic === topicName ||
          puzzle.type === topicId ||
          puzzle.type === topicName
        ) && puzzle.isPublished !== false;
      });
  } catch (error) {
    console.error('Error getting puzzles for topic:', error);
    return [];
  }
};

/**
 * Count all puzzles
 */
export const countAllPuzzles = async () => {
  try {
    const puzzlesSnap = await getDocs(collection(db, 'puzzles'));
    return puzzlesSnap.docs.filter(doc => doc.data().isPublished !== false).length;
  } catch (error) {
    console.error('Error counting all puzzles:', error);
    return 0;
  }
};
