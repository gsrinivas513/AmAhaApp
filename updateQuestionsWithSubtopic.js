// updateQuestionsWithSubtopic.js
// This script updates existing questions to add the subtopic field based on their category and topic

const admin = require('firebase-admin');
const serviceAccount = require('./amaha-web-firebase-adminsdk.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Mapping of category + topic to subtopic name
const CATEGORY_TOPIC_TO_SUBTOPIC = {
  'kids|animals': 'Animals & Their Sounds',
  'kids|birds': 'Birds & Insects',
  'kids|body': 'Body Parts',
  'kids|colors': 'Colors & Shapes',
  'kids|fruits': 'Fruits & Vegetables',
  'kids|math': 'Math Basics',
};

async function updateQuestions() {
  try {
    console.log('🔍 Loading all questions...');
    const questionsSnap = await db.collection('questions').get();
    console.log(`📦 Found ${questionsSnap.size} questions`);

    let updated = 0;
    let skipped = 0;
    let errors = 0;

    for (const doc of questionsSnap.docs) {
      const data = doc.data();
      
      // Skip if already has subtopic
      if (data.subtopic) {
        skipped++;
        continue;
      }

      const category = (data.category || '').toLowerCase();
      const topic = (data.topic || '').toLowerCase();
      const key = `${category}|${topic}`;
      
      const subtopicName = CATEGORY_TOPIC_TO_SUBTOPIC[key];
      
      if (!subtopicName) {
        console.log(`⚠️  No subtopic mapping for: ${category} | ${topic} (ID: ${doc.id})`);
        skipped++;
        continue;
      }

      // Now find the subcategory ID for this subtopic name
      const subcatSnap = await db.collection('subcategories')
        .where('name', '==', subtopicName)
        .limit(1)
        .get();

      if (subcatSnap.empty) {
        console.log(`❌ Subcategory not found for: ${subtopicName} (ID: ${doc.id})`);
        errors++;
        continue;
      }

      const subcatId = subcatSnap.docs[0].id;

      try {
        await doc.ref.update({
          subtopic: subtopicName,
          subtopicId: subcatId
        });
        updated++;
        
        if (updated % 10 === 0) {
          console.log(`✅ Updated ${updated} questions...`);
        }
      } catch (err) {
        console.error(`❌ Error updating question ${doc.id}:`, err.message);
        errors++;
      }
    }

    console.log('\n📊 Summary:');
    console.log(`✅ Updated: ${updated}`);
    console.log(`⏭️  Skipped (already had subtopic): ${skipped}`);
    console.log(`❌ Errors: ${errors}`);
    console.log(`📝 Total: ${questionsSnap.size}`);

  } catch (err) {
    console.error('❌ Fatal error:', err);
  } finally {
    process.exit(0);
  }
}

updateQuestions();
