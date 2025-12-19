import React, { useState } from "react";
import AdminLayout from "./AdminLayout";
import { db } from "../firebase/firebaseConfig";
import { addDoc, collection } from "firebase/firestore";
import Papa from "papaparse";
import * as XLSX from "xlsx";

function AddQuestionPage() {
  /* ---------------- MANUAL FORM ---------------- */
  const [form, setForm] = useState({
    question: "",
    options: ["", "", "", ""],
    correctAnswer: "",
    category: "",
    difficulty: "", // ✅ FIX: use difficulty
  });

  /* ---------------- BULK IMPORT ---------------- */
  const [importedQuestions, setImportedQuestions] = useState([]);
  const [importing, setImporting] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  /* ---------------- MANUAL HELPERS ---------------- */
  const update = (field, value) =>
    setForm({ ...form, [field]: value });

  const updateOption = (i, value) => {
    const copy = [...form.options];
    copy[i] = value;
    update("options", copy);
  };

  /* ---------------- SAVE MANUAL ---------------- */
  const saveManual = async () => {
    if (
      !form.question ||
      !form.correctAnswer ||
      !form.category ||
      !form.difficulty ||
      form.options.some((o) => !o)
    ) {
      alert("Fill all fields");
      return;
    }

    await addDoc(collection(db, "questions"), {
      ...form,
      createdAt: new Date(),
    });

    alert("Question added!");
    setForm({
      question: "",
      options: ["", "", "", ""],
      correctAnswer: "",
      category: "",
      difficulty: "",
    });
  };

  /* ---------------- FILE HANDLING ---------------- */

  const handleFile = (file) => {
    if (!file) return;
    const ext = file.name.split(".").pop().toLowerCase();

    if (ext === "csv") parseCSV(file);
    else if (ext === "xlsx" || ext === "xls") parseExcel(file);
    else alert("Unsupported file type");
  };

  const parseCSV = (file) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (res) => normalizeQuestions(res.data),
    });
  };

  const parseExcel = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const workbook = XLSX.read(e.target.result, { type: "binary" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      normalizeQuestions(XLSX.utils.sheet_to_json(sheet));
    };
    reader.readAsBinaryString(file);
  };

  /* ---------------- NORMALIZE ---------------- */

const normalizeQuestions = (rows) => {
  const formatted = rows.map((q, idx) => {
    console.log("RAW ROW:", q); // ✅ keep for debug

    return {
      question: q.question?.trim(),
      options: [
        q.optionA,
        q.optionB,
        q.optionC,
        q.optionD,
      ],
      correctAnswer: q.correctAnswer?.trim(),
      category: q.category?.trim(),
      difficulty: q.difficulty?.trim(), // ✅ FORCE difficulty
      createdAt: new Date(),
    };
  });

  setImportedQuestions(formatted);
};

  /* ---------------- SAVE BULK ---------------- */

  const saveImported = async () => {
    setImporting(true);

    let saved = 0;

    for (const q of importedQuestions) {
      if (
        !q.question ||
        q.options.some((o) => !o) ||
        !q.correctAnswer ||
        !q.category ||
        !q.difficulty
      ) continue;

      await addDoc(collection(db, "questions"), {
        ...q,
        createdAt: new Date(),
      });

      saved++;
    }

    alert(`Bulk import successful! Saved ${saved} questions.`);
    setImportedQuestions([]);
    setImporting(false);
  };

  /* ---------------- TEMPLATES ---------------- */

  const downloadCSVTemplate = () => {
    const csv =
      "question,optionA,optionB,optionC,optionD,correctAnswer,category,difficulty\n";

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "quiz_questions_template.csv";
    link.click();
  };

  const downloadExcelTemplate = () => {
    const ws = XLSX.utils.json_to_sheet([
      {
        question: "",
        optionA: "",
        optionB: "",
        optionC: "",
        optionD: "",
        correctAnswer: "",
        category: "",
        difficulty: "",
      },
    ]);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Questions");
    XLSX.writeFile(wb, "quiz_questions_template.xlsx");
  };

  /* ---------------- UI ---------------- */

  return (
    <AdminLayout>
      <h2>Add Question (Manual)</h2>

      <input
        style={fullWidth}
        placeholder="Question"
        value={form.question}
        onChange={(e) => update("question", e.target.value)}
      />

      <h4>Options</h4>
      {form.options.map((o, i) => (
        <input
          key={i}
          style={mediumWidth}
          placeholder={`Option ${i + 1}`}
          value={o}
          onChange={(e) => updateOption(i, e.target.value)}
        />
      ))}

      <input
        style={mediumWidth}
        placeholder="Correct Answer"
        value={form.correctAnswer}
        onChange={(e) => update("correctAnswer", e.target.value)}
      />

      <select
        style={mediumWidth}
        value={form.category}
        onChange={(e) => update("category", e.target.value)}
      >
        <option value="">Select Category</option>
        <option value="kids">Kids</option>
        <option value="students">Students</option>
        <option value="programming">Programming</option>
        <option value="movies">Movies</option>
      </select>

      <select
        style={mediumWidth}
        value={form.difficulty}
        onChange={(e) => update("difficulty", e.target.value)}
      >
        <option value="">Select Difficulty</option>
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>

      <button style={btn} onClick={saveManual}>
        Add Question
      </button>

      <hr style={{ margin: "40px 0" }} />

      <h2>Bulk Import (CSV / Excel)</h2>

      <button style={btn} onClick={downloadCSVTemplate}>
        Download CSV Template
      </button>
      <button style={btn} onClick={downloadExcelTemplate}>
        Download Excel Template
      </button>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          handleFile(e.dataTransfer.files[0]);
        }}
        style={{
          border: "2px dashed #6C63FF",
          padding: 30,
          borderRadius: 12,
          textAlign: "center",
          background: dragActive ? "#f3f4ff" : "#fafafa",
          marginTop: 20,
        }}
      >
        Drag & Drop CSV / Excel here
        <br />
        <input
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={(e) => handleFile(e.target.files[0])}
        />
      </div>

      {importedQuestions.length > 0 && (
        <button
          onClick={saveImported}
          disabled={importing}
          style={btn}
        >
          {importing ? "Importing..." : "Save Imported Questions"}
        </button>
      )}
    </AdminLayout>
  );
}

/* ---------------- STYLES ---------------- */

const fieldBase = {
  padding: "10px 12px",
  borderRadius: "8px",
  marginTop: "10px",
  border: "1px solid #ddd",
  fontSize: "14px",
};

const fullWidth = { ...fieldBase, width: "80%" };
const mediumWidth = { ...fieldBase, width: "60%" };

const btn = {
  marginTop: "20px",
  padding: "12px 20px",
  background: "#6C63FF",
  color: "white",
  border: "none",
  borderRadius: "8px",
  fontWeight: 600,
  marginRight: 10,
};

export default AddQuestionPage;