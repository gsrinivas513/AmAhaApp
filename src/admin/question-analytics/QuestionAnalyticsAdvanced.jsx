// src/admin/question-analytics/QuestionAnalyticsAdvanced.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../AdminLayout"; // ✅ FIXED PATH

import { useAnalyticsData } from "./hooks/useAnalyticsData";
import { useQuestionAggregation } from "./hooks/useQuestionAggregation";

import AnalyticsKpiGrid from "./components/AnalyticsKpiGrid";
import AnalyticsTable from "./components/AnalyticsTable";

export default function QuestionAnalyticsAdvanced() {
  const navigate = useNavigate();
  const PAGE_SIZE = 12;
  const [page, setPage] = useState(0);

  const { attempts, questions, loading } = useAnalyticsData();
  const { aggregated, summary } = useQuestionAggregation(attempts, questions);

  const pageItems = aggregated.slice(
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
        <h2 style={{ marginBottom: 16 }}>
        Question Analytics — Advanced
        </h2>

        <AnalyticsKpiGrid summary={summary} />

        <AnalyticsTable
        rows={pageItems}
        page={page}
        pageSize={PAGE_SIZE}
        onRowClick={(id) =>
            id && navigate(`/admin/edit-question/${id}`)
        }
        />
    </AdminLayout>
    );

}