# 🧩 Puzzle Creation Testing Guide

## Setup Instructions

### Step 1: Initialize Puzzle Feature & Sample Data

**IMPORTANT:** You must run this setup script first!

1. Open the app in browser: `http://localhost:3000`
2. Open **Browser Console** (F12 or Cmd+Option+I)
3. Copy the entire content of `/setupPuzzleFeature.js` (in project root)
4. Paste into the browser console
5. Press Enter
6. Wait for ✅ "Puzzle Feature Setup Complete!" message
7. **Important**: Hard refresh the page (Cmd+Shift+R or Ctrl+Shift+R)

**What this does:**
- Creates "Puzzles" feature
- Creates 2 categories: "Visual Puzzles" and "Traditional Puzzles"
- Creates 7 topics (Picture Word, Spot Difference, Find Pairs, Picture Shadow, Matching Pairs, Ordering, Drag & Drop)
- Creates subtopics for each topic

---

## Testing Traditional Puzzles

### 1️⃣ Create Your First Traditional Puzzle

**Navigate to:** Admin Panel → Puzzles → + Add Traditional Puzzle

OR direct URL: `http://localhost:3000/admin/add-puzzle`

**Form Fields:**

| Field | Example | Notes |
|-------|---------|-------|
| **Title** | "Match the Numbers 1-5" | Name of the puzzle |
| **Description** | "Match numbers with their visual representation" | Brief description |
| **Category** | Traditional Puzzles | Select category |
| **Topic** | Matching Pairs | Select topic |
| **Puzzle Type** | Matching | Choose from: Matching, Ordering, Drag & Drop |
| **Specific Config** | (See below by type) | Configuration for puzzle type |

**Type Configurations:**

#### A) Matching Type
```
Pairs: 3

Example:
- Pair 1: Left Item = "Apple" | Right Item = "🍎"
- Pair 2: Left Item = "Banana" | Right Item = "🍌"  
- Pair 3: Left Item = "Orange" | Right Item = "🍊"
```

#### B) Ordering Type
```
Items: 4

Example:
- Item 1: "First"
- Item 2: "Second"
- Item 3: "Third"
- Item 4: "Fourth"

(User must order: 1,2,3,4 → Correct!)
```

#### C) Drag & Drop Type
```
Draggables: 3
- Draggable 1: "Cat"
- Draggable 2: "Dog"
- Draggable 3: "Bird"

Targets: 3
- Target 1: "🐱 (Correct: Cat)"
- Target 2: "🐶 (Correct: Dog)"
- Target 3: "🐦 (Correct: Bird)"

(User drags items to correct targets)
```

**After Filling Form:**
1. Click **"Save Puzzle"** button
2. Should see: "Puzzle saved! ✨" message
3. Redirects back to puzzle list
4. New puzzle appears in table

---

### 2️⃣ Verify Traditional Puzzle in List

**Navigate to:** `http://localhost:3000/admin/puzzles`

**Check:**
- ✅ Your new puzzle appears in table
- ✅ Shows correct Title, Type, Category
- ✅ Can search by title
- ✅ Can filter by type
- ✅ Can sort by columns
- ✅ Can delete puzzle
- ✅ Can bulk select and delete

---

## Testing Visual Puzzles

### 1️⃣ Create Your First Visual Puzzle

**Navigate to:** Admin Panel → Puzzles → + Create Visual Puzzle

OR direct URL: `http://localhost:3000/admin/create-visual-puzzle`

**Step 1: Basic Information**

| Field | Example |
|-------|---------|
| **Puzzle Title** | "Match Picture Words" |
| **Description** | "Match pictures with words" |

**Step 2: Choose Puzzle Type**

Choose ONE of 5 types:

#### Option 1: Picture Word (🖼️ + 📝)
- Match pictures with words
- Example: Show apple picture → match with "Apple" word

#### Option 2: Spot the Difference (👀)
- Show two similar images
- User finds 5-10 differences
- Example: Image A vs Image B with slight differences

#### Option 3: Find Pairs (🔄)
- Memory/matching game
- Show hidden cards
- User flips cards to find matching pairs
- Example: 8 cards (4 pairs) shown face-down

#### Option 4: Picture Shadow (🔦)
- Match shadow with picture
- Show object and shadow
- User matches shape to shadow

#### Option 5: Ordering (📊)
- Drag items to correct order
- Example: Order pictures from smallest to largest

