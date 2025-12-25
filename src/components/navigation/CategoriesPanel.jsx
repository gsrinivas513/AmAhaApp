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
      className={`bg-white shadow-2xl rounded-lg overflow-hidden ${
        isAbsolute ? "absolute top-full left-0 right-0 z-40 mt-0" : "mt-8"
      }`}
      style={{
        maxWidth: "100%",
      }}
    >
      {/* Feature Header */}
      <div
        className="px-8 py-6 border-b-4 border-gray-200"
        style={{
          backgroundColor: `${feature.color || "#6C63FF"}15`,
          borderLeftColor: feature.color || "#6C63FF",
          borderLeftWidth: "4px",
        }}
      >
        <div className="flex items-center gap-3 mb-2">
          {feature.icon && (
            <span className="text-2xl">{feature.icon}</span>
          )}
          <h3 className="text-xl font-bold text-gray-900">
            {feature.name || feature.title}
          </h3>
        </div>
        {feature.description && (
          <p className="text-sm text-gray-600">
            {feature.description}
          </p>
        )}
      </div>

      {/* Categories Carousel */}
      <div className="px-8 py-6 relative">
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
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full transition-all duration-200 shadow-lg"
            aria-label="Scroll left"
            title="Previous categories"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Next Scroll Button */}
        {canScrollNext && (
          <button
            onClick={() => scroll("next")}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full transition-all duration-200 shadow-lg"
            aria-label="Scroll right"
            title="Next categories"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}

        {/* Indicator: Show items count when scrollable */}
        {(canScrollPrev || canScrollNext) && (
          <div className="text-center mt-4 text-xs text-gray-500">
            {Math.ceil((scrollPosition / totalItemWidth) + 1)} - {Math.min(Math.ceil(scrollPosition / totalItemWidth) + 5, categories.length)} of {categories.length}
          </div>
        )}
      </div>
    </div>
  );
}

export default CategoriesPanel;
