import { POSTER_BASE } from "../constants";
import { formatDate} from "../utils";

export default function MovieCard({ movie, isOwned = false, onToggleOwn, onSelect }) {
  return (
    <article
      className="movie-card"
      onClick={onSelect ? () => onSelect(movie) : undefined}
    >
      {movie.poster_path ? (
        <img
          className="movie-poster"
          src={`${POSTER_BASE}${movie.poster_path}`}
          alt={`${movie.title} poster`}
          loading="lazy"
        />
      ) : (
        <div className="movie-poster movie-poster--empty">No image</div>
      )}
      <div className="movie-info">
        <h3 className="movie-title">{movie.title}</h3>
        <p className="movie-date">{formatDate(movie.release_date)}</p>
        <p className="movie-overview">
          {movie.overview || 'No overview available.'}
        </p>
        {onToggleOwn && (
          <button
            type="button"
            className={`own-button${isOwned ? ' own-button--owned' : ''}`}
            aria-pressed={isOwned}
            onClick={(e) => {
              e.stopPropagation();
              onToggleOwn(movie);
            }}
          >
            {isOwned ? '✓ Owned' : '+ I own this'}
          </button>
        )}
      </div>
    </article>
  );
}
