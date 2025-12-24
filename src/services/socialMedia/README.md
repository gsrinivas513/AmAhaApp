// src/services/socialMedia/README.md

# 📱 AmAha Social Media Content Engine

Automatically generate and manage social media content for Instagram, Facebook, X (Twitter), and LinkedIn from your quiz and puzzle database.

## 🎯 Overview

This system automatically:
- Reads latest/trending quizzes and puzzles from Firestore
- Generates platform-specific captions, hashtags, and CTAs
- Creates AI image prompts (DALL·E/Midjourney compatible)
- Manages posting workflows (draft → approve → schedule → publish)
- Supports 4 major platforms with tone/content customization

## 📁 File Structure

```
src/services/socialMedia/
├── SocialContentEngine.js      # Core content generation engine
├── SocialScheduler.js          # Scheduling and timezone handling
├── PlatformIntegrations.js     # Platform API templates (not auto-publishing)
├── FIRESTORE_RULES.js          # Security rules documentation
├── index.js                    # Exports
└── README.md                   # This file
```

## 🚀 Features

### 1. Content Generation
- **Multiple content types**: Quiz promotions, Puzzle promotions, Daily challenges
- **Platform-specific**: Custom captions, hashtag counts, and styles for each platform
- **Smart tone selection**: Kid-friendly, Professional, or General based on content category
- **Image prompts**: AI-ready prompts for DALL·E or Midjourney

### 2. Content Management
- **Draft & Review**: All posts start as drafts for admin review
- **Approval workflow**: Admins can preview and approve before scheduling
- **Edit before publish**: Full caption and hashtag editing
- **Deletion**: Remove unwanted posts

### 3. Scheduling
- **Timezone-aware**: Convert times to user's timezone
- **Daily scheduling**: Auto-assign posts to sequential days
- **Weekly scheduling**: Post on specific days (Mon, Tue, etc.)
- **Custom scheduling**: Schedule individual posts for specific dates/times

### 4. Platform Support
- **Instagram**: Reels + Posts, hashtag strategy, visual focus
- **Facebook**: Community engagement, longer captions
- **X (Twitter)**: 280-char limit, concise messaging
- **LinkedIn**: Professional tone, detailed content focus

## 📊 Content Types

### Quiz Promotion
Perfect for: General knowledge, programming, kids content
Example caption: "Think you know about [Topic]? Test your skills with our fun quiz!"

### Puzzle Promotion
Perfect for: Brain teasers, visual puzzles, logic challenges
Example caption: "Puzzle time! 🧩 Can you solve this [Topic] challenge?"

### Daily Challenge
Perfect for: Recurring engagement, gamification
Example caption: "Today's Challenge 🌟 Can you beat it?"

## 🎨 Content Personalization

### For Kids Content
- Emoji-friendly (2-3 max)
- Playful tone
- Simple language
- Focus on "fun" and "play"

### For Programming Content
- Professional tone
- Code-related terminology
- Focus on "skills" and "challenge"
- LinkedIn & Twitter primary platforms

### For General Content
- Balanced tone
- Engaging but not overly casual
- Emphasis on learning
- Multi-platform suitable

## 📅 Recommended Posting Schedule

```
Monday:    Kids Quiz (09:00)
Tuesday:   Puzzle Challenge (10:00)
Wednesday: Programming Quiz (14:00)
Thursday:  Kids Quiz (09:00)
Friday:    Weekend Puzzle (16:00)
Saturday:  Parent Tips (10:00)
Sunday:    Best of the Week (18:00)
```

Adjust times based on your audience's peak activity.

## 🔒 Security & Admin Control

### Key Principles
- ✅ **NO auto-publishing** without explicit admin approval
- ✅ **Draft-first** workflow - all posts start as drafts
- ✅ **Review required** - admin must approve before scheduling
- ✅ **Editable** - captions and hashtags can be edited
- ✅ **Reversible** - posts can be deleted before publishing

### Firestore Security Rules
```firestore
match /social_posts/{document=**} {
  // Only admins can access
  allow read, write, delete: if request.auth.token.isAdmin == true;
  
  // Only admins can publish
  allow update: if request.auth.token.isAdmin == true;
}
```

## 💻 Usage

### 1. Generate Posts from Content

```javascript
import { SocialContentEngine } from '@/services/socialMedia';

// Generate 5 posts from latest quizzes
const posts = await SocialContentEngine.generateFromTrendingContent('quiz', 5);
// Returns: Array of posts with platform variations
```

### 2. Generate Multi-Platform Posts for Single Item

```javascript
// Get a specific quiz
const quiz = { id: '123', title: 'Animals Quiz', category: 'Kids' };

// Generate posts for all platforms
const posts = await SocialContentEngine.generateMultiPlatformPosts(quiz, 'quiz');
// Returns: [Instagram post, Facebook post, Twitter post, LinkedIn post]
```

