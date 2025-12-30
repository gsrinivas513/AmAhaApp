/**
 * Cloudinary Admin Service
 * Manages interactions with Cloudinary API for admin purposes
 * - Fetch all uploaded images with metadata
 * - Get image metadata and usage stats
 * - Delete images
 * - Find duplicates
 */

import { db } from '../firebase/firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { CLOUDINARY_CONFIG } from '../config/cloudinaryConfig';
import { CacheService } from './cacheService';

/**
 * Extract image URL from nested data structures
 * Handles various puzzle data formats
 */
const extractImagesFromPuzzleData = (data) => {
  const images = [];
  
  if (!data) return images;
  
  // Find Pairs: cards array
  if (data.cards && Array.isArray(data.cards)) {
    data.cards.forEach(card => {
      if (card.image) images.push(card.image);
    });
  }
  
  // Spot Difference: imageA, imageB
  if (data.imageA) images.push(data.imageA);
  if (data.imageB) images.push(data.imageB);
  
  // Picture Word, Picture Shadow: pairs or items array
  if (data.pairs && Array.isArray(data.pairs)) {
    data.pairs.forEach(pair => {
      if (pair.image) images.push(pair.image);
      if (pair.shadowImage) images.push(pair.shadowImage);
    });
  }
  
  if (data.items && Array.isArray(data.items)) {
    data.items.forEach(item => {
      if (item.image) images.push(item.image);
      if (item.shadowImage) images.push(item.shadowImage);
    });
  }
  
  // Shadows array
  if (data.shadows && Array.isArray(data.shadows)) {
    data.shadows.forEach(shadow => {
      if (shadow.image) images.push(shadow.image);
    });
  }
  
  // Ordering: items array
  if (Array.isArray(data) && data[0] && data[0].image) {
    data.forEach(item => {
      if (item.image) images.push(item.image);
    });
  }
  
  return images;
};

/**
 * Extract filename and metadata from URL
 */
const extractFileMetadata = (url) => {
  if (!url) return { name: 'unknown', source: 'unknown', uploadDate: null };
  
  // Cloudinary URL
  if (url.includes('cloudinary.com') || url.includes('res.cloudinary')) {
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/');
      const filename = pathParts[pathParts.length - 1];
      const decodedName = decodeURIComponent(filename);
      
      return {
        name: decodedName,
        source: 'cloudinary',
        uploadDate: null, // Would need Cloudinary API for actual date
        url: url,
      };
    } catch (e) {
      return { name: url.substring(0, 30), source: 'cloudinary', uploadDate: null, url };
    }
  }
  
  // Firebase Storage URL
  if (url.includes('firebasestorage.googleapis.com')) {
    try {
      const decoded = decodeURIComponent(url);
      const match = decoded.match(/o\/([^?]+)/);
      if (match) {
        return {
          name: match[1].split('/').pop(),
          source: 'firebase',
          uploadDate: null,
          url: url,
        };
      }
    } catch (e) {
      return { name: 'firebase-image', source: 'firebase', uploadDate: null, url };
    }
  }
  
  // Regular URL
  try {
    const urlObj = new URL(url);
    const filename = urlObj.pathname.split('/').pop();
    return {
      name: filename || 'image',
      source: 'external',
      uploadDate: null,
      url: url,
    };
  } catch (e) {
    return { name: url.substring(0, 30), source: 'unknown', uploadDate: null, url };
  }
};

/**
 * Fetch all images from Firestore
 * Scans multiple collections including puzzle data
 * OPTIMIZED: Results are cached for 5 minutes to reduce Firestore reads
 */
