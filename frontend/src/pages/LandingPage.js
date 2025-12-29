import React, { useState } from "react";
import NavBar from "../components/NavBar";
import MindMapView from "./MindMapView";

export default function LandingPage() {
  const [theme, setTheme] = useState("dark");

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
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
