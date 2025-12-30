# 🚀 AmAha Platform - Quick Reference Guide

## 📍 Getting Started

### Installation
```bash
cd /Users/srini/Desktop/AmAha/AmAhaApp/amaha-web
npm install
npm start
```

### Build & Deploy
```bash
npm run build      # Creates optimized build
serve -s build     # Serve locally for testing
```

---

## 🎮 Features Overview

### 1️⃣ Quizzes
- **Location:** `/quiz/*`
- **Features:** Timed questions, instant scoring, progress tracking
- **Analytics:** Tracked in `analytics_events` collection
- **Gamification:** Unlocks quiz achievements, awards XP/coins

### 2️⃣ Puzzles
- **Location:** `/puzzle/*`
- **Types:** Matching pairs, ordering, drag-drop, visual
- **Features:** Multiple difficulty levels, time tracking
- **Gamification:** Puzzle achievements, level progression

### 3️⃣ Daily Challenges
- **Location:** `/daily-challenge`
- **Features:** One challenge per day, streak tracking
- **Rewards:** Variable XP/coins based on difficulty
- **Gamification:** Streak achievements (7-day, 30-day)

### 4️⃣ Analytics Dashboard
- **Location:** `/admin/analytics`
- **Access:** Admin users only
- **Tabs:** Overview, Platform, Performance, Leaderboard
- **Features:** Real-time data, sample data generator, export

### 5️⃣ Achievements System
- **Location:** Navbar button (when logged in)
- **Features:** 12 achievements, level progression
- **Display:** Modal with progress tracking
- **Unlocking:** Automatic on activity completion

---

## 👤 User Accounts

### Roles
| Role | Access | Features |
|------|--------|----------|
| Guest | Public pages only | Browse, limited tracking |
| User | Full platform | Quiz, puzzles, challenges, achievements |
| Admin | Admin pages | Analytics, user management |

### Authentication
```javascript
// Using Firebase Auth
import { useAuth } from "../components/AuthProvider";

const { user, signInWithGoogle, signOut } = useAuth();
```

---

## 🔥 Key Components

### Navbar.jsx
```javascript
// Shows: Logo, Admin link, Coins, Achievements, Auth
// Location: Sticky at top, z-index 50
// Props: None (uses Auth context)
```

### AchievementsBadge.jsx
```javascript
// Props: userId (required)
// Shows: Achievement count button
// Triggers: Modal with all achievements
```

### AnalyticsPage.jsx
```javascript
// Location: Admin layout (/admin/analytics)
// Tabs: Overview, Platform, Performance, Leaderboard
// Sample data generator included
```

### QuizPage.jsx
```javascript
// Location: /quiz/:category/:topic/:subtopic/:difficulty/:level
// Features: Timer, progress, scoring, achievement check
// Tracks: Quiz completion to analytics_events
```

### PuzzlePlayPage.jsx
```javascript
// Location: /puzzle/:category/:topic/:puzzleId
// Features: Multiple puzzle types, time tracking
// Tracks: Puzzle completion to analytics_events
```

---

## 📊 Analytics & Tracking

### Event Types Tracked
```javascript
analytics_events collection:
  • quiz_completed: { score, timeSpent, questionsAnswered, ... }
  • puzzle_completed: { puzzleId, timeSpent, solvedCorrectly, ... }
  • daily_challenge_submitted: { type, timeSpent, completed, ... }
  • feature_usage: { featureName, actionType, ... }
```

### Accessing Analytics
```javascript
// Backend tracking service
import { trackQuizCompletion } from "../services/analyticsService";
import { trackQuizCompletion as trackAnalytics } from "../utils/integratedTracking";

// Frontend: View analytics dashboard
// Location: /admin/analytics
// Features: Real-time metrics, leaderboard, sample data
```

---

## 🏆 Gamification System

### Achievement Categories
```
QUIZ:
  • First Steps (1 quiz)
  • Quiz Warrior (10 quizzes)
  • Quiz Master (50 quizzes)

PUZZLE:
  • Puzzle Starter (1 puzzle)
  • Puzzle Solver (10 puzzles)

CHALLENGES:
  • Daily Challenger (1 challenge)
  • Week Warrior (7-day streak)
  • Month Master (30-day streak)

XP-BASED:
  • Leveling Up (100 XP)
  • XP Legend (1000 XP)
```

### Level System
```
Level 1: Novice (🌱) 0 XP
Level 2: Apprentice (📚) 100 XP
Level 3: Skilled (⭐) 300 XP
Level 4: Expert (🎖️) 600 XP
Level 5: Master (👑) 1000 XP
Level 6: Legend (🏆) 2000 XP
Level 7: Immortal (⚡) 5000 XP
```

### Checking Achievements
```javascript
import { checkAndUnlockAchievements } from "../services/gamificationService";

// Called automatically on activity completion
if (user?.uid) {
  checkAndUnlockAchievements(user.uid);
}
```

---

## 🗄️ Database Schema

