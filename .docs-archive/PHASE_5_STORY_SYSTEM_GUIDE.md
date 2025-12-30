# 🚀 Phase 5: Story System - Complete Implementation Guide

**Objective:** Build narrative-based learning paths with chapter progression  
**Estimated Time:** 20-25 hours  
**Difficulty:** Medium (established patterns)  
**Status:** Ready to Start ✅

---

## 📋 Phase 5 Overview

### What is Story System?

Stories are **narrative-driven learning journeys** that guide kids through multiple chapters. Each chapter contains quizzes and/or puzzles, with progression gates and completion rewards.

**Example Story:** "Math Adventures"
- Chapter 1: Numbers & Counting (5 quizzes)
- Chapter 2: Addition Basics (3 puzzles)
- Chapter 3: Subtraction Journey (5 quizzes)
- etc.

---

## 🎯 Phase 5 Deliverables

### 1. Core Components (8 files)

```
src/story/components/
├── StoryCard.jsx              (Story preview tile)
├── StoryBrowser.jsx           (Browse all stories)
├── ChapterCard.jsx            (Chapter preview)
├── ChapterContent.jsx         (Chapter detail view)
├── ProgressBar.jsx            (Visual progress)
├── CertificateModal.jsx       (Completion cert)
├── RetryDialog.jsx            (Retry management)
└── HintSystem.jsx             (Help system)
```

### 2. Pages (3 files)

```
src/story/pages/
├── StoriesPage.jsx            (Story list)
├── StoryDetailPage.jsx        (Story overview)
└── ChapterPlayPage.jsx        (Playing chapter)
```

### 3. Services (2 files)

```
src/story/services/
├── storyService.js            (Story CRUD & logic)
└── storyProgressService.js    (Progress tracking)
```

### 4. Admin Tools (2 files)

```
src/story/admin/
├── StoryEditor.jsx            (Create/edit stories)
└── ChapterBuilder.jsx         (Create/edit chapters)
```

### 5. Database Schema (1 reference)

```
Firestore collections:
  /stories                      (Story definitions)
  /user_story_progress          (User progress per story)
```

### 6. Styling (1 file)

```
src/story/styles/
└── story.css                  (All story styling)
```

**Total:** 17 files, ~3000 lines of code

---

## 📊 Database Schema

### Collection: /stories

```javascript
{
  id: "story_001",
  title: "Math Adventures",
  description: "Learn math through storytelling",
  icon: "📚",
  coverImage: "cloudinary_url",
  difficulty: "easy",
  ageGroup: [6, 8],
  category: "mathematics",
  
  // Content structure
  chapters: [
    {
      id: "ch_001",
      title: "Numbers & Counting",
      order: 1,
      description: "Learn to count",
      difficulty: "easy",
      estimatedDuration: 15, // minutes
      
      // Chapter content
      content: {
        introText: "Welcome to chapter 1...",
        items: [
          {
            type: "quiz",
            id: "quiz_123",
            title: "Count Objects",
            required: true
          },
          {
            type: "puzzle",
            id: "puzzle_456",
            title: "Match Numbers",
            required: false
          }
        ],
        outroText: "Great job! Chapter complete."
      },
      
      // Unlock rules
      unlockRules: {
        type: "sequential", // unlock after prev chapter
        minScore: 60, // % to proceed
        practiceRequired: false
      },
      
      // Retry policy
      retryPolicy: "unlimited", // or "limited:3" or "once"
      hintCount: 3,
      
      // Rewards
      rewards: {
        xp: 100,
        coins: 10,
        badge: "first_chapter"
      }
    }
    // more chapters...
  ],
  
  // Story settings
  unlockSequence: "sequential",
  certificateOnCompletion: true,
  minChaptersForCertificate: 3,
  
  // Admin info
  createdBy: "admin_123",
  createdAt: timestamp,
  updatedAt: timestamp,
  published: true,
  stats: {
    usersStarted: 145,
    usersCompleted: 89,
    avgScore: 87
  }
}
```

### Collection: /user_story_progress/{userId}/stories/{storyId}

