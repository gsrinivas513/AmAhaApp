// This script adds the Puzzles feature to Firestore if it doesn't exist

import { collection, getDocs, addDoc, setDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { FEATURES } from '../constants/FEATURES';

export async function ensurePuzzlesFeatureExists() {
  try {
    // Get all features
    const snap = await getDocs(collection(db, 'features'));
    const features = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    
    // Check if Puzzles exists
    const puzzlesExists = features.some(f => 
      f.featureType === 'puzzle' || 
      f.type === 'puzzle' || 
      f.id === 'puzzles' ||
      f.label === 'Puzzles'
    );
    
    if (!puzzlesExists) {
      console.log('🧩 Puzzles feature not found. Creating it...');
      
      const puzzlesFeature = {
        id: 'puzzles',
        name: 'puzzles',
        label: 'Puzzles',
        icon: '🧩',
        type: 'puzzle',
        featureType: 'puzzle',
        order: 2,
        description: 'Solve fun and challenging puzzles',
        enabled: true,
        isPublished: true,
        color: '#8B5CF6',
        createdAt: new Date().toISOString()
      };
      
      // Try to create with ID 'puzzles'
      try {
        await setDoc(doc(db, 'features', 'puzzles'), puzzlesFeature);
        console.log('✅ Created Puzzles feature with ID: puzzles');
      } catch (e) {
        // Fallback to addDoc
        const docRef = await addDoc(collection(db, 'features'), puzzlesFeature);
        console.log('✅ Created Puzzles feature with ID:', docRef.id);
      }
    } else {
      console.log('✅ Puzzles feature already exists');
    }
  } catch (error) {
    console.error('❌ Error ensuring Puzzles feature:', error);
    throw error;
  }
}
