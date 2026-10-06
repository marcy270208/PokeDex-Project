const FAVORITES_KEY = "pokedex:favorites";
const THEME_KEY = "pokedex:theme";

export function loadFavorites() {
  try {
    const parsed = JSON.parse(localStorage.getItem(FAVORITES_KEY));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveFavorites(favorites) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

export function loadTheme() {
  return localStorage.getItem(THEME_KEY) === "light" ? "light" : "dark";
}

export function saveTheme(theme) {
  localStorage.setItem(THEME_KEY, theme);
}