**Step 3: Puzzle Category & Topic**

| Field | Example |
|-------|---------|
| **Category** | Visual Puzzles |
| **Topic** | Picture Word |
| **SubTopic** | Level 1 |

**Step 4: Configure Puzzle Content**

This changes based on puzzle type selected:

**For Picture Word:**
```
Word-Picture Pair 1:
  - Word: "Cat"
  - Picture URL: https://example.com/cat.png
  - (Add 3-5 pairs)
```

**For Spot the Difference:**
```
Image A: https://example.com/image-a.png
Image B: https://example.com/image-b.png
Difference Count: 5
Hints Allowed: 3
```

**For Find Pairs:**
```
Pair 1:
  - Item A: https://example.com/apple.png
  - Item B: https://example.com/apple.png (same)
  - (Add 3-5 pairs, total 6-10 items)
```

**For Picture Shadow:**
```
Shape-Shadow Pair 1:
  - Picture: https://example.com/cup.png
  - Shadow: https://example.com/cup-shadow.png
  - (Add 3-4 pairs)
```

**For Ordering:**
```
Item 1: https://example.com/small-apple.png
Item 2: https://example.com/medium-apple.png
Item 3: https://example.com/large-apple.png

Correct Order: 1 → 2 → 3
```

**Step 5: Additional Settings**

| Field | Example |
|-------|---------|
| **Difficulty** | Easy, Medium, Hard |
| **Age Group** | 6-8, 9-11, 12+ |
| **XP Reward** | 10 (points for completing) |
| **Published** | ☑️ Yes |

**After Configuration:**
1. Click **"Save Puzzle"** button
2. Should see: "Puzzle saved! ✨" message
3. Returns to create form (ready for next puzzle)

---

### 2️⃣ Verify Visual Puzzle in List

**Navigate to:** `http://localhost:3000/admin/puzzles`

**Check:**
- ✅ Visual puzzle appears in table
- ✅ Shows "picture-word", "spot-difference", etc. in Type column
- ✅ Category is "Visual Puzzles"
- ✅ Can filter by type
- ✅ Can search by title
- ✅ Can delete

---

## Admin Panel Features

### 📋 Sidebar Navigation (Collapsed by Default)

**Global Section** (Click to expand)
- 📊 Dashboard
- 📁 Features & Categories
- ➕ Add Content (questions + table)
- 🏆 Scores
- ⚙️ System Tools
- 🤖 Automation Tests

**Quiz Section** (Click to expand)
- 📄 View Questions
- 📊 Quiz Analytics
- 🎬 Quiz UI Animations

**Puzzles Section** (Click to expand)
- 📑 Puzzle List
- ✏️ Add Traditional Puzzle
- 🎨 Create Visual Puzzle
- 🎮 Puzzle Games (coming soon)

### ✨ Features

#### Features & Categories Page
- **Before:** All 4 sections expanded (Global, Features, Categories, Topics, SubTopics)
- **After:** All sections collapsed - click to expand
- Each section shows blue header when expanded

#### Add Content Page
- **Add Questions Manually:** Form at top
- **Bulk Import:** CSV/Excel upload
- **View Questions Table:** Below bulk import with:
  - Search by question text
  - Filter by feature, category, subtopic, difficulty
  - Sort by any column
  - Bulk delete (select multiple)
  - Individual delete or edit

#### Puzzle List Page
- **Search:** Title and description
- **Filter by Type:** Matching, Ordering, Drag, Picture-Word, etc.
- **Filter by Category:** Visual Puzzles, Traditional Puzzles
- **Sort:** Click columns to sort
- **Bulk Operations:** Select and delete multiple puzzles
- **Individual Actions:** Edit or delete single puzzle

---

## Common Issues & Solutions

### Issue 1: "No categories showing in Visual Puzzle create page"

**Problem:** Puzzle feature not created yet

**Solution:**
1. Run the setupPuzzleFeature.js script (see Step 1 above)
2. Check browser console for ✅ messages
3. Hard refresh page (Cmd+Shift+R)

### Issue 2: "Puzzle doesn't appear after creating"

**Problem:** Page might not be refreshing categories list

**Solution:**
1. Go to Puzzle List page
2. Refresh page (Cmd+R or F5)
3. Should see your puzzle

### Issue 3: "Traditional Puzzle page opens in new window"

**Problem:** Page not using AdminLayout

