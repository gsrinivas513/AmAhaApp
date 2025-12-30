#!/usr/bin/env node

/**
 * addStoryToReading.js
 * Add a story to Stories → Kids Stories → Learning Through Stories → Reading Skills
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

function convertToFirestoreValue(value) {
  if (value === null || value === undefined) {
    return { nullValue: null };
  }
  if (typeof value === 'boolean') {
    return { booleanValue: value };
  }
  if (typeof value === 'number') {
    return { integerValue: String(value) };
  }
  if (typeof value === 'string') {
    return { stringValue: value };
  }
  if (Array.isArray(value)) {
    return { arrayValue: { values: value.map(convertToFirestoreValue) } };
  }
  if (typeof value === 'object') {
    const fields = {};
    for (const [key, val] of Object.entries(value)) {
      fields[key] = convertToFirestoreValue(val);
    }
    return { mapValue: { fields } };
  }
  return { stringValue: String(value) };
}

async function addStory() {
  try {
    console.log('🔍 Fetching story categories...\n');
    let response = await makeRequest('GET', '/storyCategories');
    
    const categories = response.documents || [];
    let categoryDocName = null;
    
    for (const doc of categories) {
      const fields = doc.fields;
      if (fields.name && fields.name.stringValue === 'Kids') {
        categoryDocName = doc.name;
        console.log(`✅ Found Category: Kids\n`);
        break;
      }
    }

    if (!categoryDocName) {
      console.log('❌ Category "Kids" not found');
      process.exit(1);
    }

    // Find topic
    console.log('🔍 Fetching story topics...\n');
    response = await makeRequest('GET', '/storyTopics');
    
    const topics = response.documents || [];
    let topicDocName = null;
    
    for (const doc of topics) {
      const fields = doc.fields;
      if (fields.name && fields.name.stringValue === 'Learning Through Stories') {
        topicDocName = doc.name;
        console.log(`✅ Found Topic: Learning Through Stories\n`);
        break;
      }
    }

    if (!topicDocName) {
      console.log('❌ Topic "Learning Through Stories" not found');
      process.exit(1);
    }

    // Find subtopic
    console.log('🔍 Fetching story subtopics...\n');
    response = await makeRequest('GET', '/storySubtopics');
    
    const subtopics = response.documents || [];
    let subtopicDocName = null;
    
    for (const doc of subtopics) {
      const fields = doc.fields;
      if (fields.name && fields.name.stringValue === 'Reading Skills') {
        subtopicDocName = doc.name;
        console.log(`✅ Found SubTopic: Reading Skills\n`);
        break;
      }
    }

    if (!subtopicDocName) {
      console.log('❌ SubTopic "Reading Skills" not found');
      process.exit(1);
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📍 Hierarchy Found:');
    console.log('  Category: Kids');
    console.log('  Topic: Learning Through Stories');
    console.log('  SubTopic: Reading Skills');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Create story
    console.log('📝 Creating story...\n');
    
    const storyData = {
      title: 'The Magical Library',
      description: 'Join Maya as she discovers a magical library where books come to life and characters teach her important lessons.',
      targetAudience: 'kids',
      coverColor: '#8b5cf6',
      isPublished: true,
      createdAt: { timestampValue: new Date().toISOString() },
      chapters: [
        {
          title: 'Chapter 1: The Hidden Door',
          description: 'Maya finds a mysterious door in her school library that leads to something magical.',
          character: 'Maya',
          characterImage: '',
          content: 'One rainy afternoon, Maya was exploring her school library when she noticed something strange. Behind the old bookshelf, there was a small, ornate door she had never seen before. It glowed with a soft, golden light. Taking a deep breath, she turned the handle and stepped through...'
        },
        {
          title: 'Chapter 2: Books Come Alive',
          description: 'Inside the magical library, the characters from books step out and become real. Maya meets Cinderella, who teaches her about courage.',
          character: 'Cinderella',
          characterImage: '',
          content: 'As Maya stepped inside, she gasped. The library was enormous, with shelves reaching up to a starlit ceiling. But something was different - the characters from the books were walking around! They smiled and waved at her. A woman in a beautiful ball gown approached her. "Hello, I\'m Cinderella," she said warmly. "Would you like to hear my story?"'
        },
        {
          title: 'Chapter 3: The Reading Quest',
          description: 'Maya embarks on a quest where she must read stories to help the characters solve their problems.',
          character: 'Maya & Friends',
          characterImage: '',
          content: 'Cinderella explained that the magical library had a special purpose. "Every character here needs the help of a young reader like you," she said. "Will you help us?" Maya nodded enthusiastically. And so began her amazing adventure, reading stories and helping characters discover new possibilities through the power of reading.'
        }
      ]
    };

    const fields = {};
    for (const [key, val] of Object.entries(storyData)) {
      fields[key] = convertToFirestoreValue(val);
    }

    const createResponse = await makeRequest('POST', '/stories', {
      fields: fields
    });

    const storyId = createResponse.name.split('/').pop();

    console.log('✅ Story created successfully!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📖 Story Details:');
    console.log(`  ID: ${storyId}`);
    console.log(`  Title: ${storyData.title}`);
    console.log(`  Description: ${storyData.description}`);
    console.log(`  Chapters: ${storyData.chapters.length}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    console.log('📚 Chapters:');
    storyData.chapters.forEach((ch, idx) => {
      console.log(`  ${idx + 1}. ${ch.title}`);
      console.log(`     ${ch.description}`);
    });
    
    console.log('\n🎉 Done! The story is now available in the admin panel under:');
    console.log('   Stories → Kids → Learning Through Stories → Reading Skills\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

addStory();
