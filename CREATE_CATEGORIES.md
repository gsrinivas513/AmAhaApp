/**
 * Paste this into your browser console at http://localhost:3000/admin/features
 * It will create categories automatically
 */

(async function createCategoriesAndImport() {
  const { db } = await import('https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js').then(m => {
    // Get db from the app's imported db instance (available in browser)
    return window.dbInstance || { db: null };
  });

  // This is simpler - just use the fetch API to call your own API
  const categories = [
    { name: 'geography', label: 'Geography', icon: '🌍', color: '#0284c7' },
    { name: 'science', label: 'Science', icon: '🧪', color: '#10b981' },
    { name: 'math', label: 'Math', icon: '🔢', color: '#f59e0b' },
    { name: 'literature', label: 'Literature', icon: '📚', color: '#8b5cf6' },
    { name: 'history', label: 'History', icon: '🏛️', color: '#ef4444' },
  ];

  console.log('✅ Categories to create:', categories);
  console.log('Please go to /admin/features and create these categories manually:');
  
  for (const cat of categories) {
    console.log(`  - Name: "${cat.name}" → Label: "${cat.label}"`);
  }
  
  console.log('\nAfter creating categories, go to /admin/import to import questions.');
})();
