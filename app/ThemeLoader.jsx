"use client";

import { useEffect } from "react";

export default function ThemeLoader() {
  useEffect(() => {
    const saved = localStorage.getItem("theme");

    if (saved === "dark") {
      document.documentElement.classList.add("dark");
    }
  }, []);

  return null;
}
