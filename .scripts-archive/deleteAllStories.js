#!/usr/bin/env node

/**
 * deleteAllStories.js
 * 
 * Script to delete all stories from Firestore
 * Uses Firebase REST API
 */

const API_KEY = 'AIzaSyAR8-mpS85CEopQuGuP4Lhm3xieYbG1HcY';
const PROJECT_ID = 'amahaapp';

const FIRESTORE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

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

async function deleteAllStories() {
  try {
    console.log('🗑️  Fetching all stories...\n');

    // List all stories
    const response = await makeRequest('GET', '/stories');
    
    if (!response.documents || response.documents.length === 0) {
      console.log('✅ No stories found to delete');
      return;
    }

    console.log(`Found ${response.documents.length} stories. Deleting...\n`);

    let deletedCount = 0;
    for (const doc of response.documents) {
      const storyId = doc.name.split('/').pop();
      
      try {
        await makeRequest('DELETE', `/stories/${storyId}`);
        console.log(`✅ Deleted: ${storyId}`);
        deletedCount++;
      } catch (err) {
        console.log(`⚠️  Failed to delete ${storyId}: ${err.message}`);
      }
    }

    console.log(`\n✅ Successfully deleted ${deletedCount} stories!`);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

deleteAllStories();
