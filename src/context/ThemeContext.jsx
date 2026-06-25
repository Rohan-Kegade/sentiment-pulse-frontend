import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext({ theme: "Light", setTheme: () => {} });

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("sp-theme") ?? "Light"
  );

  useEffect(() => {
    localStorage.setItem("sp-theme", theme);
    const root = document.documentElement;

    if (theme === "Dark") {
      root.classList.add("dark");
      return;
    }

    if (theme === "Light") {
      root.classList.remove("dark");
      return;
    }

    // System — follow prefers-color-scheme
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    root.classList.toggle("dark", mq.matches);
    const handler = (e) => root.classList.toggle("dark", e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
