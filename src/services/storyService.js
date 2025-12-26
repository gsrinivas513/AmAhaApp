/**
 * Story Service
 * 
 * Manages story-based learning:
 * - Story CRUD operations
 * - Chapter management
 * - Progress tracking
 * - Unlock logic
 * 
 * Firestore Collections Used:
 * - /stories/{storyId}
 * - /stories/{storyId}/chapters/{chapterId}
 * - /story_progress/{userId}
 */

import {
  db
} from '../firebase/firebaseConfig';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  increment
} from 'firebase/firestore';

/**
 * Get story by ID with all chapters
 */
export async function getStory(storyId) {
  try {
    const storyRef = doc(db, 'stories', storyId);
    const storySnap = await getDoc(storyRef);

    if (!storySnap.exists()) {
      return null;
    }

    const storyData = {
      id: storySnap.id,
      ...storySnap.data()
    };

    // Fetch chapters
    storyData.chapters = await getChapters(storyId);

    return storyData;
  } catch (error) {
    console.error('Error fetching story:', error);
    return null;
  }
}

/**
 * Get all published stories
 * Uses simple where clause to avoid Firestore index errors
 */
export async function getAllStories(filters = {}) {
  try {
    // Try to fetch with published filter (no orderBy to avoid index requirement)
    const q = query(
      collection(db, 'stories'),
      where('published', '==', true)
    );

    const querySnapshot = await getDocs(q);
    const stories = [];

    querySnapshot.forEach((doc) => {
      stories.push({
        id: doc.id,
        ...doc.data()
      });
    });

    console.log('[storyService] getAllStories() found', stories.length, 'published stories');
    
    // Sort by createdAt in JavaScript (avoids index requirement)
    stories.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA; // descending order
    });

    return stories;
  } catch (error) {
    console.error('Error fetching stories:', error);
    // Fallback: fetch all stories without filter
    try {
      console.log('[storyService] Falling back to fetching all stories without filter');
      const snapshot = await getDocs(collection(db, 'stories'));
      const stories = [];
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        stories.push({
          id: doc.id,
          ...data
        });
      });
      
      // Filter to only published (or those where published field is not false)
      const published = stories.filter(s => s.published !== false);
      
      console.log('[storyService] Fallback: found', published.length, 'stories');
      return published;
    } catch (fallbackError) {
      console.error('Fallback story fetch failed:', fallbackError);
      return [];
    }
  }
}

/**
 * Get all stories including drafts (admin only)
 */
