/**
 * HOME PAGE - WITH THEME SUPPORT & GLASSMORPHISM
 * 
 * Replicates PuzzleFree design with:
 * - Full theme color support
 * - Glassmorphism effects
 * - Gradient backgrounds
 * - Smooth animations
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import Footer from '../components/common/Footer';

// HERO SECTION - ENHANCED
function HeroSection() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  
  const handleBrowseClick = () => {
    // Scroll to the "Explore 14+ Categories" section
    const element = document.querySelector('section');
    if (element) {
      const sections = document.querySelectorAll('section');
      // ContentTypesSection is after HeroSection, WhySection, CommunityStatsSection, PopularContentSection, HowItWorksSection
      if (sections.length > 5) {
        sections[5].scrollIntoView({ behavior: 'smooth' });
      }
    }
  };
  
  return (
    <section
      style={{
        background: `linear-gradient(135deg, ${theme.gradientBg}), 
                    radial-gradient(circle at top right, ${theme.accentPrimary}15, transparent),
                    radial-gradient(circle at bottom left, ${theme.accentSecondary}15, transparent)`,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        padding: '100px 20px 80px 20px',
        textAlign: 'center',
        minHeight: 'calc(100vh - 70px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative elements */}
      <div style={{
        position: 'absolute',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${theme.accentPrimary}30, transparent)`,
        top: '-100px',
        right: '-100px',
        filter: 'blur(60px)',
      }} />
      <div style={{
        position: 'absolute',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${theme.accentTertiary}20, transparent)`,
        bottom: '-50px',
        left: '-50px',
        filter: 'blur(60px)',
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          fontSize: '48px',
          marginBottom: '20px',
          animation: 'float 3s ease-in-out infinite',
        }}>
          ✨
        </div>

        <h1
          style={{
            fontSize: 'clamp(2.8rem, 9vw, 4.2rem)',
            fontWeight: '900',
            color: theme.accentPrimary,
            marginBottom: '24px',
            lineHeight: '1.1',
            letterSpacing: '-0.02em',
          }}
        >
          Master Learning with Style
        </h1>

        <p
          style={{
            fontSize: '18px',
            color: theme.textSecondary,
            maxWidth: '700px',
            marginBottom: '48px',
            lineHeight: '1.7',
            fontWeight: '500',
          }}
        >
          Explore 14+ interactive categories. Solve puzzles, take quizzes, create content, and earn rewards. Join thousands learning smarter.
        </p>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '40px' }}>
          <button
            onClick={() => navigate('/explore')}
            style={{
              background: `linear-gradient(135deg, ${theme.accentPrimary}, ${theme.accentSecondary})`,
              color: '#ffffff',
              border: 'none',
              padding: '16px 40px',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: `0 8px 32px ${theme.accentPrimary}40`,
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-4px)';
              e.target.style.boxShadow = `0 16px 48px ${theme.accentPrimary}60`;
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = `0 8px 32px ${theme.accentPrimary}40`;
            }}
          >
            🚀 Start Exploring
          </button>

          <button
            onClick={handleBrowseClick}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              color: theme.accentPrimary,
              border: `2px solid ${theme.accentPrimary}`,
              padding: '14px 38px',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.target.style.background = theme.accentPrimary;
              e.target.style.color = '#ffffff';
              e.target.style.transform = 'translateY(-4px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.1)';
              e.target.style.color = theme.accentPrimary;
              e.target.style.transform = 'translateY(0)';
            }}
          >
            📚 Browse Categories
          </button>
        </div>

        {/* Stats Preview */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
          gap: '12px',
          maxWidth: '500px',
          margin: '0 auto',
        }}>
          {[
            { num: '50K+', label: 'Content' },
            { num: '10K+', label: 'Users' },
            { num: '500K+', label: 'Completed' },
          ].map((stat, idx) => (
            <div key={idx} style={{
              background: `rgba(255, 255, 255, 0.05)`,
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              padding: '12px',
              borderRadius: '8px',
              border: `1px solid rgba(255, 255, 255, 0.1)`,
            }}>
              <div style={{
                fontSize: '16px',
                fontWeight: '700',
                color: theme.accentPrimary,
              }}>{stat.num}</div>
              <div style={{
                fontSize: '12px',
                color: theme.textSecondary,
                marginTop: '4px',
              }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </section>
  );
}

// WHY AMAHA SECTION
function WhySection() {
  const { theme } = useTheme();
  
  const features = [
    {
      icon: '🎨',
      title: 'Diverse Content',
      description: 'Puzzles, quizzes, stories, arts, and more across 8 engaging categories',
    },
    {
      icon: '🏆',
      title: 'Earn & Compete',
      description: 'Collect points, climb leaderboards, and unlock achievements',
    },
    {
      icon: '👥',
      title: 'Creative Community',
      description: 'Create your own content and share with millions of players',
    },
    {
      icon: '🚀',
      title: 'Skill Development',
      description: 'Learn while having fun with structured learning paths',
    },
  ];

  return (
    <section
      style={{
        background: theme.background,
        padding: '80px 20px',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h2
          style={{
            fontSize: '32px',
            fontWeight: '700',
            color: theme.textPrimary,
            textAlign: 'center',
            marginBottom: '60px',
          }}
        >
          Why Choose AmAha?
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '24px',
          }}
        >
          {features.map((feature, idx) => (
            <div
              key={idx}
              style={{
                background: theme.surfacePrimary,
                padding: '32px 24px',
                borderRadius: '12px',
                border: `1px solid ${theme.border}`,
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = theme.shadowHover;
                e.currentTarget.style.borderColor = theme.accentPrimary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = theme.border;
              }}
            >
              <div style={{ fontSize: '40px', marginBottom: '16px' }}>{feature.icon}</div>
              <h3
                style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: theme.textPrimary,
                  marginBottom: '12px',
                }}
              >
                {feature.title}
              </h3>
              <p
                style={{
                  fontSize: '14px',
                  color: theme.textSecondary,
                  lineHeight: '1.6',
                }}
              >
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// HOW IT WORKS SECTION
function HowItWorksSection() {
  const { theme } = useTheme();
  
  const steps = [
    {
      number: '1',
      title: 'Browse',
      description: 'Explore our collection of 8 content types with thousands of items',
    },
    {
      number: '2',
      title: 'Engage',
      description: 'Solve puzzles, take quizzes, and enjoy interactive experiences',
    },
    {
      number: '3',
      title: 'Learn & Earn',
      description: 'Gain knowledge and collect points for every activity',
    },
    {
      number: '4',
      title: 'Create & Share',
      description: 'Make your own content and contribute to the community',
    },
  ];

  return (
    <section
      style={{
        background: theme.surfacePrimary,
        padding: '80px 20px',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h2
          style={{
            fontSize: '32px',
            fontWeight: '700',
            color: theme.textPrimary,
            textAlign: 'center',
            marginBottom: '60px',
          }}
        >
          How It Works
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '32px',
          }}
        >
          {steps.map((step, idx) => (
            <div key={idx} style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  background: theme.gradientAccent,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '28px',
                  fontWeight: '700',
                  color: '#ffffff',
                  margin: '0 auto 20px',
                }}
              >
                {step.number}
              </div>
              <h3
                style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: theme.textPrimary,
                  marginBottom: '12px',
                }}
              >
                {step.title}
              </h3>
              <p
                style={{
                  fontSize: '14px',
                  color: theme.textSecondary,
                  lineHeight: '1.6',
                }}
              >
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// CONTENT TYPES SECTION - ENHANCED WITH TABS
function ContentTypesSection() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = React.useState('all');
  
  const allCategories = {
    puzzles: [
      { title: 'Jigsaw', icon: '🧩', color: '#6366f1', path: '/puzzle' },
      { title: 'Logic', icon: '🧠', color: '#8b5cf6', path: '/puzzle' },
      { title: 'Word', icon: '📝', color: '#ec4899', path: '/puzzle' },
      { title: 'Riddles', icon: '🎭', color: '#f59e0b', path: '/puzzle' },
    ],
    learning: [
      { title: 'Quizzes', icon: '❓', color: '#06b6d4', path: '/quiz' },
      { title: 'Trivia', icon: '🏆', color: '#10b981', path: '/quiz' },
      { title: 'Studies', icon: '📚', color: '#3b82f6', path: '/studies' },
      { title: 'Lessons', icon: '📖', color: '#8b5cf6', path: '/quiz' },
    ],
    creative: [
      { title: 'Stories', icon: '📖', color: '#ec4899', path: '/stories' },
      { title: 'Arts', icon: '🎨', color: '#f97316', path: '/arts' },
      { title: 'Music', icon: '🎵', color: '#6366f1', path: '/documents' },
      { title: 'Design', icon: '✨', color: '#06b6d4', path: '/arts/digital' },
    ],
    practice: [
      { title: 'Math', icon: '🔢', color: '#10b981', path: '/quiz' },
      { title: 'Worksheets', icon: '📋', color: '#f59e0b', path: '/worksheets' },
      { title: 'Games', icon: '🎮', color: '#ec4899', path: '/puzzle' },
      { title: 'Challenges', icon: '⚡', color: '#6366f1', path: '/puzzle' },
    ],
  };

  const categories = selectedCategory === 'all' 
    ? Object.values(allCategories).flat() 
    : allCategories[selectedCategory] || [];

  const categoryTabs = ['all', 'puzzles', 'learning', 'creative', 'practice'];
  const categoryLabels = { 
    all: '📋 All Types', 
    puzzles: '🧩 Puzzles', 
    learning: '📚 Learning', 
    creative: '🎨 Creative', 
    practice: '⚡ Practice' 
  };

  return (
    <section
      style={{
        background: theme.background,
        padding: '80px 20px',
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2
            style={{
              fontSize: '36px',
              fontWeight: '800',
              color: theme.accentPrimary,
              marginBottom: '16px',
            }}
          >
            Explore 14+ Categories
          </h2>
          <p style={{
            fontSize: '16px',
            color: theme.textSecondary,
            maxWidth: '500px',
            margin: '0 auto',
          }}>
            From puzzles to creative content, find what excites you
          </p>
        </div>

        {/* Category Tabs */}
        <div style={{
          display: 'flex',
          gap: '12px',
          justifyContent: 'center',
          marginBottom: '50px',
          flexWrap: 'wrap',
        }}>
          {categoryTabs.map(tab => (
            <button
              key={tab}
              onClick={() => setSelectedCategory(tab)}
              style={{
                padding: '12px 24px',
                borderRadius: '10px',
                border: 'none',
                fontSize: '14px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                background: selectedCategory === tab 
                  ? `linear-gradient(135deg, ${theme.accentPrimary}, ${theme.accentSecondary})`
                  : `rgba(255, 255, 255, 0.05)`,
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                color: selectedCategory === tab ? '#ffffff' : theme.textSecondary,
                border: `2px solid ${selectedCategory === tab ? theme.accentPrimary : theme.border}`,
              }}
              onMouseEnter={(e) => {
                if (selectedCategory !== tab) {
                  e.target.style.borderColor = theme.accentPrimary;
                  e.target.style.background = `rgba(255, 255, 255, 0.08)`;
                }
              }}
              onMouseLeave={(e) => {
                if (selectedCategory !== tab) {
                  e.target.style.borderColor = theme.border;
                  e.target.style.background = `rgba(255, 255, 255, 0.05)`;
                }
              }}
            >
              {categoryLabels[tab]}
            </button>
          ))}
        </div>

        {/* Categories Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
            gap: '16px',
          }}
        >
          {categories.map((type, idx) => (
            <div
              key={idx}
              onClick={() => type.path && navigate(type.path)}
              style={{
                background: `linear-gradient(135deg, ${type.color}15, ${type.color}05)`,
                border: `2px solid ${theme.border}`,
                padding: '24px 16px',
                borderRadius: '14px',
                textAlign: 'center',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.borderColor = type.color;
                e.currentTarget.style.background = `linear-gradient(135deg, ${type.color}30, ${type.color}15)`;
                e.currentTarget.style.boxShadow = `0 20px 40px ${type.color}30`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = theme.border;
                e.currentTarget.style.background = `linear-gradient(135deg, ${type.color}15, ${type.color}05)`;
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ fontSize: '42px', marginBottom: '12px' }}>{type.icon}</div>
              <h3
                style={{
                  fontSize: '15px',
                  fontWeight: '700',
                  color: theme.textPrimary,
                }}
              >
                {type.title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// TESTIMONIALS SECTION
function TestimonialsSection() {
  const { theme } = useTheme();
  
  const testimonials = [
    {
      quote: 'AmAha has completely transformed how I learn. The variety of content keeps me engaged every day!',
      author: 'Sarah Johnson',
      role: 'Student',
      rating: 5,
    },
    {
      quote: 'As an educator, I love being able to create custom content for my students. It\'s incredibly intuitive.',
      author: 'Dr. Michael Chen',
      role: 'Teacher',
      rating: 5,
    },
    {
      quote: 'The competitive element with leaderboards motivates me to keep improving my skills.',
      author: 'Alex Rodriguez',
      role: 'Puzzle Enthusiast',
      rating: 5,
    },
  ];

  return (
    <section
      style={{
        background: theme.surfacePrimary,
        padding: '80px 20px',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h2
          style={{
            fontSize: '32px',
            fontWeight: '700',
            color: theme.textPrimary,
            textAlign: 'center',
            marginBottom: '60px',
          }}
        >
          What Players Say
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px',
          }}
        >
          {testimonials.map((testimonial, idx) => (
            <div
              key={idx}
              style={{
                background: theme.surfaceSecondary,
                padding: '32px',
                borderRadius: '12px',
                border: `1px solid ${theme.border}`,
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = theme.shadowHover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ marginBottom: '16px' }}>
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} style={{ color: '#FFD700', fontSize: '16px', marginRight: '4px' }}>
                    ★
                  </span>
                ))}
              </div>
              <p
                style={{
                  fontSize: '15px',
                  color: theme.textPrimary,
                  lineHeight: '1.6',
                  marginBottom: '20px',
                  fontStyle: 'italic',
                }}
              >
                "{testimonial.quote}"
              </p>
              <p
                style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: theme.textPrimary,
                }}
              >
                {testimonial.author}
              </p>
              <p
                style={{
                  fontSize: '13px',
                  color: theme.textSecondary,
                }}
              >
                {testimonial.role}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// FAQ SECTION
function FAQSection() {
  const { theme } = useTheme();
  const [expandedIdx, setExpandedIdx] = React.useState(null);
  
  const faqs = [
    {
      q: 'Is AmAha free to use?',
      a: 'Yes! AmAha is completely free. You can access all content types and create your own without any cost.',
    },
    {
      q: 'Can I create and share my own content?',
      a: 'Absolutely! We encourage all users to create content and share it with our community. It\'s one of our core features.',
    },
    {
      q: 'How does the leaderboard system work?',
      a: 'Points are earned by completing challenges. You can see how you rank globally and compete with friends.',
    },
    {
      q: 'What content types are available?',
      a: 'We offer 8 main types: Puzzles, Quizzes, Stories, Arts, Documents, Studies, Worksheets, and Games.',
    },
  ];

  return (
    <section
      style={{
        background: theme.background,
        padding: '80px 20px',
      }}
    >
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h2
          style={{
            fontSize: '32px',
            fontWeight: '700',
            color: theme.textPrimary,
            textAlign: 'center',
            marginBottom: '60px',
          }}
        >
          Frequently Asked Questions
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              style={{
                background: theme.surfacePrimary,
                border: `1px solid ${theme.border}`,
                borderRadius: '8px',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
              }}
            >
              <button
                onClick={() => setExpandedIdx(expandedIdx === idx ? null : idx)}
                style={{
                  width: '100%',
                  padding: '20px',
                  background: 'transparent',
                  border: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = theme.surfaceSecondary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <span
                  style={{
                    fontSize: '15px',
                    fontWeight: '600',
                    color: theme.textPrimary,
                  }}
                >
                  {faq.q}
                </span>
                <span
                  style={{
                    color: theme.accentPrimary,
                    fontSize: '20px',
                    transition: 'transform 0.3s ease',
                    transform: expandedIdx === idx ? 'rotate(180deg)' : 'rotate(0deg)',
                  }}
                >
                  ▼
                </span>
              </button>

              {expandedIdx === idx && (
                <div
                  style={{
                    padding: '0 20px 20px 20px',
                    borderTop: `1px solid ${theme.border}`,
                    color: theme.textSecondary,
                    fontSize: '14px',
                    lineHeight: '1.6',
                    animation: 'slideDown 0.3s ease',
                  }}
                >
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// COMMUNITY STATS SECTION
function CommunityStatsSection() {
  const { theme } = useTheme();
  
  const stats = [
    { icon: '📚', label: 'Content Created', value: '50,000+', color: '#3b82f6' },
    { icon: '👥', label: 'Active Users', value: '10,000+', color: '#10b981' },
    { icon: '✅', label: 'Challenges Completed', value: '500,000+', color: '#f59e0b' },
    { icon: '⭐', label: 'Points Awarded', value: '1,000,000+', color: '#ec4899' },
  ];

  return (
    <section
      style={{
        background: theme.surfacePrimary,
        padding: '80px 20px',
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2
            style={{
              fontSize: '36px',
              fontWeight: '800',
              color: theme.accentPrimary,
              marginBottom: '16px',
            }}
          >
            Join Our Thriving Community
          </h2>
          <p style={{
            fontSize: '16px',
            color: theme.textSecondary,
          }}>
            Thousands of learners creating and solving challenges every day
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '24px',
          }}
        >
          {stats.map((stat, idx) => (
            <div
              key={idx}
              style={{
                position: 'relative',
                padding: '40px 24px',
                background: `linear-gradient(135deg, ${stat.color}15, ${stat.color}05)`,
                border: `2px solid ${stat.color}30`,
                borderRadius: '16px',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                overflow: 'hidden',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-12px)';
                e.currentTarget.style.borderColor = stat.color;
                e.currentTarget.style.background = `linear-gradient(135deg, ${stat.color}25, ${stat.color}10)`;
                e.currentTarget.style.boxShadow = `0 20px 60px ${stat.color}30`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = `${stat.color}30`;
                e.currentTarget.style.background = `linear-gradient(135deg, ${stat.color}15, ${stat.color}05)`;
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Decorative glow */}
              <div style={{
                position: 'absolute',
                width: '200px',
                height: '200px',
                borderRadius: '50%',
                background: `radial-gradient(circle, ${stat.color}40, transparent)`,
                top: '-50px',
                right: '-50px',
                filter: 'blur(60px)',
                opacity: 0.3,
              }} />

              <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                <div style={{ fontSize: '52px', marginBottom: '16px' }}>{stat.icon}</div>
                <div
                  style={{
                    fontSize: '42px',
                    fontWeight: '900',
                    color: stat.color,
                    marginBottom: '8px',
                  }}
                >
                  {stat.value}
                </div>
                <p
                  style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: theme.textSecondary,
                  }}
                >
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// POPULAR/TRENDING CONTENT SECTION
function PopularContentSection() {
  const { theme } = useTheme();
  
  const trendingItems = [
    { title: 'Logic Puzzle Challenge', type: 'Puzzle', difficulty: 'Hard', plays: 1200, icon: '🧩', color: '#6366f1' },
    { title: 'Quick Math Quiz', type: 'Quiz', difficulty: 'Medium', plays: 980, icon: '❓', color: '#3b82f6' },
    { title: 'History Story Series', type: 'Story', difficulty: 'Medium', plays: 850, icon: '📖', color: '#ec4899' },
    { title: 'Digital Art Tutorial', type: 'Arts', difficulty: 'Easy', plays: 720, icon: '🎨', color: '#f97316' },
    { title: 'Science Lab Experiment', type: 'Study', difficulty: 'Hard', plays: 650, icon: '🔬', color: '#10b981' },
    { title: 'Word Scramble Game', type: 'Game', difficulty: 'Easy', plays: 1400, icon: '🎮', color: '#f59e0b' },
  ];

  const difficultyColors = {
    Easy: '#10b981',
    Medium: '#f59e0b',
    Hard: '#ef4444',
  };

  return (
    <section
      style={{
        background: theme.background,
        padding: '80px 20px',
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '60px' }}>
          <div>
            <h2
              style={{
                fontSize: '36px',
                fontWeight: '800',
                color: theme.accentPrimary,
                marginBottom: '8px',
              }}
            >
              🔥 Trending Now
            </h2>
            <p style={{
              fontSize: '14px',
              color: theme.textSecondary,
            }}>
              Most played and loved content today
            </p>
          </div>
          <button
            style={{
              background: `linear-gradient(135deg, ${theme.accentPrimary}, ${theme.accentSecondary})`,
              color: '#ffffff',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '700',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = `0 12px 32px ${theme.accentPrimary}40`;
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            → Browse All
          </button>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
          }}
        >
          {trendingItems.map((item, idx) => (
            <div
              key={idx}
              style={{
                background: `linear-gradient(135deg, ${item.color}10, ${item.color}05)`,
                border: `2px solid ${theme.border}`,
                borderRadius: '14px',
                padding: '24px',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.borderColor = item.color;
                e.currentTarget.style.background = `linear-gradient(135deg, ${item.color}20, ${item.color}10)`;
                e.currentTarget.style.boxShadow = `0 20px 40px ${item.color}25`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = theme.border;
                e.currentTarget.style.background = `linear-gradient(135deg, ${item.color}10, ${item.color}05)`;
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Header with icon and type */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontSize: '32px' }}>{item.icon}</div>
                <span
                  style={{
                    fontSize: '11px',
                    background: item.color,
                    color: '#ffffff',
                    padding: '6px 10px',
                    borderRadius: '6px',
                    fontWeight: '700',
                  }}
                >
                  {item.type}
                </span>
              </div>

              {/* Title */}
              <h4
                style={{
                  fontSize: '15px',
                  fontWeight: '700',
                  color: theme.textPrimary,
                  lineHeight: '1.4',
                  marginBottom: '8px',
                }}
              >
                {item.title}
              </h4>

              {/* Footer with difficulty and plays */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '12px',
                color: theme.textSecondary,
                paddingTop: '8px',
                borderTop: `1px solid ${theme.border}`,
              }}>
                <span style={{
                  background: `${difficultyColors[item.difficulty]}20`,
                  color: difficultyColors[item.difficulty],
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontWeight: '600',
                }}>
                  {item.difficulty}
                </span>
                <span>▶ {item.plays.toLocaleString()} plays</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// DAILY CHALLENGE SECTION
function DailyChallengeSection() {
  const { theme } = useTheme();
  
  return (
    <section
      style={{
        background: theme.gradientBg,
        padding: '60px 20px',
      }}
    >
      <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', gap: '40px', alignItems: 'center' }}>
        <div style={{ flex: 1 }}>
          <h2
            style={{
              fontSize: '28px',
              fontWeight: '700',
              color: theme.textPrimary,
              marginBottom: '16px',
            }}
          >
            🎯 Today's Challenge
          </h2>
          <p
            style={{
              fontSize: '14px',
              color: theme.textSecondary,
              lineHeight: '1.6',
              marginBottom: '24px',
            }}
          >
            Complete today's special challenge and earn 2x rewards! Solve this medium-difficulty logic puzzle and unlock an exclusive badge.
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ background: theme.surfacePrimary, padding: '12px 16px', borderRadius: '6px', fontSize: '13px', color: theme.textPrimary, fontWeight: '600' }}>
              ⏱️ Expires in 12h
            </div>
            <div style={{ background: theme.surfacePrimary, padding: '12px 16px', borderRadius: '6px', fontSize: '13px', color: theme.textPrimary, fontWeight: '600' }}>
              ⭐ Medium Level
            </div>
            <div style={{ background: theme.surfacePrimary, padding: '12px 16px', borderRadius: '6px', fontSize: '13px', color: theme.textPrimary, fontWeight: '600' }}>
              🎁 +500 Points
            </div>
          </div>
        </div>
        <button
          style={{
            background: theme.accentPrimary,
            color: '#ffffff',
            border: 'none',
            padding: '16px 40px',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: theme.shadow,
            whiteSpace: 'nowrap',
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-3px)';
            e.target.style.boxShadow = theme.shadowHover;
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = theme.shadow;
          }}
        >
          Start Challenge
        </button>
      </div>
    </section>
  );
}

// CTA SECTION
function CTASection() {
  const { theme } = useTheme();
  
  return (
    <section
      style={{
        background: theme.gradientBg,
        padding: '80px 20px',
        textAlign: 'center',
      }}
    >
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        <h2
          style={{
            fontSize: '32px',
            fontWeight: '700',
            color: theme.textPrimary,
            marginBottom: '20px',
          }}
        >
          Ready to Start Learning?
        </h2>

        <p
          style={{
            fontSize: '16px',
            color: theme.textSecondary,
            marginBottom: '40px',
            lineHeight: '1.6',
          }}
        >
          Join thousands of learners who are discovering, creating, and sharing amazing content on AmAha.
        </p>

        <button
          style={{
            background: theme.accentPrimary,
            color: '#ffffff',
            border: 'none',
            padding: '16px 40px',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: theme.shadow,
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-3px)';
            e.target.style.boxShadow = theme.shadowHover;
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = theme.shadow;
          }}
        >
          Get Started for Free
        </button>
      </div>
    </section>
  );
}

// MAIN COMPONENT
export default function HomePagePuzzleFreeEnhanced() {
  const { theme } = useTheme();

  return (
    <div style={{ background: theme.background }}>
      <HeroSection />
      <WhySection />
      <CommunityStatsSection />
      <PopularContentSection />
      <HowItWorksSection />
      <ContentTypesSection />
      <DailyChallengeSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
      <Footer />

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
