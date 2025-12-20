// src/quiz/services/guestProgressService.js

const KEY = "guest_progress_v1";

/*
Structure (EXTENDED but backward compatible):
{
  [category]: {
    [difficulty]: {
      highestLevel: number,
      xp: number,
      coins: number
    }
  }
}
*/

export function getGuestProgress() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/* ---------------- SAVE LEVEL COMPLETE ---------------- */
export function saveGuestLevel({
  category,
  difficulty,
  level,
  xpEarned = 0,
  coinsEarned = 0,
}) {
  const data = getGuestProgress();

  const prev =
    data?.[category]?.[difficulty];

  // 🛡️ Backward compatibility
  let prevHighest = 0;
  let prevXp = 0;
  let prevCoins = 0;

  if (typeof prev === "number") {
    prevHighest = prev;
  } else if (prev) {
    prevHighest = prev.highestLevel || 0;
    prevXp = prev.xp || 0;
    prevCoins = prev.coins || 0;
  }

  const nextHighest = Math.max(prevHighest, level);

  data[category] = {
    ...(data[category] || {}),
    [difficulty]: {
      highestLevel: nextHighest,
      xp: prevXp + xpEarned,
      coins: prevCoins + coinsEarned,
    },
  };

  localStorage.setItem(KEY, JSON.stringify(data));
}

/* ---------------- GET HIGHEST LEVEL ---------------- */
export function getGuestHighestLevel(category, difficulty) {
  const data = getGuestProgress();
  const entry = data?.[category]?.[difficulty];

  if (typeof entry === "number") return entry;
  if (entry?.highestLevel) return entry.highestLevel;

  return 0;
}

/* ---------------- CLEAR ---------------- */
export function clearGuestProgress() {
  localStorage.removeItem(KEY);
}