export const getAllCloudinaryImages = async () => {
  // Check cache first - saves 8 Firestore reads
  const cacheKey = 'cloudinary:all_images';
  const cached = CacheService.get(cacheKey);
  if (cached) {
    console.log('[Cache] Returning cached cloudinary images (8 Firestore reads avoided)');
    return cached;
  }

  try {
    const images = [];
    const imageMap = new Map(); // Track duplicates with complete metadata

    // Collections to scan
    const collectionNames = ['categories', 'topics', 'subtopics', 'features'];
    const puzzleCollections = ['puzzles', 'puzzleCategories', 'puzzleTopics', 'puzzleSubtopics'];

    // Scan standard collections
    for (const collName of collectionNames) {
      const snapshot = await getDocs(collection(db, collName));
      
      snapshot.forEach(doc => {
        const data = doc.data();
        if (data.imageUrl || data.cloudinaryId) {
          const imageUrl = data.imageUrl || 'N/A';
          const imageKey = data.cloudinaryId || imageUrl;
          
          if (!imageMap.has(imageKey)) {
            const metadata = extractFileMetadata(imageUrl);
            imageMap.set(imageKey, {
              cloudinaryId: data.cloudinaryId || 'N/A',
              imageUrl: imageUrl,
              originalName: metadata.name,
              source: metadata.source,
              uploadDate: data.createdAt || data.updatedAt || null,
              usage: [],
              usageCount: 0,
            });
          }

          // Add usage info
          imageMap.get(imageKey).usage.push({
            type: collName,
            itemName: data.label || data.name,
            itemId: doc.id,
            featureId: data.featureId,
          });

          imageMap.get(imageKey).usageCount += 1;
        }
      });
    }

    // Scan puzzle collections (nested image data)
    for (const collName of puzzleCollections) {
      const snapshot = await getDocs(collection(db, collName));
      
      snapshot.forEach(doc => {
        const data = doc.data();
        
        // Scan for images in nested data structures
        if (data.data) {
          const nestedImages = extractImagesFromPuzzleData(data.data);
          nestedImages.forEach(imageUrl => {
            if (!imageUrl) return;
            
            const imageKey = imageUrl;
            
            if (!imageMap.has(imageKey)) {
              const metadata = extractFileMetadata(imageUrl);
              imageMap.set(imageKey, {
                cloudinaryId: 'N/A',
                imageUrl: imageUrl,
                originalName: metadata.name,
                source: metadata.source,
                uploadDate: data.createdAt || data.updatedAt || null,
                usage: [],
                usageCount: 0,
              });
            }

            // Add usage info
            imageMap.get(imageKey).usage.push({
              type: collName,
              itemName: data.title || data.label || data.name || 'Puzzle',
              itemId: doc.id,
              featureId: data.featureId,
              puzzleType: data.type,
            });

            imageMap.get(imageKey).usageCount += 1;
          });
        }
        
        // Also check imageUrl field on puzzles
        if (data.imageUrl) {
          const imageKey = data.imageUrl;
          
          if (!imageMap.has(imageKey)) {
            const metadata = extractFileMetadata(data.imageUrl);
            imageMap.set(imageKey, {
              cloudinaryId: 'N/A',
              imageUrl: data.imageUrl,
              originalName: metadata.name,
              source: metadata.source,
              uploadDate: data.createdAt || data.updatedAt || null,
              usage: [],
              usageCount: 0,
            });
          }

          imageMap.get(imageKey).usage.push({
            type: collName,
            itemName: data.title || data.label || data.name,
            itemId: doc.id,
            featureId: data.featureId,
            puzzleType: data.type,
          });

          imageMap.get(imageKey).usageCount += 1;
        }
      });
    }

    // Convert to array and sort by usage
    const result = Array.from(imageMap.values()).sort((a, b) => b.usageCount - a.usageCount);
    
    // Cache the result for 5 minutes
    CacheService.set(cacheKey, result, CacheService.CACHE_DURATION.SHORT);
    
    return result;
  } catch (error) {
    console.error('Error fetching Cloudinary images:', error);
    throw error;
  }
};

/**
 * Get detailed image information
 */