```javascript
{
  storyId: "story_001",
  userId: "user_123",
  
  // Progress tracking
  startedAt: timestamp,
  lastAccessedAt: timestamp,
  completedAt: null, // timestamp when finished
  
  // Chapter-level progress
  currentChapter: 2, // index of current chapter
  completedChapters: [0, 1], // chapter indices completed
  chapterProgress: {
    "0": {
      startedAt: timestamp,
      completedAt: timestamp,
      score: 85,
      retryCount: 1,
      items: {
        "quiz_123": { completed: true, score: 90 },
        "puzzle_456": { completed: true, score: 80 }
      }
    },
    "1": {
      startedAt: timestamp,
      completedAt: timestamp,
      score: 92,
      retryCount: 0,
      items: { /* ... */ }
    }
  },
  
  // Overall stats
  overallScore: 88,
  totalRetries: 1,
  totalHintsUsed: 2,
  estimatedTimeSpent: 45, // minutes
  
  // Certificate
  certificate: {
    earned: false,
    earnedAt: null,
    downloadedAt: null
  },
  
  // Flags
  isActive: true,
  isLocked: false,
  lockReason: null
}
```

---

## 🔨 Implementation Steps

### STEP 1: Create Database Schema

**File:** `src/story/services/storyService.js` (400 lines)

```javascript
import { db } from '../../firebase/firebaseConfig';
import { collection, doc, getDocs, getDoc, setDoc, updateDoc, query, where } from 'firebase/firestore';

// Story CRUD
export async function createStory(storyData) {
  const storyRef = collection(db, 'stories');
  const newStory = {
    ...storyData,
    createdAt: new Date(),
    updatedAt: new Date(),
    published: false,
    stats: { usersStarted: 0, usersCompleted: 0, avgScore: 0 }
  };
  const docRef = await addDoc(storyRef, newStory);
  return docRef.id;
}

export async function getStory(storyId) {
  const storyRef = doc(db, 'stories', storyId);
  const snap = await getDoc(storyRef);
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function updateStory(storyId, updates) {
  const storyRef = doc(db, 'stories', storyId);
  await updateDoc(storyRef, {
    ...updates,
    updatedAt: new Date()
  });
}

export async function getAllPublishedStories() {
  const q = query(
    collection(db, 'stories'),
    where('published', '==', true)
  );
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function getStoriesByCategory(category) {
  const q = query(
    collection(db, 'stories'),
    where('category', '==', category),
    where('published', '==', true)
  );
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Story progress tracking
export async function startStory(userId, storyId) {
  const progressRef = doc(
    db,
    'user_story_progress',
    userId,
    'stories',
    storyId
  );
  
  const snap = await getDoc(progressRef);
  if (snap.exists()) return snap.data(); // Already started

  const progress = {
    storyId,
    userId,
    startedAt: new Date(),
    currentChapter: 0,
    completedChapters: [],
    chapterProgress: {},
    overallScore: 0,
    totalRetries: 0,
    totalHintsUsed: 0,
    estimatedTimeSpent: 0,
    certificate: { earned: false },
    isActive: true,
    isLocked: false
  };

  await setDoc(progressRef, progress);
  return progress;
}

export async function getUserStoryProgress(userId, storyId) {
  const progressRef = doc(
    db,
    'user_story_progress',
    userId,
    'stories',
    storyId
  );
  const snap = await getDoc(progressRef);
  return snap.exists() ? snap.data() : null;
}

export async function updateChapterProgress(userId, storyId, chapterIndex, chapterData) {
  const progressRef = doc(
    db,
    'user_story_progress',
    userId,
    'stories',
    storyId
  );

  const snap = await getDoc(progressRef);
  const progress = snap.data();

  // Update chapter progress
  const updated = {
    ...progress,
    chapterProgress: {
      ...progress.chapterProgress,
      [chapterIndex]: {
        ...chapterData,
        completedAt: new Date()
      }
    },
    completedChapters: [...new Set([...progress.completedChapters, chapterIndex])],
    currentChapter: chapterIndex + 1,
    lastAccessedAt: new Date()
  };

  // Recalculate overall score
  const scores = Object.values(updated.chapterProgress).map(ch => ch.score || 0);
  updated.overallScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);

  await updateDoc(progressRef, updated);
  return updated;
}

export async function completeStory(userId, storyId) {
  const progressRef = doc(
    db,
    'user_story_progress',
    userId,
    'stories',
    storyId
  );

  await updateDoc(progressRef, {
    completedAt: new Date(),
    'certificate.earned': true,
    'certificate.earnedAt': new Date(),
    isActive: false
  });
}

export async function getUserStories(userId) {
  const collectionRef = collection(
    db,
    'user_story_progress',
    userId,
    'stories'
  );
  const snap = await getDocs(collectionRef);
  return snap.docs.map(doc => doc.data());
}

// Helper: Check if can proceed to next chapter
export function canProceedToNextChapter(progress, chapterIndex) {
  const chapter = progress.chapterProgress[chapterIndex];
  if (!chapter) return false;

  const unlockRules = /* get from story definition */;
  return chapter.score >= unlockRules.minScore;
}

// Helper: Get chapter hint
export function getChapterHint(chapter, itemId, hints) {
  if (hints.length === 0) return "No more hints available";
  return hints[Math.floor(Math.random() * hints.length)];
}
```

