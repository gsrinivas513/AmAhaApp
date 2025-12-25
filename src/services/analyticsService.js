import { db } from "../firebase/firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  getDoc,
  doc,
} from "firebase/firestore";

/**
 * Analytics Service
 * Tracks user engagement, quiz performance, puzzle completion, and feature usage
 */

/**
 * Track a user action/event
 */
export async function trackEvent(userId, eventType, eventData = {}) {
  try {
    const event = {
      userId,
      eventType, // e.g., 'quiz_started', 'puzzle_completed', 'challenge_submitted'
      eventData,
      timestamp: new Date(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    await addDoc(collection(db, "analytics_events"), event);
    return true;
  } catch (err) {
    console.error("Failed to track event:", err);
    return false;
  }
}

/**
 * Track quiz completion
 */
export async function trackQuizCompletion(userId, quizData) {
  return trackEvent(userId, "quiz_completed", {
    category: quizData.category,
    difficulty: quizData.difficulty,
    score: quizData.score,
    timeSpent: quizData.timeSpent, // in seconds
    questionsAnswered: quizData.questionsAnswered,
    correctAnswers: quizData.correctAnswers,
    xpEarned: quizData.xpEarned,
    coinsEarned: quizData.coinsEarned,
  });
}

/**
 * Track puzzle completion
 */
export async function trackPuzzleCompletion(userId, puzzleData) {
  return trackEvent(userId, "puzzle_completed", {
    puzzleId: puzzleData.puzzleId,
    category: puzzleData.category,
    difficulty: puzzleData.difficulty,
    timeSpent: puzzleData.timeSpent,
    solvedCorrectly: puzzleData.solvedCorrectly,
    xpEarned: puzzleData.xpEarned,
  });
}

/**
 * Track daily challenge submission
 */
export async function trackDailyChallengeSubmission(userId, challengeData) {
  return trackEvent(userId, "daily_challenge_submitted", {
    challengeDate: challengeData.date,
    type: challengeData.type,
    difficulty: challengeData.difficulty,
    timeSpent: challengeData.timeSpent,
    completed: challengeData.completed,
    xpEarned: challengeData.xpEarned,
  });
}

/**
 * Track feature usage
 */
export async function trackFeatureUsage(userId, featureName, actionType) {
  return trackEvent(userId, "feature_used", {
    feature: featureName,
    action: actionType,
  });
}

/**
 * Get user engagement metrics
 */
export async function getUserEngagementMetrics(userId) {
  try {
    const eventsSnapshot = await getDocs(
      query(
        collection(db, "analytics_events"),
        where("userId", "==", userId),
        orderBy("timestamp", "desc"),
        limit(1000)
      )
    );

    const events = eventsSnapshot.docs.map((doc) => doc.data());

    // Calculate metrics
    const quizCompletions = events.filter((e) => e.eventType === "quiz_completed").length;
    const puzzleCompletions = events.filter((e) => e.eventType === "puzzle_completed").length;
    const dailyChallengeSubmissions = events.filter(
      (e) => e.eventType === "daily_challenge_submitted"
    ).length;

    // Total time spent (in minutes)
    const totalTimeSpent = events
      .filter((e) => e.eventData?.timeSpent)
      .reduce((sum, e) => sum + (e.eventData.timeSpent || 0), 0) / 60;

    // Total XP earned
    const totalXpEarned = events
      .filter((e) => e.eventData?.xpEarned)
      .reduce((sum, e) => sum + (e.eventData.xpEarned || 0), 0);

    // Most used feature
    const featureUsage = {};
    events
      .filter((e) => e.eventType === "feature_used")
      .forEach((e) => {
        featureUsage[e.eventData?.feature] = (featureUsage[e.eventData?.feature] || 0) + 1;
      });

    const mostUsedFeature = Object.entries(featureUsage).sort((a, b) => b[1] - a[1])[0];

    return {
      userId,
      quizCompletions,
      puzzleCompletions,
      dailyChallengeSubmissions,
      totalTimeSpent: Math.round(totalTimeSpent),
      totalXpEarned,
      mostUsedFeature: mostUsedFeature ? mostUsedFeature[0] : null,
      eventCount: events.length,
      lastActive: events[0]?.timestamp || null,
    };
  } catch (err) {
    console.error("Failed to get engagement metrics:", err);
    return null;
  }
}

/**
 * Get leaderboard analytics
 */
export async function getLeaderboardAnalytics(limit = 50) {
  try {
    // Get all events (quiz, puzzle, and challenge completions)
    const eventsSnapshot = await getDocs(
      query(
        collection(db, "analytics_events"),
        orderBy("timestamp", "desc"),
        limit(1000)
      )
    );

    const userScores = {};
    const events = eventsSnapshot.docs.map((doc) => doc.data());

    // Filter for completion events and aggregate by user
    events.forEach((event) => {
      const isCompletionEvent = [
        'quiz_completed',
        'puzzle_completed',
        'daily_challenge_submitted'
      ].includes(event.eventType);

      if (!isCompletionEvent) return;

      if (!userScores[event.userId]) {
        userScores[event.userId] = {
          userId: event.userId,
          totalXp: 0,
          totalCoins: 0,
          quizzesSolved: 0,
          puzzlesSolved: 0,
          challengesCompleted: 0,
          totalScore: 0,
          coins: 0,
        };
      }

      // Add XP from all event types
      userScores[event.userId].totalXp += event.eventData?.xpEarned || 0;
      
      // Add coins (only quiz_completed has coinsEarned)
      userScores[event.userId].totalCoins += event.eventData?.coinsEarned || 0;
      userScores[event.userId].coins = userScores[event.userId].totalCoins;

      // Count by type
      if (event.eventType === 'quiz_completed') {
        userScores[event.userId].quizzesSolved += 1;
        userScores[event.userId].totalScore += event.eventData?.score || 0;
      } else if (event.eventType === 'puzzle_completed') {
        userScores[event.userId].puzzlesSolved += 1;
      } else if (event.eventType === 'daily_challenge_submitted') {
        userScores[event.userId].challengesCompleted += 1;
      }
    });

    // Calculate averages
    Object.values(userScores).forEach((user) => {
      user.averageScore = user.quizzesSolved > 0 
        ? Math.round(user.totalScore / user.quizzesSolved) 
        : 0;
    });

    // Sort by XP and get top
    const leaderboard = Object.values(userScores)
      .sort((a, b) => b.totalXp - a.totalXp)
      .slice(0, limit);

    return leaderboard;
  } catch (err) {
    console.error("Failed to get leaderboard analytics:", err);
    return [];
  }
}

/**
 * Get category performance analytics
 */
export async function getCategoryPerformanceAnalytics(userId) {
  try {
    const eventsSnapshot = await getDocs(
      query(
        collection(db, "analytics_events"),
        where("userId", "==", userId),
        where("eventType", "==", "quiz_completed")
      )
    );

    const categoryStats = {};
    const events = eventsSnapshot.docs.map((doc) => doc.data());

    events.forEach((event) => {
      const category = event.eventData?.category || "Other";
      if (!categoryStats[category]) {
        categoryStats[category] = {
          category,
          totalQuizzes: 0,
          totalXp: 0,
          averageScore: 0,
          totalScore: 0,
          correctAnswers: 0,
          totalQuestions: 0,
        };
      }
      categoryStats[category].totalQuizzes += 1;
      categoryStats[category].totalXp += event.eventData?.xpEarned || 0;
      categoryStats[category].totalScore += event.eventData?.score || 0;
      categoryStats[category].correctAnswers += event.eventData?.correctAnswers || 0;
      categoryStats[category].totalQuestions += event.eventData?.questionsAnswered || 0;
    });

    // Calculate averages
    Object.values(categoryStats).forEach((stats) => {
      stats.averageScore = stats.totalQuizzes > 0 ? Math.round(stats.totalScore / stats.totalQuizzes) : 0;
      stats.accuracy = stats.totalQuestions > 0 ? ((stats.correctAnswers / stats.totalQuestions) * 100).toFixed(1) : 0;
    });

    return Object.values(categoryStats);
  } catch (err) {
    console.error("Failed to get category performance analytics:", err);
    return [];
  }
}

/**
 * Get platform-wide analytics
 */
export async function getPlatformAnalytics() {
  try {
    // Get last 1000 events
    const eventsSnapshot = await getDocs(
      query(
        collection(db, "analytics_events"),
        orderBy("timestamp", "desc"),
        limit(1000)
      )
    );

    const events = eventsSnapshot.docs.map((doc) => doc.data());

    // Calculate metrics
    const uniqueUsers = new Set(events.map((e) => e.userId)).size;
    const quizCompletions = events.filter((e) => e.eventType === "quiz_completed").length;
    const puzzleCompletions = events.filter((e) => e.eventType === "puzzle_completed").length;
    const dailyChallenges = events.filter((e) => e.eventType === "daily_challenge_submitted").length;

    // Event distribution by type
    const eventTypeDistribution = {};
    events.forEach((e) => {
      eventTypeDistribution[e.eventType] = (eventTypeDistribution[e.eventType] || 0) + 1;
    });

    // Hourly distribution
    const hourlyDistribution = {};
    events.forEach((e) => {
      const hour = new Date(e.timestamp.toDate()).getHours();
      hourlyDistribution[hour] = (hourlyDistribution[hour] || 0) + 1;
    });

    return {
      totalEvents: events.length,
      uniqueUsers,
      quizCompletions,
      puzzleCompletions,
      dailyChallenges,
      eventTypeDistribution,
      hourlyDistribution,
      dateRange: {
        from: events[events.length - 1]?.timestamp || null,
        to: events[0]?.timestamp || null,
      },
    };
  } catch (err) {
    console.error("Failed to get platform analytics:", err);
    return null;
  }
}

/**
 * Export analytics data as CSV
 */
export function exportAnalyticsAsCSV(data, filename = "analytics.csv") {
  try {
    const csv = convertToCSV(data);
    const link = document.createElement("a");
    const blob = new Blob([csv], { type: "text/csv" });
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
    return true;
  } catch (err) {
    console.error("Failed to export analytics:", err);
    return false;
  }
}

/**
 * Helper function to convert data to CSV format
 */
function convertToCSV(data) {
  if (Array.isArray(data)) {
    const headers = Object.keys(data[0]);
    const rows = data.map((row) =>
      headers.map((header) => {
        const value = row[header];
        return typeof value === "string" ? `"${value}"` : value;
      })
    );
    return [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
  }
  return "";
}
