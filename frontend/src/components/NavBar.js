import React from "react";
import "../styles/navbar.css";

export default function NavBar({ theme, onToggleTheme }) {
  return (
    <header className="navbar-root">
      {/* LEFT */}
      <div className="navbar-left">
        <div className="brand">
          <span className="material-symbols-outlined brand-icon">hub</span>
          <span className="brand-text">MindMap Pro</span>
        </div>
      </div>

      {/* RIGHT */}
      <div className="navbar-right">
        <div className="search-box">
          <span className="material-symbols-outlined search-icon">search</span>
          <input placeholder="Search nodes..." />
        </div>

        <button className="icon-btn" onClick={onToggleTheme}>
          <span className="material-symbols-outlined">
            {theme === "dark" ? "light_mode" : "dark_mode"}
          </span>
        </button>

        <img className="avatar" src="https://i.pravatar.cc/32" alt="user" />
      </div>
    </header>
  );
}
