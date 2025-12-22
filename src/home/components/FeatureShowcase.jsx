import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

// Color schemes for categories
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

// Carousel section component
function FeatureCarouselSection({ feature, categories }) {
  const navigate = useNavigate();
  const [scrollPosition, setScrollPosition] = useState(0);
  const containerRef = React.useRef(null);
  
  const itemsPerView = 4;
  const itemWidth = 240; // Width of each card + gap
  const maxScroll = Math.max(0, (categories.length - itemsPerView) * itemWidth);

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

  // Get feature icon
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
      {/* Header with See All */}
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

      {/* Carousel container */}
      {categories.length > 0 ? (
        <div className="relative group bg-gradient-to-r from-transparent via-white via-5% to-transparent bg-opacity-30 rounded-lg py-2">
          {/* Carousel */}
          <div
            ref={containerRef}
            className="flex gap-6 overflow-x-hidden scroll-smooth px-4"
            style={{ scrollBehavior: "smooth" }}
          >
            {categories.map((category, index) => {
              const colorScheme = colorSchemes[index % colorSchemes.length];
              return (
                <div key={category.id} className="flex-shrink-0 w-56">
                  {/* Card Image */}
                  <div
                    onClick={() => {
                      const featureType = category.featureType || 'quiz';
                      navigate(`/${featureType}/${category.id}`);
                    }}
                    className={`h-40 cursor-pointer rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 relative bg-gradient-to-br ${colorScheme.color}`}
                  >
                    {/* Icon centered on card */}
                    <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-70 hover:opacity-100 transition-opacity duration-300">
                      {category.icon || "📚"}
                    </div>
                    
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black opacity-0 hover:opacity-10 transition-opacity duration-300"></div>
                  </div>
                  
                  {/* Text Below Card */}
                  <div className="pt-3">
                    <h3 className="text-sm font-bold text-gray-800 mb-1 line-clamp-2">
                      {category.label || category.name}
                    </h3>
                    
                    <p className="text-xs text-gray-600 mb-2 font-medium">
                      {category.quizCount || 0} {feature.featureType === "puzzle" ? "Puzzles" : "Quizzes"}
                    </p>
                    
                    {category.isPublished && (
                      <span className="inline-block px-2.5 py-0.5 bg-green-100 text-green-700 rounded text-xs font-semibold">
                        Published
                      </span>
                    )}
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
      ) : (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-gray-600">No categories published yet for this feature.</p>
        </div>
      )}
    </div>
  );
}

export default function FeatureShowcase() {
  const [featuresWithCategories, setFeaturesWithCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeaturesAndCategories = async () => {
      try {
        // Load features
        const featureSnapshot = await getDocs(collection(db, "features"));
        const features = featureSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Load categories
        const categorySnapshot = await getDocs(collection(db, "categories"));
        const allCategories = categorySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Group categories by feature
        const result = features
          .map((feature) => {
            // Filter categories for this feature (only published ones)
            const categories = allCategories
              .filter((cat) => cat.featureId === feature.id && cat.isPublished === true)
              .map((cat) => ({
                ...cat,
                featureType: feature.type || feature.name?.toLowerCase() || 'quiz',
              }));

            return {
              feature,
              categories,
            };
          })
          // Only include features that have at least one published category
          .filter((item) => item.categories.length > 0)
          // Sort by feature creation date or name
          .sort((a, b) => {
            const aDate = a.feature.createdAt || "";
            const bDate = b.feature.createdAt || "";
            return new Date(bDate) - new Date(aDate);
          });

        setFeaturesWithCategories(result);
      } catch (error) {
        console.error("Error loading features and categories:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturesAndCategories();
  }, []);

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Main heading */}
        <div className="mb-12 px-4">
          <h2 className="text-4xl font-bold text-gray-900">Explore by Feature</h2>
          <p className="text-gray-600 mt-2">Discover all available categories for each feature</p>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading features...</p>
          </div>
        )}

        {/* Features with categories */}
        {!loading && featuresWithCategories.length > 0 && (
          <div className="px-4">
            {featuresWithCategories.map((item) => (
              <FeatureCarouselSection
                key={item.feature.id}
                feature={item.feature}
                categories={item.categories}
              />
            ))}
          </div>
        )}

        {/* No features with categories message */}
        {!loading && featuresWithCategories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              No features with published categories yet. Check back soon!
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
