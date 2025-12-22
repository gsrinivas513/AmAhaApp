# CSV Import Column Mapping Guide

## Overview
This document explains how CSV column headers map to the ViewQuestionsPage table columns and database fields.

## ✅ Column Mapping

| CSV Header | Database Field | ViewQuestionsPage Column | Required | Notes |
|------------|----------------|-------------------------|----------|-------|
| `feature` | `feature` | **Feature** | Optional | Feature name (e.g., "Quiz", "Puzzle") |
| `category` | `category` | **Category** | Required | Category name (e.g., "Kids", "Science") |
| `subcategory` | `subcategory` | **Subcategory** | Optional | Subcategory name (e.g., "Animals & Their Sounds") |
| `question` | `question` | **Question** | Required | The question text |
| `optionA` | `options[0]` | **Options** | Required | First option |
| `optionB` | `options[1]` | **Options** | Required | Second option |
| `optionC` | `options[2]` | **Options** | Optional | Third option |
| `optionD` | `options[3]` | **Options** | Optional | Fourth option |
| `correctAnswer` | `correctAnswer` | **Correct Answer** | Required | Must match one of the options |
| `difficulty` | `difficulty` | **Difficulty** | Optional | "easy", "medium", or "hard" (default: "easy") |

## 📋 CSV Format Example

### Correct Format (All Columns):
```csv
question,optionA,optionB,optionC,optionD,correctAnswer,category,subcategory,difficulty,feature
What sound does a dog make?,Meow,Woof,Moo,Quack,Woof,Kids,Animals & Their Sounds,easy,Quiz
Which animal says 'Moo'?,Cat,Dog,Cow,Duck,Cow,Kids,Animals & Their Sounds,easy,Quiz
```

### Minimal Format (Required Only):
```csv
question,optionA,optionB,correctAnswer,category
What sound does a dog make?,Meow,Woof,Woof,Kids
Which animal says 'Moo'?,Cat,Cow,Cow,Kids
```

## 🔍 How ViewQuestionsPage Displays Data

The admin/view-questions page shows these columns:

1. **Feature** - From `question.feature` field (e.g., "Quiz")
2. **Category** - From `question.category` field (e.g., "Kids")
3. **Subcategory** - From `question.subcategory` field (e.g., "Animals & Their Sounds")
4. **Question** - From `question.question` field
5. **Options** - From `question.options` array (A/B/C/D with correct highlighted)
6. **Correct Answer** - From `question.correctAnswer` field
7. **Difficulty** - From `question.difficulty` field (color-coded badge)
8. **Actions** - Edit/Delete buttons

## 📝 Field Details

### Feature Field
- **Optional**: If not provided, shows "-"
- **Case-insensitive**: "Quiz", "quiz", "QUIZ" all work
- **Examples**: "Quiz", "Puzzle", "Study"

### Category Field
- **Required**: Must be provided
- **Case-insensitive**: Converted to lowercase in database
- **Examples**: "Kids", "Science", "History"

### Subcategory Field
- **Optional**: If not provided, shows "-"
- **Examples**: "Animals & Their Sounds", "Solar System", "World War II"

### Options
- **Multiple formats supported**:
  - Separate columns: `optionA, optionB, optionC, optionD`
  - Semicolon-separated: `options` column with "Option1;Option2;Option3;Option4"
- **Minimum**: 2 options required
- **Maximum**: No limit (but typically 2-4)

### Difficulty
- **Values**: "easy", "medium", "hard"
- **Default**: "easy" if not specified
- **Color-coding**: 
  - Easy = Green badge
  - Medium = Yellow badge
  - Hard = Red badge

## ⚠️ Common Issues

### Issue 1: Feature/Subcategory showing "-"
**Problem**: CSV doesn't have `feature` or `subcategory` columns
**Solution**: Add these columns to your CSV header

### Issue 2: All values showing under Category
**Problem**: Old import system didn't save feature/subcategory
**Solution**: Re-import CSV with updated format (fixed in latest version)

### Issue 3: Category not found
**Problem**: Category name doesn't match any in database
**Solution**: Helper functions now do case-insensitive name matching

## 🚀 Import Process

1. **Add headers** to your CSV (feature, category, subcategory, etc.)
2. **Go to** Admin → Import Questions
3. **Select** "Use CSV category" option
4. **Upload** your CSV file
5. **Preview** the count of questions
6. **Click** "Import Questions"
7. **Verify** in Admin → View Questions

## 📊 Database Schema

Questions are stored in Firestore with this structure:

```javascript
{
  question: "What sound does a dog make?",
  category: "kids",              // Required (lowercase)
  subcategory: "Animals & Their Sounds",  // Optional
  feature: "Quiz",               // Optional
  options: ["Meow", "Woof", "Moo", "Quack"],
  correctAnswer: "Woof",
  difficulty: "easy",
  externalId: null,              // Optional (for dedupe)
  createdAt: Timestamp           // Auto-generated
}
```

## ✅ Validation Rules

1. **Question**: Cannot be empty
2. **Category**: Required (when using CSV category)
3. **Options**: Minimum 2 options required
4. **CorrectAnswer**: Must be one of the options
5. **Difficulty**: Must be "easy", "medium", or "hard"
6. **Duplicates**: Checked by externalId or question text

## 🎯 Best Practices

1. ✅ **Always include feature and subcategory** for better organization
2. ✅ **Use consistent naming** (e.g., "Quiz" not "quiz" or "QUIZ")
3. ✅ **Add externalId** for dedupe when re-importing
4. ✅ **Test with 2-3 rows** before bulk import
5. ✅ **Verify in ViewQuestionsPage** after import

## 📄 Sample CSV Files

### kids_quiz_50_questions.csv
Location: `/Users/srini/Desktop/AmAha/AmAhaApp/amaha-web/kids_quiz_50_questions.csv`

This file has the correct format with all columns:
- ✅ feature column
- ✅ category column  
- ✅ subcategory column
- ✅ All required fields

## 🔧 Recent Fix (Dec 2025)

**Issue**: Feature and Subcategory were not being saved to database
**Fix**: Updated ImportQuestionsPage.jsx to:
1. Extract `feature` and `subcategory` from CSV (lines 113-115)
2. Save them to database (lines 248-249)
3. Now all three fields display correctly in ViewQuestionsPage

**Before**: Only `category` was saved
**After**: `feature`, `category`, and `subcategory` all saved

## 📞 Support

If questions are still not displaying correctly:

1. **Check browser console** for debug messages (F12 → Console)
2. **Verify CSV format** matches example above
3. **Re-import data** with updated CSV format
4. **Check Firestore** to verify fields are saved correctly
