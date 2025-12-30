import React from 'react';
import { useTheme } from '../theme/ThemeProvider';

export const ThemeSwitcher = () => {
  const { mode: currentTheme, setMode: setTheme } = useTheme();

  const themes = [
    { id: 'playful', name: '🎨 Playful' },
    { id: 'calm', name: '🧘 Calm' },
    { id: 'competitive', name: '⚡ Competitive' }
  ];

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      background: 'rgba(0,0,0,0.05)',
      padding: '4px 8px',
      borderRadius: 20,
      cursor: 'pointer'
    }}>
      <div style={{
        display: 'flex',
        gap: 0
      }}>
        {themes.map(theme => (
          <button
            key={theme.id}
            onClick={() => setTheme(theme.id)}
            style={{
              padding: '6px 12px',
              fontSize: '0.85rem',
              fontWeight: 600,
              background: currentTheme === theme.id ? '#667eea' : 'transparent',
              color: currentTheme === theme.id ? 'white' : '#666',
              border: 'none',
              borderRadius: 16,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              whiteSpace: 'nowrap'
            }}
            title={`Switch to ${theme.name}`}
          >
            {theme.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ThemeSwitcher;
