# Firebase Quiz Seeding Guide

## Overview

A seed script has been created to populate your Firebase Firestore with **11 sample quizzes** (one for each quiz type). You can run this from the **Admin Dashboard** with a single click.

## How to Use

### Step 1: Start Your App
```bash
npm start
```

### Step 2: Navigate to Admin Dashboard
- Go to `http://localhost:3000/admin`
- Find the **❓ Manage Quizzes** section

### Step 3: Click "Seed Sample Quizzes" Button
You'll see three buttons in the Manage Quizzes section:
- 🚀 Create New Quiz
- 📤 Bulk Import Quizzes
- **🌱 Seed Sample Quizzes** ← Click this

### Step 4: Watch the Progress
The dashboard will show:
- Real-time progress (X / 11 quizzes created)
- Quiz title being created
- Success/failure status

### Step 5: View Your Quizzes
Once seeding completes:
- Page auto-refreshes
- Navigate to `/quiz` page
- All 11 sample quizzes appear
- Each is fully playable

## What Gets Created

### 11 Sample Quizzes in Firebase

| # | Type | Title | Quiz ID |
|---|------|-------|---------|
| 1 | MCQ | 🎯 Basic MCQ Quiz | sample_mcq_001 |
| 2 | MULTI_SELECT | ✓ Multiple Answer Quiz | sample_multi_select_001 |
| 3 | TRUE_FALSE | ✓✗ True or False Quiz | sample_true_false_001 |
| 4 | FILL_BLANK | 📝 Fill in the Blank | sample_fill_blank_001 |
| 5 | MATCHING | 🔗 Matching Pairs | sample_matching_001 |
| 6 | ORDERING | 📊 Sequence Ordering | sample_ordering_001 |
| 7 | PUZZLE | 🧩 Puzzle Assembly | sample_puzzle_001 |
| 8 | DRAG_DROP | 🎯 Drag & Drop | sample_drag_drop_001 |
| 9 | CODING | 💻 Code Challenge | sample_coding_001 |
| 10 | IMAGE_BASED | 🖼️ Image Selection | sample_image_based_001 |
| 11 | AUDIO_BASED | 🎵 Audio Listening | sample_audio_based_001 |

### Each Quiz Includes
- ✅ Complete title and description
- ✅ Category (science, history, geography, etc.)
- ✅ Difficulty level (Easy, Medium, Hard)
- ✅ 2-4 fully formatted questions
- ✅ Type-specific answer configurations
- ✅ Hints and explanations for each question
- ✅ Rating (4.0-4.7 stars)
- ✅ Play count metadata
- ✅ Time estimates
- ✅ Published status: `true`
- ✅ Timestamps (createdAt, updatedAt)

## Technical Details

### Files Involved

**New File: `/src/scripts/seedSampleQuizzes.js`**
- Contains `seedSampleQuizzes()` function
- Includes QUIZ_SEED_DATA with all 11 quiz definitions
- Supports progress callbacks
- Handles errors gracefully

**Modified File: `/src/admin/ModernAdminDashboard.jsx`**
- Added import for `seedSampleQuizzes`
- Added state variables: `seedingQuizzes`, `seedProgress`, `seedResults`
- Added `handleSeedQuizzes()` function
- Added UI button and progress/results display

**Modified File: `/src/pages/QuizzesPage.jsx`**
- Removed SAMPLE_QUIZZES import
- Changed to load only from Firebase (no mock data)
- Shows empty state if no quizzes exist

### Seed Script Function

```javascript
async function seedSampleQuizzes(onProgress = null) {
  // Loops through all 11 quizzes
  // Adds each to Firestore /quizzes collection
  // Calls onProgress callback for each quiz
  // Returns { success, failed, errors, createdIds }
}
```

### Progress Callback

```javascript
onProgress({
  current: 5,              // Quiz 5 of 11
  total: 11,               // Total quizzes
  title: "🎯 Basic MCQ Quiz",  // Quiz being created
  status: 'success'        // 'success' or 'error'
})
```

## Database Structure

Each quiz is stored in Firestore at: `quizzes/{docId}`

