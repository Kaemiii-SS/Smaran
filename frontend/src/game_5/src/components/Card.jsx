import { cn } from "../lib/utils";
import "./Card.css";
function Card({
  flipped,
  matched,
  value,
  isEmpty,
  offset,
  onClick,
  disabled = false,
  mismatched = false
}) {
  if (isEmpty) {
    return <div className="invisible aspect-square w-full" />;
  }
  const isRevealed = flipped || matched;
  return <div
    className={cn(
      "flip-card",
      disabled ? "cursor-not-allowed" : "cursor-pointer"
    )}
    style={{
      transform: offset ? `translate(${offset.x}px, ${offset.y}px) rotate(${offset.r}deg)` : void 0
    }}
    onClick={disabled ? void 0 : onClick}
  >
      <div className={cn("flip-card-inner", isRevealed && "flipped")}>
        {
    /* FRONT — shown when card is face-down */
  }
        <div className="flip-card-front">
          <div className="card-pattern">
            <span className="card-question">?</span>
          </div>
        </div>

        {
    /* BACK — shown when card is flipped / matched */
  }
        <div
    className={cn(
      "flip-card-back",
      matched && "matched",
      mismatched && "mismatched"
    )}
  >
          {typeof value === "string" && value.startsWith("/") ? <img
    src={value}
    alt="animal card"
    className="card-animal-img"
    draggable={false}
  /> : <span className="card-emoji">{value}</span>}

          {matched && <span className="card-match-badge">🌱</span>}
        </div>
      </div>
    </div>;
}
export {
  Card
};
