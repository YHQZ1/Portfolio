import { createContext, useContext } from "react";

export interface ThemeContextValue {
  darkMode: boolean;
  toggleTheme: (origin?: Element | null) => void;
}

export const ThemeContext = createContext<ThemeContextValue>({
  darkMode: false,
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);