### 3. Schedule Posts

```javascript
import { SocialScheduler } from '@/services/socialMedia';

// Schedule a single post
await SocialScheduler.schedulePost(postId, new Date('2025-01-15T09:00:00'), 'PST');

// Schedule daily posts
await SocialScheduler.scheduleDaily(posts, startDate, 'EST', '09:00');

// Schedule weekly posts
await SocialScheduler.scheduleWeekly({
  monday: [post1, post2],
  wednesday: [post3],
  friday: [post4]
}, 'PST');
```

### 4. Manage Post Status

```javascript
// Approve a post
await SocialContentEngine.updatePostStatus(postId, 'approved');

// Schedule a post
await SocialContentEngine.updatePostStatus(postId, 'scheduled', scheduledDate);

// Get draft posts
const drafts = await SocialContentEngine.getPostsByStatus('draft');
```

## 🤖 AI Image Generation

For posts without existing images, an AI prompt is generated:

Example prompt for DALL·E:
```
"Create a vibrant, engaging educational image for a Kids Animals quiz. 
Features the question 'Which animal makes this sound?'. 
Colorful, modern, kid-friendly style. Vector art. Bright background."
```

Steps:
1. Copy the `imagePrompt` from the post
2. Use DALL·E, Midjourney, or similar
3. Upload generated image to Cloudinary
4. Update post with `imageUrl`

## 🔗 Platform Integrations (Future)

These are **prepared but NOT auto-enabled**:

### Instagram API
- Endpoint: Meta Graph API v18.0
- Requires: `accessToken`, `businessAccountId`
- Capabilities: Image posts, Carousels, Reels

### Facebook API
- Endpoint: Meta Graph API v18.0
- Requires: `accessToken`, `pageId`
- Capabilities: Link posts, Videos, Images

### X (Twitter) API
- Endpoint: Twitter API v2
- Requires: `bearerToken`, `userId`
- Capabilities: Tweets, Media attachments

### LinkedIn API
- Endpoint: LinkedIn API v2
- Requires: `accessToken`, `organizationId`
- Capabilities: Posts, Articles, Videos

**To enable integrations:**
1. Get API credentials from each platform
2. Set up in admin settings
3. Configure in `/admin/integrations/[platform]`
4. Enable publishing (with admin approval)

## 📊 Hashtag Strategy

### Kids Learning Hashtags
`#KidsLearning #FunLearning #EarlyEducation #KidsQuiz #LearningThroughPlay`

### Programming Hashtags
`#CodingChallenge #Programming #JavaQuiz #LearnToCode #CodeNewbie`

### General Hashtags
`#AmAha #Learning #Quiz #Puzzle #Challenge #Knowledge`

Hashtag counts per platform:
- Instagram: 15 hashtags
- Facebook: 5 hashtags
- Twitter: 3 hashtags
- LinkedIn: 5 hashtags

## 📈 Metrics & Analytics

Posts track:
- Platform (Instagram, Facebook, Twitter, LinkedIn)
- Content type (Quiz, Puzzle, Challenge)
- Status (Draft, Approved, Scheduled, Published)
- Scheduled date/time
- Timezone
- Engagement (likes, comments, shares, clicks)

## ⚙️ Setup Checklist

- [ ] Create `social_posts` Firestore collection
- [ ] Update Firestore security rules
- [ ] Access `/admin/social-media` page
- [ ] Generate first batch of posts
- [ ] Review and approve posts
- [ ] Schedule posts
- [ ] Monitor engagement

## 🚨 Important Notes

1. **NO automatic publishing** - all posts require admin approval
2. **Drafts first** - review before scheduling
3. **Timezone matters** - adjust for your audience
4. **Test images** - preview before publishing
5. **Monitor metrics** - track what works
6. **Edit freely** - captions can be modified
7. **Delete if needed** - remove low-quality posts

## 🤝 Contributing

To add new content types or platforms:
1. Add to `contentTemplates` in SocialContentEngine.js
2. Create platform-specific config in PlatformIntegrations.js
3. Update hashtag libraries
4. Test with sample content
5. Document in this README

## 📚 Resources

- [Meta Graph API Docs](https://developers.facebook.com/docs/graph-api)
- [Twitter API v2 Docs](https://developer.twitter.com/en/docs/twitter-api)
- [LinkedIn API Docs](https://docs.microsoft.com/en-us/linkedin/)
- [DALL·E Prompting Guide](https://platform.openai.com/docs/guides/images)

---

**Last Updated:** December 2025
**Maintainer:** AmAha Development Team
