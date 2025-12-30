/**
 * Modern AmAha Design System v2
 * Comprehensive glassmorphic design with 5-color variants and dark mode
 * Inspired by PuzzleFree.game aesthetic
 */

import React from 'react';

// ============================================================================
// GLASS CARD COMPONENT - Reusable glassmorphic card
// ============================================================================
export const GlassCard = ({ 
  children, 
  onClick, 
  variant = 'default',
  intensity = 'medium',
  isDark = false 
}) => {
  const intensityStyles = {
    light: {
      background: 'rgba(255, 255, 255, 0.5)',
      backdropFilter: 'blur(8px)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)'
    },
    medium: {
      background: 'rgba(255, 255, 255, 0.7)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(255, 255, 255, 0.5)',
      boxShadow: '0 12px 48px rgba(0, 0, 0, 0.12)'
    },
    heavy: {
      background: 'rgba(255, 255, 255, 0.85)',
      backdropFilter: 'blur(15px)',
      border: '1px solid rgba(255, 255, 255, 0.6)',
      boxShadow: '0 16px 64px rgba(0, 0, 0, 0.15)'
    }
  };

  const darkIntensityStyles = {
    light: {
      background: 'rgba(30, 41, 59, 0.4)',
      backdropFilter: 'blur(8px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
    },
    medium: {
      background: 'rgba(30, 41, 59, 0.6)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(255, 255, 255, 0.15)',
      boxShadow: '0 12px 48px rgba(0, 0, 0, 0.4)'
    },
    heavy: {
      background: 'rgba(30, 41, 59, 0.75)',
      backdropFilter: 'blur(15px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      boxShadow: '0 16px 64px rgba(0, 0, 0, 0.5)'
    }
  };

  const styles = isDark ? darkIntensityStyles : intensityStyles;
  const style = styles[intensity];

  return (
    <div
      onClick={onClick}
      style={{
        ...style,
        borderRadius: '20px',
        padding: '24px',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
        backdropFilter: 'blur(15px)',
        WebkitBackdropFilter: 'blur(15px)',
      }}
      onMouseEnter={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'translateY(-8px)';
          e.currentTarget.style.boxShadow = isDark 
            ? '0 20px 80px rgba(0, 0, 0, 0.6)' 
            : '0 20px 80px rgba(0, 0, 0, 0.2)';
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = style.boxShadow;
      }}
    >
      {children}
    </div>
  );
};

