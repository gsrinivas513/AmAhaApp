import React from 'react';
import {
  HeroSection,
  CategoriesSection,
  HowItWorksSection,
  StatsSection,
  FeaturesSection,
  CTASection
} from '../design/CleanProDesignSystem';

const HomePageClean = () => {
  const categories = [
    { name: 'Quizzes', count: '200+ items' },
    { name: 'Puzzles', count: '150+ items' },
    { name: 'Games', count: '100+ items' },
    { name: 'Stories', count: '80+ items' },
    { name: 'Logic', count: '120+ items' },
    { name: 'Riddles', count: '90+ items' },
    { name: 'Trivia', count: '110+ items' },
    { name: 'Studies', count: '75+ items' },
  ];

  const stats = [
    { value: '5M+', label: 'Active Users' },
    { value: '10K+', label: 'Games & Puzzles' },
    { value: '50+', label: 'Categories' },
    { value: '24/7', label: 'Available' }
  ];

  const steps = [
    { title: 'Sign Up', description: 'Create your free account in seconds' },
    { title: 'Choose', description: 'Pick from thousands of challenges' },
    { title: 'Play', description: 'Challenge yourself and have fun' },
    { title: 'Compete', description: 'Win rewards and climb leaderboards' }
  ];

  const features = [
    {
      icon: '⚡',
      title: 'Instant Access',
      description: 'No installation needed - start playing immediately in your browser'
    },
    {
      icon: '🏆',
      title: 'Compete & Win',
      description: 'Join tournaments and compete with friends worldwide'
    },
    {
      icon: '📱',
      title: 'Play Anywhere',
      description: 'Seamless experience on desktop, tablet, and mobile'
    },
    {
      icon: '💾',
      title: 'Auto-Save',
      description: 'Your progress is automatically saved across devices'
    },
    {
      icon: '🎓',
      title: 'Learn & Play',
      description: 'Educational content that entertains and teaches'
    },
    {
      icon: '👥',
      title: 'Community',
      description: 'Connect with millions of players worldwide'
    }
  ];

  const handlePlayNow = () => {
    console.log('Play clicked');
  };

  const handleBrowse = () => {
    console.log('Browse clicked');
  };

  const handleCategoryClick = (category) => {
    console.log('Category clicked:', category);
  };

  return (
    <div style={{
      background: '#1a1a2e',
      color: '#ffffff',
      minHeight: '100vh'
    }}>
      {/* Hero */}
      <HeroSection
        title="Play, Learn & Compete"
        subtitle="Join millions solving puzzles, playing games, and competing. Challenge your mind. Win rewards."
        primaryCta={{ label: 'Start Playing', onClick: handlePlayNow }}
        secondaryCta={{ label: 'Browse All', onClick: handleBrowse }}
      />

      {/* Categories */}
      <CategoriesSection
        categories={categories}
        onCategoryClick={handleCategoryClick}
      />

      {/* How It Works */}
      <HowItWorksSection steps={steps} />

      {/* Stats */}
      <StatsSection stats={stats} />

      {/* Features */}
      <FeaturesSection features={features} />

      {/* Daily Challenge */}
      <div style={{
        background: '#1a1a2e',
        padding: '80px 20px',
        borderBottom: '1px solid #2d2d44'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <h2 style={{
            fontSize: 'clamp(1.8rem, 4vw, 2.4rem)',
            fontWeight: 700,
            marginBottom: 12,
            color: '#ffffff'
          }}>
            Daily Challenge
          </h2>

          <p style={{
            fontSize: '0.95rem',
            color: '#b0b0c8',
            marginBottom: 30,
            maxWidth: '500px'
          }}>
            Complete today's challenge and earn bonus rewards
          </p>

          <div
            style={{
              background: '#252539',
              border: '1px solid #2d2d44',
              borderRadius: '8px',
              padding: 32,
              maxWidth: '500px'
            }}
          >
            <p style={{
              fontSize: '0.95rem',
              color: '#b0b0c8',
              marginBottom: 20,
              margin: 0
            }}>
              Earn coins, unlock achievements, and build your streak!
            </p>
            <button
              style={{
                padding: '10px 28px',
                background: '#6366f1',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background 150ms ease',
                marginTop: 16
              }}
              onMouseEnter={(e) => (e.target.style.background = '#4f46e5')}
              onMouseLeave={(e) => (e.target.style.background = '#6366f1')}
            >
              Start Challenge
            </button>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <CTASection
        title="Ready to Start?"
        subtitle="Create your free account now and join millions of players"
        primaryCta={{ label: 'Get Started Free', onClick: handlePlayNow }}
      />
    </div>
  );
};

export default HomePageClean;
