### ✅ Implemented (as of Dec 11, 2025)
- Core Quiz engine (categories, questions, options, correctAnswer)
- Firebase integration (questions, categories, scores)
- Admin panel: Add/View/Edit questions, import CSV
- Difficulty levels (basic/intermediate/advanced) — migrated from old values
- Levels pagination (20 questions per level)
- Timer per question with horizontal countdown
- Negative marking (global toggle in admin) — default penalty = 1
- Toast notifications (shake toast on negative marking)
- Improved Quiz UI: progress bar, animated question card, option states
- Animations: slide-in question, ripple on option click, light shake on wrong, flash on correct
- Home page: modern category grid with auto-generated gradients (uses category.color)
### ✔ Full Mobile Responsiveness (Phase C)
- Global responsive CSS for 360–480px mobile screens
- Home Page category cards resized for mobile
- QuizPage timers, buttons, question text auto-scale
- Navbar redesigned for mobile spacing & icon sizing
- Admin panel layout adapted for smaller viewports
- Sidebar width reduced on small screens
- Responsive grid & cards added

### 🔜 Planned / Pending (to be implemented later)
- Per-category penalty overrides
- Admin audit logs for rule changes
- Sound effects (correct/wrong/timer beep)
- Leaderboard visual upgrades, confetti on high scores
- Mobile app shell (React Native)
- Monetization (ads/subscriptions/affiliate)
- Auto-generation of YouTube videos from quiz content
- Other gamification: streaks, lifelines, badges

## Level Unlock System (Phase 4.1)

- User progress stored at: `users/{uid}.progress`
- Structure: `progress[category][difficulty] = { maxUnlockedLevel, completedLevels, lastCompletedAt }`
- When user finishes a level, the app updates `maxUnlockedLevel = max(existing, level + 1)` and appends the level to `completedLevels`.
- Guests (not signed-in) can play only Level 1.

> Note: This README will be kept up-to-date as we implement features.