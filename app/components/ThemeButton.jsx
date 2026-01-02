"use client";

import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { useState, useEffect } from "react";
export default function ThemeButton({ children }) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);
  const toggleTheme = () => {
    // const dark = document.documentElement.classList.contains("dark");
    // setDark(dark);
    if (dark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setDark(true);
    }
  };

  return (
    <button onClick={toggleTheme}>
      {dark ? (
        <WbSunnyOutlinedIcon className="cursor-pointer" />
      ) : (
        <DarkModeIcon className="cursor-pointer" />
      )}
    </button>
  );
}
