import React, { useEffect, useState } from "react";
import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";

export const ThemeToggle: React.FC = () => {
  const [darkMode, setDarkMode] = useState(() => {
    return (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    );
  });

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [darkMode]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => setDarkMode(e.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return (
    <Button
      size="sm"
      variant="bordered"
      className="ml-4"
      onPress={() => setDarkMode(!darkMode)}
      style={{ height: "28px", width: "28px" }}
      title={darkMode ? "Cambiar a Modo Claro" : "Cambiar a Modo Oscuro"}
    >
      {darkMode ? (
        <Icon icon="lucide:sun" width="16" height="16" />
      ) : (
        <Icon icon="lucide:moon" width="16" height="16" />
      )}
    </Button>
  );
};
