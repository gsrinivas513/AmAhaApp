/**
 * Refined Design System v2 - Clean & Professional
 * Inspired by PuzzleFree.game aesthetic
 * Minimal, elegant, professional
 */

import React from 'react';
import { useTheme } from '../context/ThemeContext';

// ============================================================================
// HERO SECTION - Clean, minimal, professional
// ============================================================================
export const HeroSectionRefined = ({ title, subtitle, primaryCta, secondaryCta }) => {
  const { isDarkMode } = useTheme();

  const bgColor = isDarkMode ? '#0f172a' : '#ffffff';
  const accentColor = isDarkMode ? '#ffffff' : '#1f2937';
  const secondaryTextColor = isDarkMode ? '#cbd5e1' : '#6b7280';

  return (
    <div style={{
      background: isDarkMode
        ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'
        : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '60px 20px 50px',
      textAlign: 'center',
      color: isDarkMode ? '#f1f5f9' : 'white',
      overflow: 'hidden',
      position: 'relative',
      minHeight: 'auto',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{ position: 'relative', zIndex: 2, maxWidth: '700px' }}>
        <div style={{
          fontSize: '2.5rem',
          marginBottom: 15,
          animation: 'bounce 3s ease-in-out infinite'
        }}>
          🎮
        </div>

        <h1 style={{
          fontSize: 'clamp(2rem, 5vw, 2.8rem)',
          fontWeight: 900,
          marginBottom: 15,
          lineHeight: 1.1,
          letterSpacing: '-0.02em'
        }}>
          {title}
        </h1>

        <p style={{
          fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
          marginBottom: 35,
          lineHeight: 1.6,
          opacity: 1,
          fontWeight: 400,
          maxWidth: '600px',
          margin: '0 auto 35px',
          color: isDarkMode ? '#e2e8f0' : 'rgba(0, 0, 0, 0.8)'
        }}>
          {subtitle}
        </p>

        <div style={{
          display: 'flex',
          gap: 16,
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          {/* Primary Button */}
          <button
            onClick={primaryCta?.onClick}
            style={{
              padding: '12px 32px',
              background: isDarkMode ? '#667eea' : 'white',
              color: isDarkMode ? 'white' : '#667eea',
              border: 'none',
              borderRadius: '40px',
              fontSize: '1rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 300ms ease',
              boxShadow: isDarkMode
                ? '0 15px 35px rgba(0, 0, 0, 0.3)'
                : '0 15px 35px rgba(0, 0, 0, 0.2)',
              transform: 'translateY(0)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-3px)';
              e.target.style.boxShadow = isDarkMode
                ? '0 20px 50px rgba(0, 0, 0, 0.4)'
                : '0 20px 50px rgba(0, 0, 0, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = isDarkMode
                ? '0 15px 35px rgba(0, 0, 0, 0.3)'
                : '0 15px 35px rgba(0, 0, 0, 0.2)';
            }}
          >
            {primaryCta?.label}
          </button>

          {/* Secondary Button */}
          <button
            onClick={secondaryCta?.onClick}
            style={{
              padding: '12px 32px',
              background: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              border: isDarkMode ? '2px solid rgba(255, 255, 255, 0.3)' : '2px solid rgba(255, 255, 255, 0.4)',
              borderRadius: '40px',
              fontSize: '1rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 300ms ease',
              boxShadow: 'none',
              transform: 'translateY(0)'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = isDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.3)';
              e.target.style.border = isDarkMode ? '2px solid rgba(255, 255, 255, 0.5)' : '2px solid rgba(255, 255, 255, 0.6)';
              e.target.style.transform = 'translateY(-3px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.2)';
              e.target.style.border = isDarkMode ? '2px solid rgba(255, 255, 255, 0.3)' : '2px solid rgba(255, 255, 255, 0.4)';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            {secondaryCta?.label}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
      `}</style>
    </div>
  );
};

// ============================================================================
// CATEGORY GRID - Clean 8-color cards without excessive effects
// ============================================================================
export const CategoryGridRefined = ({ categories, onCategoryClick }) => {
  const { isDarkMode } = useTheme();

  const gradients = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
    'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    'linear-gradient(135deg, #ff9a56 0%, #ff6a88 100%)'
  ];

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '40px 20px'
    }}>
      <h2 style={{
        fontSize: 'clamp(1.6rem, 4vw, 2.2rem)',
        fontWeight: 900,
        marginBottom: 30,
        color: isDarkMode ? '#f1f5f9' : '#1f2937',
        textAlign: 'left'
      }}>
        📚 Browse Categories
      </h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
        gap: 12,
        padding: '0'
      }}>
        {categories.map((category, idx) => (
          <div
            key={idx}
            onClick={() => onCategoryClick?.(category)}
            style={{
              background: gradients[idx % 8],
              borderRadius: '12px',
              padding: '16px 12px',
              cursor: 'pointer',
              transition: 'all 250ms ease',
              textAlign: 'center',
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: isDarkMode
                ? '0 4px 12px rgba(0, 0, 0, 0.3)'
                : '0 4px 12px rgba(0, 0, 0, 0.12)',
              border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(255, 255, 255, 0.15)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = isDarkMode
                ? '0 12px 24px rgba(0, 0, 0, 0.4)'
                : '0 12px 24px rgba(0, 0, 0, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = isDarkMode
                ? '0 4px 12px rgba(0, 0, 0, 0.3)'
                : '0 4px 12px rgba(0, 0, 0, 0.12)';
            }}
          >
            <div style={{
              fontSize: '2rem',
              marginBottom: 6,
              display: 'inline-block'
            }}>
              {category.icon}
            </div>

            <h3 style={{
              fontSize: '0.95rem',
              fontWeight: 700,
              marginBottom: 4,
              letterSpacing: '0.2px'
            }}>
              {category.name}
            </h3>

            <p style={{
              fontSize: '0.8rem',
              opacity: 0.95,
              fontWeight: 500,
              margin: 0
            }}>
              {category.count}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// STATS SECTION - Clean, professional cards
// ============================================================================
export const StatsSectionRefined = ({ stats }) => {
  const { isDarkMode } = useTheme();

  return (
    <div style={{
      background: isDarkMode
        ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'
        : 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      padding: '80px 20px',
      margin: '60px 0 0 0'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <h2 style={{
          fontSize: 'clamp(2rem, 5vw, 2.8rem)',
          fontWeight: 900,
          marginBottom: 60,
          textAlign: 'center',
          color: isDarkMode ? '#f1f5f9' : '#1f2937'
        }}>
          📊 By The Numbers
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 24
        }}>
          {stats.map((stat, idx) => (
            <div
              key={idx}
              style={{
                background: isDarkMode ? '#1e293b' : 'white',
                borderRadius: '16px',
                padding: 32,
                textAlign: 'center',
                border: isDarkMode ? '1px solid #334155' : '1px solid #e5e7eb',
                transition: 'all 300ms ease',
                boxShadow: isDarkMode
                  ? '0 4px 12px rgba(0, 0, 0, 0.2)'
                  : '0 4px 12px rgba(0, 0, 0, 0.06)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = isDarkMode
                  ? '0 12px 30px rgba(0, 0, 0, 0.3)'
                  : '0 12px 30px rgba(0, 0, 0, 0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = isDarkMode
                  ? '0 4px 12px rgba(0, 0, 0, 0.2)'
                  : '0 4px 12px rgba(0, 0, 0, 0.06)';
              }}
            >
              <div style={{
                fontSize: '3.2rem',
                fontWeight: 900,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginBottom: 12
              }}>
                {stat.value}
              </div>
              <p style={{
                fontSize: '1.1rem',
                color: isDarkMode ? '#cbd5e1' : '#6b7280',
                margin: 0,
                fontWeight: 700
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
// HOW IT WORKS - Clean step guide
// ============================================================================
export const HowItWorksRefined = ({ steps }) => {
  const { isDarkMode } = useTheme();

  return (
    <div style={{
      padding: '80px 20px',
      maxWidth: '1200px',
      margin: '0 auto',
      background: isDarkMode ? '#0f172a' : '#ffffff'
    }}>
      <h2 style={{
        fontSize: 'clamp(2rem, 5vw, 2.8rem)',
        fontWeight: 900,
        marginBottom: 60,
        textAlign: 'center',
        color: isDarkMode ? '#f1f5f9' : '#1f2937'
      }}>
        🎯 How It Works
      </h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 32
      }}>
        {steps.map((step, idx) => (
          <div
            key={idx}
            style={{
              textAlign: 'center'
            }}
          >
            <div style={{
              width: '70px',
              height: '70px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              fontSize: '2rem',
              fontWeight: 900,
              color: 'white',
              boxShadow: '0 10px 30px rgba(102, 126, 234, 0.25)'
            }}>
              {idx + 1}
            </div>

            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: 800,
              marginBottom: 12,
              color: isDarkMode ? '#f1f5f9' : '#1f2937'
            }}>
              {step.title}
            </h3>

            <p style={{
              fontSize: '1rem',
              color: isDarkMode ? '#cbd5e1' : '#6b7280',
              lineHeight: 1.6,
              fontWeight: 500
            }}>
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// BENEFITS SECTION - Clean, professional, minimal
// ============================================================================
export const BenefitsSectionRefined = ({ benefits }) => {
  const { isDarkMode } = useTheme();

  return (
    <div style={{
      background: isDarkMode
        ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'
        : 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      padding: '80px 20px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <h2 style={{
          fontSize: 'clamp(2rem, 5vw, 2.8rem)',
          fontWeight: 900,
          marginBottom: 60,
          textAlign: 'center',
          color: isDarkMode ? '#f1f5f9' : '#1f2937'
        }}>
          ✨ Why Choose AmAha
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 24
        }}>
          {benefits.map((benefit, idx) => (
            <div
              key={idx}
              style={{
                background: isDarkMode ? '#1e293b' : 'white',
                borderRadius: '16px',
                padding: 32,
                border: isDarkMode ? '1px solid #334155' : '1px solid #e5e7eb',
                transition: 'all 300ms ease',
                textAlign: 'center',
                cursor: 'pointer',
                boxShadow: isDarkMode
                  ? '0 4px 12px rgba(0, 0, 0, 0.2)'
                  : '0 4px 12px rgba(0, 0, 0, 0.06)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = isDarkMode
                  ? '0 12px 30px rgba(0, 0, 0, 0.3)'
                  : '0 12px 30px rgba(0, 0, 0, 0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = isDarkMode
                  ? '0 4px 12px rgba(0, 0, 0, 0.2)'
                  : '0 4px 12px rgba(0, 0, 0, 0.06)';
              }}
            >
              <div style={{
                fontSize: '2.8rem',
                marginBottom: 16
              }}>
                {benefit.icon}
              </div>
              <h3 style={{
                fontSize: '1.2rem',
                fontWeight: 800,
                marginBottom: 12,
                color: isDarkMode ? '#f1f5f9' : '#1f2937'
              }}>
                {benefit.title}
              </h3>
              <p style={{
                fontSize: '1rem',
                color: isDarkMode ? '#cbd5e1' : '#6b7280',
                lineHeight: 1.6,
                fontWeight: 500,
                margin: 0
              }}>
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// CTA SECTION - Clean final call-to-action
// ============================================================================
export const CTASectionRefined = ({ title, subtitle, primaryCta, secondaryCta }) => {
  const { isDarkMode } = useTheme();

  return (
    <div style={{
      background: isDarkMode
        ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'
        : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '80px 20px',
      textAlign: 'center',
      color: isDarkMode ? '#f1f5f9' : 'white'
    }}>
      <div style={{
        maxWidth: '700px',
        margin: '0 auto'
      }}>
        <h2 style={{
          fontSize: 'clamp(2rem, 5vw, 2.6rem)',
          fontWeight: 900,
          marginBottom: 20,
          color: isDarkMode ? '#f1f5f9' : 'white'
        }}>
          {title}
        </h2>

        <p style={{
          fontSize: '1.2rem',
          marginBottom: 40,
          opacity: 0.95,
          lineHeight: 1.7
        }}>
          {subtitle}
        </p>

        <div style={{
          display: 'flex',
          gap: 20,
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={primaryCta?.onClick}
            style={{
              padding: '16px 40px',
              background: isDarkMode ? '#667eea' : 'white',
              color: isDarkMode ? 'white' : '#667eea',
              border: 'none',
              borderRadius: '50px',
              fontSize: '1.1rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 300ms ease',
              boxShadow: isDarkMode
                ? '0 20px 40px rgba(0, 0, 0, 0.4)'
                : '0 20px 40px rgba(0, 0, 0, 0.2)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-3px)';
              e.target.style.boxShadow = isDarkMode
                ? '0 30px 60px rgba(0, 0, 0, 0.5)'
                : '0 30px 60px rgba(0, 0, 0, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = isDarkMode
                ? '0 20px 40px rgba(0, 0, 0, 0.4)'
                : '0 20px 40px rgba(0, 0, 0, 0.2)';
            }}
          >
            {primaryCta?.label}
          </button>

          <button
            onClick={secondaryCta?.onClick}
            style={{
              padding: '16px 40px',
              background: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.2)',
              color: isDarkMode ? '#f1f5f9' : 'white',
              border: isDarkMode ? '2px solid rgba(255, 255, 255, 0.3)' : '2px solid rgba(255, 255, 255, 0.4)',
              borderRadius: '50px',
              fontSize: '1.1rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 300ms ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = isDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.3)';
              e.target.style.transform = 'translateY(-3px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.2)';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            {secondaryCta?.label}
          </button>
        </div>
      </div>
    </div>
  );
};