export const getImageDetails = async (imageUrl) => {
  try {
    const images = await getAllCloudinaryImages();
    return images.find(img => img.imageUrl === imageUrl);
  } catch (error) {
    console.error('Error fetching image details:', error);
    throw error;
  }
};

/**
 * Find duplicate images (same URL used multiple times)
 */
export const findDuplicateImages = async () => {
  try {
    const allImages = await getAllCloudinaryImages();
    const duplicates = allImages.filter(img => img.usageCount > 1);
    return duplicates.sort((a, b) => b.usageCount - a.usageCount);
  } catch (error) {
    console.error('Error finding duplicates:', error);
    throw error;
  }
};

/**
 * Find unused images
 * (Images that exist in Cloudinary but aren't referenced in Firestore)
 * Note: This requires backend API to list all Cloudinary images
 */
export const findUnusedImages = async () => {
  try {
    const allImages = await getAllCloudinaryImages();
    return allImages.filter(img => img.usageCount === 0);
  } catch (error) {
    console.error('Error finding unused images:', error);
    throw error;
  }
};

/**
 * Delete image reference from Firestore
 * (Note: Doesn't delete from Cloudinary - requires Cloudinary API key)
 */
export const deleteImageFromDatabase = async (collectionName, documentId) => {
  try {
    // This would require admin access
    console.warn('deleteImageFromDatabase requires admin implementation');
    return true;
  } catch (error) {
    console.error('Error deleting image reference:', error);
    throw error;
  }
};

/**
 * Delete image from Cloudinary
 * Requires backend endpoint since we can't expose admin API key to frontend
 */
export const deleteCloudinaryImage = async (cloudinaryId) => {
  try {
    // Call backend endpoint
    const response = await fetch('/api/cloudinary/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ publicId: cloudinaryId }),
    });

    if (!response.ok) {
      throw new Error('Failed to delete image from Cloudinary');
    }

    // Invalidate cache after deletion
    CacheService.get('cloudinary:all_images') && CacheService.set('cloudinary:all_images', null);

    return await response.json();
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    throw error;
  }
};

/**
 * Get Cloudinary account stats
 * (Requires backend with admin API key)
 */
export const getCloudinaryStats = async () => {
  try {
    const response = await fetch('/api/cloudinary/stats', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch Cloudinary stats');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching Cloudinary stats:', error);
    return {
      totalAssets: 0,
      usedStorage: 0,
      remainingStorage: 0,
      bandwidth: 0,
      error: error.message,
    };
  }
};

/**
 * Export image data for review
 */
export const exportImageData = async () => {
  try {
    const allImages = await getAllCloudinaryImages();
    const duplicates = await findDuplicateImages();

    return {
      timestamp: new Date().toISOString(),
      totalImages: allImages.length,
      duplicateImages: duplicates.length,
      data: allImages,
      duplicates: duplicates,
    };
  } catch (error) {
    console.error('Error exporting image data:', error);
    throw error;
  }
};

/**
 * Get image usage report with detailed analysis
 */
export const getImageUsageReport = async () => {
  try {
    const allImages = await getAllCloudinaryImages();
    const unused = allImages.filter(img => img.usageCount === 0);

    const report = {
      totalUniqueImages: allImages.length,
      totalImageReferences: allImages.reduce((sum, img) => sum + img.usageCount, 0),
      imagesByUsageCount: {
        notUsed: unused.length,
        usedOnce: allImages.filter(img => img.usageCount === 1).length,
        usedMultiple: allImages.filter(img => img.usageCount > 1).length,
      },
      highestUsed: allImages.slice(0, 10),
      duplicates: allImages.filter(img => img.usageCount > 1),
      unused: unused,
      imagesBySource: {
        cloudinary: allImages.filter(img => img.source === 'cloudinary').length,
        firebase: allImages.filter(img => img.source === 'firebase').length,
        external: allImages.filter(img => img.source === 'external').length,
      },
    };

    return report;
  } catch (error) {
    console.error('Error generating image usage report:', error);
    throw error;
  }
};
