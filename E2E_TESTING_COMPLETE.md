# End-to-End (E2E) Testing Guide

**Status:** Comprehensive Testing Suite
**Date:** December 24, 2025
**Estimated Time:** 60-90 minutes

---

## Overview

This guide provides complete E2E testing procedures to verify all Phase 2 features work correctly:
- Daily Challenge system
- Leaderboards
- Story learning paths
- Guest & user flows
- Mobile responsiveness
- Dark mode
- Error handling

---

## Part 1: Setup & Preparation (5 minutes)

### Prerequisites
- Development server running: `npm start` on localhost:3008
- Browser DevTools open (F12)
- Console checked for errors
- A test user account (or use guest mode)

### Test Data Requirements
Before starting tests, ensure you have:
1. ✅ At least one daily challenge created
2. ✅ At least one published story with 3+ chapters
3. ✅ Sample user data for leaderboards (optional, you can manually submit)

---

## Part 2: Daily Challenge Feature Testing (20 minutes)

### Test 2.1: Daily Challenge Card on Home Page

**Steps:**
1. Navigate to `http://localhost:3008`
2. Scroll down to find "Today's Challenge" card
3. Verify card displays:
   - Challenge type (Quiz or Puzzle)
   - Difficulty level
   - XP and coin rewards
   - "Play Challenge" button

**Expected Results:**
```
✅ Card visible after hero section
✅ All fields populated correctly
✅ Button is clickable
✅ No console errors
```

**Test Status:** ___PASS___ / ___FAIL___

---

### Test 2.2: Play Daily Challenge (Guest)

**Steps:**
1. As guest user, click "Play Challenge" button
2. Should navigate to quiz/puzzle screen
3. Complete or attempt the challenge
4. Return to home page

**Expected Results:**
```
✅ Navigation works smoothly
✅ Challenge page loads
✅ Can complete/submit challenge
✅ XP/coins credited in browser notification
✅ Streak counter visible on return
```

**Test Status:** ___PASS___ / ___FAIL___

---

### Test 2.3: Admin Panel - Create Daily Challenge

**Steps:**
1. Go to `/admin/dashboard`
2. Click **"🎯 Daily Challenges"** button
3. Modal opens with challenge management
4. Click **"+ Create Challenge"**
5. Fill form:
   - Type: Quiz
   - Difficulty: Easy
   - Category: Math
   - Topic: Basics
   - XP: 75
   - Coins: 15
6. Click "Create Challenge"

**Expected Results:**
```
✅ Modal opens without page navigation
✅ Category dropdown shows all 5 categories
✅ Topic dropdown updates based on category
✅ Form submits successfully
✅ Success message appears
✅ New challenge visible in "Upcoming Challenges"
✅ Can immediately see it as "Today's Challenge"
```

**Test Status:** ___PASS___ / ___FAIL___

---

### Test 2.4: Category & Topic Selection

**Steps:**
1. In Daily Challenge modal, click Category dropdown
2. Select each category (Math, English, Science, History, Programming)
3. After each selection, verify Topic dropdown updates
4. Verify topics are category-specific

**Category-Topic Mapping:**
```
Math        → basics, algebra, geometry, calculus
English     → vocabulary, grammar, literature, writing
Science     → physics, chemistry, biology, general
History     → ancient, medieval, modern, current
Programming → basics, javascript, python, web-dev
```

**Expected Results:**
```
✅ All 5 categories appear in dropdown
✅ Topic dropdown changes per category
✅ Topics are correctly formatted
✅ Selection persists after switching
```

**Test Status:** ___PASS___ / ___FAIL___

---

### Test 2.5: Upcoming Challenges List

**Steps:**
1. In Daily Challenge modal, scroll to "Upcoming Challenges"
2. Verify table shows 7-day forecast
3. Each row should show:
   - Date (YYYY-MM-DD format)
   - Type (Quiz/Puzzle)
   - Difficulty (with color badge)
   - Category
   - Rewards (XP + Coins)

**Expected Results:**
```
✅ List displays cleanly
✅ Dates increment daily
✅ All columns visible and aligned
✅ Difficulty badges show correct colors
  - Easy: Green
  - Medium: Orange
  - Hard: Red
✅ Rewards calculated correctly
```

**Test Status:** ___PASS___ / ___FAIL___

---

## Part 3: Stories & Learning Paths (20 minutes)

### Test 3.1: Stories Page (User View)

**Steps:**
1. Navigate to `/stories`
2. Verify page displays:
   - Story cards/grid layout
   - Published stories only
   - Story title, description, cover image
   - Progress bar (if user started story)
   - "Start" or "Continue" button

