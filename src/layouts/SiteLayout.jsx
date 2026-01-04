// src/layouts/SiteLayout.jsx
import React from "react";

export default function SiteLayout({ children }) {
  return (
    <main
      style={{
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      {children}
    </main>
  );
}