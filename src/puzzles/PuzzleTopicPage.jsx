// src/puzzles/PuzzleTopicPage.jsx
// Shows topics for a selected puzzle category
// Same pattern as quiz/SubcategoryPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SiteLayout from "../layouts/SiteLayout";
import { Card, Button } from "../components/ui";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { countPuzzlesForTopic, getPuzzlesForTopic } from "./puzzleCountService";
import { getRandomPuzzleByCategory } from "./quickPlayService";
import { ResponsiveImage } from "../components/OptimizedImage";
import { TopicCard, CarouselSection } from "./components/TopicCardGrid";

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

  // Restore scroll position when page loads
  useEffect(() => {
    if (!loading && categoryName) {
      const scrollKey = `puzzlePageScroll:${decodeURIComponent(categoryName)}`;
      const savedScroll = sessionStorage.getItem(scrollKey);
      if (savedScroll) {
        // Restore scroll position after a small delay to ensure DOM is ready
        setTimeout(() => {
          window.scrollTo(0, parseInt(savedScroll));
          sessionStorage.removeItem(scrollKey); // Clear after restoring
        }, 100);
      }
    }
  }, [loading, categoryName]);

  // Load all puzzle categories with their topics (when no categoryName param)
  const loadAllPuzzleCategories = async () => {
    try {
      setLoading(true);
      const categoriesSnap = await getDocs(collection(db, "categories"));
      let puzzleCategories = categoriesSnap.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(cat => cat.uiMode === "puzzle" && cat.isPublished !== false);

      // Load topics for each category with puzzle counts
      const categoriesWithTopics = await Promise.all(
        puzzleCategories.map(async (cat) => {
          const topicsSnap = await getDocs(
            query(collection(db, "topics"), where("categoryId", "==", cat.id))
          );
          const topicsData = topicsSnap.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .filter(topic => topic.isPublished !== false);
          
          // Count puzzles for each topic
          const topicsWithCounts = await Promise.all(
            topicsData.map(async (topic) => {
              const count = await countPuzzlesForTopic(topic.id, topic.name || topic.label);
              return { ...topic, puzzleCount: count, rating: 4.5 }; // Default rating 4.5
            })
          );
          
          return { ...cat, topics: topicsWithCounts };
        })
      );

      setCategories(categoriesWithTopics);
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

      // Load subtopics for each topic
      const topicsWithSubtopics = await Promise.all(
        topicsData.map(async (topic) => {
          // Load subtopics
          const subtopicsSnap = await getDocs(
            query(
              collection(db, "subtopics"),
              where("topicId", "==", topic.id)
            )
          );

          const subtopicsData = subtopicsSnap.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .filter(sub => sub.isPublished !== false);

          // Count puzzles for each subtopic
          const allPuzzlesForTopic = await getPuzzlesForTopic(topic.id, topic.name);
          
          const subtopicsWithCounts = subtopicsData.map(subtopic => {
            const subtopicPuzzles = allPuzzlesForTopic.filter(p => p.subtopicId === subtopic.id);
            const puzzleCount = subtopicPuzzles.length;
            const firstPuzzleId = subtopicPuzzles.length > 0 ? subtopicPuzzles[0].id : null;
            return { ...subtopic, puzzleCount, rating: 4.5, firstPuzzleId };
          });

          return { ...topic, subtopics: subtopicsWithCounts };
        })
      );

      setTopics(topicsWithSubtopics);
    } catch (error) {
      console.error("Error loading:", error);
    } finally {
      setLoading(false);
    }
  };

  // Quick play - get random puzzle by category
  const handleQuickPlayByCategory = async () => {
    try {
      // Save scroll position before navigating
      if (categoryName) {
        const scrollKey = `puzzlePageScroll:${decodeURIComponent(categoryName)}`;
        sessionStorage.setItem(scrollKey, window.scrollY.toString());
      }
      
      const puzzle = await getRandomPuzzleByCategory(categoryName);
      if (puzzle) {
        navigate(`/play/${puzzle.id}`);
      } else {
        alert("No puzzles available in this category yet.");
      }
    } catch (error) {
      console.error("Error quick playing:", error);
    }
  };

  // Save scroll position when navigating to puzzle
  const handleNavigateToPuzzle = (path) => {
    if (categoryName) {
      const scrollKey = `puzzlePageScroll:${decodeURIComponent(categoryName)}`;
      sessionStorage.setItem(scrollKey, window.scrollY.toString());
    }
    navigate(path);
  };

  if (loading) {
    return <SiteLayout><div className="p-8 text-center">Loading...</div></SiteLayout>;
  }

  // Get category color themes for visual differentiation
  const getCategoryTheme = (index) => {
    const themes = [
      { bg: 'bg-blue-50', accent: 'border-blue-300', headerGradient: 'from-blue-400 to-blue-500' },
      { bg: 'bg-purple-50', accent: 'border-purple-300', headerGradient: 'from-purple-400 to-purple-500' },
      { bg: 'bg-green-50', accent: 'border-green-300', headerGradient: 'from-green-400 to-green-500' },
      { bg: 'bg-pink-50', accent: 'border-pink-300', headerGradient: 'from-pink-400 to-pink-500' },
      { bg: 'bg-orange-50', accent: 'border-orange-300', headerGradient: 'from-orange-400 to-orange-500' },
      { bg: 'bg-indigo-50', accent: 'border-indigo-300', headerGradient: 'from-indigo-400 to-indigo-500' },
    ];
    return themes[index % themes.length];
  };

  // If no categoryName, show all puzzle categories with their topics
    if (!categoryName) {
      return (
        <SiteLayout>
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 text-white py-14 px-4 shadow-xl">
            <div className="max-w-7xl mx-auto">
              <button
                onClick={() => navigate('/')}
                className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-white/30 hover:bg-white/50 rounded-lg transition-colors text-white font-semibold shadow-md hover:shadow-lg"
              >
                <span>←</span> Back to Home
              </button>
              <h1 className="text-6xl font-black mb-3 text-transparent bg-gradient-to-r from-purple-900 via-purple-700 to-pink-600 bg-clip-text">🧩 Puzzles</h1>
              <p className="text-lg opacity-95 font-medium text-gray-700">Pick any topic and start solving puzzles!</p>
            </div>
          </div>        
          {/* Content */}
          <section className="py-20 px-4 bg-gradient-to-br from-gray-50 via-white to-gray-50">
            <div className="max-w-7xl mx-auto">
              {categories.length === 0 ? (
                <div className="text-center py-20">
                  <div className="text-8xl mb-4">🧩</div>
                  <p className="text-2xl text-gray-600 font-bold">No puzzle categories available yet.</p>
                  <p className="text-gray-500 mt-2">Check back soon!</p>
                </div>
              ) : (
                <div className="space-y-20">
                  {categories.map((cat, catIndex) => {
                    const theme = getCategoryTheme(catIndex);
                    return (
                      <div key={cat.id} className={`${theme.bg} rounded-3xl p-8 lg:p-12 shadow-lg transition-shadow hover:shadow-xl`}>
                        {/* Category Header with background color */}
                        <div className="mb-8 flex items-start justify-between">
                          <div className="flex-1">
                            <h2 className="text-2xl font-black text-transparent bg-gradient-to-r from-purple-700 to-pink-600 bg-clip-text mb-1">{cat.label || cat.name}</h2>
                            {cat.description && (
                              <p className="text-gray-600 text-sm">{cat.description}</p>
                            )}
                          </div>
                          {cat.topics && cat.topics.length > 4 && (
                            <button 
                              onClick={() => navigate(`/puzzle/${encodeURIComponent(cat.name || cat.label)}`)}
                              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold text-sm rounded-lg flex items-center gap-1 whitespace-nowrap ml-4 shadow-md hover:shadow-lg transition-all"
                            >
                              See all ({cat.topics.length})
                              <span>→</span>
                            </button>
                          )}
                        </div>

                        {/* Topics Carousel */}
                        <div>
                          {!cat.topics || cat.topics.length === 0 ? (
                            <p className="text-gray-400 text-center py-12 text-lg">No topics available in this category yet.</p>
                          ) : cat.topics.length > 4 ? (
                            <CarouselSection 
                              items={cat.topics} 
                              categoryName={cat.name || cat.label}
                              categoryTheme={theme}
                              catIndex={catIndex}
                              navigate={navigate}
                              getNavigationPath={(topic) => `/puzzle/${encodeURIComponent(cat.name || cat.label)}/${encodeURIComponent(topic.name || topic.label)}`}
                            />
                          ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                              {cat.topics.map((topic, topicIndex) => (
                                <TopicCard 
                                  key={topic.id}
                                  item={topic}
                                  categoryName={cat.label || cat.name}
                                  theme={theme}
                                  itemIndex={topicIndex}
                                  navigate={navigate}
                                  getNavigationPath={(t) => `/puzzle/${encodeURIComponent(cat.name || cat.label)}/${encodeURIComponent(t.name || t.label)}`}
                                  isCarousel={false}
                                />
                              ))}
                            </div>
                          )}
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
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2">🧩 {category?.label || category?.name}</h1>
              <p className="text-lg opacity-90">Choose a puzzle type and start playing</p>
            </div>
            <button
              onClick={handleQuickPlayByCategory}
              className="px-6 py-3 bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
              ⚡ Quick Play Random
            </button>
          </div>
        </div>
      </div>

      {/* Topics with Subtopics */}
      <section className="py-12 px-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {topics.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🧩</div>
              <p className="text-xl text-gray-600">No topics available yet.</p>
            </div>
          ) : (
            <div className="space-y-16">
              {topics.map((topic, topicIndex) => {
                const theme = getCategoryTheme(topicIndex);
                const subtopicsToShow = topic.subtopics || [];
                
                return (
                  <div key={topic.id} className={`${theme.bg} rounded-3xl p-8 lg:p-12 shadow-lg transition-shadow hover:shadow-xl`}>
                    {/* Topic Header */}
                    <div className="mb-8 flex items-start justify-between">
                      <div className="flex-1">
                        <h2 className="text-2xl font-black text-transparent bg-gradient-to-r from-purple-700 to-pink-600 bg-clip-text mb-2">
                          {topic.label || topic.name}
                        </h2>
                        <p className="text-gray-600 text-sm">
                          {subtopicsToShow.length} {subtopicsToShow.length === 1 ? 'Level' : 'Levels'} • {subtopicsToShow.reduce((sum, s) => sum + (s.puzzleCount || 0), 0)} Total Puzzles
                        </p>
                        {topic.description && (
                          <p className="text-gray-600 text-sm mt-2">{topic.description}</p>
                        )}
                      </div>
                      {subtopicsToShow && subtopicsToShow.length > 4 && (
                        <button 
                          onClick={() => navigate(`/puzzle/${encodeURIComponent(category.name || category.label)}/${encodeURIComponent(topic.name || topic.label)}`)}
                          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold text-sm rounded-lg flex items-center gap-1 whitespace-nowrap ml-4 shadow-md hover:shadow-lg transition-all"
                        >
                          See all ({subtopicsToShow.length})
                          <span>→</span>
                        </button>
                      )}
                    </div>

                    {/* Subtopics Grid or Carousel */}
                    {!subtopicsToShow || subtopicsToShow.length === 0 ? (
                      <p className="text-gray-400 text-center py-12 text-lg">No subtopics available in this topic yet.</p>
                    ) : subtopicsToShow.length > 4 ? (
                      <CarouselSection 
                        items={subtopicsToShow}
                        categoryName={topic.label || topic.name}
                        categoryTheme={theme}
                        catIndex={topicIndex}
                        navigate={handleNavigateToPuzzle}
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
                        {subtopicsToShow.map((subtopic, subIndex) => (
                          <TopicCard 
                            key={subtopic.id}
                            item={subtopic}
                            categoryName={null}
                            theme={theme}
                            itemIndex={subIndex}
                            navigate={handleNavigateToPuzzle}
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
                );
              })}
            </div>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
