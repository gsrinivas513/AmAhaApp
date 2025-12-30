import React, { useEffect, useState } from "react";
import SiteLayout from "../layouts/SiteLayout";
import { useAuth } from "../components/AuthProvider";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { BADGES } from "../config/badges";
import { HeroSection, StatsSection } from "../design/DesignSystem";

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
      <HeroSection
        title="👤 Your Profile"
        subtitle="Track your progress and celebrate your achievements"
        backgroundGradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      />

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 20px" }}>
        {/* USER INFO */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginBottom: 24,
          background: "white",
          padding: 24,
          borderRadius: 16,
          boxShadow: "0 8px 28px rgba(0,0,0,0.08)",
        }}>
          <img
            src={user.photoURL}
            alt="avatar"
            style={{ width: 100, height: 100, borderRadius: "50%", border: "4px solid #667eea" }}
          />
          <div>
            <div style={{ fontSize: 24, fontWeight: 700, color: "#1f2937" }}>
              {user.displayName || user.email}
            </div>
            <div style={{ fontSize: 16, color: "#6b7280", marginTop: 4 }}>Level {level} 🌟</div>
          </div>
        </div>

        {/* STATS USING DESIGN SYSTEM */}
        <StatsSection stats={[
          { value: `${xp}`, label: "Total XP" },
          { value: `${coins}`, label: "Coins 🪙" },
          { value: `${currentStreak}`, label: "Current Streak 🔥" },
          { value: `${bestStreak}`, label: "Best Streak ⭐" }
        ]} />

        {/* BADGES */}
        <div style={{ marginTop: 40 }}>
          <h3 style={{ fontSize: "1.8rem", fontWeight: 700, marginBottom: 24, color: "#1f2937" }}>
            🏅 Your Badges
          </h3>
          {earnedBadges.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '40px 20px',
              color: '#6b7280',
              fontSize: '1.1rem'
            }}>
              No badges yet — keep playing to earn them! 🚀
            </div>
          ) : (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
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
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      color: "white",
                      padding: 20,
                      borderRadius: 12,
                      textAlign: "center",
                      boxShadow: "0 8px 24px rgba(102, 126, 234, 0.3)",
                      transition: 'all 0.3s ease',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 12px 32px rgba(102, 126, 234, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(102, 126, 234, 0.3)';
                    }}
                  >
                    <div style={{ fontSize: 40, marginBottom: 8 }}>{badge.icon}</div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>
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