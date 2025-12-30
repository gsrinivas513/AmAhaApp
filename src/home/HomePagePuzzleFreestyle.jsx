import React, { useState, useEffect } from 'react';
import {
  HeroSectionPuzzleFree,
  CategoryGridPuzzleFree,
  StatsSectionPuzzleFree,
  HowItWorksPuzzleFree,
  BenefitsPuzzleFree,
  CTAPuzzleFree
} from '../design/PuzzleFreeStyleSystem';
import { useTheme } from '../context/ThemeContext';

const HomePagePuzzleFreestyle = () => {
  const { isDarkMode } = useTheme();

  const categories = [
    { name: 'Quiz', count: '200+', icon: '📝', id: 'quiz' },
    { name: 'Puzzles', count: '150+', icon: '🧩', id: 'puzzles' },
    { name: 'Games', count: '100+', icon: '🎮', id: 'games' },
    { name: 'Studies', count: '80+', icon: '📚', id: 'studies' },
    { name: 'Stories', count: '60+', icon: '📖', id: 'stories' },
    { name: 'Logic', count: '120+', icon: '🧠', id: 'logic' },
    { name: 'Riddles', count: '90+', icon: '🤔', id: 'riddles' },
    { name: 'Trivia', count: '110+', icon: '🌍', id: 'trivia' }
  ];

  const stats = [
    { value: '5M+', label: 'Active Users' },
    { value: '10K+', label: 'Puzzles & Games' },
    { value: '50+', label: 'Categories' },
    { value: '24/7', label: 'Available' }
  ];

  const steps = [
    {
      title: 'Sign Up',
      description: 'Create your free account in seconds'
    },
    {
      title: 'Choose Category',
      description: 'Pick from quizzes, puzzles, games, and more'
    },
    {
      title: 'Play & Learn',
      description: 'Challenge yourself and track your progress'
    },
    {
      title: 'Earn Rewards',
      description: 'Unlock achievements and climb leaderboards'
    }
  ];

  const benefits = [
    {
      icon: '✨',
      title: 'Brain Training',
      description: 'Improve your cognitive skills with fun challenges'
    },
    {
      icon: '🏆',
      title: 'Compete',
      description: 'Join tournaments and compete with friends'
    },
    {
      icon: '📊',
      title: 'Track Progress',
      description: 'See your improvement over time'
    },
    {
      icon: '🎓',
      title: 'Learn',
      description: 'Educational content across multiple subjects'
    },
    {
      icon: '🎁',
      title: 'Win Prizes',
      description: 'Participate in contests and win rewards'
    },
    {
      icon: '👥',
      title: 'Community',
      description: 'Connect with millions of players worldwide'
    }
  ];

  const handleCategoryClick = (category) => {
    console.log('Category clicked:', category);
    // Navigate to category page
  };

  const handlePlayNow = () => {
    console.log('Play Now clicked');
  };

  const handleLearnMore = () => {
    console.log('Learn More clicked');
  };

  return (
    <div style={{
      background: isDarkMode ? '#0f172a' : 'white',
      color: isDarkMode ? '#f1f5f9' : '#1f2937',
      minHeight: '100vh',
      transition: 'background 300ms ease, color 300ms ease'
    }}>
      {/* Hero Section */}
      <HeroSectionPuzzleFree
        title="Play, Learn & Compete"
        subtitle="Join millions of players solving puzzles, taking quizzes, and competing in games. Challenge your mind. Win rewards."
        primaryCta={{
          label: 'Play Now',
          onClick: handlePlayNow
        }}
        secondaryCta={{
          label: 'Learn More',
          onClick: handleLearnMore
        }}
      />

      {/* Categories */}
      <CategoryGridPuzzleFree
        categories={categories}
        onCategoryClick={handleCategoryClick}
      />

      {/* Stats */}
      <StatsSectionPuzzleFree stats={stats} />

      {/* How It Works */}
      <HowItWorksPuzzleFree steps={steps} />

      {/* Benefits */}
      <BenefitsPuzzleFree benefits={benefits} />

      {/* Daily Challenge Section */}
      <div style={{
        padding: '40px 20px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <h2 style={{
          fontSize: 'clamp(1.4rem, 3.5vw, 1.8rem)',
          fontWeight: 800,
          marginBottom: 20,
          color: isDarkMode ? '#f1f5f9' : '#1f2937'
        }}>
          Daily Challenge
        </h2>
        <div
          style={{
            background: isDarkMode ? '#1e293b' : '#f3f4f6',
            border: isDarkMode ? '1px solid #334155' : '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: 20,
            textAlign: 'center'
          }}
        >
          <p style={{
            fontSize: '0.95rem',
            color: isDarkMode ? '#cbd5e1' : '#6b7280',
            marginBottom: 12
          }}>
            Complete today's challenge and claim your daily reward!
          </p>
          <button
            style={{
              padding: '8px 20px',
              background: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '0.9rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 200ms ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            Start Challenge
          </button>
        </div>
      </div>

      {/* Final CTA */}
      <CTAPuzzleFree
        title="Ready to Challenge Yourself?"
        subtitle="Sign up now and start your journey to becoming a puzzle master"
        primaryCta={{
          label: 'Get Started Free',
          onClick: handlePlayNow
        }}
        secondaryCta={{
          label: 'Watch Demo',
          onClick: handleLearnMore
        }}
      />
    </div>
  );
};

export default HomePagePuzzleFreestyle;
