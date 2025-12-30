/**
 * imageCropService.js
 * Manages image crop, zoom, and position settings
 * Stores settings in Firestore for each image
 */

import { db } from '../firebase/firebaseConfig';
import { collection, getDocs, doc, updateDoc, setDoc, query, where } from 'firebase/firestore';

const IMAGE_CROPS_COLLECTION = 'imageCropSettings';

// Default crop settings
export const DEFAULT_CROP_SETTINGS = {
  cropMode: 'cover', // cover, contain, custom
  zoomLevel: 1.0,
  offsetX: 0,
  offsetY: 0,
  enabled: false,
};

/**
 * Get crop settings for an image
 * @param {string} imageUrl - The Cloudinary image URL
 * @returns {Promise<Object>} Crop settings
 */
export async function getImageCropSettings(imageUrl) {
  try {
    const q = query(
      collection(db, IMAGE_CROPS_COLLECTION),
      where('imageUrl', '==', imageUrl)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data();
    }

    return DEFAULT_CROP_SETTINGS;
  } catch (err) {
    console.error('Error fetching crop settings:', err);
    return DEFAULT_CROP_SETTINGS;
  }
}

/**
 * Save crop settings for an image
 * @param {string} imageUrl - The image URL
 * @param {Object} settings - Crop settings
 * @returns {Promise<void>}
 */
export async function saveImageCropSettings(imageUrl, settings) {
  try {
    const q = query(
      collection(db, IMAGE_CROPS_COLLECTION),
      where('imageUrl', '==', imageUrl)
    );
    const querySnapshot = await getDocs(q);

    const docData = {
      imageUrl,
      cropMode: settings.cropMode,
      zoomLevel: settings.zoomLevel,
      offsetX: settings.offsetX,
      offsetY: settings.offsetY,
      enabled: settings.enabled,
      updatedAt: new Date(),
    };

    if (!querySnapshot.empty) {
      // Update existing
      await updateDoc(
        doc(db, IMAGE_CROPS_COLLECTION, querySnapshot.docs[0].id),
        docData
      );
    } else {
      // Create new
      await setDoc(
        doc(collection(db, IMAGE_CROPS_COLLECTION)),
        docData
      );
    }

    console.log('✅ Crop settings saved:', imageUrl);
  } catch (err) {
    console.error('Error saving crop settings:', err);
    throw err;
  }
}

/**
 * Delete crop settings for an image
 * @param {string} imageUrl - The image URL
 * @returns {Promise<void>}
 */
export async function deleteImageCropSettings(imageUrl) {
  try {
    const q = query(
      collection(db, IMAGE_CROPS_COLLECTION),
      where('imageUrl', '==', imageUrl)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      await updateDoc(
        doc(db, IMAGE_CROPS_COLLECTION, querySnapshot.docs[0].id),
        { enabled: false }
      );
    }

    console.log('✅ Crop settings deleted:', imageUrl);
  } catch (err) {
    console.error('Error deleting crop settings:', err);
    throw err;
  }
}

/**
 * Get all crop settings
 * @returns {Promise<Array>} Array of all crop settings
 */
export async function getAllImageCropSettings() {
  try {
    const querySnapshot = await getDocs(collection(db, IMAGE_CROPS_COLLECTION));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (err) {
    console.error('Error fetching all crop settings:', err);
    return [];
  }
}

/**
 * Apply crop settings to an image URL
 * @param {string} imageUrl - The image URL
 * @param {Object} settings - Crop settings
 * @returns {Object} Style object to apply to image
 */
export function getImageCropStyle(imageUrl, settings) {
  if (!settings || !settings.enabled) {
    return {
      objectFit: 'cover',
      objectPosition: 'center',
    };
  }

  const { cropMode, zoomLevel = 1, offsetX = 0, offsetY = 0 } = settings;

  // Calculate position based on offset
  const posX = 50 + (offsetX / 10); // Convert pixel offset to percentage
  const posY = 50 + (offsetY / 10);

  return {
    objectFit: cropMode === 'contain' ? 'contain' : 'cover',
    objectPosition: `${Math.max(0, Math.min(100, posX))}% ${Math.max(0, Math.min(100, posY))}%`,
    transform: `scale(${zoomLevel})`,
    transformOrigin: 'center',
  };
}

/**
 * Validate crop settings
 * @param {Object} settings - Settings to validate
 * @returns {Object} Validation result
 */
export function validateCropSettings(settings) {
  const errors = [];

  if (!settings.cropMode || !['cover', 'contain', 'custom'].includes(settings.cropMode)) {
    errors.push('Invalid crop mode');
  }

  if (typeof settings.zoomLevel !== 'number' || settings.zoomLevel < 0.5 || settings.zoomLevel > 2.0) {
    errors.push('Zoom level must be between 0.5 and 2.0');
  }

  if (typeof settings.offsetX !== 'number' || Math.abs(settings.offsetX) > 100) {
    errors.push('Offset X must be between -100 and 100');
  }

  if (typeof settings.offsetY !== 'number' || Math.abs(settings.offsetY) > 100) {
    errors.push('Offset Y must be between -100 and 100');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
