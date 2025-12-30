/**
 * Professional PuzzleFree.game Style Design System
 * Modern, clean, corporate - with actual visual content
 */

import React from 'react';
import { useTheme } from '../context/ThemeContext';

// ============================================================================
// HERO SECTION - Bold, modern, minimal
// ============================================================================
export const HeroSectionModernPro = ({ title, subtitle, primaryCta, secondaryCta, backgroundImage }) => {
  const { isDarkMode } = useTheme();

  return (
    <div style={{
      background: isDarkMode
        ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
        : 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
      padding: '80px 20px 120px',
      textAlign: 'center',
      color: isDarkMode ? '#f1f5f9' : '#0f1419',
      position: 'relative',
      overflow: 'hidden',
      borderBottom: isDarkMode ? '1px solid #334155' : '1px solid #e5e7eb'
    }}>
      {/* Background accent */}
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '400px',
        height: '400px',
        background: isDarkMode
          ? 'radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 70%)'
          : 'radial-gradient(circle, rgba(102, 126, 234, 0.05) 0%, transparent 70%)',
        borderRadius: '50%',
        zIndex: 0
      }} />

      <div style={{
        maxWidth: '700px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 1
      }}>
        <h1 style={{
          fontSize: 'clamp(2.2rem, 6vw, 3.5rem)',
          fontWeight: 900,
          marginBottom: 16,
          lineHeight: 1.15,
          letterSpacing: '-0.02em',
          color: isDarkMode ? '#f1f5f9' : '#0f1419'
        }}>
          {title}
        </h1>

        <p style={{
          fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
          marginBottom: 40,
          lineHeight: 1.6,
          color: isDarkMode ? '#cbd5e1' : '#475569',
          fontWeight: 400,
          maxWidth: '600px',
          margin: '0 auto 40px'
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
              padding: '14px 36px',
              background: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 200ms ease',
              boxShadow: '0 4px 16px rgba(102, 126, 234, 0.2)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 8px 24px rgba(102, 126, 234, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 16px rgba(102, 126, 234, 0.2)';
            }}
          >
            {primaryCta?.label}
          </button>

          <button
            onClick={secondaryCta?.onClick}
            style={{
              padding: '14px 36px',
              background: isDarkMode ? '#334155' : '#e5e7eb',
              color: isDarkMode ? '#f1f5f9' : '#0f1419',
              border: isDarkMode ? '1px solid #475569' : '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 200ms ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.background = isDarkMode ? '#475569' : '#d1d5db';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.background = isDarkMode ? '#334155' : '#e5e7eb';
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
// CATEGORY GRID - WITH IMAGE CARDS - Like PuzzleFree
// ============================================================================
export const CategoryGridModernPro = ({ categories, onCategoryClick }) => {
  const { isDarkMode } = useTheme();

  return (
    <div style={{
      padding: '60px 20px',
      background: isDarkMode ? '#0f172a' : '#ffffff'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        <h2 style={{
          fontSize: 'clamp(1.6rem, 4vw, 2.2rem)',
          fontWeight: 900,
          marginBottom: 12,
          color: isDarkMode ? '#f1f5f9' : '#0f1419'
        }}>
          Browse Categories
        </h2>

        <p style={{
          fontSize: '1rem',
          color: isDarkMode ? '#cbd5e1' : '#475569',
          marginBottom: 40,
          maxWidth: '500px'
        }}>
          Choose from thousands of puzzles across multiple categories
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: 20
        }}>
          {categories.map((category, idx) => (
            <button
              key={idx}
              onClick={() => onCategoryClick?.(category)}
              style={{
                background: isDarkMode ? '#1e293b' : '#f8f9fa',
                border: isDarkMode ? '1px solid #334155' : '1px solid #e5e7eb',
                borderRadius: '12px',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 250ms ease',
                display: 'flex',
                flexDirection: 'column',
                height: '240px',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = isDarkMode
                  ? '0 12px 24px rgba(0, 0, 0, 0.3)'
                  : '0 12px 24px rgba(0, 0, 0, 0.1)';
                e.currentTarget.style.borderColor = '#667eea';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = isDarkMode ? '#334155' : '#e5e7eb';
              }}
            >
              {/* Image/Icon area */}
              <div style={{
                background: isDarkMode
                  ? 'linear-gradient(135deg, #334155 0%, #1e293b 100%)'
                  : 'linear-gradient(135deg, #f0f4f8 0%, #e5e7eb 100%)',
                height: '140px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '3rem',
                borderBottom: isDarkMode ? '1px solid #334155' : '1px solid #d1d5db'
              }}>
                {category.icon}
              </div>

              {/* Content area */}
              <div style={{
                padding: '12px',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                textAlign: 'left'
              }}>
                <h3 style={{
                  fontSize: '1rem',
                  fontWeight: 700,
                  marginBottom: 4,
                  margin: 0,
                  color: isDarkMode ? '#f1f5f9' : '#0f1419'
                }}>
                  {category.name}
                </h3>
                <p style={{
                  fontSize: '0.85rem',
                  color: isDarkMode ? '#cbd5e1' : '#6b7280',
                  margin: 0,
                  fontWeight: 500
                }}>
                  {category.count}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// HOW IT WORKS - Professional 4 step process
// ============================================================================
export const HowItWorksModernPro = ({ steps }) => {
  const { isDarkMode } = useTheme();

  return (
    <div style={{
      padding: '60px 20px',
      background: isDarkMode ? '#1e293b' : '#f9fafb',
      borderTop: isDarkMode ? '1px solid #334155' : '1px solid #e5e7eb'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <h2 style={{
          fontSize: 'clamp(1.6rem, 4vw, 2.2rem)',
          fontWeight: 900,
          marginBottom: 12,
          textAlign: 'center',
          color: isDarkMode ? '#f1f5f9' : '#0f1419'
        }}>
          How It Works
        </h2>

        <p style={{
          textAlign: 'center',
          fontSize: '1rem',
          color: isDarkMode ? '#cbd5e1' : '#475569',
          marginBottom: 50,
          maxWidth: '500px',
          margin: '0 auto 50px'
        }}>
          Get started in just a few simple steps
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 30
        }}>
          {steps.map((step, idx) => (
            <div key={idx} style={{ textAlign: 'center' }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: '#667eea',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                fontSize: '1.8rem',
                fontWeight: 900,
                color: 'white',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.2)'
              }}>
                {idx + 1}
              </div>

              <h3 style={{
                fontSize: '1.1rem',
                fontWeight: 700,
                marginBottom: 10,
                color: isDarkMode ? '#f1f5f9' : '#0f1419'
              }}>
                {step.title}
              </h3>

              <p style={{
                fontSize: '0.95rem',
                color: isDarkMode ? '#cbd5e1' : '#6b7280',
                lineHeight: 1.6,
                fontWeight: 400
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
// STATS SECTION - Community metrics
// ============================================================================
export const StatsModernPro = ({ stats }) => {
  const { isDarkMode } = useTheme();

  return (
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
          marginBottom: 50,
          textAlign: 'center',
          color: isDarkMode ? '#f1f5f9' : '#0f1419'
        }}>
          Join Our Growing Community
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: 20
        }}>
          {stats.map((stat, idx) => (
            <div
              key={idx}
              style={{
                background: isDarkMode ? '#1e293b' : '#f9fafb',
                border: isDarkMode ? '1px solid #334155' : '1px solid #e5e7eb',
                borderRadius: '12px',
                padding: 30,
                textAlign: 'center',
                transition: 'all 200ms ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = isDarkMode
                  ? '0 8px 16px rgba(0, 0, 0, 0.2)'
                  : '0 8px 16px rgba(0, 0, 0, 0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{
                fontSize: '2.2rem',
                fontWeight: 900,
                color: '#667eea',
                marginBottom: 8,
                lineHeight: 1
              }}>
                {stat.value}
              </div>
              <p style={{
                fontSize: '0.95rem',
                color: isDarkMode ? '#cbd5e1' : '#6b7280',
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
// BENEFITS SECTION - Why choose us
// ============================================================================
export const BenefitsModernPro = ({ benefits }) => {
  const { isDarkMode } = useTheme();

  return (
    <div style={{
      padding: '60px 20px',
      background: isDarkMode ? '#1e293b' : '#f9fafb',
      borderTop: isDarkMode ? '1px solid #334155' : '1px solid #e5e7eb'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <h2 style={{
          fontSize: 'clamp(1.6rem, 4vw, 2.2rem)',
          fontWeight: 900,
          marginBottom: 50,
          textAlign: 'center',
          color: isDarkMode ? '#f1f5f9' : '#0f1419'
        }}>
          Why Choose AmAha
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
                background: isDarkMode ? '#0f172a' : 'white',
                border: isDarkMode ? '1px solid #334155' : '1px solid #e5e7eb',
                borderRadius: '12px',
                padding: 28,
                transition: 'all 250ms ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = isDarkMode
                  ? '0 12px 24px rgba(0, 0, 0, 0.2)'
                  : '0 12px 24px rgba(0, 0, 0, 0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{
                fontSize: '2.4rem',
                marginBottom: 14,
                lineHeight: 1
              }}>
                {benefit.icon}
              </div>
              <h3 style={{
                fontSize: '1.1rem',
                fontWeight: 700,
                marginBottom: 10,
                color: isDarkMode ? '#f1f5f9' : '#0f1419'
              }}>
                {benefit.title}
              </h3>
              <p style={{
                fontSize: '0.95rem',
                color: isDarkMode ? '#cbd5e1' : '#6b7280',
                lineHeight: 1.6,
                fontWeight: 400,
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
// CTA SECTION - Final call to action
// ============================================================================
export const CTAModernPro = ({ title, subtitle, primaryCta, secondaryCta }) => {
  const { isDarkMode } = useTheme();

  return (
    <div style={{
      background: isDarkMode
        ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'
        : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '80px 20px',
      textAlign: 'center',
      color: isDarkMode ? '#f1f5f9' : 'white',
      borderTop: isDarkMode ? '1px solid #334155' : 'none'
    }}>
      <div style={{
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        <h2 style={{
          fontSize: 'clamp(1.8rem, 5vw, 2.6rem)',
          fontWeight: 900,
          marginBottom: 16
        }}>
          {title}
        </h2>

        <p style={{
          fontSize: '1.1rem',
          marginBottom: 40,
          opacity: 0.95,
          lineHeight: 1.6
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
              padding: '14px 36px',
              background: isDarkMode ? '#667eea' : 'white',
              color: isDarkMode ? 'white' : '#667eea',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 200ms ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = isDarkMode
                ? '0 8px 20px rgba(0, 0, 0, 0.4)'
                : '0 8px 20px rgba(0, 0, 0, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
            }}
          >
            {primaryCta?.label}
          </button>

          <button
            onClick={secondaryCta?.onClick}
            style={{
              padding: '14px 36px',
              background: isDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.25)',
              color: 'white',
              border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(255, 255, 255, 0.4)',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 200ms ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.35)';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = isDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.25)';
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
