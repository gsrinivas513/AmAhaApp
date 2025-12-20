// src/home/components/FeatureTiles.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../../components/ui";

// All quiz categories - Light, decent, pleasant gradient colors
const allCategories = [
  {
    title: "Art & Literature",
    icon: "🎨",
    quizzes: 42,
    difficulty: "Easy",
    path: "/quiz/kids",
    color: "from-rose-400 via-pink-300 to-rose-300",
    borderColor: "from-pink-300 to-rose-200",
  },
  {
    title: "Entertainment",
    icon: "🎬",
    quizzes: 38,
    difficulty: "Easy",
    path: "/quiz/movies",
    color: "from-amber-400 via-orange-300 to-yellow-300",
    borderColor: "from-orange-300 to-yellow-200",
  },
  {
    title: "Geography",
    icon: "🌍",
    quizzes: 45,
    difficulty: "Medium",
    path: "/quiz/students",
    color: "from-blue-400 via-cyan-300 to-blue-300",
    borderColor: "from-blue-300 to-cyan-200",
  },
  {
    title: "History",
    icon: "🏛️",
    quizzes: 52,
    difficulty: "Medium",
    path: "/quiz/programming",
    color: "from-orange-400 via-amber-300 to-yellow-300",
    borderColor: "from-amber-300 to-yellow-200",
  },
  {
    title: "Languages",
    icon: "🗣️",
    quizzes: 35,
    difficulty: "Hard",
    path: "/quiz/kids",
    color: "from-emerald-400 via-green-300 to-teal-300",
    borderColor: "from-green-300 to-teal-200",
  },
  {
    title: "Science & Nature",
    icon: "🔬",
    quizzes: 48,
    difficulty: "Medium",
    path: "/quiz/students",
    color: "from-cyan-400 via-teal-300 to-blue-300",
    borderColor: "from-cyan-300 to-teal-200",
  },
  {
    title: "Sports",
    icon: "⚽",
    quizzes: 40,
    difficulty: "Easy",
    path: "/quiz/programming",
    color: "from-red-400 via-orange-300 to-amber-300",
    borderColor: "from-red-300 to-orange-200",
  },
  {
    title: "Trivia",
    icon: "🧠",
    quizzes: 60,
    difficulty: "Hard",
    path: "/quiz/kids",
    color: "from-purple-400 via-violet-300 to-pink-300",
    borderColor: "from-purple-300 to-pink-200",
  },
];

// Section configurations - Netflix/Prime style
const sections = [
  {
    title: "🔥 Recently Published",
    categories: allCategories.slice(0, 8),
  },
  {
    title: "⭐ Popular Quizzes",
    categories: allCategories.slice().reverse(),
  },
  {
    title: "🏆 Best Rating Right Now",
    categories: allCategories.sort(() => Math.random() - 0.5),
  },
  {
    title: "🚀 Trending Now",
    categories: allCategories.slice().sort(() => Math.random() - 0.5),
  },
];

// Carousel component for horizontal scrolling
function CarouselSection({ section }) {
  const navigate = useNavigate();
  const [scrollPosition, setScrollPosition] = useState(0);
  const containerRef = React.useRef(null);
  
  const itemsPerView = 4;
  const itemWidth = 320; // Increased from 240 - Width of each card
  const maxScroll = Math.max(0, (section.categories.length - itemsPerView) * itemWidth);

  const scroll = (direction) => {
    let newPosition = scrollPosition + (direction === "next" ? itemWidth : -itemWidth);
    newPosition = Math.max(0, Math.min(newPosition, maxScroll));
    setScrollPosition(newPosition);
    
    if (containerRef.current) {
      containerRef.current.scrollTo({
        left: newPosition,
        behavior: "smooth",
      });
    }
  };

  const canScrollNext = scrollPosition < maxScroll;
  const canScrollPrev = scrollPosition > 0;

  return (
    <div className="mb-12">
      {/* Header with See All */}
      <div className="flex items-center justify-between mb-6 px-4">
        <h3 className="text-2xl font-bold text-gray-900">{section.title}</h3>
        <button className="text-primary-600 hover:text-primary-700 font-semibold text-sm flex items-center gap-1">
          See all ({section.categories.length})
          <span>→</span>
        </button>
      </div>

      {/* Carousel container with background */}
      <div className="relative group bg-gradient-to-r from-transparent via-white via-5% to-transparent bg-opacity-20 rounded-2xl py-4">
        {/* Carousel */}
        <div
          ref={containerRef}
          className="flex gap-8 overflow-x-hidden scroll-smooth px-6"
          style={{ scrollBehavior: "smooth" }}
        >
          {section.categories.map((category) => (
            <div key={category.title} className="flex-shrink-0 w-72">
              <Card
                hover
                onClick={() => navigate(category.path)}
                className={`h-80 flex flex-col items-start justify-end text-left cursor-pointer bg-gradient-to-br ${category.color} shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 relative overflow-hidden group rounded-3xl p-6`}
              >
                {/* Premium border glow effect */}
                <div className={`absolute inset-0 border-2 bg-gradient-to-br ${category.borderColor} opacity-40 group-hover:opacity-60 transition-opacity rounded-3xl`}></div>
                
                {/* Animated background overlay */}
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                
                {/* Shine effect */}
                <div className="absolute -inset-full bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-40 group-hover:translate-x-full transition-all duration-1000 transform"></div>

                {/* Top Icon Area */}
                <div className="absolute top-6 left-6 right-6 flex items-start justify-between z-10">
                  <div className="text-6xl drop-shadow-lg group-hover:scale-110 transition-transform duration-300">{category.icon}</div>
                  <span className="inline-block px-3 py-1.5 bg-white bg-opacity-40 backdrop-blur-md rounded-full text-xs font-bold text-white border border-white border-opacity-60 drop-shadow-md hover:bg-opacity-50 transition-all shadow-lg">
                    {category.difficulty}
                  </span>
                </div>

                {/* Bottom Content */}
                <div className="relative z-10 w-full">
                  <h4 className="text-lg font-bold text-white mb-2 drop-shadow-lg leading-tight">
                    {category.title}
                  </h4>
                  <p className="text-sm text-white text-opacity-95 drop-shadow-md font-medium">
                    {category.quizzes} Quizzes
                  </p>
                </div>
              </Card>
            </div>
          ))}
        </div>

        {/* Left arrow */}
        {canScrollPrev && (
          <button
            onClick={() => scroll("prev")}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full z-10 transition-all -ml-2"
            aria-label="Scroll left"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Right arrow */}
        {canScrollNext && (
          <button
            onClick={() => scroll("next")}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full z-10 transition-all -mr-2"
            aria-label="Scroll right"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

export default function FeatureTiles() {
  return (
    <section className="py-12 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Main heading */}
        <div className="mb-12 px-4">
          <h2 className="text-4xl font-bold text-gray-900">Explore Learning & Gaming</h2>
          <p className="text-gray-600 mt-2">Discover quizzes, puzzles, games, studies, and challenges across multiple categories</p>
        </div>

        {/* Carousel sections */}
        {sections.map((section) => (
          <CarouselSection key={section.title} section={section} />
        ))}
      </div>
    </section>
  );
}