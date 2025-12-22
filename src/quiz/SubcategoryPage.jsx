// src/quiz/SubcategoryPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SiteLayout from "../layouts/SiteLayout";
import { Card, Button } from "../components/ui";
import {
  getCategory,
  getSubcategoriesByCategory,
} from "./services/subcategoryService";

/**
 * SubcategoryPage
 * Shows subcategories for a selected category
 * User clicks on a subcategory to proceed to difficulty selection
 */
export default function SubcategoryPage() {
  const { featureType, categoryName } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategoryAndSubcategories();
  }, [categoryName]);

  const loadCategoryAndSubcategories = async () => {
    try {
      setLoading(true);

      // Load the parent category by name
      const { collection, getDocs, query, where } = await import("firebase/firestore");
      const { db } = await import("../firebase/firebaseConfig");
      
      const decodedCategoryName = decodeURIComponent(categoryName);
      const categoryQuery = query(
        collection(db, "categories"),
        where("name", "==", decodedCategoryName)
      );
      const categorySnap = await getDocs(categoryQuery);
      
      if (categorySnap.empty) {
        console.warn("Category not found:", decodedCategoryName);
        navigate("/");
        return;
      }
      
      const categoryData = { id: categorySnap.docs[0].id, ...categorySnap.docs[0].data() };
      setCategory(categoryData);

      // Load subcategories by categoryId (only published ones for users)
      const subcatsQuery = query(
        collection(db, "subtopics"),
        where("categoryId", "==", categoryData.id)
      );
      const subcatsSnap = await getDocs(subcatsQuery);
      const subcatsData = subcatsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      const publishedSubcats = subcatsData.filter(sub => sub.isPublished !== false);
      const enrichedSubcats = publishedSubcats.map((subcat) => ({
        ...subcat,
        quizCount: subcat.quizCount || 0,
        rating: generateRealisticRating(subcat.quizCount || 0, subcat.id),
      }));
      setSubcategories(enrichedSubcats);
    } catch (error) {
      console.error("Error loading subcategories:", error);
      setCategory(null);
    } finally {
      setLoading(false);
    }
  };

  const generateRealisticRating = (quizCount = 0, subcategoryId = '') => {
    const minRating = 3.8;
    const maxRating = 5.0;
    const quizFactor = Math.min(quizCount / 100, 0.5);
    
    // Consistent pseudo-random based on subcategory ID
    let hash = 0;
    for (let i = 0; i < subcategoryId.length; i++) {
      hash = ((hash << 5) - hash) + subcategoryId.charCodeAt(i);
      hash = hash & hash;
    }
    const normalizedHash = (Math.abs(hash) % 100) / 100;
    const consistentFactor = (normalizedHash - 0.5) * 0.4;
    
    let rating = minRating + quizFactor + consistentFactor;
    rating = Math.max(minRating, Math.min(maxRating, rating));
    return Math.round(rating * 10) / 10;
  };

  const getSubcategoryIcon = (index) => {
    const icons = ["📚", "🔬", "🎨", "🌍", "🎭", "💻", "⚽", "🏛️"];
    return icons[index % icons.length];
  };
  
  const getTopicIcon = (topicName) => {
    const topicIcons = {
      "Animals": "🐾",
      "Nature": "🌿",
      "Food": "🍎",
      "Learning Basics": "🎨",
      "Math": "🧮",
      "Science": "🔬",
      "Geography": "🌍",
      "History": "🏛️",
      "Sports": "⚽",
      "Technology": "💻",
      "Arts": "🎭",
      "Language": "📖",
      "Music": "🎵",
      "Space": "🚀",
      "Body": "🧑",
    };
    return topicIcons[topicName] || "📚";
  };

  if (loading) {
    return (
      <SiteLayout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-gray-600">Loading subcategories...</div>
        </div>
      </SiteLayout>
    );
  }

  if (!category) {
    return (
      <SiteLayout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-gray-600">Category not found</div>
        </div>
      </SiteLayout>
    );
  }

  if (subcategories.length === 0) {
    return (
      <SiteLayout>
        <div className="max-w-7xl mx-auto px-4 py-12">
          <button
            onClick={() => navigate("/")}
            className="mb-6 text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2"
          >
            ← Back to Categories
          </button>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {category.label || category.name}
          </h1>

          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              No subcategories available yet. Check back soon!
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
          onClick={() => navigate("/")}
          className="mb-6 text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2"
        >
          ← Back to Categories
        </button>

        {/* Category Header with visual context */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="text-6xl">{category.icon || "📚"}</div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {category.label || category.name}
              </h1>
              {category.description && (
                <p className="text-gray-600 text-lg">{category.description}</p>
              )}
            </div>
          </div>
          
          {/* Info banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-blue-800 font-medium">
              💡 Choose a topic below to start learning. Each topic has multiple difficulty levels and quizzes!
            </p>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-gray-600">
            <span className="flex items-center gap-2">
              <span className="font-semibold text-gray-900">{subcategories.length}</span> Topics Available
            </span>
            <span className="flex items-center gap-2">
              <span className="font-semibold text-gray-900">
                {subcategories.reduce((sum, sub) => sum + (sub.quizCount || 0), 0)}
              </span> Total Quizzes
            </span>
          </div>
        </div>

        {/* Group subcategories by topic */}
        {(() => {
          // Group by topic
          const grouped = {};
          const noTopicSubcats = [];
          
          subcategories.forEach(subcat => {
            if (subcat.topic) {
              if (!grouped[subcat.topic]) {
                grouped[subcat.topic] = [];
              }
              grouped[subcat.topic].push(subcat);
            } else {
              noTopicSubcats.push(subcat);
            }
          });
          
          const topicKeys = Object.keys(grouped).sort();
          
          return (
            <>
              {/* Render grouped topics */}
              {topicKeys.map(topicName => (
                <div key={topicName} className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <span className="text-3xl">{getTopicIcon(topicName)}</span>
                    {topicName}
                    <span className="text-sm font-normal text-gray-500">
                      ({grouped[topicName].length} {grouped[topicName].length === 1 ? 'topic' : 'topics'})
                    </span>
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {grouped[topicName].map((subcat, index) => renderSubcategoryCard(subcat, index))}
                  </div>
                </div>
              ))}
              
              {/* Render ungrouped subcategories */}
              {noTopicSubcats.length > 0 && (
                <div className="mb-12">
                  {topicKeys.length > 0 && (
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                      Other Topics
                    </h2>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {noTopicSubcats.map((subcat, index) => renderSubcategoryCard(subcat, index))}
                  </div>
                </div>
              )}
            </>
          );
        })()}
      </div>
    </SiteLayout>
  );

  // Helper function to render subcategory card (defined inside the component)
  function renderSubcategoryCard(subcat, index) {
    const hasQuizzes = (subcat.quizCount || 0) > 0;
            
    return (
      <Card
        key={subcat.id}
        className={`transition-all duration-300 overflow-hidden ${
          hasQuizzes 
            ? "cursor-pointer hover:shadow-xl hover:scale-105" 
            : "opacity-60 cursor-not-allowed"
        }`}
        onClick={() => hasQuizzes && navigate(`/${featureType}/${encodeURIComponent(category.name)}/${encodeURIComponent(subcat.topic || 'general')}/${encodeURIComponent(subcat.name)}/easy`)}
      >
        <div className="p-6">
          {/* Icon and Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="text-5xl">{subcat.icon || getSubcategoryIcon(index)}</div>
            <div className="flex flex-col items-end gap-1">
              <span className={`text-xs font-bold px-2 py-1 rounded ${
                hasQuizzes 
                  ? "bg-green-100 text-green-800" 
                  : "bg-gray-100 text-gray-600"
              }`}>
                {subcat.quizCount || 0} {(subcat.quizCount || 0) === 1 ? "Quiz" : "Quizzes"}
              </span>
              {!hasQuizzes && (
                <span className="text-xs text-gray-500 font-medium">Coming Soon</span>
              )}
            </div>
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {subcat.label || subcat.name}
          </h3>

          {/* Description */}
          {subcat.description && (
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
              {subcat.description}
            </p>
          )}

          {/* Rating - only show if has quizzes */}
          {hasQuizzes && (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`text-lg ${
                      star <= Math.floor(subcat.rating)
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="text-sm font-semibold text-gray-700">
                {subcat.rating}
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
                navigate(`/${featureType}/${encodeURIComponent(category.name)}/${encodeURIComponent(subcat.topic || 'general')}/${encodeURIComponent(subcat.name)}/easy`);
              }
            }}
          >
            {hasQuizzes ? "Start Learning →" : "Coming Soon"}
          </Button>
        </div>
      </Card>
    );
  }
}
