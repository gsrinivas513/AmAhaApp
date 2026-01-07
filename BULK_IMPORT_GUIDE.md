# 📤 Bulk Import Quizzes Guide

## Overview

The Bulk Import feature allows you to create multiple quizzes at once by uploading CSV or JSON data. This is perfect for:
- Importing quizzes from other systems
- Creating multiple levels of the same quiz
- Batch uploading pre-prepared quiz content
- Managing quizzes programmatically

---

## Accessing Bulk Import

1. Go to **Admin Dashboard** → **Manage Quizzes**
2. Click the **📤 Bulk Import Quizzes** button
3. A modal will appear with a textarea for data input
4. Paste your CSV or JSON data
5. Click **Import Quizzes**

---

## Data Format

### CSV Format

**Headers (in order):**
```
title,category,level,quizType,description,timeLimit,passingScore,attempts,shuffle,partialScoring,showExplanation,levelVariant
```

**Example:**
```csv
title,category,level,quizType,description,timeLimit,passingScore,attempts,shuffle,partialScoring,showExplanation,levelVariant
Biology Quiz,Science,Intermediate,multiple-choice,Learn the basics of biology,30,70,3,true,true,true,beginner
Biology Quiz,Science,Advanced,multiple-choice,Advanced biology concepts,45,80,3,true,true,true,advanced
Chemistry Quiz,Science,Beginner,multiple-choice,Introduction to chemistry,25,65,2,true,true,true,standard
```

### JSON Format

**Structure:**
```json
[
  {
    "title": "Biology Quiz",
    "category": "Science",
    "level": "Intermediate",
    "quizType": "multiple-choice",
    "description": "Learn the basics of biology",
    "timeLimit": 30,
    "passingScore": 70,
    "attempts": 3,
    "shuffle": true,
    "partialScoring": true,
    "showExplanation": true,
    "levelVariant": "beginner"
  },
  {
    "title": "Biology Quiz",
    "category": "Science",
    "level": "Advanced",
    "quizType": "multiple-choice",
    "description": "Advanced biology concepts",
    "timeLimit": 45,
    "passingScore": 80,
    "attempts": 3,
    "shuffle": true,
    "partialScoring": true,
    "showExplanation": true,
    "levelVariant": "advanced"
  }
]
```

---

## Field Reference

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| **title** | String | ✅ Yes | Quiz name/title | "Biology Quiz" |
| **category** | String | ✅ Yes | Quiz category | "Science", "Math", "History" |
| **level** | String | ✅ Yes | Difficulty level | "Beginner", "Intermediate", "Advanced" |
| **quizType** | String | ✅ Yes | Type of quiz | "multiple-choice", "true-false", "fill-in-blank" |
| **description** | String | ✅ Yes | Quiz description | "Learn about cell biology" |
| **timeLimit** | Number | ✅ Yes | Time limit in minutes | 30, 45, 60 |
| **passingScore** | Number | ✅ Yes | Passing percentage | 65, 70, 80 |
| **attempts** | Number | ✅ Yes | Number of attempts allowed | 1, 2, 3 |
| **shuffle** | Boolean | ✅ Yes | Shuffle questions? | true, false |
| **partialScoring** | Boolean | ✅ Yes | Award partial credit? | true, false |
| **showExplanation** | Boolean | ✅ Yes | Show explanations after? | true, false |
| **levelVariant** | String | ✅ Yes | Difficulty variant | "standard", "beginner", "intermediate", "advanced", "easy", "hard" |

---

## Multiple Levels Support

### What is levelVariant?

The `levelVariant` field allows you to create multiple difficulty levels of the **same quiz title**. This is useful for:
- Easy/Medium/Hard versions of the same quiz
- Beginner/Intermediate/Advanced variations
- Different competency levels

### Example: Multiple Levels of One Quiz

```csv
title,category,level,quizType,description,timeLimit,passingScore,attempts,shuffle,partialScoring,showExplanation,levelVariant
Physics Quiz,Science,Beginner,multiple-choice,Basic physics principles,20,60,2,true,true,true,beginner
Physics Quiz,Science,Intermediate,multiple-choice,Intermediate physics,30,70,3,true,true,true,intermediate
Physics Quiz,Science,Advanced,multiple-choice,Advanced physics theory,45,80,3,true,true,true,advanced
```

**Result:**
- Three separate quizzes created in the system
- Same title ("Physics Quiz"), same category
- Different difficulty variants
- Can be queried/filtered by levelVariant

---

## Supported Quiz Types

The following quiz types are supported:

