# Subcategory System Implementation Guide

## Overview

The subcategory system allows you to organize quizzes into a hierarchy:

```
Category (e.g., "Kids")
├── Subcategory (e.g., "Math")
│   ├── Quiz (Easy, Medium, Hard)
│   └── Questions with subcategory field
├── Subcategory (e.g., "English")
│   ├── Quiz
│   └── Questions
└── Subcategory (e.g., "Science")
    ├── Quiz
    └── Questions
```

## What Was Added

### 1. **New Pages**
- **`/src/quiz/SubcategoryPage.jsx`** - Shows subcategories for a selected category
- **`/src/admin/SubcategoryManagement.jsx`** - Admin panel to manage subcategories

### 2. **New Service**
- **`/src/quiz/services/subcategoryService.js`** - Firestore operations for subcategories
  - `getCategory(categoryId)` - Get category by ID
  - `getSubcategoriesByCategory(categoryId)` - Get all published subcategories
  - `getSubcategory(subcategoryId)` - Get specific subcategory
  - `hasSubcategories(categoryId)` - Check if category has subcategories

### 3. **Updated Routes**
- New route: `/subcategories/:categoryId` - Shows subcategories page
- New admin route: `/admin/subcategories` - Subcategory management
- Updated home page navigation to go to subcategories first

### 4. **Database Structure**

**New Collection: `subcategories`**
```
{
  id: "math_basics",
  categoryId: "kids",           // Parent category ID
  name: "math",                 // Internal name
  label: "Math",                // Display name
  description: "Numbers...",    // Optional description
  icon: "🔢",                   // Emoji icon
  isPublished: true,            // Show on home page
  quizCount: 15,                // Number of quizzes
  createdAt: timestamp
}
```

## Implementation Steps

### Step 1: Access Admin Panel
1. Go to `/admin/dashboard`
2. Click "Subcategories" in the sidebar (under Global section)

### Step 2: Create Subcategories
1. Select a category from the left panel
2. Fill in the subcategory form:
   - **Internal Name**: e.g., `math_algebra` (no spaces, lowercase)
   - **Display Label**: e.g., `Algebra` (what users see)
   - **Description**: e.g., `Learn algebra fundamentals`
   - **Icon**: e.g., `🔢`
   - **Publish**: Check to show on home page
3. Click "Add Subcategory"

### Step 3: Manage Subcategories
For each subcategory, you can:
- **Edit** - Change details
- **Publish/Unpublish** - Control visibility
- **Delete** - Remove permanently

### Step 4: Update Questions (Important!)
Currently, questions are stored with a `category` field. To work fully with subcategories, you need to:

**Option A: Update existing questions**
Add a `subcategory` field to each question:
```javascript
{
  id: "q1",
  question: "What is 2+2?",
  category: "kids",              // Keep this
  subcategory: "math",           // Add this
  difficulty: "easy",
  options: ["3", "4", "5", "6"],
  correctAnswer: "4"
}
```

**Option B: Modify quiz page to filter by category OR subcategory**
The quiz page can work with both:
- Direct category ID: `/quiz/kids/easy` → shows all Kids quizzes
- Subcategory ID: `/quiz/math/easy` → shows only Math quizzes

### Step 5: Update Question Import
When importing questions via CSV, add a `subcategory` column:
```
question,options,correctAnswer,category,subcategory,difficulty
"What is 2+2?","3;4;5;6",4,"kids","math","easy"
```

### Step 6: Test the Flow

**Home Page:**
1. Go to `/`
2. Click on a category card
3. You should see subcategories page
4. Click on a subcategory
5. You should see difficulty selection page
6. Select difficulty and play quiz

**Expected behavior:**
- Category card → Subcategory page (lists all subcategories)
- Subcategory card → Difficulty page (shows Easy/Medium/Hard)
- Difficulty button → Quiz starts

## Navigation Flow

```
Home Page
    ↓
Category Selected
    ↓
/subcategories/:categoryId (SubcategoryPage)
    ↓
Subcategory Selected
    ↓
/quiz/:subcategoryId/difficulty (CategoryLevelsPage)
    ↓
Difficulty Selected (easy/medium/hard)
    ↓
/quiz/:subcategoryId/:difficulty/:level (QuizPage)
    ↓
Quiz Starts
```

## Backward Compatibility

The system is backward compatible:
- Categories without subcategories still work
- Questions with only `category` field (no `subcategory`) still work
- You can migrate gradually

To make a category skip subcategories:
- Simply don't create any subcategories for it
- OR set `isPublished: false` on all its subcategories

## Code Example: Filter Questions by Subcategory

```javascript
// In your quiz page or service
const subcategoryId = "math"; // From URL params

const q = query(
  collection(db, "questions"),
  where("subcategory", "==", subcategoryId),
  where("difficulty", "==", difficulty)
);

const snap = await getDocs(q);
```

## Seed Script

To create initial subcategories, run:
```bash
node seedSubcategories.js
```

This creates 5 subcategories for the Kids category:
- Math
- English
- Science
- History
- Geography

Edit the script to customize the subcategories.

## Future Enhancements

1. **Progress Tracking by Subcategory**
   - Track completion per subcategory
   - Show progress bars

2. **Leaderboards by Subcategory**
   - Top performers in each subcategory

3. **Achievements**
   - "Master of Math" badge
   - "Reading Expert" badge

4. **Nested Subcategories**
   - Category → Subcategory → Sub-subcategory
   - e.g., Kids → Math → Algebra → Fractions

5. **Content Organization**
   - Resources and study materials per subcategory
   - Video tutorials
   - Practice worksheets

## Troubleshooting

**Q: Subcategories page is blank**
- A: Check if subcategories are published (`isPublished: true`)
- A: Verify `categoryId` matches the parent category ID

**Q: Questions not showing in quiz**
- A: Questions need `category` or `subcategory` field set correctly
- A: Check if difficulty matches the selected difficulty

**Q: "Cannot navigate" error**
- A: Verify routes are added to `/src/App.js`
- A: Check browser console for errors

## Support

For issues or questions, check:
1. Admin > Subcategories page status messages
2. Browser console (F12 > Console tab)
3. Firebase Firestore data structure
