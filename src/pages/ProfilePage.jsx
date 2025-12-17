import React, { useEffect, useState } from "react";
import SiteLayout from "../layouts/SiteLayout";
import { useAuth } from "../components/AuthProvider";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { BADGES } from "../config/badges";

export default function ProfilePage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    (async () => {
      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists()) {
        setStats(snap.data().stats || {});
      }
      setLoading(false);
    })();
  }, [user]);

  if (loading) {
    return (
      <SiteLayout>
        <div>Loading profile…</div>
      </SiteLayout>
    );
  }

  if (!user) {
    return (
      <SiteLayout>
        <div>Please sign in to view your profile.</div>
      </SiteLayout>
    );
  }

  const xp = stats?.xp || 0;
  const level = stats?.level || 0;
  const coins = stats?.coins || 0;
  const currentStreak = stats?.currentStreak || 0;
  const bestStreak = stats?.bestStreak || 0;
  const earnedBadges = stats?.badges || [];

  return (
    <SiteLayout>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <h2>Your Profile</h2>

        {/* USER INFO */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginBottom: 24,
          background: "#fff",
          padding: 20,
          borderRadius: 12,
          boxShadow: "0 8px 28px rgba(0,0,0,0.06)",
        }}>
          <img
            src={user.photoURL}
            alt="avatar"
            style={{ width: 72, height: 72, borderRadius: "50%" }}
          />
          <div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>
              {user.displayName || user.email}
            </div>
            <div style={{ color: "#666" }}>Level {level}</div>
          </div>
        </div>

        {/* STATS */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: 16,
          marginBottom: 24,
        }}>
          <StatCard label="XP" value={xp} />
          <StatCard label="Coins" value={coins} />
          <StatCard label="Current Streak" value={`${currentStreak} 🔥`} />
          <StatCard label="Best Streak" value={`${bestStreak} ⭐`} />
        </div>

        {/* BADGES */}
        <div>
          <h3>Badges</h3>
          {earnedBadges.length === 0 ? (
            <div>No badges yet — keep playing!</div>
          ) : (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
              gap: 16,
              marginTop: 12,
            }}>
              {earnedBadges.map((id) => {
                const badge = Object.values(BADGES).find(b => b.id === id);
                if (!badge) return null;

                return (
                  <div
                    key={id}
                    style={{
                      background: "#fff",
                      padding: 16,
                      borderRadius: 12,
                      textAlign: "center",
                      boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
                    }}
                  >
                    <div style={{ fontSize: 28 }}>{badge.icon}</div>
                    <div style={{ fontWeight: 700, marginTop: 6 }}>
                      {badge.label}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </SiteLayout>
  );
}

function StatCard({ label, value }) {
  return (
    <div style={{
      background: "#fff",
      padding: 16,
      borderRadius: 12,
      textAlign: "center",
      boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
    }}>
      <div style={{ fontSize: 14, color: "#666" }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 800, marginTop: 4 }}>
        {value}
      </div>
    </div>
  );
}