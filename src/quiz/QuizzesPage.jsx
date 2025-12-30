import React from "react";
import SiteLayout from "../layouts/SiteLayout";
import QuizCategoryGrid from "./components/QuizCategoryGrid";
import { HeroSection } from "../design/DesignSystem";
import { useNavigate } from "react-router-dom";

export default function QuizzesPage() {
  const navigate = useNavigate();

  return (
    <SiteLayout>
      <HeroSection
        title="Master Knowledge Through Quizzes"
        subtitle="Test your expertise across multiple subjects. Answer questions, earn points, and climb the leaderboards."
        backgroundGradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
        primaryCta={{
          label: "🎯 Start Quiz",
          onClick: () => navigate("/quiz/categories")
        }}
        secondaryCta={{
          label: "🏆 View Leaderboards",
          onClick: () => navigate("/leaderboards")
        }}
      />

      <div style={{
        maxWidth: "1200px",
        margin: "60px auto",
        padding: "0 20px"
      }}>
        <h2 style={{
          fontSize: "1.8rem",
          fontWeight: 700,
          marginBottom: 12,
          color: "#1f2937"
        }}>
          📚 Browse Quiz Categories
        </h2>
        <p style={{
          color: "#6b7280",
          marginBottom: 30,
          fontSize: "1.05rem"
        }}>
          Select a category to start answering questions
        </p>
      </div>

      <QuizCategoryGrid />
    </SiteLayout>
  );
}