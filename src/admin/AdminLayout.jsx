// src/admin/AdminLayout.jsx
import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";

function AdminLayout({ children }) {
  const [dark, setDark] = useState(() => localStorage.getItem("darkMode") === "true");

  useEffect(() => {
    const h = (e) => {
      if (e.key === "darkMode") setDark(e.newValue === "true");
    };
    window.addEventListener("storage", h);
    return () => window.removeEventListener("storage", h);
  }, []);

  const bg = dark ? "#071028" : "#ffffff";

  return (
    <div style={{ display: "flex", marginTop: 64, width: "100%", overflowX: "hidden", background: bg, minHeight: "calc(100vh - 64px)" }}>
      <Sidebar />
      <div style={{ marginLeft: 240, padding: 20, width: "calc(100% - 240px)", background: bg, minHeight: "calc(100vh - 64px)" }}>
        {children}
      </div>
    </div>
  );
}

export default AdminLayout;