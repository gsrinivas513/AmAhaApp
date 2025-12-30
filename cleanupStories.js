#!/usr/bin/env node

/**
 * cleanupStories.js
 * 
 * Delete specific stories by ID
 */

const API_KEY = 'AIzaSyAR8-mpS85CEopQuGuP4Lhm3xieYbG1HcY';
const PROJECT_ID = 'amahaapp';

const FIRESTORE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

// Stories to delete (keep only the latest one)
const STORIES_TO_DELETE = [
  'story_1766723607624'
];

async function makeRequest(method, path, data = null) {
  try {
    const url = `${FIRESTORE_URL}${path}?key=${API_KEY}`;
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(url, options);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    throw new Error(`API Error: ${error.message}`);
  }
}

async function deleteStories() {
  try {
    console.log('🗑️  Deleting old stories...\n');

    for (const storyId of STORIES_TO_DELETE) {
      try {
        await makeRequest('DELETE', `/stories/${storyId}`);
        console.log(`✅ Deleted: ${storyId}`);
      } catch (err) {
        console.log(`⚠️  Could not delete ${storyId}: ${err.message}`);
      }
    }

    console.log('\n✅ Cleanup complete!');
    console.log('📖 Keeping: story_1766724293177 (The Adventure Chronicles)');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

deleteStories();
