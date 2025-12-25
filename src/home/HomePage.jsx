import React from "react";
import SiteLayout from "../layouts/SiteLayout";
import HeroSection from "./components/HeroSection";
import FeatureTiles from "./components/FeatureTiles";
import FeatureGrid from "./components/FeatureGrid";
import StatsStrip from "./components/StatsStrip"; // ✅ NEW
import MotivationSection from "./components/MotivationSection";
import Footer from "./components/Footer";
import TestimonialsSection from "./components/TestimonialsSection";
import DailyChallengeCard from "../components/DailyChallenge/DailyChallengeCard";

export default function HomePage() {
  const handleDailyChallengePlay = () => {
    // Navigation is handled by the card component's onPlayClick
  };

  return (
    <SiteLayout>
        <HeroSection />

        <div style={{ marginTop: 72, marginBottom: 40 }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}>
            <h2 style={{ fontSize: "1.8rem", fontWeight: 700, marginBottom: "20px", color: "#2c3e50" }}>
              🎯 Today's Challenge
            </h2>
            <DailyChallengeCard onPlayClick={handleDailyChallengePlay} />
          </div>
        </div>

        <div style={{ marginTop: 72 }}>
          <FeatureTiles />
        </div>

       {/*  <div style={{ marginTop: 72 }}>
          <FeatureGrid />
        </div> */}

        {/* <div style={{ marginTop: 56 }}>
          <StatsStrip />
        </div> */}

        <div style={{ marginTop: 56 }}>
          <TestimonialsSection />
        </div>

        <div style={{ marginTop: 72 }}>
          <MotivationSection />
        </div>

        <Footer />
    </SiteLayout>
  );
}