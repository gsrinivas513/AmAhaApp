// src/puzzles/PuzzleTopicPage.jsx
// Shows topics for a selected puzzle category
// Same pattern as quiz/SubcategoryPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SiteLayout from "../layouts/SiteLayout";
import { Card, Button } from "../components/ui";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { countPuzzlesForTopic } from "./puzzleCountService";

export default function PuzzleTopicPage() {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (categoryName) {
      loadCategoryAndTopics();
    } else {
      loadAllPuzzleCategories();
    }
  }, [categoryName]);

  // Load all puzzle categories (when no categoryName param)
  const loadAllPuzzleCategories = async () => {
    try {
      setLoading(true);
      const categoriesSnap = await getDocs(collection(db, "categories"));
      const puzzleCategories = categoriesSnap.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(cat => cat.uiMode === "puzzle" && cat.isPublished !== false);

      setCategories(puzzleCategories);
    } catch (error) {
      console.error("Error loading categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategoryAndTopics = async () => {
    try {
      setLoading(true);

      const decodedCategoryName = decodeURIComponent(categoryName);
      console.log("Looking for category:", decodedCategoryName);

      // Load category
      const categoriesSnap = await getDocs(collection(db, "categories"));
      const categoryDoc = categoriesSnap.docs.find(doc => {
        const data = doc.data();
        return (data.name === decodedCategoryName || data.label === decodedCategoryName);
      });

      if (!categoryDoc) {
        console.error("Category not found:", decodedCategoryName);
        navigate("/");
        return;
      }

      const categoryData = { id: categoryDoc.id, ...categoryDoc.data() };
      setCategory(categoryData);

      // Load topics
      const topicsSnap = await getDocs(
        query(
          collection(db, "topics"),
          where("categoryId", "==", categoryData.id)
        )
      );

      const topicsData = topicsSnap.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter(topic => topic.isPublished !== false);

      // Count puzzles for each topic dynamically
      const topicsWithCounts = await Promise.all(
        topicsData.map(async (topic) => {
          const count = await countPuzzlesForTopic(topic.id, topic.name || topic.label);
          return { ...topic, puzzleCount: count };
        })
      );

      setTopics(topicsWithCounts);
    } catch (error) {
      console.error("Error loading:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <SiteLayout><div className="p-8 text-center">Loading...</div></SiteLayout>;
  }

  // If no categoryName, show all puzzle categories
    if (!categoryName) {
      return (
        <SiteLayout>
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-300 via-pink-200 to-orange-200 text-gray-800 py-12 px-4 shadow-lg">
            <div className="max-w-6xl mx-auto">
              <h1 className="text-5xl font-bold mb-4">🧩 Puzzles</h1>
              <p className="text-lg opacity-90">Choose a category and challenge your mind with fun puzzles!</p>
            </div>
          </div>        {/* Content */}
        <section className="py-12 px-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
          <div className="max-w-6xl mx-auto">
            {categories.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🧩</div>
                <p className="text-xl text-gray-600">No puzzle categories available yet.</p>
                <p className="text-sm text-gray-500 mt-2">Check back soon!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {categories.map(cat => (
                  <div
                    key={cat.id}
                    onClick={() => navigate(`/puzzle/${encodeURIComponent(cat.name || cat.label)}`)}
                    className="group cursor-pointer"
                  >
                    <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden h-full transform hover:scale-105 hover:-translate-y-1">
                      {/* Background gradient */}
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-200 to-purple-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      {/* Content */}
                      <div className="relative p-8 z-10">
                        {/* Icon */}
                        <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                          {cat.icon || '🎮'}
                        </div>

                        {/* Title */}
                        <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-gray-900 transition-colors">
                          {cat.label || cat.name}
                        </h3>

                        {/* Description */}
                        <p className="text-gray-600 mb-6 group-hover:text-gray-700 transition-colors">
                          {cat.description || 'Explore puzzles'}
                        </p>

                        {/* CTA Button */}
                        <div className="flex items-center gap-2 text-purple-500 group-hover:text-purple-700 font-semibold transition-colors">
                          <span>Explore</span>
                          <span className="transform group-hover:translate-x-2 transition-transform">→</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </SiteLayout>
    );
  }

  // If categoryName provided, show topics
  if (!category) {
    return <SiteLayout><div className="p-8 text-center">Loading topics...</div></SiteLayout>;
  }

  return (
    <SiteLayout>
      {/* Header with Back Button */}
      <div className="bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-200 text-gray-800 py-8 px-4 shadow-lg">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => navigate('/puzzle')}
            className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-gray-400/30 hover:bg-gray-400/50 rounded-lg transition-colors text-gray-800 font-semibold"
          >
            <span>←</span> Back to Categories
          </button>
          <h1 className="text-4xl font-bold mb-2">🧩 {category?.label || category?.name}</h1>
          <p className="text-lg opacity-90">Choose a puzzle type and start playing</p>
        </div>
      </div>

      {/* Topics Grid */}
      <section className="py-12 px-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 min-h-screen">
        <div className="max-w-6xl mx-auto">
          {topics.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🧩</div>
              <p className="text-xl text-gray-600">No topics available yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {topics.map(topic => {
                const hasPuzzles = (topic.puzzleCount || 0) > 0;
                return (
                  <div
                    key={topic.id}
                    onClick={() => hasPuzzles && navigate(
                      `/puzzle/${encodeURIComponent(category.name || category.label)}/` +
                      `${encodeURIComponent(topic.name || topic.label)}`
                    )}
                    className={`group ${hasPuzzles ? 'cursor-pointer' : 'opacity-60 cursor-not-allowed'}`}
                  >
                    <div className={`relative bg-white rounded-2xl shadow-lg transition-all duration-300 overflow-hidden h-full ${
                      hasPuzzles ? 'hover:shadow-2xl transform hover:scale-105 hover:-translate-y-1' : ''
                    }`}>
                      {/* Background gradient */}
                      {hasPuzzles && (
                        <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      )}
                      
                      {/* Content */}
                      <div className="relative p-8 z-10">
                        {/* Icon */}
                        <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                          📋
                        </div>

                        {/* Title */}
                        <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-white transition-colors capitalize">
                          {topic.label || topic.name}
                        </h3>

                        {/* Puzzle Count */}
                        <div className="flex items-center gap-2 mb-6">
                          <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                            hasPuzzles
                              ? 'bg-blue-100 text-blue-700 group-hover:bg-white/30 group-hover:text-white'
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {topic.puzzleCount || 0} Puzzle{(topic.puzzleCount || 0) !== 1 ? 's' : ''}
                          </span>
                        </div>

                        {/* CTA Button */}
                        {hasPuzzles && (
                          <div className="flex items-center gap-2 text-purple-600 group-hover:text-white font-semibold transition-colors">
                            <span>Play</span>
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
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
