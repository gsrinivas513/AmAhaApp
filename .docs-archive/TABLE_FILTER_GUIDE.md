# Image Table Filter Guide

## Overview
The CloudinaryImageManager table now includes advanced filtering capabilities to help you find and manage images efficiently.

## Where to Access
Navigate to: **Admin Panel → 🖼️ Cloudinary Image Manager → All Images Tab**

## Available Filters

### 1. **Original Filename**
- **What it does:** Filter images by their original filename
- **Example:** Type `puzzle` to find all images with "puzzle" in the filename
- **Use case:** Find images uploaded with specific naming conventions

### 2. **Image ID / URL**
- **What it does:** Search by Cloudinary ID or image URL
- **Example:** Type `cloudinary-id` or part of a URL
- **Use case:** Locate specific images when you have their ID or URL

### 3. **Source**
- **What it does:** Filter by where the image is hosted
- **Options:**
  - ☁️ **Cloudinary** - Hosted on CDN
  - 🔥 **Firebase** - Hosted on Firebase Storage
  - 🌐 **External** - External URLs
- **Use case:** Find all Firebase images to migrate to Cloudinary

### 4. **Upload Date From**
- **What it does:** Show only images uploaded after this date
- **Format:** YYYY-MM-DD
- **Use case:** Find recently added images or images from a specific period

### 5. **Upload Date To**
- **What it does:** Show only images uploaded before this date
- **Format:** YYYY-MM-DD
- **Use case:** Find older images or images from a specific date range

### 6. **Min Usage**
- **What it does:** Show only images used at least this many times
- **Example:** Enter `2` to find images used 2+ times (potential duplicates)
- **Use case:** Identify heavily reused images

### 7. **Max Usage**
- **What it does:** Show only images used at most this many times
- **Example:** Enter `1` to find images used only once
- **Use case:** Find unique images or potential unused images

## Common Filter Scenarios

### 📌 Find Duplicate Images
1. Set **Min Usage** = 2
2. View all images used multiple times
3. Use Image ID filter to focus on specific duplicates

### 🔄 Migrate Firebase Images to Cloudinary
1. Set **Source** = 🔥 Firebase
2. Review all Firebase-hosted images
3. Re-upload to Cloudinary and update references

### 📅 Review Images from a Date Range
1. Set **Upload Date From** = Start date
2. Set **Upload Date To** = End date
3. View images uploaded in that period

### 🎯 Find Recently Added Images
1. Set **Upload Date From** = Recent date (e.g., today or last week)
2. Leave other filters empty
3. View newly uploaded images

### 🔍 Search by Filename Pattern
1. Enter partial filename in **Original Filename** field
2. Example: `category` to find category-related images
3. System performs case-insensitive search

## Filter Behavior

### **AND Logic**
- All active filters work together with AND logic
- Example: If you set Source = Cloudinary AND Min Usage = 2, you'll see Cloudinary images used 2+ times
- Leave a filter empty to exclude it from the search

### **Reset Filters**
- Click the **Reset All** button to clear all filters at once
- This shows all images again

### **Real-time Results**
- Filters apply instantly as you type
- The counter shows: **Found X of Y images**

## Image Preview

After filtering, click any **Image ID / URL** to:
- ✅ Preview the actual image
- ✅ Copy the full URL
- ✅ See metadata (filename, source, upload date)
- ✅ View where it's used in the app
- ✅ Open in new tab to verify accessibility

## Tips & Tricks

1. **Start Broad, Then Narrow**
   - First filter by Source to see what you're working with
   - Then add more specific filters

2. **Use Usage Filters for Cleanup**
   - Min Usage = 2 to find consolidation candidates
   - Max Usage = 0 to find unused images

3. **Combine Date & Filename**
   - Filter by date range and filename to find specific uploads

4. **Preview Before Acting**
   - Always click to preview images before consolidating or deleting

## Example Workflows

### Workflow 1: Find & Consolidate Duplicates
```
1. Set Min Usage = 2
2. Click an image to preview
3. Note similar images with different URLs
4. Go to /admin/image-deduplication
5. Consolidate the duplicates
```

### Workflow 2: Audit Firebase Images
```
1. Set Source = Firebase
2. Preview each image to verify it's accessible
3. If accessible, re-upload to Cloudinary
4. Update references in database
5. Delete from Firebase once migrated
```

### Workflow 3: Clean Up Old Images
```
1. Set Upload Date To = 6 months ago
2. Review images from that period
3. Check if they're still being used
4. Delete unused images to reduce costs
```

## Troubleshooting

**Q: No images appear after filtering**
- A: Your filter criteria are too specific. Click **Reset All** and try again.

**Q: Can't find an image by URL**
- A: Try the **Image ID** field instead. Or use partial URL in the search.

**Q: Want to see images used exactly N times**
- A: Set Min Usage = N and Max Usage = N

## Related Features

- **Image Deduplication Panel**: `/admin/image-deduplication`
- **Image Preview Modal**: Click any image URL to preview
- **Export Data**: Use the "Export" button to download all image data as JSON
