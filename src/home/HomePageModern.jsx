import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SiteLayout from "../layouts/SiteLayout";
import {
  HeroSectionModern,
  CategoryGridModern,
  StatsSectionModern,
  HowItWorksModern,
  BenefitsSectionModern,
  CTASectionModern
} from "../design/ModernDesignSystem";
import DailyChallengeCard from "../components/DailyChallenge/DailyChallengeCard";
import Footer from "./components/Footer";

export default function HomePageModern() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  const steps = [
    {
      title: "Choose a Puzzle",
      description: "Browse from hundreds of puzzles across multiple categories"
    },
    {
      title: "Start Playing",
      description: "Challenge yourself with different difficulty levels"
    },
    {
      title: "Track Progress",
      description: "Monitor your achievements and compete with friends"
    },
    {
      title: "Share & Celebrate",
      description: "Share your results and celebrate your wins"
    }
  ];

  const benefits = [
    {
      icon: "🎮",
      title: "Diverse Puzzles",
      description: "From Jigsaw to Word Search, matching games to logical puzzles"
    },
    {
      icon: "📱",
      title: "Play Anywhere",
      description: "Seamless experience across desktop, tablet, and mobile"
    },
    {
      icon: "👥",
      title: "Community",
      description: "Connect with puzzle enthusiasts and compete on leaderboards"
    },
    {
      icon: "⭐",
      title: "Daily Challenges",
      description: "New puzzles every day to keep you engaged"
    }
  ];

  useEffect(() => {
    setCategories([
      { id: 1, name: "Jigsaw", icon: "🧩", count: 45 },
      { id: 2, name: "Matching", icon: "🎯", count: 38 },
      { id: 3, name: "Word Search", icon: "📝", count: 32 },
      { id: 4, name: "Lateral Thinking", icon: "💡", count: 28 },
      { id: 5, name: "Visual Patterns", icon: "👁️", count: 24 },
      { id: 6, name: "Sequence", icon: "📊", count: 31 },
      { id: 7, name: "Sudoku", icon: "🔢", count: 26 },
      { id: 8, name: "Spot Difference", icon: "🔍", count: 20 }
    ]);
  }, []);

  const handleCategoryClick = (category) => {
    navigate(`/puzzle/${encodeURIComponent(category.name)}`);
  };

  return (
    <SiteLayout>
      {/* Modern Hero Section with Glassmorphism */}
      <HeroSectionModern
        title="Solve Puzzles, Challenge Yourself"
        subtitle="Explore hundreds of exciting puzzles and test your skills. From Jigsaw to Word Search, find your favorite puzzle type and become a master."
        primaryCta={{
          label: "🎮 Start Playing",
          onClick: () => navigate("/puzzle")
        }}
        secondaryCta={{
          label: "📊 View Leaderboards",
          onClick: () => navigate("/leaderboards")
        }}
      />

      {/* Daily Challenge Section */}
      <div style={{
        maxWidth: "1200px",
        margin: "80px auto 40px",
        padding: "0 20px"
      }}>
        <h2 style={{
          fontSize: "clamp(1.6rem, 4vw, 2.2rem)",
          fontWeight: 800,
          marginBottom: "30px",
          color: "#1f2937",
          display: "flex",
          alignItems: "center",
          gap: "12px"
        }}>
          🎯 Today's Challenge
        </h2>
        <DailyChallengeCard onPlayClick={() => {}} />
      </div>

      {/* Categories Section with Modern Design */}
      <div style={{
        background: 'linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%)',
        padding: "100px 20px",
        marginTop: 40
      }}>
        <div style={{
          maxWidth: "1200px",
          margin: "0 auto 50px"
        }}>
          <h2 style={{
            fontSize: "clamp(2rem, 5vw, 2.8rem)",
            fontWeight: 900,
            marginBottom: 16,
            color: "#0f172a",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text"
          }}>
            📚 Browse Categories
          </h2>
          <p style={{
            color: "#6b7280",
            fontSize: "1.15rem",
            fontWeight: 500,
            margin: 0
          }}>
            Select a category to start exploring puzzles
          </p>
        </div>
        <CategoryGridModern
          categories={categories}
          onCategoryClick={handleCategoryClick}
        />
      </div>

      {/* How It Works Section */}
      <HowItWorksModern steps={steps} />

      {/* Benefits Section with Glassmorphism */}
      <BenefitsSectionModern benefits={benefits} />

      {/* Stats Section */}
      <StatsSectionModern stats={[
        { value: "500+", label: "Puzzles" },
        { value: "10K+", label: "Players" },
        { value: "50K+", label: "Solved" },
        { value: "1M+", label: "Plays" }
      ]} />

      {/* Final CTA */}
      <CTASectionModern
        title="Ready to Test Your Skills?"
        subtitle="Join thousands of puzzle enthusiasts and start your puzzle journey today"
        primaryCta={{
          label: "🚀 Explore All Puzzles",
          onClick: () => navigate("/puzzle")
        }}
        secondaryCta={{
          label: "📱 Download App",
          onClick: () => console.log("Download app")
        }}
      />

      <Footer />
    </SiteLayout>
  );
}
