// src/puzzles/PuzzleSubcategoryPage.jsx
// Shows subtopics for a selected puzzle category and topic
// If no subtopics exist, shows puzzles directly
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SiteLayout from "../layouts/SiteLayout";
import { Card, Button } from "../components/ui";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { countPuzzlesForTopic, getPuzzlesForTopic } from "./puzzleCountService";

export default function PuzzleSubcategoryPage() {
  const { categoryName, topicName } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [topic, setTopic] = useState(null);
  const [subtopics, setSubtopics] = useState([]);
  const [puzzles, setPuzzles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPuzzlesDirectly, setShowPuzzlesDirectly] = useState(false);

  useEffect(() => {
    loadCategoryTopicAndSubtopics();
  }, [categoryName, topicName]);

  const loadCategoryTopicAndSubtopics = async () => {
    try {
      setLoading(true);

      const decodedCategoryName = decodeURIComponent(categoryName);
      const decodedTopicName = decodeURIComponent(topicName);
      
      console.log("Looking for category:", decodedCategoryName, "and topic:", decodedTopicName);

      // Load category
      const categoriesSnap = await getDocs(collection(db, "categories"));
      const categoryDoc = categoriesSnap.docs.find(doc => {
        const data = doc.data();
        return (data.name === decodedCategoryName || data.label === decodedCategoryName);
      });

      if (!categoryDoc) {
        console.error("Category not found");
        navigate("/");
        return;
      }

      const categoryData = { id: categoryDoc.id, ...categoryDoc.data() };
      setCategory(categoryData);

      // Load topic
      const topicsSnap = await getDocs(
        query(
          collection(db, "topics"),
          where("categoryId", "==", categoryData.id)
        )
      );

      const topicDoc = topicsSnap.docs.find(doc => {
        const data = doc.data();
        return (data.name === decodedTopicName || data.label === decodedTopicName);
      });

      if (!topicDoc) {
        console.error("Topic not found");
        navigate(`/puzzle/${encodeURIComponent(decodedCategoryName)}`);
        return;
      }

      const topicData = { id: topicDoc.id, ...topicDoc.data() };
      setTopic(topicData);

      // Load subtopics
      const subtopicsSnap = await getDocs(
        query(
          collection(db, "subtopics"),
          where("topicId", "==", topicData.id)
        )
      );

      const subtopicsData = subtopicsSnap.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter(sub => sub.isPublished !== false);

      setSubtopics(subtopicsData);

      // If no subtopics, load puzzles directly from the topic
      if (subtopicsData.length === 0) {
        console.log("No subtopics found, loading puzzles directly for topic:", topicData.id, topicData.name);
        
        // Use the service to get puzzles
        const puzzlesData = await getPuzzlesForTopic(topicData.id, topicData.name);
        
        console.log("Found puzzles:", puzzlesData.length, puzzlesData);
        setPuzzles(puzzlesData);
        setShowPuzzlesDirectly(puzzlesData.length > 0 || subtopicsData.length === 0);
      }
    } catch (error) {
      console.error("Error loading:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <SiteLayout><div className="p-8 text-center">Loading...</div></SiteLayout>;
  }

  return (
    <SiteLayout>
      {/* Header with Back Button */}
      <div className="bg-gradient-to-r from-green-300 via-teal-200 to-cyan-200 text-gray-800 py-8 px-4 shadow-lg">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => navigate(`/puzzle/${encodeURIComponent(categoryName)}`)}
            className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-gray-400/30 hover:bg-gray-400/50 rounded-lg transition-colors text-gray-800 font-semibold"
          >
            <span>←</span> Back to Topics
          </button>
          <h1 className="text-4xl font-bold mb-2">🧩 {topic?.label || topic?.name}</h1>
          <p className="text-lg opacity-90">
            {showPuzzlesDirectly ? "Pick a puzzle and challenge yourself" : "Choose a level to begin"}
          </p>
        </div>
      </div>

      {/* Content */}
      <section className="py-12 px-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 min-h-screen">
        <div className="max-w-6xl mx-auto">
          {/* Show puzzles directly if no subtopics */}
          {showPuzzlesDirectly ? (
            puzzles.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🧩</div>
                <p className="text-xl text-gray-600">No puzzles available yet for this topic.</p>
                <p className="text-sm text-gray-500 mt-2">Check back soon!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {puzzles.map(puzzle => (
                  <div
                    key={puzzle.id}
                    onClick={() => navigate(`/puzzle/${encodeURIComponent(categoryName)}/${encodeURIComponent(topicName)}/${puzzle.id}`)}
                    className="group cursor-pointer"
                  >
                    <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden h-full transform hover:scale-105 hover:-translate-y-1">
                      {/* Image or Color Background */}
                      {puzzle.imageUrl ? (
                        <div className="h-40 overflow-hidden bg-gray-200">
                          <img
                            src={puzzle.imageUrl}
                            alt={puzzle.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                      ) : (
                        <div className="h-40 bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                          <span className="text-6xl">🧩</span>
                        </div>
                      )}

                      {/* Content */}
                      <div className="p-6">
                        {/* Title */}
                        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                          {puzzle.title || puzzle.id}
                        </h3>

                        {/* Description */}
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                          {puzzle.description || `${puzzle.type} puzzle`}
                        </p>

                        {/* Meta Information */}
                        <div className="flex items-center justify-between mb-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            puzzle.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                            puzzle.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {(puzzle.difficulty || 'easy').charAt(0).toUpperCase() + (puzzle.difficulty || 'easy').slice(1)}
                          </span>
                          <span className="text-xs text-gray-500 font-semibold">
                            {puzzle.type && puzzle.type.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                          </span>
                        </div>

                        {/* CTA */}
                        <div className="flex items-center gap-2 text-purple-600 font-semibold group-hover:text-purple-700 transition-colors">
                          <span>Play Now</span>
                          <span className="transform group-hover:translate-x-2 transition-transform">→</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            /* Show subtopics if they exist */
            subtopics.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📚</div>
                <p className="text-xl text-gray-600">No subtopics available yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {subtopics.map(subtopic => {
                  const hasPuzzles = (subtopic.puzzleCount || 0) > 0;
                  return (
                    <div
                      key={subtopic.id}
                      onClick={() => hasPuzzles && navigate(
                        `/puzzle/${encodeURIComponent(category.name || category.label)}/` +
                        `${encodeURIComponent(topic.name || topic.label)}/` +
                        `${encodeURIComponent(subtopic.name || subtopic.label)}`
                      )}
                      className={`group ${hasPuzzles ? 'cursor-pointer' : 'opacity-60 cursor-not-allowed'}`}
                    >
                      <div className={`relative bg-white rounded-2xl shadow-lg transition-all duration-300 overflow-hidden h-full ${
                        hasPuzzles ? 'hover:shadow-2xl transform hover:scale-105 hover:-translate-y-1' : ''
                      }`}>
                        {/* Background gradient */}
                        {hasPuzzles && (
                          <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        )}
                        
                        {/* Content */}
                        <div className="relative p-8 z-10">
                          {/* Icon */}
                          <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                            🎯
                          </div>

                          {/* Title */}
                          <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-white transition-colors capitalize">
                            {subtopic.label || subtopic.name}
                          </h3>

                          {/* Puzzle Count */}
                          <div className="flex items-center gap-2 mb-6">
                            <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                              hasPuzzles
                                ? 'bg-blue-100 text-blue-700 group-hover:bg-white/30 group-hover:text-white'
                                : 'bg-gray-100 text-gray-600'
                            }`}>
                              {subtopic.puzzleCount || 0} Puzzle{(subtopic.puzzleCount || 0) !== 1 ? 's' : ''}
                            </span>
                          </div>

                          {/* CTA Button */}
                          {hasPuzzles && (
                            <div className="flex items-center gap-2 text-purple-600 group-hover:text-white font-semibold transition-colors">
                              <span>Start</span>
                              <span className="transform group-hover:translate-x-2 transition-transform">→</span>
                            </div>
                          )}
                          {!hasPuzzles && (
                            <div className="text-gray-400 font-semibold">Coming Soon</div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
