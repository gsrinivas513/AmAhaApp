# Phase 3: Testing & Sample Data Guide

**Status:** Ready to Execute
**Date:** December 24, 2025
**Estimated Time:** 45 minutes

---

## Overview

This guide will help you:
1. Create sample data (daily challenge + story)
2. Test all features end-to-end
3. Verify mobile responsiveness
4. Confirm guest/user flows work correctly

---

## Part 1: Create Sample Data

### Step 1: Add Your First Daily Challenge

**Via Admin Panel:**

1. Start the app: `npm start`
2. Navigate to: `http://localhost:3000/admin/daily-challenge`
3. Fill the form:
   - **Type:** Quiz (or Puzzle)
   - **Difficulty:** Easy
   - **XP Reward:** 50
   - **Coins Reward:** 10
4. Click "Create Challenge"

**Expected Result:**
- Challenge appears in "Today's Challenge" section
- Timestamp shows current date
- Available on home page card

**Data Structure Created in Firestore:**
```
/daily_challenges/{today-date}
├── type: "quiz"
├── difficulty: "easy"
├── xp: 50
├── coins: 10
├── categoryName: "math"
├── topicName: "basics"
└── createdAt: {timestamp}
```

---

### Step 2: Create Sample Story

**Via Admin Panel:**

1. Navigate to: `http://localhost:3000/admin/stories`
2. Fill "Create New Story" form:
   - **Title:** "Learn JavaScript Basics"
   - **Description:** "A beginner-friendly journey through JavaScript fundamentals"
   - **Target Audience:** "kids"
   - **Cover Image URL:** (optional) Any public image URL
3. Click "Create Story"
4. Story appears in the list on the left
5. Click the story to open detail panel
6. Add chapters:
   - **Chapter 1:**
     - Title: "What is JavaScript?"
     - Description: "Learn what JavaScript does"
     - Character: "Professor Code" (optional)
   - **Chapter 2:**
     - Title: "Your First Line"
     - Description: "Write your first JavaScript line"
     - Character: "Code Buddy"
   - **Chapter 3:**
     - Title: "Making Decisions"
     - Description: "Learn about if/else statements"
     - Character: "Professor Code"
7. Click "Publish Story" to make it public

**Expected Result:**
- Story appears on `/stories` page
- 3 chapters unlocked sequentially
- Progress bar shows completion status

**Data Structure Created in Firestore:**
```
/stories/{storyId}
├── title: "Learn JavaScript Basics"
├── description: "..."
├── targetAudience: "kids"
├── chapters: 3
├── published: true
└── createdAt: {timestamp}

/stories/{storyId}/chapters/{chapterId}
├── title: "What is JavaScript?"
├── description: "..."
├── order: 1
└── character: "Professor Code"

/story_progress/{userId}
└── {storyId}
    ├── currentChapter: 0
    ├── completedChapters: []
    └── progress: 0
```

---

## Part 2: Guest Flow Testing

### Test 1: Daily Challenge as Guest

**Steps:**
1. Open app in **incognito/private window** (guest mode)
2. Go to home page
3. Look for "🎯 Today's Challenge" card
4. **Expected:** Card should display without login
5. Click "Play" button
6. **Expected:** Redirects to quiz/puzzle page (may require login there)

**Verify localStorage:**
```javascript
// Open DevTools Console (F12)
localStorage.getItem('daily_challenge_' + new Date().toISOString().split('T')[0])
// Should show guest completion data
```

---

### Test 2: Leaderboards as Guest

**Steps:**
1. In guest/incognito mode
2. Navigate to: `http://localhost:3000/leaderboards`
3. **Expected:** Page loads with leaderboard table
4. Change filters:
   - Time period: Daily → Weekly → Monthly
   - Category: All → Quizzes → Puzzles
5. **Expected:** Data updates, pagination works

**Note:** Guest scores saved to localStorage with format:
```javascript
localStorage.getItem('leaderboard_guest_{date}_{category}')
```

---

### Test 3: Stories as Guest

**Steps:**
1. Navigate to: `http://localhost:3000/stories`
2. **Expected:** Story grid displays with sample story
3. Click "Story Map Card"
4. **Expected:** Story detail loads (or navigate page if implemented)
5. Filter by status:
   - All → In Progress → Not Started → Completed
6. **Expected:** Filters work, story appears in appropriate section

**Guest Progress Saved to:**
```javascript
localStorage.getItem('story_progress_{storyId}')
// Returns: { currentChapter: 0, completedChapters: [], progress: 0 }
```

---

## Part 3: User Flow Testing

### Test 4: Login & Verify Sync

