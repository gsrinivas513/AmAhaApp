// src/admin/question-analytics/components/AnalyticsKpiGrid.jsx
import KpiCard from "./KpiCard";

export default function AnalyticsKpiGrid({ summary }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: 16,
        marginBottom: 20,
      }}
    >
      <KpiCard label="Total Attempts" value={summary.totalAttempts} />
      <KpiCard label="Avg Correct %" value={`${summary.avgCorrectPct}%`} />
      <KpiCard label="Avg Time (s)" value={summary.avgTime} />
      <KpiCard
        label="Needs Review"
        value={summary.needsReviewCount}
        highlight
      />
    </div>
  );
}