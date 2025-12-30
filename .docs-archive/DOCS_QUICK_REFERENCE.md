# ⚡ Quick Reference Guide

**Quick commands and common tasks for daily development.**

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server (localhost:3008)
npm start

# Build for production
npm build

# Run tests
npm test
```

---

## 📁 Key File Locations

```
Critical Files:
├── src/quiz/CategoryLevelsPage.jsx          # Quiz navigation
├── src/admin/ViewQuestionsPage.jsx          # Question management
├── src/admin/features/hooks/useSubtopicData.js  # Subtopic CRUD
├── src/firebase/firebase.js                 # Firebase config
└── importKidsQuestions.js                   # Bulk import script

Admin Pages:
├── /admin                    → Dashboard
├── /admin/view-questions     → Question table (sortable/filterable)
├── /admin/add-question       → Add single question
├── /admin/import-questions   → CSV/Excel import
└── /admin/feature-management → Manage features/categories/topics/subtopics
```

---

## 🗄️ Database Quick Reference

### Collection Hierarchy
```
features → categories → topics → subtopics → questions
```

### Example Path
```
features/quiz123
  └── categories/kids123
      └── topics/math123
          └── subtopics/addition123
              └── questions/q123
```

### Query Examples

**Get all topics by category:**
```javascript
const topics = await getDocs(
  query(
    collection(db, "features", featureId, "categories", categoryId, "topics"),
    where("isPublished", "==", true),
    orderBy("order", "asc")
  )
);
```

**Get all subtopics by topic:**
```javascript
const subtopics = await getDocs(
  collection(db, "features", featureId, "categories", categoryId, "topics", topicId, "subtopics")
);
```

**Get questions by subtopic:**
```javascript
const questions = await getDocs(
  collection(db, "features", featureId, "categories", categoryId, "topics", topicId, "subtopics", subtopicId, "questions")
);
```

---

## 🎯 Common Tasks

### Add a Single Question
1. Go to `/admin/add-question`
2. Select: Feature → Category → Topic → Subtopic
3. Enter question text
4. Add 4 options
5. Select correct answer
6. Choose difficulty (easy/medium/hard)
7. Click "Add Question"

### Bulk Import Questions
1. Prepare CSV:
```csv
question,option1,option2,option3,option4,correctAnswer,difficulty
"What is 2+2?","3","4","5","6","4","easy"
```
2. Go to `/admin/import-questions`
3. Upload CSV/Excel file
4. Questions automatically added

### Create New Subtopic
1. Go to `/admin/feature-management`
2. Navigate: Feature → Category → Topic
3. Click "Add Subtopic"
4. Enter name, description, order
5. Click "Create"
6. Toggle "Published" to make it live

### Publish/Unpublish Content
- **Feature:** Toggle in feature management
- **Category:** Toggle in category list
- **Topic:** Toggle in topic list
- **Subtopic:** Toggle in subtopic list

Only published items appear to users.

---

## 🐛 Recent Bug Fixes

### Subtopic Publishing Error (Dec 2025)
**Issue:** "Failed to update subtopic" when publishing
**Fix:** Changed collection name from "subcategories" to "subtopics" in `useSubtopicData.js`
**Lines changed:** 18, 22, 68, 97

### View Questions Table (Dec 2025)
**Enhancement:** Added sorting and filtering
**Features:**
- 7 sortable columns
- 5 filter options
- Visual sort indicators
- Blue highlight on sorted column

### Quiz Navigation (Dec 2025)
**Enhancement:** Added "Choose Topic" section
**Features:**
- Topic navigation bar
- Green highlight for active topic
- Smart navigation to first subtopic
- Maintains difficulty level across switches

---

## 🎨 UI Component Patterns

### Button Styles
```jsx
// Primary button
<button className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600">

// Secondary button
<button className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600">

// Danger button
<button className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600">
```

### Card Layout
```jsx
<div className="bg-white rounded-lg shadow-lg p-6">
  <h2 className="text-2xl font-bold mb-4">Title</h2>
  <p className="text-gray-600">Content</p>
