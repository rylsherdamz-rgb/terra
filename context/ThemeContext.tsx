import { createContext, useContext, useState } from "react";
import { useColorScheme, ColorSchemeName } from "react-native";

export type ThemeModeType = "light" | "dark";

type ThemeContextType = {
  mode : ThemeModeType,
  color : typeof Colors.dark | typeof Colors.light
  toggleTheme : () => void
}


export const Colors = {
  light: {
    background: "#F8FAFC",
    surface: "#FFFFFF",
    text: "#0F172A",
    textMuted: "#64748B",
    primary: "#4F46E5",
    border: "#E2E8F0",
  },

  dark: {
    background: "#0B1220",
    surface: "#111827",
    text: "#F9FAFB",
    textMuted: "#94A3B8",
    primary: "#6366F1",
    border: "#263041",
  },
} as const;



const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ColorThemeProvider({children} : {children : React.ReactNode}) {
  const system = useColorScheme()
  const [mode, setMode] = useState<ThemeModeType>(system === "dark" ? "dark" : "light")

  const toggleTheme = () => {
    setMode((prev) => prev === "dark" ? "light" : "dark" )
  }
  return <ThemeContext.Provider value={{mode,  color : Colors[mode], toggleTheme,}}>
   {children} 
  </ThemeContext.Provider>
}


export default function useTheme() {
  const context = useContext(ThemeContext);
  if (!context)  throw Error("No Context")
  const {color, toggleTheme, mode} = context

  return { mode, color, toggleTheme}

}