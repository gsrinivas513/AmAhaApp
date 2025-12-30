// SIMPLEST BROWSER CONSOLE VERSION
// ==================================
// Copy entire contents, paste into browser console (F12)
// No dependencies needed!

(async function() {
  const baseUrl = 'https://amaha-quiz-app.firebaseapp.com/api/setup-puzzle';
  
  // If you set up an Express endpoint, use that
  // Otherwise, use manual Firestore REST API call below
  
  // OPTION 1: If you have a backend endpoint set up
  try {
    console.log("🚀 Initializing Puzzle Feature...");
    const response = await fetch('/api/setup-puzzle', { method: 'POST' });
    const result = await response.json();
    console.log("✅ Setup complete!", result);
  } catch (e) {
    // OPTION 2: Manual setup using Firestore REST
    console.log("Using manual setup via fetch...");
    await manualSetup();
  }
})();

async function manualSetup() {
  const projectId = "amaha-quiz-app";
  const apiKey = "AIzaSyBDJx8mG6N5cK2xL9pQ4rT6uV7wX8yZ1aB"; // Replace with your API key
  const baseUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents`;

  async function addDoc(collection, docId, data) {
    const url = `${baseUrl}/${collection}/${docId}?key=${apiKey}`;
    const fields = {};
    Object.keys(data).forEach(key => {
      const val = data[key];
      if (typeof val === 'string') fields[key] = { stringValue: val };
      else if (typeof val === 'number') fields[key] = { integerValue: String(val) };
      else if (typeof val === 'boolean') fields[key] = { booleanValue: val };
      else if (val === null) fields[key] = { nullValue: null };
    });

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fields })
      });
      if (response.ok) console.log(`✓ Added ${collection}/${docId}`);
      return response.ok;
    } catch (e) {
      console.error(`✗ Failed ${collection}/${docId}:`, e);
      return false;
    }
  }

  console.log("📝 Creating puzzle feature...");
  await addDoc('features', 'Puzzles', {
    featureName: 'Puzzles',
    featureType: 'puzzle',
    status: 'enabled'
  });

  console.log("📁 Creating categories...");
  await addDoc('categories', 'visual-puzzles', {
    categoryName: 'Visual Puzzles',
    featureName: 'Puzzles',
    featureType: 'puzzle'
  });
  await addDoc('categories', 'traditional-puzzles', {
    categoryName: 'Traditional Puzzles',
    featureName: 'Puzzles',
    featureType: 'puzzle'
  });

  console.log("🎨 Creating puzzle types...");
  const types = [
    ['picture-word', 'Picture Word'],
    ['spot-difference', 'Spot Difference'],
    ['find-pairs', 'Find Pairs'],
    ['picture-shadow', 'Picture Shadow'],
    ['matching-pairs', 'Matching Pairs'],
    ['ordering', 'Ordering'],
    ['drag-drop', 'Drag & Drop']
  ];

  for (const [id, name] of types) {
    await addDoc('topics', id, { topicName: name });
  }

  console.log("✅ Setup complete! Refresh page to see changes.");
}
