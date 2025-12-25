import { 
  db, 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  addDoc,
  updateDoc, 
  query, 
  where,
  orderBy,
  increment
} from '../../firebase/firebaseConfig';

// Story CRUD Operations
export async function createStory(storyData) {
  try {
    const storyRef = collection(db, 'stories');
    const newStory = {
      ...storyData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      published: false,
      stats: { 
        usersStarted: 0, 
        usersCompleted: 0, 
        avgScore: 0,
        totalReviews: 0
      }
    };
    const docRef = await addDoc(storyRef, newStory);
    return docRef.id;
  } catch (error) {
    console.error('Error creating story:', error);
    throw error;
  }
}

export async function getStory(storyId) {
  try {
    const storyRef = doc(db, 'stories', storyId);
    const snap = await getDoc(storyRef);
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
  } catch (error) {
    console.error('Error fetching story:', error);
    throw error;
  }
}

export async function updateStory(storyId, updates) {
  try {
    const storyRef = doc(db, 'stories', storyId);
    await updateDoc(storyRef, {
      ...updates,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating story:', error);
    throw error;
  }
}

export async function deleteStory(storyId) {
  try {
    const storyRef = doc(db, 'stories', storyId);
    await updateDoc(storyRef, {
      published: false,
      deletedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error deleting story:', error);
    throw error;
  }
}

export async function getAllPublishedStories(limit = 50) {
  try {
    const q = query(
      collection(db, 'stories'),
      where('published', '==', true),
      orderBy('createdAt', 'desc')
    );
    const snap = await getDocs(q);
    return snap.docs.slice(0, limit).map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    }));
  } catch (error) {
    console.error('Error fetching published stories:', error);
    throw error;
  }
}

export async function getStoriesByCategory(category, limit = 50) {
  try {
    const q = query(
      collection(db, 'stories'),
      where('category', '==', category),
      where('published', '==', true),
      orderBy('createdAt', 'desc')
    );
    const snap = await getDocs(q);
    return snap.docs.slice(0, limit).map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    }));
  } catch (error) {
    console.error('Error fetching stories by category:', error);
    throw error;
  }
}

export async function publishStory(storyId) {
  try {
    await updateStory(storyId, { published: true });
  } catch (error) {
    console.error('Error publishing story:', error);
    throw error;
  }
}

// User Story Progress
export async function startStory(userId, storyId) {
  try {
    const progressRef = doc(
      db,
      'user_story_progress',
      userId,
      'stories',
      storyId
    );
    
    const snap = await getDoc(progressRef);
    if (snap.exists()) return snap.data();

    const progress = {
      storyId,
      userId,
      startedAt: new Date().toISOString(),
      lastAccessedAt: new Date().toISOString(),
      currentChapter: 0,
      completedChapters: [],
      chapterProgress: {},
      overallScore: 0,
      totalRetries: 0,
      totalHintsUsed: 0,
      estimatedTimeSpent: 0,
      certificate: { 
        earned: false,
        earnedAt: null
      },
      isActive: true,
      isLocked: false,
      lockReason: null
    };

    await setDoc(progressRef, progress);

    // Update story stats
    await updateDoc(doc(db, 'stories', storyId), {
      'stats.usersStarted': increment(1)
    });

    return progress;
  } catch (error) {
    console.error('Error starting story:', error);
    throw error;
  }
}

export async function getUserStoryProgress(userId, storyId) {
  try {
    const progressRef = doc(
      db,
      'user_story_progress',
      userId,
      'stories',
      storyId
    );
    const snap = await getDoc(progressRef);
    return snap.exists() ? snap.data() : null;
  } catch (error) {
    console.error('Error fetching user story progress:', error);
    throw error;
  }
}

