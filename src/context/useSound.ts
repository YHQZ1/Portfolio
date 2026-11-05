import { createContext, useContext } from "react";
import type { SoundName, SoundOptions } from "../lib/sounds";

export interface SoundContextValue {
  enabled: boolean;
  toggle: () => void;
  play: (name: SoundName, options?: SoundOptions) => void;
}

export const SoundContext = createContext<SoundContextValue>({
  enabled: false,
  toggle: () => {},
  play: () => {},
});

export const useSound = () => useContext(SoundContext);
