/**
 * StoriesCategoryPage.jsx
 * Shows topics for a selected story category
 * User clicks on a topic to see subtopics, then selects subtopic to view stories
 * Follows the same pattern as Quiz/Puzzles for consistency
 */

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SiteLayout from "../../layouts/SiteLayout";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import "../styles/story.css";

export default function StoriesCategoryPage() {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategoryAndTopics();
  }, [categoryName]);

  const loadCategoryAndTopics = async () => {
    try {
      setLoading(true);

      const decodedCategoryName = decodeURIComponent(categoryName);
      console.log("📖 Looking for story category:", decodedCategoryName);

      // Find category by name
      const categoriesSnap = await getDocs(collection(db, "storyCategories"));

      const categoryDoc = categoriesSnap.docs.find((doc) => {
        const data = doc.data();
        return (
          data.name === decodedCategoryName ||
          data.label === decodedCategoryName
        );
      });

      if (!categoryDoc) {
        console.error("❌ Category not found:", decodedCategoryName);
        navigate("/stories");
        return;
      }

      const categoryData = { id: categoryDoc.id, ...categoryDoc.data() };
      console.log("✅ Category found:", categoryData);
      setCategory(categoryData);

      // Load topics for this category
      const topicsQuery = query(
        collection(db, "storyTopics"),
        where("categoryId", "==", categoryData.id)
      );
      const topicsSnap = await getDocs(topicsQuery);
      const topicsData = topicsSnap.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((topic) => topic.isPublished !== false)
        .sort((a, b) => (a.name || "").localeCompare(b.name || ""));

      console.log("✅ Topics found:", topicsData.length);
      setTopics(topicsData);
    } catch (error) {
      console.error("❌ Error loading category and topics:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTopicClick = (topic) => {
    navigate(`/stories/category/${encodeURIComponent(categoryName)}/topic/${encodeURIComponent(topic.name)}`, {
      state: { categoryName, topicName: topic.name, topicId: topic.id },
    });
  };

  if (loading) {
    return (
      <SiteLayout>
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="flex items-center justify-center h-96">
            <p className="text-lg text-gray-600">Loading story topics...</p>
          </div>
        </div>
      </SiteLayout>
    );
  }

  if (!category) {
    return (
      <SiteLayout>
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="flex flex-col items-center justify-center h-96">
            <p className="text-xl text-gray-700 mb-4">❌ Category not found</p>
            <button
              onClick={() => navigate("/stories")}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Back to Stories
            </button>
          </div>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <button
            onClick={() => navigate("/stories")}
            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold mb-4 transition-colors"
          >
            ← Back to Stories
          </button>

          <div className="flex items-start gap-4">
            {category.icon && (
              <div className="text-6xl drop-shadow-lg">{category.icon}</div>
            )}
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {category.label || category.name}
              </h1>
              {category.description && (
                <p className="text-lg text-gray-600">{category.description}</p>
              )}
            </div>
          </div>
        </div>

        {/* Topics Grid */}
        {topics.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <p className="text-xl text-gray-600 mb-4">📖 No topics available in this category</p>
            <button
              onClick={() => navigate("/stories")}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Browse Other Categories
            </button>
          </div>
        ) : (
          <div>
            <p className="text-sm font-bold text-purple-600 uppercase tracking-wider mb-6">
              🎯 Choose a topic to explore
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topics.map((topic, index) => (
                <TopicCard
                  key={topic.id}
                  topic={topic}
                  index={index}
                  onClick={() => handleTopicClick(topic)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </SiteLayout>
  );
}

/**
 * TopicCard Component
 * Displays a single topic with icon and description
 */
function TopicCard({ topic, index, onClick }) {
  const colorSchemes = [
    { bg: "from-rose-400 via-pink-300 to-rose-300", text: "text-rose-700" },
    { bg: "from-amber-400 via-orange-300 to-yellow-300", text: "text-amber-700" },
    { bg: "from-blue-400 via-cyan-300 to-blue-300", text: "text-blue-700" },
    { bg: "from-orange-400 via-amber-300 to-yellow-300", text: "text-orange-700" },
    { bg: "from-emerald-400 via-green-300 to-teal-300", text: "text-emerald-700" },
    { bg: "from-cyan-400 via-teal-300 to-blue-300", text: "text-cyan-700" },
    { bg: "from-red-400 via-orange-300 to-amber-300", text: "text-red-700" },
    { bg: "from-purple-400 via-violet-300 to-pink-300", text: "text-purple-700" },
  ];

  const colorScheme = colorSchemes[index % colorSchemes.length];

  return (
    <div
      onClick={onClick}
      className="cursor-pointer rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group h-48 relative"
    >
      {/* Background Gradient */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${colorScheme.bg} flex items-center justify-center text-6xl opacity-70 group-hover:opacity-100 transition-opacity duration-300`}
      >
        {topic.icon || "📚"}
      </div>

      {/* Dark Overlay on Hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      {/* Text Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-4 text-white">
        <h3 className="text-lg font-bold drop-shadow-lg">
          {topic.label || topic.name}
        </h3>
        {topic.description && (
          <p className="text-sm text-gray-100 drop-shadow line-clamp-2 mt-1">
            {topic.description}
          </p>
        )}
      </div>
    </div>
  );
}
