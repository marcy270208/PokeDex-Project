const FX_TYPES = new Set([
  "fire",
  "water",
  "electric",
  "grass",
  "ice",
  "poison",
  "psychic",
  "ghost",
]);

const PARTICLES = 7;

function TypeFx({ type, big = false }) {
  if (!type) return null;

  const classes = ["fx"];
  if (FX_TYPES.has(type)) classes.push(`fx-${type}`);
  if (big) classes.push("fx-lg");

  return (
    <span className={classes.join(" ")} aria-hidden="true">
      {Array.from({ length: PARTICLES }, (_, i) => (
        <span
          key={i}
          style={{
            left: `${6 + i * 13}%`,
            animationDelay: `${(i * 0.43) % 3}s`,
            animationDuration: `${2.4 + (i % 3) * 0.7}s`,
          }}
        />
      ))}
    </span>
  );
}

export default TypeFx;
