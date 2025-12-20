import React from "react";
import SiteLayout from "../layouts/SiteLayout";
import HeroSection from "./components/HeroSection";
import FeatureTiles from "./components/FeatureTiles";
import FeatureGrid from "./components/FeatureGrid";
import StatsStrip from "./components/StatsStrip"; // ✅ NEW
import MotivationSection from "./components/MotivationSection";
import Footer from "./components/Footer";
import TestimonialsSection from "./components/TestimonialsSection";

export default function HomePage() {
  return (
    <SiteLayout>
        <HeroSection />

        <div style={{ marginTop: 72 }}>
          <FeatureTiles />
        </div>

        <div style={{ marginTop: 72 }}>
          <FeatureGrid />
        </div>

        <div style={{ marginTop: 56 }}>
          <StatsStrip />
        </div>

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