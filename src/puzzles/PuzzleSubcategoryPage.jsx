// src/puzzles/PuzzleSubcategoryPage.jsx
// Shows subtopics for a selected puzzle category and topic
// Same pattern as quiz/TopicPage.jsx
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
  const [loading, setLoading] = useState(true);

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
          <p>Choose a subtopic to start solving puzzles</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {subtopics.length === 0 ? (
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
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
