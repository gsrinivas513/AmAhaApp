// Script to update existing subcategories with topic field
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, doc, updateDoc } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyBjL7c_OnT-CgsA8FRCZcKwDYv_YzrW7dw",
  authDomain: "amaha-7ce95.firebaseapp.com",
  projectId: "amaha-7ce95",
  storageBucket: "amaha-7ce95.firebasestorage.app",
  messagingSenderId: "715810247358",
  appId: "1:715810247358:web:e3f9f2e073d21b7db71b95",
  measurementId: "G-GMFQP43F8H"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Map subcategory names to topics
const subcategoryToTopic = {
  "Animals & Their Sounds": "Animals",
  "Wild vs Domestic Animals": "Animals",
  "Aquatic Animals": "Animals",
  "Baby Animals": "Animals",
  "Forest & Jungle Animals": "Animals",
  "National Animals & Birds": "Animals",
  
  "Birds & Insects": "Nature",
  "Trees & Plants": "Nature",
  "Weather & Seasons": "Nature",
  
  "Fruits & Vegetables": "Food",
  "Food & Drinks": "Food",
  
  "Colors & Shapes": "Learning Basics",
  "Alphabet (A–Z)": "Learning Basics",
  "Numbers (1–100)": "Learning Basics",
  "Opposites": "Learning Basics",
  "Colors Quiz": "Learning Basics",
  "Sequencing": "Learning Basics",
  "What Comes Next? (Patterns)": "Learning Basics",
  
  "Simple Math (Addition & Subtraction)": "Math",
  
  "Body Parts": "Body",
  
  "Solar System": "Space",
  "Planets & Stars": "Space",
  "Day & Night": "Space",
  
  "Transport (Land / Water / Air)": "Learning Basics",
  "Cartoon Characters": "Entertainment",
  "Disney Movies": "Entertainment",
  "Nursery Rhymes": "Learning Basics",
  
  "Indian Festivals": "Culture",
  "Famous Places": "Geography",
  "Famous Monuments (World)": "Geography",
};

async function updateSubcategories() {
  try {
    console.log('🔍 Fetching existing subcategories...');
    
    const subcategoriesSnap = await getDocs(collection(db, 'subcategories'));
    
    console.log(`📊 Found ${subcategoriesSnap.size} subcategories`);
    
    let updated = 0;
    let skipped = 0;
    
    for (const docSnap of subcategoriesSnap.docs) {
      const data = docSnap.data();
      const subcategoryName = data.name || data.label;
      
      // Check if topic already exists
      if (data.topic) {
        console.log(`⏭️  Skipping "${subcategoryName}" - already has topic: ${data.topic}`);
        skipped++;
        continue;
      }
      
      // Find matching topic
      const topic = subcategoryToTopic[subcategoryName];
      
      if (topic) {
        await updateDoc(doc(db, 'subcategories', docSnap.id), {
          topic: topic
        });
        console.log(`✅ Updated "${subcategoryName}" → Topic: ${topic}`);
        updated++;
      } else {
        console.log(`⚠️  No topic mapping found for: "${subcategoryName}"`);
        skipped++;
      }
    }
    
    console.log('\n📈 Summary:');
    console.log(`   ✅ Updated: ${updated}`);
    console.log(`   ⏭️  Skipped: ${skipped}`);
    console.log(`   📊 Total: ${subcategoriesSnap.size}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

updateSubcategories();
