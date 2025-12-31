# 📝 Quiz Question Format Guide

## Quick Overview

The AmAha quiz system now supports flexible question formats:

| Feature | Details |
|---------|---------|
| **Question Types** | Text only, Text + Image, Image only |
| **Options** | 2-4 options (pipe-separated in CSV) |
| **Option Types** | Text only, Image only, or Text + Image |
| **Import Method** | CSV/Excel bulk import or manual creation |

---

## ✨ Question Type Examples

### 1️⃣ Text-Only Question
```
Question: "What is the capital of France?"
Options: Paris | London | Berlin | Madrid
Answer: Paris
```
**CSV Format:**
```
question,questionType,options,correctAnswer,difficulty,category
What is the capital of France?,text,Paris|London|Berlin|Madrid,Paris,easy,Geography
```

### 2️⃣ Text + Image Question
```
Question (with image): "Which color is in this flag?"
Image: [Shows French flag]
Options: Red | Blue | Green | Yellow
Answer: Red
```
**CSV Format:**
```
question,questionType,questionImage,options,correctAnswer,difficulty,category
Which color is in this flag?,text-image,https://example.com/france_flag.jpg,Red|Blue|Green|Yellow,Red,medium,Geography
```

### 3️⃣ Image-Only Question
```
Question: [Image of Eiffel Tower]
Options: France | Germany | Italy | Spain
Answer: France
```
**CSV Format:**
```
question,questionType,questionImage,options,correctAnswer,difficulty,category
Identify this landmark,image,https://example.com/eiffel_tower.jpg,France|Germany|Italy|Spain,France,hard,Geography
```

### 4️⃣ Options with Images
```
Question: "Match the flag to the country"
Option A: France [+ flag image]
Option B: Germany [+ flag image]
Option C: Italy [+ flag image]
Option D: Spain [+ flag image]
```
**CSV Format:**
```
question,questionType,options,images,correctAnswer,difficulty,category
Match the flag,text,France|Germany|Italy|Spain,https://ex.com/france.jpg|https://ex.com/germany.jpg|https://ex.com/italy.jpg|https://ex.com/spain.jpg,France,medium,Geography
```

### 5️⃣ True/False (2 Options)
```
Question: "Paris is the capital of France"
Options: True | False
Answer: True
```
**CSV Format:**
```
question,questionType,options,correctAnswer,difficulty,category
Paris is the capital of France,text,True|False,True,easy,General Knowledge
```

---

## 📊 CSV Column Reference

### Required Columns

| Column | Type | Values | Example |
|--------|------|--------|---------|
| `question` | String | 5-500 chars | "What is 2+2?" |
| `questionType` | String | text, text-image, image | "text" |
| `options` | String | Pipe-separated, 2-4 items | "4\|5\|6\|7" |
| `correctAnswer` | String | Must match option | "4" |
| `difficulty` | String | easy, medium, hard | "easy" |
| `category` | String | Valid category | "Math" |

### Optional Columns

| Column | Type | Values | Purpose |
|--------|------|--------|---------|
| `questionImage` | String | HTTPS image URL | Question background image |
| `images` | String | Pipe-separated URLs | Option images (matches option order) |

### Important Notes

- **Pipe Separator**: Use `|` to separate options and images
- **Empty Images**: Use empty space between pipes: `url1||url3|`
- **HTTPS Only**: All image URLs must start with `https://`
- **Case Sensitive**: Answer must match option exactly
- **No Special Chars**: Avoid quotes in CSV cells (use quotes to wrap cells instead)

---

## 🚀 Step-by-Step: Bulk Import Quiz Questions

### Step 1: Prepare CSV Data
Create a CSV with proper columns:

```csv
question,questionType,options,correctAnswer,difficulty,category
What is the capital of France?,text,Paris|London|Berlin|Madrid,Paris,easy,Geography
What is 2+2?,text,3|4|5|6,4,easy,Math
Identify the flag,image,https://ex.com/flag.jpg,France|Germany|Italy|Spain,France,medium,Geography
```

### Step 2: Open Bulk Import Modal
1. Go to Admin Dashboard → **Quizzes tab**
2. Click **"📤 Bulk Import"** button
3. Modal opens with CSV editor

