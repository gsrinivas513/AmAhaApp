# Puzzle Template Manager - Complete Feature Guide

## Overview
The Puzzle Template Manager allows admins to create, manage, and apply templates for ordering/sequencing puzzles. Templates are pre-defined sets of items that can be quickly applied when creating or editing puzzles.

## Features

### 1. **Built-in Templates** (4 templates - Read-only)
- 📅 **Days of Week**: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday
- 🗓️ **Months of Year**: January through December
- 🌍 **Seasons**: Spring, Summer, Fall, Winter
- 🔤 **Alphabet**: A through Z

### 2. **Custom Templates** (Firestore-backed - Editable)
- Create new templates with custom items
- Edit existing templates (except built-in ones)
- Delete custom templates
- Full CRUD operations via Firebase

### 3. **Template Manager Modal**
Located at: `src/admin/modals/PuzzleTemplateModal.jsx`

**Access:**
1. Go to Admin Dashboard (`/admin/modern-dashboard`)
2. Click "🧩 Manage Puzzles" section
3. Click **"📋 Puzzle Templates"** button

**Features:**
- View all templates (built-in + custom)
- Create new templates with:
  - Template name
  - Description
  - Multiple items (add/remove individually)
- Edit custom templates
- Delete custom templates
- Items preview showing first 8 items + count of remaining

### 4. **Puzzle Creation/Edit Integration**
The templates are available when creating and editing ordering puzzles:

**In Puzzle Creation:**
- Quick template buttons (Days, Months, Seasons, Alphabet)
- Custom templates list from Firestore
- Number generator (for numeric sequences)

**In Puzzle Edit Modal:**
- Same template options as creation
- Pre-loads existing puzzle data
- Modify items and re-save

## How It Works

### Creating a Template
1. Click **"📋 Puzzle Templates"** button in Manage Puzzles
2. Click **"➕ Create New Template"**
3. Fill in:
   - Template name (e.g., "Countries", "Planets")
   - Description (e.g., "List of all countries")
   - Add items one by one (press Enter or click "Add Item")
4. Click **"➕ Create Template"**
5. Template is saved to Firestore and available for use

### Using a Template
1. When creating/editing an ordering puzzle:
   - Click the template button from quick templates or custom list
   - All items from template are loaded
   - Items are shuffled for the player
2. Template name is stored as `itemType` in puzzle data
3. Items array contains all template items

### Data Structure

**Firestore Collection: `puzzleTemplates`**
```javascript
{
  id: "auto-generated",
  name: "Countries",
  description: "List of all countries",
  items: ["France", "Germany", "Spain", ...],
  createdAt: "2025-01-31T10:30:00Z",
  updatedAt: "2025-01-31T10:30:00Z"
}
```

**Puzzle Data (when using template):**
```javascript
{
  type: "Ordering",
  data: {
    itemType: "Countries",  // Template name
    items: [...],            // Template items
    correctOrder: [0, 1, 2, ...],  // Order indices
    numberRanges: [],        // For level filtering (if applicable)
    levels: []               // For level filtering (if applicable)
  }
}
```

## File Locations

| Component | Path |
|-----------|------|
| Template Modal | `src/admin/modals/PuzzleTemplateModal.jsx` |
| Edit Modal (Updated) | `src/admin/modals/PuzzleEditModal.jsx` |
| Admin Dashboard (Updated) | `src/admin/ModernAdminDashboard.jsx` |

## API Endpoints

### Load Templates
```javascript
const snapshot = await getDocs(collection(db, 'puzzleTemplates'));
```

### Create Template
```javascript
await addDoc(collection(db, 'puzzleTemplates'), {
  name, description, items, createdAt, updatedAt
});
```

### Update Template
```javascript
await updateDoc(doc(db, 'puzzleTemplates', templateId), {
  name, description, items, updatedAt
});
```

### Delete Template
```javascript
await deleteDoc(doc(db, 'puzzleTemplates', templateId));
```

## User Workflows

### Admin Workflow
```
Admin Dashboard
  ↓
Click "Manage Puzzles"
  ↓
Click "Puzzle Templates" button
  ↓
Create/Edit/Delete Templates
  ↓
(Optionally) Use template when creating puzzle
```

### Puzzle Creation Workflow
```
Create Ordering Puzzle
  ↓
Select template (quick or custom)
  ↓
Items automatically loaded
  ↓
(Optional) Customize items further
  ↓
Save puzzle
```

## Visibility & Display

**In Template Manager Modal:**
- Built-in templates: Show "Built-in" badge, read-only
- Custom templates: Show "Edit" and "Delete" buttons
- Each template card shows:
  - Name and description
  - First 8 items with preview
  - Count of remaining items
  - Edit/Delete actions

**In Puzzle Creation/Edit:**
- Built-in templates: Displayed as button row
- Custom templates: Displayed as grid of buttons
- Item icons:
  - 📅 Days
  - 🗓️ Months
  - 🌍 Seasons
  - 🔤 Alphabet
  - 📝 Custom templates

## Limitations & Notes

1. Built-in templates (Days, Months, Seasons, Alphabet) cannot be deleted or modified
2. Templates are shared across all users (stored in Firestore)
3. Custom template names should be unique for clarity
4. Items are stored as simple strings - no emoji/formatting in item itself
5. Templates are loaded when modal opens - add caching if performance needed
6. Custom templates appear with 📝 emoji icon for visual distinction

## Future Enhancements

- [ ] Bulk import templates from CSV
- [ ] Export templates as JSON/CSV
- [ ] Template categories/tags
- [ ] Template usage statistics (which templates are used most)
- [ ] Template versioning/history
- [ ] Share templates between admin users
- [ ] Pre-made template library
- [ ] Template icons/emoji customization
- [ ] Duplicate template functionality
- [ ] Template search/filter
