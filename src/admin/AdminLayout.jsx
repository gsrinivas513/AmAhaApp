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

  const bg = dark ? "#071028" : "#ffffff";

  return (
    <>
      {/* FIXED SIDEBAR */}
      <Sidebar />

      {/* MAIN CONTENT */}
      <div
        style={{
          marginTop: 64,
          marginLeft: SIDEBAR_WIDTH,   // ✅ KEY FIX
          padding: 20,
          background: bg,
          minHeight: "calc(100vh - 64px)",
          width: `calc(100% - ${SIDEBAR_WIDTH}px)`, // ✅ prevents overflow
          boxSizing: "border-box",
        }}
      >
        {children}
      </div>
    </>
  );
}

export default AdminLayout;