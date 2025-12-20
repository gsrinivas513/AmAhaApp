import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { colors } from "../theme";

function Sidebar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  /* ---------------- COLLAPSE STATE ---------------- */
  const [open, setOpen] = useState({
    global: true,
    quiz: true,
    puzzles: false,
  });

  /* Auto-expand section if route belongs to it */
  useEffect(() => {
    if (location.pathname.startsWith("/admin/quiz")) {
      setOpen((o) => ({ ...o, quiz: true }));
    }
    if (location.pathname.startsWith("/admin/puzzles")) {
      setOpen((o) => ({ ...o, puzzles: true }));
    }
  }, [location.pathname]);

  const toggle = (key) =>
    setOpen((o) => ({ ...o, [key]: !o[key] }));

  const SIDEBAR_WIDTH = 240;

  return (
    <div
        style={{
          width: SIDEBAR_WIDTH,
          background: "#ffffff",
          boxShadow: "2px 0 10px rgba(0,0,0,0.1)",
          position: "fixed",
          top: 64,
          left: 0,
          height: "calc(100vh - 64px)",
          overflowY: "auto",

          /* ✅ THIS IS THE FIX */
          boxSizing: "border-box",
          padding: 16, // keep padding, but inside width
        }}
    >
      <h2
        style={{
          background: colors.gradient,
          WebkitBackgroundClip: "text",
          color: "transparent",
          marginBottom: 24,
          fontSize: 24,
          fontWeight: 700,
        }}
      >
        Admin Panel
      </h2>

      {/* ================= GLOBAL ================= */}
      <Section
        title="Global"
        open={open.global}
        onToggle={() => toggle("global")}
      >
        <Item icon="📊" label="Dashboard" path="/admin/dashboard" active={isActive("/admin/dashboard")} />
        <Item icon="🗂️" label="Categories" path="/admin/categories" active={isActive("/admin/categories")} />
        <Item icon="🏆" label="Scores" path="/admin/scores" active={isActive("/admin/scores")} />
        <Item icon="🎨" label="UI Mode" path="/admin/ui-mode" active={isActive("/admin/ui-mode")} />
      </Section>

      {/* ================= QUIZ ================= */}
      <Section
        title="Quiz"
        open={open.quiz}
        onToggle={() => toggle("quiz")}
      >
        <Item icon="➕" label="Add Question" path="/admin/add-question" active={isActive("/admin/add-question")} />
        <Item icon="📄" label="View Questions" path="/admin/view-questions" active={isActive("/admin/view-questions")} />
        <Item icon="📊" label="Quiz Analytics" path="/admin/quiz/analytics" active={isActive("/admin/quiz-analytics")} />
        <Item icon="🎬" label="Quiz UI Animations" path="/admin/quiz-ui" active={isActive("/admin/quiz-ui")} />
      </Section>

      {/* ================= PUZZLES ================= */}
      <Section
        title="Puzzles"
        open={open.puzzles}
        onToggle={() => toggle("puzzles")}
      >
        <DisabledItem icon="🧩" label="Dashboard (Coming soon)" />
        <DisabledItem icon="⚙️" label="Config (Coming soon)" />
      </Section>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function Section({ title, open, onToggle, children }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <div
        onClick={onToggle}
        style={{
          fontSize: 12,
          fontWeight: 700,
          color: "#666",
          marginBottom: 10,
          textTransform: "uppercase",
          letterSpacing: 0.6,
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {title}
        <span style={{ fontSize: 14 }}>
          {open ? "▾" : "▸"}
        </span>
      </div>

      {open && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {children}
        </div>
      )}
    </div>
  );
}

function Item({ icon, label, path, active }) {
  return (
    <Link
      to={path}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 14px",
        borderRadius: 10,
        textDecoration: "none",
        fontSize: 15,
        fontWeight: 500,
        background: active ? colors.gradient : "transparent",
        color: active ? "#fff" : "#333",
        transition: "0.2s",
      }}
    >
      <span>{icon}</span>
      {label}
    </Link>
  );
}

function DisabledItem({ icon, label }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 14px",
        borderRadius: 10,
        fontSize: 15,
        color: "#aaa",
        background: "#f5f5f5",
        cursor: "not-allowed",
      }}
    >
      <span>{icon}</span>
      {label}
    </div>
  );
}

export default Sidebar;