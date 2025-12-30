// src/home/components/FeatureTiles.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../../components/ui";
import { ResponsiveImage } from "../../components/OptimizedImage";
import { db } from "../../firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { getPuzzlesByCategory } from "../../quiz/services/puzzleService";
import PuzzleCard from "../../puzzles/PuzzleCard";
import CategoryCardItem, { colorSchemes } from "../../components/navigation/CategoryCardItem";
import { getAllStories } from "../../services/storyService";
import { FEATURES } from "../../constants/FEATURES";

// Topics carousel component
function TopicsCarouselSection({ topics }) {
  const navigate = useNavigate();
  const [scrollPosition, setScrollPosition] = useState(0);
  const containerRef = React.useRef(null);
  
  const itemsPerView = 4;
  const itemWidth = 240; // width of card + gap
  const totalWidth = topics.length * itemWidth;
  const containerWidth = itemsPerView * itemWidth;
  const maxScroll = Math.max(0, totalWidth - containerWidth);

  const scroll = (direction) => {
    if (!containerRef.current) return;
    
    let newPosition = scrollPosition + (direction === "next" ? itemWidth : -itemWidth);
    newPosition = Math.max(0, Math.min(newPosition, maxScroll));
    setScrollPosition(newPosition);
    
    containerRef.current.scrollTo({
      left: newPosition,
      behavior: "smooth",
    });
  };

  const canScrollNext = scrollPosition < maxScroll;
  const canScrollPrev = scrollPosition > 0;

  return (
    <div className="mb-16">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="text-4xl">📚</span>
          <h3 className="text-2xl font-bold text-gray-900">All Topics</h3>
        </div>
        <button 
          onClick={() => navigate("/explore")}
          className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center gap-1 cursor-pointer"
        >
          See all ({topics.length})
          <span>→</span>
        </button>
      </div>

      {topics.length > 0 ? (
        <div className="relative group bg-gradient-to-r from-transparent via-white via-5% to-transparent bg-opacity-30 rounded-lg py-2">
          <div
            ref={containerRef}
            className="flex gap-6 overflow-x-hidden scroll-smooth"
            style={{ scrollBehavior: "smooth" }}
          >
            {topics.map((topic, index) => {
              const colorScheme = colorSchemes[index % colorSchemes.length];
              const hasImage = topic.imageUrl || topic.image;
              return (
                <div key={topic.id} className="flex-shrink-0 w-56">
                  <div
                    onClick={() => navigate(topic.path)}
                    className="h-40 cursor-pointer rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 relative group"
                    style={{ backgroundColor: hasImage ? 'transparent' : '#e5e7eb' }}
                  >
                    {hasImage ? (
                      <ResponsiveImage
                        src={topic.imageUrl || topic.image}
                        cloudinaryId={topic.cloudinaryId}
                        alt={topic.title}
                        fallbackIcon={topic.icon}
                        className="w-full h-full"
                        crop="fit"
                      />
                    ) : (
                      <div 
                        className="absolute inset-0 flex items-center justify-center text-6xl opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                        style={{
                          background: getGradientFromColorScheme(colorScheme.color),
                          zIndex: 1,
                        }}
                      >
                        {topic.icon}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="pt-3">
                    <h3 className="text-sm font-bold text-gray-800 mb-1 line-clamp-2">
                      {topic.title}
                    </h3>
                    <p className="text-xs text-gray-500 mb-1">
                      {topic.categoryName}
                    </p>
                    <p className="text-xs text-gray-600 mb-2 font-medium">
                    {topic.quizzes || 0} Quizzes
                    </p>
                    {/* Rating display */}
                    <div className="flex items-center gap-1">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span key={star} className={`text-lg ${star <= Math.floor(topic.rating || 4) ? "text-yellow-400" : "text-gray-300"}`}>
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="text-xs text-gray-500 ml-1">({(topic.rating || 4.0).toFixed(1)})</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {canScrollPrev && (
            <button
              onClick={() => scroll("prev")}
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full z-10 transition-all -ml-2"
              aria-label="Scroll left"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {canScrollNext && (
            <button
              onClick={() => scroll("next")}
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full z-10 transition-all -mr-2"
              aria-label="Scroll right"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-gray-600">No topics published yet.</p>
        </div>
      )}
    </div>
  );
}

// Stories carousel component
function StoriesCarouselSection({ stories }) {
  const navigate = useNavigate();
  const [scrollPosition, setScrollPosition] = useState(0);
  const containerRef = React.useRef(null);
  
  console.log('📖 StoriesCarouselSection received stories:', stories);
  
  const itemsPerView = 4;
  const itemWidth = 240; // width of card + gap
  const totalWidth = stories.length * itemWidth;
  const containerWidth = itemsPerView * itemWidth;
  const maxScroll = Math.max(0, totalWidth - containerWidth);

  const scroll = (direction) => {
    if (!containerRef.current) return;
    
    let newPosition = scrollPosition + (direction === "next" ? itemWidth : -itemWidth);
    newPosition = Math.max(0, Math.min(newPosition, maxScroll));
    setScrollPosition(newPosition);
    
    containerRef.current.scrollTo({
      left: newPosition,
      behavior: "smooth",
    });
  };

  const canScrollNext = scrollPosition < maxScroll;
  const canScrollPrev = scrollPosition > 0;

  return (
    <div className="mb-16">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="text-4xl">📖</span>
          <h3 className="text-2xl font-bold text-gray-900">Featured Stories</h3>
        </div>
        <button 
          onClick={() => navigate("/stories")}
          className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center gap-1 cursor-pointer"
        >
          See all ({stories.length})
          <span>→</span>
        </button>
      </div>

      {stories.length > 0 ? (
        <div className="relative group bg-gradient-to-r from-transparent via-white via-5% to-transparent bg-opacity-30 rounded-lg py-2">
          <div
            ref={containerRef}
            className="flex gap-6 overflow-x-hidden scroll-smooth"
            style={{ scrollBehavior: "smooth" }}
          >
            {stories.map((story, index) => {
              try {
                const colorScheme = colorSchemes[index % colorSchemes.length];
                const hasImage = story.coverImage || story.image;
                console.log(`Rendering story ${index}:`, story.id, story.title, 'hasImage:', hasImage);
                
                return (
                  <div key={story.id} className="flex-shrink-0 w-56">
                    <div
                      onClick={() => navigate(`/story/${story.id}`)}
                      className="h-40 cursor-pointer rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 relative group"
                      style={{ backgroundColor: hasImage ? 'transparent' : '#e5e7eb' }}
                    >
                      {hasImage ? (
                        <ResponsiveImage
                          src={story.coverImage || story.image}
                          cloudinaryId={story.cloudinaryId}
                          alt={story.title}
                          fallbackIcon="📖"
                          className="w-full h-full"
                          crop="fit"
                        />
                      ) : (
                        <div 
                          className="absolute inset-0 flex items-center justify-center text-6xl opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                          style={{
                            background: getGradientFromColorScheme(colorScheme.color),
                            zIndex: 1,
                          }}
                        >
                          📖
                        </div>
                      )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="pt-3">
                    <h3 className="text-sm font-bold text-gray-800 mb-1 line-clamp-2">
                      {story.title}
                    </h3>
                    <p className="text-xs text-gray-500 mb-2">
                      {story.description ? story.description.substring(0, 60) + "..." : "An interactive learning story"}
                    </p>
                    <p className="text-xs text-gray-600 font-medium">
                      📚 {story.chapterCount || story.totalChapters || 0} Chapters
                    </p>
                  </div>
                </div>
                );
              } catch (error) {
                console.error('❌ Error rendering story:', error, story);
                return null;
              }
            })}
          </div>

          {canScrollPrev && (
            <button
              onClick={() => scroll("prev")}
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full z-10 transition-all -ml-2"
              aria-label="Scroll left"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {canScrollNext && (
            <button
              onClick={() => scroll("next")}
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full z-10 transition-all -mr-2"
              aria-label="Scroll right"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-gray-600">No stories available yet. Check back soon!</p>
        </div>
      )}
    </div>
  );
}

// Feature carousel component
function FeatureCarouselSection({ feature, categories }) {
  const navigate = useNavigate();
  const [scrollPosition, setScrollPosition] = useState(0);
  const containerRef = React.useRef(null);
  
  const itemsPerView = 4;
  const itemWidth = 240; // width of card + gap
  const totalWidth = categories.length * itemWidth;
  const containerWidth = itemsPerView * itemWidth;
  const maxScroll = Math.max(0, totalWidth - containerWidth);

  const scroll = (direction) => {
    if (!containerRef.current) return;
    
    let newPosition = scrollPosition + (direction === "next" ? itemWidth : -itemWidth);
    newPosition = Math.max(0, Math.min(newPosition, maxScroll));
    setScrollPosition(newPosition);
    
    containerRef.current.scrollTo({
      left: newPosition,
      behavior: "smooth",
    });
  };

  const canScrollNext = scrollPosition < maxScroll;
  const canScrollPrev = scrollPosition > 0;

  const getFeatureIcon = (featureType) => {
    const icons = {
      quiz: "🎯",
      puzzle: "🧩",
      game: "🎮",
      challenge: "🏆",
    };
    return icons[featureType] || "✨";
  };

  return (
    <div className="mb-16">
      <div className="flex items-center justify-between mb-6 px-4">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{feature.icon || getFeatureIcon(feature.featureType)}</span>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">{feature.label || feature.name}</h3>
            {feature.description && (
              <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
            )}
          </div>
        </div>
        <button 
          onClick={() => navigate(`/feature/${feature.id}`)}
          className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center gap-1 cursor-pointer"
        >
          See all ({categories.length})
          <span>→</span>
        </button>
      </div>

      {categories.length > 0 ? (
        <div className="relative group bg-gradient-to-r from-transparent via-white via-5% to-transparent bg-opacity-30 rounded-lg py-2">
          <div
            ref={containerRef}
            className="flex gap-6 overflow-x-hidden scroll-smooth px-4"
            style={{ scrollBehavior: "smooth" }}
          >
            {categories.map((category, index) => {
              const colorScheme = colorSchemes[index % colorSchemes.length];
              const hasImage = category.imageUrl || category.image;
              
              return (
                <div key={category.id} className="flex-shrink-0 w-56">
                  <div
                    onClick={() => {
                      if (feature.featureType === "puzzle") {
                        navigate(`/puzzle/${encodeURIComponent(category.name || category.label)}`);
                      } else {
                        navigate(`/quiz/${encodeURIComponent(category.name || category.label)}`);
                      }
                    }}
                    className="h-40 cursor-pointer rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 relative group"
                    style={{ backgroundColor: hasImage ? 'transparent' : '#e5e7eb' }}
                  >
                    {hasImage ? (
                      <ResponsiveImage 
                        src={category.imageUrl || category.image}
                        cloudinaryId={category.cloudinaryId}
                        alt={category.label || category.name}
                        fallbackIcon={category.icon || "📚"}
                        className="w-full h-full"
                        crop="fit"
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
                      {category.label || category.name}
                    </h3>
                    
                    <p className="text-xs text-gray-600 mb-2 font-medium">
                      {category.subtopicCount !== undefined ? category.subtopicCount : (category.quizCount || 0)} {feature.featureType === "puzzle" ? "Puzzles" : "Quizzes"}
                    </p>
                    
                    {/* Rating display */}
                    <div className="flex items-center gap-1">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span key={star} className={`text-lg ${star <= Math.floor(category.rating || 4) ? "text-yellow-400" : "text-gray-300"}`}>
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="text-xs text-gray-500 ml-1">({(category.rating || 4.0).toFixed(1)})</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {canScrollPrev && (
            <button
              onClick={() => scroll("prev")}
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full z-10 transition-all -ml-2"
              aria-label="Scroll left"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {canScrollNext && (
            <button
              onClick={() => scroll("next")}
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full z-10 transition-all -mr-2"
              aria-label="Scroll right"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-gray-600">No categories published yet for this feature.</p>
        </div>
      )}
    </div>
  );
}
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

// Default color schemes for categories
// NOTE: Now imported from CategoryCardItem for consistency
// const colorSchemes = [...]

// Helper function to generate consistent rating based on category ID and quiz count
const generateRealisticRating = (quizCount = 0, categoryId = '') => {
  // Base rating between 3.8 and 5.0
  const minRating = 3.8;
  const maxRating = 5.0;
  
  // Factor 1: More quizzes = slightly higher rating (up to 0.5 points)
  const quizFactor = Math.min(quizCount / 100, 0.5);
  
  // Factor 2: Consistent pseudo-random based on category ID (±0.2)
  // Use simple hash of category ID to generate consistent value
  let hash = 0;
  for (let i = 0; i < categoryId.length; i++) {
    hash = ((hash << 5) - hash) + categoryId.charCodeAt(i);
    hash = hash & hash; // Convert to 32bit integer
  }
  const normalizedHash = (Math.abs(hash) % 100) / 100; // 0-1
  const consistentFactor = (normalizedHash - 0.5) * 0.4; // -0.2 to +0.2
  
  // Calculate final rating
  let rating = minRating + quizFactor + consistentFactor;
  
  // Ensure it stays within bounds
  rating = Math.max(minRating, Math.min(maxRating, rating));
  
  // Round to 1 decimal place
  return Math.round(rating * 10) / 10;
};

// Default categories (fallback when no data from Firebase)
const defaultCategories = [
  {
    title: "Art & Literature",
    icon: "🎨",
    quizzes: 42,
    difficulty: "Easy",
    path: "/quiz/kids",
    color: "from-rose-400 via-pink-300 to-rose-300",
    borderColor: "from-pink-300 to-rose-200",
  },
  {
    title: "Entertainment",
    icon: "🎬",
    quizzes: 38,
    difficulty: "Easy",
    path: "/quiz/movies",
    color: "from-amber-400 via-orange-300 to-yellow-300",
    borderColor: "from-orange-300 to-yellow-200",
  },
  {
    title: "Geography",
    icon: "🌍",
    quizzes: 45,
    difficulty: "Medium",
    path: "/quiz/students",
    color: "from-blue-400 via-cyan-300 to-blue-300",
    borderColor: "from-blue-300 to-cyan-200",
  },
  {
    title: "History",
    icon: "🏛️",
    quizzes: 52,
    difficulty: "Medium",
    path: "/quiz/programming",
    color: "from-orange-400 via-amber-300 to-yellow-300",
    borderColor: "from-amber-300 to-yellow-200",
  },
  {
    title: "Languages",
    icon: "🗣️",
    quizzes: 35,
    difficulty: "Hard",
    path: "/quiz/kids",
    color: "from-emerald-400 via-green-300 to-teal-300",
    borderColor: "from-green-300 to-teal-200",
  },
  {
    title: "Science & Nature",
    icon: "🔬",
    quizzes: 48,
    difficulty: "Medium",
    path: "/quiz/students",
    color: "from-cyan-400 via-teal-300 to-blue-300",
    borderColor: "from-cyan-300 to-teal-200",
  },
  {
    title: "Sports",
    icon: "⚽",
    quizzes: 40,
    difficulty: "Easy",
    path: "/quiz/programming",
    color: "from-red-400 via-orange-300 to-amber-300",
    borderColor: "from-red-300 to-orange-200",
  },
  {
    title: "Trivia",
    icon: "🧠",
    quizzes: 60,
    difficulty: "Hard",
    path: "/quiz/kids",
    color: "from-purple-400 via-violet-300 to-pink-300",
    borderColor: "from-purple-300 to-pink-200",
  },
];

// Section configurations - Netflix/Prime style
const createSections = (categories) => [
  {
    title: "🔥 All Categories",
    categories: categories.slice(0, 8),
  },
  {
    title: "⭐ Latest Added",
    categories: categories.slice(0, 8), // Already sorted by newest first
  },
];

// Carousel component for horizontal scrolling
function CarouselSection({ section }) {
  const navigate = useNavigate();
  const [scrollPosition, setScrollPosition] = useState(0);
  const containerRef = React.useRef(null);
  
  const itemsPerView = 4;
  const itemWidth = 240; // Reduced from 280 - Width of each card + gap
  const maxScroll = Math.max(0, (section.categories.length - itemsPerView) * itemWidth);

  const scroll = (direction) => {
    let newPosition = scrollPosition + (direction === "next" ? itemWidth : -itemWidth);
    newPosition = Math.max(0, Math.min(newPosition, maxScroll));
    setScrollPosition(newPosition);
    
    if (containerRef.current) {
      containerRef.current.scrollTo({
        left: newPosition,
        behavior: "smooth",
      });
    }
  };

  const canScrollNext = scrollPosition < maxScroll;
  const canScrollPrev = scrollPosition > 0;

  return (
    <div className="mb-12">
      {/* Header with See All */}
      <div className="flex items-center justify-between mb-6 px-4">
        <h3 className="text-2xl font-bold text-gray-900">{section.title}</h3>
        <button 
          onClick={() => navigate(`/feature/${section.featureId}`)}
          className="text-primary-600 hover:text-primary-700 font-semibold text-sm flex items-center gap-1 cursor-pointer"
        >
          See all ({section.categories.length})
          <span>→</span>
        </button>
      </div>

      {/* Carousel container with background */}
      <div className="relative group bg-gradient-to-r from-transparent via-white via-5% to-transparent bg-opacity-30 rounded-lg py-2">
        {/* Carousel */}
        <div
          ref={containerRef}
          className="flex gap-6 overflow-x-hidden scroll-smooth px-4"
          style={{ scrollBehavior: "smooth" }}
        >
          {section.categories.map((category, index) => {
            const colorScheme = colorSchemes[index % colorSchemes.length];
            const hasImage = category.imageUrl || category.image;
            return (
              <div key={category.title} className="flex-shrink-0 w-56">
                {/* Card Image */}
                <div
                  onClick={() => navigate(category.path)}
                  className="h-40 cursor-pointer rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 relative group"
                  style={{ backgroundColor: hasImage ? 'transparent' : '#e5e7eb' }}
                >
                  {hasImage ? (
                    <ResponsiveImage
                      src={category.imageUrl || category.image}
                      cloudinaryId={category.cloudinaryId}
                      alt={category.title}
                      fallbackIcon={category.icon}
                      className="w-full h-full"
                      crop="fit"
                    />
                  ) : (
                    <div 
                      className="absolute inset-0 flex items-center justify-center text-6xl opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        background: getGradientFromColorScheme(colorScheme.color),
                        zIndex: 1,
                      }}
                    >
                      {category.icon}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                {/* Text Below Card */}
                <div className="pt-3">
                  <h3 className="text-sm font-bold text-gray-800 mb-1 line-clamp-2">
                    {category.title}
                  </h3>
                  <p className="text-xs text-gray-600 mb-2 font-medium">
                    {Array.isArray(category.quizzes) ? category.quizzes.length : (category.quizzes || 0)} Quizzes
                  </p>
                  {/* Rating display */}
                  <div className="flex items-center gap-1 mb-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} className={`text-sm ${star <= Math.floor(category.rating || 4) ? "text-yellow-400" : "text-gray-300"}`}>
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-xs text-gray-500 ml-1">({(category.rating || 4.0).toFixed(1)})</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Left arrow */}
        {canScrollPrev && (
          <button
            onClick={() => scroll("prev")}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full z-10 transition-all -ml-2"
            aria-label="Scroll left"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Right arrow */}
        {canScrollNext && (
          <button
            onClick={() => scroll("next")}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full z-10 transition-all -mr-2"
            aria-label="Scroll right"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

export default function FeatureTiles() {
  const [categories, setCategories] = useState(defaultCategories);
  const [topics, setTopics] = useState([]);
  const [featuresWithCategories, setFeaturesWithCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [puzzles, setPuzzles] = useState([]);
  const [stories, setStories] = useState([]);

  useEffect(() => {
    const loadCategoriesAndFeatures = async () => {
      try {
        // Load categories, features, and topics
        const [categorySnapshot, featureSnapshot, topicSnapshot, subtopicSnapshot] = await Promise.all([
          getDocs(collection(db, "categories")),
          getDocs(collection(db, "features")),
          getDocs(collection(db, "topics")),
          getDocs(collection(db, "subtopics"))
        ]);

        // Create a map of feature IDs to feature labels
        const featureMap = {};
        const featuresData = [];
        featureSnapshot.docs.forEach(doc => {
          const data = doc.data();
          featureMap[doc.id] = data.label || data.name || "Items";
          featuresData.push({ id: doc.id, ...data });
        });

        // Build a map of categoryId to subtopic count
        const subtopicsData = subtopicSnapshot.docs.map(doc => doc.data());
        const subtopicCountMap = {};
        subtopicsData.forEach(sub => {
          if (sub.categoryId) {
            subtopicCountMap[sub.categoryId] = (subtopicCountMap[sub.categoryId] || 0) + 1;
          }
        });

        // Create a map of category IDs to category data
        const categoryMap = {};
        categorySnapshot.docs.forEach(doc => {
          categoryMap[doc.id] = { id: doc.id, ...doc.data() };
        });

        // Process topics
        const topicsData = topicSnapshot.docs
          .map(doc => {
            const data = doc.data();
            const category = categoryMap[data.categoryId];
            const colorScheme = colorSchemes[Math.floor(Math.random() * colorSchemes.length)];
            return {
              id: doc.id,
              title: data.name || data.label,
              icon: data.icon || "📖",
              quizzes: data.quizCount || 0,
              categoryName: category?.name || category?.label || "Unknown",
              categoryId: data.categoryId,
              featureName: "Topics",
              difficulty: "Medium",
              path: `/quiz/${encodeURIComponent(category?.name || category?.label || '')}/${encodeURIComponent(data.name || data.label || '')}`,
              color: colorScheme.color,
              borderColor: colorScheme.borderColor,
              isPublished: data.isPublished !== false,
              createdAt: data.createdAt || new Date().toISOString(),
              rating: generateRealisticRating(data.quizCount || 0, doc.id),
              imageUrl: data.imageUrl || "",
              image: data.image || "",
              cloudinaryId: data.cloudinaryId || "",
              subtopics: data.subtopics || [],
              subtopicCount: data.subtopicCount || 0,
            };
          })
          .filter((topic) => topic.isPublished && topic.categoryName !== "Unknown")
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        if (topicsData.length > 0) {
          setTopics(topicsData);
        }

        const categoriesData = categorySnapshot.docs
          .map((doc) => {
            const data = doc.data();
            const colorScheme = colorSchemes[Math.floor(Math.random() * colorSchemes.length)];
            
            // Find feature by featureId or uiMode
            let featureData = featuresData.find(f => f.id === data.featureId);
            if (!featureData && data.uiMode) {
              // For puzzle categories with uiMode: "puzzle", match with "puzzles" feature
              const singularToPlural = {
                "puzzle": "puzzles",
                "quiz": "quizzes",
                "game": "games",
                "story": "stories"
              };
              const pluralForm = singularToPlural[data.uiMode] || data.uiMode + "s";
              featureData = featuresData.find(f => f.id === pluralForm || f.name === pluralForm);
            }
            
            const featureType = featureData?.type || featureData?.featureType || featureData?.name?.toLowerCase() || "quiz";
            const featureName = featureMap[data.featureId] || (featureData?.label) || "Quizzes";
            const categoryName = data.label || data.name;
            const subtopicCount = subtopicCountMap[doc.id] || 0;
            
            // Determine the correct route path based on feature type
            let path = `/quiz/${encodeURIComponent(categoryName)}`;
            if (featureType === "puzzle" || featureType === "puzzles") {
              path = `/puzzle/${encodeURIComponent(categoryName)}`;
            } else if (featureType === "story" || featureType === "stories") {
              path = `/stories/category/${encodeURIComponent(categoryName)}`;
            }
            
              return {
                id: doc.id,
                title: categoryName,
                icon: data.icon || "📚",
                quizzes: subtopicCount,
                featureName: featureName,
                featureType: featureType,
                difficulty: "Medium",
                path: path,
                color: colorScheme.color,
                borderColor: colorScheme.borderColor,
                isPublished: data.isPublished || false,
                createdAt: data.createdAt || new Date().toISOString(),
                rating: generateRealisticRating(subtopicCount || 0, doc.id),
                imageUrl: data.imageUrl || "",
                image: data.image || "",
                cloudinaryId: data.cloudinaryId || "",
                subtopics: [],
                subtopicCount,
              };
          })
          .filter((cat) => cat.isPublished === true)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        if (categoriesData.length > 0) {
          setCategories(categoriesData);
        }

        // Set loading to false early so UI renders while features are being processed
        setLoading(false);

        // Group categories by feature (only published) - this can happen in background
        const result = featuresData
          .map((feature) => {
            const categories = categorySnapshot.docs
              .map(doc => {
                const data = doc.data();
                const categoryName = data.label || data.name;
                const categorySubtopicCount = subtopicCountMap[doc.id] || 0;
                return {
                  id: doc.id,
                  name: categoryName,
                  label: categoryName,
                  title: categoryName,
                  icon: data.icon || "📚",
                  quizCount: categorySubtopicCount,
                  puzzleCount: categorySubtopicCount,
                  subtopicCount: categorySubtopicCount,
                  featureId: data.featureId,
                  uiMode: data.uiMode,
                  isPublished: data.isPublished,
                  createdAt: data.createdAt,
                  rating: generateRealisticRating(categorySubtopicCount || 0, doc.id),
                  imageUrl: data.imageUrl || "",
                  image: data.image || "",
                  cloudinaryId: data.cloudinaryId || "",
                };
              })
              .filter(cat => {
                // Check if category matches feature by multiple methods
                const isPublished = cat.isPublished === true;
                const matchesFeatureId = cat.featureId === feature.id;
                const matchesUiMode = cat.uiMode === feature.id.slice(0, -1); // "puzzles" -> "puzzle"
                return isPublished && (matchesFeatureId || matchesUiMode);
              });
            return { feature, categories };
          })
          .filter(item => item.categories.length > 0)
          .sort((a, b) => {
            const aDate = a.feature.createdAt || "";
            const bDate = b.feature.createdAt || "";
            return new Date(bDate) - new Date(aDate);
          });

        setFeaturesWithCategories(result);
      } catch (error) {
        console.error("Error loading categories:", error);
        setCategories(defaultCategories);
        setLoading(false);
      }
    };

    loadCategoriesAndFeatures();
  }, []);

  useEffect(() => {
    getPuzzlesByCategory("Kids Learning").then(setPuzzles); // Example: load for one category
  }, []);

  // Load stories
  useEffect(() => {
    const loadStories = async () => {
      try {
        const storiesList = await getAllStories();
        console.log('Loaded stories for HomePage:', storiesList);
        setStories(storiesList || []);
      } catch (error) {
        console.error("Error loading stories:", error);
        setStories([]);
      }
    };

    loadStories();
  }, []);

  // Load puzzle counts for all puzzle categories (non-blocking)
  // DISABLED: This was causing slow loading by fetching all puzzles for each category
  // Instead, use the quizCount field that's already in the database
  // useEffect(() => {
  //   const loadPuzzleCounts = async () => {
  //     if (featuresWithCategories.length === 0) return;
  //     
  //     // Update puzzle counts in the background without blocking rendering
  //     featuresWithCategories.forEach((item) => {
  //       if (item.feature.featureType === 'puzzle') {
  //         item.categories.forEach(async (cat) => {
  //           const puzzleCount = await countPuzzlesForCategory(cat.id, cat.name || cat.label);
  //           // Update the specific category with its count
  //           setFeaturesWithCategories(prev => {
  //             return prev.map(prevItem => {
  //               if (prevItem.feature.id === item.feature.id) {
  //                 return {
  //                   ...prevItem,
  //                   categories: prevItem.categories.map(prevCat => 
  //                     prevCat.id === cat.id ? { ...prevCat, puzzleCount } : prevCat
  //                   )
  //                 };
  //               }
  //               return prevItem;
  //             });
  //           });
  //         });
  //       }
  //     });
  //   };
  //   
  //   loadPuzzleCounts();
  // }, [featuresWithCategories]);

  const sections = createSections(categories);

  return (
    <section className="py-12 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Main heading */}
        <div className="mb-12 px-4">
          <h2 className="text-4xl font-bold text-gray-900">Explore Learning & Gaming</h2>
          <p className="text-gray-600 mt-2">Discover quizzes, puzzles, games, studies, and challenges across multiple categories</p>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading categories...</p>
          </div>
        )}

        {/* Carousel sections */}
        {!loading && sections.map((section) => (
          <CarouselSection key={section.title} section={section} />
        ))}

        {/* All Topics section */}
        {!loading && topics.length > 0 && (
          <div className="mb-16 px-4">
            <TopicsCarouselSection topics={topics} />
          </div>
        )}

        {/* Stories section */}
        {!loading && stories.length > 0 && (
          <div className="mb-16 px-4">
            <StoriesCarouselSection stories={stories} />
          </div>
        )}

        {/* Feature sections after Latest Added (no heading) */}
        {!loading && featuresWithCategories.length > 0 && (
          <div className="px-4 mt-16">
            {featuresWithCategories.map((item) => (
              <FeatureCarouselSection
                key={item.feature.id}
                feature={item.feature}
                categories={item.categories}
              />
            ))}
          </div>
        )}

        {/* Puzzles Carousel */}
        {puzzles.length > 0 && (
          <div className="mb-16 px-4">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">🧩 Fun Puzzles</h3>
            <div className="flex gap-6 overflow-x-auto">
              {puzzles.map(puzzle => (
                <PuzzleCard key={puzzle.id} puzzle={puzzle} />
              ))}
            </div>
          </div>
        )}

        {/* No categories message */}
        {!loading && categories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No categories available yet. Check back soon!</p>
          </div>
        )}
      </div>
    </section>
  );
}