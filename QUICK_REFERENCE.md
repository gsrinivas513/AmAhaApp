# 🚀 Quick Start: Admin & Testing Reference

Fast reference for admins and QA testers. For detailed guides, see linked documents.

---

## 📱 Admin Quick Links

| Task | URL | Reference |
|------|-----|-----------|
| **Create Puzzle** | `/admin/create-visual-puzzle` | ADMIN_WORKFLOW_GUIDE.md → Step 1-7 |
| **Edit Puzzle** | `/admin/create-visual-puzzle/:id` | ADMIN_WORKFLOW_GUIDE.md → Edit Section |
| **Puzzle List** | `/admin/puzzles` | Admin panel |
| **Analytics** | `/admin/puzzle-analytics` | Admin panel |

---

## 🎮 Create Puzzle in 5 Minutes

### Step 1: Navigate
```
http://localhost:3000/admin/create-visual-puzzle
```

### Step 2: Basic Info
```
Title:       "Learn Colors"
Description: "Match images to words"
Difficulty:  Easy
Age Group:   3-5
XP Reward:   10
```

### Step 3: Choose Type
```
Click: 🖼️ Picture-Word (or your chosen type)
```

### Step 4: Hierarchy
```
Category:  Learning
Topic:     Colors
Subtopic:  Basic Colors
```

### Step 5: Add Content
```
For Picture-Word:
├─ Upload image → Enter word
├─ Upload image → Enter word
├─ Upload image → Enter word
└─ Upload image → Enter word
(Repeat for each pair)
```

### Step 6: Preview
```
Click [Preview] → Verify looks good
```

### Step 7: Save
```
Click [Publish] → Done! ✅
```

---

## 🧪 Test Puzzle in 5 Minutes

### Step 1: Load Puzzle
```
http://localhost:3000/puzzle/Learning/Colors/Basic Colors
Click: "Learn Colors"
```

### Step 2: Play
```
For Picture-Word:
├─ Click red image
├─ Click "Red" label
├─ Watch for match animation
└─ Repeat for other pairs
```

### Step 3: Verify Completion
```
✅ Celebration animation
✅ Success message
✅ XP awarded (10 points)
✅ Progress saved
```

### Step 4: Check Progress
```
Refresh page → Puzzle still shows completed ✓
```

---

## 🎯 5 Puzzle Types Quick Guide

### 🖼️ Picture-Word Matching
- **Setup**: 2-6 image-word pairs
- **Gameplay**: Click image + label to match
- **Grid Options**: 2x2, 2x3, 3x2
- **Time**: 2-3 minutes per puzzle
- **Best for**: Vocabulary, color, animal learning

```
Example: Animals
├─ 🐱 Cat + "Cat"
├─ 🐶 Dog + "Dog"
├─ 🐰 Bunny + "Bunny"
└─ 🦋 Butterfly + "Butterfly"
```

### 👁️ Spot the Difference
- **Setup**: 2 similar images + 3-5 differences marked
- **Gameplay**: Click on differences in images
- **Best for**: Observation, attention to detail
- **Difficulty**: Varies by difference size
- **Time**: 3-5 minutes per puzzle

```
Example: Park Scene
└─ Mark 5 spots different between Image A & B
   ├─ Tree missing
   ├─ Bird added
   ├─ Cloud shape changed
   ├─ Person color changed
   └─ Flower moved
```

### 🧩 Find Matching Pair
- **Setup**: Even number of cards (4, 6, 8)
- **Gameplay**: Flip cards, find matching pairs
- **Grid Options**: 2x2 (4 cards), 2x3 (6 cards), 2x4 (8 cards)
- **Best for**: Memory, concentration
- **Time**: 2-4 minutes per puzzle

```
Example: Animals (6 cards)
├─ Card 1-2: Cat (matching pair)
├─ Card 3-4: Dog (matching pair)
└─ Card 5-6: Bunny (matching pair)
```

### 🌑 Picture-Shadow Matching
- **Setup**: 3-6 picture-shadow pairs
- **Gameplay**: Drag pictures to matching shadows
- **Best for**: Visual recognition, shape matching
- **Time**: 2-3 minutes per puzzle

```
Example: Fruits
├─ 🍎 Apple + Apple shadow
├─ 🍊 Orange + Orange shadow
└─ 🍌 Banana + Banana shadow
```

