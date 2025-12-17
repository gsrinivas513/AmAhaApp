import React, { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import { db } from "../firebase/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useParams } from "react-router-dom";
import { colors } from "../theme";

function EditQuestionPage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    category: "",
    question: "",
    options: ["", "", "", ""],
    correctAnswer: "",
  });

  useEffect(() => {
    const loadQuestion = async () => {
      try {
        const ref = doc(db, "questions", id);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          const data = snap.data();
          setForm({
            category: data.category,
            question: data.question,
            options: data.options,
            correctAnswer: data.correctAnswer,
          });
        }
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };

    loadQuestion();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleOptionChange = (index, value) => {
    const updated = [...form.options];
    updated[index] = value;
    setForm({ ...form, options: updated });
  };

  const handleUpdate = async () => {
    try {
      const ref = doc(db, "questions", id);

      await updateDoc(ref, {
        category: form.category,
        question: form.question,
        options: form.options,
        correctAnswer: form.correctAnswer,
      });

      alert("Question updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update question");
    }
  };

  if (loading) return <AdminLayout><h3>Loading...</h3></AdminLayout>;

  return (
    <AdminLayout>
      <h2>Edit Question</h2>

      <label>Category:</label>
      <input
        type="text"
        name="category"
        value={form.category}
        onChange={handleChange}
        style={inputStyle}
      />

      <label>Question:</label>
      <input
        type="text"
        name="question"
        value={form.question}
        onChange={handleChange}
        style={inputStyle}
      />

      {form.options.map((opt, i) => (
        <div key={i}>
          <label>Option {i + 1}:</label>
          <input
            type="text"
            value={opt}
            onChange={(e) => handleOptionChange(i, e.target.value)}
            style={inputStyle}
          />
        </div>
      ))}

      <label>Correct Answer:</label>
      <input
        type="text"
        name="correctAnswer"
        value={form.correctAnswer}
        onChange={handleChange}
        style={inputStyle}
      />

      <button onClick={handleUpdate} style={buttonStyle}>
        Update Question
      </button>
    </AdminLayout>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  margin: "10px 0",
  borderRadius: "8px",
  border: "1px solid #ccc",
};

const buttonStyle = {
  padding: "14px",
  background: colors.gradient,
  color: "#fff",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  marginTop: "20px",
};

export default EditQuestionPage;