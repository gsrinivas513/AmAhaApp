# Quiz Builder: Admin Quick Reference Card

## 🚀 PUZZLE ASSEMBLY CREATION (In 30 Seconds)

```
Step 1: Quiz Details
├─ Title: "Your Puzzle Name"
├─ Quiz Type: Puzzle Assembly ✓
├─ Category: Select one
├─ Level: Beginner/Intermediate/Advanced
└─ Next →

Step 2: Add Question
├─ Click "+ Add Content"
├─ Add text/image/video/audio content
├─ In Answer Config:
│  └─ Items to Order: piece1, piece2, piece3
├─ Set Points: 10
└─ Save Quiz
```

---

## 📋 QUIZ TYPE ANSWER FORMS AT A GLANCE

### **Binary Types (1-2 seconds to fill)**
```
TRUE_FALSE        MCQ/AUDIO_BASED
├─ True            ├─ Option A: [text]
└─ False           ├─ Option B: [text]
                   ├─ Option C: [text]
                   ├─ Option D: [text]
                   └─ Correct: A/B/C/D
```

### **Selection Types (3-5 seconds)**
```
MULTI_SELECT           FILL_BLANK
├─ Option A: ☑        ├─ Answers: answer1, answer2
├─ Option B: ☐        ├─ Case sensitive: ☑
├─ Option C: ☑        └─ Fuzzy match: ☑
└─ Option D: ☐
```

### **Pairing Types (5-10 seconds)**
```
MATCHING                   ORDERING/PUZZLE
├─ Left: item1, item2      ├─ Items: item1, item2,
├─ Right: match1, match2   │ item3, item4
│ (in paired order)        └─ (in correct sequence)
└─
```

### **Complex Types (5-20 seconds)**
```
DRAG_DROP              CODING              IMAGE_BASED
├─ Categories:         ├─ Language         ├─ X: 150
│ Cat1, Cat2          ├─ Template         ├─ Y: 200
├─ Items:             ├─ Test cases:      ├─ Width: 300
│ item1:Cat1          │ input|output       ├─ Height: 250
│ item2:Cat2          └─ 5|120             └─ Tolerance: 10
└─                       4|24
```

---

## ✅ ADMIN WORKFLOW (2-STEP PROCESS)

**Step 1: Metadata (2-3 minutes)**
```
Required:
[✓] Title
[✓] Category  
[✓] Level
[✓] Audience
[✓] Quiz Type ← This determines Step 2 form

Optional:
[ ] Time limit, points, attempts
[ ] Shuffle, show explanations, etc.

Click: NEXT →
```

**Step 2: Questions (3-5 min per question)**
```
For each question:

1. Add Flexible Content
   [+ Add Content] → Select type → Fill content
   (Repeat for text/image/video/audio)

2. Configure Answer (Type-Specific)
   PUZZLE: Items to Order (comma-separated)
   MCQ: Select correct option A/B/C/D
   MATCHING: Left items + Right items paired
   etc. (11 different forms)

3. Set Details
   Points: [10]
   Hint: [optional]
   Explanation: [optional]

4. Add More Questions
   Click [+ New] → Repeat

Click: SAVE QUIZ
```

---

## 🎯 WHICH QUIZ TYPE FOR YOUR NEEDS?

```
I want students to...

→ Choose ONE answer              MCQ
→ Choose MULTIPLE answers        MULTI_SELECT
→ Answer TRUE/FALSE              TRUE_FALSE
→ Type text answer               FILL_BLANK
→ Match left to right            MATCHING
→ Arrange items in order         ORDERING
→ Assemble puzzle pieces         PUZZLE
→ Sort items by category         DRAG_DROP
→ Write and test code            CODING
→ Click region in image          IMAGE_BASED
→ Listen to audio + choose       AUDIO_BASED
```

---

## 📊 FORM COMPLEXITY RANKING

**Easy (< 3 min setup)**
```
1. TRUE_FALSE
2. MCQ
3. AUDIO_BASED
```

**Medium (3-7 min setup)**
```
4. MULTI_SELECT
5. FILL_BLANK
6. MATCHING
7. ORDERING
8. PUZZLE
```

**Hard (7-20 min setup)**
```
9. DRAG_DROP
10. IMAGE_BASED
11. CODING
```

---

## 💾 SAVE CHECKLIST

Before clicking "SAVE QUIZ", verify:

