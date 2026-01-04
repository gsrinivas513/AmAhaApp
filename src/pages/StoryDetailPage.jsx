/**
 * StoryDetailPage.jsx
 * 
 * Displays a single story with chapters - Kid-friendly design
 * User can read chapters and track progress
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthProvider';
import { useTheme } from '../context/ThemeContext';
import SiteLayout from '../layouts/SiteLayout';
import {
  getStory,
  getChapters,
  getStoryProgress,
  completeChapter
} from '../services/storyService';
import '../styles/StoryDetailPage.css';

export default function StoryDetailPage() {
  const { storyId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme } = useTheme();
  
  // Debug logging
  useEffect(() => {
    console.log('👤 Current user:', user);
    console.log('📖 Story ID:', storyId);
  }, [user, storyId]);
  
  const [story, setStory] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [selectedChapterId, setSelectedChapterId] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showQuizPrompt, setShowQuizPrompt] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [isLastChapter, setIsLastChapter] = useState(false);
  const [quizData, setQuizData] = useState(null);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showQuizResult, setShowQuizResult] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState([]); // Track all answers
  const [quizScore, setQuizScore] = useState(0); // Track correct answers
  const [showQuizComplete, setShowQuizComplete] = useState(false); // Show completion modal
  const [currentAssessment, setCurrentAssessment] = useState(null); // Track which assessment is being taken

  useEffect(() => {
    const loadStoryData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load story details
        const storyData = await getStory(storyId);
        if (!storyData) {
          setError('Story not found');
          return;
        }
        setStory(storyData);

        // Load chapters
        const chaptersData = await getChapters(storyId);
        console.log('📚 Raw chapters data:', chaptersData);
        console.log('📚 First chapter:', chaptersData[0]);
        
        // Ensure chapters have properly structured assessment data
        const normalizedChapters = chaptersData.map(chapter => {
          console.log('Processing chapter:', chapter.title, 'Assessment:', chapter.assessment);
          
          let assessment = chapter.assessment;
          
          // If assessment is null or undefined, skip
          if (!assessment) {
            return chapter;
          }
          
          // Convert if assessment is a Firestore mapValue format
          if (assessment && typeof assessment === 'object') {
            if (assessment.mapValue?.fields) {
              console.log('Converting mapValue format for:', chapter.title);
              assessment = {
                type: assessment.mapValue.fields.type?.stringValue,
                id: assessment.mapValue.fields.id?.stringValue,
                required: assessment.mapValue.fields.required?.booleanValue
              };
            } else if (assessment.type && assessment.id) {
              // Already in normal format
              console.log('Assessment already normalized for:', chapter.title);
            }
          }
          
          console.log('Final assessment:', assessment);
          
          return {
            ...chapter,
            assessment
          };
        });
        
        console.log('📚 Normalized chapters:', normalizedChapters);
        setChapters(normalizedChapters);

        // Load user progress if logged in
        if (user) {
          const progressData = await getStoryProgress(user.uid, storyId);
          setProgress(progressData);
        } else {
          // For guests, load from localStorage
          const guestProgress = localStorage.getItem(`story_${storyId}_progress`);
          if (guestProgress) {
            setProgress(JSON.parse(guestProgress));
          } else {
            // Initialize empty progress for guest
            setProgress({
              userId: 'guest',
              storyId,
              completedChapters: [],
              currentChapter: 1,
              totalXpEarned: 0,
              lastPlayed: null,
              completed: false
            });
          }
        }

        // Select first chapter by default - USE NORMALIZED CHAPTERS
        if (normalizedChapters.length > 0) {
          setSelectedChapterId(normalizedChapters[0].id);
          setSelectedChapter(normalizedChapters[0]);
        }
      } catch (err) {
        console.error('Error loading story:', err);
        setError('Failed to load story');
      } finally {
        setLoading(false);
      }
    };

    loadStoryData();
  }, [storyId, user]);

  const handleChapterSelect = (chapter) => {
    // Normalize assessment if needed
    let normalizedChapter = chapter;
    if (chapter.assessment && chapter.assessment.mapValue?.fields) {
      normalizedChapter = {
        ...chapter,
        assessment: {
          type: chapter.assessment.mapValue.fields.type?.stringValue,
          id: chapter.assessment.mapValue.fields.id?.stringValue,
          required: chapter.assessment.mapValue.fields.required?.booleanValue
        }
      };
    }
    
    setSelectedChapterId(normalizedChapter.id);
    setSelectedChapter(normalizedChapter);
    
    // Check if this is the last chapter
    const currentIndex = chapters.findIndex(c => c.id === normalizedChapter.id);
    setIsLastChapter(currentIndex === chapters.length - 1);
  };

  const handleNextChapter = () => {
    const currentIndex = chapters.findIndex(c => c.id === selectedChapter.id);
    
    // If this is the last chapter, show quiz prompt
    if (currentIndex === chapters.length - 1) {
      setShowQuizPrompt(true);
    } else {
      // Otherwise, just go to next chapter
      handleChapterSelect(chapters[currentIndex + 1]);
    }
  };

  const loadAndStartQuiz = async (chapter) => {
    try {
      // Use passed chapter or fall back to selectedChapter
      const chapterToUse = chapter || selectedChapter;
      
      if (!chapterToUse?.assessment?.id || chapterToUse?.assessment?.type !== 'quiz') {
        alert('❌ This chapter does not have a quiz linked!');
        return;
      }

      // Fetch quiz from Firestore
      const quizId = chapterToUse.assessment.id;
      console.log('📝 Loading quiz:', quizId);

      // Try to fetch from quizzes collection
      const response = await fetch(
        `https://firestore.googleapis.com/v1/projects/amahaapp/databases/(default)/documents/quizzes/${quizId}?key=AIzaSyAR8-mpS85CEopQuGuP4Lhm3xieYbG1HcY`
      );

      if (response.ok) {
        const data = await response.json();
        const quiz = data.fields;
        
        // Convert Firestore values to JS objects
        const quizObject = {
          id: quizId,
          title: quiz.title?.stringValue || 'Quiz',
          description: quiz.description?.stringValue || '',
          questions: quiz.questions?.arrayValue?.values?.map(q => ({
            id: q.mapValue?.fields?.id?.stringValue,
            text: q.mapValue?.fields?.text?.stringValue,
            options: q.mapValue?.fields?.options?.arrayValue?.values?.map(o => o.stringValue) || [],
            correctAnswer: parseInt(q.mapValue?.fields?.correctAnswer?.integerValue || 0),
            explanation: q.mapValue?.fields?.explanation?.stringValue || ''
          })) || []
        };

        console.log('✅ Quiz loaded:', quizObject);
        setQuizData(quizObject);
        setCurrentQuizIndex(0);
        setSelectedAnswer(null);
        setShowQuizResult(false);
        setShowQuizPrompt(false);
      } else {
        console.error('Quiz not found');
        alert('❌ Could not load quiz. Please try again.');
      }
    } catch (err) {
      console.error('Error loading quiz:', err);
      alert('❌ Error loading quiz: ' + err.message);
    }
  };

  const handleQuizStart = () => {
    setShowQuizPrompt(false);
    
    console.log('🎯 handleQuizStart called');
    console.log('🎯 chapters state:', chapters);
    console.log('🎯 selectedChapterId:', selectedChapterId);
    console.log('🎯 selectedChapter:', selectedChapter);
    
    // Get the chapter from state's chapters array to ensure it has normalized assessment
    const chapterFromState = chapters.find(c => c.id === selectedChapterId);
    console.log('🎯 Chapter from state array:', chapterFromState);
    
    const chapterToUse = chapterFromState || selectedChapter;
    console.log('🎯 Chapter to use:', chapterToUse);
    console.log('🎯 Assessment from chapter to use:', chapterToUse?.assessment);
    
    // Try multiple ways to get the assessment ID
    let assessmentId = null;
    let assessmentType = null;
    
    const assessment = chapterToUse?.assessment;
    
    if (assessment) {
      // Direct properties
      if (assessment.id) assessmentId = assessment.id;
      if (assessment.type) assessmentType = assessment.type;
      
      // Log what we found
      console.log('🎯 Found assessmentId:', assessmentId, 'assessmentType:', assessmentType);
    }
    
    console.log('🎯 Final: ID=' + assessmentId + ', Type=' + assessmentType);
    
    if (assessmentId && assessmentType) {
      // Show celebration for completing the story
      setShowCelebration(true);
      
      // After celebration, load and start the assessment (quiz or puzzle)
      setTimeout(() => {
        setShowCelebration(false);
        // Mark the chapter as complete
        markChapterComplete();
        // Load assessment - pass the chapter to ensure it has assessment data
        if (assessmentType === 'quiz') {
          loadAndStartQuiz(chapterToUse);
        } else if (assessmentType === 'puzzle') {
          console.log('📦 Puzzle assessment detected, would load puzzle:', assessmentId);
          // TODO: Implement puzzle loading
          alert('📦 Puzzle support coming soon! Puzzle ID: ' + assessmentId);
        }
      }, 3000);
    } else {
      // No assessment linked - show message that story is incomplete
      alert('❌ No assessment linked to this chapter!');
      console.log('⚠️ Assessment not found. Assessment object:', assessment);
      console.log('⚠️ Chapter from state:', chapterFromState);
      console.log('⚠️ Selected chapter:', selectedChapter);
    }
  };

  const handleAnswerSelect = (optionIndex) => {
    if (!showQuizResult) {
      setSelectedAnswer(optionIndex);
    }
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) {
      alert('Please select an answer!');
      return;
    }
    
    // Track the answer
    const currentQuestion = quizData.questions[currentQuizIndex];
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    
    // Add to answers array
    const newAnswers = [...quizAnswers, {
      questionId: currentQuestion.id,
      selected: selectedAnswer,
      correct: currentQuestion.correctAnswer,
      isCorrect: isCorrect
    }];
    setQuizAnswers(newAnswers);
    
    // Update score if correct
    if (isCorrect) {
      setQuizScore(quizScore + 1);
      console.log('✅ Correct answer! Score:', quizScore + 1);
    } else {
      console.log('❌ Wrong answer. Score remains:', quizScore);
    }
    
    setShowQuizResult(true);
  };

  const handleNextQuestion = () => {
    if (currentQuizIndex < quizData.questions.length - 1) {
      // Move to next question
      setCurrentQuizIndex(currentQuizIndex + 1);
      setSelectedAnswer(null);
      setShowQuizResult(false);
    } else {
      // Quiz complete - check if passed
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    const totalQuestions = quizData.questions.length;
    const passingScore = Math.ceil(totalQuestions * 0.7); // 70% to pass
    const passed = quizScore >= passingScore;
    
    console.log(`📊 Quiz finished! Score: ${quizScore}/${totalQuestions}, Passing: ${passingScore}`);
    
    if (passed) {
      // Quiz passed - show success
      setShowQuizComplete(true);
      setQuizData(null);
    } else {
      // Quiz failed
      alert(`❌ Quiz Failed! You got ${quizScore}/${totalQuestions}.\nYou need ${passingScore} correct answers to pass.`);
      resetQuiz();
    }
  };

  const resetQuiz = () => {
    setQuizData(null);
    setCurrentQuizIndex(0);
    setSelectedAnswer(null);
    setShowQuizResult(false);
    setQuizAnswers([]);
    setQuizScore(0);
    setShowQuizPrompt(false);
  };

  const handleRetakeQuiz = () => {
    setShowQuizComplete(false);
    resetQuiz();
    
    // Reload the quiz
    const chapterFromState = chapters.find(c => c.id === selectedChapterId);
    if (chapterFromState) {
      loadAndStartQuiz(chapterFromState);
    }
  };

  const handleCompleteStory = async () => {
    console.log('🏆 Completing story with quiz success');
    
    // Award XP/coins for quiz success
    const xpReward = 150;
    const coinsReward = 30;
    
    setShowQuizComplete(false);
    
    // Show celebration animation
    setShowCelebration(true);
    
    // Update progress with story completion
    if (user) {
      const newProgress = {
        ...progress,
        completed: true,
        totalXpEarned: (progress?.totalXpEarned || 0) + xpReward,
        lastPlayed: new Date().toISOString()
      };
      setProgress(newProgress);
      console.log('🎉 Story completed! XP earned:', xpReward, 'Coins:', coinsReward);
    } else {
      // Guest user
      const newProgress = {
        userId: 'guest',
        storyId,
        completedChapters: progress?.completedChapters || [],
        currentChapter: selectedChapterId,
        totalXpEarned: (progress?.totalXpEarned || 0) + xpReward,
        completed: true,
        lastPlayed: new Date().toISOString()
      };
      setProgress(newProgress);
      localStorage.setItem(`story_${storyId}_progress`, JSON.stringify(newProgress));
    }
    
    // Navigate back after celebration
    setTimeout(() => {
      navigate('/stories');
    }, 3000);
  };

  const markChapterComplete = async () => {
    try {
      console.log('📖 Marking chapter as complete:', selectedChapter.title);
      
      // If user is logged in, save to Firestore
      if (user) {
        const result = await completeChapter(user.uid, storyId, selectedChapter.id, 0, 100);
        console.log('✅ Chapter completion result:', result);
        
        // Update local progress
        if (progress) {
          const newProgress = {
            ...progress,
            completedChapters: [...(progress.completedChapters || []), selectedChapter.id]
          };
          setProgress(newProgress);
          console.log('📊 Updated progress in Firestore:', newProgress);
        }
      } else {
        // For guests, just update local state and save to localStorage
        console.log('👤 Guest user - saving progress locally');
        const newProgress = {
          userId: 'guest',
          storyId,
          completedChapters: [...(progress?.completedChapters || []), selectedChapter.id],
          currentChapter: selectedChapter.id,
          totalXpEarned: (progress?.totalXpEarned || 0) + 100,
          lastPlayed: new Date().toISOString(),
          completed: false
        };
        setProgress(newProgress);
        // Save to localStorage
        localStorage.setItem(`story_${storyId}_progress`, JSON.stringify(newProgress));
      }
      
      // Show celebration animation
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 2000);
    } catch (err) {
      console.error('❌ Error updating progress:', err);
      alert('Failed to mark chapter as complete. Error: ' + err.message);
    }
  };

  if (loading) {
    return (
      <SiteLayout>
        <div style={{
          background: theme.background,
          minHeight: '100vh',
          padding: '40px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>📖</div>
            <p style={{
              color: theme.textPrimary,
              fontSize: '18px',
              fontWeight: '600',
            }}>
              Loading your adventure...
            </p>
          </div>
        </div>
      </SiteLayout>
    );
  }

  if (error || !story) {
    return (
      <SiteLayout>
        <div style={{
          background: theme.background,
          minHeight: '100vh',
          padding: '40px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{ textAlign: 'center', maxWidth: '600px' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>❌</div>
            <p style={{
              color: theme.textPrimary,
              fontSize: '20px',
              fontWeight: '600',
              marginBottom: '16px',
            }}>
              {error || 'Story not found'}
            </p>
            <button
              onClick={() => navigate('/stories')}
              style={{
                padding: '12px 32px',
                background: `linear-gradient(135deg, ${theme.accentPrimary}, ${theme.accentSecondary})`,
                color: '#fff',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
              }}
            >
              ← Back to Stories
            </button>
          </div>
        </div>
      </SiteLayout>
    );
  }

  // Calculate progress and completion states
  const completedCount = progress?.completedChapters?.length || 0;
  const progressPercent = chapters.length > 0 ? (completedCount / chapters.length) * 100 : 0;
  const isChapterCompleted = progress?.completedChapters?.includes(selectedChapter?.id);
  const isStoryCompleted = completedCount === chapters.length && chapters.length > 0;

  return (
    <SiteLayout>
      <div style={{
        background: theme.background,
        minHeight: '100vh',
        padding: '20px',
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
        }}>
          {/* Breadcrumb Navigation */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '24px',
            color: theme.textSecondary,
            fontSize: '14px',
          }}>
            <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: theme.accentPrimary, cursor: 'pointer', fontWeight: '600' }}>Home</button>
            <span>›</span>
            <button onClick={() => navigate('/stories')} style={{ background: 'none', border: 'none', color: theme.accentPrimary, cursor: 'pointer', fontWeight: '600' }}>Stories</button>
            <span>›</span>
            <span style={{ color: theme.textPrimary, fontWeight: '600' }}>{story.title}</span>
          </div>

          {/* Hero Section with Story Info */}
          <div style={{
            background: `linear-gradient(135deg, ${theme.accentPrimary}20, ${theme.accentSecondary}20)`,
            border: `2px solid ${theme.border}`,
            borderRadius: '16px',
            padding: '32px 24px',
            marginBottom: '32px',
            backdropFilter: 'blur(10px)',
          }}>
            <h1 style={{
              color: theme.accentPrimary,
              fontSize: '32px',
              fontWeight: '800',
              margin: '0 0 12px 0',
            }}>
              📖 {story.title}
            </h1>
            <p style={{
              color: theme.textSecondary,
              fontSize: '16px',
              margin: '0 0 16px 0',
              lineHeight: '1.6',
            }}>
              {story.description}
            </p>
            <div style={{
              display: 'flex',
              gap: '20px',
              marginTop: '16px',
              flexWrap: 'wrap',
            }}>
              <div>
                <p style={{ color: theme.textSecondary, fontSize: '12px', margin: '0 0 4px 0', fontWeight: '600' }}>Chapters</p>
                <p style={{ color: theme.textPrimary, fontSize: '18px', fontWeight: '700', margin: '0' }}>{chapters.length}</p>
              </div>
              <div>
                <p style={{ color: theme.textSecondary, fontSize: '12px', margin: '0 0 4px 0', fontWeight: '600' }}>Progress</p>
                <p style={{ color: theme.textPrimary, fontSize: '18px', fontWeight: '700', margin: '0' }}>{progressPercent.toFixed(0)}%</p>
              </div>
            </div>
          </div>

          {/* Main content grid: Chapters + Content */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '280px 1fr',
            gap: '24px',
          }}>
            {/* Left: Chapters Sidebar */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}>
              {chapters.map((chapter, index) => {
                const isCompleted = progress?.completedChapters?.includes(chapter.id);
                const isSelected = selectedChapterId === chapter.id;
                
                return (
                  <button
                    key={chapter.id}
                    onClick={() => handleChapterSelect(chapter)}
                    style={{
                      padding: '12px 16px',
                      background: isSelected ? `linear-gradient(135deg, ${theme.accentPrimary}, ${theme.accentSecondary})` : theme.surfacePrimary,
                      color: isSelected ? '#fff' : theme.textPrimary,
                      border: `2px solid ${isSelected ? 'transparent' : theme.border}`,
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      textAlign: 'left',
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.target.style.borderColor = theme.accentPrimary;
                        e.target.style.background = `${theme.accentPrimary}15`;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.target.style.borderColor = theme.border;
                        e.target.style.background = theme.surfacePrimary;
                      }
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span>Ch {index + 1}</span>
                      {isCompleted && <span>✓</span>}
                    </div>
                    <div style={{ fontSize: '12px', opacity: 0.7, marginTop: '4px' }}>{chapter.title}</div>
                  </button>
                );
              })}
            </div>

            {/* Right: Chapter Content */}
            <div style={{
              background: theme.surfacePrimary,
              border: `1px solid ${theme.border}`,
              borderRadius: '12px',
              padding: '32px',
              minHeight: '500px',
            }}>
              {selectedChapter && (
                <>
                  <h2 style={{
                    color: theme.textPrimary,
                    fontSize: '24px',
                    fontWeight: '700',
                    margin: '0 0 16px 0',
                  }}>
                    {selectedChapter.title}
                  </h2>
                  <div style={{
                    color: theme.textPrimary,
                    fontSize: '16px',
                    lineHeight: '1.8',
                    marginBottom: '32px',
                  }}>
                    {selectedChapter.content}
                  </div>
                  
                  {/* Action buttons */}
                  <div style={{
                    display: 'flex',
                    gap: '12px',
                    marginTop: '32px',
                    paddingTop: '32px',
                    borderTop: `1px solid ${theme.border}`,
                  }}>
                    {!isChapterCompleted && (
                      <button
                        onClick={markChapterComplete}
                        style={{
                          padding: '12px 24px',
                          background: `linear-gradient(135deg, ${theme.accentPrimary}, ${theme.accentSecondary})`,
                          color: '#fff',
                          border: 'none',
                          borderRadius: '8px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = 'translateY(0)';
                        }}
                      >
                        ✓ Mark Complete
                      </button>
                    )}
                    
                    {chapters.findIndex(c => c.id === selectedChapter.id) < chapters.length - 1 && (
                      <button
                        onClick={handleNextChapter}
                        style={{
                          padding: '12px 24px',
                          background: theme.surfaceSecondary,
                          color: theme.textPrimary,
                          border: `2px solid ${theme.border}`,
                          borderRadius: '8px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.borderColor = theme.accentPrimary;
                          e.target.style.background = `${theme.accentPrimary}15`;
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.borderColor = theme.border;
                          e.target.style.background = theme.surfaceSecondary;
                        }}
                      >
                        Next Chapter →
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
