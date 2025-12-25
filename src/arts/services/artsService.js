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
  limit,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../../firebase';

/**
 * Arts Service - Creative projects, submissions, and gallery
 * Users can create, share, and collaborate on creative works
 */

// ===== PROJECT CRUD OPERATIONS =====

/**
 * Create a new art project
 * @param {Object} projectData - { title, description, category, creator, type, image, tags }
 */
export async function createArtProject(projectData) {
  try {
    const project = {
      title: projectData.title,
      description: projectData.description,
      category: projectData.category, // 'painting', 'drawing', 'sculpture', 'digital', 'photography', 'music', 'writing'
      type: projectData.type, // 'solo', 'collaboration', 'prompt-based'
      creator: projectData.creator, // userId
      creatorName: projectData.creatorName || 'Unknown Artist',
      image: projectData.image,
      mediaUrls: projectData.mediaUrls || [], // array of file URLs
      tags: projectData.tags || [],
      likes: 0,
      comments: 0,
      shares: 0,
      views: 0,
      published: false,
      featured: false,
      rating: 0,
      ratingCount: 0,
      collaborators: projectData.collaborators || [],
      visibility: projectData.visibility || 'private', // 'private', 'unlisted', 'public'
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      techUsed: projectData.techUsed || [],
      duration: projectData.duration || null, // project completion time in hours
      materials: projectData.materials || [],
      inspirations: projectData.inspirations || [],
    };

    const projectsRef = collection(db, 'arts_projects');
    const docRef = await addDoc(projectsRef, project);
    return { id: docRef.id, ...project };
  } catch (error) {
    console.error('Error creating art project:', error);
    throw error;
  }
}

/**
 * Get a single art project by ID
 */
