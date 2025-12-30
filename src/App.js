import DebugPuzzleFields from "./admin/DebugPuzzleFields";
import DebugPuzzlesCategory from "./admin/DebugPuzzlesCategory";
import DebugCategories from "./admin/DebugCategories";
import FixPuzzleCategories from "./admin/FixPuzzleCategories";
import FixPuzzleCategoryDirect from "./admin/FixPuzzleCategoryDirect";
import FixPuzzleHierarchy from "./admin/FixPuzzleHierarchy";
import FixPuzzlePublished from "./admin/FixPuzzlePublished";
import FixPuzzleType from "./admin/FixPuzzleType";
import PuzzlePublishedFix from "./admin/PuzzlePublishedFix";
import NumbersOrderingPuzzleSetupPage from "./admin/NumbersOrderingPuzzleSetupPage";
import PuzzlePlayHierarchicalPage from "./puzzles/PuzzlePlayHierarchicalPage";
import CreateOrderingPuzzlesFromTemplatesPage from "./admin/CreateOrderingPuzzlesFromTemplatesPage";
// src/App.js
import React from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar"; // DEPRECATED: Functionality moved to TopNavBar
import TopNavBar from "./components/navigation/TopNavBar";

/* PUBLIC */
import HomePagePuzzleFreeExact from "./home/HomePagePuzzleFreeExact";
import LeaderboardPage from "./pages/LeaderboardPage";
import AllFeaturesPage from "./pages/AllFeaturesPage";
import ExploreCategoriesPage from "./pages/ExploreCategoriesPage";
import DailyChallengePage from "./pages/DailyChallengePage";
import LeaderboardsPage from "./pages/LeaderboardsPage";
import StoryMapPage from "./pages/StoryMapPage";
import StoryDetailPage from "./pages/StoryDetailPage";
import StoriesCategoryPage from "./story/pages/StoriesCategoryPage";
import StoriesTopicPage from "./story/pages/StoriesTopicPage";
import StoriesSubtopicPage from "./story/pages/StoriesSubtopicPage";
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
import ImportQuestionsPage from "./admin/ImportQuestionsPage";
import UiModeSettingsPage from "./admin/UiModeSettingsPage";
import AutomationTestPage from "./admin/AutomationTestPage";
import FeatureCategoryManagement from "./admin/FeatureCategoryManagement";
import NavigationConfigPage from "./admin/NavigationConfigPage";
import DebugAllCategories from "./admin/DebugAllCategories";
import InspectCollectionsPage from "./admin/InspectCollectionsPage";
import CloudinaryImageManager from "./admin/CloudinaryImageManager";
import ImageDeduplicationPanel from "./admin/ImageDeduplicationPanel";
import ImageCropEditor from "./admin/ImageCropEditor";

/* ADMIN — QUIZ */
import AddQuestionPage from "./admin/AddQuestionPage";
import EditQuestionPage from "./admin/EditQuestionPage";
import QuizUIConfigPage from "./admin/quiz-ui/QuizUIConfigPage";
import QuizAnalyticsPage from "./admin/quiz/QuizAnalyticsPage";
import UpdateSubcategoryTopics from "./admin/UpdateSubcategoryTopics";
import UpdateQuestionsSubtopicPage from "./admin/UpdateQuestionsSubtopicPage";
import InitializeFirebaseStructure from "./admin/InitializeFirebaseStructure";
import DocumentDeletePage from "./admin/DocumentDeletePage";
import FixFirebaseStructure from "./admin/FixFirebaseStructure";
import SystemToolsPage from "./admin/SystemToolsPage";
import FixQuizzesMissingFeatureIds from "./admin/FixQuizzesMissingFeatureIds";
import FixQuizzesFeatureIdMismatch from "./admin/FixQuizzesFeatureIdMismatch";
import StandardizeFeaturesCollection from "./admin/StandardizeFeaturesCollection";
import DatabaseArchitectureAudit from "./admin/DatabaseArchitectureAudit";
import FixOrphanedPuzzles from "./admin/FixOrphanedPuzzles";
import FixGenericPuzzleTypes from "./admin/FixGenericPuzzleTypes";
import PopulateMissingPuzzleData from "./admin/PopulateMissingPuzzleData";
import DeleteIncompletePuzzles from "./admin/DeleteIncompletePuzzles";
import PuzzleDataValidator from "./admin/PuzzleDataValidator";