### Step 3: Paste CSV Data
1. Click in the CSV textarea
2. Paste your CSV data
3. You should see the template at bottom: **"📋 View CSV Template"**

### Step 4: Validate & Import
1. Click **"📤 Import Data"** button
2. System validates all rows:
   - ✅ Question format correct
   - ✅ Options count (2-4)
   - ✅ Correct answer in options
   - ✅ Image URLs valid (if present)
   - ✅ Difficulty valid
   - ✅ Category exists

### Step 5: Review Results
- ✅ Success: Shows count imported
- ❌ Errors: Shows row numbers and reasons
- Auto-closes after 2 seconds on success

---

## ⚠️ Common Errors & Fixes

### Error: "Question must be at least 5 characters"
**Cause**: Question text is too short  
**Fix**: Make sure question has at least 5 characters
```
❌ Bad: "What"
✅ Good: "What is the capital?"
```

### Error: "Question type must be 'text', 'text-image', or 'image'"
**Cause**: Wrong value in questionType column  
**Fix**: Use exact values: `text`, `text-image`, or `image`
```
❌ Bad: "Text", "TEXT", "text+image"
✅ Good: "text", "text-image"
```

### Error: "Minimum 2 options required"
**Cause**: Fewer than 2 options provided  
**Fix**: Provide at least 2 options separated by `|`
```
❌ Bad: "Paris"
✅ Good: "Paris|London"
```

### Error: "Maximum 4 options allowed"
**Cause**: More than 4 options provided  
**Fix**: Remove extra options (max 4)
```
❌ Bad: "A|B|C|D|E"
✅ Good: "A|B|C|D"
```

### Error: "Correct answer 'Paris' not found in options"
**Cause**: Answer doesn't match any option exactly  
**Fix**: Make sure answer matches one option (case-sensitive)
```
❌ Bad: options="Paris|London", correctAnswer="paris"
✅ Good: options="Paris|London", correctAnswer="Paris"
```

### Error: "Question type 'text-image' requires valid HTTPS image URL"
**Cause**: Missing or invalid image URL  
**Fix**: Add valid HTTPS image URL for text-image or image types
```
❌ Bad: questionType="text-image", questionImage=""
✅ Good: questionType="text-image", questionImage="https://example.com/img.jpg"
```

### Error: "Number of option images must match number of options"
**Cause**: Images count doesn't match options count  
**Fix**: Provide same number of images as options
```
❌ Bad: options="A|B|C|D" (4), images="url1|url2" (2)
✅ Good: options="A|B|C|D" (4), images="url1|url2|url3|url4" (4)
```

### Error: "Option image URL must be valid HTTPS URL"
**Cause**: Non-HTTPS or invalid URL  
**Fix**: Use valid HTTPS URLs, use empty cell if no image
```
❌ Bad: images="http://example.com/img.jpg|"
✅ Good: images="https://example.com/img.jpg|"
```

---

## 📋 CSV Template Examples

### Template 1: Basic Text Questions
```csv
question,questionType,options,correctAnswer,difficulty,category
What is 2+2?,text,3|4|5|6,4,easy,Math
What is the largest planet?,text,Jupiter|Saturn|Venus|Earth,Jupiter,easy,Science
```

### Template 2: With Question Images
```csv
question,questionType,questionImage,options,correctAnswer,difficulty,category
Which color is shown?,text-image,https://example.com/color.jpg,Red|Blue|Green|Yellow,Red,medium,Vision
What animal is this?,text-image,https://example.com/lion.jpg,Lion|Tiger|Bear|Wolf,Lion,easy,Animals
```

### Template 3: With Option Images
```csv
question,questionType,options,images,correctAnswer,difficulty,category
Match the flag,text,France|Germany|Italy|Spain,https://ex.com/france.jpg|https://ex.com/germany.jpg|https://ex.com/italy.jpg|https://ex.com/spain.jpg,France,medium,Geography
```

