// src/App.js
import React from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

// Public Pages
import HomePage from "./home/HomePage";
import LeaderboardPage from "./pages/LeaderboardPage";

// Admin Pages
import AdminDashboard from "./admin/AdminDashboard";
import AddQuestionPage from "./admin/AddQuestionPage";
import ViewQuestionsPage from "./admin/ViewQuestionsPage";
import EditQuestionPage from "./admin/EditQuestionPage";
import CategoriesPage from "./admin/CategoriesPage";
import AdminScoresPage from "./admin/AdminScoresPage";
import QuestionAnalyticsAdvanced from "./admin/QuestionAnalyticsAdvanced";
import ImportQuestionsPage from "./admin/ImportQuestionsPage";
import UiModeSettingsPage from "./admin/UiModeSettingsPage";

// 🆕 NEW ANALYTICS DASHBOARD
import QuizAnalyticsDashboard from "./admin/QuizAnalyticsDashboard";

// Quiz Pages
import QuizzesPage from "./quiz/QuizzesPage";
import DifficultySelectionPage from "./quiz/DifficultySelectionPage";
import CategoryLevelsPage from "./quiz/CategoryLevelsPage";
import QuizPage from "./quiz/QuizPage";

// User Pages
import UserSettingsPage from "./pages/UserSettingsPage";
import ProfilePage from "./pages/ProfilePage";

function App() {
  return (
    <div className="app-bg">
      <Navbar />

      <Routes>
        {/* HOME */}
        <Route path="/" element={<HomePage />} />

        {/* QUIZ HUB — MUST COME FIRST */}
        <Route path="/quiz" element={<QuizzesPage />} />

        {/* QUIZ FLOW */}
        <Route path="/quiz/:category" element={<DifficultySelectionPage />} />
        <Route path="/quiz/:category/:difficulty" element={<CategoryLevelsPage />} />
        <Route path="/quiz/:category/:difficulty/:level" element={<QuizPage />} />

        {/* LEADERBOARD */}
        <Route path="/leaderboard/:categoryId" element={<LeaderboardPage />} />

        {/* USER */}
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<UserSettingsPage />} />

        {/* ADMIN */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/add-question" element={<AddQuestionPage />} />
        <Route path="/admin/view-questions" element={<ViewQuestionsPage />} />
        <Route path="/admin/edit-question/:id" element={<EditQuestionPage />} />
        <Route path="/admin/categories" element={<CategoriesPage />} />
        <Route path="/admin/scores" element={<AdminScoresPage />} />

        {/* 🆕 NEW QUIZ ANALYTICS */}
        <Route
          path="/admin/quiz-analytics"
          element={<QuizAnalyticsDashboard />}
        />

        {/* OLD / ADVANCED ANALYTICS (UNCHANGED) */}
        <Route path="/admin/analytics" element={<QuestionAnalyticsAdvanced />} />

        <Route path="/admin/import" element={<ImportQuestionsPage />} />
        <Route path="/admin/ui-mode" element={<UiModeSettingsPage />} />
      </Routes>
    </div>
  );
}

export default App;