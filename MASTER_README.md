# 📱 AmAha Platform - Complete Guide

**Platform Status:** ✅ Production Ready | **Last Updated:** December 29, 2025

## 🎯 Platform Overview

AmAha is an interactive educational platform with gamified learning experiences featuring:

### 🎮 Core Features
- **Quizzes** - Multiple choice assessments with scoring
- **Puzzles** - Visual puzzles (Find Pairs, Spot Difference, Picture Word, Shadow Matching, Ordering)
- **Stories** - Interactive narrative content with chapters
- **Challenges** - Daily challenges with rewards
- **Marketplace** - Buy/sell/trade game items
- **Leaderboards** - Competitive rankings
- **Gamification** - XP, coins, achievements, badges
- **Social Features** - Friends, messages, posts, comments

---

## 🚀 Quick Start (5 minutes)

### 1. Setup Development
```bash
cd amaha-web
npm install
npm start  # Development server at http://localhost:3000
```

### 2. Build for Production
```bash
npm run build
npm install -g serve
serve -s build
```

### 3. Access Admin Panel
- Navigate to `/admin` 
- Features: Database management, puzzle creation, image tools, analytics

---

## 🏗️ Architecture Overview

### Data Flow
```
User Action
    ↓
React Component
    ↓
Service Layer (analyticsService, cloudinaryAdminService, etc.)
    ↓
Firestore Database + Cloudinary API
    ↓
Real-time Listeners / State Update
    ↓
UI Re-render
```

### System Components

#### Frontend Layer
- **React** - UI framework
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **Zustand** - State management

#### Service Layer
- **analyticsService** - Event tracking (batched for performance)
- **cloudinaryAdminService** - Image management (cached queries)
- **imageCropService** - Image crop settings
- **imageDeduplicationService** - Duplicate detection

#### Backend Services
- **Firebase Firestore** - Primary database
- **Firebase Auth** - Authentication
- **Firebase Storage** - File storage
- **Cloudinary** - Image CDN & optimization

---

## 📊 Database Schema

### Collections

| Collection | Purpose | Key Fields |
|-----------|---------|-----------|
| `categories` | Content grouping | name, imageUrl, description |
| `topics` | Category subtypes | name, categoryId, imageUrl |
| `subtopics` | Topic level 3 | name, topicId, imageUrl |
| `quizzes` | Quiz content | title, categoryId, questions[], score |
| `puzzles` | Visual puzzles | title, type, data, categoryId, imageUrl |
| `stories` | Story content | title, chapters[], categoryId |
| `features` | Feature flags | name, enabled, description |
| `users` | User profiles | name, email, xp, coins, avatar |
| `analytics_events` | User events (batched) | userId, eventType, timestamp |
| `leaderboards` | Rankings | userId, score, rank, timestamp |
| `imageCropSettings` | Image crop configs | imageUrl, cropX, cropY, zoom |

---

## 🎮 Puzzle Types

### Find Pairs (Memory game)
- **Data structure:** `cards[]` array with image references
- **Component:** [PuzzleCard.jsx](src/puzzles/PuzzleCard.jsx)

### Spot Difference
- **Data structure:** `imageA`, `imageB` references
- **Component:** [SpotDifference.jsx](src/puzzles/SpotDifference.jsx)

### Picture Word
- **Data structure:** `pairs[]` with image and text
- **Component:** [PictureWord.jsx](src/puzzles/PictureWord.jsx)

### Picture Shadow
- **Data structure:** `pairs[]` with shadowImage
- **Component:** [PictureShadow.jsx](src/puzzles/PictureShadow.jsx)

### Ordering
- **Data structure:** `items[]` in correct order
- **Component:** [Ordering.jsx](src/puzzles/Ordering.jsx)

---

## 📸 Image Management

### Image Sources
1. **Cloudinary** - Production images (CDN optimized)
2. **Firebase Storage** - Backup images
3. **External URLs** - Third-party images

### Image Tools

