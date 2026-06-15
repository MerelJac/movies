// TMDB returns relative image paths; prefix with the image CDN + a size.
// See https://developer.themoviedb.org/docs/image-basics
const POSTER_BASE = 'https://image.tmdb.org/t/p/w342';

function formatDate(release) {
  if (!release) return 'Release date unknown';
  // TMDB gives YYYY-MM-DD; render it in the user's locale.
  const date = new Date(release);
  return Number.isNaN(date.getTime())
    ? release
    : date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
}

export default function MovieCard({ movie }) {
  return (
    <article className="movie-card">
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
      </div>
    </article>
  );
}
