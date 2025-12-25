/**
 * addStoriesFeatureToFirestore.js
 * 
 * Utility to ensure Stories feature is in Firestore features collection
 * Run this once to set up the feature
 * 
 * Usage in browser console:
 * import { addStoriesFeatureToFirebase } from '/src/services/addStoriesFeatureToFirestore.js'
 * await addStoriesFeatureToFirebase()
 */

import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

export async function addStoriesFeatureToFirebase() {
  console.log('📖 Adding Stories feature to Firestore features collection...');
  
  try {
    const storiesFeature = {
      id: 'stories',
      name: 'Stories',
      icon: '📖',
      order: 4,
      isPublished: true,
      enabled: true,
      status: 'enabled',
      showInMenu: true,
      description: 'Interactive stories for learning',
      featureType: 'story',
      type: 'story',
      route: '/stories',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await setDoc(doc(db, 'features', 'stories'), storiesFeature);
    
    console.log('✅ Stories feature added successfully to Firestore!');
    console.log('📖 Feature details:', storiesFeature);
    console.log('🔄 Refresh the page to see Stories in the TopNavBar');
    
    return storiesFeature;
  } catch (error) {
    console.error('❌ Error adding Stories feature:', error);
    throw error;
  }
}
