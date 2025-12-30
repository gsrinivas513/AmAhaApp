# Numbers Ordering Puzzle - Quick Reference

## 🚀 Quick Start

### For Users
1. Go to: `http://localhost:3000/puzzle/logic-puzzles/Ordering/Numbers`
2. Click a number range (e.g., "1-10")
3. Drag cards from right to left in correct order
4. Complete to see celebration! 🎉

### For Admins
1. Go to: `http://localhost:3000/admin/numbers-ordering-setup`
2. Set maximum number (default: 50)
3. Click "✅ Set Up Puzzle"
4. Done! ✨

---

## 📋 Feature Summary

| Aspect | Details |
|--------|---------|
| **Puzzle Type** | Ordering/Sequencing |
| **URL** | `/puzzle/logic-puzzles/Ordering/Numbers` |
| **Cards Per Range** | 10 cards |
| **Available Ranges** | 1-10, 11-20, 21-30, 31-40, 41-50 (configurable) |
| **Range Format** | 10 consecutive numbers |
| **Display** | 2 columns × 5 rows grid |
| **Interaction** | Drag & drop from right to left |
| **Progress** | Shows X/10 items completed |
| **Reset** | Reset button clears current range |
| **Switch Ranges** | Anytime by clicking range button |

---

## 🎯 How It Works

```
User selects "11-20"
         ↓
System filters items where: 11 ≤ number ≤ 20
         ↓
Shuffles those 10 items
         ↓
Displays in right panel:
  [17] [12] [19] [14] [11]
  [20] [15] [13] [18] [16]
         ↓
User drags to left panel in order:
  Position 1:  11
  Position 2:  12
  Position 3:  13
  Position 4:  14
  Position 5:  15
  Position 6:  16
  Position 7:  17
  Position 8:  18
  Position 9:  19
  Position 10: 20
         ↓
✅ Puzzle Complete!
```

---

## 🛠️ Setup Methods

### Method 1: Admin UI (Easiest)
```
URL: /admin/numbers-ordering-setup
- Set max number
- Click button
- Done!
```

### Method 2: Test Puzzles Page
```
URL: /admin/create-test-puzzles
- Click "Create Test Puzzles"
- Includes Numbers puzzle with 1-50
```

### Method 3: Script
```bash
node updateNumbersPuzzle.mjs
```

---

## 🔧 Configuration

### Increase Maximum Range
1. Admin panel → `/admin/numbers-ordering-setup`
2. Change max from 50 to desired number
3. System auto-creates ranges (e.g., 1-100 creates 10 ranges)

### Data Structure
```javascript
{
  maxRange: 50,
  numberRanges: [
    { label: "1-10", min: 1, max: 10 },
    { label: "11-20", min: 11, max: 20 },
    // ... etc
  ],
  items: [
    { id: "num-1", number: 1, label: "1", image: "..." },
    { id: "num-2", number: 2, label: "2", image: "..." },
    // ... 50 items
  ]
}
```

---

## 📊 Statistics

- ✅ **Puzzle Items**: 50 (configurable)
- ✅ **Available Ranges**: 5 (for 1-50)
- ✅ **Cards Per Range**: 10 (fixed)
- ✅ **Grid Layout**: 2×5 (2 columns, 5 rows)
- ✅ **Shuffle**: Random order each time

---

## 🎨 UI Components

### Range Buttons
```
[1-10] [11-20] [21-30] [31-40] [41-50]
```
- Highlight active range
- Click to switch
- Clear visual feedback

### Left Panel (Sequence Area)
- Drop zone for ordered cards
- Shows progress: "0/10" → "10/10"
- Each card shows position number (1, 2, 3...)

### Right Panel (Items Area)
- Grid of 10 jumbled cards
- Each card shows number
- Draggable with cursor feedback
- Remove button (×) if needed

### Controls
- 📋 Rules: View game instructions
- 🔄 Reset: Clear current sequence
- Progress indicator: Shows completion

---

## ✨ Features Checklist

- ✅ 10 cards per range
- ✅ Configurable ranges
- ✅ Drag & drop interface
- ✅ Range selection buttons
- ✅ Progress tracking
- ✅ Reset functionality
- ✅ Mobile responsive
- ✅ Celebration animation
- ✅ Rules dialog
- ✅ Smooth animations

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| No puzzle appears | Run admin setup or create test puzzles |
| Cards don't shuffle | Refresh page, check console for errors |
| Can't switch ranges | Click range button, ensure puzzle is loaded |
| Wrong number of cards | Check `numberRanges` in puzzle data |
| Mobile layout broken | Check CSS media queries |

---

## 📱 Mobile Support

- ✅ Touch drag & drop works
- ✅ Responsive grid layout
- ✅ Full-screen mode available
- ✅ Buttons scaled for touch
- ✅ Progress visible on mobile

---

## 🔗 Related Links

- **Puzzle File**: `src/puzzles/renderers/OrderingPuzzle.jsx`
- **Admin Page**: `src/admin/NumbersOrderingPuzzleSetupPage.jsx`
- **Styles**: `src/styles/puzzle-renderers.css`
- **Test Puzzles**: `src/admin/CreateTestPuzzlesPage.jsx`
- **Update Script**: `updateNumbersPuzzle.mjs`
- **Full Documentation**: `NUMBERS_ORDERING_PUZZLE.md`

---

## 📞 Support

For detailed documentation, see: [NUMBERS_ORDERING_PUZZLE.md](NUMBERS_ORDERING_PUZZLE.md)
