// src/admin/question-analytics/components/AnalyticsTable.jsx
export default function AnalyticsTable({ rows, page, pageSize, onRowClick }) {
  return (
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
          {rows.map((q, i) => (
            <tr
              key={q.key}
              onClick={() => q.questionId && onRowClick(q.questionId)}
              style={{
                cursor: q.questionId ? "pointer" : "default",
                background: q.needsReview ? "#ffecec" : "transparent",
                borderBottom: "1px solid #eee",
              }}
            >
              <td style={td}>{page * pageSize + i + 1}</td>
              <td style={td}>{q.questionText}</td>
              <td style={td}>{q.attempts}</td>
              <td style={td}>{q.correctPct}%</td>
              <td style={td}>{q.needsReview ? "⚠️ Review" : "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const th = { padding: 10, textAlign: "left" };
const td = { padding: 10 };