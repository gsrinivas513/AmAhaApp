// src/layouts/PublicLayout.jsx
import React, { useEffect, useState } from "react";

function PublicLayout({ children }) {
  const [dark, setDark] = useState(() => {
    const v = localStorage.getItem("darkMode");
    return v === "true";
  });

  // listen to storage changes (in case other tab toggles)
  useEffect(() => {
    const h = (e) => {
      if (e.key === "darkMode") setDark(e.newValue === "true");
    };
    window.addEventListener("storage", h);
    return () => window.removeEventListener("storage", h);
  }, []);

  const background = dark ? "#0f1724" : "#f7f8fb";
  const text = dark ? "#e6eef8" : "#111827";

  return (
    <div style={{ paddingTop: 100, paddingLeft: 20, paddingRight: 20, minHeight: "100vh", background, color: text, boxSizing: "border-box" }}>
      {children}
    </div>
  );
}

export default PublicLayout;