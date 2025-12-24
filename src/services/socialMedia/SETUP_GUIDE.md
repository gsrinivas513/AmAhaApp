// src/services/socialMedia/SETUP_GUIDE.md

# 🛠️ Social Media Engine - Complete Setup Guide

Complete step-by-step guide to set up and launch the AmAha Social Media Content Engine.

---

## 📋 Pre-Setup Checklist

- [ ] Firestore database accessible
- [ ] Admin authentication configured
- [ ] Cloudinary account (for image hosting)
- [ ] Access to admin panel
- [ ] Quizzes/Puzzles in database
- [ ] Content has proper metadata (category, title, etc.)

---

## 🔧 Step 1: Firestore Setup

### Create the `social_posts` Collection

1. Go to Firebase Console → Firestore Database
2. Click "Create Collection"
3. Name it: `social_posts`
4. Add first document (optional):
   ```javascript
   {
     platform: "example",
     status: "draft",
     createdAt: <current timestamp>,
   }
   ```
5. Click "Save"

### Update Firestore Security Rules

Replace your firestore.rules with:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Social posts - admin only
    match /social_posts/{document=**} {
      allow read, write, delete: if request.auth.token.isAdmin == true;
    }

    // Keep existing rules for other collections...
    // [Your other rules here]
  }
}
```

### Deploy Rules

1. In Firebase Console: Firestore → Rules
2. Paste the updated rules
3. Click "Publish"

---

## 🔑 Step 2: Enable Admin Access

Ensure your admin user has `isAdmin: true` in their user document:

```javascript
// In users/{userId} document
{
  email: "admin@amaha.com",
  isAdmin: true,
  createdAt: <timestamp>,
  // ... other fields
}
```

---

## 🌐 Step 3: Verify Firestore Collections Exist

The system reads from these collections (verify they exist):

- [ ] `features` - Feature data (Quiz, Puzzles, etc.)
- [ ] `categories` - Categories per feature
- [ ] `topics` - Topics per category
- [ ] `questions` - Quiz content
- [ ] `puzzles` - Puzzle content

Check in Firebase Console → Data tab

---

## 🚀 Step 4: Access the Admin Page

1. Log in as admin user
2. Navigate to: `http://localhost:3000/admin/social-media`
3. You should see the Social Media Manager

---

## ✨ Step 5: Generate First Posts

### Option A: Quick Test (Recommended)

1. Click "Generate Posts from Trending Content"
2. Select: "Quiz"
3. Posts to generate: "3"
4. Click "✨ Generate Posts"
5. Wait for completion (should show success message)
6. Go to "Drafts" tab
7. You should see 12 posts (3 quizzes × 4 platforms)

### Option B: Generate from Puzzles

1. Repeat above but select "Puzzle"
2. Should generate similar posts

### What Gets Generated

For each content item:
- **1 Instagram post** (engaging, hashtag-heavy)
- **1 Facebook post** (community-focused)
- **1 Twitter post** (concise, 280 chars max)
- **1 LinkedIn post** (professional)

All with custom captions, hashtags, and AI image prompts.

---

## 📋 Step 6: Review Generated Posts

### In Drafts Tab:

1. Click "👁️ Preview" on any post
2. You'll see:
   - Platform name
   - Full caption
   - Hashtags
   - Image URL (if exists)
   - AI image prompt (for generation)
   - CTA text

3. Edit if needed:
   - Click the caption field
   - Make changes
   - Save

### Tips:
- Review 2-3 posts from each platform
- Check captions match your brand voice
- Verify hashtags are relevant
- Confirm image prompts are clear

---

## ✅ Step 7: Approve Posts

When satisfied with a post:

1. Click "✅ Approve"
2. Post status changes to "Approved"
3. Post is ready to schedule

### Bulk Approval:
Generate posts in batches:
- First batch: 3 quizzes (12 posts total)
- Review and approve
- Then generate next batch

---

## 📅 Step 8: Schedule Posts

### Option A: Schedule Individual Post

1. Click "📅 Schedule"
2. Select date and time
3. Click "Confirm Schedule"
4. Post moves to "Scheduled" tab

### Option B: Use Daily Schedule

For sequential daily posts:

1. Generate 7 posts
2. Approve all
3. Schedule first post for tomorrow at 09:00
4. Schedule second for next day at 09:00
5. Continue for 7 days

### Option C: Weekly Schedule

For recurring weekly posting:

```
Monday 09:00   - Kids Quiz
Tuesday 10:00  - Puzzle
Wednesday 14:00 - Programming Quiz
Thursday 09:00 - Kids Quiz
Friday 16:00   - Weekend Puzzle
Saturday 10:00 - Parent Tips
Sunday 18:00   - Best of Week
```

