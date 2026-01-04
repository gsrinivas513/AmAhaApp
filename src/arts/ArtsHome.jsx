import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const ArtsHome = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const modes = [
    {
      id: 'draw',
      icon: '✏️',
      title: 'Freehand Drawing',
      description: 'Express yourself with pencil, pen & brush tools. Create unlimited sketches and drawings.',
      color: '#FF85A2',
      accentColor: 'rgba(255, 133, 162, 0.1)',
      path: '/arts/draw',
      features: ['Pencil', 'Brush', 'Eraser', 'Colors']
    },
    {
      id: 'paint',
      icon: '🎨',
      title: 'Digital Painting',
      description: 'Paint with rich colors, gradients & textures. Professional painting tools at your fingertips.',
      color: '#FFB366',
      accentColor: 'rgba(255, 179, 102, 0.1)',
      path: '/arts/paint',
      features: ['Color Palette', 'Fill Tool', 'Textures', 'Undo/Redo']
    },
    {
      id: 'guided',
      icon: '📚',
      title: 'Learn to Draw',
      description: 'Step-by-step drawing lessons from beginner to advanced. Learn techniques & styles.',
      color: '#A78BFA',
      accentColor: 'rgba(167, 139, 250, 0.1)',
      path: '/arts/guided',
      features: ['Lessons', 'Tutorials', 'Progress', 'Certificates']
    },
    {
      id: 'gallery',
      icon: '🖼️',
      title: 'My Gallery',
      description: 'Showcase your artwork. Organize, edit & share your creative masterpieces.',
      color: '#81C995',
      accentColor: 'rgba(129, 201, 149, 0.1)',
      path: '/arts/gallery',
      features: ['Collections', 'Favorites', 'Share', 'Analytics']
    },
  ];

  return (
    <div style={{
      background: theme.background,
      paddingTop: '40px',
      paddingBottom: '40px',
    }}>
      {/* Header Section */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        paddingX: '20px',
        marginBottom: '60px',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <div style={{
            fontSize: '64px',
            marginBottom: '20px',
            animation: 'float 3s ease-in-out infinite',
          }}>
            🎨
          </div>
          <h1 style={{
            color: theme.textPrimary,
            fontSize: '48px',
            fontWeight: '800',
            margin: '0 0 12px 0',
            background: `linear-gradient(135deg, ${theme.accentPrimary}, ${theme.accentSecondary})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Arts Studio
          </h1>
          <p style={{
            color: theme.textSecondary,
            fontSize: '18px',
            margin: '0',
            maxWidth: '600px',
            marginLeft: 'auto',
            marginRight: 'auto',
            lineHeight: '1.6',
          }}>
            Unleash your creativity with our comprehensive drawing, painting & design tools
          </p>
        </div>

        {/* Mode Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '28px',
          maxWidth: '1200px',
          margin: '0 auto',
        }}>
          {modes.map(mode => (
            <button
              key={mode.id}
              onClick={() => navigate(mode.path)}
              style={{
                padding: '0',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                textAlign: 'left',
                transform: 'translateY(0)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-12px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{
                background: theme.surfacePrimary,
                borderRadius: '16px',
                padding: '32px 28px',
                border: `2px solid ${theme.border}`,
                boxShadow: `0 4px 16px rgba(0, 0, 0, 0.08)`,
                transition: 'all 0.3s ease',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = mode.color;
                e.currentTarget.style.boxShadow = `0 12px 28px ${mode.accentColor}`;
                e.currentTarget.style.background = mode.accentColor;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = theme.border;
                e.currentTarget.style.boxShadow = `0 4px 16px rgba(0, 0, 0, 0.08)`;
                e.currentTarget.style.background = theme.surfacePrimary;
              }}
              >
                {/* Icon */}
                <div style={{
                  fontSize: '52px',
                  marginBottom: '20px',
                  width: '70px',
                  height: '70px',
                  background: mode.accentColor,
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: `2px solid ${mode.color}`,
                }}>
                  {mode.icon}
                </div>

                {/* Title */}
                <h3 style={{
                  color: theme.textPrimary,
                  fontSize: '22px',
                  fontWeight: '700',
                  margin: '0 0 12px 0',
                }}>
                  {mode.title}
                </h3>

                {/* Description */}
                <p style={{
                  color: theme.textSecondary,
                  fontSize: '14px',
                  margin: '0 0 20px 0',
                  lineHeight: '1.6',
                  flex: 1,
                }}>
                  {mode.description}
                </p>

                {/* Features */}
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px',
                  marginBottom: '16px',
                }}>
                  {mode.features.map((feature, idx) => (
                    <span
                      key={idx}
                      style={{
                        fontSize: '11px',
                        fontWeight: '600',
                        color: mode.color,
                        background: mode.accentColor,
                        padding: '4px 12px',
                        borderRadius: '6px',
                        border: `1px solid ${mode.color}33`,
                      }}
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                {/* CTA Button */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: mode.color,
                  fontSize: '14px',
                  fontWeight: '600',
                }}>
                  Open <span style={{ fontSize: '16px' }}>→</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Info Section */}
      <div style={{
        maxWidth: '1200px',
        margin: '80px auto 0',
        padding: '0 20px',
        textAlign: 'center',
        color: theme.textSecondary,
      }}>
        <p style={{
          fontSize: '14px',
          margin: '0',
        }}>
          💡 Tip: Save your work regularly and explore all tools to master your skills!
        </p>
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

export default ArtsHome;
