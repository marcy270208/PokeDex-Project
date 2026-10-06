import { useEffect, useState } from "react";
import { Outlet, Link } from "react-router-dom";
import { playUiSound } from "../sounds.js";
import { loadTheme, saveTheme } from "../storage.js";

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="4" fill="currentColor" stroke="none" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9L17 7M7 17l-2.1 2.1" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
    </svg>
  );
}

function Layout() {
  const [theme, setTheme] = useState(loadTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    saveTheme(theme);
  }, [theme]);

  return (
    <div className="app">
      <header className="app-header">
        <Link to="/" className="app-title-link" onClick={() => playUiSound("click")}>
          <span className="pokeball" aria-hidden="true" />
          <h1>PokéDex Mini</h1>
        </Link>
        <button
          type="button"
          className="theme-toggle"
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          onClick={() => {
            playUiSound("click");
            setTheme(theme === "dark" ? "light" : "dark");
          }}
        >
          {theme === "dark" ? <SunIcon /> : <MoonIcon />}
        </button>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