```javascript
{
  title: "🎯 Basic MCQ Quiz",
  description: "...",
  category: "science",
  difficulty: "Easy",
  audience: "all",
  quizType: "MCQ",
  rating: 4.5,
  plays: 245,
  totalQuestions: 3,
  avgTime: "5 min",
  
  questions: [
    {
      id: "q1",
      sequence: 1,
      quizType: "MCQ",
      points: 10,
      question: {
        contentItems: [
          {
            id: "c1",
            type: "text",
            value: "What is the capital of France?",
            url: ""
          }
        ]
      },
      answer: {
        options: [
          { key: "A", text: "London", media: null },
          { key: "B", text: "Paris", media: null },
          { key: "C", text: "Berlin", media: null },
          { key: "D", text: "Madrid", media: null }
        ],
        correctOption: "B"
      },
      hint: "It's known as the City of Light",
      explanation: "Paris is the capital of France..."
    }
  ],
  
  createdAt: Timestamp,
  updatedAt: Timestamp,
  published: true
}
```

## Testing

### After Seeding:

1. ✅ Check Firebase Console
   - Go to Firebase > Firestore
   - Open `/quizzes` collection
   - Should see 11 new documents

2. ✅ Visit `/quiz` Page
   - See all 11 quizzes displayed
   - Each has title, category, rating, plays

3. ✅ Click Any Quiz
   - Should open quiz player
   - Questions load correctly
   - Answer inputs work (MCQ, text, etc.)
   - Submit button works

4. ✅ Check Quiz Types
   - MCQ: 4 options, single select
   - MULTI_SELECT: 4 options, checkboxes
   - TRUE_FALSE: True/False toggle
   - FILL_BLANK: Text input field
   - MATCHING: Drag-and-drop pairs
   - ORDERING: Drag items to sort
   - PUZZLE: Puzzle piece assembly
   - DRAG_DROP: Category-based sorting
   - CODING: Code editor
   - IMAGE_BASED: Click on image region
   - AUDIO_BASED: Audio player + MCQ

## Troubleshooting

### "Button is disabled / grayed out"
- Seeding already in progress
- Wait for it to complete
- Check console for errors

### "Failed to create quizzes"
- Check Firebase permissions
- Ensure `quizzes` collection exists
- Check internet connection
- Look at browser console for errors

### "Quizzes not appearing on /quiz page"
- Wait 2-3 seconds for page refresh
- Refresh manually: `Ctrl+R` or `Cmd+R`
- Check that `published: true` is set
- Check audience matches filter

### "Wrong quiz data showing"
- Clear browser cache: `Ctrl+Shift+Delete`
- Hard refresh: `Ctrl+Shift+R`
- Check Firestore for duplicates

## Reverting / Deleting Seeded Quizzes

To delete all seeded quizzes:

1. Go to Firebase Console
2. Open Firestore > `quizzes` collection
3. Filter by IDs starting with `sample_`
4. Delete each document

Or use code:
```javascript
import { deleteSampleQuizzes } from '../scripts/seedSampleQuizzes';

// Delete by IDs
await deleteSampleQuizzes([
  'sample_mcq_001',
  'sample_multi_select_001',
  // ... etc
]);
```

## Next Steps

1. ✅ Click "🌱 Seed Sample Quizzes" button
2. ✅ Wait for seeding to complete
3. ✅ Navigate to `/quiz` page
4. ✅ Test playing each quiz type
5. ✅ Create your own quizzes using "🚀 Create New Quiz"
6. ✅ Use Bulk Import for many quizzes at once

## Features

✅ **One-Click Seeding** - No manual Firebase setup needed  
✅ **Real Firebase Storage** - All data persists in Firestore  
✅ **Progress Tracking** - Real-time feedback on creation  
✅ **Error Handling** - Graceful errors with details  
✅ **All 11 Types** - Complete quiz type coverage  
✅ **Complete Data** - Questions, hints, answers included  
✅ **Auto-Refresh** - Page reloads to show quizzes  

---

**Created**: Session 19  
**Status**: Ready to Use ✅