---

## 🖼️ Step 9: Handle Images

### If Original Content Has Image:
- System uses existing Cloudinary image
- No additional step needed

### If No Image Exists:
1. Copy the `imagePrompt` from post preview
2. Go to [DALL·E](https://openai.com/dall-e-3/) or [Midjourney](https://midjourney.com/)
3. Generate image with prompt
4. Download and upload to [Cloudinary](https://cloudinary.com/)
5. Copy the public URL
6. Edit post, update `imageUrl`

### Image Quality Tips:
- Keep consistent style across posts
- Use vibrant colors for kids content
- Use professional style for programming
- Make images mobile-friendly (square or vertical)

---

## 📊 Step 10: Monitor & Track

### In Scheduled Tab:
- See all upcoming posts
- Verify dates/times are correct
- Cancel if needed before scheduled time

### After Publishing:
- Manual updates from each platform needed (API integration prep)
- Track metrics separately per platform
- Update engagement data monthly

---

## 🔐 Step 11: Security Configuration

### Admin Role Check:

Make sure user has:
```javascript
{
  isAdmin: true,
  email: "admin@example.com",
  permissions: {
    socialMedia: true
  }
}
```

### Audit Trail:

Monitor Firestore activity logs:
- Firebase Console → Activity logs
- Track who generated/approved posts

---

## 🧪 Testing Checklist

- [ ] Can access `/admin/social-media`
- [ ] Can generate posts from content
- [ ] Can view draft posts
- [ ] Can preview individual posts
- [ ] Can approve posts
- [ ] Can schedule posts
- [ ] Can view scheduled posts
- [ ] Posts contain proper captions
- [ ] Posts contain proper hashtags
- [ ] Firestore collection has data

---

## 📈 Best Practices

### Content Generation
- ✅ Generate in batches (3-7 per session)
- ✅ Review all before approving
- ✅ Mix content types for variety
- ✅ Edit for your brand voice

### Scheduling
- ✅ Post at consistent times
- ✅ Use timezone for your audience
- ✅ Schedule 1-2 weeks in advance
- ✅ Monitor what works best

### Images
- ✅ Add images to all posts
- ✅ Use consistent style
- ✅ Keep file sizes optimized
- ✅ Test links before scheduling

### Monitoring
- ✅ Check engagement weekly
- ✅ Track which platforms perform best
- ✅ Monitor click-through rates
- ✅ Adjust schedule based on metrics

---

## 🐛 Troubleshooting

### Issue: "No draft posts"
**Solution:** Generate posts from the "Generate" tab first

### Issue: "Permission denied" error
**Solution:** Make sure user has `isAdmin: true` in Firestore

### Issue: "Cannot find content" error
**Solution:** Verify `questions` and `puzzles` collections exist

### Issue: Posts not showing on scheduled tab
**Solution:** Approve posts first before they can be scheduled

### Issue: Image URL not working
**Solution:** Verify Cloudinary image URL is public and accessible

---

## 📞 Support & Resources

### Documentation Files:
- `README.md` - Detailed documentation
- `QUICKSTART.md` - Quick reference
- `FIRESTORE_SCHEMA.md` - Data structure
- `PlatformIntegrations.js` - API templates

### Internal Resources:
- Firebase Console: Project settings
- Firestore: Collections → social_posts
- Admin Panel: `/admin/social-media`

### External Resources:
- [Firebase Docs](https://firebase.google.com/docs)
- [Firestore Guide](https://firebase.google.com/docs/firestore)
- [Cloudinary Docs](https://cloudinary.com/documentation)
- [Meta API Docs](https://developers.facebook.com/docs)

---

## ✨ Next Steps (Optional)

### Enable Platform Integrations
1. Set up Instagram/Facebook API credentials
2. Configure Twitter API access
3. Connect LinkedIn API
4. Create integration settings page
5. Enable auto-publishing (with admin approval)

### Add Analytics
1. Track post performance
2. Generate engagement reports
3. A/B test captions
4. Optimize posting times

### Automate Scheduling
1. Set up daily/weekly automation
2. Create content calendar
3. Auto-generate trending content
4. Batch schedule posts

### Advanced Features
1. AI caption optimization
2. Content recommendations
3. Trend analysis
4. Multi-brand support

---

## 🎉 Success Indicators

You've successfully set up when:

- ✅ Social Media Manager page is accessible
- ✅ Posts generate without errors
- ✅ All 4 platforms have content
- ✅ Posts can be approved and scheduled
- ✅ Data saves to Firestore
- ✅ Scheduled posts show in calendar

---

**Congratulations! Your Social Media Engine is ready to go! 🚀**

For questions, check the documentation files or review the source code.

Last Updated: December 2025
