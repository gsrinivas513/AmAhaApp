import React, { useEffect, useState } from "react";
import SiteLayout from "../layouts/SiteLayout";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { BADGES } from "../config/badges";

export default function LeaderboardPage() {
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
      const rows = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      setUsers(rows);
      setLoading(false);
    })();
  }, []);

  return (
    <SiteLayout>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <h2>Leaderboard</h2>

        {loading && <div>Loading leaderboard…</div>}

        {!loading && users.length === 0 && (
          <div>No players yet.</div>
        )}

        {!loading && users.length > 0 && (
          <div style={{
            background: "#fff",
            borderRadius: 14,
            boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
            overflow: "hidden",
          }}>
            {users.map((u, index) => (
              <LeaderboardRow
                key={u.id}
                rank={index + 1}
                user={u}
              />
            ))}
          </div>
        )}
      </div>
    </SiteLayout>
  );
}

function LeaderboardRow({ rank, user }) {
  const stats = user.stats || {};
  const badges = stats.badges || [];

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "60px 1fr 100px 140px",
      alignItems: "center",
      padding: "14px 16px",
      borderBottom: "1px solid #f0f0f0",
    }}>
      {/* RANK */}
      <div style={{
        fontWeight: 800,
        textAlign: "center",
        color: rank <= 3 ? "#6C63FF" : "#555",
      }}>
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
            {user.displayName || "Player"}
          </div>
          <div style={{ fontSize: 13, color: "#777" }}>
            Level {stats.level || 0}
          </div>
        </div>
      </div>

      {/* XP */}
      <div style={{ fontWeight: 700, textAlign: "right" }}>
        {stats.xp || 0} XP
      </div>

      {/* BADGES */}
      <div style={{
        display: "flex",
        justifyContent: "flex-end",
        gap: 6,
        flexWrap: "wrap",
      }}>
        {badges.map((id) => {
          const badge = Object.values(BADGES).find(b => b.id === id);
          if (!badge) return null;
          return (
            <span key={id} title={badge.label} style={{ fontSize: 18 }}>
              {badge.icon}
            </span>
          );
        })}
      </div>
    </div>
  );
}