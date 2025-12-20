// src/admin/question-analytics/hooks/useQuestionAggregation.js
import { useMemo } from "react";

export function useQuestionAggregation(attempts, questions) {
  const questionsById = useMemo(() => {
    const map = {};
    questions.forEach(q => (map[q.id] = q));
    return map;
  }, [questions]);

  const aggregated = useMemo(() => {
    const map = {};

    attempts.forEach(a => {
      const qid = a.questionId || null;
      const text =
        a.questionText ||
        (qid && questionsById[qid]?.question) ||
        "Unknown question";

      const key = qid || text;

      if (!map[key]) {
        map[key] = {
          key,
          questionId: qid,
          questionText: text,
          attempts: 0,
          correctCount: 0,
          totalTime: 0,
        };
      }

      map[key].attempts += 1;
      if (a.isCorrect) map[key].correctCount += 1;
      map[key].totalTime += Number(a.timeTaken || 0);
    });

    return Object.values(map).map(r => {
      const avgTime = r.attempts ? r.totalTime / r.attempts : 0;
      const correctPct = r.attempts
        ? (r.correctCount / r.attempts) * 100
        : 0;

      let difficulty = "Easy";
      if (correctPct <= 40) difficulty = "Hard";
      else if (correctPct <= 70) difficulty = "Medium";

      const needsReview = r.attempts >= 10 && correctPct < 50;

      return {
        ...r,
        avgTime: Number(avgTime.toFixed(2)),
        correctPct: Number(correctPct.toFixed(1)),
        difficulty,
        needsReview,
      };
    });
  }, [attempts, questionsById]);

  const summary = useMemo(() => {
    const totalAttempts = aggregated.reduce((s, q) => s + q.attempts, 0);
    const avgCorrectPct =
      aggregated.length === 0
        ? 0
        : aggregated.reduce((s, q) => s + q.correctPct, 0) /
          aggregated.length;

    const avgTime =
      aggregated.length === 0
        ? 0
        : aggregated.reduce((s, q) => s + q.avgTime, 0) /
          aggregated.length;

    const needsReviewCount = aggregated.filter(q => q.needsReview).length;

    return {
      totalAttempts,
      avgCorrectPct: Number(avgCorrectPct.toFixed(1)),
      avgTime: Number(avgTime.toFixed(2)),
      needsReviewCount,
    };
  }, [aggregated]);

  return { aggregated, summary };
}