**Expected Results:**
```
✅ Page loads without errors
✅ Published stories visible
✅ Cards are responsive (stack on mobile)
✅ Buttons are accessible
✅ No unpublished stories shown
```

**Test Status:** ___PASS___ / ___FAIL___

---

### Test 3.2: Admin Panel - Create Story

**Steps:**
1. Go to `/admin/dashboard`
2. Click **"📖 Stories"** button
3. Modal opens with story editor
4. Click **"+ New"** button
5. Fill form:
   - Title: "Test Story XYZ"
   - Description: "A test story for verification"
   - Target Audience: Kids
   - Cover Image: (leave blank or use URL)
6. Click "Create"

**Expected Results:**
```
✅ Modal opens (not separate page)
✅ Story creation form appears
✅ Can fill all fields
✅ Success message after creation
✅ New story appears in stories list
✅ Story is in Draft status (not published)
```

**Test Status:** ___PASS___ / ___FAIL___

---

### Test 3.3: Add Chapters to Story

**Steps:**
1. In Stories modal, story list on left
2. Click newly created story
3. Story details load on right
4. Scroll to "Add Chapter" section
5. Add 3 chapters:
   - Chapter 1: "Introduction"
   - Chapter 2: "Main Content"
   - Chapter 3: "Conclusion"
6. Fill description for each
7. Click "+ Add Chapter"

**Expected Results:**
```
✅ Story details load after clicking
✅ Add chapter form appears
✅ Can fill chapter title and description
✅ Button adds chapter successfully
✅ Chapter count updates
✅ Chapters appear in chapters list
✅ Chapters show in correct order
```

**Test Status:** ___PASS___ / ___FAIL___

---

### Test 3.4: Publish Story

**Steps:**
1. In Stories modal, select story with 3+ chapters
2. Verify story shows "⏳ Draft" status
3. Click **"✅ Publish Story"** button
4. Verify story status changes to "✅ Published"

**Expected Results:**
```
✅ Publish button is visible for drafts
✅ Story status changes immediately
✅ Published stories visible on `/stories`
✅ Success message displayed
✅ Can't publish already-published stories
```

**Test Status:** ___PASS___ / ___FAIL___

---

### Test 3.5: View Published Story (User)

**Steps:**
1. Navigate to `/stories` as guest/user
2. Find published story
3. Click story card
4. Verify story detail page loads with:
   - Story title and description
   - Chapter list (1, 2, 3 locked/unlocked)
   - Chapter content
   - Progress indicator

**Expected Results:**
```
✅ Story page loads
✅ All chapters visible
✅ Chapter 1 is unlocked
✅ Chapters 2-3 show as locked
✅ Can click Chapter 1 to read
✅ Progress tracked correctly
```

**Test Status:** ___PASS___ / ___FAIL___

---

## Part 4: Leaderboards Testing (15 minutes)

### Test 4.1: Leaderboards Page Navigation

**Steps:**
1. Navigate to `/leaderboards`
2. Verify page displays:
   - Time period selector (Daily, Weekly, Monthly, All-time)
   - Category filter dropdown
   - Leaderboard table with:
     - Rank (🥇 🥈 🥉)
     - User name
     - Score
     - XP/Coins

**Expected Results:**
```
✅ Page loads without errors
✅ All time periods available
✅ Categories filter correctly
✅ Table is responsive
✅ Medals display correctly
✅ Top 50 users shown
```

**Test Status:** ___PASS___ / ___FAIL___

---

### Test 4.2: Leaderboards Filtering

