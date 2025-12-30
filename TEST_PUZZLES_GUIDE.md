# 🧩 Test Puzzles Creation Guide

## Overview
This guide explains how to create test puzzles for all puzzle types so you can test the complete puzzle system.

## Quick Start

### Step 1: Run the Test Puzzles Script
```bash
cd /Users/srini/Desktop/AmAha/AmAhaApp/amaha-web
node createTestPuzzles.js
```

**What it does:**
- Creates 9 test puzzles across all 5 types
- Sets them to "Logic Puzzles" category
- Makes them all published and ready to play

### Step 2: Access the Puzzles
Navigate to the Logic Puzzles section in the browser:
```
http://localhost:3000/quiz/Logic%20Puzzles
```

Or through the navigation menu:
1. Click "🧩 Puzzles" in the top menu
2. Select "Logic Puzzles" category
3. You'll see all available puzzle types

## 📋 Created Test Puzzles

### 1️⃣ Picture-Word Matching (🖼️)
**Puzzles Created:**
- "Match Animals with Names" (Easy) - Cats, Dogs, Mice, Lions
- "Match Fruit Names" (Medium) - Apples, Bananas, Oranges, Strawberries, Grapes, Coconuts

**How to Test:**
1. Click on puzzle
2. Click on a picture, then click on a matching word
3. All pairs should match correctly

### 2️⃣ Spot the Difference (👁️)
**Puzzles Created:**
- "Find 3 Differences" (Easy) - Two similar images with 3 marked differences

**How to Test:**
1. Click on puzzle
2. Click on the areas where you see differences
3. Find all 3 differences to complete

### 3️⃣ Find Matching Pair (🧩)
**Puzzles Created:**
- "Memory Game - Colors" (Easy) - 8 cards (4 color pairs)
- "Memory Game - Objects" (Hard) - 12 cards (6 object pairs)

**How to Test:**
1. Click on puzzle
2. Click cards to flip them
3. Match all pairs to complete
4. Watch for performance: find pairs as quickly as possible

### 4️⃣ Picture-Shadow Matching (🌑)
**Puzzles Created:**
- "Match Objects with Shadows" (Medium) - Cup, Star, Tree, House shadows

**How to Test:**
1. Click on puzzle
2. Drag each object to match with its shadow
3. Complete when all matches are correct

### 5️⃣ Ordering/Sequencing (🔢)
**Puzzles Created:**
- "Order by Size - Small to Large" (Easy) - 3 apples in increasing size
- "Number Sequence 1-5" (Medium) - Numbers 1-5 out of order

**How to Test:**
1. Click on puzzle
2. Drag items to arrange in correct order
3. Items should be ordered correctly from left to right

## 🔧 Testing Checklist

### Rendering & Display
- [ ] All puzzle cards show in "Logic Puzzles" category
- [ ] No "Coming Soon" messages appear
- [ ] Cards display correct titles and descriptions
- [ ] Puzzle types are clearly visible

### Functionality by Type
- [ ] **Picture-Word**: Click/drag to match pictures and words
- [ ] **Spot Difference**: Click to mark differences
- [ ] **Find Pairs**: Cards flip and match correctly
- [ ] **Picture-Shadow**: Drag to match objects with shadows
- [ ] **Ordering**: Drag to arrange in correct sequence

### Performance
- [ ] Puzzles load quickly
- [ ] No lag or delay when interacting
- [ ] Smooth animations on completion
- [ ] Cards render with proper colors and styling

### Completion
- [ ] Success message appears when puzzle complete
- [ ] XP reward is displayed (10 for easy, 20 for medium, 30 for hard)
- [ ] Can navigate back to puzzle list
- [ ] Can play puzzle again

## 📊 Data Structure Reference

### Picture-Word Puzzle
```javascript
{
  type: "picture-word",
  data: {
    pairs: [
      { id: "pair-1", image: "url", word: "word" }
    ],
    layout: "grid-2x2" | "grid-2x3" | "grid-3x3"
  }
}
```

### Spot the Difference
```javascript
{
  type: "spot-difference",
  data: {
    imageA: "url",
    imageB: "url",
    differences: [
      { x: 50, y: 50, radius: 30 }
    ],
    difficultyHint: 3
  }
}
```

### Find Pair (Memory Game)
```javascript
{
  type: "find-pair",
  data: {
    cards: [
      { id: "card-1", image: "url", pairId: "pair-id" }
    ],
    layout: "grid-2x4" | "grid-3x4" | "grid-4x4"
  }
}
```

### Picture-Shadow Matching
```javascript
{
  type: "picture-shadow",
  data: {
    pairs: [
      { id: "pair-1", image: "url", shadow: "url" }
    ]
  }
}
```

### Ordering/Sequencing
```javascript
{
  type: "ordering",
  data: {
    items: [
      { id: "item-1", label: "text", image: "url", order: 1 }
    ],
    correctOrder: [1, 2, 3]
  }
}
```

## 🐛 Troubleshooting

### Issue: Script fails with "serviceAccountKey.json not found"
**Solution:** Make sure serviceAccountKey.json is in the project root directory
```bash
ls serviceAccountKey.json
```

### Issue: Puzzles don't appear in category
**Solution:** Clear browser cache or do a hard refresh (Ctrl+Shift+R on Windows, Cmd+Shift+R on Mac)

### Issue: "Coming Soon" message still shows
**Solution:** 
1. Check if puzzles were created: go to Firestore Console
2. Check if `isPublished: true` is set
3. Refresh the page

### Issue: Images not loading
**Solution:** This is expected - placeholder.com URLs are used for testing. In production, use real image URLs or Cloudinary

### Issue: Cards not rendering correctly
**Solution:**
1. Check browser console for errors (F12)
2. Verify puzzle data matches the expected schema
3. Check if the puzzle type is supported

## 🚀 Next Steps After Testing

1. **Create your own puzzles** using the Admin Panel (recommended for production)
2. **Replace placeholder images** with real images or Cloudinary URLs
3. **Adjust difficulty levels** based on your age group
4. **Add more puzzle varieties** to expand the content library
5. **Test with real users** to validate difficulty and engagement

## 📞 Support

If you encounter any issues:
1. Check the browser console (F12 → Console tab)
2. Review the puzzle data in Firestore Console
3. Compare with the data structure reference above
4. Ensure all required fields are present

---

**Happy Puzzle Testing! 🎉**
