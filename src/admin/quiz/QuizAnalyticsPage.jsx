// src/admin/quiz/QuizAnalyticsPage.jsx
import React from "react";
import AdminLayout from "../AdminLayout";
import QuestionAnalyticsAdvanced from "../question-analytics/QuestionAnalyticsAdvanced";

export default function QuizAnalyticsPage() {
  return (
    <AdminLayout>
      <h2 style={{ marginBottom: 16 }}>📊 Quiz Analytics</h2>

      {/* 
        NOTE:
        QuizDashboardOverview is intentionally removed for now.
        We will re-introduce it later as a summary section or tab.
      */}

      <QuestionAnalyticsAdvanced />
    </AdminLayout>
  );
}