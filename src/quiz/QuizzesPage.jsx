import React from "react";
import SiteLayout from "../layouts/SiteLayout";
import QuizCategoryGrid from "./components/QuizCategoryGrid";

export default function QuizzesPage() {
  return (
    <SiteLayout>
      <section className="section">
        <div className="container">
          <h1>Choose a Quiz Category</h1>
          <p>Pick a topic and start your journey 🚀</p>
        </div>
      </section>

      <QuizCategoryGrid />
    </SiteLayout>
  );
}