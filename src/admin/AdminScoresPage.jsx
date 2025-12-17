// src/admin/AdminScoresPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import AdminLayout from "./AdminLayout";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

/**
 * AdminScoresPage
 * - Shows all scores with category filter and pagination
 * - Download CSV button exports the filtered results
 */

function AdminScoresPage() {
  const [scores, setScores] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(0);
  const PAGE_SIZE = 12;

  const [filterCategory, setFilterCategory] = useState("all");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const cs = await getDocs(collection(db, "categories"));
        setCategories(cs.docs.map((d) => ({ id: d.id, ...d.data() })));

        const ss = await getDocs(collection(db, "scores"));
        setScores(ss.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error("Failed to load scores/admin:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const filtered = useMemo(() => {
    if (filterCategory === "all") return scores;
    return scores.filter((s) => (s.category || "").toString() === filterCategory);
  }, [scores, filterCategory]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const start = page * PAGE_SIZE;
  const pageItems = filtered.slice(start, start + PAGE_SIZE);

  // CSV Export
  const exportCSV = () => {
    const header = ["id", "category", "level", "score", "total", "createdAt"];
    const rows = filtered.map((r) => {
      const created = r.createdAt?.toDate ? r.createdAt.toDate().toISOString() : r.createdAt || "";
      return [r.id, r.category, r.level || "", r.score, r.total, created];
    });

    const csv = [header.join(","), ...rows.map((r) => r.map(escapeCsv).join(","))].join("\n");
    downloadCSV(csv);
  };

  const downloadCSV = (content) => {
    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `scores_export_${new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-")}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ margin: 0 }}>Scores</h2>
          <div style={{ color: "#666", marginTop: 6 }}>All saved quiz attempts</div>
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <select
            value={filterCategory}
            onChange={(e) => { setFilterCategory(e.target.value); setPage(0); }}
            style={{ padding: 8, borderRadius: 8 }}
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.label || c.id}</option>
            ))}
          </select>

          <button
            onClick={exportCSV}
            style={{
              padding: "8px 12px",
              borderRadius: 8,
              background: "#6C63FF",
              color: "#fff",
              border: "none",
              cursor: "pointer",
            }}
          >
            Download CSV
          </button>
        </div>
      </div>

      <div style={{ marginTop: 14 }}>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <>
            <div style={{ overflowX: "auto", background: "#fff", borderRadius: 8 }}>
              <table style={{ width: "100%", minWidth: 720 }}>
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
                  {pageItems.map((s, i) => (
                    <tr key={s.id} style={{ borderBottom: "1px solid #eee" }}>
                      <td style={td}>{start + i + 1}</td>
                      <td style={td}>{s.category}</td>
                      <td style={td}>{s.level || "-"}</td>
                      <td style={td}>{s.score}</td>
                      <td style={td}>{s.total}</td>
                      <td style={td}>
                        {s.createdAt?.toDate ? s.createdAt.toDate().toLocaleString() : s.createdAt || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
              <div style={{ color: "#666" }}>
                Showing {start + 1} - {Math.min(start + PAGE_SIZE, filtered.length)} of {filtered.length}
              </div>

              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  style={pageBtn}
                >
                  Prev
                </button>

                <div>Page {page + 1} / {totalPages}</div>

                <button
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1}
                  style={pageBtn}
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}

/* ---------- STYLES ---------- */
const th = { padding: 10, textAlign: "left" };
const td = { padding: 10 };

const pageBtn = {
  padding: "6px 12px",
  borderRadius: 6,
  border: "1px solid #ccc",
  background: "#fff",
  cursor: "pointer",
  minWidth: "70px",
};

export default AdminScoresPage;