import { useCallback, useMemo, useState, type ReactNode } from "react";
import { SoundContext } from "./useSound";
import {
  playSound,
  unlockAudio,
  type SoundName,
  type SoundOptions,
} from "../lib/sounds";

const STORAGE_KEY = "sound";

export function SoundProvider({ children }: { children: ReactNode }) {
  // Sound is opt-in: it stays off until someone turns it on.
  const [enabled, setEnabled] = useState(
    () => localStorage.getItem(STORAGE_KEY) === "on"
  );

  const play = useCallback(
    (name: SoundName, options?: SoundOptions) => {
      if (!enabled || document.hidden) return;
      playSound(name, options);
    },
    [enabled]
  );

  const toggle = useCallback(() => {
    const next = !enabled;
    localStorage.setItem(STORAGE_KEY, next ? "on" : "off");
    setEnabled(next);

    if (next) {
      unlockAudio();
      playSound("enable");
    }
  }, [enabled]);

  const value = useMemo(
    () => ({ enabled, toggle, play }),
    [enabled, toggle, play]
  );

  return (
    <SoundContext.Provider value={value}>{children}</SoundContext.Provider>
  );
}
