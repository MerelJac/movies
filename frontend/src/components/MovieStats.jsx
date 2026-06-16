import { computeOwnedStats } from "../utils";

// Summary panel for the "Your Movies" tab. Renders nothing when the owned
// list is empty.
export default function MovieStats({
  movies,
  genres,
  activeGenre = null,
  onSelectGenre,
}) {
  const stats = computeOwnedStats(movies, genres);
  if (!stats) return null;

  const { count, averageRating, topGenres, earliestYear, latestYear } = stats;
  const yearRange =
    earliestYear && latestYear
      ? earliestYear === latestYear
        ? `${earliestYear}`
        : `${earliestYear}–${latestYear}`
      : "—";

  return (
    <section className="movie-stats" aria-label="Your movie stats">
      <div className="movie-stats__cards">
        <div className="movie-stats__card">
          <span className="movie-stats__value">{count}</span>
          <span className="movie-stats__label">Movies owned</span>
        </div>
        <div className="movie-stats__card">
          <span className="movie-stats__value">
            {averageRating !== null ? averageRating.toFixed(1) : "—"}
          </span>
          <span className="movie-stats__label">Avg. rating</span>
        </div>
        <div className="movie-stats__card">
          <span className="movie-stats__value">{yearRange}</span>
          <span className="movie-stats__label">Release years</span>
        </div>
      </div>

      {topGenres.length > 0 && (
        <div className="movie-stats__genres">
          {topGenres.map((genre) => {
            const active = activeGenre === genre.name;
            return (
              <button
                key={genre.name}
                type="button"
                className={`movie-stats__genre${
                  active ? " movie-stats__genre--active" : ""
                }`}
                aria-pressed={active}
                onClick={() => onSelectGenre?.(genre.name)}
              >
                {genre.name}
                <span className="movie-stats__genre-count">{genre.count}</span>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}
