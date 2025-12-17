import React, { useState } from "react";
import AdminLayout from "./AdminLayout";
import { db } from "../firebase/firebaseConfig";
import { addDoc, collection } from "firebase/firestore";

function AddQuestionPage() {
  const [form, setForm] = useState({
    question: "",
    options: ["", "", "", ""],
    correctAnswer: "",
    category: "",
    level: "",
  });

  const update = (field, value) =>
    setForm({ ...form, [field]: value });

  const updateOption = (i, value) => {
    const copy = [...form.options];
    copy[i] = value;
    update("options", copy);
  };

  const save = async () => {
    if (
      !form.question ||
      !form.correctAnswer ||
      !form.category ||
      form.options.some((o) => !o)
    ) {
      alert("Fill all fields");
      return;
    }

    await addDoc(collection(db, "questions"), form);
    alert("Question added!");
    setForm({
      question: "",
      options: ["", "", "", ""],
      correctAnswer: "",
      category: "",
      level: "",
    });
  };

  return (
    <AdminLayout>
      <h2>Add New Question</h2>

      <input
        placeholder="Question"
        style={input}
        value={form.question}
        onChange={(e) => update("question", e.target.value)}
      />

      <h3>Options</h3>
      {form.options.map((o, i) => (
        <input
          key={i}
          style={input}
          placeholder={`Option ${i + 1}`}
          value={form.options[i]}
          onChange={(e) => updateOption(i, e.target.value)}
        />
      ))}

      <input
        placeholder="Correct Answer"
        style={input}
        value={form.correctAnswer}
        onChange={(e) => update("correctAnswer", e.target.value)}
      />

      <select
        style={input}
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
        style={input}
        value={form.level}
        onChange={(e) => update("level", e.target.value)}
      >
        <option value="">Select Level</option>
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>

      <button style={btn} onClick={save}>
        Add Question
      </button>
    </AdminLayout>
  );
}

const input = {
  width: "100%",
  padding: "10px",
  borderRadius: "8px",
  marginTop: "10px",
};

const btn = {
  marginTop: "20px",
  padding: "12px 20px",
  background: "#6C63FF",
  color: "white",
  border: "none",
  borderRadius: "8px",
};

export default AddQuestionPage;