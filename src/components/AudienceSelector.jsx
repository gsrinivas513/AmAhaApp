import React from 'react';
import { useTheme } from '../context/ThemeContext';

// Shared audience options used across all components
export const AUDIENCES = [
  { value: 'all', label: '👥 All Users', emoji: '👥' },
  { value: 'kids', label: '👶 Kids (5-12)', emoji: '👶' },
  { value: 'students', label: '📚 Students (13-18)', emoji: '📚' },
  { value: 'professionals', label: '💼 Professionals', emoji: '💼' },
  { value: 'programmers', label: '💻 Programmers', emoji: '💻' },
];

/**
 * Reusable Audience Selector Component
 * Used in: AdminQuizBuilder, ModernAdminDashboard, QuizzesPage
 * 
 * @param {string} value - Currently selected audience value
 * @param {function} onChange - Callback when audience changes
 * @param {string} label - Label for the selector (optional)
 * @param {boolean} isRequired - Show required asterisk (optional)
 * @param {boolean} inline - Display buttons inline (default) or as dropdown (optional)
 */
export default function AudienceSelector({ 
  value = 'all', 
  onChange, 
  label = 'Audience',
  isRequired = false,
  inline = true 
}) {
  const { theme } = useTheme();

  if (inline) {
    // Inline button style (for filters/selections)
    return (
      <div>
        {label && (
          <h3 style={{
            color: theme.textPrimary,
            fontSize: '16px',
            fontWeight: '600',
            marginBottom: '12px',
            margin: 0,
          }}>
            👥 {label} {isRequired && <span style={{ color: '#FF6B6B' }}>*</span>}
          </h3>
        )}
        <div style={{
          display: 'flex',
          gap: '10px',
          flexWrap: 'wrap',
        }}>
          {AUDIENCES.map(aud => (
            <button
              key={aud.value}
              onClick={() => onChange && onChange(aud.value)}
              style={{
                padding: '10px 18px',
                background: value === aud.value 
                  ? `linear-gradient(135deg, ${theme.accentPrimary}, ${theme.accentSecondary})` 
                  : theme.surfaceSecondary,
                color: value === aud.value ? '#fff' : theme.textPrimary,
                border: `2px solid ${value === aud.value ? 'transparent' : theme.border}`,
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseOver={(e) => {
                if (value !== aud.value) {
                  e.target.style.borderColor = theme.accentPrimary;
                  e.target.style.background = `${theme.accentPrimary}15`;
                }
              }}
              onMouseOut={(e) => {
                if (value !== aud.value) {
                  e.target.style.borderColor = theme.border;
                  e.target.style.background = theme.surfaceSecondary;
                }
              }}
            >
              {aud.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Dropdown style (for form fields)
  return (
    <div style={{ marginBottom: '16px' }}>
      <label style={{
        display: 'block',
        color: theme.textPrimary,
        fontSize: '14px',
        fontWeight: '600',
        marginBottom: '8px',
      }}>
        👥 {label} {isRequired && <span style={{ color: '#FF6B6B' }}>*</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        style={{
          width: '100%',
          padding: '12px 14px',
          background: theme.surfaceSecondary,
          color: theme.textPrimary,
          border: `2px solid ${theme.border}`,
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '500',
          cursor: 'pointer',
          transition: 'border-color 0.2s ease',
        }}
        onFocus={(e) => {
          e.target.style.borderColor = theme.accentPrimary;
        }}
        onBlur={(e) => {
          e.target.style.borderColor = theme.border;
        }}
      >
        {AUDIENCES.map(aud => (
          <option key={aud.value} value={aud.value}>
            {aud.label}
          </option>
        ))}
      </select>
    </div>
  );
}
