# Puzzle Template Manager - Quick Start

## 🚀 Get Started in 30 Seconds

### Access Template Manager
1. Go to Admin Dashboard: `http://localhost:3000/admin/modern-dashboard`
2. Scroll to **"🧩 Manage Puzzles"** section
3. Click **"📋 Puzzle Templates"** button
4. Modal opens!

---

## 📋 What You Can Do

### View Templates
- **4 Built-in Templates** (read-only):
  - 📅 Days of Week
  - 🗓️ Months of Year
  - 🌍 Seasons
  - 🔤 Alphabet
- **Custom Templates** (create, edit, delete)

### Create a Custom Template
```
1. Click [➕ Create New Template]
2. Enter name: "Countries"
3. Enter description: "All countries"
4. Add items one by one:
   - Type item name
   - Press Enter or click [Add Item]
   - Repeat for all items
5. Click [➕ Create Template]
```

### Edit a Template
```
1. Find template in list
2. Click [✏️ Edit]
3. Modify name, description, items
4. Click [💾 Update Template]
```

### Delete a Template
```
1. Find custom template in list
2. Click [🗑️ Delete]
3. Confirm deletion
4. Template is removed
```

---

## 🧩 Using Templates in Puzzles

### When Creating a Puzzle (Type: Ordering)
```
You see template options:
├─ Quick Templates: [📅] [🗓️] [🌍] [🔤]
├─ Custom Templates: [📝] [📝] [📝] ...
└─ Number Generator: [Max: __] [Generate]

Click a template → Items automatically load!
```

### When Editing a Puzzle (Type: Ordering)
```
Same template options available
Choose template or generate numbers
Saves with puzzle
```

---

## 📊 Template Data Structure

**What gets stored in Firestore:**
```javascript
{
  name: "Countries",
  description: "All countries",
  items: ["France", "Germany", "Spain", ...],
  createdAt: "2025-01-31T10:00:00Z",
  updatedAt: "2025-01-31T10:00:00Z"
}
```

**When used in a puzzle:**
```javascript
{
  type: "Ordering",
  data: {
    itemType: "Countries",
    items: ["France", "Germany", "Spain", ...],
    correctOrder: [0, 1, 2, ...],
    levels: []  // Optional level ranges
  }
}
```

---

## 🎯 Common Tasks

### Task: Create "Planets" Template
```
1. Click [📋 Puzzle Templates]
2. Click [➕ Create New Template]
3. Name: "Planets"
4. Description: "Planets in Solar System"
5. Add items: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune
6. Click [➕ Create Template]
✓ Done! Template is ready to use
```

### Task: Use "Planets" in a Puzzle
```
1. Go to Manage Puzzles
2. Create New Puzzle (or Edit existing)
3. Set Type: "Ordering"
4. In template section, click [📝 Planets]
5. Items auto-populate
6. Save puzzle
✓ Done! Puzzle now uses template
```

### Task: Add More Countries
```
1. Click [📋 Puzzle Templates]
2. Find "Countries" template
3. Click [✏️ Edit]
4. Type new country in input
5. Press Enter to add
6. Click [💾 Update Template]
✓ Done! More countries added
```

---

## ⚙️ Features

| Feature | Built-in | Custom |
|---------|----------|--------|
| View | ✓ | ✓ |
| Create | ✗ | ✓ |
| Edit | ✗ | ✓ |
| Delete | ✗ | ✓ |
| Use in puzzles | ✓ | ✓ |
| Edit in puzzles | ✓ | ✓ |

---

## 🔒 Important Notes

1. **Built-in templates** cannot be deleted or modified
2. **Custom templates** are shared globally (all admins see them)
3. **Templates are optional** - you can still manually add items
4. **Existing puzzles** keep items even if template is deleted
5. **Order matters** - first item in template = position 1

---

## 📁 Files Modified/Created

| File | Purpose |
|------|---------|
| `src/admin/modals/PuzzleTemplateModal.jsx` | Template manager modal (NEW) |
| `src/admin/modals/PuzzleEditModal.jsx` | Updated with template support |
| `src/admin/ModernAdminDashboard.jsx` | Updated with template button |

---

## 🧪 Testing Checklist

- [ ] Template modal opens from dashboard
- [ ] Can view all 4 built-in templates
- [ ] Can create new custom template
- [ ] Custom template shows in list
- [ ] Can edit custom template
- [ ] Can delete custom template
- [ ] Template appears in puzzle creation
- [ ] Template appears in puzzle edit
- [ ] Clicking template loads items
- [ ] Puzzle saves with template data

---

## 💡 Tips

1. **Reusability**: Create once, use many times
2. **Naming**: Use clear names like "Countries" not "C"
3. **Order**: Items maintain sequence from template
4. **Sharing**: All templates visible to all admins
5. **Safety**: Built-in templates are protected

---

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| Template not showing | Check Firestore `puzzleTemplates` collection |
| Can't delete built-in | Built-in templates are locked |
| Template disappeared | May have been deleted by another admin |
| Items not loading | Try refreshing page or re-selecting template |
| Save failed | Check if template name is unique |

---

## 📞 Support

For issues with:
- **Creation/Deletion**: Check Firestore permissions
- **Display**: Check if custom templates loaded from DB
- **Performance**: Templates loaded on modal open

---

**Last Updated**: 31 Dec 2025
**Version**: 1.0
**Status**: ✓ Production Ready