### STEP 2: Create Progress Service

**File:** `src/story/services/storyProgressService.js` (300 lines)

```javascript
// Specialized progress tracking for stories
import { getUserStoryProgress, updateChapterProgress } from './storyService';

export async function recordChapterCompletion(userId, storyId, chapterIndex, itemResults) {
  const progress = await getUserStoryProgress(userId, storyId);
  const chapter = progress.chapterProgress[chapterIndex] || {};

  // Aggregate item scores
  const scores = Object.values(itemResults).map(item => item.score);
  const avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);

  // Record chapter data
  const chapterData = {
    startedAt: chapter.startedAt || new Date(),
    score: avgScore,
    retryCount: (chapter.retryCount || 0) + (itemResults.isRetry ? 1 : 0),
    items: itemResults
  };

  await updateChapterProgress(userId, storyId, chapterIndex, chapterData);

  // Check for rewards (XP, coins, badges)
  const rewards = calculateRewards(avgScore, chapterIndex);
  if (rewards) {
    await grantRewards(userId, rewards);
  }

  return { success: true, rewards };
}

function calculateRewards(score, chapterIndex) {
  const baseXP = 100;
  const bonusXP = score >= 90 ? 50 : score >= 75 ? 25 : 0;
  
  return {
    xp: baseXP + bonusXP,
    coins: Math.floor((baseXP + bonusXP) / 10),
    badge: chapterIndex === 0 ? 'first_chapter' : null
  };
}

async function grantRewards(userId, rewards) {
  // Integrate with gamification service
  // await updateUserXP(userId, rewards.xp);
  // await addCoins(userId, rewards.coins);
}

export function calculateTimeSpent(startedAt) {
  const now = new Date();
  return Math.round((now - startedAt) / 1000 / 60); // minutes
}

export function getChapterDifficulty(chapterIndex) {
  const difficulties = ['easy', 'easy', 'medium', 'medium', 'hard', 'hard', 'expert'];
  return difficulties[Math.min(chapterIndex, difficulties.length - 1)];
}

export function getRetryPolicy(storyId, chapterIndex) {
  // Load from story definition
  return 'unlimited'; // or 'limited:3', 'once'
}
```

### STEP 3: Create UI Components

**File:** `src/story/components/StoryCard.jsx` (150 lines)

```javascript
import React from 'react';
import '../styles/story.css';

export function StoryCard({ story, progress, onStart, onContinue }) {
  const isStarted = !!progress?.startedAt;
  const isCompleted = !!progress?.completedAt;
  const progressPercent = progress
    ? (progress.completedChapters.length / story.chapters.length) * 100
    : 0;

  return (
    <div className="story-card">
      <div className="story-cover">
        <img src={story.coverImage} alt={story.title} />
        {isCompleted && <div className="badge-completed">✓ Completed</div>}
        {isStarted && !isCompleted && (
          <div className="badge-in-progress">{Math.round(progressPercent)}%</div>
        )}
      </div>

      <div className="story-info">
        <h3>{story.title}</h3>
        <p className="description">{story.description}</p>

        <div className="story-meta">
          <span className="chapters">{story.chapters.length} chapters</span>
          <span className="difficulty">{story.difficulty}</span>
        </div>

        {isStarted && (
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
          </div>
        )}

        <div className="story-actions">
          {!isStarted && <button onClick={onStart}>Start Story</button>}
          {isStarted && !isCompleted && <button onClick={onContinue}>Continue</button>}
          {isCompleted && (
            <button className="btn-view-cert">View Certificate</button>
          )}
        </div>
      </div>
    </div>
  );
}
```