/* ADMIN — PUZZLES */
import AddPuzzlePage from "./admin/AddPuzzlePage";
import PuzzleListPage from "./admin/PuzzleListPage";
import PuzzlesDashboardPage from "./admin/puzzles/PuzzlesDashboardPage";
import VisualPuzzleAdminPage from "./admin/VisualPuzzleAdminPage";
import CreateTraditionalPuzzlePage from "./admin/CreateTraditionalPuzzlePage";
import CreateLogicalPuzzlePage from "./admin/CreateLogicalPuzzlePage";
import SocialMediaManagerPage from "./admin/SocialMediaManagerPage";
import DailyChallengeAdmin from "./admin/DailyChallengeAdmin";
import StoryEditor from "./admin/StoryEditor";
import AnalyticsPage from "./admin/AnalyticsPage";
import CreateTestPuzzlesPage from "./admin/CreateTestPuzzlesPage";
import RegenerateOrderingPuzzlesPage from "./admin/RegenerateOrderingPuzzlesPage";
import PuzzleRecordCreatorTool from "./admin/PuzzleRecordCreatorTool";
import InitializeStoriesPage from "./pages/InitializeStoriesPage";

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
        <Route path="/" element={<HomePagePuzzleFreeExact />} />
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
        <Route path="/stories/initialize" element={<InitializeStoriesPage />} />
        <Route path="/stories/category/:categoryName" element={<StoriesCategoryPage />} />
        <Route path="/stories/category/:categoryName/topic/:topicName" element={<StoriesTopicPage />} />
        <Route path="/stories/category/:categoryName/topic/:topicName/subtopic/:subtopicName" element={<StoriesSubtopicPage />} />
        <Route path="/story/:storyId" element={<StoryDetailPage />} />
        <Route path="/stories/:storyId" element={<StoryDetailPage />} />

        {/* USER */}
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<UserSettingsPage />} />

        {/* ADMIN — GENERAL */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/categories" element={<CategoriesPage />} />
        <Route path="/admin/import" element={<ImportQuestionsPage />} />
        <Route path="/admin/ui-mode" element={<UiModeSettingsPage />} />
        <Route path="/admin/automation-tests" element={<AutomationTestPage />} />
        <Route path="/admin/features" element={<FeatureCategoryManagement />} />
        <Route path="/admin/debug-categories" element={<DebugAllCategories />} />
        <Route path="/admin/navigation" element={<NavigationConfigPage />} />
        <Route path="/admin/inspect-collections" element={<InspectCollectionsPage />} />
        <Route path="/admin/cloudinary" element={<CloudinaryImageManager />} />
        <Route path="/admin/image-deduplication" element={<ImageDeduplicationPanel />} />
        <Route path="/admin/image-crop-editor" element={<ImageCropEditor />} />

        {/* ADMIN — QUIZ */}
        <Route path="/admin/add-quiz-content" element={<AddQuestionPage />} />
        <Route path="/admin/edit-question/:id" element={<EditQuestionPage />} />
        <Route path="/admin/quiz-ui" element={<QuizUIConfigPage />} />
        <Route path="/admin/quiz/analytics" element={<QuizAnalyticsPage />} />
        <Route path="/admin/update-topics" element={<UpdateSubcategoryTopics />} />
        <Route path="/admin/update-subtopics" element={<UpdateQuestionsSubtopicPage />} />
        <Route path="/admin/initialize" element={<InitializeFirebaseStructure />} />
        <Route path="/admin/delete-documents" element={<DocumentDeletePage />} />
        <Route path="/admin/fix-structure" element={<FixFirebaseStructure />} />
        <Route path="/admin/system-tools" element={<SystemToolsPage />} />
        <Route path="/admin/fix-quizzes" element={<FixQuizzesMissingFeatureIds />} />
        <Route path="/admin/fix-feature-mismatch" element={<FixQuizzesFeatureIdMismatch />} />
        <Route path="/admin/standardize-features" element={<StandardizeFeaturesCollection />} />
        <Route path="/admin/database-audit" element={<DatabaseArchitectureAudit />} />
        <Route path="/admin/fix-orphaned-puzzles" element={<FixOrphanedPuzzles />} />
        <Route path="/admin/fix-generic-puzzle-types" element={<FixGenericPuzzleTypes />} />
        <Route path="/admin/populate-missing-puzzle-data" element={<PopulateMissingPuzzleData />} />
        <Route path="/admin/delete-incomplete-puzzles" element={<DeleteIncompletePuzzles />} />
        <Route path="/admin/validate-puzzle-data" element={<PuzzleDataValidator />} />

        {/* ADMIN — PUZZLES */}
        <Route path="/admin/puzzles" element={<PuzzleListPage />} />
        <Route path="/admin/puzzles/create" element={<VisualPuzzleAdminPage />} />
        <Route path="/admin/puzzles/create/:puzzleId" element={<VisualPuzzleAdminPage />} />
        <Route path="/admin/add-puzzle" element={<AddPuzzlePage />} />
        <Route path="/admin/add-puzzle/:puzzleId" element={<AddPuzzlePage />} />
        <Route path="/admin/puzzles/dashboard" element={<PuzzlesDashboardPage />} />
        <Route path="/admin/create-traditional-puzzle" element={<CreateTraditionalPuzzlePage />} />
        <Route path="/admin/create-logical-puzzle" element={<CreateLogicalPuzzlePage />} />
        <Route path="/admin/create-visual-puzzle" element={<VisualPuzzleAdminPage />} />
        <Route path="/admin/create-visual-puzzle/:puzzleId" element={<VisualPuzzleAdminPage />} />
        <Route path="/admin/create-ordering-puzzles" element={<CreateOrderingPuzzlesFromTemplatesPage />} />
        <Route path="/admin/puzzle-record-creator" element={<PuzzleRecordCreatorTool />} />
        <Route path="/admin/social-media" element={<SocialMediaManagerPage />} />
        <Route path="/admin/daily-challenge" element={<DailyChallengeAdmin />} />
        <Route path="/admin/stories" element={<StoryEditor />} />
        <Route path="/admin/create-test-puzzles" element={<CreateTestPuzzlesPage />} />
        <Route path="/admin/regenerate-ordering-puzzles" element={<RegenerateOrderingPuzzlesPage />} />
        <Route path="/admin/analytics" element={<AnalyticsPage />} />
        <Route path="/admin/debug-puzzles-category" element={<DebugPuzzlesCategory />} />
        <Route path="/admin/debug-categories" element={<DebugCategories />} />
        <Route path="/admin/fix-puzzle-categories" element={<FixPuzzleCategories />} />
        <Route path="/admin/fix-puzzle-category-direct" element={<FixPuzzleCategoryDirect />} />
        <Route path="/admin/fix-puzzle-hierarchy" element={<FixPuzzleHierarchy />} />
        <Route path="/admin/fix-puzzle-published" element={<FixPuzzlePublished />} />
        <Route path="/admin/fix-puzzle-published-fix" element={<PuzzlePublishedFix />} />
        <Route path="/admin/numbers-ordering-setup" element={<NumbersOrderingPuzzleSetupPage />} />
        <Route path="/admin/fix-puzzle-type" element={<FixPuzzleType />} />

        {/* PUZZLES - USER */}
        <Route path="/puzzle" element={<PuzzleTopicPage />} />
        <Route path="/puzzle/:categoryName" element={<PuzzleTopicPage />} />
        <Route path="/puzzle/:categoryName/:topicName" element={<PuzzleSubcategoryPage />} />
        <Route path="/puzzle/:categoryName/:topicName/:subtopicName" element={<PuzzleCategoryPage />} />
        <Route path="/puzzle/:categoryName/:topicName/:subtopicName/:puzzleId" element={<UnifiedPuzzlePage />} />
        
        {/* DIRECT PLAY - Skip navigation, go straight to puzzle */}
        <Route path="/play/:puzzleId" element={<UnifiedPuzzlePage />} />
      </Routes>
    </div>
  );
}

export default App;