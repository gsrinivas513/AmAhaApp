import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SiteLayout from "../layouts/SiteLayout";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import { ResponsiveImage } from "../components/OptimizedImage";

// Color schemes for cards
const colorSchemes = [
  { color: "from-rose-400 via-pink-300 to-rose-300" },
  { color: "from-amber-400 via-orange-300 to-yellow-300" },
  { color: "from-blue-400 via-cyan-300 to-blue-300" },
  { color: "from-orange-400 via-amber-300 to-yellow-300" },
  { color: "from-emerald-400 via-green-300 to-teal-300" },
  { color: "from-cyan-400 via-teal-300 to-blue-300" },
  { color: "from-red-400 via-orange-300 to-amber-300" },
  { color: "from-purple-400 via-violet-300 to-pink-300" },
];

function ExploreCategoriesPage() {
  const navigate = useNavigate();
  const [features, setFeatures] = useState([]);
  const [featureData, setFeatureData] = useState({});
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

      // Fetch categories and topics for each feature
      const dataMap = {};
      for (const feature of featuresData) {
        dataMap[feature.id] = {
          categories: [],
          categoryTopics: {},
        };

        // Fetch categories for this feature
        const categoriesSnapshot = await getDocs(
          query(collection(db, "categories"), where("featureId", "==", feature.id))
        );
        const categories = categoriesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        dataMap[feature.id].categories = categories;

        // Fetch topics for each category
        for (const category of categories) {
          const topicsSnapshot = await getDocs(
            query(collection(db, "topics"), where("categoryId", "==", category.id))
          );
          const topics = topicsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          dataMap[feature.id].categoryTopics[category.id] = topics;
        }
      }

      setFeatures(featuresData);
      setFeatureData(dataMap);
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

  const handleTopicClick = (feature, category, topic) => {
    if (feature.featureType === "puzzle") {
      navigate(
        `/puzzle/${encodeURIComponent(category.name || category.label)}/${encodeURIComponent(
          topic.name || topic.label
        )}`
      );
    } else {
      navigate(
        `/quiz/${encodeURIComponent(category.name || category.label)}/${encodeURIComponent(
          topic.name || topic.label
        )}`
      );
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
              <p className="text-gray-600">Loading content...</p>
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
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-5xl font-bold text-gray-900">
              Explore All Topics
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl">
            Browse all features, categories, and topics. Click on any topic to start playing!
          </p>
        </div>

        {/* Features Sections */}
        {features.length > 0 ? (
          <div className="space-y-24">
            {features.map((feature) => {
              const categories = featureData[feature.id]?.categories || [];
              const categoryTopics = featureData[feature.id]?.categoryTopics || {};
              const featureIcon = feature.icon || getFeatureIcon(feature.featureType);

              return (
                <section key={feature.id}>
                  {/* Feature Title */}
                  <div className="mb-12 flex items-center gap-4 pb-6 border-b-2 border-gray-200">
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

                  {/* Categories Section */}
                  {categories.length > 0 ? (
                    <div className="space-y-16">
                      {categories.map((category, catIndex) => {
                        const topics = categoryTopics[category.id] || [];
                        const categoryColorScheme = colorSchemes[catIndex % colorSchemes.length];
                        const hasImage = category.imageUrl || category.image;

                        return (
                          <div key={category.id}>
                            {/* Category Header */}
                            <div className="flex items-center gap-4 mb-8">
                              <div className="flex-shrink-0">
                                {hasImage ? (
                                  <div className="w-20 h-20 rounded-lg overflow-hidden shadow-md">
                                    <ResponsiveImage
                                      src={category.imageUrl || category.image}
                                      cloudinaryId={category.cloudinaryId}
                                      alt={category.label || category.name}
                                      fallbackIcon={category.icon || "📚"}
                                      className="w-full h-full object-cover"
                                      crop="fit"
                                    />
                                  </div>
                                ) : (
                                  <div
                                    className={`w-20 h-20 rounded-lg bg-gradient-to-br ${categoryColorScheme.color} flex items-center justify-center text-3xl shadow-md`}
                                  >
                                    {category.icon || "📚"}
                                  </div>
                                )}
                              </div>
                              <div>
                                <h3 className="text-2xl font-bold text-gray-900">
                                  {category.label || category.name}
                                </h3>
                                <p className="text-gray-600 mt-1">
                                  {topics.length} {topics.length === 1 ? "Topic" : "Topics"}
                                </p>
                              </div>
                            </div>

                            {/* Topics Grid */}
                            {topics.length > 0 ? (
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
                                {topics.map((topic, topicIndex) => {
                                  const topicColorScheme =
                                    colorSchemes[(catIndex * 7 + topicIndex) % colorSchemes.length];
                                  const hasTopicImage = topic.imageUrl || topic.image;

                                  return (
                                    <div
                                      key={topic.id}
                                      onClick={() => handleTopicClick(feature, category, topic)}
                                      className="group cursor-pointer"
                                    >
                                      {/* Topic Card Image */}
                                      <div className="h-40 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 mb-3 relative">
                                        {hasTopicImage ? (
                                          <ResponsiveImage
                                            src={topic.imageUrl || topic.image}
                                            cloudinaryId={topic.cloudinaryId}
                                            alt={topic.label || topic.name}
                                            fallbackIcon={topic.icon}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                            crop="fit"
                                          />
                                        ) : (
                                          <div
                                            className={`absolute inset-0 bg-gradient-to-br ${topicColorScheme.color} flex items-center justify-center text-5xl opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300`}
                                          >
                                            {topic.icon || "📚"}
                                          </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                      </div>

                                      {/* Topic Card Info */}
                                      <div>
                                        <h4 className="text-base font-bold text-gray-900 mb-1 group-hover:text-purple-600 transition-colors line-clamp-2">
                                          {topic.label || topic.name}
                                        </h4>
                                        <p className="text-xs text-gray-600 mb-2">
                                          {feature.featureType === "puzzle"
                                            ? `${topic.puzzleCount || 0} Puzzles`
                                            : `${topic.quizCount || 0} Quizzes`}
                                        </p>

                                        {/* Rating */}
                                        <div className="flex items-center gap-1">
                                          <div className="flex">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                              <span
                                                key={star}
                                                className={`text-sm ${
                                                  star <= Math.floor(topic.rating || 4)
                                                    ? "text-yellow-400"
                                                    : "text-gray-300"
                                                }`}
                                              >
                                                ★
                                              </span>
                                            ))}
                                          </div>
                                          <span className="text-xs text-gray-500">
                                            {(topic.rating || 4.0).toFixed(1)}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            ) : (
                              <div className="bg-gray-50 rounded-lg p-8 text-center mb-8">
                                <p className="text-gray-600">
                                  No topics available for this category yet.
                                </p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-12 text-center mb-8">
                      <p className="text-gray-600">
                        No categories available for {feature.label || feature.name} yet.
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
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Content Available</h3>
            <p className="text-gray-600 mb-6">
              Content is being set up. Please check back soon!
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

export default ExploreCategoriesPage;