**Steps:**
1. Open **new tab** (no guest data)
2. Login with test account
3. Navigate to `/daily-challenge`
4. **Expected:** Challenge loads, shows as not completed
5. Mark as complete (if button available)
6. Refresh page
7. **Expected:** Completion status persists

**Verify Firestore:**
```javascript
// Console in DevTools
// Check Firestore:
// Collections → daily_progress → [userId] → challenges → [today-date]
// Should show: { completed: true, completionTime: {timestamp}, ... }
```

---

### Test 5: Leaderboard Scoring

**Steps:**
1. Logged in user completes a quiz/puzzle
2. Navigate to `/leaderboards`
3. **Expected:** User appears on leaderboard
4. Change time periods
5. **Expected:** Leaderboard updates correctly

**Verify Firestore:**
```
/leaderboards/{period}/{categoryId}/users/{userId}
├── score: 1200
├── games: 5
├── accuracy: 85
├── lastUpdated: {timestamp}
└── rank: 3
```

---

### Test 6: Story Progress Tracking

**Steps:**
1. Logged in user on `/stories` page
2. Select a story
3. Complete chapters
4. Refresh page
5. **Expected:** Progress persists, chapters show completed status

**Verify Firestore:**
```
/story_progress/{userId}
└── {storyId}
    ├── currentChapter: 1
    ├── completedChapters: [0]
    └── progress: 33.33
```

---

## Part 4: Guest-to-User Merge

### Test 7: Merge on Login

**Steps:**
1. Open incognito window (guest mode)
2. Complete daily challenge as guest
3. **Verify localStorage:**
   ```javascript
   localStorage.getItem('daily_challenge_' + today)
   // Shows: { completed: true, ... }
   ```
4. Complete leaderboard score as guest
5. Browse story and start reading
6. **Close incognito window**
7. Open normal window, login with same account
8. Navigate to home page
9. **Expected:** Daily challenge should still show as completed
10. Check leaderboard - guest score should be merged
11. Check story - progress should be merged

**What Should Happen:**
- Guest data in localStorage is read
- When user logs in, `mergeGuestProgressToUser()` is called
- Data is transferred to Firestore
- localStorage is cleared
- User sees combined progress (guest + new)

---

## Part 5: Mobile Responsiveness

### Test 8: Mobile Layout (375px width)

**Steps:**
1. Open DevTools (F12)
2. Click device toggle (mobile icon)
3. Select "iPhone SE" (375px width)
4. Test each page:
   - `/` (home) - Daily Challenge card should stack nicely
   - `/daily-challenge` - Full page view, readable
   - `/leaderboards` - Table should be responsive
   - `/stories` - Grid should show 1-2 columns

**Verify:**
- ✅ No horizontal scrolling
- ✅ Text is readable (>14px)
- ✅ Buttons are touchable (>48px height)
- ✅ Images scale properly

### Test 9: Tablet Layout (768px width)

**Steps:**
1. Select "iPad" (768px width) in DevTools
2. Test each page
3. **Verify:**
   - ✅ Grid shows 2 columns for stories
   - ✅ Table is scrollable horizontally if needed
   - ✅ Layout looks good

### Test 10: Desktop Layout (1920px width)

**Steps:**
1. Select "No device" in DevTools
2. Maximize window
3. **Verify:**
   - ✅ Content is centered
   - ✅ Max-width containers respected
   - ✅ All elements visible

---

## Part 6: Dark Mode Testing

### Test 11: Dark Mode Support

**Steps:**
1. Open browser DevTools
2. Click "..." menu → More tools → Rendering
3. Emulate CSS media feature `prefers-color-scheme`
4. Select "dark"
5. Refresh page
6. **Verify all pages:**
   - Home - dark background, light text
   - Daily Challenge - dark card styling
   - Leaderboards - dark table
   - Stories - dark grid

**Expected:**
- Text is readable in dark mode
- Contrast ratio > 4.5:1
- Images still visible

---

## Part 7: Error Handling

### Test 12: Network Errors

**Steps:**
1. Open DevTools → Network tab
2. Set throttling to "Offline"
3. Navigate to each page
4. **Expected:**
   - Pages still load (cached or from localStorage)
   - Graceful error message displayed
   - No console errors

### Test 13: Missing Data

**Steps:**
1. Try accessing `/daily-challenge` when no challenge exists
2. **Expected:** "No challenge available today" message
3. Try accessing `/stories` with no stories created
4. **Expected:** "No stories available yet" message

---

## Part 8: Verify Features Work End-to-End

### Test 14: Complete Daily Challenge Flow