#### Image Crop Editor
- **Location:** Admin → Image Management → Crop Editor
- **Feature:** Adjust crop area, zoom, positioning
- **Caching:** 5-minute cache for instant loads
- **Files:** [ImageCropEditor.jsx](src/admin/ImageCropEditor.jsx)

#### Image Deduplication
- **Location:** Admin → Tools → Deduplication
- **Feature:** Find and consolidate duplicate images
- **Files:** [ImageDeduplicationPanel.jsx](src/admin/ImageDeduplicationPanel.jsx)

#### Cloudinary Admin Service
- **Caching:** Query results cached 5 minutes
- **Collections scanned:** 8 (categories, topics, subtopics, features, puzzles, puzzleCategories, puzzleTopics, puzzleSubtopics)
- **Performance:** 8 reads → 1 cached read (87.5% reduction)
- **File:** [cloudinaryAdminService.js](src/services/cloudinaryAdminService.js)

---

## 📊 Performance Optimization

### Implemented ✅

#### 1. Query Caching (87.5% reduction)
- **Benefit:** Admin image pages load instantly
- **Implementation:** 5-minute TTL cache on Firestore queries
- **File:** [cacheService.js](src/services/cacheService.js)
- **Used in:** cloudinaryAdminService.js

#### 2. Analytics Batching (90% reduction)
- **Benefit:** Reduces write costs by 90%
- **Implementation:** Buffer 10 events, flush every 30s or on page unload
- **File:** [analyticsBatchService.js](src/services/analyticsBatchService.js)
- **Integration:** Ready (see OPTIMIZATION_IMPLEMENTATION_COMPLETE.md)

### Planned

#### 3. React Query Integration
- **Benefit:** Automatic caching, background refetch, deduplication
- **Priority:** Medium
- **Target:** Home page queries

#### 4. Pagination
- **Benefit:** Reduce data transfer (1000 → 50 documents)
- **Priority:** Low
- **Target:** Admin list pages

---

## 🔄 Event Flow

### User Actions → Analytics Events

```
User completes quiz
    ↓
trackQuizCompletion() called
    ↓
Event added to analyticsBatcher
    ↓
Batcher collects 10 events (or 30s passes)
    ↓
writeBatch() sends to Firestore
    ↓
Single write operation recorded
```

### Image Upload → Storage → Display

```
Admin uploads image
    ↓
Cloudinary API
    ↓
URL returned to component
    ↓
Firestore document updated
    ↓
Real-time listener triggers
    ↓
UI updates with new image
```

---

## 🛠️ Admin Panel

### Database Dashboard
- View all collections
- Add/edit/delete documents
- Filter and search
- Real-time updates

### Image Management
1. **Crop Editor** - Adjust image crop/zoom/position
2. **Deduplication** - Find duplicate images
3. **Cloudinary Manager** - View all images with usage

### Puzzle Creation
1. Create puzzle with title
2. Select puzzle type
3. Add images and data
4. Test puzzle
5. Publish

### Analytics
- User events view
- Engagement metrics
- Event filtering

---

## 📱 Key Pages

| Page | Path | Features |
|------|------|----------|
| Home | `/` | Featured content, categories |
| Category | `/category/:id` | Topics, quizzes, puzzles |
| Topic | `/topic/:id` | Subtopics, content |
| Quiz | `/quiz/:id` | Questions, scoring |
| Puzzle | `/puzzle/:id` | Different puzzle types |
| Story | `/story/:id` | Chapters, reading |
| Marketplace | `/marketplace` | Buy/sell items |
| Profile | `/profile` | User stats, achievements |
| Admin | `/admin` | Management tools |
| Leaderboard | `/leaderboard` | Rankings |

---

## 🔐 Authentication

- **Method:** Firebase Authentication
- **Providers:** Email/password, Google, Apple
- **Protected Routes:** Quiz results, purchases require login
- **File:** [useAuth.js](src/hooks/useAuth.js)

---

## 💾 Local Storage & Caching

### Browser Cache
- **Quiz progress** - Auto-saved
- **Image cache** - 5-minute TTL
- **User session** - Persistent login

