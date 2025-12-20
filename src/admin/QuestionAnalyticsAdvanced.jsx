// src/admin/QuestionAnalyticsAdvanced.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ NEW
import AdminLayout from "./AdminLayout";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement
);

function QuestionAnalyticsAdvanced() {
  const navigate = useNavigate(); // ✅ NEW

  const [attempts, setAttempts] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filterCategory, setFilterCategory] = useState("all");
  const [filterLevel, setFilterLevel] = useState("all");

  const [sortBy, setSortBy] = useState({ key: "correctPct", dir: "desc" });
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 12;

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const atSnap = await getDocs(collection(db, "attempts"));
        setAttempts(atSnap.docs.map(d => ({ id: d.id, ...d.data() })));

        const qSnap = await getDocs(collection(db, "questions"));
        setQuestions(qSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

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
          category:
            a.category || questionsById[qid]?.category || "unknown",
          level: a.level || questionsById[qid]?.level || "unknown",
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

      const difficulty = "Easy";
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

  const sorted = aggregated.slice(
    page * PAGE_SIZE,
    page * PAGE_SIZE + PAGE_SIZE
  );

  if (loading) {
    return (
      <AdminLayout>
        <div>Loading analytics…</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <h2>Question Analytics — Advanced</h2>

      <div style={{ background: "#fff", padding: 12, borderRadius: 8 }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={th}>#</th>
              <th style={th}>Question</th>
              <th style={th}>Attempts</th>
              <th style={th}>Correct %</th>
              <th style={th}>Issue</th>
            </tr>
          </thead>

          <tbody>
            {sorted.map((q, i) => (
              <tr
                key={q.key}
                onClick={() => {
                  if (q.questionId) {
                    navigate(`/admin/edit-question/${q.questionId}`);
                  }
                }}
                style={{
                  cursor: q.questionId ? "pointer" : "default",
                  background: q.needsReview ? "#ffecec" : "transparent",
                  borderBottom: "1px solid #eee",
                }}
                title={
                  q.questionId
                    ? "Click to edit question"
                    : "Question ID not available"
                }
              >
                <td style={td}>{page * PAGE_SIZE + i + 1}</td>
                <td style={td}>{q.questionText}</td>
                <td style={td}>{q.attempts}</td>
                <td style={td}>{q.correctPct}%</td>
                <td style={td}>
                  {q.needsReview ? "⚠️ Review" : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}

/* styles */
const th = { padding: 10, textAlign: "left" };
const td = { padding: 10 };

export default QuestionAnalyticsAdvanced;