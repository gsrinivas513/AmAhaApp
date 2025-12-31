# 🎯 Quiz Question Format - Quick Reference Card

## Question Types

| Type | Question | Options | Example | When to Use |
|------|----------|---------|---------|------------|
| **Text Only** | Text | Text | "What's 2+2?" | Standard questions |
| **Text + Image** | Text + Image | Text | "Which color?" with flag | Context questions |
| **Image Only** | Image | Text | Flag image with country names | Visual identification |

## CSV Format

```
question | questionType | questionImage | options | images | correctAnswer | difficulty | category
```

## Quick Examples

### Text Only
```csv
question,questionType,options,correctAnswer,difficulty,category
What is 2+2?,text,3|4|5|6,4,easy,Math
```

### Text + Image  
```csv
question,questionType,questionImage,options,correctAnswer,difficulty,category
Which color?,text-image,https://ex.com/flag.jpg,Red|Blue|Green|Yellow,Red,easy,Vision
```

### With Option Images
```csv
question,questionType,options,images,correctAnswer,difficulty,category
Match flags,text,France|Germany|Italy,https://ex.com/fr.jpg|https://ex.com/de.jpg|https://ex.com/it.jpg,France,easy,Geography
```

### True/False (2 Options)
```csv
question,questionType,options,correctAnswer,difficulty,category
Paris is capital of France,text,True|False,True,easy,Geography
```

## Option Rules

| Requirement | Min | Max | Default |
|-------------|-----|-----|---------|
| Options per question | **2** | **4** | 4 |
| Characters per option | 1 | 200 | - |
| Unique options | ✅ Yes | - | - |

## Validation Rules

✅ **Question**
- 5-500 characters
- Type: text, text-image, or image
- Image required for text-image & image types

✅ **Options**
- 2-4 total (no less, no more)
- No duplicates
- All non-empty

✅ **Answer**
- Must match option exactly
- Case-insensitive match
- Single answer per question

✅ **Images**
- HTTPS URLs only (no HTTP)
- Optional (except for image types)
- Count must match option count

✅ **Metadata**
- Difficulty: easy, medium, hard
- Category: must exist in database

## Common Errors

| Error | Cause | Fix |
|-------|-------|-----|
| "Question must be 5+ chars" | Too short | Make question longer |
| "Invalid question type" | Wrong value | Use: text, text-image, image |
| "Minimum 2 options" | Too few | Add more options |
| "Maximum 4 options" | Too many | Remove options |
| "Answer not in options" | Wrong match | Match exactly |
| "Invalid HTTPS URL" | Bad image URL | Use https:// URLs |

## Difficulty Levels

```
easy    → Beginner friendly
medium  → Intermediate
hard    → Advanced/Expert
```

## CSV Tips

✅ Use pipe `|` to separate options  
✅ Use `|` for empty images: `url1||url3|`  
✅ Wrap cells with special chars in quotes: `"Paris, France"`  
✅ Use HTTPS for all image URLs  
✅ Match answer case exactly  

## Bulk Import Steps

1. Click **📤 Bulk Import** button
2. View **📋 CSV Template** for examples
3. Paste your CSV data
4. Click **📤 Import Data**
5. Fix any errors shown
6. Auto-closes on success

## File Locations

| Document | Purpose |
|----------|---------|
| [QUIZ_QUESTION_FORMAT_SPEC.md](./QUIZ_QUESTION_FORMAT_SPEC.md) | Technical specification |
| [QUIZ_BULK_IMPORT_GUIDE.md](./QUIZ_BULK_IMPORT_GUIDE.md) | User guide with examples |
| [QUIZ_FORMAT_IMPLEMENTATION.md](./QUIZ_FORMAT_IMPLEMENTATION.md) | Implementation details |

## Code Location

**BulkImport Modal**: `/src/admin/modals/BulkImport.jsx`  
**Validation Function**: `validateQuizQuestion()` (lines 36-105)  
**Import Logic**: `handleImport()` (lines 139-224)  
**CSV Template**: `getTemplate()` (lines 246-258)

---

## Ready to Use

Simply click **"📤 Bulk Import"** in the Quizzes tab and:
- Paste CSV data with proper format
- System validates automatically
- Shows errors with row numbers
- Imports on success

**Start with the template provided in the modal!** 🚀

