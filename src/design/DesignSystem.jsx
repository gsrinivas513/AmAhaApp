/**
 * AmAha Design System
 * Reusable component library based on PuzzleFree.game patterns
 * Provides: Hero sections, Category grids, Stats strips, Featured sections
 */

import React from 'react';

// ============================================================================
// HERO SECTION - Large banner with title, description, CTA
// ============================================================================
export const HeroSection = ({
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  backgroundGradient,
  children
}) => {
  const defaultGradient = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
  
  return (
    <div style={{
      background: backgroundGradient || defaultGradient,
      color: 'white',
      padding: '100px 20px',
      textAlign: 'center',
      borderRadius: '0 0 32px 32px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated background elements */}
      <div style={{
        position: 'absolute',
        top: '-50%',
        right: '-10%',
        width: '500px',
        height: '500px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '50%',
        filter: 'blur(80px)'
      }} />
      
      <div style={{
        position: 'relative',
        zIndex: 1
      }}>
        <h1 style={{
          fontSize: 'clamp(2.5rem, 5vw, 3.8rem)',
          fontWeight: 800,
          marginBottom: 20,
          textShadow: '0 4px 20px rgba(0,0,0,0.15)',
          letterSpacing: '-1px',
          lineHeight: 1.2
        }}>
          {title}
        </h1>
        
        <p style={{
          fontSize: 'clamp(1rem, 2vw, 1.4rem)',
          marginBottom: 40,
          opacity: 0.95,
          maxWidth: '650px',
          margin: '0 auto 40px',
          lineHeight: 1.6,
          fontWeight: 400
        }}>
          {subtitle}
        </p>

        <div style={{
          display: 'flex',
          gap: 20,
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginBottom: 20
        }}>
          {primaryCta && (
            <button style={{
              padding: '16px 40px',
              fontSize: '1.1rem',
              fontWeight: 700,
              background: 'white',
              color: '#667eea',
              border: 'none',
              borderRadius: 16,
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 8px 20px rgba(0,0,0,0.25)',
              letterSpacing: '0.5px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.35)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.25)';
            }}
            onClick={primaryCta.onClick}>
              {primaryCta.label}
            </button>
          )}
          
          {secondaryCta && (
            <button style={{
              padding: '16px 40px',
              fontSize: '1.1rem',
              fontWeight: 700,
              background: 'rgba(255,255,255,0.15)',
              color: 'white',
              border: '2px solid rgba(255,255,255,0.4)',
              borderRadius: 16,
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              backdropFilter: 'blur(10px)',
              letterSpacing: '0.5px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.25)';
              e.currentTarget.style.transform = 'translateY(-3px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
            onClick={secondaryCta.onClick}>
              {secondaryCta.label}
            </button>
          )}
        </div>
      </div>

      {children}
    </div>
  );
};

// ============================================================================
// CATEGORY GRID - Display categories as clickable cards
// ============================================================================
export const CategoryGrid = ({ categories, onCategoryClick }) => {
  const gradients = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
    'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    'linear-gradient(135deg, #ff9d56 0%, #ff6a88 100%)',
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
      gap: 16,
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 20px 40px'
    }}>
      {categories.map((category, idx) => (
        <div
          key={category.id}
          onClick={() => onCategoryClick(category)}
          style={{
            padding: 20,
            background: gradients[idx % gradients.length],
            color: 'white',
            borderRadius: 16,
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: 'translateY(0)',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.12)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-6px)';
            e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.12)';
          }}
        >
          <div style={{ 
            fontSize: '2.8rem', 
            marginBottom: 12,
            display: 'inline-block',
            transition: 'transform 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.15) rotate(5deg)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1) rotate(0)';
          }}>
            {category.icon || '🎮'}
          </div>
          <p style={{
            fontSize: '1rem',
            fontWeight: 700,
            margin: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            letterSpacing: '0.5px'
          }}>
            {category.name}
          </p>
          <p style={{
            fontSize: '0.8rem',
            opacity: 0.9,
            margin: '8px 0 0 0',
            fontWeight: 500
          }}>
            {category.count} puzzles
          </p>
        </div>
      ))}
    </div>
  );
};

