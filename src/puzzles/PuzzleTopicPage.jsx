// src/puzzles/PuzzleTopicPage.jsx
// Shows topics for a selected puzzle category
// Same pattern as quiz/SubcategoryPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SiteLayout from "../layouts/SiteLayout";
import { Card, Button } from "../components/ui";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

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
      const puzzlesSnap = await getDocs(collection(db, "puzzles"));
      const allPuzzles = puzzlesSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      
      const topicsWithCounts = topicsData.map(topic => {
        const count = allPuzzles.filter(p => 
          p.topic === topic.id || 
          p.topic === topic.name || 
          p.topic === topic.label
        ).length;
        return { ...topic, puzzleCount: count };
      });

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
        <section className="section">
          <div className="container">
            <h1>🧩 Puzzles</h1>
            <p>Choose a puzzle category to explore</p>
          </div>
        </section>

        <section className="section">
          <div className="container">
            {categories.length === 0 ? (
              <div className="text-center text-gray-600 py-12">
                No puzzle categories available yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map(cat => (
                  <Card
                    key={cat.id}
                    className="cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-300 overflow-hidden"
                    onClick={() => navigate(`/puzzle/${encodeURIComponent(cat.name || cat.label)}`)}
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">
                            {cat.label || cat.name}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {cat.description || "Explore puzzles"}
                          </p>
                        </div>
                        <span className="text-3xl">🎮</span>
                      </div>

                      <Button variant="primary" className="w-full">
                        Explore Category →
                      </Button>
                    </div>
                  </Card>
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
      <section className="section">
        <div className="container">
          <h1>🧩 {category?.label || category?.name}</h1>
          <p>Choose a puzzle topic to explore</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {topics.length === 0 ? (
            <div className="text-center text-gray-600 py-12">
              No topics available yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topics.map(topic => {
                const hasPuzzles = (topic.puzzleCount || 0) > 0;
                return (
                  <Card
                    key={topic.id}
                    className={`transition-all duration-300 overflow-hidden ${
                      hasPuzzles 
                        ? "cursor-pointer hover:shadow-xl hover:scale-105" 
                        : "opacity-60 cursor-not-allowed"
                    }`}
                    onClick={() => 
                      hasPuzzles && navigate(
                        `/puzzle/${encodeURIComponent(category.name || category.label)}` +
                        `/${encodeURIComponent(topic.name || topic.label)}`
                      )
                    }
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">
                            {topic.label || topic.name}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {topic.puzzleCount || 0} Puzzles
                          </p>
                        </div>
                        <span className="text-3xl">📋</span>
                      </div>

                      <Button
                        variant="primary"
                        className="w-full"
                        disabled={!hasPuzzles}
                      >
                        {hasPuzzles ? "Explore Topic →" : "Coming Soon"}
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