### STEP 4: Create Main Pages

**File:** `src/story/pages/StoriesPage.jsx` (200 lines)

```javascript
import React, { useState, useEffect } from 'react';
import { getAllPublishedStories, getUserStories } from '../services/storyService';
import { StoryCard } from '../components/StoryCard';
import '../styles/story.css';

export function StoriesPage({ userId, onSelectStory }) {
  const [stories, setStories] = useState([]);
  const [userProgress, setUserProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, started, completed

  useEffect(() => {
    loadStories();
  }, [userId]);

  async function loadStories() {
    try {
      const allStories = await getAllPublishedStories();
      const progress = await getUserStories(userId);
      
      const progressMap = {};
      progress.forEach(p => {
        progressMap[p.storyId] = p;
      });

      setStories(allStories);
      setUserProgress(progressMap);
    } catch (error) {
      console.error('Error loading stories:', error);
    } finally {
      setLoading(false);
    }
  }

  const filteredStories = stories.filter(story => {
    if (filter === 'started') return userProgress[story.id]?.startedAt;
    if (filter === 'completed') return userProgress[story.id]?.completedAt;
    return true;
  });

  if (loading) return <div>Loading stories...</div>;

  return (
    <div className="stories-page">
      <h1>📚 Learning Stories</h1>

      <div className="filter-buttons">
        <button
          className={filter === 'all' ? 'active' : ''}
          onClick={() => setFilter('all')}
        >
          All Stories
        </button>
        <button
          className={filter === 'started' ? 'active' : ''}
          onClick={() => setFilter('started')}
        >
          In Progress
        </button>
        <button
          className={filter === 'completed' ? 'active' : ''}
          onClick={() => setFilter('completed')}
        >
          Completed
        </button>
      </div>

      <div className="stories-grid">
        {filteredStories.map(story => (
          <StoryCard
            key={story.id}
            story={story}
            progress={userProgress[story.id]}
            onStart={() => onSelectStory(story.id, 'start')}
            onContinue={() => onSelectStory(story.id, 'continue')}
          />
        ))}
      </div>
    </div>
  );
}
```

### STEP 5: Create Chapter Player

**File:** `src/story/pages/ChapterPlayPage.jsx` (300 lines)

```javascript
import React, { useState, useEffect } from 'react';
import { getStory, getUserStoryProgress } from '../services/storyService';
import { recordChapterCompletion } from '../services/storyProgressService';
import '../styles/story.css';

export function ChapterPlayPage({ userId, storyId, chapterIndex, onComplete }) {
  const [story, setStory] = useState(null);
  const [progress, setProgress] = useState(null);
  const [currentItem, setCurrentItem] = useState(0);
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChapter();
  }, [storyId, userId]);

  async function loadChapter() {
    const storyData = await getStory(storyId);
    const progressData = await getUserStoryProgress(userId, storyId);
    setStory(storyData);
    setProgress(progressData);
    setLoading(false);
  }

  async function handleItemComplete(itemResult) {
    const newResults = {
      ...results,
      [currentItem]: itemResult
    };
    setResults(newResults);

    const chapter = story.chapters[chapterIndex];
    if (currentItem < chapter.content.items.length - 1) {
      // Next item
      setCurrentItem(currentItem + 1);
    } else {
      // Chapter complete
      await completeChapter(newResults);
    }
  }

  async function completeChapter(itemResults) {
    const completion = await recordChapterCompletion(
      userId,
      storyId,
      chapterIndex,
      itemResults
    );

    onComplete({
      chapterIndex,
      results: itemResults,
      rewards: completion.rewards
    });
  }

  if (loading) return <div>Loading chapter...</div>;
  if (!story) return <div>Story not found</div>;

  const chapter = story.chapters[chapterIndex];
  const item = chapter.content.items[currentItem];
  const itemsCount = chapter.content.items.length;

  return (
    <div className="chapter-play-page">
      <div className="chapter-header">
        <h2>{chapter.title}</h2>
        <div className="progress">
          {currentItem + 1} / {itemsCount}
        </div>
      </div>

      <div className="chapter-content">
        <p>{chapter.content.introText}</p>

        {/* Render quiz or puzzle based on item type */}
        {item.type === 'quiz' && (
          <QuizPlayer
            quizId={item.id}
            onComplete={handleItemComplete}
          />
        )}

        {item.type === 'puzzle' && (
          <PuzzlePlayer
            puzzleId={item.id}
            onComplete={handleItemComplete}
          />
        )}
      </div>

      <div className="chapter-footer">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${((currentItem + 1) / itemsCount) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
```

