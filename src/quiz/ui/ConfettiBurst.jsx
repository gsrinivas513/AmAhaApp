import React from "react";

export default function ConfettiBurst() {
  const pieces = Array.from({ length: 24 });

  return (
    <div style={wrapper}>
      {pieces.map((_, i) => (
        <span
          key={i}
          style={{
            ...piece,
            left: `${Math.random() * 100}%`,
            background: colors[i % colors.length],
            animationDelay: `${Math.random() * 0.3}s`,
          }}
        />
      ))}
    </div>
  );
}

const colors = ["#6C63FF", "#4caf50", "#ff9800", "#e91e63"];

const wrapper = {
  position: "fixed",
  inset: 0,
  pointerEvents: "none",
  overflow: "hidden",
  zIndex: 9999,
};

const piece = {
  position: "absolute",
  top: "-10px",
  width: 10,
  height: 10,
  borderRadius: 2,
  animation: "confettiFall 1.6s ease-out forwards",
};

/* Animation */
const style = document.createElement("style");
style.innerHTML = `
@keyframes confettiFall {
  to {
    transform: translateY(100vh) rotate(720deg);
    opacity: 0;
  }
}`;
document.head.appendChild(style);