export async function updateChapterProgress(userId, storyId, chapterIndex, chapterData) {
  try {
    const progressRef = doc(
      db,
      'user_story_progress',
      userId,
      'stories',
      storyId
    );

    const snap = await getDoc(progressRef);
    if (!snap.exists()) {
      throw new Error('Story progress not found');
    }

    const progress = snap.data();

    // Update chapter progress
    const updated = {
      ...progress,
      chapterProgress: {
        ...progress.chapterProgress,
        [chapterIndex]: {
          ...chapterData,
          completedAt: new Date().toISOString()
        }
      },
      completedChapters: [...new Set([...progress.completedChapters, chapterIndex])],
      currentChapter: Math.min(chapterIndex + 1, progress.currentChapter + 1),
      lastAccessedAt: new Date().toISOString(),
      totalRetries: progress.totalRetries + (chapterData.retryCount || 0),
      totalHintsUsed: progress.totalHintsUsed + (chapterData.hintsUsed || 0)
    };

    // Recalculate overall score
    const scores = Object.values(updated.chapterProgress).map(ch => ch.score || 0);
    updated.overallScore = scores.length > 0 
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : 0;

    await updateDoc(progressRef, updated);
    return updated;
  } catch (error) {
    console.error('Error updating chapter progress:', error);
    throw error;
  }
}

export async function completeStory(userId, storyId) {
  try {
    const progressRef = doc(
      db,
      'user_story_progress',
      userId,
      'stories',
      storyId
    );

    const snap = await getDoc(progressRef);
    const progress = snap.data();

    const completed = {
      completedAt: new Date().toISOString(),
      'certificate.earned': true,
      'certificate.earnedAt': new Date().toISOString(),
      isActive: false
    };

    await updateDoc(progressRef, completed);

    // Update story stats
    await updateDoc(doc(db, 'stories', storyId), {
      'stats.usersCompleted': increment(1),
      'stats.avgScore': progress.overallScore
    });

    return true;
  } catch (error) {
    console.error('Error completing story:', error);
    throw error;
  }
}

export async function getUserStories(userId, filter = 'all') {
  try {
    const collectionRef = collection(
      db,
      'user_story_progress',
      userId,
      'stories'
    );
    const snap = await getDocs(collectionRef);
    let stories = snap.docs.map(doc => doc.data());

    // Filter based on status
    if (filter === 'started') {
      stories = stories.filter(s => s.startedAt && !s.completedAt);
    } else if (filter === 'completed') {
      stories = stories.filter(s => s.completedAt);
    }

    return stories.sort((a, b) => 
      new Date(b.lastAccessedAt) - new Date(a.lastAccessedAt)
    );
  } catch (error) {
    console.error('Error fetching user stories:', error);
    throw error;
  }
}

// Helper functions
export function canProceedToNextChapter(progress, chapterIndex, storyData) {
  const chapter = progress.chapterProgress[chapterIndex];
  if (!chapter) return false;

  const unlockRules = storyData.chapters[chapterIndex]?.unlockRules;
  if (!unlockRules) return true;

  return chapter.score >= unlockRules.minScore;
}

export function getRemainingChapters(progress, storyData) {
  return storyData.chapters.length - progress.completedChapters.length;
}

export function getProgressPercentage(progress, totalChapters) {
  return Math.round((progress.completedChapters.length / totalChapters) * 100);
}

export function getChapterHint(hints, used = 0) {
  if (!hints || used >= hints.length) return null;
  return hints[used];
}

export async function recordChapterAttempt(userId, storyId, chapterIndex, score) {
  try {
    const progress = await getUserStoryProgress(userId, storyId);
    const currentChapterProgress = progress.chapterProgress[chapterIndex] || {};
    
    const updatedChapterProgress = {
      startedAt: currentChapterProgress.startedAt || new Date().toISOString(),
      score: score,
      retryCount: (currentChapterProgress.retryCount || 0) + 1,
      items: currentChapterProgress.items || {}
    };

    await updateChapterProgress(userId, storyId, chapterIndex, updatedChapterProgress);
    return true;
  } catch (error) {
    console.error('Error recording chapter attempt:', error);
    throw error;
  }
}