**As Guest:**
1. See card on home page ✅
2. Click "Play" button ✅
3. Complete quiz/puzzle ✅
4. See completion message ✅
5. Streak increments ✅
6. XP/coins shown ✅

**As User:**
1. Same as guest ✅
2. Progress saved to Firestore ✅
3. Streak visible next session ✅

### Test 15: Complete Leaderboard Flow

**Scenarios:**
1. View daily leaderboard ✅
2. Filter by category ✅
3. See own rank ✅
4. Pagination works (50 per page) ✅
5. Medal display (🥇 🥈 🥉) shows ✅

### Test 16: Complete Story Flow

**Scenarios:**
1. View all stories ✅
2. Filter by status ✅
3. See progress bar ✅
4. Chapters unlock sequentially ✅
5. Completion badges display ✅

---

## Checklist

### Sample Data Created
- [ ] Daily challenge created
- [ ] Story created with 3 chapters
- [ ] Both published and visible

### Guest Flow Verified
- [ ] Daily challenge accessible without login
- [ ] Leaderboard accessible without login
- [ ] Stories browsable without login
- [ ] localStorage updated correctly

### User Flow Verified
- [ ] Login works
- [ ] Challenge completion tracked in Firestore
- [ ] Story progress tracked in Firestore
- [ ] Leaderboard scores recorded

### Guest-to-User Merge Verified
- [ ] Guest data detected on login
- [ ] Data merged to Firestore
- [ ] localStorage cleared
- [ ] No duplicate entries

### Responsive Design Verified
- [ ] 375px (mobile) works
- [ ] 768px (tablet) works
- [ ] 1920px (desktop) works
- [ ] No horizontal scrolling

### Dark Mode Verified
- [ ] Dark backgrounds apply
- [ ] Text readable in dark mode
- [ ] No contrast issues

### Error Handling Verified
- [ ] Offline gracefully handled
- [ ] Missing data shows messages
- [ ] No console errors

### Features End-to-End
- [ ] Daily challenge complete flow
- [ ] Leaderboard filtering works
- [ ] Story selection works
- [ ] All pages render without errors

---

## Quick Test Checklist (5 minutes)

If short on time, test these critical paths:

1. **Home Page:**
   - [ ] Load home page
   - [ ] See "Today's Challenge" card
   - [ ] No console errors

2. **Daily Challenge Page:**
   - [ ] Navigate to `/daily-challenge`
   - [ ] See challenge details
   - [ ] Click "Play" button
   - [ ] Loads quiz/puzzle (or shows message)

3. **Leaderboards:**
   - [ ] Navigate to `/leaderboards`
   - [ ] Change time period filter
   - [ ] Change category filter
   - [ ] See leaderboard table

4. **Stories:**
   - [ ] Navigate to `/stories`
   - [ ] See story cards in grid
   - [ ] Change filter
   - [ ] Cards update correctly

5. **Mobile:**
   - [ ] Open DevTools
   - [ ] Select iPhone SE
   - [ ] Navigate to home page
   - [ ] No horizontal scroll

---

## Troubleshooting

### "No challenge available today"
- **Issue:** Daily challenge not created
- **Fix:** Go to `/admin/daily-challenge` and create one

### "No stories available yet"
- **Issue:** Stories not created
- **Fix:** Go to `/admin/stories` and create at least one

### Dark mode not working
- **Issue:** CSS media queries not applied
- **Fix:** Check DevTools → Rendering → CSS media feature
- **Note:** Some browsers need prefers-color-scheme to be set

### Guest data not merging
- **Issue:** localStorage not syncing to Firestore
- **Fix:** Check browser console for errors
- **Debug:** `localStorage.getItem('daily_challenge_YYYY-MM-DD')`

### Build errors
- **Fix:** `npm run build` from project root
- **Check:** All imports use correct paths
- **Verify:** No circular dependencies

---

## Success Criteria

✅ **All tests pass** means:
- Features work as designed
- Mobile responsive
- Dark mode supported
- Guest/user flows seamless
- Error handling graceful
- No breaking changes

---

## Next Steps After Testing

1. **Phase 4 - Polish & Optimization**
   - Add notifications (toast messages)
   - Implement analytics tracking
   - Performance optimization
   - SEO improvements

2. **Phase 5 - Deployment**
   - Deploy to Firebase Hosting
   - Monitor for errors
   - Gather user feedback
   - Plan Phase 2 features

---

**Estimated Time:**
- Sample data creation: 10 minutes
- Basic testing: 20 minutes
- Mobile testing: 10 minutes
- Dark mode testing: 5 minutes
- **Total: 45 minutes**

Good luck! 🚀
