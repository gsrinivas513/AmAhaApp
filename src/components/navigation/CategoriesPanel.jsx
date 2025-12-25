/**
 * CategoriesPanel.jsx
 * Shows categories for a selected feature in a horizontal scrollable carousel
 * Uses CategoryCardItem component for consistent styling with home page
 * Displays pagination arrows when there are more items to scroll
 */

import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import CategoryCardItem from "./CategoryCardItem";

function CategoriesPanel({ feature, categories, config, isAbsolute = false }) {
  const navigate = useNavigate();
  const [scrollPosition, setScrollPosition] = useState(0);
  const containerRef = useRef(null);

  if (!feature || !categories || categories.length === 0) {
    return null;
  }

  // Calculate scroll dimensions
  const itemWidth = 224; // w-56 width (224px) + gap (24px) = 248px per item
  const gap = 24;
  const totalItemWidth = itemWidth + gap;
  const totalWidth = categories.length * totalItemWidth;
  const containerWidth = 1200;
  const maxScroll = Math.max(0, totalWidth - containerWidth);

  // Handle carousel scrolling
  const scroll = (direction) => {
    let newPosition = scrollPosition + (direction === "next" ? totalItemWidth : -totalItemWidth);
    newPosition = Math.max(0, Math.min(newPosition, maxScroll));
    setScrollPosition(newPosition);
  };

  const canScrollPrev = scrollPosition > 0;
  const canScrollNext = scrollPosition < maxScroll;

  // Handle category click navigation
  const handleCategoryClick = (category) => {
    const categoryId = category.key || category.id;
    const categoryName = category.title || category.name;

    if (feature.id === "quizzes" || feature.id === "UpNde0cmlHFDQXgTcQOJ") {
      navigate(`/quiz/${categoryId}`, {
        state: { categoryName },
      });
    } else if (feature.id === "puzzles" || feature.id === "Puzzles") {
      navigate(`/puzzles/${categoryId}`, {
        state: { categoryName },
      });
    } else {
      navigate(`/category/${categoryId}`, {
        state: { categoryName },
      });
    }
  };

  return (
    <div
      className={`bg-gradient-to-b from-blue-50 via-purple-50 to-pink-50 shadow-2xl rounded-2xl overflow-hidden ${
        isAbsolute ? "absolute top-full left-0 right-0 z-40 mt-0" : "mt-8"
      }`}
      style={{
        maxWidth: "100%",
        borderTop: `6px solid ${feature.color || "#6C63FF"}`,
      }}
    >
      {/* Feature Header - Colorful and Kid-Friendly */}
      <div
        className="px-8 py-5 border-b-2"
        style={{
          background: `linear-gradient(135deg, ${feature.color || "#6C63FF"}1a 0%, ${feature.color || "#6C63FF"}08 100%)`,
          borderBottomColor: `${feature.color || "#6C63FF"}30`,
          borderBottomWidth: "2px",
        }}
      >
        <div className="flex items-center gap-3 mb-3">
          {feature.icon && (
            <span className="text-4xl drop-shadow-lg">{feature.icon}</span>
          )}
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              {feature.name || feature.title}
            </h3>
          </div>
        </div>
        {feature.description && (
          <p className="text-sm font-medium text-gray-700 ml-12">
            ✨ {feature.description}
          </p>
        )}
      </div>

      {/* Categories Carousel - Colorful & Interactive */}
      <div className="px-8 py-8 relative bg-gradient-to-b from-white to-blue-50">
        <div className="mb-2">
          <p className="text-xs font-bold text-purple-600 uppercase tracking-wider">
            🎯 Choose a category to explore
          </p>
        </div>
        
        {/* Scroll Container with overflow hidden */}
        <div className="overflow-x-hidden">
          <div
            ref={containerRef}
            className="flex gap-6 transition-transform duration-300 ease-out"
            style={{
              transform: `translateX(-${scrollPosition}px)`,
            }}
          >
            {categories.map((category, index) => (
              <CategoryCardItem
                key={category.id || category.key || index}
                category={category}
                index={index}
                onClick={() => handleCategoryClick(category)}
                compact={true}
              />
            ))}
          </div>
        </div>

        {/* Previous Scroll Button */}
        {canScrollPrev && (
          <button
            onClick={() => scroll("prev")}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-purple-50 text-purple-600 p-3 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl border-2 border-purple-200 hover:border-purple-400 group"
            aria-label="Scroll left"
            title="Previous categories"
          >
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Next Scroll Button */}
        {canScrollNext && (
          <button
            onClick={() => scroll("next")}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-purple-50 text-purple-600 p-3 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl border-2 border-purple-200 hover:border-purple-400 group"
            aria-label="Scroll right"
            title="Next categories"
          >
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}

        {/* Indicator: Show items count when scrollable */}
        {(canScrollPrev || canScrollNext) && (
          <div className="text-center mt-4 text-xs font-bold text-purple-600 flex items-center justify-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
            {Math.ceil((scrollPosition / totalItemWidth) + 1)} - {Math.min(Math.ceil(scrollPosition / totalItemWidth) + 5, categories.length)} of {categories.length}
            <span className="inline-block w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
          </div>
        )}
      </div>
    </div>
  );
}

export default CategoriesPanel;
