# Adding Images to Puzzles - Complete Guide

## Overview
The puzzle system supports images in various puzzle types. Here's how to add them:

---

## 1. Find Pairs (Memory Game) Puzzles

### Data Structure
Each card in a Find Pairs puzzle needs an image URL:

```json
{
  "id": "find-pairs-colors",
  "type": "findpairs",
  "title": "Find Color Pairs",
  "data": {
    "cards": [
      {
        "id": "red-1",
        "image": "https://example.com/images/red.png",
        "emoji": "🔴"
      },
      {
        "id": "blue-1",
        "image": "https://example.com/images/blue.png",
        "emoji": "🔵"
      }
      // ... more cards
    ]
  }
}
```

### Adding Images via Firestore
When creating/updating a Find Pairs puzzle in Firestore:

```javascript
// Example: Update Find Pairs puzzle with images
const puzzle = {
  id: "find-pairs-animals",
  type: "findpairs",
  title: "Find Animal Pairs",
  data: {
    cards: [
      { id: "dog-1", image: "/images/dog.png", emoji: "🐕" },
      { id: "cat-1", image: "/images/cat.png", emoji: "🐱" },
      { id: "bird-1", image: "/images/bird.png", emoji: "🐦" },
      // ... duplicate each card for pairs
    ]
  }
};

// Save to Firestore
await firebase.firestore().collection('puzzles').doc('find-pairs-animals').set(puzzle);
```

### Image Requirements
- **Format**: PNG, JPG, WebP
- **Size**: 100x100px to 200x200px (square preferred)
- **Location**: Can be:
  - External URL (CloudStorage, Cloudinary, etc.)
  - Public image URL
  - Local `/public/images/` folder

---

## 2. Picture Shadow Puzzles

### Data Structure
```json
{
  "type": "pictureshadow",
  "data": {
    "pairs": [
      {
        "image": "https://example.com/images/apple.png",
        "shadow": "https://example.com/images/apple-shadow.png"
      }
    ]
  }
}
```

---

## 3. Visual/Grid Puzzles

### Data Structure
```json
{
  "type": "visual",
  "data": {
    "grid": [
      { "id": 1, "image": "https://example.com/image1.png" },
      { "id": 2, "image": "https://example.com/image2.png" }
    ]
  }
}
```

---

## How to Add Images - Step by Step

### Option 1: Using Cloudinary (Recommended)
1. Upload images to Cloudinary
2. Get the public URL
3. Use the URL in puzzle data:
```javascript
{
  "id": "card-1",
  "image": "https://res.cloudinary.com/yourcloud/image/upload/v123/puzzle-images/card1.png"
}
```

### Option 2: Using Local `/public` Folder
1. Add image files to `/public/images/puzzles/`
2. Reference with relative path:
```javascript
{
  "id": "card-1",
  "image": "/images/puzzles/card1.png"
}
```

### Option 3: Using Firebase Storage
1. Upload to Firebase Storage
2. Get download URL
3. Use in puzzle data:
```javascript
{
  "id": "card-1",
  "image": "https://firebasestorage.googleapis.com/b/your-bucket/o/puzzles%2Fcard1.png?..."
}
```

---

## Creating Find Pairs Puzzles with Images

### Admin Page Method
1. Go to `/admin/create-puzzle`
2. Select "Find Pairs" as puzzle type
3. Add cards with image URLs:
   - Enter image URL in the image field
   - Optionally add emoji as fallback
   - System will create pairs automatically

### Programmatic Method
```javascript
const createFindPairsPuzzle = async (puzzleData) => {
  const puzzle = {
    id: puzzleData.id,
    type: "findpairs",
    title: puzzleData.title,
    topic: puzzleData.topic,
    category: puzzleData.category,
    data: {
      cards: puzzleData.images.map(img => ({
        id: img.id,
        image: img.url,
        emoji: img.fallbackEmoji || "🎨"
      }))
    }
  };

  await firebase.firestore()
    .collection('puzzles')
    .doc(puzzle.id)
    .set(puzzle);
};
```

---

## Image Format Best Practices

### For Find Pairs Cards
- **Dimensions**: 100x100px or 150x150px
- **Format**: PNG (supports transparency) or JPG
- **File Size**: Under 50KB per image
- **Content**: Simple, clear, recognizable objects

### Color Palette
- Bright, saturated colors
- High contrast with white background
- Avoid similar-looking images for different pairs

### Example Image URLs
```
Find Color Pairs:
- /images/puzzles/color-red.png
- /images/puzzles/color-blue.png
- /images/puzzles/color-green.png

Find Animal Pairs:
- /images/puzzles/animal-dog.png
- /images/puzzles/animal-cat.png
- /images/puzzles/animal-bird.png

Find Shape Pairs:
- /images/puzzles/shape-circle.png
- /images/puzzles/shape-square.png
- /images/puzzles/shape-triangle.png
```

---

## Fallback Strategy

If an image fails to load, the system uses emoji:

```jsx
{card.image ? (
  <img 
    src={card.image} 
    alt="Card" 
    onError={(e) => {
      e.target.style.display = "none";
      e.target.parentElement.innerHTML = 
        `<span>${card.emoji || "🎨"}</span>`;
    }} 
  />
) : (
  <span>{card.emoji || "🎨"}</span>
)}
```

Always provide an emoji fallback in card data!

---

## Testing Images

### Check if images load:
1. Open puzzle in browser
2. Inspect element (F12)
3. Check Network tab for image requests
4. Verify images appear when cards flip

### Troubleshooting
- **Image not showing**: Check URL is correct and publicly accessible
- **Broken images**: Verify CORS headers allow loading
- **Wrong size**: Scale image to recommended dimensions
- **Fallback showing**: Image URL is invalid, check emoji is set

---

## Summary

| Puzzle Type | Image Field | Notes |
|-------------|-------------|-------|
| Find Pairs | `cards[].image` | Multiple pairs needed |
| Picture Shadow | `pairs[].image` | Needs shadow pair |
| Visual Grid | `grid[].image` | Grid-based layout |

**Quick Start:**
1. Prepare image URLs (Cloudinary, CloudStorage, or `/public/`)
2. Update puzzle data with image URLs
3. Add emoji fallbacks
4. Test in browser
5. Adjust sizing if needed

