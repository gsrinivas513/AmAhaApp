import React, { useState } from 'react';
import SiteLayout from '../layouts/SiteLayout';
import { useTheme } from '../context/ThemeContext';

function CreatePage() {
  const { theme } = useTheme();
  const [selectedType, setSelectedType] = useState('puzzle');

  const creationOptions = [
    {
      id: 'puzzle',
      title: 'Create a Puzzle',
      description: 'Design your own riddles, logic puzzles, or visual challenges',
      icon: '🧩',
      color: theme.accentPrimary,
    },
    {
      id: 'quiz',
      title: 'Create a Quiz',
      description: 'Build educational quizzes with multiple choice questions',
      icon: '📝',
      color: theme.accentSecondary,
    },
    {
      id: 'story',
      title: 'Create a Story',
      description: 'Author educational stories with interactive elements',
      icon: '📖',
      color: theme.accentTertiary,
    },
    {
      id: 'collection',
      title: 'Create a Collection',
      description: 'Organize puzzles, quizzes, and stories into themed collections',
      icon: '📚',
      color: theme.accentAccent,
    },
  ];

  const steps = [
    { num: 1, title: 'Choose Type', desc: 'Select what you want to create' },
    { num: 2, title: 'Add Content', desc: 'Fill in details and content' },
    { num: 3, title: 'Customize', desc: 'Add images, tags, and difficulty' },
    { num: 4, title: 'Publish', desc: 'Share with the community' },
  ];

  return (
    <SiteLayout>
      <div style={{ background: theme.background, minHeight: '100vh', paddingTop: '40px' }}>
        {/* Hero Section */}
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '40px 20px',
            textAlign: 'center',
          }}
        >
          <h1
            style={{
              fontSize: 'clamp(28px, 5vw, 48px)',
              fontWeight: '800',
              color: theme.textPrimary,
              marginBottom: '16px',
            }}
          >
            ✨ Create & Contribute
          </h1>
          <p
            style={{
              fontSize: '18px',
              color: theme.textSecondary,
              maxWidth: '600px',
              margin: '0 auto 40px',
              lineHeight: '1.6',
            }}
          >
            Share your knowledge with our community. Create engaging puzzles, quizzes, stories, and collections to help others learn and grow.
          </p>
        </div>

        {/* Creation Types Grid */}
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 20px 80px',
          }}
        >
          <h2
            style={{
              fontSize: '24px',
              fontWeight: '700',
              color: theme.textPrimary,
              marginBottom: '32px',
              textAlign: 'center',
            }}
          >
            What would you like to create?
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '24px',
              marginBottom: '80px',
            }}
          >
            {creationOptions.map((option) => (
              <div
                key={option.id}
                onClick={() => setSelectedType(option.id)}
                style={{
                  padding: '32px 24px',
                  background: selectedType === option.id ? theme.surfaceSecondary : theme.surfacePrimary,
                  border: `2px solid ${selectedType === option.id ? option.color : theme.border}`,
                  borderRadius: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = `0 12px 24px ${option.color}20`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* Decorative Background */}
                <div
                  style={{
                    position: 'absolute',
                    top: '-50%',
                    right: '-50%',
                    width: '200px',
                    height: '200px',
                    background: `radial-gradient(circle, ${option.color}15, transparent)`,
                    pointerEvents: 'none',
                  }}
                />

                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div
                    style={{
                      fontSize: '48px',
                      marginBottom: '16px',
                    }}
                  >
                    {option.icon}
                  </div>
                  <h3
                    style={{
                      fontSize: '20px',
                      fontWeight: '700',
                      color: theme.textPrimary,
                      marginBottom: '12px',
                    }}
                  >
                    {option.title}
                  </h3>
                  <p
                    style={{
                      fontSize: '14px',
                      color: theme.textSecondary,
                      lineHeight: '1.6',
                      marginBottom: '20px',
                    }}
                  >
                    {option.description}
                  </p>
                  <button
                    style={{
                      padding: '10px 24px',
                      background: option.color,
                      color: theme.background,
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'opacity 0.2s',
                    }}
                    onMouseEnter={(e) => (e.target.style.opacity = '0.8')}
                    onMouseLeave={(e) => (e.target.style.opacity = '1')}
                  >
                    Get Started →
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* How It Works */}
          <div
            style={{
              maxWidth: '900px',
              margin: '0 auto 80px',
              padding: '40px',
              background: theme.surfacePrimary,
              borderRadius: '16px',
              border: `1px solid ${theme.border}`,
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
            }}
          >
            <h2
              style={{
                fontSize: '24px',
                fontWeight: '700',
                color: theme.textPrimary,
                marginBottom: '32px',
                textAlign: 'center',
              }}
            >
              How It Works
            </h2>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '32px',
              }}
            >
              {steps.map((step, idx) => (
                <div key={step.num} style={{ textAlign: 'center', position: 'relative' }}>
                  {/* Step Number Circle */}
                  <div
                    style={{
                      width: '60px',
                      height: '60px',
                      background: `linear-gradient(135deg, ${theme.accentPrimary}, ${theme.accentSecondary})`,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '28px',
                      fontWeight: '700',
                      color: theme.background,
                      margin: '0 auto 16px',
                    }}
                  >
                    {step.num}
                  </div>

                  <h3
                    style={{
                      fontSize: '16px',
                      fontWeight: '700',
                      color: theme.textPrimary,
                      marginBottom: '8px',
                    }}
                  >
                    {step.title}
                  </h3>
                  <p
                    style={{
                      fontSize: '14px',
                      color: theme.textSecondary,
                    }}
                  >
                    {step.desc}
                  </p>

                  {/* Arrow Connector (except last) */}
                  {idx < steps.length - 1 && (
                    <div
                      style={{
                        position: 'absolute',
                        right: '-32px',
                        top: '30px',
                        fontSize: '24px',
                        color: theme.accentPrimary,
                        opacity: 0.5,
                      }}
                      className="hidden md:block"
                    >
                      →
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Features Box */}
          <div
            style={{
              maxWidth: '900px',
              margin: '0 auto',
              padding: '40px',
              background: `linear-gradient(135deg, ${theme.accentPrimary}10, ${theme.accentSecondary}10)`,
              borderRadius: '16px',
              border: `1px solid ${theme.accentPrimary}30`,
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
            }}
          >
            <h3
              style={{
                fontSize: '20px',
                fontWeight: '700',
                color: theme.textPrimary,
                marginBottom: '24px',
                textAlign: 'center',
              }}
            >
              Creator Features
            </h3>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '24px',
              }}
            >
              {[
                { icon: '🎨', title: 'Rich Editor', desc: 'Format text with images and media' },
                { icon: '🏷️', title: 'Auto Categorization', desc: 'Smart category suggestions' },
                { icon: '⭐', title: 'Difficulty Levels', desc: 'Set challenge difficulty' },
                { icon: '📊', title: 'Analytics', desc: 'Track content performance' },
                { icon: '🔄', title: 'Versioning', desc: 'Edit and improve content' },
                { icon: '🌐', title: 'Community', desc: 'Get feedback and ratings' },
              ].map((feature) => (
                <div key={feature.title}>
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>{feature.icon}</div>
                  <h4
                    style={{
                      fontSize: '14px',
                      fontWeight: '700',
                      color: theme.textPrimary,
                      marginBottom: '4px',
                    }}
                  >
                    {feature.title}
                  </h4>
                  <p
                    style={{
                      fontSize: '13px',
                      color: theme.textSecondary,
                    }}
                  >
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}

export default CreatePage;
