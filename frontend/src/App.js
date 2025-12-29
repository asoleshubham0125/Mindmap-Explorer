import React, { useState, useEffect } from "react";
import NavBar from "./components/NavBar";
import MindMapView from "./pages/MindMapView";

export default function App() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  };

  return (
    <div className={`app-container ${theme}`}>
      <NavBar theme={theme} onToggleTheme={toggleTheme} />
      <div className="main-content">
        <MindMapView />
      </div>
    </div>
  );
}