// ============================================================================
// HERO SECTION v2 - Modern glassmorphic hero with animated blobs
// ============================================================================
export const HeroSectionModern = ({ title, subtitle, primaryCta, secondaryCta }) => {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '140px 20px',
      textAlign: 'center',
      color: 'white',
      overflow: 'hidden',
      position: 'relative',
      minHeight: '700px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {/* Animated glassmorphic blobs */}
      <div style={{
        position: 'absolute',
        top: '-200px',
        right: '-100px',
        width: '500px',
        height: '500px',
        background: 'rgba(255, 255, 255, 0.15)',
        borderRadius: '50%',
        filter: 'blur(100px)',
        animation: 'float 12s ease-in-out infinite'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-150px',
        left: '-100px',
        width: '450px',
        height: '450px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '50%',
        filter: 'blur(90px)',
        animation: 'float 14s ease-in-out infinite 2s'
      }} />
      <div style={{
        position: 'absolute',
        top: '30%',
        right: '5%',
        width: '400px',
        height: '400px',
        background: 'rgba(255, 255, 255, 0.08)',
        borderRadius: '50%',
        filter: 'blur(100px)',
        animation: 'float 16s ease-in-out infinite 4s'
      }} />

      <div style={{ position: 'relative', zIndex: 2, maxWidth: '900px' }}>
        <div style={{
          fontSize: '4rem',
          marginBottom: 20,
          animation: 'bounce 3s ease-in-out infinite'
        }}>
          🎮
        </div>
        <h1 style={{
          fontSize: 'clamp(2.8rem, 7vw, 5rem)',
          fontWeight: 900,
          marginBottom: 30,
          lineHeight: 1.1,
          letterSpacing: '-0.02em',
          textShadow: '0 10px 40px rgba(0, 0, 0, 0.3)'
        }}>
          {title}
        </h1>
        <p style={{
          fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)',
          marginBottom: 60,
          lineHeight: 1.8,
          opacity: 0.95,
          fontWeight: 400,
          maxWidth: '700px',
          margin: '0 auto 60px'
        }}>
          {subtitle}
        </p>

        <div style={{
          display: 'flex',
          gap: 24,
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          {/* Primary Button - Ultra glass style */}
          <button
            onClick={primaryCta?.onClick}
            style={{
              padding: '18px 48px',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              color: '#667eea',
              border: 'none',
              borderRadius: '60px',
              fontSize: '1.15rem',
              fontWeight: 800,
              cursor: 'pointer',
              transition: 'all 300ms cubic-bezier(0.34, 1.56, 0.64, 1)',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 1)',
              transform: 'translateY(0)',
              letterSpacing: '0.5px'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-6px)';
              e.target.style.boxShadow = '0 35px 70px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 1)';
              e.target.style.background = 'rgba(255, 255, 255, 1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 1)';
              e.target.style.background = 'rgba(255, 255, 255, 0.95)';
            }}
          >
            {primaryCta?.label}
          </button>

          {/* Secondary Button - Glass border style */}
          <button
            onClick={secondaryCta?.onClick}
            style={{
              padding: '18px 48px',
              background: 'rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              color: 'white',
              border: '2px solid rgba(255, 255, 255, 0.5)',
              borderRadius: '60px',
              fontSize: '1.15rem',
              fontWeight: 800,
              cursor: 'pointer',
              transition: 'all 300ms cubic-bezier(0.34, 1.56, 0.64, 1)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
              transform: 'translateY(0)',
              letterSpacing: '0.5px'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.2)';
              e.target.style.border = '2px solid rgba(255, 255, 255, 0.7)';
              e.target.style.transform = 'translateY(-6px)';
              e.target.style.boxShadow = '0 15px 50px rgba(0, 0, 0, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.12)';
              e.target.style.border = '2px solid rgba(255, 255, 255, 0.5)';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.2)';
            }}
          >
            {secondaryCta?.label}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-40px) rotate(3deg); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
};

