/**
 * FOOTER COMPONENT - Enhanced with Theme Support & Social Links
 * Matching PuzzleFree design with multi-column layout
 */

import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  const navLinks = [
    { label: 'Browse', path: '/explore' },
    { label: 'Daily Challenge', path: '/daily-challenge' },
    { label: 'Popular', path: '/categories' },
    { label: 'Categories', path: '/categories' },
    { label: 'Collections', path: '/collections' },
    { label: 'Leaderboards', path: '/leaderboards' },
  ];

  const companyLinks = [
    { label: 'About', path: '/about' },
    { label: 'Blog', external: 'https://blog.amaha.com' },
    { label: 'Careers', external: 'https://careers.amaha.com' },
    { label: 'Press', external: 'https://press.amaha.com' },
    { label: 'Reviews', external: 'https://reviews.amaha.com' },
    { label: 'Team', path: '/team' },
  ];

  const supportLinks = [
    { label: 'Help Center', external: 'https://help.amaha.com' },
    { label: 'FAQ', path: '/faq' },
    { label: 'Contact Us', path: '/contact' },
    { label: 'Report Issue', path: '/report-issue' },
    { label: 'Community', external: 'https://community.amaha.com' },
  ];

  const legalLinks = [
    { label: 'Privacy Policy', path: '/privacy' },
    { label: 'Terms of Service', path: '/terms' },
    { label: 'Cookie Policy', path: '/cookies' },
    { label: 'GDPR', path: '/gdpr' },
  ];

  const socialLinks = [
    { icon: '𝕏', label: 'Twitter', url: 'https://twitter.com/amaha' },
    { icon: '📸', label: 'Instagram', url: 'https://instagram.com/amaha' },
    { icon: '▶️', label: 'YouTube', url: 'https://youtube.com/@amaha' },
    { icon: '📱', label: 'TikTok', url: 'https://tiktok.com/@amaha' },
    { icon: 'f', label: 'Facebook', url: 'https://facebook.com/amaha' },
  ];

  const handleNavigate = (path) => {
    navigate(path);
    window.scrollTo(0, 0);
  };

  const handleExternalLink = (url) => {
    window.open(url, '_blank');
  };

  const FooterColumn = ({ title, links }) => (
    <div>
      <h4
        style={{
          fontSize: '13px',
          fontWeight: '700',
          color: theme.textPrimary,
          marginBottom: '16px',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
        }}
      >
        {title}
      </h4>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {links.map((item) => (
          <li key={item.label} style={{ marginBottom: '10px' }}>
            <button
              onClick={() => {
                if (item.path) {
                  handleNavigate(item.path);
                } else if (item.external) {
                  handleExternalLink(item.external);
                }
              }}
              style={{
                background: 'none',
                border: 'none',
                color: theme.textSecondary,
                textDecoration: 'none',
                fontSize: '13px',
                transition: 'color 0.2s ease',
                cursor: 'pointer',
                padding: 0,
                fontFamily: 'inherit',
                textAlign: 'left',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = theme.accentPrimary)}
              onMouseLeave={(e) => (e.currentTarget.style.color = theme.textSecondary)}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <footer
      style={{
        background: theme.surfacePrimary,
        borderTop: `1px solid ${theme.border}`,
        padding: '60px 20px 40px 20px',
        color: theme.textSecondary,
        marginTop: '0',
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Footer Navigation Grid - 4 Columns */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '40px',
            marginBottom: '60px',
          }}
        >
          <FooterColumn title="Navigation" links={navLinks} />
          <FooterColumn title="Company" links={companyLinks} />
          <FooterColumn title="Support" links={supportLinks} />
          <FooterColumn title="Legal" links={legalLinks} />
        </div>

        {/* Social Links */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '16px',
            marginBottom: '40px',
            flexWrap: 'wrap',
          }}
        >
          {socialLinks.map((social) => (
            <button
              key={social.label}
              onClick={() => handleExternalLink(social.url)}
              title={social.label}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: theme.background,
                border: `1px solid ${theme.border}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: theme.textSecondary,
                textDecoration: 'none',
                fontSize: '18px',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
                padding: 0,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = theme.accentPrimary;
                e.currentTarget.style.color = '#ffffff';
                e.currentTarget.style.borderColor = theme.accentPrimary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = theme.background;
                e.currentTarget.style.color = theme.textSecondary;
                e.currentTarget.style.borderColor = theme.border;
              }}
            >
              {social.icon}
            </button>
          ))}
        </div>

        {/* Divider */}
        <div style={{ borderTop: `1px solid ${theme.border}`, paddingTop: '40px' }}>
          {/* Copyright */}
          <p
            style={{
              fontSize: '13px',
              color: theme.textTertiary,
              textAlign: 'center',
              margin: '0 0 20px 0',
            }}
          >
            © {currentYear} AmAha. Made with <span style={{ color: theme.accentPrimary }}>♥</span> for learning enthusiasts. All rights reserved.
          </p>

          {/* Bottom Links */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '20px',
              flexWrap: 'wrap',
            }}
          >
            <button
              onClick={() => handleNavigate('/privacy')}
              style={{
                fontSize: '12px',
                color: theme.textTertiary,
                textDecoration: 'none',
                transition: 'color 0.2s ease',
                cursor: 'pointer',
                background: 'none',
                border: 'none',
                padding: 0,
                fontFamily: 'inherit',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = theme.accentPrimary)}
              onMouseLeave={(e) => (e.currentTarget.style.color = theme.textTertiary)}
            >
              Privacy
            </button>
            <button
              onClick={() => handleNavigate('/terms')}
              style={{
                fontSize: '12px',
                color: theme.textTertiary,
                textDecoration: 'none',
                transition: 'color 0.2s ease',
                cursor: 'pointer',
                background: 'none',
                border: 'none',
                padding: 0,
                fontFamily: 'inherit',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = theme.accentPrimary)}
              onMouseLeave={(e) => (e.currentTarget.style.color = theme.textTertiary)}
            >
              Terms
            </button>
            <button
              onClick={() => handleNavigate('/cookies')}
              style={{
                fontSize: '12px',
                color: theme.textTertiary,
                textDecoration: 'none',
                transition: 'color 0.2s ease',
                cursor: 'pointer',
                background: 'none',
                border: 'none',
                padding: 0,
                fontFamily: 'inherit',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = theme.accentPrimary)}
              onMouseLeave={(e) => (e.currentTarget.style.color = theme.textTertiary)}
            >
              Cookies
            </button>
            <button
              onClick={() => handleNavigate('/gdpr')}
              style={{
                fontSize: '12px',
                color: theme.textTertiary,
                textDecoration: 'none',
                transition: 'color 0.2s ease',
                cursor: 'pointer',
                background: 'none',
                border: 'none',
                padding: 0,
                fontFamily: 'inherit',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = theme.accentPrimary)}
              onMouseLeave={(e) => (e.currentTarget.style.color = theme.textTertiary)}
            >
              Legal
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