### Template 4: Mixed Types
```csv
question,questionType,questionImage,options,images,correctAnswer,difficulty,category
What is Paris?,text,,City of France|Capital of Germany|Capital of Italy|Capital of Spain,,City of France,easy,Geography
Identify the flag,text-image,https://example.com/flag.jpg,France|Germany|Italy|Spain,,France,medium,Geography
Which is correct?,image,https://example.com/question.jpg,Option A|Option B|Option C|Option D,https://ex.com/a.jpg|https://ex.com/b.jpg|https://ex.com/c.jpg|https://ex.com/d.jpg,Option A,hard,Visual Reasoning
```

---

## 🔍 Validation Rules Summary

### Questions
- ✅ 5-500 characters
- ✅ Must have text (except image-only type, which has questionImage)
- ✅ Type: text, text-image, image

### Options
- ✅ 2-4 options total
- ✅ 1-200 characters per option
- ✅ No duplicate options
- ✅ All options non-empty

### Images
- ✅ Valid HTTPS URLs only
- ✅ Optional except for text-image and image types
- ✅ Option images count must match options count

### Metadata
- ✅ Difficulty: easy, medium, hard
- ✅ Category: must exist in database
- ✅ Answer: must match one option exactly

---

## ✅ Pre-Upload Checklist

Before uploading your CSV:

- [ ] Question column has 5+ characters per question
- [ ] All questionType values are: text, text-image, or image
- [ ] All options are pipe-separated (|)
- [ ] Each question has 2-4 options
- [ ] No duplicate options in same question
- [ ] correctAnswer matches an option exactly
- [ ] All image URLs start with https://
- [ ] Difficulty is: easy, medium, or hard
- [ ] All categories exist in database
- [ ] No special quotes in CSV cells
- [ ] Empty cells for missing images (not blank, just empty)

---

## 🎯 Example: Complete CSV Export

Here's a ready-to-use CSV you can modify:

```csv
question,questionType,questionImage,options,images,correctAnswer,difficulty,category
What is the capital of France?,text,,Paris|London|Berlin|Madrid,,Paris,easy,Geography
Which color is the sky?,text-image,https://example.com/sky.jpg,Blue|Green|Red|Yellow,,Blue,easy,Science
Identify this flag,image,https://example.com/flag.jpg,France|Germany|Italy|Spain,https://ex.com/france.jpg|https://ex.com/germany.jpg|https://ex.com/italy.jpg|https://ex.com/spain.jpg,France,medium,Geography
Is water wet?,text,,True|False,,True,easy,General Knowledge
Match the capital,text,,Rome|Berlin|Madrid|London,,Rome,medium,Geography
What is 2+2?,text,,3|4|5|6,,4,easy,Math
```

---

## 🤔 FAQs

**Q: Can I have different numbers of options per question?**  
A: Yes! You can have 2, 3, or 4 options per question. Mix them in the same CSV.

**Q: Do all questions need images?**  
A: No! Images are optional. Leave the column empty or omit it. Only required for image-only and text-image types.

**Q: Can I use regular HTTP URLs?**  
A: No. All image URLs must be HTTPS for security. No exceptions.

**Q: What if I have special characters in options?**  
A: Use proper CSV escaping - wrap the cell in quotes if it contains special characters.

**Q: Can I update existing questions via bulk import?**  
A: Not directly. Bulk import creates new questions. To update, edit questions individually or delete & re-import.

**Q: How many questions can I import at once?**  
A: No hard limit, but performance is optimized for batches of 100-500 per import.

**Q: What image formats are supported?**  
A: JPG, PNG, GIF, WebP - any format your image hosting supports via HTTPS.

---

## 💡 Pro Tips

1. **Use Google Sheets**: Create your CSV in Google Sheets, export as CSV, then paste
2. **Template First**: Start with the template shown in the modal
3. **Test Small**: Import 5 questions first to test format
4. **Categories First**: Make sure categories exist before importing
5. **Unique Answers**: Keep correct answers simple and exact
6. **Image URLs**: Use image hosting (Cloudinary, etc.) for reliable URLs

---

## 🔗 Related Documentation

- [Quiz Question Format Specification](./QUIZ_QUESTION_FORMAT_SPEC.md)
- [Admin Dashboard Guide](./ADMIN_PANEL_MIGRATION_SUMMARY.md)
- [Database Schema](./DATABASE_ARCHITECTURE_GUIDE.md)

---

**Last Updated**: December 31, 2025  
**Version**: 1.0

