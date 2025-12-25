# 🚀 AmAhaApp Feature Extension - Quick Start Guide

**Last Updated:** December 24, 2025  
**Status:** Ready to Integrate ✅

---

## 📋 What You Have

### **4 New Services** - Ready to use immediately
```javascript
// Daily challenges
import { getTodayChallenge, markChallengeComplete, getUserStreak } from './services/dailyChallengeService';

// Leaderboards
import { updateLeaderboardScore, getLeaderboard, getUserRank } from './services/leaderboardService';

// Stories
import { getStory, completeChapter, isChapterUnlocked } from './services/storyService';

// Game modes
import { getGameModeConfig, calculateScore, initializeGameSession } from './services/gameModeService';
```

### **UI Components** - Drop in ready
```javascript
import DailyChallengeCard from './components/DailyChallenge/DailyChallengeCard';
import LeaderboardTable from './components/Leaderboard/LeaderboardTable';
import StoryMapCard from './components/Story/StoryMapCard';
```

### **Admin Pages** - Full CRUD
```javascript
import DailyChallengeAdmin from './admin/DailyChallengeAdmin';
import StoryEditor from './admin/StoryEditor';
```

---

## ⚡ Quick Integration (30 minutes)

### Step 1: Add Routes
```javascript
// src/App.js
import DailyChallengeAdmin from './admin/DailyChallengeAdmin';
import StoryEditor from './admin/StoryEditor';

<Routes>
  {/* Admin Routes */}
  <Route path="/admin/daily-challenge" element={<DailyChallengeAdmin />} />
  <Route path="/admin/stories" element={<StoryEditor />} />
</Routes>
```

### Step 2: Update Home Page
```javascript
// src/home/HomePage.jsx
import DailyChallengeCard from '../components/DailyChallenge/DailyChallengeCard';

export default function HomePage() {
  return (
    <>
      <DailyChallengeCard 
        onPlayClick={() => navigate('/daily-challenge')} 
      />
      {/* Rest of page */}
    </>
  );
}
```

### Step 3: Add Admin Menu
```javascript
// src/admin/Sidebar.jsx - Add to menu
<li>
  <Link to="/admin/daily-challenge">
    🎯 Daily Challenge
  </Link>
</li>
<li>
  <Link to="/admin/stories">
    📖 Story Editor
  </Link>
</li>
```

### Step 4: Create Wrapper Pages (If needed)
```javascript
// src/pages/DailyChallengePage.jsx
import { getTodayChallenge } from '../services/dailyChallengeService';
import { useEffect, useState } from 'react';

export default function DailyChallengePage() {
  const [challenge, setChallenge] = useState(null);
  
  useEffect(() => {
    getTodayChallenge().then(setChallenge);
  }, []);
  
  if (!challenge) return <div>No challenge today!</div>;
  
  return (
    <div>
      <h1>{challenge.type === 'quiz' ? '❓' : '🧩'} Challenge</h1>
      {/* Load quiz or puzzle component here */}
    </div>
  );
}
```

---

## 🎯 Feature Overview

### **Daily Challenge**
- **What:** One quiz or puzzle per day
- **Who:** All users (guest or logged in)
- **Where:** Home page card
- **Status:** ✅ Ready

### **Leaderboards**
- **What:** Ranked list of top players
- **Periods:** Daily, weekly, all-time
- **Who:** Both registered & guest users
- **Where:** Leaderboard page (create wrapper)
- **Status:** ✅ Ready

### **Stories**
- **What:** Sequential chapters to learn from
- **Unlock:** Complete chapter → unlock next
- **Who:** All users
- **Where:** Stories page (create wrapper)
- **Status:** ✅ Ready

### **Game Modes**
- **Timed:** 30s per question
- **Memory:** Pattern recognition
- **Speed:** One strike & out
- **Practice:** Learning with hints
- **Challenge:** 10-min competitive
- **How:** Pass `mode` prop to quiz
- **Status:** ✅ Framework ready

---

## 💻 Code Examples

### Example 1: Use Daily Challenge
```javascript
import { getTodayChallenge, markChallengeComplete } from '../services/dailyChallengeService';

// Get challenge
const challenge = await getTodayChallenge();
// Returns: { id, type, difficulty, xpReward, coinsReward, active }

// After completion
await markChallengeComplete(userId, score, 50, 10);
// Returns: { success, xpEarned, coinsEarned }
```

### Example 2: Show Leaderboard
```javascript
import LeaderboardTable from '../components/Leaderboard/LeaderboardTable';

<LeaderboardTable 
  period="daily"        // "daily", "weekly", "global"
  categoryId="global"   // "global" or category ID
  pageSize={20}
/>
```

### Example 3: Get User's Rank
```javascript
import { getUserRank } from '../services/leaderboardService';

const rank = await getUserRank(userId, 'daily', 'global');
// Returns: { rank: 5, score: 1250, displayName: "John", accuracy: 87.5 }
```

### Example 4: Load Story
```javascript
import { getStory, completeChapter } from '../services/storyService';

const story = await getStory('story_123');
// Returns: { id, title, chapters: [...], chapterCount }

// After completing chapter
await completeChapter(userId, 'story_123', 'chapter_1', 85);
```

