/**
 * Cloudinary Configuration
 * 
 * Setup Instructions:
 * 1. Sign up at https://cloudinary.com (FREE tier includes 25GB storage + 25GB bandwidth/month)
 * 2. Get your Cloud Name, API Key, API Secret from Dashboard
 * 3. Add to environment variables or replace below
 */

// ⚠️ IMPORTANT: Add these to your .env file for production
// REACT_APP_CLOUDINARY_CLOUD_NAME=your_cloud_name
// REACT_APP_CLOUDINARY_API_KEY=your_api_key
// REACT_APP_CLOUDINARY_UPLOAD_PRESET=your_unsigned_upload_preset

export const CLOUDINARY_CONFIG = {
  cloudName: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || 'dl2cncxsn',
  uploadPreset: process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET || 'amaha_uploads',
  apiKey: process.env.REACT_APP_CLOUDINARY_API_KEY || '174364155493546',
};

/**
 * Generate optimized Cloudinary URL
 * @param {string} publicId - The Cloudinary public ID (e.g., "kids/body-parts")
 * @param {object} options - Transformation options
 * @returns {string} Optimized Cloudinary URL
 */
export const getCloudinaryUrl = (publicId, options = {}) => {
  if (!publicId) return '';
  
  const {
    width = 400,
    height = 400,
    crop = 'fill',
    quality = 'auto',
    format = 'auto',
    gravity = 'auto',
  } = options;

  const transformations = [
    `w_${width}`,
    `h_${height}`,
    `c_${crop}`,
    `q_${quality}`,
    `f_${format}`,
    `g_${gravity}`,
  ].join(',');

  return `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloudName}/image/upload/${transformations}/${publicId}`;
};

/**
 * Responsive image sizes for different use cases
 */
export const IMAGE_SIZES = {
  // Homepage cards
  CARD_MOBILE: { width: 200, height: 200 },
  CARD_TABLET: { width: 300, height: 300 },
  CARD_DESKTOP: { width: 400, height: 400 },
  
  // Quiz navigation pills
  PILL: { width: 48, height: 48 },
  
  // Hero sections
  HERO_MOBILE: { width: 600, height: 400 },
  HERO_DESKTOP: { width: 1200, height: 600 },
  
  // Thumbnails
  THUMBNAIL: { width: 100, height: 100 },
  
  // Full size
  FULL: { width: 800, height: 800 },
};

/**
 * Upload image to Cloudinary
 * @param {File} file - The image file to upload
 * @param {string} folder - Folder path in Cloudinary (e.g., "kids", "students")
 * @param {function} onProgress - Progress callback
 * @returns {Promise<object>} Upload result with publicId and URL
 */
export const uploadToCloudinary = async (file, folder = 'amaha', onProgress) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
  formData.append('folder', folder);
  formData.append('cloud_name', CLOUDINARY_CONFIG.cloudName);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    
    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable && onProgress) {
        const percentComplete = (e.loaded / e.total) * 100;
        onProgress(percentComplete);
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        resolve({
          publicId: response.public_id,
          url: response.secure_url,
          cloudinaryId: response.public_id,
        });
      } else {
        reject(new Error(`Upload failed: ${xhr.statusText}`));
      }
    });

    xhr.addEventListener('error', () => {
      reject(new Error('Network error during upload'));
    });

    xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`);
    xhr.send(formData);
  });
};

/**
 * Check if Cloudinary is configured
 */
export const isCloudinaryConfigured = () => {
  return (
    CLOUDINARY_CONFIG.cloudName !== 'YOUR_CLOUD_NAME' &&
    CLOUDINARY_CONFIG.uploadPreset !== 'YOUR_UPLOAD_PRESET'
  );
};
