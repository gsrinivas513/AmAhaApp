# 🧠 AmAha – Learn Through Play & Earn Money

**AmAha** is a **gamified learning platform** built to be an **income-generating product** for creators and learners. It combines the addictiveness of quiz games with the monetization potential of educational content.

## 🎯 Vision

Transform learning into **earning**. Users can:
- Take quizzes to earn rewards/coins
- Create and monetize their own quizzes
- Unlock premium content through gameplay
- Participate in leaderboards and tournaments

---

## 📚 Documentation

**Core Documentation (5 Files):**
1. **README.md** (this file) - Project overview
2. **DOCS_COMPREHENSIVE_GUIDE.md** - Full architecture, database structure, development workflow
3. **DOCS_QUICK_REFERENCE.md** - Quick commands, common tasks, troubleshooting
4. **DOCS_CONTENT_STRATEGY.md** - Content planning, expansion strategy, quality guidelines
5. **DOCS_BUGFIX_LOG.md** - Bug fixes, enhancements, version history

**Start Here:**
- New to the project? Read this file first, then check **DOCS_COMPREHENSIVE_GUIDE.md**
- Need quick help? Check **DOCS_QUICK_REFERENCE.md**
- Creating content? See **DOCS_CONTENT_STRATEGY.md**
- Fixing bugs? Log them in **DOCS_BUGFIX_LOG.md**

---

## 🌟 What Makes AmAha Different

✅ **Quiz.com-style UI** - Clean, modern, playful design  
✅ **Multi-learning ecosystem** - Quizzes, Puzzles, Studies, Arts  
✅ **Monetization-first architecture** - Built for ads, subscriptions, and rewards  
✅ **Gamification system** - XP, coins, badges, leaderboards  
✅ **Creator economy** - Users can create and earn from content  
✅ **Strict learning rules** - All answers correct to progress  
✅ **Resume & retry support** - Player-friendly experience  
✅ **Scalable feature design** - Easy to add new learning types

---

## 💰 Monetization Strategy

### Revenue Streams
1. **Ad Placements** - Rewarded ads, banner ads, interstitials
2. **Premium Membership** - Unlock all quizzes, ad-free experience
3. **Creator Revenue** - 70/30 split on quiz monetization
4. **In-app Purchases** - Coins, power-ups, cosmetics
5. **Sponsorships** - Corporate training quizzes

### Earning Mechanics
- Users earn **coins** by:
  - Completing quizzes
  - Daily login streaks
  - Leaderboard rankings
  - Watching ads
- **Coins can be:**
  - Converted to real money (via PayPal, UPI)
  - Used to unlock premium quizzes
  - Used for in-app cosmetics

---

## 🏠 Homepage (Implemented)

### Structure
- **Hero Section** - Main CTA with PIN join and Sign Up
- **Feature Hub** - Browse by category (Quiz, Puzzles, Studies, etc.)
- **Feature Tiles** - Quiz categories display
- **Feature Grid** - Benefits/USP showcase
- **Stats Strip** - User engagement metrics
- **Testimonials** - Social proof
- **Motivation Section** - Calls-to-action
- **Footer** - Links and info

### Key Files
```
src/home/
├── HomePage.jsx
├── components/
│   ├── HeroSection.jsx
│   ├── FeatureHub.jsx
│   ├── FeatureTiles.jsx
│   ├── FeatureGrid.jsx
│   ├── StatsStrip.jsx
│   ├── TestimonialsSection.jsx
│   ├── MotivationSection.jsx
│   └── Footer.jsx
```
---

---

## 🚀 Quick Start

### Development
```bash
# Install dependencies
npm install

# Start development server (localhost:3008)
npm start

# Build for production
npm build
```

### Key URLs
- **Home:** `http://localhost:3008/`
- **Admin Dashboard:** `http://localhost:3008/admin`
- **View Questions:** `http://localhost:3008/admin/view-questions`
- **Add Question:** `http://localhost:3008/admin/add-question`
- **Import Questions:** `http://localhost:3008/admin/import-questions`

