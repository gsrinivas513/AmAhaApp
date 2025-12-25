// src/layouts/SiteLayout.jsx
import React from "react";

export default function SiteLayout({ children }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "transparent",
        color: "#111",
        paddingTop: "64px", // Account for fixed navbar
      }}
    >
      {/* Main content area */}
      <main
        style={{
          flex: 1,
          width: "100%",
          maxWidth: 1000,
          margin: "40px auto",
          padding: "0 16px",
          boxSizing: "border-box",
        }}
      >
        {children}
      </main>
    </div>
  );
}