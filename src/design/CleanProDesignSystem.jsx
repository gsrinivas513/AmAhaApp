/**
 * CLEAN PROFESSIONAL DESIGN SYSTEM
 * No emojis, professional, dark theme
 * Reference: PuzzleFree.game style
 */

import React from 'react';

// ============================================================================
// HERO SECTION
// ============================================================================
export const HeroSection = ({ title, subtitle, primaryCta, secondaryCta }) => {
  return (
    <div style={{
      background: '#1a1a2e',
      padding: '120px 20px 150px',
      textAlign: 'center',
      color: '#ffffff',
      borderBottom: '1px solid #2d2d44'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        <h1 style={{
          fontSize: 'clamp(2.5rem, 7vw, 3.8rem)',
          fontWeight: 700,
          marginBottom: 20,
          lineHeight: 1.1,
          letterSpacing: '-0.01em',
        }}>
          {title}
        </h1>

        <p style={{
          fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
          marginBottom: 50,
          lineHeight: 1.6,
          color: '#b0b0c8',
          fontWeight: 400
        }}>
          {subtitle}
        </p>

        <div style={{
          display: 'flex',
          gap: 16,
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={primaryCta?.onClick}
            style={{
              padding: '12px 36px',
              background: '#6366f1',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background 150ms ease'
            }}
            onMouseEnter={(e) => (e.target.style.background = '#4f46e5')}
            onMouseLeave={(e) => (e.target.style.background = '#6366f1')}
          >
            {primaryCta?.label}
          </button>

          <button
            onClick={secondaryCta?.onClick}
            style={{
              padding: '12px 36px',
              background: 'transparent',
              color: '#b0b0c8',
              border: '1px solid #2d2d44',
              borderRadius: '6px',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 150ms ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = '#6366f1';
              e.target.style.color = '#ffffff';
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = '#2d2d44';
              e.target.style.color = '#b0b0c8';
            }}
          >
            {secondaryCta?.label}
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// CATEGORIES SECTION - NO EMOJIS, CLEAN TEXT ONLY
// ============================================================================
export const CategoriesSection = ({ categories, onCategoryClick }) => {
  return (
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
          Browse Categories
        </h2>

        <p style={{
          fontSize: '0.95rem',
          color: '#b0b0c8',
          marginBottom: 50,
          maxWidth: '500px'
        }}>
          Explore thousands of puzzles and games across many categories
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: 20
        }}>
          {categories.map((category, idx) => (
            <button
              key={idx}
              onClick={() => onCategoryClick?.(category)}
              style={{
                background: '#252539',
                border: '1px solid #2d2d44',
                borderRadius: '8px',
                padding: '24px 16px',
                cursor: 'pointer',
                transition: 'all 150ms ease',
                textAlign: 'center',
                color: '#ffffff',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#2d2d44';
                e.currentTarget.style.borderColor = '#6366f1';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#252539';
                e.currentTarget.style.borderColor = '#2d2d44';
              }}
            >
              <h3 style={{
                fontSize: '1rem',
                fontWeight: 700,
                margin: '0 0 8px 0',
                color: '#ffffff'
              }}>
                {category.name}
              </h3>
              <p style={{
                fontSize: '0.85rem',
                color: '#b0b0c8',
                margin: 0,
                fontWeight: 500
              }}>
                {category.count}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// HOW IT WORKS
// ============================================================================
export const HowItWorksSection = ({ steps }) => {
  return (
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
          How It Works
        </h2>

        <p style={{
          fontSize: '0.95rem',
          color: '#b0b0c8',
          marginBottom: 60,
          maxWidth: '500px'
        }}>
          Get started with just a few simple steps
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 40
        }}>
          {steps.map((step, idx) => (
            <div key={idx} style={{ textAlign: 'left' }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: '#6366f1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 20,
                fontSize: '1.6rem',
                fontWeight: 700,
                color: 'white'
              }}>
                {idx + 1}
              </div>

              <h3 style={{
                fontSize: '1.1rem',
                fontWeight: 700,
                marginBottom: 10,
                color: '#ffffff',
                margin: '0 0 10px 0'
              }}>
                {step.title}
              </h3>

              <p style={{
                fontSize: '0.9rem',
                color: '#b0b0c8',
                lineHeight: 1.6,
                margin: 0
              }}>
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// STATS SECTION
// ============================================================================
export const StatsSection = ({ stats }) => {
  return (
    <div style={{
      background: '#252539',
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
          Join Our Community
        </h2>

        <p style={{
          fontSize: '0.95rem',
          color: '#b0b0c8',
          marginBottom: 60,
          maxWidth: '500px'
        }}>
          Thousands of players enjoying puzzles every day
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: 24
        }}>
          {stats.map((stat, idx) => (
            <div
              key={idx}
              style={{
                background: '#1a1a2e',
                border: '1px solid #2d2d44',
                borderRadius: '8px',
                padding: 28,
                textAlign: 'center',
                transition: 'all 150ms ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#6366f1';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#2d2d44';
              }}
            >
              <div style={{
                fontSize: '2.4rem',
                fontWeight: 900,
                color: '#6366f1',
                marginBottom: 12
              }}>
                {stat.value}
              </div>
              <p style={{
                fontSize: '0.9rem',
                color: '#b0b0c8',
                margin: 0,
                fontWeight: 600
              }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// FEATURES SECTION
// ============================================================================
export const FeaturesSection = ({ features }) => {
  return (
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
          Why AmAha
        </h2>

        <p style={{
          fontSize: '0.95rem',
          color: '#b0b0c8',
          marginBottom: 60,
          maxWidth: '500px'
        }}>
          Everything you need for entertainment and learning
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 24
        }}>
          {features.map((feature, idx) => (
            <div
              key={idx}
              style={{
                background: '#252539',
                border: '1px solid #2d2d44',
                borderRadius: '8px',
                padding: 28,
                transition: 'all 150ms ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#6366f1';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#2d2d44';
              }}
            >
              <div style={{
                fontSize: '2.4rem',
                marginBottom: 16,
                lineHeight: 1
              }}>
                {feature.icon}
              </div>
              <h3 style={{
                fontSize: '1.1rem',
                fontWeight: 700,
                marginBottom: 8,
                color: '#ffffff',
                margin: '0 0 8px 0'
              }}>
                {feature.title}
              </h3>
              <p style={{
                fontSize: '0.9rem',
                color: '#b0b0c8',
                lineHeight: 1.6,
                margin: 0
              }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// CTA SECTION
// ============================================================================
export const CTASection = ({ title, subtitle, primaryCta }) => {
  return (
    <div style={{
      background: '#252539',
      padding: '100px 20px',
      borderTop: '1px solid #2d2d44',
      textAlign: 'center'
    }}>
      <div style={{
        maxWidth: '700px',
        margin: '0 auto'
      }}>
        <h2 style={{
          fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
          fontWeight: 700,
          marginBottom: 16,
          color: '#ffffff'
        }}>
          {title}
        </h2>

        <p style={{
          fontSize: '1rem',
          marginBottom: 40,
          lineHeight: 1.6,
          color: '#b0b0c8'
        }}>
          {subtitle}
        </p>

        <button
          onClick={primaryCta?.onClick}
          style={{
            padding: '12px 36px',
            background: '#6366f1',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'background 150ms ease'
          }}
          onMouseEnter={(e) => (e.target.style.background = '#4f46e5')}
          onMouseLeave={(e) => (e.target.style.background = '#6366f1')}
        >
          {primaryCta?.label}
        </button>
      </div>
    </div>
  );
};
