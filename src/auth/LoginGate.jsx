import React from "react";
import { useAuth } from "../components/AuthProvider";
import { useNavigate } from "react-router-dom";

export default function LoginGate({
  title = "Save your progress",
  message = "Sign in to save progress, earn badges, and compete on leaderboards.",
  onContinue,
}) {
  const { user, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  if (user) return null;

  return (
    <div
      style={{
        maxWidth: 420,
        margin: "24px auto",
        padding: 20,
        background: "#fff",
        borderRadius: 16,
        boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
        textAlign: "center",
      }}
    >
      <h3 style={{ marginBottom: 8 }}>{title}</h3>
      <p style={{ marginBottom: 20 }}>{message}</p>

      <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
        <button
          onClick={loginWithGoogle}
          style={primaryBtn}
        >
          Sign in & Save ⭐
        </button>

        <button
          onClick={onContinue}
          style={secondaryBtn}
        >
          Continue as Guest
        </button>
      </div>
    </div>
  );
}

const primaryBtn = {
  padding: "12px 18px",
  background: "#6C63FF",
  color: "#fff",
  borderRadius: 12,
  border: "none",
  fontWeight: 700,
  cursor: "pointer",
};

const secondaryBtn = {
  padding: "12px 18px",
  background: "#f3f4f6",
  borderRadius: 12,
  border: "none",
  fontWeight: 600,
  cursor: "pointer",
};