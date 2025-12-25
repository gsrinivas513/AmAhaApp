import DebugPuzzleFields from "./admin/DebugPuzzleFields";
import DebugPuzzlesCategory from "./admin/DebugPuzzlesCategory";
import DebugCategories from "./admin/DebugCategories";
import FixPuzzleCategories from "./admin/FixPuzzleCategories";
import FixPuzzleCategoryDirect from "./admin/FixPuzzleCategoryDirect";
import FixPuzzleHierarchy from "./admin/FixPuzzleHierarchy";
import FixPuzzlePublished from "./admin/FixPuzzlePublished";
import FixPuzzleType from "./admin/FixPuzzleType";
import PuzzlePlayHierarchicalPage from "./puzzles/PuzzlePlayHierarchicalPage";
// src/App.js
import React from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar"; // DEPRECATED: Functionality moved to TopNavBar
import TopNavBar from "./components/navigation/TopNavBar";

/* PUBLIC */
import HomePage from "./home/HomePage";
import LeaderboardPage from "./pages/LeaderboardPage";
import AllFeaturesPage from "./pages/AllFeaturesPage";
import ExploreCategoriesPage from "./pages/ExploreCategoriesPage";
import DailyChallengePage from "./pages/DailyChallengePage";
import LeaderboardsPage from "./pages/LeaderboardsPage";
import StoryMapPage from "./pages/StoryMapPage";
import StoryDetailPage from "./pages/StoryDetailPage";
import CategoryPage from "./pages/CategoryPage";
import FeaturePage from "./pages/FeaturePage";

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
import NavigationConfigPage from "./admin/NavigationConfigPage";

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
import AddPuzzlePage from "./admin/AddPuzzlePage";
import PuzzleListPage from "./admin/PuzzleListPage";
import PuzzlesDashboardPage from "./admin/puzzles/PuzzlesDashboardPage";
import VisualPuzzleAdminPage from "./admin/VisualPuzzleAdminPage";
import SocialMediaManagerPage from "./admin/SocialMediaManagerPage";
import DailyChallengeAdmin from "./admin/DailyChallengeAdmin";
import StoryEditor from "./admin/StoryEditor";
import AnalyticsPage from "./admin/AnalyticsPage";

/* PUZZLES - USER */
import PuzzleCategoryPage from "./puzzles/PuzzleCategoryPage";
import PuzzleTopicPage from "./puzzles/PuzzleTopicPage";
import PuzzleSubcategoryPage from "./puzzles/PuzzleSubcategoryPage";
import PuzzlePlayPage from "./puzzles/PuzzlePlayPage";
import VisualPuzzlePlayPage from "./puzzles/VisualPuzzlePlayPage";
import UnifiedPuzzlePage from "./puzzles/UnifiedPuzzlePage";

function App() {
  return (
    <div className="app-bg">
      <TopNavBar />
      {/* DEPRECATED: Navbar component merged into TopNavBar to avoid duplicate panels */}
      {/* <Navbar /> */}

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/categories" element={<AllFeaturesPage />} />
        <Route path="/explore" element={<ExploreCategoriesPage />} />

        {/* FEATURE & CATEGORY PAGES */}
        <Route path="/feature/:id" element={<FeaturePage />} />
        <Route path="/category/:id" element={<CategoryPage />} />
        <Route path="/category/:id/topic/:topicId" element={<CategoryPage />} />

        {/* QUIZ HUB */}
        <Route path="/quiz" element={<QuizzesPage />} />
        <Route path="/quiz/:categoryName" element={<SubcategoryPage />} />
        <Route path="/quiz/:categoryName/:topicName" element={<TopicPage />} />
        <Route path="/quiz/:categoryName/:topicName/:subtopicName/:difficulty" element={<CategoryLevelsPage />} />
        <Route path="/quiz/:categoryName/:topicName/:subtopicName/:difficulty/:level" element={<QuizPage />} />

        {/* LEADERBOARD */}
        <Route path="/leaderboard/:categoryId" element={<LeaderboardPage />} />
        <Route path="/leaderboards" element={<LeaderboardsPage />} />
        
        {/* DAILY CHALLENGE */}
        <Route path="/daily-challenge" element={<DailyChallengePage />} />
        
        {/* STORIES */}
        <Route path="/stories" element={<StoryMapPage />} />
        <Route path="/story/:storyId" element={<StoryDetailPage />} />

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
        <Route path="/admin/navigation" element={<NavigationConfigPage />} />

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
        <Route path="/admin/puzzles" element={<PuzzleListPage />} />
        <Route path="/admin/add-puzzle" element={<AddPuzzlePage />} />
        <Route path="/admin/add-puzzle/:puzzleId" element={<AddPuzzlePage />} />
        <Route path="/admin/puzzles/dashboard" element={<PuzzlesDashboardPage />} />
        <Route path="/admin/create-visual-puzzle" element={<VisualPuzzleAdminPage />} />
        <Route path="/admin/create-visual-puzzle/:puzzleId" element={<VisualPuzzleAdminPage />} />
        <Route path="/admin/social-media" element={<SocialMediaManagerPage />} />
        <Route path="/admin/daily-challenge" element={<DailyChallengeAdmin />} />
        <Route path="/admin/stories" element={<StoryEditor />} />
        <Route path="/admin/analytics" element={<AnalyticsPage />} />
        <Route path="/admin/debug-puzzles-category" element={<DebugPuzzlesCategory />} />
        <Route path="/admin/debug-categories" element={<DebugCategories />} />
        <Route path="/admin/fix-puzzle-categories" element={<FixPuzzleCategories />} />
        <Route path="/admin/fix-puzzle-category-direct" element={<FixPuzzleCategoryDirect />} />
        <Route path="/admin/fix-puzzle-hierarchy" element={<FixPuzzleHierarchy />} />
        <Route path="/admin/fix-puzzle-published" element={<FixPuzzlePublished />} />
        <Route path="/admin/fix-puzzle-type" element={<FixPuzzleType />} />

        {/* PUZZLES - USER */}
        <Route path="/puzzle" element={<PuzzleTopicPage />} />
        <Route path="/puzzle/:categoryName" element={<PuzzleTopicPage />} />
        <Route path="/puzzle/:categoryName/:topicName" element={<PuzzleSubcategoryPage />} />
        <Route path="/puzzle/:categoryName/:topicName/:puzzleId" element={<UnifiedPuzzlePage />} />
      </Routes>
    </div>
  );
}

export default App;