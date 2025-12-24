# 🎮 Admin Puzzle Management Guide

Complete guide for managing visual puzzles in AmAha - creating, editing, publishing, and deleting puzzles.

---

## 📋 Table of Contents

1. [Admin Dashboard](#admin-dashboard)
2. [Create New Puzzle](#create-new-puzzle)
3. [Edit Existing Puzzle](#edit-existing-puzzle)
4. [Publish/Unpublish Puzzles](#publishunpublish-puzzles)
5. [Delete Puzzle](#delete-puzzle)
6. [Admin Panel URL Reference](#admin-panel-url-reference)
7. [Troubleshooting](#troubleshooting)

---

## 🏠 Admin Dashboard

### Accessing the Admin Panel

**URL:** `http://localhost:3000/admin`

You will see:
- Quiz Management
- Visual Puzzles Management
- Settings
- Reports

**Required Role:** Admin (configured in Firebase Authentication)

---

## ➕ Create New Puzzle

### Step-by-Step Guide

#### 1. **Navigate to Puzzle Creation**

```
URL: http://localhost:3000/admin/create-visual-puzzle
```

OR from Admin Dashboard:
- Click "Visual Puzzles" → "Create New Puzzle"

#### 2. **Fill in Basic Information**

| Field | What to Enter | Example |
|-------|---------------|---------|
| **Title** | Puzzle name (20-100 chars) | "Learn Colors" |
| **Description** | What kids will do (max 200 chars) | "Match colors with their names" |
| **Difficulty** | Easy, Medium, or Hard | Easy |
| **Age Group** | Target age range | 3-5, 6-8, 9-12 |
| **XP Reward** | Points earned on completion | 10, 15, 20 |

**Example:**
```
Title: Learn Basic Colors
Description: Match color images with their names - perfect for learning
Difficulty: Easy
Age Group: 3-5
XP Reward: 10
```

#### 3. **Select Puzzle Type**

Click on one of 5 puzzle type cards:

**🖼️ Picture-Word Matching**
- Click to select → Shows pair editor
- Add up to 6 pairs of images + words
- Kids match pictures to labels

**👁️ Spot the Difference**
- Requires 2 similar images
- Click on differences to mark them (up to 10)
- Kids find all marked spots

**🧩 Find Matching Pair**
- Memory/concentration game
- Add cards (must be even number)
- Kids flip cards to find pairs

**🌑 Picture-Shadow Matching**
- Match pictures with shadows
- Add 3-6 picture-shadow pairs
- Kids drag to match

**🔢 Ordering/Sequencing**
- Arrange items in correct order
- Add 3-10 items with order numbers
- Kids drag to sequence

#### 4. **Choose Category → Topic → Subtopic**

The form has 3 cascading dropdowns:

```
Category Dropdown
   ↓ (Select one)
Topic Dropdown (loads topics for selected category)
   ↓ (Select one)
Subtopic Dropdown (loads subtopics for selected topic)
```

**Example Path:**
```
Category: Learning
Topic: Colors
Subtopic: Basic Colors
```

#### 5. **Configure Puzzle Content**

Depending on puzzle type, you'll see different editors:

##### 🖼️ Picture-Word Editor

**Pair Editor Screen:**

```
[Grid Layout: 2x2 ▼]  [Grid Layout: 2x3 ▼]  [Add Pair]

┌─ Pair 1 ─────────────────┐
│ Image: [Upload Button]    │
│ Word:  [Input Field]      │
│        [×] Delete         │
└───────────────────────────┘

┌─ Pair 2 ─────────────────┐
│ Image: [Preview] [×]      │
│ Word:  [Input Field]      │
│        [×] Delete         │
└───────────────────────────┘
```

**How to add images:**
1. Click "Upload Image" button
2. Select image from computer (JPG, PNG)
3. Image uploads to Cloudinary
4. Preview appears in editor

**How to add words:**
1. Type word/label in text input
2. Text appears as label in puzzle

**Grid Layout Options:**
- `grid-2x2` - 2 columns × 2 rows (4 pairs max)
- `grid-2x3` - 2 columns × 3 rows (6 pairs max)
- `grid-3x2` - 3 columns × 2 rows (6 pairs max)

**Actions:**
- [Add Pair] - Add new pair
- [×] on pair - Delete that pair

##### 👁️ Spot Difference Editor

**Setup Screen:**

```
Image A (Original)        Image B (Modified)
[Upload]                  [Upload]
OR
[Preview] [×]             [Preview] [×]


Click on differences to mark them:

┌─────────────────────────────────────────┐
│ Canvas A (click to mark differences)     │
│ Size: 400×300px                         │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ Canvas B (click to mark differences)     │
│ Size: 400×300px                         │
└─────────────────────────────────────────┘

Marked Differences: 3/10
┌─ Difference 1 ─────────┐
│ Position: 25%, 30%      │
│ Radius: [15  ▼]px       │
│ [Delete]                │
└─────────────────────────┘
```

**How to add differences:**
1. Upload Image A (original)
2. Upload Image B (modified)
3. Click on areas where differences are
4. Adjust radius if needed (10-50px)
5. Kids will click to find all marked spots

**Tips:**
- Differences should be obvious for kids
- Use radius 15-25px for most
- Larger radius = easier to find

##### 🧩 Find Matching Pair Editor

**Memory Game Setup:**

```
[Grid Layout: 2x3 ▼]  [Add Card]

┌─ Card 1 ──────────┐
│ Image: [Upload]    │
│        [×] Delete  │
└────────────────────┘

┌─ Card 2 ──────────┐
│ Image: [Preview]   │
│        [×] Delete  │
└────────────────────┘

┌─ Card 3 ──────────┐
│ Image: [Upload]    │
│        [×] Delete  │
└────────────────────┘
```

**Important:** Cards must be in pairs!
- 4 cards = 2 pairs
- 6 cards = 3 pairs (2x3 grid)
- 8 cards = 4 pairs (2x4 grid)

**Grid Layouts:**
- `grid-2x2` - 2×2 (4 cards = 2 pairs)
- `grid-2x3` - 2×3 (6 cards = 3 pairs)
- `grid-2x4` - 2×4 (8 cards = 4 pairs)

##### 🌑 Picture-Shadow Editor

**Shadow Matching Setup:**

```
[Add Pair]

┌─ Pair 1 ────────────────────┐
│ Picture:  [Upload] [Preview] │
│ Shadow:   [Upload] [Preview] │
│           [×] Delete         │
└──────────────────────────────┘

┌─ Pair 2 ────────────────────┐
│ Picture:  [Upload] [Preview] │
│ Shadow:   [Upload] [Preview] │
│           [×] Delete         │
└──────────────────────────────┘
```

**How to set up:**
1. Upload picture image
2. Upload corresponding shadow image
3. Add more pairs (3-6 recommended)
4. Kids drag to match pictures with shadows

##### 🔢 Ordering Editor

**Sequencing Setup:**

```
[Item Type: Numbers ▼]  [Add Item]

┌─ Item 1 ───────────────┐
│ Image: [Upload]         │
│ Label: [Input]          │
│ Order: [1 ▼]            │
│        [×] Delete       │
└─────────────────────────┘

┌─ Item 2 ───────────────┐
│ Image: [Upload]         │
│ Label: Two              │
│ Order: [2 ▼]            │
│        [×] Delete       │
└─────────────────────────┘
```

**Item Types:**
- `numbers` - 1, 2, 3... (default)
- `alphabet` - A, B, C...
- `size` - Small, Medium, Large
- `sequence` - Custom order

**How to set up:**
1. Select item type
2. Add items (3-10)
3. Set order numbers
4. Kids drag to arrange in order

#### 6. **Preview Puzzle**

**Before saving**, click "Preview" button to:
- See how puzzle looks to kids
- Verify all images loaded
- Test interactions (if applicable)
- Check text readability

#### 7. **Save Puzzle**

**Option A: Save as Draft**
```
[Save as Draft]
- Puzzle saved but not visible to kids
- You can edit it later
- Status: "Draft"
```

**Option B: Publish Immediately**
```
[Publish]
- Puzzle saved and visible to kids
- Unlocked if prerequisites met
- Status: "Published"
```

**Success Message:**
```
✅ Puzzle created successfully!
   ID: abc123def456
   Title: Learn Basic Colors
   Type: picture-word
   Status: Published
```

---

## ✏️ Edit Existing Puzzle

### How to Edit

#### Method 1: Direct URL
```
http://localhost:3000/admin/create-visual-puzzle/:puzzleId
```

#### Method 2: From List
1. Go to `/admin/puzzles` (Puzzle List Page)
2. Find puzzle in table
3. Click "Edit" button

### What You Can Edit

✅ **Can Edit:**
- Title
- Description
- Difficulty level
- Age group
- XP reward
- Puzzle content (images, words, etc.)
- Category/Topic/Subtopic
- Draft/Published status

❌ **Cannot Edit:**
- Puzzle type (must delete and recreate)
- Creation date
- Creator name

### Edit Workflow

```
1. Load puzzle in editor
2. Make changes
3. Preview changes
4. Save
   ├─ [Save as Draft] → Still in draft
   └─ [Publish] → Live for kids
```

### Example: Update Colors Puzzle

**Original:**
```
Title: Learn Basic Colors
Pairs: Red, Blue, Yellow, Green
```

**Edit to:**
```
Title: Learn Primary Colors
Pairs: Red, Blue, Yellow, Orange (new)
Difficulty: Medium (was Easy)
```

**Steps:**
1. Click edit for "Learn Basic Colors"
2. Change title to "Learn Primary Colors"
3. Add 4th pair with Orange image
4. Change difficulty to Medium
5. Click [Publish] to save changes
6. Changes live immediately

---

## 📢 Publish/Unpublish Puzzles

### Understanding Puzzle Status

**Published = Visible to Kids**
```
Status: ✅ Published
- Kids can see it in category
- Kids can play it (if unlocked)
- Kids earn XP on completion
- Progress is tracked
```

**Draft = Hidden from Kids**
```
Status: 📝 Draft
- Only admins see it
- Kids cannot access it
- Perfect for work in progress
- Safe to edit without affecting live
```

### How to Publish

#### Option 1: During Creation
```
Click [Publish] button instead of [Save as Draft]
```

#### Option 2: From List View
```
Go to: http://localhost:3000/admin/puzzles

Puzzle List Table:
┌─────────────────────────────────────────────────┐
│ Title         │ Type    │ Status   │ Actions   │
├─────────────────────────────────────────────────┤
│ Learn Colors  │ Picture │ 📝 Draft │ [Edit]    │
│               │ Word    │          │ [Publish] │
│               │         │          │ [Delete]  │
└─────────────────────────────────────────────────┘

Click [Publish]
```

#### Option 3: Edit Then Publish
```
1. Click [Edit]
2. Make changes
3. Click [Publish] (instead of [Save as Draft])
4. Changes go live
```

### How to Unpublish

**Unpublish = Make Draft**
```
Location: Puzzle List or Edit Page
Button: [Unpublish]
Result: Puzzle hidden from kids again
```

### Before Publishing Checklist

**Complete this before clicking [Publish]:**

- [ ] Title is clear and descriptive
- [ ] Description explains what to do
- [ ] All images are uploaded and visible
- [ ] Content is appropriate for age group
- [ ] Difficulty is correctly set
- [ ] Puzzle tested in preview
- [ ] No placeholder images remaining
- [ ] All text is properly spelled
- [ ] Grammar is correct
- [ ] Images are high quality
- [ ] Loading time is reasonable

---

## 🗑️ Delete Puzzle

### Warning ⚠️

**Deleting is permanent!**
- Cannot be undone
- Player progress is lost
- Unlock chains may break

**Consider instead:**
- Unpublish the puzzle (makes it draft)
- Edit to fix issues
- Archive in separate collection

### How to Delete

#### Method 1: List View
```
Go to: http://localhost:3000/admin/puzzles

Click [Delete] button next to puzzle
Confirm: "Are you sure? This cannot be undone"
Click [Confirm Delete]
```

#### Method 2: Edit View
```
Open puzzle for editing
Scroll to bottom
Click [Delete Puzzle] button
Confirm in dialog
```

### Safe Delete Workflow

**Instead of deleting:**

```
1. Unpublish puzzle
   [Unpublish] button → Makes it Draft

2. Edit to fix issues
   - Update content
   - Fix errors
   - Improve images

3. Publish again
   [Publish] → Go live with improvements

4. If really want to delete:
   [Delete] → Removes permanently
```

---

## 🔗 Admin Panel URL Reference

### Puzzle Management URLs

| Function | URL | What You See |
|----------|-----|--------------|
| **Create New** | `/admin/create-visual-puzzle` | Form to create puzzle |
| **Edit Puzzle** | `/admin/create-visual-puzzle/:id` | Form with existing data |
| **Puzzle List** | `/admin/puzzles` | Table of all puzzles |
| **Analytics** | `/admin/puzzle-analytics` | Stats and completion rates |
| **Dashboard** | `/admin` | Overall admin panel |

### Query Parameters

#### Create/Edit Puzzles
```
/admin/create-visual-puzzle?type=picture-word
/admin/create-visual-puzzle?category=Learning
/admin/create-visual-puzzle/:id?edit=true
```

---

## 🐛 Troubleshooting

### Problem: Images Won't Upload

**Symptom:** "Upload Image" button doesn't work

**Solution:**
1. Check Cloudinary configuration
   - File: `src/config/cloudinaryConfig.js`
   - Verify API key is set
   - Check CORS settings
2. Check browser console for errors
3. Verify image file size < 2MB
4. Try PNG instead of JPG
5. Refresh page and try again

**Code to check:**
```javascript
// src/config/cloudinaryConfig.js
export const CLOUDINARY_CONFIG = {
  cloudName: 'your-cloud-name', // Set this
  uploadPreset: 'your-preset',   // Set this
};
```

### Problem: Can't See Categories in Dropdown

**Symptom:** Category dropdown is empty

**Solution:**
1. Verify Firestore has data
   - Go to Firebase Console
   - Check `categories` collection exists
   - Check it has documents
2. Verify user has read permission
   - Check Firestore security rules
   - Ensure `collection(db, 'categories')` is readable
3. Check browser console for errors
4. Try refreshing page

### Problem: Puzzle Won't Save

**Symptom:** Click [Publish] but nothing happens

**Solution:**
1. Check browser console for errors
   - Right-click → Inspect → Console tab
   - Look for red error messages
2. Verify all required fields filled
   - Title (required)
   - Type (required)
   - Category/Topic/Subtopic (required)
3. Check Firestore permissions
   - User must have write access to `puzzles`
4. Try again after waiting 2 seconds
5. Refresh page and retry

### Problem: Can Edit But Changes Don't Show

**Symptom:** Edit puzzle, click save, but changes don't appear

**Solution:**
1. Hard refresh browser (Cmd+Shift+R on Mac)
2. Clear browser cache
3. Check Firestore shows updated document
   - Go to Firebase Console
   - Find puzzle document
   - Check `updatedAt` timestamp is recent
4. Verify no browser cache issues
5. Check network tab for failed requests

### Problem: Delete Button Missing

**Symptom:** Can't see delete button

**Solution:**
1. Verify you're logged in as admin
2. Check user role in Firebase Auth
3. Scroll down page (button might be below)
4. Verify Firestore permissions allow delete
5. Try different browser

---

## 📱 Mobile Admin Panel

### Accessing on Mobile

**Same URL, mobile-friendly UI:**
```
http://localhost:3000/admin/create-visual-puzzle
```

**Mobile Optimizations:**
- Single column layout
- Large touch buttons (44px+)
- Stacked dropdowns
- Image upload via camera
- Touch-friendly drag

**Known Limitations on Mobile:**
- SpotDifference editor harder to use (requires clicking canvas)
- Better on tablet with stylus
- Desktop recommended for complex edits

---

## 🔐 Security & Permissions

### Admin Role Check

Puzzles are only editable by users with "admin" role in Firebase Authentication.

**Verify you have admin role:**

```javascript
// In browser console
firebase.auth().currentUser.getIdTokenResult().then(result => {
  console.log('Admin:', result.claims.admin);
});
```

**Set Admin Role (Firebase Console):**
1. Go to Firebase Console
2. Select "Authentication"
3. Select user
4. Click "Edit User"
5. Set Custom Claims:
   ```json
   {
     "admin": true
   }
   ```

### Firestore Security Rules

Puzzles collection should have these rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Admins can do anything with puzzles
    match /puzzles/{document=**} {
      allow read: if true; // Kids can read published puzzles
      allow create, update, delete: if 
        request.auth != null && 
        request.auth.token.admin == true;
    }
    
    // Regular users can read progress only
    match /puzzleProgress/{userId}/{document=**} {
      allow read, write: if request.auth.uid == userId;
    }
  }
}
```

---

## 📊 Best Practices

### Content Guidelines

**Before Publishing:**
- ✅ Use kid-friendly images (no scary content)
- ✅ Ensure age-appropriate difficulty
- ✅ Test on actual device (not just desktop)
- ✅ Use high-quality images (300dpi minimum)
- ✅ Limit text to short labels
- ✅ Use bright pastel colors

**Avoid:**
- ❌ Small text (< 16px)
- ❌ Blurry or pixelated images
- ❌ Violence or scary content
- ❌ Culturally insensitive material
- ❌ Long descriptions (< 100 chars)

### XP Rewards

**Suggested by Difficulty:**
- Easy: 10-15 XP
- Medium: 15-25 XP
- Hard: 25-50 XP

### Naming Convention

**Use clear, descriptive titles:**

✅ Good:
- "Learn Basic Colors"
- "Find Differences - Animals"
- "Count to 10"

❌ Bad:
- "Puzzle 1"
- "Game"
- "Test"

---

## 📞 Support

If you encounter issues:

1. **Check Console Logs**
   - Right-click → Inspect → Console
   - Look for error messages

2. **Check Firestore**
   - Go to Firebase Console
   - Verify data structure

3. **Restart Development Server**
   ```bash
   npm start
   ```

4. **Clear Cache**
   - Chrome: Cmd+Shift+Delete
   - Firefox: Cmd+Shift+Delete
   - Safari: Develop → Clear Caches

---

**Last Updated:** December 24, 2025  
**Version:** 1.0  
**Status:** Production Ready ✅
