import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import SiteLayout from "../layouts/SiteLayout";
import DifficultyCard from "./components/DifficultyCard";

const difficulties = [
  {
    key: "easy",
    title: "Easy",
    desc: "Start learning with simple questions",
    color: "#4caf50",
    icon: "🌱",
  },
  {
    key: "medium",
    title: "Medium",
    desc: "Challenge your growing knowledge",
    color: "#ff9800",
    icon: "🔥",
  },
  {
    key: "hard",
    title: "Hard",
    desc: "For experts and champions",
    color: "#f44336",
    icon: "⚡",
  },
];

export default function DifficultySelectionPage() {
  const { category } = useParams();
  const navigate = useNavigate();

  return (
    <SiteLayout>
      <section className="section">
        <div className="container">
          <h1>Choose Difficulty</h1>
          <p>Select how challenging you want it to be</p>

          <div
            style={{
              marginTop: 32,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 24,
            }}
          >
            {difficulties.map((d) => (
              <DifficultyCard
                key={d.key}
                {...d}
                onClick={() =>
                  navigate(`/quiz/${category}/${d.key}`)
                }
              />
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}