```
Quiz Metadata:
[ ] Title filled
[ ] Category selected
[ ] Level selected  
[ ] Audience selected
[ ] Quiz type correct

Questions:
[ ] At least 1 question added
[ ] Each question has content items
[ ] Each question has answer configured
[ ] Points assigned to each

Optional:
[ ] Time limits set
[ ] Passing score defined
[ ] Explanations provided
[ ] Hints added (if helpful)

Ready to Save? → [SAVE QUIZ]
```

---

## 🔥 COMMON MISTAKES TO AVOID

### Puzzle Assembly
```
❌ Entering items in random order
✓ Enter items in CORRECT sequence order

❌ Forgetting explanations
✓ Help students understand why order matters

❌ Making pieces identical/ambiguous
✓ Each piece should be clearly distinct
```

### Matching
```
❌ Left items: A, B, C | Right items: X, Y, Z (unordered)
✓ Right items in corresponding order to left items

❌ Unequal number of left/right items
✓ Always match the counts
```

### Drag & Drop
```
❌ Items: apple, banana, carrot (no categories)
✓ Items: apple:fruit, banana:fruit, carrot:vegetable

❌ Vague category names
✓ Clear category names (Fruits, Vegetables, etc.)
```

### Coding
```
❌ Forgetting test cases
✓ Include multiple test cases (easy, hard, edge cases)

❌ Test case format wrong: "5 → 120"
✓ Correct format: "5|120"
```

### Image Based
```
❌ Wrong coordinates (clicking outside region)
✓ Test by clicking yourself to verify coordinates

❌ Tolerance too tight (0 pixels)
✓ Set tolerance 5-20 pixels for user convenience
```

---

## 🎓 STUDENT EXPERIENCE BY TYPE

| Type | Student Does | Time |
|------|-------------|------|
| MCQ | Click 1 of 4 options | 30 sec |
| MULTI_SELECT | Click multiple options | 45 sec |
| TRUE_FALSE | Click True or False | 20 sec |
| FILL_BLANK | Type answer | 60 sec |
| MATCHING | Drag matches between columns | 90 sec |
| ORDERING | Drag items to correct order | 90 sec |
| PUZZLE | Drag puzzle pieces to assemble | 120 sec |
| DRAG_DROP | Drag items to categories | 120 sec |
| CODING | Write code + run tests | 300+ sec |
| IMAGE_BASED | Click region in image | 60 sec |
| AUDIO_BASED | Listen + click option | 90 sec |

---

## 📱 RESPONSIVE BEHAVIOR

All quiz types work on:
- ✓ Desktop (best UX)
- ✓ Tablet (good for drag/drop)
- ✓ Mobile (MCQ/TRUE_FALSE best, CODING harder)

---

## 🔗 QUIZ TYPE DEPENDENCIES

- **Question Metadata** (Title, points, hint) → Same for all types
- **Content Items** (Text/Image/Video/Audio) → Available for all types
- **Answer Configuration** → Specific to each quiz type
- **Validation** → Type-specific validation rules

---

## 💡 PRO TIPS

1. **Always include context in content items**
   ```
   Don't: Just add answer form
   Do: Add instructions + examples in content first
   ```

2. **Test your own quiz**
   - MCQ: Are options distinct?
   - PUZZLE: Is sequence logical?
   - MATCHING: Are pairings obvious?

3. **Provide good explanations**
   - Helps students learn, not just score
   - Improves quiz effectiveness

4. **Use variety**
   - Don't use only MCQ
   - Mix types to keep students engaged

5. **Set appropriate time limits**
   - 30 sec per MCQ
   - 2 min per PUZZLE
   - 5 min per CODING

---

## ❓ FAQ

**Q: Can I use different content types per question?**
A: Yes! Each question can have text, images, video, and audio combined.

**Q: Do all students get the same questions?**
A: Yes, unless you create multiple quiz versions (future feature).

**Q: Can I shuffle answers?**
A: For MCQ/MULTI_SELECT yes (option in metadata). For ORDERING/PUZZLE yes (auto-shuffled).

**Q: Can students skip questions?**
A: Yes, by default (configurable in rules).

**Q: Can questions be retaken?**
A: Yes, depends on attempts limit (default: 3 attempts).

**Q: Are partial scores supported?**
A: Yes, enable "Allow Partial Scoring" in metadata.

---

## 🎯 QUIZ BUILDER STATUS

✅ All 11 quiz types fully supported
✅ Flexible content items for all types
✅ Type-specific answer configuration
✅ Complete metadata support
✅ Ready for production

**Start creating quizzes now!**

