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
import { getFeatureTilesConfig, getSortedVisibleSections } from "../../services/homePageSectionService";
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
    <div>
      <div className="flex items-center justify-between mb-8 md:mb-10 px-4 sm:px-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl">
            <span className="text-3xl md:text-4xl">📚</span>
          </div>
          <div>
            <h3 className="text-xl md:text-2xl font-black text-transparent bg-gradient-to-r from-purple-700 to-pink-600 bg-clip-text">All Topics</h3>
            <p className="text-xs md:text-sm text-gray-500 font-medium">Organized by learning subject</p>
          </div>
        </div>
        <button 
          onClick={() => navigate("/explore")}
          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold text-xs md:text-sm rounded-lg flex items-center gap-1 cursor-pointer whitespace-nowrap ml-4 shadow-md hover:shadow-lg transition-all duration-200"
        >
          See all ({topics.length})
          <span>→</span>
        </button>
      </div>

      {topics.length > 0 ? (
        <div className="relative py-2">
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
                    className="h-48 cursor-pointer rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 relative group bg-gray-100"
                    style={{ backgroundColor: hasImage ? '#f3f4f6' : '#e5e7eb' }}
                  >
                    {hasImage ? (
                      <ResponsiveImage
                        src={topic.imageUrl || topic.image}
                        cloudinaryId={topic.cloudinaryId}
                        alt={topic.title}
                        fallbackIcon={topic.icon}
                        className="w-full h-full object-contain"
                        crop="contain"
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
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-full transition-all duration-200 shadow-lg hover:scale-105">
                        ▶ Play Now
                      </button>
                    </div>
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
    <div>
      <div className="flex items-center justify-between mb-8 md:mb-10 px-4 sm:px-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-amber-100 to-orange-50 rounded-xl">
            <span className="text-3xl md:text-4xl">📖</span>
          </div>
          <div>
            <h3 className="text-xl md:text-2xl font-black text-transparent bg-gradient-to-r from-purple-700 to-pink-600 bg-clip-text">Featured Stories</h3>
            <p className="text-xs md:text-sm text-gray-500 font-medium">Immersive interactive narratives</p>
          </div>
        </div>
        <button 
          onClick={() => navigate("/stories")}
          className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold text-xs md:text-sm rounded-lg flex items-center gap-1 cursor-pointer whitespace-nowrap ml-4 shadow-md hover:shadow-lg transition-all duration-200"
        >
          See all ({stories.length})
          <span>→</span>
        </button>
      </div>

      {stories.length > 0 ? (
        <div className="relative py-2">
          <div
            ref={containerRef}
            className="flex gap-6 overflow-x-hidden scroll-smooth px-4"
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
                      className="h-48 cursor-pointer rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 relative group bg-gray-100"
                      style={{ backgroundColor: hasImage ? '#f3f4f6' : '#e5e7eb' }}
                    >
                      {hasImage ? (
                        <ResponsiveImage
                          src={story.coverImage || story.image}
                          cloudinaryId={story.cloudinaryId}
                          alt={story.title}
                          fallbackIcon="📖"
                          className="w-full h-full object-contain"
                          crop="contain"
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
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-full transition-all duration-200 shadow-lg">
                        ▶ Read Now
                      </button>
                    </div>
                  </div>
                  <div className="pt-4 px-1">
                    <h3 className="text-sm font-bold text-gray-900 mb-1 line-clamp-2">
                      {story.title}
                    </h3>
                    <p className="text-xs text-gray-600 mb-2 font-medium">
                      {story.description ? story.description.substring(0, 60) + "..." : "An interactive learning story"}
                    </p>
                    <p className="text-xs text-gray-700 font-semibold">
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
              style={{
                position: "absolute",
                left: 0,
                top: "50%",
                transform: "translateY(-50%)",
                background: "#6C63FF",
                color: "white",
                padding: "8px",
                borderRadius: "50%",
                border: "none",
                cursor: "pointer",
                zIndex: 10,
                transition: "all 0.2s ease",
                marginLeft: "-8px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#7B72FF";
                e.currentTarget.style.transform = "translateY(-50%) scale(1.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#6C63FF";
                e.currentTarget.style.transform = "translateY(-50%) scale(1)";
              }}
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
              style={{
                position: "absolute",
                right: 0,
                top: "50%",
                transform: "translateY(-50%)",
                background: "#6C63FF",
                color: "white",
                padding: "8px",
                borderRadius: "50%",
                border: "none",
                cursor: "pointer",
                zIndex: 10,
                transition: "all 0.2s ease",
                marginRight: "-8px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#7B72FF";
                e.currentTarget.style.transform = "translateY(-50%) scale(1.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#6C63FF";
                e.currentTarget.style.transform = "translateY(-50%) scale(1)";
              }}
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

  const getBackgroundColor = () => {
    const type = feature.featureType?.toLowerCase() || '';
    const colors = {
      quiz: 'from-blue-100 to-blue-50',
      puzzle: 'from-purple-100 to-purple-50',
      game: 'from-green-100 to-green-50',
      story: 'from-amber-100 to-orange-50',
    };
    return colors[type] || 'from-gray-100 to-gray-50';
  };

  const getButtonColor = () => {
    const type = feature.featureType?.toLowerCase() || '';
    const colors = {
      quiz: 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
      puzzle: 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700',
      game: 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
      story: 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700',
    };
    return colors[type] || 'bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700';
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8 md:mb-10 px-4 sm:px-6">
        <div className="flex items-center gap-4">
          <div className={`p-3 bg-gradient-to-br ${getBackgroundColor()} rounded-xl`}>
            <span className="text-3xl md:text-4xl">{feature.icon || getFeatureIcon(feature.featureType)}</span>
          </div>
          <div>
            <h3 className="text-xl md:text-2xl font-black text-transparent bg-gradient-to-r from-purple-700 to-pink-600 bg-clip-text">{feature.label || feature.name}</h3>
            {feature.description && (
              <p className="text-xs md:text-sm text-gray-500 font-medium mt-2">{feature.description}</p>
            )}
          </div>
        </div>
        <button 
          onClick={() => navigate(`/feature/${feature.id}`)}
          className={`px-4 py-2 text-white font-bold text-xs md:text-sm rounded-lg flex items-center gap-1 cursor-pointer whitespace-nowrap ml-4 shadow-md hover:shadow-lg transition-all duration-200 ${getButtonColor()}`}
        >
          See all ({categories.length})
          <span>→</span>
        </button>
      </div>

      {categories.length > 0 ? (
        <div className="relative py-3">
          <div
            ref={containerRef}
            className="flex gap-6 overflow-x-hidden scroll-smooth"
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
                    className="h-48 cursor-pointer rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 relative group bg-gray-100"
                    style={{ backgroundColor: hasImage ? '#f3f4f6' : '#e5e7eb' }}
                  >
                    {hasImage ? (
                      <ResponsiveImage 
                        src={category.imageUrl || category.image}
                        cloudinaryId={category.cloudinaryId}
                        alt={category.label || category.name}
                        fallbackIcon={category.icon || "📚"}
                        className="w-full h-full object-contain"
                        crop="contain"
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
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-full transition-all duration-200 shadow-lg hover:scale-105">
                        ▶ Play Now
                      </button>
                    </div>
                  </div>
                  
                  <div className="pt-4 px-1">
                    <h3 className="text-sm font-bold text-gray-900 mb-1 line-clamp-2">
                      {category.label || category.name}
                    </h3>
                    
                    <p className="text-xs text-gray-700 mb-2 font-semibold">
                      {feature.featureType === "puzzle" ? "🧩" : "🎯"} {category.subtopicCount !== undefined ? category.subtopicCount : (category.quizCount || 0)} {feature.featureType === "puzzle" ? "Puzzles" : "Quizzes"}
                    </p>
                    
                    {/* Rating display */}
                    <div className="flex items-center gap-1">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span key={star} className={`text-sm ${star <= Math.floor(category.rating || 4) ? "text-yellow-400" : "text-gray-300"}`}>
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="text-xs text-gray-600 ml-1 font-semibold">({(category.rating || 4.0).toFixed(1)})</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {canScrollPrev && (
            <button
              onClick={() => scroll("prev")}
              style={{
                position: "absolute",
                left: 0,
                top: "50%",
                transform: "translateY(-50%)",
                background: "#6C63FF",
                color: "white",
                padding: "8px",
                borderRadius: "50%",
                border: "none",
                cursor: "pointer",
                zIndex: 10,
                transition: "all 0.2s ease",
                marginLeft: "-8px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#7B72FF";
                e.currentTarget.style.transform = "translateY(-50%) scale(1.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#6C63FF";
                e.currentTarget.style.transform = "translateY(-50%) scale(1)";
              }}
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
              style={{
                position: "absolute",
                right: 0,
                top: "50%",
                transform: "translateY(-50%)",
                background: "#6C63FF",
                color: "white",
                padding: "8px",
                borderRadius: "50%",
                border: "none",
                cursor: "pointer",
                zIndex: 10,
                transition: "all 0.2s ease",
                marginRight: "-8px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#7B72FF";
                e.currentTarget.style.transform = "translateY(-50%) scale(1.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#6C63FF";
                e.currentTarget.style.transform = "translateY(-50%) scale(1)";
              }}
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
        <h3 className="text-2xl md:text-3xl font-black text-transparent bg-gradient-to-r from-purple-700 to-pink-600 bg-clip-text">{section.title}</h3>
        <button 
          onClick={() => navigate(`/feature/${section.featureId}`)}
          className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-bold text-xs md:text-sm rounded-lg flex items-center gap-1 cursor-pointer whitespace-nowrap shadow-md hover:shadow-lg transition-all duration-200"
        >
          See all ({section.categories.length})
          <span>→</span>
        </button>
      </div>

      {/* Carousel container with background */}
      <div className="relative py-2">
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
                  className="h-48 cursor-pointer rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 relative group bg-gray-100"
                  style={{ backgroundColor: hasImage ? '#f3f4f6' : '#e5e7eb' }}
                >
                  {hasImage ? (
                    <ResponsiveImage
                      src={category.imageUrl || category.image}
                      cloudinaryId={category.cloudinaryId}
                      alt={category.title}
                      fallbackIcon={category.icon}
                      className="w-full h-full object-contain"
                      crop="contain"
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-full transition-all duration-200 shadow-lg hover:scale-105">
                      ▶ Play Now
                    </button>
                  </div>
                </div>
                {/* Text Below Card */}
                <div className="pt-4 px-1">
                  <h3 className="text-sm font-bold text-gray-900 mb-1 line-clamp-2">
                    {category.title}
                  </h3>
                  <p className="text-xs text-gray-700 mb-2 font-semibold">
                    🎯 {Array.isArray(category.quizzes) ? category.quizzes.length : (category.quizzes || 0)} Quizzes
                  </p>
                  {/* Rating display */}
                  <div className="flex items-center gap-1">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} className={`text-sm ${star <= Math.floor(category.rating || 4) ? "text-yellow-400" : "text-gray-300"}`}>
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-xs text-gray-600 ml-1 font-semibold">({(category.rating || 4.0).toFixed(1)})</span>
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
  const [sectionConfig, setSectionConfig] = useState([]);
  const [visibleSections, setVisibleSections] = useState([]);

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

  // Load FeatureTiles section configuration
  useEffect(() => {
    const loadSectionConfig = async () => {
      try {
        const config = await getFeatureTilesConfig();
        setSectionConfig(config);
        const visible = getSortedVisibleSections(config);
        setVisibleSections(visible.map(s => s.id));
      } catch (error) {
        console.error("Error loading section config:", error);
      }
    };

    loadSectionConfig();
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

  // Helper function to check if a section should be visible
  const shouldShowSection = (sectionId) => {
    return visibleSections.includes(sectionId);
  };

  // Helper function to get section order
  const getSectionOrder = (sectionId) => {
    const section = sectionConfig.find(s => s.id === sectionId);
    return section?.order || 999;
  };

  const sections = createSections(categories);

  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-slate-50 via-purple-50 via-40% to-pink-50 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full blur-3xl -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-200/20 to-purple-200/20 rounded-full blur-3xl -ml-48 -mb-48"></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Main heading with enhanced visual hierarchy */}
        <div className="mb-16 md:mb-20 px-4 sm:px-6">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full">
            <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">Featured Content</span>
            <div className="w-2 h-2 rounded-full bg-pink-500 animate-pulse"></div>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-transparent bg-gradient-to-r from-purple-900 via-purple-700 to-pink-600 bg-clip-text leading-tight mb-4">
            Explore Learning & Gaming
          </h2>
          <p className="text-lg sm:text-xl text-gray-700 mt-4 max-w-3xl font-medium leading-relaxed">
            Master skills through engaging <span className="text-purple-600 font-bold">quizzes</span>, mind-bending <span className="text-pink-600 font-bold">puzzles</span>, interactive <span className="text-blue-600 font-bold">games</span>, and captivating <span className="text-amber-600 font-bold">stories</span>
          </p>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="text-center py-16">
            <p className="text-gray-600">Loading categories...</p>
          </div>
        )}

        {/* 1. Quizzes Feature Section */}
        {!loading && shouldShowSection("quizzes") && featuresWithCategories.length > 0 && (() => {
          const quizzesSection = featuresWithCategories.find(item => item.feature.id === 'quizzes' || item.feature.featureType === 'quiz');
          return quizzesSection ? (
            <div className="mb-20 md:mb-24">
              <FeatureCarouselSection feature={quizzesSection.feature} categories={quizzesSection.categories} />
            </div>
          ) : null;
        })()}

        {/* 2. Puzzles Feature Section */}
        {!loading && shouldShowSection("puzzles") && featuresWithCategories.length > 0 && (() => {
          const puzzlesSection = featuresWithCategories.find(item => item.feature.id === 'puzzles' || item.feature.featureType === 'puzzle');
          return puzzlesSection ? (
            <div className="mt-20 md:mt-24 mb-20 md:mb-24 px-4 sm:px-6 pt-16 md:pt-20 border-t-2 border-gradient-to-r border-purple-200/50">
              <FeatureCarouselSection feature={puzzlesSection.feature} categories={puzzlesSection.categories} />
            </div>
          ) : null;
        })()}

        {/* 3. Stories section with visual separator */}
        {!loading && shouldShowSection("stories") && stories.length > 0 && (
          <div className="mt-20 md:mt-24 mb-20 md:mb-24 px-4 sm:px-6 pt-16 md:pt-20 border-t-2 border-orange-200/50">
            <StoriesCarouselSection stories={stories} />
          </div>
        )}

        {/* 4. Games Feature Section */}
        {!loading && shouldShowSection("games") && featuresWithCategories.length > 0 && (() => {
          const gamesSection = featuresWithCategories.find(item => item.feature.id === 'games' || item.feature.featureType === 'game');
          return gamesSection ? (
            <div className="mt-20 md:mt-24 mb-20 md:mb-24 px-4 sm:px-6 pt-16 md:pt-20 border-t-2 border-blue-200/50">
              <FeatureCarouselSection feature={gamesSection.feature} categories={gamesSection.categories} />
            </div>
          ) : null;
        })()}

        {/* 5. Latest Added (Top 10) section with visual separator */}
        {!loading && shouldShowSection("latestAdded") && sections.length > 0 && sections[1] && (
          <div className="mt-20 md:mt-24 mb-20 md:mb-24 px-4 sm:px-6 pt-16 md:pt-20 border-t-2 border-green-200/50">
            <CarouselSection section={sections[1]} />
          </div>
        )}

        {/* 6. All Categories section with visual separator */}
        {!loading && shouldShowSection("allCategories") && sections.length > 0 && sections[0] && (
          <div className="mt-20 md:mt-24 mb-20 md:mb-24 px-4 sm:px-6 pt-16 md:pt-20 border-t-2 border-amber-200/50">
            <CarouselSection section={sections[0]} />
          </div>
        )}

        {/* 7. All Topics section with visual separator */}
        {!loading && shouldShowSection("allTopics") && topics.length > 0 && (
          <div className="mt-20 md:mt-24 mb-20 md:mb-24 px-4 sm:px-6 pt-16 md:pt-20 border-t-2 border-cyan-200/50">
            <TopicsCarouselSection topics={topics} />
          </div>
        )}

        {/* Puzzles Carousel with visual separator */}
        {puzzles.length > 0 && (
          <div className="mt-20 md:mt-24 mb-16 px-4 sm:px-6 pt-16 md:pt-20 border-t-2 border-purple-200/50">
            <div className="flex items-start gap-2 mb-6">
              <span className="text-2xl md:text-3xl">🧩</span>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 pt-1">Fun Puzzles</h3>
            </div>
            <div className="flex gap-6 overflow-x-auto pb-2">
              {puzzles.map(puzzle => (
                <PuzzleCard key={puzzle.id} puzzle={puzzle} />
              ))}
            </div>
          </div>
        )}

        {/* No categories message */}
        {!loading && categories.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-600">No categories available yet. Check back soon!</p>
          </div>
        )}
      </div>
    </section>
  );
}