/**
 * FOOTER COMPONENT - Enhanced with Theme Support & Social Links
 * Matching PuzzleFree design with multi-column layout
 */

import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const Footer = () => {
  const { theme } = useTheme();
  const currentYear = new Date().getFullYear();

  const navLinks = ['Browse', 'Daily Challenge', 'Popular', 'Categories', 'Collections', 'Leaderboards'];
  const companyLinks = ['About', 'Blog', 'Careers', 'Press', 'Reviews', 'Team'];
  const supportLinks = ['Help Center', 'FAQ', 'Contact Us', 'Report Issue', 'Community'];
  const legalLinks = ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'GDPR'];
  const socialLinks = [
    { icon: '𝕏', label: 'Twitter', url: '#' },
    { icon: '📸', label: 'Instagram', url: '#' },
    { icon: '▶️', label: 'YouTube', url: '#' },
    { icon: '📱', label: 'TikTok', url: '#' },
    { icon: 'f', label: 'Facebook', url: '#' },
  ];

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
          <li key={item} style={{ marginBottom: '10px' }}>
            <a
              href="#"
              style={{
                color: theme.textSecondary,
                textDecoration: 'none',
                fontSize: '13px',
                transition: 'color 0.2s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => (e.target.style.color = theme.accentPrimary)}
              onMouseLeave={(e) => (e.target.style.color = theme.textSecondary)}
            >
              {item}
            </a>
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
        padding: '60px 20px',
        color: theme.textSecondary,
        marginTop: '80px',
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
            <a
              key={social.label}
              href={social.url}
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
              }}
              onMouseEnter={(e) => {
                e.target.style.background = theme.accentPrimary;
                e.target.style.color = '#ffffff';
                e.target.style.borderColor = theme.accentPrimary;
              }}
              onMouseLeave={(e) => {
                e.target.style.background = theme.background;
                e.target.style.color = theme.textSecondary;
                e.target.style.borderColor = theme.border;
              }}
            >
              {social.icon}
            </a>
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
            {['Privacy', 'Terms', 'Cookies', 'Legal'].map((item) => (
              <a
                key={item}
                href="#"
                style={{
                  fontSize: '12px',
                  color: theme.textTertiary,
                  textDecoration: 'none',
                  transition: 'color 0.2s ease',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => (e.target.style.color = theme.accentPrimary)}
                onMouseLeave={(e) => (e.target.style.color = theme.textTertiary)}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
