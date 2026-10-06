import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../config.js";
import { getIdFromUrl, capitalize, getSpriteUrl } from "../utils.js";
import { playCry, playUiSound } from "../sounds.js";
import TypeFx from "./TypeFx.jsx";
import FavoriteButton from "./FavoriteButton.jsx";

function PokemonList({ entries: providedEntries, favorites = [], onToggleFavorite }) {
  const [entries, setEntries] = useState(providedEntries ?? null);
  const [types, setTypes] = useState({});
  const [isLoading, setIsLoading] = useState(!providedEntries);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (providedEntries) return undefined;

    async function loadPokemons() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_BASE_URL}/pokemon?limit=20`);

        if (!response.ok) {
          throw new Error(`Server responded with status ${response.status}`);
        }

        const data = await response.json();
        setEntries(
          data.results.map((pokemon) => ({
            id: getIdFromUrl(pokemon.url),
            name: pokemon.name,
          }))
        );
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    loadPokemons();
  }, [providedEntries]);

  useEffect(() => {
    if (!entries || entries.length === 0) return undefined;

    let isCurrent = true;

    Promise.all(
      entries.map((entry) =>
        fetch(`${API_BASE_URL}/pokemon/${entry.id}`)
          .then((response) => (response.ok ? response.json() : null))
          .then((data) => [entry.id, data?.types?.[0]?.type?.name ?? null])
          .catch(() => [entry.id, null])
      )
    ).then((pairs) => {
      if (isCurrent) setTypes(Object.fromEntries(pairs));
    });

    return () => {
      isCurrent = false;
    };
  }, [entries]);

  if (isLoading) {
    return (
      <div className="loader">
        <span className="pokeball" aria-hidden="true" />
      </div>
    );
  }

  if (error) {
    return <p className="status status-error">Couldn't load the list: {error}</p>;
  }

  return (
    <ul className="pokemon-grid">
      {entries.map((entry, index) => (
        <li
          key={entry.id}
          className="pokemon-card"
          style={{ animationDelay: `${index * 45}ms` }}
        >
          <Link
            to={`/pokemon/${entry.name}`}
            className="pokemon-link"
            onClick={() => {
              playUiSound("select");
              playCry(entry.id);
            }}
          >
            <TypeFx type={types[entry.id]} />
            <img
              className="pokemon-sprite"
              src={getSpriteUrl(entry.id)}
              alt={entry.name}
              width={96}
              height={96}
              style={{ animationDelay: `${index * 90}ms` }}
            />
            <span className="pokemon-id">#{entry.id.padStart(3, "0")}</span>
            <span className="pokemon-name">{capitalize(entry.name)}</span>
          </Link>
          <FavoriteButton
            name={entry.name}
            isFavorite={favorites.some((f) => f.id === entry.id)}
            onToggle={() => onToggleFavorite(entry)}
          />
        </li>
      ))}
    </ul>
  );
}

export default PokemonList;
