# 🎯 PHASE 1 TEST SETUP - BUTTON & COMMANDS

## 🔴 ONE COMMAND TO RUN EVERYTHING

Copy and paste this command in your terminal:

```bash
cd /Users/srini/Desktop/AmAha/AmAhaApp/amaha-web && node scripts/setupTestQuizzes.mjs
```

**That's it!** This will:
- ✅ Connect to Firebase
- ✅ Create all 9 test quizzes  
- ✅ Populate with all 8 question types
- ✅ Set them ready for testing
- ✅ Show you when it's done

---

## 📋 Step-by-Step (If command fails)

### If you get "serviceAccountKey.json not found":

1. **Get your Firebase credentials:**
   - Visit: https://console.firebase.google.com
   - Select your "AmAha App" project
   - Click **⚙️ Settings** (gear icon, top right)
   - Click **Service Accounts** tab
   - Click **"Generate New Private Key"** button
   - File will download: `amaha-app-aef30-*.json`

2. **Place it in your project:**
   - Move the downloaded file to:
     ```
     /Users/srini/Desktop/AmAha/AmAhaApp/amaha-web/serviceAccountKey.json
     ```
   - Rename it to `serviceAccountKey.json` (remove the random suffix)

3. **Run the command again:**
   ```bash
   cd /Users/srini/Desktop/AmAha/AmAhaApp/amaha-web && node scripts/setupTestQuizzes.mjs
   ```

---

## ✅ Expected Output

When the script runs successfully, you'll see:

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

📊 Summary:
   ✅ Created: 9/9
   ❌ Failed: 0/9

🎉 All test quizzes ready for Phase 1 testing!
```

---

## 🎮 Testing Checklist (After Setup)

Once the script finishes successfully:

### 1. Open Your App
```
http://localhost:3001
```
(Dev server should still be running)

### 2. Navigate to Quizzes
- Click menu or navigate to `/quizzes`

### 3. Find test-mc-001
- Search for "Test Multiple Choice"
- Click to open

### 4. Test the Quiz
**Select:** Easy difficulty  
**Start Quiz:** Click "Start"  
**Question:** "What is 2+2?"  
**Answer:** Click "4"

**Verify:**
- ✅ Question loads and displays
- ✅ Can click answer buttons
- ✅ **Hear "ding" sound** 🔊 (most important!)
- ✅ See "✓ Correct!" message
- ✅ Explanation displays
- ✅ Score updates

### 5. Test Another Type
- Go back to Quizzes
- Open test-tf-001 (True/False)
- Select Easy
- Answer: Click "True"
- Verify audio plays ✅

---

## 🎯 Your Complete Testing Flow

```
1. RUN SETUP SCRIPT
   ↓
   node scripts/setupTestQuizzes.mjs
   ↓
   ✅ Quizzes created in Firestore

2. VERIFY IN FIREBASE (Optional)
   ↓
   Go to Firebase Console → Firestore
   ↓
   See 9 new documents in "quizzes" collection

3. START TESTING
   ↓
   Open http://localhost:3001
   ↓
   Navigate to Quizzes

4. TEST EACH QUIZ
   ↓
   test-mc-001 → test-tf-001 → test-fillblank-001 → etc.
   ↓
   For each: Answer question, hear audio, see feedback

5. REPORT RESULTS
   ↓
   Document what worked and what didn't
   ↓
   Share findings
```

---

## ⏱️ Time Estimate

| Step | Time | Status |
|------|------|--------|
| Get Firebase Key | 2 min | One-time |
| Place Key in Project | 1 min | One-time |
| Run Script | 1 min | Quick |
| Verify Setup | 2 min | Optional |
| Test Multiple Choice | 5 min | First type |
| Test 7 More Types | 30-45 min | Full coverage |
| **TOTAL** | **40-60 min** | Complete |

---

## 🚀 Ready?

### Copy this command:
```bash
node scripts/setupTestQuizzes.mjs
```

### Paste in your terminal here:
```
→ Terminal window in VS Code or Command Prompt
```

### See the success message, then:
```
→ Open http://localhost:3001
→ Go to Quizzes page
→ Start testing!
```

---

## 📞 If Something Goes Wrong

### Script error: "credential cert error"
- Firebase key path is wrong
- Check: `/Users/srini/Desktop/AmAha/AmAhaApp/amaha-web/serviceAccountKey.json` exists
- File name must be EXACTLY: `serviceAccountKey.json`

### Script says "database not found"
- Wrong Firebase project selected
- Verify service account is for "AmAha App" project
- Check Firebase Console Project ID

### No quizzes appear in Firestore
- Wait 5 seconds and refresh Firebase Console
- Check user has write permissions
- Try running script again

### Quizzes in Firestore but not in app
- Dev server might need restart
- Hard refresh app: `Ctrl+Shift+R`
- Check browser console (F12) for errors

---

## ✨ What You Get

**9 Complete Test Quizzes:**
- ✅ Multiple Choice (2 quizzes)
- ✅ True/False (1 quiz)
- ✅ Fill in the Blank (1 quiz)
- ✅ Matching (1 quiz)
- ✅ Ordering (1 quiz)
- ✅ Image Selection (1 quiz)
- ✅ Multi-Select (1 quiz)
- ✅ Drag & Drop (1 quiz)
- ✅ Mixed Types (1 quiz)

**All with:**
- ✅ Multiple difficulty levels (Easy/Medium/Hard/Expert)
- ✅ Real questions and answers
- ✅ Proper explanations
- ✅ Ready to test immediately

---

**🎊 That's it! One command, 9 quizzes, instant testing!** 🚀

