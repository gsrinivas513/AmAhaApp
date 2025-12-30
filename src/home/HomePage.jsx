import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SiteLayout from "../layouts/SiteLayout";
import {
  HeroSection,
  CategoryGrid,
  StatsSection,
  FeaturedSection,
  HowItWorksSection,
  BenefitsSection,
  CTASection
} from "../design/DesignSystem";
import DailyChallengeCard from "../components/DailyChallenge/DailyChallengeCard";
import Footer from "./components/Footer";

export default function HomePage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState([
    { value: "500+", label: "Puzzles" },
    { value: "10K+", label: "Active Players" },
    { value: "50K+", label: "Puzzles Solved" },
    { value: "1M+", label: "Total Plays" }
  ]);

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
      title: "See Your Progress",
      description: "Track your achievements and compete with friends"
    },
    {
      title: "Share & Enjoy",
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
      description: "New puzzles every day to keep you engaged and motivated"
    }
  ];

  useEffect(() => {
    // Fetch categories from your API/Firebase
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

  const handlePlayDaily = () => {
    // Navigation handled by DailyChallengeCard
  };

  return (
    <SiteLayout>
      {/* Hero Section */}
      <HeroSection
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
        margin: "60px auto 40px",
        padding: "0 20px"
      }}>
        <h2 style={{
          fontSize: "1.8rem",
          fontWeight: 700,
          marginBottom: "20px",
          color: "#1f2937"
        }}>
          🎯 Today's Challenge
        </h2>
        <DailyChallengeCard onPlayClick={handlePlayDaily} />
      </div>

      {/* Categories Section */}
      <div style={{
        background: "#f8fafc",
        padding: "40px 20px",
        marginTop: 40
      }}>
        <div style={{
          maxWidth: "1200px",
          margin: "0 auto"
        }}>
          <h2 style={{
            fontSize: "1.8rem",
            fontWeight: 700,
            marginBottom: 8,
            color: "#1f2937"
          }}>
            📚 Browse Categories
          </h2>
          <p style={{
            color: "#6b7280",
            marginBottom: 30,
            fontSize: "1.05rem"
          }}>
            Select a category to start exploring puzzles
          </p>
        </div>
        <CategoryGrid
          categories={categories}
          onCategoryClick={handleCategoryClick}
        />
      </div>

      {/* How It Works */}
      <HowItWorksSection steps={steps} />

      {/* Benefits Section */}
      <BenefitsSection benefits={benefits} />

      {/* Stats Section */}
      <StatsSection stats={stats} />

      {/* Featured/Popular Puzzles */}
      <FeaturedSection
        title="Popular This Week"
        items={[
          {
            id: 1,
            title: "Mountain Landscape",
            description: "Beautiful jigsaw puzzle",
            rating: 4.8,
            plays: 1250,
            icon: "🏔️"
          },
          {
            id: 2,
            title: "Ocean Adventure",
            description: "Relaxing puzzle experience",
            rating: 4.7,
            plays: 980,
            icon: "🌊"
          },
          {
            id: 3,
            title: "Forest Mystery",
            description: "Challenge your mind",
            rating: 4.9,
            plays: 2100,
            icon: "🌲"
          },
          {
            id: 4,
            title: "City Lights",
            description: "Urban puzzle scene",
            rating: 4.6,
            plays: 756,
            icon: "🌃"
          }
        ]}
        onItemClick={(item) => navigate(`/play/${item.id}`)}
      />

      {/* Final CTA */}
      <CTASection
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