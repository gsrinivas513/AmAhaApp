import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthProvider';
import SiteLayout from '../layouts/SiteLayout';
import { useTheme } from '../context/ThemeContext';
import DailyChallengeCard from '../components/DailyChallenge/DailyChallengeCard';
import { getTodayChallenge, hasCompletedToday } from '../services/dailyChallengeService';
import { trackDailyChallengeSubmission } from '../utils/integratedTracking';
import { checkAndUnlockAchievements, updateUserLevel } from '../services/gamificationService';

export default function DailyChallengePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme } = useTheme();
  const [challenge, setChallenge] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadChallenge = async () => {
      try {
        setLoading(true);
        const todayChallenge = await getTodayChallenge();
        setChallenge(todayChallenge);

        if (user && todayChallenge) {
          const completed = await hasCompletedToday(user.uid);
          setIsCompleted(completed);
        }
      } catch (err) {
        console.error('Failed to load challenge:', err);
        setError("Failed to load today's challenge");
      } finally {
        setLoading(false);
      }
    };

    loadChallenge();
  }, [user]);

  const handlePlayClick = async () => {
    if (!challenge) return;

    // Track challenge start
    const startTime = Date.now();

    // Route to appropriate quiz or puzzle based on challenge type
    if (challenge.type === 'quiz') {
      navigate(
        `/quiz/${challenge.categoryName}/${challenge.topicName}/${challenge.subtopicName}/${challenge.difficulty}/${challenge.level}`
      );
    } else if (challenge.type === 'puzzle') {
      navigate(`/puzzle/${challenge.categoryName}/${challenge.topicName}/${challenge.puzzleId}`);
    }
  };

  const handleChallengeComplete = async (xpEarned, coinsEarned) => {
    // Track challenge completion
    await trackDailyChallengeSubmission({
      date: new Date().toISOString().split('T')[0],
      type: challenge.type,
      difficulty: challenge.difficulty,
      xpEarned: xpEarned || challenge.xp || 10,
      coinsEarned: coinsEarned || challenge.coins || 5,
    });

    // Check for achievements (especially streak-based ones)
    if (user?.uid) {
      await checkAndUnlockAchievements(user.uid);
      await updateUserLevel(user.uid, xpEarned || challenge.xp || 10);
    }

    // Mark as completed
    setIsCompleted(true);
  };

  if (loading) {
    return (
      <SiteLayout>
        <div style={{ background: theme.background, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ color: theme.textSecondary }}>Loading today's challenge...</p>
        </div>
      </SiteLayout>
    );
  }

  if (error) {
    return (
      <SiteLayout>
        <div style={{ background: theme.background, minHeight: '100vh', paddingTop: '40px' }}>
          <div
            style={{
              maxWidth: '800px',
              margin: '40px auto',
              padding: '20px',
              background: `${theme.accentPrimary}15`,
              border: `1px solid ${theme.accentPrimary}30`,
              color: theme.accentPrimary,
              borderRadius: '12px',
              textAlign: 'center',
            }}
          >
            {error}
          </div>
        </div>
      </SiteLayout>
    );
  }

  if (!challenge) {
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
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
            <p style={{ color: theme.textSecondary, fontSize: '16px' }}>
              No challenge available today. Check back later!
            </p>
          </div>
        </div>
      </SiteLayout>
    );
  }

  const difficultyColors = {
    easy: theme.accentTertiary,
    medium: theme.accentSecondary,
    hard: theme.accentPrimary,
  };

  const getDifficultyColor = (difficulty) => difficultyColors[difficulty?.toLowerCase()] || theme.accentPrimary;

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
            ⚡ Today's Challenge
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
            {isCompleted
              ? "✅ You've already completed today's challenge!"
              : 'Complete today\'s challenge to earn XP and coins!'}
          </p>
        </div>

        {/* Main Content */}
        <div
          style={{
            maxWidth: '900px',
            margin: '0 auto',
            padding: '0 20px 80px',
          }}
        >
          {/* Challenge Card */}
          <div
            style={{
              padding: '32px',
              background: theme.surfacePrimary,
              border: `1px solid ${theme.border}`,
              borderRadius: '16px',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              marginBottom: '32px',
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
                background: `radial-gradient(circle, ${getDifficultyColor(challenge.difficulty)}15, transparent)`,
                pointerEvents: 'none',
              }}
            />

            <div style={{ position: 'relative', zIndex: 1 }}>
              {/* Difficulty Badge */}
              <div style={{ marginBottom: '20px' }}>
                <span
                  style={{
                    display: 'inline-block',
                    padding: '8px 16px',
                    background: getDifficultyColor(challenge.difficulty),
                    color: theme.background,
                    borderRadius: '24px',
                    fontSize: '12px',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                  }}
                >
                  🎯 {challenge.difficulty || 'Medium'} Difficulty
                </span>
              </div>

              {/* Challenge Title & Description */}
              <h2
                style={{
                  fontSize: '28px',
                  fontWeight: '700',
                  color: theme.textPrimary,
                  marginBottom: '12px',
                }}
              >
                {challenge.title || `${challenge.type} Challenge`}
              </h2>
              {challenge.description && (
                <p
                  style={{
                    fontSize: '16px',
                    color: theme.textSecondary,
                    marginBottom: '24px',
                    lineHeight: '1.6',
                  }}
                >
                  {challenge.description}
                </p>
              )}

              {/* Challenge Info Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                  gap: '16px',
                  marginBottom: '28px',
                  paddingBottom: '24px',
                  borderBottom: `1px solid ${theme.border}`,
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: theme.textSecondary,
                      marginBottom: '6px',
                      fontWeight: '600',
                    }}
                  >
                    Type
                  </div>
                  <div
                    style={{
                      fontSize: '18px',
                      fontWeight: '700',
                      color: theme.textPrimary,
                    }}
                  >
                    {challenge.type === 'quiz' ? '🎯' : '🧩'} {challenge.type}
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: theme.textSecondary,
                      marginBottom: '6px',
                      fontWeight: '600',
                    }}
                  >
                    XP Reward
                  </div>
                  <div
                    style={{
                      fontSize: '18px',
                      fontWeight: '700',
                      color: theme.accentPrimary,
                    }}
                  >
                    +{challenge.xp || 10} XP
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: theme.textSecondary,
                      marginBottom: '6px',
                      fontWeight: '600',
                    }}
                  >
                    Coins
                  </div>
                  <div
                    style={{
                      fontSize: '18px',
                      fontWeight: '700',
                      color: theme.accentSecondary,
                    }}
                  >
                    +{challenge.coins || 5} 💰
                  </div>
                </div>
              </div>

              {/* Action Button */}
              {!isCompleted ? (
                <button
                  onClick={handlePlayClick}
                  style={{
                    width: '100%',
                    padding: '16px',
                    background: `linear-gradient(135deg, ${theme.accentPrimary}, ${theme.accentSecondary})`,
                    color: theme.background,
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '16px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = `0 12px 24px ${theme.accentPrimary}30`;
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  Play Challenge 🚀
                </button>
              ) : (
                <button
                  onClick={() => navigate('/')}
                  style={{
                    width: '100%',
                    padding: '16px',
                    background: theme.accentTertiary,
                    color: theme.background,
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '16px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => (e.target.style.opacity = '0.8')}
                  onMouseLeave={(e) => (e.target.style.opacity = '1')}
                >
                  Back to Home 🏠
                </button>
              )}
            </div>
          </div>

          {/* Info Cards */}
          {!isCompleted && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '20px',
              }}
            >
              {[
                { icon: '⏰', title: 'Limited Time', desc: 'New challenge every day' },
                { icon: '🎖️', title: 'Rewards', desc: 'XP and coins for completion' },
                { icon: '📈', title: 'Streak', desc: 'Build your daily streak' },
                { icon: '🏆', title: 'Leaderboard', desc: 'Compete with others' },
              ].map((item) => (
                <div
                  key={item.title}
                  style={{
                    padding: '20px',
                    background: theme.surfacePrimary,
                    border: `1px solid ${theme.border}`,
                    borderRadius: '12px',
                    textAlign: 'center',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                  }}
                >
                  <div style={{ fontSize: '32px', marginBottom: '12px' }}>{item.icon}</div>
                  <h4
                    style={{
                      fontSize: '14px',
                      fontWeight: '700',
                      color: theme.textPrimary,
                      marginBottom: '4px',
                    }}
                  >
                    {item.title}
                  </h4>
                  <p style={{ fontSize: '12px', color: theme.textSecondary }}>
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </SiteLayout>
  );
}

