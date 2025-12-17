// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import HomePage from "./pages/HomePage";
import LeaderboardPage from "./pages/LeaderboardPage";

import UiModeSettingsPage from "./admin/UiModeSettingsPage";

// Admin Pages
import AdminDashboard from "./admin/AdminDashboard";
import AddQuestionPage from "./admin/AddQuestionPage";
import ViewQuestionsPage from "./admin/ViewQuestionsPage";
import EditQuestionPage from "./admin/EditQuestionPage";
import CategoriesPage from "./admin/CategoriesPage";
import AdminScoresPage from "./admin/AdminScoresPage";
import QuestionAnalyticsAdvanced from "./admin/QuestionAnalyticsAdvanced";
import ImportQuestionsPage from "./admin/ImportQuestionsPage";

// Quiz pages
import DifficultySelectionPage from "./quiz/DifficultySelectionPage";
import CategoryLevelsPage from "./quiz/CategoryLevelsPage";
import QuizPage from "./quiz/QuizPage";
import UserSettingsPage from "./pages/UserSettingsPage";
import ProfilePage from "./pages/ProfilePage";


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* HOME */}
        <Route path="/" element={<HomePage />} />

        {/* LEADERBOARD */}
        <Route path="/leaderboard/:categoryId" element={<LeaderboardPage />} />

        {/* ADMIN */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/add-question" element={<AddQuestionPage />} />
        <Route path="/admin/view-questions" element={<ViewQuestionsPage />} />
        <Route path="/admin/edit-question/:id" element={<EditQuestionPage />} />
        <Route path="/admin/categories" element={<CategoriesPage />} />
        <Route path="/admin/scores" element={<AdminScoresPage />} />
        <Route path="/admin/analytics" element={<QuestionAnalyticsAdvanced />} />
        <Route path="/admin/import" element={<ImportQuestionsPage />} />
        <Route path="/admin/ui-mode" element={<UiModeSettingsPage />} />

        {/* QUIZ ROUTES */}
        {/* QUIZ ROUTES — ORDER MATTERS */}
<Route path="/quiz/:category/:difficulty/:level" element={<QuizPage />} />
<Route path="/quiz/:category/:difficulty" element={<CategoryLevelsPage />} />
<Route path="/quiz/:category" element={<DifficultySelectionPage />} />

<Route path="/profile" element={<ProfilePage />} />

<Route path="/settings" element={<UserSettingsPage />} />

           </Routes>
    </Router>
  );
}

export default App;