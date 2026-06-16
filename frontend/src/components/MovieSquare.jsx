import { POSTER_BASE } from "../constants";
import { formatDate, isReleased } from "../utils";

export default function MovieSquare({ movie, isOwned = false, onToggleOwn, inWatchlist = false, onToggleWatch, onSelect }) {
  return (
    <article
      className="movie-square"
      onClick={onSelect ? () => onSelect(movie) : undefined}
    >
      {movie.poster_path ? (
        <img
          className="movie-square__poster"
          src={`${POSTER_BASE}${movie.poster_path}`}
          alt={`${movie.title} poster`}
          loading="lazy"
        />
      ) : (
        <div className="movie-square__poster movie-square__poster--empty">
          No image
        </div>
      )}
      <div className="movie-square__info">
        <h3 className="movie-square__title">{movie.title}</h3>
        <p className="movie-square__date">{formatDate(movie.release_date)}</p>
        <p className="movie-square__overview">
          {movie.overview || "No overview available."}
        </p>
        <div className="movie-actions">
          {onToggleOwn && isReleased(movie) && (
            <button
              type="button"
              className={`own-button${isOwned ? " own-button--owned" : ""}`}
              aria-pressed={isOwned}
              onClick={(e) => {
                e.stopPropagation();
                onToggleOwn(movie);
              }}
            >
              {isOwned ? "✓ Owned" : "+ I own this"}
            </button>
          )}
          {onToggleWatch && (
            <button
              type="button"
              className={`watch-button${inWatchlist ? " watch-button--added" : ""}`}
              aria-pressed={inWatchlist}
              onClick={(e) => {
                e.stopPropagation();
                onToggleWatch(movie);
              }}
            >
              {inWatchlist ? "✓ Watchlist" : "+ Watchlist"}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}