# 🔍 Table Filter Quick Reference

## Access the Filters

**Route**: `/admin/cloudinary` → **Tab**: "🖼️ All Images" → **Section**: "🔍 Advanced Filters"

## Filter Cheat Sheet

| Field | What It Does | Example |
|-------|-------------|---------|
| 🏷️ **Filename** | Search by original filename | `puzzle` → finds puzzle-001.png, puzzle-002.png |
| 🔗 **Image ID/URL** | Search by Cloudinary ID or URL | `cld123` or `v1234567` |
| 📍 **Source** | Filter by hosting location | Select: ☁️ Cloudinary, 🔥 Firebase, 🌐 External |
| 📅 **From Date** | Start of date range | 2024-12-15 |
| 📅 **To Date** | End of date range | 2024-12-31 |
| 📊 **Min Usage** | Show images used N+ times | 2 → finds duplicates |
| 📊 **Max Usage** | Show images used max N times | 1 → finds unique images |

## Common Recipes

### Recipe 1: Find Duplicates
```
Min Usage: 2
[Everything else empty]
→ Shows all images used 2+ times
```

### Recipe 2: Find Unused Images
```
Max Usage: 0
[Everything else empty]
→ Shows images not currently used
```

### Recipe 3: Show Firebase Only
```
Source: 🔥 Firebase
[Everything else empty]
→ Shows all Firebase-hosted images
```

### Recipe 4: Date Range Query
```
Upload Date From: 2024-12-01
Upload Date To: 2024-12-31
[Everything else empty]
→ Shows all December 2024 images
```

### Recipe 5: Find "Category" Images
```
Original Filename: category
[Everything else empty]
→ Shows all files with "category" in name
```

### Recipe 6: Combined: Firebase Duplicates
```
Source: 🔥 Firebase
Min Usage: 2
[Everything else empty]
→ Shows Firebase images used multiple times
```

## Tips

💡 **All filters use AND logic** - leave empty to skip that filter
💡 **Case-insensitive** - search works regardless of capitalization
💡 **Real-time results** - counter shows "Found X of Y images"
💡 **Reset All button** - quick way to start over
💡 **Click results** - preview any image after filtering

## Keyboard Shortcuts

- **Tab** through input fields
- **Enter** in date field to apply
- Type to search (no special syntax needed)

## Filter Logic

```
Show image IF:
  (filename matches) AND
  (imageId matches) AND
  (source matches or source is empty) AND
  (uploadDate >= from OR from is empty) AND
  (uploadDate <= to OR to is empty) AND
  (usageCount >= min OR min is empty) AND
  (usageCount <= max OR max is empty)
```

## Result Actions

After filtering, you can:
- **Click image URL** → Preview image with full details
- **Copy URL** → From preview modal
- **Open in new tab** → Verify image is accessible
- **See usage locations** → Where image is used
- **Go to Deduplication** → Consolidate duplicates

## Result Counter Examples

| Counter | Meaning |
|---------|---------|
| Found 45 of 90 images | 45 match filters, 90 total exist |
| Found 0 of 90 images | No images match your filters |
| Found 90 of 90 images | All images match (filters not applied) |

## Troubleshooting Quick Fixes

**Q: No results?**
- A: Click "Reset All" and try simpler filter

**Q: Too many results?**
- A: Add more filter criteria to narrow down

**Q: Can't find by URL?**
- A: Try using **Image ID/URL** field with part of the URL

**Q: Want exact usage count?**
- A: Set Min Usage = N and Max Usage = N

---

**Pro Tip**: Use filename + date filters together to find images from specific uploads!

**Next Step**: Preview filtered images, then go to `/admin/image-deduplication` to consolidate duplicates.
