// src/pages/LeaderboardPage.jsx
import React, { useEffect, useState } from "react";
import SiteLayout from "../layouts/SiteLayout";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { BADGES } from "../config/badges";
import { useAuth } from "../components/AuthProvider";

import LoginGate from "../auth/LoginGate";
import AdUnlockGate from "../ads/AdUnlockGate";
import { useAdUnlock } from "../ads/AdUnlockProvider";

export default function LeaderboardPage() {
  const { user } = useAuth();
  const { unlocked } = useAdUnlock();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const q = query(
        collection(db, "users"),
        orderBy("stats.xp", "desc"),
        limit(50)
      );

      const snap = await getDocs(q);
      setUsers(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    })();
  }, []);

  const previewUsers = users.slice(0, 3);
  const showFull = user || unlocked;

  return (
    <SiteLayout>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <h2>🏆 Leaderboard</h2>

        {loading && <div>Loading leaderboard…</div>}

        {!loading && users.length === 0 && <div>No players yet.</div>}

        {!loading && users.length > 0 && (
          <>
            {/* 🔍 PREVIEW (TOP 3) */}
            {!showFull && (
              <div style={cardStyle}>
                {previewUsers.map((u, index) => (
                  <LeaderboardRow
                    key={u.id}
                    rank={index + 1}
                    user={u}
                    blurred
                  />
                ))}
              </div>
            )}

            {/* 🔐 LOGIN / 🎥 AD UNLOCK */}
            {!showFull && (
              <div style={{ marginTop: 28 }}>
                <AdUnlockGate
                  title="Unlock full leaderboard"
                  message="Watch a short ad or sign in to see full rankings, your position, and badges."
                />
              </div>
            )}

            {/* ✅ FULL LEADERBOARD */}
            {showFull && (
              <div style={cardStyle}>
                {users.map((u, index) => (
                  <LeaderboardRow
                    key={u.id}
                    rank={index + 1}
                    user={u}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </SiteLayout>
  );
}

/* ---------------- ROW ---------------- */

function LeaderboardRow({ rank, user, blurred }) {
  const stats = user.stats || {};
  const badges = stats.badges || [];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "60px 1fr 100px 140px",
        alignItems: "center",
        padding: "14px 16px",
        borderBottom: "1px solid #f0f0f0",
        filter: blurred ? "blur(3px)" : "none",
        opacity: blurred ? 0.75 : 1,
      }}
    >
      {/* RANK */}
      <div style={{ fontWeight: 800, textAlign: "center" }}>
        #{rank}
      </div>

      {/* USER */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <img
          src={
            user.photoURL ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              user.displayName || "U"
            )}`
          }
          alt="avatar"
          style={{ width: 40, height: 40, borderRadius: "50%" }}
        />
        <div>
          <div style={{ fontWeight: 700 }}>
            {blurred ? "Player" : user.displayName || "Player"}
          </div>
          <div style={{ fontSize: 13, color: "#777" }}>
            Level {stats.level || 0}
          </div>
        </div>
      </div>

      {/* XP */}
      <div style={{ fontWeight: 700, textAlign: "right" }}>
        {blurred ? "**** XP" : `${stats.xp || 0} XP`}
      </div>

      {/* BADGES */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 6 }}>
        {!blurred &&
          badges.map((id) => {
            const badge = Object.values(BADGES).find(
              (b) => b.id === id
            );
            return badge ? (
              <span key={id} title={badge.label} style={{ fontSize: 18 }}>
                {badge.icon}
              </span>
            ) : null;
          })}
      </div>
    </div>
  );
}

/* ---------------- STYLES ---------------- */

const cardStyle = {
  background: "#fff",
  borderRadius: 16,
  boxShadow: "0 12px 30px rgba(0,0,0,0.06)",
  overflow: "hidden",
};