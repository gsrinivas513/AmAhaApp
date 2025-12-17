// src/admin/QuestionAnalytics.jsx
import React, { useEffect, useMemo, useState } from "react";
import AdminLayout from "./AdminLayout";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

/*
This page uses the 'scores' collection to compute:
- Attempts per category
- Average score per category
- Score distribution buckets across all filtered results
Note: If you later want per-question difficulty, we should record per-question attempts from QuizPage into an 'attempts' collection.
*/

function QuestionAnalytics() {
  const [scores, setScores] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState("all");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const cs = await getDocs(collection(db, "categories"));
        setCategories(cs.docs.map(d => ({ id: d.id, ...d.data() })));

        const ss = await getDocs(collection(db, "scores"));
        setScores(ss.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error("Failed to load analytics:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const filtered = useMemo(() => {
    if (filterCategory === "all") return scores;
    return scores.filter(s => (s.category || "").toString() === filterCategory);
  }, [scores, filterCategory]);

  const metrics = useMemo(() => {
    const attempts = {};
    const sum = {};
    filtered.forEach(s => {
      const c = s.category || "unknown";
      attempts[c] = (attempts[c] || 0) + 1;
      sum[c] = (sum[c] || 0) + (Number(s.score) || 0);
    });

    const avg = {};
    Object.keys(attempts).forEach(k => { avg[k] = sum[k] / attempts[k]; });

    // global distribution of percentage score: compute percent = (score/total) * 100
    const buckets = [0,10,20,30,40,50,60,70,80,90,100].map(() => 0);
    filtered.forEach(s => {
      const total = Number(s.total) || 1;
      const pct = Math.round(((Number(s.score)||0)/total)*100);
      const idx = Math.min(Math.floor(pct/10), 10);
      buckets[idx] = (buckets[idx] || 0) + 1;
    });

    return { attempts, avg, buckets };
  }, [filtered]);

  return (
    <AdminLayout>
      <h2>Analytics</h2>

      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
        <label>Filter Category:</label>
        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
          <option value="all">All</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.label || c.id}</option>)}
        </select>
      </div>

      {loading ? <div>Loading...</div> : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
            <div style={card}>
              <h3>Attempts per Category</h3>
              <ChartList data={metrics.attempts} />
            </div>

            <div style={card}>
              <h3>Average Score per Category</h3>
              <ChartList data={metrics.avg} isFloat />
            </div>
          </div>

          <div style={{ marginTop: 18 }}>
            <h3>Score Distribution (percent ranges)</h3>
            <div style={{ background: "#fff", padding: 12, borderRadius: 8 }}>
              <ScoreDistribution buckets={metrics.buckets}/>
            </div>
          </div>

          <div style={{ marginTop: 18 }}>
            <p style={{ color: "#666" }}><strong>Note:</strong> This analytics view uses the aggregated <code>scores</code> collection. For per-question difficulty metrics, we recommend adding an "attempts" log from the quiz flow — I can add that in the next step so we can compute per-question correctness rates and identify hardest/easiest questions precisely.</p>
          </div>
        </>
      )}
    </AdminLayout>
  );
}

function ChartList({ data = {}, isFloat = false }) {
  const items = Object.keys(data).sort((a,b) => (data[b]||0)-(data[a]||0));
  if (items.length === 0) return <div>No data</div>;
  const max = Math.max(...items.map(k=>Math.abs(data[k]||0)), 1);
  return (
    <div>
      {items.map((k) => {
        const val = data[k] || 0;
        const width = Math.round((Math.abs(val) / max) * 60);
        return (
          <div key={k} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <div style={{ width: 140 }}>{k}</div>
            <div style={{ flex: 1, background: "#f5f5f7", borderRadius: 8, height: 22, position: "relative" }}>
              <div style={{ width: `${width}%`, height: "100%", borderRadius: 8, background: isFloat ? "#4CAF50" : "#6C63FF" }} />
            </div>
            <div style={{ width: 68, textAlign: "right", fontWeight: 700 }}>{isFloat ? (Math.round(val*100)/100) : val}</div>
          </div>
        );
      })}
    </div>
  );
}

function ScoreDistribution({ buckets = [] }) {
  const labels = ["0-9","10-19","20-29","30-39","40-49","50-59","60-69","70-79","80-89","90-99","100"];
  const max = Math.max(...buckets, 1);
  return (
    <div>
      {buckets.map((v, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <div style={{ width: 72 }}>{labels[i]}</div>
          <div style={{ flex: 1, background: "#f6f6f8", height: 18, borderRadius: 8 }}>
            <div style={{ width: `${Math.round((v/max)*100)}%`, height: "100%", background: "#6C63FF", borderRadius: 8 }} />
          </div>
          <div style={{ width: 48, textAlign: "right" }}>{v}</div>
        </div>
      ))}
    </div>
  );
}

const card = { background: "#fff", padding: 12, borderRadius: 8, boxShadow: "0 10px 30px rgba(0,0,0,0.04)" };

export default QuestionAnalytics;