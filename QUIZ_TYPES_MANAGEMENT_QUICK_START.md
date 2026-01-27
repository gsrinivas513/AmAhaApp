# Quiz Types Management - Quick Start Guide

## What's New?

You now have a **complete Quiz Types Management System** accessible from the admin dashboard.

## Access the Quiz Types Manager

1. **Go to Admin Dashboard**
   - Navigate to: `/admin` or `/#overview`

2. **Click the "🎯 Quiz Types" tab**
   - Located in Administration section
   - Between Features and Users tabs

3. **You'll see:**
   - All 14 quiz types displayed in a grid
   - Statistics: Total, Active, Categories
   - Search and filter options
   - Type cards with action buttons

## What You Can Do

### View Types
- See all 14 default quiz/puzzle types
- See custom types you've added
- View type metadata (complexity, points, icon, color)
- Check usage count for each type

### Search & Filter
```
Search field:     Type to find types by ID, label, or description
Category filter:  Show only Basic / Intermediate / Advanced
Show inactive:    Toggle to see deactivated types
```

### Add Custom Type
```
Click "+ Add New Type" button
↓
Fill the form:
  - Type ID (e.g., MY_TYPE)
  - Label (e.g., My Custom Quiz Type)
  - Description
  - Category (Basic/Intermediate/Advanced)
  - Complexity (Simple/Medium/Complex)
  - Input Type (how users answer)
  - Evaluation Type (how answers are scored)
  - Default Points (1-100)
  - Icon & Color for visual identity
  - Media Support checkbox
↓
Click "Save Type"
↓
Type is created and appears in list
```

### Edit Type
```
On any type card, click "Edit" button
↓
Modal opens with current values
↓
Modify any field (except ID for system types)
↓
Click "Save Type"
↓
Changes saved to database
```

### Manage Status
```
Active Type:
  Click "Disable" → Type deactivated (won't show in quiz creator)
  
Inactive Type:
  Click "Enable" → Type reactivated (appears in quiz creator)
```

### Delete Type
```
Custom Type:
  Click "Delete" → Removed permanently from database
  
System Type (default 14):
  Cannot delete - only "Disable" option available
  (System types can be deactivated but not deleted)
```

## The 14 Default Types

### Basic Category (Simple)
1. **MCQ** (Multiple Choice) - Single correct answer from 4 options
2. **TRUE_FALSE** - Binary true or false question
3. **AUDIO_BASED** - Listen to audio and answer multiple choice

### Intermediate Category (Medium)
4. **MULTI_SELECT** - Multiple correct answers possible
5. **FILL_BLANK** - Type the correct answer (fuzzy matching)
6. **MATCHING** - Match pairs of items
7. **ORDERING** - Arrange items in correct sequence
8. **WORD_SEARCH** - Find hidden words in letter grid

### Advanced Category (Complex)
9. **DRAG_DROP** - Drag items into categories
10. **CODING** - Write code against test cases
11. **IMAGE_BASED** - Click/mark regions in image
12. **PUZZLE** - Arrange puzzle pieces
13. **CROSSWORD** - Fill grid with words using clues
14. **SUDOKU** - Fill 9×9 grid with numbers

## Type Metadata

Each type has:
- **Icon**: Visual symbol (unicode)
- **Color**: Hex color for display
- **Complexity**: Simple (●), Medium (●●), Complex (●●●)
- **Points**: Default points for this type (1-100)
- **Input Type**: How users interact (single_select, text_input, etc.)
- **Evaluation Type**: How answers are scored (exact, fuzzy, etc.)
- **Usage Count**: How many quizzes use this type

## Integration Points

### When Creating a Quiz
1. Open AdminQuizBuilder
2. Click "Select Type" to choose quiz type
3. TypeSelectorModal appears
4. Types organized by category with descriptions
5. Click type to select
6. Form fields change based on type schema

### For Developers
See `QUIZ_TYPES_MANAGEMENT_SYSTEM.md` for:
- Complete API documentation
- Firestore schema
- Component architecture
- Integration examples
- Security guidelines

## Statistics Dashboard

The admin tab shows real-time stats:
- **Total Types**: Count of all types (active + inactive)
- **Active Types**: Count of usable types
- **Categories**: Count of different categories (Basic, Intermediate, Advanced)

Stats update automatically when you add/edit/delete types.

## Common Workflows

### Disable a Broken Type
```
1. Find type in list
2. Click "Disable" button
3. Type marked as Inactive (red badge)
4. Won't appear when creating new quizzes
5. Existing quizzes using it still work
```

### Create a New Type
```
1. Click "+ Add New Type"
2. Fill form with type details
3. Important: Type ID must be unique & uppercase
4. Set category & complexity
5. Choose input type (how users answer)
6. Set evaluation type (how scoring works)
7. Save
8. Immediately available for new quizzes
```

### Make a Type Unavailable Temporarily
```
Option 1: Disable (Soft Delete)
- Click "Disable" button
- Type can be re-enabled anytime
- No data loss

Option 2: Delete (Hard Delete)
- Only available for custom types
- Permanent removal
- Existing quizzes unaffected
```

## Troubleshooting

**Q: Can I delete system types?**
A: No, only disable them. System types are protected.

**Q: What happens to quizzes using a disabled type?**
A: They continue to work. Only new quiz creation is blocked.

**Q: Can I change a type's ID after creating it?**
A: No, ID is locked once created (acts as unique key).

**Q: Will usage counts update automatically?**
A: Yes, they increment when quizzes using that type are created.

**Q: Can I see which quizzes use a specific type?**
A: Not in current UI - feature for future enhancement.

## Key Advantages

✅ **No Code Deployment** - Add/edit types without redeploying
✅ **Real-time Updates** - Changes sync immediately
✅ **Safe Defaults** - System types protected from deletion
✅ **Flexible** - Create custom types for specific needs
✅ **Organized** - Types grouped by difficulty level
✅ **Trackable** - See usage metrics for each type
✅ **Visual** - Icons and colors help identification
✅ **Documented** - Each type has label, description, metadata

## Next Steps

1. **Explore Current Types** - View all 14 default types
2. **Try Adding** - Create a test custom type
3. **Check Integration** - Create a quiz and select types
4. **Monitor Usage** - Watch usage counts as quizzes are created

---

**For Technical Details**: See `QUIZ_TYPES_MANAGEMENT_SYSTEM.md`
**For Architecture**: See `QUIZ_TYPE_ARCHITECTURE.md`
**Status**: ✅ Production Ready | ✅ Build Passing | ✅ Fully Integrated
