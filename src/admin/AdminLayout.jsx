// src/admin/AdminLayout.jsx
import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";

const SIDEBAR_WIDTH = 240;

function AdminLayout({ children }) {
  const [dark, setDark] = useState(
    () => localStorage.getItem("darkMode") === "true"
  );

  useEffect(() => {
    const h = (e) => {
      if (e.key === "darkMode") {
        setDark(e.newValue === "true");
      }
    };
    window.addEventListener("storage", h);
    return () => window.removeEventListener("storage", h);
  }, []);

  const bg = dark ? "linear-gradient(180deg,#061226 0%, #071028 100%)" : "linear-gradient(180deg,#f5f8ff 0%, #eef6ff 100%)";

  return (
    <>
      {/* FIXED SIDEBAR */}
      <Sidebar />

      {/* MAIN CONTENT — centered container with card */}
      <div
        style={{
          marginTop: 64,
          marginLeft: SIDEBAR_WIDTH,
          padding: 32,
          background: bg,
          minHeight: "calc(100vh - 64px)",
          width: `calc(100% - ${SIDEBAR_WIDTH}px)`,
          boxSizing: "border-box",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 1100,
            background: dark ? "rgba(4,6,12,0.45)" : "linear-gradient(180deg,#ffffff 0%, #fbfdff 100%)",
            borderRadius: 16,
            padding: 28,
            boxShadow: dark ? "0 20px 60px rgba(2,6,23,0.6)" : "0 20px 48px rgba(2,6,23,0.08)",
            border: dark ? "1px solid rgba(255,255,255,0.04)" : "1px solid rgba(2,6,23,0.04)",
            backdropFilter: dark ? "blur(6px)" : "none",
          }}
        >
          {children}
        </div>
      </div>
    </>
  );
}

export default AdminLayout;