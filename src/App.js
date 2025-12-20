// src/App.js
import React from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

/* PUBLIC */
import HomePage from "./home/HomePage";
import LeaderboardPage from "./pages/LeaderboardPage";

/* QUIZ */
import QuizzesPage from "./quiz/QuizzesPage";
import CategoryLevelsPage from "./quiz/CategoryLevelsPage";
import QuizPage from "./quiz/QuizPage";

/* USER */
import ProfilePage from "./pages/ProfilePage";
import UserSettingsPage from "./pages/UserSettingsPage";

/* ADMIN — GENERAL */
import AdminDashboard from "./admin/AdminDashboard";
import CategoriesPage from "./admin/CategoriesPage";
import AdminScoresPage from "./admin/AdminScoresPage";
import ImportQuestionsPage from "./admin/ImportQuestionsPage";
import UiModeSettingsPage from "./admin/UiModeSettingsPage";

/* ADMIN — QUIZ */
import AddQuestionPage from "./admin/AddQuestionPage";
import ViewQuestionsPage from "./admin/ViewQuestionsPage";
import EditQuestionPage from "./admin/EditQuestionPage";
import QuizUIConfigPage from "./admin/quiz-ui/QuizUIConfigPage";
import QuizAnalyticsPage from "./admin/quiz/QuizAnalyticsPage";

/* ADMIN — PUZZLES */
import PuzzlesDashboardPage from "./admin/puzzles/PuzzlesDashboardPage";

function App() {
  return (
    <div className="app-bg">
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />

        {/* QUIZ HUB */}
        <Route path="/quiz" element={<QuizzesPage />} />
        <Route path="/quiz/:category" element={<CategoryLevelsPage />} />
        <Route path="/quiz/:category/:difficulty" element={<CategoryLevelsPage />} />
        <Route path="/quiz/:category/:difficulty/:level" element={<QuizPage />} />

        {/* LEADERBOARD */}
        <Route path="/leaderboard/:categoryId" element={<LeaderboardPage />} />

        {/* USER */}
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<UserSettingsPage />} />

        {/* ADMIN — GENERAL */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/categories" element={<CategoriesPage />} />
        <Route path="/admin/scores" element={<AdminScoresPage />} />
        <Route path="/admin/import" element={<ImportQuestionsPage />} />
        <Route path="/admin/ui-mode" element={<UiModeSettingsPage />} />

        {/* ADMIN — QUIZ */}
        <Route path="/admin/add-question" element={<AddQuestionPage />} />
        <Route path="/admin/view-questions" element={<ViewQuestionsPage />} />
        <Route path="/admin/edit-question/:id" element={<EditQuestionPage />} />
        <Route path="/admin/quiz-ui" element={<QuizUIConfigPage />} />
        <Route path="/admin/quiz/analytics" element={<QuizAnalyticsPage />} />

        {/* ADMIN — PUZZLES */}
        <Route
          path="/admin/puzzles/dashboard"
          element={<PuzzlesDashboardPage />}
        />
      </Routes>
    </div>
  );
}

export default App;