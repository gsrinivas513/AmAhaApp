// src/admin/QuestionAnalyticsAdvanced.jsx
import React, { useEffect, useMemo, useState } from "react";
import AdminLayout from "./AdminLayout";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";

import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, ArcElement);

/*
QuestionAnalyticsAdvanced.jsx
- Uses 'attempts' collection to compute per-question metrics:
  attempts count, correct %, avg time (seconds)
- Also uses 'questions' collection to map questionId -> text, category, level
- Top area: summary cards
- Charts: bar (correct %), histogram (time buckets), pie (difficulty)
- Table: sortable, paginated list of questions
*/

function QuestionAnalyticsAdvanced() {
  const [attempts, setAttempts] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filterCategory, setFilterCategory] = useState("all");
  const [filterLevel, setFilterLevel] = useState("all");

  const [sortBy, setSortBy] = useState({ key: "correctPct", dir: "desc" }); // or attempts, avgTime
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 12;

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const atSnap = await getDocs(collection(db, "attempts"));
        const att = atSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setAttempts(att);

        const qSnap = await getDocs(collection(db, "questions"));
        const qs = qSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setQuestions(qs);
      } catch (err) {
        console.error("Failed to load attempts/questions:", err);
        setAttempts([]);
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // Build a map of questions by id for quick lookup
  const questionsById = useMemo(() => {
    const map = {};
    questions.forEach((q) => {
      map[q.id] = q;
    });
    return map;
  }, [questions]);

  // Aggregate attempts per questionId (fallback to questionText key if id missing)
  const aggregated = useMemo(() => {
    const map = {}; // key -> { key, questionId, questionText, category, level, attempts, correctCount, totalTime }
    attempts.forEach((a) => {
      // use questionId if present, else hash questionText
      const qid = a.questionId || null;
      const qtext = a.questionText || (qid && questionsById[qid]?.question) || "Unknown question";
      const key = qid || qtext;

      if (!map[key]) {
        map[key] = {
          key,
          questionId: qid,
          questionText: qtext,
          category: a.category || (qid && questionsById[qid]?.category) || "unknown",
          level: a.level || (qid && questionsById[qid]?.level) || "all",
          attempts: 0,
          correctCount: 0,
          totalTime: 0,
        };
      }
      map[key].attempts += 1;
      if (a.isCorrect) map[key].correctCount += 1;
      map[key].totalTime += Number(a.timeTaken || 0);
    });

    // convert to array and compute derived metrics
    const arr = Object.values(map).map((r) => {
      const avgTime = r.attempts ? r.totalTime / r.attempts : 0;
      const correctPct = r.attempts ? (r.correctCount / r.attempts) * 100 : 0;
      // difficulty: Hard (0-40), Medium (41-70), Easy (71-100)
      let difficulty = "Easy";
      if (correctPct <= 40) difficulty = "Hard";
      else if (correctPct <= 70) difficulty = "Medium";
      return { ...r, avgTime: Number(avgTime.toFixed(2)), correctPct: Number(correctPct.toFixed(1)), difficulty };
    });

    return arr;
  }, [attempts, questionsById]);

  // Apply filters
  const filtered = useMemo(() => {
    return aggregated.filter((q) => {
      if (filterCategory !== "all" && (q.category || "unknown") !== filterCategory) return false;
      if (filterLevel !== "all" && (q.level || "all") !== filterLevel) return false;
      return true;
    });
  }, [aggregated, filterCategory, filterLevel]);

  // Summary metrics
  const summary = useMemo(() => {
    const totalAttempts = attempts.length;
    const avgCorrectPct =
      filtered.length === 0 ? 0 : filtered.reduce((s, q) => s + q.correctPct, 0) / filtered.length;
    const avgTime = filtered.length === 0 ? 0 : filtered.reduce((s, q) => s + q.avgTime, 0) / filtered.length;

    const difficultyCounts = { Easy: 0, Medium: 0, Hard: 0 };
    filtered.forEach((q) => difficultyCounts[q.difficulty] = (difficultyCounts[q.difficulty] || 0) + 1);

    return { totalAttempts, avgCorrectPct: Number((avgCorrectPct || 0).toFixed(1)), avgTime: Number((avgTime || 0).toFixed(2)), difficultyCounts };
  }, [attempts.length, filtered]);

  // Sorting
  const sorted = useMemo(() => {
    const arr = [...filtered];
    const { key, dir } = sortBy;
    arr.sort((a, b) => {
      const va = a[key] ?? 0;
      const vb = b[key] ?? 0;
      if (va === vb) return 0;
      return dir === "asc" ? (va - vb) : (vb - va);
    });
    return arr;
  }, [filtered, sortBy]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const pageItems = sorted.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  // Chart data prep
  const topForBar = useMemo(() => {
    // choose top 12 questions by attempts
    const arr = [...filtered].sort((a, b) => b.attempts - a.attempts).slice(0, 12);
    return {
      labels: arr.map((q, i) => {
        // short label: Q1, Q2 or truncated text
        const short = q.questionText.length > 30 ? q.questionText.slice(0, 28) + "…" : q.questionText;
        return `${i+1}. ${short}`;
      }),
      datasets: [
        {
          label: "Correct %",
          backgroundColor: "#6C63FF",
          data: arr.map((q) => q.correctPct),
        },
      ],
    };
  }, [filtered]);

  const timeHistogram = useMemo(() => {
    // buckets: 0-3,4-7,8-11,12-20,21+
    const buckets = [0, 0, 0, 0, 0];
    filtered.forEach((q) => {
      // spread each attempt as average — approximated: use avgTime per question and count
      // we'll increment bucket by attempts count to represent weight
      const avg = q.avgTime;
      const idx = avg <= 3 ? 0 : avg <= 7 ? 1 : avg <= 11 ? 2 : avg <= 20 ? 3 : 4;
      buckets[idx] += q.attempts;
    });
    return {
      labels: ["0-3s", "4-7s", "8-11s", "12-20s", "21s+"],
      datasets: [{ label: "Attempts (by avg time bucket)", backgroundColor: "#4CAF50", data: buckets }],
    };
  }, [filtered]);

  const difficultyPie = useMemo(() => {
    const dc = summary.difficultyCounts;
    return {
      labels: ["Easy", "Medium", "Hard"],
      datasets: [{ label: "Difficulty distribution", backgroundColor: ["#A98BFF", "#FFD54D", "#FF8A65"], data: [dc.Easy||0, dc.Medium||0, dc.Hard||0] }],
    };
  }, [summary.difficultyCounts]);

  // helpers
  const toggleSort = (key) => {
    setSortBy((s) => {
      if (s.key === key) return { key, dir: s.dir === "asc" ? "desc" : "asc" };
      return { key, dir: "desc" };
    });
  };

  if (loading) return <AdminLayout><div>Loading analytics...</div></AdminLayout>;

  return (
    <AdminLayout>
      <h2>Question Analytics — Advanced</h2>

      {/* Filters */}
      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
        <div>
          <label style={{ marginRight: 6 }}>Category</label>
          <select value={filterCategory} onChange={(e) => { setFilterCategory(e.target.value); setPage(0); }}>
            <option value="all">All</option>
            {[...new Set(questions.map(q => q.category).filter(Boolean))].map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label style={{ marginRight: 6 }}>Level</label>
          <select value={filterLevel} onChange={(e) => { setFilterLevel(e.target.value); setPage(0); }}>
            <option value="all">All</option>
            <option value="easy">easy</option>
            <option value="medium">medium</option>
            <option value="hard">hard</option>
          </select>
        </div>

        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <div style={cardStyle}>
            <div style={{ fontSize: 12, color: "#666" }}>Total Attempts</div>
            <div style={{ fontSize: 20, fontWeight: 800 }}>{summary.totalAttempts}</div>
          </div>

          <div style={cardStyle}>
            <div style={{ fontSize: 12, color: "#666" }}>Avg Correct %</div>
            <div style={{ fontSize: 20, fontWeight: 800 }}>{summary.avgCorrectPct}%</div>
          </div>

          <div style={cardStyle}>
            <div style={{ fontSize: 12, color: "#666" }}>Avg Time (s)</div>
            <div style={{ fontSize: 20, fontWeight: 800 }}>{summary.avgTime}</div>
          </div>

          <div style={cardStyle}>
            <div style={{ fontSize: 12, color: "#666" }}>Difficulty (E/M/H)</div>
            <div style={{ fontSize: 18, fontWeight: 800 }}>{summary.difficultyCounts.Easy || 0} / {summary.difficultyCounts.Medium || 0} / {summary.difficultyCounts.Hard || 0}</div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 420px", gap: 18 }}>
        <div style={{ background: "#fff", padding: 12, borderRadius: 8 }}>
          <h4 style={{ marginTop: 0 }}>Correct % (Top questions by attempts)</h4>
          <Bar data={topForBar} options={{
            responsive: true,
            scales: {
              y: { beginAtZero: true, max: 100, ticks: { callback: v => v + "%" } }
            },
            plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx) => `${ctx.parsed.y}%` } } }
          }} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ background: "#fff", padding: 12, borderRadius: 8 }}>
            <h4 style={{ marginTop: 0 }}>Time Distribution</h4>
            <Bar data={timeHistogram} options={{
              indexAxis: 'y',
              responsive: true,
              plugins: { legend: { display: false } },
              scales: { x: { beginAtZero: true } }
            }} />
          </div>

          <div style={{ background: "#fff", padding: 12, borderRadius: 8 }}>
            <h4 style={{ marginTop: 0 }}>Difficulty Distribution</h4>
            <Pie data={difficultyPie} options={{ responsive: true, plugins: { legend: { position: "bottom" } } }} />
          </div>
        </div>
      </div>

      {/* Table */}
      <div style={{ marginTop: 18, background: "#fff", borderRadius: 8, padding: 12 }}>
        <h4 style={{ marginTop: 0 }}>Questions — Details</h4>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", minWidth: 900, borderCollapse: "collapse" }}>
            <thead style={{ background: "#f6f6f6" }}>
              <tr>
                <th style={th}>#</th>
                <th style={th}>Question</th>
                <th style={th}>Category</th>
                <th style={th}>Level</th>
                <th style={th} onClick={() => toggleSort("attempts")} >Attempts {sortBy.key === "attempts" ? (sortBy.dir==="asc"?"↑":"↓"):""}</th>
                <th style={th} onClick={() => toggleSort("correctPct")}>Correct % {sortBy.key === "correctPct" ? (sortBy.dir==="asc"?"↑":"↓"):""}</th>
                <th style={th} onClick={() => toggleSort("avgTime")}>Avg Time {sortBy.key === "avgTime" ? (sortBy.dir==="asc"?"↑":"↓"):""}</th>
                <th style={th}>Difficulty</th>
              </tr>
            </thead>

            <tbody>
              {pageItems.map((q, idx) => (
                <tr key={q.key} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={td}>{page * PAGE_SIZE + idx + 1}</td>
                  <td style={td}>{q.questionText}</td>
                  <td style={td}>{q.category}</td>
                  <td style={td}>{q.level}</td>
                  <td style={td}>{q.attempts}</td>
                  <td style={td}>{q.correctPct}%</td>
                  <td style={td}>{q.avgTime}s</td>
                  <td style={td}>{q.difficulty}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* pagination */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
          <div style={{ color: "#666" }}>Showing {Math.min(sorted.length, (page+1)*PAGE_SIZE)} of {sorted.length}</div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button onClick={() => setPage((p) => Math.max(0, p-1))} disabled={page === 0} style={pageBtn}>Prev</button>
            <div>Page {page + 1} / {totalPages}</div>
            <button onClick={() => setPage((p) => Math.min(totalPages-1, p+1))} disabled={page >= totalPages-1} style={pageBtn}>Next</button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

/* styles */
const cardStyle = { background: "#fff", padding: 12, borderRadius: 8, minWidth: 120, textAlign: "center" };
const th = { padding: 10, textAlign: "left", cursor: "pointer" };
const td = { padding: 10 };
const pageBtn = { padding: "6px 12px", borderRadius: 6, border: "1px solid #ddd", background: "#fff", cursor: "pointer" };

export default QuestionAnalyticsAdvanced;