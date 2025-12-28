/**
 * CategoryCardItem.jsx
 * Reusable category card component used in both:
 * 1. Home page (FeatureTiles - All Topics section)
 * 2. Navigation mega menu (CategoriesPanel on hover)
 * 
 * Ensures consistent styling across the app
 */

import React from "react";
import { ResponsiveImage } from "../OptimizedImage";

// Helper function to convert Tailwind color names to actual hex values
const colorNameToHex = (colorName) => {
  const colorMap = {
    // Rose/Pink family
    "from-rose-400": "#f43f5e",
    "via-pink-300": "#f472b6",
    "to-rose-300": "#fda4af",
    "from-pink-300": "#f472b6",
    "to-rose-200": "#fecdd3",
    
    // Amber/Orange/Yellow family
    "from-amber-400": "#fbbf24",
    "via-orange-300": "#fdba74",
    "to-yellow-300": "#fcd34d",
    "from-orange-300": "#fdba74",
    "to-yellow-200": "#fef08a",
    
    "from-orange-400": "#fb923c",
    "via-amber-300": "#fcd34d",
    "from-amber-300": "#fcd34d",
    
    // Blue/Cyan family
    "from-blue-400": "#60a5fa",
    "via-cyan-300": "#67e8f9",
    "to-blue-300": "#93c5fd",
    "from-blue-300": "#93c5fd",
    "to-cyan-200": "#cffafe",
    
    // Emerald/Green/Teal family
    "from-emerald-400": "#34d399",
    "via-green-300": "#86efac",
    "to-teal-300": "#7dd3fc",
    "from-green-300": "#86efac",
    "to-teal-200": "#ccf0ff",
    
    "from-cyan-400": "#06b6d4",
    "via-teal-300": "#7dd3fc",
    "from-cyan-300": "#67e8f9",
    
    // Red/Orange/Amber family
    "from-red-400": "#f87171",
    "via-orange-300": "#fdba74",
    "to-amber-300": "#fcd34d",
    "from-red-300": "#fca5a5",
    "to-orange-200": "#fed7aa",
    
    // Purple/Violet/Pink family
    "from-purple-400": "#c084fc",
    "via-violet-300": "#ddd6fe",
    "to-pink-300": "#f472b6",
    "from-purple-300": "#d8b4fe",
    "to-pink-200": "#fbcfe8",
  };
  return colorMap[colorName] || "#999";
};

// Helper function to create gradient from colorScheme color string
const getGradientFromColorScheme = (colorSchemeStr) => {
  if (!colorSchemeStr) return "linear-gradient(135deg, #999 0%, #999 100%)";
  
  const colors = colorSchemeStr.split(" ");
  const hexColors = colors.map(colorNameToHex);
  
  if (hexColors.length === 3) {
    // from ... via ... to
    return `linear-gradient(135deg, ${hexColors[0]} 0%, ${hexColors[1]} 50%, ${hexColors[2]} 100%)`;
  } else if (hexColors.length === 2) {
    // from ... to
    return `linear-gradient(135deg, ${hexColors[0]} 0%, ${hexColors[1]} 100%)`;
  }
  return `linear-gradient(135deg, ${hexColors[0]} 0%, ${hexColors[0]} 100%)`;
};

// Color schemes for category cards
export const colorSchemes = [
  { color: "from-rose-400 via-pink-300 to-rose-300", borderColor: "from-pink-300 to-rose-200" },
  { color: "from-amber-400 via-orange-300 to-yellow-300", borderColor: "from-orange-300 to-yellow-200" },
  { color: "from-blue-400 via-cyan-300 to-blue-300", borderColor: "from-blue-300 to-cyan-200" },
  { color: "from-orange-400 via-amber-300 to-yellow-300", borderColor: "from-amber-300 to-yellow-200" },
  { color: "from-emerald-400 via-green-300 to-teal-300", borderColor: "from-green-300 to-teal-200" },
  { color: "from-cyan-400 via-teal-300 to-blue-300", borderColor: "from-cyan-300 to-teal-200" },
  { color: "from-red-400 via-orange-300 to-amber-300", borderColor: "from-red-300 to-orange-200" },
  { color: "from-purple-400 via-violet-300 to-pink-300", borderColor: "from-purple-300 to-pink-200" },
];