| Type | Description |
|------|-------------|
| `multiple-choice` | Multiple choice questions |
| `true-false` | True/False questions |
| `fill-in-blank` | Fill in the blank questions |
| `multiple-select` | Select multiple correct answers |
| `matching` | Match items together |
| `ordering` | Order items in sequence |
| `short-answer` | Short text answers |
| `essay` | Long form essay |
| `multiple-choice-multiple-select` | Hybrid multiple choice/select |
| `image-based` | Questions with image selection |
| `drag-and-drop` | Drag and drop interactions |

---

## Success & Error Handling

### On Successful Import
- You'll see an alert showing: "Imported X quizzes successfully! Y failed."
- The bulk import modal will close
- All successful quizzes are saved to Firestore
- You can refresh to see them in the list

### On Errors
- Failed quizzes are skipped (not saved)
- Successful ones are still imported
- Check the count of failed imports
- Common reasons:
  - Missing required fields
  - Invalid quiz type
  - Malformed CSV/JSON
  - Empty title or category

---

## Tips & Best Practices

✅ **DO:**
- Keep CSV/JSON clean and well-formatted
- Use consistent category names
- Test with a small batch first
- Use appropriate timeLimit (15-120 minutes)
- Set passingScore between 50-100
- Use realistic attempt counts (1-5)

❌ **DON'T:**
- Leave required fields blank
- Use unsupported quiz types
- Set passingScore > 100
- Use newlines in field values (CSV)
- Mix CSV and JSON in same import

---

## Import Examples

### Simple Multiple Choice Quiz
```csv
title,category,level,quizType,description,timeLimit,passingScore,attempts,shuffle,partialScoring,showExplanation,levelVariant
Grammar Test,Language,Beginner,multiple-choice,Basic grammar rules,15,70,3,true,true,true,standard
```

### Multiple Variants with JSON
```json
[
  {
    "title": "Math Quiz",
    "category": "Math",
    "level": "Easy",
    "quizType": "multiple-choice",
    "description": "Basic math operations",
    "timeLimit": 20,
    "passingScore": 60,
    "attempts": 2,
    "shuffle": true,
    "partialScoring": false,
    "showExplanation": true,
    "levelVariant": "easy"
  },
  {
    "title": "Math Quiz",
    "category": "Math",
    "level": "Hard",
    "quizType": "multiple-choice",
    "description": "Advanced math concepts",
    "timeLimit": 45,
    "passingScore": 75,
    "attempts": 3,
    "shuffle": true,
    "partialScoring": true,
    "showExplanation": true,
    "levelVariant": "hard"
  }
]
```

### Batch Import Multiple Quizzes
```csv
title,category,level,quizType,description,timeLimit,passingScore,attempts,shuffle,partialScoring,showExplanation,levelVariant
History Quiz 1,History,Intermediate,multiple-choice,Medieval Europe,30,70,3,true,true,true,standard
Geography Quiz 1,Geography,Beginner,multiple-choice,World capitals,25,65,2,true,true,true,standard
Science Quiz 1,Science,Advanced,multiple-choice,Quantum mechanics,40,80,3,true,true,true,advanced
Literature Quiz 1,Literature,Intermediate,true-false,Shakespeare works,20,75,2,false,true,true,standard
```

---

## Troubleshooting

**Q: Import shows 0 successful, all failed?**
- Check CSV/JSON syntax
- Verify all required fields are present
- Ensure no empty cells in CSV

**Q: Some imported, some failed?**
- Check which rows have issues
- Invalid quizType or missing fields cause individual rows to fail
- See error in browser console for details

**Q: Why aren't my quizzes showing?**
- Refresh the page
- Check the "Manage Quizzes" list
- Use the search bar to find by title

**Q: How do I update imported quizzes?**
- Currently: Delete and re-import with corrections
- Or: Edit through the quiz detail editor

---

## Integration with Advanced Quiz Builder

You have two ways to create quizzes:

1. **🚀 Advanced Quiz Builder** (Single Quiz)
   - Step 1: Enter metadata
   - Step 2: Add questions one by one
   - Best for: Individual, carefully crafted quizzes

2. **📤 Bulk Import** (Multiple Quizzes)
   - Paste CSV/JSON with all data
   - Creates multiple quizzes at once
   - Best for: Batch operations, pre-prepared data

---

## Data Storage

All imported quizzes are stored in Firestore under the `quizzes` collection with:
- ✅ Auto-generated document IDs
- ✅ Creation timestamps
- ✅ Default status: "draft"
- ✅ All metadata preserved
- ✅ Ready to add questions via Advanced Builder

---

## Next Steps

After bulk importing quizzes:
1. Go to **Manage Quizzes** → **Edit Quiz**
2. Use **Advanced Quiz Builder** to add questions
3. Set status to "published" when ready
4. Quiz appears in user-facing app

---

## Questions?

For issues with bulk import:
- Check the format examples above
- Verify all required fields are present
- Review the error message in the import result
- Check browser console for detailed errors

