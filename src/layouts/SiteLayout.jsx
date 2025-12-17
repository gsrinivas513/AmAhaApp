// src/layouts/SiteLayout.jsx
import React from "react";

export default function SiteLayout({ children }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#f9f9fb",
        color: "#111",
      }}
    >
      {/* Main content area */}
      <main
        style={{
          flex: 1,
          width: "100%",
          maxWidth: 1000,
          margin: "80px auto 40px auto", // positions content correctly under navbar
          padding: "0 16px",
          boxSizing: "border-box",
        }}
      >
        {children}
      </main>
    </div>
  );
}