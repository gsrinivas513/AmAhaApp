// src/quiz/TopicPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SiteLayout from "../layouts/SiteLayout";
import { Card, Button } from "../components/ui";

/**
 * TopicPage
 * Shows subtopics for a selected topic
 * User clicks on a subtopic to proceed to difficulty selection
 */
export default function TopicPage() {
  const { categoryName, topicName } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [topic, setTopic] = useState(null);
  const [subtopics, setSubtopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTopicAndSubtopics();
  }, [categoryName, topicName]);

  const loadTopicAndSubtopics = async () => {
    try {
      setLoading(true);

      const { collection, getDocs, query, where, orderBy } = await import("firebase/firestore");
      const { db } = await import("../firebase/firebaseConfig");
      
      const decodedCategoryName = decodeURIComponent(categoryName);
      const decodedTopicName = decodeURIComponent(topicName);
      
      // Load category by name or label
      const categoriesRef = collection(db, "categories");
      const allCategoriesSnap = await getDocs(categoriesRef);
      
      const categoryDoc = allCategoriesSnap.docs.find(doc => {
        const data = doc.data();
        return (data.name === decodedCategoryName || data.label === decodedCategoryName);
      });
      
      if (!categoryDoc) {
        console.warn("Category not found:", decodedCategoryName);
        navigate("/");
        return;
      }
      
      const categoryData = { id: categoryDoc.id, ...categoryDoc.data() };
      setCategory(categoryData);

      // Load topic by name or label
      const topicsRef = collection(db, "topics");
      const allTopicsSnap = await getDocs(query(topicsRef, where("categoryId", "==", categoryData.id)));
      
      const topicDoc = allTopicsSnap.docs.find(doc => {
        const data = doc.data();
        return (data.name === decodedTopicName || data.label === decodedTopicName);
      });
      
      if (!topicDoc) {
        console.warn("Topic not found:", decodedTopicName);
        navigate(`/quiz/${encodeURIComponent(categoryName)}`);
        return;
      }
      
      const topicData = { id: topicDoc.id, ...topicDoc.data() };
      setTopic(topicData);

      // Load subtopics by topicId
      const subtopicsQuery = query(
        collection(db, "subtopics"),
        where("topicId", "==", topicData.id)
      );
      const subtopicsSnap = await getDocs(subtopicsQuery);
      const subtopicsData = subtopicsSnap.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(subtopic => subtopic.isPublished !== false)
        .sort((a, b) => (a.order || 0) - (b.order || 0));
      
      const enrichedSubtopics = subtopicsData.map((subtopic) => ({
        ...subtopic,
        quizCount: subtopic.quizCount || 0,
        rating: generateRealisticRating(subtopic.quizCount || 0, subtopic.id),
      }));
      setSubtopics(enrichedSubtopics);
    } catch (error) {
      console.error("Error loading subtopics:", error);
      setTopic(null);
    } finally {
      setLoading(false);
    }
  };

  const generateRealisticRating = (quizCount = 0, subtopicId = '') => {
    const minRating = 3.8;
    const maxRating = 5.0;
    const quizFactor = Math.min(quizCount / 100, 0.5);
    
    let hash = 0;
    for (let i = 0; i < subtopicId.length; i++) {
      hash = ((hash << 5) - hash) + subtopicId.charCodeAt(i);
      hash = hash & hash;
    }
    const normalizedHash = (Math.abs(hash) % 100) / 100;
    const consistentFactor = (normalizedHash - 0.5) * 0.4;
    
    let rating = minRating + quizFactor + consistentFactor;
    rating = Math.max(minRating, Math.min(maxRating, rating));
    return Math.round(rating * 10) / 10;
  };

  const getSubtopicIcon = (index) => {
    const icons = ["📚", "🔬", "🎨", "🌍", "🎭", "💻", "⚽", "🏛️"];
    return icons[index % icons.length];
  };

  if (loading) {
    return (
      <SiteLayout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-gray-600">Loading subtopics...</div>
        </div>
      </SiteLayout>
    );
  }

  if (!topic) {
    return (
      <SiteLayout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-gray-600">Topic not found</div>
        </div>
      </SiteLayout>
    );
  }

  if (subtopics.length === 0) {
    return (
      <SiteLayout>
        <div className="max-w-7xl mx-auto px-4 py-12">
          <button
            onClick={() => navigate(`/quiz/${encodeURIComponent(categoryName)}`)}
            className="mb-6 text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2"
          >
            ← Back to {category?.name || 'Category'}
          </button>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {topic.name || topic.label}
          </h1>

          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              No subtopics available yet. Check back soon!
            </p>
          </div>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Back Button */}
        <button
          onClick={() => navigate(`/quiz/${encodeURIComponent(categoryName)}`)}
          className="mb-6 text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2"
        >
          ← Back to {category?.name || 'Category'}
        </button>

        {/* Topic Header */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="text-6xl">{topic.icon || "📖"}</div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {topic.name || topic.label}
              </h1>
              {topic.description && (
                <p className="text-gray-600 text-lg">{topic.description}</p>
              )}
            </div>
          </div>
          
          {/* Info banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-blue-800 font-medium">
              💡 Choose a subtopic below to start learning. Each subtopic has multiple difficulty levels!
            </p>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-gray-600">
            <span className="flex items-center gap-2">
              <span className="font-semibold text-gray-900">{subtopics.length}</span> Subtopics Available
            </span>
            <span className="flex items-center gap-2">
              <span className="font-semibold text-gray-900">
                {subtopics.reduce((sum, sub) => sum + (sub.quizCount || 0), 0)}
              </span> Total Quizzes
            </span>
          </div>
        </div>

        {/* Subtopics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subtopics.map((subtopic, index) => {
            const hasQuizzes = (subtopic.quizCount || 0) > 0;
            
            return (
              <Card
                key={subtopic.id}
                className={`transition-all duration-300 overflow-hidden ${
                  hasQuizzes 
                    ? "cursor-pointer hover:shadow-xl hover:scale-105" 
                    : "opacity-60 cursor-not-allowed"
                }`}
                onClick={() => hasQuizzes && navigate(
                  `/quiz/${encodeURIComponent(categoryName)}/${encodeURIComponent(topicName)}/${encodeURIComponent(subtopic.name)}/easy`
                )}
              >
                <div className="p-6">
                  {/* Icon and Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-5xl">{subtopic.icon || getSubtopicIcon(index)}</div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`text-xs font-bold px-2 py-1 rounded ${
                        hasQuizzes 
                          ? "bg-green-100 text-green-800" 
                          : "bg-gray-100 text-gray-600"
                      }`}>
                        {subtopic.quizCount || 0} {(subtopic.quizCount || 0) === 1 ? "Quiz" : "Quizzes"}
                      </span>
                      {!hasQuizzes && (
                        <span className="text-xs text-gray-500 font-medium">Coming Soon</span>
                      )}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {subtopic.name || subtopic.label}
                  </h3>

                  {/* Description */}
                  {subtopic.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {subtopic.description}
                    </p>
                  )}

                  {/* Rating */}
                  {hasQuizzes && (
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            className={`text-lg ${
                              star <= Math.floor(subtopic.rating)
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="text-sm font-semibold text-gray-700">
                        {subtopic.rating}
                      </span>
                    </div>
                  )}

                  {/* Difficulty badges preview */}
                  {hasQuizzes && (
                    <div className="flex gap-2 mb-4">
                      <span className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded-full font-medium">Easy</span>
                      <span className="text-xs px-2 py-1 bg-yellow-50 text-yellow-700 rounded-full font-medium">Medium</span>
                      <span className="text-xs px-2 py-1 bg-red-50 text-red-700 rounded-full font-medium">Hard</span>
                    </div>
                  )}

                  {/* Start Button */}
                  <Button
                    variant="primary"
                    className="w-full"
                    disabled={!hasQuizzes}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (hasQuizzes) {
                        navigate(
                          `/quiz/${encodeURIComponent(categoryName)}/${encodeURIComponent(topicName)}/${encodeURIComponent(subtopic.name)}/easy`
                        );
                      }
                    }}
                  >
                    {hasQuizzes ? "Start Learning →" : "Coming Soon"}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </SiteLayout>
  );
}
