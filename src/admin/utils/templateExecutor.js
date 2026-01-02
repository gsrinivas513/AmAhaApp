// src/admin/utils/templateExecutor.js
// Executes template logic to produce preview/result content

export async function runTemplate(typeKey, schema = {}, params = {}) {
  switch (typeKey) {
    case 'jigsaw': {
      // If variants are provided, execute for each variant
      if (params.variants && Array.isArray(params.variants)) {
        const imageUrl = params.imageUrl || '';
        if (!imageUrl) {
          return { ok: false, error: 'Image URL is required', result: null };
        }
        try {
          const variantResults = await Promise.all(
            params.variants.map(async (variant) => {
              const rows = Number(variant.rows || 3);
              const cols = Number(variant.cols || 4);
              try {
                const pieces = await sliceImageToGrid(imageUrl, rows, cols, 12);
                return {
                  label: variant.label,
                  rows,
                  cols,
                  imageUrl,
                  pieces,
                };
              } catch (e) {
                return {
                  label: variant.label,
                  error: e.message,
                };
              }
            })
          );
          return { ok: true, result: { imageUrl, variants: variantResults } };
        } catch (e) {
          return { ok: false, error: e.message || String(e), result: null };
        }
      }

      // Single variant execution (legacy)
      const rows = Number(params.rows || schema.rows || 3);
      const cols = Number(params.cols || schema.cols || 4);
      const imageUrl = params.imageUrl || '';
      if (!imageUrl) {
        return { ok: false, error: 'Image URL is required', result: null };
      }
      try {
        const pieces = await sliceImageToGrid(imageUrl, rows, cols, 12); // limit to 12 thumbnails for preview
        return { ok: true, result: { rows, cols, imageUrl, pieces } };
      } catch (e) {
        return { ok: false, error: e.message || String(e), result: null };
      }
    }
    default:
      return { ok: true, result: null };
  }
}

async function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(new Error('Failed to load image'));
    img.src = url;
  });
}

async function sliceImageToGrid(url, rows, cols, maxThumbs = 12) {
  const img = await loadImage(url);
  const pieceWidth = Math.floor(img.width / cols);
  const pieceHeight = Math.floor(img.height / rows);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = pieceWidth;
  canvas.height = pieceHeight;
  const thumbs = [];
  let count = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const sx = c * pieceWidth;
      const sy = r * pieceHeight;
      ctx.clearRect(0, 0, pieceWidth, pieceHeight);
      ctx.drawImage(img, sx, sy, pieceWidth, pieceHeight, 0, 0, pieceWidth, pieceHeight);
      if (count < maxThumbs) {
        thumbs.push(canvas.toDataURL('image/png'));
      }
      count++;
    }
  }
  return thumbs;
}
