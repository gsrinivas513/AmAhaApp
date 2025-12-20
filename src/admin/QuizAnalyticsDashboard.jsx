// src/admin/QuizAnalyticsDashboard.jsx
import React, { useEffect, useMemo, useState } from "react";
import SiteLayout from "../layouts/SiteLayout";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

export default function QuizAnalyticsDashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [category, setCategory] = useState("all");
  const [difficulty, setDifficulty] = useState("all");

  /* ---------------- LOAD EVENTS ---------------- */
  useEffect(() => {
    async function load() {
      const snap = await getDocs(collection(db, "analytics"));
      setEvents(snap.docs.map(d => d.data()));
      setLoading(false);
    }
    load();
  }, []);

  /* ---------------- FILTER ---------------- */
  const filtered = useMemo(() => {
    return events.filter(e => {
      if (category !== "all" && e.category !== category) return false;
      if (difficulty !== "all" && e.difficulty !== difficulty) return false;
      return true;
    });
  }, [events, category, difficulty]);

  /* ---------------- FUNNEL METRICS ---------------- */
  const starts = filtered.filter(e => e.type === "quiz_start").length;
  const passed = filtered.filter(e => e.type === "quiz_pass").length;
  const failed = filtered.filter(e => e.type === "quiz_fail").length;

  const completed = passed + failed;
  const dropOff = Math.max(starts - completed, 0);

  const passRate = starts ? Math.round((passed / starts) * 100) : 0;
  const failRate = starts ? Math.round((failed / starts) * 100) : 0;
  const dropRate = starts ? Math.round((dropOff / starts) * 100) : 0;

  /* ---------------- UI ---------------- */
  return (
    <SiteLayout>
      <div className="container">
        <h2>📊 Quiz Analytics</h2>

        {/* FILTER BAR */}
        <div style={filterBar}>
          <select value={category} onChange={e => setCategory(e.target.value)}>
            <option value="all">All Categories</option>
            <option value="kids">Kids</option>
            <option value="movies">Movies</option>
            <option value="programming">Programming</option>
          </select>

          <select
            value={difficulty}
            onChange={e => setDifficulty(e.target.value)}
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        {loading && <div>Loading analytics…</div>}

        {!loading && (
          <>
            {/* SUMMARY */}
            <div style={grid}>
              <StatCard label="Quiz Started" value={starts} />
              <StatCard label="Passed" value={`${passRate}%`} />
              <StatCard label="Failed" value={`${failRate}%`} />
              <StatCard label="Drop-off" value={`${dropRate}%`} />
            </div>

            {/* FUNNEL */}
            <div style={funnelWrap}>
              <FunnelStep label="Started" value={starts} />
              <Arrow />
              <FunnelStep label="Passed" value={passed} success />
              <Arrow />
              <FunnelStep label="Failed" value={failed} danger />
              <Arrow />
              <FunnelStep label="Dropped" value={dropOff} muted />
            </div>
          </>
        )}
      </div>
    </SiteLayout>
  );
}

/* ---------------- COMPONENTS ---------------- */

function StatCard({ label, value }) {
  return (
    <div style={card}>
      <div style={{ fontSize: 13, color: "#777" }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 800 }}>{value}</div>
    </div>
  );
}

function FunnelStep({ label, value, success, danger, muted }) {
  let bg = "#f5f6fb";
  if (success) bg = "#e8ffed";
  if (danger) bg = "#ffecec";
  if (muted) bg = "#f1f1f1";

  return (
    <div style={{ ...funnelStep, background: bg }}>
      <div style={{ fontWeight: 700 }}>{label}</div>
      <div style={{ fontSize: 20 }}>{value}</div>
    </div>
  );
}

function Arrow() {
  return <div style={{ fontSize: 20 }}>⬇️</div>;
}

/* ---------------- STYLES ---------------- */

const filterBar = {
  display: "flex",
  gap: 12,
  margin: "20px 0",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: 20,
};

const card = {
  background: "#fff",
  borderRadius: 16,
  padding: 22,
  boxShadow: "0 12px 30px rgba(0,0,0,0.06)",
};

const funnelWrap = {
  marginTop: 40,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 12,
};

const funnelStep = {
  width: 260,
  padding: 16,
  borderRadius: 14,
  textAlign: "center",
};