// src/puzzles/PuzzleSubcategoryPage.jsx
// Shows subtopics for a selected puzzle category and topic
// If no subtopics exist, shows puzzles directly
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SiteLayout from "../layouts/SiteLayout";
import { Card, Button } from "../components/ui";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

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
        
        // Try to find puzzles by topic ID or topic name
        const puzzlesSnap = await getDocs(collection(db, "puzzles"));
        const puzzlesData = puzzlesSnap.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(puzzle => {
            // Match by topic ID, topic name, or type
            return (
              puzzle.topic === topicData.id ||
              puzzle.topic === topicData.name ||
              puzzle.topicId === topicData.id ||
              puzzle.type === topicData.name ||
              puzzle.type === topicData.id
            ) && puzzle.isPublished !== false;
          });
        
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
      <section className="section">
        <div className="container">
          <h1>🧩 {topic?.label || topic?.name}</h1>
          <p>{showPuzzlesDirectly ? "Choose a puzzle to play" : "Choose a subtopic to start solving puzzles"}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {/* Show puzzles directly if no subtopics */}
          {showPuzzlesDirectly ? (
            puzzles.length === 0 ? (
              <div className="text-center text-gray-600 py-12">
                <div className="text-4xl mb-4">🧩</div>
                <p>No puzzles available yet for this topic.</p>
                <p className="text-sm mt-2">Check back soon!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {puzzles.map(puzzle => (
                  <Card
                    key={puzzle.id}
                    className="cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-300 overflow-hidden"
                    onClick={() => navigate(`/puzzle/${encodeURIComponent(categoryName)}/${encodeURIComponent(topicName)}/${puzzle.id}`)}
                  >
                    <div className="p-6">
                      {puzzle.imageUrl && (
                        <div className="mb-4 rounded-lg overflow-hidden">
                          <img 
                            src={puzzle.imageUrl} 
                            alt={puzzle.title}
                            className="w-full h-32 object-cover"
                          />
                        </div>
                      )}
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">
                            {puzzle.title || puzzle.id}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {puzzle.description || `${puzzle.type} puzzle`}
                          </p>
                        </div>
                        <span className="text-3xl">🧩</span>
                      </div>
                      
                      <div className="flex items-center justify-between mb-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          puzzle.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                          puzzle.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {puzzle.difficulty || 'easy'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {puzzle.type}
                        </span>
                      </div>

                      <Button variant="primary" className="w-full">
                        Play Puzzle →
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )
          ) : (
            /* Show subtopics if they exist */
            subtopics.length === 0 ? (
              <div className="text-center text-gray-600 py-12">
                No subtopics available yet.
              </div>
            ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subtopics.map(subtopic => {
                const hasPuzzles = (subtopic.puzzleCount || 0) > 0;
                return (
                  <Card
                    key={subtopic.id}
                    className={`transition-all duration-300 overflow-hidden ${
                      hasPuzzles 
                        ? "cursor-pointer hover:shadow-xl hover:scale-105" 
                        : "opacity-60 cursor-not-allowed"
                    }`}
                    onClick={() => 
                      hasPuzzles && navigate(
                        `/puzzle/${encodeURIComponent(category.name || category.label)}` +
                        `/${encodeURIComponent(topic.name || topic.label)}` +
                        `/${encodeURIComponent(subtopic.name || subtopic.label)}`
                      )
                    }
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">
                            {subtopic.label || subtopic.name}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {subtopic.puzzleCount || 0} Puzzles
                          </p>
                        </div>
                        <span className="text-3xl">🧩</span>
                      </div>

                      <Button
                        variant="primary"
                        className="w-full"
                        disabled={!hasPuzzles}
                      >
                        {hasPuzzles ? "Start Puzzles →" : "Coming Soon"}
                      </Button>
                    </div>
                  </Card>
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
