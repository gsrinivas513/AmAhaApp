# Puzzle Template Manager - Visual Guide

## Access & Navigation

```
Admin Dashboard (/admin/modern-dashboard)
        ↓
   [🧩 Manage Puzzles Section]
        ↓
    [3 Buttons in header]
    ├─ ➕ Add New Puzzle
    ├─ 📤 Bulk Import
    └─ 📋 Puzzle Templates ← CLICK HERE
        ↓
  [PuzzleTemplateModal Opens]
```

## Template Manager Modal Layout

```
┌─────────────────────────────────────────────────────────┐
│  📋 Puzzle Templates                          [✕ Close]  │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  [Success/Error Message Area - if any]                  │
│                                                           │
│  ┌─────────────────────────────────────────────────────┐ │
│  │  Create/Edit Template Form (if shown)               │ │
│  │  ├─ Template Name: [_______________]                │ │
│  │  ├─ Description: [_______________]                  │ │
│  │  ├─ Add Items:                                      │ │
│  │  │  [Item Input] [Add Item Button]                  │ │
│  │  │                                                   │ │
│  │  │  Items: [Item1] [Item2] [Item3] [Item4]          │ │
│  │  │         [×]     [×]     [×]     [×]              │ │
│  │  │                                                   │ │
│  │  └─ [Cancel] [Create/Update Template]               │ │
│  └─────────────────────────────────────────────────────┘ │
│                                                           │
│  [➕ Create New Template] (if form hidden)               │
│                                                           │
│  ┌─────────────────────────────────────────────────────┐ │
│  │  Templates (X total)                                │ │
│  │                                                      │ │
│  │  ┌──────────────────────────────────────────────┐   │ │
│  │  │ 📅 Days of Week                  [Built-in] │   │ │
│  │  │ Monday through Sunday                        │   │ │
│  │  │ [Monday] [Tuesday] [Wednesday] ... +1 more  │   │ │
│  │  │                              [✓ Read-only]  │   │ │
│  │  └──────────────────────────────────────────────┘   │ │
│  │                                                      │ │
│  │  ┌──────────────────────────────────────────────┐   │ │
│  │  │ 🗓️ Months of Year                [Built-in] │   │ │
│  │  │ January through December                     │   │ │
│  │  │ [Jan] [Feb] [Mar] ... +9 more               │   │ │
│  │  │                              [✓ Read-only]  │   │ │
│  │  └──────────────────────────────────────────────┘   │ │
│  │                                                      │ │
│  │  ┌──────────────────────────────────────────────┐   │ │
│  │  │ 🌍 Seasons                       [Built-in] │   │ │
│  │  │ Spring, Summer, Fall, Winter                 │   │ │
│  │  │ [Spring] [Summer] [Fall] [Winter]            │   │ │
│  │  │                              [✓ Read-only]  │   │ │
│  │  └──────────────────────────────────────────────┘   │ │
│  │                                                      │ │
│  │  ┌──────────────────────────────────────────────┐   │ │
│  │  │ 🔤 Alphabet (A-Z)                 [Built-in]│   │ │
│  │  │ Letters in order                             │   │ │
│  │  │ [A] [B] [C] [D] ... +22 more                 │   │ │
│  │  │                              [✓ Read-only]  │   │ │
│  │  └──────────────────────────────────────────────┘   │ │
│  │                                                      │ │
│  │  ┌──────────────────────────────────────────────┐   │ │
│  │  │ 📝 Countries (Custom)                         │   │ │
│  │  │ List of all countries                        │   │ │
│  │  │ [France] [Germany] [Spain] ... +5 more      │   │ │
│  │  │          [✏️ Edit]  [🗑️ Delete]              │   │ │
│  │  └──────────────────────────────────────────────┘   │ │
│  │                                                      │ │
│  └─────────────────────────────────────────────────────┘ │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

## Puzzle Edit Modal - Template Section

```
┌─────────────────────────────────────────────────────────┐
│  ✏️ Edit Puzzle: Number Sequence            [✕ Close]   │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  [Basic Fields: Title, Type, Audience, Difficulty]     │
│                                                           │
│  ┌─────────────────────────────────────────────────────┐ │
│  │  🔢 Sequence/Ordering Configuration                │ │
│  │                                                      │ │
│  │  Quick Templates:                                  │ │
│  │  [📅 Days] [🗓️ Months] [🌍 Seasons] [🔤 Alphabet] │ │
│  │                                                      │ │
│  │  Custom Templates:                                 │ │
│  │  [📝 Countries] [📝 Planets] [📝 Colors]           │ │
│  │                                                      │ │
│  │  Generate Numbers:                                 │ │
│  │  [Maximum: ____] [Generate]                        │ │
│  │                                                      │ │
│  │  Items (N): [Tag1] [Tag2] [Tag3] ...               │ │
│  │                                                      │ │
│  └─────────────────────────────────────────────────────┘ │
│                                                           │
│  [Cancel] [Save Changes]                                │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