### Example 5: Apply Game Mode
```javascript
import { getGameModeConfig, calculateScore } from '../services/gameModeService';

const config = getGameModeConfig('timed');
// Returns: { timePerQuestion: 30000, scoringFormula, features, ... }

const score = calculateScore({
  mode: 'timed',
  answers: [
    { correct: true, timeSpent: 15000 },
    { correct: true, timeSpent: 12000 }
  ],
  timePerQuestion: 30000
});
```

---

## 🔑 Key Functions Quick Reference

### Daily Challenge Service
```javascript
getTodayChallenge()                     // Get today's challenge
hasCompletedToday(userId)               // Check if completed
markChallengeComplete(userId, score)    // Record completion
getUserStreak(userId)                   // Get current streak
getUpcomingChallenges(days)             // Get next N days
createDailyChallenge(dateISO, data)     // Admin: Create challenge
```

### Leaderboard Service
```javascript
updateLeaderboardScore(userId, cat, score)     // Record score
getLeaderboard(period, category)               // Get rankings
getUserRank(userId, period, category)          // Get position
getLeaderboardPaginated(...)                   // Paginated results
resetLeaderboard(period, category)             // Admin: Reset
```

### Story Service
```javascript
getStory(storyId)                       // Get story + chapters
getChapters(storyId)                    // Get chapter list
completeChapter(userId, storyId, chapterId, score)  // Mark done
isChapterUnlocked(userId, storyId, chapterId)      // Check unlock
getStoryProgress(userId, storyId)       // User's progress
createStory(data)                       // Admin: Create
publishStory(storyId)                   // Admin: Publish
```

### Game Mode Service
```javascript
getGameModeConfig(modeId)               // Get mode rules
calculateScore(gameState)               // Calculate score
shouldEndGame(gameState)                // Check if game over
initializeGameSession(mode, contentId)  // Create session
getModeUIConfig(mode)                   // Get UI theming
```

---

## 🎨 Component Props

### DailyChallengeCard
```javascript
<DailyChallengeCard
  onPlayClick={() => navigate('/daily-challenge')}
/>
```

### LeaderboardTable
```javascript
<LeaderboardTable
  period="daily"          // "daily" | "weekly" | "global"
  categoryId="global"     // "global" or category ID
  pageSize={20}           // Results per page
/>
```

### StoryMapCard
```javascript
<StoryMapCard
  story={storyObject}
  onSelectStory={(story) => navigate(`/stories/${story.id}`)}
/>
```

---

## 📊 Database Collections

### Auto-created on first write:
```
daily_challenges/{dateISO}
daily_progress/{userId}/challenges/{dateISO}
streaks/{userId}
leaderboards/{period}/{categoryId}/users/{userId}
stories/{storyId}
stories/{storyId}/chapters/{chapterId}
story_progress/{userId}
```

**No setup needed!** Collections auto-create when data is written.

---

## 🧪 Test Checklist

- [ ] Daily challenge shows on home page
- [ ] Can create challenge in admin
- [ ] Can mark challenge complete
- [ ] Streak increments on consecutive days
- [ ] Leaderboard displays top players
- [ ] User rank highlighted in leaderboard
- [ ] Can create story in admin
- [ ] Can add chapters to story
- [ ] Chapter unlock logic works
- [ ] Guest progress merges on login
- [ ] Mobile responsive on all components

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| "Cannot read uid of null" | Check `if (user)` before using user.uid |
| Firestore missing index | Check browser console link, create index |
| Guest data not merging | Call `mergeGuestProgressToUser()` after login |
| Leaderboard empty | Check Firestore has `/leaderboards` collection |
| Challenge not showing | Create challenge via `/admin/daily-challenge` |
| Component not rendering | Check route is added to App.js |

---

## 📱 Responsive Breakpoints

```css
/* Mobile first */
@media (max-width: 480px)   { /* Small phone */ }
@media (max-width: 768px)   { /* Tablet */ }
@media (min-width: 1024px)  { /* Desktop */ }
```

All components are mobile-responsive! ✅

---

## 🎓 Architecture Recap

### Services Layer
- Pure functions (easy to test)
- Support guest + user
- Error handling built-in
- Firestore + localStorage

### Component Layer
- React hooks (useState, useEffect)
- Props for data, callbacks for actions
- Loading/error states
- Mobile responsive

### Admin Layer
- CRUD operations
- Feature configuration
- Statistics & analytics

---

## ⏱️ Estimated Work

| Task | Time |
|------|------|
| Add routes | 10 min |
| Update home page | 10 min |
| Add admin menu | 5 min |
| Create wrapper pages | 15-30 min |
| Test all features | 20 min |
| **Total** | **60-90 min** |

---

## 🎉 You're Ready!

Everything you need is built and ready:
- ✅ Services (data layer)
- ✅ Components (UI layer)
- ✅ Admin pages (management layer)
- ✅ Documentation (learning resources)
- ✅ Build verified (no errors)

**Next action:** Follow the "Quick Integration" section above!

---

## 📞 Need Help?

Refer to:
- `IMPLEMENTATION_GUIDE.md` - Detailed implementation guide
- `ARCHITECTURE_PLAN.md` - Architecture & design decisions
- Service JSDoc comments - Function documentation
- Component prop types - UI component reference

---

**Happy coding! 🚀**
