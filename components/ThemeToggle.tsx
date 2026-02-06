"use client"; 

import { useState, useEffect } from "react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Hook to sync with the system/local preference on load
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTarget = !isDark;
    setIsDark(newTarget);
    if (newTarget) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <button 
      onClick={toggleTheme}
      className="p-2 border rounded-md bg-gray-100 dark:bg-zinc-800 dark:text-white transition-all hover:scale-105"
    >
      {isDark ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
}