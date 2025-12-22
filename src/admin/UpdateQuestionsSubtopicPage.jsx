// src/admin/UpdateQuestionsSubtopicPage.jsx
import React, { useState } from "react";
import { collection, getDocs, query, where, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import AdminLayout from "./AdminLayout";

// Mapping of category to subtopic names based on your CSV files
const SUBTOPIC_MAPPING = {
  'Animals': 'Animals & Their Sounds',
  'Birds': 'Birds & Insects', 
  'Body': 'Body Parts',
  'Colors': 'Colors & Shapes',
  'Fruits': 'Fruits & Vegetables',
  'Math': 'Math Basics',
};

export default function UpdateQuestionsSubtopicPage() {
  const [status, setStatus] = useState('');
  const [progress, setProgress] = useState(null);
  const [running, setRunning] = useState(false);

  const updateQuestions = async () => {
    try {
      setRunning(true);
      setStatus('🔍 Loading questions...');
      
      const questionsSnap = await getDocs(collection(db, "questions"));
      const allQuestions = questionsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      
      setStatus(`📦 Found ${allQuestions.size} total questions`);
      console.log('📦 All questions:', allQuestions);

      // Filter questions that don't have subtopic field
      const questionsToUpdate = allQuestions.filter(q => !q.subtopic || !q.subtopicId);
      
      setStatus(`🔄 Need to update ${questionsToUpdate.length} questions`);
      setProgress({ current: 0, total: questionsToUpdate.length });

      let updated = 0;
      let skipped = 0;
      let errors = 0;

      for (let i = 0; i < questionsToUpdate.length; i++) {
        const question = questionsToUpdate[i];
        const topic = question.topic || '';
        
        const subtopicName = SUBTOPIC_MAPPING[topic];
        
        if (!subtopicName) {
          console.warn(`⚠️ No subtopic mapping for topic: ${topic}`);
          skipped++;
          setProgress({ current: i + 1, total: questionsToUpdate.length });
          continue;
        }

        // Find the subcategory ID
        try {
          const subcatQuery = query(
            collection(db, "subtopics"),
            where("name", "==", subtopicName)
          );
          const subcatSnap = await getDocs(subcatQuery);
          
          if (subcatSnap.empty) {
            console.warn(`❌ Subcategory not found: ${subtopicName}`);
            errors++;
            setProgress({ current: i + 1, total: questionsToUpdate.length });
            continue;
          }

          const subcatId = subcatSnap.docs[0].id;

          // Update the question
          await updateDoc(doc(db, "questions", question.id), {
            subtopic: subtopicName,
            subtopicId: subcatId
          });

          updated++;
          
          if (updated % 10 === 0) {
            setStatus(`✅ Updated ${updated}/${questionsToUpdate.length} questions...`);
          }
        } catch (err) {
          console.error(`❌ Error updating question ${question.id}:`, err);
          errors++;
        }

        setProgress({ current: i + 1, total: questionsToUpdate.length });
      }

      setStatus(`✅ Complete! Updated: ${updated}, Skipped: ${skipped}, Errors: ${errors}`);
      setProgress(null);

    } catch (err) {
      console.error('❌ Fatal error:', err);
      setStatus(`❌ Error: ${err.message}`);
    } finally {
      setRunning(false);
    }
  };

  return (
    <AdminLayout>
      <div style={{ padding: 24, maxWidth: 800, margin: '0 auto' }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>
          Update Questions with Subtopic Fields
        </h1>
        
        <div style={{
          background: '#fef3c7',
          border: '1px solid #f59e0b',
          borderRadius: 8,
          padding: 16,
          marginBottom: 24
        }}>
          <p style={{ margin: 0, fontSize: 14, color: '#92400e' }}>
            ⚠️ This will update all questions that don't have <code>subtopic</code> and <code>subtopicId</code> fields.
            The update is based on the <code>topic</code> field value.
          </p>
        </div>

        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Topic → Subtopic Mapping:</h3>
          <ul style={{ fontSize: 14, lineHeight: 1.6 }}>
            {Object.entries(SUBTOPIC_MAPPING).map(([topic, subtopic]) => (
              <li key={topic}>
                <code>{topic}</code> → <code>{subtopic}</code>
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={updateQuestions}
          disabled={running}
          style={{
            padding: '12px 24px',
            background: running ? '#9ca3af' : '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            fontSize: 16,
            fontWeight: 600,
            cursor: running ? 'not-allowed' : 'pointer',
            marginBottom: 24
          }}
        >
          {running ? '⏳ Updating...' : '🚀 Update Questions'}
        </button>

        {status && (
          <div style={{
            padding: 16,
            background: status.includes('❌') ? '#fee2e2' : status.includes('✅') ? '#d1fae5' : '#e0e7ff',
            borderRadius: 8,
            marginBottom: 16,
            fontSize: 14,
            whiteSpace: 'pre-wrap'
          }}>
            {status}
          </div>
        )}

        {progress && (
          <div style={{ marginTop: 16 }}>
            <div style={{
              background: '#e5e7eb',
              height: 24,
              borderRadius: 12,
              overflow: 'hidden'
            }}>
              <div style={{
                background: '#3b82f6',
                height: '100%',
                width: `${(progress.current / progress.total) * 100}%`,
                transition: 'width 0.3s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: 12,
                fontWeight: 600
              }}>
                {Math.round((progress.current / progress.total) * 100)}%
              </div>
            </div>
            <p style={{ marginTop: 8, fontSize: 14, color: '#6b7280' }}>
              {progress.current} / {progress.total} questions processed
            </p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
