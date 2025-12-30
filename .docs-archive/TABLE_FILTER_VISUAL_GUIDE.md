# Table Filter UI - Visual Guide

## Filter Panel Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│ 🔍 Advanced Filters                            [Reset All]          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Original Filename        Image ID / URL        Source              │
│  ┌─────────────────────┐ ┌───────────────────┐ ┌──────────────────┐│
│  │ e.g., puzzle.png    │ │ cloudinary ID      │ │ All Sources ▼    ││
│  └─────────────────────┘ └───────────────────┘ └──────────────────┘│
│                                                                     │
│  Upload Date From        Upload Date To        Min Usage            │
│  ┌─────────────────────┐ ┌───────────────────┐ ┌──────────────────┐│
│  │ YYYY-MM-DD          │ │ YYYY-MM-DD         │ │ e.g., 2          ││
│  └─────────────────────┘ └───────────────────┘ └──────────────────┘│
│                                                                     │
│  Max Usage                                                          │
│  ┌─────────────────────┐                                           │
│  │ e.g., 10            │                                           │
│  └─────────────────────┘                                           │
│                                                                     │
│  Found 45 of 90 images                                             │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## Filter Input Fields

### Text Inputs
- **Original Filename**: Case-insensitive substring search
- **Image ID / URL**: Searches both Cloudinary IDs and image URLs
- **Min/Max Usage**: Number inputs for usage count range

### Date Inputs
- **Upload Date From**: Start of date range (inclusive)
- **Upload Date To**: End of date range (inclusive, through end of day)

### Select Dropdown
- **Source**: 
  - All Sources (default)
  - ☁️ Cloudinary
  - 🔥 Firebase
  - 🌐 External

## Table After Filtering

```
┌─────────────────────┬──────────────────────┬────────┬─────────┬───────┬──────────┐
│ Original Filename   │ Image ID / URL       │ Source │ Upload  │ Usage │ Used In  │
│                     │                      │        │ Date    │       │          │
├─────────────────────┼──────────────────────┼────────┼─────────┼───────┼──────────┤
│ puzzle-001.png      │ [Click to Preview]   │ ☁️ CDN │ 12/15   │ 3x    │ 📌 ...   │
│ category-badge.png  │ [Click to Preview]   │ 🔥 FB  │ 12/10   │ 2x    │ 📌 ...   │
│ animal-lion.svg     │ [Click to Preview]   │ ☁️ CDN │ 12/20   │ 5x    │ 📌 ...   │
└─────────────────────┴──────────────────────┴────────┴─────────┴───────┴──────────┘
```

## Quick Filter Examples

### Example 1: Find Images Used Multiple Times
```
Source: All Sources
Min Usage: 2
Max Usage: (leave empty)
[Result: Shows all images used 2+ times]
```

### Example 2: Find Firebase Images
```
Source: 🔥 Firebase
(All other fields empty)
[Result: Shows all Firebase-hosted images for migration]
```

### Example 3: Recent Images from Specific Date
```
Upload Date From: 2024-12-15
Upload Date To: 2024-12-31
(All other fields empty)
[Result: Shows images uploaded in last 2 weeks of December]
```

### Example 4: Find Images by Filename Pattern
```
Original Filename: category
(All other fields empty)
[Result: Shows all files containing "category" - case insensitive]
```

### Example 5: Unused & Single-Use Images
```
Min Usage: 0
Max Usage: 1
(All other fields empty)
[Result: Shows images used 0-1 times (candidates for cleanup)]
```

## Filter Counter

At the bottom of the filter panel:
```
Found 45 of 90 images
```
- **45**: Number of images matching your current filters
- **90**: Total number of images in database

## Reset Button

Located in top-right of filter panel:
```
[Reset All]
```
- Clears all filter fields
- Shows all images again
- Counter returns to full count

## Interaction Flow

```
User enters search criteria
        ↓
Filters apply in real-time
        ↓
Table updates to show matching images
        ↓
Counter updates: "Found X of Y images"
        ↓
User can click image to preview
        ↓
Or adjust filters to refine results
        ↓
Click Reset All to start over
```

## Features

✅ **Real-time Filtering**: Changes apply instantly as you type
✅ **Multiple Filters**: Combine any filters with AND logic
✅ **Date Range**: Filter by upload date range
✅ **Usage Range**: Filter by how many times image is used
✅ **Source Filter**: Find images by hosting location
✅ **Responsive Grid**: Filters adapt to screen size
✅ **Reset All**: One-click to clear all filters
✅ **Results Counter**: See how many images match your filters
✅ **Preview Integration**: Click results to preview images

## CSS Classes Applied

- **Filter Panel**: Light background (#f8fafc) with border
- **Input Fields**: Consistent styling with border and padding
- **Labels**: Small, bold, dark gray text
- **Counter**: Gray text (12px) with bold numbers
- **Reset Button**: Subtle styling, not prominent
