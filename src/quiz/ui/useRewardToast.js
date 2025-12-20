import { useState } from "react";

export function useRewardToast() {
  const [reward, setReward] = useState(null);

  const showReward = ({ xp, coins }) => {
    setReward({ xp, coins });
    setTimeout(() => setReward(null), 2200);
  };

  return {
    reward,
    showReward,
  };
}