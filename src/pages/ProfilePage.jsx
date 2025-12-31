import React, { useEffect, useState } from 'react';
import SiteLayout from '../layouts/SiteLayout';
import { useAuth } from '../components/AuthProvider';
import { useTheme } from '../context/ThemeContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { BADGES } from '../config/badges';

export default function ProfilePage() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    (async () => {
      const snap = await getDoc(doc(db, 'users', user.uid));
      if (snap.exists()) {
        setStats(snap.data().stats || {});
      }
      setLoading(false);
    })();
  }, [user]);

  if (loading) {
    return (
      <SiteLayout>
        <div style={{ background: theme.background, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ color: theme.textSecondary }}>Loading profile…</p>
        </div>
      </SiteLayout>
    );
  }

  if (!user) {
    return (
      <SiteLayout>
        <div style={{ background: theme.background, minHeight: '100vh', paddingTop: '40px' }}>
          <div
            style={{
              maxWidth: '800px',
              margin: '60px auto',
              padding: '40px 20px',
              textAlign: 'center',
              background: `linear-gradient(135deg, ${theme.accentPrimary}10, ${theme.accentSecondary}10)`,
              borderRadius: '16px',
              border: `1px solid ${theme.accentPrimary}30`,
            }}
          >
            <p style={{ color: theme.textSecondary, fontSize: '16px' }}>
              Please sign in to view your profile.
            </p>
          </div>
        </div>
      </SiteLayout>
    );
  }

  const xp = stats?.xp || 0;
  const level = stats?.level || 0;
  const coins = stats?.coins || 0;
  const currentStreak = stats?.currentStreak || 0;
  const bestStreak = stats?.bestStreak || 0;
  const earnedBadges = stats?.badges || [];

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
            👤 Your Profile
          </h1>
          <p
            style={{
              fontSize: '18px',
              color: theme.textSecondary,
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: '1.6',
            }}
          >
            Track your progress and celebrate your achievements
          </p>
        </div>

        {/* Main Container */}
        <div
          style={{
            maxWidth: '1000px',
            margin: '0 auto',
            padding: '0 20px 80px',
          }}
        >
          {/* User Info Card */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '24px',
              marginBottom: '40px',
              padding: '32px',
              background: theme.surfacePrimary,
              border: `1px solid ${theme.border}`,
              borderRadius: '16px',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Decorative Background */}
            <div
              style={{
                position: 'absolute',
                top: '-50%',
                right: '-50%',
                width: '300px',
                height: '300px',
                background: `radial-gradient(circle, ${theme.accentPrimary}15, transparent)`,
                pointerEvents: 'none',
              }}
            />

            <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '24px', width: '100%' }}>
              <img
                src={user.photoURL}
                alt='avatar'
                style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  border: `4px solid ${theme.accentPrimary}`,
                  objectFit: 'cover',
                  flexShrink: 0,
                }}
              />
              <div>
                <h2
                  style={{
                    fontSize: '28px',
                    fontWeight: '700',
                    color: theme.textPrimary,
                    marginBottom: '8px',
                  }}
                >
                  {user.displayName || user.email}
                </h2>
                <div
                  style={{
                    fontSize: '18px',
                    color: theme.accentPrimary,
                    fontWeight: '600',
                    marginBottom: '4px',
                  }}
                >
                  ⭐ Level {level}
                </div>
                <p
                  style={{
                    fontSize: '14px',
                    color: theme.textSecondary,
                  }}
                >
                  {user.email}
                </p>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '20px',
              marginBottom: '40px',
            }}
          >
            {[
              { icon: '⚡', label: 'Total XP', value: xp.toLocaleString() },
              { icon: '🪙', label: 'Coins', value: coins.toLocaleString() },
              { icon: '🔥', label: 'Current Streak', value: currentStreak },
              { icon: '🏆', label: 'Best Streak', value: bestStreak },
            ].map((stat) => (
              <div
                key={stat.label}
                style={{
                  padding: '24px',
                  background: theme.surfacePrimary,
                  border: `1px solid ${theme.border}`,
                  borderRadius: '12px',
                  textAlign: 'center',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                }}
              >
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>{stat.icon}</div>
                <div
                  style={{
                    fontSize: '24px',
                    fontWeight: '700',
                    color: theme.accentPrimary,
                    marginBottom: '6px',
                  }}
                >
                  {stat.value}
                </div>
                <div
                  style={{
                    fontSize: '12px',
                    color: theme.textSecondary,
                    fontWeight: '600',
                    textTransform: 'uppercase',
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Badges Section */}
          <div>
            <h3
              style={{
                fontSize: '24px',
                fontWeight: '700',
                color: theme.textPrimary,
                marginBottom: '24px',
              }}
            >
              🏅 Your Badges
            </h3>

            {earnedBadges.length === 0 ? (
              <div
                style={{
                  padding: '40px 20px',
                  textAlign: 'center',
                  background: `linear-gradient(135deg, ${theme.accentPrimary}10, ${theme.accentSecondary}10)`,
                  borderRadius: '16px',
                  border: `1px solid ${theme.accentPrimary}30`,
                }}
              >
                <p style={{ color: theme.textSecondary, fontSize: '16px' }}>
                  No badges yet — keep playing to earn them! 🚀
                </p>
              </div>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                  gap: '16px',
                }}
              >
                {earnedBadges.map((id) => {
                  const badge = Object.values(BADGES).find((b) => b.id === id);
                  if (!badge) return null;

                  return (
                    <div
                      key={id}
                      style={{
                        padding: '20px',
                        background: `linear-gradient(135deg, ${theme.accentPrimary}, ${theme.accentSecondary})`,
                        color: theme.background,
                        borderRadius: '12px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-6px)';
                        e.currentTarget.style.boxShadow = `0 16px 32px ${theme.accentPrimary}30`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <div style={{ fontSize: '40px', marginBottom: '12px' }}>
                        {badge.icon}
                      </div>
                      <div
                        style={{
                          fontWeight: '700',
                          fontSize: '13px',
                          lineHeight: '1.4',
                        }}
                      >
                        {badge.label}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}

