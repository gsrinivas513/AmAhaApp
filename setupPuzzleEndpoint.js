// Express backend endpoint for puzzle setup
// Save this as: server/setupPuzzleEndpoint.js
// Or add to your existing Express server

const admin = require('firebase-admin');

// Make sure firebase is initialized in your server:
// const serviceAccount = require('./firebaseServiceKey.json');
// admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

const db = admin.firestore();

async function setupPuzzleFeature(req, res) {
  try {
    console.log("🚀 Setting up Puzzle Feature...");

    // Step 1: Create Puzzle Feature
    console.log("Creating Puzzle Feature...");
    await db.collection('features').doc('Puzzles').set({
      featureName: 'Puzzles',
      featureType: 'puzzle',
      status: 'enabled',
      createdAt: new Date(),
      description: 'Visual and traditional puzzle games'
    }, { merge: true });

    // Step 2: Create Categories
    console.log("Creating Categories...");
    await Promise.all([
      db.collection('categories').doc('visual-puzzles').set({
        categoryName: 'Visual Puzzles',
        featureName: 'Puzzles',
        featureType: 'puzzle',
        description: 'Interactive visual puzzle games'
      }, { merge: true }),
      db.collection('categories').doc('traditional-puzzles').set({
        categoryName: 'Traditional Puzzles',
        featureName: 'Puzzles',
        featureType: 'puzzle',
        description: 'Word matching, ordering, and drag-drop games'
      }, { merge: true })
    ]);

    // Step 3: Create Visual Puzzle Types (Topics)
    console.log("Creating Visual Puzzle Types...");
    const visualTypes = [
      { id: 'picture-word', name: 'Picture Word' },
      { id: 'spot-difference', name: 'Spot Difference' },
      { id: 'find-pairs', name: 'Find Pairs' },
      { id: 'picture-shadow', name: 'Picture Shadow' },
      { id: 'matching-pairs', name: 'Matching Pairs' }
    ];

    await Promise.all(
      visualTypes.map(type =>
        db.collection('topics').doc(type.id).set({
          topicName: type.name,
          categoryName: 'Visual Puzzles',
          description: `${type.name} puzzle type`
        }, { merge: true })
      )
    );

    // Step 4: Create Traditional Puzzle Types
    console.log("Creating Traditional Puzzle Types...");
    const traditionalTypes = [
      { id: 'ordering', name: 'Ordering' },
      { id: 'drag-drop', name: 'Drag & Drop' }
    ];

    await Promise.all(
      traditionalTypes.map(type =>
        db.collection('topics').doc(type.id).set({
          topicName: type.name,
          categoryName: 'Traditional Puzzles',
          description: `${type.name} puzzle type`
        }, { merge: true })
      )
    );

    console.log("✅ Puzzle feature setup complete!");
    res.json({
      success: true,
      message: 'Puzzle feature initialized successfully',
      data: {
        feature: 'Puzzles',
        categories: 2,
        types: 7
      }
    });

  } catch (error) {
    console.error("❌ Setup error:", error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

module.exports = { setupPuzzleFeature };

// Usage in Express:
// const { setupPuzzleFeature } = require('./setupPuzzleEndpoint');
// app.post('/api/setup-puzzle', setupPuzzleFeature);
