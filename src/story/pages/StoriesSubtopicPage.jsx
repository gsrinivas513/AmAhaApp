/**
 * StoriesSubtopicPage.jsx
 * Shows all stories for a selected subtopic
 * User can click on a story to read it
 * Follows the same pattern as Quiz/Puzzles for consistency
 */

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SiteLayout from "../../layouts/SiteLayout";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { StoryCard } from "../components/StoryCard";
import "../styles/story.css";

export default function StoriesSubtopicPage() {
  const { categoryName, topicName, subtopicName } = useParams();
  const navigate = useNavigate();
  const [subtopic, setSubtopic] = useState(null);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSubtopicAndStories();
  }, [categoryName, topicName, subtopicName]);

  const loadSubtopicAndStories = async () => {
    try {
      setLoading(true);

      const decodedSubtopicName = decodeURIComponent(subtopicName);
      console.log("📖 Looking for story subtopic:", decodedSubtopicName);

      // Find subtopic by name
      const subtopicsSnap = await getDocs(
        collection(db, "storySubtopics")
      );

      const subtopicDoc = subtopicsSnap.docs.find((doc) => {
        const data = doc.data();
        return (
          data.name === decodedSubtopicName ||
          data.label === decodedSubtopicName
        );
      });

      if (!subtopicDoc) {
        console.error("❌ Subtopic not found:", decodedSubtopicName);
        navigate(
          `/stories/category/${categoryName}/topic/${topicName}`
        );
        return;
      }

      const subtopicData = { id: subtopicDoc.id, ...subtopicDoc.data() };
      console.log("✅ Subtopic found:", subtopicData);
      setSubtopic(subtopicData);

      // Load stories for this subtopic
      const storiesQuery = query(
        collection(db, "stories"),
        where("storySubtopic", "==", subtopicData.id),
        where("published", "==", true)
      );
      const storiesSnap = await getDocs(storiesQuery);
      const storiesData = storiesSnap.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => (a.title || "").localeCompare(b.title || ""));

      console.log("✅ Stories found:", storiesData.length);
      setStories(storiesData);
    } catch (error) {
      console.error("❌ Error loading subtopic and stories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStoryClick = (storyId) => {
    navigate(`/stories/${storyId}`, {
      state: {
        categoryName,
        topicName,
        subtopicName,
      },
    });
  };

  if (loading) {
    return (
      <SiteLayout>
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="flex items-center justify-center h-96">
            <p className="text-lg text-gray-600">Loading stories...</p>
          </div>
        </div>
      </SiteLayout>
    );
  }

  if (!subtopic) {
    return (
      <SiteLayout>
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="flex flex-col items-center justify-center h-96">
            <p className="text-xl text-gray-700 mb-4">
              ❌ Subtopic not found
            </p>
            <button
              onClick={() =>
                navigate(
                  `/stories/category/${categoryName}/topic/${topicName}`
                )
              }
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Back to Topic
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
            onClick={() =>
              navigate(
                `/stories/category/${categoryName}/topic/${topicName}`
              )
            }
            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold mb-4 transition-colors"
          >
            ← Back to {decodeURIComponent(topicName)}
          </button>

          <div className="flex items-start gap-4">
            {subtopic.icon && (
              <div className="text-6xl drop-shadow-lg">{subtopic.icon}</div>
            )}
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {subtopic.label || subtopic.name}
              </h1>
              {subtopic.description && (
                <p className="text-lg text-gray-600">
                  {subtopic.description}
                </p>
              )}
              <p className="text-sm text-gray-500 mt-2">
                {stories.length} {stories.length === 1 ? "story" : "stories"}
              </p>
            </div>
          </div>
        </div>

        {/* Stories Grid */}
        {stories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <p className="text-xl text-gray-600 mb-4">
              📖 No stories available in this subtopic yet
            </p>
            <button
              onClick={() =>
                navigate(
                  `/stories/category/${categoryName}/topic/${topicName}`
                )
              }
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Browse Other Subtopics
            </button>
          </div>
        ) : (
          <div>
            <p className="text-sm font-bold text-purple-600 uppercase tracking-wider mb-6">
              📚 Available Stories
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stories.map((story) => (
                <div
                  key={story.id}
                  onClick={() => handleStoryClick(story.id)}
                  className="cursor-pointer"
                >
                  <StoryCard story={story} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
