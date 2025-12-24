# 🧩 Admin Guide: Creating & Managing Puzzles

## Overview

The AmAha platform now supports **two types of puzzles**:

1. **Traditional Puzzles** - Drag & drop style puzzles (legacy)
2. **Visual Puzzles** - Interactive games with 5 different types (new)

This guide explains how admins can create, edit, delete, and publish both types.

---

## Table of Contents

1. [Quick Access](#quick-access)
2. [Visual Puzzles (New System)](#visual-puzzles-new-system)
3. [Traditional Puzzles (Drag & Drop)](#traditional-puzzles-drag--drop)
4. [Understanding Quiz vs Puzzles](#understanding-quiz-vs-puzzles)
5. [Admin Panel Navigation](#admin-panel-navigation)
6. [Troubleshooting](#troubleshooting)

---

## Quick Access

### Access Visual Puzzle Creator

**Three ways to access:**

#### Method 1: Via Sidebar (Recommended)
```
Admin Panel → Puzzles section (left sidebar)
  └─ Visual Puzzles → Create new puzzle
```

#### Method 2: Via Puzzle List Page
```
Admin Panel → Global → Features & Categories
  └─ Navigate to Puzzles section
    └─ Click "+ Create Visual Puzzle" button (purple)
```

#### Method 3: Direct URL
```
http://localhost:3000/admin/create-visual-puzzle
```

---

## Visual Puzzles (New System)

### What are Visual Puzzles?

Visual puzzles are interactive mini-games designed for kids. Each puzzle type offers different gameplay mechanics:

| Type | Icon | Mechanic | Example |
|------|------|----------|---------|
| **Picture-Word** | 🖼️ | Match pictures with words | Match animal pictures to their names |
| **Spot Difference** | 👁️ | Find differences between images | Find 5 differences in two similar pictures |
| **Find Pair** | 🧩 | Memory/concentration game | Match card pairs |
| **Picture-Shadow** | 🌑 | Match pictures with shadows | Match animals to their shadows |
| **Ordering** | 🔢 | Arrange items in sequence | Sort numbers 1-5 or sequence steps |

### Step 1: Navigate to Create Visual Puzzle

Go to **Admin Panel** → **Puzzles** (sidebar) → **Visual Puzzles**

OR click purple **+ Create Visual Puzzle** button

### Step 2: Fill in Basic Information

```
Title *              Example: "Match Animals to Numbers"
Description          Example: "Match each animal to its correct number (1-5)"
```

- **Title** is required (shown to kids)
- **Description** helps you remember what the puzzle is for

### Step 3: Select Puzzle Type

Click on one of 5 puzzle type cards:

```
🖼️ Picture-Word Matching
   ↓
   Drag or click to match pictures with words
   
👁️ Spot the Difference
   ↓
   Find differences between two images
   
🧩 Find Matching Pair
   ↓
   Classic memory game - match cards
   
🌑 Picture-Shadow Matching
   ↓
   Drag shadows to match with pictures
   
🔢 Ordering/Sequencing
   ↓
   Drag items to arrange in correct order
```

### Step 4: Choose Category, Topic & Subtopic

```
Category *     Select from dropdown (Math, Language, etc.)
Topic *        Select from dropdown (appears after category)
Subtopic *     Select from dropdown (appears after topic)
```

**Important:** All three are required. The hierarchy determines where the puzzle appears for users.

### Step 5: Set Difficulty & Age Group

```
Difficulty     Easy / Medium / Hard
Age Group      4-6, 6-8, 8-10, 10-12
XP Reward      Points earned (default: 10)
```

- **Difficulty** affects visual styling and hints
- **Age Group** helps parents find appropriate content
- **XP Reward** points shown to users when completed

### Step 6: Configure Puzzle Content (Type-Specific)

Different puzzle types show different content editors:

#### Picture-Word Matching
```
Add Pair Button → Add multiple pairs
├─ Image URL/Upload (use Cloudinary)
└─ Word Label (text that matches image)

Layout Options:
├─ Grid 2x2 (4 pairs)
├─ Grid 2x3 (6 pairs)
├─ Grid 3x2 (6 pairs)
└─ Grid 3x3 (9 pairs)
```

**How it works:**
- Kid sees image with available words below
- Clicks/drags word to match with image
- Celebration on completion

**Example Content:**
```
Pair 1:
  Image: 🍎 (apple image URL)
  Word: "Apple"

Pair 2:
  Image: 🍌 (banana image URL)
  Word: "Banana"

Pair 3:
  Image: 🍊 (orange image URL)
  Word: "Orange"
```

#### Spot the Difference
```
Image A (Original) → Upload/select image
Image B (Modified) → Upload/select similar image with differences

Mark Differences:
├─ Click on Image A canvas → marks a difference
├─ Click on Image B canvas → marks a difference
└─ Adjust radius (circle size) for each difference

Preview:
├─ Shows both images side-by-side
└─ Click to mark where differences are
```

**How it works:**
- Kid sees two similar images
- Clicks on differences they spot
- Must find all marked differences to win
- Radius determines how close click needs to be

**Example:**
```
Original: Picture of garden with 5 items
Modified: Same picture but 3 items are different colors

Kids find the 3 differences
```

#### Find Matching Pair (Memory Game)
```
Add Card Button → Add multiple cards
├─ Image URL/Upload
└─ Card ID (auto-generated)

Layout Options:
├─ Grid 2x2 (4 cards = 2 pairs)
├─ Grid 2x4 (8 cards = 4 pairs)
├─ Grid 3x2 (6 cards = 3 pairs)
├─ Grid 3x4 (12 cards = 6 pairs)
└─ Grid 4x4 (16 cards = 8 pairs)
```

**How it works:**
- Kid flips cards to find matching pairs
- Cards shuffle at start
- Must find all pairs to win
- Gets attempts and score

**Example:**
```
Grid 2x4 with 4 fruit pairs:
🍎🍎 🍌🍌 🍊🍊 🍉🍉

Kid flips cards to find matching pairs
```

#### Picture-Shadow Matching
```
Add Pair Button → Add multiple pairs
├─ Picture Image → Upload/select main image
└─ Shadow Image → Upload/select shadow version

Layout Options:
├─ Grid 2x2 (4 pairs)
├─ Grid 2x3 (6 pairs)
├─ Grid 3x2 (6 pairs)
└─ Grid 3x3 (9 pairs)
```

**How it works:**
- Kid sees picture on one side
- Shadows available on other side
- Drags shadow to match with correct picture
- Celebration on all matches

**Example:**
```
Left side (Pictures):  🦁  🐘  🦒  🐼
Right side (Shadows): Shadow patterns of these animals

Kid drags each shadow to correct animal
```

#### Ordering/Sequencing
```
Add Item Button → Add multiple items
├─ Image URL/Upload
├─ Label (optional text)
└─ Order (position in sequence)

Item Types:
├─ Numbers (1, 2, 3...)
├─ Steps (First, Second, Third...)
└─ Custom (Any sequence)
```

**How it works:**
- Kid sees mixed-up items
- Drags items to arrange in correct order
- Must complete sequence to win
- Celebrates correct arrangement

**Example:**
```
"Count to 5"
Items: 5, 3, 1, 4, 2 (mixed)

Kid arranges to: 1, 2, 3, 4, 5
```

### Step 7: Publish the Puzzle

```
☐ Publish this puzzle (make it visible to users)
```

Check this box to make puzzle visible immediately, or leave unchecked to save as draft.

### Step 8: Save

Click **Save Puzzle** button

On success: ✨ "Puzzle saved!" message appears

---

## Editing Visual Puzzles

Coming soon! For now, edit puzzles by:
1. Creating a new puzzle with the same content
2. Or contact developer for direct Firestore edits

---

## Deleting Visual Puzzles

Coming soon! For now, request deletion from developer.

---

## Traditional Puzzles (Drag & Drop)

### Create Traditional Puzzle

**Access:**
```
Admin Panel → Puzzles (sidebar)
  └─ Traditional Puzzles → "+ Add Traditional Puzzle" button
  
OR direct URL: /admin/add-puzzle
```

Traditional puzzles use drag-and-drop mechanics. Refer to separate traditional puzzle documentation for details.

---

## Understanding Quiz vs Puzzles

### Quiz Questions (🎯 Take Quiz)
- **Created in:** Feature Category Management (Step 4)
- **Type:** Multiple choice questions
- **Progress:** Quiz progress tracking
- **Appears:** In quiz sections and quizzes list
- **Count shown:** "X questions" in admin

### Visual Puzzles (🧩 Puzzles)
- **Created in:** /admin/create-visual-puzzle
- **Type:** Interactive games (5 types)
- **Progress:** Puzzle progress tracking (separate)
- **Appears:** In puzzle sections and Candy Crush-style level path
- **Count shown:** "X puzzles" in puzzle sections

### Traditional Puzzles (Drag & Drop)
- **Created in:** /admin/add-puzzle
- **Type:** Drag-and-drop mechanics
- **Progress:** Puzzle progress tracking
- **Appears:** In puzzle sections
- **Status:** Legacy system

---

## Admin Panel Navigation

### Sidebar Structure

```
Admin Panel
├─ Global
│  ├─ Dashboard
│  ├─ Features & Categories (manage Quiz questions)
│  ├─ Add Content
│  ├─ Scores
│  ├─ System Tools
│  └─ Automation Tests
│
├─ Quiz
│  ├─ View Questions
│  ├─ Quiz Analytics
│  └─ Quiz UI Animations
│
└─ Puzzles
   ├─ Traditional Puzzles (Drag & Drop)
   └─ Visual Puzzles (Create/Edit)
```

### Feature Category Management (Quiz Questions)

This is where you manage quiz questions:

```
Step 1: Features          ← Select "Quiz"
Step 2: Categories        ← Select category
Step 3: Topics            ← Select topic
Step 4: SubTopics         ← Shows "X questions" for each
  └─ Add Questions via "➕" button
```

**This is NOT for puzzles - only for quiz questions.**

---

## Complete Workflow Example

### Create an "Animal Names" Visual Puzzle

**Scenario:** Create a Picture-Word matching puzzle where kids match animal pictures to their names.

#### Step 1: Navigate
```
Sidebar → Puzzles → Visual Puzzles
OR
Directly to: /admin/create-visual-puzzle
```

#### Step 2: Basic Info
```
Title: "Match Animals"
Description: "Match each animal picture to its correct name"
```

#### Step 3: Select Type
```
Click: 🖼️ Picture-Word Matching
```

#### Step 4: Hierarchy
```
Category: "Science" (from dropdown)
Topic: "Animals" (appears after category selected)
Subtopic: "Mammals" (appears after topic selected)
```

#### Step 5: Difficulty & Age
```
Difficulty: Easy (for young kids)
Age Group: 6-8 years
XP Reward: 15 points
```

#### Step 6: Add Content

Click "Add Pair" button 3 times to add 3 pairs:

**Pair 1:**
```
Image: [Upload lion.jpg] or paste URL
Word: "Lion"
```

**Pair 2:**
```
Image: [Upload elephant.jpg]
Word: "Elephant"
```

**Pair 3:**
```
Image: [Upload giraffe.jpg]
Word: "Giraffe"
```

Select Layout: **Grid 2x2** (shows 3 items nicely)

#### Step 7: Publish
```
✓ Check "Publish this puzzle"
```

#### Step 8: Save
```
Click "Save Puzzle" button
```

#### Result
```
✨ Puzzle saved!

Appears at: /puzzle/Science/Animals/Mammals
(in Candy Crush-style level path)

Kids can play immediately!
```

---

## Image Upload Best Practices

### Recommended Image Specifications

```
Format:           JPEG, PNG, WebP
Size:             100-500 KB per image
Dimensions:       400x400 to 800x800 pixels (square preferred)
Color:            Bright, kid-friendly colors
Background:       Transparent (PNG) or white (JPEG)
```

### Upload Methods

**Method 1: Direct Upload (Recommended)**
```
Click upload button → Select file from computer
→ System uploads to Cloudinary
→ URL auto-populated
```

**Method 2: Paste URL**
```
Click upload button → Paste image URL
→ Verify image loads
→ Confirm
```

### Image Sources

**Free image resources:**
- [Unsplash](https://unsplash.com) - Quality free photos
- [Pixabay](https://pixabay.com) - Royalty-free images
- [Pexels](https://pexels.com) - Free stock photos
- [OpenClipart](https://openclipart.org) - Clipart
- [Emoji Unicode](https://unicode.org) - Emoji reference

**Best practice:** Use simple, clear, colorful images that kids will recognize.

---

## Troubleshooting

### Issue: Category dropdown is empty

**Cause:** No categories created yet

**Solution:**
1. Go to Admin Panel → Global → Features & Categories
2. Click "Step 2: Categories"
3. Click "+" button to add categories
4. Refresh visual puzzle page

### Issue: "Please select a subtopic" error

**Cause:** Subtopic wasn't loaded properly

**Solution:**
1. Click Category dropdown again
2. Select Category
3. Wait for Topic dropdown to populate
4. Select Topic
5. Wait for Subtopic dropdown to populate
6. Select Subtopic
7. Save

### Issue: Image not uploading

**Cause:** File too large or wrong format

**Solution:**
1. Check file size (max 2MB)
2. Use JPEG or PNG format
3. Try compressing image first
4. Or paste URL of online image instead

### Issue: "Please configure the puzzle content" error

**Cause:** Content fields are empty

**Solution:**
1. For Picture-Word: Add at least 1 pair
2. For Spot Difference: Upload both images and mark at least 1 difference
3. For Find Pair: Add at least 2 cards (1 pair)
4. For Picture-Shadow: Add at least 1 pair
5. For Ordering: Add at least 2 items

### Issue: Puzzle not showing for users

**Cause:** Not published or wrong hierarchy

**Solution:**
1. Check if "Publish this puzzle" is checked
2. Verify category, topic, subtopic are correct
3. Verify user has access to that content area
4. For logged-in users: Check if progress needs sync

### Issue: Progress not saving

**Cause:** User not logged in or Firebase connection issue

**Solution:**
1. Check user is logged in (avatar shows in header)
2. Check browser console for errors
3. Guest users: Progress saved to localStorage
4. Logged-in users: Progress saved to Firestore

---

## Admin Checklist

Before launching visual puzzles:

### Content Setup
- [ ] Create at least 3 different puzzle types
- [ ] Test each puzzle type works
- [ ] Verify images load correctly
- [ ] Test on mobile (portrait and landscape)

### Hierarchy
- [ ] Confirm categories are correct
- [ ] Confirm topics are correct
- [ ] Confirm subtopics are correct
- [ ] Verify puzzle appears in right location

### Publishing
- [ ] All puzzles are published (not draft)
- [ ] Difficulty settings are appropriate
- [ ] Age groups match content
- [ ] XP rewards make sense

### Testing
- [ ] Test as guest user (phone)
- [ ] Test as logged-in user
- [ ] Test progress saving
- [ ] Test level unlocking

### Performance
- [ ] Images load quickly
- [ ] No console errors
- [ ] Animations are smooth
- [ ] Mobile performance is good

---

## Advanced Features (Coming Soon)

- [ ] Bulk import puzzles from CSV
- [ ] Clone/duplicate puzzles
- [ ] Schedule puzzle release dates
- [ ] A/B test different puzzle versions
- [ ] Analytics dashboard
- [ ] Player performance reports

---

## Support

For issues or questions:

1. Check the **Troubleshooting** section above
2. Check the **VISUAL_PUZZLES_GUIDE.md** for technical details
3. Check the **ARCHITECTURE_OVERVIEW.md** for system design
4. Contact the development team

---

**Last Updated:** December 24, 2025  
**Version:** 1.0  
**Status:** Production Ready ✅
