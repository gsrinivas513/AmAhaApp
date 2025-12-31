# 🎯 Quiz Question Format Specification

## Overview
This document defines the standardized format for quiz questions in AmAha, including question types, option formats, and validation rules for both manual creation and bulk import.

---

## 1. Question Types

### ✅ Supported Question Formats

#### 1.1 Text-Only Question
**Description**: Question contains only text content
```
Format: Plain text (no images)
Example: "What is the capital of France?"
Validation: Required, min 5 characters
```

#### 1.2 Text + Image Question
**Description**: Question has text combined with an image
```
Format: Text + Image URL
Text: Question text (required)
Image URL: Valid image URL (required, HTTPS)
Example: 
  Text: "What color is the apple in the image?"
  Image: "https://example.com/apple.jpg"
Validation: Both required
```

#### 1.3 Image-Only Question
**Description**: Question is represented purely by an image
```
Format: Image URL only
Image URL: Valid image URL (required, HTTPS)
Question text: "Click to identify..." or leave as empty placeholder
Example: Image shows a flag, user must identify the country
Validation: Image URL required
```

---

## 2. Options Requirements

### ✅ Option Count Rules

| Minimum | Maximum | Default |
|---------|---------|---------|
| 2 | 4 | 4 |

**Rules**:
- ✅ 2 options: Allowed (True/False style)
- ✅ 3 options: Allowed (Less common)
- ✅ 4 options: Standard and recommended
- ❌ 1 option: Not allowed
- ❌ 5+ options: Not allowed

### ✅ Option Content Types

Each option can be:

#### 2.1 Text-Only Option
```
Format: Plain text
Example: "Paris"
Validation: Required, min 1 character, max 200 characters
```

#### 2.2 Text + Image Option
```
Format: Text + Image URL
Text: Option text (required)
Image: Image URL (optional, HTTPS)
Example:
  Text: "The Eiffel Tower"
  Image: "https://example.com/eiffel.jpg"
```

#### 2.3 Image-Only Option
```
Format: Image URL only
Example: Flag image for identification
Validation: Valid HTTPS image URL
```

---

## 3. Database Schema

### Question Document Structure

```javascript
{
  // Question content
  question: "What is the capital of France?",           // Required: min 5 chars
  questionImage: "https://example.com/image.jpg",       // Optional: HTTPS URL
  questionType: "text" | "text-image" | "image",        // Required: question format type
  
  // Options array
  options: [
    {
      text: "Paris",                                      // Required: 1-200 chars
      image: "https://example.com/paris.jpg",           // Optional: HTTPS URL
      imageOnly: false                                   // Optional: true if image-only option
    },
    {
      text: "London",
      image: null,
      imageOnly: false
    },
    {
      text: "Berlin",
      image: null,
      imageOnly: false
    },
    {
      text: "Madrid",
      image: null,
      imageOnly: false
    }
  ],
  
  // Answer & metadata
  correctAnswer: "Paris",                               // Required: must match one option text
  correctAnswerIndex: 0,                                // Optional: helps with lookups
  difficulty: "easy" | "medium" | "hard",              // Required
  category: "Geography",                                // Required
  feature: "quiz" | "puzzle",                          // Required
  
  // Timestamps
  createdAt: "2025-12-31T10:00:00Z",
  updatedAt: "2025-12-31T10:00:00Z"
}
```

---

## 4. CSV Format for Bulk Import

### 4.1 Column Structure

```
question | questionImage | questionType | options | images | correctAnswer | difficulty | category
```

### 4.2 Column Definitions

| Column | Type | Required | Format | Example |
|--------|------|----------|--------|---------|
| `question` | String | ✅ Yes | Plain text (5-500 chars) | "What is the capital of France?" |
| `questionImage` | String | ❌ No* | HTTPS image URL | "https://example.com/image.jpg" |
| `questionType` | String | ✅ Yes | `text` \| `text-image` \| `image` | "text" |
| `options` | String | ✅ Yes | Pipe-separated (2-4 items) | "Paris\|London\|Berlin\|Madrid" |
| `images` | String | ❌ No | Pipe-separated URLs (null ok) | "https://ex.com/p.jpg\|\|https://ex.com/b.jpg\|" |
| `correctAnswer` | String | ✅ Yes | Must match an option | "Paris" |
| `difficulty` | String | ✅ Yes | `easy` \| `medium` \| `hard` | "easy" |
| `category` | String | ✅ Yes | Valid category name | "Geography" |

*Required if questionType = "text-image"

### 4.3 CSV Examples

#### Example 1: Text-Only Questions (4 options)
```csv
question,questionType,options,correctAnswer,difficulty,category
What is the capital of France?,text,Paris|London|Berlin|Madrid,Paris,easy,Geography
What is the largest planet?,text,Jupiter|Saturn|Venus|Earth,Jupiter,medium,Science
```

#### Example 2: Text + Image Questions
```csv
question,questionImage,questionType,options,correctAnswer,difficulty,category
Which country's flag is this?,https://example.com/france_flag.jpg,text-image,France|Germany|Italy|Spain,France,easy,Geography
What animal is in the image?,https://example.com/lion.jpg,text-image,Lion|Tiger|Bear|Wolf,Lion,easy,Animals
```

#### Example 3: With Option Images
```csv
question,questionType,options,images,correctAnswer,difficulty,category
Match the capital to the country,text,Paris|Berlin|Rome|Madrid,https://ex.com/france.jpg|https://ex.com/germany.jpg|https://ex.com/italy.jpg|https://ex.com/spain.jpg,Paris,medium,Geography
Identify the flag,text,USA|UK|Canada|Australia,https://ex.com/usa.jpg|https://ex.com/uk.jpg|https://ex.com/canada.jpg|https://ex.com/australia.jpg,USA,easy,Flags
```