### 🔢 Ordering/Sequencing
- **Setup**: 3-10 items with order numbers
- **Gameplay**: Drag items to correct sequence
- **Item Types**: Numbers, Alphabet, Size, Custom
- **Best for**: Counting, sequencing, ordering
- **Time**: 2-4 minutes per puzzle

```
Example: Numbers 1-5
├─ Numbers randomly displayed: 3, 1, 5, 2, 4
└─ Kids drag to arrange: 1, 2, 3, 4, 5
```

---

## 🐛 Quick Troubleshooting

### Images Won't Upload
```
Fix:
1. Check file size < 2MB
2. Use JPG or PNG format
3. Check Cloudinary config in src/config/cloudinaryConfig.js
4. Refresh page and retry
5. Check browser console for errors (F12)
```

### Dropdown is Empty
```
Fix:
1. Verify categories exist in Firestore
2. Go to Firebase Console → Firestore
3. Check "categories" collection has data
4. Try refreshing page
5. Check user has read permissions
```

### Puzzle Won't Save
```
Fix:
1. Verify all required fields filled:
   ├─ Title (required)
   ├─ Type (required)
   ├─ Category/Topic/Subtopic (required)
   └─ Content (required)
2. Check browser console (F12) for errors
3. Verify Firestore permissions
4. Try saving again (sometimes network glitch)
5. Check Firebase quota not exceeded
```

### Can't See My Published Puzzle
```
Fix:
1. Refresh browser (hard refresh: Cmd+Shift+R)
2. Clear cache (Cmd+Shift+Delete)
3. Verify status = "Published" (not Draft)
4. Go to correct category/topic/subtopic
5. Check Firestore has the document
```

### Progress Not Saving
```
Fix (Guest User):
1. Open DevTools → Application → Storage
2. Check localStorage has "amaha_puzzle_progress"
3. Verify browser allows localStorage
4. Clear and try again

Fix (Logged-in User):
1. Verify logged in with same account
2. Check Firestore "puzzleProgress" collection
3. Go to Firebase Console
4. Verify user document exists
5. Check security rules allow write
```

---

## 📊 Admin Checklist Before Deploying

### Content Ready?
- [ ] All puzzles have descriptive titles
- [ ] All images uploaded and visible
- [ ] No placeholder images remaining
- [ ] Age groups correctly set
- [ ] Difficulty levels appropriate
- [ ] XP rewards reasonable (Easy: 10-15, Medium: 15-25, Hard: 25-50)

### Technical Ready?
- [ ] All 5 puzzle types tested
- [ ] Create works
- [ ] Edit works
- [ ] Delete works (safely)
- [ ] Publish/unpublish works
- [ ] Level unlocking works
- [ ] Progress tracking works

### Browser Ready?
- [ ] Chrome ✅
- [ ] Firefox ✅
- [ ] Safari ✅
- [ ] Mobile Safari ✅
- [ ] Mobile Chrome ✅

### Performance OK?
- [ ] Page loads < 3 seconds
- [ ] Animations smooth (60 FPS)
- [ ] No console errors
- [ ] Images load quickly
- [ ] No memory leaks

### Security OK?
- [ ] Only admins can create/edit
- [ ] Draft puzzles hidden from kids
- [ ] Firestore rules set correctly
- [ ] Image uploads validated
- [ ] No XSS vulnerabilities

---

## 📞 Test Execution Order

### Phase 1: Admin Panel (1 hour)
```
1. Create Picture-Word puzzle (15 min)
2. Create Spot Difference puzzle (15 min)
3. Create Find Pair puzzle (10 min)
4. Create other 2 types (10 min)
5. Edit a puzzle (10 min)
```

### Phase 2: User Gameplay (45 min)
```
1. Play Picture-Word (10 min)
2. Play Spot Difference (10 min)
3. Play Find Pair (10 min)
4. Play other types (15 min)
```

### Phase 3: Progress & Unlocking (30 min)
```
1. Test guest progress (10 min)
2. Test logged-in progress (10 min)
3. Test level unlocking (10 min)
```

### Phase 4: Cross-device (30 min)
```
1. Mobile testing (15 min)
2. Tablet testing (10 min)
3. Different browser (5 min)
```

**Total: ~2.5 hours for complete testing**

---

## 🎯 Sample Puzzles to Create

### Example Set 1: Colors (Easy)
```
Puzzle Type: Picture-Word
Category: Learning → Colors → Basic Colors
Title: "Learn Primary Colors"
Pairs: Red, Blue, Yellow, Green
Difficulty: Easy
Age Group: 3-5
XP: 10
```

