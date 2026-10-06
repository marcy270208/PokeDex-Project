import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { API_BASE_URL } from "../config.js";
import { capitalize, getIdFromUrl, getSpriteUrl, TYPE_COLORS } from "../utils.js";
import { playCry, playUiSound } from "../sounds.js";
import { loadFavorites, saveFavorites } from "../storage.js";
import TypeFx from "../components/TypeFx.jsx";
import FavoriteButton from "../components/FavoriteButton.jsx";

function parseChain(node) {
  return {
    id: getIdFromUrl(node.species.url),
    name: node.species.name,
    children: node.evolves_to.map(parseChain),
  };
}

function ChainNode({ node, currentName }) {
  return (
    <div className="chain-node">
      <Link
        to={`/pokemon/${node.name}`}
        className={`chain-link${node.name === currentName ? " is-current" : ""}`}
        onClick={() => playUiSound("click")}
      >
        <img src={getSpriteUrl(node.id)} alt={node.name} width={56} height={56} />
        <span>{node.name}</span>
      </Link>
      {node.children.length > 0 && (
        <div className="chain-children">
          {node.children.map((child) => (
            <div className="chain-branch" key={child.id}>
              <span className="chain-arrow" aria-hidden="true" />
              <ChainNode node={child} currentName={currentName} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function DetailPage() {
  const { name } = useParams();
  const [pokemon, setPokemon] = useState(null);
  const [chain, setChain] = useState(null);
  const [favorites, setFavorites] = useState(loadFavorites);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isCurrent = true;

    async function loadPokemon() {
      setIsLoading(true);
      setError(null);
      setPokemon(null);
      setChain(null);

      try {
        const response = await fetch(`${API_BASE_URL}/pokemon/${name}`);

        if (!response.ok) {
          throw new Error(`No Pokémon named "${name}" — check the spelling.`);
        }

        const data = await response.json();

        let nextChain = null;
        try {
          const speciesResponse = await fetch(data.species.url);
          const species = await speciesResponse.json();
          const chainResponse = await fetch(species.evolution_chain.url);
          const chainData = await chainResponse.json();
          nextChain = parseChain(chainData.chain);
        } catch {
          nextChain = null;
        }

        if (isCurrent) {
          setPokemon(data);
          setChain(nextChain);
          playCry(String(data.id));
        }
      } catch (err) {
        if (isCurrent) {
          setError(err.message);
        }
      } finally {
        if (isCurrent) {
          setIsLoading(false);
        }
      }
    }

    loadPokemon();

    return () => {
      isCurrent = false;
    };
  }, [name]);

  function toggleFavorite() {
    const entry = { id: String(pokemon.id), name: pokemon.name };
    setFavorites((prev) => {
      const next = prev.some((f) => f.id === entry.id)
        ? prev.filter((f) => f.id !== entry.id)
        : [...prev, entry];
      saveFavorites(next);
      return next;
    });
  }

  if (isLoading) {
    return (
      <div className="loader">
        <span className="pokeball" aria-hidden="true" />
      </div>
    );
  }

  if (error) return <p className="status status-error">{error}</p>;

  const pokemonId = String(pokemon.id);

  return (
    <div className="detail-page">
      <Link to="/" className="back-link" onClick={() => playUiSound("back")}>
        ← Back to list
      </Link>
      <div className="detail-stage">
        <TypeFx type={pokemon.types[0]?.type.name} big />
        <img
          className="detail-artwork"
          src={pokemon.sprites.other["official-artwork"].front_default}
          alt={pokemon.name}
          width={230}
          height={230}
          onClick={() => playCry(pokemonId)}
        />
      </div>
      <div className="detail-title">
        <h2>{capitalize(pokemon.name)}</h2>
        <FavoriteButton
          name={pokemon.name}
          isFavorite={favorites.some((f) => f.id === pokemonId)}
          onToggle={toggleFavorite}
        />
      </div>
      <p className="type-badges">
        {pokemon.types.map((t) => (
          <span
            key={t.type.name}
            className="type-badge"
            style={{ "--tc": TYPE_COLORS[t.type.name] ?? "#888888" }}
          >
            {t.type.name}
          </span>
        ))}
      </p>
      <button
        type="button"
        className="cry-button"
        onClick={() => {
          playUiSound("click");
          playCry(pokemonId);
        }}
      >
        Play cry
      </button>
      <ul className="stat-list">
        {pokemon.stats.map((s, index) => (
          <li key={s.stat.name}>
            <span className="stat-name">{s.stat.name}</span>
            <span className="stat-value">{s.base_stat}</span>
            <span className="stat-bar">
              <span
                className="stat-fill"
                style={{
                  width: `${Math.min(s.base_stat, 160) / 1.6}%`,
                  animationDelay: `${index * 90}ms`,
                }}
              />
            </span>
          </li>
        ))}
      </ul>
      {chain && (
        <section className="evolution">
          <h3>Evolution</h3>
          <div className="chain">
            <ChainNode node={chain} currentName={pokemon.name} />
          </div>
        </section>
      )}
    </div>
  );
}

export default DetailPage;