**Steps:**
1. On leaderboards page:
2. Select different time periods:
   - Daily (shows today's leaders)
   - Weekly (shows last 7 days)
   - Monthly (shows last 30 days)
   - All-time (shows all-time leaders)
3. Select different categories
4. Verify table updates

**Expected Results:**
```
✅ Rankings change based on period
✅ Scores update correctly
✅ Category filter works
✅ No errors on filter changes
✅ Loading state shows during updates
```

**Test Status:** ___PASS___ / ___FAIL___

---

### Test 4.3: Leaderboards Pagination

**Steps:**
1. On leaderboards page
2. Scroll down if there are >50 users
3. Look for pagination controls
4. Test previous/next page navigation

**Expected Results:**
```
✅ Shows 50 users per page
✅ Pagination controls visible if needed
✅ Next/prev buttons work
✅ Can reach all users
```

**Test Status:** ___PASS___ / ___FAIL___

---

## Part 5: Guest-to-User Flow (15 minutes)

### Test 5.1: Guest Progress Tracking

**Steps:**
1. Clear browser localStorage (DevTools → Application → Local Storage → Clear)
2. Don't login (use as guest)
3. Complete daily challenge
4. View leaderboard
5. Open DevTools → Application → Local Storage
6. Verify guest data structure

**Expected Results:**
```
✅ Challenge completion tracked in localStorage
✅ XP and coins credited
✅ Progress persists across page reloads
✅ localStorage has guestId
✅ Progress data is structured correctly
```

**Test Status:** ___PASS___ / ___FAIL___

---

### Test 5.2: Login as User (Guest → User Merge)

**Steps:**
1. As guest with progress:
2. Click "Login" in header
3. Sign in with test account
4. Return to dashboard
5. Verify guest progress is merged into user account

**Expected Results:**
```
✅ Can login while guest
✅ Guest data doesn't disappear
✅ User sees combined progress
✅ Streaks are preserved
✅ XP and coins are merged
✅ No duplicate data
```

**Test Status:** ___PASS___ / ___FAIL___

---

### Test 5.3: Logged-in User Flow

**Steps:**
1. While logged in:
2. Complete daily challenge
3. Submit quiz/puzzle
4. Check profile for updated stats
5. Verify Firestore has user progress

**Expected Results:**
```
✅ User progress saved to Firestore
✅ Stats update in real-time
✅ Streaks tracked in Firestore
✅ XP and coins persisted
✅ Can logout and login to see same data
```

**Test Status:** ___PASS___ / ___FAIL___

---

## Part 6: Mobile Responsiveness (15 minutes)

### Test 6.1: Mobile Layout (375px - iPhone SE)

**Steps:**
1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Set viewport to 375x667 (iPhone SE)
4. Test each page:
   - Home page
   - Daily Challenge
   - Leaderboards
   - Stories

**Expected Results for each page:**
```
✅ Single column layout
✅ Text readable (no overflow)
✅ Buttons touch-friendly (48px+)
✅ Images responsive
✅ Modals fit screen
✅ No horizontal scroll (except modals)
```

**Test Status:** ___PASS___ / ___FAIL___

---

### Test 6.2: Tablet Layout (768px - iPad)

**Steps:**
1. Set viewport to 768x1024 (iPad)
2. Test same pages
3. Verify layout optimizes for larger screen

**Expected Results:**
```
✅ Two-column layout where applicable
✅ Tables use space efficiently
✅ Grid layouts show 2-3 columns
✅ Modals properly centered
✅ All content visible
```

**Test Status:** ___PASS___ / ___FAIL___

---

### Test 6.3: Desktop Layout (1920px)

**Steps:**
1. Set viewport to 1920x1080
2. Test all pages
3. Verify full-width layouts

**Expected Results:**
```
✅ Multi-column layouts
✅ Tables show all columns
✅ Sidebar not overlapping content
✅ Maximum width constraints respected
✅ White space balanced
```

**Test Status:** ___PASS___ / ___FAIL___

---

## Part 7: Dark Mode Testing (10 minutes)

### Test 7.1: Enable Dark Mode

**Steps:**
1. Go to system settings
   - Windows: Settings → Personalization → Colors → Dark
   - macOS: System Preferences → General → Dark
   - Linux: Varies by desktop environment
2. OR in DevTools → Rendering → emulate CSS media feature prefers-color-scheme
3. Set to "dark"

**Expected Results:**
```
✅ App automatically switches to dark mode
✅ Background colors are dark (#1e1e1e or similar)
✅ Text is light and readable
✅ Contrast ratio meets WCAG AA
✅ No white flashes
```

**Test Status:** ___PASS___ / ___FAIL___

---

### Test 7.2: Dark Mode Components

**Steps:**
1. In dark mode, test:
   - Home page
   - Admin modals
   - Leaderboards
   - Stories

**Expected Results:**
```
✅ Modals have dark background
✅ Forms are readable
✅ Buttons have sufficient contrast
✅ Text color is light
✅ Card backgrounds are dark
✅ Borders are visible
✅ No unreadable text
```

**Test Status:** ___PASS___ / ___FAIL___

---

### Test 7.3: Light Mode (Revert)

**Steps:**
1. Switch back to light mode
2. Reload page
3. Verify app returns to light theme

**Expected Results:**
```
✅ Light colors display correctly
✅ Text is dark and readable
✅ Smooth transition between modes
```

**Test Status:** ___PASS___ / ___FAIL___

---

## Part 8: Error Handling (10 minutes)

### Test 8.1: Network Error Handling

**Steps:**
1. DevTools → Network → Throttle to "Offline"
2. Try to create daily challenge
3. Try to load leaderboards

**Expected Results:**
```
✅ User sees error message
✅ Error is user-friendly (not technical)
✅ Can retry
✅ No infinite loading spinners
```

**Test Status:** ___PASS___ / ___FAIL___

---

### Test 8.2: Missing Data Handling

**Steps:**
1. Delete a daily challenge from Firestore (if possible)
2. Try to play it
3. Verify graceful error handling

**Expected Results:**
```
✅ Shows "Challenge not found" or similar
✅ Doesn't crash
✅ Allows user to go back
```

**Test Status:** ___PASS___ / ___FAIL___

---

### Test 8.3: Invalid Form Input

**Steps:**
1. In Daily Challenge modal:
2. Leave fields empty
3. Try to create challenge
4. In Stories modal:
5. Leave title empty
6. Try to create story

**Expected Results:**
```
✅ Form validation prevents submission
✅ Error message shows required field
✅ Form doesn't clear on error
```

**Test Status:** ___PASS___ / ___FAIL___

---

## Part 9: Console & Performance (5 minutes)

### Test 9.1: Console Errors

**Steps:**
1. Open DevTools Console (F12 → Console tab)
2. Navigate through all pages
3. Complete actions (create, submit, etc.)
4. Check for red error messages

**Expected Results:**
```
✅ No red error messages
✅ No "Cannot read property" errors
✅ No import/export errors
✅ Warnings are acceptable
✅ Network requests show 200/201 status
```

**Test Status:** ___PASS___ / ___FAIL___

---

### Test 9.2: Performance

**Steps:**
1. DevTools → Performance tab
2. Record page load
3. Stop recording
4. Check metrics:
   - First Contentful Paint (FCP) < 2s
   - Largest Contentful Paint (LCP) < 3s
   - Cumulative Layout Shift (CLS) < 0.1

**Expected Results:**
```
✅ FCP under 2 seconds
✅ LCP under 3 seconds
✅ CLS less than 0.1
✅ No jank on interactions
```

**Test Status:** ___PASS___ / ___FAIL___

---

## Part 10: Integration Tests (10 minutes)

### Test 10.1: Full User Journey

**Steps:**
1. Start as guest
2. Complete daily challenge
3. View leaderboard
4. Browse stories
5. Start a story (read Chapter 1)
6. Create account / login
7. Return to verify data merged
8. Complete another story chapter
9. Check updated leaderboard rank

**Expected Results:**
```
✅ All features work together
✅ Data persists correctly
✅ No data loss during login
✅ Stats update across all pages
✅ Navigation is smooth
```

**Test Status:** ___PASS___ / ___FAIL___

---

### Test 10.2: Admin Dashboard Full Flow

**Steps:**
1. Navigate to `/admin/dashboard`
2. Click "🎯 Daily Challenges"
3. Create a new challenge
4. Click "📖 Stories"
5. Create a new story
6. Add 3 chapters
7. Publish story
8. Close modals
9. Navigate to `/stories` as guest
10. Verify new story is visible

**Expected Results:**
```
✅ Modals open inline (not separate pages)
✅ Can switch between modals
✅ Data appears instantly
✅ Guest can see published content
✅ Admin content is not visible to guests
```

**Test Status:** ___PASS___ / ___FAIL___

---

## Summary Checklist

### Phase 2 Features
- [ ] Daily Challenge system works
- [ ] Admin can create challenges with categories/topics
- [ ] Stories can be created, chaptered, and published
- [ ] Leaderboards display correctly with filtering
- [ ] Guest mode works without login
- [ ] User mode saves to Firestore
- [ ] Guest-to-user merge works

### Quality Metrics
- [ ] Mobile responsive (375px, 768px, 1920px)
- [ ] Dark mode works on all pages
- [ ] No console errors
- [ ] Performance acceptable (FCP < 2s, LCP < 3s)
- [ ] Admin modals are inline, not page navigations
- [ ] Category and topic dropdowns populated correctly
- [ ] Stories are visible after publishing

### Success Criteria
```
✅ All 54 test cases pass
✅ Zero critical errors
✅ Zero console errors
✅ Mobile responsive verified
✅ Dark mode verified
✅ Admin inline modals working
✅ Ready for Phase 4 (notifications & analytics)
```

---

## Next Steps

If all tests pass:
1. Review PHASE_3_4_ROADMAP.md for Phase 4 work
2. Plan notifications feature (best ROI)
3. Implement analytics dashboard
4. Optimize performance

If tests fail:
1. Document which tests failed
2. Check the detailed failure logs
3. Review error messages in console
4. Fix critical issues first
5. Re-run tests

---

**Testing Completed:** _______________
**Tester Name:** _______________
**Date:** _______________
**Result:** ✅ PASS / ❌ FAIL / ⚠️ PARTIAL
