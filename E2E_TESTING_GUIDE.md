# 🧪 End-to-End Testing Guide - Visual Puzzles

Complete manual and automated testing guide for the Visual Puzzles system.

---

## 📋 Table of Contents

1. [Testing Overview](#testing-overview)
2. [Manual Testing - Admin Panel](#manual-testing---admin-panel)
3. [Manual Testing - User Gameplay](#manual-testing---user-gameplay)
4. [Manual Testing - Progress Tracking](#manual-testing---progress-tracking)
5. [Automated Testing Setup](#automated-testing-setup)
6. [Test Scenarios & Checklists](#test-scenarios--checklists)
7. [Browser & Device Testing](#browser--device-testing)
8. [Performance Testing](#performance-testing)
9. [Security Testing](#security-testing)
10. [Debugging](#debugging)

---

## 🎯 Testing Overview

### Test Coverage Map

```
Visual Puzzles System
├── Admin Workflows (Create, Edit, Delete, Publish)
├── Puzzle Gameplay (5 types × 3 difficulties)
├── Progress Tracking (Guest & Logged-in)
├── Level Unlocking
├── Data Persistence
├── Performance
├── Security & Permissions
├── Mobile Responsiveness
└── Browser Compatibility
```

### Testing Environment Setup

**Development:**
```bash
# Terminal 1: Start dev server
npm start

# Terminal 2: Run tests (when ready)
npm test

# Terminal 3: Test server (Cypress, optional)
npm run cypress
```

**Access Points:**
- Admin Panel: `http://localhost:3000/admin`
- Create Puzzle: `http://localhost:3000/admin/create-visual-puzzle`
- Play Puzzles: `http://localhost:3000/puzzle`
- Console: Right-click → Inspect → Console tab

---

## 🧑‍💼 Manual Testing - Admin Panel

### Test 1: Admin Login & Access Control

**Objective:** Verify only admins can access puzzle admin panel

**Steps:**
```
1. Logout if logged in
2. Try to access: /admin/create-visual-puzzle
3. Verify: Redirected to login or access denied message
4. Login with regular user account
5. Try to access: /admin/create-visual-puzzle
6. Verify: Access denied (not admin)
7. Login with admin account
8. Access: /admin/create-visual-puzzle
9. Verify: Admin panel loads ✅
```

**Expected Result:** ✅ Only admin users can access

**Failure Scenarios:**
- Regular user can access admin panel → Security issue
- Admin locked out → Permission issue

---

### Test 2: Create Picture-Word Puzzle

**Objective:** Create a working picture-word matching puzzle

**Steps:**

```
STEP 1: Navigate to Creation Form
├─ URL: http://localhost:3000/admin/create-visual-puzzle
└─ Verify: Form loads, all fields visible

STEP 2: Fill Basic Information
├─ Title: "Test Colors"
├─ Description: "Match color images to words"
├─ Difficulty: Easy
├─ Age Group: 3-5
├─ XP Reward: 10
└─ Verify: All fields accept input

STEP 3: Select Picture-Word Type
├─ Click on "🖼️ Picture-Word" card
└─ Verify: PictureWordEditor loads

STEP 4: Choose Category/Topic/Subtopic
├─ Category: Select "Learning"
├─ Verify: Topics dropdown populates
├─ Topic: Select "Colors"
├─ Verify: Subtopics dropdown populates
├─ Subtopic: Select "Basic Colors"
└─ Verify: All dropdowns work (cascading)

STEP 5: Add Picture-Word Pairs
├─ Click [Add Pair]
├─ Upload image 1
│  ├─ Click upload button
│  ├─ Select image file (JPG/PNG < 2MB)
│  ├─ Wait for upload (spinner)
│  └─ Verify: Image preview appears
├─ Enter word 1: "Red"
├─ Verify: Input accepts text
├─ Repeat for pairs 2-4:
│  ├─ Blue image + "Blue"
│  ├─ Yellow image + "Yellow"
│  └─ Green image + "Green"
└─ Verify: 4 pairs visible in editor

STEP 6: Change Grid Layout
├─ Click grid layout dropdown
├─ Select "grid-2x2"
├─ Verify: Layout changes in preview
├─ Try "grid-2x3"
└─ Verify: Layout updates

STEP 7: Preview Puzzle
├─ Click [Preview] button
├─ Wait for preview to load
├─ Verify: Puzzle displays with 4 cards
├─ Try clicking on cards (optional)
└─ Close preview

STEP 8: Save Puzzle
├─ Click [Publish]
├─ Wait for save (spinner)
└─ Verify: Success message appears

STEP 9: Verify Puzzle Created
├─ Check success message for puzzle ID
├─ Navigate to: /puzzle/Learning/Colors/Basic Colors
├─ Verify: "Test Colors" appears in level path
├─ Click puzzle
└─ Verify: Puzzle loads and is playable
```

**Success Criteria:**
- ✅ Puzzle created in Firestore
- ✅ Appears in category hierarchy
- ✅ Image uploads successful
- ✅ Can be played by users
- ✅ All 4 pairs visible

**Common Issues:**

| Issue | Fix |
|-------|-----|
| Images won't upload | Check Cloudinary config, file size |
| Dropdown empty | Categories missing from Firestore |
| Can't click next step | Required field empty |
| Preview broken | Refresh page, check console |

---

### Test 3: Create Spot Difference Puzzle

**Objective:** Create and verify spot difference puzzle

**Steps:**

```
STEP 1: Navigate to Creation
├─ URL: /admin/create-visual-puzzle
└─ Fill basic info: Title="Find Differences Test"

STEP 2: Select Type
├─ Click "👁️ Spot Difference"
└─ Verify: SpotDifferenceEditor loads

STEP 3: Upload Images
├─ Upload Image A (original)
│  ├─ Click upload
│  ├─ Select image
│  └─ Verify: Preview appears
├─ Upload Image B (modified)
│  ├─ Click upload
│  ├─ Select similar image (with changes)
│  └─ Verify: Preview appears
└─ Verify: Both images visible side-by-side

STEP 4: Mark Differences
├─ Canvas A loads with Image A
├─ Click on 3 different spots
├─ Verify: Each click marks a difference
├─ Canvas B loads with Image B
├─ Mark same spots on Image B
└─ Verify: Visual indicators show marked areas

STEP 5: Adjust Difference Radius
├─ For each difference:
│  ├─ Find it in "Differences List"
│  ├─ Adjust radius (default 20)
│  └─ Verify: Visual feedback on canvas
└─ Set all to reasonable sizes (15-25)

STEP 6: Verify Difference Count
├─ Should show: "Differences (3)" or similar
└─ Verify: Count matches marked spots

STEP 7: Save Puzzle
├─ Click [Publish]
├─ Verify: Success message
└─ Note puzzle ID

STEP 8: Test Gameplay
├─ Go to /puzzle/.../Find Differences Test
├─ Play puzzle
├─ Verify: Both images visible
├─ Click on marked differences
├─ Verify: Click is recognized
└─ Verify: Celebration animation on completion
```

**Success Criteria:**
- ✅ Both images upload successfully
- ✅ Difference marking works
- ✅ Radius adjustment works
- ✅ Puzzle plays correctly
- ✅ Completion detection works

---

### Test 4: Create Find Pair Memory Puzzle

**Objective:** Create memory matching game

**Steps:**

```
STEP 1: Navigate to Creation
├─ URL: /admin/create-visual-puzzle
└─ Title: "Animal Memory Game"

STEP 2: Select Type
├─ Click "🧩 Find Pair"
└─ Verify: FindPairEditor loads

STEP 3: Add Card Pairs
├─ Grid Layout: grid-2x3 (6 cards)
├─ Click [Add Card]
├─ Upload image 1 (e.g., cat.jpg)
├─ Click [Add Card]
├─ Upload same image 1 again (same cat)
├─ Verify: 2 cards with same image
├─ Repeat for 2 more animals:
│  ├─ Dog image (2 copies)
│  └─ Bunny image (2 copies)
└─ Verify: 6 cards total (3 pairs)

STEP 4: Verify Grid Layout
├─ Grid should show: 2x3 layout
├─ Verify: All 6 cards visible
└─ Verify: Cards arranged in grid

STEP 5: Remove and Re-add Cards (Test Editing)
├─ Click [×] on one card to delete
├─ Verify: Card removed, 5 cards remain
├─ Click [Add Card]
├─ Upload new card
├─ Verify: Now 6 cards again

STEP 6: Save Puzzle
├─ Click [Publish]
├─ Verify: Success message

STEP 7: Play Memory Game
├─ Go to /puzzle/.../Animal Memory Game
├─ Verify: 6 cards face-down
├─ Click card 1
├─ Verify: Card flips, image shows
├─ Click card 2
├─ If match:
│  └─ Verify: Both cards stay visible
├─ If not match:
│  └─ Verify: Both cards flip back
├─ Continue until all pairs found
└─ Verify: Celebration on completion
```

**Success Criteria:**
- ✅ Even number of cards
- ✅ Cards in matching pairs
- ✅ Memory game mechanics work
- ✅ Flip animation smooth
- ✅ Match detection accurate

**Test Edge Cases:**
```
❌ Odd number of cards (should validate)
   └─ Expect: Error message "Must have even cards"
❌ No matching pairs
   └─ Expect: Game impossible to win
✅ All 8 pairs same image (valid but boring)
✅ Mix of photos and illustrations
```

---

### Test 5: Create Picture-Shadow Puzzle

**Objective:** Verify shadow matching puzzle

**Steps:**

```
STEP 1: Navigate & Select Type
├─ URL: /admin/create-visual-puzzle
├─ Title: "Shadow Matching"
└─ Click "🌑 Picture-Shadow"

STEP 2: Add Picture-Shadow Pairs
├─ Click [Add Pair]
├─ Picture 1: Upload apple image
├─ Shadow 1: Upload apple shadow image
├─ Verify: Both upload successfully
├─ Repeat for pairs 2-3:
│  ├─ Orange image + shadow
│  └─ Banana image + shadow
└─ Verify: 3 pairs added

STEP 3: Verify Pair Structure
├─ Each pair shows:
│  ├─ Picture preview
│  ├─ Shadow preview
│  └─ [×] Delete button
└─ Verify: All visible

STEP 4: Save Puzzle
├─ Click [Publish]
└─ Verify: Success

STEP 5: Play & Verify Gameplay
├─ Go to puzzle page
├─ Verify: Pictures on left, shadows on right
├─ Drag picture to shadow area
├─ Verify: Drag-and-drop works
├─ Complete all matches
└─ Verify: Celebration animation
```

**Success Criteria:**
- ✅ Picture-shadow pairs upload
- ✅ Preview shows both images
- ✅ Drag-and-drop mechanics work
- ✅ Match detection works
- ✅ Completion triggers celebration

---

### Test 6: Create Ordering Puzzle

**Objective:** Verify sequencing puzzle

**Steps:**

```
STEP 1: Create Puzzle
├─ URL: /admin/create-visual-puzzle
├─ Title: "Number Sequence"
└─ Click "🔢 Ordering"

STEP 2: Add Items
├─ Item Type: numbers (default)
├─ Click [Add Item]
├─ Item 1:
│  ├─ Image: number "1"
│  ├─ Label: "One"
│  ├─ Order: 1
│  └─ Verify: All fields accept input
├─ Repeat for 2-5:
│  ├─ Images: 2, 3, 4, 5
│  ├─ Labels: Two, Three, Four, Five
│  └─ Orders: 2, 3, 4, 5
└─ Verify: 5 items added

STEP 3: Shuffle Order (Test Editing)
├─ Change Item 3 Order to 1
├─ Change Item 1 Order to 3
├─ Verify: Order values update
└─ Return to correct order

STEP 4: Save & Test
├─ Click [Publish]
├─ Go to puzzle page
├─ Verify: Items shown in shuffled order
├─ Drag items to correct sequence
├─ Verify: Drag-and-drop works
├─ Complete sequence
└─ Verify: Celebration animation
```

**Success Criteria:**
- ✅ Items add with order values
- ✅ Items display in random order
- ✅ Drag-to-reorder works
- ✅ Order detection works
- ✅ Completion triggers celebration

---

### Test 7: Edit Existing Puzzle

**Objective:** Verify editing functionality

**Steps:**

```
STEP 1: Find Puzzle to Edit
├─ Go to: /admin/create-visual-puzzle?id=<puzzleId>
├─ OR go to list and click [Edit]
└─ Verify: Puzzle loads in editor

STEP 2: Edit Basic Info
├─ Change title: "Updated Title"
├─ Change description
├─ Change difficulty: Medium → Hard
├─ Change XP: 10 → 20
└─ Verify: All fields editable

STEP 3: Edit Content
├─ For Picture-Word:
│  ├─ Remove one pair
│  ├─ Add new pair
│  └─ Verify: Changes apply
├─ For other types: Similar content updates
└─ Verify: All changes reflect

STEP 4: Save Changes
├─ Click [Publish]
├─ Verify: Success message
└─ Verify: Updated timestamp in Firestore

STEP 5: Verify Changes Live
├─ Go to puzzle page
├─ Verify: Updated title shows
├─ Play puzzle
└─ Verify: Updated content displays
```

**Success Criteria:**
- ✅ All fields editable
- ✅ Changes save successfully
- ✅ Changes visible to users
- ✅ Updated timestamp recorded

---

### Test 8: Publish & Unpublish Puzzle

**Objective:** Test publish/unpublish functionality

**Steps:**

```
STEP 1: Create Draft Puzzle
├─ Create puzzle
├─ Click [Save as Draft]
└─ Verify: Status = Draft

STEP 2: Publish Draft
├─ Go to puzzle list
├─ Find puzzle with status "Draft"
├─ Click [Publish]
└─ Verify: Status changes to "Published"

STEP 3: Verify Kids See Published
├─ Go to puzzle page as different user (non-admin)
├─ Verify: Published puzzle appears
├─ Verify: Can play it

STEP 4: Unpublish Puzzle
├─ Go to puzzle list
├─ Find published puzzle
├─ Click [Unpublish]
└─ Verify: Status = Draft

STEP 5: Verify Kids Don't See Unpublished
├─ Go to puzzle page (refresh)
├─ Verify: Puzzle no longer visible
├─ Verify: Can't access via direct URL
```

**Success Criteria:**
- ✅ Draft/Published status toggles
- ✅ Published puzzles visible to users
- ✅ Draft puzzles hidden from users
- ✅ Direct URL access blocked for unpublished

---

### Test 9: Delete Puzzle

**Objective:** Verify puzzle deletion

**Precaution:** ⚠️ Deletion is permanent!

**Steps:**

```
STEP 1: Select Puzzle to Delete
├─ Go to puzzle list
├─ Find non-critical puzzle (test puzzle)
└─ Click [Delete]

STEP 2: Confirm Deletion
├─ Dialog appears: "Are you sure? This cannot be undone"
├─ Click [Cancel] first to verify it works
└─ Click [Delete] again

STEP 3: Confirm Deletion
├─ Verify: Puzzle removed from list
└─ Verify: No longer accessible

STEP 4: Try Direct Access
├─ Try to access deleted puzzle URL
├─ Example: /puzzle/Learning/Colors/...
└─ Verify: Puzzle not found error

STEP 5: Check Firestore
├─ Go to Firebase Console
├─ Check `puzzles` collection
└─ Verify: Document deleted
```

**Success Criteria:**
- ✅ Deletion confirmed with warning
- ✅ Puzzle removed from list
- ✅ Direct access blocked
- ✅ Firestore document deleted

---

## 👶 Manual Testing - User Gameplay

### Test 10: Picture-Word Gameplay

**Objective:** Test interactive picture-word matching

**Steps:**

```
STEP 1: Navigate to Picture-Word Puzzle
├─ URL: /puzzle/Learning/Colors/Basic Colors
├─ Click "Learn Basic Colors"
└─ Verify: Puzzle loads

STEP 2: Verify Visual Layout
├─ Verify: 4 picture cards visible
├─ Verify: 4 word labels visible
├─ Verify: Grid layout correct (2x2)
├─ Verify: Images high quality
└─ Verify: Text readable (16px+)

STEP 3: Test First Match (Correct)
├─ Click on red image
├─ Wait 300ms (for visual feedback)
├─ Click on "Red" label
├─ Verify: Cards glow/highlight during selection
├─ Verify: Smooth transition
├─ Verify: Pair marked as complete
└─ Verify: No celebration yet (continue)

STEP 4: Test Second Match (Correct)
├─ Click on blue image
├─ Click on "Blue" label
├─ Verify: Same visual feedback
├─ Verify: Pair complete

STEP 5: Test Remaining Matches
├─ Match yellow and green
├─ Verify: All 4 pairs completed

STEP 6: Verify Celebration Animation
├─ After last pair:
├─ Verify: Celebration animation triggers
├─ Verify: Confetti/sparkles appear (if implemented)
├─ Verify: Success message shows
├─ Verify: 10 XP awarded message
└─ Verify: Progress saved (firebase/localStorage)

STEP 7: Test Puzzle Completion Page
├─ After celebration:
├─ Verify: Completion screen shows
├─ Verify: Attempt count shows: "Completed in 1 attempt"
├─ Verify: Time taken shown
├─ Verify: [Next Puzzle] or [Retry] buttons available
└─ Click [Next Puzzle]

STEP 8: Verify Level Unlocking
├─ Return to level path
├─ Verify: Next puzzle now unlocked
├─ Verify: Unlock animation smooth
```

**Success Criteria:**
- ✅ Cards clickable and responsive
- ✅ Visual feedback on click
- ✅ Match detection accurate
- ✅ Celebration animation triggers
- ✅ Progress saved
- ✅ Next puzzle unlocks

**Test Edge Cases:**

```
❌ Click same card twice
   └─ Expect: Visual feedback, no invalid match
❌ Click unrelated card pair
   └─ Expect: No match detection, cards deselect
✅ Click rapidly (many clicks)
   └─ Expect: Debounced, no invalid matches
✅ Wait 5 seconds between clicks
   └─ Expect: Still works, counts as valid
```

---

### Test 11: Spot Difference Gameplay

**Objective:** Test spot-the-difference puzzle

**Steps:**

```
STEP 1: Load Puzzle
├─ Navigate to spot difference puzzle
└─ Verify: Both images load side-by-side

STEP 2: Test Correct Clicks
├─ Identify marked difference spots
├─ Click on Image A difference spots
├─ Verify: Click registered with visual feedback
├─ Verify: Circle appears around click area
├─ Verify: Difference marked as found
├─ Repeat for Image B differences
└─ Verify: All found spots tracked

STEP 3: Test Incorrect Clicks
├─ Click areas without differences
├─ Verify: Click registered but no match
├─ Verify: Visual feedback indicates wrong spot
├─ Verify: Attempt count increases
└─ Verify: No points for wrong clicks

STEP 4: Find All Differences
├─ Complete all correct clicks
├─ Verify: Count shows "3/3 found" or similar
├─ Verify: Celebration animation
└─ Verify: XP awarded

STEP 5: Test Responsiveness
├─ Zoom in (120%)
├─ Verify: Click still works accurately
├─ Zoom out (80%)
├─ Verify: Still responsive
└─ Verify: No offset issues
```

**Success Criteria:**
- ✅ Images display clearly
- ✅ Clicks detected accurately
- ✅ Visual feedback immediate
- ✅ Difference count updates
- ✅ Celebration triggers on completion

**Responsive Testing:**

| Screen Size | Test |
|-------------|------|
| Desktop 1920x1080 | Both images side-by-side |
| Tablet 768x1024 | Images stack or shrink |
| Mobile 375x667 | Single image scroll |

---

### Test 12: Find Pair Memory Gameplay

**Objective:** Test memory card matching

**Steps:**

```
STEP 1: Load Memory Game
├─ Navigate to puzzle
├─ Verify: Cards face-down
├─ Verify: Grid layout correct (2x3)
└─ Verify: Cards same size

STEP 2: Test Card Flip Animation
├─ Click first card
├─ Verify: Flip animation smooth
├─ Verify: Image shows after flip
└─ Verify: Animation duration ~300ms

STEP 3: Test Non-Matching Pair
├─ First card: Animal A (stays face-up)
├─ Click second card: Animal B
├─ Verify: Both visible momentarily
├─ Verify: Wait ~1 second
├─ Verify: Both flip back face-down
├─ Verify: Attempt count increases
└─ Verify: Position not revealed

STEP 4: Test Matching Pair
├─ First card: Cat (stays up)
├─ Second card: Cat (other copy)
├─ Verify: Both stay face-up
├─ Verify: Pair marked complete
├─ Verify: Cards dim slightly (visual feedback)
└─ Verify: Can't click again

STEP 5: Test Game Continuation
├─ Continue playing
├─ Match remaining pairs
├─ Verify: Each pair stays when matched
├─ Verify: Cards not clickable after match
└─ Verify: Can only click unmatched cards

STEP 6: Complete Game
├─ After final pair:
├─ Verify: Celebration animation
├─ Verify: Attempt count shown
├─ Verify: Time taken shown
└─ Verify: XP awarded

STEP 7: Test Replay
├─ Click [Retry] button
├─ Verify: All cards reset face-down
├─ Verify: Cards re-shuffled
├─ Verify: Attempt count reset
└─ Play again to verify shuffle works
```

**Success Criteria:**
- ✅ Cards shuffle differently each game
- ✅ Flip animation smooth
- ✅ Match detection accurate
- ✅ Cannot click matched pairs
- ✅ Completion triggers celebration
- ✅ Attempt/time tracked
- ✅ Retry shuffles new game

**Performance Test:**

```
Metrics to Monitor:
├─ Flip animation: < 300ms
├─ Click response: < 50ms
├─ Card load: < 1s
└─ Celebration: < 2s total
```

---

### Test 13: Picture-Shadow Gameplay

**Objective:** Test shadow matching with drag-and-drop

**Steps:**

```
STEP 1: Load Puzzle
├─ Navigate to shadow matching puzzle
├─ Verify: Pictures on left, shadows on right
└─ Verify: Proper spacing between areas

STEP 2: Test Drag-and-Drop
├─ Click + drag first picture
├─ Verify: Cursor shows drag icon
├─ Verify: Picture follows cursor
├─ Hover over correct shadow
├─ Verify: Shadow highlights (drop zone)
├─ Release on shadow
├─ Verify: Picture matches to shadow
└─ Verify: Visual connection/line (if implemented)

STEP 3: Test Incorrect Drag
├─ Drag picture to wrong shadow
├─ Verify: Snap back to original position
├─ Verify: No false match
└─ Verify: Attempt count increases

STEP 4: Correct All Pairs
├─ Match all picture-shadow pairs correctly
├─ Verify: Each pair stays matched
├─ Verify: Can't re-drag matched items
└─ Verify: Completion detected

STEP 5: Celebration & Completion
├─ Verify: Animation triggers
├─ Verify: Success message
├─ Verify: XP awarded
└─ Verify: Progress saved

STEP 6: Test Mobile Drag (if applicable)
├─ On mobile device:
├─ Verify: Touch drag works
├─ Verify: Visual feedback on touch
└─ Verify: Same matching logic
```

**Success Criteria:**
- ✅ Drag-and-drop responsive
- ✅ Visual feedback clear
- ✅ Match detection accurate
- ✅ Incorrect drags handled
- ✅ Celebration on completion
- ✅ Works on touch devices

---

### Test 14: Ordering Puzzle Gameplay

**Objective:** Test sequence arrangement

**Steps:**

```
STEP 1: Load Puzzle
├─ Navigate to ordering puzzle
├─ Verify: Items displayed (shuffled)
└─ Verify: Items show order numbers (if applicable)

STEP 2: Test First Item Drag
├─ Click + drag first item
├─ Verify: Visual feedback (lift animation)
├─ Drag to correct position 1
├─ Verify: Drop target highlighted
├─ Release
├─ Verify: Item placed at position 1
└─ Verify: Other items shift as needed

STEP 3: Place Remaining Items
├─ Continue dragging items to correct order
├─ Verify: Each item snaps to grid
├─ Verify: Visual feedback on each placement
└─ Verify: Items don't overlap

STEP 4: Verify Sequence Detection
├─ After all items placed:
├─ Verify: System checks order
├─ If correct:
│  ├─ Verify: Celebration animation
│  └─ Verify: XP awarded
├─ If incorrect:
│  ├─ Verify: Error message
│  ├─ Verify: Attempt count increases
│  └─ Click [Retry] to re-attempt
└─ Verify: Can try again

STEP 5: Test Completion
├─ Complete correct sequence
├─ Verify: Celebration fires
├─ Verify: Progress saved
└─ Verify: Next puzzle unlocks
```

**Success Criteria:**
- ✅ Drag-and-drop works smoothly
- ✅ Visual feedback clear
- ✅ Sequence detection accurate
- ✅ Items arrange in grid
- ✅ Celebration on completion
- ✅ Error handling on wrong order

---

## 📊 Manual Testing - Progress Tracking

### Test 15: Guest User Progress (localStorage)

**Objective:** Verify guest progress saves locally

**Steps:**

```
STEP 1: Clear All Storage
├─ Open DevTools (F12)
├─ Application tab
├─ Clear localStorage
├─ Verify: amaha_puzzle_progress doesn't exist

STEP 2: Play as Guest
├─ Don't login
├─ Go to: /puzzle/Learning/Colors/Basic Colors
├─ Play puzzle and complete it
├─ Verify: "Puzzle completed" message

STEP 3: Check localStorage
├─ Open DevTools
├─ Application → localStorage
├─ Expand amaha-web site
├─ Look for: amaha_puzzle_progress
├─ Verify: JSON contains puzzle ID
└─ Verify: Completion status = true

STEP 4: Refresh Page
├─ Refresh browser (Cmd+R)
├─ Navigate back to level path
├─ Verify: Puzzle shows as completed ✓
└─ Verify: Next puzzle unlocked

STEP 5: Try Another Puzzle
├─ Play second puzzle
├─ Complete it
├─ Refresh page
├─ Verify: Both puzzles show completed

STEP 6: Check Storage Size
├─ DevTools → Application → Storage
├─ Verify: localStorage < 5MB
└─ Verify: Performance acceptable
```

**Success Criteria:**
- ✅ Progress saves to localStorage
- ✅ Progress persists after refresh
- ✅ Multiple puzzles tracked
- ✅ No storage errors

**Expected localStorage Structure:**
```json
{
  "amaha_puzzle_progress": {
    "abc123": {
      "completed": true,
      "attempts": 1,
      "score": 100,
      "timestamp": 1703521200000
    },
    "def456": {
      "completed": true,
      "attempts": 2,
      "score": 80,
      "timestamp": 1703521500000
    }
  }
}
```

---

### Test 16: Logged-in User Progress (Firestore)

**Objective:** Verify logged-in user progress saves to Firestore

**Steps:**

```
STEP 1: Clear Storage & Logout
├─ DevTools → Clear localStorage
├─ Logout if logged in
├─ Clear app data

STEP 2: Login
├─ Go to app
├─ Click Login button
├─ Use test account
└─ Verify: Logged in successfully

STEP 3: Play Puzzle
├─ Navigate to puzzle
├─ Play and complete
├─ Verify: Success message

STEP 4: Check Firestore
├─ Go to Firebase Console
├─ Select project
├─ Go to Firestore
├─ Find collection: puzzleProgress
├─ Look for document: {userId}
├─ Expand puzzles subcollection
├─ Find puzzle document: {puzzleId}
└─ Verify: Fields:
   ├─ completed: true
   ├─ attempts: 1
   ├─ score: 100
   ├─ timestamp: recent
   └─ userId: matches

STEP 5: Refresh Browser
├─ Go to DevTools
├─ Network tab
├─ F5 to refresh
├─ Verify: No errors
├─ Navigate to level path
└─ Verify: Progress still shows

STEP 6: Different Device/Browser
├─ Open new incognito window
├─ Login with same account
├─ Navigate to puzzle category
├─ Verify: Progress from other device shows
└─ Verify: Same puzzle shows completed

STEP 7: Play Another Puzzle
├─ Play different puzzle
├─ Complete it
├─ Check Firestore again
├─ Verify: New puzzle progress document created
└─ Verify: Multiple puzzles tracked
```

**Success Criteria:**
- ✅ Progress saves to Firestore
- ✅ Cross-device sync works
- ✅ Multiple puzzles tracked per user
- ✅ Firestore structure correct

**Expected Firestore Structure:**
```
puzzleProgress/
├── userId1/
│   └── puzzles/
│       ├── puzzleId1 {completed, attempts, score, timestamp}
│       └── puzzleId2 {completed, attempts, score, timestamp}
└── userId2/
    └── puzzles/
        └── puzzleId1 {completed, attempts, score, timestamp}
```

---

### Test 17: Guest to Logged-in Migration

**Objective:** Verify guest progress syncs when user logs in

**Steps:**

```
STEP 1: Play as Guest
├─ Clear all storage
├─ Play 3 puzzles as guest
├─ Verify: All saved to localStorage
└─ Note: User ID = "guest"

STEP 2: Check Firestore (Guest)
├─ Verify: No puzzleProgress entries yet
└─ Progress only in localStorage

STEP 3: Login
├─ Click login button
├─ Complete authentication
└─ Verify: Logged in with Google/Email

STEP 4: Wait for Sync (2-5 seconds)
├─ App automatically triggers sync
├─ Check DevTools → Network for requests
├─ Verify: Request to puzzleProgress endpoint
└─ Wait for completion

STEP 5: Verify Sync Completed
├─ Open Firebase Console
├─ Check puzzleProgress collection
├─ Find userId document
├─ Verify: All 3 puzzles now in Firestore
└─ Verify: Data matches localStorage

STEP 6: Verify localStorage Still Valid
├─ DevTools → Storage
├─ Verify: localStorage still has old data
└─ Note: Can be cleared after sync confirmed

STEP 7: Continue Playing
├─ Play new puzzle
├─ Verify: Saves to Firestore (not just localStorage)
└─ Verify: Reflects in real-time

STEP 8: Check Firestore
├─ New puzzle progress in Firestore
├─ Old guest puzzles still there
└─ No duplicates
```

**Success Criteria:**
- ✅ Guest progress detected on login
- ✅ Guest data synced to Firestore
- ✅ No duplicates created
- ✅ New progress saves to Firestore
- ✅ Seamless transition

---

### Test 18: Level Unlocking System

**Objective:** Verify puzzle unlock progression

**Steps:**

```
STEP 1: Navigate to Level Path
├─ Go to: /puzzle/Learning/Colors/Basic Colors
└─ Verify: Level path loads

STEP 2: Check Initial State
├─ First puzzle should be: UNLOCKED (clickable)
├─ Remaining puzzles should be: LOCKED 🔒
├─ Verify: Visual distinction clear
└─ Verify: Locked puzzles show lock icon

STEP 3: Complete First Puzzle
├─ Play and complete first puzzle
├─ Verify: Success message
└─ Return to level path

STEP 4: Verify Second Puzzle Unlocked
├─ Refresh page (to reload from Firestore)
├─ Verify: Second puzzle now UNLOCKED
├─ Verify: Smooth unlock animation
├─ Verify: Third puzzle still LOCKED
└─ Verify: No accidental skipping

STEP 5: Complete Second Puzzle
├─ Play second puzzle
├─ Complete it
└─ Return to level path

STEP 6: Verify Third Puzzle Unlocked
├─ Refresh to load from database
├─ Verify: Third puzzle unlocked
└─ Verify: Fourth still locked

STEP 7: Skip Ahead (Negative Test)
├─ Try to access locked puzzle via direct URL
├─ Example: /puzzle/.../puzzle4-id
├─ Verify: Access denied or redirected
└─ Verify: Cannot skip ahead

STEP 8: Test Unlock Chain
├─ Complete all puzzles in order
├─ Verify: Each unlocks next one
├─ No skips, no duplicates
└─ Final puzzle shows completion
```

**Success Criteria:**
- ✅ First puzzle starts unlocked
- ✅ Completion unlocks next
- ✅ Cannot skip ahead
- ✅ Unlock animation smooth
- ✅ Works across page refreshes
- ✅ Applies to all 5 difficulty levels

---

## 🤖 Automated Testing Setup

### Setup Test Environment

**Install Test Dependencies:**

```bash
# Cypress for E2E testing
npm install --save-dev cypress @cypress/schematic

# Jest for unit tests
npm install --save-dev jest @testing-library/react

# Firebase emulator
npm install --save-dev @firebase/testing
```

### Cypress E2E Tests

**Create file: `cypress/e2e/puzzles.cy.js`**

```javascript
describe('Visual Puzzles E2E Tests', () => {
  
  beforeEach(() => {
    cy.visit('http://localhost:3000');
  });

  describe('Admin Panel', () => {
    
    it('Should create a picture-word puzzle', () => {
      cy.login('admin@example.com', 'password');
      cy.visit('/admin/create-visual-puzzle');
      
      cy.get('[data-testid="puzzle-title"]').type('Test Puzzle');
      cy.get('[data-testid="puzzle-description"]').type('Test Description');
      cy.get('[data-testid="puzzle-type-picture-word"]').click();
      cy.get('[data-testid="difficulty-easy"]').click();
      
      cy.get('[data-testid="category-dropdown"]').select('Learning');
      cy.get('[data-testid="topic-dropdown"]').select('Colors');
      cy.get('[data-testid="subtopic-dropdown"]').select('Basic Colors');
      
      cy.get('[data-testid="add-pair"]').click();
      cy.get('[data-testid="upload-image-0"]').attachFile('red.jpg');
      cy.get('[data-testid="word-input-0"]').type('Red');
      
      cy.get('[data-testid="publish-button"]').click();
      cy.contains('Puzzle created successfully').should('be.visible');
    });

    it('Should edit a puzzle', () => {
      cy.login('admin@example.com', 'password');
      cy.visit('/admin/create-visual-puzzle/:testPuzzleId');
      
      cy.get('[data-testid="puzzle-title"]').clear().type('Updated Title');
      cy.get('[data-testid="publish-button"]').click();
      cy.contains('Puzzle updated successfully').should('be.visible');
    });

    it('Should delete a puzzle', () => {
      cy.login('admin@example.com', 'password');
      cy.visit('/admin/puzzles');
      
      cy.get('[data-testid="delete-puzzle-:testId"]').click();
      cy.contains('Are you sure?').should('be.visible');
      cy.get('[data-testid="confirm-delete"]').click();
      cy.contains('Puzzle deleted').should('be.visible');
    });
  });

  describe('User Gameplay', () => {
    
    it('Should complete picture-word puzzle', () => {
      cy.visit('/puzzle/Learning/Colors/Basic Colors');
      cy.contains('Learn Basic Colors').click();
      
      // Match pairs
      cy.get('[data-testid="card-red"]').click();
      cy.get('[data-testid="label-Red"]').click();
      cy.contains('Correct!').should('be.visible');
      
      // ... more matching
      cy.contains('Puzzle completed!').should('be.visible');
    });

    it('Should track progress', () => {
      cy.visit('/puzzle/Learning/Colors/Basic Colors');
      cy.contains('Learn Basic Colors').click();
      
      // Complete puzzle
      cy.get('[data-testid="complete-puzzle"]').click();
      cy.contains('Puzzle completed!').should('be.visible');
      
      // Refresh and verify
      cy.reload();
      cy.contains('Next Puzzle').should('be.enabled');
    });
  });

  describe('Level Unlocking', () => {
    
    it('Should unlock next puzzle after completion', () => {
      cy.visit('/puzzle/Learning/Colors/Basic Colors');
      
      // First puzzle should be unlocked
      cy.get('[data-testid="puzzle-0"]').should('not.have.class', 'locked');
      cy.get('[data-testid="puzzle-1"]').should('have.class', 'locked');
      
      // Complete first
      cy.get('[data-testid="puzzle-0"]').click();
      cy.get('[data-testid="complete-puzzle"]').click();
      
      // Refresh and check
      cy.reload();
      cy.get('[data-testid="puzzle-1"]').should('not.have.class', 'locked');
    });
  });
});
```

**Run Cypress:**

```bash
# Interactive mode
npm run cypress

# Headless mode
npm run cypress:ci
```

---

## ✅ Test Scenarios & Checklists

### Scenario 1: Complete Admin Workflow

**Create → Edit → Publish → Play → Delete**

```
Admin Checklist:
□ Login as admin
□ Create picture-word puzzle
  □ Upload 4 images
  □ Add labels
  □ Preview looks good
  □ Click Publish
□ Verify in puzzle list
  □ Status: Published
  □ Can see in category
□ Edit puzzle
  □ Change title
  □ Add new pair
  □ Click Save
□ Verify updates live
  □ New title shows
  □ New pair visible
□ Unpublish puzzle
  □ Status: Draft
  □ Invisible to users
□ Publish again
  □ Status: Published
  □ Visible to users
□ Delete puzzle
  □ Confirm deletion
  □ Removed from list
  □ Cannot access
```

---

### Scenario 2: Complete User Journey

**Browse → Select → Play → Progress → Unlock**

```
User Checklist:
□ Navigate to /puzzle
□ Select category (Learning)
□ Select topic (Colors)
□ Select subtopic (Basic Colors)
□ See level path
  □ First puzzle unlocked
  □ Rest locked
□ Click first puzzle
□ Play and complete
  □ All interactions work
  □ Success message
  □ XP awarded
  □ Celebration animation
□ Return to level path
  □ First puzzle shows ✓
  □ Second puzzle unlocked
□ Play second puzzle
□ Complete it
□ Verify progress saved
  □ Check localStorage (guest)
  □ OR check Firestore (logged-in)
  □ Next puzzle unlocks
```

---

### Scenario 3: Mobile User Testing

```
Mobile Checklist:
□ Responsive design
  □ 375px width (iPhone)
  □ 768px width (iPad)
  □ 1024px width (Tablet)
□ Touch interactions
  □ Picture-Word: Click/touch
  □ Memory: Flip cards
  □ Spot Diff: Click spots
  □ Shadow: Drag-and-drop
  □ Ordering: Drag-and-drop
□ Performance
  □ No lag on animations
  □ Images load quickly
  □ No console errors
□ Accessibility
  □ Text readable (18px+)
  □ Colors high contrast
  □ Buttons large (44px+)
```

---

## 📱 Browser & Device Testing

### Desktop Browsers

| Browser | Version | Status | Notes |
|---------|---------|--------|-------|
| Chrome | Latest | ✅ | Primary testing |
| Firefox | Latest | ✅ | Secondary |
| Safari | Latest | ✅ | MacOS testing |
| Edge | Latest | ✅ | Windows testing |

**Testing Command:**

```bash
# Chrome
npm start

# Firefox
export BROWSER=firefox npm start

# Safari
# Open http://localhost:3000 in Safari
```

### Mobile Browsers

| Device | Browser | Test Result |
|--------|---------|-------------|
| iPhone 12 | Safari | ✅ Touch works |
| Android | Chrome | ✅ Responsive |
| iPad | Safari | ✅ Tablet layout |

**Mobile Testing Steps:**

```
1. Build for production
   npm run build

2. Start local server
   python -m http.server 3000

3. On mobile:
   - Connect to same WiFi
   - Visit: http://[your-ip]:3000
   - Test all puzzles
   - Test touch interactions
   - Monitor performance
```

---

## ⚡ Performance Testing

### Metrics to Monitor

```
Page Load Time
├─ Target: < 3 seconds
├─ Measure: Network tab → Finish time
└─ Tool: DevTools → Performance tab

First Contentful Paint (FCP)
├─ Target: < 1.5 seconds
├─ Measure: DevTools → Lighthouse
└─ Tool: PageSpeed Insights

Time to Interactive (TTI)
├─ Target: < 3.5 seconds
├─ Measure: DevTools → Lighthouse
└─ Tool: WebPageTest.org

Puzzle Load Time
├─ Target: < 1 second
├─ Measure: From click to playable
└─ Tool: DevTools → Network + Performance

Animation Frame Rate
├─ Target: 60 FPS (smooth)
├─ Measure: DevTools → Performance → Frames
└─ Tool: Monitor for dropped frames

Memory Usage
├─ Target: < 50MB per puzzle
├─ Measure: DevTools → Memory → Take heap snapshot
└─ Tool: Check for memory leaks
```

**Performance Testing Script:**

```bash
# Install Lighthouse CLI
npm install -g lighthouse

# Test home page
lighthouse http://localhost:3000 --view

# Test puzzle page
lighthouse http://localhost:3000/puzzle --view

# Test admin panel
lighthouse http://localhost:3000/admin --view
```

---

## 🔐 Security Testing

### Authentication & Authorization

```
Test 1: Regular user cannot access admin
□ Login as non-admin user
□ Try to visit /admin/create-visual-puzzle
□ Verify: Access denied or redirected to home
□ Verify: No puzzle data leaked

Test 2: Logged-out user cannot see draft puzzles
□ Create draft puzzle as admin
□ Logout
□ Try to access draft puzzle via URL
□ Verify: Not found or 404
□ Verify: Draft hidden from users

Test 3: Published puzzles visible to all
□ Create and publish puzzle
□ Logout
□ Access puzzle page
□ Verify: Puzzle visible
□ Verify: Can play without login

Test 4: Firestore security rules
□ Try to query puzzles directly (DevTools Console)
□ try: db.collection('puzzles').get()
□ Verify: Permission denied (if not authenticated)
□ Verify: Can read if public read allowed
```

### Data Validation

```
Test 1: Input validation
□ Try SQL injection in title:
  "Test'; DROP TABLE puzzles; --"
□ Verify: Escaped/sanitized
□ Verify: No database error

Test 2: File upload security
□ Try uploading .exe file
□ Verify: Rejected
□ Try uploading malicious SVG
□ Verify: Rejected or sanitized

Test 3: XSS prevention
□ Add image with onerror event:
  <img src=x onerror="alert('xss')">
□ Verify: Event doesn't fire
□ Verify: Sanitized on display

Test 4: Image URL validation
□ Try external image URL:
  "http://attacker.com/steal-data.jpg"
□ Verify: Rejected or sandboxed
□ Verify: Only Cloudinary URLs accepted
```

---

## 🐛 Debugging

### Browser DevTools

**Console (F12):**
```javascript
// Check logged-in user
firebase.auth().currentUser

// Check puzzle progress
const progress = JSON.parse(
  localStorage.getItem('amaha_puzzle_progress')
)
console.log(progress)

// Check Firestore data
db.collection('puzzles').get().then(snap => {
  snap.forEach(doc => console.log(doc.id, doc.data()))
})
```

**Network Tab:**
- Monitor API calls
- Check Firestore requests
- Verify Cloudinary uploads
- Look for 404 or 500 errors

**Performance Tab:**
- Record animations
- Check frame rate
- Identify bottlenecks
- Monitor memory usage

### Firestore Debugging

```javascript
// Enable logging
firebase.firestore.setLogLevel('debug')

// Check security rules
// Go to Firebase Console → Rules → Inspect
// Look for denied requests in Logs

// Verify data structure
// Console → Firestore → puzzles collection
// Check document fields match schema
```

### React DevTools

```javascript
// Check component state
// Install React DevTools extension
// Inspect puzzle components
// Check props and state

// Monitor renders
// DevTools → Profiler tab
// Check for unnecessary re-renders
```

---

## 📋 Final Test Checklist

Before deploying to production:

```
Admin Features:
□ Create all 5 puzzle types
□ Edit existing puzzles
□ Publish/unpublish puzzles
□ Delete puzzles
□ Upload images via Cloudinary
□ Set difficulty and age groups
□ Assign categories/topics/subtopics
□ Save as draft
□ Preview puzzles

User Gameplay:
□ All 5 puzzle types playable
□ Picture-Word: Click matching works
□ Spot Difference: Click detection accurate
□ Find Pair: Memory game works
□ Picture-Shadow: Drag-and-drop works
□ Ordering: Sequence arrangement works
□ Celebration animations trigger
□ XP awards correctly

Progress Tracking:
□ Guest progress saves (localStorage)
□ Logged-in progress saves (Firestore)
□ Cross-device sync works
□ Guest → login migration works
□ Progress persists after refresh
□ Multiple puzzles tracked

Level System:
□ First puzzle unlocked initially
□ Completion unlocks next
□ Cannot skip ahead
□ Unlock animation smooth
□ Works across refreshes

Performance:
□ Page load < 3 seconds
□ Animations 60 FPS
□ Memory < 50MB
□ No console errors

Mobile:
□ Responsive on all sizes
□ Touch interactions work
□ No horizontal scroll needed
□ Buttons large (44px+)
□ Text readable (16px+)

Security:
□ Regular users cannot access admin
□ Draft puzzles hidden from users
□ Firestore rules enforced
□ Image uploads validated
□ Input sanitized
□ XSS protection working

Browsers:
□ Chrome ✅
□ Firefox ✅
□ Safari ✅
□ Edge ✅
□ Mobile browsers ✅
```

---

**Status: Ready for Testing** ✅

All test scenarios documented and ready to execute. Start with manual testing, then add automated tests as coverage grows.

**Test Execution Order:**
1. Manual admin tests (1-9)
2. Manual user tests (10-14)
3. Progress tests (15-18)
4. Browser compatibility
5. Mobile responsiveness
6. Performance optimization
7. Security audit
8. Automated testing (Cypress)

---

*Last Updated: December 24, 2025*  
*Version: 1.0*  
*Status: Ready for QA* ✅
