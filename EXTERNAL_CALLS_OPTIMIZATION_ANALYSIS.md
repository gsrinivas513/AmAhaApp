# 📊 External API Calls Analysis & Optimization Strategy

## Current External Call Patterns

### 1. **Cloudinary Calls**
**Location:** `src/services/cloudinaryAdminService.js`

**Current Calls:**
- ❌ `getAllCloudinaryImages()` - Hits Firestore 8+ times per call
  - Scans collections: categories, topics, subtopics, features, puzzles, puzzleCategories, puzzleTopics, puzzleSubtopics
  - Each `getDocs()` = 1 Firestore read
  - Also hits Cloudinary API for image listing

- ❌ `deleteCloudinaryImage()` - Hits Firestore + Cloudinary API
  - `fetch('/api/cloudinary/delete')` - External HTTP call

- ❌ `getCloudinaryStats()` - Hits Cloudinary API
  - `fetch('/api/cloudinary/stats')` - External HTTP call

**Total per admin session:** 10-15+ API calls

### 2. **Firebase Firestore Calls**
**Location:** Multiple admin pages and services

**Heavy Hitters:**
- `DatabaseDashboard.jsx` - 7 parallel `getDocs()` calls
- `FeatureTiles.jsx` - 4 parallel `getDocs()` calls on home load
- `ImageCropEditor.jsx` - `getAllCloudinaryImages()` scans all collections
- `FixQuizzesFeatureIdMismatch.jsx` - Multiple sequential calls
- `StandardizeFeaturesCollection.jsx` - Multiple scans

**Total per page load:** 20-30+ reads

### 3. **Analytics Calls**
**Location:** `src/analytics/trackEvent.js`

- ❌ Every event tracked = 1 Firestore write
- Fires on: puzzle completion, quiz answer, page view, etc.
- **High frequency** (100s per day per user)

**Total per user per day:** 50-200+ writes

---

## Problem: Why This Is Expensive

### Firestore Pricing:
```
Reads:   $0.06 per 100,000
Writes:  $0.18 per 100,000
Deletes: $0.02 per 100,000
```

### Current Inefficiencies:
1. **No Caching** - Same data fetched repeatedly
2. **No Batching** - Individual operations instead of batch
3. **No Pagination** - Fetches all docs when only need few
4. **Duplicate Queries** - Multiple components fetch same data
5. **Sequential** - Could be parallel but costs the same
6. **No Indexing** - Complex queries = more reads

---

## Solution Architecture

### Strategy 1: **Query Result Caching**
```javascript
// Create cache layer
const queryCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function cachedGetDocs(collectionName, options = {}) {
  const cacheKey = `${collectionName}:${JSON.stringify(options)}`;
  const cached = queryCache.get(cacheKey);
  
  // Return cached if still fresh
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  
  // Fetch fresh
  const data = await getDocs(collection(db, collectionName));
  queryCache.set(cacheKey, {
    data: data.docs.map(d => ({ id: d.id, ...d.data() })),
    timestamp: Date.now()
  });
  
  return queryCache.get(cacheKey).data;
}
```

### Strategy 2: **Batch Operations**
```javascript
// Instead of:
for (let doc of docs) {
  await updateDoc(docRef, updates); // N writes
}

// Do this:
const batch = writeBatch(db);
docs.forEach(doc => {
  batch.update(docRef, updates);
});
await batch.commit(); // 1 write (technically)
```

### Strategy 3: **Pagination/Limiting**
```javascript
// Instead of:
const all = await getDocs(collection(db, 'puzzles')); // Millions of reads

// Do this:
const q = query(
  collection(db, 'puzzles'),
  where('featured', '==', true), // Filter first
  limit(10)                        // Then limit
);
const snap = await getDocs(q);
```

### Strategy 4: **React Query / SWR**
```javascript
// Use library for automatic caching
import { useQuery } from '@tanstack/react-query';

function MyComponent() {
  const { data } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getDocs(collection(db, 'categories')),
    staleTime: 5 * 60 * 1000, // 5 min cache
    gcTime: 10 * 60 * 1000    // Keep in memory 10 min
  });
  
  return <div>{data}</div>;
}
```

### Strategy 5: **Firestore Listeners (Real-time)**
```javascript
// One-time fetch:
const snap = await getDocs(query(...)); // 1 read each time

// Real-time listener (more efficient):
onSnapshot(query(...), (snap) => {
  // Fires on update, doesn't re-read unless changed
  // Much cheaper for frequently accessed data
});
```