### Firestore Cache
- **Query results** - 5-minute TTL
- **Image metadata** - Per-session
- **User data** - Real-time listeners

---

## 🚀 Deployment

### Production Checklist
- [ ] All tests passing
- [ ] Build bundle < 600KB gzipped
- [ ] Firebase rules reviewed
- [ ] Cloudinary API keys secured
- [ ] Environment variables configured

### Deploy to Firebase Hosting
```bash
npm run build
firebase deploy
```

---

## 🐛 Debugging

### Enable Debug Logging
```javascript
// In any service file
console.log('[Service Name]', message);
```

### Monitor in Firebase Console
- Go to Firestore → Data
- Check collection sizes
- Monitor write/read operations
- Review analytics_events collection

### Performance Profiling
```javascript
console.time('fetch-images');
const images = await getAllCloudinaryImages();
console.timeEnd('fetch-images');
```

---

## 📚 Documentation Files

### Master Documents
- [MASTER_README.md](MASTER_README.md) - You are here
- [ARCHITECTURE_FLOWCHART.md](ARCHITECTURE_FLOWCHART.md) - System flows & diagrams

### Feature Guides
- [Puzzle Integration](PUZZLE_INTEGRATION_MASTER.md)
- [Story System](STORY_SYSTEM_GUIDE.md)
- [Image Management](CLOUDINARY_IMAGE_MANAGER_GUIDE.md)
- [Admin Workflow](ADMIN_WORKFLOW_GUIDE.md)

### Technical References
- [Database Schema](DATABASE_ARCHITECTURE_GUIDE.md)
- [API Endpoints](EXTERNAL_CALLS_OPTIMIZATION_ANALYSIS.md)
- [Performance](OPTIMIZATION_IMPLEMENTATION_COMPLETE.md)

---

## 🆘 Common Issues & Solutions

### Images Not Loading
1. Check Cloudinary URL format
2. Verify Firebase Storage permissions
3. Clear browser cache (Ctrl+Shift+Delete)
4. Check Network tab for 404s

### Puzzles Not Displaying
1. Verify puzzle data structure matches type
2. Check imageUrl fields are populated
3. Review console for errors
4. Test in admin puzzle viewer

### Analytics Not Recording
1. Check internet connection
2. Verify Firestore permissions
3. Check browser console for errors
4. Ensure trackEvent() is called

### High Firestore Costs
1. Check for infinite loops in queries
2. Verify caching is enabled
3. Use analytics batcher (see OPTIMIZATION_IMPLEMENTATION_COMPLETE.md)
4. Add pagination to admin lists

---

## 📞 Support & Contact

- **Bug Reports:** Check database, enable logging, reproduce issue
- **Performance Issues:** See OPTIMIZATION_IMPLEMENTATION_COMPLETE.md
- **Feature Requests:** Document use case, technical feasibility

---

## 📋 File Structure

```
amaha-web/
├── src/
│   ├── components/       # React components
│   ├── pages/           # Page components
│   ├── puzzles/         # Puzzle components
│   ├── services/        # Service layer
│   ├── admin/           # Admin pages
│   ├── hooks/           # Custom hooks
│   ├── styles/          # Tailwind CSS
│   └── firebase/        # Firebase config
├── public/              # Static assets
├── build/               # Production build
└── docs/                # Documentation
```

---

## ✅ Checklist for New Developers

- [ ] Read MASTER_README.md (this file)
- [ ] Review ARCHITECTURE_FLOWCHART.md
- [ ] Setup development environment (`npm install && npm start`)
- [ ] Access admin panel at `/admin`
- [ ] Create test puzzle to understand flow
- [ ] Review service layer code
- [ ] Check Firestore schema
- [ ] Run `npm run build` and verify output

---

**Version:** 1.0  
**Status:** ✅ Active & Maintained  
**Next Update:** As features are added

For detailed architecture diagrams, flows, and service calls, see [ARCHITECTURE_FLOWCHART.md](ARCHITECTURE_FLOWCHART.md) ⭐
