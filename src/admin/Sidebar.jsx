import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { colors } from "../theme";
import {
  DashboardIcon,
  TrophyIcon,
  PlusIcon,
  DocumentIcon,
  ChartIcon,
  FilmIcon,
  PuzzleIcon,
  GearIcon,
} from "../components/icons/Icons";
// Modals removed - using route-based page components instead

/* ================= ANIMATIONS ================= */
const animationStyles = `
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-8px);
      max-height: 0;
    }
    to {
      opacity: 1;
      transform: translateY(0);
      max-height: 1000px;
    }
  }

  @keyframes slideUp {
    from {
      opacity: 1;
      transform: translateY(0);
      max-height: 1000px;
    }
    to {
      opacity: 0;
      transform: translateY(-8px);
      max-height: 0;
    }
  }
`;

// Inject styles
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = animationStyles;
  document.head.appendChild(styleSheet);
}

/* ================= COMPONENTS ================= */

// Link-based item (navigates to page)
function Item({ icon, label, path, active }) {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <Link to={path} style={{ textDecoration: "none" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "10px 12px",
          borderRadius: 8,
          fontSize: 13,
          color: active ? "#6C63FF" : "#0b1220",
          fontWeight: active ? 600 : 500,
          background: active ? "rgba(108,99,255,0.1)" : isHovered ? "rgba(108,99,255,0.05)" : "transparent",
          borderLeft: active ? "3px solid #6C63FF" : "3px solid transparent",
          cursor: "pointer",
          transition: "all 0.2s ease",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div style={{
          width: 34,
          height: 34,
          borderRadius: "50%",
          background: active ? "#6C63FF" : isHovered ? "#e8e5ff" : "#f0f0f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 16,
          color: active ? "white" : "#333",
          transition: "all 0.2s ease",
        }}>{icon}</div>
        {label}
      </div>
    </Link>
  );
}

// Modal-based item (opens modal inline)
function ModalItem({ icon, label, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 12px",
        borderRadius: 8,
        fontSize: 13,
        color: "#0b1220",
        fontWeight: 500,
        background: "transparent",
        borderLeft: "3px solid transparent",
        cursor: "pointer",
        transition: "all 0.2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "#f0f0f0";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "transparent";
      }}
    >
      <div style={{
        width: 34,
        height: 34,
        borderRadius: "50%",
        background: "#f0f0f0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 16,
        color: "#333",
      }}>{icon}</div>
      {label}
    </div>
  );
}

function Section({ title, open, onToggle, children }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <div
        onClick={onToggle}
        style={{
          fontSize: 12,
          fontWeight: 700,
          color: open ? "#6C63FF" : "#666",
          marginBottom: 10,
          textTransform: "uppercase",
          letterSpacing: 0.6,
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "8px 4px",
          borderRadius: 6,
          background: open ? "rgba(108,99,255,0.08)" : "transparent",
          borderLeft: open ? "2px solid #6C63FF" : "2px solid transparent",
          transition: "all 0.2s ease",
          userSelect: "none",
        }}
        onMouseEnter={(e) => {
          if (!open) {
            e.currentTarget.style.background = "rgba(108,99,255,0.03)";
            e.currentTarget.style.color = "#4a40c7";
          }
        }}
        onMouseLeave={(e) => {
          if (!open) {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "#666";
          }
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {title}
        </span>
        <span style={{ 
          fontSize: 14,
          transition: "transform 0.3s ease",
          display: "inline-block",
          color: open ? "#6C63FF" : "#999"
        }}>
          {open ? "▼" : "▶"}
        </span>
      </div>

      {open && (
        <div style={{ 
          display: "flex", 
          flexDirection: "column", 
          gap: 8,
          animation: "slideDown 0.25s ease-out",
          borderLeft: "2px solid rgba(108,99,255,0.2)",
          paddingLeft: 8,
          marginLeft: 4,
        }}>
          {children}
        </div>
      )}
    </div>
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
        borderRadius: 12,
        fontSize: 15,
        color: "#9aa3ad",
        background: "rgba(0,0,0,0.03)",
        cursor: "not-allowed",
      }}
    >
      <div style={{
        width: 34,
        height: 34,
        borderRadius: "50%",
        background: "rgba(0,0,0,0.04)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 16,
      }}>{icon}</div>
      {label}
    </div>
  );
}

/* ================= MAIN SIDEBAR COMPONENT ================= */

