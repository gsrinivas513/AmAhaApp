/**
 * Delete All Quizzes Script
 * WARNING: This will delete ALL quizzes from the database. Use with caution!
 */

import { collection, getDocs, deleteDoc, query } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

export async function deleteAllQuizzes() {
  try {
    console.log('🗑️ Starting to delete all quizzes...');
    
    const quizzesCollection = collection(db, 'quizzes');
    const q = query(quizzesCollection);
    const querySnapshot = await getDocs(q);
    
    console.log(`Found ${querySnapshot.size} quizzes to delete`);
    
    let deletedCount = 0;
    const errors = [];
    
    for (const doc of querySnapshot.docs) {
      try {
        await deleteDoc(doc.ref);
        deletedCount++;
        console.log(`✅ Deleted: ${doc.data().title || 'Untitled'} (${doc.id})`);
      } catch (error) {
        errors.push({
          quizId: doc.id,
          title: doc.data().title,
          error: error.message,
        });
        console.error(`❌ Failed to delete ${doc.id}:`, error);
      }
    }
    
    const result = {
      success: true,
      totalFound: querySnapshot.size,
      deleted: deletedCount,
      failed: errors.length,
      errors: errors,
    };
    
    console.log('🗑️ Cleanup complete:', result);
    return result;
  } catch (error) {
    console.error('❌ Delete operation failed:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

// Auto-run if this file is executed directly
if (typeof window === 'undefined') {
  deleteAllQuizzes()
    .then((result) => {
      console.log('Final result:', result);
      process.exit(result.success ? 0 : 1);
    })
    .catch((error) => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}