</div>
```

### Table Headers (Sortable)
```jsx
<th 
  className="px-4 py-3 cursor-pointer hover:bg-gray-100"
  onClick={() => handleSort('columnName')}
>
  Column Name {sortIndicator('columnName')}
</th>
```

---

## 🔍 Debugging Checklist

### Question Not Showing?
- [ ] Check if subtopic is published
- [ ] Verify subtopicId in question document
- [ ] Check Firebase security rules
- [ ] Verify collection path is correct

### Import Failed?
- [ ] CSV format matches template
- [ ] All required columns present
- [ ] Correct answer matches one of the options
- [ ] Difficulty is: easy, medium, or hard

### Publishing Error?
- [ ] Collection name is "subtopics" (not "subcategories")
- [ ] Document ID exists
- [ ] User has write permissions
- [ ] Check browser console for errors

### Navigation Not Working?
- [ ] Check URL parameters are correct
- [ ] Verify IDs exist in database
- [ ] Check useNavigate implementation
- [ ] Test with published content only

---

## 📊 Content Status

### Current Content
- **Kids:** 400 questions (8 subtopics)
- **Students:** 300 questions
- **Programming:** 50 questions

### Topics Covered

**Kids:**
- Math (Addition, Subtraction, Multiplication)
- Animals (Sounds, Birds, Insects)
- Colors & Shapes
- Body Parts
- Fruits & Vegetables
- Days & Months
- Vehicles

**Students:**
- Science
- History
- Geography
- Literature

**Programming:**
- Python Basics
- JavaScript Fundamentals

---

## 🛠️ Useful Commands

### Git
```bash
# Check status
git status

# Add all changes
git add .

# Commit
git commit -m "Description"

# Push to main
git push origin main

# Pull latest
git pull origin main
```

### Firebase
```bash
# Deploy to Firebase Hosting
firebase deploy

# Deploy only hosting
firebase deploy --only hosting

# View logs
firebase functions:log
```

### Development
```bash
# Clear cache
rm -rf node_modules package-lock.json
npm install

# Fix ESLint issues
npm run lint -- --fix

# Check for updates
npm outdated
```

---

## 🔗 URL Patterns

### User Routes
```
/                                    → Home
/quiz                                → Quiz feature selection
/quiz/:category                      → Topic selection
/quiz/:category/:topic               → Subtopic selection
/quiz/:category/:topic/:subtopic/:difficulty  → Level selection
```

### Admin Routes
```
/admin                               → Dashboard
/admin/view-questions                → Question management
/admin/add-question                  → Add question
/admin/import-questions              → Import questions
/admin/feature-management            → Feature/Category/Topic/Subtopic management
```

---

## 💡 Pro Tips

1. **Always test with published content** - Unpublished items won't show to users
2. **Use bulk import for 10+ questions** - Much faster than manual entry
3. **Keep question order consistent** - Use order field for sequencing
4. **Check Firebase Console regularly** - Verify data structure
5. **Use browser DevTools** - React DevTools + Network tab for debugging
6. **Back up before major changes** - Export data from Firebase
7. **Test on mobile** - Most users will use mobile devices
8. **Clear browser cache if stuck** - Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)

---

## 📱 Mobile Testing

```bash
# Get your local IP
ifconfig | grep "inet " | grep -v 127.0.0.1

# Access from mobile on same network
http://[your-ip]:3008
```

---

## 🎯 Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| Port 3008 in use | `lsof -ti:3008 \| xargs kill -9` |
| Firebase error | Check `src/firebase/firebase.js` config |
| Build fails | Delete `node_modules`, run `npm install` |
| Import fails | Verify CSV format matches template |
| Sort not working | Check `sortColumn` state in component |
| Filter stuck | Click "Clear Filters" button |
| 404 on deploy | Check Firebase hosting config |
| Slow queries | Add Firestore indexes |

---

## 📞 Need More Help?

Check these documentation files:
1. **DOCS_COMPREHENSIVE_GUIDE.md** - Full architecture and setup
2. **DOCS_CONTENT_STRATEGY.md** - Content planning and expansion
3. **DOCS_BUGFIX_LOG.md** - History of fixes
4. **README.md** - Project overview

Or review the codebase at key locations listed above.
