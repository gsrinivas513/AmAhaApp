import React from 'react';
import {
  HeroPuzzleFree,
  CategoriesPuzzleFree,
  HowItWorksPuzzleFree,
  StatsPuzzleFree,
  FeaturesPuzzleFree,
  CTAPuzzleFree
} from '../design/PuzzleFreExactReplica';

const HomePagePuzzleFreeExact = () => {
  const categories = [
    { name: 'Quiz', count: '200+ items', icon: '📝', id: 'quiz' },
    { name: 'Puzzles', count: '150+ items', icon: '🧩', id: 'puzzles' },
    { name: 'Games', count: '100+ items', icon: '🎮', id: 'games' },
    { name: 'Studies', count: '80+ items', icon: '📚', id: 'studies' },
    { name: 'Stories', count: '60+ items', icon: '📖', id: 'stories' },
    { name: 'Logic', count: '120+ items', icon: '🧠', id: 'logic' },
    { name: 'Riddles', count: '90+ items', icon: '🤔', id: 'riddles' },
    { name: 'Trivia', count: '110+ items', icon: '🌍', id: 'trivia' }
  ];

  const stats = [
    { value: '5M+', label: 'Users' },
    { value: '10K+', label: 'Games' },
    { value: '50+', label: 'Categories' },
    { value: '24/7', label: 'Available' }
  ];

  const steps = [
    { title: 'Sign Up', description: 'Create your free account' },
    { title: 'Choose', description: 'Pick your category' },
    { title: 'Play', description: 'Start playing and learning' },
    { title: 'Compete', description: 'Win rewards and compete' }
  ];

  const features = [
    {
      icon: '⚡',
      title: 'Fast & Simple',
      description: 'No installation needed. Start playing instantly in your browser'
    },
    {
      icon: '🏆',
      title: 'Compete',
      description: 'Join tournaments and compete with players worldwide'
    },
    {
      icon: '📱',
      title: 'Play Anywhere',
      description: 'Desktop, tablet, or mobile - seamless experience everywhere'
    },
    {
      icon: '💾',
      title: 'Auto-Save',
      description: 'Your progress is automatically saved across all devices'
    },
    {
      icon: '🎓',
      title: 'Learn',
      description: 'Educational content that entertains and teaches'
    },
    {
      icon: '👥',
      title: 'Community',
      description: 'Connect with millions of players around the world'
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
      <HeroPuzzleFree
        title="Play, Learn & Compete"
        subtitle="Join millions solving puzzles, playing games, and competing. Challenge your mind. Win rewards."
        primaryCta={{ label: 'Start Playing', onClick: handlePlayNow }}
        secondaryCta={{ label: 'Browse All', onClick: handleBrowse }}
      />

      {/* Categories */}
      <CategoriesPuzzleFree
        categories={categories}
        onCategoryClick={handleCategoryClick}
      />

      {/* How It Works */}
      <HowItWorksPuzzleFree steps={steps} />

      {/* Stats */}
      <StatsPuzzleFree stats={stats} />

      {/* Features */}
      <FeaturesPuzzleFree features={features} />

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
            marginBottom: 16,
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
              onMouseEnter={(e) => {
                e.target.style.background = '#4f46e5';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = '#6366f1';
              }}
            >
              Start Challenge
            </button>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <CTAPuzzleFree
        title="Ready to Start?"
        subtitle="Create your free account now and join millions of players"
        primaryCta={{ label: 'Get Started Free', onClick: handlePlayNow }}
      />
    </div>
  );
};

export default HomePagePuzzleFreeExact;
