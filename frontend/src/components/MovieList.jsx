import MovieCard from './MovieCard.jsx';

// Requirement: show at most the first 10 results.
const MAX_RESULTS = 10;

export default function MovieList({ movies, ownedIds, onToggleOwn, limit = MAX_RESULTS }) {
  return (
    <div className="movie-list">
      {movies.slice(0, limit).map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          isOwned={ownedIds?.has(movie.id) ?? false}
          onToggleOwn={onToggleOwn}
        />
      ))}
    </div>
  );
}
