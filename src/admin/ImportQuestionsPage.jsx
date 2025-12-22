// src/admin/ImportQuestionsPage.jsx
import React, { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import {
  addDoc,
  collection,
  getDocs,
  deleteDoc,
  doc as fsDoc,
  doc,
  setDoc,
  writeBatch,
  serverTimestamp,
  query,
  where,
  limit as fsLimit,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

/**
 * ImportQuestionsPage — Phase 2
 * Adds:
 *  - Undo Last Import (full undo)
 *  - Export Questions as CSV (all or by category)
 *  - Bulk Delete (by category or all)
 *
 * Note:
 *  - Undo stores the last import document in 'imports' collection and saves the imports doc id to localStorage key "amaha_last_import"
 *  - Export uses semicolon-separated options (same format as importer)
 *  - Bulk delete uses batched deletes (100 docs per batch)
 */

function ImportQuestionsPage() {
  const [file, setFile] = useState(null);
  const [previewCount, setPreviewCount] = useState(0);
  const [status, setStatus] = useState("");
  const [messages, setMessages] = useState([]);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState({ processed: 0, total: 0 });

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("use_csv");
  const [summary, setSummary] = useState(null);

  const [lastImportId, setLastImportId] = useState(localStorage.getItem("amaha_last_import") || null);
  const [operationInProgress, setOperationInProgress] = useState(false);
  const [opProgressText, setOpProgressText] = useState("");

  useEffect(() => {
    (async () => {
      try {
        // load categories collection if exists (it's optional)
        const snap = await getDocs(collection(db, "categories"));
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setCategories(list);
      } catch (err) {
        console.warn("No categories collection or failed to load:", err);
      }
    })();
  }, []);

  // CSV parsing helpers (robust)
  function parseCsvLine(line) {
    const result = [];
    let cur = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
        continue;
      }
      if (ch === "," && !inQuotes) {
        result.push(cur);
        cur = "";
        continue;
      }
      cur += ch;
    }
    result.push(cur);
    return result;
  }
  function parseCSV(text) {
    const lines = text.replace(/\r/g, "").split("\n");
    let headerIndex = 0;
    while (headerIndex < lines.length && lines[headerIndex].trim() === "") headerIndex++;
    if (headerIndex >= lines.length) return { header: [], rows: [] };
    const header = parseCsvLine(lines[headerIndex]).map((h) => h.trim());
    const rows = [];
    for (let i = headerIndex + 1; i < lines.length; i++) {
      const ln = lines[i];
      if (!ln || ln.trim() === "") continue;
      const cols = parseCsvLine(ln);
      const obj = {};
      header.forEach((h, idx) => {
        obj[h] = cols[idx] !== undefined ? cols[idx].trim() : "";
      });
      rows.push(obj);
    }
    return { header, rows };
  }
  function parseOptions(v) {
    if (!v) return [];
    return v.split(";").map((s) => s.trim()).filter(Boolean);
  }

  // Basic validation
  function validateRowBasics(row, rowIndex, headerHasCategory) {
    const q = (row.question || row.Question || "").trim();
    const cat = (row.category || row.Category || "").trim();
    const subcat = (row.subtopic || row.Subtopic || "").trim();
    const feat = (row.feature || row.Feature || "").trim();
    const optionsRaw = row.options || row.Options || "";
    const correct = (row.correctAnswer || row.correct || row.answer || "").trim();
    const difficulty = (row.difficulty || "").trim();

    // Debug: Log first row to check CSV parsing
    if (rowIndex === 0) {
      console.log("First CSV row data:", {
        feature: feat,
        category: cat,
        subtopic: subcat,
        question: q.substring(0, 30) + "...",
        allKeys: Object.keys(row)
      });
    }

    if (!q) return { ok: false, msg: `Row ${rowIndex + 1}: question missing` };
    if (headerHasCategory && !cat) return { ok: false, msg: `Row ${rowIndex + 1}: category missing` };
    if (!headerHasCategory && (!selectedCategory || selectedCategory === "use_csv"))
      return { ok: false, msg: `Row ${rowIndex + 1}: no category provided (select a category or include category column in CSV)` };

    const options = parseOptions(optionsRaw);
    if (options.length < 2) return { ok: false, msg: `Row ${rowIndex + 1}: at least 2 options required` };
    if (!correct) return { ok: false, msg: `Row ${rowIndex + 1}: correctAnswer missing` };
    if (!options.includes(correct))
      return { ok: false, msg: `Row ${rowIndex + 1}: correctAnswer '${correct}' not in options` };

    return {
      ok: true,
      data: {
        question: q,
        category: cat ? cat.toLowerCase() : null,
        subtopic: subcat || null,
        feature: feat || null,
        options,
        correctAnswer: correct,
        difficulty: difficulty || "easy",
        externalId: row.id || null,
      },
    };
  }

  // handle file selection
  const handleFile = (f) => {
    setFile(f);
    setMessages([]);
    setSummary(null);
    setStatus("");
    setPreviewCount(0);

    if (!f) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const { rows } = parseCSV(e.target.result);
        setPreviewCount(rows.length);
      } catch (err) {
        setStatus("Failed to parse CSV: " + (err.message || err));
      }
    };
    reader.readAsText(f);
  };

  // MAIN import function (enhanced: stores import doc)
  const handleImport = async () => {
    console.log("🚀 NEW IMPORT CODE LOADED - Version 2.0 with auto-create Feature/Category/Subtopic");
    
    setMessages([]);
    setSummary(null);
    setStatus("");
    if (!file) {
      setStatus("Please select a CSV file first.");
      return;
    }

    setImporting(true);
    setProgress({ processed: 0, total: 0 });

    try {
      const text = await file.text();
      const { header, rows } = parseCSV(text);
      if (!rows.length) {
        setStatus("No rows found in CSV.");
        setImporting(false);
        return;
      }

      const headerLower = header.map((h) => h.toLowerCase());
      const headerHasCategory = headerLower.includes("category");

      // selectedCategory logic (Option B validation): if selectedCategory === 'use_csv' -> CSV must have category
      if (selectedCategory === "use_csv" && !headerHasCategory) {
        setStatus("CSV must contain a 'category' column when 'Use CSV category' is selected.");
        setImporting(false);
        return;
      }

      setStatus("Loading existing questions for dedupe...");
      const existingSnap = await getDocs(collection(db, "questions"));
      const existingDocs = existingSnap.docs.map((d) => d.data());
      const existingByExternal = new Set(existingDocs.map((e) => (e.externalId || "").toString()));
      const existingByQuestion = new Set(existingDocs.map((e) => (e.question || "").toString().trim()));

      // Load existing Features, Categories, Subtopicies for auto-creation
      setStatus("Loading existing Features, Categories, Subtopicies...");
      const [featuresSnap, categoriesSnap, subtopicsSnap] = await Promise.all([
        getDocs(collection(db, "features")),
        getDocs(collection(db, "categories")),
        getDocs(collection(db, "subtopics"))
      ]);

      const existingFeatures = featuresSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      const existingCategories = categoriesSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      const existingSubtopicies = subtopicsSnap.docs.map(d => ({ id: d.id, ...d.data() }));

      // Helper function to find or create Feature
      const getOrCreateFeature = async (featureName) => {
        if (!featureName) return null;
        const nameLower = featureName.toLowerCase();
        
        // Check if already exists (case-insensitive)
        let existing = existingFeatures.find(f => 
          (f.name && f.name.toLowerCase() === nameLower) ||
          (f.label && f.label.toLowerCase() === nameLower)
        );
        
        if (existing) return existing.id;
        
        // Create new feature
        const newFeature = {
          name: featureName,
          label: featureName,
          type: nameLower,
          icon: "📝",
          createdAt: serverTimestamp()
        };
        
        const docRef = await addDoc(collection(db, "features"), newFeature);
        existingFeatures.push({ id: docRef.id, ...newFeature });
        console.log(`✅ Created Feature: ${featureName} (ID: ${docRef.id})`);
        return docRef.id;
      };

      // Helper function to find or create Category
      const getOrCreateCategory = async (categoryName, featureId) => {
        if (!categoryName) return null;
        const nameLower = categoryName.toLowerCase();
        
        // Check if already exists (case-insensitive)
        let existing = existingCategories.find(c => 
          ((c.name && c.name.toLowerCase() === nameLower) ||
           (c.label && c.label.toLowerCase() === nameLower) ||
           c.id === nameLower)
        );
        
        if (existing) return existing.id;
        
        // Create new category with the lowercase name as ID
        const categoryId = nameLower;
        const newCategory = {
          name: categoryName,
          label: categoryName,
          featureId: featureId || null,
          published: true,
          createdAt: serverTimestamp()
        };
        
        await setDoc(doc(db, "categories", categoryId), newCategory);
        existingCategories.push({ id: categoryId, ...newCategory });
        console.log(`✅ Created Category: ${categoryName} (ID: ${categoryId})`);
        return categoryId;
      };

      // Helper function to find or create Subtopic
      const getOrCreateSubtopic = async (subtopicName, categoryId, featureId) => {
        if (!subtopicName) return null;
        const nameLower = subtopicName.toLowerCase();
        
        // Check if already exists (case-insensitive) for this category
        let existing = existingSubtopicies.find(s => 
          s.categoryId === categoryId &&
          ((s.name && s.name.toLowerCase() === nameLower) ||
           (s.label && s.label.toLowerCase() === nameLower))
        );
        
        if (existing) return existing.id;
        
        // Create new subtopic
        const newSubtopic = {
          name: subtopicName,
          label: subtopicName,
          categoryId: categoryId,
          featureId: featureId || null,
          published: true,
          createdAt: serverTimestamp()
        };
        
        const docRef = await addDoc(collection(db, "subtopics"), newSubtopic);
        existingSubtopicies.push({ id: docRef.id, ...newSubtopic });
        console.log(`✅ Created Subtopic: ${subtopicName} (ID: ${docRef.id}) under Category: ${categoryId}`);
        return docRef.id;
      };

      const toInsert = [];
      const skipped = [];
      const errorsList = [];

      // STEP 1: Collect all unique Features, Categories, Subtopicies from CSV
      setStatus("Analyzing CSV data...");
      const uniqueFeatures = new Set();
      const uniqueCategories = new Set();
      const uniqueSubtopicies = new Map(); // key: "categoryName|subtopicName"

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const v = validateRowBasics(row, i, headerHasCategory);
        if (!v.ok) continue;

        const docInfo = v.data;
        let finalCategory = docInfo.category;
        if (headerHasCategory) {
          finalCategory = (docInfo.category || "").toLowerCase();
        } else {
          finalCategory = selectedCategory;
        }

        if (docInfo.feature) uniqueFeatures.add(docInfo.feature);
        if (finalCategory) uniqueCategories.add(finalCategory);
        if (docInfo.subtopic && finalCategory) {
          uniqueSubtopicies.set(`${finalCategory}|${docInfo.subtopic}`, {
            category: finalCategory,
            subtopic: docInfo.subtopic
          });
        }
      }

      // STEP 2: Create all Features, Categories, Subtopicies upfront
      setStatus(`Creating ${uniqueFeatures.size} Features, ${uniqueCategories.size} Categories, ${uniqueSubtopicies.size} Subtopicies...`);
      
      const featureIdMap = new Map(); // featureName -> featureId
      const categoryIdMap = new Map(); // categoryName -> categoryId
      const subtopicIdMap = new Map(); // "categoryName|subtopicName" -> subtopicId

      // Create all Features
      for (const featureName of uniqueFeatures) {
        try {
          const featureId = await getOrCreateFeature(featureName);
          featureIdMap.set(featureName, featureId);
        } catch (err) {
          console.error(`Failed to create Feature: ${featureName}`, err);
        }
      }

      // Create all Categories
      for (const categoryName of uniqueCategories) {
        try {
          // Get the first feature ID if any features were created
          const featureId = featureIdMap.values().next().value || null;
          const categoryId = await getOrCreateCategory(categoryName, featureId);
          categoryIdMap.set(categoryName, categoryId);
        } catch (err) {
          console.error(`Failed to create Category: ${categoryName}`, err);
        }
      }

      // Create all Subtopicies
      for (const [key, data] of uniqueSubtopicies) {
        try {
          const categoryId = categoryIdMap.get(data.category);
          const featureId = featureIdMap.values().next().value || null;
          const subtopicId = await getOrCreateSubtopic(data.subtopic, categoryId, featureId);
          subtopicIdMap.set(key, subtopicId);
        } catch (err) {
          console.error(`Failed to create Subtopic: ${data.subtopic}`, err);
        }
      }

      // STEP 3: Now validate and prepare questions for insertion
      setStatus("Validating questions...");
      setProgress({ processed: 0, total: rows.length });
      
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const v = validateRowBasics(row, i, headerHasCategory);
        if (!v.ok) {
          errorsList.push(v.msg);
          setProgress((p) => ({ ...p, processed: p.processed + 1 }));
          continue;
        }

        const docInfo = v.data;
        // determine final category
        let finalCategory = docInfo.category;
        if (headerHasCategory) {
          finalCategory = (docInfo.category || "").toLowerCase();
          if (selectedCategory !== "use_csv" && finalCategory !== selectedCategory) {
            skipped.push(`Row ${i + 1}: CSV category '${finalCategory}' does not match selected category '${selectedCategory}'`);
            setProgress((p) => ({ ...p, processed: p.processed + 1 }));
            continue;
          }
        } else {
          finalCategory = selectedCategory;
        }

        const ext = (docInfo.externalId || "").toString();
        const qtext = docInfo.question.trim();
        if (ext && existingByExternal.has(ext)) {
          skipped.push(`Row ${i + 1}: duplicate externalId '${ext}'`);
          setProgress((p) => ({ ...p, processed: p.processed + 1 }));
          continue;
        }
        if (existingByQuestion.has(qtext)) {
          skipped.push(`Row ${i + 1}: duplicate question text`);
          setProgress((p) => ({ ...p, processed: p.processed + 1 }));
          continue;
        }

        // Get IDs from the maps we created
        const featureId = docInfo.feature ? featureIdMap.get(docInfo.feature) : null;
        const categoryId = categoryIdMap.get(finalCategory) || finalCategory;
        const subtopicKey = `${finalCategory}|${docInfo.subtopic}`;
        const subtopicId = docInfo.subtopic ? subtopicIdMap.get(subtopicKey) : null;

        const finalDoc = {
          question: docInfo.question,
          category: categoryId,
          options: docInfo.options,
          correctAnswer: docInfo.correctAnswer,
          difficulty: docInfo.difficulty,
        };
        if (docInfo.subtopic) finalDoc.subtopic = docInfo.subtopic;
        if (docInfo.feature) finalDoc.feature = docInfo.feature;
        if (featureId) finalDoc.featureId = featureId;
        if (subtopicId) finalDoc.subtopicId = subtopicId;
        if (docInfo.externalId) finalDoc.externalId = docInfo.externalId;

        // Debug: Log first question to verify data
        if (i === 0) {
          console.log("📝 First question finalDoc:", {
            feature: finalDoc.feature,
            featureId: finalDoc.featureId,
            category: finalDoc.category,
            subtopic: finalDoc.subtopic,
            subtopicId: finalDoc.subtopicId,
            question: finalDoc.question.substring(0, 30) + "...",
            docInfo_feature: docInfo.feature,
            docInfo_subtopic: docInfo.subtopic
          });
        }

        toInsert.push({ doc: finalDoc, rowIndex: i + 1 });
        existingByQuestion.add(qtext);
        if (ext) existingByExternal.add(ext);
        setProgress((p) => ({ ...p, processed: p.processed + 1 }));
      }

      // insert into Firestore
      setStatus(`Inserting ${toInsert.length} rows into Firestore...`);
      setProgress({ processed: 0, total: toInsert.length });

      const insertedIds = [];
      for (let i = 0; i < toInsert.length; i++) {
        try {
          const ref = await addDoc(collection(db, "questions"), toInsert[i].doc);
          insertedIds.push(ref.id);
        } catch (err) {
          errorsList.push(`Row ${toInsert[i].rowIndex}: failed to write - ${err.message}`);
        }
        setProgress((p) => ({ ...p, processed: p.processed + 1 }));
      }

      // save import record
      const importRecord = {
        count: insertedIds.length,
        insertedIds,
        category: selectedCategory === "use_csv" ? "from_csv" : selectedCategory,
        createdAt: serverTimestamp(),
      };
      let importDocRef = null;
      try {
        importDocRef = await addDoc(collection(db, "imports"), importRecord);
        // store last import id locally
        localStorage.setItem("amaha_last_import", importDocRef.id);
        setLastImportId(importDocRef.id);
      } catch (err) {
        console.warn("Failed to persist import record:", err);
      }

      setSummary({
        totalRows: rows.length,
        inserted: insertedIds.length,
        skipped: skipped.length,
        errors: errorsList.length,
      });

      const combined = [...skipped, ...errorsList];
      setMessages(combined);
      setStatus(`Import completed: ${insertedIds.length} added, ${skipped.length} skipped, ${errorsList.length} errors.`);
      setFile(null);
      setPreviewCount(0);
    } catch (err) {
      console.error("Import error:", err);
      setStatus("Import failed: " + (err.message || err));
    } finally {
      setImporting(false);
      setProgress({ processed: 0, total: 0 });
    }
  };

  // UNDO last import (Option A): delete all docs whose ids are recorded in the latest import doc
  const undoLastImport = async () => {
    const id = localStorage.getItem("amaha_last_import") || lastImportId;
    if (!id) {
      alert("No last import recorded.");
      return;
    }
    if (!window.confirm("Undo last import? This will DELETE all questions added by the last import. This cannot be undone.")) return;

    setOperationInProgress(true);
    setOpProgressText("Fetching import record...");
    try {
      const impSnap = await getDocs(query(collection(db, "imports"), where("__name__", "==", id), fsLimit(1)));
      // getDocs with where("__name__"...) might not be allowed on all flavors; fallback to getDoc not used to avoid more imports complexity
      // Simpler: read the imports collection and find id
      let impDoc = null;
      if (!impSnap.empty) {
        impDoc = impSnap.docs[0].data();
      } else {
        // fallback: try getDocs(collection) and find doc
        const allImports = await getDocs(collection(db, "imports"));
        const found = allImports.docs.find((d) => d.id === id);
        if (found) impDoc = found.data();
      }

      if (!impDoc) {
        // try direct get by iterating imports (fallback), or just notify user
        setStatus("Could not locate import metadata in 'imports' collection. Undo unavailable.");
        setOperationInProgress(false);
        return;
      }

      const ids = impDoc.insertedIds || [];
      if (ids.length === 0) {
        setStatus("No inserted IDs recorded for last import.");
        setOperationInProgress(false);
        return;
      }

      // delete in batches (100)
      setOpProgressText(`Deleting ${ids.length} documents...`);
      const chunkSize = 100;
      let deletedCount = 0;
      for (let i = 0; i < ids.length; i += chunkSize) {
        const batch = writeBatch(db);
        const chunk = ids.slice(i, i + chunkSize);
        chunk.forEach((qid) => {
          batch.delete(fsDoc(db, "questions", qid));
        });
        await batch.commit();
        deletedCount += chunk.length;
        setOpProgressText(`Deleted ${deletedCount} / ${ids.length}`);
      }

      // optionally delete the imports doc itself
      try {
        await deleteDoc(fsDoc(db, "imports", id));
      } catch (err) {
        console.warn("Failed to delete import record (non-critical):", err);
      }

      localStorage.removeItem("amaha_last_import");
      setLastImportId(null);
      setStatus(`Undo completed. Deleted ${deletedCount} questions.`);
      setMessages([]);
    } catch (err) {
      console.error("Undo failed:", err);
      setStatus("Undo failed: " + (err.message || err));
    } finally {
      setOperationInProgress(false);
      setOpProgressText("");
    }
  };

  // EXPORT questions to CSV (all or by category)
  const exportQuestions = async (category = "all") => {
    setOperationInProgress(true);
    setOpProgressText("Fetching questions...");
    try {
      let qRef;
      if (category === "all") {
        qRef = collection(db, "questions");
      } else {
        qRef = query(collection(db, "questions"), where("category", "==", category));
      }
      const snap = await getDocs(qRef);
      const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

      // build CSV
      const header = ["id", "question", "category", "options", "correctAnswer", "difficulty"];
      const lines = [];
      lines.push(header.join(","));
      docs.forEach((d) => {
        const options = Array.isArray(d.options) ? d.options.join(";") : (d.options || "");
        // escape commas or quotes by wrapping fields that contain commas/quotes in quotes and doubling quotes inside
        const wrap = (s) => {
          if (s === null || s === undefined) return "";
          const str = String(s);
          if (str.includes('"')) return `"${str.replace(/"/g, '""')}"`;
          if (str.includes(",") || str.includes("\n")) return `"${str}"`;
          return str;
        };
        const row = [
          wrap(d.externalId || d.id || ""),
          wrap(d.question || ""),
          wrap(d.category || ""),
          wrap(options),
          wrap(d.correctAnswer || ""),
          wrap(d.difficulty || ""),
        ];
        lines.push(row.join(","));
      });

      const csv = lines.join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const filename = category === "all" ? "questions_all.csv" : `questions_${category}.csv`;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setStatus(`Exported ${docs.length} questions.`);
    } catch (err) {
      console.error("Export failed:", err);
      setStatus("Export failed: " + (err.message || err));
    } finally {
      setOperationInProgress(false);
      setOpProgressText("");
    }
  };

  // BULK delete by category or all
  const bulkDelete = async (category = "all") => {
    if (!window.confirm(category === "all" ? "Delete ALL questions? This is irreversible." : `Delete all questions in category '${category}'? This is irreversible.`)) return;
    setOperationInProgress(true);
    setOpProgressText("Fetching documents to delete...");
    try {
      let qRef;
      if (category === "all") qRef = collection(db, "questions");
      else qRef = query(collection(db, "questions"), where("category", "==", category));
      const snap = await getDocs(qRef);
      const docs = snap.docs.map((d) => ({ id: d.id }));

      const total = docs.length;
      if (total === 0) {
        setStatus("No documents to delete.");
        setOperationInProgress(false);
        setOpProgressText("");
        return;
      }

      setOpProgressText(`Deleting ${total} documents...`);
      const chunkSize = 100;
      let deleted = 0;
      for (let i = 0; i < docs.length; i += chunkSize) {
        const batch = writeBatch(db);
        const chunk = docs.slice(i, i + chunkSize);
        chunk.forEach((x) => batch.delete(fsDoc(db, "questions", x.id)));
        await batch.commit();
        deleted += chunk.length;
        setOpProgressText(`Deleted ${deleted} / ${total}`);
      }

      setStatus(`Bulk delete completed: ${deleted} documents removed.`);
      // if we deleted all, clear last import marker
      if (category === "all") {
        localStorage.removeItem("amaha_last_import");
        setLastImportId(null);
      }
    } catch (err) {
      console.error("Bulk delete failed:", err);
      setStatus("Bulk delete failed: " + (err.message || err));
    } finally {
      setOperationInProgress(false);
      setOpProgressText("");
    }
  };

  return (
    <AdminLayout>
      <h2>Import Questions (CSV) — Admin Console</h2>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 12 }}>
        <div style={{ background: "#fff", padding: 14, borderRadius: 8 }}>
          <p>
            CSV columns: <b>id, question, category, options, correctAnswer, difficulty</b>.
            Options: semicolon-separated (A;B;C;D).
          </p>

          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <input type="file" accept=".csv" onChange={(e) => handleFile(e.target.files && e.target.files[0])} />

            <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
              <label style={{ fontSize: 14 }}>Category</label>
              <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} style={{ padding: 8, borderRadius: 6 }}>
                <option value="use_csv">Use CSV category (validate)</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.label || c.id}</option>)}
              </select>
            </div>
          </div>

          <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
            <button onClick={() => { setStatus(""); setMessages([]); setSummary(null); }} style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid #ddd", background: "#fff" }}>Clear</button>

            <button
              onClick={() => {
                if (!file) { setStatus("Please select a CSV first"); return; }
                handleImport();
              }}
              disabled={importing}
              style={{ marginLeft: "auto", padding: "8px 12px", borderRadius: 8, background: "#6C63FF", color: "#fff", border: "none" }}
            >
              {importing ? "Importing..." : "Start Import"}
            </button>
          </div>

          <div style={{ marginTop: 12 }}>Rows detected: <strong>{previewCount}</strong></div>
          {status && <div style={{ marginTop: 10 }}>{status}</div>}

          {importing && (
            <div style={{ marginTop: 12 }}>
              <div style={{ height: 10, background: "#eee", borderRadius: 6, overflow: "hidden" }}>
                <div style={{ height: "100%", width: progress.total ? `${Math.round((progress.processed / progress.total) * 100)}%` : "0%", background: "#6C63FF", transition: "width 300ms linear" }} />
              </div>
              <div style={{ marginTop: 6, fontSize: 13, color: "#555" }}>Processed: {progress.processed} / {progress.total}</div>
            </div>
          )}
        </div>

        <div>
          <div style={{ background: "#fff", padding: 12, borderRadius: 8, marginBottom: 12 }}>
            <h4 style={{ marginTop: 0 }}>Undo Last Import</h4>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <button onClick={undoLastImport} disabled={operationInProgress || !lastImportId} style={{ padding: "8px 12px", borderRadius: 8, background: "#FF7043", color: "#fff", border: "none", cursor: lastImportId ? "pointer" : "not-allowed" }}>
                Undo Last Import
              </button>
              <div style={{ color: "#666" }}>{lastImportId ? `Last import id: ${lastImportId}` : "No last import recorded"}</div>
            </div>
            {operationInProgress && <div style={{ marginTop: 8, color: "#666" }}>{opProgressText}</div>}
          </div>

          <div style={{ background: "#fff", padding: 12, borderRadius: 8, marginBottom: 12 }}>
            <h4 style={{ marginTop: 0 }}>Export Questions</h4>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => exportQuestions("all")} disabled={operationInProgress} style={{ padding: "8px 10px", borderRadius: 8 }}>Export All</button>
              <div style={{ display: "flex", gap: 8 }}>
                {categories.map((c) => (
                  <button key={c.id} onClick={() => exportQuestions(c.id)} disabled={operationInProgress} style={{ padding: "8px 10px", borderRadius: 8 }}>{c.label || c.id}</button>
                ))}
              </div>
            </div>
            <div style={{ marginTop: 8, color: "#666" }}>Export format: CSV, options semicolon-separated.</div>
          </div>

          <div style={{ background: "#fff", padding: 12, borderRadius: 8 }}>
            <h4 style={{ marginTop: 0 }}>Bulk Delete</h4>
            <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <button onClick={() => bulkDelete("all")} disabled={operationInProgress} style={{ padding: "8px 10px", borderRadius: 8, background: "#d32f2f", color: "#fff", border: "none" }}>Delete All Questions</button>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {categories.map((c) => (
                <button key={c.id} onClick={() => bulkDelete(c.id)} disabled={operationInProgress} style={{ padding: "8px 10px", borderRadius: 8 }}>{`Delete ${c.label || c.id}`}</button>
              ))}
            </div>
            {operationInProgress && <div style={{ marginTop: 8, color: "#666" }}>{opProgressText}</div>}
          </div>
        </div>
      </div>

      {/* Summary & Messages */}
      <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 420px", gap: 12 }}>
        <div style={{ background: "#fff", padding: 12, borderRadius: 8 }}>
          <h4 style={{ marginTop: 0 }}>Summary</h4>
          {summary ? (
            <div>
              <div>Total rows in CSV: <strong>{summary.totalRows}</strong></div>
              <div>Inserted: <strong>{summary.inserted}</strong></div>
              <div>Skipped: <strong>{summary.skipped}</strong></div>
              <div>Errors: <strong>{summary.errors}</strong></div>
            </div>
          ) : (
            <div style={{ color: "#666" }}>No import summary yet.</div>
          )}
        </div>

        <div style={{ background: "#fff", padding: 12, borderRadius: 8, maxHeight: 420, overflowY: "auto" }}>
          <h4 style={{ marginTop: 0 }}>Messages</h4>
          {messages.length === 0 ? <div style={{ color: "#666" }}>No messages</div> : <ul>{messages.map((m, i) => <li key={i}>{m}</li>)}</ul>}
        </div>
      </div>
    </AdminLayout>
  );
}

export default ImportQuestionsPage;