### STEP 6: Create Admin Tools

**File:** `src/story/admin/StoryEditor.jsx` (400 lines)

```javascript
import React, { useState } from 'react';
import { createStory, updateStory, getStory } from '../services/storyService';

export function StoryEditor({ storyId, onSave, onCancel }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'general',
    difficulty: 'easy',
    ageGroup: [6, 12],
    chapters: [],
    icon: '📚'
  });

  const handleAddChapter = () => {
    setForm({
      ...form,
      chapters: [
        ...form.chapters,
        {
          id: `ch_${Date.now()}`,
          title: '',
          order: form.chapters.length,
          description: '',
          difficulty: 'easy',
          estimatedDuration: 15,
          content: { items: [] },
          unlockRules: { type: 'sequential', minScore: 60 },
          retryPolicy: 'unlimited',
          rewards: { xp: 100, coins: 10 }
        }
      ]
    });
  };

  const handleSave = async () => {
    try {
      if (storyId) {
        await updateStory(storyId, form);
      } else {
        const newId = await createStory(form);
        onSave(newId);
      }
      alert('Story saved successfully!');
    } catch (error) {
      alert('Error saving story: ' + error.message);
    }
  };

  return (
    <div className="story-editor">
      <h2>{storyId ? 'Edit Story' : 'Create New Story'}</h2>

      <div className="form-group">
        <label>Title</label>
        <input
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Enter story title"
        />
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Story description"
        />
      </div>

      <div className="form-group">
        <label>Difficulty</label>
        <select
          value={form.difficulty}
          onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      <h3>Chapters ({form.chapters.length})</h3>
      <button onClick={handleAddChapter}>+ Add Chapter</button>

      {form.chapters.map((chapter, idx) => (
        <ChapterBuilder
          key={chapter.id}
          chapter={chapter}
          onChange={(updated) => {
            const newChapters = [...form.chapters];
            newChapters[idx] = updated;
            setForm({ ...form, chapters: newChapters });
          }}
        />
      ))}

      <div className="form-actions">
        <button onClick={handleSave} className="btn-primary">
          Save Story
        </button>
        <button onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
      </div>
    </div>
  );
}

function ChapterBuilder({ chapter, onChange }) {
  return (
    <div className="chapter-builder">
      <h4>Chapter {chapter.order + 1}: {chapter.title}</h4>
      
      <input
        value={chapter.title}
        onChange={(e) =>
          onChange({ ...chapter, title: e.target.value })
        }
        placeholder="Chapter title"
      />

      <textarea
        value={chapter.description}
        onChange={(e) =>
          onChange({ ...chapter, description: e.target.value })
        }
        placeholder="Chapter description"
      />

      {/* Item builder would go here */}
    </div>
  );
}
```

### STEP 7: Create Styling

**File:** `src/story/styles/story.css` (400 lines)

