import React, { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Card, Button } from "../components/ui";

function ViewQuestionsPage() {
  const [selectedIds, setSelectedIds] = useState([]);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  /* ---------- LOAD QUESTIONS ---------- */
  const load = async () => {
    setLoading(true);
    const snap = await getDocs(collection(db, "questions"));
    setList(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  /* ---------- SINGLE DELETE ---------- */
  const remove = async (id) => {
    if (!window.confirm("Delete this question?")) return;
    await deleteDoc(doc(db, "questions", id));
    load();
  };

  /* ---------- BULK DELETE ---------- */
  const handleBulkDelete = async () => {
    if (!window.confirm("Delete selected questions?")) return;

    for (const id of selectedIds) {
      await deleteDoc(doc(db, "questions", id));
    }

    setSelectedIds([]);
    load();
  };

  return (
    <AdminLayout>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 12 }}>
        <h2 style={{ margin: 0 }}>All Questions</h2>
        {selectedIds.length > 0 && (
          <Button variant="danger" size="sm" onClick={handleBulkDelete}>Delete Selected ({selectedIds.length})</Button>
        )}
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <Card>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", minWidth: "700px" }}>
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={
                      list.length > 0 &&
                      selectedIds.length === list.length
                    }
                    onChange={(e) =>
                      setSelectedIds(
                        e.target.checked ? list.map((q) => q.id) : []
                      )
                    }
                  />
                </th>
                <th>Question</th>
                <th>Category</th>
                <th>difficulty</th>
                <th>Correct</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {list.map((q) => (
                <tr key={q.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(q.id)}
                      onChange={(e) => {
                        setSelectedIds((prev) =>
                          e.target.checked
                            ? [...prev, q.id]
                            : prev.filter((id) => id !== q.id)
                        );
                      }}
                    />
                  </td>
                  <td>{q.question}</td>
                  <td>{q.category}</td>
                  <td>{q.difficulty || "-"}</td>
                  <td>{q.correctAnswer}</td>
                  <td>
                    <Button size="sm" onClick={() => navigate(`/admin/edit-question/${q.id}`)}>Edit</Button>
                    <Button variant="danger" size="sm" onClick={() => remove(q.id)} style={{ marginLeft: 8 }}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </Card>
      )}
    </AdminLayout>
  );
}

// replaced inline btn styles with shared Button component

export default ViewQuestionsPage;