import React, { createContext, useContext, useState } from "react";

const AdUnlockContext = createContext();

export function AdUnlockProvider({ children }) {
  const [unlocked, setUnlocked] = useState(false);

  function unlockWithAd() {
    // simulate rewarded ad completion
    setUnlocked(true);
  }

  function resetUnlock() {
    setUnlocked(false);
  }

  return (
    <AdUnlockContext.Provider
      value={{ unlocked, unlockWithAd, resetUnlock }}
    >
      {children}
    </AdUnlockContext.Provider>
  );
}

export function useAdUnlock() {
  return useContext(AdUnlockContext);
}