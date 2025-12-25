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
  writeBatch,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../../firebase';

/**
 * Studies Service - Guided learning paths with structured curriculum
 * Each study contains multiple lessons with videos, resources, and assessments
 */

// ===== STUDY CRUD OPERATIONS =====

/**
 * Create a new study/course
 * @param {Object} studyData - { title, description, category, level, creator, duration, image, lessons }
 */
export async function createStudy(studyData) {
  try {
    const study = {
      title: studyData.title,
      description: studyData.description,
      category: studyData.category, // 'mathematics', 'science', 'language', 'history', 'arts'
      level: studyData.level, // 'beginner', 'intermediate', 'advanced'
      creator: studyData.creator, // userId
      creatorName: studyData.creatorName || 'Unknown Creator',
      duration: studyData.duration, // in hours
      image: studyData.image,
      lessons: studyData.lessons || [], // array of lesson objects
      published: false,
      rating: 0,
      ratingCount: 0,
      enrollmentCount: 0,
      completionRate: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      tags: studyData.tags || [],
      language: studyData.language || 'en',
      prerequisites: studyData.prerequisites || [],
      certificateEligible: studyData.certificateEligible !== false,
    };

    const studiesRef = collection(db, 'studies');
    const docRef = await addDoc(studiesRef, study);
    return { id: docRef.id, ...study };
  } catch (error) {
    console.error('Error creating study:', error);
    throw error;
  }
}

/**
 * Get a single study by ID
 */
