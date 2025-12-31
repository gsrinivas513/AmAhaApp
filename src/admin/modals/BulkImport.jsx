import React, { useContext, useState } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import { db } from '../../firebase/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

const BulkImport = ({ isOpen, onClose, dataType, categories = [] }) => {
  const { theme } = useContext(ThemeContext);
  const [csvData, setCsvData] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [progress, setProgress] = useState(0);

  if (!isOpen) return null;

  const parseCSV = (text) => {
    const lines = text.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const data = [];

    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      
      const values = lines[i].split(',').map(v => v.trim());
      const row = {};
      
      headers.forEach((header, idx) => {
        row[header] = values[idx] || '';
      });
      
      data.push(row);
    }

    return data;
  };

  // Validate quiz questions with new format: text-only, text+image, image-only
  const validateQuizQuestion = (item, idx) => {
    const errors = [];

    // Question validation
    if (!item.question || item.question.trim().length < 5) {
      errors.push(`Row ${idx + 2}: Question must be at least 5 characters`);
    }

    // Question type validation
    const validQuestionTypes = ['text', 'text-image', 'image'];
    if (!item.questiontype || !validQuestionTypes.includes(item.questiontype.toLowerCase())) {
      errors.push(`Row ${idx + 2}: Question type must be 'text', 'text-image', or 'image'`);
    }

    // Image URL validation for text-image and image types
    if (item.questiontype && (item.questiontype.toLowerCase() === 'text-image' || item.questiontype.toLowerCase() === 'image')) {
      if (!item.questionimage || !item.questionimage.startsWith('https://')) {
        errors.push(`Row ${idx + 2}: Question type '${item.questiontype}' requires valid HTTPS image URL`);
      }
    }

    // Options validation (2-4 options)
    if (!item.options) {
      errors.push(`Row ${idx + 2}: Options are required (pipe-separated, 2-4 options)`);
    } else {
      const optionsArray = item.options.split('|').map(o => o.trim()).filter(o => o);
      
      if (optionsArray.length < 2) {
        errors.push(`Row ${idx + 2}: Minimum 2 options required (found ${optionsArray.length})`);
      } else if (optionsArray.length > 4) {
        errors.push(`Row ${idx + 2}: Maximum 4 options allowed (found ${optionsArray.length})`);
      }

      // Check for duplicate options
      const uniqueOptions = new Set(optionsArray.map(o => o.toLowerCase()));
      if (uniqueOptions.size !== optionsArray.length) {
        errors.push(`Row ${idx + 2}: Options must be unique (no duplicates)`);
      }

      // Correct answer validation
      if (!item.correctanswer) {
        errors.push(`Row ${idx + 2}: Correct answer is required`);
      } else {
        const answerLower = item.correctanswer.trim().toLowerCase();
        const hasMatchingOption = optionsArray.some(o => o.toLowerCase() === answerLower);
        if (!hasMatchingOption) {
          errors.push(`Row ${idx + 2}: Correct answer '${item.correctanswer}' not found in options`);
        }
      }

      // Option images validation (if provided)
      if (item.images) {
        const imagesArray = item.images.split('|').map(i => i.trim());
        if (imagesArray.length !== optionsArray.length) {
          errors.push(`Row ${idx + 2}: Number of option images must match number of options`);
        } else {
          imagesArray.forEach((img, i) => {
            if (img && !img.startsWith('https://')) {
              errors.push(`Row ${idx + 2}: Option ${i + 1} image URL must be valid HTTPS URL`);
            }
          });
        }
      }
    }

    // Difficulty validation
    const validDifficulties = ['easy', 'medium', 'hard'];
    if (!item.difficulty || !validDifficulties.includes(item.difficulty.toLowerCase())) {
      errors.push(`Row ${idx + 2}: Difficulty must be 'easy', 'medium', or 'hard'`);
    }

    // Category validation
    if (!item.category) {
      errors.push(`Row ${idx + 2}: Category is required`);
    }

    return errors;
  };

  const validateData = (data) => {
    const errors = [];

    data.forEach((item, idx) => {
      if (dataType === 'quiz') {
        const quizErrors = validateQuizQuestion(item, idx);
        errors.push(...quizErrors);
      } else {
        if (!item.title) errors.push(`Row ${idx + 2}: Title is required`);
        
        if (dataType === 'puzzle') {
          if (!item.type) errors.push(`Row ${idx + 2}: Type is required`);
          if (!item.pieces) errors.push(`Row ${idx + 2}: Pieces count is required`);
        } else if (dataType === 'story') {
          if (!item.category) errors.push(`Row ${idx + 2}: Category is required`);
        }
      }
    });

    return errors;
  };

  const handleImport = async () => {
    setError('');
    setSuccess('');
    setProgress(0);

    if (!csvData.trim()) {
      setError('Please paste CSV data');
      return;
    }

    try {
      setLoading(true);
      const data = parseCSV(csvData);
      const validationErrors = validateData(data);

      if (validationErrors.length > 0) {
        setError(validationErrors.join('\n'));
        return;
      }

      const collectionName = dataType === 'quiz' ? 'questions' : dataType === 'puzzle' ? 'puzzles' : 'stories';
      let imported = 0;
      let failed = 0;

      for (let i = 0; i < data.length; i++) {
        try {
          const item = data[i];
          
          // Build document data based on type
          let docData = {};

          if (dataType === 'quiz') {
            // Quiz: Import as questions (new format with flexible options)
            const optionsArray = item.options.split('|').map(o => o.trim()).filter(o => o);
            const imagesArray = item.images ? item.images.split('|').map(i => i.trim()) : [];

            // Build options array with optional images
            const optionsData = optionsArray.map((opt, idx) => ({
              text: opt,
              image: imagesArray[idx] && imagesArray[idx] !== '' ? imagesArray[idx] : null,
              imageOnly: false
            }));

            docData = {
              question: item.question,
              questionImage: item.questionimage || null,
              questionType: item.questiontype.toLowerCase(),
              options: optionsData,
              correctAnswer: item.correctanswer.trim(),
              difficulty: item.difficulty.toLowerCase(),
              category: item.category,
              featureType: 'quiz',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
          } else {
            // Non-quiz: Use original format
            docData = {
              title: item.title,
              description: item.description || '',
              status: item.status || 'Draft',
              audience: item.audience || 'All Users',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };

            if (dataType === 'puzzle') {
              docData = {
                ...docData,
                type: item.type,
                difficulty: item.difficulty || 'Medium',
                pieces: parseInt(item.pieces) || 0,
                timeLimit: item.timelimit || 'Unlimited',
              };
            } else if (dataType === 'story') {
              docData = {
                ...docData,
                category: item.category,
                chapters: parseInt(item.chapters) || 0,
                author: item.author || 'Unknown',
                language: item.language || 'English',
              };
            }
          }

          await addDoc(collection(db, collectionName), docData);
          imported++;
        } catch (err) {
          console.error('Error importing item:', err);
          failed++;
        }

        setProgress(Math.round(((i + 1) / data.length) * 100));
      }

      setSuccess(`✅ Import complete! ${imported} items imported, ${failed} failed.`);
      setCsvData('');
      
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setError('Error during import: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const getTemplate = () => {
    if (dataType === 'quiz') {
      return `question,questionType,options,correctAnswer,difficulty,category,questionImage,images
"What is the capital of France?",text,"Paris|London|Berlin|Madrid",Paris,easy,Geography,,
"Which color is in the flag?",text-image,"Red|Blue|Green|Yellow",Red,medium,Geography,https://example.com/flag.jpg,
"Identify this flag",image,"Option A|Option B|Option C|Option D",Option A,hard,Geography,https://example.com/flag.jpg,https://ex.com/opt1.jpg|https://ex.com/opt2.jpg|https://ex.com/opt3.jpg|https://ex.com/opt4.jpg
"Is Earth round?",text,"True|False",True,easy,Science,,`;
    } else if (dataType === 'puzzle') {
      return 'title,type,difficulty,audience,pieces,timelimit,description\n'
        + 'Classic Jigsaw,Jigsaw,Medium,All Users,500,Unlimited,A beautiful landscape puzzle\n'
        + 'Logic Challenge,Logic,Hard,Professionals,20,30 mins,Complex logic puzzle';
    } else {
      return 'title,category,audience,chapters,author,language,description\n'
        + 'Adventure Quest,Adventure,All Users,10,John Doe,English,An epic adventure story\n'
        + 'Mystery Island,Mystery,Students 13-18,8,Jane Smith,English,Solve the island mystery';
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        backdropFilter: 'blur(4px)',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: theme.surfacePrimary,
          borderRadius: '16px',
          padding: '32px',
          maxWidth: '700px',
          width: '90%',
          maxHeight: '90vh',
          overflowY: 'auto',
          border: `2px solid ${theme.border}`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          paddingBottom: '16px',
          borderBottom: `2px solid ${theme.border}`,
        }}>
          <h2 style={{
            color: theme.textPrimary,
            fontSize: '20px',
            fontWeight: '700',
            margin: 0,
          }}>
            📤 Bulk Import {dataType === 'quiz' ? 'Quizzes' : dataType === 'puzzle' ? 'Puzzles' : 'Stories'}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: theme.textSecondary,
              fontSize: '24px',
              cursor: 'pointer',
              padding: '0',
            }}
          >
            ✕
          </button>
        </div>

        {/* Instructions */}
        <div style={{
          background: theme.background,
          padding: '12px',
          borderRadius: '8px',
          marginBottom: '16px',
          border: `1px solid ${theme.border}`,
        }}>
          <p style={{
            color: theme.textSecondary,
            fontSize: '12px',
            margin: '0',
            lineHeight: '1.5',
          }}>
            {dataType === 'quiz' 
              ? '✏️ Questions with: text-only, text+image, or image-only. Options: 2-4 (pipe-separated). No images = empty cells.'
              : 'ℹ️ Paste CSV data below. Required columns: title, category, and others specific to the type.'}
          </p>
        </div>

        {/* Error & Success Messages */}
        {error && (
          <div style={{
            background: '#FF6B6B25',
            border: '2px solid #FF6B6B',
            color: '#FF6B6B',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '16px',
            fontSize: '12px',
            fontWeight: '600',
            whiteSpace: 'pre-wrap',
            maxHeight: '150px',
            overflowY: 'auto',
          }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{
            background: '#51CF6625',
            border: '2px solid #51CF66',
            color: '#51CF66',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '16px',
            fontSize: '12px',
            fontWeight: '600',
          }}>
            {success}
          </div>
        )}

        {/* CSV Input */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{
            display: 'block',
            color: theme.textSecondary,
            fontSize: '11px',
            fontWeight: '600',
            marginBottom: '8px',
            textTransform: 'uppercase',
          }}>
            CSV Data
          </label>
          <textarea
            value={csvData}
            onChange={(e) => setCsvData(e.target.value)}
            disabled={loading}
            placeholder="Paste your CSV data here..."
            style={{
              width: '100%',
              padding: '12px',
              background: theme.background,
              border: `2px solid ${theme.border}`,
              borderRadius: '6px',
              color: theme.textPrimary,
              fontSize: '12px',
              fontFamily: 'monospace',
              minHeight: '200px',
              boxSizing: 'border-box',
              resize: 'vertical',
              opacity: loading ? 0.5 : 1,
            }}
          />
        </div>

        {/* Template */}
        <details style={{ marginBottom: '16px' }}>
          <summary style={{
            color: theme.accentPrimary,
            fontSize: '12px',
            fontWeight: '600',
            cursor: 'pointer',
            marginBottom: '8px',
          }}>
            📋 View CSV Template
          </summary>
          <pre style={{
            background: theme.background,
            padding: '12px',
            borderRadius: '6px',
            border: `1px solid ${theme.border}`,
            color: theme.textSecondary,
            fontSize: '11px',
            overflow: 'auto',
            marginTop: '8px',
          }}>
            {getTemplate()}
          </pre>
        </details>

        {/* Progress Bar */}
        {loading && progress > 0 && (
          <div style={{ marginBottom: '16px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '8px',
            }}>
              <span style={{
                color: theme.textSecondary,
                fontSize: '11px',
                fontWeight: '600',
              }}>
                Importing...
              </span>
              <span style={{
                color: theme.accentPrimary,
                fontSize: '11px',
                fontWeight: '600',
              }}>
                {progress}%
              </span>
            </div>
            <div style={{
              width: '100%',
              height: '8px',
              background: theme.background,
              borderRadius: '4px',
              overflow: 'hidden',
              border: `1px solid ${theme.border}`,
            }}>
              <div style={{
                width: `${progress}%`,
                height: '100%',
                background: `linear-gradient(90deg, ${theme.accentPrimary}, ${theme.accentSecondary || theme.accentPrimary})`,
                transition: 'width 0.3s ease',
              }} />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '8px',
        }}>
          <button
            onClick={handleImport}
            disabled={loading}
            style={{
              flex: 1,
              padding: '12px 20px',
              background: `linear-gradient(135deg, ${theme.accentPrimary}, ${theme.accentSecondary || theme.accentPrimary})`,
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? '⏳ Importing...' : '📤 Import Data'}
          </button>
          <button
            onClick={onClose}
            disabled={loading}
            style={{
              flex: 1,
              padding: '12px 20px',
              background: 'transparent',
              color: theme.textPrimary,
              border: `2px solid ${theme.border}`,
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.5 : 1,
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkImport;
