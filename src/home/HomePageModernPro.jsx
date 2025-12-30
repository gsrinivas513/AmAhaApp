import React from 'react';
import {
  HeroSectionModernPro,
  CategoryGridModernPro,
  HowItWorksModernPro,
  StatsModernPro,
  BenefitsModernPro,
  CTAModernPro
} from '../design/ModernProDesignSystem';
import { useTheme } from '../context/ThemeContext';

const HomePageModernPro = () => {
  const { isDarkMode } = useTheme();

  const categories = [
    { name: 'Quiz', count: '200+ puzzles', icon: '📝', id: 'quiz' },
    { name: 'Puzzles', count: '150+ puzzles', icon: '🧩', id: 'puzzles' },
    { name: 'Games', count: '100+ games', icon: '🎮', id: 'games' },
    { name: 'Studies', count: '80+ topics', icon: '📚', id: 'studies' },
    { name: 'Stories', count: '60+ stories', icon: '📖', id: 'stories' },
    { name: 'Logic', count: '120+ puzzles', icon: '🧠', id: 'logic' },
    { name: 'Riddles', count: '90+ riddles', icon: '🤔', id: 'riddles' },
    { name: 'Trivia', count: '110+ questions', icon: '🌍', id: 'trivia' }
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

  const benefits = [
    {
      icon: '⚡',
      title: 'Instant Access',
      description: 'No installation required - play directly in your browser'
    },
    {
      icon: '🏆',
      title: 'Compete & Win',
      description: 'Join tournaments and compete with friends worldwide'
    },
    {
      icon: '📱',
      title: 'Play Anywhere',
      description: 'Seamless experience across desktop, tablet, and mobile'
    },
    {
      icon: '💾',
      title: 'Auto-Save',
      description: 'Your progress is automatically saved across all devices'
    },
    {
      icon: '🎓',
      title: 'Educational',
      description: 'Learn while you play with educational content'
    },
    {
      icon: '👥',
      title: 'Community',
      description: 'Connect with millions of players and make new friends'
    }
  ];

  const handlePlayNow = () => {
    console.log('Play Now clicked');
  };

  const handleBrowse = () => {
    console.log('Browse clicked');
  };

  const handleCategoryClick = (category) => {
    console.log('Category clicked:', category);
  };

  return (
    <div style={{
      background: isDarkMode ? '#0f172a' : '#ffffff',
      color: isDarkMode ? '#f1f5f9' : '#0f1419',
      minHeight: '100vh',
      transition: 'background 300ms ease, color 300ms ease'
    }}>
      {/* Hero Section */}
      <HeroSectionModernPro
        title="Play, Learn & Compete"
        subtitle="Join millions solving puzzles, taking quizzes, and competing in games. Challenge your mind, win rewards."
        primaryCta={{ label: 'Start Playing', onClick: handlePlayNow }}
        secondaryCta={{ label: 'Browse All', onClick: handleBrowse }}
      />

      {/* Categories */}
      <CategoryGridModernPro
        categories={categories}
        onCategoryClick={handleCategoryClick}
      />

      {/* How It Works */}
      <HowItWorksModernPro steps={steps} />

      {/* Stats */}
      <StatsModernPro stats={stats} />

      {/* Benefits */}
      <BenefitsModernPro benefits={benefits} />

      {/* Daily Challenge Section */}
      <div style={{
        padding: '60px 20px',
        background: isDarkMode ? '#0f172a' : '#ffffff'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <h2 style={{
            fontSize: 'clamp(1.6rem, 4vw, 2.2rem)',
            fontWeight: 900,
            marginBottom: 30,
            color: isDarkMode ? '#f1f5f9' : '#0f1419'
          }}>
            Daily Challenge
          </h2>

          <div
            style={{
              background: isDarkMode
                ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'
                : 'linear-gradient(135deg, #f0f4f8 0%, #e5e7eb 100%)',
              border: isDarkMode ? '1px solid #475569' : '1px solid #d1d5db',
              borderRadius: '12px',
              padding: '40px',
              textAlign: 'center'
            }}
          >
            <h3 style={{
              fontSize: '1.3rem',
              fontWeight: 700,
              marginBottom: 10,
              color: isDarkMode ? '#f1f5f9' : '#0f1419'
            }}>
              Complete Today's Challenge
            </h3>

            <p style={{
              fontSize: '1rem',
              color: isDarkMode ? '#cbd5e1' : '#6b7280',
              marginBottom: 24
            }}>
              Earn bonus coins, streaks, and unlock special rewards
            </p>

            <button
              style={{
                padding: '12px 32px',
                background: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 200ms ease',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.2)'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.2)';
              }}
            >
              Start Challenge
            </button>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <CTAModernPro
        title="Ready to Challenge Yourself?"
        subtitle="Create your account now and start your journey to becoming a master"
        primaryCta={{ label: 'Get Started Free', onClick: handlePlayNow }}
        secondaryCta={{ label: 'Watch Demo', onClick: handleBrowse }}
      />
    </div>
  );
};

export default HomePageModernPro;
