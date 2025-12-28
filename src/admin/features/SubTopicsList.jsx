// src/admin/features/SubTopicsList.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button } from "../../components/ui";
import { collection, getDocs, query, where, addDoc, updateDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import PuzzleEditorModal from "./PuzzleEditorModal";

function SubTopicsList({
  subtopics,
  selectedTopicId,
  selectedCategoryId,
  topics,
  onEditSubtopic,
  onDeleteSubtopic,
  onToggleSubtopicPublish,
  onAddSubtopic,
  onAddQuestion,
  onManageStories
}) {
  const navigate = useNavigate();
  const [showPuzzleModal, setShowPuzzleModal] = useState(false);
  const [editingPuzzle, setEditingPuzzle] = useState(null);
  const [selectedSubtopic, setSelectedSubtopic] = useState(null);
  const [puzzlePreview, setPuzzlePreview] = useState({});
  const [questionCounts, setQuestionCounts] = useState({});
  const [storyCount, setStoryCount] = useState({});

  const getTopicName = (topicId) => {
    if (!topicId) return "No Topic";
    const topic = topics.find((t) => t.id === topicId);
    return topic ? (topic.label || topic.name) : "Unknown Topic";
  };

  const isStorySubtopic = (subtopic) => {
    return subtopic?._collectionName === "storySubtopics";
  };

  const isPuzzleSubtopic = (subtopic) => {
    return subtopic?.featureId === "puzzles";
  };

  useEffect(() => {
    async function fetchData() {
      if (!subtopics) return;
      const previews = {};
      const counts = {};
      const stories = {};
      
      for (const sub of subtopics) {
        if (!sub.id) continue;
        
        // Check if this is a story subtopic
        if (isStorySubtopic(sub)) {
          // Fetch stories for story subtopics - filtered by subtopicId
          const storiesSnap = await getDocs(query(collection(db, "stories"), where("subtopicId", "==", sub.id)));
          stories[sub.id] = storiesSnap.docs.length;
        } else if (isPuzzleSubtopic(sub)) {
          // For puzzles: Each subtopic represents one puzzle
          // The actual puzzle content is stored as puzzle data in the subtopic itself
          previews[sub.id] = [{ title: sub.name || sub.label, type: 'puzzle' }];
          counts[sub.id] = 1;
        } else {
          // Fetch questions for quiz subtopics
          const questionsSnap = await getDocs(query(collection(db, "questions"), where("subtopicId", "==", sub.id)));
          counts[sub.id] = questionsSnap.docs.length;
        }
      }
      
      setPuzzlePreview(previews);
      setQuestionCounts(counts);
      setStoryCount(stories);
    }
    fetchData();
  }, [subtopics]);

  const handleOpenPuzzleCreator = (subtopic) => {
    setSelectedSubtopic(subtopic);
    setEditingPuzzle(null);
    setShowPuzzleModal(true);
  };

  const handleOpenPuzzleEditor = (subtopic, puzzle) => {
    setSelectedSubtopic(subtopic);
    setEditingPuzzle(puzzle);
    setShowPuzzleModal(true);
  };

  const handleSavePuzzle = async (puzzleData) => {
    try {
      if (editingPuzzle?.id) {
        // Update existing puzzle
        await updateDoc(doc(db, "puzzles", editingPuzzle.id), puzzleData);
        console.log("✅ Puzzle updated:", puzzleData.title);
      } else {
        // Create new puzzle
        const docRef = await addDoc(collection(db, "puzzles"), {
          ...puzzleData,
          createdAt: new Date().toISOString(),
          isPublished: true
        });
        console.log("✅ Puzzle created:", docRef.id);
      }
      setShowPuzzleModal(false);
      // Trigger refresh of puzzle preview
      setEditingPuzzle(null);
      setSelectedSubtopic(null);
    } catch (error) {
      console.error("Error saving puzzle:", error);
      alert("Failed to save puzzle");
    }
  };

  if (!selectedCategoryId) {
    return (
      <div className="fcm-subtopics-section">
        <div style={{ textAlign: "center", padding: 30, color: "#94a3b8" }}>
          <h3 style={{ fontSize: 14, margin: 0 }}>← Select a Category first</h3>
        </div>
      </div>
    );
  }

  // Filter by topic if selected (already filtered by FeatureCategoryManagement by topic)
  const filteredSubtopicies = selectedTopicId
    ? subtopics.filter((sub) => sub.topicId === selectedTopicId)
    : subtopics;

  return (
    <div className="fcm-subtopics-section">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <div>
          <h3
            style={{
              margin: 0,
              fontSize: 14,
              fontWeight: 700,
            }}
          >
          Step 4: SubTopics ({filteredSubtopicies.length})
          </h3>
          <div
            style={{
              fontSize: 9,
              color: "#64748b",
              marginTop: 2,
            }}
          >
            {selectedTopicId ? `Topic: ${getTopicName(selectedTopicId)}` : "All topics"}
          </div>
        </div>
        <Button
          onClick={onAddSubtopic}
          style={{
            padding: "6px 10px",
            fontSize: 11,
          }}
        >
          +
        </Button>
      </div>

      <div className="fcm-subtopics-list">
        {filteredSubtopicies.map((sub) => (
          <Card
            key={sub.id}
            style={{
              padding: 8,
              background: "#fff",
              borderLeft: `4px solid ${sub.color || "#10b981"}`,
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 14 }}>{sub.icon || "📄"}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, color: "#0b1220", fontSize: 12 }}>
                    {sub.label || sub.name}
                  </div>
                  <div style={{ fontSize: 9, color: "#10b981", fontWeight: 600 }}>
                    {isStorySubtopic(sub)
                      ? `${storyCount[sub.id] || 0} stories`
                      : isPuzzleSubtopic(sub)
                      ? `${puzzlePreview[sub.id]?.length || 0} puzzles`
                      : `${questionCounts[sub.id] || 0} questions`}
                  </div>
                  {puzzlePreview[sub.id] && puzzlePreview[sub.id].length > 0 && (
                    <div style={{ marginTop: 6, fontSize: 11, color: '#444' }}>
                      <b>Puzzles:</b>
                      <ul style={{ margin: 0, paddingLeft: 18 }}>
                        {puzzlePreview[sub.id].map((pz, idx) => (
                          <li key={idx}>{pz.title || pz.question || 'Untitled'} <span style={{color:'#888'}}>({pz.type})</span></li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              <div style={{ fontSize: 9, color: "#64748b", marginTop: 2 }}>
                Topic: {getTopicName(sub.topicId)}
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 4,
                  marginTop: 4,
                  paddingTop: 4,
                  borderTop: "1px solid #e2e8f0",
                  flexWrap: "wrap",
                }}
              >
                {isStorySubtopic(sub) ? (
                  // For Stories: Show "Add Story" button that navigates to stories editor
                  <Button
                    title="Add Story"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate("/admin/stories", { 
                        state: { 
                          mode: "create",
                          subtopicId: sub.id,
                          topicId: selectedTopicId,
                          categoryId: selectedCategoryId
                        } 
                      });
                    }}
                    style={{
                      padding: "4px",
                      fontSize: 12,
                      background: "#fce7f3",
                      color: "#be185d",
                      width: 28,
                      height: 28,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    ➕
                  </Button>
                ) : isPuzzleSubtopic(sub) ? (
                  // For Puzzles: Show "Add Puzzle" button
                  <Button
                    title="Add Puzzle"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenPuzzleCreator(sub);
                    }}
                    style={{
                      padding: "4px",
                      fontSize: 12,
                      background: "#fef3c7",
                      color: "#92400e",
                      width: 28,
                      height: 28,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "bold",
                    }}
                  >
                    ➕
                  </Button>
                ) : (
                  // For Quizzes: Show "Add Question" button
                  <Button
                    title="Add Quiz Question"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onAddQuestion) onAddQuestion(sub);
                    }}
                    style={{
                      padding: "4px",
                      fontSize: 12,
                      background: "#d1fae5",
                      color: "#065f46",
                      width: 28,
                      height: 28,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    ➕
                  </Button>
                )}
                <Button
                  title={isStorySubtopic(sub) ? "Manage Stories" : "Edit Subtopic"}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isStorySubtopic(sub)) {
                      // For Stories: Open modal to manage stories for this subtopic
                      if (onManageStories) {
                        onManageStories({
                          subtopic: sub,
                          subtopicId: sub.id,
                          topicId: selectedTopicId,
                          categoryId: selectedCategoryId
                        });
                      }
                    } else if (isPuzzleSubtopic(sub)) {
                      // For Puzzles: Open puzzle editor with the first puzzle if it exists
                      const puzzle = puzzlePreview[sub.id]?.[0];
                      handleOpenPuzzleEditor(sub, puzzle);
                    } else {
                      // For Quizzes: Use generic edit handler
                      onEditSubtopic(sub);
                    }
                  }}
                  style={{
                    padding: "4px",
                    fontSize: 12,
                    background: "#dbeafe",
                    color: "#0284c7",
                    width: 28,
                    height: 28,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  ✏️
                </Button>
                {onToggleSubtopicPublish && (
                  <Button
                    title={sub.isPublished ? "Unpublish" : "Publish"}
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleSubtopicPublish(sub);
                    }}
                    style={{
                      padding: "4px",
                      fontSize: 12,
                      background: sub.isPublished ? "#dcfce7" : "#f3f4f6",
                      color: sub.isPublished ? "#15803d" : "#4b5563",
                      width: 28,
                      height: 28,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {sub.isPublished ? "✓" : "○"}
                  </Button>
                )}
                <Button
                  title="Delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteSubtopic(sub.id);
                  }}
                  style={{
                    padding: "4px",
                    fontSize: 12,
                    background: "#fee2e2",
                    color: "#991b1b",
                    width: 28,
                    height: 28,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  🗑️
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {showPuzzleModal && (
        <PuzzleEditorModal
          puzzle={editingPuzzle}
          subtopic={selectedSubtopic}
          onClose={() => setShowPuzzleModal(false)}
          onSave={handleSavePuzzle}
        />
      )}
    </div>
  );
}
export default React.memo(SubTopicsList);