## Workflow: Create New Template

```
Admin clicks "Puzzle Templates"
         ↓
Modal opens showing existing templates
         ↓
Admin clicks "Create New Template"
         ↓
Form appears with:
├─ Template Name input
├─ Description input
├─ Item input + Add button
└─ Items list (with remove buttons)
         ↓
Admin enters: "Planets"
Description: "Planets of the Solar System"
         ↓
Admin adds items (press Enter after each):
├─ Mercury
├─ Venus
├─ Earth
├─ Mars
├─ Jupiter
├─ Saturn
├─ Uranus
└─ Neptune
         ↓
Admin clicks "Create Template"
         ↓
Success message: "✓ Template created successfully!"
         ↓
Template appears in list with:
├─ Name: Planets
├─ Items preview: [Mercury] [Venus] [Earth] ... +5 more
└─ Buttons: [✏️ Edit] [🗑️ Delete]
```

## Workflow: Use Template in Puzzle

```
Create Ordering Puzzle
         ↓
Type = "Ordering"
         ↓
See template options:
├─ Built-in:
│  ├─ 📅 Days
│  ├─ 🗓️ Months
│  ├─ 🌍 Seasons
│  └─ 🔤 Alphabet
│
└─ Custom:
   ├─ 📝 Countries
   ├─ 📝 Planets
   └─ 📝 Colors
         ↓
Admin clicks "📝 Planets"
         ↓
Items automatically populated:
Items: [Mercury] [Venus] [Earth] [Mars] [Jupiter] [Saturn] [Uranus] [Neptune]
         ↓
Puzzle saved with:
├─ itemType: "Planets"
├─ items: [...all 8 planets...]
└─ correctOrder: [0, 1, 2, 3, 4, 5, 6, 7]
         ↓
Player sees shuffled planets to arrange
```

## Color Coding

| Element | Color | Meaning |
|---------|-------|---------|
| Built-in badge | Primary accent | Cannot be modified |
| Custom template button | Primary accent | Editable template |
| Edit button | Accent primary | Modify custom template |
| Delete button | Red (#FF6B6B) | Remove custom template |
| Item tags | Light accent | Individual items |
| Create button | Gradient (accent colors) | Primary action |

## States & Indicators

### Built-in Template
```
┌──────────────────┐
│ 📅 Days of Week  │
│ [Built-in]       │  ← Indicator
│ 7 items          │
│ [✓ Read-only]    │  ← Action indicator
└──────────────────┘
```

### Custom Template
```
┌──────────────────┐
│ 📝 Countries     │
│ X items          │
│ [✏️] [🗑️]        │  ← Editable
└──────────────────┘
```

### No Templates
```
┌─────────────────────────────────┐
│ ⏳ Loading Templates...          │
│ (or)                            │
│ No templates available          │
└─────────────────────────────────┘
```

## Success/Error Messages

### Success
```
┌────────────────────────────────────────┐
│ ✓ Template created successfully!       │
│ ✓ Template updated successfully!       │
│ ✓ Template deleted successfully!       │
└────────────────────────────────────────┘
```

### Error
```
┌────────────────────────────────────────┐
│ ✗ Template name is required            │
│ ✗ Please add at least one item         │
│ ✗ Cannot delete built-in templates     │
│ ✗ Error saving template: [error]       │
└────────────────────────────────────────┘
```

## Button Locations

### In Admin Dashboard (Manage Puzzles section)
```
Header Row:
[➕ Add New Puzzle] [📤 Bulk Import] [📋 Puzzle Templates] ← NEW
```

### In Puzzle Edit Modal (for Ordering puzzles)
```
Below Difficulty field:
┌─ 🔢 Sequence/Ordering Configuration
├─ [📅 Days] [🗓️ Months] [🌍 Seasons] [🔤 Alphabet]
├─ [📝 Countries] [📝 Planets] [📝 Colors] ...
├─ Generate Numbers: [Max: ____] [Generate]
└─ Items: [Preview of selected items]
```

## Tips for Admins

1. **Template Naming**: Use clear, descriptive names (e.g., "Planets" not "P")
2. **Item Order**: Items maintain order - first item is position 1
3. **Template Sharing**: All templates are global - shared with all admins
4. **Editing**: You can edit custom templates any time, built-in ones are locked
5. **Reuse**: Create once, use multiple times in different puzzles
6. **Deletion**: Delete carefully - removing a template doesn't affect existing puzzles using it
