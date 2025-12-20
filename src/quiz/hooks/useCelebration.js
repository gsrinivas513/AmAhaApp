import { useEffect, useRef } from "react";

export function useCelebration(trigger) {
  const fired = useRef(false);

  useEffect(() => {
    if (trigger && !fired.current) {
      fired.current = true;
      setTimeout(() => {
        fired.current = false; // allow future levels
      }, 3000);
    }
  }, [trigger]);

  return trigger && !fired.current;
}