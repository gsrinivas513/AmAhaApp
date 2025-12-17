// src/admin/Sidebar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { colors } from "../theme";

function Sidebar() {
  const location = useLocation();

  const menu = [
    { label: "Dashboard", path: "/admin/dashboard", icon: "📊" },
    { label: "Add Question", path: "/admin/add-question", icon: "➕" },
    { label: "View Questions", path: "/admin/view-questions", icon: "📄" },
    { label: "Categories", path: "/admin/categories", icon: "🗂️" },
    { label: "Scores", path: "/admin/scores", icon: "🏆" },
    { label: "Quiz Rules", path: "/admin/quiz-rules", icon: "⚙️" },
    { label: "UI Mode", path: "/admin/ui-mode", icon: "🎨" },
  ];

  return (
    <div
      className="sidebar"
      style={{
        width: "240px",
        minWidth: "240px",
        background: "#ffffff",
        boxShadow: "2px 0 10px rgba(0,0,0,0.1)",
        padding: "20px",
        position: "fixed",
        top: "64px",
        left: 0,
        height: "calc(100vh - 64px)",
        overflowY: "auto",
        boxSizing: "border-box",
      }}
    >
      <h2
        style={{
          background: colors.gradient,
          WebkitBackgroundClip: "text",
          color: "transparent",
          marginBottom: "30px",
          fontSize: "24px",
          fontWeight: "700",
        }}
      >
        Admin Panel
      </h2>

      <nav style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {menu.map((item) => {
          const active = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              style={{
                fontSize: "16px",
                textDecoration: "none",
                padding: "12px 16px",
                borderRadius: "10px",
                transition: "0.25s",
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                background: active ? colors.gradient : "transparent",
                color: active ? "#fff" : "#333",
              }}
            >
              <span style={{ marginRight: "10px" }}>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export default Sidebar;