### Collections
```
users/{userId}
  ├─ stats: { quizzesCompleted, coins, ... }
  ├─ totalXP: number
  └─ currentLevel: number

analytics_events/{id}
  ├─ userId, eventType, timestamp
  └─ data: { ... event details ... }

achievements/{userId}
  └─ unlocked: [achievementId, ...]
```

---

## 🧪 Testing

### Run Tests
```bash
npm test                    # Run all tests
npm test -- --watch       # Watch mode
npm test -- --coverage    # Coverage report
```

### Test Locations
```
src/admin/AutomationTestPage.jsx  # 35+ tests
  • Authentication tests
  • Quiz/Puzzle/Challenge tests
  • Analytics tests
  • Gamification tests
  • Performance tests
```

---

## 🛠️ Common Tasks

### Add New Achievement
```javascript
// In gamificationService.js
const ACHIEVEMENTS = {
  NEW_ACHIEVEMENT: {
    id: 'new_achievement',
    name: 'Achievement Name',
    description: 'Description',
    icon: '📍',
    badge: '🏅',
    xpReward: 100,
    coinsReward: 50,
    trigger: 'event_type',
    condition: (stats) => stats.field >= value
  }
}
```

### Track New Event
```javascript
// In integratedTracking.js
export async function trackNewEvent(userData) {
  const userId = getCurrentUserId();
  await analyticsService.trackNewEvent(userId, userData);
}
```

### Add Analytics Tab
```javascript
// In AnalyticsPage.jsx
const [activeTab, setActiveTab] = useState('overview'); // Add new tab

// Add tab button
<button onClick={() => setActiveTab('newtab')}>New Tab</button>

// Add tab content
{activeTab === 'newtab' && (
  <div>Tab content here</div>
)}
```

---

## 🔍 Debugging

### Firebase Emulator
```bash
# Optional: Run Firebase emulator for local testing
firebase emulators:start
```

### Console Logging
```javascript
// QuizPage: console.log("🎮 QuizPage params:", { ... })
// PuzzlePage: console.log("🧩 Puzzle loaded:", data)
// Analytics: console.log("📊 Analytics loaded")

// Search for 🎮, 🧩, 📊, 📊 emoji in code for debug points
```

### Firestore Data Inspection
1. Go to Firebase Console
2. Select project
3. Navigate to Firestore Database
4. Check collections: users, analytics_events, achievements

---

## 📱 Responsive Design

### Breakpoints
```css
Mobile: < 640px
Tablet: 640px - 1024px
Desktop: > 1024px
```

### Mobile Optimizations
- ✅ Navbar responsive
- ✅ Achievement modal centers on mobile
- ✅ Leaderboard scrollable
- ✅ Touch-friendly buttons

---

## 🌙 Dark Mode

### Implementation
```css
@media (prefers-color-scheme: dark) {
  /* Dark mode styles */
}
```

### Testing
```bash
# System Preferences > General > Appearance > Dark
# Or browser DevTools > Appearance > dark
```

---

## 📦 Build Information

### Bundle Size
```
main.js: 512.3 KB (gzipped)
main.css: 21.3 KB
Total: ~533 KB
```

### Performance
```
First Contentful Paint: ~1.2s
Time to Interactive: ~2.8s
Largest Contentful Paint: ~1.8s
```

---

## ⚙️ Environment Variables

### Required (.env)
```
REACT_APP_FIREBASE_API_KEY=...
REACT_APP_FIREBASE_AUTH_DOMAIN=...
REACT_APP_FIREBASE_PROJECT_ID=...
REACT_APP_FIREBASE_STORAGE_BUCKET=...
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=...
REACT_APP_FIREBASE_APP_ID=...
```

### Optional
```
REACT_APP_ENVIRONMENT=production
REACT_APP_DEBUG=false
```

---

## 🚀 Deployment

### Deploy to Firebase Hosting
```bash
npm run build
firebase deploy
```

### Deploy to Vercel
```bash
vercel
```

### Deploy to Netlify
```bash
netlify deploy --prod --dir=build
```

---

## 📞 Support & Resources

### Documentation Files
- `README.md` - Project overview
- `QUICK_START.md` - Getting started
- `ADMIN_WORKFLOW_GUIDE.md` - Admin operations
- `PHASE_4_GAMIFICATION_COMPLETE.md` - Gamification details
- `PROJECT_COMPLETION_SUMMARY.md` - Full summary

### External Resources
- [Firebase Docs](https://firebase.google.com/docs)
- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)

---

## ✅ Checklist for New Features

- [ ] Create component/service file
- [ ] Add imports to required files
- [ ] Implement logic
- [ ] Add styles
- [ ] Test manually
- [ ] Add automated tests
- [ ] Build and verify
- [ ] Update documentation
- [ ] Commit to git
- [ ] Deploy

---

## 🎯 Key Shortcuts

```
Admin Dashboard: /admin/dashboard
Analytics: /admin/analytics
Quizzes: /quiz/*
Puzzles: /puzzle/*
Daily Challenge: /daily-challenge
Home: /
```

---

**Last Updated:** December 25, 2025  
**Version:** 4.0 (Complete)  
**Status:** Production Ready ✅
