/**
 * HOME PAGE - PUZZLEFREE MASTER DESIGN
 * 
 * Replicates PuzzleFree.game design EXACTLY
 * Adapted for AmAha's 8 content types
 * 
 * Sections:
 * 1. Hero Section
 * 2. Why AmAha Features
 * 3. How It Works (4 steps)
 * 4. Categories/Content Section
 * 5. Community Stats
 * 6. Call to Action
 * 7. Footer
 */

import React from 'react';
import Footer from '../components/common/Footer';

// HERO SECTION
function HeroSection() {
  return (
    <section
      style={{
        background: '#1a1a2e',
        padding: '120px 20px 100px 20px',
        textAlign: 'center',
        minHeight: 'calc(100vh - 64px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <h1
        style={{
          fontSize: 'clamp(2.5rem, 8vw, 3.8rem)',
          fontWeight: '800',
          color: '#ffffff',
          marginBottom: '20px',
          lineHeight: '1.2',
          letterSpacing: '-0.01em',
        }}
      >
        Learning Challenges With Purpose
      </h1>

      <p
        style={{
          fontSize: '18px',
          color: '#b0b0c8',
          marginBottom: '40px',
          maxWidth: '600px',
          margin: '0 auto',
          lineHeight: '1.6',
          fontWeight: 400,
        }}
      >
        Create and solve puzzles, quizzes, and games in seconds.
        <br />
        Learn, challenge friends, and win rewards.
      </p>

      {/* CTA Buttons */}
      <div
        style={{
          display: 'flex',
          gap: '16px',
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginBottom: '80px',
        }}
      >
        <button
          style={{
            padding: '12px 32px',
            background: '#6366f1',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => (e.target.style.background = '#4f46e5')}
          onMouseLeave={(e) => (e.target.style.background = '#6366f1')}
        >
          Start Playing
        </button>

        <button
          style={{
            padding: '12px 32px',
            background: 'transparent',
            color: '#b0b0c8',
            border: '1px solid #2d2d44',
            borderRadius: '6px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.target.style.color = '#ffffff';
            e.target.style.borderColor = '#6366f1';
          }}
          onMouseLeave={(e) => {
            e.target.style.color = '#b0b0c8';
            e.target.style.borderColor = '#2d2d44';
          }}
        >
          Browse All
        </button>
      </div>

      {/* Scroll Down Hint */}
      <div
        style={{
          color: '#b0b0c8',
          fontSize: '14px',
          animation: 'bounce 2s infinite',
        }}
      >
        Scroll down ↓
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(10px); }
        }
      `}</style>
    </section>
  );
}

// WHY AMAHA SECTION
function WhyAmAhaSection() {
  const features = [
    {
      title: 'Instant Access',
      description: 'No downloads, play anywhere, anytime with our progressive web app',
    },
    {
      title: 'Multiple Content Types',
      description: 'Puzzles, Quizzes, Games, Stories, Logic problems, Riddles, Trivia, and Studies',
    },
    {
      title: 'Compete & Win',
      description: 'Challenge friends, climb leaderboards, and earn exclusive rewards',
    },
    {
      title: 'Adaptive Learning',
      description: 'AI-powered difficulty that grows with your skills',
    },
    {
      title: 'Community Driven',
      description: 'Create and share your own challenges with millions of players',
    },
    {
      title: 'Always Free',
      description: 'Premium features are optional. The core experience is completely free',
    },
  ];

  return (
    <section
      style={{
        background: '#1a1a2e',
        padding: '80px 20px',
        maxWidth: '1400px',
        margin: '0 auto',
      }}
    >
      <h2
        style={{
          fontSize: '36px',
          fontWeight: '700',
          color: '#ffffff',
          textAlign: 'center',
          marginBottom: '12px',
        }}
      >
        Why AmAha
      </h2>

      <p
        style={{
          fontSize: '16px',
          color: '#b0b0c8',
          textAlign: 'center',
          marginBottom: '60px',
          maxWidth: '600px',
          margin: '12px auto 60px auto',
        }}
      >
        The ultimate platform for learning challenges and competitive entertainment
      </p>

      {/* Feature Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '32px',
        }}
      >
        {features.map((feature, idx) => (
          <div
            key={idx}
            style={{
              background: '#252539',
              border: '1px solid #2d2d44',
              borderRadius: '8px',
              padding: '32px',
              transition: 'all 0.15s ease',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#6366f1';
              e.currentTarget.style.background = '#2a2a3e';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#2d2d44';
              e.currentTarget.style.background = '#252539';
            }}
          >
            {/* Icon - using number instead of emoji */}
            <div
              style={{
                width: '50px',
                height: '50px',
                background: '#6366f1',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#ffffff',
                marginBottom: '16px',
              }}
            >
              {idx + 1}
            </div>

            <h3
              style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#ffffff',
                marginBottom: '8px',
              }}
            >
              {feature.title}
            </h3>

            <p
              style={{
                fontSize: '14px',
                color: '#b0b0c8',
                lineHeight: '1.6',
              }}
            >
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

// HOW IT WORKS SECTION
function HowItWorksSection() {
  const steps = [
    { title: 'Sign Up', description: 'Create your free account in seconds' },
    { title: 'Choose Category', description: 'Pick puzzles, quizzes, games, or any content' },
    { title: 'Play & Learn', description: 'Challenge yourself and improve your skills' },
    { title: 'Compete & Win', description: 'Earn rewards and climb the leaderboards' },
  ];

  return (
    <section
      style={{
        background: '#1a1a2e',
        padding: '80px 20px',
        maxWidth: '1400px',
        margin: '0 auto',
      }}
    >
      <h2
        style={{
          fontSize: '36px',
          fontWeight: '700',
          color: '#ffffff',
          textAlign: 'center',
          marginBottom: '12px',
        }}
      >
        How It Works
      </h2>

      <p
        style={{
          fontSize: '16px',
          color: '#b0b0c8',
          textAlign: 'center',
          marginBottom: '60px',
          maxWidth: '600px',
          margin: '12px auto 60px auto',
        }}
      >
        Just four simple steps to your first challenge
      </p>

      {/* Steps Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '40px',
        }}
      >
        {steps.map((step, idx) => (
          <div
            key={idx}
            style={{
              textAlign: 'center',
            }}
          >
            {/* Number Circle */}
            <div
              style={{
                width: '60px',
                height: '60px',
                background: '#6366f1',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px auto',
                fontSize: '28px',
                fontWeight: 'bold',
                color: '#ffffff',
              }}
            >
              {idx + 1}
            </div>

            <h3
              style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#ffffff',
                marginBottom: '8px',
              }}
            >
              {step.title}
            </h3>

            <p
              style={{
                fontSize: '14px',
                color: '#b0b0c8',
                lineHeight: '1.6',
              }}
            >
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

// CATEGORIES SECTION
function CategoriesSection() {
  const categories = [
    { name: 'Quizzes', count: '500+' },
    { name: 'Puzzles', count: '450+' },
    { name: 'Games', count: '350+' },
    { name: 'Stories', count: '200+' },
    { name: 'Logic', count: '300+' },
    { name: 'Riddles', count: '250+' },
    { name: 'Trivia', count: '280+' },
    { name: 'Studies', count: '180+' },
  ];

  return (
    <section
      style={{
        background: '#1a1a2e',
        padding: '80px 20px',
        maxWidth: '1400px',
        margin: '0 auto',
      }}
    >
      <h2
        style={{
          fontSize: '36px',
          fontWeight: '700',
          color: '#ffffff',
          textAlign: 'center',
          marginBottom: '12px',
        }}
      >
        Popular Categories
      </h2>

      <p
        style={{
          fontSize: '16px',
          color: '#b0b0c8',
          textAlign: 'center',
          marginBottom: '60px',
          maxWidth: '600px',
          margin: '12px auto 60px auto',
        }}
      >
        Explore our diverse collection of content
      </p>

      {/* Category Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '20px',
          marginBottom: '40px',
        }}
      >
        {categories.map((cat, idx) => (
          <div
            key={idx}
            style={{
              background: '#252539',
              border: '1px solid #2d2d44',
              borderRadius: '8px',
              padding: '24px',
              textAlign: 'center',
              transition: 'all 0.15s ease',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#6366f1';
              e.currentTarget.style.transform = 'translateY(-4px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#2d2d44';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <h3
              style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#ffffff',
                marginBottom: '8px',
              }}
            >
              {cat.name}
            </h3>
            <p
              style={{
                fontSize: '14px',
                color: '#b0b0c8',
              }}
            >
              {cat.count}
            </p>
          </div>
        ))}
      </div>

      {/* Browse All Link */}
      <div style={{ textAlign: 'center' }}>
        <a
          href="/browse"
          style={{
            fontSize: '16px',
            color: '#6366f1',
            textDecoration: 'none',
            fontWeight: '600',
            transition: 'color 0.15s ease',
          }}
          onMouseEnter={(e) => (e.target.style.color = '#4f46e5')}
          onMouseLeave={(e) => (e.target.style.color = '#6366f1')}
        >
          Browse All Categories →
        </a>
      </div>
    </section>
  );
}

// COMMUNITY STATS SECTION
function CommunityStatsSection() {
  const stats = [
    { number: '5M+', label: 'Active Users', icon: '👥' },
    { number: '10K+', label: 'Games & Puzzles', icon: '🎮' },
    { number: '50+', label: 'Categories', icon: '📂' },
    { number: '100M+', label: 'Challenges Completed', icon: '🏆' },
  ];

  return (
    <section
      style={{
        background: '#252539',
        padding: '80px 20px',
        maxWidth: '1400px',
        margin: '0 auto',
      }}
    >
      <h2
        style={{
          fontSize: '36px',
          fontWeight: '700',
          color: '#ffffff',
          textAlign: 'center',
          marginBottom: '12px',
        }}
      >
        Join Our Growing Community
      </h2>

      <p
        style={{
          fontSize: '16px',
          color: '#b0b0c8',
          textAlign: 'center',
          marginBottom: '60px',
          maxWidth: '600px',
          margin: '12px auto 60px auto',
        }}
      >
        Millions of people enjoy AmAha every day
      </p>

      {/* Stats Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '24px',
        }}
      >
        {stats.map((stat, idx) => (
          <div
            key={idx}
            style={{
              background: '#1a1a2e',
              border: '1px solid #2d2d44',
              borderRadius: '8px',
              padding: '32px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontSize: '42px',
                fontWeight: '800',
                color: '#6366f1',
                marginBottom: '8px',
              }}
            >
              {stat.number}
            </div>
            <div
              style={{
                fontSize: '16px',
                color: '#b0b0c8',
              }}
            >
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// CALL TO ACTION SECTION
function CTASection() {
  return (
    <section
      style={{
        background: '#1a1a2e',
        padding: '80px 20px',
        textAlign: 'center',
        maxWidth: '1400px',
        margin: '0 auto',
      }}
    >
      <h2
        style={{
          fontSize: '36px',
          fontWeight: '700',
          color: '#ffffff',
          marginBottom: '20px',
        }}
      >
        Ready to Challenge Yourself?
      </h2>

      <p
        style={{
          fontSize: '18px',
          color: '#b0b0c8',
          marginBottom: '40px',
          maxWidth: '600px',
          margin: '20px auto 40px auto',
        }}
      >
        Join millions of players and start your journey with AmAha today
      </p>

      <button
        style={{
          padding: '14px 40px',
          background: '#6366f1',
          color: '#ffffff',
          border: 'none',
          borderRadius: '6px',
          fontSize: '18px',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.15s ease',
        }}
        onMouseEnter={(e) => (e.target.style.background = '#4f46e5')}
        onMouseLeave={(e) => (e.target.style.background = '#6366f1')}
      >
        Get Started Free
      </button>
    </section>
  );
}

// MAIN HOMEPAGE COMPONENT
export default function HomePagePuzzleFreeMaster() {
  return (
    <div style={{ background: '#1a1a2e', minHeight: '100vh' }}>
      <HeroSection />
      <WhyAmAhaSection />
      <HowItWorksSection />
      <CategoriesSection />
      <CommunityStatsSection />
      <CTASection />
      <Footer />
    </div>
  );
}