```css
/* ================================
   STORY PAGE
================================ */

.stories-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.stories-page h1 {
  font-size: 2.5rem;
  margin-bottom: 30px;
  color: #2c3e50;
}

.filter-buttons {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
}

.filter-buttons button {
  padding: 10px 20px;
  border: 2px solid #e0e0e0;
  background: white;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s;
}

.filter-buttons button.active {
  background: #4CAF50;
  color: white;
  border-color: #4CAF50;
}

.stories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

/* ================================
   STORY CARD
================================ */

.story-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.story-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 16px rgba(0,0,0,0.15);
}

.story-cover {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.story-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.badge-completed,
.badge-in-progress {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 8px 16px;
  background: rgba(0,0,0,0.7);
  color: white;
  border-radius: 20px;
  font-weight: bold;
}

.badge-completed {
  background: #4CAF50;
}

.badge-in-progress {
  background: #FF9800;
}

.story-info {
  padding: 20px;
}

.story-info h3 {
  font-size: 1.3rem;
  margin-bottom: 10px;
  color: #2c3e50;
}

.story-info .description {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 12px;
  line-height: 1.4;
}

.story-meta {
  display: flex;
  gap: 15px;
  margin: 15px 0;
  font-size: 0.85rem;
  color: #999;
}

.progress-bar {
  width: 100%;
  height: 6px;
  background: #e0e0e0;
  border-radius: 3px;
  overflow: hidden;
  margin: 12px 0;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4CAF50, #45a049);
  transition: width 0.3s;
}

.story-actions {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.story-actions button {
  flex: 1;
  padding: 12px;
  border: none;
  background: #4CAF50;
  color: white;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.3s;
}

.story-actions button:hover {
  background: #45a049;
}

/* ================================
   CHAPTER PLAY PAGE
================================ */

.chapter-play-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

.chapter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #e0e0e0;
}

.chapter-header h2 {
  font-size: 2rem;
  color: #2c3e50;
}

.progress {
  font-size: 1.2rem;
  color: #4CAF50;
  font-weight: bold;
}

.chapter-content {
  background: white;
  padding: 30px;
  border-radius: 12px;
  margin-bottom: 20px;
}

.chapter-footer {
  margin-top: 30px;
}

/* Responsive */
@media (max-width: 768px) {
  .stories-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 15px;
  }

  .story-cover {
    height: 150px;
  }

  .chapter-header {
    flex-direction: column;
    gap: 15px;
  }
}
```

---

## ✅ Implementation Checklist

- [ ] Create `storyService.js` (CRUD operations)
- [ ] Create `storyProgressService.js` (Progress tracking)
- [ ] Create all components (StoryCard, StoryBrowser, etc.)
- [ ] Create main pages (StoriesPage, ChapterPlayPage)
- [ ] Create admin tools (StoryEditor, ChapterBuilder)
- [ ] Create styling (story.css)
- [ ] Add route: `/stories` → StoriesPage
- [ ] Add route: `/story/:storyId` → StoryDetailPage
- [ ] Add route: `/story/:storyId/chapter/:chapterIndex` → ChapterPlayPage
- [ ] Test story creation (admin)
- [ ] Test chapter progression
- [ ] Test progress saving
- [ ] Test certificate generation
- [ ] Integrate with gamification (rewards)
- [ ] Update Navbar with "Stories" link
- [ ] Run full build test
- [ ] Update documentation

---

## 🎬 Testing Scenarios

### Scenario 1: Start & Complete Story
1. Go to StoriesPage
2. Click "Start Story"
3. Complete all items in chapter 1
4. Verify progress saved
5. Verify can start chapter 2
6. Complete all chapters
7. Verify certificate earned
8. ✅ Check XP/coins awarded

### Scenario 2: Retry Chapter
1. Start chapter with difficult content
2. Fail first attempt
3. Click "Retry"
4. Verify retry count incremented
5. Complete on second attempt
6. Verify score saved
7. ✅ Check progression allowed

### Scenario 3: Admin Creates Story
1. Go to admin panel
2. Click "Create Story"
3. Add title, description, difficulty
4. Add 3 chapters
5. Add items to each chapter
6. Publish story
7. Go to StoriesPage
8. ✅ Verify story appears

---

## 🚀 After Phase 5 Complete

1. Run full build test
2. Deploy to staging
3. Test with real users
4. Gather feedback
5. **Move to Phase 6: Monetization**

---

**Ready to implement Phase 5?**
- ✅ All code patterns established
- ✅ Database schema ready
- ✅ UI framework in place
- ✅ No breaking changes needed

**Estimated Time:** 20-25 hours  
**Difficulty:** Medium  
**Status:** Ready to Start ✅
