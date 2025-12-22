// src/App.js
import React from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

/* PUBLIC */
import HomePage from "./home/HomePage";
import LeaderboardPage from "./pages/LeaderboardPage";

/* QUIZ */
import QuizzesPage from "./quiz/QuizzesPage";
import SubcategoryPage from "./quiz/SubcategoryPage";
import TopicPage from "./quiz/TopicPage";
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
import AutomationTestPage from "./admin/AutomationTestPage";
import FeatureCategoryManagement from "./admin/FeatureCategoryManagement";

/* ADMIN — QUIZ */
import AddQuestionPage from "./admin/AddQuestionPage";
import ViewQuestionsPage from "./admin/ViewQuestionsPage";
import EditQuestionPage from "./admin/EditQuestionPage";
import QuizUIConfigPage from "./admin/quiz-ui/QuizUIConfigPage";
import QuizAnalyticsPage from "./admin/quiz/QuizAnalyticsPage";
import UpdateSubcategoryTopics from "./admin/UpdateSubcategoryTopics";
import UpdateQuestionsSubtopicPage from "./admin/UpdateQuestionsSubtopicPage";
import InitializeFirebaseStructure from "./admin/InitializeFirebaseStructure";
import FixFirebaseStructure from "./admin/FixFirebaseStructure";
import SystemToolsPage from "./admin/SystemToolsPage";

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
        <Route path="/quiz/:categoryName" element={<SubcategoryPage />} />
        <Route path="/quiz/:categoryName/:topicName" element={<TopicPage />} />
        <Route path="/quiz/:categoryName/:topicName/:subtopicName/:difficulty" element={<CategoryLevelsPage />} />
        <Route path="/quiz/:categoryName/:topicName/:subtopicName/:difficulty/:level" element={<QuizPage />} />

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
        <Route path="/admin/automation-tests" element={<AutomationTestPage />} />
        <Route path="/admin/features" element={<FeatureCategoryManagement />} />

        {/* ADMIN — QUIZ */}
        <Route path="/admin/add-content" element={<AddQuestionPage />} />
        <Route path="/admin/view-questions" element={<ViewQuestionsPage />} />
        <Route path="/admin/edit-question/:id" element={<EditQuestionPage />} />
        <Route path="/admin/quiz-ui" element={<QuizUIConfigPage />} />
        <Route path="/admin/quiz/analytics" element={<QuizAnalyticsPage />} />
        <Route path="/admin/update-topics" element={<UpdateSubcategoryTopics />} />
        <Route path="/admin/update-subtopics" element={<UpdateQuestionsSubtopicPage />} />
        <Route path="/admin/initialize" element={<InitializeFirebaseStructure />} />
        <Route path="/admin/fix-structure" element={<FixFirebaseStructure />} />
        <Route path="/admin/system-tools" element={<SystemToolsPage />} />

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