// ============================================================================
// CATEGORY GRID - Modern 8-color gradient cards with animations
// ============================================================================
export const CategoryGridModern = ({ categories, onCategoryClick }) => {
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
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: 24,
        padding: '0 20px'
      }}>
        {categories.map((category, idx) => (
          <div
            key={idx}
            onClick={() => onCategoryClick?.(category)}
            style={{
              background: gradients[idx % 8],
              borderRadius: '24px',
              padding: '32px 20px',
              cursor: 'pointer',
              transition: 'all 400ms cubic-bezier(0.34, 1.56, 0.64, 1)',
              textAlign: 'center',
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.15)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-12px) scale(1.02)';
              e.currentTarget.style.boxShadow = '0 40px 80px rgba(0, 0, 0, 0.25)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 20px 50px rgba(0, 0, 0, 0.15)';
            }}
          >
            {/* Icon with animation */}
            <div style={{
              fontSize: '3rem',
              marginBottom: 12,
              transition: 'all 300ms ease',
              display: 'inline-block'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.3) rotate(10deg)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
            }}
            >
              {category.icon}
            </div>
            
            <h3 style={{
              fontSize: '1.3rem',
              fontWeight: 800,
              marginBottom: 8,
              letterSpacing: '0.5px'
            }}>
              {category.name}
            </h3>
            
            <p style={{
              fontSize: '0.95rem',
              opacity: 0.95,
              fontWeight: 600,
              margin: 0
            }}>
              {category.count} puzzles
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// STATS SECTION - Glassmorphic stats cards with gradients
// ============================================================================
export const StatsSectionModern = ({ stats }) => {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%)',
      padding: '100px 20px',
      margin: '60px 0 0 0'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <h2 style={{
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          fontWeight: 900,
          marginBottom: 60,
          textAlign: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          📊 By The Numbers
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 28,
          padding: '0 20px'
        }}>
          {stats.map((stat, idx) => (
            <GlassCard key={idx} intensity="heavy">
              <div style={{
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '3.5rem',
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
                  fontSize: '1.2rem',
                  color: '#6b7280',
                  margin: 0,
                  fontWeight: 700
                }}>
                  {stat.label}
                </p>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// HOW IT WORKS - Step-by-step guide with glassmorphism
// ============================================================================
export const HowItWorksModern = ({ steps }) => {
  return (
    <div style={{
      padding: '100px 20px',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      <h2 style={{
        fontSize: 'clamp(2rem, 5vw, 3rem)',
        fontWeight: 900,
        marginBottom: 60,
        textAlign: 'center',
        color: '#1f2937'
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
              textAlign: 'center',
              position: 'relative'
            }}
          >
            {/* Step number circle - glassmorphic */}
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              fontSize: '2.2rem',
              fontWeight: 900,
              color: 'white',
              boxShadow: '0 20px 50px rgba(102, 126, 234, 0.3)',
              position: 'relative',
              backdropFilter: 'blur(10px)'
            }}>
              {idx + 1}
            </div>

            <h3 style={{
              fontSize: '1.3rem',
              fontWeight: 800,
              marginBottom: 12,
              color: '#1f2937'
            }}>
              {step.title}
            </h3>

            <p style={{
              fontSize: '1rem',
              color: '#6b7280',
              lineHeight: 1.6,
              fontWeight: 500
            }}>
              {step.description}
            </p>

            {/* Connector line */}
            {idx < steps.length - 1 && (
              <div style={{
                position: 'absolute',
                top: 40,
                left: '100%',
                width: 'calc(100% + 32px)',
                height: '2px',
                background: 'linear-gradient(90deg, #667eea 0%, transparent 100%)',
                display: 'none'
              }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// BENEFITS SECTION - Feature cards with glassmorphism
// ============================================================================
export const BenefitsSectionModern = ({ benefits }) => {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '100px 20px',
      color: 'white'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <h2 style={{
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          fontWeight: 900,
          marginBottom: 60,
          textAlign: 'center',
          textShadow: '0 4px 20px rgba(0, 0, 0, 0.2)'
        }}>
          ✨ Why Choose AmAha
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 28
        }}>
          {benefits.map((benefit, idx) => (
            <div
              key={idx}
              style={{
                background: 'rgba(255, 255, 255, 0.12)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderRadius: '20px',
                padding: 32,
                border: '1px solid rgba(255, 255, 255, 0.2)',
                transition: 'all 300ms ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.18)';
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{
                fontSize: '3rem',
                marginBottom: 16
              }}>
                {benefit.icon}
              </div>
              <h3 style={{
                fontSize: '1.3rem',
                fontWeight: 800,
                marginBottom: 12
              }}>
                {benefit.title}
              </h3>
              <p style={{
                fontSize: '1rem',
                opacity: 0.95,
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
// CTA SECTION - Final call-to-action with glassmorphism
// ============================================================================
export const CTASectionModern = ({ title, subtitle, primaryCta, secondaryCta }) => {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '100px 20px',
      textAlign: 'center',
      color: 'white',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Animated background elements */}
      <div style={{
        position: 'absolute',
        top: '-100px',
        right: '-100px',
        width: '300px',
        height: '300px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '50%',
        filter: 'blur(80px)',
        animation: 'float 8s ease-in-out infinite'
      }} />

      <div style={{
        position: 'relative',
        zIndex: 2,
        maxWidth: '700px',
        margin: '0 auto'
      }}>
        <h2 style={{
          fontSize: 'clamp(2rem, 5vw, 2.8rem)',
          fontWeight: 900,
          marginBottom: 20
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
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              color: '#667eea',
              border: 'none',
              borderRadius: '50px',
              fontSize: '1.1rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 300ms ease',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.2)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-3px)';
              e.target.style.boxShadow = '0 30px 70px rgba(0, 0, 0, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 20px 50px rgba(0, 0, 0, 0.2)';
            }}
          >
            {primaryCta?.label}
          </button>

          <button
            onClick={secondaryCta?.onClick}
            style={{
              padding: '16px 40px',
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              color: 'white',
              border: '2px solid rgba(255, 255, 255, 0.4)',
              borderRadius: '50px',
              fontSize: '1.1rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 300ms ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.25)';
              e.target.style.transform = 'translateY(-3px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.15)';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            {secondaryCta?.label}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
};