**Solution:**
1. ✅ Already fixed! Page now opens in admin panel
2. Ensure you have latest code

### Issue 4: "Admin sections are still expanded by default"

**Problem:** Sidebar state not reset

**Solution:**
1. Hard refresh page (Cmd+Shift+R)
2. Clear browser cache
3. Check console for errors

### Issue 5: "Getting feature type error in console"

**Problem:** Puzzle feature has incorrect featureType field

**Solution:**
1. Run setupPuzzleFeature.js script again
2. Or manually update Puzzles feature in Firestore:
   - Collection: features
   - Document: Puzzles
   - Add field: featureType = "puzzle"

---

## Sample Puzzle Ideas

### Traditional Puzzles

**Matching:**
- Numbers (1,2,3) ↔️ (one, two, three)
- Animals (🐱, 🐶, 🐭) ↔️ (Cat, Dog, Mouse)
- Colors (Red, Blue, Green) ↔️ (🔴, 🔵, 🟢)

**Ordering:**
- Numbers: 3, 1, 5, 2, 4 → Sort: 1, 2, 3, 4, 5
- Sequence: Small, Medium, Large → Order objects by size
- Alphabet: D, A, C, B → Sort alphabetically

**Drag & Drop:**
- Drag countries to continents
- Drag animals to habitats
- Drag fruits to containers

### Visual Puzzles

**Picture Word:**
- Cat image + "Cat" word
- Apple image + "Apple" word
- House image + "House" word

**Spot the Difference:**
- Forest scene A vs B (missing tree, different colors, etc.)
- Room scene with 5 differences
- Animal scene with changed details

**Find Pairs:**
- 4 pairs of animal images (8 cards total)
- 5 pairs of objects (10 cards total)
- 3 pairs of colors (6 cards total)

**Picture Shadow:**
- Cup image + Cup shadow
- Star image + Star shadow
- Tree image + Tree shadow

**Ordering:**
- Small apple → Medium apple → Large apple
- Baby → Child → Adult
- Seed → Sprout → Plant → Flower

---

## Database Structure Created

```
Puzzles Feature
├─ Visual Puzzles (Category)
│  ├─ Picture Word (Topic)
│  │  ├─ Level 1 (SubTopic)
│  │  ├─ Level 2 (SubTopic)
│  │  └─ Level 3 (SubTopic)
│  ├─ Spot the Difference (Topic)
│  │  ├─ Easy (SubTopic)
│  │  ├─ Medium (SubTopic)
│  │  └─ Hard (SubTopic)
│  ├─ Find Pairs (Topic)
│  │  ├─ Animals (SubTopic)
│  │  └─ Numbers (SubTopic)
│  └─ Picture Shadow (Topic)
│     └─ Shape Matching (SubTopic)
│
└─ Traditional Puzzles (Category)
   ├─ Matching Pairs (Topic)
   │  ├─ Basic (SubTopic)
   │  └─ Advanced (SubTopic)
   ├─ Ordering (Topic)
   │  ├─ Number Sequence (SubTopic)
   │  └─ Alphabet Sequence (SubTopic)
   └─ Drag and Drop (Topic)
      ├─ Simple Drag (SubTopic)
      └─ Complex Drag (SubTopic)
```

---

## Checklist: Full Testing

- ⬜ Run setupPuzzleFeature.js script
- ⬜ Hard refresh page
- ⬜ Check Sidebar sections collapse by default
- ⬜ Expand Features & Categories section
- ⬜ Go to /admin/add-puzzle
- ⬜ Create a Traditional Puzzle (Matching type)
- ⬜ See it in Puzzle List page
- ⬜ Go to /admin/create-visual-puzzle
- ⬜ Create a Visual Puzzle (Picture Word type)
- ⬜ See it in Puzzle List page
- ⬜ Test filtering puzzles by type
- ⬜ Test sorting puzzles
- ⬜ Test search functionality
- ⬜ Test delete single puzzle
- ⬜ Test bulk select and delete
- ⬜ Go to /admin/add-content
- ⬜ See Questions table below bulk import
- ⬜ Test search/filter/sort in questions table

---

## Need Help?

**Console Errors?**
- Check browser console (F12)
- Look for red error messages
- Share screenshot of error

**Database Issues?**
- Go to Firebase Console
- Check collections exist
- Verify document structure

**UI Issues?**
- Hard refresh (Cmd+Shift+R)
- Clear browser cache
- Try different browser

