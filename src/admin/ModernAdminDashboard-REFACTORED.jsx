import React, { useState, useEffect, useMemo, useCallback } from 'react';
import SiteLayout from '../layouts/SiteLayout';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { useAppIntegration } from '../hooks/useAppIntegration';
import QuizBuilder from '../quiz/components/QuizBuilder';
import AnalyticsDashboard from '../dashboard/AnalyticsDashboard';
import { useAuth } from '../components/AuthProvider';
import { db } from '../firebase/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import QuizEditModal from './modals/QuizEditModal';
import PuzzleEditModal from './modals/PuzzleEditModal';
import StoryEditModal from './modals/StoryEditModal';
import QuizDetailsModal from './modals/QuizDetailsModal';
import PuzzleDetailsModal from './modals/PuzzleDetailsModal';
import StoryDetailsModal from './modals/StoryDetailsModal';
import BulkImport from './modals/BulkImport';
import PuzzleTemplateModal from './modals/PuzzleTemplateModal';
import { ADMIN_TABS, DASHBOARD_STATS } from './dashboard-setup';
import { useAdminDashboard } from './dashboard-hooks/useAdminDashboard';
import { createDashboardHandlers } from './dashboard-handlers';

// Tab Components (extracted from massive JSX)
import OverviewTab from './dashboard-sections/OverviewTab';
import QuizzesTab from './dashboard-sections/QuizzesTab';
import PuzzlesTab from './dashboard-sections/PuzzlesTab';
import StoriesTab from './dashboard-sections/StoriesTab';

const CATEGORIES = ['Science', 'Math', 'History', 'Geography', 'Literature', 'Technology'];
const DIFFICULTIES = ['Easy', 'Medium', 'Hard', 'Expert'];
const PUZZLE_TYPES = ['Jigsaw', 'Sudoku', 'Crossword', 'Logic', 'Matching', 'Pattern'];
const STORY_CATEGORIES = ['Adventure', 'Mystery', 'Science', 'Fantasy', 'History', 'Educational'];

