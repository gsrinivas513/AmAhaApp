/**
 * imageDeduplicationService.js
 * 
 * Script to identify and consolidate duplicate images across Firestore collections
 * 
 * Problem: 192 image references but only 90 unique images (66 duplicates)
 * Solution: Replace duplicate URLs with SHARED_IMAGES constants
 * 
 * Benefits:
 * - Reduce Cloudinary API calls
 * - Save bandwidth by reusing CDN cached URLs
 * - Simplify image management
 * - Improve performance
 */

import { db } from '../firebase/firebaseConfig';
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  batch as createBatch,
  writeBatch,
} from 'firebase/firestore';
import { SHARED_IMAGES } from '../constants/SharedImages';

/**
 * ============================================================
 * STEP 1: ANALYZE DUPLICATES
 * ============================================================
 */

/**
 * Find all duplicate images in Firestore
 * Returns: Map of image URLs to their usage locations
 */
export const analyzeImageDuplicates = async () => {
  const imageMap = new Map(); // URL -> [locations]
  const collections = [
    'categories',
    'topics',
    'subtopics',
    'features',
    'puzzles',
    'puzzleCategories',
    'puzzleTopics',
    'puzzleSubtopics',
  ];

  for (const collectionName of collections) {
    const docs = await getDocs(collection(db, collectionName));
    
    docs.forEach(document => {
      const docData = document.data();
      
      // Check direct imageUrl field
      if (docData.imageUrl) {
        const key = docData.imageUrl;
        if (!imageMap.has(key)) {
          imageMap.set(key, []);
        }
        imageMap.get(key).push({
          collection: collectionName,
          docId: document.id,
          field: 'imageUrl',
          name: docData.name || document.id,
        });
      }

      // Check nested puzzle data
      if (docData.data && typeof docData.data === 'object') {
        const puzzleImages = extractImagesFromPuzzleData(docData.data);
        puzzleImages.forEach(img => {
          if (!imageMap.has(img.url)) {
            imageMap.set(img.url, []);
          }
          imageMap.get(img.url).push({
            collection: collectionName,
            docId: document.id,
            field: `data.${img.path}`,
            name: docData.name || document.id,
          });
        });
      }
    });
  }

  // Filter to get only duplicates (used more than once)
  const duplicates = Array.from(imageMap.entries())
    .filter(([url, locations]) => locations.length > 1)
    .map(([url, locations]) => ({
      imageUrl: url,
      usageCount: locations.length,
      locations,
    }))
    .sort((a, b) => b.usageCount - a.usageCount);

  return {
    totalUniqueImages: imageMap.size,
    totalDuplicates: duplicates.length,
    totalDuplicateReferences: duplicates.reduce((sum, d) => sum + d.usageCount - 1, 0),
    duplicates,
    imageMap,
  };
};

/**
 * Extract all images from nested puzzle data structures
 */
const extractImagesFromPuzzleData = (data) => {
  const images = [];

  // Find Pairs: cards array
  if (data.cards && Array.isArray(data.cards)) {
    data.cards.forEach((card, idx) => {
      if (card.image) {
        images.push({ url: card.image, path: `cards[${idx}].image` });
      }
    });
  }

  // Spot Difference
  if (data.imageA) images.push({ url: data.imageA, path: 'imageA' });
  if (data.imageB) images.push({ url: data.imageB, path: 'imageB' });

  // Pairs array (Picture Word, Picture Shadow)
  if (data.pairs && Array.isArray(data.pairs)) {
    data.pairs.forEach((pair, idx) => {
      if (pair.image) {
        images.push({ url: pair.image, path: `pairs[${idx}].image` });
      }
      if (pair.shadowImage) {
        images.push({ url: pair.shadowImage, path: `pairs[${idx}].shadowImage` });
      }
    });
  }

  // Items array (Ordering)
  if (data.items && Array.isArray(data.items)) {
    data.items.forEach((item, idx) => {
      if (item.image) {
        images.push({ url: item.image, path: `items[${idx}].image` });
      }
      if (item.shadowImage) {
        images.push({ url: item.shadowImage, path: `items[${idx}].shadowImage` });
      }
    });
  }

  // Shadows array
  if (data.shadows && Array.isArray(data.shadows)) {
    data.shadows.forEach((shadow, idx) => {
      if (shadow.image) {
        images.push({ url: shadow.image, path: `shadows[${idx}].image` });
      }
    });
  }

  return images;
};

/**
 * ============================================================
 * STEP 2: MATCH DUPLICATES WITH SHARED IMAGES
 * ============================================================
 */

/**
 * Find which duplicates can be consolidated using SHARED_IMAGES
 * Returns mapping of duplicate URLs to shared image constants
 */
export const findConsolidationOpportunities = async () => {
  const analysis = await analyzeImageDuplicates();
  const sharedUrls = new Map();

  // Build map of shared image URLs
  Object.entries(SHARED_IMAGES).forEach(([category, images]) => {
    if (typeof images === 'object') {
      Object.entries(images).forEach(([name, url]) => {
        sharedUrls.set(url, { category, name });
      });
    }
  });

  // Find matches
  const consolidationMap = new Map();
  analysis.duplicates.forEach(duplicate => {
    if (sharedUrls.has(duplicate.imageUrl)) {
      const shared = sharedUrls.get(duplicate.imageUrl);
      consolidationMap.set(duplicate.imageUrl, {
        sharedCategory: shared.category,
        sharedName: shared.name,
        sharedPath: `SHARED_IMAGES.${shared.category}.${shared.name}`,
        currentLocations: duplicate.locations.length,
        potentialSavings: (duplicate.locations.length - 1) * 2, // KB estimate
      });
    }
  });

  return {
    consolidationOpportunities: Array.from(consolidationMap.entries()).map(
      ([url, opportunity]) => ({
        imageUrl: url,
        ...opportunity,
      })
    ),
    totalOpportunities: consolidationMap.size,
    estimatedSavings: Array.from(consolidationMap.values()).reduce(
      (sum, opp) => sum + opp.potentialSavings,
      0
    ),
  };
};

