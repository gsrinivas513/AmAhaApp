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
      padding: '80px 20px',
      textAlign: 'center',
      borderRadius: '0 0 24px 24px'
    }}>
      <h1 style={{
        fontSize: '3.5rem',
        fontWeight: 800,
        marginBottom: 16,
        textShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        {title}
      </h1>
      
      <p style={{
        fontSize: '1.3rem',
        marginBottom: 32,
        opacity: 0.95,
        maxWidth: '600px',
        margin: '0 auto 32px'
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
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
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

      {children}
    </div>
  );
};

// ============================================================================
// CATEGORY GRID - Display categories as clickable cards
// ============================================================================
export const CategoryGrid = ({ categories, onCategoryClick }) => {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
      gap: 12,
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '40px 20px'
    }}>
      {categories.map((category) => (
        <div
          key={category.id}
          onClick={() => onCategoryClick(category)}
          style={{
            padding: 16,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderRadius: 12,
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            transform: 'translateY(0)',
            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.2)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(102, 126, 234, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.2)';
          }}
        >
          <div style={{ fontSize: '2rem', marginBottom: 8 }}>
            {category.icon || '🎮'}
          </div>
          <p style={{
            fontSize: '0.9rem',
            fontWeight: 700,
            margin: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            {category.name}
          </p>
          <p style={{
            fontSize: '0.75rem',
            opacity: 0.85,
            margin: '6px 0 0 0'
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
      background: '#f8fafc',
      padding: '60px 20px',
      margin: '40px 0'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 30,
        textAlign: 'center'
      }}>
        {stats.map((stat, idx) => (
          <div key={idx}>
            <div style={{
              fontSize: '2.8rem',
              fontWeight: 800,
              color: '#667eea',
              marginBottom: 8
            }}>
              {stat.value}
            </div>
            <p style={{
              fontSize: '1.1rem',
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
  );
};

// ============================================================================
// FEATURED SECTION - Show featured/popular items
// ============================================================================
export const FeaturedSection = ({ title, items, onItemClick }) => {
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
        color: '#1f2937'
      }}>
        ⭐ {title}
      </h2>
      
      <p style={{
        color: '#6b7280',
        marginBottom: 30,
        fontSize: '1.05rem'
      }}>
        Handpicked puzzles loved by our community
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: 20
      }}>
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => onItemClick(item)}
            style={{
              borderRadius: 12,
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              background: 'white'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
            }}
          >
            <div style={{
              width: '100%',
              height: '180px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '3rem'
            }}>
              {item.image || item.icon || '🎮'}
            </div>
            
            <div style={{ padding: 16 }}>
              <h3 style={{
                fontSize: '1rem',
                fontWeight: 700,
                margin: '0 0 6px 0',
                color: '#1f2937'
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

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '0.85rem',
                color: '#9ca3af'
              }}>
                <span>⭐ {item.rating || 4.5}</span>
                <span>{item.plays || 0} plays</span>
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