export default function ModernAdminDashboard() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { quizService, currentTheme } = useAppIntegration();
  const { user } = useAuth();

  // ===== STATE FROM CUSTOM HOOK =====
  const state = useAdminDashboard();

  // ===== HANDLERS =====
  const handlers = useMemo(() => createDashboardHandlers(state, (updates) => {
    Object.entries(updates).forEach(([key, value]) => {
      const setterName = `set${key.charAt(0).toUpperCase() + key.slice(1)}`;
      if (state[setterName]) {
        state[setterName](value);
      }
    });
  }), [state]);

  // ===== COMPUTED VALUES =====
  const dashboardStats = useMemo(
    () => DASHBOARD_STATS(state.quizzes, state.puzzles, state.stories),
    [state.quizzes, state.puzzles, state.stories]
  );

  // ===== EFFECTS =====
  useEffect(() => {
    if (handlers) {
      handlers.fetchExistingData();
      handlers.seedBasePuzzleTemplates();
      handlers.loadCategories();
    }
  }, [handlers]);

  useEffect(() => {
    if (handlers) {
      handlers.updateFilters();
    }
  }, [
    state.statusFilter,
    state.visibilityFilter,
    state.featuredFilter,
    state.quizzes,
    state.puzzles,
    state.stories,
    handlers,
  ]);

  // ===== HANDLER FUNCTIONS =====
  const handleEditQuizSave = useCallback(updatedData => {
    state.setQuizzes(quizzes =>
      quizzes.map(q => (q.id === state.editingQuiz.id ? { ...state.editingQuiz, ...updatedData } : q))
    );
    state.setEditingQuiz(null);
  }, [state]);

  const handleEditPuzzleSave = useCallback(updatedData => {
    state.setPuzzles(puzzles =>
      puzzles.map(p => (p.id === state.editingPuzzle.id ? { ...state.editingPuzzle, ...updatedData } : p))
    );
    state.setEditingPuzzle(null);
  }, [state]);

  const handleEditStorySave = useCallback(updatedData => {
    state.setStories(stories =>
      stories.map(s => (s.id === state.editingStory.id ? { ...state.editingStory, ...updatedData } : s))
    );
    state.setEditingStory(null);
  }, [state]);

  const handleSaveQuizFromBuilder = useCallback(async quizData => {
    try {
      if (!quizData || !quizData.title) {
        alert('❌ Please provide a quiz title');
        return;
      }

      const quizWithMetadata = {
        title: quizData.title,
        description: quizData.description || '',
        category: quizData.category || 'General',
        difficulty: quizData.difficulty || 'Medium',
        questions: quizData.questions || [],
        tags: quizData.tags || [],
        createdDate: new Date(),
        updatedDate: new Date(),
        status: 'Draft',
        plays: 0,
        published: false,
        author: user?.email || 'admin',
      };

      if (quizService?.createQuiz) {
        const savedQuiz = await quizService.createQuiz(quizWithMetadata);
        state.setQuizzes([savedQuiz, ...state.quizzes]);
      } else {
        const docRef = await addDoc(collection(db, 'quizzes'), quizWithMetadata);
        state.setQuizzes([{ id: docRef.id, ...quizWithMetadata }, ...state.quizzes]);
      }

      alert(`✅ Quiz "${quizData.title}" saved successfully!`);
      state.setActiveTab('quizzes');
    } catch (error) {
      console.error('Error saving quiz:', error);
      alert(`❌ Error saving quiz: ${error.message}`);
    }
  }, [quizService, user, state]);

  if (state.loading) {
    return (
      <SiteLayout>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
          flexDirection: 'column',
          gap: '16px',
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: `4px solid ${theme.border}`,
            borderTop: `4px solid ${theme.accentPrimary}`,
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }}></div>
          <p style={{ color: theme.textSecondary }}>Loading dashboard...</p>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      {/* Modals */}
      <QuizEditModal
        quiz={state.editingQuiz}
        isOpen={!!state.editingQuiz}
        onClose={() => state.setEditingQuiz(null)}
        onSave={handleEditQuizSave}
      />
      <PuzzleEditModal
        puzzle={state.editingPuzzle}
        isOpen={!!state.editingPuzzle}
        onClose={() => state.setEditingPuzzle(null)}
        onSave={handleEditPuzzleSave}
      />
      <StoryEditModal
        story={state.editingStory}
        isOpen={!!state.editingStory}
        onClose={() => state.setEditingStory(null)}
        onSave={handleEditStorySave}
      />
      <QuizDetailsModal
        quiz={state.viewingQuiz}
        isOpen={!!state.viewingQuiz}
        onClose={() => state.setViewingQuiz(null)}
      />
      <PuzzleDetailsModal
        puzzle={state.viewingPuzzle}
        isOpen={!!state.viewingPuzzle}
        onClose={() => state.setViewingPuzzle(null)}
      />
      <StoryDetailsModal
        story={state.viewingStory}
        isOpen={!!state.viewingStory}
        onClose={() => state.setViewingStory(null)}
      />
      <PuzzleTemplateModal
        isOpen={state.showTemplateModal}
        onClose={() => state.setShowTemplateModal(false)}
      />

      <BulkImport
        isOpen={state.showBulkImport === 'quiz'}
        onClose={() => state.setShowBulkImport(null)}
        dataType="quiz"
        categories={CATEGORIES}
      />
      <BulkImport
        isOpen={state.showBulkImport === 'puzzle'}
        onClose={() => state.setShowBulkImport(null)}
        dataType="puzzle"
        categories={PUZZLE_TYPES}
      />
      <BulkImport
        isOpen={state.showBulkImport === 'story'}
        onClose={() => state.setShowBulkImport(null)}
        dataType="story"
        categories={STORY_CATEGORIES}
      />

      <div style={{ minHeight: '100vh', padding: '40px 20px' }}>
        <div style={{ maxWidth: '100%', margin: '0 auto', padding: '0 20px' }}>
          {/* Hero Section */}
          <div style={{
            marginBottom: '50px',
            textAlign: 'center',
            background: `linear-gradient(135deg, ${theme.accentPrimary}20, ${theme.accentSecondary}20)`,
            borderRadius: '24px',
            padding: '60px 40px',
            border: `2px solid ${theme.border}`,
            backdropFilter: 'blur(10px)',
          }}>
            <h1 style={{
              color: theme.accentPrimary,
              fontSize: 'clamp(32px, 5vw, 48px)',
              fontWeight: '800',
              margin: '0 0 16px 0',
            }}>
              🎛️ Admin Control Center
            </h1>
            <p style={{
              color: theme.textSecondary,
              fontSize: '18px',
              margin: '0',
            }}>
              Manage all content, users, and platform settings
            </p>
          </div>

          {/* Tab Navigation */}
          <div style={{
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap',
            marginBottom: '40px',
            borderBottom: `2px solid ${theme.border}`,
            paddingBottom: '16px',
          }}>
            {ADMIN_TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => state.setActiveTab(tab.id)}
                style={{
                  padding: '12px 24px',
                  background: state.activeTab === tab.id ? `linear-gradient(135deg, ${theme.accentPrimary}, ${theme.accentSecondary})` : 'transparent',
                  color: state.activeTab === tab.id ? '#fff' : theme.textPrimary,
                  border: `2px solid ${state.activeTab === tab.id ? 'transparent' : theme.border}`,
                  borderRadius: '12px',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseOver={e => {
                  if (state.activeTab !== tab.id) {
                    e.target.style.borderColor = theme.accentPrimary;
                    e.target.style.background = `${theme.accentPrimary}15`;
                  }
                }}
                onMouseOut={e => {
                  if (state.activeTab !== tab.id) {
                    e.target.style.borderColor = theme.border;
                    e.target.style.background = 'transparent';
                  }
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {state.activeTab === 'overview' && (
            <OverviewTab
              state={state}
              handlers={handlers}
              dashboardStats={dashboardStats}
              CATEGORIES={CATEGORIES}
            />
          )}

          {state.activeTab === 'quizzes' && (
            <QuizzesTab
              state={state}
              handlers={handlers}
              CATEGORIES={CATEGORIES}
              AUDIENCES={['All Users', 'Kids 5-12', 'Students 13-18', 'Professionals', 'Programmers']}
              DIFFICULTIES={DIFFICULTIES}
            />
          )}

          {state.activeTab === 'puzzles' && (
            <PuzzlesTab
              state={state}
              handlers={handlers}
              PUZZLE_TYPES={PUZZLE_TYPES}
              AUDIENCES={['All Users', 'Kids 5-12', 'Students 13-18', 'Professionals', 'Programmers']}
              DIFFICULTIES={DIFFICULTIES}
            />
          )}

          {state.activeTab === 'stories' && (
            <StoriesTab
              state={state}
              handlers={handlers}
              STORY_CATEGORIES={STORY_CATEGORIES}
              AUDIENCES={['All Users', 'Kids 5-12', 'Students 13-18', 'Professionals', 'Programmers']}
            />
          )}

          {/* Quiz Builder Tab */}
          {state.activeTab === 'quiz-builder' && (
            <QuizBuilder
              onSaveQuiz={handleSaveQuizFromBuilder}
              theme={currentTheme}
              breakpoints={{ isMobile: window.innerWidth < 768 }}
              getResponsivePadding={() => '16px'}
            />
          )}

          {/* Analytics Tab */}
          {state.activeTab === 'analytics' && (
            <AnalyticsDashboard
              userId={user?.uid}
              theme={currentTheme}
              breakpoints={{ isMobile: window.innerWidth < 768 }}
              getResponsivePadding={() => '16px'}
            />
          )}
        </div>
      </div>
    </SiteLayout>
  );
}
