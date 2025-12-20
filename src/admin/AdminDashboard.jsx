// src/admin/AdminDashboard.jsx
import React, { useEffect, useMemo, useState } from "react";
import AdminLayout from "./AdminLayout";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Card, Button } from "../components/ui";

/**
 * AdminDashboard
 * - Loads categories and scores
 * - Category filter dropdown (All + each category)
 * - SVG bar charts (Attempts per category, Average score per category)
 * - Recent scores table (filtered)
 * - CSV export button (exports currently filtered recent scores)
 */

function AdminDashboard() {
  const [categories, setCategories] = useState([]);
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filterCategory, setFilterCategory] = useState("all");
  const [limitRows, setLimitRows] = useState(30);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const cSnap = await getDocs(collection(db, "categories"));
        const cats = cSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setCategories(cats);

        const sSnap = await getDocs(collection(db, "scores"));
        const sc = sSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setScores(sc);
      } catch (err) {
        console.error("AdminDashboard load error:", err);
        setCategories([]);
        setScores([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // filtered scores by category selection
  const filteredScores = useMemo(() => {
    if (filterCategory === "all") return scores;
    return scores.filter((s) => (s.category || "").toString() === filterCategory);
  }, [scores, filterCategory]);

  // metrics for charts
  const { attemptsData, avgData } = useMemo(() => {
    const attemptsMap = {};
    const sumMap = {};
    const cntMap = {};
    // ensure all categories exist in map
    const catIds = categories.length ? categories.map((c) => c.id) : [];

    filteredScores.forEach((s) => {
      const c = (s.category || "unknown").toString();
      attemptsMap[c] = (attemptsMap[c] || 0) + 1;
      sumMap[c] = (sumMap[c] || 0) + (Number(s.score) || 0);
      cntMap[c] = (cntMap[c] || 0) + 1;
    });

    const listCats = catIds.length ? catIds : Array.from(new Set(Object.keys(attemptsMap)));

    const attemptsData = listCats.map((id) => ({ id, value: attemptsMap[id] || 0 }));
    const avgData = listCats.map((id) => ({ id, value: cntMap[id] ? (sumMap[id] / cntMap[id]) : 0 }));

    return { attemptsData, avgData };
  }, [filteredScores, categories]);

  const totalScores = scores.length;

  // CSV export for currently filtered scores (visible)
  const exportCSV = () => {
    const header = ["id", "category", "level", "score", "total", "createdAt"];
    const rows = filteredScores.map((r) => {
      const created = r.createdAt && r.createdAt.toDate ? r.createdAt.toDate().toISOString() : (r.createdAt || "");
      return [r.id, r.category, r.level || "", r.score, r.total, created];
    });

    const csv = [header, ...rows].map((r) => r.map(escapeCsv).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `scores_${filterCategory}_${new Date().toISOString().slice(0,19).replace(/[:T]/g,"-")}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  // helper to escape CSV cells
  function escapeCsv(v) {
    if (v === null || v === undefined) return "";
    const s = String(v);
    if (s.includes(",") || s.includes('"') || s.includes("\n")) {
      return `"${s.replace(/"/g, '""')}"`;
    }
    return s;
  }

  return (
    <AdminLayout>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <div>
          <h2 style={{ margin: 0 }}>Admin Dashboard</h2>
          <div style={{ color: "#666", marginTop: 8 }}>Overview & analytics</div>
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <label style={{ fontSize: 14, color: "#444" }}>Filter</label>
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} style={selectStyle}>
            <option value="all">All Categories</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.label || c.id}</option>)}
          </select>

          <Button variant="primary" onClick={exportCSV}>Download CSV</Button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 18, marginTop: 18 }}>
        <Card>
          <h3 style={{ marginTop: 0 }}>Total Quiz Attempts</h3>
          <div style={{ fontSize: 28, fontWeight: 800 }}>{totalScores}</div>
          <div style={{ color: "#777", marginTop: 6 }}>Total saved quiz attempts</div>
        </Card>

        <Card>
          <h3 style={{ marginTop: 0 }}>Categories</h3>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
            {categories.length === 0 ? <div className="muted">No categories</div> : categories.map(c => (
              <div key={c.id} style={{ padding: "6px 10px", borderRadius: 8, background: "#f7f7fb", fontWeight: 600 }}>{c.label || c.id}</div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 style={{ marginTop: 0 }}>Attempts (filtered)</h3>
          <div style={{ fontSize: 24, fontWeight: 700 }}>{filteredScores.length}</div>
          <div style={{ color: "#777", marginTop: 6 }}>Records matching current filter</div>
        </Card>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginTop: 18 }}>
        <Card className="min-h-[220px]">
          <h4 style={{ marginTop: 0 }}>Attempts per Category</h4>
          <ChartBarSvg data={attemptsData} color="#6C63FF" />
        </Card>

        <Card className="min-h-[220px]">
          <h4 style={{ marginTop: 0 }}>Average Score per Category</h4>
          <ChartBarSvg data={avgData} color="#4CAF50" isFloat />
        </Card>
      </div>

      <div style={{ marginTop: 18 }}>
        <h3 style={{ marginBottom: 10 }}>Recent Scores (filtered)</h3>

        {loading ? <div style={{ padding: 18 }}>Loading...</div> : (
          <Card>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 720 }}>
                <thead style={{ background: "#f6f6f6" }}>
                  <tr>
                    <th style={th}>#</th>
                    <th style={th}>Category</th>
                    <th style={th}>Level</th>
                    <th style={th}>Score</th>
                    <th style={th}>Total</th>
                    <th style={th}>When</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredScores.slice(0, limitRows).map((s, i) => (
                    <tr key={s.id} style={{ borderBottom: "1px solid #eee" }}>
                      <td style={td}>{i + 1}</td>
                      <td style={td}>{s.category}</td>
                      <td style={td}>{s.level || "-"}</td>
                      <td style={td}>{s.score}</td>
                      <td style={td}>{s.total}</td>
                      <td style={td}>{s.createdAt?.toDate ? s.createdAt.toDate().toLocaleString() : (s.createdAt || "-")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
              <div style={{ color: "#666", fontSize: 13 }}>Showing {Math.min(filteredScores.length, limitRows)} of {filteredScores.length}</div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setLimitRows((n) => Math.max(5, n - 5))} style={pageBtn}>-</button>
                <button onClick={() => setLimitRows((n) => n + 5)} style={pageBtn}>+</button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}

/* ---------- small SVG bar chart component ---------- */
function ChartBarSvg({ data = [], color = "#6C63FF", isFloat = false }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const rowH = 36;
  const paddingLeft = 140;
  const svgHeight = Math.max(60, data.length * rowH);

  return (
    <div style={{ width: "100%", overflowX: "auto" }}>
      <svg width="100%" height={svgHeight} viewBox={`0 0 1000 ${svgHeight}`} preserveAspectRatio="xMinYMin meet">
        <defs>
          <linearGradient id="barGrad" x1="0" x2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.95" />
            <stop offset="100%" stopColor="#42A5F5" stopOpacity="0.95" />
          </linearGradient>
        </defs>

        {data.map((d, i) => {
          const y = i * rowH + 8;
          const w = Math.round(((d.value || 0) / (max || 1)) * 700);
          const label = isFloat ? (Math.round(d.value * 100) / 100) : Math.round(d.value || 0);
          return (
            <g key={d.id}>
              <text x={8} y={y + 14} style={{ fontSize: 13, fill: "#333" }}>{d.id}</text>
              <rect x={paddingLeft} y={y} width={w} height={18} rx={8} fill="url(#barGrad)" />
              <text x={paddingLeft + w + 12} y={y + 14} style={{ fontSize: 13, fill: "#333" }}>{label}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* ---------- styles ---------- */
const selectStyle = { padding: 10, borderRadius: 8, border: "1px solid #ddd" };
const th = { padding: 12, textAlign: "left" };
const td = { padding: 12 };
const pageBtn = { padding: "6px 10px", borderRadius: 6, border: "1px solid #ddd", background: "#fff", cursor: "pointer" };

export default AdminDashboard;