export async function getStudy(studyId) {
  try {
    const docRef = doc(db, 'studies', studyId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    return { id: docSnap.id, ...docSnap.data() };
  } catch (error) {
    console.error('Error getting study:', error);
    throw error;
  }
}

/**
 * Update study details
 */
export async function updateStudy(studyId, updates) {
  try {
    const docRef = doc(db, 'studies', studyId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
    return { id: studyId, ...updates };
  } catch (error) {
    console.error('Error updating study:', error);
    throw error;
  }
}

/**
 * Delete a study
 */
export async function deleteStudy(studyId) {
  try {
    const docRef = doc(db, 'studies', studyId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error('Error deleting study:', error);
    throw error;
  }
}

/**
 * Publish/unpublish a study
 */
export async function publishStudy(studyId, published) {
  try {
    return updateStudy(studyId, {
      published,
      publishedAt: published ? serverTimestamp() : null,
    });
  } catch (error) {
    console.error('Error publishing study:', error);
    throw error;
  }
}

// ===== STUDY QUERIES =====

/**
 * Get all published studies with pagination
 */
export async function getAllPublishedStudies(pageSize = 20, startAt = 0) {
  try {
    const q = query(
      collection(db, 'studies'),
      where('published', '==', true),
      orderBy('createdAt', 'desc'),
      limit(pageSize)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error fetching published studies:', error);
    throw error;
  }
}

/**
 * Get studies by category
 */
export async function getStudiesByCategory(category, published = true) {
  try {
    const q = query(
      collection(db, 'studies'),
      where('category', '==', category),
      where('published', '==', published),
      orderBy('enrollmentCount', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error fetching studies by category:', error);
    throw error;
  }
}

/**
 * Get studies by level
 */
export async function getStudiesByLevel(level, published = true) {
  try {
    const q = query(
      collection(db, 'studies'),
      where('level', '==', level),
      where('published', '==', published),
      orderBy('rating', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error fetching studies by level:', error);
    throw error;
  }
}

/**
 * Get studies created by a specific creator
 */
export async function getCreatorStudies(creatorId) {
  try {
    const q = query(
      collection(db, 'studies'),
      where('creator', '==', creatorId),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error fetching creator studies:', error);
    throw error;
  }
}

/**
 * Search studies by title or tags
 */
export async function searchStudies(searchTerm) {
  try {
    // Get all published studies and filter client-side
    const q = query(
      collection(db, 'studies'),
      where('published', '==', true)
    );

    const querySnapshot = await getDocs(q);
    const allStudies = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const term = searchTerm.toLowerCase();
    return allStudies.filter((study) => {
      return (
        study.title.toLowerCase().includes(term) ||
        study.description.toLowerCase().includes(term) ||
        (study.tags && study.tags.some((tag) => tag.toLowerCase().includes(term)))
      );
    });
  } catch (error) {
    console.error('Error searching studies:', error);
    throw error;
  }
}

/**
 * Get trending studies (highest rating + enrollments)
 */
export async function getTrendingStudies(limit_count = 10) {
  try {
    const q = query(
      collection(db, 'studies'),
      where('published', '==', true),
      orderBy('rating', 'desc'),
      limit(limit_count)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error fetching trending studies:', error);
    throw error;
  }
}

// ===== LESSON MANAGEMENT =====

/**
 * Add a lesson to a study
 */
export async function addLessonToStudy(studyId, lessonData) {
  try {
    const lessonId = `lesson_${Date.now()}`;
    const lesson = {
      id: lessonId,
      title: lessonData.title,
      description: lessonData.description,
      videoUrl: lessonData.videoUrl,
      duration: lessonData.duration, // in minutes
      order: lessonData.order || 1,
      resources: lessonData.resources || [], // array of resource objects
      quiz: lessonData.quiz || null,
      createdAt: new Date().toISOString(),
    };

    const docRef = doc(db, 'studies', studyId);
    const docSnap = await getDoc(docRef);
    const study = docSnap.data();
    const lessons = study.lessons || [];
    lessons.push(lesson);

    await updateDoc(docRef, {
      lessons,
      updatedAt: serverTimestamp(),
    });

    return lesson;
  } catch (error) {
    console.error('Error adding lesson:', error);
    throw error;
  }
}

/**
 * Update a lesson
 */
export async function updateLesson(studyId, lessonId, updates) {
  try {
    const docRef = doc(db, 'studies', studyId);
    const docSnap = await getDoc(docRef);
    const study = docSnap.data();
    const lessons = study.lessons || [];

    const lessonIndex = lessons.findIndex((l) => l.id === lessonId);
    if (lessonIndex !== -1) {
      lessons[lessonIndex] = { ...lessons[lessonIndex], ...updates };
      await updateDoc(docRef, {
        lessons,
        updatedAt: serverTimestamp(),
      });
    }

    return lessons[lessonIndex];
  } catch (error) {
    console.error('Error updating lesson:', error);
    throw error;
  }
}

/**
 * Delete a lesson
 */
export async function deleteLesson(studyId, lessonId) {
  try {
    const docRef = doc(db, 'studies', studyId);
    const docSnap = await getDoc(docRef);
    const study = docSnap.data();
    const lessons = study.lessons || [];

    const filteredLessons = lessons.filter((l) => l.id !== lessonId);
    await updateDoc(docRef, {
      lessons: filteredLessons,
      updatedAt: serverTimestamp(),
    });

    return true;
  } catch (error) {
    console.error('Error deleting lesson:', error);
    throw error;
  }
}

// ===== USER ENROLLMENT =====

/**
 * Enroll a user in a study
 */
export async function enrollUserInStudy(userId, studyId) {
  try {
    const enrollmentData = {
      userId,
      studyId,
      enrolledAt: serverTimestamp(),
      status: 'active', // 'active', 'paused', 'completed'
      lessonsCompleted: 0,
      currentLesson: 0,
      totalLessons: 0,
      progressPercentage: 0,
      certificateEarned: false,
      certificateDate: null,
    };

    const docRef = doc(collection(db, 'user_studies'), `${userId}_${studyId}`);
    await updateDoc(docRef, enrollmentData);

    // Update study enrollment count
    const studyRef = doc(db, 'studies', studyId);
    const studySnap = await getDoc(studyRef);
    const enrollmentCount = (studySnap.data().enrollmentCount || 0) + 1;
    await updateDoc(studyRef, { enrollmentCount });

    return enrollmentData;
  } catch (error) {
    // If document doesn't exist, create it
    if (error.code === 'not-found') {
      const collectionRef = collection(db, 'user_studies');
      const enrollmentData = {
        userId,
        studyId,
        enrolledAt: serverTimestamp(),
        status: 'active',
        lessonsCompleted: 0,
        currentLesson: 0,
        totalLessons: 0,
        progressPercentage: 0,
        certificateEarned: false,
        certificateDate: null,
      };

      await addDoc(collectionRef, enrollmentData);

      // Update study enrollment count
      const studyRef = doc(db, 'studies', studyId);
      const studySnap = await getDoc(studyRef);
      const enrollmentCount = (studySnap.data().enrollmentCount || 0) + 1;
      await updateDoc(studyRef, { enrollmentCount });

      return enrollmentData;
    }
    throw error;
  }
}

/**
 * Get user's enrolled studies
 */
export async function getUserEnrolledStudies(userId) {
  try {
    const q = query(
      collection(db, 'user_studies'),
      where('userId', '==', userId),
      orderBy('enrolledAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const enrollments = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Fetch full study details for each enrollment
    const studiesWithDetails = await Promise.all(
      enrollments.map(async (enrollment) => {
        const study = await getStudy(enrollment.studyId);
        return { ...enrollment, study };
      })
    );

    return studiesWithDetails;
  } catch (error) {
    console.error('Error fetching user enrolled studies:', error);
    throw error;
  }
}

/**
 * Update user's progress in a study
 */
export async function updateUserStudyProgress(userId, studyId, progressData) {
  try {
    const q = query(
      collection(db, 'user_studies'),
      where('userId', '==', userId),
      where('studyId', '==', studyId)
    );

    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      throw new Error('User study enrollment not found');
    }

    const docRef = querySnapshot.docs[0].ref;
    await updateDoc(docRef, {
      ...progressData,
      updatedAt: serverTimestamp(),
    });

    return progressData;
  } catch (error) {
    console.error('Error updating user study progress:', error);
    throw error;
  }
}

/**
 * Complete a lesson for a user
 */
export async function completeLessonForUser(userId, studyId, lessonId) {
  try {
    const q = query(
      collection(db, 'user_studies'),
      where('userId', '==', userId),
      where('studyId', '==', studyId)
    );

    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      throw new Error('User study enrollment not found');
    }

    const docRef = querySnapshot.docs[0].ref;
    const docSnap = await getDoc(docRef);
    const enrollment = docSnap.data();

    const completedLessons = new Set(enrollment.completedLessons || []);
    completedLessons.add(lessonId);

    const study = await getStudy(studyId);
    const lessonsCompleted = completedLessons.size;
    const totalLessons = study.lessons?.length || 0;
    const progressPercentage = totalLessons > 0 ? (lessonsCompleted / totalLessons) * 100 : 0;

    const updates = {
      completedLessons: Array.from(completedLessons),
      lessonsCompleted,
      progressPercentage,
      updatedAt: serverTimestamp(),
    };

    // Check if all lessons completed (certificate eligible)
    if (progressPercentage === 100 && study.certificateEligible) {
      updates.certificateEarned = true;
      updates.certificateDate = serverTimestamp();
      updates.status = 'completed';
    }

    await updateDoc(docRef, updates);
    return updates;
  } catch (error) {
    console.error('Error completing lesson:', error);
    throw error;
  }
}

// ===== RATINGS & REVIEWS =====

/**
 * Rate a study
 */
export async function rateStudy(studyId, userId, rating, review = '') {
  try {
    const ratingData = {
      studyId,
      userId,
      rating, // 1-5
      review,
      createdAt: serverTimestamp(),
    };

    const collectionRef = collection(db, 'study_ratings');
    await addDoc(collectionRef, ratingData);

    // Update study rating average
    const q = query(collection(db, 'study_ratings'), where('studyId', '==', studyId));
    const querySnapshot = await getDocs(q);
    const ratings = querySnapshot.docs.map((doc) => doc.data().rating);
    const averageRating = ratings.reduce((a, b) => a + b, 0) / ratings.length;

    const studyRef = doc(db, 'studies', studyId);
    await updateDoc(studyRef, {
      rating: Math.round(averageRating * 10) / 10,
      ratingCount: ratings.length,
    });

    return ratingData;
  } catch (error) {
    console.error('Error rating study:', error);
    throw error;
  }
}

/**
 * Get study ratings and reviews
 */
export async function getStudyRatings(studyId) {
  try {
    const q = query(
      collection(db, 'study_ratings'),
      where('studyId', '==', studyId),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error fetching study ratings:', error);
    throw error;
  }
}

// ===== CERTIFICATES =====

/**
 * Generate study completion certificate
 */
export async function generateStudyCertificate(userId, studyId) {
  try {
    const study = await getStudy(studyId);
    const certificate = {
      userId,
      studyId,
      title: study.title,
      issueDate: new Date().toISOString(),
      certificateId: `CERT_${studyId}_${userId}_${Date.now()}`,
      skills: study.tags || [],
    };

    const collectionRef = collection(db, 'study_certificates');
    const docRef = await addDoc(collectionRef, certificate);

    return { id: docRef.id, ...certificate };
  } catch (error) {
    console.error('Error generating certificate:', error);
    throw error;
  }
}

/**
 * Get user's study certificates
 */
export async function getUserStudyCertificates(userId) {
  try {
    const q = query(
      collection(db, 'study_certificates'),
      where('userId', '==', userId),
      orderBy('issueDate', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error fetching user certificates:', error);
    throw error;
  }
}
