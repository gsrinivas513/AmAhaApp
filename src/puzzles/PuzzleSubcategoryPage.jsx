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
import { getRandomPuzzleByTopic } from "./quickPlayService";
import { TopicCard, CarouselSection } from "./components/TopicCardGrid";

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

  // Restore scroll position when page loads
  useEffect(() => {
    if (!loading && categoryName && topicName) {
      const scrollKey = `puzzlePageScroll:${decodeURIComponent(categoryName)}/${decodeURIComponent(topicName)}`;
      const savedScroll = sessionStorage.getItem(scrollKey);
      if (savedScroll) {
        setTimeout(() => {
          window.scrollTo(0, parseInt(savedScroll));
          sessionStorage.removeItem(scrollKey);
        }, 100);
      }
    }
  }, [loading, categoryName, topicName]);

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

      // Load all puzzles for this topic first
      const allPuzzlesForTopic = await getPuzzlesForTopic(topicData.id, topicData.name);
      console.log("🧩 Loaded puzzles for topic:", topicData.name, allPuzzlesForTopic);
      setPuzzles(allPuzzlesForTopic);

      const subtopicsData = subtopicsSnap.docs
        .map(doc => {
          const subtopicData = doc.data();
          // Calculate actual puzzle count for this subtopic
          const subtopicPuzzles = allPuzzlesForTopic.filter(p => p.subtopicId === doc.id);
          const subtopicPuzzleCount = subtopicPuzzles.length;
          const firstPuzzleId = subtopicPuzzles.length > 0 ? subtopicPuzzles[0].id : null;
          
          return {
            id: doc.id,
            ...subtopicData,
            puzzleCount: subtopicPuzzleCount,
            firstPuzzleId: firstPuzzleId, // Store first puzzle ID for direct navigation
          };
        })
        .filter(sub => sub.isPublished !== false);

      setSubtopics(subtopicsData);

      // If no subtopics, load puzzles directly from the topic
      if (subtopicsData.length === 0) {
        console.log("No subtopics found, loading puzzles directly for topic:", topicData.id, topicData.name);
        setShowPuzzlesDirectly(allPuzzlesForTopic.length > 0);
      }
    } catch (error) {
      console.error("Error loading:", error);
    } finally {
      setLoading(false);
    }
  };

  // Quick play - get random puzzle by topic
  const handleQuickPlayByTopic = async () => {
    try {
      // Save scroll position before navigating
      const scrollKey = `puzzlePageScroll:${decodeURIComponent(categoryName)}/${decodeURIComponent(topicName)}`;
      sessionStorage.setItem(scrollKey, window.scrollY.toString());

      const puzzle = await getRandomPuzzleByTopic(categoryName, topicName);
      if (puzzle) {
        navigate(`/play/${puzzle.id}`);
      } else {
        alert("No puzzles available in this type yet.");
      }
    } catch (error) {
      console.error("Error quick playing:", error);
    }
  };

  // Save scroll position when navigating to puzzle
  const handleNavigateToPuzzle = (path) => {
    console.log("📍 handleNavigateToPuzzle called with path:", path);
    const scrollKey = `puzzlePageScroll:${decodeURIComponent(categoryName)}/${decodeURIComponent(topicName)}`;
    sessionStorage.setItem(scrollKey, window.scrollY.toString());
    navigate(path);
  };

  if (loading) {
    return <SiteLayout><div className="p-8 text-center">Loading...</div></SiteLayout>;
  }

  return (
    <SiteLayout>
      {/* Content */}
      <section className="px-4 py-8 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 min-h-screen">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {puzzles.map((puzzle, index) => (
                  <TopicCard 
                    key={puzzle.id}
                    item={puzzle}
                    categoryName={null}
                    theme={{ headerGradient: 'from-purple-400 to-purple-500' }}
                    itemIndex={index}
                    navigate={handleNavigateToPuzzle}
                    getNavigationPath={(p) => `/play/${p.id}`}
                    isCarousel={false}
                  />
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
              <div>
                {/* Control Buttons - Only shown for subtopics view */}
                <div className="mb-8 flex items-center justify-between">
                  <button
                    onClick={() => navigate(`/puzzle/${encodeURIComponent(categoryName)}`)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors text-gray-800 font-semibold"
                  >
                    <span>←</span> Back to Puzzles
                  </button>
                  <button
                    onClick={handleQuickPlayByTopic}
                    className="px-6 py-2 bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all"
                  >
                    ⚡ Quick Play
                  </button>
                </div>

                <div className="bg-purple-50 rounded-3xl p-8 lg:p-12 shadow-lg transition-shadow hover:shadow-xl">
                {/* Section Header */}
                <div className="mb-8 flex items-start justify-between">
                  <div className="flex-1">
                    <h2 className="text-2xl font-black text-transparent bg-gradient-to-r from-purple-700 to-pink-600 bg-clip-text mb-2">
                      {topic?.label || topic?.name}
                    </h2>
                    <p className="text-gray-600 text-sm">
                      {subtopics.length} {subtopics.length === 1 ? 'Level' : 'Levels'} • {subtopics.reduce((sum, s) => sum + (s.puzzleCount || 0), 0)} Total Puzzles
                    </p>
                    {topic?.description && (
                      <p className="text-gray-600 text-sm mt-2">{topic.description}</p>
                    )}
                  </div>
                  {subtopics && subtopics.length > 4 && (
                    <button 
                      onClick={() => navigate(`/puzzle/${encodeURIComponent(categoryName)}/${encodeURIComponent(topicName)}`)}
                      className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold text-sm rounded-lg flex items-center gap-1 whitespace-nowrap ml-4 shadow-md hover:shadow-lg transition-all"
                    >
                      See all ({subtopics.length})
                      <span>→</span>
                    </button>
                  )}
                </div>

                {/* Subtopics Grid or Carousel */}
                {subtopics.length > 4 ? (
                  <CarouselSection 
                    items={subtopics}
                    categoryName={topic?.label || topic?.name}
                    categoryTheme={{ bg: 'bg-purple-50', accent: 'border-purple-300', headerGradient: 'from-purple-400 to-purple-500' }}
                    catIndex={0}
                    navigate={navigate}
                    getNavigationPath={(subtopic) => {
                      // If it has difficulty field, it's a puzzle itself
                      if (subtopic.difficulty) {
                        return `/play/${subtopic.id}`;
                      }
                      // Otherwise it's a subtopic, use firstPuzzleId
                      return subtopic.firstPuzzleId ? `/play/${subtopic.firstPuzzleId}` : '#';
                    }}
                  />
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {subtopics.map((subtopic, index) => (
                      <TopicCard 
                        key={subtopic.id}
                        item={subtopic}
                        categoryName={null}
                        theme={{ bg: 'bg-purple-50', accent: 'border-purple-300', headerGradient: 'from-purple-400 to-purple-500' }}
                        itemIndex={index}
                        navigate={navigate}
                        getNavigationPath={(s) => {
                          // If it has difficulty field, it's a puzzle itself
                          if (s.difficulty) {
                            return `/play/${s.id}`;
                          }
                          // Otherwise it's a subtopic, use firstPuzzleId
                          return s.firstPuzzleId ? `/play/${s.firstPuzzleId}` : '#';
                        }}
                        isCarousel={false}
                      />
                    ))}
                  </div>
                )}
              </div>
              </div>
            )
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
