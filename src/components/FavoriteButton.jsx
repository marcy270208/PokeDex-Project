import { playUiSound } from "../sounds.js";

function FavoriteButton({ name, isFavorite, onToggle }) {
  const label = isFavorite
    ? `Remove ${name} from favorites`
    : `Add ${name} to favorites`;

  return (
    <button
      type="button"
      className={`favorite-button${isFavorite ? " is-favorite" : ""}`}
      aria-label={label}
      title={label}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        playUiSound(isFavorite ? "back" : "select");
        onToggle();
      }}
    >
      <span className="star" aria-hidden="true" />
    </button>
  );
}

export default FavoriteButton;
