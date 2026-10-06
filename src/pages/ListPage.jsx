import { useState } from "react";
import SearchForm from "../components/SearchForm.jsx";
import PokemonList from "../components/PokemonList.jsx";
import { loadFavorites, saveFavorites } from "../storage.js";
import { playUiSound } from "../sounds.js";

function ListPage() {
  const [favorites, setFavorites] = useState(loadFavorites);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  function toggleFavorite(entry) {
    setFavorites((prev) => {
      const next = prev.some((f) => f.id === entry.id)
        ? prev.filter((f) => f.id !== entry.id)
        : [...prev, entry];
      saveFavorites(next);
      return next;
    });
  }

  return (
    <>
      <SearchForm />
      <div className="list-toolbar">
        <button
          type="button"
          className={`filter-button${showFavoritesOnly ? " is-active" : ""}`}
          onClick={() => {
            playUiSound("click");
            setShowFavoritesOnly((value) => !value);
          }}
        >
          <span className="star" aria-hidden="true" />
          Favorites ({favorites.length})
        </button>
      </div>
      {showFavoritesOnly ? (
        favorites.length === 0 ? (
          <p className="status">No favorites yet — tap the star on a Pokémon card.</p>
        ) : (
          <PokemonList
            key="favorites"
            entries={favorites}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
          />
        )
      ) : (
        <PokemonList
          key="all"
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
        />
      )}
    </>
  );
}

export default ListPage;