// ============================================================================
// STATS SECTION - Show impressive numbers
// ============================================================================
export const StatsSection = ({ stats }) => {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%)',
      padding: '80px 20px',
      margin: '60px 0 0 0'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <h2 style={{
          fontSize: '2.4rem',
          fontWeight: 800,
          marginBottom: 50,
          textAlign: 'center',
          color: '#0f172a',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          By The Numbers
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 32,
          textAlign: 'center'
        }}>
          {stats.map((stat, idx) => (
            <div
              key={idx}
              style={{
                padding: 32,
                background: 'white',
                borderRadius: 16,
                border: '1px solid rgba(0, 0, 0, 0.05)',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.06)';
              }}
            >
              <div style={{
                fontSize: '3.2rem',
                fontWeight: 800,
                color: '#667eea',
                marginBottom: 12
              }}>
                {stat.value}
              </div>
              <p style={{
                fontSize: '1.15rem',
                color: '#6b7280',
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
// FEATURED SECTION - Show featured/popular items
// ============================================================================
export const FeaturedSection = ({ title, items, onItemClick }) => {
  return (
    <div style={{
      maxWidth: '1200px',
      margin: '80px auto',
      padding: '0 20px'
    }}>
      <h2 style={{
        fontSize: '2.4rem',
        fontWeight: 800,
        marginBottom: 12,
        color: '#0f172a',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
      }}>
        ⭐ {title}
      </h2>
      
      <p style={{
        color: '#6b7280',
        marginBottom: 40,
        fontSize: '1.1rem',
        fontWeight: 500
      }}>
        Handpicked puzzles loved by our community
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: 28
      }}>
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => onItemClick(item)}
            style={{
              borderRadius: 16,
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
              background: 'white',
              border: '1px solid rgba(0, 0, 0, 0.05)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)';
            }}
          >
            <div style={{
              width: '100%',
              height: '180px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '3.5rem',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: '-30%',
                right: '-10%',
                width: '200px',
                height: '200px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '50%',
                filter: 'blur(60px)'
              }} />
              <span style={{ position: 'relative', zIndex: 1 }}>
                {item.image || item.icon || '🎮'}
              </span>
              <div style={{
                position: 'absolute',
                top: 12,
                right: 12,
                background: 'rgba(255,255,255,0.95)',
                padding: '8px 14px',
                borderRadius: 24,
                fontSize: '0.9rem',
                fontWeight: 700,
                backdropFilter: 'blur(10px)',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                zIndex: 2
              }}>
                ⭐ {item.rating || 4.5}
              </div>
            </div>
            
            <div style={{ padding: 20 }}>
              <h3 style={{
                fontSize: '1.1rem',
                fontWeight: 700,
                margin: '0 0 8px 0',
                color: '#0f172a'
              }}>
                {item.title}
              </h3>
              
              <p style={{
                fontSize: '0.85rem',
                color: '#6b7280',
                margin: 0,
                marginBottom: 12
              }}>
                {item.description}
              </p>

              {item.tags && item.tags.length > 0 && (
                <div style={{
                  display: 'flex',
                  gap: 6,
                  marginBottom: 12,
                  flexWrap: 'wrap'
                }}>
                  {item.tags.slice(0, 2).map((tag, idx) => (
                    <span key={idx} style={{
                      display: 'inline-block',
                      background: '#f0f9ff',
                      color: '#0369a1',
                      padding: '4px 10px',
                      borderRadius: 12,
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      border: '1px solid #bae6fd'
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '0.8rem',
                color: '#9ca3af'
              }}>
                <span>▶️ {item.plays || 0}</span>
                <span>✓ {item.completed || 0}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// HOW IT WORKS - Step by step process
// ============================================================================
export const HowItWorksSection = ({ steps }) => {
  return (
    <div style={{
      maxWidth: '1200px',
      margin: '60px auto',
      padding: '0 20px'
    }}>
      <h2 style={{
        fontSize: '2rem',
        fontWeight: 800,
        marginBottom: 8,
        textAlign: 'center',
        color: '#1f2937'
      }}>
        🎯 How It Works
      </h2>

      <p style={{
        textAlign: 'center',
        color: '#6b7280',
        marginBottom: 40,
        fontSize: '1.05rem'
      }}>
        Just {steps.length} simple steps to get started
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 30
      }}>
        {steps.map((step, idx) => (
          <div key={idx} style={{ textAlign: 'center' }}>
            <div style={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.8rem',
              fontWeight: 800,
              margin: '0 auto 16px'
            }}>
              {idx + 1}
            </div>

            <h3 style={{
              fontSize: '1.1rem',
              fontWeight: 700,
              margin: '0 0 8px 0',
              color: '#1f2937'
            }}>
              {step.title}
            </h3>

            <p style={{
              color: '#6b7280',
              margin: 0,
              fontSize: '0.95rem'
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
// BENEFITS SECTION - List key advantages
// ============================================================================
export const BenefitsSection = ({ benefits }) => {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '60px 20px',
      margin: '40px 0'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <h2 style={{
          fontSize: '2rem',
          fontWeight: 800,
          marginBottom: 40,
          textAlign: 'center'
        }}>
          ✨ Why Choose AmAha
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: 30
        }}>
          {benefits.map((benefit, idx) => (
            <div key={idx} style={{
              padding: 20,
              background: 'rgba(255,255,255,0.1)',
              borderRadius: 12,
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{
                fontSize: '2.5rem',
                marginBottom: 12
              }}>
                {benefit.icon}
              </div>

              <h3 style={{
                fontSize: '1.2rem',
                fontWeight: 700,
                margin: '0 0 8px 0'
              }}>
                {benefit.title}
              </h3>

              <p style={{
                margin: 0,
                opacity: 0.9,
                lineHeight: 1.5
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
// CTA SECTION - Call to action banner
// ============================================================================
export const CTASection = ({ title, subtitle, primaryCta, secondaryCta }) => {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '60px 20px',
      textAlign: 'center',
      borderRadius: '24px',
      margin: '60px 20px',
      maxWidth: '1200px',
      marginLeft: 'auto',
      marginRight: 'auto'
    }}>
      <h2 style={{
        fontSize: '2rem',
        fontWeight: 800,
        marginBottom: 12
      }}>
        {title}
      </h2>

      <p style={{
        fontSize: '1.1rem',
        marginBottom: 30,
        opacity: 0.95
      }}>
        {subtitle}
      </p>

      <div style={{
        display: 'flex',
        gap: 16,
        justifyContent: 'center',
        flexWrap: 'wrap'
      }}>
        {primaryCta && (
          <button style={{
            padding: '14px 32px',
            fontSize: '1.1rem',
            fontWeight: 700,
            background: 'white',
            color: '#667eea',
            border: 'none',
            borderRadius: 12,
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }} onClick={primaryCta.onClick}>
            {primaryCta.label}
          </button>
        )}

        {secondaryCta && (
          <button style={{
            padding: '14px 32px',
            fontSize: '1.1rem',
            fontWeight: 700,
            background: 'rgba(255,255,255,0.2)',
            color: 'white',
            border: '2px solid white',
            borderRadius: 12,
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }} onClick={secondaryCta.onClick}>
            {secondaryCta.label}
          </button>
        )}
      </div>
    </div>
  );
};