/**
 * ============================================================
 * STEP 3: GENERATE CONSOLIDATION REPORT
 * ============================================================
 */

/**
 * Generate human-readable report of duplicates
 */
export const generateDeduplicationReport = async () => {
  const analysis = await analyzeImageDuplicates();
  const opportunities = await findConsolidationOpportunities();

  const report = {
    summary: {
      totalUniqueImages: analysis.totalUniqueImages,
      duplicateImageCount: analysis.totalDuplicates,
      totalDuplicateReferences: analysis.totalDuplicateReferences,
      reductionPotential: `${Math.round(
        (analysis.totalDuplicateReferences / (analysis.totalUniqueImages + analysis.totalDuplicateReferences)) * 100
      )}%`,
    },

    canConsolidate: {
      count: opportunities.totalOpportunities,
      estimatedReduction: `${opportunities.estimatedSavings}KB`,
      opportunities: opportunities.consolidationOpportunities.slice(0, 20), // Top 20
    },

    topDuplicates: analysis.duplicates.slice(0, 20).map(dup => ({
      image: dup.imageUrl,
      usageCount: dup.usageCount,
      locations: dup.locations,
    })),
  };

  return report;
};

/**
 * ============================================================
 * STEP 4: BATCH UPDATE DOCUMENTS
 * ============================================================
 */

/**
 * Replace duplicate URLs with a consolidated URL
 * Usage: await consolidateImageUrl(oldUrl, newUrl)
 */
export const consolidateImageUrl = async (oldUrl, newUrl, dryRun = true) => {
  const analysis = await analyzeImageDuplicates();
  const duplicateData = analysis.duplicates.find(d => d.imageUrl === oldUrl);

  if (!duplicateData) {
    console.warn(`No duplicates found for URL: ${oldUrl}`);
    return { updated: 0, skipped: 0 };
  }

  const batch = writeBatch(db);
  let updateCount = 0;
  let skipCount = 0;

  for (const location of duplicateData.locations) {
    const docRef = doc(db, location.collection, location.docId);

    try {
      if (location.field === 'imageUrl') {
        // Simple imageUrl field
        if (!dryRun) {
          batch.update(docRef, { imageUrl: newUrl });
        }
        updateCount++;
      } else if (location.field.startsWith('data.')) {
        // Nested data field - requires careful handling
        console.warn(
          `Nested field updates require special handling: ${location.collection}/${location.docId}/${location.field}`
        );
        skipCount++;
      }
    } catch (error) {
      console.error(
        `Error preparing update for ${location.collection}/${location.docId}:`,
        error
      );
      skipCount++;
    }
  }

  // Commit batch only if not dry run
  if (!dryRun && updateCount > 0) {
    try {
      await batch.commit();
      console.log(`✅ Updated ${updateCount} documents`);
    } catch (error) {
      console.error('Error committing batch update:', error);
      return { updated: 0, skipped: duplicateData.locations.length, error };
    }
  }

  return {
    updated: dryRun ? 0 : updateCount,
    skipped: skipCount,
    dryRun,
    message: dryRun ? '✨ DRY RUN - No changes made. Set dryRun=false to commit.' : `✅ Updated ${updateCount} documents`,
  };
};

/**
 * ============================================================
 * STEP 5: AUDIT & VALIDATION
 * ============================================================
 */

/**
 * Validate that all images are accessible
 * Check for broken image links
 */
export const validateImageUrls = async () => {
  const analysis = await analyzeImageDuplicates();
  const results = {
    validated: 0,
    broken: [],
    inaccessible: [],
  };

  for (const [imageUrl, locations] of analysis.imageMap.entries()) {
    try {
      const response = await fetch(imageUrl, { method: 'HEAD' });
      if (response.status === 200) {
        results.validated++;
      } else {
        results.broken.push({
          url: imageUrl,
          status: response.status,
          usedIn: locations.length,
        });
      }
    } catch (error) {
      results.inaccessible.push({
        url: imageUrl,
        error: error.message,
        usedIn: locations.length,
      });
    }
  }

  return results;
};

/**
 * ============================================================
 * CONSOLE USAGE GUIDE
 * ============================================================
 * 
 * To use in browser console:
 * 
 * 1. Analyze current duplicates:
 *    const analysis = await analyzeImageDuplicates();
 *    console.table(analysis.duplicates);
 * 
 * 2. Find consolidation opportunities:
 *    const opps = await findConsolidationOpportunities();
 *    console.table(opps.consolidationOpportunities);
 * 
 * 3. Get detailed report:
 *    const report = await generateDeduplicationReport();
 *    console.log(JSON.stringify(report, null, 2));
 * 
 * 4. DRY RUN consolidation (no changes):
 *    const result = await consolidateImageUrl(oldUrl, newUrl, true);
 *    console.log(result);
 * 
 * 5. COMMIT consolidation (make changes):
 *    const result = await consolidateImageUrl(oldUrl, newUrl, false);
 *    console.log(result);
 * 
 * 6. Validate all image URLs:
 *    const validation = await validateImageUrls();
 *    console.log(validation);
 */
