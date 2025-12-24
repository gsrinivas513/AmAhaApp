import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SiteLayout from "../layouts/SiteLayout";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import { ResponsiveImage } from "../components/OptimizedImage";

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

function AllFeaturesPage() {
  const navigate = useNavigate();
  const [features, setFeatures] = useState([]);
  const [featureCategories, setFeatureCategories] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch all features
      const featuresSnapshot = await getDocs(collection(db, "features"));
      const featuresData = featuresSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Fetch categories for each feature
      const categoriesMap = {};
      for (const feature of featuresData) {
        const categoriesSnapshot = await getDocs(
          query(collection(db, "categories"), where("featureId", "==", feature.id))
        );
        categoriesMap[feature.id] = categoriesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      }

      setFeatures(featuresData);
      setFeatureCategories(categoriesMap);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getFeatureIcon = (featureType) => {
    const icons = {
      quiz: "🎯",
      puzzle: "🧩",
      game: "🎮",
      challenge: "🏆",
    };
    return icons[featureType] || "✨";
  };

  const handleCategoryClick = (feature, category) => {
    if (feature.featureType === "puzzle") {
      navigate(`/puzzle/${encodeURIComponent(category.name || category.label)}`);
    } else {
      navigate(`/quiz/${encodeURIComponent(category.name || category.label)}`);
    }
  };

  if (loading) {
    return (
      <SiteLayout>
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full animate-spin"></div>
              </div>
              <p className="text-gray-600">Loading features...</p>
            </div>
          </div>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Page Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-5xl font-bold text-gray-900">
              Explore All Categories
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl">
            Choose a feature and pick your favorite categories to start learning and playing
          </p>
        </div>

        {/* Features Sections */}
        {features.length > 0 ? (
          <div className="space-y-20">
            {features.map((feature) => {
              const categories = featureCategories[feature.id] || [];
              const featureIcon = feature.icon || getFeatureIcon(feature.featureType);

              return (
                <section key={feature.id}>
                  {/* Feature Title */}
                  <div className="mb-8 flex items-center gap-4 pb-4 border-b-2 border-gray-200">
                    <div className="text-5xl">{featureIcon}</div>
                    <div>
                      <h2 className="text-4xl font-bold text-gray-900">
                        {feature.label || feature.name}
                      </h2>
                      {feature.description && (
                        <p className="text-lg text-gray-600 mt-1">
                          {feature.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Categories Grid */}
                  {categories.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                      {categories.map((category, index) => {
                        const colorScheme = colorSchemes[index % colorSchemes.length];
                        const hasImage = category.imageUrl || category.image;

                        return (
                          <div
                            key={category.id}
                            onClick={() => handleCategoryClick(feature, category)}
                            className="group cursor-pointer"
                          >
                            {/* Card Image/Icon */}
                            <div className="h-48 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 mb-4 relative">
                              {hasImage ? (
                                <ResponsiveImage
                                  src={category.imageUrl || category.image}
                                  cloudinaryId={category.cloudinaryId}
                                  alt={category.label || category.name}
                                  fallbackIcon={category.icon || "📚"}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  crop="fit"
                                />
                              ) : (
                                <div
                                  className={`absolute inset-0 bg-gradient-to-br ${colorScheme.color} flex items-center justify-center text-7xl opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300`}
                                >
                                  {category.icon || "📚"}
                                </div>
                              )}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>

                            {/* Card Info */}
                            <div>
                              <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-purple-600 transition-colors">
                                {category.label || category.name}
                              </h3>

                              <p className="text-sm text-gray-600 mb-3">
                                {feature.featureType === "puzzle"
                                  ? `${category.puzzleCount || 0} Puzzles`
                                  : `${category.quizCount || 0} Quizzes`}
                              </p>

                              {/* Rating */}
                              <div className="flex items-center gap-2">
                                <div className="flex">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <span
                                      key={star}
                                      className={`text-base ${
                                        star <= Math.floor(category.rating || 4)
                                          ? "text-yellow-400"
                                          : "text-gray-300"
                                      }`}
                                    >
                                      ★
                                    </span>
                                  ))}
                                </div>
                                <span className="text-xs text-gray-500">
                                  {(category.rating || 4.0).toFixed(1)}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-12 text-center mb-8">
                      <p className="text-gray-600">
                        No categories published yet for {feature.label || feature.name}.
                      </p>
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        ) : (
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-16 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Features Available</h3>
            <p className="text-gray-600 mb-6">
              Features are being set up. Please check back soon!
            </p>
            <button
              onClick={() => navigate("/")}
              className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg hover:shadow-lg transition-shadow duration-300"
            >
              ← Back to Home
            </button>
          </div>
        )}
      </div>
    </SiteLayout>
  );
}

export default AllFeaturesPage;
