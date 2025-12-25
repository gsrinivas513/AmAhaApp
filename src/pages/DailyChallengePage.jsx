import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthProvider";
import SiteLayout from "../layouts/SiteLayout";
import DailyChallengeCard from "../components/DailyChallenge/DailyChallengeCard";
import { getTodayChallenge, hasCompletedToday } from "../services/dailyChallengeService";
import { trackDailyChallengeSubmission } from "../utils/integratedTracking";
import { checkAndUnlockAchievements, updateUserLevel } from "../services/gamificationService";
import "../styles/DailyChallengePage.css";

export default function DailyChallengePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
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
        console.error("Failed to load challenge:", err);
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
    if (challenge.type === "quiz") {
      navigate(`/quiz/${challenge.categoryName}/${challenge.topicName}/${challenge.subtopicName}/${challenge.difficulty}/${challenge.level}`);
      
      // Note: We'll track completion when quiz finishes, not here
    } else if (challenge.type === "puzzle") {
      navigate(`/puzzle/${challenge.categoryName}/${challenge.topicName}/${challenge.puzzleId}`);
      
      // Note: We'll track completion when puzzle finishes, not here
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
        <div className="daily-challenge-page">
          <div className="loading-spinner">Loading today's challenge...</div>
        </div>
      </SiteLayout>
    );
  }

  if (error) {
    return (
      <SiteLayout>
        <div className="daily-challenge-page">
          <div className="error-message">{error}</div>
        </div>
      </SiteLayout>
    );
  }

  if (!challenge) {
    return (
      <SiteLayout>
        <div className="daily-challenge-page">
          <div className="no-challenge-message">
            <p>No challenge available today. Check back later!</p>
          </div>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <div className="daily-challenge-page">
        <div className="challenge-container">
          <h1>Today's Challenge</h1>
          
          <DailyChallengeCard
            challenge={challenge}
            isCompleted={isCompleted}
            onPlayClick={handlePlayClick}
          />

          {isCompleted && (
            <div className="completed-message">
              <p>✅ You've already completed today's challenge!</p>
              <button 
                onClick={() => navigate("/")}
                className="back-button"
              >
                Back to Home
              </button>
            </div>
          )}

          {!isCompleted && (
            <div className="challenge-info">
              <h2>Challenge Details</h2>
              <div className="info-grid">
                <div className="info-item">
                  <span className="label">Type:</span>
                  <span className="value">{challenge.type}</span>
                </div>
                <div className="info-item">
                  <span className="label">Difficulty:</span>
                  <span className="value">{challenge.difficulty}</span>
                </div>
                <div className="info-item">
                  <span className="label">Rewards:</span>
                  <span className="value">{challenge.xp} XP + {challenge.coins} Coins</span>
                </div>
                {challenge.description && (
                  <div className="info-item full-width">
                    <span className="label">Description:</span>
                    <p className="value">{challenge.description}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </SiteLayout>
  );
}
