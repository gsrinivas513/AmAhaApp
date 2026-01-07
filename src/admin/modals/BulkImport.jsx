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

  // Validate quiz (full quiz with flexible contentItems structure)
  const validateQuiz = (item, idx) => {
    const errors = [];

    // Required fields
    if (!item.title || item.title.trim().length < 3) {
      errors.push(`Row ${idx + 2}: Quiz title must be at least 3 characters`);
    }
    
    if (!item.category) {
      errors.push(`Row ${idx + 2}: Category is required`);
    }
    
    if (!item.level) {
      errors.push(`Row ${idx + 2}: Level is required (Beginner, Intermediate, Advanced, Expert)`);
    }
    
    if (!item.quiztype) {
      errors.push(`Row ${idx + 2}: Quiz Type is required (MCQ, TRUE_FALSE, FILL_BLANK, etc.)`);
    }
    
    if (!item.question || item.question.trim().length < 5) {
      errors.push(`Row ${idx + 2}: Question must be at least 5 characters`);
    }

    // Content type validation (text, image, video, audio)
    const validContentTypes = ['text', 'image', 'video', 'audio'];
    if (!item.contenttype || !validContentTypes.includes(item.contenttype.toLowerCase())) {
      errors.push(`Row ${idx + 2}: Content type must be 'text', 'image', 'video', or 'audio'`);
    }

    // Media URL validation for non-text types
    if (item.contenttype && item.contenttype.toLowerCase() !== 'text') {
      if (!item.mediaurl || !item.mediaurl.startsWith('https://')) {
        errors.push(`Row ${idx + 2}: Content type '${item.contenttype}' requires valid HTTPS media URL`);
      }
    }

    // Options validation (for MCQ)
    if (item.quiztype && item.quiztype.toUpperCase() === 'MCQ') {
      if (!item.options) {
        errors.push(`Row ${idx + 2}: Options required for MCQ (pipe-separated: A|B|C|D)`);
      } else {
        const optionsArray = item.options.split('|').map(o => o.trim()).filter(o => o);
        
        if (optionsArray.length < 2 || optionsArray.length > 4) {
          errors.push(`Row ${idx + 2}: MCQ requires 2-4 options (found ${optionsArray.length})`);
        }

        // Correct answer validation
        if (!item.correctanswer) {
          errors.push(`Row ${idx + 2}: Correct answer is required for MCQ`);
        } else {
          const answerLower = item.correctanswer.trim().toUpperCase();
          if (!['A', 'B', 'C', 'D'].includes(answerLower)) {
            errors.push(`Row ${idx + 2}: Correct answer must be A, B, C, or D`);
          }
        }
      }
    }

    // MULTI_SELECT validation
    if (item.quiztype && item.quiztype.toUpperCase() === 'MULTI_SELECT') {
      if (!item.options) {
        errors.push(`Row ${idx + 2}: Options required for MULTI_SELECT (pipe-separated)`);
      } else {
        const optionsArray = item.options.split('|').map(o => o.trim()).filter(o => o);
        if (optionsArray.length < 2 || optionsArray.length > 4) {
          errors.push(`Row ${idx + 2}: MULTI_SELECT requires 2-4 options`);
        }
      }
      if (!item.correctanswer) {
        errors.push(`Row ${idx + 2}: Correct answers required for MULTI_SELECT (pipe-separated: A|B)`);
      }
    }

    // TRUE_FALSE validation
    if (item.quiztype && item.quiztype.toUpperCase() === 'TRUE_FALSE') {
      if (!item.correctanswer || !['true', 'false'].includes(item.correctanswer.toLowerCase())) {
        errors.push(`Row ${idx + 2}: Correct answer must be 'True' or 'False'`);
      }
    }

    // FILL_BLANK validation
    if (item.quiztype && item.quiztype.toUpperCase() === 'FILL_BLANK') {
      if (!item.correctanswer) {
        errors.push(`Row ${idx + 2}: Correct answer required for FILL_BLANK`);
      }
    }

    // MATCHING validation
    if (item.quiztype && item.quiztype.toUpperCase() === 'MATCHING') {
      if (!item.leftitems || !item.rightitems) {
        errors.push(`Row ${idx + 2}: MATCHING requires leftItems and rightItems (pipe-separated)`);
      } else {
        const leftCount = item.leftitems.split('|').filter(x => x.trim()).length;
        const rightCount = item.rightitems.split('|').filter(x => x.trim()).length;
        if (leftCount !== rightCount) {
          errors.push(`Row ${idx + 2}: MATCHING left and right items count must match`);
        }
      }
    }

    // ORDERING/PUZZLE validation
    if (item.quiztype && ['ORDERING', 'PUZZLE'].includes(item.quiztype.toUpperCase())) {
      if (!item.items) {
        errors.push(`Row ${idx + 2}: Items required for ${item.quiztype} (pipe-separated)`);
      } else {
        const itemsArray = item.items.split('|').filter(x => x.trim());
        if (itemsArray.length < 2) {
          errors.push(`Row ${idx + 2}: ${item.quiztype} requires minimum 2 items`);
        }
      }
      if (!item.correctsequence) {
        errors.push(`Row ${idx + 2}: correctSequence required for ${item.quiztype} (comma-separated: 1,2,3)`);
      }
    }

    // DRAG_DROP validation
    if (item.quiztype && item.quiztype.toUpperCase() === 'DRAG_DROP') {
      if (!item.categories) {
        errors.push(`Row ${idx + 2}: Categories required for DRAG_DROP (pipe-separated)`);
      }
      if (!item.dragitems) {
        errors.push(`Row ${idx + 2}: Drag items required for DRAG_DROP (format: item1:catA|item2:catB)`);
      }
    }

    // CODING validation
    if (item.quiztype && item.quiztype.toUpperCase() === 'CODING') {
      if (!item.language) {
        errors.push(`Row ${idx + 2}: Language required for CODING`);
      }
      if (!item.testcases) {
        errors.push(`Row ${idx + 2}: Test cases required for CODING`);
      }
    }

    // IMAGE_BASED validation
    if (item.quiztype && item.quiztype.toUpperCase() === 'IMAGE_BASED') {
      if (!item.mediaurl || !item.mediaurl.startsWith('https://')) {
        errors.push(`Row ${idx + 2}: IMAGE_BASED requires valid image URL`);
      }
      if (!item.coordinates) {
        errors.push(`Row ${idx + 2}: IMAGE_BASED requires coordinates (x,y,width,height)`);
      }
    }

    // AUDIO_BASED validation
    if (item.quiztype && item.quiztype.toUpperCase() === 'AUDIO_BASED') {
      if (!item.mediaurl || !item.mediaurl.startsWith('https://')) {
        errors.push(`Row ${idx + 2}: AUDIO_BASED requires valid audio URL`);
      }
      if (!item.options) {
        errors.push(`Row ${idx + 2}: Options required for AUDIO_BASED`);
      }
      if (!item.correctanswer) {
        errors.push(`Row ${idx + 2}: Correct answer required for AUDIO_BASED`);
      }
    }

    return errors;
  };

  const validateData = (data) => {
    const errors = [];

    data.forEach((item, idx) => {
      if (dataType === 'quiz') {
        const quizErrors = validateQuiz(item, idx);
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

      const collectionName = dataType === 'quiz' ? 'quizzes' : dataType === 'puzzle' ? 'puzzles' : 'stories';
      let imported = 0;
      let failed = 0;

      for (let i = 0; i < data.length; i++) {
        try {
          const item = data[i];
          
          // Build document data based on type
          let docData = {};

          if (dataType === 'quiz') {
            // Quiz: Import as full quizzes with flexible contentItems
            const contentItems = [];
            
            // Add text content if present
            if (item.question && item.question.trim()) {
              contentItems.push({
                id: `content_${Date.now()}_1`,
                type: 'text',
                value: item.question.trim(),
                url: ''
              });
            }

            // Add media content if present
            if (item.mediaurl && item.mediaurl.startsWith('https://')) {
              contentItems.push({
                id: `content_${Date.now()}_2`,
                type: item.contenttype.toLowerCase(),
                value: '',
                url: item.mediaurl
              });
            }

            // Build answer configuration based on quiz type
            let answerConfig = {};
            
            switch(item.quiztype.toUpperCase()) {
              case 'MCQ':
              case 'AUDIO_BASED':
                const optionsArray = item.options.split('|').map(o => o.trim()).filter(o => o);
                answerConfig = {
                  options: optionsArray.map((opt, idx) => ({
                    key: String.fromCharCode(65 + idx),
                    text: opt,
                    media: null
                  })),
                  correctOption: item.correctanswer.trim().toUpperCase()
                };
                break;

              case 'MULTI_SELECT':
                const multiOptions = item.options.split('|').map(o => o.trim()).filter(o => o);
                const correctAnswers = item.correctanswer.split('|').map(a => a.trim().toUpperCase());
                answerConfig = {
                  correctOptions: correctAnswers,
                  minCorrect: 1,
                  maxIncorrect: 1,
                  options: multiOptions.map((opt, idx) => ({
                    key: String.fromCharCode(65 + idx),
                    text: opt,
                    media: null
                  }))
                };
                break;

              case 'TRUE_FALSE':
                answerConfig = {
                  correctAnswer: item.correctanswer.toLowerCase() === 'true'
                };
                break;

              case 'FILL_BLANK':
                answerConfig = {
                  correctAnswers: [item.correctanswer.trim()],
                  caseSensitive: false,
                  fuzzyMatch: true,
                  fuzzyThreshold: 0.85
                };
                break;

              case 'MATCHING':
                const leftItems = item.leftitems.split('|').map(l => l.trim());
                const rightItems = item.rightitems.split('|').map(r => r.trim());
                answerConfig = {
                  leftItems: leftItems,
                  rightItems: rightItems,
                  pairs: leftItems.map((left, idx) => ({ left, right: rightItems[idx] }))
                };
                break;

              case 'ORDERING':
              case 'PUZZLE':
                const items = item.items.split('|').map(it => it.trim());
                const sequence = item.correctsequence.split(',').map(s => parseInt(s.trim()) - 1);
                answerConfig = {
                  items: items,
                  correctSequence: sequence
                };
                break;

              case 'DRAG_DROP':
                const categories = item.categories.split('|').map(c => c.trim());
                const dragItemPairs = item.dragitems.split('|').map(d => {
                  const [itemName, category] = d.split(':');
                  return { item: itemName.trim(), category: category.trim() };
                });
                answerConfig = {
                  categories: categories,
                  availableItems: dragItemPairs.map(p => p.item),
                  correctMapping: dragItemPairs.reduce((acc, p) => {
                    acc[p.item] = p.category;
                    return acc;
                  }, {})
                };
                break;

              case 'CODING':
                answerConfig = {
                  language: item.language || 'javascript',
                  template: item.codetemplate || '',
                  testCases: item.testcases ? JSON.parse(item.testcases) : []
                };
                break;

              case 'IMAGE_BASED':
                const [x, y, w, h] = item.coordinates.split(',').map(c => parseInt(c.trim()));
                answerConfig = {
                  type: 'region',
                  region: {
                    shape: 'rectangle',
                    coordinates: { x, y, width: w, height: h },
                    tolerance: 10
                  }
                };
                break;

              default:
                answerConfig = {};
            }

            docData = {
              id: `quiz_${Date.now()}_${i}`,
              title: item.title.trim(),
              description: item.description || '',
              category: item.category.trim(),
              level: item.level.trim(),
              audience: item.audience || 'all',
              quizType: item.quiztype.toUpperCase(),
              metadata: {
                timeLimit: 1800,
                totalPoints: 100,
                passingScore: 60,
                shuffle: true,
                attempts: 3,
                partialScoring: false,
                showExplanation: true,
                totalQuestions: 1
              },
              questions: [
                {
                  id: `q_${Date.now()}_1`,
                  sequence: 1,
                  points: parseInt(item.points) || 10,
                  quizType: item.quiztype.toUpperCase(),
                  question: {
                    text: item.question.trim(),
                    contentItems: contentItems
                  },
                  answer: answerConfig,
                  hint: item.hint || '',
                  explanation: item.explanation || ''
                }
              ],
              rules: {
                allowSkip: true,
                allowReview: false,
                randomizeOptions: true
              },
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
      return `title,category,level,audience,quizType,question,contentType,mediaUrl,options,correctAnswer,leftItems,rightItems,items,correctSequence,categories,dragItems,language,coordinates,points,description,hint,explanation
"Geography Basics",Geography,Beginner,all,MCQ,"What is the capital of France?",text,,Paris|London|Berlin|Madrid,A,,,,,,,,,,10,"Basic geography","Think of the Eiffel Tower","Paris is the capital"
"World Flags",Geography,Intermediate,all,MCQ,"Which country's flag is this?",image,https://example.com/flag.jpg,France|Germany|Italy|Spain,A,,,,,,,,,,15,"Identify flags","Look at colors","This is French flag"
"Science Quiz",Science,Beginner,all,TRUE_FALSE,"The Earth orbits the Sun",text,,,,,,,,,,,,10,"Earth science","It's about orbital motion","Yes, Earth orbits the Sun"
"Language Fill",Language,Intermediate,all,FILL_BLANK,"The capital of France is _____",text,,,,,,,,,,,,10,"Fill the blank","It's a European city","Paris is the answer"
"Multi Answer",Science,Intermediate,all,MULTI_SELECT,"Which are planets?",text,,Jupiter|Moon|Saturn|Sun,Jupiter|Saturn,,,,,,,,,,15,"Select multiple","Think about size","Jupiter and Saturn are planets"
"Match Pairs",History,Intermediate,all,MATCHING,"Match dates to events",text,,,,1453 - Fall of Constantinople|1492 - Columbus Discovery|1789 - French Revolution,Fall of Constantinople|Columbus Discovery|French Revolution,,,,,,,,20,"Matching exercise","Look at dates","Match correctly"
"Number Order",Math,Intermediate,all,ORDERING,"Arrange in order",text,,,,"1|2|3|4|5",1,2,3,4,5,,,10,"Order items","Smallest to largest","Correct sequence"
"Audio Question",Language,Beginner,all,AUDIO_BASED,"Listen and choose",audio,https://example.com/audio.mp3,Option A|Option B|Option C|Option D,A,,,,,,,,10,"Listening test","Listen carefully","Audio plays first"`;
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
              ? '✏️ Import complete quizzes with flexible content (text, image, video, audio). Supports MCQ, TRUE_FALSE, FILL_BLANK. Leave mediaUrl empty for text-only questions.'
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
