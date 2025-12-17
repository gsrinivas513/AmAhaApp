import React, { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function ViewQuestionsPage() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    const snap = await getDocs(collection(db, "questions"));
    setList(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const remove = async (id) => {
    if (!window.confirm("Delete this question?")) return;
    await deleteDoc(doc(db, "questions", id));
    load();
  };

  return (
    <AdminLayout>
      <h2>All Questions</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", minWidth: "700px" }}>
            <thead>
              <tr>
                <th>Question</th>
                <th>Category</th>
                <th>Level</th>
                <th>Correct</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {list.map((q) => (
                <tr key={q.id}>
                  <td>{q.question}</td>
                  <td>{q.category}</td>
                  <td>{q.level || "-"}</td>
                  <td>{q.correctAnswer}</td>
                  <td>
                    <button
                      onClick={() => navigate(`/admin/edit-question/${q.id}`)}
                      style={btnSmall}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => remove(q.id)}
                      style={{ ...btnSmall, background: "#E57373" }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}

const btnSmall = {
  padding: "6px 12px",
  background: "#6C63FF",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  marginRight: "6px",
};

export default ViewQuestionsPage;