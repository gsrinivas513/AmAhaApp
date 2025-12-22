// Import kids quiz questions from CSV files
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc } = require('firebase/firestore');
const fs = require('fs');
const path = require('path');

// Your Firebase config (from src/firebase/firebaseConfig.js)
const firebaseConfig = {
  apiKey: "AIzaSyD3WVmW_4tgKdF6FzLq4mXXPKzGvUq0TJU",
  authDomain: "quiz-b0ec5.firebaseapp.com",
  projectId: "quiz-b0ec5",
  storageBucket: "quiz-b0ec5.firebasestorage.app",
  messagingSenderId: "626718033459",
  appId: "1:626718033459:web:0bb2bd7c19e97c2c8eeb00",
  measurementId: "G-P781D2R8LX"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function parseCSV(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n').filter(line => line.trim());
  const headers = lines[0].split(',').map(h => h.trim());
  
  const questions = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    if (values.length < headers.length) continue;
    
    const question = {};
    headers.forEach((header, index) => {
      question[header] = values[index];
    });
    questions.push(question);
  }
  
  return questions;
}

async function importQuestions(csvFile) {
  console.log(`\n📥 Importing from ${csvFile}...`);
  
  const questions = parseCSV(csvFile);
  console.log(`📝 Found ${questions.length} questions`);
  
  let imported = 0;
  let skipped = 0;
  
  for (const q of questions) {
    try {
      const questionData = {
        question: q.question,
        optionA: q.optionA,
        optionB: q.optionB,
        optionC: q.optionC,
        optionD: q.optionD,
        correctAnswer: q.correctAnswer,
        difficulty: q.difficulty || 'easy',
        subtopic: q.subtopic,
        topic: q.topic || q.subtopic,  // Use subtopic as topic if not provided
        category: q.category,
        feature: q.feature,
        createdAt: new Date(),
      };
      
      await addDoc(collection(db, 'questions'), questionData);
      imported++;
      
      if (imported % 10 === 0) {
        console.log(`  ✅ Imported ${imported}/${questions.length}...`);
      }
    } catch (error) {
      console.error(`  ❌ Failed to import question:`, error.message);
      skipped++;
    }
  }
  
  console.log(`\n✨ Import complete for ${csvFile}!`);
  console.log(`  ✅ Imported: ${imported}`);
  console.log(`  ❌ Skipped: ${skipped}`);
  
  return { imported, skipped };
}

async function main() {
  const csvFiles = [
    'kids_animals_sounds_50q.csv',
    'kids_birds_insects_50q.csv',
    'kids_body_parts_50q.csv',
    'kids_colors_shapes_50q.csv',
    'kids_fruits_vegetables_50q.csv',
    'kids_math_50q.csv',
    'kids_days_months_50q.csv',  // NEW!
    'kids_vehicles_50q.csv',      // NEW!
  ];
  
  console.log('🚀 Starting Kids Quiz Import...\n');
  console.log(`📦 Found ${csvFiles.length} CSV files to import\n`);
  
  let totalImported = 0;
  let totalSkipped = 0;
  
  for (const file of csvFiles) {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
      const result = await importQuestions(filePath);
      totalImported += result.imported;
      totalSkipped += result.skipped;
    } else {
      console.log(`⚠️  File not found: ${file}`);
    }
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('🎉 IMPORT COMPLETE!');
  console.log('='.repeat(50));
  console.log(`✅ Total Questions Imported: ${totalImported}`);
  console.log(`❌ Total Skipped: ${totalSkipped}`);
  console.log(`📊 Success Rate: ${((totalImported / (totalImported + totalSkipped)) * 100).toFixed(1)}%`);
  console.log('\n💡 Next Steps:');
  console.log('  1. Open your app and navigate to Kids category');
  console.log('  2. Verify all subtopics are showing');
  console.log('  3. Test a few quizzes from each subtopic');
  console.log('  4. Check question quality and difficulty');
  console.log('\n🚀 Ready to launch!');
  process.exit(0);
}

main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