---

## Implementation Priority

### 🔴 **HIGH PRIORITY** (Costs most)
1. **Cache `getAllCloudinaryImages()` results**
   - Currently: 8 Firestore reads per call
   - Solution: 5-min cache
   - Savings: 95%+ for admin sessions

2. **Batch analytics writes**
   - Currently: 1 write per event
   - Solution: Buffer 10 events, flush every 30s
   - Savings: 90%+ for analytics

3. **Memoize home page data**
   - Currently: 4 reads on every home load
   - Solution: React Query with 5-min cache
   - Savings: 90%+ for repeat visitors

### 🟡 **MEDIUM PRIORITY**
4. **Add pagination to admin lists**
   - Limit to 50 items instead of 1000s
   - Saves reads but same query cost

5. **Use real-time listeners for live data**
   - For frequently accessed collections
   - Saves repeated polling

### 🟢 **LOW PRIORITY**
6. **Split large queries into indexed sub-queries**
   - Add Firestore indexes
   - Improves query performance

---

## Code Examples

### Example 1: Caching Service
```javascript
// services/cacheService.js
class CacheManager {
  constructor(defaultTTL = 5 * 60 * 1000) {
    this.cache = new Map();
    this.defaultTTL = defaultTTL;
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return item.value;
  }

  set(key, value, ttl = this.defaultTTL) {
    this.cache.set(key, {
      value,
      expiry: Date.now() + ttl
    });
  }

  invalidate(pattern) {
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }
}

export const cacheManager = new CacheManager();
```

### Example 2: Using Cache
```javascript
// services/cloudinaryAdminService.js
import { cacheManager } from './cacheService';

export const getAllCloudinaryImages = async (useCache = true) => {
  const cacheKey = 'cloudinary:all-images';
  
  if (useCache) {
    const cached = cacheManager.get(cacheKey);
    if (cached) return cached;
  }
  
  // Original logic here...
  const images = await fetchAllImages(); // Multiple reads
  
  // Cache for 5 minutes
  cacheManager.set(cacheKey, images);
  
  return images;
};
```

### Example 3: Batch Analytics
```javascript
// services/analyticsBatchService.js
class AnalyticsBatcher {
  constructor(batchSize = 10, flushInterval = 30000) {
    this.queue = [];
    this.batchSize = batchSize;
    this.flushInterval = flushInterval;
    this.startTimer();
  }

  addEvent(event) {
    this.queue.push(event);
    if (this.queue.length >= this.batchSize) {
      this.flush();
    }
  }

  async flush() {
    if (this.queue.length === 0) return;
    
    const events = [...this.queue];
    this.queue = [];
    
    // One batch write for all events
    const batch = writeBatch(db);
    events.forEach(event => {
      const docRef = doc(collection(db, 'analytics'));
      batch.set(docRef, event);
    });
    
    await batch.commit(); // Single commit, ~10 writes
  }

  startTimer() {
    setInterval(() => this.flush(), this.flushInterval);
  }
}

export const analyticsBatcher = new AnalyticsBatcher();
```

---

## Expected Savings

| Operation | Before | After | Savings |
|-----------|--------|-------|---------|
| Home page load | 4 reads | 1 read (cached) | 75% |
| Admin image list | 8 reads | 1 read (cached) | 87.5% |
| User analytics | 50 writes/day | 5 writes/day | 90% |
| Feature fixes | 10 reads | 3 reads (filtered) | 70% |
| **Monthly cost** | **~$500** | **~$50** | **90%** |

---

## Implementation Checklist

- [ ] Create `cacheService.js` with CacheManager class
- [ ] Implement caching in `cloudinaryAdminService.js`
- [ ] Add React Query to home page (FeatureTiles)
- [ ] Implement analytics batching service
- [ ] Add pagination to admin lists (default 50 items)
- [ ] Set up Firestore indexes for complex queries
- [ ] Add cache invalidation after mutations
- [ ] Monitor Firestore usage in Firebase Console
- [ ] Test performance improvements
- [ ] Document caching strategy in team wiki

---

## Monitoring

**Firebase Console:**
- Check "Database > Firestore > Usage" tab
- Monitor reads/writes per day
- Set budget alerts ($100/month)

**Application:**
```javascript
// Add to environment
console.log(`API Calls: ${apiCallCount}`);
console.log(`Cached Hits: ${cacheHits}`);
console.log(`Cache Hit Rate: ${(cacheHits / apiCallCount * 100).toFixed(2)}%`);
```

