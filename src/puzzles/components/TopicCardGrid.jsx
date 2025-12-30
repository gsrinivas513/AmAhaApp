// src/puzzles/components/TopicCardGrid.jsx
// Reusable component for displaying topics/subtopics in grid or carousel format
import React, { useRef, useState } from 'react';
import { ResponsiveImage } from '../../components/OptimizedImage';

/**
 * Reusable TopicCard component for displaying a single topic/subtopic
 * @param {Object} props - Component props
 * @param {Object} props.item - Topic or subtopic data
 * @param {string} props.categoryName - Parent category name
 * @param {Object} props.theme - Theme object with colors
 * @param {number} props.itemIndex - Index for color rotation
 * @param {Function} props.navigate - Navigation function
 * @param {Function} props.getNavigationPath - Function to determine navigation path
 */
export function TopicCard({ item, categoryName, theme, itemIndex, navigate, getNavigationPath, isCarousel = false }) {
  const hasImage = item.imageUrl || item.image;
  
  const getGradientColor = (index) => {
    const gradients = [
      'from-blue-400 to-blue-500',
      'from-purple-400 to-purple-500',
      'from-green-400 to-green-500',
      'from-pink-400 to-pink-500',
      'from-orange-400 to-orange-500',
      'from-indigo-400 to-indigo-500',
    ];
    return gradients[index % gradients.length];
  };

  return (
    <div
      onClick={() => {
        const path = getNavigationPath(item);
        console.log("🔗 Navigating to:", path, "Item:", item);
        navigate(path);
      }}
      className={`group cursor-pointer ${isCarousel ? 'flex-shrink-0' : ''}`}
    >
      <div className="h-48 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 relative bg-gray-100">
        {hasImage ? (
          <ResponsiveImage
            src={item.imageUrl || item.image}
            cloudinaryId={item.cloudinaryId}
            alt={item.label || item.name}
            fallbackIcon={item.icon}
            className="w-full h-full object-cover"
            crop="fill"
          />
        ) : (
          <div 
            className={`absolute inset-0 flex items-center justify-center text-6xl opacity-70 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br ${getGradientColor(itemIndex)}`}
          >
            {item.icon || '📚'}
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        <button className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className={`px-6 py-2 bg-gradient-to-r ${theme.headerGradient} hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-full transition-all duration-200 shadow-lg hover:scale-105`}>
            Play Now
          </div>
        </button>
      </div>
      
      <div className="pt-3">
        <h3 className="text-sm font-bold text-transparent bg-gradient-to-r from-purple-700 to-pink-600 bg-clip-text mb-1 line-clamp-2">
          {item.title || item.label || item.name}
        </h3>
        {categoryName && (
          <p className="text-xs text-gray-500 mb-1">{categoryName}</p>
        )}
        {/* Show puzzle count if available, otherwise show difficulty */}
        {(item.puzzleCount || item.count) ? (
          <p className="text-xs text-gray-600 mb-2 font-medium">
            🎯 {item.puzzleCount || item.count || 0} Items
          </p>
        ) : item.difficulty ? (
          <p className="text-xs text-gray-600 mb-2 font-medium capitalize">
            📊 {item.difficulty} Difficulty
          </p>
        ) : null}
        {/* Show ratings if available */}
        {(item.rating !== undefined && item.rating !== null) && (
          <div className="flex items-center gap-1">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className={`text-sm ${star <= Math.floor(item.rating || 4.5) ? "text-yellow-400" : "text-gray-300"}`}>
                  ★
                </span>
              ))}
            </div>
            <span className="text-xs text-gray-500 ml-1">({(item.rating || 4.5).toFixed(1)})</span>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Carousel component for displaying many items in a scrollable grid
 * @param {Object} props - Component props
 * @param {Array} props.items - Array of topics/subtopics to display
 * @param {string} props.categoryName - Parent category name
 * @param {Object} props.categoryTheme - Theme object with colors
 * @param {number} props.catIndex - Index for color rotation
 * @param {Function} props.navigate - Navigation function
 * @param {Function} props.getNavigationPath - Function to determine navigation path
 */
export function CarouselSection({ items, categoryName, categoryTheme, catIndex, navigate, getNavigationPath }) {
  const containerRef = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  
  const cardWidth = 304; // w-56 (224px) + gap (6*16px/2 = 48px) + padding
  const containerWidth = 4 * cardWidth; // 4 cards visible
  const totalWidth = items.length * cardWidth;
  const maxScroll = Math.max(0, totalWidth - containerWidth);

  const scroll = (direction) => {
    if (!containerRef.current) return;
    
    let newPosition = scrollPosition + (direction === 'next' ? cardWidth : -cardWidth);
    newPosition = Math.max(0, Math.min(newPosition, maxScroll));
    setScrollPosition(newPosition);
    
    containerRef.current.scrollTo({
      left: newPosition,
      behavior: 'smooth',
    });
  };

  const canScrollNext = scrollPosition < maxScroll;
  const canScrollPrev = scrollPosition > 0;

  return (
    <div className="relative py-2">
      <div
        ref={containerRef}
        className="flex gap-6 overflow-x-hidden scroll-smooth"
        style={{ scrollBehavior: 'smooth' }}
      >
        {items.map((item, index) => (
          <div key={item.id} className="flex-shrink-0 w-56">
            <TopicCard 
              item={item}
              categoryName={categoryName}
              theme={categoryTheme}
              itemIndex={index}
              navigate={navigate}
              getNavigationPath={getNavigationPath}
              isCarousel={true}
            />
          </div>
        ))}
      </div>

      {canScrollPrev && (
        <button
          onClick={() => scroll('prev')}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full z-10 transition-all -ml-2"
        >
          ←
        </button>
      )}

      {canScrollNext && (
        <button
          onClick={() => scroll('next')}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full z-10 transition-all -mr-2"
        >
          →
        </button>
      )}
    </div>
  );
}

/**
 * Main section component that renders items in grid or carousel based on count
 * @param {Object} props - Component props
 * @param {Object} props.section - Section data with items array
 * @param {string} props.sectionTitle - Title of the section
 * @param {string} props.sectionDescription - Description of section
 * @param {string} props.parentName - Parent category/topic name
 * @param {Object} props.theme - Theme object
 * @param {number} props.sectionIndex - Index of section
 * @param {Function} props.navigate - Navigation function
 * @param {Function} props.getNavigationPath - Function to determine navigation path
 * @param {Function} props.onSeeAllClick - Callback for "See All" button
 */
export function ItemsSection({
  section,
  sectionTitle,
  sectionDescription,
  parentName,
  theme,
  sectionIndex,
  navigate,
  getNavigationPath,
  onSeeAllClick,
}) {
  const items = section.items || section.topics || section.subtopics || [];

  return (
    <div key={section.id} className={`${theme.bg} rounded-3xl p-8 lg:p-12 shadow-lg transition-shadow hover:shadow-xl`}>
      {/* Section Header */}
      <div className="mb-8 flex items-start justify-between">
        <div className="flex-1">
          <h2 className="text-2xl font-black text-transparent bg-gradient-to-r from-purple-700 to-pink-600 bg-clip-text mb-1">
            {sectionTitle}
          </h2>
          {sectionDescription && (
            <p className="text-gray-600 text-sm">{sectionDescription}</p>
          )}
        </div>
        {items.length > 4 && (
          <button 
            onClick={onSeeAllClick}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold text-sm rounded-lg flex items-center gap-1 whitespace-nowrap ml-4 shadow-md hover:shadow-lg transition-all"
          >
            See all ({items.length})
            <span>→</span>
          </button>
        )}
      </div>

      {/* Items Grid or Carousel */}
      {items.length === 0 ? (
        <p className="text-gray-400 text-center py-12 text-lg">No items available yet.</p>
      ) : items.length > 4 ? (
        <CarouselSection 
          items={items}
          categoryName={parentName}
          categoryTheme={theme}
          catIndex={sectionIndex}
          navigate={navigate}
          getNavigationPath={getNavigationPath}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, index) => (
            <TopicCard 
              key={item.id}
              item={item}
              categoryName={parentName}
              theme={theme}
              itemIndex={index}
              navigate={navigate}
              getNavigationPath={getNavigationPath}
            />
          ))}
        </div>
      )}
    </div>
  );
}
