import {
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

const BRANDING_COLLECTION = 'seriesBranding';

/**
 * ============================================================================
 * SERIES BRANDING SERVICE
 * ============================================================================
 * Manages custom branding for series including colors, images, and styling
 */

// ============================================================================
// CREATE & UPDATE OPERATIONS
// ============================================================================

/**
 * Create a new branding configuration for a series
 * @param {string} seriesId - The series ID
 * @param {object} brandingData - Branding configuration object
 * @returns {Promise<void>}
 */
export const createSeriesBranding = async (seriesId, brandingData) => {
  try {
    const brandingRef = doc(db, BRANDING_COLLECTION, seriesId);
    
    const brandingConfig = {
      seriesId,
      primaryColor: brandingData.primaryColor || '#000000',
      secondaryColor: brandingData.secondaryColor || '#ffffff',
      accentColor: brandingData.accentColor || '#ff6b6b',
      backgroundColor: brandingData.backgroundColor || '#ffffff',
      textColor: brandingData.textColor || '#333333',
      bannerImage: brandingData.bannerImage || null,
      logoImage: brandingData.logoImage || null,
      customCSS: brandingData.customCSS || '',
      isDefault: brandingData.isDefault || false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      createdBy: brandingData.createdBy || 'admin',
    };

    await setDoc(brandingRef, brandingConfig);
    console.log(`✅ Branding created for series ${seriesId}`);
  } catch (error) {
    console.error('❌ Error creating series branding:', error);
    throw error;
  }
};

/**
 * Update existing branding configuration
 * @param {string} seriesId - The series ID
 * @param {object} updates - Fields to update
 * @returns {Promise<void>}
 */
export const updateSeriesBranding = async (seriesId, updates) => {
  try {
    const brandingRef = doc(db, BRANDING_COLLECTION, seriesId);
    
    const updateData = {
      ...updates,
      updatedAt: serverTimestamp(),
    };

    await updateDoc(brandingRef, updateData);
    console.log(`✅ Branding updated for series ${seriesId}`);
  } catch (error) {
    console.error('❌ Error updating series branding:', error);
    throw error;
  }
};

/**
 * Set theme colors for a series
 * @param {string} seriesId - The series ID
 * @param {object} colors - Color object with primaryColor, secondaryColor, etc.
 * @returns {Promise<void>}
 */
export const setThemeColors = async (seriesId, colors) => {
  try {
    const colorData = {
      primaryColor: colors.primaryColor,
      secondaryColor: colors.secondaryColor,
      accentColor: colors.accentColor,
      backgroundColor: colors.backgroundColor,
      textColor: colors.textColor,
    };

    await updateSeriesBranding(seriesId, colorData);
    console.log(`✅ Theme colors updated for series ${seriesId}`);
  } catch (error) {
    console.error('❌ Error setting theme colors:', error);
    throw error;
  }
};

/**
 * Update branding images
 * @param {string} seriesId - The series ID
 * @param {string} bannerImage - Banner image URL
 * @param {string} logoImage - Logo image URL
 * @returns {Promise<void>}
 */
export const updateBrandingImages = async (seriesId, bannerImage, logoImage) => {
  try {
    const imageData = {};
    if (bannerImage) imageData.bannerImage = bannerImage;
    if (logoImage) imageData.logoImage = logoImage;

    await updateSeriesBranding(seriesId, imageData);
    console.log(`✅ Images updated for series ${seriesId}`);
  } catch (error) {
    console.error('❌ Error updating branding images:', error);
    throw error;
  }
};

/**
 * Update custom CSS for a series
 * @param {string} seriesId - The series ID
 * @param {string} customCSS - Custom CSS string
 * @returns {Promise<void>}
 */
export const updateCustomCSS = async (seriesId, customCSS) => {
  try {
    await updateSeriesBranding(seriesId, { customCSS });
    console.log(`✅ Custom CSS updated for series ${seriesId}`);
  } catch (error) {
    console.error('❌ Error updating custom CSS:', error);
    throw error;
  }
};

// ============================================================================
// READ OPERATIONS
// ============================================================================

/**
 * Get branding configuration for a series
 * @param {string} seriesId - The series ID
 * @returns {Promise<object|null>} Branding configuration or null if not found
 */
export const getSeriesBranding = async (seriesId) => {
  try {
    const brandingRef = doc(db, BRANDING_COLLECTION, seriesId);
    const brandingSnapshot = await getDoc(brandingRef);

    if (brandingSnapshot.exists()) {
      return brandingSnapshot.data();
    }

    console.log(`⚠️ No branding found for series ${seriesId}, using defaults`);
    return getDefaultBranding(seriesId);
  } catch (error) {
    console.error('❌ Error getting series branding:', error);
    throw error;
  }
};

/**
 * Get theme colors for a series
 * @param {string} seriesId - The series ID
 * @returns {Promise<object>} Colors object
 */
export const getThemeColors = async (seriesId) => {
  try {
    const branding = await getSeriesBranding(seriesId);

    return {
      primaryColor: branding.primaryColor,
      secondaryColor: branding.secondaryColor,
      accentColor: branding.accentColor,
      backgroundColor: branding.backgroundColor,
      textColor: branding.textColor,
    };
  } catch (error) {
    console.error('❌ Error getting theme colors:', error);
    throw error;
  }
};

/**
 * Get all series brandings
 * @returns {Promise<array>} Array of all branding configurations
 */
export const getAllSeriesBrandings = async () => {
  try {
    const brandingsRef = collection(db, BRANDING_COLLECTION);
    const snapshot = await getDocs(brandingsRef);

    const brandings = [];
    snapshot.forEach((doc) => {
      brandings.push(doc.data());
    });

    return brandings;
  } catch (error) {
    console.error('❌ Error getting all series brandings:', error);
    throw error;
  }
};

/**
 * Get default branding for a series
 * @param {string} seriesId - The series ID
 * @returns {object} Default branding configuration
 */
export const getDefaultBranding = (seriesId) => {
  return {
    seriesId,
    primaryColor: '#000000',
    secondaryColor: '#ffffff',
    accentColor: '#ff6b6b',
    backgroundColor: '#ffffff',
    textColor: '#333333',
    bannerImage: null,
    logoImage: null,
    customCSS: '',
    isDefault: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

// ============================================================================
// DELETE OPERATIONS
// ============================================================================

/**
 * Delete branding configuration for a series
 * @param {string} seriesId - The series ID
 * @returns {Promise<void>}
 */
export const deleteSeriesBranding = async (seriesId) => {
  try {
    const brandingRef = doc(db, BRANDING_COLLECTION, seriesId);
    await deleteDoc(brandingRef);
    console.log(`✅ Branding deleted for series ${seriesId}`);
  } catch (error) {
    console.error('❌ Error deleting series branding:', error);
    throw error;
  }
};

/**
 * Clear branding and reset to default
 * @param {string} seriesId - The series ID
 * @returns {Promise<void>}
 */
export const clearSeriesBranding = async (seriesId) => {
  try {
    const defaultBranding = getDefaultBranding(seriesId);
    await updateSeriesBranding(seriesId, defaultBranding);
    console.log(`✅ Branding cleared for series ${seriesId}`);
  } catch (error) {
    console.error('❌ Error clearing series branding:', error);
    throw error;
  }
};

// ============================================================================
// IMAGE MANAGEMENT
// ============================================================================

/**
 * Set banner image for series
 * @param {string} seriesId - The series ID
 * @param {string} imageUrl - Cloudinary URL
 * @returns {Promise<void>}
 */
export const setBannerImage = async (seriesId, imageUrl) => {
  try {
    await updateSeriesBranding(seriesId, { bannerImage: imageUrl });
    console.log(`✅ Banner image set for series ${seriesId}`);
  } catch (error) {
    console.error('❌ Error setting banner image:', error);
    throw error;
  }
};

/**
 * Set logo image for series
 * @param {string} seriesId - The series ID
 * @param {string} imageUrl - Cloudinary URL
 * @returns {Promise<void>}
 */
export const setLogoImage = async (seriesId, imageUrl) => {
  try {
    await updateSeriesBranding(seriesId, { logoImage: imageUrl });
    console.log(`✅ Logo image set for series ${seriesId}`);
  } catch (error) {
    console.error('❌ Error setting logo image:', error);
    throw error;
  }
};

/**
 * Delete banner image for series
 * @param {string} seriesId - The series ID
 * @returns {Promise<void>}
 */
export const deleteBannerImage = async (seriesId) => {
  try {
    await updateSeriesBranding(seriesId, { bannerImage: null });
    console.log(`✅ Banner image deleted for series ${seriesId}`);
  } catch (error) {
    console.error('❌ Error deleting banner image:', error);
    throw error;
  }
};

/**
 * Delete logo image for series
 * @param {string} seriesId - The series ID
 * @returns {Promise<void>}
 */
export const deleteLogoImage = async (seriesId) => {
  try {
    await updateSeriesBranding(seriesId, { logoImage: null });
    console.log(`✅ Logo image deleted for series ${seriesId}`);
  } catch (error) {
    console.error('❌ Error deleting logo image:', error);
    throw error;
  }
};

// ============================================================================
// UTILITIES & HELPERS
// ============================================================================

/**
 * Generate CSS variables for a series branding
 * @param {string} seriesId - The series ID
 * @param {object} branding - Branding configuration
 * @returns {string} CSS variable declarations
 */
export const generateCSSVariables = (seriesId, branding) => {
  return `
/* Series ${seriesId} Branding Variables */
.series-branded-${seriesId} {
  --series-primary: ${branding.primaryColor};
  --series-secondary: ${branding.secondaryColor};
  --series-accent: ${branding.accentColor};
  --series-background: ${branding.backgroundColor};
  --series-text: ${branding.textColor};
}
`.trim();
};

/**
 * Generate inline styles from branding
 * @param {object} branding - Branding configuration
 * @returns {object} React style object
 */
export const generateBrandingStyles = (branding) => {
  return {
    '--series-primary': branding.primaryColor,
    '--series-secondary': branding.secondaryColor,
    '--series-accent': branding.accentColor,
    '--series-background': branding.backgroundColor,
    '--series-text': branding.textColor,
  };
};

/**
 * Validate branding configuration
 * @param {object} branding - Branding configuration to validate
 * @returns {object} Validation result {isValid: boolean, errors: array}
 */
export const validateBranding = (branding) => {
  const errors = [];
  const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

  if (!branding.primaryColor || !hexColorRegex.test(branding.primaryColor)) {
    errors.push('Invalid primary color format');
  }

  if (!branding.secondaryColor || !hexColorRegex.test(branding.secondaryColor)) {
    errors.push('Invalid secondary color format');
  }

  if (!branding.accentColor || !hexColorRegex.test(branding.accentColor)) {
    errors.push('Invalid accent color format');
  }

  if (branding.bannerImage && !isValidImageUrl(branding.bannerImage)) {
    errors.push('Invalid banner image URL');
  }

  if (branding.logoImage && !isValidImageUrl(branding.logoImage)) {
    errors.push('Invalid logo image URL');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Check if URL is a valid image URL
 * @param {string} url - URL to validate
 * @returns {boolean} True if valid image URL
 */
const isValidImageUrl = (url) => {
  try {
    const urlObj = new URL(url);
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(urlObj.pathname);
  } catch {
    return false;
  }
};

/**
 * Apply branding to series element
 * @param {string} seriesId - The series ID
 * @param {object} branding - Branding configuration
 * @returns {object} Style object for application
 */
export const applyBrandingToElement = (seriesId, branding) => {
  return {
    className: `series-branded-${seriesId}`,
    style: generateBrandingStyles(branding),
  };
};

/**
 * Generate branding preview
 * @param {object} branding - Branding configuration
 * @returns {object} Preview data with sample elements
 */
export const generateBrandingPreview = (branding) => {
  return {
    colors: {
      primary: branding.primaryColor,
      secondary: branding.secondaryColor,
      accent: branding.accentColor,
      background: branding.backgroundColor,
      text: branding.textColor,
    },
    images: {
      banner: branding.bannerImage,
      logo: branding.logoImage,
    },
    hasCustomCSS: branding.customCSS && branding.customCSS.trim().length > 0,
    cssVariables: generateCSSVariables(branding.seriesId, branding),
  };
};

/**
 * Batch update brandings for multiple series
 * @param {object} updates - Object with seriesId as key and updates as value
 * @returns {Promise<void>}
 */
export const batchUpdateBrandings = async (updates) => {
  try {
    const batch = writeBatch(db);

    Object.entries(updates).forEach(([seriesId, updateData]) => {
      const brandingRef = doc(db, BRANDING_COLLECTION, seriesId);
      batch.update(brandingRef, {
        ...updateData,
        updatedAt: serverTimestamp(),
      });
    });

    await batch.commit();
    console.log(`✅ Batch updated ${Object.keys(updates).length} series brandings`);
  } catch (error) {
    console.error('❌ Error batch updating brandings:', error);
    throw error;
  }
};

export default {
  createSeriesBranding,
  updateSeriesBranding,
  getSeriesBranding,
  deleteSeriesBranding,
  setThemeColors,
  getThemeColors,
  updateBrandingImages,
  setBannerImage,
  setLogoImage,
  deleteBannerImage,
  deleteLogoImage,
  clearSeriesBranding,
  getAllSeriesBrandings,
  getDefaultBranding,
  generateCSSVariables,
  generateBrandingStyles,
  validateBranding,
  applyBrandingToElement,
  generateBrandingPreview,
  batchUpdateBrandings,
};