export async function getAllStoriesAdmin() {
  try {
    const q = query(
      collection(db, 'stories'),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const stories = [];

    for (const docSnap of querySnapshot.docs) {
      const storyData = {
        id: docSnap.id,
        ...docSnap.data()
      };
      
      // Fetch chapter count
      try {
        const chapters = await getChapters(docSnap.id);
        storyData.chapters = chapters;
        storyData.chapterCount = chapters.length;
      } catch (e) {
        storyData.chapters = [];
        storyData.chapterCount = 0;
      }
      
      stories.push(storyData);
    }

    return stories;
  } catch (error) {
    console.error('Error fetching all stories for admin:', error);
    return [];
  }
}

/**
 * Get chapters for a story
 */
export async function getChapters(storyId) {
  try {
    const chaptersRef = collection(db, `stories/${storyId}/chapters`);
    const q = query(chaptersRef, orderBy('order', 'asc'));

    const querySnapshot = await getDocs(q);
    const chapters = [];

    querySnapshot.forEach((doc) => {
      chapters.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return chapters;
  } catch (error) {
    console.error('Error fetching chapters:', error);
    return [];
  }
}

/**
 * Get single chapter
 */
export async function getChapter(storyId, chapterId) {
  try {
    const chapterRef = doc(db, `stories/${storyId}/chapters`, chapterId);
    const chapterSnap = await getDoc(chapterRef);

    if (!chapterSnap.exists()) {
      return null;
    }

    return {
      id: chapterSnap.id,
      ...chapterSnap.data()
    };
  } catch (error) {
    console.error('Error fetching chapter:', error);
    return null;
  }
}

/**
 * Get user's story progress
 */
export async function getStoryProgress(userId, storyId) {
  try {
    const progressRef = doc(db, 'users', userId, 'storyProgress', storyId);
    const progressSnap = await getDoc(progressRef);

    if (!progressSnap.exists()) {
      // Return default progress
      return {
        userId,
        storyId,
        completedChapters: [],
        currentChapter: 1,
        totalXpEarned: 0,
        lastPlayed: null,
        completed: false
      };
    }

    return {
      storyId,
      ...progressSnap.data()
    };
  } catch (error) {
    console.error('Error fetching story progress:', error);
    return null;
  }
}

/**
 * Get all stories user has started
 */
export async function getUserStories(userId) {
  try {
    const storiesRef = collection(db, 'users', userId, 'storyProgress');
    const querySnapshot = await getDocs(storiesRef);

    const userStories = [];
    querySnapshot.forEach((doc) => {
      userStories.push({
        storyId: doc.id,
        ...doc.data()
      });
    });

    return userStories;
  } catch (error) {
    console.error('Error fetching user stories:', error);
    return [];
  }
}

/**
 * Update chapter progress
 * Called after completing chapter quiz/puzzle
 */
export async function completeChapter(userId, storyId, chapterId, score, xpEarned = 100) {
  try {
    const progressRef = doc(db, 'users', userId, 'storyProgress', storyId);
    const progressSnap = await getDoc(progressRef);

    let currentProgress = progressSnap.exists() ? progressSnap.data() : {
      userId,
      storyId,
      completedChapters: [],
      currentChapter: 1,
      totalXpEarned: 0
    };

    // Add chapter if not already completed
    if (!currentProgress.completedChapters.includes(chapterId)) {
      currentProgress.completedChapters.push(chapterId);
      currentProgress.totalXpEarned += xpEarned;
    }

    // Update current chapter
    currentProgress.currentChapter = chapterId;
    currentProgress.lastPlayed = new Date().toISOString();

    // Check if story is complete (all chapters done)
    const story = await getStory(storyId);
    currentProgress.completed = 
      story && currentProgress.completedChapters.length === story.chapters.length;

    // Save progress
    await setDoc(progressRef, currentProgress, { merge: true });

    // Award XP to user
    if (xpEarned > 0) {
      await awardStoryXP(userId, xpEarned);
    }

    return {
      success: true,
      progress: currentProgress,
      xpAwarded: xpEarned
    };
  } catch (error) {
    console.error('Error completing chapter:', error);
    throw error;
  }
}

/**
 * Check if chapter is unlocked for user
 */
export async function isChapterUnlocked(userId, storyId, chapterId) {
  try {
    const chapter = await getChapter(storyId, chapterId);
    if (!chapter) return false;

    // First chapter is always unlocked
    if (chapter.order === 1) return true;

    // Check if previous chapter is completed
    const previousChapter = chapter.order - 1;
    const progress = await getStoryProgress(userId, storyId);

    // Get previous chapter ID
    const chapters = await getChapters(storyId);
    const previousChapterId = chapters.find(c => c.order === previousChapter)?.id;

    if (!previousChapterId) return false;

    return progress.completedChapters.includes(previousChapterId);
  } catch (error) {
    console.error('Error checking chapter unlock:', error);
    return false;
  }
}

/**
 * Get next unlocked chapter
 */
export async function getNextUnlockedChapter(userId, storyId) {
  try {
    const progress = await getStoryProgress(userId, storyId);
    const chapters = await getChapters(storyId);

    if (!chapters || chapters.length === 0) return null;

    // Find next incomplete chapter
    for (const chapter of chapters) {
      if (!progress.completedChapters.includes(chapter.id)) {
        // Check if this chapter is unlocked
        const unlocked = await isChapterUnlocked(userId, storyId, chapter.id);
        if (unlocked) {
          return chapter;
        }
      }
    }

    return null; // All chapters completed or locked
  } catch (error) {
    console.error('Error getting next unlocked chapter:', error);
    return null;
  }
}

/**
 * Create story (admin only)
 */
export async function createStory(storyData) {
  try {
    const storyId = doc(collection(db, 'stories')).id; // Generate ID
    const storyRef = doc(db, 'stories', storyId);

    await setDoc(storyRef, {
      ...storyData,
      id: storyId,
      createdAt: Timestamp.now(),
      published: false,
      chapterCount: 0,
      completionCount: 0
    });

    return {
      success: true,
      storyId
    };
  } catch (error) {
    console.error('Error creating story:', error);
    throw error;
  }
}

/**
 * Update story (admin only)
 */
export async function updateStory(storyId, updates) {
  try {
    const storyRef = doc(db, 'stories', storyId);
    await updateDoc(storyRef, {
      ...updates,
      updatedAt: Timestamp.now()
    });

    return { success: true };
  } catch (error) {
    console.error('Error updating story:', error);
    throw error;
  }
}

/**
 * Publish story (admin only)
 */
export async function publishStory(storyId) {
  try {
    const storyRef = doc(db, 'stories', storyId);
    await updateDoc(storyRef, {
      published: true,
      publishedAt: Timestamp.now()
    });

    return { success: true };
  } catch (error) {
    console.error('Error publishing story:', error);
    throw error;
  }
}

/**
 * Delete story (admin only)
 */
export async function deleteStory(storyId) {
  try {
    // Delete all chapters first
    const chapters = await getChapters(storyId);
    for (const chapter of chapters) {
      const chapterRef = doc(db, `stories/${storyId}/chapters`, chapter.id);
      await deleteDoc(chapterRef);
    }

    // Delete story document
    const storyRef = doc(db, 'stories', storyId);
    await deleteDoc(storyRef);

    return { success: true };
  } catch (error) {
    console.error('Error deleting story:', error);
    throw error;
  }
}

/**
 * Add chapter to story (admin only)
 */
export async function addChapter(storyId, chapterData) {
  try {
    const chapterId = doc(collection(db, `stories/${storyId}/chapters`)).id;
    const chapterRef = doc(db, `stories/${storyId}/chapters`, chapterId);

    // Get next order number
    const chapters = await getChapters(storyId);
    const order = chapters.length + 1;

    await setDoc(chapterRef, {
      ...chapterData,
      id: chapterId,
      storyId,
      order,
      createdAt: Timestamp.now(),
      completionCount: 0
    });

    // Update story chapter count
    const storyRef = doc(db, 'stories', storyId);
    await updateDoc(storyRef, {
      chapterCount: chapters.length + 1
    });

    return {
      success: true,
      chapterId,
      order
    };
  } catch (error) {
    console.error('Error adding chapter:', error);
    throw error;
  }
}

/**
 * Update chapter (admin only)
 */
export async function updateChapter(storyId, chapterId, updates) {
  try {
    const chapterRef = doc(db, `stories/${storyId}/chapters`, chapterId);
    await updateDoc(chapterRef, {
      ...updates,
      updatedAt: Timestamp.now()
    });

    return { success: true };
  } catch (error) {
    console.error('Error updating chapter:', error);
    throw error;
  }
}

/**
 * Delete chapter (admin only)
 */
export async function deleteChapter(storyId, chapterId) {
  try {
    const chapterRef = doc(db, `stories/${storyId}/chapters`, chapterId);
    await deleteDoc(chapterRef);

    // Update story chapter count
    const chapters = await getChapters(storyId);
    const storyRef = doc(db, 'stories', storyId);
    await updateDoc(storyRef, {
      chapterCount: chapters.length - 1
    });

    return { success: true };
  } catch (error) {
    console.error('Error deleting chapter:', error);
    throw error;
  }
}

/**
 * Get story statistics
 */
export async function getStoryStats(storyId) {
  try {
    const story = await getStory(storyId);
    if (!story) return null;

    // Count unique users who started this story
    const progressCollection = collection(db, 'story_progress');
    const q = query(progressCollection, where(storyId, '!=', null));
    const querySnapshot = await getDocs(q);

    return {
      storyId,
      title: story.title,
      totalChapters: story.chapters.length,
      uniqueUsers: querySnapshot.size,
      completionCount: story.completionCount || 0,
      createdAt: story.createdAt,
      published: story.published
    };
  } catch (error) {
    console.error('Error fetching story stats:', error);
    return null;
  }
}

/**
 * Get guest story progress from localStorage
 */
export function getGuestStoryProgress(guestId, storyId) {
  try {
    const progressKey = `story_progress_${storyId}`;
    const data = localStorage.getItem(progressKey);

    if (!data) {
      return {
        storyId,
        completedChapters: [],
        currentChapter: 1,
        completed: false
      };
    }

    return JSON.parse(data);
  } catch (error) {
    console.error('Error fetching guest story progress:', error);
    return {
      storyId,
      completedChapters: [],
      currentChapter: 1,
      completed: false
    };
  }
}

/**
 * Save guest story progress to localStorage
 */
export function saveGuestStoryProgress(guestId, storyId, chapterId) {
  try {
    const progressKey = `story_progress_${storyId}`;
    const progress = getGuestStoryProgress(guestId, storyId);

    if (!progress.completedChapters.includes(chapterId)) {
      progress.completedChapters.push(chapterId);
    }
    progress.currentChapter = chapterId;

    localStorage.setItem(progressKey, JSON.stringify(progress));

    return { success: true };
  } catch (error) {
    console.error('Error saving guest story progress:', error);
    return { success: false };
  }
}

/**
 * Merge guest story progress to user on login
 */
export async function mergeGuestStoryProgressToUser(userId, guestId, storyIds = []) {
  try {
    for (const storyId of storyIds) {
      const guestProgress = getGuestStoryProgress(guestId, storyId);

      if (guestProgress.completedChapters.length > 0) {
        // Migrate to user
        const progressRef = doc(db, 'users', userId, 'storyProgress', storyId);
        const userProgress = await getStoryProgress(userId, storyId);

        const mergedCompletions = [
          ...new Set([
            ...userProgress.completedChapters,
            ...guestProgress.completedChapters
          ])
        ];

        await setDoc(progressRef, {
          userId,
          storyId,
          completedChapters: mergedCompletions,
          currentChapter: Math.max(
            userProgress.currentChapter || 1,
            guestProgress.currentChapter || 1
          ),
          migratedFromGuest: true
        }, { merge: true });
      }
    }

    // Clear guest data
    for (const storyId of storyIds) {
      localStorage.removeItem(`story_progress_${storyId}`);
    }

    return { success: true };
  } catch (error) {
    console.error('Error merging guest story progress:', error);
    throw error;
  }
}

/**
 * Award XP for story completion
 */
async function awardStoryXP(userId, xp) {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      totalXp: increment(xp),
      storyXpEarned: increment(xp)
    });
  } catch (error) {
    console.error('Error awarding story XP:', error);
  }
}