export async function getArtProject(projectId) {
  try {
    const docRef = doc(db, 'arts_projects', projectId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    // Increment view count
    await updateDoc(docRef, {
      views: (docSnap.data().views || 0) + 1,
    });

    return { id: docSnap.id, ...docSnap.data() };
  } catch (error) {
    console.error('Error getting art project:', error);
    throw error;
  }
}

/**
 * Update art project details
 */
export async function updateArtProject(projectId, updates) {
  try {
    const docRef = doc(db, 'arts_projects', projectId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
    return { id: projectId, ...updates };
  } catch (error) {
    console.error('Error updating art project:', error);
    throw error;
  }
}

/**
 * Delete an art project
 */
export async function deleteArtProject(projectId) {
  try {
    const docRef = doc(db, 'arts_projects', projectId);
    await deleteDoc(docRef);

    // Delete associated comments and likes
    const commentsRef = collection(db, 'arts_comments');
    const likesRef = collection(db, 'arts_likes');

    const commentsQuery = query(commentsRef, where('projectId', '==', projectId));
    const likesQuery = query(likesRef, where('projectId', '==', projectId));

    const commentsDocs = await getDocs(commentsQuery);
    const likesDocs = await getDocs(likesQuery);

    commentsDocs.forEach(async (doc) => await deleteDoc(doc.ref));
    likesDocs.forEach(async (doc) => await deleteDoc(doc.ref));

    return true;
  } catch (error) {
    console.error('Error deleting art project:', error);
    throw error;
  }
}

/**
 * Publish/unpublish an art project
 */
export async function publishArtProject(projectId, published) {
  try {
    return updateArtProject(projectId, {
      published,
      visibility: published ? 'public' : 'private',
      publishedAt: published ? serverTimestamp() : null,
    });
  } catch (error) {
    console.error('Error publishing art project:', error);
    throw error;
  }
}

// ===== PROJECT QUERIES =====

/**
 * Get all published art projects
 */
export async function getAllPublishedArtProjects(pageSize = 20) {
  try {
    const q = query(
      collection(db, 'arts_projects'),
      where('published', '==', true),
      where('visibility', '==', 'public'),
      orderBy('likes', 'desc'),
      limit(pageSize)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error fetching published art projects:', error);
    throw error;
  }
}

/**
 * Get art projects by category
 */
export async function getArtProjectsByCategory(category) {
  try {
    const q = query(
      collection(db, 'arts_projects'),
      where('category', '==', category),
      where('published', '==', true),
      where('visibility', '==', 'public'),
      orderBy('likes', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error fetching art projects by category:', error);
    throw error;
  }
}

/**
 * Get art projects by creator
 */
export async function getArtProjectsByCreator(creatorId) {
  try {
    const q = query(
      collection(db, 'arts_projects'),
      where('creator', '==', creatorId),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error fetching creator art projects:', error);
    throw error;
  }
}

/**
 * Get trending art projects (by likes + views)
 */
export async function getTrendingArtProjects(limit_count = 10) {
  try {
    const q = query(
      collection(db, 'arts_projects'),
      where('published', '==', true),
      where('visibility', '==', 'public'),
      orderBy('likes', 'desc'),
      limit(limit_count)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error fetching trending art projects:', error);
    throw error;
  }
}

/**
 * Get featured art projects
 */
export async function getFeaturedArtProjects() {
  try {
    const q = query(
      collection(db, 'arts_projects'),
      where('featured', '==', true),
      where('published', '==', true),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error fetching featured art projects:', error);
    throw error;
  }
}

/**
 * Search art projects by title or tags
 */
export async function searchArtProjects(searchTerm) {
  try {
    const q = query(
      collection(db, 'arts_projects'),
      where('published', '==', true),
      where('visibility', '==', 'public')
    );

    const querySnapshot = await getDocs(q);
    const allProjects = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const term = searchTerm.toLowerCase();
    return allProjects.filter((project) => {
      return (
        project.title.toLowerCase().includes(term) ||
        project.description.toLowerCase().includes(term) ||
        (project.tags && project.tags.some((tag) => tag.toLowerCase().includes(term)))
      );
    });
  } catch (error) {
    console.error('Error searching art projects:', error);
    throw error;
  }
}

// ===== INTERACTIONS =====

/**
 * Like an art project
 */
export async function likeArtProject(projectId, userId) {
  try {
    // Check if already liked
    const q = query(
      collection(db, 'arts_likes'),
      where('projectId', '==', projectId),
      where('userId', '==', userId)
    );

    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return false; // Already liked
    }

    // Add like
    const likeData = {
      projectId,
      userId,
      createdAt: serverTimestamp(),
    };

    await addDoc(collection(db, 'arts_likes'), likeData);

    // Update project like count
    const projectRef = doc(db, 'arts_projects', projectId);
    const projectSnap = await getDoc(projectRef);
    await updateDoc(projectRef, {
      likes: (projectSnap.data().likes || 0) + 1,
    });

    return true;
  } catch (error) {
    console.error('Error liking art project:', error);
    throw error;
  }
}

/**
 * Unlike an art project
 */
export async function unlikeArtProject(projectId, userId) {
  try {
    const q = query(
      collection(db, 'arts_likes'),
      where('projectId', '==', projectId),
      where('userId', '==', userId)
    );

    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      return false; // Not liked
    }

    // Remove like
    await deleteDoc(querySnapshot.docs[0].ref);

    // Update project like count
    const projectRef = doc(db, 'arts_projects', projectId);
    const projectSnap = await getDoc(projectRef);
    await updateDoc(projectRef, {
      likes: Math.max(0, (projectSnap.data().likes || 0) - 1),
    });

    return true;
  } catch (error) {
    console.error('Error unliking art project:', error);
    throw error;
  }
}

/**
 * Add comment to art project
 */
export async function commentOnArtProject(projectId, userId, userName, content) {
  try {
    const commentData = {
      projectId,
      userId,
      userName,
      content,
      likes: 0,
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, 'arts_comments'), commentData);

    // Update project comment count
    const projectRef = doc(db, 'arts_projects', projectId);
    const projectSnap = await getDoc(projectRef);
    await updateDoc(projectRef, {
      comments: (projectSnap.data().comments || 0) + 1,
    });

    return { id: docRef.id, ...commentData };
  } catch (error) {
    console.error('Error commenting on art project:', error);
    throw error;
  }
}

/**
 * Get comments for an art project
 */
export async function getArtProjectComments(projectId) {
  try {
    const q = query(
      collection(db, 'arts_comments'),
      where('projectId', '==', projectId),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error fetching art project comments:', error);
    throw error;
  }
}

/**
 * Rate an art project
 */
export async function rateArtProject(projectId, userId, rating) {
  try {
    // Check if already rated
    const q = query(
      collection(db, 'arts_ratings'),
      where('projectId', '==', projectId),
      where('userId', '==', userId)
    );

    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      // Update existing rating
      await updateDoc(querySnapshot.docs[0].ref, { rating });
    } else {
      // Create new rating
      await addDoc(collection(db, 'arts_ratings'), {
        projectId,
        userId,
        rating,
        createdAt: serverTimestamp(),
      });
    }

    // Recalculate average rating
    const ratingsQuery = query(collection(db, 'arts_ratings'), where('projectId', '==', projectId));
    const ratingsDocs = await getDocs(ratingsQuery);
    const ratings = ratingsDocs.docs.map((doc) => doc.data().rating);
    const averageRating = ratings.reduce((a, b) => a + b, 0) / ratings.length;

    const projectRef = doc(db, 'arts_projects', projectId);
    await updateDoc(projectRef, {
      rating: Math.round(averageRating * 10) / 10,
      ratingCount: ratings.length,
    });

    return { rating, averageRating };
  } catch (error) {
    console.error('Error rating art project:', error);
    throw error;
  }
}

// ===== COLLABORATIONS =====

/**
 * Add collaborator to a project
 */
export async function addCollaboratorToProject(projectId, collaboratorId, role = 'editor') {
  try {
    const projectRef = doc(db, 'arts_projects', projectId);
    const projectSnap = await getDoc(projectRef);
    const collaborators = projectSnap.data().collaborators || [];

    if (collaborators.some((c) => c.userId === collaboratorId)) {
      return false; // Already a collaborator
    }

    collaborators.push({
      userId: collaboratorId,
      role,
      joinedAt: new Date().toISOString(),
    });

    await updateDoc(projectRef, { collaborators });
    return true;
  } catch (error) {
    console.error('Error adding collaborator:', error);
    throw error;
  }
}

/**
 * Remove collaborator from project
 */
export async function removeCollaboratorFromProject(projectId, collaboratorId) {
  try {
    const projectRef = doc(db, 'arts_projects', projectId);
    const projectSnap = await getDoc(projectRef);
    const collaborators = projectSnap.data().collaborators || [];

    const updatedCollaborators = collaborators.filter((c) => c.userId !== collaboratorId);
    await updateDoc(projectRef, { collaborators: updatedCollaborators });

    return true;
  } catch (error) {
    console.error('Error removing collaborator:', error);
    throw error;
  }
}

/**
 * Get user's art projects (including collaborated)
 */
export async function getUserArtProjects(userId) {
  try {
    const createdQuery = query(
      collection(db, 'arts_projects'),
      where('creator', '==', userId)
    );

    const createdSnap = await getDocs(createdQuery);
    const createdProjects = createdSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      collaborationRole: 'creator',
    }));

    // Get collaborated projects
    const allProjects = await getDocs(collection(db, 'arts_projects'));
    const collaboratedProjects = allProjects.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .filter((project) => {
        const collab = project.collaborators?.find((c) => c.userId === userId);
        return collab ? { ...project, collaborationRole: collab.role } : null;
      })
      .filter(Boolean);

    return [...createdProjects, ...collaboratedProjects];
  } catch (error) {
    console.error('Error fetching user art projects:', error);
    throw error;
  }
}

// ===== ACHIEVEMENTS & BADGES =====

/**
 * Award achievement for art activity
 */
export async function awardArtAchievement(userId, achievementType) {
  try {
    const achievementData = {
      userId,
      type: achievementType, // 'first_project', 'artist_debut', 'gallery_featured', 'collaboration_master'
      unlockedAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, 'art_achievements'), achievementData);
    return { id: docRef.id, ...achievementData };
  } catch (error) {
    console.error('Error awarding art achievement:', error);
    throw error;
  }
}

/**
 * Get user's art achievements
 */
export async function getUserArtAchievements(userId) {
  try {
    const q = query(
      collection(db, 'art_achievements'),
      where('userId', '==', userId),
      orderBy('unlockedAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error fetching user art achievements:', error);
    throw error;
  }
}