#### Example 4: True/False Questions (2 options)
```csv
question,questionType,options,correctAnswer,difficulty,category
Paris is the capital of France,text,True|False,True,easy,General Knowledge
The Earth is flat,text,True|False,False,easy,Science
```

#### Example 5: Image-Only Questions (Advanced)
```csv
question,questionType,options,images,correctAnswer,difficulty,category
Which flag is this?,image,Option A|Option B|Option C|Option D,https://ex.com/france_flag.jpg|https://ex.com/usa_flag.jpg|https://ex.com/uk_flag.jpg|https://ex.com/japan_flag.jpg,Option A,medium,Flags
```

---

## 5. Validation Rules

### 5.1 Question Validation

| Rule | Check |
|------|-------|
| **Text Required** | If questionType ≠ "image", question must have text |
| **Text Length** | 5-500 characters |
| **Image URL** | If present, must be valid HTTPS URL |
| **Image Required** | If questionType = "text-image" or "image", must have image URL |

### 5.2 Options Validation

| Rule | Check |
|------|-------|
| **Option Count** | 2-4 options required |
| **Option Text** | Each option 1-200 characters |
| **Unique Options** | No duplicate option texts |
| **All Options** | Cannot be empty |
| **Image Format** | If present, must be valid HTTPS URL |

### 5.3 Answer Validation

| Rule | Check |
|------|-------|
| **Correct Answer** | Must match exactly one option text (case-insensitive) |
| **Single Answer** | Only one correct answer per question |
| **Valid Answer** | Answer must be in options array |

### 5.4 Metadata Validation

| Rule | Check |
|------|-------|
| **Difficulty** | Must be "easy", "medium", or "hard" |
| **Category** | Must be valid from categories collection |
| **Feature Type** | Must be "quiz" or "puzzle" |

---

## 6. Implementation Guide

### 6.1 Creating a Question Manually

**UI Flow**:
1. Select feature type → Quiz
2. Select category, topic, subtopic
3. Enter question text OR select question image
4. Choose question type:
   - ☑️ Text Only
   - ☑️ Text + Image
   - ☑️ Image Only
5. Add 2-4 options (each can have text and/or image)
6. Select correct answer
7. Choose difficulty
8. Save

### 6.2 Bulk Importing Questions

**CSV Upload Flow**:
1. Click "📤 Bulk Import" button in Quizzes tab
2. Paste CSV data with proper format
3. System validates:
   - ✅ Column names
   - ✅ Question format (text/image)
   - ✅ Options count (2-4)
   - ✅ Correct answer in options
   - ✅ Image URLs (if present)
4. Show validation errors or success summary
5. Import on confirmation

---

## 7. Error Handling

### Common Validation Errors

```
Row 2: Question type "text-image" requires image URL
Row 3: Must have between 2-4 options (found 1)
Row 4: Correct answer "Jupiter" not found in options
Row 5: Option image URL is invalid HTTPS URL
Row 6: Question must be at least 5 characters
Row 7: Option text cannot be empty
```

---

## 8. UI Components

### 8.1 Question Type Selector
```jsx
<select value={questionType}>
  <option value="text">📝 Text Only</option>
  <option value="text-image">📝 + 🖼️ Text + Image</option>
  <option value="image">🖼️ Image Only</option>
</select>
```

### 8.2 Options Builder
```jsx
{/* For each option (2-4 total) */}
<input placeholder="Option text (required)" />
<input placeholder="Option image URL (optional)" />
<select value={optionType}>
  <option value="text">Text Only</option>
  <option value="image">Image Only</option>
  <option value="both">Text + Image</option>
</select>
```

### 8.3 Correct Answer Selector
```jsx
<select value={correctAnswer}>
  <option>Select correct answer</option>
  {options.map(opt => <option key={opt}>{opt}</option>)}
</select>
```

---

## 9. Migration Guide (From Old Format)

### Old Format Issues
- Fixed 4 options per question
- No support for images
- No question type designation
- Limited option flexibility

### New Format Benefits
- ✅ 2-4 flexible options
- ✅ Text, image, or combined content
- ✅ Image-only questions
- ✅ More engaging content
- ✅ Better for accessibility

### Migration Strategy
1. Text-only questions → Keep as "text" type
2. Questions needing images → Convert to "text-image"
3. Simplify where possible → True/False as 2 options
4. Add images for visual enhancements

---

## 10. Testing Checklist

### Manual Creation
- [ ] Create text-only question (4 options)
- [ ] Create text-only question (2 options)
- [ ] Create text + image question
- [ ] Create image-only question
- [ ] Create question with option images
- [ ] Verify correct answer validation
- [ ] Verify option count limits

### Bulk Import
- [ ] Import text-only questions
- [ ] Import mixed format questions
- [ ] Import with option images
- [ ] Validate error handling
- [ ] Verify data integrity post-import
- [ ] Test CSV parsing edge cases

### Edge Cases
- [ ] Special characters in options
- [ ] Very long option texts
- [ ] Invalid image URLs
- [ ] Missing required fields
- [ ] Duplicate options
- [ ] Case sensitivity in answers

---

## 11. References

- **Database**: Firestore `questions` collection
- **UI Forms**: AddQuestionPage.jsx, QuizEditModal.jsx
- **Bulk Import**: BulkImport.jsx modal component
- **Validation**: validateQuizQuestion() function
- **CSV Parser**: Papa Parse library

---

**Version**: 1.0  
**Last Updated**: December 31, 2025  
**Status**: ✅ Approved & Ready for Implementation

