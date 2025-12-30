/**
 * PuzzleFree Style Design System
 * Minimal, clean, professional
 * No bright colors, no excessive gradients
 */

import React from 'react';
import { useTheme } from '../context/ThemeContext';

// ============================================================================
// HERO SECTION - Clean, minimal like PuzzleFree
// ============================================================================
export const HeroSectionPuzzleFree = ({ title, subtitle, primaryCta, secondaryCta }) => {
  const { isDarkMode } = useTheme();

  return (
    <div style={{
      background: isDarkMode
        ? 'linear-gradient(to bottom, #0f172a 0%, #1e293b 100%)'
        : 'linear-gradient(to bottom, #667eea 0%, #764ba2 100%)',
      padding: '50px 20px 40px',
      textAlign: 'center',
      color: isDarkMode ? '#f1f5f9' : 'white',
      overflow: 'hidden',
      position: 'relative'
    }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{
          fontSize: 'clamp(1.8rem, 5vw, 2.6rem)',
          fontWeight: 800,
          marginBottom: 12,
          lineHeight: 1.2,
          letterSpacing: '-0.01em'
        }}>
          {title}
        </h1>

        <p style={{
          fontSize: 'clamp(0.9rem, 2vw, 1rem)',
          marginBottom: 30,
          lineHeight: 1.6,
          opacity: 0.95,
          fontWeight: 400
        }}>
          {subtitle}
        </p>

        <div style={{
          display: 'flex',
          gap: 12,
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={primaryCta?.onClick}
            style={{
              padding: '10px 28px',
              background: isDarkMode ? '#667eea' : 'white',
              color: isDarkMode ? 'white' : '#667eea',
              border: 'none',
              borderRadius: '6px',
              fontSize: '0.95rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 200ms ease',
              boxShadow: isDarkMode
                ? '0 4px 12px rgba(0, 0, 0, 0.3)'
                : '0 4px 12px rgba(0, 0, 0, 0.2)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = isDarkMode
                ? '0 8px 20px rgba(0, 0, 0, 0.4)'
                : '0 8px 20px rgba(0, 0, 0, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = isDarkMode
                ? '0 4px 12px rgba(0, 0, 0, 0.3)'
                : '0 4px 12px rgba(0, 0, 0, 0.2)';
            }}
          >
            {primaryCta?.label}
          </button>

          <button
            onClick={secondaryCta?.onClick}
            style={{
              padding: '10px 28px',
              background: isDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.25)',
              color: 'white',
              border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(255, 255, 255, 0.4)',
              borderRadius: '6px',
              fontSize: '0.95rem',
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

// ============================================================================
// CATEGORY GRID - Clean, minimal, NO colorful boxes
// ============================================================================
export const CategoryGridPuzzleFree = ({ categories, onCategoryClick }) => {
  const { isDarkMode } = useTheme();

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '35px 20px'
    }}>
      <h2 style={{
        fontSize: 'clamp(1.4rem, 3.5vw, 1.8rem)',
        fontWeight: 800,
        marginBottom: 25,
        color: isDarkMode ? '#f1f5f9' : '#1f2937'
      }}>
        Browse Categories
      </h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
        gap: 12
      }}>
        {categories.map((category, idx) => (
          <button
            key={idx}
            onClick={() => onCategoryClick?.(category)}
            style={{
              background: isDarkMode ? '#1e293b' : '#f3f4f6',
              border: isDarkMode ? '1px solid #334155' : '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '14px 10px',
              cursor: 'pointer',
              transition: 'all 200ms ease',
              textAlign: 'center',
              color: isDarkMode ? '#f1f5f9' : '#1f2937',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = isDarkMode ? '#334155' : '#e5e7eb';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = isDarkMode
                ? '0 4px 12px rgba(0, 0, 0, 0.3)'
                : '0 4px 12px rgba(0, 0, 0, 0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = isDarkMode ? '#1e293b' : '#f3f4f6';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{
              fontSize: '1.8rem',
              marginBottom: 6
            }}>
              {category.icon}
            </div>
            <h3 style={{
              fontSize: '0.85rem',
              fontWeight: 600,
              marginBottom: 4,
              margin: 0
            }}>
              {category.name}
            </h3>
            <p style={{
              fontSize: '0.75rem',
              color: isDarkMode ? '#cbd5e1' : '#6b7280',
              margin: 0
            }}>
              {category.count}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// STATS SECTION - Clean, minimal
// ============================================================================
export const StatsSectionPuzzleFree = ({ stats }) => {
  const { isDarkMode } = useTheme();

  return (
    <div style={{
      background: isDarkMode ? '#0f172a' : '#f9fafb',
      padding: '50px 20px',
      margin: '40px 0 0 0'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <h2 style={{
          fontSize: 'clamp(1.4rem, 3.5vw, 1.8rem)',
          fontWeight: 800,
          marginBottom: 35,
          textAlign: 'center',
          color: isDarkMode ? '#f1f5f9' : '#1f2937'
        }}>
          Our Stats
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
                background: isDarkMode ? '#1e293b' : 'white',
                border: isDarkMode ? '1px solid #334155' : '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: 20,
                textAlign: 'center',
                transition: 'all 200ms ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = isDarkMode
                  ? '0 4px 12px rgba(0, 0, 0, 0.2)'
                  : '0 4px 12px rgba(0, 0, 0, 0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{
                fontSize: '2rem',
                fontWeight: 800,
                color: '#667eea',
                marginBottom: 8
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
// HOW IT WORKS - Clean, simple
// ============================================================================
export const HowItWorksPuzzleFree = ({ steps }) => {
  const { isDarkMode } = useTheme();

  return (
    <div style={{
      padding: '50px 20px',
      maxWidth: '1200px',
      margin: '0 auto',
      background: isDarkMode ? '#0f172a' : '#ffffff'
    }}>
      <h2 style={{
        fontSize: 'clamp(1.4rem, 3.5vw, 1.8rem)',
        fontWeight: 800,
        marginBottom: 40,
        textAlign: 'center',
        color: isDarkMode ? '#f1f5f9' : '#1f2937'
      }}>
        How It Works
      </h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: 30
      }}>
        {steps.map((step, idx) => (
          <div
            key={idx}
            style={{
              textAlign: 'center'
            }}
          >
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              background: '#667eea',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              fontSize: '1.6rem',
              fontWeight: 800,
              color: 'white',
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.2)'
            }}>
              {idx + 1}
            </div>

            <h3 style={{
              fontSize: '1rem',
              fontWeight: 700,
              marginBottom: 8,
              color: isDarkMode ? '#f1f5f9' : '#1f2937'
            }}>
              {step.title}
            </h3>

            <p style={{
              fontSize: '0.9rem',
              color: isDarkMode ? '#cbd5e1' : '#6b7280',
              lineHeight: 1.5,
              fontWeight: 400
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
// BENEFITS SECTION - Simple, clean
// ============================================================================
export const BenefitsPuzzleFree = ({ benefits }) => {
  const { isDarkMode } = useTheme();

  return (
    <div style={{
      background: isDarkMode ? '#1e293b' : '#f9fafb',
      padding: '50px 20px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <h2 style={{
          fontSize: 'clamp(1.4rem, 3.5vw, 1.8rem)',
          fontWeight: 800,
          marginBottom: 40,
          textAlign: 'center',
          color: isDarkMode ? '#f1f5f9' : '#1f2937'
        }}>
          Why AmAha
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 20
        }}>
          {benefits.map((benefit, idx) => (
            <div
              key={idx}
              style={{
                background: isDarkMode ? '#0f172a' : 'white',
                border: isDarkMode ? '1px solid #334155' : '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: 24,
                textAlign: 'center',
                transition: 'all 200ms ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = isDarkMode
                  ? '0 4px 12px rgba(0, 0, 0, 0.2)'
                  : '0 4px 12px rgba(0, 0, 0, 0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{
                fontSize: '2.2rem',
                marginBottom: 12
              }}>
                {benefit.icon}
              </div>
              <h3 style={{
                fontSize: '1rem',
                fontWeight: 700,
                marginBottom: 8,
                color: isDarkMode ? '#f1f5f9' : '#1f2937'
              }}>
                {benefit.title}
              </h3>
              <p style={{
                fontSize: '0.9rem',
                color: isDarkMode ? '#cbd5e1' : '#6b7280',
                lineHeight: 1.5,
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
// CTA SECTION - Clean finale
// ============================================================================
export const CTAPuzzleFree = ({ title, subtitle, primaryCta, secondaryCta }) => {
  const { isDarkMode } = useTheme();

  return (
    <div style={{
      background: isDarkMode
        ? 'linear-gradient(to bottom, #1e293b 0%, #0f172a 100%)'
        : 'linear-gradient(to bottom, #667eea 0%, #764ba2 100%)',
      padding: '50px 20px',
      textAlign: 'center',
      color: isDarkMode ? '#f1f5f9' : 'white'
    }}>
      <div style={{
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        <h2 style={{
          fontSize: 'clamp(1.4rem, 3.5vw, 1.8rem)',
          fontWeight: 800,
          marginBottom: 12
        }}>
          {title}
        </h2>

        <p style={{
          fontSize: '1rem',
          marginBottom: 30,
          opacity: 0.95,
          lineHeight: 1.6
        }}>
          {subtitle}
        </p>

        <div style={{
          display: 'flex',
          gap: 12,
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={primaryCta?.onClick}
            style={{
              padding: '10px 28px',
              background: isDarkMode ? '#667eea' : 'white',
              color: isDarkMode ? 'white' : '#667eea',
              border: 'none',
              borderRadius: '6px',
              fontSize: '0.95rem',
              fontWeight: 600,
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
              padding: '10px 28px',
              background: isDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.25)',
              color: 'white',
              border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(255, 255, 255, 0.4)',
              borderRadius: '6px',
              fontSize: '0.95rem',
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
