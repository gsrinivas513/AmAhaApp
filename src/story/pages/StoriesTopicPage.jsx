/**
 * StoriesTopicPage.jsx
 * Shows subtopics for a selected story topic
 * User clicks on a subtopic to view stories within that subtopic
 * Follows the same pattern as Quiz/Puzzles for consistency
 */

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SiteLayout from "../../layouts/SiteLayout";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import "../styles/story.css";

export default function StoriesTopicPage() {
  const { categoryName, topicName } = useParams();
  const navigate = useNavigate();
  const [topic, setTopic] = useState(null);
  const [subtopics, setSubtopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTopicAndSubtopics();
  }, [categoryName, topicName]);

  const loadTopicAndSubtopics = async () => {
    try {
      setLoading(true);

      const decodedTopicName = decodeURIComponent(topicName);
      console.log("📖 Looking for story topic:", decodedTopicName);

      // Find topic by name
      const topicsSnap = await getDocs(collection(db, "storyTopics"));

      const topicDoc = topicsSnap.docs.find((doc) => {
        const data = doc.data();
        return (
          data.name === decodedTopicName ||
          data.label === decodedTopicName
        );
      });

      if (!topicDoc) {
        console.error("❌ Topic not found:", decodedTopicName);
        navigate(`/stories/category/${categoryName}`);
        return;
      }

      const topicData = { id: topicDoc.id, ...topicDoc.data() };
      console.log("✅ Topic found:", topicData);
      setTopic(topicData);

      // Load subtopics for this topic
      const subtopicsQuery = query(
        collection(db, "storySubtopics"),
        where("topicId", "==", topicData.id)
      );
      const subtopicsSnap = await getDocs(subtopicsQuery);
      const subtopicsData = subtopicsSnap.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((subtopic) => subtopic.isPublished !== false)
        .sort((a, b) => (a.name || "").localeCompare(b.name || ""));

      console.log("✅ Subtopics found:", subtopicsData.length);
      setSubtopics(subtopicsData);
    } catch (error) {
      console.error("❌ Error loading topic and subtopics:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubtopicClick = (subtopic) => {
    navigate(
      `/stories/category/${encodeURIComponent(categoryName)}/topic/${encodeURIComponent(topicName)}/subtopic/${encodeURIComponent(subtopic.name)}`,
      {
        state: {
          categoryName,
          topicName,
          subtopicName: subtopic.name,
          subtopicId: subtopic.id,
        },
      }
    );
  };

  if (loading) {
    return (
      <SiteLayout>
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="flex items-center justify-center h-96">
            <p className="text-lg text-gray-600">Loading story subtopics...</p>
          </div>
        </div>
      </SiteLayout>
    );
  }

  if (!topic) {
    return (
      <SiteLayout>
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="flex flex-col items-center justify-center h-96">
            <p className="text-xl text-gray-700 mb-4">❌ Topic not found</p>
            <button
              onClick={() => navigate(`/stories/category/${categoryName}`)}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Back to Category
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
            onClick={() => navigate(`/stories/category/${categoryName}`)}
            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold mb-4 transition-colors"
          >
            ← Back to {decodeURIComponent(categoryName)}
          </button>

          <div className="flex items-start gap-4">
            {topic.icon && (
              <div className="text-6xl drop-shadow-lg">{topic.icon}</div>
            )}
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {topic.label || topic.name}
              </h1>
              {topic.description && (
                <p className="text-lg text-gray-600">{topic.description}</p>
              )}
            </div>
          </div>
        </div>

        {/* Subtopics Grid */}
        {subtopics.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <p className="text-xl text-gray-600 mb-4">📖 No subtopics available in this topic</p>
            <button
              onClick={() => navigate(`/stories/category/${categoryName}`)}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Browse Other Topics
            </button>
          </div>
        ) : (
          <div>
            <p className="text-sm font-bold text-purple-600 uppercase tracking-wider mb-6">
              🎯 Choose a subtopic to see stories
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subtopics.map((subtopic, index) => (
                <SubtopicCard
                  key={subtopic.id}
                  subtopic={subtopic}
                  index={index}
                  onClick={() => handleSubtopicClick(subtopic)}
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
 * SubtopicCard Component
 * Displays a single subtopic with icon and description
 */
function SubtopicCard({ subtopic, index, onClick }) {
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
        {subtopic.icon || "📖"}
      </div>

      {/* Dark Overlay on Hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      {/* Text Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-4 text-white">
        <h3 className="text-lg font-bold drop-shadow-lg">
          {subtopic.label || subtopic.name}
        </h3>
        {subtopic.description && (
          <p className="text-sm text-gray-100 drop-shadow line-clamp-2 mt-1">
            {subtopic.description}
          </p>
        )}
      </div>
    </div>
  );
}
