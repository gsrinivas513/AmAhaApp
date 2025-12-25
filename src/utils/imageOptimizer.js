/**
 * Image Optimizer - Optimizes images for web
 * Uses Cloudinary for transformation and caching
 */

class ImageOptimizer {
  constructor(cloudinaryName = 'amaha') {
    this.cloudinaryName = cloudinaryName;
    this.cloudinaryUrl = `https://res.cloudinary.com/${cloudinaryName}`;
  }

  /**
   * Generate optimized Cloudinary URL
   */
  getOptimizedUrl(publicId, options = {}) {
    const {
      width = 800,
      height = null,
      quality = 'auto',
      format = 'auto',
      crop = 'fill',
      gravity = 'auto',
      responsive = true,
    } = options;

    let transforms = [];

    // Add responsive transformation
    if (responsive) {
      transforms.push('c_fill');
      transforms.push('g_auto');
      transforms.push('w_auto');
    } else {
      if (width) transforms.push(`w_${width}`);
      if (height) transforms.push(`h_${height}`);
      if (crop) transforms.push(`c_${crop}`);
      if (gravity) transforms.push(`g_${gravity}`);
    }

    // Quality
    transforms.push(`q_${quality}`);

    // Format
    transforms.push(`f_${format}`);

    // Device pixel ratio
    transforms.push('dpr_auto');

    const transformString = transforms.join(',');
    return `${this.cloudinaryUrl}/image/upload/${transformString}/${publicId}`;
  }

  /**
   * Generate srcSet for responsive images
   */
  generateSrcSet(publicId, options = {}) {
    const widths = [320, 480, 640, 800, 1024, 1280];
    
    return widths
      .map(width => ({
        ...options,
        width,
        responsive: false,
      }))
      .map(opts => ({
        url: this.getOptimizedUrl(publicId, opts),
        width: opts.width,
      }))
      .map(({ url, width }) => `${url} ${width}w`)
      .join(', ');
  }

  /**
   * Get blur hash / placeholder
   */
  getBlurHash(publicId) {
    return `${this.cloudinaryUrl}/image/upload/w_50,q_10/${publicId}`;
  }

  /**
   * Optimize video
   */
  getOptimizedVideo(publicId, options = {}) {
    const {
      width = 800,
      quality = 'auto',
      format = 'auto',
    } = options;

    const transforms = [
      `w_${width}`,
      `q_${quality}`,
      `f_${format}`,
      'dpr_auto',
    ];

    return `${this.cloudinaryUrl}/video/upload/${transforms.join(',')}/${publicId}`;
  }

  /**
   * Get image metadata
   */
  async getMetadata(publicId) {
    try {
      const response = await fetch(
        `${this.cloudinaryUrl}/image/upload/fl_getinfo/${publicId}`
      );
      return await response.json();
    } catch (error) {
      console.error('Error getting image metadata:', error);
      return null;
    }
  }

  /**
   * Lazy load image
   */
  lazyLoadImage(src, callback) {
    const img = new Image();
    img.onload = () => callback(null, img);
    img.onerror = (err) => callback(err);
    img.src = src;
  }

  /**
   * Batch optimize multiple images
   */
  batchOptimize(images, options = {}) {
    return images.map(imageId => ({
      id: imageId,
      optimized: this.getOptimizedUrl(imageId, options),
      srcSet: this.generateSrcSet(imageId, options),
      blur: this.getBlurHash(imageId),
    }));
  }
}

// Export singleton instance
export const imageOptimizer = new ImageOptimizer();

export default imageOptimizer;
