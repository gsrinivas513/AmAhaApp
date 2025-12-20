// src/home/components/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer
      style={{
        background: "#ffffff",
        borderTop: "1px solid #e5e7eb",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 24,
        }}
      >
        {/* BRAND */}
        <div>
          <h3 style={{ fontWeight: 800 }}>AmAhA.com</h3>
          <p style={{ marginTop: 8 }}>
            Learn. Play. Grow smarter every day.
          </p>
        </div>

        {/* FEATURES */}
        <div>
          <h4>Features</h4>
          <FooterLink to="/quiz">Quizzes</FooterLink>
          <FooterLink to="/">Puzzles (Coming)</FooterLink>
          <FooterLink to="/">Studies (Coming)</FooterLink>
          <FooterLink to="/">Art & Literature</FooterLink>
        </div>

        {/* COMMUNITY */}
        <div>
          <h4>Community</h4>
          <FooterLink to="/leaderboard/kids">Leaderboard</FooterLink>
          <FooterLink to="/profile">My Profile</FooterLink>
          <FooterLink to="/settings">Settings</FooterLink>
        </div>

        {/* LEGAL / TRUST */}
        <div>
          <h4>Legal</h4>
          <FooterLink to="/">Privacy Policy</FooterLink>
          <FooterLink to="/">Terms of Service</FooterLink>
          <FooterLink to="/">Contact</FooterLink>
        </div>
      </div>

      {/* COPYRIGHT */}
      <div
        style={{
          textAlign: "center",
          marginTop: 32,
          fontSize: 13,
          color: "#6b7280",
        }}
      >
        © {new Date().getFullYear()} AmAhA.com. Built with ❤️ for learners.
      </div>
    </footer>
  );
}

/* ---------------- helper ---------------- */

function FooterLink({ to, children }) {
  return (
    <div style={{ marginTop: 8 }}>
      <Link
        to={to}
        style={{
          textDecoration: "none",
          color: "#4b5563",
          fontSize: 14,
        }}
      >
        {children}
      </Link>
    </div>
  );
}