/**
 * Category Card Component
 * @param {Object} category - Category data object
 * @param {number} index - Index for color scheme selection
 * @param {function} onClick - Click handler
 * @param {boolean} compact - If true, shows compact view (for mega menu)
 */
function CategoryCardItem({ category, index, onClick, compact = false }) {
  const colorScheme = colorSchemes[index % colorSchemes.length];
  const hasImage = category.imageUrl || category.image;

  // Image crop settings from category data
  const imageCropSettings = {
    crop: category.imageCrop || "cover",
    zoom: category.imageZoom || 1,
    offsetX: category.imageOffsetX || 0,
    offsetY: category.imageOffsetY || 0,
  };

  if (compact) {
    // Compact version for mega menu - shorter height
    return (
      <div className="flex-shrink-0 w-48">
        <div
          onClick={onClick}
          className="h-32 cursor-pointer rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 relative group"
          style={{ backgroundColor: hasImage ? 'transparent' : '#e5e7eb' }}
        >
          {hasImage ? (
            <ResponsiveImage
              src={category.imageUrl || category.image}
              cloudinaryId={category.cloudinaryId}
              alt={category.title || category.name}
              fallbackIcon={category.icon}
              className="w-full h-full"
              crop={imageCropSettings.crop}
              imageZoom={imageCropSettings.zoom}
              imageOffsetX={imageCropSettings.offsetX}
              imageOffsetY={imageCropSettings.offsetY}
            />
          ) : (
            <div
              className="absolute inset-0 flex items-center justify-center text-5xl opacity-70 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: getGradientFromColorScheme(colorScheme.color),
                zIndex: 1,
              }}
            >
              {category.icon || "📚"}
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        <div className="pt-2">
          <h3 className="text-xs font-bold text-gray-800 line-clamp-2">
            {category.title || category.label || category.name}
          </h3>
          {category.description && (
            <p className="text-xs text-gray-500 line-clamp-1 mt-1">
              {category.description}
            </p>
          )}
        </div>
      </div>
    );
  }

  // Full version for home page - standard height
  return (
    <div className="flex-shrink-0 w-56">
      <div
        onClick={onClick}
        className="h-40 cursor-pointer rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 relative group"
        style={{ backgroundColor: hasImage ? 'transparent' : '#e5e7eb' }}
      >
        {hasImage ? (
          <ResponsiveImage
            src={category.imageUrl || category.image}
            cloudinaryId={category.cloudinaryId}
            alt={category.title || category.name}
            fallbackIcon={category.icon}
            className="w-full h-full"
            crop={imageCropSettings.crop}
            imageZoom={imageCropSettings.zoom}
            imageOffsetX={imageCropSettings.offsetX}
            imageOffsetY={imageCropSettings.offsetY}
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center text-6xl opacity-70 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: getGradientFromColorScheme(colorScheme.color),
              zIndex: 1,
            }}
          >
            {category.icon || "📚"}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      <div className="pt-3">
        <h3 className="text-sm font-bold text-gray-800 mb-1 line-clamp-2">
          {category.title || category.label || category.name}
        </h3>
        {category.categoryName && (
          <p className="text-xs text-gray-500 mb-1">
            {category.categoryName}
          </p>
        )}
        {category.description && (
          <p className="text-xs text-gray-600 mb-2">
            {category.description}
          </p>
        )}
        {/* Rating display - optional */}
        {category.rating && (
          <div className="flex items-center gap-1">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`text-lg ${
                    star <= Math.floor(category.rating || 4)
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
            <span className="text-xs text-gray-500 ml-1">
              ({(category.rating || 4.0).toFixed(1)})
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default CategoryCardItem;
