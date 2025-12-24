// src/puzzles/PuzzleCard.jsx
// Card for a puzzle, used in subtopic page
import React from "react";
import { Link } from "react-router-dom";
import { ResponsiveImage } from "../components/OptimizedImage";

export default function PuzzleCard({ puzzle, categoryName, topicName, subtopicName }) {
  // Build URL: /puzzle/:categoryName/:topicName/:subtopicName/:puzzleId
  const url = `/puzzle/${encodeURIComponent(categoryName || puzzle.category)}` +
    `/${encodeURIComponent(topicName || puzzle.topic)}` +
    `/${encodeURIComponent(subtopicName || puzzle.subtopic)}` +
    `/${puzzle.id}`;

  return (
    <Link to={url}>
      <div className="rounded-lg shadow-md bg-white hover:shadow-lg transition-all overflow-hidden pastel-card">
        {/* Image */}
        <div className="relative h-40 bg-gradient-to-br from-blue-100 to-purple-100 overflow-hidden">
          {puzzle.imageUrl ? (
            <ResponsiveImage
              src={puzzle.imageUrl}
              cloudinaryId={puzzle.cloudinaryId}
              alt={puzzle.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-3xl">
              🧩
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-bold text-base mb-2 line-clamp-2 text-gray-800">
            {puzzle.title}
          </h3>
          <p className="text-xs text-gray-600 mb-3 line-clamp-1">
            {puzzle.description || puzzle.topic}
          </p>
          
          {/* Type badge */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded capitalize font-medium">
              {puzzle.type}
            </span>
          </div>

          {/* Rewards */}
          <div className="flex justify-between text-xs text-gray-600">
            <span>⭐ {puzzle.difficulty || 'easy'}</span>
            <span>🏆 {puzzle.xp || 10} XP</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
