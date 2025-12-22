// src/home/components/FeatureTiles.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../../components/ui";
import { db } from "../../firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

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
          <div>
            <h3 className="text-2xl font-bold text-gray-900">All Topics</h3>
            <p className="text-sm text-gray-600 mt-1">Browse all topics across categories</p>
          </div>
        </div>
        <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center gap-1">
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
            {topics.map((topic) => (
              <div key={topic.id} className="flex-shrink-0 w-56">
                <div
                  onClick={() => navigate(topic.path)}
                  className={`h-40 cursor-pointer rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 relative bg-gradient-to-br ${topic.color}`}
                >
                  <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-70 hover:opacity-100 transition-opacity duration-300">
                    {topic.icon}
                  </div>
                  
                  <div className="absolute inset-0 bg-black opacity-0 hover:opacity-10 transition-opacity duration-300"></div>
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
            ))}
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
        <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center gap-1">
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
              return (
                <div key={category.id} className="flex-shrink-0 w-56">
                  <div
                    onClick={() => navigate(`/quiz/${encodeURIComponent(category.name || category.label)}`)}
                    className={`h-40 cursor-pointer rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 relative bg-gradient-to-br ${colorScheme.color}`}
                  >
                    <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-70 hover:opacity-100 transition-opacity duration-300">
                      {category.icon || "📚"}
                    </div>
                    
                    <div className="absolute inset-0 bg-black opacity-0 hover:opacity-10 transition-opacity duration-300"></div>
                  </div>
                  
                  <div className="pt-3">
                    <h3 className="text-sm font-bold text-gray-800 mb-1 line-clamp-2">
                      {category.label || category.name}
                    </h3>
                    
                    <p className="text-xs text-gray-600 mb-2 font-medium">
                      {category.quizCount || 0} {feature.featureType === "puzzle" ? "Puzzles" : "Quizzes"}
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

// Default color schemes for categories
const colorSchemes = [
  { color: "from-rose-400 via-pink-300 to-rose-300", borderColor: "from-pink-300 to-rose-200" },
  { color: "from-amber-400 via-orange-300 to-yellow-300", borderColor: "from-orange-300 to-yellow-200" },
  { color: "from-blue-400 via-cyan-300 to-blue-300", borderColor: "from-blue-300 to-cyan-200" },
  { color: "from-orange-400 via-amber-300 to-yellow-300", borderColor: "from-amber-300 to-yellow-200" },
  { color: "from-emerald-400 via-green-300 to-teal-300", borderColor: "from-green-300 to-teal-200" },
  { color: "from-cyan-400 via-teal-300 to-blue-300", borderColor: "from-cyan-300 to-teal-200" },
  { color: "from-red-400 via-orange-300 to-amber-300", borderColor: "from-red-300 to-orange-200" },
  { color: "from-purple-400 via-violet-300 to-pink-300", borderColor: "from-purple-300 to-pink-200" },
];

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
        <button className="text-primary-600 hover:text-primary-700 font-semibold text-sm flex items-center gap-1">
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
          {section.categories.map((category) => (
            <div key={category.title} className="flex-shrink-0 w-56">
              {/* Card Image */}
              <div
                onClick={() => navigate(category.path)}
                className={`h-40 cursor-pointer rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 relative bg-gradient-to-br ${category.color}`}
              >
                {/* Icon centered on card */}
                <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-70 hover:opacity-100 transition-opacity duration-300">
                  {category.icon}
                </div>
                
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black opacity-0 hover:opacity-10 transition-opacity duration-300"></div>
              </div>
              
              {/* Text Below Card */}
              <div className="pt-3">
                <h3 className="text-sm font-bold text-gray-800 mb-1 line-clamp-2">
                  {category.title}
                </h3>
                
                <p className="text-xs text-gray-600 mb-2 font-medium">
                  {category.quizzes} {category.featureName || "Quizzes"}
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
          ))}
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

  useEffect(() => {
    const loadCategoriesAndFeatures = async () => {
      try {
        // Load categories, features, and topics
        const [categorySnapshot, featureSnapshot, topicSnapshot] = await Promise.all([
          getDocs(collection(db, "categories")),
          getDocs(collection(db, "features")),
          getDocs(collection(db, "topics"))
        ]);

        // Create a map of feature IDs to feature labels
        const featureMap = {};
        const featuresData = [];
        featureSnapshot.docs.forEach(doc => {
          const data = doc.data();
          featureMap[doc.id] = data.label || data.name || "Items";
          featuresData.push({ id: doc.id, ...data });
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
            const featureData = featuresData.find(f => f.id === data.featureId);
            const featureType = featureData?.type || featureData?.name?.toLowerCase() || "quiz";
            const featureName = featureMap[data.featureId] || "Quizzes";
            const categoryName = data.label || data.name;
            
            return {
              id: doc.id,
              title: categoryName,
              icon: data.icon || "📚",
              quizzes: data.quizCount || 0,
              featureName: featureName,
              featureType: featureType,
              difficulty: "Medium",
              path: `/quiz/${encodeURIComponent(categoryName)}`,
              color: colorScheme.color,
              borderColor: colorScheme.borderColor,
              isPublished: data.isPublished || false,
              createdAt: data.createdAt || new Date().toISOString(),
              rating: generateRealisticRating(data.quizCount || 0, doc.id),
            };
          })
          .filter((cat) => cat.isPublished === true)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        if (categoriesData.length > 0) {
          setCategories(categoriesData);
        }

        // Group categories by feature (only published)
        const result = featuresData
          .map((feature) => {
            const categories = categorySnapshot.docs
              .map(doc => {
                const data = doc.data();
                return {
                  id: doc.id,
                  ...data,
                  rating: generateRealisticRating(data.quizCount || 0, doc.id),
                };
              })
              .filter(cat => cat.featureId === feature.id && cat.isPublished === true);
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
      } finally {
        setLoading(false);
      }
    };

    loadCategoriesAndFeatures();
  }, []);

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