function Sidebar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  // Route-based navigation - no modal state needed

  /* Collapse State */
  const [open, setOpen] = useState({
    global: false,
    quiz: false,
    puzzles: false,
  });

  /* Auto-expand section if route belongs to it */
  useEffect(() => {
    const path = location.pathname;
    
    // Determine which section(s) should be open based on current route
    const newOpen = { ...open };
    
    // Quiz section routes
    if (path.includes("/admin/quiz") || path.includes("/admin/view-questions")) {
      newOpen.quiz = true;
    }
    
    // Puzzles section routes
    if (path.includes("/admin/puzzle") || path.includes("visual-puzzle")) {
      newOpen.puzzles = true;
    }
    
    // Global section routes (everything else under /admin)
    if (path.startsWith("/admin") && !path.includes("/admin/quiz") && !path.includes("/admin/puzzle") && !path.includes("visual-puzzle")) {
      newOpen.global = true;
    }
    
    setOpen(newOpen);
  }, [location.pathname]);

  const toggle = (key) =>
    setOpen((o) => ({ ...o, [key]: !o[key] }));

  const SIDEBAR_WIDTH = 240;

  return (
    <>
      <div
        style={{
          width: SIDEBAR_WIDTH,
          background: "linear-gradient(180deg, rgba(255,255,255,0.85), rgba(250,250,255,0.7))",
          boxShadow: "2px 8px 30px rgba(2,6,23,0.08)",
          position: "fixed",
          top: 64,
          left: 0,
          height: "calc(100vh - 64px)",
          overflowY: "auto",
          boxSizing: "border-box",
          padding: 20,
          borderRight: "1px solid rgba(2,6,23,0.04)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: 10,
            background: "linear-gradient(135deg,#6C63FF,#8A78FF)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontWeight: 800,
            boxShadow: "0 8px 20px rgba(108,99,255,0.2)",
          }}>A</div>
          <div>
            <div style={{ fontSize: 12, color: "#64748b", fontWeight: 700 }}>Admin</div>
            <div style={{ fontSize: 14, color: "#0b1220", fontWeight: 800 }}>Panel</div>
          </div>
        </div>

        {/* ================= GLOBAL ================= */}
        <Section title="Global" open={open.global} onToggle={() => toggle("global")}>
          <Item icon={<DashboardIcon />} label="Dashboard" path="/admin/dashboard" active={isActive("/admin/dashboard")} />
          <Item icon={<PlusIcon />} label="Features & Categories" path="/admin/features" active={isActive("/admin/features")} />
          <Item icon={<GearIcon />} label="Navigation Menu" path="/admin/navigation" active={isActive("/admin/navigation")} />
          <Item icon={<PlusIcon />} label="Add Content" path="/admin/add-content" active={isActive("/admin/add-content")} />
          <Item icon={<TrophyIcon />} label="Scores" path="/admin/scores" active={isActive("/admin/scores")} />
          <Item icon={<FilmIcon />} label="Social Media" path="/admin/social-media" active={isActive("/admin/social-media")} />
          <Item icon={<TrophyIcon />} label="Daily Challenge" path="/admin/daily-challenge" active={isActive("/admin/daily-challenge")} />
          <Item icon={<DocumentIcon />} label="Stories" path="/admin/stories" active={isActive("/admin/stories")} />
          <Item icon={<ChartIcon />} label="Analytics" path="/admin/analytics" active={isActive("/admin/analytics")} />
          <Item icon={<GearIcon />} label="System Tools" path="/admin/system-tools" active={isActive("/admin/system-tools")} />
          <Item icon={<GearIcon />} label="Automation Tests" path="/admin/automation-tests" active={isActive("/admin/automation-tests")} />
        </Section>

        {/* ================= QUIZ ================= */}
        <Section
          title="Quiz"
          open={open.quiz}
          onToggle={() => toggle("quiz")}
        >
          <Item icon={<DocumentIcon />} label="View Questions" path="/admin/view-questions" active={isActive("/admin/view-questions")} />
          <Item icon={<ChartIcon />} label="Quiz Analytics" path="/admin/quiz/analytics" active={isActive("/admin/quiz-analytics")} />
          <Item icon={<FilmIcon />} label="Quiz UI Animations" path="/admin/quiz-ui" active={isActive("/admin/quiz-ui")} />
        </Section>

        {/* ================= PUZZLES ================= */}
        <Section
          title="Puzzles"
          open={open.puzzles}
          onToggle={() => toggle("puzzles")}
        >
          <Item icon={<PuzzleIcon />} label="Traditional Puzzles" path="/admin/puzzles" active={isActive("/admin/puzzles")} />
          <Item icon={<PuzzleIcon />} label="Visual Puzzles" path="/admin/create-visual-puzzle" active={isActive("/admin/create-visual-puzzle")} />
          <DisabledItem icon={<GearIcon />} label="Dashboard (Coming soon)" />
        </Section>
      </div>

      {/* Routes now handled via React Router in App.js */}
    </>
  );
}

export default Sidebar;