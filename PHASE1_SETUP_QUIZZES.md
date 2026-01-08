# 🧪 PHASE 1: SETUP TEST QUIZZES

## 🚀 Quick Start - Create All Test Quizzes Automatically

I've created a script that will automatically populate your Firestore with all 9 test quizzes in seconds!

---

## ⚡ Option 1: Run Script Directly (Easiest)

### Step 1: Get Your Firebase Service Account Key

1. Go to **Firebase Console** → Your Project
2. Click **⚙️ Settings** (top right) → **Project Settings**
3. Go to **Service Accounts** tab
4. Click **"Generate New Private Key"**
5. Save the file as `serviceAccountKey.json` in your project root:
   ```
   /Users/srini/Desktop/AmAha/AmAhaApp/amaha-web/serviceAccountKey.json
   ```

### Step 2: Run the Setup Script

```bash
cd /Users/srini/Desktop/AmAha/AmAhaApp/amaha-web
node scripts/setupTestQuizzes.mjs
```

**Expected Output:**
```
🚀 Starting test quiz creation...

✅ Created: test-mc-001
   Title: Test Multiple Choice
   Questions: 2
✅ Created: test-tf-001
   Title: Test True/False
   Questions: 2
✅ Created: test-fillblank-001
   Title: Test Fill in the Blank
   Questions: 2
✅ Created: test-matching-001
   Title: Test Matching
   Questions: 1
✅ Created: test-ordering-001
   Title: Test Ordering
   Questions: 1
✅ Created: test-imageselect-001
   Title: Test Image Selection
   Questions: 1
✅ Created: test-multiselect-001
   Title: Test Multi-Select
   Questions: 1
✅ Created: test-dragdrop-001
   Title: Test Drag & Drop
   Questions: 1
✅ Created: test-all-types-001
   Title: Test All Question Types
   Questions: 5

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 Summary:
   ✅ Created: 9/9
   ❌ Failed: 0/9

🎉 All test quizzes ready for Phase 1 testing!

📍 Next steps:
   1. Open http://localhost:3001
   2. Navigate to Quizzes
   3. Start with test-mc-001
   4. Follow PHASE1_TESTING_GUIDE.md
```

---

## 📋 What Gets Created

| Quiz ID | Type | Questions |
|---------|------|-----------|
| test-mc-001 | Multiple Choice | 2 |
| test-tf-001 | True/False | 2 |
| test-fillblank-001 | Fill Blank | 2 |
| test-matching-001 | Matching | 1 |
| test-ordering-001 | Ordering | 1 |
| test-imageselect-001 | Image Select | 1 |
| test-multiselect-001 | Multi-Select | 1 |
| test-dragdrop-001 | Drag & Drop | 1 |
| test-all-types-001 | All 8 Types Mixed | 5 |

**Total: 9 quizzes, 17 questions, all 8 question types covered**

---

## ✅ After Setup: Start Testing

Once the script completes:

1. **Open your app:** http://localhost:3001
2. **Go to Quizzes page**
3. **Find: test-mc-001**
4. **Start the quiz and:**
   - [ ] Question displays
   - [ ] Can click answers
   - [ ] **Hear "ding" sound on correct answer** 🔊
   - [ ] See feedback message
   - [ ] Score updates

---

## 🆘 Troubleshooting

### Script says "serviceAccountKey.json not found"

**Solution:**
1. Download your Firebase service account key:
   - Firebase Console → Settings ⚙️ → Service Accounts
   - Click "Generate New Private Key"
2. Save as `serviceAccountKey.json` in project root
3. Try again: `node scripts/setupTestQuizzes.mjs`

### Script runs but quizzes don't appear in Firestore

**Check:**
1. Service account key has correct permissions
2. You're using the right Firebase project
3. Check browser console for errors
4. Try refreshing Firestore console (Ctrl+R)

### Quizzes appear but questions don't show in app

**Check:**
1. App is fully loaded (http://localhost:3001)
2. Navigation is working (try going to Home first)
3. Check browser console (F12) for JavaScript errors
4. Hard refresh (Ctrl+Shift+R)

---

## 📊 Script Details

**File:** `scripts/setupTestQuizzes.mjs`

**What it does:**
- Connects to your Firebase project
- Creates 9 Firestore documents
- Each quiz has proper structure
- Includes levelVariants (Easy/Medium/Hard/Expert)
- Ready for immediate testing

**Why it's better than manual entry:**
✅ No copy/paste errors
✅ Creates all 9 quizzes in seconds
✅ Proper data structure guaranteed
✅ Repeatable and reliable
✅ No Firebase Console navigation needed

---

## 🎯 Next Steps

### 1️⃣ Run the Setup Script (1 minute)
```bash
node scripts/setupTestQuizzes.mjs
```

### 2️⃣ Verify in Firebase Console (1 minute)
- Go to Firebase Console
- Firestore Database
- Check "quizzes" collection
- Should see 9 documents

### 3️⃣ Start Testing in App (5 minutes)
- http://localhost:3001
- Quizzes page
- Select test-mc-001
- Answer questions

### 4️⃣ Follow Testing Checklist (1-2 hours)
- Read: [PHASE1_TESTING_GUIDE.md](../PHASE1_TESTING_GUIDE.md)
- Test all 8 question types
- Verify audio works
- Check mobile compatibility

---

## 🎊 Ready?

**Run this command now:**
```bash
node scripts/setupTestQuizzes.mjs
```

Then head to http://localhost:3001 and start testing! 🚀

