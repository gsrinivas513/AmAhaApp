// src/services/socialMedia/INDEX.md

# 📱 AmAha Social Media Content Engine - Complete Index

Comprehensive guide to all files, features, and capabilities.

---

## 📁 File Structure

```
src/services/socialMedia/
├── SocialContentEngine.js        # Core engine - generates content
├── SocialScheduler.js            # Scheduling and timezone management
├── PlatformIntegrations.js       # API templates (not auto-publishing)
├── index.js                      # Exports all services
├── FIRESTORE_RULES.js            # Security rules documentation
├── FIRESTORE_SCHEMA.md           # Complete Firestore schema
├── README.md                     # Detailed documentation
├── QUICKSTART.md                 # 5-minute quick start
├── SETUP_GUIDE.md                # Complete setup instructions
└── INDEX.md                      # This file

src/admin/
└── SocialMediaManagerPage.jsx    # Admin UI for managing posts
```

---

## 🚀 Quick Links

| Need | Location | Read Time |
|------|----------|-----------|
| **I just want to start** | [QUICKSTART.md](./QUICKSTART.md) | 5 min |
| **Setting up the system** | [SETUP_GUIDE.md](./SETUP_GUIDE.md) | 15 min |
| **How everything works** | [README.md](./README.md) | 20 min |
| **Database schema** | [FIRESTORE_SCHEMA.md](./FIRESTORE_SCHEMA.md) | 15 min |
| **How to code with it** | [Code Examples](#code-examples) | 10 min |

---

## 🎯 Core Features

### 1. Content Generation
- **Reads from**: Quizzes and Puzzles in Firestore
- **Generates**: Custom captions, hashtags, CTAs, image prompts
- **Platforms**: Instagram, Facebook, Twitter, LinkedIn
- **Personalization**: Kid-friendly, Professional, or General tone

### 2. Workflow Management
- **Draft Review**: All posts start as drafts
- **Approval**: Admin review before scheduling
- **Scheduling**: Timezone-aware, flexible scheduling
- **Status Tracking**: draft → approved → scheduled → published

### 3. Platform Intelligence
- **Instagram**: 15 hashtags, visual focus, engaging tone
- **Facebook**: 5 hashtags, community focus, longer content
- **Twitter**: 3 hashtags, 280-char limit, concise messaging
- **LinkedIn**: 5 hashtags, professional tone, detailed content

### 4. Scheduling Options
- **Individual**: Pick date/time for specific post
- **Daily**: Auto-schedule posts on consecutive days
- **Weekly**: Post on specific days of week
- **Timezone Support**: Convert to user's timezone

---

## 💻 Code Examples

### Generate Posts from Content

```javascript
import { SocialContentEngine } from '@/services/socialMedia';

// Generate 5 posts from latest quizzes
const posts = await SocialContentEngine.generateFromTrendingContent('quiz', 5);

// Get draft posts for review
const drafts = await SocialContentEngine.getPostsByStatus('draft');

// Approve a post
await SocialContentEngine.updatePostStatus(postId, 'approved');
```

### Schedule Posts

```javascript
import { SocialScheduler } from '@/services/socialMedia';

// Schedule single post
await SocialScheduler.schedulePost(postId, new Date('2025-02-01T09:00'), 'PST');

// Schedule daily posts
await SocialScheduler.scheduleDaily(posts, startDate, 'EST', '09:00');

// Schedule weekly posts
await SocialScheduler.scheduleWeekly({
  monday: [post1],
  wednesday: [post2],
  friday: [post3]
}, 'PST');
```

### Generate Multi-Platform Content

```javascript
// Get a quiz
const quiz = { id: '123', title: 'Animals', category: 'Kids' };

// Generate posts for all 4 platforms
const posts = await SocialContentEngine.generateMultiPlatformPosts(quiz, 'quiz');
// Returns: [Instagram, Facebook, Twitter, LinkedIn posts]

// Save to Firestore
await SocialContentEngine.savePosts(posts);
```

---

## 🔄 Workflow Diagram

```
┌─────────────────────┐
│  Firestore Content  │
│  (Quizzes/Puzzles)  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────────────────────────┐
│   SocialContentEngine                   │
│   - Read latest content                 │
│   - Generate captions                   │
│   - Select hashtags                     │
│   - Create image prompts                │
│   - Add CTAs                            │
└──────────┬──────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────┐
│  Posts (Draft Status)                   │
│  - Instagram: Full caption + 15 hashtags│
│  - Facebook: Longer form + 5 hashtags   │
│  - Twitter: 280 chars + 3 hashtags      │
│  - LinkedIn: Professional + 5 hashtags  │
└──────────┬──────────────────────────────┘
           │
           ▼
┌─────────────────────┐
│  Admin Review       │
│  (Approve/Edit)     │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  SocialScheduler    │
│  (Schedule Date/Time)
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Scheduled Posts    │
│  (Awaiting publish) │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Publish to Platform│
│  (Manual or API)    │
└─────────────────────┘
```

---

## 📊 Content Type Matrix

| Content Type | Quiz | Puzzle | Feature | Challenge |
|--------------|------|--------|---------|-----------|
| Captions | ✅ | ✅ | ✅ | ✅ |
| Image Prompts | ✅ | ✅ | ✅ | ✅ |
| Hashtags | ✅ | ✅ | ✅ | ✅ |
| Instagram | ✅ | ✅ | ✅ | ✅ |
| Facebook | ✅ | ✅ | ✅ | ✅ |
| Twitter | ✅ | ✅ | ✅ | ✅ |
| LinkedIn | ✅ | ✅ | ✅ | ✅ |

---

## 🎓 Learning Path

### Day 1: Quick Start
- [ ] Read QUICKSTART.md
- [ ] Access `/admin/social-media`
- [ ] Generate 3 posts
- [ ] Approve posts

### Day 2: Full Setup
- [ ] Read SETUP_GUIDE.md
- [ ] Create Firestore collection
- [ ] Update security rules
- [ ] Configure admin access

### Day 3: Daily Operations
- [ ] Generate posts daily
- [ ] Review and approve
- [ ] Schedule for next week
- [ ] Monitor scheduled tab

### Week 2: Advanced
- [ ] Batch generate weekly posts
- [ ] Set up consistent schedule
- [ ] Add AI-generated images
- [ ] Track engagement

---

## 🔑 Key Classes & Methods

### SocialContentEngine

| Method | Purpose | Returns |
|--------|---------|---------|
| `getLatestQuizzes()` | Fetch recent quizzes | Quiz array |
| `getLatestPuzzles()` | Fetch recent puzzles | Puzzle array |
| `generatePostForPlatform()` | Create single platform post | Post object |
| `generateMultiPlatformPosts()` | Create 4 platform posts | Post array |
| `generateFromTrendingContent()` | Auto-generate from DB | Saved posts |
| `savePosts()` | Save to Firestore | Post array |
| `updatePostStatus()` | Change post status | void |
| `getPostsByStatus()` | Query posts by status | Post array |

### SocialScheduler

| Method | Purpose | Returns |
|--------|---------|---------|
| `schedulePost()` | Schedule individual post | success object |
| `scheduleDaily()` | Schedule sequential posts | Scheduled array |
| `scheduleWeekly()` | Schedule by day of week | Scheduled array |
| `getPostsReadyToPublish()` | Get posts past schedule time | Post array |
| `convertToUTC()` | Convert to UTC | Date |
| `generateRecommendedSchedule()` | Get suggested schedule | Schedule object |

### PlatformIntegrations

| Method | Purpose | Returns |
|--------|---------|---------|
| `prepareInstagramPost()` | Format for IG API | API request |
| `prepareFacebookPost()` | Format for FB API | API request |
| `prepareTwitterPost()` | Format for Twitter API | API request |
| `prepareLinkedInPost()` | Format for LI API | API request |
| `validatePostForPlatform()` | Check post validity | Error array |

---

## 📋 Status Lifecycle

```
draft
  ↓ (Admin approves)
approved
  ↓ (Admin schedules)
scheduled
  ↓ (Time arrives)
published
  ↓ (Optional: track)
published_with_metrics
```

Only admins can move posts between statuses.

---

## 🌍 Hashtag Strategy

### By Content Category

**Kids Learning:**
```
#KidsLearning #FunLearning #EarlyEducation #KidsQuiz
#LearningThroughPlay #EducationalGames #BrainGames
```

**Programming:**
```
#CodingChallenge #Programming #JavaQuiz #LearnToCode
#CodeNewbie #WebDevelopment #DeveloperLife #TechSkills
```

**General:**
```
#AmAha #Learning #Quiz #Puzzle #Challenge #Knowledge
#SmartLearning #SkillBuilding #MindChallenge
```

---

## 📱 Platform Best Practices

### Instagram
- Post time: 10-11 AM or 7-9 PM
- Use all 15 hashtags
- Include image
- Emojis: 2-3
- Caption: Engaging, story-driven

### Facebook
- Post time: 12-1 PM or 7-9 PM
- Use 5 hashtags
- Include community message
- Emojis: 1-2
- Caption: Conversational

### Twitter
- Post time: 8-10 AM or 5-6 PM
- Use 3 hashtags
- Keep to 280 chars
- Emojis: 1
- Caption: Direct, actionable

### LinkedIn
- Post time: 7-9 AM or 5-6 PM
- Use 5 hashtags
- Professional tone
- Emojis: 0-1
- Caption: Value-focused, detailed

---

## 🔒 Security Checklist

- [ ] Firestore rules updated
- [ ] Admin role verified
- [ ] Access restricted to admins only
- [ ] No auto-publishing enabled
- [ ] Edit history tracked
- [ ] Audit logs enabled
- [ ] Data backed up

---

## 📈 Success Metrics

Track these KPIs:

| Metric | Target | Frequency |
|--------|--------|-----------|
| Posts Generated | 7+/week | Daily |
| Posts Scheduled | 5+/week | Daily |
| Engagement Rate | 2-5% | Weekly |
| Click-Through Rate | 3-8% | Weekly |
| Impressions | 500+/post | Weekly |

---

## 🐛 Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| No draft posts | Content not generated | Use Generate tab |
| Permission denied | Not admin | Check isAdmin flag |
| Empty hashtags | Query failed | Verify Firestore collections |
| Images not showing | Bad URL | Verify Cloudinary access |
| Schedule failed | Time in past | Choose future date/time |

---

## 🚀 Getting Help

### Documentation
1. Start with [QUICKSTART.md](./QUICKSTART.md)
2. Check [SETUP_GUIDE.md](./SETUP_GUIDE.md) for setup
3. Read [README.md](./README.md) for detailed info
4. Review [FIRESTORE_SCHEMA.md](./FIRESTORE_SCHEMA.md) for data

### Code
- SocialContentEngine.js - Content generation logic
- SocialScheduler.js - Scheduling logic
- SocialMediaManagerPage.jsx - UI implementation
- PlatformIntegrations.js - API templates

### Support
- Check Firestore console for data
- Review browser console for errors
- Check Firebase auth for admin status
- Verify collection structure

---

## 📞 Contact & Support

- **Documentation**: All .md files in this directory
- **Code**: JavaScript/React in services folder
- **UI**: Admin page at `/admin/social-media`
- **Data**: Firestore collection `social_posts`

---

## 📜 Changelog

### v1.0 (December 2025)
- ✅ Initial release
- ✅ Core content generation
- ✅ Multi-platform support
- ✅ Scheduling system
- ✅ Admin dashboard
- ✅ Complete documentation

### Planned v1.1
- [ ] API integrations
- [ ] Auto-publishing (with approval)
- [ ] Engagement metrics
- [ ] Analytics dashboard
- [ ] Content recommendations

---

**Start with [QUICKSTART.md](./QUICKSTART.md) for immediate use!**

Last Updated: December 2025
Version: 1.0