---

## 📊 Current Content Status

- **Kids:** 400 questions (8 subtopics)
- **Students:** 300 questions
- **Programming:** 50 questions
- **Total:** 750+ questions

---

## 🛠️ Tech Stack

- **Frontend:** React 19, React Router 7, Tailwind CSS
- **Backend:** Firebase (Firestore, Auth, Hosting)
- **Build:** React Scripts 5.0

---

## 📁 Project Structure

```
src/
├── home/           # Landing page
├── quiz/           # Quiz feature
├── admin/          # Admin panel
├── auth/           # Authentication
├── components/     # Shared components
└── firebase/       # Firebase config
```

---

## 🎯 Quiz Flow

```
Home → Feature (Quiz) → Category → Topic → Subtopic → Difficulty → Questions
```

**Example URL:**
```
/quiz/Kids/Math/Simple%20Math%20(Addition%20%26%20Subtraction)/easy
```

---

## 🧩 Quiz Rules

- **10 questions per level**
- **ALL answers must be correct** to pass level
- **Any wrong answer = level failed**
- Failed levels must be retried
- Questions randomized per user
- No question repetition

---

## 🔧 Admin Features

✅ Add questions (manual/bulk)  
✅ View all questions (sortable/filterable)  
✅ Import CSV/Excel files  
✅ Manage features, categories, topics, subtopics  
✅ Publish/unpublish content  
✅ Analytics dashboard

---

## 📝 Recent Updates (December 2025)

### ✅ Bug Fixes
- Fixed subtopic publishing error (collection name mismatch)

### ✅ Enhancements
- Added sortable columns to question table (7 columns)
- Added filters: Feature, Category, Subtopic, Difficulty
- Added topic navigation to quiz page
- Consolidated documentation to 5 core files
- Code cleanup: Removed 9 migration scripts and backup files

---

## 📚 Need More Information?

Check the comprehensive documentation:
- **Architecture & Setup:** `DOCS_COMPREHENSIVE_GUIDE.md`
- **Quick Commands:** `DOCS_QUICK_REFERENCE.md`
- **Content Strategy:** `DOCS_CONTENT_STRATEGY.md`
- **Bug Fixes:** `DOCS_BUGFIX_LOG.md`

---

## 💰 Monetization Strategy

### Revenue Streams
1. **Ad Placements** - Rewarded ads, banners, interstitials
2. **Premium Membership** - Ad-free, unlock all content
3. **Creator Revenue** - 70/30 split for user-created quizzes
4. **In-app Purchases** - Coins, power-ups, cosmetics
5. **Sponsorships** - Corporate training quizzes

---

## 🎓 Learning Philosophy

**Simple > Fancy**  
**Clear > Clever**  
**Trust > Tricks**

We build for learners first, monetization second.

---

## 🚀 Roadmap

### Phase 1 (✅ Completed)
- Feature-based architecture
- Quiz system
- Admin panel
- Content management
- Topic/subtopic navigation

### Phase 2 (🔄 In Progress)
- User authentication
- Progress tracking
- Leaderboards
- Monetization integration

### Phase 3 (📋 Planned)
- Puzzles feature
- Studies feature
- Reward system
- Social features
- Mobile app

---

## 🤝 Contributing

1. Follow the architecture patterns in `DOCS_COMPREHENSIVE_GUIDE.md`
2. Test all changes locally before pushing
3. Update relevant documentation
4. Log bug fixes in `DOCS_BUGFIX_LOG.md`

---

## 📞 Support

- **Documentation:** See the 5 core doc files listed above
- **Issues:** Log in `DOCS_BUGFIX_LOG.md`
- **Questions:** Review `DOCS_QUICK_REFERENCE.md`

---

**Built with ❤️ for learners everywhere.**
	•	Hooks
	•	Services
	•	Pages
	•	Built for future expansion

🔮 Vision

AmAha aims to:
	•	Make learning addictive (positively)
	•	Support families via ethical monetization
	•	Become a universal learning platform