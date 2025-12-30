/**
 * StoryDetailPage.jsx
 * 
 * Displays a single story with chapters - Kid-friendly design
 * User can read chapters and track progress
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthProvider';
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
        <div className="story-detail-page">
          <div className="loading-state">
            <div className="spinner">🔄</div>
            <p>Loading your adventure...</p>
          </div>
        </div>
      </SiteLayout>
    );
  }

  if (error || !story) {
    return (
      <SiteLayout>
        <div className="story-detail-page">
          <div className="error-state">
            <h2>Oops! {error || 'Story not found'}</h2>
            <button onClick={() => navigate('/stories')}>← Back to Stories</button>
          </div>
        </div>
      </SiteLayout>
    );
  }

  const completedCount = progress?.completedChapters?.length || 0;
  const progressPercent = chapters.length > 0 ? (completedCount / chapters.length) * 100 : 0;
  const isChapterCompleted = progress?.completedChapters?.includes(selectedChapter?.id);
  const isStoryCompleted = completedCount === chapters.length && chapters.length > 0;

  return (
    <SiteLayout>
      <div className="story-detail-wrapper">
        {/* Celebration animation */}
        {showCelebration && (
          <div className="celebration">
            <div className="confetti">🎉</div>
            <div className="confetti">✨</div>
            <div className="confetti">🌟</div>
            <div className="confetti">🎊</div>
            <p className="celebration-text">Awesome Story Completed! 🎉</p>
          </div>
        )}

        {/* Back button - OUTSIDE the card, top-left */}
        <button className="story-back-button" onClick={() => navigate('/stories')}>
          ← Back to Stories
        </button>

        <div className="story-detail-page">
          {/* Story intro section */}
          <div className="story-intro-section">
            <div className="story-intro-content">
              <h1 className="story-title">{story.title}</h1>
              <p className="story-description">{story.description}</p>
            </div>
          </div>

          {/* Chapters tabs */}
          <div className="chapters-tabs">
            <div className="tabs-wrapper">
              {chapters.map((chapter, index) => {
                const isCompleted = progress?.completedChapters?.includes(chapter.id);
                const isSelected = selectedChapterId === chapter.id;

                return (
                  <button
                    key={chapter.id}
                    className={`tab-item ${isSelected ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                    onClick={() => handleChapterSelect(chapter)}
                    title={chapter.title}
                  >
                    <span className="tab-label">Chapter {index + 1}</span>
                    {isCompleted && <span className="tab-badge">✓</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main content area */}
          <div className="story-content">
            {/* Chapter content */}
            <div className="chapter-content">
              {selectedChapter ? (
                <>
                  <div className="chapter-header">
                    <h2 className="chapter-title">{selectedChapter.title}</h2>
                  </div>

                  <div className="chapter-body">
                    {selectedChapter.characterImage && (
                      <div className="character-display">
                        <div className="character-icon">{selectedChapter.characterImage}</div>
                      </div>
                    )}
                    <div className="chapter-text-container">
                      <p className="chapter-text">
                        {selectedChapter.content || selectedChapter.description || '📖 Chapter content not available'}
                      </p>
                    </div>
                  </div>

                  {/* Action buttons - only show Next button */}
                  <div className="chapter-actions">
                    {chapters.findIndex(c => c.id === selectedChapter.id) < chapters.length - 1 ? (
                      <button 
                        className="next-button"
                        onClick={handleNextChapter}
                        title="Read the next chapter"
                      >
                        Next Chapter →
                      </button>
                    ) : (
                      <button 
                        className="quiz-button"
                        onClick={handleNextChapter}
                        title="Take the quiz for this story"
                      >
                        📝 Take the Quiz →
                      </button>
                    )}
                  </div>

                  {/* Quiz Confirmation Modal */}
                  {showQuizPrompt && (
                    <div className="quiz-prompt-overlay">
                      <div className="quiz-prompt-modal">
                        <h3>🎯 Ready for the Quiz?</h3>
                        <p>You've finished all the chapters! Take the quiz to complete this story and earn rewards.</p>
                        <div className="quiz-prompt-buttons">
                          <button 
                            className="quiz-start-btn"
                            onClick={() => {
                              console.log('🔘 Start Quiz button clicked!');
                              handleQuizStart();
                            }}
                          >
                            📝 Start Quiz
                          </button>
                          <button 
                            className="quiz-skip-btn"
                            onClick={() => setShowQuizPrompt(false)}
                          >
                            Maybe Later
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Story completion message */}
                  {isStoryCompleted && (
                    <div className="story-completion-message">
                      <div className="completion-icon">🎉</div>
                      <h3>🌟 You've Completed the Story! 🌟</h3>
                      <p>Congratulations! You've read all chapters of "{story.title}"</p>
                      <p className="xp-message">You earned {completedCount * 100} XP! 🏆</p>
                      <button 
                        onClick={() => navigate('/stories')}
                        className="back-to-stories-btn"
                      >
                        ← Back to All Stories
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="no-chapter">Select a chapter to read</div>
              )}
            </div>
          </div>
        </div>

        {/* Quiz Modal */}
        {quizData && (
          <div className="quiz-modal-overlay">
            <div className="quiz-modal-content">
              <div className="quiz-modal-header">
                <h2>📝 {quizData.title}</h2>
                <p className="quiz-progress">{currentQuizIndex + 1} / {quizData.questions.length}</p>
              </div>

              {quizData.questions[currentQuizIndex] && (
                <div className="quiz-question">
                  <div className="question-text">
                    {quizData.questions[currentQuizIndex].text}
                  </div>

                  <div className="question-options">
                    {quizData.questions[currentQuizIndex].options.map((option, idx) => (
                      <button
                        key={idx}
                        className={`option-button ${
                          selectedAnswer === idx ? 'selected' : ''
                        } ${
                          showQuizResult && idx === quizData.questions[currentQuizIndex].correctAnswer
                            ? 'correct'
                            : showQuizResult && selectedAnswer === idx && selectedAnswer !== quizData.questions[currentQuizIndex].correctAnswer
                            ? 'incorrect'
                            : ''
                        }`}
                        onClick={() => handleAnswerSelect(idx)}
                        disabled={showQuizResult}
                      >
                        {option}
                      </button>
                    ))}
                  </div>

                  {showQuizResult && (
                    <div className="quiz-feedback">
                      {selectedAnswer === quizData.questions[currentQuizIndex].correctAnswer ? (
                        <div className="feedback correct-feedback">
                          ✅ Correct!
                        </div>
                      ) : (
                        <div className="feedback incorrect-feedback">
                          ❌ Incorrect! The correct answer is: {quizData.questions[currentQuizIndex].options[quizData.questions[currentQuizIndex].correctAnswer]}
                        </div>
                      )}
                      {quizData.questions[currentQuizIndex].explanation && (
                        <p className="explanation">{quizData.questions[currentQuizIndex].explanation}</p>
                      )}
                    </div>
                  )}

                  <div className="quiz-actions">
                    {!showQuizResult ? (
                      <button className="submit-btn" onClick={handleSubmitAnswer}>
                        Submit Answer
                      </button>
                    ) : (
                      <button className="next-btn" onClick={handleNextQuestion}>
                        {currentQuizIndex < quizData.questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Quiz Completion Modal */}
        {showQuizComplete && (
          <div className="quiz-modal-overlay">
            <div className="quiz-modal-content quiz-complete-modal">
              <div className="completion-header">
                <div className="success-animation">
                  <span>🎉</span>
                  <span>✨</span>
                  <span>🌟</span>
                </div>
                <h2>Quiz Passed! 🎉</h2>
              </div>

              <div className="completion-info">
                <p className="score-display">
                  Your Score: <strong>{quizScore}/{quizAnswers.length}</strong>
                </p>
                <p className="score-percentage">
                  {Math.round((quizScore / quizAnswers.length) * 100)}% Correct
                </p>
                <p className="reward-message">
                  ✨ You earned <strong>150 XP</strong> and <strong>30 coins</strong> for completing this quiz!
                </p>
              </div>

              <div className="completion-actions">
                <button 
                  className="complete-story-btn"
                  onClick={handleCompleteStory}
                >
                  🏆 Complete Story
                </button>
                <button 
                  className="retake-quiz-btn"
                  onClick={handleRetakeQuiz}
                >
                  🔄 Retake Quiz
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