### Example Set 2: Animals (Medium)
```
Puzzle Type: Find Pair
Category: Learning → Animals → Mammals
Title: "Animal Memory Game"
Cards: 6 (3 pairs)
Difficulty: Medium
Age Group: 4-6
XP: 15
```

### Example Set 3: Numbers (Easy)
```
Puzzle Type: Ordering
Category: Learning → Numbers → Counting
Title: "Count to 5"
Items: 5 number cards
Difficulty: Easy
Age Group: 3-5
XP: 12
```

### Example Set 4: Differences (Medium)
```
Puzzle Type: Spot Difference
Category: Games → Observation
Title: "Find 5 Differences"
Images: 2 park scenes
Differences: 5
Difficulty: Medium
Age Group: 6-8
XP: 20
```

### Example Set 5: Shapes (Hard)
```
Puzzle Type: Picture-Shadow
Category: Learning → Shapes
Title: "Match Shapes to Shadows"
Pairs: 6 geometric shapes
Difficulty: Hard
Age Group: 7-9
XP: 25
```

---

## 🔐 Admin Account Setup

### Create Admin User in Firebase Console

```
1. Go to: console.firebase.google.com
2. Select your project
3. Go to: Authentication → Users
4. Create new user:
   └─ Email: admin@example.com
   └─ Password: [secure password]
5. Set Custom Claims:
   ├─ Click user in list
   ├─ Go to "Custom Claims" tab
   ├─ Add JSON:
   └─ {"admin": true}
6. Click "Save"
7. User now has admin access
```

### Login Flow
```
1. Go to http://localhost:3000/login
2. Enter admin email
3. Enter admin password
4. Click "Sign In"
5. Verify: Admin panel now accessible
```

---

## 📈 Success Metrics

### After Launch, Track:
```
Admin Usage:
├─ Number of puzzles created: ___ (target: 10+)
├─ Publish rate: __% (target: 80%+)
└─ Average puzzles per week: ___ (target: 2+)

User Engagement:
├─ Total puzzles played: ___
├─ Average completion rate: __% (target: 70%+)
├─ Level unlock rate: __% (target: 75%+)
└─ Return user rate: __% (target: 60%+)

Performance:
├─ Average load time: ___ms (target: < 3000ms)
├─ Puzzle completion time: ___min (target: 2-5min)
└─ Error rate: __% (target: < 1%)
```

---

## 📚 Full Documentation Links

| Document | Link | Use Case |
|----------|------|----------|
| Admin Workflow Guide | ADMIN_WORKFLOW_GUIDE.md | Detailed admin procedures |
| E2E Testing Guide | E2E_TESTING_GUIDE.md | Complete testing guide |
| Architecture Overview | ARCHITECTURE_OVERVIEW.md | System design |
| Visual Puzzles Guide | VISUAL_PUZZLES_GUIDE.md | Technical reference |
| Quick Reference | VISUAL_PUZZLES_QUICK_START.md | Quick admin how-to |
| Schema Reference | PUZZLE_SCHEMA.md | Database structure |

---

## ✨ Tips for Success

### For Admins:
1. ✅ Create variety of difficulty levels
2. ✅ Use high-quality images
3. ✅ Test every puzzle before publishing
4. ✅ Gather feedback from kids
5. ✅ Update puzzles regularly with new content

### For QA:
1. ✅ Test on real devices, not just desktop
2. ✅ Check both guest and logged-in flows
3. ✅ Verify progress across page refreshes
4. ✅ Test edge cases (rapid clicks, etc.)
5. ✅ Monitor performance metrics

### For Deployment:
1. ✅ Set up Firebase security rules first
2. ✅ Set admin role for admin users
3. ✅ Configure Cloudinary API keys
4. ✅ Test on staging environment
5. ✅ Have rollback plan

---

## 🆘 Support Contact

For issues:
1. Check DevTools Console (F12)
2. Review relevant guide (see links above)
3. Check Firestore in Firebase Console
4. Try clearing cache and refresh
5. Restart development server

---

**Last Updated:** December 24, 2025  
**Version:** 1.0  
**Status:** Production Ready ✅

Start with: ADMIN_WORKFLOW_GUIDE.md (detailed)  
Reference: This file (quick lookups)  
Test with: E2E_TESTING_GUIDE.md (comprehensive testing)
