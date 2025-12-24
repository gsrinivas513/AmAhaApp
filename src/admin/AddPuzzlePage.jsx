import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import { addPuzzle, updatePuzzle, getPuzzleById } from '../quiz/services/puzzleService';
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { db } from '../firebase/firebaseConfig';
import { collection, getDocs, query, where, addDoc, setDoc, doc, updateDoc, serverTimestamp } from "firebase/firestore";

const PUZZLE_TYPES = [
  { value: 'matching', label: 'Matching' },
  { value: 'ordering', label: 'Ordering' },
  { value: 'drag', label: 'Drag & Drop' },
];

const defaultPuzzle = {
  title: '',
  description: '',
  imageUrl: '',
  category: '',
  type: 'matching',
  data: {},
};

function AddPuzzlePage({ puzzleId }) {
  const [puzzle, setPuzzle] = useState(defaultPuzzle);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [bulkPuzzles, setBulkPuzzles] = useState([]);
  const [importing, setImporting] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  React.useEffect(() => {
    if (puzzleId) {
      setLoading(true);
      getPuzzleById(puzzleId)
        .then((data) => setPuzzle(data))
        .catch(() => setError('Failed to load puzzle'))
        .finally(() => setLoading(false));
    }
  }, [puzzleId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPuzzle((prev) => ({ ...prev, [name]: value }));
  };

  // Dynamic form for puzzle data based on type
  const renderPuzzleDataFields = () => {
    switch (puzzle.type) {
      case 'matching':
        return (
          <div>
            <label>Pairs (comma separated, e.g. A-1,B-2):</label>
            <input
              type="text"
              name="pairs"
              value={puzzle.data.pairs || ''}
              onChange={(e) => setPuzzle((prev) => ({
                ...prev,
                data: { ...prev.data, pairs: e.target.value },
              }))}
              className="input"
            />
          </div>
        );
      case 'ordering':
        return (
          <div>
            <label>Items (comma separated):</label>
            <input
              type="text"
              name="items"
              value={puzzle.data.items || ''}
              onChange={(e) => setPuzzle((prev) => ({
                ...prev,
                data: { ...prev.data, items: e.target.value },
              }))}
              className="input"
            />
          </div>
        );
      case 'drag':
        return (
          <div>
            <label>Draggable Items (comma separated):</label>
            <input
              type="text"
              name="draggables"
              value={puzzle.data.draggables || ''}
              onChange={(e) => setPuzzle((prev) => ({
                ...prev,
                data: { ...prev.data, draggables: e.target.value },
              }))}
              className="input"
            />
            <label>Drop Targets (comma separated):</label>
            <input
              type="text"
              name="targets"
              value={puzzle.data.targets || ''}
              onChange={(e) => setPuzzle((prev) => ({
                ...prev,
                data: { ...prev.data, targets: e.target.value },
              }))}
              className="input"
            />
          </div>
        );
      default:
        return null;
    }
  };

  // Canonical mapping for category names (add more as needed)
  const canonicalCategoryName = (input) => {
    if (!input) return "";
    const map = {
      "kids puzzles": "Kids Learning",
      "kids learning": "Kids Learning",
      "kids": "Kids Learning",
      // Add more mappings as needed
    };
    const key = input.trim().toLowerCase();
    return map[key] || input;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    try {
      // Load all categories, topics, subtopics (for name lookup)
      const canonicalCat = canonicalCategoryName(puzzle.category);
      const [categoriesSnap, topicsSnap, subtopicsSnap] = await Promise.all([
        getDocs(collection(db, "categories")),
        getDocs(collection(db, "topics")),
        getDocs(collection(db, "subtopics")),
      ]);
      const categories = categoriesSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      const topics = topicsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      const subtopics = subtopicsSnap.docs.map(d => ({ id: d.id, ...d.data() }));

      const categoryObj = categories.find(c => c.id === puzzle.category || c.name === canonicalCat || c.label === canonicalCat);
      const categoryId = categoryObj ? categoryObj.id : puzzle.category;
      const categoryName = categoryObj ? (categoryObj.label || categoryObj.name) : canonicalCat;
      const topicObj = topics.find(t => t.id === puzzle.topic || t.label === puzzle.topic || t.name === puzzle.topic);
      const topicId = topicObj ? topicObj.id : puzzle.topic;
      const topicName = topicObj ? (topicObj.label || topicObj.name) : puzzle.topic;
      const subtopicObj = subtopics.find(s => s.id === puzzle.subtopic || s.label === puzzle.subtopic || s.name === puzzle.subtopic);
      const subtopicId = subtopicObj ? subtopicObj.id : puzzle.subtopic;
      const subtopicName = subtopicObj ? (subtopicObj.label || subtopicObj.name) : puzzle.subtopic;

      const puzzleToSave = {
        ...puzzle,
        category: categoryName,
        categoryId,
        topic: topicName,
        topicId,
        subtopic: subtopicName,
        subtopicId,
      };
      if (puzzleId) {
        await updatePuzzle(puzzleId, puzzleToSave);
      } else {
        await addPuzzle(puzzleToSave);
      }
      setSuccess(true);
    } catch (err) {
      setError('Failed to save puzzle');
    } finally {
      setLoading(false);
    }
  };

  // Bulk file handlers
  const handleFile = (file) => {
    if (!file) return;
    const ext = file.name.split(".").pop().toLowerCase();
    if (ext === "csv") parseCSV(file);
    else if (ext === "xlsx" || ext === "xls") parseExcel(file);
    else if (ext === "json") parseJSON(file);
    else alert("Unsupported file type");
  };

  const parseCSV = (file) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (res) => setBulkPuzzles(res.data),
    });
  };

  const parseExcel = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const workbook = XLSX.read(e.target.result, { type: "binary" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      setBulkPuzzles(XLSX.utils.sheet_to_json(sheet));
    };
    reader.readAsBinaryString(file);
  };

  const parseJSON = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        setBulkPuzzles(JSON.parse(e.target.result));
      } catch {
        alert("Invalid JSON file");
      }
    };
    reader.readAsText(file);
  };

  // --- Bulk Import with Hierarchy Sync ---
  const saveBulkPuzzles = async () => {
    setImporting(true);
    let saved = 0;
    let failed = 0;
    try {
      // Load all existing puzzles for duplicate detection
      const allPuzzlesSnap = await getDocs(collection(db, "puzzles"));
      const existingPuzzles = allPuzzlesSnap.docs.map(d => d.data());
      // Load existing features, categories, topics, subtopics
      const [featuresSnap, categoriesSnap, topicsSnap, subtopicsSnap] = await Promise.all([
        getDocs(collection(db, "features")),
        getDocs(collection(db, "categories")),
        getDocs(collection(db, "topics")),
        getDocs(collection(db, "subtopics")),
      ]);
      const existingFeatures = featuresSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      const existingCategories = categoriesSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      const existingTopics = topicsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      const existingSubtopics = subtopicsSnap.docs.map(d => ({ id: d.id, ...d.data() }));

      // Helper: Get or create Feature
      const getOrCreateFeature = async (featureName) => {
        if (!featureName) return null;
        const nameLower = featureName.toLowerCase();
        let existing = existingFeatures.find(f => (f.name && f.name.toLowerCase() === nameLower) || (f.label && f.label.toLowerCase() === nameLower));
        if (existing) return existing.id;
        const newFeature = { name: featureName, label: featureName, type: nameLower, icon: "🧩", createdAt: serverTimestamp() };
        const docRef = await addDoc(collection(db, "features"), newFeature);
        existingFeatures.push({ id: docRef.id, ...newFeature });
        return docRef.id;
      };
      // Helper: Get or create Category
      const getOrCreateCategory = async (categoryName, featureId) => {
        if (!categoryName) return null;
        const nameLower = categoryName.toLowerCase();
        let existing = existingCategories.find(c => ((c.name && c.name.toLowerCase() === nameLower) || (c.label && c.label.toLowerCase() === nameLower) || c.id === nameLower));
        if (existing) return existing.id;
        const categoryId = nameLower;
        const newCategory = { name: categoryName, label: categoryName, featureId: featureId || null, published: true, createdAt: serverTimestamp() };
        await setDoc(doc(db, "categories", categoryId), newCategory);
        existingCategories.push({ id: categoryId, ...newCategory });
        return categoryId;
      };
      // Helper: Get or create Topic
      const getOrCreateTopic = async (topicName, categoryId) => {
        if (!topicName) return null;
        let existing = existingTopics.find(t => t.categoryId === categoryId && ((t.name && t.name.toLowerCase() === topicName.toLowerCase()) || (t.label && t.label.toLowerCase() === topicName.toLowerCase())));
        if (existing) return existing.id;
        const newTopic = { name: topicName, label: topicName, categoryId, isPublished: true, sortOrder: 0, createdAt: serverTimestamp() };
        const docRef = await addDoc(collection(db, "topics"), newTopic);
        existingTopics.push({ id: docRef.id, ...newTopic });
        return docRef.id;
      };
      // Helper: Get or create Subtopic
      const getOrCreateSubtopic = async (subtopicName, categoryId, featureId, topicId) => {
        if (!subtopicName) return null;
        let existing = existingSubtopics.find(s => s.categoryId === categoryId && ((s.name && s.name.toLowerCase() === subtopicName.toLowerCase()) || (s.label && s.label.toLowerCase() === subtopicName.toLowerCase())));
        if (existing) return existing.id;
        const newSubtopic = { name: subtopicName, label: subtopicName, categoryId, featureId: featureId || null, topicId: topicId || null, published: true, createdAt: serverTimestamp() };
        const docRef = await addDoc(collection(db, "subtopics"), newSubtopic);
        existingSubtopics.push({ id: docRef.id, ...newSubtopic });
        return docRef.id;
      };
      // --- Main Bulk Import Loop ---
      const subtopicIdsUpdated = new Set();
      const topicIdsUpdated = new Set();
      for (const p of bulkPuzzles) {
        try {
          // Duplicate detection: same title, type, subtopicId
          const isDuplicate = existingPuzzles.some(ep =>
            ep.title === p.title &&
            ep.type === p.type &&
            ep.subtopicId === p.subtopicId
          );
          if (isDuplicate) {
            failed++;
            continue;
          }
          // Canonicalize category for user-facing queries
          const canonicalCat = canonicalCategoryName(p.category || "General");
          // Hierarchy creation
          const featureId = await getOrCreateFeature(p.feature || "Puzzles");
          const categoryId = await getOrCreateCategory(canonicalCat, featureId);
          const topicId = await getOrCreateTopic(p.topic || "General", categoryId);
          const subtopicId = await getOrCreateSubtopic(p.subtopic || "General", categoryId, featureId, topicId);

          // Get names for topic and subtopic from Firestore objects
          const categoryObj = existingCategories.find(c => c.id === categoryId);
          const categoryName = categoryObj ? (categoryObj.label || categoryObj.name) : canonicalCat;
          const topicObj = existingTopics.find(t => t.id === topicId);
          const topicName = topicObj ? (topicObj.label || topicObj.name) : (p.topic || "General");
          const subtopicObj = existingSubtopics.find(s => s.id === subtopicId);
          const subtopicName = subtopicObj ? (subtopicObj.label || subtopicObj.name) : (p.subtopic || "General");

          // Prepare puzzle data
          const puzzleData = {
            title: p.title,
            description: p.description,
            imageUrl: p.imageUrl,
            type: p.type,
            category: categoryName, // name
            categoryId, // id
            topic: topicName,
            topicId,
            subtopic: subtopicName,
            subtopicId,
            featureId,
            data: {},
          };
          if (p.type === "matching" && p.pairs) puzzleData.data.pairs = p.pairs;
          if (p.type === "ordering" && p.items) puzzleData.data.items = p.items;
          if (p.type === "drag") {
            if (p.draggables) puzzleData.data.draggables = p.draggables;
            if (p.targets) puzzleData.data.targets = p.targets;
          }
          await addPuzzle(puzzleData);
          saved++;
          subtopicIdsUpdated.add(subtopicId);
          topicIdsUpdated.add(topicId);
        } catch {
          failed++;
        }
      }
      // --- Update puzzle counts for subtopics and topics ---
      for (const subtopicId of subtopicIdsUpdated) {
        const puzzlesSnap = await getDocs(query(collection(db, "puzzles"), where("subtopicId", "==", subtopicId)));
        await updateDoc(doc(db, "subtopics", subtopicId), { puzzleCount: puzzlesSnap.size });
      }
      for (const topicId of topicIdsUpdated) {
        const puzzlesSnap = await getDocs(query(collection(db, "puzzles"), where("topicId", "==", topicId)));
        await updateDoc(doc(db, "topics", topicId), { puzzleCount: puzzlesSnap.size });
      }
      alert(`Bulk import complete! Saved: ${saved}, Failed: ${failed}`);
      setBulkPuzzles([]);
    } catch (err) {
      alert("Bulk import failed");
    }
    setImporting(false);
  };

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">{puzzleId ? 'Edit Puzzle' : 'Add New Traditional Puzzle'}</h2>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {success && <div className="text-green-600 mb-2">Puzzle saved!</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={puzzle.title}
            onChange={handleChange}
            className="input"
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            name="description"
            value={puzzle.description}
            onChange={handleChange}
            className="input"
          />
        </div>
        <div>
          <label>Image URL:</label>
          <input
            type="text"
            name="imageUrl"
            value={puzzle.imageUrl}
            onChange={handleChange}
            className="input"
          />
        </div>
        <div>
          <label>Category:</label>
          <input
            type="text"
            name="category"
            value={puzzle.category}
            onChange={handleChange}
            className="input"
            required
          />
        </div>
        <div>
          <label>Type:</label>
          <select
            name="type"
            value={puzzle.type}
            onChange={handleChange}
            className="input"
          >
            {PUZZLE_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>
        {renderPuzzleDataFields()}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Puzzle'}
        </button>
      </form>
      <hr className="my-8" />
      <h3 className="text-xl font-bold mb-2">Bulk Import Puzzles (CSV / Excel / JSON)</h3>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => { e.preventDefault(); setDragActive(false); handleFile(e.dataTransfer.files[0]); }}
        className={`border-2 border-dashed p-6 rounded text-center ${dragActive ? 'bg-yellow-50' : 'bg-gray-50'}`}
      >
        Drag & Drop file here<br />
        <input type="file" accept=".csv,.xlsx,.xls,.json" onChange={(e) => handleFile(e.target.files[0])} />
      </div>
      {bulkPuzzles.length > 0 && (
        <div className="mt-4">
          <button
            className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
            onClick={saveBulkPuzzles}
            disabled={importing}
          >
            {importing ? "Importing..." : `Save ${bulkPuzzles.length} Puzzles`}
          </button>
        </div>
      )}
    </div>
    </AdminLayout>
  );
}

export default AddPuzzlePage;
